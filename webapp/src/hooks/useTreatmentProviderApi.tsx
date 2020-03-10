import TreatmentProviderMessage from "../dto/TreatmentProvider";
import endpoints from "../config/endpoints";
import useTokenHeader from "./useTokenHeader";
import { useContext } from "react";
import ToastContext from "../context/ToastContext";

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

  return {
    getTreatmentProviders,
    getTreatmentProvider,
    addTrustInProvider,
    removeTrustInProvider,
    registerKey
  };
};

export default useTreatmentProviderApi;
