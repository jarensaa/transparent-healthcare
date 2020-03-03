package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.web3j.crypto.WalletUtils;
import xyz.rensaa.providerservice.dto.ProposalMessage;
import xyz.rensaa.providerservice.service.AuthorityService;

import java.util.List;

@RestController
@RequestMapping("/authorities")
public class AuthorityController {

  @Autowired
  private AuthorityService authorityService;

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
  public boolean propose(@RequestBody ProposalMessage propsal) {
    authorityService.proposeAuthority(propsal);
    return true;
  }
}
