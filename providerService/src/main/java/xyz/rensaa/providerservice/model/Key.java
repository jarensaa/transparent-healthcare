package xyz.rensaa.providerservice.model;

import org.immutables.value.Value;
import org.web3j.crypto.CipherException;
import org.web3j.crypto.ECKeyPair;
import org.web3j.crypto.Wallet;


@Value.Immutable
abstract public class Key {

  @Value.Parameter
  abstract ECKeyPair keyPair();

  @Value.Parameter
  abstract String password();


  public String privateKey() {
    return keyPair().getPrivateKey().toString(16);
  }

  public String publicKey() {
    return keyPair().getPublicKey().toString(16);
  }

  public String address() {
    try {
      return "0x" + Wallet.createLight(password(),keyPair()).getAddress();
    } catch (CipherException e) {
      e.printStackTrace();
    }
    return "0x0";
  }

}
