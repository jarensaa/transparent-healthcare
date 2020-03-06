package xyz.rensaa.providerservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import xyz.rensaa.providerservice.dto.ImmutableTreatmentProviderMessage;
import xyz.rensaa.providerservice.dto.TreatmentProviderMessage;
import xyz.rensaa.providerservice.service.KeyRepositoryService;
import xyz.rensaa.providerservice.service.TreatmentProviderService;

import java.util.List;

@Controller
@RequestMapping("/treatmentprovider")
public class TreatmentProviderController {

  @Autowired
  private KeyRepositoryService keyRepositoryService;

  @Autowired
  private TreatmentProviderService treatmentProviderService;

  @GetMapping
  public List<TreatmentProviderMessage> getTreatmentProviders() {
    return treatmentProviderService.getRegisteredTreatmentProvidersWithTrustees();
  }

  @GetMapping("/{providerAddress}")
  public TreatmentProviderMessage getTreatmentProvider(@RequestParam("providerAddress") final String address) {
    return ImmutableTreatmentProviderMessage.builder()
        .address(address)
        .trustees(treatmentProviderService.getProviderTrustees(address))
        .build();
  }

  @PostMapping
  public void addTreatmentProvider(@RequestHeader("Authorization") final String bearerToken) {
    final var key = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    treatmentProviderService.registerKeyAsProvider(key.getPrivateKey());
  }

  @PostMapping("/deregister")
  public void deregisterKeyAsProvider(@RequestHeader("Authorization") final String bearerToken) {
    final var key = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    treatmentProviderService.deregisterKeyAsProvider(key.getPrivateKey());
  }

  @PostMapping("/{providerAddress}/addtrust")
  public void addTrustInTreatmentProvider(@RequestParam("providerAddress") final String providerAddress,
                                          @RequestHeader("Authorization") final String bearerToken) {
    final var key = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    treatmentProviderService.addTrustInProvider(key.getPrivateKey(), providerAddress);
  }

  @PostMapping("/{providerAddress}/removetrust")
  public void removeTrustInTreatmentProvider(@RequestParam("providerAddress") final String providerAddress,
                                             @RequestHeader("Authorization") final String bearerToken) {
    final var key = keyRepositoryService.getKeyFromBearerToken(bearerToken);
    treatmentProviderService.removeTrustInProvider(key.getPrivateKey(), providerAddress);
  }


}
