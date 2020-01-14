pragma solidity ^0.6.1;
import "./IAuthorization.sol";

contract TreatmentManager {

  IAuthorization authority;
  string stringStore;

  modifier authorityTrusted() {
    require(authority.isAuthorized(msg.sender), "Sender not trusted by Authority");
    _;
  }

  constructor (address _address) public {
    authority = IAuthorization(_address);
  }

  function isAuthorized(address _address) public view returns(bool) {
    return authority.isAuthorized(_address);
  }
}