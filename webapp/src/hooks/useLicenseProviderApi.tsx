import endpoints from "../config/endpoints";
import useTokenHeader from "./useTokenHeader";
import { useContext } from "react";
import ToastContext from "../context/ToastContext";
import LicenseProviderMessage from "../dto/LicenseProviderMessage";

const useLicenseProviderApi = () => {
  const { getHeader } = useTokenHeader();
  const { showFailure, showSuccess } = useContext(ToastContext);

  const getLicenseProviders = async (): Promise<LicenseProviderMessage[]> => {
    const response = await fetch(endpoints.licenseProviders.base);

    if (response.ok) {
      return response.json();
    } else {
      const error = await response.json();
      showFailure(error.message);
      return [];
    }
  };

  const getLicenseProvider = async (
    address: string
  ): Promise<LicenseProviderMessage | undefined> => {
    const response = await fetch(
      endpoints.licenseProviders.getByAddress(address)
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

  const addTrustInLicenseProvider = async (
    address: string
  ): Promise<boolean> => {
    const response = await fetch(
      endpoints.licenseProviders.addTrustInProvider(address),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.ok) {
      showSuccess("Sucessfully added trust in license provider");
      return true;
    } else {
      const errorText = await response.json();
      showFailure(errorText.message);
      return false;
    }
  };

  const removeTrustInLicenseProvider = async (
    address: string
  ): Promise<boolean> => {
    const response = await fetch(
      endpoints.licenseProviders.removeTrustInProvider(address),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.ok) {
      showSuccess("Sucessfully removed trust in license provider");
      return true;
    } else {
      const errorText = await response.json();
      showFailure(errorText.message);
      return false;
    }
  };

  const registerKey = async (): Promise<boolean> => {
    const response = await fetch(endpoints.licenseProviders.base, {
      method: "POST",
      headers: getHeader()
    });

    if (response.status === 200) {
      showSuccess("Successfully registered as a license provider");
      return true;
    } else {
      const parsedResponse = await response.json();
      showFailure(parsedResponse.message);
    }

    return false;
  };

  return {
    getLicenseProviders,
    getLicenseProvider,
    addTrustInLicenseProvider,
    removeTrustInLicenseProvider,
    registerKey
  };
};

export default useLicenseProviderApi;
