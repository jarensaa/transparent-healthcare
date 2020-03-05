import React, {
  FunctionComponent,
  useState,
  useContext,
  Fragment
} from "react";
import KeyContext from "../../../context/KeyContext";
import { Select, ItemPredicate, IItemRendererProps } from "@blueprintjs/select";
import Key from "../../../types/Key";
import {
  MenuItem,
  Button,
  Intent,
  FormGroup,
  Card,
  Icon,
  NumericInput
} from "@blueprintjs/core";
import highlightText from "../../Shared/components/highlighttext";
import styled from "styled-components";
import constants from "../../../config/constants";
import FadeIn from "../../../styles/FadeIn";
import useAccountApi from "../../../hooks/useAccountApi";
import { isAuthorizationKey } from "../../../dto/KeyAuthorization";

const SelectionArea = styled.div`
  display: flex;
  flex-direction: row;
`;

const MarginBox = styled.div`
  margin-right: 20px;
`;

const NextStepWrapper = styled.div`
  display: flex;
  flex-direction: row;
  animation: ${FadeIn} 0.3s ease-in;
`;

const IconWrapper = styled.div`
  align-self: center;
  margin-right: 20px;
`;

const KeySelect = Select.ofType<Key>();

const keyPredicate: ItemPredicate<Key> = (query, key) => {
  if (!key.description) return false;
  const normalizedName = key.description?.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  return normalizedName?.indexOf(normalizedQuery) >= 0;
};

const SendFundsPanel: FunctionComponent = () => {
  const [firstAccount, setFirstAccount] = useState<Key>();
  const [amount, setAmount] = useState<number>(0);
  const [secondAccount, setSecondAccount] = useState<Key>();

  const { keys, balances } = useContext(KeyContext);

  const { sendFunds } = useAccountApi();

  const accountRenderer = (
    activeAccount: Key | undefined,
    item: Key,
    { query, handleClick }: IItemRendererProps
  ) => {
    const label =
      (Number(balances.get(item.address)) / constants.weiPerEth ?? 0) + " ETH";

    const name = item.description ?? item.address;

    return (
      <MenuItem
        active={activeAccount?.address === item.address}
        label={label}
        key={item.address + Math.random().toString(16)}
        onClick={handleClick}
        text={highlightText(name, query)}
      />
    );
  };

  const clickSendButton = () => {
    const weiToSend = BigInt(amount * constants.weiPerEth);
    if (isAuthorizationKey(firstAccount) && secondAccount) {
      sendFunds(firstAccount, secondAccount, weiToSend);
      setFirstAccount(undefined);
      setSecondAccount(undefined);
      setAmount(0);
    }
  };

  const firstBalance = firstAccount?.address
    ? balances.get(firstAccount.address) ?? 0
    : 0;

  const secondBalance = secondAccount?.address
    ? balances.get(secondAccount.address) ?? 0
    : 0;

  const isAmountOk = amount < firstBalance;

  const isAllOk =
    firstAccount &&
    isAuthorizationKey(firstAccount) &&
    secondAccount &&
    isAmountOk;

  return (
    <Card>
      <h2>Send funds</h2>
      <SelectionArea>
        <MarginBox>
          <FormGroup label={"Key"} labelInfo={"(send from)"}>
            <KeySelect
              items={keys}
              itemRenderer={(item, props) =>
                accountRenderer(firstAccount, item, props)
              }
              noResults={<MenuItem disabled={true} text="No results." />}
              onItemSelect={item => setFirstAccount(item)}
              itemPredicate={keyPredicate}
            >
              <Button minimal icon="key" intent={Intent.PRIMARY}>
                {firstAccount?.description ?? "Select sending account"}
              </Button>
            </KeySelect>
          </FormGroup>
        </MarginBox>
        {firstAccount ? (
          <NextStepWrapper>
            <IconWrapper>
              <Icon icon="arrow-right"></Icon>
            </IconWrapper>
            <MarginBox>
              <FormGroup label={"Amount"} labelInfo={"(in ETH)"}>
                <NumericInput
                  stepSize={0.1}
                  onValueChange={number => setAmount(number)}
                ></NumericInput>
              </FormGroup>
            </MarginBox>
          </NextStepWrapper>
        ) : (
          <Fragment />
        )}
        {firstAccount && amount > 0 ? (
          <NextStepWrapper>
            <IconWrapper>
              <Icon icon="arrow-right"></Icon>
            </IconWrapper>
            <MarginBox>
              <FormGroup label={"Key"} labelInfo={"(send to)"}>
                <KeySelect
                  items={keys}
                  itemRenderer={(item, props) =>
                    accountRenderer(secondAccount, item, props)
                  }
                  noResults={<MenuItem disabled={true} text="No results." />}
                  onItemSelect={item => setSecondAccount(item)}
                  itemPredicate={keyPredicate}
                >
                  <Button minimal icon="key" intent={Intent.PRIMARY}>
                    {secondAccount?.description ?? "Select receiving key"}
                  </Button>
                </KeySelect>
              </FormGroup>
            </MarginBox>
          </NextStepWrapper>
        ) : (
          <Fragment />
        )}
        {firstAccount && amount > 0 && secondAccount ? (
          <NextStepWrapper>
            <IconWrapper>
              <Icon icon="arrow-right"></Icon>
            </IconWrapper>
            <FormGroup label={"Submit"}>
              <Button
                intent={isAllOk ? Intent.SUCCESS : Intent.DANGER}
                disabled={!isAllOk}
                onClick={clickSendButton}
              >
                {isAllOk ? "Send funds" : "Missing funds"}
              </Button>
            </FormGroup>
          </NextStepWrapper>
        ) : (
          <Fragment />
        )}
      </SelectionArea>
    </Card>
  );
};

export default SendFundsPanel;
