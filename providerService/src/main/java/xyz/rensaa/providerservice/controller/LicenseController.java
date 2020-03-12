package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.rensaa.providerservice.dto.License;
import xyz.rensaa.providerservice.service.KeyRepositoryService;
import xyz.rensaa.providerservice.service.LicenseService;

import java.util.List;

@RestController
@RequestMapping("/licenses")
public class LicenseController {

  @Autowired
  LicenseService licenseService;

  @Autowired
  KeyRepositoryService keyRepositoryService;

  @GetMapping
  public List<License> getLicenses() {
    return licenseService.getLicenses();
  }

  @GetMapping("/{address}")
  public License getLicenseFromAddress(@PathVariable("address") final String address) {
    return licenseService.getLicenseFromAddress(address);
  }

  @PostMapping("/provider/move/{address}")
  public boolean moveLicenseToProvider(@PathVariable("address") final String providerAddress,
                                       @RequestHeader("Authorization") final String bearerToken) {
    final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.proposeLicenseProviderMove(keyPair.getPrivateKey(), providerAddress);
  }

  @PostMapping("/provider/approve/{address}")
  public boolean approveLicenseProviderMove(@PathVariable("address") final String licenseAddress,
                                            @RequestHeader("Authorization") final String bearerToken) {
    final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.approveLicenseProviderMove(keyPair.getPrivateKey(), licenseAddress);
  }

  @PostMapping("/issuer/move/{address}")
  public boolean moveLicenseToIssuer(@PathVariable("address") final String issuerAddress,
                                     @RequestHeader("Authorization") final String bearerToken) {
    final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.proposeLicenseIsserMove(keyPair.getPrivateKey(), issuerAddress);
  }

  @PostMapping("/issuer/approve/{address}")
  public boolean approveLicenseIssuerMove(@PathVariable("address") final String licenseAddress,
                                          @RequestHeader("Authorization") final String bearerToken) {
    final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.approveLicenseIssuerMove(keyPair.getPrivateKey(), licenseAddress);
  }


  @PostMapping("/{address}/issue")
  public boolean issueLicenseToAddress(@PathVariable("address") final String address,
                                       @RequestHeader("Authorization") final String bearerToken) {
    final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return licenseService.issueLicense(keyPair.getPrivateKey(), address);
  }
}
