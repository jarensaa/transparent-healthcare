package xyz.rensaa.providerservice.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.rensaa.providerservice.model.LicenseIsserMoveProposal;
import xyz.rensaa.providerservice.model.LicenseProposalId;

import java.util.List;

@Repository
public interface LicenseIssuerMoveProposalRepository
        extends CrudRepository<LicenseIsserMoveProposal, LicenseProposalId> {

    List<LicenseIsserMoveProposal> findAllByTargetAddress(String issuerAddress);
    List<LicenseIsserMoveProposal> findAllByLicenseAddress(String licenseAddress);
}
