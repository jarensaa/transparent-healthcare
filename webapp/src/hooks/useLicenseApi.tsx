import useTokenHeader from "./useTokenHeader";
import { useContext } from "react";
import ToastContext from "../context/ToastContext";
import LicenseMessage from "../dto/LicenseMessage";
import endpoints from "../config/endpoints";

const useLicenseApi = () => {
  const { showFailure } = useContext(ToastContext);

  const getLicenses = async (): Promise<LicenseMessage[]> => {
    const response = await fetch(endpoints.licenses.base);

    if (response.ok) {
      return response.json();
    } else {
      const error = await response.json();
      showFailure(error.message);
      return [];
    }
  };

  return {
    getLicenses
  };
};

export default useLicenseApi;
