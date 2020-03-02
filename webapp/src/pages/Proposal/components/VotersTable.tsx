import React, { FunctionComponent } from "react";
import ProposalEvent from "../../../dto/ProposalEvent";
import { HTMLTable } from "@blueprintjs/core";

interface VotersTableProps {
  proposal: ProposalEvent;
}

const VotersTable: FunctionComponent<VotersTableProps> = ({ proposal }) => {
  const votersRows =
    proposal.voters === undefined ? (
      <tr>
        <td>none</td>
      </tr>
    ) : (
      proposal.voters!.map(voter => (
        <tr key={voter}>
          <td>{voter}</td>
        </tr>
      ))
    );

  return (
    <HTMLTable>
      <thead>
        <tr>
          <th>Voter</th>
        </tr>
      </thead>
      <tbody>{votersRows}</tbody>
    </HTMLTable>
  );
};

export default VotersTable;
