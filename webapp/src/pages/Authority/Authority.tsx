import React, { useContext, Fragment, FunctionComponent } from "react";
import { Button } from "@blueprintjs/core";
import styled from "styled-components";
import AuthorityContext from "../../context/AuthorityContext";
import ProposalSummaryTable from "./components/ProposalSummaryTable";
import AuthoritiesSummaryTable from "./components/AuthoritiesSummarayTable";

const AuthorityPageWrapper = styled.div`
  display: grid;
  gap: 30px;
  grid-template-rows: auto auto;
  grid-template-columns: auto auto;
  grid-template-areas:
    "title none"
    "authorities proposals";

  @media only screen and (max-width: 1650px) {
    grid-template-rows: auto;
    grid-template-columns: auto auto auto;
    grid-template-areas:
      "title"
      "authorities"
      "proposals";
  }
`;

const ProposalsTile = styled.div`
  grid-area: proposals;
`;

const TitleTile = styled.div`
  grid-area: title;
`;

const AuthoritiesTile = styled.div`
  grid-area: authorities;
`;

const Authority: FunctionComponent = () => {
  const authorityContext = useContext(AuthorityContext);

  return (
    <Fragment>
      <AuthorityPageWrapper>
        <TitleTile>
          <h2>Authority</h2>
          <Button text={"select key"} />
        </TitleTile>
        <AuthoritiesTile>
          <h2>Authorities</h2>
          <AuthoritiesSummaryTable authorities={authorityContext.authorities} />
        </AuthoritiesTile>
        <ProposalsTile>
          <h2>Proposals</h2>
          <ProposalSummaryTable proposals={authorityContext.proposalEvents} />
        </ProposalsTile>
      </AuthorityPageWrapper>
    </Fragment>
  );
};

export default Authority;
