package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

import java.util.Optional;


@Value.Immutable
@JsonDeserialize(as = ImmutablePropsal.class)
@JsonSerialize(as = ImmutablePropsal.class)
public interface Propsal {

    @JsonProperty("proposer")
    String proposer();

    @JsonProperty("subject")
    String subject();

    @JsonProperty("type")
    Integer proposalType();

    @JsonProperty("id")
    Optional<Integer> id();
}
