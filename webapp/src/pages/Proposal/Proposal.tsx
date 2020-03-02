import React, { useEffect, useContext, Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import AuthorityEventContext from "../../context/AuthorityEventContext";
import ProposalEvent from "../../dto/ProposalEvent";
import styled from "styled-components";
import { Spinner } from "@blueprintjs/core";
import ProposalInfoTable from "./components/ProposalInfoTable";
import VotersTable from "./components/VotersTable";

const ProposalPanel = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 50px 80px auto auto;
  grid-template-areas:
    "title none"
    "text none"
    "info voters"
    "vote voters";
`;

const Title = styled.h1`
  grid-area: title;
`;

const InfoPanel = styled.div`
  grid-area: info;
`;

const VotersPanel = styled.div`
  grid-area: voters;
`;

const DescriptionArea = styled.div`
  grid-area: text;
`;

const VotePanel = styled.div`
  grid-area: vote;
`;

const Proposal = (): JSX.Element => {
  const { proposalId } = useParams();
  const authorityContext = useContext(AuthorityEventContext);
  const [proposal, setProposal] = useState<ProposalEvent>();

  useEffect(() => {
    const proposalIntId = Number(proposalId);
    setProposal(authorityContext.proposalEventsMap.get(proposalIntId));
  }, [proposalId, authorityContext]);

  if (proposal === undefined)
    return (
      <Fragment>
        <Spinner />
      </Fragment>
    );

  return (
    <ProposalPanel>
      <Title>Proposal</Title>
      <DescriptionArea>
        This page shows the proposal on the blockchain. If you have a key for
        trusted authority, you may vote on the proposal. If the vote is above
        the threshold to be enacted, you can do so on this page as well.
      </DescriptionArea>
      <InfoPanel>
        <h2>Info</h2>
        <ProposalInfoTable proposal={proposal} />
      </InfoPanel>
      <VotePanel>
        <h2>Actions</h2>
      </VotePanel>
      <VotersPanel>
        <h2>Voters</h2>
        <VotersTable proposal={proposal} />
      </VotersPanel>
    </ProposalPanel>
  );
};

export default Proposal;
