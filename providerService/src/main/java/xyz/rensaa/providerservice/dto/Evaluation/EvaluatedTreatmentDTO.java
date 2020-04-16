package xyz.rensaa.providerservice.dto.Evaluation;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;
import xyz.rensaa.providerservice.dto.Treatments.TreatmentContractDataDTO;

@Value.Immutable
@JsonDeserialize(as = ImmutableEvaluatedTreatmentDTO.class)
@JsonSerialize(as = ImmutableEvaluatedTreatmentDTO.class)
public interface EvaluatedTreatmentDTO {

    @JsonProperty("treatment")
    TreatmentContractDataDTO treatment();

    @JsonProperty("evaluation")
    EvaluationDTO evaluationDto();

}
