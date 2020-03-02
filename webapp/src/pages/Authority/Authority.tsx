import React, { useContext, Fragment, useEffect } from "react";
import KeyContext from "../../context/KeyContext";
import { Select } from "@blueprintjs/select";
import { Button, MenuItem, HTMLTable, Colors } from "@blueprintjs/core";
import styled from "styled-components";
import AuthorityEventContext from "../../context/AuthorityEventContext";
import { useHistory } from "react-router-dom";

const AuthorityPageWrapper = styled.div`
  display: grid;
  grid-template-rows: 300px auto;
`;

const ClickableRow = styled.tr`
  &:hover {
    background-color: ${Colors.LIGHT_GRAY1};
    cursor: pointer;
  }
`;

const Authority = () => {
  const { keys } = useContext(KeyContext);
  const propsals = useContext(AuthorityEventContext);
  const history = useHistory();

  const KeySelect = Select.ofType<String>();

  const goToProposalPage = (proposalId: number) => {
    history.push("/proposal/" + proposalId);
  };

  const proposalsTable =
    propsals.proposalEvents.length > 0 ? (
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
          {propsals.proposalEvents.map((event, index) => (
            <ClickableRow
              key={index}
              onClick={() => goToProposalPage(event.id!)}
            >
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

  return (
    <Fragment>
      <AuthorityPageWrapper>
        <div>
          <h2>Authority</h2>
          <KeySelect
            items={keys}
            itemRenderer={item => <MenuItem text="key" />}
            onItemSelect={console.log}
          >
            <Button text={"select key"} />
          </KeySelect>
        </div>
        <div>
          <h2>Proposals</h2>
          {proposalsTable}
        </div>
      </AuthorityPageWrapper>
    </Fragment>
  );
};

export default Authority;
