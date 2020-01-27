pragma solidity 0.6.1;

interface IMeasure {
    struct MeasureInstance {
        address treatment;
        uint8 rating;
        bytes32 fullMeasureHash;
        string fullMeasureURL;
    }

    function createMeasure(
        address _treatment,
        uint8 _rating,
        bytes32 _fullMeasureHash,
        string calldata _fullMeasureURL
    ) external;

    function getMeasureForTreatment(address _treatment)
        external
        view
        returns (address, uint8, bytes32, string memory);

}
