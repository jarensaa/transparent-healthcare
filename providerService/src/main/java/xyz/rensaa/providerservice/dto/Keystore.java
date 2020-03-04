package xyz.rensaa.providerservice.dto;

import org.immutables.value.Value;
import org.web3j.crypto.Credentials;

import java.util.List;

@Value.Immutable
public interface Keystore {
  List<Credentials> credentials();
}
