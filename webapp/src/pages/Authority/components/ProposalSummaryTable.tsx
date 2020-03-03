import React, { FunctionComponent } from "react";
import ProposalEvent from "../../../dto/ProposalEvent";
import { HTMLTable, Colors } from "@blueprintjs/core";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

interface ProposalInfoTableProps {
  proposals: ProposalEvent[];
}

const ClickableRow = styled.tr`
  &:hover {
    background-color: ${Colors.LIGHT_GRAY1};
    cursor: pointer;
  }
`;

const ProposalSummaryTable: FunctionComponent<ProposalInfoTableProps> = ({
  proposals
}) => {
  const history = useHistory();

  const goToProposalPage = (proposalId: number) => {
    history.push("/proposal/" + proposalId);
  };

  return proposals.length > 0 ? (
    <HTMLTable>
      <thead>
        <tr>
          <th>ID</th>
          <th>ProposalType</th>
          <th>Proposer</th>
          <th>Subject</th>
        </tr>
      </thead>
      <tbody>
        {proposals.map((event, index) => (
          <ClickableRow key={index} onClick={() => goToProposalPage(event.id!)}>
            <td>{event.id}</td>
            <td>{event.type}</td>
            <td>{event.proposer}</td>
            <td>{event.subject}</td>
          </ClickableRow>
        ))}
      </tbody>
    </HTMLTable>
  ) : (
    <div>No proposals present</div>
  );
};

export default ProposalSummaryTable;
