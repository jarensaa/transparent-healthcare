package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableLicenseProposalMessage.class)
@JsonDeserialize(as = ImmutableLicenseProposalMessage.class)
public interface LicenseProposalMessage {

    @JsonProperty("licenseAddress")
    String licenseAddress();

    @JsonProperty("targetAddress")
    String targetAddress();

}
