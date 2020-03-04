import React, { FunctionComponent } from "react";
import { Card, HTMLTable } from "@blueprintjs/core";
import styled from "styled-components";
import Key from "../../../types/Key";

interface KeyCardProps {
  keyPair: Key;
}

const CardWrapper = styled.div`
  width: 450px;
  margin: 10px;
`;

const WrappingTableData = styled.td`
  font-size: 12px;
  vertical-align: bottom !important;
  word-break: break-all;
`;

const KeyCard: FunctionComponent<KeyCardProps> = ({ keyPair }) => {
  const headerName = keyPair.description
    ? keyPair.description
    : keyPair.address;

  return (
    <CardWrapper>
      <Card elevation={1}>
        <HTMLTable small>
          <thead>
            <tr>
              <th>Key name</th>
              <WrappingTableData>{headerName}</WrappingTableData>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Address</th>
              <WrappingTableData>{keyPair.address}</WrappingTableData>
            </tr>
          </tbody>
        </HTMLTable>
      </Card>
    </CardWrapper>
  );
};

export default KeyCard;
