pragma solidity 0.6.1;

interface ITreatment {
    struct TreatmentInstance {
        address approvingLicense;
        address treatmentProvider;
        bytes32 fullDataHash;
        string fullDataURL;
        bool isSpent;
    }

    function approveTreatment(address _treatmentAddress) external;
    function spendTreatment(address _treatmentAddress) external;
    function registerMeasureContract(address _measureContract) external;

    function createTreatment(
        address _treatmentAddress,
        bytes32 _datahash,
        string calldata _dataLocationURL
    ) external;

    function getTreatmentsForLicense(address _licenseAddress)
        external
        view
        returns (address[] memory);

    function getTreatmentData(address _treatmentAddress)
        external
        view
        returns (address, address, bytes32, string memory, bool);
}
