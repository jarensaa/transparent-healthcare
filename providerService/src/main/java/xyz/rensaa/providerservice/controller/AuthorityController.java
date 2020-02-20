package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.rensaa.providerservice.service.AuthorityService;

@RestController
public class AuthorityController {

  @Autowired
  private AuthorityService authorityService;

  @GetMapping("/authority")
  public String getAuthorities() {
    return authorityService.getAuthority();
  }
}
