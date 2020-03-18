package xyz.rensaa.providerservice.dto.Treatments;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableTreatmentContractDataDTO.class)
@JsonDeserialize(as = ImmutableTreatmentContractDataDTO.class)
public interface TreatmentContractDataDTO {

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
