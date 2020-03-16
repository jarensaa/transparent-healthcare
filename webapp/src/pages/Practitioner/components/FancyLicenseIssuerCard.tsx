import LicenseMessage from "../../../dto/LicenseMessage";
import React, {
  FunctionComponent,
  useState,
  useEffect,
  Fragment,
  ChangeEvent
} from "react";
import { ReactComponent as IssuerImage } from "../../../images/undraw_filing_system_b5d2.svg";
import {
  HTMLTable,
  Callout,
  Intent,
  InputGroup,
  Button,
  FormGroup
} from "@blueprintjs/core";
import useLicenseIssuerApi from "../../../hooks/useLicenseIssuerApi";
import LicenseIssuerMessage from "../../../dto/LicenseIssuerMessage";
import FlexRow from "../../../styles/FlexRow";
import useLicenseApi from "../../../hooks/useLicenseApi";
import FancyImageCard from "../../../components/FancyImageCard";

interface FancyCardProps {
  license: LicenseMessage;
}

const FancyLicenseIssuerCard: FunctionComponent<FancyCardProps> = ({
  license
}) => {
  const { getIssuer } = useLicenseIssuerApi();
  const { proposeIssuerMove } = useLicenseApi();
  const [isser, setIssuer] = useState<LicenseIssuerMessage | undefined>();
  const [issuerMoveAddress, setIssuerMoveAddress] = useState<string>("");

  useEffect(() => {
    getIssuer(license.issuer).then(setIssuer);
  }, []);

  return (
    <FancyImageCard LeftImage={IssuerImage}>
      <div>
        <h3>Your license issuer</h3>
        {isser ? (
          <Fragment>
            <HTMLTable>
              <tbody>
                <tr>
                  <th>Address</th>
                  <td>{isser.address}</td>
                </tr>
                <tr>
                  <th>Trusting authority</th>
                  <td>{isser.trustingAuthority}</td>
                </tr>
                <tr>
                  <th>Is issuer trusted?</th>
                  <td>
                    {isser.isTrusted ? (
                      <Callout intent={Intent.SUCCESS}>Yes</Callout>
                    ) : (
                      <Callout intent={Intent.WARNING}>No</Callout>
                    )}
                  </td>
                </tr>
              </tbody>
            </HTMLTable>
            <h3>Switch your license issuer</h3>
            <FormGroup
              helperText="The target issuer must approve for the change to happen"
              labelFor="text-input"
              labelInfo="(required)"
            >
              <FlexRow>
                <InputGroup
                  id="text-input"
                  placeholder="Address of issuer"
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
                    proposeIssuerMove(issuerMoveAddress);
                    setIssuerMoveAddress("");
                  }}
                >
                  Propose switch
                </Button>
              </FlexRow>
            </FormGroup>
          </Fragment>
        ) : (
          <Fragment />
        )}
      </div>
    </FancyImageCard>
  );
};

export default FancyLicenseIssuerCard;
