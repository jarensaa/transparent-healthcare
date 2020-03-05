package xyz.rensaa.providerservice.service;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.rensaa.providerservice.AuthorityManager;
import xyz.rensaa.providerservice.contracts.AuthorityManagerFactory;
import xyz.rensaa.providerservice.dto.Authority.ImmutableProposalMessage;
import xyz.rensaa.providerservice.dto.Authority.ProposalMessage;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Service
public class AuthorityService {

  @Autowired
  private AuthorityManager defaultAuthorityManager;

  @Autowired
  private AuthorityManagerFactory authorityManagerFactory;

  @Autowired
  private Logger logger;


  public boolean isAuthorized(String address) {
    try {
      return defaultAuthorityManager.isAuthorized(address).send();
    } catch (Exception e) {
      logger.error("Could not process Authority.isAuthorized transaction", e);
    }
    return false;
  }

  public List<String> getAuthorities() {
    try {
      return defaultAuthorityManager.getAuthorities().send();
    } catch (Exception e) {
      logger.error("Could not fetch authorities", e);
    }
    return List.of();
  }

  public List<ProposalMessage> getProposals() {
    var proposals = new ArrayList<ProposalMessage>();
    try {
      int numProposals = defaultAuthorityManager.getProposalCount().send().intValue();
      for (int i = 1; i <= numProposals; i++) {
        var proposal = defaultAuthorityManager.getProposal(BigInteger.valueOf(i)).send();

        //If the proposal is active, we return it.
        if(proposal.component4()) {
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

      }
    } catch (Exception e) {
      logger.error("Could not get number of proposals");
    }
    return proposals;
  }

  public boolean proposeAuthority(ProposalMessage propsal, String privateKey) {
    try {
      authorityManagerFactory
          .fromPrivateKey(privateKey)
          .propose(BigInteger.valueOf(propsal.proposalType().longValue()), propsal.subject()).send();
      return true;
    } catch (Exception e) {
      logger.error("Count not send proposal", e);
    }

    return propsal.id().isEmpty();
  }

  public ProposalMessage getProposal(int id) throws Exception {
    var response = defaultAuthorityManager.getProposal(BigInteger.valueOf(id)).send();

    if(response.component4()) {
      return ImmutableProposalMessage.builder()
          .id(id)
          .proposalType(response.component1().intValue())
          .subject(response.component2())
          .voters(response.component3())
          .proposer(response.component3().get(0))
          .isActive(response.component4())
          .build();
    }
    return null;

  }

  public boolean voteOnProposal(int proposalId, String privateKey) {
    try {
      authorityManagerFactory
          .fromPrivateKey(privateKey)
          .voteOnProposal(BigInteger.valueOf(proposalId)).send();
    } catch (Exception e) {
      logger.error("Count not vote on proposal", e);
    }
    return true;
  }

  public boolean enactProposal(int proposalId, String privateKey)  {
    try {
      authorityManagerFactory
          .fromPrivateKey(privateKey)
          .enactProposal(BigInteger.valueOf(proposalId)).send();
    } catch (Exception e) {
      logger.error("Count not enact proposal", e);
    }
    return true;
  }

}
