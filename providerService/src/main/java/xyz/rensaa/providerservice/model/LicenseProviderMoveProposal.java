package xyz.rensaa.providerservice.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@Table
@IdClass(LicenseProposalId.class)
public class LicenseProviderMoveProposal {

  @Id
  private String targetAddress;

  @Id
  private String licenseAddress;

  public LicenseProviderMoveProposal() {
  }

  public LicenseProviderMoveProposal(String licenseAddress, String targetAddress) {
    this.licenseAddress = licenseAddress;
    this.targetAddress = targetAddress;
  }

  public String getLicenseAddress() {
    return licenseAddress;
  }

  public String getTargetAddress() {
    return targetAddress;
  }

}
