package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

import java.util.List;
import java.util.Optional;

@Value.Immutable
@JsonSerialize(as = ImmutableLicenseIssuer.class)
@JsonDeserialize(as = ImmutableLicenseIssuer.class)
public interface LicenseIssuer {

  @JsonProperty("address")
  String address();

  @JsonProperty("trustingAuthority")
  Optional<String> trustingAuthority();

  @JsonProperty("isTrusted")
  boolean isTrusted();

}
