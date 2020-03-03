import config from "./properties";

const endpoints = {
  authority: {
    base: config.serverUrl + "/authorities",
    proposals: config.serverUrl + "/authorities/proposals"
  },
  accounts: {
    base: config.serverUrl + "/accounts",
    authority: config.serverUrl + "/accounts/authority"
  }
};

export default endpoints;
