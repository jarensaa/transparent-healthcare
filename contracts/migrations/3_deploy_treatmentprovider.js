var AuthorityManager = artifacts.require("./AuthorityManager.sol");
var TreatmentProvider = artifacts.require("./TreatmentProvider.sol");
var fs = require("fs");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(TreatmentProvider, AuthorityManager.address, {
    from: accounts[1]
  });

  var previousAddresses = JSON.parse(fs.readFileSync("shared/addresses.json"));

  var json = JSON.stringify({
    ...previousAddresses,
    treatmentProvider: TreatmentProvider.address
  });
  fs.writeFileSync("shared/addresses.json", json);
};
