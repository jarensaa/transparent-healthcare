package xyz.rensaa.providerservice.dto.Treatments;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

import java.util.Optional;

@Value.Immutable
@JsonDeserialize(as = TreatmentCombinedDataDTO.class)
@JsonSerialize(as = TreatmentCombinedDataDTO.class)
public interface TreatmentCombinedDataDTO {

    @JsonProperty("treatmentAddress")
    String treatmentAddress();

    @JsonProperty("contractData")
    Optional<TreatmentContractDataDTO> contractData();

    @JsonProperty("fullData")
    Optional<TreatmentFullDataDTO> fullData();
}
