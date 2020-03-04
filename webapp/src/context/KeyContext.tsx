import React, { useState, FunctionComponent, useEffect } from "react";
import endpoints from "../config/endpoints";
import Key from "../types/Key";

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
    .map(key => key.address + (key.description ? ";" + key.description : ""))
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
        const key: Key = {
          address: keyParts[0]
        };
        if (keyParts[1]) {
          key.description = keyParts[1];
        }

        return key;
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
        .then((res: Key) => {
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
