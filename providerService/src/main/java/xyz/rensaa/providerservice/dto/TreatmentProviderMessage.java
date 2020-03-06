package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

import java.util.List;
import java.util.Optional;

@Value.Immutable
@JsonSerialize(as = ImmutableTreatmentProviderMessage.class)
@JsonDeserialize(as = ImmutableTreatmentProviderMessage.class)
public interface TreatmentProviderMessage {

  @JsonProperty("address")
  String address();

  @JsonProperty("trustedBy")
  Optional<List<String>> trustees();
}
