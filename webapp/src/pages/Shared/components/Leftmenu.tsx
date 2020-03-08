import React, { useContext } from "react";
import styled from "styled-components";
import { Button, Colors, Switch, MenuItem } from "@blueprintjs/core";
import KeyContext from "../../../context/KeyContext";
import { Select, ItemRenderer, ItemPredicate } from "@blueprintjs/select";
import highlightText from "./highlighttext";
import Key from "../../../types/Key";
import Navigation from "./Navigation";

const LeftMenuContainer = styled.div`
  background-color: ${Colors.DARK_GRAY5};
  padding-left: 30px;
  padding-top: 100px;
`;

const ButtonWrapper = styled.div`
  position: fixed;
`;

const BottomWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  color: ${Colors.LIGHT_GRAY2};
`;

const KeySelectWrapper = styled.div`
  padding-bottom: 20px;
`;

const KeySelect = Select.ofType<Key>();

const keyPredicate: ItemPredicate<Key> = (query, key) => {
  if (!key.description) return false;
  const normalizedName = key.description?.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  return normalizedName?.indexOf(normalizedQuery) >= 0;
};

const LeftMenu = () => {
  const {
    keys,
    isOriginalAuthority,
    toggleIsAuthority,
    activeKey,
    setActiveKey
  } = useContext(KeyContext);

  const accountRenderer: ItemRenderer<Key> = (item, { query }) => {
    const label = item.description ? item.description : item.address;
    return (
      <MenuItem
        active={activeKey ? activeKey.address === item.address : false}
        label={item.address}
        key={item.address + Math.random().toString(16)}
        onClick={() => setActiveKey(item)}
        text={highlightText(label, query)}
      />
    );
  };

  return (
    <LeftMenuContainer>
      <ButtonWrapper>
        <Navigation />
      </ButtonWrapper>
      <BottomWrapper>
        <KeySelectWrapper>
          <KeySelect
            items={keys}
            itemRenderer={accountRenderer}
            noResults={<MenuItem disabled={true} text="No results." />}
            onItemSelect={item => {}} // We handle this in the menuItems
            itemPredicate={keyPredicate}
          >
            <Button minimal icon="key" style={{ color: Colors.LIGHT_GRAY2 }}>
              {activeKey?.description
                ? activeKey.description
                : "Select active key"}
            </Button>
          </KeySelect>
        </KeySelectWrapper>
        <Switch checked={isOriginalAuthority} onChange={toggleIsAuthority}>
          Admin mode
        </Switch>
      </BottomWrapper>
    </LeftMenuContainer>
  );
};

export default LeftMenu;
