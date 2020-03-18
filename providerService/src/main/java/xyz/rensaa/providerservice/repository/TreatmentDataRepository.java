package xyz.rensaa.providerservice.repository;

import org.springframework.data.repository.CrudRepository;
import xyz.rensaa.providerservice.model.Treatments.TreatmentData;

import java.util.List;

public interface TreatmentDataRepository extends CrudRepository<TreatmentData, String> {

    @Override
    List<TreatmentData> findAllById(Iterable<String> strings);
}
