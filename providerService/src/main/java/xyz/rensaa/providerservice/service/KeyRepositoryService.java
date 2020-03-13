package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.rensaa.providerservice.exceptions.UnauthorizedException;
import xyz.rensaa.providerservice.model.KeyAuthorization;
import xyz.rensaa.providerservice.repository.KeyAuthorizationRepository;
import xyz.rensaa.providerservice.repository.PatientKeyRepository;

@Service
public class KeyRepositoryService {

  @Autowired
  private KeyAuthorizationRepository keyAuthorizationRepository;

  @Autowired
  private PatientKeyRepository patientKeyRepository;

  public KeyAuthorization getKeyFromBearerToken(final String bearerToken) {
    final var token = bearerToken.substring(7);
    return keyAuthorizationRepository.findById(token).orElseThrow(UnauthorizedException::new);
  }

  public String getPatientAddressFromBearerToken(final String bearerToken) {
    final var token = bearerToken.substring(7);
    return patientKeyRepository.findById(token).orElseThrow(UnauthorizedException::new).getAddress();
  }

  public boolean isValidPatientToken(final String bearerToken) {
    final var token = bearerToken.substring(7);
    return patientKeyRepository.findByToken(token).isPresent();
  }

  public boolean isValidToken(final String bearerToken) {
    final var token = bearerToken.substring(7);
    return keyAuthorizationRepository.findById(token).isPresent();
  }

  public String getTokenPartOfBearerToken(final String bearerToken) {
    return bearerToken.substring(7);
  }
}
