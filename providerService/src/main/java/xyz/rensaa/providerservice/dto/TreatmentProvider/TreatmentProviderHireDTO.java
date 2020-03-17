package xyz.rensaa.providerservice.dto.TreatmentProvider;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableTreatmentProviderHireDTO.class)
@JsonDeserialize(as = ImmutableTreatmentProviderHireDTO.class)
public interface TreatmentProviderHireDTO {

    @JsonProperty("token")
    String token();

    @JsonProperty("providerAddress")
    String providerAddress();

    @JsonProperty("licenseAddress")
    String licenseAddress();
}
