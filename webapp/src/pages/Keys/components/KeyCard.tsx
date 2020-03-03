import React, { FunctionComponent } from "react";
import Key from "../../../dto/Key";
import { Card, HTMLTable } from "@blueprintjs/core";
import styled from "styled-components";

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
            <tr>
              <th>Private key</th>
              <WrappingTableData>{keyPair.privateKey}</WrappingTableData>
            </tr>
          </tbody>
        </HTMLTable>
      </Card>
    </CardWrapper>
  );
};

export default KeyCard;
