import React, { useState, FunctionComponent } from "react";
import Web3 from "web3";

type Web3ContextProps = {
  web3: Web3;
};

const Web3Context = React.createContext<Web3ContextProps>({
  web3: new Web3()
});

const Web3ContextProvider: FunctionComponent = ({ children }) => {
  const [web3] = useState<Web3ContextProps>({
    web3: new Web3()
  });

  return <Web3Context.Provider value={web3}>{children}</Web3Context.Provider>;
};

export { Web3ContextProvider };
export default Web3Context;
