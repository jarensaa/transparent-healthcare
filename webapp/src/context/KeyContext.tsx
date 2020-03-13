import React, { useState, FunctionComponent, useEffect } from "react";
import endpoints from "../config/endpoints";
import Key from "../types/Key";
import GeneratedKey, { isGeneratedKey } from "../types/GeneratedKey";
import AuthorizationKey, { isAuthorizationKey } from "../dto/KeyAuthorization";
import useTokenHeader from "../hooks/useTokenHeader";
import PatientKey, { IsPatientKey } from "../types/PatientKey";

type KeyContext = {
  keys: Key[];
  activeKey?: Key;
  isOriginalAuthority: boolean;
  balances: Map<string, bigint>;
  addKey(keys: Key): void;
  toggleIsAuthority(): void;
  setActiveKey(key: Key): void;
  refreshBalances(keys: string[]): void;
};

const KeyContext = React.createContext<KeyContext>({
  keys: [],
  isOriginalAuthority: false,
  balances: new Map(),
  toggleIsAuthority: () => {},
  addKey: () => {},
  setActiveKey: () => {},
  refreshBalances: () => {}
});

const serializeKeys = (keys: Key[]): string => {
  return keys
    .map(key => {
      const description = key.description ? key.description : key.address;
      if (isGeneratedKey(key)) {
        return `generated;${key.address};${key.privateKey};${description}`;
      } else if (isAuthorizationKey(key)) {
        return `authorization;${key.address};${key.token};${description}`;
      } else if (IsPatientKey(key)) {
        return `patient;${key.address};${key.patientPrivateKey};${key.patientToken};${description}`;
      }

      return "";
    })
    .filter(serialization => serialization.length > 30)
    .join(",");
};

const deserializeKeys = (serlializedKeys: string): Key[] => {
  if (!serializeKeys) {
    return [];
  }
  return serlializedKeys
    .split(",")
    .map(keyString => keyString.split(";"))
    .map(
      (keyParts): Key => {
        if (keyParts[0] === "generated") {
          const key: GeneratedKey = {
            address: keyParts[1],
            privateKey: keyParts[2],
            description: keyParts[3]
          };
          return key;
        }

        if (keyParts[0] === "patient") {
          const key: PatientKey = {
            address: keyParts[1],
            patientPrivateKey: keyParts[2],
            patientToken: keyParts[3],
            description: keyParts[4]
          };
          return key;
        }

        if (keyParts[0] === "authorization") {
          const key: AuthorizationKey = {
            address: keyParts[1],
            token: keyParts[2],
            description: keyParts[3]
          };
          return key;
        }
        return {
          address: keyParts[1],
          description: keyParts[2]
        };
      }
    );
};

const KeyContextProvider: FunctionComponent = ({ children }) => {
  const [keys, setKeys] = useState<Key[]>([]);
  const [activeKey, setActiveKey] = useState<Key>();
  const [isOriginalAuthrority, setIsOriginalAuthority] = useState<boolean>(
    true
  );
  const [balances, setBalances] = useState<Map<string, bigint>>(new Map());
  const { getHeaderWithToken } = useTokenHeader();

  const addKey = (key: Key): void => {
    setKeys(previousKeyState => {
      const localStorageState = localStorage.getItem("keys");
      const localStorageKeys = localStorageState
        ? deserializeKeys(localStorageState)
        : [];

      localStorage.setItem("keys", serializeKeys([...localStorageKeys, key]));
      getKeyBalances([key.address]);
      return [...previousKeyState, key];
    });
  };

  const getKeyBalances = async (keys: string[]) => {
    const newBalances = new Map<string, bigint>();
    for (let key of keys) {
      const balance = await fetch(endpoints.accounts.balance(key));
      const parsedBalance: bigint = (await balance.json()) ?? 0;
      newBalances.set(key, parsedBalance);
    }

    setBalances(oldBalance => {
      newBalances.forEach((value, key) => {
        oldBalance.set(key, value);
      });

      oldBalance.forEach((value, key) => {
        newBalances.set(key, value);
      });
      return newBalances;
    });
  };

  useEffect(() => {
    getKeyBalances(keys.map(key => key.address));
  }, [keys]);

  useEffect(() => {
    const loadKeys = async () => {
      const serlializedKeys = localStorage.getItem("keys");
      if (serlializedKeys != null) {
        const allkeys = deserializeKeys(serlializedKeys);

        // First, filter out duplicates
        const foundAddresses = new Set<string>();
        const keys: Key[] = [];

        for (var key of allkeys) {
          if (!foundAddresses.has(key.address)) {
            foundAddresses.add(key.address);
            keys.push(key);
          }
        }

        // Then, divide into authorization, patient and generated keys
        const authorizationKeys = keys.filter(isAuthorizationKey);
        const patientKeys = keys.filter(IsPatientKey);
        const generatedKeys = keys.filter(isGeneratedKey);

        // Generated keys has no server state, so we just set those.
        localStorage.setItem("keys", serializeKeys(generatedKeys));
        setKeys(generatedKeys);

        // This is mostly for development purposes. We check if authorization keys are valid.
        authorizationKeys.forEach(async key => {
          const reponse = await fetch(endpoints.accounts.valid, {
            headers: getHeaderWithToken(key.token)
          });

          const keyIsValid = await reponse.json();
          if (keyIsValid) {
            addKey(key);
          }
        });

        // Finally, we check if the patient keys are valid.
        patientKeys.forEach(async key => {
          const reponse = await fetch(endpoints.patient.valid, {
            headers: getHeaderWithToken(key.patientToken)
          });

          const keyIsValid = await reponse.json();
          if (keyIsValid) {
            addKey(key);
          }
        });
      }
    };
    loadKeys();
  }, []);

  useEffect(() => {
    if (isOriginalAuthrority) {
      fetch(endpoints.accounts.authority)
        .then(res => res.json())
        .then((res: AuthorizationKey) => {
          res.description = "Original authority key";
          setKeys(keys => [...keys, res]);
        });
    } else {
      if (activeKey?.description === "Original authority key") {
        setActiveKey(undefined);
      }
      setKeys(previousKeyState => {
        const localStorageState = localStorage.getItem("keys");
        const localStorageKeys = localStorageState
          ? deserializeKeys(localStorageState)
          : [];
        return localStorageKeys;
      });
    }
  }, [isOriginalAuthrority]);

  return (
    <KeyContext.Provider
      value={{
        keys: keys,
        activeKey: activeKey,
        balances: balances,
        isOriginalAuthority: isOriginalAuthrority,
        toggleIsAuthority: () =>
          setIsOriginalAuthority(prevState => !prevState),
        addKey: addKey,
        setActiveKey: setActiveKey,
        refreshBalances: getKeyBalances
      }}
    >
      {children}
    </KeyContext.Provider>
  );
};

export { KeyContextProvider };
export default KeyContext;
