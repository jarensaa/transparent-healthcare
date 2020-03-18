import TreatmentCombinedDataDTO from "../dto/Treatments/TreatmentCombinedDataDTO";

interface SignatureCheckedTreatment extends TreatmentCombinedDataDTO {
  validTreatmentSignature: boolean;
  validPatientSignature: boolean;
}

export default SignatureCheckedTreatment;
