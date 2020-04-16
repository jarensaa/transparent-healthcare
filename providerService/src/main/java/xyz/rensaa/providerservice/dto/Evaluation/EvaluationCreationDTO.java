package xyz.rensaa.providerservice.dto.Evaluation;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableEvaluationCreationDTO.class)
@JsonDeserialize(as = ImmutableEvaluationCreationDTO.class)
public interface EvaluationCreationDTO {
    @JsonProperty("privateKey")
    String privateKey();

    @JsonProperty("address")
    String address();

    @JsonProperty("rating")
    Integer rating();
}
