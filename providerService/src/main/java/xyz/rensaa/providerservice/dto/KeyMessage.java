package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonDeserialize(as = ImmutableKeyMessage.class)
@JsonSerialize(as = ImmutableKeyMessage.class)
public interface KeyMessage {

  @JsonProperty("privateKey")
  String privateKey();

  @JsonProperty("publicKey")
  String publicKey();

  @JsonProperty("address")
  String address();
}
