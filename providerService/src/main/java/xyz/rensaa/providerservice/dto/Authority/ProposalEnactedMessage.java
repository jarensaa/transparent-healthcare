package xyz.rensaa.providerservice.dto.Authority;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable
@JsonSerialize(as = ImmutableProposalEnactedMessage.class )
@JsonDeserialize(as = ImmutableProposalEnactedMessage.class)
public interface ProposalEnactedMessage {
  @JsonProperty("proposalId")
  int propsalId();
}
