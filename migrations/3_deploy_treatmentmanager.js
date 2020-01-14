var AuthorityManager = artifacts.require("./AuthorityManager.sol");
var TreatmentManager = artifacts.require("./TreatmentManager.sol");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(TreatmentManager, AuthorityManager.address, {
    from: accounts[1]
  });
};
