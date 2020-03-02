import React, { FunctionComponent } from "react";
import ProposalEvent from "../../../dto/ProposalEvent";
import { HTMLTable } from "@blueprintjs/core";
import getStringFormatedProposalType from "./TypeFormater";

interface ProposalInfoTableProps {
  proposal: ProposalEvent;
}

const ProposalInfoTable: FunctionComponent<ProposalInfoTableProps> = ({
  proposal
}) => {
  return (
    <HTMLTable>
      <thead>
        <tr>
          <th>Property</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Id</th>
          <td>{proposal.id ? proposal.id : "none"}</td>
        </tr>
        <tr>
          <th>Type</th>
          <td>{getStringFormatedProposalType(proposal.type)}</td>
        </tr>
        <tr>
          <th>Subject</th>
          <td>{proposal.subject}</td>
        </tr>
        <tr>
          <th>Proposer</th>
          <td>{proposal.proposer}</td>
        </tr>
      </tbody>
    </HTMLTable>
  );
};

export default ProposalInfoTable;
