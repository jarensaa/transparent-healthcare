import React, { useState, FunctionComponent, useEffect } from "react";
import endpoints from "../config/endpoints";
import Key from "../dto/Key";

type KeyContext = {
  keys: Key[];
  isOriginalAuthority: boolean;
  addKey(keys: Key): void;
  toggleIsAuthority(): void;
};

const KeyContext = React.createContext<KeyContext>({
  keys: [],
  isOriginalAuthority: false,
  toggleIsAuthority: () => {},
  addKey: () => {}
});

const serializeKeys = (keys: Key[]): string => {
  return keys
    .map(key => key.address + "," + key.publicKey + "," + key.privateKey)
    .join(";");
};

const deserializeKeys = (serlializedKeys: string): Key[] => {
  if (!serializeKeys) {
    return [];
  }
  return serlializedKeys
    .split(";")
    .map(keyString => keyString.split(","))
    .map(
      (keyParts): Key => {
        return {
          address: keyParts[0],
          publicKey: keyParts[1],
          privateKey: keyParts[2]
        };
      }
    );
};

const KeyContextProvider: FunctionComponent = ({ children }) => {
  const [keys, setKeys] = useState<Key[]>([]);
  const [isOriginalAuthrority, setIsOriginalAuthority] = useState<boolean>(
    false
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
        .then((res: Key) => {
          setKeys(keys => [...keys, res]);
        });
    } else {
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
        isOriginalAuthority: isOriginalAuthrority,
        toggleIsAuthority: () =>
          setIsOriginalAuthority(prevState => !prevState),
        addKey: addKey
      }}
    >
      {children}
    </KeyContext.Provider>
  );
};

export { KeyContextProvider };
export default KeyContext;
