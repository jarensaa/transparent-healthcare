import React, { useState, FunctionComponent } from "react";

type KeyContext = {
  keys: string[];
  addKey(keys: string): void;
};

const KeyContext = React.createContext<KeyContext>({
  keys: [],
  addKey: () => {}
});

const KeyContextProvider: FunctionComponent = ({ children }) => {
  const [keys, setKeys] = useState<string[]>([]);

  console.log("Key context render");

  const addKey = (key: string): void => {
    setKeys([...keys, key]);
  };

  return (
    <KeyContext.Provider value={{ keys: keys, addKey: addKey }}>
      {children}
    </KeyContext.Provider>
  );
};

export { KeyContextProvider };
export default KeyContext;
