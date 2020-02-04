pragma solidity 0.6.1;
import "./iface/ITreatment.sol";
import "./iface/IMeasure.sol";

contract Measure is IMeasure {
    ITreatment treatmentContract;

    constructor(address _treatmentContractAddress) public {
        treatmentContract = ITreatment(_treatmentContractAddress);
    }

    function createMeasure(
        uint8 _rating,
        bytes32 _fullMeasureHash,
        string calldata _fullMeasureURL
    ) external override {}

    function getMeasureForTreatment(address _treatment)
        external
        view
        override
        returns (uint8, bytes32, string memory)
    {}

}
