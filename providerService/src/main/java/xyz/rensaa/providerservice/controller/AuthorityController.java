package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import org.web3j.crypto.WalletUtils;
import xyz.rensaa.providerservice.dto.Propsal;
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
    if (!WalletUtils.isValidAddress(address)) { return false; }
    return authorityService.isAuthorized(address);
  }

  @PostMapping("/propose")
  public boolean propose(@RequestBody Propsal propsal) {
    authorityService.proposeAuthority(propsal);
    return true;
  }

  @MessageMapping("/hello")
  @SendTo("/topic/greetings")
  public String hello() {
    return "Hello world world";
  }
}
