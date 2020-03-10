const serverUrl = "http://localhost:8080";

const config = {
  contract_file: process.env.REACT_APP_CONTRACT_FILE || "../contracts/shared/",
  serverUrl: serverUrl,
  authorityBase: serverUrl + "/authorities",
  treatmentProviderBase: serverUrl + "/treatmentproviders",
  licenseIssuerBase: serverUrl + "/licenseissuers",
  licenseProviderBase: serverUrl + "/licenseproviders"
};

export default config;
