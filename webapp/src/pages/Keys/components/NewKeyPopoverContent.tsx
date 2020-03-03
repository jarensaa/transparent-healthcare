import React, { FunctionComponent, useState, ChangeEvent } from "react";
import styled from "styled-components";
import { Intent, InputGroup, Button, Classes } from "@blueprintjs/core";

const Wrapper = styled.div`
  padding: 20px;
  background-color: white;
  min-height: 100px;
  width: 200px;
`;

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

interface NewKeyProps {
  callback: (keyname: string) => void;
}

const NewKeyPopoverContent: FunctionComponent<NewKeyProps> = ({ callback }) => {
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
          onClick={() => callback(keyname)}
          intent={Intent.SUCCESS}
        >
          Generate key
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default NewKeyPopoverContent;
