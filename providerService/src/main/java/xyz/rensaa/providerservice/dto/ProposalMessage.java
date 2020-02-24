package xyz.rensaa.providerservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

import java.util.Optional;


@Value.Immutable
@JsonDeserialize(as = ImmutableProposalMessage.class)
@JsonSerialize(as = ImmutableProposalMessage.class)
public interface ProposalMessage {

    @JsonProperty("proposer")
    String proposer();

    @JsonProperty("subject")
    String subject();

    @JsonProperty("type")
    Integer proposalType();

    @JsonProperty("id")
    Optional<Integer> id();
}
