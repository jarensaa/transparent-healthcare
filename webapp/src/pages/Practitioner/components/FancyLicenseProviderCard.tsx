import LicenseMessage from "../../../dto/LicenseMessage";
import styled from "styled-components";
import React, {
  FunctionComponent,
  useState,
  useEffect,
  Fragment,
  ChangeEvent
} from "react";
import { ReactComponent as IssuerImage } from "../../../images/undraw_filing_system_b5d2.svg";
import { ReactComponent as ProviderImage } from "../../../images/undraw_interview_rmcf.svg";
import {
  Card,
  HTMLTable,
  Callout,
  Intent,
  InputGroup,
  Button,
  FormGroup
} from "@blueprintjs/core";
import useLicenseIssuerApi from "../../../hooks/useLicenseIssuerApi";
import LicenseIssuerMessage from "../../../dto/LicenseIssuerMessage";
import useLicenseProviderApi from "../../../hooks/useLicenseProviderApi";
import LicenseProviderMessage from "../../../dto/LicenseProviderMessage";
import FlexRow from "../../../styles/FlexRow";
import useLicenseApi from "../../../hooks/useLicenseApi";
import FancyImageCard from "../../../components/FancyImageCard";

interface FancyCardProps {
  license: LicenseMessage;
}

const FancyLicenseProviderCard: FunctionComponent<FancyCardProps> = ({
  license
}) => {
  const { getLicenseProvider } = useLicenseProviderApi();
  const [provider, setProvider] = useState<
    LicenseProviderMessage | undefined
  >();
  const [issuerMoveAddress, setIssuerMoveAddress] = useState<string>("");
  const { proposeProviderMove } = useLicenseApi();

  useEffect(() => {
    getLicenseProvider(license.licenseProvider).then(setProvider);
  }, []);

  return (
    <FancyImageCard LeftImage={ProviderImage}>
      <div>
        <h3>Your license provider</h3>
        {provider ? (
          <HTMLTable>
            <tbody>
              <tr>
                <th>Address</th>
                <td>{provider.address}</td>
              </tr>
              <tr>
                <th>Trusting authority</th>
                <td>{provider.trustingAuthority}</td>
              </tr>
              <tr>
                <th>Is provider trusted?</th>
                <td>
                  {provider.isTrusted ? (
                    <Callout intent={Intent.SUCCESS}>Yes</Callout>
                  ) : (
                    <Callout intent={Intent.WARNING}>No</Callout>
                  )}
                </td>
              </tr>
            </tbody>
          </HTMLTable>
        ) : (
          <Callout intent={Intent.WARNING}>
            You do not have a license provider assoicatiated with you.
          </Callout>
        )}
        <h3>
          {provider
            ? "Switch your license provider"
            : "Set your license provider"}
        </h3>
        <FormGroup
          helperText="The target provider must approve for the change to happen"
          labelFor="text-input"
          labelInfo="(required)"
        >
          <FlexRow>
            <InputGroup
              id="text-input"
              placeholder="Address of license provider"
              value={issuerMoveAddress}
              style={{ width: "350px" }}
              onChange={(change: ChangeEvent<HTMLInputElement>) =>
                setIssuerMoveAddress(change.currentTarget.value)
              }
            />
            <Button
              intent={Intent.SUCCESS}
              minimal
              rightIcon="arrow-right"
              onClick={() => {
                proposeProviderMove(issuerMoveAddress);
                setIssuerMoveAddress("");
              }}
            >
              {provider ? "Propose switch" : "Set provider"}
            </Button>
          </FlexRow>
        </FormGroup>
      </div>
    </FancyImageCard>
  );
};

export default FancyLicenseProviderCard;
