import React, { FunctionComponent, Fragment } from "react";
import { Card, HTMLTable } from "@blueprintjs/core";
import styled from "styled-components";
import Key from "../../../types/Key";
import { isGeneratedKey } from "../../../types/GeneratedKey";
import { isAuthorizationKey } from "../../../dto/KeyAuthorization";

interface KeyCardProps {
  keyPair: Key;
}

const CardWrapper = styled.div`
  margin: 10px;
`;

const WrappingTableData = styled.td`
  font-size: 12px;
  vertical-align: bottom !important;
  word-break: break-all;
`;

const TableWrapper = styled.div`
  height: 110px;
  width: 410px;
`;

const KeyCard: FunctionComponent<KeyCardProps> = ({ keyPair }) => {
  const headerName = keyPair.description
    ? keyPair.description
    : keyPair.address;

  const detailsBlock = () => {
    if (isGeneratedKey(keyPair)) {
      return (
        <tr>
          <th>Private key</th>
          <WrappingTableData>{keyPair.privateKey}</WrappingTableData>
        </tr>
      );
    }

    if (isAuthorizationKey(keyPair)) {
      return (
        <tr>
          <th>Access token</th>
          <WrappingTableData>{keyPair.token}</WrappingTableData>
        </tr>
      );
    }

    return <Fragment />;
  };

  return (
    <CardWrapper>
      <Card elevation={1}>
        <TableWrapper>
          <HTMLTable small>
            <thead>
              <tr>
                <th>Key name</th>
                <td>{headerName}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Address</th>
                <WrappingTableData>{keyPair.address}</WrappingTableData>
              </tr>
              {detailsBlock()}
            </tbody>
          </HTMLTable>
        </TableWrapper>
      </Card>
    </CardWrapper>
  );
};

export default KeyCard;
