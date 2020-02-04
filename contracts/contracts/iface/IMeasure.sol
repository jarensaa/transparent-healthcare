pragma solidity 0.6.1;

interface IMeasure {
    struct MeasureInstance {
        uint8 rating;
        bytes32 fullMeasureHash;
        string fullMeasureURL;
    }

    function createMeasure(
        uint8 _rating,
        bytes32 _fullMeasureHash,
        string calldata _fullMeasureURL
    ) external;

    function getMeasureForTreatment(address _treatment)
        external
        view
        returns (uint8, bytes32, string memory);

}
