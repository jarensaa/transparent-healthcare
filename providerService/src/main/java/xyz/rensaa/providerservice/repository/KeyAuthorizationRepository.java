package xyz.rensaa.providerservice.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.rensaa.providerservice.model.KeyAuthorization;

@Repository
public interface KeyAuthorizationRepository extends CrudRepository<KeyAuthorization, String> {
}

