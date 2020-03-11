pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2; //Although marked as experimental, it's considered stable from v0.6.0.
import "./iface/ILicenseProviderManager.sol";
import "./iface/ITreatmentProviderManager.sol";
import "./iface/ITreatment.sol";
import "./iface/IMeasure.sol";

contract Treatment is ITreatment {
    ILicenseProviderManager licenseProvider;
    ITreatmentProviderManager treatmentProvider;
    IMeasure measureContract;
    address creator;

    address[] treatmentsLog;
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
        treatmentsLog.push(_treatmentAddress);
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

    function getTreatmentAddresses() external view returns (address[] memory) {
        return treatmentsLog;
    }

    // We do not return a struct as Web3j does not support this as of writing.
    function getTreatmentsWithData()
        external
        view
        returns (
            address[] memory,
            address[] memory,
            address[] memory,
            bytes32[] memory,
            string[] memory,
            bool[] memory
        )
    {
        uint256 numTreatments = treatmentsLog.length;

        address[] memory returnApprovingLicenses = new address[](numTreatments);
        address[] memory returnTreatmentProvider = new address[](numTreatments);
        bytes32[] memory returnFullDataHash = new bytes32[](numTreatments);
        string[] memory returnFullDataURL = new string[](numTreatments);
        bool[] memory returnIsSpent = new bool[](numTreatments);

        for (uint256 i = 0; i < numTreatments; i++) {
            address treatmentAddress = treatmentsLog[i];
            returnApprovingLicenses[i] = treatments[treatmentAddress]
                .approvingLicense;
            returnTreatmentProvider[i] = treatments[treatmentAddress]
                .treatmentProvider;
            returnFullDataHash[i] = treatments[treatmentAddress].fullDataHash;
            returnFullDataURL[i] = treatments[treatmentAddress].fullDataURL;
            returnIsSpent[i] = treatments[treatmentAddress].isSpent;
        }

        return (
            treatmentsLog,
            returnApprovingLicenses,
            returnTreatmentProvider,
            returnFullDataHash,
            returnFullDataURL,
            returnIsSpent
        );
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
