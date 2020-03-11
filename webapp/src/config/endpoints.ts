import config from "./properties";

const endpoints = {
  authority: {
    base: config.authorityBase,
    proposals: config.authorityBase + "/proposals",
    voteOnProposal: (id: number) =>
      config.authorityBase + "/proposals/" + id + "/vote",
    enactProposal: (id: number) =>
      config.authorityBase + "/proposals/" + id + "/enact"
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
      config.treatmentProviderBase + "/" + address,
    addTrustInAddress: (address: string) =>
      config.treatmentProviderBase + "/" + address + "/addtrust",
    removeTrustInAddress: (address: string) =>
      config.treatmentProviderBase + "/" + address + "/removetrust"
  },
  licenseIssuers: {
    base: config.licenseIssuerBase,
    getByAddress: (address: string) => config.licenseIssuerBase + "/" + address,
    addTrustInIssuer: (address: string) =>
      config.licenseIssuerBase + "/" + address + "/addtrust",
    removeTrustInIssuer: (address: string) =>
      config.licenseIssuerBase + "/" + address + "/removetrust"
  },
  licenseProviders: {
    base: config.licenseProviderBase,
    getByAddress: (address: string) =>
      config.licenseProviderBase + "/" + address,
    addTrustInProvider: (address: string) =>
      config.licenseProviderBase + "/" + address + "/addtrust",
    removeTrustInProvider: (address: string) =>
      config.licenseProviderBase + "/" + address + "/removetrust"
  },
  treatments: {
    base: config.treatmentsBase,
    getByAddress: (address: string) => config.treatmentsBase + "/" + address
  }
};

export default endpoints;
