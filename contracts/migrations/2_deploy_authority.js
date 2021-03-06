var fs = require("fs");
var AuthorityManager = artifacts.require("./AuthorityManager.sol");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(AuthorityManager, {
    from: accounts[0]
  });

  if (!fs.existsSync("./addresses")) {
    fs.mkdirSync("./addresses");
  }

  var json = JSON.stringify({ authority: AuthorityManager.address });
  fs.writeFileSync("shared/addresses.json", json);
};
