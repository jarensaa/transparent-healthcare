import React, { useContext, FunctionComponent } from "react";
import KeyContext from "../../context/KeyContext";
import KeyCard from "./components/KeyCard";
import styled from "styled-components";
import { Button, Popover, Position } from "@blueprintjs/core";
import Web3Context from "../../context/Web3Context";
import NewKeyPopoverContent from "./components/NewKeyPopoverContent";
import GeneratedKey from "../../types/GeneratedKey";
import ImportKeyPopoverContent from "./components/ImportKeyPopoverContent";
import useAccountApi from "../../hooks/useAccountApi";

const KeyAreaWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
  grid-area: keys;
`;

const AreaGrid = styled.div`
  display: grid;
  grid-template-rows: 80px 50px auto;
  grid-template-columns: 200px auto;
  grid-template-areas:
    "title none"
    "buttons buttons"
    "keys keys";
`;

const ButtonArea = styled.div`
  grid-area: buttons;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  margin-right: 10px;
`;

const Keys: FunctionComponent = () => {
  const { keys, addKey } = useContext(KeyContext);
  const { web3 } = useContext(Web3Context);
  const { getNewGeneratedKey } = useAccountApi();

  const keyListing = keys.map((key, index) => (
    <KeyCard key={index} keyPair={key} />
  ));

  const generateLocalKeyCallback = (keyname: string) => {
    const keyPair = web3.eth.accounts.create();

    const newKey: GeneratedKey = {
      description: keyname,
      address: keyPair.address,
      privateKey: keyPair.privateKey
    };

    addKey(newKey);
  };

  const generateServerKeyCallback = (keyname: string) => {
    getNewGeneratedKey().then(key => {
      key.description = keyname;
      addKey(key);
    });
  };

  return (
    <AreaGrid>
      <h1>Keys</h1>
      <ButtonArea>
        <ButtonWrapper>
          <Popover
            content={
              <NewKeyPopoverContent
                serverGenerateCallback={generateServerKeyCallback}
                localGenerateCallback={generateLocalKeyCallback}
              />
            }
            position={Position.BOTTOM_LEFT}
            hasBackdrop
          >
            <Button intent={"primary"}>Generate key</Button>
          </Popover>
        </ButtonWrapper>
        <ButtonWrapper>
          <Popover
            content={<ImportKeyPopoverContent callback={addKey} />}
            position={Position.BOTTOM_LEFT}
            hasBackdrop
          >
            <Button intent={"primary"}>Import key</Button>
          </Popover>
        </ButtonWrapper>
      </ButtonArea>
      <KeyAreaWrapper>{keyListing}</KeyAreaWrapper>
    </AreaGrid>
  );
};

export default Keys;
