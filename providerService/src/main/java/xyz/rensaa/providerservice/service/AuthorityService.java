package xyz.rensaa.providerservice.service;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.rensaa.providerservice.AuthorityManager;
import xyz.rensaa.providerservice.contracts.CAuthorityManagerFactory;
import xyz.rensaa.providerservice.dto.Authority.ImmutableProposalMessage;
import xyz.rensaa.providerservice.dto.Authority.ProposalMessage;
import xyz.rensaa.providerservice.exceptions.TransactionFailedException;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Service
public class AuthorityService {

  @Autowired
  private AuthorityManager defaultAuthorityManager;

  @Autowired
  private CAuthorityManagerFactory CAuthorityManagerFactory;

  @Autowired
  private Logger logger;


  public boolean isAuthorized(final String address) {
    try {
      return defaultAuthorityManager.isAuthorized(address).send();
    } catch (final Exception e) {
      logger.error("Could not process Authority.isAuthorized transaction", e);
    }
    return false;
  }

  public List<String> getAuthorities() {
    try {
      return defaultAuthorityManager.getAuthorities().send();
    } catch (final Exception e) {
      logger.error("Could not fetch authorities", e);
      throw new TransactionFailedException();
    }
  }

  public List<ProposalMessage> getProposals() {
    final var proposals = new ArrayList<ProposalMessage>();
    try {
      final int numProposals = defaultAuthorityManager.getProposalCount().send().intValue();
      for (int i = 1; i <= numProposals; i++) {
        final var proposal = defaultAuthorityManager.getProposal(BigInteger.valueOf(i)).send();

        //If the proposal is active, we return it.
        if (proposal.component4()) {
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
    } catch (final Exception e) {
      logger.error("Could not get number of proposals");
      throw new TransactionFailedException();
    }
    return proposals;
  }

  public boolean proposeAuthority(final ProposalMessage propsal, final String privateKey) {
    try {
      CAuthorityManagerFactory
          .fromPrivateKey(privateKey)
          .propose(BigInteger.valueOf(propsal.proposalType().longValue()), propsal.subject()).send();
      return true;
    } catch (final Exception e) {
      logger.error("Count not send proposal", e);
      throw new TransactionFailedException();
    }
  }

  public ProposalMessage getProposal(final int id) {
    try {
      final var response = defaultAuthorityManager.getProposal(BigInteger.valueOf(id)).send();
      if (response.component4()) {
        return ImmutableProposalMessage.builder()
            .id(id)
            .proposalType(response.component1().intValue())
            .subject(response.component2())
            .voters(response.component3())
            .proposer(response.component3().get(0))
            .isActive(response.component4())
            .build();
      }
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException();
    }

    return null;

  }

  public boolean voteOnProposal(final int proposalId, final String privateKey) {
    try {
      CAuthorityManagerFactory
          .fromPrivateKey(privateKey)
          .voteOnProposal(BigInteger.valueOf(proposalId)).send();
      return true;
    } catch (final Exception e) {
      logger.error("Count not vote on proposal", e);
      throw new TransactionFailedException();
    }
  }

  public boolean enactProposal(final int proposalId, final String privateKey) {
    try {
      CAuthorityManagerFactory
          .fromPrivateKey(privateKey)
          .enactProposal(BigInteger.valueOf(proposalId)).send();
      return true;
    } catch (final Exception e) {
      logger.error("Count not enact proposal", e);
      throw new TransactionFailedException();
    }
  }

}
