package xyz.rensaa.providerservice.dto.Treatments;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableTreatmentPatientInfoDTO.class)
@JsonDeserialize(as = ImmutableTreatmentPatientInfoDTO.class)
public interface TreatmentPatientInfoDTO {

    @JsonProperty("treatmentId")
    String treatmentId();

    @JsonProperty("description")
    String description();

    @JsonProperty("licenseAddress")
    String licenseAddress();
}
