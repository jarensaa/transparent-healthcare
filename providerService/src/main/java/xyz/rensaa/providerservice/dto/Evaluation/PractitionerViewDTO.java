package xyz.rensaa.providerservice.dto.Evaluation;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;
import xyz.rensaa.providerservice.dto.License;
import xyz.rensaa.providerservice.dto.Treatments.TreatmentContractDataDTO;

import java.util.List;

@Value.Immutable
@JsonSerialize(as = ImmutablePractitionerViewDTO.class)
@JsonDeserialize(as = ImmutablePractitionerViewDTO.class)
public interface PractitionerViewDTO {

    @JsonProperty("license")
    License license();

    @JsonProperty("unevaluatedTreatments")
    List<TreatmentContractDataDTO> unevaluatedTreatments();

    @JsonProperty("evaluatedTreatments")
    List<EvaluatedTreatmentDTO> evaluatedTreatment();

}
