var AuthorityManager = artifacts.require("./AuthorityManager.sol");
var LicenseProvider = artifacts.require("./LicenseProvider.sol");
var fs = require("fs");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(LicenseProvider, AuthorityManager.address, {
    from: accounts[3]
  });

  var previousAddresses = JSON.parse(fs.readFileSync("shared/addresses.json"));

  var json = JSON.stringify({
    ...previousAddresses,
    licenseProvider: LicenseProvider.address
  });
  fs.writeFileSync("shared/addresses.json", json);
};
