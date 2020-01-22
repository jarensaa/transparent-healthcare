var AuthorityManager = artifacts.require("./AuthorityManager.sol");
var LicenseProvider = artifacts.require("./LicenseProvider.sol");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(LicenseProvider, AuthorityManager.address, {
    from: accounts[3]
  });
};
