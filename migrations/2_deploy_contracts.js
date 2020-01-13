var AuthorityManagement = artifacts.require("./AuthorityManagement.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(AuthorityManagement, { from: accounts[0] });
};
