import React, { useState, FunctionComponent, useEffect } from "react";
import endpoints from "../config/endpoints";
import Key from "../types/Key";
import GeneratedKey, { isGeneratedKey } from "../types/GeneratedKey";
import AuthorizationKey, { isAuthorizationKey } from "../dto/KeyAuthorization";

type KeyContext = {
  keys: Key[];
  activeKey?: Key;
  isOriginalAuthority: boolean;
  addKey(keys: Key): void;
  toggleIsAuthority(): void;
  setActiveKey(key: Key): void;
};

const KeyContext = React.createContext<KeyContext>({
  keys: [],
  isOriginalAuthority: false,
  toggleIsAuthority: () => {},
  addKey: () => {},
  setActiveKey: () => {}
});

const serializeKeys = (keys: Key[]): string => {
  return keys
    .map(key => {
      const description = key.description ? key.description : key.address;
      if (isGeneratedKey(key)) {
        return `generated;${key.address};${key.privateKey};${description}`;
      } else if (isAuthorizationKey(key)) {
        return `authorization;${key.address};${key.token};${description}`;
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

  useEffect(() => {
    const serlializedKeys = localStorage.getItem("keys");
    if (serlializedKeys != null) {
      const keys = deserializeKeys(serlializedKeys);
      setKeys(keys);
    }
  }, []);

  useEffect(() => {
    if (isOriginalAuthrority) {
      fetch(endpoints.accounts.authority)
        .then(res => res.json())
        .then((res: AuthorizationKey) => {
          console.log(res);
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

  const addKey = (key: Key): void => {
    setKeys(previousKeyState => {
      const localStorageState = localStorage.getItem("keys");
      const localStorageKeys = localStorageState
        ? deserializeKeys(localStorageState)
        : [];

      localStorage.setItem("keys", serializeKeys([...localStorageKeys, key]));
      return [...previousKeyState, key];
    });
  };

  return (
    <KeyContext.Provider
      value={{
        keys: keys,
        activeKey: activeKey,
        isOriginalAuthority: isOriginalAuthrority,
        toggleIsAuthority: () =>
          setIsOriginalAuthority(prevState => !prevState),
        addKey: addKey,
        setActiveKey: setActiveKey
      }}
    >
      {children}
    </KeyContext.Provider>
  );
};

export { KeyContextProvider };
export default KeyContext;
