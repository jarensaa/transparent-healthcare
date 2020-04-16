import React, { Fragment } from "react";
import PractitionerViewDTO from "../../../dto/Evaluation/PractitionerViewDTO";
import { useState } from "react";
import {
  Dialog,
  Classes,
  Button,
  Intent,
  H4,
  H2,
  H5,
  H6,
  Divider,
  Callout,
  HTMLTable,
} from "@blueprintjs/core";
import {
  LeftRightMarginWrapper,
  TopMarginWrapper,
} from "../../../styles/MarginWrappers";
import styled from "styled-components";

interface PractitionerDetailsCardProps {
  practitionerDetails: PractitionerViewDTO;
}

const TreatmentTableWrapper = styled.div`
  margin-right: 10px;
  margin-top: 20px;
  margin-left: 10px;
`;

const PractitionerDialogButton: React.FC<PractitionerDetailsCardProps> = ({
  practitionerDetails,
}) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Button
        minimal
        intent={Intent.PRIMARY}
        rightIcon="arrow-right"
        onClick={() => setDialogOpen(true)}
      >
        Practitioner details
      </Button>
      <Dialog
        isOpen={dialogOpen}
        onClose={closeDialog}
        className={Classes.OVERLAY_SCROLL_CONTAINER}
        title="Practitioner details"
        style={{ width: 700 }}
      >
        <div className={Classes.DIALOG_BODY}>
          <H2>License info</H2>
          <HTMLTable>
            <tbody>
              <tr>
                <td>
                  <H4>Address</H4>
                </td>
                <td>{practitionerDetails.license.address}</td>
              </tr>
              <tr>
                <td>
                  <H4>Is trusted?</H4>
                </td>
                <td>
                  {practitionerDetails.license.isTrusted ? (
                    <Callout intent={Intent.SUCCESS}>Yes</Callout>
                  ) : (
                    <Callout intent={Intent.WARNING}>No</Callout>
                  )}
                </td>
              </tr>
              <tr>
                <td>
                  <H4>License issuer</H4>
                </td>
                <td>{practitionerDetails.license.issuer}</td>
              </tr>
              <tr>
                <td>
                  <H4>License provider</H4>
                </td>
                <td>{practitionerDetails.license.licenseProvider}</td>
              </tr>
            </tbody>
          </HTMLTable>
          <H2>Evaluated Treatments</H2>
          <Divider></Divider>

          {practitionerDetails.evaluatedTreatments.map((t, index) => {
            return (
              <TreatmentTableWrapper key={index}>
                <HTMLTable small>
                  <thead>
                    <tr>
                      <th>
                        <H5>Treatment</H5>
                      </th>
                      <td>
                        <H6>{t.treatment.address}</H6>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Treatment provider</td>
                      <td>{t.treatment.treatmentProviderAddress}</td>
                    </tr>
                    <tr>
                      <td>Data hash</td>
                      <td>{t.treatment.fullDataHash}</td>
                    </tr>
                    <tr>
                      <td>Data location</td>
                      <td>{t.treatment.fullDataUrl}</td>
                    </tr>
                    <tr>
                      <td>Rating</td>
                      <td>
                        <H4>{t.evaluation.rating}</H4>
                      </td>
                    </tr>
                    <tr>
                      <td>Evaluation hash</td>
                      <td>{t.evaluation.fullMeasureHash}</td>
                    </tr>
                    <tr>
                      <td>Evaluation location</td>
                      <td>{t.evaluation.fullMeasureUrl}</td>
                    </tr>
                  </tbody>
                </HTMLTable>
              </TreatmentTableWrapper>
            );
          })}

          <TopMarginWrapper>
            <H2>Treatments without evaluation</H2>
          </TopMarginWrapper>
          <Divider></Divider>

          {practitionerDetails.unevaluatedTreatments.map((t, index) => {
            return (
              <TreatmentTableWrapper key={index}>
                <HTMLTable small>
                  <thead>
                    <tr>
                      <th>
                        <H5>Treatment</H5>
                      </th>
                      <td>
                        <H6>{t.address}</H6>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Treatment provider</td>
                      <td>{t.treatmentProviderAddress}</td>
                    </tr>
                    <tr>
                      <td>Data hash</td>
                      <td>{t.fullDataHash}</td>
                    </tr>
                    <tr>
                      <td>Data location</td>
                      <td>{t.fullDataUrl}</td>
                    </tr>
                  </tbody>
                </HTMLTable>
              </TreatmentTableWrapper>
            );
          })}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
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
  );
};

export default PractitionerDialogButton;
