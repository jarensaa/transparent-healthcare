package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import xyz.rensaa.providerservice.dto.ImmutableTreatmentProviderMessage;
import xyz.rensaa.providerservice.dto.TreatmentProvider.TreatmentProviderHireDTO;
import xyz.rensaa.providerservice.dto.TreatmentProviderMessage;
import xyz.rensaa.providerservice.exceptions.NoContentException;
import xyz.rensaa.providerservice.service.KeyRepositoryService;
import xyz.rensaa.providerservice.service.TreatmentProviderService;

import java.util.List;

@RestController
@RequestMapping("/treatmentproviders")
public class TreatmentProviderController {

  @Autowired
  private KeyRepositoryService keyRepositoryService;

  @Autowired
  private TreatmentProviderService treatmentProviderService;

  @GetMapping
  public List<TreatmentProviderMessage> getTreatmentProviders() {
    return treatmentProviderService.getRegisteredTreatmentProvidersWithTrustees();
  }

  @GetMapping("/{address}")
  public TreatmentProviderMessage getTreatmentProvider(@PathVariable("address") final String address) {

    final var isProvider = treatmentProviderService.isRegisteredProvider(address);

    if (!isProvider) throw new NoContentException();

    return ImmutableTreatmentProviderMessage.builder()
        .address(address)
        .isTrusted(treatmentProviderService.isProviderTrusted(address))
        .trustees(treatmentProviderService.getProviderTrustees(address))
        .build();
  }

  @PostMapping
  public boolean addTreatmentProvider(@RequestHeader("Authorization") final String bearerToken) {
    final var key = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    treatmentProviderService.registerKeyAsProvider(key.getPrivateKey());
    return true;
  }

  @PostMapping("/deregister")
  public void deregisterKeyAsProvider(@RequestHeader("Authorization") final String bearerToken) {
    final var key = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    treatmentProviderService.deregisterKeyAsProvider(key.getPrivateKey());
  }

  @PostMapping("/{providerAddress}/addtrust")
  public void addTrustInTreatmentProvider(@PathVariable("providerAddress") final String providerAddress,
                                          @RequestHeader("Authorization") final String bearerToken) {
    final var key = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    treatmentProviderService.addTrustInProvider(key.getPrivateKey(), providerAddress);
  }

  @PostMapping("/{providerAddress}/removetrust")
  public void removeTrustInTreatmentProvider(@PathVariable("providerAddress") final String providerAddress,
                                             @RequestHeader("Authorization") final String bearerToken) {
    final var key = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    treatmentProviderService.removeTrustInProvider(key.getPrivateKey(), providerAddress);
  }

  @PostMapping("/licenses/{address}/hire")
  public boolean hireLicense(@PathVariable("address") final String licenseAddress,
                             @RequestHeader("Authorization") final String bearerToken) {
    final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return treatmentProviderService.registerLicenseWithTreatmentProvider(licenseAddress, keyPair.getAddress());
  }

  @GetMapping("/licenses/provider")
  public List<TreatmentProviderHireDTO> getProvidersForLicense(
          @RequestHeader("Authorization") final String bearerToken) {
      final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
      return treatmentProviderService.getTreatmentProvidersForLicense(keyPair.getAddress());
  }

  @GetMapping("/licenses")
  public List<TreatmentProviderHireDTO> getLicensesForProvider(
          @RequestHeader("Authorization") final String bearerToken) {
    final var keyPair = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    return treatmentProviderService.getLicensesForTreatmentProvider(keyPair.getAddress());
  }

}
