import TreatmentProviderMessage from "../dto/TreatmentProvider";
import endpoints from "../config/endpoints";
import useTokenHeader from "./useTokenHeader";
import { useContext } from "react";
import ToastContext from "../context/ToastContext";
import TreatmentProviderHireDTO from "../dto/TreatmentProvider/TreatmentProviderHireDTO";

const useTreatmentProviderApi = () => {
  const { getHeader } = useTokenHeader();
  const { showFailure, showSuccess } = useContext(ToastContext);

  const getTreatmentProviders = async (): Promise<TreatmentProviderMessage[]> => {
    const response = await fetch(endpoints.treatmentProvider.base);

    if (response.ok) {
      return response.json();
    }

    return [];
  };

  const getTreatmentProvider = async (
    address: string
  ): Promise<TreatmentProviderMessage | undefined> => {
    const response = await fetch(
      endpoints.treatmentProvider.getByAddress(address)
    );

    if (response.status === 200) {
      return response.json();
    }

    return;
  };

  const addTrustInProvider = async (address: string): Promise<boolean> => {
    const response = await fetch(
      endpoints.treatmentProvider.addTrustInAddress(address),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.ok) {
      showSuccess("Sucessfully added trust in provider");
      return true;
    } else {
      const errorText = await response.json();
      showFailure(errorText.message);
      return false;
    }
  };

  const removeTrustInProvider = async (address: string): Promise<boolean> => {
    const response = await fetch(
      endpoints.treatmentProvider.removeTrustInAddress(address),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.ok) {
      showSuccess("Sucessfully removed trust in provider");
      return true;
    } else {
      const errorText = await response.json();
      showFailure(errorText.message);
      return false;
    }
  };

  const registerKey = async (): Promise<boolean> => {
    const response = await fetch(endpoints.treatmentProvider.base, {
      method: "POST",
      headers: getHeader()
    });

    if (response.status === 200) {
      showSuccess("Successfully registered as a provider");
      return true;
    } else {
      const parsedResponse = await response.json();
      showFailure(parsedResponse.message);
    }

    return false;
  };

  const hireLicense = async (licenseAddress: string) => {
    const response = await fetch(
      endpoints.treatmentProvider.hireLicense(licenseAddress),
      { method: "POST", headers: getHeader() }
    );

    if (response.status === 200) {
      showSuccess("Successfully hired license");
    } else {
      const parsedResponse = await response.json();
      showFailure(parsedResponse.message);
    }
  };

  const getLicensesForProvider = async (): Promise<TreatmentProviderHireDTO[]> => {
    const response = await fetch(
      endpoints.treatmentProvider.getLicensesForTreatmentProvider,
      { headers: getHeader() }
    );

    if (response.status === 200) {
      return await response.json();
    }
    const parsedResponse = await response.json();
    showFailure(parsedResponse.message);
    return [];
  };

  const getProvidersForLicense = async (): Promise<TreatmentProviderHireDTO[]> => {
    const response = await fetch(
      endpoints.treatmentProvider.getTreatmentProvidersForLicense,
      { headers: getHeader() }
    );

    if (response.status === 200) {
      return await response.json();
    }
    const parsedResponse = await response.json();
    showFailure(parsedResponse.message);
    return [];
  };

  return {
    getTreatmentProviders,
    getTreatmentProvider,
    addTrustInProvider,
    removeTrustInProvider,
    registerKey,
    hireLicense,
    getLicensesForProvider,
    getProvidersForLicense
  };
};

export default useTreatmentProviderApi;
