import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  useContext,
  useEffect
} from "react";
import {
  TextArea,
  Intent,
  InputGroup,
  Button,
  Classes
} from "@blueprintjs/core";
import Web3Context from "../../../context/Web3Context";
import styled from "styled-components";
import GeneratedKey from "../../../types/GeneratedKey";
import KeyContext from "../../../context/KeyContext";
import useTokenHeader from "../../../hooks/useTokenHeader";
import endpoints from "../../../config/endpoints";
import KeyRegistationDto from "../../../dto/KeyRegistrationDto";
import ToastContext from "../../../context/ToastContext";
import PatientKey from "../../../types/PatientKey";

const RightAlignedColumn = styled.div`
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

interface NewPatientKeyPanelProps {
  callback: () => void;
}

const NewPatientKeyPanel: FunctionComponent<NewPatientKeyPanelProps> = ({
  callback
}) => {
  const { web3 } = useContext(Web3Context);
  const { addKey } = useContext(KeyContext);
  const { showFailure, showSuccess } = useContext(ToastContext);
  const [keyname, setKeyName] = useState<string>("");
  const { getHeaderWithToken } = useTokenHeader();

  const registerProcess = async () => {
    const tokenResponse = await fetch(endpoints.patient.getToken);
    const token = await tokenResponse.text();

    const challangeResponse = await fetch(endpoints.patient.getChallange, {
      headers: getHeaderWithToken(token)
    });

    const challange = await challangeResponse.text();
    const account = web3.eth.accounts.create();
    const signedMessage = account.sign(challange);

    const challangeSolutionBody: KeyRegistationDto = {
      signature: signedMessage.signature,
      address: account.address
    };

    const finalResponse = await fetch(endpoints.patient.registerKey, {
      method: "POST",
      headers: getHeaderWithToken(token),
      body: JSON.stringify(challangeSolutionBody)
    });

    if (finalResponse.ok) {
      const token = await finalResponse.text();

      const key: PatientKey = {
        address: account.address,
        patientPrivateKey: account.privateKey,
        description: keyname,
        patientToken: token
      };
      addKey(key);
      showSuccess("Successfully completed registration procedure");
      callback();
    } else {
      showFailure("Failed to create and register key");
    }
  };

  return (
    <RightAlignedColumn>
      <InputGroup
        fill
        onChange={(change: ChangeEvent<HTMLInputElement>) =>
          setKeyName(change.currentTarget.value)
        }
        value={keyname}
        placeholder={"Key name"}
      ></InputGroup>

      <Button
        minimal
        className={Classes.POPOVER_DISMISS}
        intent={Intent.SUCCESS}
        onClick={registerProcess}
      >
        Register new patient key
      </Button>
    </RightAlignedColumn>
  );
};

export default NewPatientKeyPanel;
