import TreatmentCombinedDataDTO from "../dto/Treatments/TreatmentCombinedDataDTO";
import SignatureCheckedTreatment from "../types/SignatureCheckedTreatment";

const verifySignature = (): boolean => {
  return true;
};

const useCrypto = () => {
  const getVerifiedTreatmentDTO = (
    treatmentDTO: TreatmentCombinedDataDTO
  ): SignatureCheckedTreatment => {
    const isTreatmentSignatureValid = true;
    const isPatientSignautureValid = true;

    return {
      treatmentAddress: treatmentDTO.treatmentAddress,
      contractData: treatmentDTO.contractData,
      fullData: treatmentDTO.fullData,
      validPatientSignature: isPatientSignautureValid,
      validTreatmentSignature: isTreatmentSignatureValid
    };
  };

  return {
    getVerifiedTreatmentDTO
  };
};

export default useCrypto;
