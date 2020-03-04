import React, { useContext, Fragment, FunctionComponent } from "react";
import styled from "styled-components";
import AuthorityContext from "../../context/AuthorityContext";
import ProposalSummaryTable from "./components/ProposalSummaryTable";
import AuthoritiesSummaryTable from "./components/AuthoritiesSummarayTable";
import AddProposalButton from "./components/AddProposalButton";

const AreaGrid = styled.div`
  display: grid;
  grid-template-rows: 80px 50px auto auto;
  grid-template-columns: 200px auto;
  grid-template-areas:
    "title none"
    "buttons buttons"
    "authorities authorities"
    "proposals proposals";
`;

const ProposalsTile = styled.div`
  grid-area: proposals;
`;

const ButtonTile = styled.div`
  grid-area: buttons;
`;

const AuthoritiesTile = styled.div`
  grid-area: authorities;
`;

const Authority: FunctionComponent = () => {
  const authorityContext = useContext(AuthorityContext);

  return (
    <Fragment>
      <AreaGrid>
        <h1>Authority</h1>
        <ButtonTile>
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
