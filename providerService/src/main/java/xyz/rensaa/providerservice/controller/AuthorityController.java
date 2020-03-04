package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.web3j.crypto.WalletUtils;
import xyz.rensaa.providerservice.dto.ProposalMessage;
import xyz.rensaa.providerservice.exceptions.UnauthorizedException;
import xyz.rensaa.providerservice.repository.KeyAuthorizationRepository;
import xyz.rensaa.providerservice.service.AuthorityService;

import javax.naming.AuthenticationException;
import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/authorities")
public class AuthorityController {

  @Autowired
  private AuthorityService authorityService;

  @Autowired
  private KeyAuthorizationRepository keyAuthorizationRepository;

  @GetMapping()
  public List<String> getAuthorities() {
    return authorityService.getAuthorities();
  }

  @GetMapping("/{address}/isAuthorized")
  public boolean isAuthorized(@PathVariable("address") String address) {
    if (!WalletUtils.isValidAddress(address)) { return false; }
    return authorityService.isAuthorized(address);
  }

  @GetMapping("/proposals")
  public List<ProposalMessage> getProposals() {
    return authorityService.getProposals();
  }

  @PostMapping("/proposals")
  public boolean propose(@RequestBody ProposalMessage propsal,
                         @RequestHeader("Authorization") String bearerToken) {
    var token = bearerToken.substring(7);
    var storedAuthorization = keyAuthorizationRepository.findById(token).orElseThrow(UnauthorizedException::new);
    if(!propsal.proposer().equals(storedAuthorization.getAddress())) throw new UnauthorizedException();
    authorityService.proposeAuthority(propsal, storedAuthorization.getPrivateKey());
    return true;
  }
}
