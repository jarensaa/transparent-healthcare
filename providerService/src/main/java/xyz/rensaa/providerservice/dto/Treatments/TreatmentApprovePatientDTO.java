package xyz.rensaa.providerservice.dto.Treatments;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableTreatmentApprovePatientDTO.class)
@JsonDeserialize(as = ImmutableTreatmentApprovePatientDTO.class)
public interface TreatmentApprovePatientDTO {

    @JsonProperty("treatmentId")
    String treatmentId();

    @JsonProperty("treatmentAddress")
    String treatmentAddress();

    @JsonProperty("patientKeySignature")
    String patientKeySignature();

    @JsonProperty("treatmentKeySignature")
    String treatmentKeySignature();
}
