import TreatmentCombinedDataDTO from "../dto/Treatments/TreatmentCombinedDataDTO";
import SignatureCheckedTreatment from "../types/SignatureCheckedTreatment";
import { useContext } from "react";
import Web3Context from "../context/Web3Context";

const useCrypto = () => {
  const { web3 } = useContext(Web3Context);

  const verifyEthSignature = (
    data: string,
    signature: string,
    address: string
  ): boolean => {
    var recoveredAddress = web3.eth.accounts.recover(data, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  };

  const getVerifiedTreatmentDTO = (
    treatmentDTO: TreatmentCombinedDataDTO
  ): SignatureCheckedTreatment => {
    let isTreatmentSignatureValid = false;
    let isPatientSignautureValid = false;

    if (treatmentDTO.contractData && treatmentDTO.fullData) {
      const description = treatmentDTO.fullData.fullDescription;
      const treatmentAddress = treatmentDTO.treatmentAddress;

      const dataSignedByTreatmentKey = description.length + description;
      const dataSignedByPatientKey =
        dataSignedByTreatmentKey +
        treatmentAddress.length +
        treatmentAddress.toLowerCase();

      const treatmentKeySignature = treatmentDTO.fullData.treatmentKeySignature;
      const patientKeySignature = treatmentDTO.fullData.patientKeySignature;

      isTreatmentSignatureValid = verifyEthSignature(
        dataSignedByTreatmentKey,
        treatmentKeySignature,
        treatmentAddress
      );

      isPatientSignautureValid = verifyEthSignature(
        dataSignedByPatientKey,
        patientKeySignature,
        treatmentDTO.fullData.patientAddress
      );
    }

    console.log("Treatment signature valid? " + isTreatmentSignatureValid);
    console.log("Patient signature valid? " + isPatientSignautureValid);
    console.log(treatmentDTO);

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
