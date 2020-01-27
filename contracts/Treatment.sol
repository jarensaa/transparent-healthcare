pragma solidity 0.6.1;
import "./iface/ILicenseProviderManager.sol";
import "./iface/ITreatmentProviderManager.sol";
import "./iface/ISpendableTreatment.sol";
import "./iface/IApprovableTreatment.sol";

contract Treatment is ISpendableTreatment, IApprovableTreatment {
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
        override(ISpendableTreatment)
    {}
}
