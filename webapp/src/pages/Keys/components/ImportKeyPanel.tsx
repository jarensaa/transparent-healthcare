import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  useContext,
  useEffect
} from "react";
import {
  TextArea,
  Intent,
  InputGroup,
  Button,
  Classes
} from "@blueprintjs/core";
import Web3Context from "../../../context/Web3Context";
import styled from "styled-components";
import GeneratedKey from "../../../types/GeneratedKey";
import KeyContext from "../../../context/KeyContext";

const RightAlignedColumn = styled.div`
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

interface ImportKeyPanelProps {
  callback: () => void;
}

const ImportKeyPanel: FunctionComponent<ImportKeyPanelProps> = ({
  callback
}) => {
  const { web3 } = useContext(Web3Context);
  const [keyname, setKeyName] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [validForm, setValidForm] = useState<boolean>(false);

  const { addKey } = useContext(KeyContext);

  const generateKey = () => {
    const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;

    const key: GeneratedKey = {
      address: address,
      privateKey: privateKey,
      description: keyname
    };
    addKey(key);
    callback();
  };

  useEffect(() => {
    if (privateKey.startsWith("0x") && privateKey.length === 66) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [privateKey]);

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

      <TextArea
        fill
        intent={validForm ? Intent.NONE : Intent.DANGER}
        onChange={change => setPrivateKey(change.currentTarget.value)}
        value={privateKey}
        placeholder={"Private key"}
      ></TextArea>

      <Button
        minimal
        disabled={!validForm}
        className={Classes.POPOVER_DISMISS}
        intent={Intent.SUCCESS}
        onClick={generateKey}
      >
        Import key
      </Button>
    </RightAlignedColumn>
  );
};

export default ImportKeyPanel;
