import React, { useState, useContext } from "react";
import {
  Card,
  H5,
  Intent,
  Tag,
  Button,
  Classes,
  Dialog,
  H3,
  Slider,
  H6
} from "@blueprintjs/core";
import FlexColumn from "../../../styles/FlexColumn";
import { FunctionComponent } from "react";
import TreatmentCombinedDataDTO from "../../../dto/Treatments/TreatmentCombinedDataDTO";
import { TopMarginWrapper } from "../../../styles/MarginWrappers";
import TreatmentKey from "../../../types/TreatmentKey";
import DescriptionBox from "../../../components/DescriptionBox";
import useEvaluationApi from "../../../hooks/useEvaluationApi";
import ToastContext from "../../../context/ToastContext";

interface CompletedTreatmentCardProps {
  treatment: TreatmentCombinedDataDTO;
  treatmentKey?: TreatmentKey;
}

const CompletedTreatmentCard: FunctionComponent<CompletedTreatmentCardProps> = ({
  treatment,
  treatmentKey
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);

  const { addEvaluation } = useEvaluationApi();
  const { showFailure } = useContext(ToastContext);

  const closeDialog = () => {
    setDialogOpen(false);
    setRating(5);
  };

  const publishEvaluation = () => {
    if (treatmentKey) {
      addEvaluation(treatment.treatmentAddress, treatmentKey, rating);
    } else {
      showFailure("Unable to fetch key for treatement locally.");
    }
    closeDialog();
  };

  return (
    <Card>
      <FlexColumn>
        <TopMarginWrapper large>
          <H5>Treatment address</H5>
          {treatment.treatmentAddress}
        </TopMarginWrapper>
        <TopMarginWrapper large>
          <H5>Description hash</H5>
          {treatment.contractData?.fullDataHash}
        </TopMarginWrapper>
        <TopMarginWrapper large>
          <H5>Description</H5>
          {treatment.fullData?.fullDescription ?? "unknown"}
        </TopMarginWrapper>
        <TopMarginWrapper large>
          {treatment.contractData?.isSpent ? (
            <Tag minimal intent={Intent.SUCCESS} icon="confirm" large>
              You have evaluated the treatment.
            </Tag>
          ) : (
            <div>
              <Button
                intent={Intent.SUCCESS}
                minimal
                rightIcon="arrow-right"
                text="Evaluate treatment"
                onClick={() => setDialogOpen(true)}
              />
              <Dialog
                isOpen={dialogOpen}
                onClose={closeDialog}
                className={Classes.OVERLAY_SCROLL_CONTAINER}
                title="Evaluate treatment"
                icon="send-to"
                style={{ width: 700 }}
              >
                <div className={Classes.DIALOG_BODY}>
                  <DescriptionBox>
                    When you evaluate a treatment, it get published for everyone
                    to see. The evaluation is anonymous, and it's impossible
                    external viewers to track it back to you.
                  </DescriptionBox>
                  <TopMarginWrapper large>
                    <H3>Treatment info</H3>
                    <TopMarginWrapper large>
                      <H5>Treatment address</H5>
                      {treatment.treatmentAddress}
                    </TopMarginWrapper>
                    <TopMarginWrapper large>
                      <H5>Description hash</H5>
                      {treatment.contractData?.fullDataHash}
                    </TopMarginWrapper>
                    <TopMarginWrapper large>
                      <H5>Description</H5>
                      {treatment.fullData?.fullDescription ?? "unknown"}
                    </TopMarginWrapper>
                  </TopMarginWrapper>
                  <TopMarginWrapper large>
                    <H3>Treatment evaluation</H3>
                    <DescriptionBox>
                      How one should formulate questions like this remains out
                      of scope. We ask a simple question as a proof of concept.
                      Formulating scale based questions which can be publicly
                      available without revealing identity remains as a open
                      problem.
                    </DescriptionBox>
                    <H5>
                      To which degree did the treatment have a positive effect
                      on your health? 0 is very bad, 5 is neutral, 10 is very
                      good.
                    </H5>
                    <Slider
                      value={rating}
                      onChange={setRating}
                      min={0}
                      max={10}
                      stepSize={1}
                    ></Slider>
                  </TopMarginWrapper>
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                  <Button
                    minimal
                    icon="add-to-artifact"
                    intent={Intent.SUCCESS}
                    onClick={publishEvaluation}
                  >
                    Publish evaluation
                  </Button>
                  <Button
                    minimal
                    icon="cross"
                    intent={Intent.DANGER}
                    onClick={closeDialog}
                  >
                    Close
                  </Button>
                </div>
              </Dialog>
            </div>
          )}
        </TopMarginWrapper>
      </FlexColumn>
    </Card>
  );
};

export default CompletedTreatmentCard;
