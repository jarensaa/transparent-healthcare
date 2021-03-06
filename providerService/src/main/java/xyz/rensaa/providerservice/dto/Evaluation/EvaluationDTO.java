package xyz.rensaa.providerservice.dto.Evaluation;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableEvaluationDTO.class)
@JsonDeserialize(as = ImmutableEvaluationDTO.class)
public interface EvaluationDTO {

    @JsonProperty("rating")
    Integer rating();

    @JsonProperty("fullMeasureHash")
    String fullMeasureHash();

    @JsonProperty("fullMeasureUrl")
    String fullMeasureUrl();
}
