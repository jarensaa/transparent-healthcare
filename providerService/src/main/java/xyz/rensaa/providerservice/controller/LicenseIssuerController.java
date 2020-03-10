package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.rensaa.providerservice.dto.LicenseIssuer;
import xyz.rensaa.providerservice.service.KeyRepositoryService;
import xyz.rensaa.providerservice.service.LicenseService;

import java.util.List;

@RestController
@RequestMapping("/licenseissuers")
public class LicenseIssuerController {

  @Autowired
  LicenseService licenseService;

  @Autowired
  private KeyRepositoryService keyRepositoryService;


  @GetMapping
  public List<LicenseIssuer> getLicenseIssuers() {
    return licenseService.getLicenseIssuers();
  }

  @PostMapping
  public boolean registerAsIssuer(@RequestHeader("Authorization") final String bearerToken) {
    final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.registerAsIssuer(keyPair.getPrivateKey());
  }

  @PostMapping("/deregister")
  public boolean deregisterAsIssuer(@RequestHeader("Authorization") final String bearerToken) {
    final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.deregisterAsIssuer(keyPair.getPrivateKey());
  }

  @GetMapping("/{address}")
  public LicenseIssuer getLicenseIssuer(@PathVariable("address") final String address) {
    return licenseService.getIssuer(address);
  }


  @PostMapping("/{address}/addtrust")
  public boolean addTrustInIssuer(@PathVariable("address") final String address,
                                  @RequestHeader("Authorization") final String bearerToken) {
    final var keypair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.addTrustInIssuer(keypair.getPrivateKey(), address);
  }

  @PostMapping("/{address}/removetrust")
  public boolean removeTrustInIssuer(@PathVariable("address") final String address,
                                     @RequestHeader("Authorization") final String bearerToken) {
    final var keypair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.removeTrustInIssuer(keypair.getPrivateKey(), address);
  }

}
