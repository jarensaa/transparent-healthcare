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

  const getLicenseFromAddress = async (
    address: string
  ): Promise<LicenseMessage | undefined> => {
    const response = await fetch(endpoints.licenses.getByAddress(address));

    if (response.status === 200) {
      return response.json();
    } else if (response.status === 204) {
      return undefined;
    } else {
      const error = await response.json();
      showFailure(error.message);
      return undefined;
    }
  };

  return {
    getLicenses,
    getLicenseFromAddress
  };
};

export default useLicenseApi;
