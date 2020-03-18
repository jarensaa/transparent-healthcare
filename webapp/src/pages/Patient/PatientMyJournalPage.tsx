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
  Intent,
  Callout,
  Card,
  H6,
  Divider,
  H5,
  Tag
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
import TreatmentCombinedDataDTO from "../../dto/Treatments/TreatmentCombinedDataDTO";
import constants from "../../config/constants";
import useLocalStorage from "../../hooks/useLocalStorage";
import CompletedTreatmentCard from "./components/CompletedTreatmentCard";

const PatientMyJournalPage: FunctionComponent = () => {
  const { activeKey } = useContext(KeyContext);
  const [approvableTreatments, setApprovableTreatments] = useState<
    TreatmentPatientInfoDTO[]
  >([]);
  const [submittedTreatments, setSubmittedTreatments] = useState<
    TreatmentCombinedDataDTO[]
  >([]);

  const { getTreatmentKeysMapFromLocalStorage } = useLocalStorage();

  const {
    getPatientTreatmentProposals,
    approveTreatment,
    getTreatmentsForPatient
  } = useTreatmentApi();

  useEffect(() => {
    if (activeKey && IsPatientKey(activeKey)) {
      getPatientTreatmentProposals().then(setApprovableTreatments);
      getTreatmentsForPatient().then(setSubmittedTreatments);
    } else {
      setApprovableTreatments([]);
    }
  }, [activeKey]);

  const header = (
    <Fragment>
      <H1>My journal</H1>
      <DescriptionBox>
        As a patient you go though treatments over time. This formally consists
        of approving treatments which pracitioners propose for you. A while
        after the treatment is done, you can evalute it. The evaluation is not
        possible to trace back to the specific patient, as it uses a one-time
        key which is generated on approval.
      </DescriptionBox>
    </Fragment>
  );

  if (!activeKey || !IsPatientKey(activeKey)) {
    return (
      <div>
        {header}
        <Callout intent={Intent.WARNING}>
          You must select a patient key to access this page
        </Callout>
      </div>
    );
  }

  const approvableTreatmentCards = approvableTreatments.map(
    (treatment, index) => {
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
    }
  );

  const treatmentsPendingPracitionerApproval = submittedTreatments.filter(
    treatment =>
      treatment.contractData &&
      treatment.contractData.approvingLicenseAddress === constants.nullAddress
  );

  const pendingTreatmentCards = treatmentsPendingPracitionerApproval.map(
    (treatment, index) => {
      return (
        <TopMarginWrapper key={index}>
          <Card>
            <FlexColumn>
              <H5>Treatment address</H5>
              <p>{treatment.treatmentAddress}</p>
              <Divider />
              <p>
                <H5>Description hash</H5>
              </p>
              {treatment.contractData?.fullDataHash}
              <Divider />
              <p>
                <H5>Description</H5>
              </p>
              {treatment.fullData?.fullDescription ?? "unknown"}
            </FlexColumn>
          </Card>
        </TopMarginWrapper>
      );
    }
  );

  const approvedTreatments = submittedTreatments.filter(
    treatment =>
      treatment.contractData &&
      treatment.contractData.approvingLicenseAddress !== constants.nullAddress
  );

  const treatmentKeys = getTreatmentKeysMapFromLocalStorage();

  const completedTreatmentsCards = approvedTreatments.map(
    (treatment, index) => {
      return (
        <TopMarginWrapper key={index}>
          <CompletedTreatmentCard
            treatment={treatment}
            treatmentKey={treatmentKeys.get(
              treatment.treatmentAddress.toLowerCase()
            )}
          />
        </TopMarginWrapper>
      );
    }
  );

  return (
    <FlexColumn>
      {header}
      <FancyImageCard
        small
        standardWidth
        LeftImage={MedicineImage}
        imageAlignment={"flex-start"}
      >
        <H2>Treatments waiting for your approval</H2>
        {approvableTreatments.length > 0 ? (
          approvableTreatmentCards
        ) : (
          <Callout intent={Intent.SUCCESS}>
            You have no treatments waiting
          </Callout>
        )}
      </FancyImageCard>
      <FancyImageCard
        small
        standardWidth
        LeftImage={MedicineImage}
        imageAlignment={"flex-start"}
      >
        <H2>Treatments waiting for pracitioners approval</H2>
        {pendingTreatmentCards.length > 0 ? (
          pendingTreatmentCards
        ) : (
          <Callout intent={Intent.SUCCESS}>
            No treatments are waiting for approval
          </Callout>
        )}
      </FancyImageCard>
      <FancyImageCard
        small
        standardWidth
        LeftImage={MedicineImage}
        imageAlignment={"flex-start"}
      >
        <H2>Completed treatments</H2>
        {completedTreatmentsCards.length > 0 ? (
          completedTreatmentsCards
        ) : (
          <Callout intent={Intent.SUCCESS}>
            There are no previous treatments
          </Callout>
        )}
      </FancyImageCard>
    </FlexColumn>
  );
};

export default PatientMyJournalPage;
