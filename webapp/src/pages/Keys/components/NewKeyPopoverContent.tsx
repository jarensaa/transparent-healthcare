import React, { FunctionComponent, useState, ChangeEvent } from "react";
import styled from "styled-components";
import { Intent, InputGroup, Button, Classes } from "@blueprintjs/core";
import AuthorizationKey from "../../../dto/KeyAuthorization";

const Wrapper = styled.div`
  padding: 20px;
  background-color: white;
  min-height: 100px;
  width: 250px;
`;

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

interface NewKeyProps {
  localGenerateCallback: (keyname: string) => void;
  serverGenerateCallback: (keyname: string) => void;
}

const NewKeyPopoverContent: FunctionComponent<NewKeyProps> = ({
  localGenerateCallback,
  serverGenerateCallback
}) => {
  const [keyname, setKeyName] = useState<string>("");

  return (
    <Wrapper>
      <InputGroup
        onChange={(change: ChangeEvent<HTMLInputElement>) =>
          setKeyName(change.currentTarget.value)
        }
        value={keyname}
        placeholder={"Key name"}
      ></InputGroup>
      <ButtonWrapper>
        <Button
          className={Classes.POPOVER_DISMISS}
          onClick={() => localGenerateCallback(keyname)}
          intent={Intent.SUCCESS}
        >
          Generate key locally
        </Button>
        <ButtonWrapper>
          <Button
            className={Classes.POPOVER_DISMISS}
            onClick={() => serverGenerateCallback(keyname)}
            intent={Intent.SUCCESS}
          >
            Generate key at provider
          </Button>
        </ButtonWrapper>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default NewKeyPopoverContent;
