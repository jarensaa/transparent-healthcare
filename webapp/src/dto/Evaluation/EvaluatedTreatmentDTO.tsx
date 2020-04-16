import TreatmentContractDataDTO from "../Treatments/TreatmentContractDataDTO";
import EvaluationDataDTO from "./EvaluationDataDTO";

type EvaluatedTreatmentDTO = {
  treatment: TreatmentContractDataDTO;
  evaluation: EvaluationDataDTO;
};

export default EvaluatedTreatmentDTO;
