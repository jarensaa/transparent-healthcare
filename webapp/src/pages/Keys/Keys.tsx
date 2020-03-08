import React, { useContext, FunctionComponent } from "react";
import KeyContext from "../../context/KeyContext";
import KeyCard from "./components/KeyCard";
import styled from "styled-components";
import SendFundsPanel from "./components/SendFundsPanel";
import AddKeyCard from "./components/AddKeyCard";

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
    "keystitle keystitle"
    "keys keys";
`;

const KeysTitle = styled.div`
  grid-area: keystitle;
`;

const KeysTitleHeader = styled.h2`
  margin-top: 50px;
`;

const SendWrapper = styled.div`
  grid-area: send;
  padding-right: 20px;
  padding-left: 10px;
`;

const Keys: FunctionComponent = () => {
  const { keys, balances } = useContext(KeyContext);

  const keyListing = keys.map((key, index) => (
    <KeyCard key={index} keyPair={key} balances={balances} />
  ));

  return (
    <AreaGrid>
      <h1>Keys and funds</h1>
      <SendWrapper>
        <SendFundsPanel />
      </SendWrapper>
      <KeysTitle>
        <KeysTitleHeader>Key management</KeysTitleHeader>
      </KeysTitle>
      <KeyAreaWrapper>
        {keyListing}
        <AddKeyCard />
      </KeyAreaWrapper>
    </AreaGrid>
  );
};

export default Keys;
