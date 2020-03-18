import { useState, useContext } from "react";
import Web3Context from "../context/Web3Context";

const useAddress = () => {
  const [address, setCleanAddress] = useState<string>("");
  const { web3 } = useContext(Web3Context);

  const isValidAddress = web3.utils.isAddress(address);

  const setAddress = (address: string) => {
    setCleanAddress(address.toLowerCase());
  };

  return { address, isValidAddress, setAddress };
};

export default useAddress;
