package xyz.rensaa.providerservice.dto.Treatments;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableTreatmentLicenseNotificationDTO.class)
@JsonDeserialize(as = ImmutableTreatmentLicenseNotificationDTO.class)
public interface TreatmentLicenseNotificationDTO {

    @JsonProperty("treatmentAddress")
    String treatmentAddress();

    @JsonProperty("description")
    String treatmentDescription();

    @JsonProperty("patientKeySignature")
    String patientSignature();

    @JsonProperty("treatmentKeySignature")
    String treatmentKeySignature();


}
