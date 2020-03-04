import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  useContext,
  useEffect
} from "react";
import styled from "styled-components";
import {
  TextArea,
  Intent,
  InputGroup,
  Button,
  Classes
} from "@blueprintjs/core";
import GeneratedKey from "../../../types/GeneratedKey";
import Web3Context from "../../../context/Web3Context";

const Wrapper = styled.div`
  padding: 20px;
  background-color: white;
  min-height: 100px;
  width: 300px;
`;

const MarginWrapper = styled.div`
  margin-top: 20px;
`;

interface NewKeyProps {
  callback: (key: GeneratedKey) => void;
}

const ImportKeyPopoverContent: FunctionComponent<NewKeyProps> = ({
  callback
}) => {
  const { web3 } = useContext(Web3Context);
  const [keyname, setKeyName] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [validForm, setValidForm] = useState<boolean>(false);

  const generateKeyAndCallback = () => {
    const address = web3.eth.accounts.privateKeyToAccount(privateKey).address;
    callback({
      address: address,
      privateKey: privateKey,
      description: keyname
    });
  };

  useEffect(() => {
    if (privateKey.startsWith("0x") && privateKey.length === 66) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [privateKey]);

  return (
    <Wrapper>
      <InputGroup
        onChange={(change: ChangeEvent<HTMLInputElement>) =>
          setKeyName(change.currentTarget.value)
        }
        value={keyname}
        placeholder={"Key name"}
      ></InputGroup>
      <MarginWrapper>
        <TextArea
          fill
          intent={validForm ? Intent.NONE : Intent.DANGER}
          onChange={change => setPrivateKey(change.currentTarget.value)}
          value={privateKey}
          placeholder={"Private key"}
        ></TextArea>
      </MarginWrapper>
      <MarginWrapper>
        <Button
          disabled={!validForm}
          className={Classes.POPOVER_DISMISS}
          onClick={generateKeyAndCallback}
          intent={Intent.SUCCESS}
        >
          Generate key
        </Button>
      </MarginWrapper>
    </Wrapper>
  );
};

export default ImportKeyPopoverContent;
