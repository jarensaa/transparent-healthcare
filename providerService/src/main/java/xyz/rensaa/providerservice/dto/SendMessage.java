package xyz.rensaa.providerservice.dto;


import org.immutables.value.Value;

@Value.Immutable
public interface SendMessage {
    String name();
}
