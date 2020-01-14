pragma solidity ^0.6.1;

contract TreatmentManager {

  string public ret = "hello";

  function getString() public view returns (string memory) {
    return ret;
  }
}