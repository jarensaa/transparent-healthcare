package xyz.rensaa.providerservice.dto.Treatments;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableTreatmentFullDataDTO.class)
@JsonDeserialize(as = ImmutableTreatmentFullDataDTO.class)
public interface TreatmentFullDataDTO {

    @JsonProperty("address")
    String address();

    @JsonProperty("fullDescription")
    String fullDescription();

    @JsonProperty("patientAddress")
    String patientAddress();

    @JsonProperty("patientKeySignature")
    String patientKeySignature();

    @JsonProperty("treatmentKeySignature")
    String treatmentKeySignature();
}