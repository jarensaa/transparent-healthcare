package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;


@Value.Immutable
@JsonSerialize(as = ImmutableLicenseProviderMessage.class)
@JsonDeserialize(as = ImmutableLicenseProviderMessage.class)
public interface LicenseProviderMessage {

  @JsonProperty("address")
  String address();

  @JsonProperty("trustingAuthority")
  String trustingAuthority();

  @JsonProperty("isTrusted")
  Boolean isTrusted();

}
