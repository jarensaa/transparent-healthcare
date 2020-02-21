package xyz.rensaa.providerservice.service;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import xyz.rensaa.providerservice.AuthorityManager;

import java.util.List;

@Service
public class AuthorityService {

  @Autowired
  private AuthorityManager authorityManager;

  @Autowired
  @Qualifier("originalCredentials")
  private List<Credentials> credentials;

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

  public String getOriginalAuthorityAddress() {
    return credentials.get(0).getAddress();
  }
}
