package xyz.rensaa.providerservice.dto.Authority;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

import java.util.List;
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

    @JsonProperty("isActive")
    Optional<Boolean> isActive();

    @JsonProperty("id")
    Optional<Integer> id();

    @JsonProperty("voters")
    Optional<List<String>> voters();
}
