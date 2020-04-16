import TreatmentKey from "../types/TreatmentKey";
import { useContext } from "react";
import ToastContext from "../context/ToastContext";
import useTokenHeader from "./useTokenHeader";
import endpoints from "../config/endpoints";
import EvaluationDTO from "../dto/Evaluation/EvaluationDTO";
import PractitionerViewDTO from "../dto/Evaluation/PractitionerViewDTO";

const useEvaluationApi = () => {
  const { showFailure, showSuccess } = useContext(ToastContext);
  const { getHeader } = useTokenHeader();

  const addEvaluation = async (
    treatmentAddress: string,
    treatmentKey: TreatmentKey,
    rating: number
  ) => {
    const body: EvaluationDTO = {
      address: treatmentAddress,
      privateKey: treatmentKey.privateKey,
      rating: rating,
    };

    const response = await fetch(endpoints.evaluations.base, {
      method: "POST",
      headers: getHeader(),
      body: JSON.stringify(body),
    });

    if (response.ok) {
      showSuccess("Successfully rated treatment");
      return response.json();
    } else {
      const error = await response.json();
      showFailure(error.message);
      return false;
    }
  };

  const getLicensesView = async (): Promise<PractitionerViewDTO[]> => {
    const response = await fetch(endpoints.patient.getLicensesInfo);

    if (response.ok) {
      return response.json();
    } else {
      const error = await response.json();
      showFailure(error.message);
      return [];
    }
  };

  return { addEvaluation, getLicensesView };
};

export default useEvaluationApi;
