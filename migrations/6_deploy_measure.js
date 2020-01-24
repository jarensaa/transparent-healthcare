var Treatment = artifacts.require("./Treatment.sol");
var Measure = artifacts.require("./Measure.sol");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Measure, Treatment.address, {
    from: accounts[7]
  });
};
