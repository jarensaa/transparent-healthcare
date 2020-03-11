package xyz.rensaa.providerservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import xyz.rensaa.providerservice.LicenseProvider;
import xyz.rensaa.providerservice.contracts.CLicenseProviderFactory;
import xyz.rensaa.providerservice.dto.*;
import xyz.rensaa.providerservice.exceptions.NoContentException;
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

  public boolean approveLicenseIssuerMove(final String issuerPrivateKey, final String licenseAddress) {
    Web3Service.submitTransaction(
        cLicenseProviderFactory
            .fromPrivateKey(issuerPrivateKey)
            .approveMoveToLicenseIssuer(licenseAddress)
    );
    return true;
  }

  public boolean proposeLicenseProviderMove(final String licensePrivateKey, final String licenseProviderAddress) {
    Web3Service.submitTransaction(
        cLicenseProviderFactory
            .fromPrivateKey(licensePrivateKey)
            .proposeLicenseProviderMovement(licenseProviderAddress)
    );
    return true;
  }

  public boolean approveLicenseProviderMove(final String licenseProviderPrivateKey, final String licenseAddress) {
    Web3Service.submitTransaction(
        cLicenseProviderFactory
            .fromPrivateKey(licenseProviderPrivateKey)
            .approveLicenseProviderMovement(licenseAddress)
    );
    return true;
  }

  public boolean proposeLicenseIsserMove(final String licensePrivateKey, final String issuerAddress) {
    Web3Service.submitTransaction(
        cLicenseProviderFactory
            .fromPrivateKey(licensePrivateKey)
            .proposeMoveToLicenseIssuer(issuerAddress)
    );
    return true;
  }

  public License getLicenseFromAddress(final String address) {
    try {
      final var isLicense = defaultLicenseProvider.isLicense(address).send();
      if (!isLicense) throw new NoContentException();
      final var licenseData = defaultLicenseProvider.getLicense(address).send();
      final var isLicenseTrusted = defaultLicenseProvider.isLicenseTrusted(address).send();
      return ImmutableLicense.builder()
          .address(address)
          .issuer(licenseData.component1())
          .licenseProvider(licenseData.component2())
          .isTrusted(isLicenseTrusted)
          .build();
    } catch (final NoContentException e) {
      throw new NoContentException();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

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
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean isLicenseTrusted(final String address) {
    try {
      return defaultLicenseProvider.isLicenseTrusted(address).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean issueLicense(final String issuerPrivateKey, final String licenseAddress) {
    Web3Service.submitTransaction(
        cLicenseProviderFactory.fromPrivateKey(issuerPrivateKey).issueLicenseToAddress(licenseAddress)
    );
    return true;
  }

  public LicenseIssuer getIssuer(final String address) {
    try {
      final boolean isIssuer = defaultLicenseProvider.isLicenseIssuer(address).send();
      if (!isIssuer) throw new NoContentException();
      final boolean isTrusted = defaultLicenseProvider.isTrustedLicenseIssuer(address).send();

      final var issuerBuilder = ImmutableLicenseIssuer.builder().address(address).isTrusted(isTrusted);

      if (isTrusted) {
        final String trustingAuthority = defaultLicenseProvider.getAuthorityTrustingLicenseIssuer(address).send();
        issuerBuilder.trustingAuthority(trustingAuthority);
      }

      return issuerBuilder.build();

    } catch (final NoContentException e) {
      throw new NoContentException();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean registerAsIssuer(final String privateKey) {
    try {
      cLicenseProviderFactory.fromPrivateKey(privateKey).registerSenderAsIssuer().send();
      return true;
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean deregisterAsIssuer(final String privateKey) {
    try {
      cLicenseProviderFactory.fromPrivateKey(privateKey).removeSenderAsIssuer().send();
      return true;
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean isIssuerTrusted(final String address) {
    try {
      return defaultLicenseProvider.isTrustedLicenseIssuer(address).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean addTrustInIssuer(final String privateKey, final String address) {
    try {
      cLicenseProviderFactory.fromPrivateKey(privateKey).addTrustInLicenseIssuer(address).send();
      return true;
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean removeTrustInIssuer(final String privateKey, final String address) {
    try {
      cLicenseProviderFactory.fromPrivateKey(privateKey).removeTrustInLicenseIssuer(address).send();
      return true;
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }


  public List<LicenseIssuer> getLicenseIssuers() {
    try {
      final List<String> licenseIssuerAddresses = defaultLicenseProvider.getIssuers().send();
      return licenseIssuerAddresses.stream()
          .map(address -> ImmutableLicenseIssuer.builder()
              .address(address)
              .trustingAuthority(getAuthorityTrustingLicenseIssuer(address))
              .isTrusted(isLicenseIssuerTrusted(address))
              .build())
          .collect(Collectors.toList());
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public String getAuthorityTrustingLicenseIssuer(final String licenseAddress) {
    try {
      return defaultLicenseProvider.getAuthorityTrustingLicenseIssuer(licenseAddress).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean isLicenseIssuerTrusted(final String licenseAddress) {
    try {
      return defaultLicenseProvider.isTrustedLicenseIssuer(licenseAddress).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public List<LicenseProviderMessage> getLicenseProviders() {
    try {
      final List<String> licenseProviderAddresses = defaultLicenseProvider.getLicenseProviders().send();

      return licenseProviderAddresses.stream()
          .map(licenseProviderAddress -> ImmutableLicenseProviderMessage.builder()
              .address(licenseProviderAddress)
              .isTrusted(isLicenseProviderTrusted(licenseProviderAddress))
              .trustingAuthority(getAuthorityTrustingLicenseProvider(licenseProviderAddress))
              .build()
          ).collect(Collectors.toList());
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public LicenseProviderMessage getLicenseProvider(final String address) {
    try {
      final var isProvider = defaultLicenseProvider.isLicenseProvider(address).send();
      if (!isProvider) throw new NoContentException();

      final var isTrusted = defaultLicenseProvider.isTrustedProvider(address).send();
      final var licenseProviderMessageBuilder = ImmutableLicenseProviderMessage.builder()
          .address(address)
          .isTrusted(isTrusted);

      if (isTrusted) {
        final var trustingAuthority = defaultLicenseProvider.getAuthorityTrustingLicenseProvider(address).send();
        licenseProviderMessageBuilder.trustingAuthority(trustingAuthority);
      }

      return licenseProviderMessageBuilder.build();

    } catch (final NoContentException e) {
      throw e;
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean registerAsProvider(final String privateKey) {
    try {
      cLicenseProviderFactory.fromPrivateKey(privateKey).registerProvider().send();
      return true;
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean deregisterAsProvider(final String privateKey) {
    try {
      cLicenseProviderFactory.fromPrivateKey(privateKey).removeProvider().send();
      return true;
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean isLicenseProviderTrusted(final String providerAddress) {
    try {
      return defaultLicenseProvider.isTrustedProvider(providerAddress).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean addTrustInLicenseProvider(final String privateKey, final String providerAddress) {
    try {
      cLicenseProviderFactory.fromPrivateKey(privateKey).addTrustInProvider(providerAddress).send();
      return true;
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public boolean removeTrustInLicenseProvider(final String privateKey, final String providerAddress) {
    try {
      cLicenseProviderFactory.fromPrivateKey(privateKey).removeTrustInProvider(providerAddress).send();
      return true;
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }

  public String getAuthorityTrustingLicenseProvider(final String licenseProvider) {
    try {
      return defaultLicenseProvider.getAuthorityTrustingLicenseProvider(licenseProvider).send();
    } catch (final Exception e) {
      e.printStackTrace();
      throw new TransactionFailedException(e.getMessage());
    }
  }


}
