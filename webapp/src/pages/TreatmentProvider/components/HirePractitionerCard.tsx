import React, { FunctionComponent, useContext, ChangeEvent } from "react";
import FancyImageCard from "../../../components/FancyImageCard";

import { ReactComponent as OfficeImage } from "../../../images/undraw_hire_te5y.svg";
import useTreatmentProviderApi from "../../../hooks/useTreatmentProviderApi";
import { H3, InputGroup, FormGroup, Button, Intent } from "@blueprintjs/core";
import useAddress from "../../../hooks/useAddress";
import styled from "styled-components";

const InputGrid = styled.div`
  display: grid;
  grid-auto-columns: minmax(auto, 700px);
  grid-auto-rows: repeat(3, auto);
  gap: 10px;
`;

const HirePractitionerCard: FunctionComponent = () => {
  const { hireLicense } = useTreatmentProviderApi();
  const { address, isValidAddress, setAddress } = useAddress();

  return (
    <FancyImageCard standardWidth LeftImage={OfficeImage}>
      <InputGrid>
        <H3>Hire a new practitioner</H3>
        <FormGroup>
          <InputGrid>
            <InputGroup
              large
              id="text-input"
              placeholder="Practitioner address"
              value={address}
              intent={isValidAddress ? Intent.NONE : Intent.WARNING}
              onChange={(change: ChangeEvent<HTMLInputElement>) =>
                setAddress(change.currentTarget.value)
              }
            />
            <Button
              intent={isValidAddress ? Intent.SUCCESS : Intent.NONE}
              disabled={!isValidAddress}
              minimal
              rightIcon="arrow-right"
              onClick={() => {
                hireLicense(address);
                setAddress("");
              }}
            >
              Hire
            </Button>
          </InputGrid>
        </FormGroup>
      </InputGrid>
    </FancyImageCard>
  );
};

export default HirePractitionerCard;
