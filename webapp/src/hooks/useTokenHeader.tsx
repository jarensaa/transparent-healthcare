import { isAuthorizationKey } from "../dto/KeyAuthorization";
import { useContext } from "react";
import KeyContext from "../context/KeyContext";
import ToastContext from "../context/ToastContext";
import { IsPatientKey } from "../types/PatientKey";

const getJsonHeaders = (): HeadersInit_ => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json"
  };
};

const getHeaderWithToken = (token: string): HeadersInit_ => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  };
};

const useTokenHeader = () => {
  const { activeKey } = useContext(KeyContext);
  const { showFailure } = useContext(ToastContext);

  const getHeader = (): HeadersInit_ => {
    if (isAuthorizationKey(activeKey)) {
      return getHeaderWithToken(activeKey.token);
    } else if (IsPatientKey(activeKey)) {
      return getHeaderWithToken(activeKey.patientToken);
    }
    showFailure("Tried to get token from key without token.");
    return {};
  };

  return { getHeader, getHeaderWithToken };
};

export default useTokenHeader;
