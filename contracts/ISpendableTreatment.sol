pragma solidity 0.6.1;

interface ISpendableTreatment {
    function spendTreatment(address _treatmentAddress, uint256 _type) external;
}
