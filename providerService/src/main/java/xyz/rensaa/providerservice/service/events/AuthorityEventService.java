package xyz.rensaa.providerservice.service.events;

import com.palantir.logsafe.SafeArg;
import io.reactivex.disposables.Disposable;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.web3j.protocol.core.DefaultBlockParameterName;
import xyz.rensaa.providerservice.AuthorityManager;
import xyz.rensaa.providerservice.dto.Authority.ImmutableProposalEnactedMessage;
import xyz.rensaa.providerservice.dto.Authority.ImmutableProposalMessage;
import xyz.rensaa.providerservice.service.AuthorityService;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.List;

@Service
public class AuthorityEventService {

  @Autowired
  AuthorityManager authorityManager;

  @Autowired
  Logger logger;

  @Autowired
  SimpMessagingTemplate webSocketMessaging;

  @Autowired
  AuthorityService authorityService;

  private Disposable proposalEventSubscription;

  @PostConstruct
  public void initProposalEventListener() {
    logger.info("Initialized proposal event listener");
    proposalEventSubscription = authorityManager.proposalEventEventFlowable(
        DefaultBlockParameterName.LATEST,
        DefaultBlockParameterName.LATEST)
        .subscribe(
            proposalEventEventResponse -> {
              logger.info(
                "New proposal event: id:{},proposer:{}, subject:{}, type:{}",
                  SafeArg.of("propsalID", proposalEventEventResponse._proposalID),
                  SafeArg.of("proposer", proposalEventEventResponse._proposer),
                  SafeArg.of("subject", proposalEventEventResponse._proposalSubject),
                  SafeArg.of("type", proposalEventEventResponse._proposalType));

              webSocketMessaging.convertAndSend("/authorities/proposal/new",
                  ImmutableProposalMessage.builder()
                      .proposer(proposalEventEventResponse._proposer)
                      .isActive(true)
                      .subject(proposalEventEventResponse._proposalSubject)
                      .id(proposalEventEventResponse._proposalID.intValue())
                      .proposalType(proposalEventEventResponse._proposalType.intValue())
                      .voters(List.of(proposalEventEventResponse._proposer))
                      .build());
            },
            throwable -> logger.error("Failed to get proposalEvent ", throwable));

    proposalEventSubscription = authorityManager.proposalVoteEventEventFlowable(
        DefaultBlockParameterName.LATEST,
        DefaultBlockParameterName.LATEST)
        .subscribe(
            proposalEventEventResponse -> {
              logger.info(
                  "New proposal vote event: id:{},voter:{}",
                  SafeArg.of("propsalID", proposalEventEventResponse._proposalID),
                  SafeArg.of("voter", proposalEventEventResponse._voter));

              var proposal = authorityService.getProposal(proposalEventEventResponse._proposalID.intValue());

              webSocketMessaging.convertAndSend("/authorities/proposal/vote", proposal);
            },

            throwable -> logger.error("Failed to get proposalVoteEvent ", throwable));

    proposalEventSubscription = authorityManager.proposalEnactedEventEventFlowable(
        DefaultBlockParameterName.LATEST,
        DefaultBlockParameterName.LATEST)
        .subscribe(
            proposalEventEventResponse -> {
              logger.info(
                  "New proposal enacted event: id:{}",
                  SafeArg.of("propsalID", proposalEventEventResponse._proposalID));

              webSocketMessaging.convertAndSend("/authorities/proposal/enacted",
                  ImmutableProposalEnactedMessage.builder()
                      .propsalId(proposalEventEventResponse._proposalID.intValue())
                      .build()
                  );
            },

            throwable -> logger.error("Failed to get proposalEnactedEvent ", throwable));
  }

  @PreDestroy
  public void cleanup() {
    if (proposalEventSubscription != null && !proposalEventSubscription.isDisposed()) {
      proposalEventSubscription.dispose();
    }
  }
}
