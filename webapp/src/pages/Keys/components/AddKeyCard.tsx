import React, { FunctionComponent, useState, Fragment, Component } from "react";
import {
  Card,
  Colors,
  Icon,
  Button,
  FormGroup,
  Intent
} from "@blueprintjs/core";
import styled from "styled-components";
import ImportKeyPanel from "./ImportKeyPanel";
import AddServerKeyPanel from "./AddServerKeyPanel";
import AddLocalKeyPanel from "./AddLocalKeyPanel";

const CardWrapper = styled.div`
  margin: 10px;
`;

const ContentWrapper = styled.div`
  height: 150px;
  width: 410px;
`;

const Centering = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spacing = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AddKeyCard: FunctionComponent = () => {
  const [panelNumber, setPanelNumber] = useState<number>(0);
  const [panel, setPanel] = useState<JSX.Element | undefined>(undefined);

  const InitialPanel: FunctionComponent = () => {
    return (
      <ContentWrapper onClick={() => setPanelNumber(1)}>
        <Centering>
          <Icon color={Colors.LIGHT_GRAY1} iconSize={70} icon="add"></Icon>
        </Centering>
      </ContentWrapper>
    );
  };

  const completedCallback = () => {
    setPanelNumber(0);
    setPanel(<Fragment />);
  };

  const ButtonsPanel: FunctionComponent = () => {
    const handleImportButtonClick = () => {
      setPanel(<ImportKeyPanel callback={completedCallback} />);
      setPanelNumber(number => number + 1);
    };

    const handleServerGeneration = () => {
      setPanel(<AddServerKeyPanel callback={completedCallback} />);
      setPanelNumber(number => number + 1);
    };

    const handleLocalGeneration = () => {
      setPanel(<AddLocalKeyPanel callback={completedCallback} />);
      setPanelNumber(number => number + 1);
    };

    return (
      <ContentWrapper>
        <Spacing>
          <Icon
            icon="arrow-left"
            onClick={() => setPanelNumber(number => number - 1)}
          ></Icon>
          <FormGroup label={"Select key type"}>
            <ColumnWrapper>
              <Button
                minimal
                intent={Intent.SUCCESS}
                onClick={handleServerGeneration}
              >
                Create new key on server
              </Button>
              <Button
                minimal
                intent={Intent.SUCCESS}
                onClick={handleLocalGeneration}
              >
                Create new key locally
              </Button>
              <Button
                minimal
                intent={Intent.SUCCESS}
                onClick={handleImportButtonClick}
              >
                Import private key
              </Button>
            </ColumnWrapper>
          </FormGroup>
        </Spacing>
      </ContentWrapper>
    );
  };

  const AddKeyPanel: FunctionComponent = () => {
    return (
      <ContentWrapper>
        <Spacing>
          <Icon
            icon="arrow-left"
            onClick={() => setPanelNumber(number => number - 1)}
          ></Icon>

          <ColumnWrapper>{panel ? panel : <Fragment />}</ColumnWrapper>
        </Spacing>
      </ContentWrapper>
    );
  };

  return (
    <CardWrapper>
      <Card
        style={{ backgroundColor: Colors.LIGHT_GRAY4 }}
        elevation={2}
        interactive
      >
        {panelNumber === 0 ? <InitialPanel /> : <Fragment />}
        {panelNumber === 1 ? <ButtonsPanel /> : <Fragment />}
        {panelNumber === 2 ? <AddKeyPanel /> : <Fragment />}
      </Card>
    </CardWrapper>
  );
};

export default AddKeyCard;
