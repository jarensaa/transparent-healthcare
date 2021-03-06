package xyz.rensaa.providerservice.contracts;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.tx.gas.ContractGasProvider;
import xyz.rensaa.providerservice.Measure;
import xyz.rensaa.providerservice.dto.ContractAddresses;

@Component
public class CMeasureFactory {

  @Autowired
  private Web3j web3j;

  @Autowired
  private ContractGasProvider gasProvider;

  @Autowired
  private ContractAddresses contractAddresses;

  public Measure fromPrivateKey(final String privateKey) {
    final var credentials = Credentials.create(privateKey);
    return Measure.load(contractAddresses.getMeasureAddress(), web3j, credentials, gasProvider);
  }

}

