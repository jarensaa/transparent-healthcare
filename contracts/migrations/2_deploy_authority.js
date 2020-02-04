var AuthorityManager = artifacts.require("./AuthorityManager.sol");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(AuthorityManager, {
    from: accounts[0]
  });
};
