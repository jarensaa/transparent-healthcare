var fs = require("fs");
var AuthorityManager = artifacts.require("./AuthorityManager.sol");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(AuthorityManager, {
    from: accounts[0]
  });

  var json = JSON.stringify({ authority: AuthorityManager.address });
  fs.writeFileSync("addresses/addresses.json", json);
};
