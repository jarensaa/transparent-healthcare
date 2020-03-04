import React, { FunctionComponent, useState, ChangeEvent } from "react";
import {
  Button,
  Intent,
  Popover,
  Position,
  FormGroup,
  InputGroup,
  Classes,
  ButtonGroup
} from "@blueprintjs/core";
import styled from "styled-components";
import useProposalApi from "../../../hooks/useProposalApi";

const PopoverWrapper = styled.div`
  padding: 20px;
  background-color: white;
  min-height: 100px;
  width: 300px;
`;

const MarginWrapper = styled.div`
  margin-top: 10px;
`;

const AddProposalContent: FunctionComponent = () => {
  const [target, setTarget] = useState<string>("");
  const [type, setType] = useState<number>(-1);

  const { postProposal } = useProposalApi();

  const isReadyForSubmit: boolean =
    target.startsWith("0x") && (type === 1 || type === 2);

  return (
    <PopoverWrapper>
      <FormGroup
        helperText="Target address on format 0x..."
        label="Target address"
        labelFor="text-input"
        labelInfo="(required)"
      >
        <InputGroup
          value={target}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setTarget(event.currentTarget.value)
          }
        />
      </FormGroup>
      <MarginWrapper>
        <ButtonGroup>
          <Button active={type === 1} onClick={() => setType(1)}>
            Add Authority
          </Button>
          <Button active={type === 2} onClick={() => setType(2)}>
            Remove Authority
          </Button>
        </ButtonGroup>
      </MarginWrapper>

      <MarginWrapper>
        <Button
          disabled={!isReadyForSubmit}
          className={Classes.POPOVER_DISMISS}
          onClick={() => postProposal(target, type)}
          intent={Intent.SUCCESS}
          text={"Submit proposal"}
        ></Button>
      </MarginWrapper>
    </PopoverWrapper>
  );
};

const AddProposalButton: FunctionComponent = () => {
  return (
    <Popover
      content={<AddProposalContent />}
      position={Position.BOTTOM_LEFT}
      hasBackdrop
    >
      <Button intent={Intent.PRIMARY} text={"Add proposal"} />
    </Popover>
  );
};

export default AddProposalButton;
