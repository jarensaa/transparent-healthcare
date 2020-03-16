import React, { Fragment, useState, ChangeEvent } from "react";
import {
  H2,
  FormGroup,
  InputGroup,
  TextArea,
  Intent,
  Button
} from "@blueprintjs/core";
import styled from "styled-components";
import FancyImageCard from "../../../components/FancyImageCard";
import { ReactComponent as TreatmentImage } from "../../../images/undraw_medicine_b1ol.svg";
import useAddress from "../../../hooks/useAddress";

const InputGrid = styled.div`
  display: grid;
  grid-auto-columns: minmax(auto, 700px);
  grid-auto-rows: repeat(3, auto);
  gap: 10px;
`;

const FancyIssueTreatmentsCard = () => {
  const { address, isValidAddress, setAddress } = useAddress();
  const [treatmentDescription, setTreatmentDescription] = useState<string>("");

  const isValidDescription = treatmentDescription.length > 10;

  const isAllValid = isValidDescription && isValidAddress;

  return (
    <FancyImageCard LeftImage={TreatmentImage}>
      <InputGrid>
        <H2>Issue treatment to a patient</H2>
        <FormGroup>
          <InputGrid>
            <InputGroup
              large
              id="text-input"
              placeholder="Patient address"
              value={address}
              intent={isValidAddress ? Intent.NONE : Intent.WARNING}
              onChange={(change: ChangeEvent<HTMLInputElement>) =>
                setAddress(change.currentTarget.value)
              }
            />
            <TextArea
              growVertically
              large
              placeholder="Treatment description"
              value={treatmentDescription}
              intent={isValidDescription ? Intent.NONE : Intent.WARNING}
              onChange={(change: ChangeEvent<HTMLTextAreaElement>) =>
                setTreatmentDescription(change.currentTarget.value)
              }
            ></TextArea>
            <Button
              intent={isAllValid ? Intent.SUCCESS : Intent.NONE}
              disabled={!isAllValid}
              minimal
              rightIcon="arrow-right"
              onClick={() => {
                setTreatmentDescription("");
                setAddress("");
              }}
            >
              Issue treatment
            </Button>
          </InputGrid>
        </FormGroup>
      </InputGrid>
    </FancyImageCard>
  );
};

export default FancyIssueTreatmentsCard;
