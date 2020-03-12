package xyz.rensaa.providerservice.service.events;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.datatypes.Event;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.Log;
import xyz.rensaa.providerservice.LicenseProvider;
import xyz.rensaa.providerservice.model.LicenseIsserMoveProposal;
import xyz.rensaa.providerservice.model.LicenseProviderMoveProposal;
import xyz.rensaa.providerservice.repository.LicenseIssuerMoveProposalRepository;
import xyz.rensaa.providerservice.repository.ProviderMoveProposalRepository;

import javax.annotation.PostConstruct;

@Service
public class LicenseEventsService {

  private final static Event providerMoveProposedEvent = LicenseProvider.PROVIDERMOVEPROPOSALADDED_EVENT;
  private final static Event providerMoveApprovedEvent = LicenseProvider.PROVIDERMOVEAPPROVED_EVENT;
  private final static Event issuerMoveProposedEvent = LicenseProvider.ISSUERMOVEPROPOSALADDED_EVENT;
  private final static Event issuerMoveApprovedEvent = LicenseProvider.ISSUERMOVEAPPROVED_EVENT;
  private final static String encodedProviderMoveProposedEvent = EventEncoder.encode(providerMoveProposedEvent);
  private final static String encodedProviderMoveApprovedEvent = EventEncoder.encode(providerMoveApprovedEvent);
  private final static String encodedIssuerMoveProposedEvent = EventEncoder.encode(issuerMoveProposedEvent);
  private final static String encodedIssuerMoveApprovedEvent = EventEncoder.encode(issuerMoveApprovedEvent);

  @Autowired
  LicenseProvider licenseProvider;

  @Autowired
  Web3j web3j;

  @Autowired
  ProviderMoveProposalRepository providerMoveProposalRepository;

  @Autowired
  LicenseIssuerMoveProposalRepository licenseIssuerMoveProposalRepository;

  private static void handleProviderMoveEventLog(final Log log) {
    final var parameters = LicenseProvider.staticExtractEventParameters(providerMoveProposedEvent, log);
    final var typedResponse = new LicenseProvider.ProviderMoveProposalAddedEventResponse();
    typedResponse.log = log;
    typedResponse._license = (String) parameters.getNonIndexedValues().get(0).getValue();
    typedResponse._provider = (String) parameters.getNonIndexedValues().get(1).getValue();
  }


  @PostConstruct
  void materializeLicenseProposals() {
    final EthFilter filter = new EthFilter(
        DefaultBlockParameterName.EARLIEST,
        DefaultBlockParameterName.LATEST,
        licenseProvider.getContractAddress()
    );


    filter.addOptionalTopics(
        encodedProviderMoveProposedEvent,
        encodedProviderMoveApprovedEvent,
        encodedIssuerMoveProposedEvent,
        encodedIssuerMoveApprovedEvent
    );


    web3j.ethLogFlowable(filter).forEach(log -> {

      final var transactionReciept = web3j
          .ethGetTransactionReceipt(log.getTransactionHash()).send()
          .getTransactionReceipt();

      if (transactionReciept.isPresent()) {
        if (log.getTopics().contains(encodedProviderMoveProposedEvent)) {
          final var event = licenseProvider.getProviderMoveProposalAddedEvents(
                  transactionReciept.get()
          ).get(0);
          var proposal = new LicenseProviderMoveProposal(event._license, event._provider);
          providerMoveProposalRepository.save(proposal);
        }

        if (log.getTopics().contains(encodedIssuerMoveProposedEvent)) {
          final var event = licenseProvider.getIssuerMoveProposalAddedEvents(
                  transactionReciept.get()
          ).get(0);
          var proposal = new LicenseIsserMoveProposal(event._license, event._issuer);
          licenseIssuerMoveProposalRepository.save(proposal);
        }
      }
    });
  }
}
