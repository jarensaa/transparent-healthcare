import TreatmentProviderMessage from "../dto/TreatmentProvider";
import endpoints from "../config/endpoints";
import useTokenHeader from "./useTokenHeader";
import { useContext } from "react";
import ToastContext from "../context/ToastContext";

const useTreatmentProviderApi = () => {
  const { getHeader } = useTokenHeader();
  const { showFailure } = useContext(ToastContext);

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

    if (response.status == 200) {
      return response.json();
    }

    return;
  };

  const registerKey = async (): Promise<boolean> => {
    const response = await fetch(endpoints.treatmentProvider.base, {
      method: "POST",
      headers: getHeader()
    });

    if (response.status == 200) {
      return true;
    } else {
      showFailure("Failed to get provider info");
    }

    return false;
  };

  return {
    getTreatmentProviders,
    getTreatmentProvider,
    registerKey
  };
};

export default useTreatmentProviderApi;
