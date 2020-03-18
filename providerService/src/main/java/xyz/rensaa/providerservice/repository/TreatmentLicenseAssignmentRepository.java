package xyz.rensaa.providerservice.repository;

import org.springframework.data.repository.CrudRepository;
import xyz.rensaa.providerservice.model.Treatments.TreatmentLicenseAssignment;

import java.util.List;

public interface TreatmentLicenseAssignmentRepository  extends CrudRepository<TreatmentLicenseAssignment, String> {
    List<TreatmentLicenseAssignment> findAllByLicenseAddress(String licenseAddress);
}
