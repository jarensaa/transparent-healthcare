pragma solidity ^0.6.1;

interface IAuthorization {
    function isAuthorized(address _address) external view returns (bool);
}
