import LicenseMessage from "../../../dto/LicenseMessage";

type LicenseStore = {
  associatedLicenses: LicenseMessage[];
  unassociatedLicenses: LicenseMessage[];
};

export default LicenseStore;
