pragma solidity 0.6.1;

interface ITreatmentProviderManager {
    function addSenderAsProvider() external;
    function removeSenderAsProvider() external;
    function addTrustInProvider(address _address) external;
    function removeTrustInProvider(address _address) external;
    function isTrustedProvider(address _address) external view returns (bool);
}
