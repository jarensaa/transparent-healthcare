import { isAuthorizationKey } from "../dto/KeyAuthorization";
import { useContext } from "react";
import KeyContext from "../context/KeyContext";
import ToastContext from "../context/ToastContext";

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
    if (!isAuthorizationKey(activeKey)) {
      showFailure("The selected key is not a server key");
      return {};
    }
    return getHeaderWithToken(activeKey.token);
  };

  return { getHeader, getHeaderWithToken };
};

export default useTokenHeader;
