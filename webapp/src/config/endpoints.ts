import config from "./properties";

const endpoints = {
  authority: {
    base: config.serverUrl + "/authortities",
    proposals: config.serverUrl + "/authorities/proposals"
  }
};

export default endpoints;
