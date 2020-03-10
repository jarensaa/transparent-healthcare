type LicenseProviderMessage = {
  address: string;
  trustingAuthority?: string;
  isTrusted: boolean;
};

export default LicenseProviderMessage;
