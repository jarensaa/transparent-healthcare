import React, { useContext, useEffect, useState, Fragment } from "react";
import KeyContext from "../../context/KeyContext";
import {
  Callout,
  Card,
  Button,
  Intent,
  Spinner,
  H1,
  H3,
  H2
} from "@blueprintjs/core";
import useTreatmentProviderApi from "../../hooks/useTreatmentProviderApi";
import useTreatmentApi from "../../hooks/useTreatmentApi";
import TreatmentContractDataDTO from "../../dto/Treatments/TreatmentContractDataDTO";
import { TopMarginWrapper } from "../../styles/MarginWrappers";
import TreatmentProviderMessage from "../../dto/TreatmentProvider";
import DescriptionBox from "../../components/DescriptionBox";
import FancyImageCard from "../../components/FancyImageCard";
import { ReactComponent as OfficeImage } from "../../images/undraw_coming_home_52ir.svg";
import FlexColumn from "../../styles/FlexColumn";
import HirePractitionerCard from "./components/HirePractitionerCard";
import HiredPractitionersCard from "./components/HiredPractitionersCard";
import TreatmentProviderTreatmentsCard from "./components/TreatmentProviderTreatmentsCard";

const TreatmentProvider = () => {
  const [treatments, setTreatments] = useState<TreatmentContractDataDTO[]>([]);

  const { getTreatments } = useTreatmentApi();

  const [treatmentProvider, setTreatmentProvider] = useState<
    TreatmentProviderMessage | undefined
  >();

  const { activeKey } = useContext(KeyContext);
  const { registerKey, getTreatmentProvider } = useTreatmentProviderApi();

  useEffect(() => {
    if (activeKey) {
      getTreatmentProvider(activeKey.address).then(setTreatmentProvider);
      getTreatments().then(setTreatments);
    }
  }, [activeKey]);

  const titleArea = (
    <Fragment>
      <H1>Treatment Provider hires and treatments</H1>
      <DescriptionBox>
        Treatment providers are organizations who issue treatments to patients.
        This can be clinics, hospotals, e-health applications etc. They hire
        practitioners who can issue treatments on behalf of the treatment
        provider. They are also responsible for propagating the proposed
        treatments from the practitioner to the patient for approval.
      </DescriptionBox>
    </Fragment>
  );

  if (!activeKey) {
    return (
      <div>
        {titleArea}
        <Callout intent={Intent.WARNING}>
          You must select a key to access this page
        </Callout>
      </div>
    );
  }

  return (
    <FlexColumn>
      {titleArea}
      <H2>Registration status</H2>
      <FancyImageCard standardWidth LeftImage={OfficeImage} small>
        <Callout intent={treatmentProvider ? Intent.SUCCESS : Intent.WARNING}>
          <H3>
            {treatmentProvider
              ? "You are a registered treatment provider"
              : "You are not a registrated treatment provider"}
          </H3>
        </Callout>
        <TopMarginWrapper>
          {treatmentProvider ? (
            <Fragment />
          ) : (
            <Button
              intent={Intent.SUCCESS}
              minimal
              rightIcon="arrow-right"
              onClick={registerKey}
            >
              Register
            </Button>
          )}
        </TopMarginWrapper>
      </FancyImageCard>
      {treatmentProvider ? (
        <Fragment>
          <H2>Pracitioners</H2>
          <HiredPractitionersCard />
          <HirePractitionerCard />
          <H2>Treatments</H2>
          <TreatmentProviderTreatmentsCard />
        </Fragment>
      ) : (
        <Fragment />
      )}
    </FlexColumn>
  );
};

export default TreatmentProvider;
