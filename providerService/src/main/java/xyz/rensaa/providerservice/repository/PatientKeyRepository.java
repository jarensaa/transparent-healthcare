package xyz.rensaa.providerservice.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.rensaa.providerservice.model.PatientKeyRegistration;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientKeyRepository extends CrudRepository<PatientKeyRegistration, String> {
    Optional<PatientKeyRegistration> findByToken(String token);
}
