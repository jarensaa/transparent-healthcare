import { useState, useContext } from "react";
import Web3Context from "../context/Web3Context";

const useAddress = () => {
  const [address, setAddress] = useState<string>("");
  const { web3 } = useContext(Web3Context);

  const isValidAddress = web3.utils.isAddress(address);

  return { address, isValidAddress, setAddress };
};

export default useAddress;
