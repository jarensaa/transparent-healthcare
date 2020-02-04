pragma solidity 0.6.1;
import "./iface/ITreatment.sol";
import "./iface/IMeasure.sol";

contract Measure is IMeasure {
    ITreatment treatmentContract;

    mapping(address => MeasureInstance) measures;

    constructor(address _treatmentContractAddress) public {
        treatmentContract = ITreatment(_treatmentContractAddress);
    }

    function createMeasure(
        uint8 _rating,
        bytes32 _fullMeasureHash,
        string calldata _fullMeasureURL
    ) external override {
        require(
            !treatmentContract.isTreatmentSpent(msg.sender),
            "Treatment is allready evaluated"
        );
        require(
            treatmentContract.isTreatmentInstanced(msg.sender),
            "Treatment is not instanced"
        );
        measures[msg.sender].rating = _rating;
        measures[msg.sender].fullMeasureHash = _fullMeasureHash;
        measures[msg.sender].fullMeasureURL = _fullMeasureURL;
        treatmentContract.spendTreatment(msg.sender);
    }

    function getMeasureForTreatment(address _treatment)
        external
        view
        override
        returns (uint8, bytes32, string memory)
    {
        return (
            measures[_treatment].rating,
            measures[_treatment].fullMeasureHash,
            measures[_treatment].fullMeasureURL
        );
    }

}
