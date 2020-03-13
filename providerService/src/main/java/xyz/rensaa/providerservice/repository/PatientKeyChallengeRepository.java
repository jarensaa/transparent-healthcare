package xyz.rensaa.providerservice.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.rensaa.providerservice.model.PatientKeyRegistrationChallenge;

@Repository
public interface PatientKeyChallengeRepository
        extends CrudRepository<PatientKeyRegistrationChallenge, String> {
}
