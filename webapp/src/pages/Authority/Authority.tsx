import React, { useContext, Fragment, FunctionComponent } from "react";
import styled from "styled-components";
import AuthorityContext from "../../context/AuthorityContext";
import ProposalSummaryTable from "./components/ProposalSummaryTable";
import AuthoritiesSummaryTable from "./components/AuthoritiesSummarayTable";
import AddProposalButton from "./components/AddProposalButton";

const AreaGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 480px auto;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "title none"
    "actions authorities"
    "proposals proposals";
`;

const ProposalsTile = styled.div`
  grid-area: proposals;
`;

const TitleWrapper = styled.div`
  grid-area: title;
`;

const ButtonTile = styled.div`
  grid-area: actions;
`;

const AuthoritiesTile = styled.div`
  grid-area: authorities;
`;

const Authority: FunctionComponent = () => {
  const authorityContext = useContext(AuthorityContext);

  return (
    <Fragment>
      <AreaGrid>
        <TitleWrapper>
          <h1>Authority</h1>
          This is the main admin panel for the top level in the trust hierarchy
          - Authorities. You can see the current authorities, and the proposals
          undergoing a vote among these.
        </TitleWrapper>
        <ButtonTile>
          <h2>Actions</h2>
          <AddProposalButton />
        </ButtonTile>
        <AuthoritiesTile>
          <h2>Authorities</h2>
          <AuthoritiesSummaryTable authorities={authorityContext.authorities} />
        </AuthoritiesTile>
        <ProposalsTile>
          <h2>Proposals</h2>
          <ProposalSummaryTable proposals={authorityContext.proposalEvents} />
        </ProposalsTile>
      </AreaGrid>
    </Fragment>
  );
};

export default Authority;
