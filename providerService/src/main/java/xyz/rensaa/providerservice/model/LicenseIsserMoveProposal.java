package xyz.rensaa.providerservice.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Table
@Entity
@IdClass(LicenseProposalId.class)
public class LicenseIsserMoveProposal {
    @Id
    private String targetAddress;

    @Id
    private String licenseAddress;

    public LicenseIsserMoveProposal() {
    }

    public LicenseIsserMoveProposal(final String licenseAddress, final String targetAddress) {
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
