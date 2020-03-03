import React, { useContext, FunctionComponent } from "react";
import KeyContext from "../../context/KeyContext";
import KeyCard from "./components/KeyCard";
import styled from "styled-components";
import { Button, Popover, Position } from "@blueprintjs/core";
import Web3Context from "../../context/Web3Context";
import NewKeyPopoverContent from "./components/NewKeyPopoverContent";
import Key from "../../dto/Key";
import ImportKeyPopoverContent from "./components/ImportKeyPopoverContent";

const KeyAreaWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
  grid-area: keys;
`;

const AreaGrid = styled.div`
  display: grid;
  grid-template-rows: 60px 50px auto;
  grid-template-columns: 200px, auto;
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
  margin-left: 10px;
`;

const Keys: FunctionComponent = () => {
  const { keys, addKey } = useContext(KeyContext);
  const { web3 } = useContext(Web3Context);

  const keyListing = keys.map((key, index) => (
    <KeyCard key={index} keyPair={key} />
  ));

  const generateKeyCallback = (keyname: string) => {
    const keyPair = web3.eth.accounts.create();

    const newKey: Key = {
      description: keyname,
      address: keyPair.address,
      privateKey: keyPair.privateKey
    };

    addKey(newKey);
  };

  return (
    <AreaGrid>
      <h2>Keys</h2>
      <ButtonArea>
        <ButtonWrapper>
          <Popover
            content={<NewKeyPopoverContent callback={generateKeyCallback} />}
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
