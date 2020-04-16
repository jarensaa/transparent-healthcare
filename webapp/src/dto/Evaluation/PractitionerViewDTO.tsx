import LicenseMessage from "../LicenseMessage";
import TreatmentContractDataDTO from "../Treatments/TreatmentContractDataDTO";
import EvaluatedTreatmentDTO from "./EvaluatedTreatmentDTO";

type PractitionerViewDTO = {
  license: LicenseMessage;
  unevaluatedTreatments: TreatmentContractDataDTO[];
  evaluatedTreatments: EvaluatedTreatmentDTO[];
};

export default PractitionerViewDTO;
