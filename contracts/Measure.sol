pragma solidity 0.6.1;
import "./iface/ITreatment.sol";

contract Measure {
    ITreatment treatmentContract;

    constructor(address _treatmentContractAddress) public {
        treatmentContract = ITreatment(_treatmentContractAddress);
    }
}
