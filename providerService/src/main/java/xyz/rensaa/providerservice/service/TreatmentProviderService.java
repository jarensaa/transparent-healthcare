package xyz.rensaa.providerservice.service;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.rensaa.providerservice.TreatmentProvider;
import xyz.rensaa.providerservice.contracts.CTreatmentProviderFactory;
import xyz.rensaa.providerservice.dto.ImmutableTreatmentProviderMessage;
import xyz.rensaa.providerservice.dto.TreatmentProvider.ImmutableTreatmentProviderHireDTO;
import xyz.rensaa.providerservice.dto.TreatmentProvider.TreatmentProviderHireDTO;
import xyz.rensaa.providerservice.dto.TreatmentProviderMessage;
import xyz.rensaa.providerservice.exceptions.TransactionFailedException;
import xyz.rensaa.providerservice.model.TreatmentProviderHire;
import xyz.rensaa.providerservice.repository.TreatmentProviderHireRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class TreatmentProviderService {

  @Autowired
  private CTreatmentProviderFactory cTreatmentProviderFactory;

  @Autowired
  private TreatmentProvider defaultTreatmentProvider;

  @Autowired
  private TreatmentProviderHireRepository treatmentProviderHireRepository;

  @Autowired
  private Logger logger;

  public void registerKeyAsProvider(final String privateKey) {
    final var treatmentProviderContract = cTreatmentProviderFactory.fromPrivateKey(privateKey);
    try {
      treatmentProviderContract.addSenderAsProvider().send();
    } catch (final Exception e) {
      logger.warn("Failed to register sender as TreatmentProvider. {}", e.getMessage());
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public void deregisterKeyAsProvider(final String privateKey) {
    final var contract = cTreatmentProviderFactory.fromPrivateKey((privateKey));
    try {
      contract.removeSenderAsProvider().send();
    } catch (final Exception e) {
      logger.warn("Failed to remove sender as treatmentProvider. {}", e.getMessage());
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean isRegisteredProvider(final String address) {
    try {
      return defaultTreatmentProvider.isProvider(address).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public List<String> getRegisteredProviders() {
    try {
      return defaultTreatmentProvider.getRegisteredProviders().send();
    } catch (final Exception e) {
      logger.warn("Failed to get registered providers. {}", e.getMessage());
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public List<String> getProviderTrustees(final String providerAddress) {
    try {
      return defaultTreatmentProvider.getProviderTrustees(providerAddress).send();
    } catch (final Exception e) {
      logger.warn("Failed to get provider trustees. {}", e.getMessage());
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public List<TreatmentProviderMessage> getRegisteredTreatmentProvidersWithTrustees() {
    final var treatmentProviders = getRegisteredProviders();
    if (treatmentProviders.size() == 0) return List.of();
    return treatmentProviders.stream().map(treatmentProvider -> {
      var trustees = getProviderTrustees(treatmentProvider);
      var isTrusted = isProviderTrusted(treatmentProvider);
      return ImmutableTreatmentProviderMessage.builder()
          .address(treatmentProvider)
          .isTrusted(isTrusted)
          .trustees(trustees)
          .build();
    }).collect(Collectors.toList());
  }

  public boolean isProviderTrusted(final String address) {
    try {
      return defaultTreatmentProvider.isTrustedProvider(address).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public void addTrustInProvider(final String privateKey, final String providerAddress) {
    try {
      cTreatmentProviderFactory.fromPrivateKey(privateKey).addTrustInProvider(providerAddress).send();
    } catch (final Exception e) {
      logger.warn("Failed to add trust in provider. {}", e.getMessage());
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public void removeTrustInProvider(final String privateKey, final String providerAddress) {
    try {
      cTreatmentProviderFactory.fromPrivateKey(privateKey).removeTrustInProvider(providerAddress).send();
    } catch (final Exception e) {
      logger.warn("Failed to remove trust in provider. {}", e.getMessage());
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public List<TreatmentProviderHireDTO> getLicensesForTreatmentProvider(String treatmentProviderAddress) {
    return treatmentProviderHireRepository
            .findAllByProviderAddress(treatmentProviderAddress)
            .stream()
            .map(treatmentProviderHire -> ImmutableTreatmentProviderHireDTO.builder()
                    .licenseAddress(treatmentProviderHire.getLicenseAddress())
                    .providerAddress(treatmentProviderHire.getProviderAddress())
                    .token(treatmentProviderHire.getToken())
                    .build()
            ).collect(Collectors.toList());
  }


  public List<TreatmentProviderHireDTO> getTreatmentProvidersForLicense(String licenseAddress) {
    return treatmentProviderHireRepository
            .findAllByLicenseAddress(licenseAddress)
            .stream()
            .map(treatmentProviderHire -> ImmutableTreatmentProviderHireDTO.builder()
                    .licenseAddress(treatmentProviderHire.getLicenseAddress())
                    .providerAddress(treatmentProviderHire.getProviderAddress())
                    .token(treatmentProviderHire.getToken())
                    .build()
            ).collect(Collectors.toList());
  }


  public boolean registerLicenseWithTreatmentProvider(String licenseAddress, String providerToken, String treatmentProviderAddress) {
    var token = UUID.randomUUID().toString();
    var treatmentProviderHire = new TreatmentProviderHire(token, licenseAddress, treatmentProviderAddress,providerToken);
    treatmentProviderHireRepository.save(treatmentProviderHire);
    return true;
  }


}
