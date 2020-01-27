pragma solidity 0.6.1;
import "./iface/ILicenseProviderManager.sol";
import "./iface/ITreatmentProviderManager.sol";
import "./iface/ITreatment.sol";

contract Treatment is ITreatment {
    ILicenseProviderManager licenseProvider;
    ITreatmentProviderManager treatmentProvider;

    mapping(address => TreatmentInstance) treatments;
    mapping(address => address[]) treatmentsPerformedByLicense;

    constructor(
        address _licenseProviderAddress,
        address _treatmentProviderAddress
    ) public {
        licenseProvider = ILicenseProviderManager(_licenseProviderAddress);
        treatmentProvider = ITreatmentProviderManager(
            _treatmentProviderAddress
        );
    }

    function approveTreatment(address _treatmentAddress) external override {}
    function spendTreatment(address _treatmentAddress) external override {}
    function createTreatment(
        address _treatmentAddress,
        bytes32 _datahash,
        string calldata _dataLocationURL
    ) external override {}

    function getTreatmentsForLicense(address _licenseAddress)
        external
        view
        override
        returns (address[] memory)
    {}

    function getTreatmentData(address _treatmentAddress)
        external
        view
        override
        returns (address, address, bytes32, string memory, bool)
    {}
}
