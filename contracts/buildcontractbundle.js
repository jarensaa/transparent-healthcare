const fs = require("fs");

const contracts = [];

const contractDirectory = "build/contracts";
fs.readdirSync(contractDirectory).forEach(file => {
  content = JSON.parse(fs.readFileSync(contractDirectory + "/" + file));

  contract = {
    contractName: content.contractName,
    abi: content.abi
  };

  contracts.push(contract);
});
fs.writeFileSync("shared/contracts.json", JSON.stringify(contracts, null, 2));
