import React, { FunctionComponent, useContext } from "react";
import { Callout, Intent, Button } from "@blueprintjs/core";
import endpoints from "../../config/endpoints";
import useTokenHeader from "../../hooks/useTokenHeader";
import Web3Context from "../../context/Web3Context";
import KeyRegistationDto from "../../dto/KeyRegistrationDto";

const PatientMyJournalPage: FunctionComponent = () => {
  const { getHeaderWithToken } = useTokenHeader();
  const { web3 } = useContext(Web3Context);

  const registerProcess = async () => {
    const tokenResponse = await fetch(endpoints.patient.getToken);
    const token = await tokenResponse.text();

    const challangeResponse = await fetch(endpoints.patient.getChallange, {
      headers: getHeaderWithToken(token)
    });

    const challange = await challangeResponse.text();

    const account = web3.eth.accounts.create();
    console.log(account.address);
    const signedMessage = account.sign(challange);
    console.log(signedMessage);

    const challangeSolutionBody: KeyRegistationDto = {
      signature: signedMessage.signature,
      address: account.address
    };

    const finalResponse = await fetch(endpoints.patient.registerKey, {
      method: "POST",
      headers: getHeaderWithToken(token),
      body: JSON.stringify(challangeSolutionBody)
    });

    console.log(finalResponse);
  };

  return (
    <div>
      <h2>My journal</h2>
      <Button onClick={registerProcess}>Do it</Button>
    </div>
  );
};

export default PatientMyJournalPage;
