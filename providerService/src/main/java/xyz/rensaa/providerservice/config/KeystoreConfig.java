package xyz.rensaa.providerservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.Keys;
import xyz.rensaa.providerservice.model.ImmutableKeystore;
import xyz.rensaa.providerservice.model.Keystore;

import java.security.InvalidAlgorithmParameterException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;


@Configuration
public class KeystoreConfig {

  private static SecureRandom random = new SecureRandom();

  @Value("${keygen.numkeys}")
  String numKeysConfig;

  @Bean
  public Keystore getKey() throws InvalidAlgorithmParameterException, NoSuchAlgorithmException, NoSuchProviderException {

    int numKeys = Integer.parseInt(numKeysConfig);
    List<Credentials> credentials = new ArrayList<>(numKeys);

    for (int i = 0; i < numKeys; i++) {
      credentials.add(Credentials.create(Keys.createEcKeyPair(random)));
    }

    return ImmutableKeystore.builder().credentials(credentials).build();
  }
}
