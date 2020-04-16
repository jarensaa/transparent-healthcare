import config from "./properties";

const endpoints = {
  authority: {
    base: config.authorityBase,
    proposals: config.authorityBase + "/proposals",
    voteOnProposal: (id: number) =>
      config.authorityBase + "/proposals/" + id + "/vote",
    enactProposal: (id: number) =>
      config.authorityBase + "/proposals/" + id + "/enact",
  },
  accounts: {
    base: config.serverUrl + "/accounts",
    authority: config.serverUrl + "/accounts/authority",
    generate: config.serverUrl + "/accounts/create",
    valid: config.serverUrl + "/accounts/valid",
    balance: (address: string) =>
      config.serverUrl + "/accounts/" + address + "/balance",
    send: (address: string, amount: bigint) =>
      config.serverUrl + "/accounts/" + address + "/send/" + amount,
  },
  treatmentProvider: {
    base: config.serverUrl + "/treatmentproviders",
    getByAddress: (address: string) =>
      config.treatmentProviderBase + "/" + address,
    addTrustInAddress: (address: string) =>
      config.treatmentProviderBase + "/" + address + "/addtrust",
    removeTrustInAddress: (address: string) =>
      config.treatmentProviderBase + "/" + address + "/removetrust",
    hireLicense: (licenseAddress: string) =>
      config.treatmentProviderBase + "/licenses/" + licenseAddress + "/hire",
    getTreatmentProvidersForLicense:
      config.treatmentProviderBase + "/licenses/provider",
    getLicensesForTreatmentProvider: config.treatmentProviderBase + "/licenses",
  },
  licenseIssuers: {
    base: config.licenseIssuerBase,
    getByAddress: (address: string) => config.licenseIssuerBase + "/" + address,
    addTrustInIssuer: (address: string) =>
      config.licenseIssuerBase + "/" + address + "/addtrust",
    removeTrustInIssuer: (address: string) =>
      config.licenseIssuerBase + "/" + address + "/removetrust",
    issueLicense: (address: string) =>
      config.licenseBase + "/" + address + "/issue",
    getProposals: (isserAddress: string) =>
      config.licenseIssuerBase + "/" + isserAddress + "/proposals",
  },
  licenseProviders: {
    base: config.licenseProviderBase,
    getByAddress: (address: string) =>
      config.licenseProviderBase + "/" + address,
    addTrustInProvider: (address: string) =>
      config.licenseProviderBase + "/" + address + "/addtrust",
    removeTrustInProvider: (address: string) =>
      config.licenseProviderBase + "/" + address + "/removetrust",
    getProposals: (isserAddress: string) =>
      config.licenseProviderBase + "/" + isserAddress + "/proposals",
  },
  licenses: {
    base: config.licenseBase,
    getByAddress: (address: string) => config.licenseBase + "/" + address,
    proposeIssuerMove: (issuerAddress: string) =>
      config.licenseBase + "/issuer/move/" + issuerAddress,
    approveIssuerMove: (licenseAddress: string) =>
      config.licenseBase + "/issuer/approve/" + licenseAddress,
    proposeProviderMove: (providerAddress: string) =>
      config.licenseBase + "/provider/move/" + providerAddress,
    approveProviderMove: (licenseAddress: string) =>
      config.licenseBase + "/provider/approve/" + licenseAddress,
    isTrusted: (licenseAddress: string) =>
      config.licenseBase + "/" + licenseAddress + "/istrusted",
  },
  patient: {
    base: config.patientBase,
    getToken: config.patientBase + "/token",
    getChallange: config.patientBase + "/challenge",
    registerKey: config.patientBase + "/registerkey",
    valid: config.patientBase + "/validkey",
    getLicensesInfo: config.patientBase + "/licenses",
    getLicenseInfo: (address: string) =>
      config.patientBase + "/licenses/" + address,
  },
  treatments: {
    base: config.treatmentsBase,
    getByAddress: (address: string) => config.treatmentsBase + "/" + address,
    create: config.treatmentsBase + "/create",
    patientProposals: config.treatmentsBase + "/proposals",
    patientApproveProposals: config.treatmentsBase + "/proposals/approve",
    getTreatmentsForLicense: config.treatmentsBase + "/license",
    licenseApproveTreatment: (address: string) =>
      config.treatmentsBase + "/" + address + "/license/approve",
    getTreatmentsForPatient: config.treatmentsBase + "/patient",
  },
  evaluations: {
    base: config.evaluationsBase,
  },
};

export default endpoints;
