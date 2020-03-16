import { useContext } from "react";
import ToastContext from "../context/ToastContext";
import TreatmentMessage from "../dto/TreatmentMessage";
import endpoints from "../config/endpoints";
import useTokenHeader from "./useTokenHeader";
import TreatmentCreationDTO from "../dto/Treatments/TreatmentCreationDTO";
import TreatmentPatientInfoDTO from "../dto/Treatments/TreatmentPatientIntoDTO";

const useTreatmentApi = () => {
  const { showFailure, showSuccess } = useContext(ToastContext);
  const { getHeader } = useTokenHeader();

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

  const proposeTreatment = async (
    proposal: TreatmentCreationDTO
  ): Promise<boolean> => {
    const response = await fetch(endpoints.treatments.create, {
      method: "POST",
      headers: getHeader(),
      body: JSON.stringify(proposal)
    });

    if (response.status === 200) {
      showSuccess("Successfully created treatment proposal");
      return true;
    }

    const error = await response.json();
    showFailure("Failed to create proposall. " + error.message);
    return false;
  };

  const getPatientTreatmentProposals = async (): Promise<TreatmentPatientInfoDTO[]> => {
    const response = await fetch(endpoints.treatments.patientProposals);

    if (response.status === 200) {
      return response.json();
    }

    const error = await response.json();
    showFailure(error.message);
    return [];
  };

  return {
    getTreatmentFromAddress,
    getTreatments,
    proposeTreatment,
    getPatientTreatmentProposals
  };
};

export default useTreatmentApi;
