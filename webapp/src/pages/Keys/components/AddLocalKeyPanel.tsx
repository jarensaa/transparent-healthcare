import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  useContext
} from "react";
import { Intent, InputGroup, Button, Classes } from "@blueprintjs/core";
import styled from "styled-components";
import KeyContext from "../../../context/KeyContext";
import Web3Context from "../../../context/Web3Context";
import GeneratedKey from "../../../types/GeneratedKey";

const RightAlignedColumn = styled.div`
  width: 300px;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
`;

interface AddLocalKeyPanelProps {
  callback: () => void;
}

const AddLocalKeyPanel: FunctionComponent<AddLocalKeyPanelProps> = ({
  callback
}) => {
  const [keyname, setKeyName] = useState<string>("");

  const { addKey } = useContext(KeyContext);
  const { web3 } = useContext(Web3Context);

  const generateLocalKeyCallback = () => {
    const keyPair = web3.eth.accounts.create();

    const newKey: GeneratedKey = {
      description: keyname,
      address: keyPair.address,
      privateKey: keyPair.privateKey
    };

    addKey(newKey);
    callback();
  };

  return (
    <RightAlignedColumn>
      <InputGroup
        fill
        onChange={(change: ChangeEvent<HTMLInputElement>) =>
          setKeyName(change.currentTarget.value)
        }
        value={keyname}
        placeholder={"Key name"}
      ></InputGroup>

      <Button
        minimal
        className={Classes.POPOVER_DISMISS}
        intent={Intent.SUCCESS}
        onClick={generateLocalKeyCallback}
      >
        Generate key locally
      </Button>
    </RightAlignedColumn>
  );
};

export default AddLocalKeyPanel;
