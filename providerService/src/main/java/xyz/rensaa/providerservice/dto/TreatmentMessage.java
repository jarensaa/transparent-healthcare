package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableTreatmentMessage.class)
@JsonDeserialize(as = ImmutableTreatmentMessage.class)
public interface TreatmentMessage {

  @JsonProperty("address")
  String address();

  @JsonProperty("approvingLicenseAddress")
  String approvingLicenseAddress();

  @JsonProperty("treatmentProviderAddress")
  String treatmentProviderAddress();

  @JsonProperty("fullDataHash")
  String fullDataHash();

  @JsonProperty("fullDataUrl")
  String fullDataURL();

  @JsonProperty("isSpent")
  Boolean isSpent();
}
