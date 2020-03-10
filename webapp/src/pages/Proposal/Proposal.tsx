import React, { useContext, Fragment } from "react";
import { useParams } from "react-router-dom";
import AuthorityContext from "../../context/AuthorityContext";
import styled from "styled-components";
import { Spinner, Button, Intent } from "@blueprintjs/core";
import ProposalInfoTable from "./components/ProposalInfoTable";
import VotersTable from "./components/VotersTable";
import KeyContext from "../../context/KeyContext";
import ToastContext from "../../context/ToastContext";
import useProposalApi from "../../hooks/useProposalApi";

const ProposalPanel = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "title none"
    "actions none"
    "info voters";
`;

const HeaderArea = styled.div`
  grid-area: title;
`;

const InfoPanel = styled.div`
  grid-area: info;
`;

const VotersPanel = styled.div`
  grid-area: voters;
`;

const ActionsPanel = styled.div`
  grid-area: actions;
`;

const MarginWrapper = styled.a`
  margin-right: 10px;
`;

const Proposal = (): JSX.Element => {
  const { proposalId } = useParams();
  const { proposalEventsMap, authorities } = useContext(AuthorityContext);
  const { activeKey } = useContext(KeyContext);
  const { showFailure } = useContext(ToastContext);
  const { enactProposal, voteOnProposal } = useProposalApi();

  const proposal = proposalId
    ? proposalEventsMap.get(Number(proposalId))
    : undefined;

  if (proposal === undefined)
    return (
      <Fragment>
        <Spinner />
      </Fragment>
    );

  const isAuthority = activeKey?.address
    ? authorities.includes(activeKey.address)
    : false;

  const voters = proposal.voters ? proposal.voters : [];

  const hasVoted = activeKey?.address
    ? voters.includes(activeKey.address)
    : false;

  const clickVoteButton = () => {
    if (!isAuthority) {
      showFailure(
        "The selected key is not an authority, and therefore cannot vote."
      );
      return;
    }

    if (hasVoted) {
      showFailure("You have allready voted on this proposal");
      return;
    }

    if (proposalId) voteOnProposal(Number(proposalId));
  };

  const clickEnactButton = () => {
    if (!proposal.isActive) {
      showFailure("Proposal is allready enacted");
      return;
    }
    if (proposalId) enactProposal(Number(proposalId));
  };

  return (
    <ProposalPanel>
      <HeaderArea>
        <h1>Proposal</h1>
        Proposal This page shows the proposal on the blockchain. If you have a
        key for a trusted authority, you may vote on the proposal. If the vote
        is above the threshold to be enacted, you can do so on this page as
        well.
      </HeaderArea>

      <ActionsPanel>
        <h2>Actions</h2>
        <MarginWrapper>
          <Button
            intent={hasVoted ? Intent.NONE : Intent.PRIMARY}
            active={hasVoted}
            onClick={clickVoteButton}
          >
            Vote on proposal
          </Button>
        </MarginWrapper>
        <Button
          active={!proposal.isActive}
          intent={proposal.isActive ? Intent.PRIMARY : Intent.NONE}
          onClick={clickEnactButton}
        >
          Enact proposal
        </Button>
      </ActionsPanel>
      <InfoPanel>
        <h2>Info</h2>
        <ProposalInfoTable proposal={proposal} />
      </InfoPanel>
      <VotersPanel>
        <h2>Voters</h2>
        <VotersTable proposal={proposal} />
      </VotersPanel>
    </ProposalPanel>
  );
};

export default Proposal;
