import { useContext } from "react";
import ToastContext from "../context/ToastContext";
import TreatmentContractDataDTO from "../dto/Treatments/TreatmentContractDataDTO";
import endpoints from "../config/endpoints";
import useTokenHeader from "./useTokenHeader";
import TreatmentCreationDTO from "../dto/Treatments/TreatmentCreationDTO";
import TreatmentPatientInfoDTO from "../dto/Treatments/TreatmentPatientInfoDTO";
import Web3Context from "../context/Web3Context";
import KeyContext from "../context/KeyContext";
import { IsPatientKey } from "../types/PatientKey";
import TreatmentApprovePatientDTO from "../dto/Treatments/TreatmentApprovePatientDTO";
import TreatmentCombinedDataDTO from "../dto/Treatments/TreatmentCombinedDataDTO";
import SignatureCheckedTreatment from "../types/SignatureCheckedTreatment";
import useCrypto from "./useCrypto";

type TreatmentKey = {
  address: string;
  privateKey: string;
};

const addTreatmentKeyToLocalStorage = (key: TreatmentKey) => {
  const existingKeys = getTreatmentKeysFromLocalStorage();
  const newKeys = [...existingKeys, key];
  localStorage.setItem("treatmentKeys", JSON.stringify(newKeys));
};

const getTreatmentKeysFromLocalStorage = (): TreatmentKey[] => {
  const keysString = localStorage.getItem("treatmentKeys");

  const keys: TreatmentKey[] = keysString ? JSON.parse(keysString) : [];
  return keys;
};

const useTreatmentApi = () => {
  const { showFailure, showSuccess } = useContext(ToastContext);
  const { getHeader } = useTokenHeader();
  const { web3 } = useContext(Web3Context);
  const { activeKey } = useContext(KeyContext);
  const { getVerifiedTreatmentDTO } = useCrypto();

  const getTreatmentFromAddress = async (
    address: string
  ): Promise<TreatmentContractDataDTO | undefined> => {
    const response = await fetch(endpoints.treatments.getByAddress(address));

    if (response.status === 200) {
      const treatment: TreatmentContractDataDTO = await response.json();
      return treatment;
    } else if (response.status === 204) {
      return undefined;
    }

    const error = await response.json();
    showFailure(error.message);
    return undefined;
  };

  const getTreatments = async (): Promise<TreatmentContractDataDTO[]> => {
    const response = await fetch(endpoints.treatments.base);

    if (response.status === 200) {
      const treatment: TreatmentContractDataDTO[] = await response.json();
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
    const response = await fetch(endpoints.treatments.patientProposals, {
      headers: getHeader()
    });

    if (response.status === 200) {
      return response.json();
    }

    const error = await response.json();
    showFailure(error.message);
    return [];
  };

  const approveTreatment = async (treatment: TreatmentPatientInfoDTO) => {
    if (!activeKey || !IsPatientKey(activeKey)) return;

    const treatmentKeyPair = web3.eth.accounts.create();
    const patientKeyAccount = web3.eth.accounts.privateKeyToAccount(
      activeKey.patientPrivateKey
    );

    const dataToSignByTreatmentKey =
      treatment.description.length + treatment.description;
    const dataToSignByPatientKey =
      dataToSignByTreatmentKey +
      treatmentKeyPair.address.length +
      treatmentKeyPair.address.toLowerCase();

    const treatmentKeySign = treatmentKeyPair.sign(dataToSignByTreatmentKey);
    const patientKeySign = patientKeyAccount.sign(dataToSignByPatientKey);

    const treatmentApprovalDTO: TreatmentApprovePatientDTO = {
      treatmentId: treatment.treatmentId,
      treatmentAddress: treatmentKeyPair.address,
      patientKeySignature: patientKeySign.signature,
      treatmentKeySignature: treatmentKeySign.signature
    };

    addTreatmentKeyToLocalStorage({
      address: treatmentKeyPair.address,
      privateKey: treatmentKeyPair.privateKey
    });

    const response = await fetch(endpoints.treatments.patientApproveProposals, {
      method: "POST",
      headers: getHeader(),
      body: JSON.stringify(treatmentApprovalDTO)
    });

    if (response.status === 200) {
      showSuccess("Successfully approved treatment");
      return;
    }

    const error = await response.json();
    showFailure(error.message);
    return;
  };

  const getTreatmentsForLicense = async (): Promise<SignatureCheckedTreatment[]> => {
    const response = await fetch(endpoints.treatments.getTreatmentsForLicense, {
      headers: getHeader()
    });

    if (response.status === 200) {
      const treatment: TreatmentCombinedDataDTO[] = await response.json();
      return treatment.map(getVerifiedTreatmentDTO);
    }

    const error = await response.json();
    showFailure(error.message);
    return [];
  };

  const licenseApproveTreatment = async (address: string) => {
    const response = await fetch(
      endpoints.treatments.licenseApproveTreatment(address),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.status === 200) {
      showSuccess("Successfully approved treatment");
      return;
    }

    const error = await response.json();
    showFailure(error.message);
  };

  const getTreatmentsForPatient = async (): Promise<TreatmentCombinedDataDTO[]> => {
    const response = await fetch(endpoints.treatments.getTreatmentsForPatient, {
      headers: getHeader()
    });

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
    getPatientTreatmentProposals,
    approveTreatment,
    getTreatmentsForLicense,
    licenseApproveTreatment,
    getTreatmentsForPatient
  };
};

export default useTreatmentApi;
