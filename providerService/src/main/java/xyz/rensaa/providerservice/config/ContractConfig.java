package xyz.rensaa.providerservice.config;

import com.palantir.logsafe.Preconditions;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.tx.Contract;
import org.web3j.tx.gas.ContractGasProvider;
import xyz.rensaa.providerservice.AuthorityManager;
import xyz.rensaa.providerservice.LicenseProvider;
import xyz.rensaa.providerservice.Measure;
import xyz.rensaa.providerservice.Treatment;
import xyz.rensaa.providerservice.TreatmentProvider;
import xyz.rensaa.providerservice.dto.ContractAddresses;

import java.io.IOException;
import java.util.List;

@Configuration
public class ContractConfig {

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

  private void checkContractValidity(
      final Contract contract, final String contractName) throws IOException {
    Preconditions.checkArgument(contract.isValid(),
        String.format("%s contract is invalid. Bytecode deployed at address does not match loaded bytecode",
            contractName));
    logger.info("Loaded {} contract deployed at address {}", contractName, contract.getContractAddress());
  }

  @Bean
  public AuthorityManager createAuthorityContract() throws IOException {
    final var authorityContract = AuthorityManager.load(contractAddresses.getAuthorityAddress(),
        web3j, credentials.get(0), gasProvider);
    checkContractValidity(authorityContract, "Authority");
    return authorityContract;
  }

  @Bean
  public LicenseProvider createDefaultLicenseProvider() throws IOException {
    final var defaultContract = LicenseProvider.load(contractAddresses.getLicenseProviderAddress(),
        web3j, credentials.get(1), gasProvider);
    checkContractValidity(defaultContract, "LicenseProvider");
    return defaultContract;
  }

  @Bean
  public Measure createDefaultMeasure() throws IOException {
    final var defaultContract = Measure.load(contractAddresses.getLicenseProviderAddress(),
        web3j, credentials.get(2), gasProvider);
    checkContractValidity(defaultContract, "Measure");
    return defaultContract;
  }

  @Bean
  public Treatment createDefaultTreatment() throws IOException {
    final var defaultContract = Treatment.load(contractAddresses.getLicenseProviderAddress(),
        web3j, credentials.get(3), gasProvider);
    checkContractValidity(defaultContract, "Treatment");
    return defaultContract;
  }

  @Bean
  public TreatmentProvider createDefaultTreatmentProvider() throws IOException {
    final var defaultContract = TreatmentProvider.load(contractAddresses.getLicenseProviderAddress(),
        web3j, credentials.get(4), gasProvider);
    checkContractValidity(defaultContract, "TreatmentProvider");
    return defaultContract;
  }
}
