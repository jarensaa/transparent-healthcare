pragma solidity 0.6.1;
import "./ILicenseProviderManager.sol";
import "./ITreatmentProviderManager.sol";
import "./ISpendableTreatment.sol";

contract Treatment is ISpendableTreatment {
    ILicenseProviderManager licenseProvider;
    ITreatmentProviderManager treatmentProvider;

    constructor(
        address _licenseProviderAddress,
        address _treatmentProviderAddress
    ) public {
        licenseProvider = ILicenseProviderManager(_licenseProviderAddress);
        treatmentProvider = ITreatmentProviderManager(
            _treatmentProviderAddress
        );
    }

    function spendTreatment(address _treatmentAddress, uint256 _type)
        external
        override
    {}
}
