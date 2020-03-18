import React, { useContext, useEffect, useState, Fragment } from "react";
import {
  Card,
  H2,
  H6,
  Divider,
  H5,
  Tag,
  Intent,
  Button
} from "@blueprintjs/core";
import FlexColumn from "../../../styles/FlexColumn";
import FancyImageCard from "../../../components/FancyImageCard";
import { ReactComponent as TreatmentImage } from "../../../images/undraw_medicine_b1ol.svg";
import useTreatmentApi from "../../../hooks/useTreatmentApi";
import KeyContext from "../../../context/KeyContext";
import TreatmentCombinedDataDTO from "../../../dto/Treatments/TreatmentCombinedDataDTO";
import constants from "../../../config/constants";
import SignatureCheckedTreatment from "../../../types/SignatureCheckedTreatment";
import { TopMarginWrapper } from "../../../styles/MarginWrappers";
import FlexRow from "../../../styles/FlexRow";

const FancyApproveTreatmentsCard = () => {
  const {
    getTreatmentsForLicense,
    licenseApproveTreatment
  } = useTreatmentApi();
  const { activeKey } = useContext(KeyContext);
  const [treatments, setTreatments] = useState<SignatureCheckedTreatment[]>([]);

  useEffect(() => {
    if (activeKey) {
      getTreatmentsForLicense().then(setTreatments);
    }
  }, [activeKey]);

  const approvableTreatments = treatments
    .filter(treatment => treatment.contractData)
    .filter(
      treatment =>
        treatment.contractData!.approvingLicenseAddress ===
        constants.nullAddress
    );

  const approvableTreatmentsCards = approvableTreatments.map(
    (treatment, index) => (
      <TopMarginWrapper key={index}>
        <Card>
          <FlexColumn>
            <H5>Treatment address</H5>
            {treatment.treatmentAddress}
            <Divider />
            <H5>Patient address</H5>
            {treatment.fullData?.patientAddress ?? "unknown"}
            <Divider />
            <H5>Description hash</H5>
            {treatment.contractData?.fullDataHash}
            <Divider />
            <H5>Description</H5>
            {treatment.fullData?.fullDescription ?? "unknown"}
            <Divider />
            <FlexRow>
              {treatment.validPatientSignature &&
              treatment.validTreatmentSignature ? (
                <Tag minimal intent={Intent.SUCCESS} icon="confirm" large>
                  Data verified with blockchain
                </Tag>
              ) : (
                <Tag minimal intent={Intent.DANGER} icon="cross" large>
                  Data invalid
                </Tag>
              )}
              <Divider />
              <Button
                minimal
                intent={
                  treatment.validPatientSignature &&
                  treatment.validTreatmentSignature
                    ? Intent.SUCCESS
                    : Intent.DANGER
                }
                onClick={() =>
                  licenseApproveTreatment(treatment.treatmentAddress)
                }
                rightIcon="arrow-right"
              >
                Approve treatment
              </Button>
            </FlexRow>
          </FlexColumn>
        </Card>
      </TopMarginWrapper>
    )
  );

  return (
    <FancyImageCard small standardWidth LeftImage={TreatmentImage}>
      <FlexColumn>
        <H2>Treatments you can approve</H2>
        {approvableTreatmentsCards}
      </FlexColumn>
    </FancyImageCard>
  );
};

export default FancyApproveTreatmentsCard;
