package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.web3j.crypto.WalletUtils;
import xyz.rensaa.providerservice.service.AuthorityService;

import java.util.List;

@RestController
@RequestMapping("/authority")
public class AuthorityController {

  @Autowired
  private AuthorityService authorityService;

  @GetMapping()
  public List<String> getAuthorities() {
    return authorityService.getAuthorities();
  }

  @GetMapping("/{address}/isAuthorized")
  public boolean isAuthorized(@PathVariable("address") String address) {
    if (!WalletUtils.isValidAddress(address)) return false;
    return authorityService.isAuthorized(address);
  }

}
