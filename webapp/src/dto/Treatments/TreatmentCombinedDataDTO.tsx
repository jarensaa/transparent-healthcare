import TreatmentContractDataDTO from "./TreatmentContractDataDTO";
import TreatmentFullDataDTO from "./TreatmentFullDataDTO";

type TreatmentCombinedDataDTO = {
  treatmentAddress: string;
  contractData?: TreatmentContractDataDTO;
  fullData?: TreatmentFullDataDTO;
};

export default TreatmentCombinedDataDTO;
