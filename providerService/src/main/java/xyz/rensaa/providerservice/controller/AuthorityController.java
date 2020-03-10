package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.web3j.crypto.WalletUtils;
import xyz.rensaa.providerservice.dto.Authority.ProposalMessage;
import xyz.rensaa.providerservice.exceptions.UnauthorizedException;
import xyz.rensaa.providerservice.service.AuthorityService;
import xyz.rensaa.providerservice.service.KeyRepositoryService;

import java.util.List;

@RestController
@RequestMapping("/authorities")
public class AuthorityController {

  @Autowired
  private AuthorityService authorityService;

  @Autowired
  private KeyRepositoryService keyRepositoryService;

  @GetMapping()
  public List<String> getAuthorities() {
    return authorityService.getAuthorities();
  }

  @GetMapping("/{address}/isAuthorized")
  public boolean isAuthorized(@PathVariable("address") final String address) {
    if (!WalletUtils.isValidAddress(address)) {
      return false;
    }
    return authorityService.isAuthorized(address);
  }

  @GetMapping("/proposals")
  public List<ProposalMessage> getProposals() {
    return authorityService.getProposals();
  }

  @PostMapping("/proposals")
  public boolean propose(@RequestBody final ProposalMessage propsal,
                         @RequestHeader("Authorization") final String bearerToken) {
    final var storedAuthorization = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    if (!propsal.proposer().equals(storedAuthorization.getAddress())) throw new UnauthorizedException();
    authorityService.proposeAuthority(propsal, storedAuthorization.getPrivateKey());
    return true;
  }

  @PostMapping("/proposals/{proposalId}/vote")
  public boolean voteOnProposal(@PathVariable("proposalId") final int proposalId,
                                @RequestHeader("Authorization") final String bearerToken) {
    final var storedAuthorization = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return authorityService.voteOnProposal(proposalId, storedAuthorization.getPrivateKey());
  }

  @PostMapping("/proposals/{proposalId}/enact")
  public boolean enactProposal(@PathVariable("proposalId") final int proposalId,
                               @RequestHeader("Authorization") final String bearerToken) {
    final var storedAuthorization = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return authorityService.enactProposal(proposalId, storedAuthorization.getPrivateKey());
  }

}
