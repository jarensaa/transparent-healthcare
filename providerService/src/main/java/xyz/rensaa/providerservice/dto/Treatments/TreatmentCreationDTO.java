package xyz.rensaa.providerservice.dto.Treatments;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableTreatmentCreationDTO.class)
@JsonDeserialize(as = ImmutableTreatmentCreationDTO.class)
public interface TreatmentCreationDTO {

    @JsonProperty("patientAddress")
    String patientAddress();

    @JsonProperty("treatmentDescription")
    String treatmentDescription();
}
