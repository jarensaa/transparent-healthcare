package xyz.rensaa.providerservice.repository;

import org.springframework.data.repository.CrudRepository;
import xyz.rensaa.providerservice.model.TreatmentProviderHire;

import java.util.List;

public interface TreatmentProviderHireRepository extends CrudRepository<TreatmentProviderHire, String> {
    List<TreatmentProviderHire> findAllByLicenseAddress(String address);
    List<TreatmentProviderHire> findAllByProviderAddress(String address);
}
