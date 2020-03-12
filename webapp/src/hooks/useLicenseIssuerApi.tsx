import endpoints from "../config/endpoints";
import useTokenHeader from "./useTokenHeader";
import { useContext } from "react";
import ToastContext from "../context/ToastContext";
import LicenseIssuerMessage from "../dto/LicenseIssuerMessage";
import LicenseProposalMessage from "../dto/LicenseProposalMessage";

const useLicenseIssuerApi = () => {
  const { getHeader } = useTokenHeader();
  const { showFailure, showSuccess } = useContext(ToastContext);

  const getLicenseIssuers = async (): Promise<LicenseIssuerMessage[]> => {
    const response = await fetch(endpoints.licenseIssuers.base);

    if (response.ok) {
      return response.json();
    } else {
      const error = await response.json();
      showFailure(error.message);
      return [];
    }
  };

  const getIssuer = async (
    address: string
  ): Promise<LicenseIssuerMessage | undefined> => {
    const response = await fetch(
      endpoints.licenseIssuers.getByAddress(address)
    );

    if (response.status === 200) {
      return response.json();
    } else if (response.status === 204) {
      return undefined;
    } else {
      const error = await response.json();
      showFailure(error.message);
      return undefined;
    }
  };

  const addTrustInLicenseIssuer = async (address: string): Promise<boolean> => {
    const response = await fetch(
      endpoints.licenseIssuers.addTrustInIssuer(address),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.ok) {
      showSuccess("Sucessfully added trust in license issuer");
      return true;
    } else {
      const errorText = await response.json();
      showFailure(errorText.message);
      return false;
    }
  };

  const removeTrustInLicenseIssuer = async (
    address: string
  ): Promise<boolean> => {
    const response = await fetch(
      endpoints.licenseIssuers.removeTrustInIssuer(address),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.ok) {
      showSuccess("Sucessfully removed trust in license issuer");
      return true;
    } else {
      const errorText = await response.json();
      showFailure(errorText.message);
      return false;
    }
  };

  const registerKey = async (): Promise<boolean> => {
    const response = await fetch(endpoints.licenseIssuers.base, {
      method: "POST",
      headers: getHeader()
    });

    if (response.status === 200) {
      showSuccess("Successfully registered as a license issuer");
      return true;
    } else {
      const parsedResponse = await response.json();
      showFailure(parsedResponse.message);
    }

    return false;
  };

  const issueLicense = async (address: string): Promise<boolean> => {
    const response = await fetch(
      endpoints.licenseIssuers.issueLicense(address),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.status === 200) {
      showSuccess("Successfully issued license");
      return true;
    } else {
      const parsedResponse = await response.json();
      showFailure(parsedResponse.message);
    }

    return false;
  };

  const getIssuerProposals = async (
    address: string
  ): Promise<LicenseProposalMessage[]> => {
    const response = await fetch(
      endpoints.licenseIssuers.getProposals(address)
    );

    if (response.status === 200) {
      const proposals: LicenseProposalMessage[] = await response.json();
      return proposals;
    } else {
      const parsedResponse = await response.json();
      showFailure(parsedResponse.message);
      return [];
    }
  };

  return {
    getLicenseIssuers,
    addTrustInLicenseIssuer,
    removeTrustInLicenseIssuer,
    registerKey,
    issueLicense,
    getIssuerProposals,
    getIssuer
  };
};

export default useLicenseIssuerApi;
