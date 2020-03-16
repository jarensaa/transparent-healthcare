package xyz.rensaa.providerservice.repository;

import org.springframework.data.repository.CrudRepository;
import xyz.rensaa.providerservice.model.Treatments.TreatmentData;

public interface TreatmentDataRepository extends CrudRepository<TreatmentData, String> {
}
