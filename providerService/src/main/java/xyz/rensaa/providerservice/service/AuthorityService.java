package xyz.rensaa.providerservice.service;

import io.reactivex.disposables.Disposable;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.request.EthFilter;
import xyz.rensaa.providerservice.AuthorityManager;
import xyz.rensaa.providerservice.dto.ProposalMessage;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.math.BigInteger;
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
      var response = authorityManager.isAuthorized(address).send();
      return true;
    } catch (Exception e) {
      logger.error("Could not process Authority.isAuthorized transaction", e);
    }
    return false;
  }

  public List<String> getAuthorities() {
    try {
      template.convertAndSend("/topic/greetings", "hello authority");
      return null; // authorityManager.getAuthorities().send();
    } catch (Exception e) {
      logger.error("Could not fetch authorities", e);
    }
    return List.of();
  }

  public List<ProposalMessage> getProposals() {
      return null;
  }

  public boolean proposeAuthority(ProposalMessage propsal) {
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
