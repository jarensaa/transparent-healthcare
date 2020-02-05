var LicenseProvider = artifacts.require("./LicenseProvider.sol");
var TreatmentProvider = artifacts.require("./TreatmentProvider.sol");
var Treatment = artifacts.require("./Treatment.sol");
var fs = require("fs");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(
    Treatment,
    LicenseProvider.address,
    TreatmentProvider.address,
    {
      from: accounts[0]
    }
  );

  var previousAddresses = JSON.parse(fs.readFileSync("shared/addresses.json"));

  var json = JSON.stringify({
    ...previousAddresses,
    treatment: Treatment.address
  });
  fs.writeFileSync("shared/addresses.json", json);
};
