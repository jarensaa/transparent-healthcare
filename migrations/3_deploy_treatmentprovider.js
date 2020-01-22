var AuthorityManager = artifacts.require("./AuthorityManager.sol");
var TreatmentProvider = artifacts.require("./TreatmentProvider.sol");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(TreatmentProvider, AuthorityManager.address, {
    from: accounts[1]
  });
};
