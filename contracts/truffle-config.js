const path = require("path");

module.exports = {
  compilers: {
    solc: {
      version: "0.6.1"
    }
  },
  networks: {
    development: {
      host: process.env.BLOCKCHAIN_HOST || "127.0.0.1",
      port: process.env.BLOCKCHAIN_PORT || 8545,
      network_id: "*" // Match any network id
    }
  }
};
