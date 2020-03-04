import React, { useContext } from "react";
import ProposalEvent from "../dto/ProposalEvent";
import KeyContext from "../context/KeyContext";
import { isAuthorizationKey } from "../dto/KeyAuthorization";
import endpoints from "../config/endpoints";

type ProposalApi = {
  postProposal(target: string, type: number): Promise<boolean>;
};

const useProposalApi = (): ProposalApi => {
  const { activeKey } = useContext(KeyContext);

  const postProposal = async (
    target: string,
    type: number
  ): Promise<boolean> => {
    if (!activeKey) return false;

    if (!isAuthorizationKey(activeKey)) return false;

    const proposal: ProposalEvent = {
      proposer: activeKey.address,
      subject: target,
      type: type
    };

    const reponse = await fetch(endpoints.authority.proposals, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + activeKey.token
      },
      body: JSON.stringify(proposal)
    });

    console.log(reponse);

    return true;
  };

  return { postProposal: postProposal };
};

export default useProposalApi;
