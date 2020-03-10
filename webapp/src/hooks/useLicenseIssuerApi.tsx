import endpoints from "../config/endpoints";
import useTokenHeader from "./useTokenHeader";
import { useContext } from "react";
import ToastContext from "../context/ToastContext";
import LicenseIssuerMessage from "../dto/LicenseIssuerMessage";

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

  return {
    getLicenseIssuers,
    addTrustInLicenseIssuer,
    removeTrustInLicenseIssuer,
    registerKey
  };
};

export default useLicenseIssuerApi;
