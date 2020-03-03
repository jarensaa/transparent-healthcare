import React, { FunctionComponent } from "react";
import ProposalEvent from "../../../dto/ProposalEvent";
import { HTMLTable } from "@blueprintjs/core";

interface VotersTableProps {
  proposal: ProposalEvent;
}

const VotersTable: FunctionComponent<VotersTableProps> = ({ proposal }) => {
  const votersRows =
    proposal.voters == null ? (
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
          <th>Voters</th>
        </tr>
      </thead>
      <tbody>{votersRows}</tbody>
    </HTMLTable>
  );
};

export default VotersTable;
