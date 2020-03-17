import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
  Fragment
} from "react";
import {
  Button,
  H1,
  H2,
  H3,
  Intent,
  Callout,
  Card,
  H4,
  H6,
  Divider
} from "@blueprintjs/core";
import FlexColumn from "../../styles/FlexColumn";
import TreatmentPatientInfoDTO from "../../dto/Treatments/TreatmentPatientInfoDTO";
import KeyContext from "../../context/KeyContext";
import useTreatmentApi from "../../hooks/useTreatmentApi";
import { IsPatientKey } from "../../types/PatientKey";
import { ReactComponent as MedicineImage } from "../../images/undraw_doctors_hwty.svg";
import FancyImageCard from "../../components/FancyImageCard";
import { TopMarginWrapper } from "../../styles/MarginWrappers";
import DescriptionBox from "../../components/DescriptionBox";

const PatientMyJournalPage: FunctionComponent = () => {
  const { activeKey } = useContext(KeyContext);
  const [pendingTreatments, setPendingTreatments] = useState<
    TreatmentPatientInfoDTO[]
  >([]);

  const { getPatientTreatmentProposals, approveTreatment } = useTreatmentApi();

  useEffect(() => {
    if (activeKey && IsPatientKey(activeKey)) {
      getPatientTreatmentProposals().then(setPendingTreatments);
    } else {
      setPendingTreatments([]);
    }
  }, [activeKey]);

  if (!activeKey || !IsPatientKey(activeKey)) {
    return (
      <div>
        <h1>License Management</h1>
        <Callout intent={Intent.WARNING}>
          You must select a patient key to access this page
        </Callout>
      </div>
    );
  }

  const treatmentCards = pendingTreatments.map((treatment, index) => {
    return (
      <TopMarginWrapper key={index}>
        <Card key={index}>
          <FlexColumn>
            <H6>Proposed by practitioner</H6>
            {treatment.licenseAddress}
            <Divider />
            <TopMarginWrapper>
              <H6>Treatment desciption</H6>
              {treatment.description}
            </TopMarginWrapper>
            <TopMarginWrapper>
              <Button
                intent={Intent.SUCCESS}
                minimal
                rightIcon="arrow-right"
                onClick={() => approveTreatment(treatment)}
              >
                Approve treatment
              </Button>
            </TopMarginWrapper>
          </FlexColumn>
        </Card>
      </TopMarginWrapper>
    );
  });

  return (
    <FlexColumn>
      <H1>My journal</H1>
      <DescriptionBox>
        As a patient you go though treatments over time. This formally consists
        of approving treatments which pracitioners propose for you. A while
        after the treatment is done, you can evalute it. The evaluation is not
        possible to trace back to the specific patient, as it uses a one-time
        key which is generated on approval.
      </DescriptionBox>
      <FancyImageCard LeftImage={MedicineImage} imageAlignment={"flex-start"}>
        <H2>Treatments waiting for your approval</H2>
        {treatmentCards}
      </FancyImageCard>
      <H2>Treatments waiting for pracitioners approval</H2>
      <H2>Previous treatments</H2>
    </FlexColumn>
  );
};

export default PatientMyJournalPage;
