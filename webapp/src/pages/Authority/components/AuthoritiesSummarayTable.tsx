import React, { FunctionComponent } from "react";
import { HTMLTable } from "@blueprintjs/core";

interface AuthoritiesSummarayTableProps {
  authorities: string[];
}

const AuthoritiesSummaryTable: FunctionComponent<AuthoritiesSummarayTableProps> = ({
  authorities
}) => {
  const authoritiesRows = authorities.map(authority => (
    <tr key={authority}>
      <td>{authority}</td>
    </tr>
  ));

  return (
    <HTMLTable>
      <thead>
        <tr>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>{authoritiesRows}</tbody>
    </HTMLTable>
  );
};

export default AuthoritiesSummaryTable;
