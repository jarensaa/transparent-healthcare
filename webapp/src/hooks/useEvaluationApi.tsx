import TreatmentKey from "../types/TreatmentKey";

const useEvaluationApi = () => {
  const addEvaluation = (
    treatmentAddress: string,
    treatmentKey: TreatmentKey,
    rating: number
  ) => {
    console.log(treatmentAddress, treatmentKey, rating);
  };

  return { addEvaluation };
};

export default useEvaluationApi;
