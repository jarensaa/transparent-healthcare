import config from "./properties";

const endpoints = {
  authority: {
    base: config.serverUrl + "/authorities",
    proposals: config.serverUrl + "/authorities/proposals",
    voteOnProposal: (id: number) =>
      config.serverUrl + "/authorities/proposals/" + id + "/vote",
    enactProposal: (id: number) =>
      config.serverUrl + "/authorities/proposals/" + id + "/enact"
  },
  accounts: {
    base: config.serverUrl + "/accounts",
    authority: config.serverUrl + "/accounts/authority",
    generate: config.serverUrl + "/accounts/create",
    valid: config.serverUrl + "/accounts/valid",
    balance: (address: string) =>
      config.serverUrl + "/accounts/" + address + "/balance",
    send: (address: string, amount: bigint) =>
      config.serverUrl + "/accounts/" + address + "/send/" + amount
  },
  treatmentProvider: {
    base: config.serverUrl + "/treatmentproviders",
    getByAddress: (address: string) =>
      config.serverUrl + "/treatmentproviders/" + address
  }
};

export default endpoints;
