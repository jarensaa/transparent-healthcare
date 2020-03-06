package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import xyz.rensaa.providerservice.contracts.CTreatmentProviderFactory;

import java.util.List;

public class TreatmentProviderService {


  @Autowired
  private CTreatmentProviderFactory cTreatmentProviderFactory;


  public List<String> getTreatmentProviders() {
    cTreatmentProviderFactory
  }
}
