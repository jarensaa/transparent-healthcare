import React from "react";
import { type } from "os";
import AuthorizationKey from "../dto/KeyAuthorization";
import endpoints from "../config/endpoints";

type AccountApi = {
  getNewGeneratedKey(): Promise<AuthorizationKey>;
};

const useAccountApi = (): AccountApi => {
  const getNewGeneratedKey = async (): Promise<AuthorizationKey> => {
    return fetch(endpoints.accounts.generate)
      .then(res => res.json())
      .then((res: AuthorizationKey) => res);
  };

  return { getNewGeneratedKey: getNewGeneratedKey };
};

export default useAccountApi;
