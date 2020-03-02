import React, { useEffect, useContext, Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import AuthorityEventContext from "../../context/AuthorityEventContext";
import ProposalEvent from "../../dto/ProposalEvent";

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
        <h2>Proposal</h2>
        Loading...
      </Fragment>
    );

  return <h2>Proposal</h2>;
};

export default Proposal;
