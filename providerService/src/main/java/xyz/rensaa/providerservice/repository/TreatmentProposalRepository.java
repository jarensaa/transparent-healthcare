package xyz.rensaa.providerservice.repository;

import org.springframework.data.repository.CrudRepository;
import xyz.rensaa.providerservice.model.Treatments.TreatmentProposal;

import java.util.List;

public interface TreatmentProposalRepository extends CrudRepository<TreatmentProposal, String> {

    List<TreatmentProposal> findAllByPatientAddress(String patientAddress);
}
