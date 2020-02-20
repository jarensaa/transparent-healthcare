package xyz.rensaa.providerservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.web3j.crypto.Keys;
import xyz.rensaa.providerservice.model.ImmutableKey;
import xyz.rensaa.providerservice.model.ImmutableKeystore;
import xyz.rensaa.providerservice.model.Key;
import xyz.rensaa.providerservice.model.Keystore;

import java.security.InvalidAlgorithmParameterException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Configuration
public class KeystoreConfig {

  private static SecureRandom random = new SecureRandom();

  @Value("${custom.numkeys}")
  String numKeysConfig;

  @Bean
  public Keystore getKey() throws InvalidAlgorithmParameterException, NoSuchAlgorithmException, NoSuchProviderException {

    int numKeys = Integer.parseInt(numKeysConfig);
    List<Key> keys = new ArrayList<>(numKeys);

    for (int i = 0; i < numKeys; i++) {
      var keyPair = Keys.createEcKeyPair(random);
      var password = UUID.randomUUID().toString();
      keys.add(ImmutableKey.builder().keyPair(keyPair).password(password).build());
    }

    return ImmutableKeystore.builder().keys(keys).build();
  }
}
