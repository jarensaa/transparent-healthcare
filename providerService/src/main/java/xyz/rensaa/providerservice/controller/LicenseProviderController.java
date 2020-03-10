package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.rensaa.providerservice.dto.LicenseProviderMessage;
import xyz.rensaa.providerservice.service.KeyRepositoryService;
import xyz.rensaa.providerservice.service.LicenseService;

import java.util.List;

@RestController
@RequestMapping("/licenseproviders")
public class LicenseProviderController {

  @Autowired
  KeyRepositoryService keyRepositoryService;

  @Autowired
  LicenseService licenseService;


  @GetMapping
  public List<LicenseProviderMessage> getLicenseProviders() {
    return licenseService.getLicenseProviders();
  }

  @PostMapping
  public boolean registerAsProvider(@RequestHeader("Authorization") final String bearerToken) {
    final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.registerAsProvider(keyPair.getPrivateKey());
  }

  @PostMapping("/deregister")
  public boolean deregisterAsProvider(@RequestHeader("Authorization") final String bearerToken) {
    final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.deregisterAsProvider(keyPair.getPrivateKey());
  }

  @GetMapping("/{address}")
  public LicenseProviderMessage getLicenseProviderFromAddress(@PathVariable("address") final String address) {
    return licenseService.getLicenseProvider(address);
  }


  @PostMapping("/{address}/addtrust")
  public boolean addTrustInProvider(@PathVariable("address") final String address,
                                    @RequestHeader("Authorization") final String bearerToken) {
    final var keypair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.addTrustInLicenseProvider(keypair.getPrivateKey(), address);
  }

  @PostMapping("/{address}/removetrust")
  public boolean removeTrustInProvider(@PathVariable("address") final String address,
                                       @RequestHeader("Authorization") final String bearerToken) {
    final var keypair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.removeTrustInLicenseProvider(keypair.getPrivateKey(), address);
  }
}
