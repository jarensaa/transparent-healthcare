pragma solidity 0.6.1;
import "./iface/ISpendableTreatment.sol";

contract Measure {
    ISpendableTreatment treatmentContract;

    constructor(address _treatmentContractAddress) public {
        treatmentContract = ISpendableTreatment(_treatmentContractAddress);
    }
}
