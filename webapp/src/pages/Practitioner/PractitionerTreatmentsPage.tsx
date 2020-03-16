import React, { FunctionComponent, useContext } from "react";
import { Callout, Intent, H1, H2 } from "@blueprintjs/core";
import FlexColumn from "../../styles/FlexColumn";
import FancyIssueTreatmentsCard from "./components/FancyIssueTreatmentCard";
import FancyApproveTreatmentsCard from "./components/FancyApproveTreatmentCard";
import FancyLicenseTrustedCard from "./components/FancyLicenseTrustedCard";
import KeyContext from "../../context/KeyContext";

const PractitionerTreatmentPage: FunctionComponent = () => {
  const { activeKey } = useContext(KeyContext);

  if (!activeKey) {
    return (
      <FlexColumn>
        <H1>Practitioner treaments</H1>
        <Callout intent={Intent.WARNING}>
          You must select a key to access this page
        </Callout>
      </FlexColumn>
    );
  }

  return (
    <FlexColumn>
      <H1>Practitioner treaments</H1>
      <p>
        As in the real world, pracitioners <i>in the field</i> are the ones who
        first issue treatments to patients. This page allows practitioners to
        propose treatments if they are trusted. They can also approve treatments
        on the blockchain once the patient has approved it first.
      </p>
      <H2>License status</H2>
      <FancyLicenseTrustedCard />
      <H2>Issue treatments</H2>
      <FancyIssueTreatmentsCard />
      <H2>Approve treatments</H2>
      <FancyApproveTreatmentsCard />
    </FlexColumn>
  );
};

export default PractitionerTreatmentPage;
