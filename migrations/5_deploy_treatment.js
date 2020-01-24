var LicenseProvider = artifacts.require("./LicenseProvider.sol");
var TreatmentProvider = artifacts.require("./TreatmentProvider.sol");
var Treatment = artifacts.require("./Treatment.sol");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(
    Treatment,
    LicenseProvider.address,
    TreatmentProvider.address,
    {
      from: accounts[6]
    }
  );
};
