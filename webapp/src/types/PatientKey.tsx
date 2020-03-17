import Key from "./Key";

interface PatientKey extends Key {
  patientPrivateKey: string;
  patientToken: string;
}

const IsPatientKey = (key: Key | undefined): key is PatientKey => {
  if ((key as PatientKey).patientPrivateKey) return true;
  return false;
};

export { IsPatientKey };
export default PatientKey;
