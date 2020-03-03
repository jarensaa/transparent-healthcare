import React, {
  useState,
  FunctionComponent,
  useEffect,
  useContext
} from "react";
import endpoints from "../config/endpoints";
import Key from "../dto/Key";
import Web3Context from "./Web3Context";
import { Account } from "web3-core";

type KeyContext = {
  keys: Key[];
  accounts: Account[];
  activeKey?: Key;
  isOriginalAuthority: boolean;
  addKey(keys: Key): void;
  toggleIsAuthority(): void;
  setActiveKey(key: Key): void;
};

const KeyContext = React.createContext<KeyContext>({
  keys: [],
  accounts: [],
  isOriginalAuthority: false,
  toggleIsAuthority: () => {},
  addKey: () => {},
  setActiveKey: () => {}
});

const serializeKeys = (keys: Key[]): string => {
  return keys
    .map(
      key =>
        key.address +
        ";" +
        key.privateKey +
        (key.description ? ";" + key.description : "")
    )
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
          address: keyParts[0],
          privateKey: keyParts[1]
        };
        if (keyParts[2]) {
          key.description = keyParts[2];
        }

        return key;
      }
    );
};

const KeyContextProvider: FunctionComponent = ({ children }) => {
  const { web3 } = useContext(Web3Context);
  const [keys, setKeys] = useState<Key[]>([]);
  const [activeKey, setActiveKey] = useState<Key>();
  const [isOriginalAuthrority, setIsOriginalAuthority] = useState<boolean>(
    true
  );

  const accounts = keys.map(key =>
    web3.eth.accounts.privateKeyToAccount(key.privateKey)
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
        accounts: accounts,
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
