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
import SendFundsPanel from "./components/SendFundsPanel";

const KeyAreaWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
  grid-area: keys;
`;

const AreaGrid = styled.div`
  display: grid;
  grid-template-rows: 80px auto auto auto;
  grid-template-columns: 200px auto;
  grid-template-areas:
    "title none"
    "send send"
    "buttons buttons"
    "keys keys";
`;

const ButtonArea = styled.div`
  grid-area: buttons;
`;

const SendWrapper = styled.div`
  grid-area: send;
  padding-right: 70px;
  padding-left: 10px;
  max-width: 1000px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 200px;
  margin-bottom: 20px;
`;

const Keys: FunctionComponent = () => {
  const { keys, addKey, balances } = useContext(KeyContext);
  const { web3 } = useContext(Web3Context);
  const { getNewGeneratedKey } = useAccountApi();

  const keyListing = keys.map((key, index) => (
    <KeyCard key={index} keyPair={key} balances={balances} />
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
      <h1>Keys and funds</h1>
      <SendWrapper>
        <SendFundsPanel />
      </SendWrapper>
      <ButtonArea>
        <h2>Key management</h2>
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
