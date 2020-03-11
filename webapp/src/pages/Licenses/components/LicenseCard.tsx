import React, { FunctionComponent } from "react";
import styled from "styled-components";
import LicenseMessage from "../../../dto/LicenseMessage";
import { Card, HTMLTable } from "@blueprintjs/core";

interface LicenseCardProps {
  license: LicenseMessage;
  approvable?: boolean;
  approveText?: string;
  approveCallback?: (address: string) => {};
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
  height: 150px;
  width: 450px;
`;

const LicenseCard: FunctionComponent<LicenseCardProps> = ({
  license,
  approvable,
  approveCallback
}) => {
  return (
    <CardWrapper>
      <Card>
        <TableWrapper>
          <HTMLTable small>
            <thead>
              <tr>
                <th>License Address</th>
                <WrappingTableData>{license.address}</WrappingTableData>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>License Issuer</th>
                <WrappingTableData>{license.issuer}</WrappingTableData>
              </tr>
              <tr>
                <th>License Provider</th>
                <WrappingTableData>{license.licenseProvider}</WrappingTableData>
              </tr>
              <tr>
                <th>Is Trusted?</th>
                <td>{license.isTrusted ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </HTMLTable>
        </TableWrapper>
      </Card>
    </CardWrapper>
  );
};

export default LicenseCard;
