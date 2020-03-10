import { useContext } from "react";
import AuthorizationKey from "../dto/KeyAuthorization";
import endpoints from "../config/endpoints";
import Key from "../types/Key";
import ToastContext from "../context/ToastContext";
import KeyContext from "../context/KeyContext";

type AccountApi = {
  getNewGeneratedKey(): Promise<AuthorizationKey>;
  sendFunds(
    fromKey: AuthorizationKey,
    toKey: Key,
    amount: bigint
  ): Promise<boolean>;
};

const useAccountApi = (): AccountApi => {
  const { showFailure, showSuccess } = useContext(ToastContext);
  const { refreshBalances } = useContext(KeyContext);

  const getNewGeneratedKey = async (): Promise<AuthorizationKey> => {
    return fetch(endpoints.accounts.generate)
      .then(res => res.json())
      .then((res: AuthorizationKey) => res);
  };

  const sendFunds = async (
    fromKey: AuthorizationKey,
    toKey: Key,
    amount: bigint
  ): Promise<boolean> => {
    const response = await fetch(
      endpoints.accounts.send(toKey.address, amount),
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + fromKey.token
        }
      }
    );

    if (response.ok) {
      refreshBalances([fromKey.address, toKey.address]);
      showSuccess(
        `Successfully sent ${amount}wei from ${fromKey.address} to ${toKey.address}`
      );
    } else {
      const error = await response.json();
      showFailure(error.message);
    }

    return true;
  };

  return { getNewGeneratedKey: getNewGeneratedKey, sendFunds: sendFunds };
};

export default useAccountApi;
