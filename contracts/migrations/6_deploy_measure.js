var Treatment = artifacts.require("./Treatment.sol");
var Measure = artifacts.require("./Measure.sol");
var fs = require("fs");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Measure, Treatment.address, {
    from: accounts[0]
  });

  var previousAddresses = JSON.parse(
    fs.readFileSync("addresses/addresses.json")
  );

  var json = JSON.stringify({
    ...previousAddresses,
    measure: Measure.address
  });
  fs.writeFileSync("addresses/addresses.json", json);
};
