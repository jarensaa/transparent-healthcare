package xyz.rensaa.providerservice.model;

import org.immutables.value.Value;

import java.util.List;

@Value.Immutable
public interface Keystore {
  List<Key> keys();
}
