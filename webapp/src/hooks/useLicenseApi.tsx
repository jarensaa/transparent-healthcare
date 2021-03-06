import useTokenHeader from "./useTokenHeader";
import { useContext } from "react";
import ToastContext from "../context/ToastContext";
import LicenseMessage from "../dto/LicenseMessage";
import endpoints from "../config/endpoints";

const useLicenseApi = () => {
  const { showFailure, showSuccess } = useContext(ToastContext);
  const { getHeader } = useTokenHeader();

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

  const proposeIssuerMove = async (issuerAddress: string) => {
    const response = await fetch(
      endpoints.licenses.proposeIssuerMove(issuerAddress),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.status === 200) {
      showSuccess("Proposal to move isser successfully submitted.");
      return response.json();
    } else {
      const error = await response.json();
      showFailure(error.message);
      return undefined;
    }
  };

  const approveIssuerMove = async (licenseAddress: string) => {
    const response = await fetch(
      endpoints.licenses.approveIssuerMove(licenseAddress),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.status === 200) {
      showSuccess("Successfully approved proposal to move issuer of license.");
      return response.json();
    } else {
      const error = await response.json();
      showFailure(error.message);
      return undefined;
    }
  };

  const proposeProviderMove = async (providerAddress: string) => {
    const response = await fetch(
      endpoints.licenses.proposeProviderMove(providerAddress),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.status === 200) {
      showSuccess("Proposal to move license provider successfully submitted.");
      return response.json();
    } else {
      const error = await response.json();
      showFailure(error.message);
      return undefined;
    }
  };

  const approveProviderMove = async (licenseAddress: string) => {
    const response = await fetch(
      endpoints.licenses.approveProviderMove(licenseAddress),
      {
        method: "POST",
        headers: getHeader()
      }
    );

    if (response.status === 200) {
      showSuccess(
        "Successfully approved proposal to move provider of license."
      );
      return response.json();
    } else {
      const error = await response.json();
      showFailure(error.message);
      return undefined;
    }
  };

  const isLicenseTrusted = async (licenseAddress: string): Promise<boolean> => {
    const response = await fetch(endpoints.licenses.isTrusted(licenseAddress));

    if (response.status === 200) {
      return await response.json();
    } else {
      const error = await response.json();
      showFailure(error.message);
      return false;
    }
  };

  return {
    getLicenses,
    getLicenseFromAddress,
    proposeIssuerMove,
    approveIssuerMove,
    proposeProviderMove,
    approveProviderMove,
    isLicenseTrusted
  };
};

export default useLicenseApi;
