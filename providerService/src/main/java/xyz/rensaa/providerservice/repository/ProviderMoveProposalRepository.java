package xyz.rensaa.providerservice.repository;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import xyz.rensaa.providerservice.model.LicenseProposalId;
import xyz.rensaa.providerservice.model.LicenseProviderMoveProposal;

import java.util.List;

@Repository
public interface ProviderMoveProposalRepository extends
        CrudRepository<LicenseProviderMoveProposal, LicenseProposalId> {

    List<LicenseProviderMoveProposal> findAllByLicenseAddress(String licenseAddress);
    List<LicenseProviderMoveProposal> findAllByTargetAddress(String providerAddress);
}
