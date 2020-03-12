package xyz.rensaa.providerservice.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@Table
@IdClass(LicenseProposalId.class)
public class ProviderMoveProposal {

  @Id
  private String licenseAddress;

  @Id
  private String targetAddress;

}
