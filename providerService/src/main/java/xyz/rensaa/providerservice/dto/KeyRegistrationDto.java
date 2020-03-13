package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableKeyRegistrationDto.class)
@JsonDeserialize(as = ImmutableKeyRegistrationDto.class)
public interface KeyRegistrationDto {

    @JsonProperty("signature")
    String challangeSignature();

    @JsonProperty("address")
    String address();
}
