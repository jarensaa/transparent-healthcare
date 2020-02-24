package xyz.rensaa.providerservice.service.events;

import io.reactivex.disposables.Disposable;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.web3j.protocol.core.DefaultBlockParameterName;
import xyz.rensaa.providerservice.AuthorityManager;
import xyz.rensaa.providerservice.dto.ImmutableProposalMessage;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Service
public class AuthorityEventService {

  @Autowired
  AuthorityManager authorityManager;

  @Autowired
  Logger logger;

  @Autowired
  SimpMessagingTemplate webSocketMessaging;

  private Disposable proposalEventSubscription;

  @PostConstruct
  public void initProposalEventListener() {
    logger.info("Initialized proposal event listener");
    proposalEventSubscription = authorityManager.proposalEventEventFlowable(
        DefaultBlockParameterName.EARLIEST,
        DefaultBlockParameterName.LATEST)
        .subscribe(
            proposalEventEventResponse -> {
              logger.info(
                "New proposal event: id:{},proposer:{}, subject:{}, type:{}",
                proposalEventEventResponse._proposalID,
                proposalEventEventResponse._proposer,
                proposalEventEventResponse._proposalSubject,
                proposalEventEventResponse._proposalType);

              webSocketMessaging.convertAndSend("/authority/proposal",
                  ImmutableProposalMessage.builder()
                      .proposer(proposalEventEventResponse._proposer)
                      .subject(proposalEventEventResponse._proposalSubject)
                      .id(proposalEventEventResponse._proposalID.intValue())
                      .proposalType(proposalEventEventResponse._proposalType.intValue())
                      .build());
            },
            throwable -> logger.error("Failed to get proposalEvent ", throwable));
  }

  @PreDestroy
  public void cleanup() {
    if (proposalEventSubscription != null && !proposalEventSubscription.isDisposed()) {
      proposalEventSubscription.dispose();
    }
  }
}
