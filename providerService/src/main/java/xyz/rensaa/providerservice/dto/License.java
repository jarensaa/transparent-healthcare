package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableLicense.class)
@JsonDeserialize(as = ImmutableLicense.class)
public interface License {

  @JsonProperty("address")
  String address();

  @JsonProperty("issuer")
  String issuer();

  @JsonProperty("licenseProvider")
  String licenseProvider();

  @JsonProperty("isTrusted")
  boolean isTrusted();
}
