package xyz.rensaa.providerservice.service.events;

import io.reactivex.disposables.Disposable;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.web3j.protocol.core.DefaultBlockParameterName;
import xyz.rensaa.providerservice.TreatmentProvider;
import xyz.rensaa.providerservice.dto.ImmutableTreatmentProviderMessage;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.ArrayList;
import java.util.List;

@Service
public class TreatmentProviderEventService {

  private final List<Disposable> subscriptions = new ArrayList<>();
  private final String basePath = "/treatmentprovider";

  @Autowired
  Logger logger;

  @Autowired
  SimpMessagingTemplate webSocketMessaging;

  @Autowired
  TreatmentProvider defaultTreatmentProvider;

  @PostConstruct
  public void initProposalEventListener() {
    logger.info("Initialized proposal event listener");

    subscriptions.add(
        defaultTreatmentProvider.newTreatmentProviderEventEventFlowable(
            DefaultBlockParameterName.LATEST,
            DefaultBlockParameterName.LATEST
        ).subscribe(newTreatmentProviderEventEventResponse -> {
          logger.info("New treatment provider registered");
          webSocketMessaging.convertAndSend(basePath + "/new",
              ImmutableTreatmentProviderMessage.builder()
                  .address(newTreatmentProviderEventEventResponse._provider)
                  .build()
          );
        })
    );

    subscriptions.add(
        defaultTreatmentProvider.removedTreatmentProviderEventEventFlowable(
            DefaultBlockParameterName.LATEST,
            DefaultBlockParameterName.LATEST
        ).subscribe(removedTreatmentProviderEventEventResponse -> {
          logger.info("Removed treatment provider");
          webSocketMessaging.convertAndSend(basePath + "/removed",
              ImmutableTreatmentProviderMessage.builder()
                  .address(removedTreatmentProviderEventEventResponse._provider)
                  .build()
          );
        })
    );

    subscriptions.add(
        defaultTreatmentProvider.treatmentProviderTrustAddedEventFlowable(
            DefaultBlockParameterName.LATEST,
            DefaultBlockParameterName.LATEST
        ).subscribe(treatmentProviderTrustAddedEventResponse -> {
          logger.info("Trust in treatment provider added");
          webSocketMessaging.convertAndSend(basePath + "/trust/new",
              ImmutableTreatmentProviderMessage.builder()
                  .address(treatmentProviderTrustAddedEventResponse._provider)
                  .trustees(List.of(treatmentProviderTrustAddedEventResponse._authority))
                  .build()
          );
        })
    );

    subscriptions.add(
        defaultTreatmentProvider.treatmentProviderTrustRemovedEventFlowable(
            DefaultBlockParameterName.LATEST,
            DefaultBlockParameterName.LATEST
        ).subscribe(treatmentProviderTrustAddedEventResponse -> {
          logger.info("Trust in treatment provider removed");
          webSocketMessaging.convertAndSend(basePath + "/trust/removed",
              ImmutableTreatmentProviderMessage.builder()
                  .address(treatmentProviderTrustAddedEventResponse._provider)
                  .trustees(List.of(treatmentProviderTrustAddedEventResponse._authority))
                  .build()
          );
        })
    );
  }

  @PreDestroy
  public void cleanup() {
    for (final var subscription : subscriptions) {
      subscription.dispose();
    }
  }
}
