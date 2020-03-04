package xyz.rensaa.providerservice.service;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import xyz.rensaa.providerservice.AuthorityManager;
import xyz.rensaa.providerservice.dto.ImmutableProposalMessage;
import xyz.rensaa.providerservice.dto.ProposalMessage;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Service
public class AuthorityService {

  @Autowired
  private AuthorityManager authorityManager;

  @Autowired
  @Qualifier("originalCredentials")
  private List<Credentials> credentials;

  @Autowired
  private SimpMessagingTemplate template;

  @Autowired
  private Logger logger;

  public boolean isAuthorized(String address) {
    try {
      return authorityManager.isAuthorized(address).send();
    } catch (Exception e) {
      logger.error("Could not process Authority.isAuthorized transaction", e);
    }
    return false;
  }

  public List<String> getAuthorities() {
    try {
      return authorityManager.getAuthorities().send();
    } catch (Exception e) {
      logger.error("Could not fetch authorities", e);
    }
    return List.of();
  }

  public List<ProposalMessage> getProposals() {
    var proposals = new ArrayList<ProposalMessage>();
    try {
      int numProposals = authorityManager.getProposalCount().send().intValue();
      for (int i = 1; i <= numProposals; i++) {
        var proposal = authorityManager.getProposal(BigInteger.valueOf(i)).send();
        proposals.add(ImmutableProposalMessage.builder()
            .id(i)
            .proposalType(proposal.component1().intValue())
            .isActive(proposal.component4())
            .subject(proposal.component2())
            .proposer(proposal.component3().get(0))
            .voters(proposal.component3())
            .build()
        );

      }
    } catch (Exception e) {
      logger.error("Could not get number of proposals");
    }
    return proposals;
  }

  public boolean proposeAuthority(ProposalMessage propsal, String privateKey) {
    try {
      authorityManager.propose(BigInteger.valueOf(propsal.proposalType().longValue()), propsal.subject()).send();
      return true;
    } catch (Exception e) {
      logger.error("Count not send proposal", e);
    }

    return propsal.id().isEmpty();
  }

  public String getOriginalAuthorityAddress() {
    return credentials.get(0).getAddress();
  }

}
