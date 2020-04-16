import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Callout,
  Intent,
  Divider,
  Button,
  Icon,
  H4,
  H3,
  H2,
  H5,
} from "@blueprintjs/core";
import useEvaluationApi from "../../hooks/useEvaluationApi";
import PractitionerViewDTO from "../../dto/Evaluation/PractitionerViewDTO";
import { ReactComponent as DoctorImage } from "../../images/undraw_doctor_kw5l.svg";
import FancyImageCard from "../../components/FancyImageCard";
import FlexRow from "../../styles/FlexRow";
import FlexColumn from "../../styles/FlexColumn";
import {
  LeftRightMarginWrapper,
  TopMarginWrapper,
} from "../../styles/MarginWrappers";
import styled from "styled-components";
import PractitionerDialogButton from "./components/PractitionerDetailsCard";

const FancyNumber = styled.div`
  font-size: 40px;
  font-weight: bolder;
  margin-right: 10px;
  margin-top: 2px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr 2fr;
  grid-template-rows: auto auto auto;
  gap: 15px;
`;

const ButtonTile = styled.div`
  grid-column: 3;
  grid-row-start: 3;
`;

const TitleTile = styled.div`
  grid-column-start: span 3;
`;

const PractitionersList: FunctionComponent = () => {
  const { getLicensesView } = useEvaluationApi();
  const [practitioners, setPractitioners] = useState<PractitionerViewDTO[]>([]);

  useEffect(() => {
    getLicensesView().then(setPractitioners);
  }, []);

  const practitionerTiles = practitioners.map((practitioner, index) => (
    <FancyImageCard key={index} LeftImage={DoctorImage} small>
      <CardGrid>
        <TitleTile>
          <H4>Address: {practitioner.license.address}</H4>
        </TitleTile>
        <FlexColumn>
          <H5>Formal trust</H5>
          {practitioner.license.isTrusted ? (
            <Callout intent={Intent.SUCCESS}>
              The pracitioner has formal credentials and is trusted by an
              authorized healthcare institution
            </Callout>
          ) : (
            <Callout intent={Intent.WARNING}>
              The practitioner is not trusted. He either does not have formal
              credentials, or lacks trust from a authorized healthcare
              institution.
            </Callout>
          )}
        </FlexColumn>
        <FlexColumn>
          <H5>Experience</H5>
          <FlexRow>
            <FancyNumber>
              {practitioner.evaluatedTreatments.length +
                practitioner.unevaluatedTreatments.length}
            </FancyNumber>
            <TopMarginWrapper>Treatments performed</TopMarginWrapper>
          </FlexRow>
        </FlexColumn>
        <FlexColumn>
          <H5>Performance</H5>
          <FlexRow>
            <FancyNumber>
              {practitioner.evaluatedTreatments
                .map((p) => p.evaluation.rating)
                .reduce((sum, rating) => sum + rating, 0) /
                practitioner.evaluatedTreatments.length}
            </FancyNumber>
            <TopMarginWrapper>Average treatment rating</TopMarginWrapper>
          </FlexRow>
        </FlexColumn>
        <ButtonTile>
          <PractitionerDialogButton
            practitionerDetails={practitioner}
          ></PractitionerDialogButton>
        </ButtonTile>
      </CardGrid>
    </FancyImageCard>
  ));

  return (
    <div>
      <h2>All practitioners</h2>
      {practitionerTiles}
    </div>
  );
};

export default PractitionersList;
