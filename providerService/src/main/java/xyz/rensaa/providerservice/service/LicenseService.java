package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.rensaa.providerservice.LicenseProvider;
import xyz.rensaa.providerservice.contracts.CLicenseProviderFactory;
import xyz.rensaa.providerservice.dto.*;
import xyz.rensaa.providerservice.exceptions.TransactionFailedException;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class LicenseService {


  @Autowired
  LicenseProvider defaultLicenseProvider;

  @Autowired
  CLicenseProviderFactory cLicenseProviderFactory;

  public List<License> getLicenses() {
    try {
      final var licenses = defaultLicenseProvider.getLicenses().send();
      final var numLicenses = licenses.component1().size();

      return IntStream.range(0, numLicenses)
          .mapToObj(index ->
              ImmutableLicense.builder()
                  .address(licenses.component1().get(index))
                  .issuer(licenses.component2().get(index))
                  .licenseProvider(licenses.component3().get(index))
                  .isTrusted(isLicenseTrusted(licenses.component1().get(index)))
                  .build())
          .collect(Collectors.toList());
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException();
    }
  }

  public boolean isLicenseTrusted(final String address) {
    try {
      return defaultLicenseProvider.isLicenseTrusted(address).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException();
    }
  }

  public void registerLicense(final String issuerPrivateKey, final String licenseAddress) {
    try {
      cLicenseProviderFactory.fromPrivateKey(issuerPrivateKey).issueLicenseToAddress(licenseAddress).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException();
    }
  }

  public boolean isIssuerTrusted(final String address) {
    try {
      return defaultLicenseProvider.isTrustedLicenseIssuer(address).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException();
    }
  }


  public List<LicenseIssuer> getLicenseIssuers() {
    try {
      final List<String> licenseIssuerAddresses = defaultLicenseProvider.getIssuers().send();
      return licenseIssuerAddresses.stream()
          .map(address -> ImmutableLicenseIssuer.builder()
              .address(address)
              .trustingAuthority(getAuthorityTrustingLicense(address))
              .isTrusted(isLicenseIssuerTrusted(address))
              .build())
          .collect(Collectors.toList());
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException();
    }
  }

  public String getAuthorityTrustingLicense(final String licenseAddress) {
    try {
      return defaultLicenseProvider.getAuthorityTrustingLicense(licenseAddress).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException();
    }
  }

  public boolean isLicenseIssuerTrusted(final String licenseAddress) {
    try {
      return defaultLicenseProvider.isLicenseTrusted(licenseAddress).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException();
    }
  }
  
  public List<LicenseProviderMessage> getLicenseProviders() {
    try {
      final List<String> licenseProviderAddresses = defaultLicenseProvider.getLicenseProviders().send();

      return licenseProviderAddresses.stream()
          .map(licenseProviderAddress -> ImmutableLicenseProviderMessage.builder()
              .address(licenseProviderAddress)
              .isTrusted(isLicenseIssuerTrusted(licenseProviderAddress))
              .trustingAuthority(getAuthorityTrustingLicenseProvider(licenseProviderAddress))
              .build()
          ).collect(Collectors.toList());
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException();
    }
  }

  public boolean isLicenseProviderTrusted(final String providerAddress) {
    try {
      return defaultLicenseProvider.isTrustedProvider(providerAddress).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException();
    }
  }

  public String getAuthorityTrustingLicenseProvider(final String licenseProvider) {
    try {
      return defaultLicenseProvider.getAuthorityTrustingProvider(licenseProvider).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException();
    }
  }


}
