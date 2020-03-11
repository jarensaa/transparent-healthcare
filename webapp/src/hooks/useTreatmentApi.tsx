import { useContext } from "react";
import ToastContext from "../context/ToastContext";
import TreatmentMessage from "../dto/TreatmentMessage";
import endpoints from "../config/endpoints";

const useTreatmentApi = () => {
  const { showFailure } = useContext(ToastContext);

  const getTreatmentFromAddress = async (
    address: string
  ): Promise<TreatmentMessage | undefined> => {
    const response = await fetch(endpoints.treatments.getByAddress(address));

    if (response.status === 200) {
      const treatment: TreatmentMessage = await response.json();
      return treatment;
    } else if (response.status === 204) {
      return undefined;
    }

    const error = await response.json();
    showFailure(error.message);
    return undefined;
  };

  const getTreatments = async (): Promise<TreatmentMessage[]> => {
    const response = await fetch(endpoints.treatments.base);

    if (response.status === 200) {
      const treatment: TreatmentMessage[] = await response.json();
      return treatment;
    }

    const error = await response.json();
    showFailure(error.message);
    return [];
  };

  return {
    getTreatmentFromAddress,
    getTreatments
  };
};

export default useTreatmentApi;
