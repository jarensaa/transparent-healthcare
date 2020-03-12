import React, { FunctionComponent, Fragment } from "react";
import styled from "styled-components";
import { Card, HTMLTable, Button } from "@blueprintjs/core";
import LicenseProposalMessage from "../../../dto/LicenseProposalMessage";
import FlexColumn from "../../../styles/FlexColumn";

interface ProposalCardProps {
  proposal: LicenseProposalMessage;
  approvable?: boolean;
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
  width: 450px;
`;

const ProposalCard: FunctionComponent<ProposalCardProps> = ({
  proposal,
  approvable,
  approveCallback
}) => {
  return (
    <CardWrapper>
      <Card>
        <TableWrapper>
          <HTMLTable small>
            <FlexColumn>
              <tr>
                <th>License address</th>
                <WrappingTableData>{proposal.licenseAddress}</WrappingTableData>
              </tr>
              {approvable && approveCallback ? (
                <Button
                  onClick={() => approveCallback(proposal.licenseAddress)}
                  minimal
                  rightIcon="arrow-right"
                >
                  Move license to you
                </Button>
              ) : (
                <Fragment />
              )}
            </FlexColumn>
          </HTMLTable>
        </TableWrapper>
      </Card>
    </CardWrapper>
  );
};

export default ProposalCard;
