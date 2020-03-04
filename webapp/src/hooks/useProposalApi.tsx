import React, { useContext } from "react";
import ProposalEvent from "../dto/ProposalEvent";
import KeyContext from "../context/KeyContext";
import { isAuthorizationKey } from "../dto/KeyAuthorization";
import endpoints from "../config/endpoints";
import ToastContext from "../context/ToastContext";

type ProposalApi = {
  postProposal(target: string, type: number): Promise<boolean>;
  voteOnProposal(id: number): Promise<boolean>;
  enactProposal(id: number): Promise<boolean>;
};

const useProposalApi = (): ProposalApi => {
  const { activeKey } = useContext(KeyContext);
  const { showSuccess, showFailure } = useContext(ToastContext);

  const postProposal = async (
    target: string,
    type: number
  ): Promise<boolean> => {
    if (!activeKey) {
      showFailure("No active key set");
      return false;
    }

    if (!isAuthorizationKey(activeKey)) {
      showFailure("The selected key is not a authorization key");
      return false;
    }

    const proposal: ProposalEvent = {
      proposer: activeKey.address,
      subject: target,
      type: type
    };

    const response = await fetch(endpoints.authority.proposals, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + activeKey.token
      },
      body: JSON.stringify(proposal)
    });

    if (response.ok) {
      showSuccess("Successfully posted proposal");
    }

    return true;
  };

  const voteOnProposal = async (id: number) => {
    if (!activeKey) {
      showFailure("No active key set");
      return false;
    }

    if (!isAuthorizationKey(activeKey)) {
      showFailure("The selected key is not a authorization key");
      return false;
    }

    const response = await fetch(endpoints.authority.voteOnProposal(id), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + activeKey.token
      }
    });

    if (response.ok) {
      showSuccess("Successfully voted on proposal");
    }

    return true;
  };

  const enactProposal = async (id: number) => {
    if (!activeKey) {
      showFailure("No active key set");
      return false;
    }

    if (!isAuthorizationKey(activeKey)) {
      showFailure("The selected key is not a authorization key");
      return false;
    }

    const response = await fetch(endpoints.authority.enactProposal(id), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + activeKey.token
      }
    });

    if (response.ok) {
      showSuccess("Successfully enacted proposal");
    }

    return true;
  };

  return {
    postProposal: postProposal,
    enactProposal: enactProposal,
    voteOnProposal: voteOnProposal
  };
};

export default useProposalApi;
