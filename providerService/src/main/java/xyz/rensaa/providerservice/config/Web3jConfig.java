package xyz.rensaa.providerservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;

import com.palantir.logsafe.SafeArg;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;
import xyz.rensaa.providerservice.dto.ContractAddresses;
import xyz.rensaa.providerservice.dto.GanacheKeys;

@Configuration
public class Web3jConfig {

  private static final ObjectMapper mapper = new ObjectMapper();

  @Value("${contracts.keyfile}")
  String keyFilePath;

  @Value("${contracts.addressesfile}")
  String addressesFilePath;

  @Value("${blockchain.uri}")
  String blockchainUri;
  
  @Autowired
  Logger logger;

  @Bean
  public Web3j createWeb3jClient() throws IOException {
    final var client = Web3j.build(new HttpService(blockchainUri));

    logger.info("Connected to client: {}", SafeArg.of("client", client.web3ClientVersion().send().getWeb3ClientVersion()));
    return client;
  }

  @Bean("originalCredentials")
  public List<Credentials> createCredentialsFromGanacheFile() throws IOException {
    final GanacheKeys keys = mapper.readValue(new File(keyFilePath), GanacheKeys.class);
    return keys.getPrivateKeys().values().stream().map(Credentials::create).collect(Collectors.toList());
  }

  @Bean
  public ContractAddresses createContractAddressesFromDeployFile() throws IOException {
    return mapper.readValue(new File(addressesFilePath), ContractAddresses.class);
  }

  @Bean
  public ContractGasProvider createGasProvider() {
    return new StaticGasProvider(BigInteger.valueOf(20000000000L), BigInteger.valueOf(300000L));
  }

}
