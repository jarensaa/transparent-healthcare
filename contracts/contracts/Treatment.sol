pragma solidity ^0.6.1;
import "./iface/ILicenseProviderManager.sol";
import "./iface/ITreatmentProviderManager.sol";
import "./iface/ITreatment.sol";
import "./iface/IMeasure.sol";

contract Treatment is ITreatment {
    ILicenseProviderManager licenseProvider;
    ITreatmentProviderManager treatmentProvider;
    IMeasure measureContract;
    address creator;

    mapping(address => TreatmentInstance) treatments;
    mapping(address => address[]) treatmentsPerformedByLicense;

    modifier addressIsTrustedLicenseHolder(address _address) {
        require(
            licenseProvider.isLicenseTrusted(_address),
            "Address is not a trusted license"
        );
        _;
    }

    modifier addressIsTreatmentProvider(address _address) {
        require(
            treatmentProvider.isTrustedProvider(_address),
            "Address is not a trusted treatment provider"
        );
        _;
    }

    modifier addressIsMeasureContract(address _address) {
        require(
            _address == address(measureContract),
            "Address is not measure contract"
        );
        _;
    }

    constructor(
        address _licenseProviderAddress,
        address _treatmentProviderAddress
    ) public {
        licenseProvider = ILicenseProviderManager(_licenseProviderAddress);
        treatmentProvider = ITreatmentProviderManager(
            _treatmentProviderAddress
        );
        creator = msg.sender;
    }

    function registerMeasureContract(address _measureContract)
        external
        override
    {
        require(creator == msg.sender, "Only sender can set measure Contract");
        require(
            address(measureContract) == address(0x0),
            "measureContract is allready set."
        );
        measureContract = IMeasure(_measureContract);
    }

    function createTreatment(
        address _treatmentAddress,
        bytes32 _datahash,
        string calldata _dataLocationURL
    ) external override addressIsTreatmentProvider(msg.sender) {
        require(
            !treatments[_treatmentAddress].isInstanced,
            "Treatment with this address is allready created"
        );
        treatments[_treatmentAddress].treatmentProvider = msg.sender;
        treatments[_treatmentAddress].fullDataHash = _datahash;
        treatments[_treatmentAddress].fullDataURL = _dataLocationURL;
        treatments[_treatmentAddress].isInstanced = true;
    }

    function approveTreatment(address _treatmentAddress)
        external
        override
        addressIsTrustedLicenseHolder(msg.sender)
    {
        require(
            treatments[_treatmentAddress].isInstanced,
            "Treatment with this address is not created"
        );
        require(
            treatments[_treatmentAddress].approvingLicense == address(0x0),
            "Treatment is allready approved"
        );
        treatments[_treatmentAddress].approvingLicense = msg.sender;
        treatmentsPerformedByLicense[msg.sender].push(_treatmentAddress);
    }

    function spendTreatment(address _treatmentAddress)
        external
        override
        addressIsMeasureContract(msg.sender)
    {
        require(
            !treatments[_treatmentAddress].isSpent,
            "Treatment is allready spent"
        );
        treatments[_treatmentAddress].isSpent = true;
    }

    function getTreatmentsForLicense(address _licenseAddress)
        external
        view
        override
        returns (address[] memory)
    {
        return treatmentsPerformedByLicense[_licenseAddress];
    }

    function getTreatmentData(address _treatmentAddress)
        external
        view
        override
        returns (address, address, bytes32, string memory, bool)
    {
        return (
            treatments[_treatmentAddress].approvingLicense,
            treatments[_treatmentAddress].treatmentProvider,
            treatments[_treatmentAddress].fullDataHash,
            treatments[_treatmentAddress].fullDataURL,
            treatments[_treatmentAddress].isSpent
        );
    }

    function isTreatmentSpent(address _treatmentAddress)
        external
        view
        override
        returns (bool)
    {
        return treatments[_treatmentAddress].isSpent;
    }

    function isTreatmentInstanced(address _treatmentAddress)
        external
        view
        override
        returns (bool)
    {
        return treatments[_treatmentAddress].isInstanced;
    }
}
