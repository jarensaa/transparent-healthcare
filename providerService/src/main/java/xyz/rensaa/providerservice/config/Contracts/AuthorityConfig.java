package xyz.rensaa.providerservice.config.Contracts;

import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.tx.gas.ContractGasProvider;
import xyz.rensaa.providerservice.AuthorityManager;
import xyz.rensaa.providerservice.dto.ContractAddresses;

import java.io.IOException;
import java.util.List;

@Configuration
public class AuthorityConfig {

  @Autowired
  Logger logger;

  @Autowired
  Web3j web3j;

  @Autowired
  List<Credentials> credentials;

  @Autowired
  ContractAddresses contractAddresses;

  @Autowired
  ContractGasProvider gasProvider;

  @Bean
  public AuthorityManager createAuthorityContract() throws IOException {
    var authorityContract = AuthorityManager.load(contractAddresses.getAuthorityAddress(),web3j,credentials.get(0), gasProvider);
    Preconditions.checkArgument(authorityContract.isValid(),"Provided authority address is invalid");
    logger.info("AuthorityManager bytecode is deployed on the blockchain at address " + authorityContract.getContractAddress());
    return authorityContract;
  }
}
