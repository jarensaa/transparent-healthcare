package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.rensaa.providerservice.exceptions.UnauthorizedException;
import xyz.rensaa.providerservice.model.KeyAuthorization;
import xyz.rensaa.providerservice.repository.KeyAuthorizationRepository;

@Service
public class KeyRepositoryService {

  @Autowired
  private KeyAuthorizationRepository keyAuthorizationRepository;

  public KeyAuthorization getKeyFromBearerToken(String bearerToken) {
    var token = bearerToken.substring(7);
    return keyAuthorizationRepository.findById(token).orElseThrow(UnauthorizedException::new);
  }
}
