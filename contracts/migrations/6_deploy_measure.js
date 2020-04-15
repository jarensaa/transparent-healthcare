var Treatment = artifacts.require("./Treatment.sol");
var Measure = artifacts.require("./Measure.sol");
var fs = require("fs");

module.exports = async (deployer, network, accounts) => {
  const treatmentInstance = await Treatment.deployed();

  await deployer.deploy(Measure, Treatment.address, {
    from: accounts[0],
  });

  await treatmentInstance.registerMeasureContract(Measure.address, {
    from: accounts[0],
  });

  var previousAddresses = JSON.parse(fs.readFileSync("shared/addresses.json"));

  var json = JSON.stringify(
    {
      ...previousAddresses,
      measure: Measure.address,
    },
    null,
    2
  );
  fs.writeFileSync("shared/addresses.json", json);
};
