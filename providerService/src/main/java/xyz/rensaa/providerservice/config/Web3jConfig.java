package xyz.rensaa.providerservice.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import xyz.rensaa.providerservice.dto.ContractAddresses;
import xyz.rensaa.providerservice.dto.GanacheKeys;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class Web3jConfig  {

  @Value("${ganache-cli.keyfile}")
  String keyFilePath;

  @Value("${contracts.addressesfile}")
  String addressesFilePath;

  @Bean
  public Web3j createWeb3jClient() {
    return Web3j.build(new HttpService("http://localhost:7545"));
  }

  @Bean
  public List<Credentials> createCredentialsFromGanacheFile() throws IOException {
    var objectMapper = new ObjectMapper();
    var keys = objectMapper.readValue(new File(keyFilePath), GanacheKeys.class);
    return keys.getPrivateKeys().values().stream().map(Credentials::create).collect(Collectors.toList());
  }

  @Bean
  public ContractAddresses createContractAddressesFromDeployFile() throws IOException {
    var objectMapper = new ObjectMapper();
    var addresses = objectMapper.readValue(new File(addressesFilePath), ContractAddresses.class);
    return addresses;
  }
}
