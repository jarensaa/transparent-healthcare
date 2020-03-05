import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  useContext
} from "react";
import { Intent, InputGroup, Button, Classes } from "@blueprintjs/core";
import styled from "styled-components";
import KeyContext from "../../../context/KeyContext";
import useAccountApi from "../../../hooks/useAccountApi";

const RightAlignedColumn = styled.div`
  width: 300px;
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
`;

interface AddServerKeyPanelProps {
  callback: () => void;
}

const AddServerKeyPanel: FunctionComponent<AddServerKeyPanelProps> = ({
  callback
}) => {
  const [keyname, setKeyName] = useState<string>("");

  const { addKey } = useContext(KeyContext);
  const { getNewGeneratedKey } = useAccountApi();

  const generateServerKey = () => {
    getNewGeneratedKey().then(key => {
      key.description = keyname;
      addKey(key);
      callback();
    });
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
        onClick={generateServerKey}
      >
        Generate key on server
      </Button>
    </RightAlignedColumn>
  );
};

export default AddServerKeyPanel;
