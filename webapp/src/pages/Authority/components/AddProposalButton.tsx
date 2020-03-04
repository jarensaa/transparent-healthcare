import React, { FunctionComponent } from "react";
import {
  Button,
  Intent,
  Popover,
  Position,
  FormGroup,
  InputGroup
} from "@blueprintjs/core";
import styled from "styled-components";

const PopoverWrapper = styled.div`
  padding: 20px;
  background-color: white;
  min-height: 100px;
  width: 300px;
`;

const AddProposalContent: FunctionComponent = () => {
  return (
    <PopoverWrapper>
      <FormGroup
        helperText="Helper text with details..."
        label="Target address"
        labelFor="text-input"
        labelInfo="(required)"
      >
        <InputGroup />
      </FormGroup>
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
