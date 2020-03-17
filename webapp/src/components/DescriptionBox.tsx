import React from "react";
import { FunctionComponent } from "react";
import styled from "styled-components";
import { Blockquote } from "@blueprintjs/core";

const Wrapper = styled.div`
  padding: 20px 0px 10px;
  max-width: 700px;
`;

const DescriptionBox: FunctionComponent = ({ children }) => {
  return (
    <Wrapper>
      <Blockquote className="bp3-blockquote">{children}</Blockquote>
    </Wrapper>
  );
};

export default DescriptionBox;
