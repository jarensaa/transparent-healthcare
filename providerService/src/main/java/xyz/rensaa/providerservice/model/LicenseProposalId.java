package xyz.rensaa.providerservice.model;

import java.io.Serializable;
import java.util.Objects;

public class LicenseProposalId implements Serializable {

  private final String licenseAddress;
  private final String targetAddress;

  public LicenseProposalId(final String licenseAddress, final String targetAddress) {
    this.licenseAddress = licenseAddress;
    this.targetAddress = targetAddress;
  }

  @Override
  public boolean equals(final Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    final LicenseProposalId that = (LicenseProposalId) o;
    return Objects.equals(licenseAddress, that.licenseAddress) &&
        Objects.equals(targetAddress, that.targetAddress);
  }

  @Override
  public int hashCode() {
    return Objects.hash(licenseAddress, targetAddress);
  }
}
