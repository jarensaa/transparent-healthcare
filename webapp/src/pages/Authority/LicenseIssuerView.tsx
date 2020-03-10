import React, {
  useContext,
  FunctionComponent,
  Fragment,
  useState,
  useEffect
} from "react";
import KeyContext from "../../context/KeyContext";
import styled from "styled-components";
import { Card, HTMLTable, Button, Intent, Callout } from "@blueprintjs/core";
import useLicenseIssuerApi from "../../hooks/useLicenseIssuerApi";
import LicenseIssuerMessage from "../../dto/LicenseIssuerMessage";

const AreaGrid = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardAreaWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
  grid-area: keys;
`;

const CardWrapper = styled.div`
  margin: 10px;
`;

const WrappingTableData = styled.td`
  font-size: 12px;
  vertical-align: bottom !important;
  word-break: break-all;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 120px;
  width: 410px;
`;

const AddTrustButtonWrapper = styled.div`
  align-self: flex-end;
`;

interface ProviderCardProps {
  issuer: LicenseIssuerMessage;
  showTrustButton: boolean;
}

const ProviderCard: FunctionComponent<ProviderCardProps> = ({
  issuer,
  showTrustButton
}) => {
  const {
    addTrustInLicenseIssuer,
    removeTrustInLicenseIssuer
  } = useLicenseIssuerApi();
  const { activeKey } = useContext(KeyContext);

  const TrustButton = showTrustButton ? (
    issuer.isTrusted && activeKey?.address === issuer.trustingAuthority ? (
      <AddTrustButtonWrapper>
        <Button
          minimal
          intent={Intent.DANGER}
          onClick={() => removeTrustInLicenseIssuer(issuer.address)}
          rightIcon="delete"
        >
          Remove trust
        </Button>
      </AddTrustButtonWrapper>
    ) : (
      <AddTrustButtonWrapper>
        <Button
          minimal
          intent={Intent.PRIMARY}
          onClick={() => addTrustInLicenseIssuer(issuer.address)}
          rightIcon="add"
        >
          Add trust
        </Button>
      </AddTrustButtonWrapper>
    )
  ) : (
    <Fragment />
  );

  return (
    <CardWrapper>
      <Card elevation={1}>
        <TableWrapper>
          <HTMLTable small>
            <thead>
              <tr>
                <th>Address</th>
                <WrappingTableData>{issuer.address}</WrappingTableData>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>IsTrusted</th>
                <td>{issuer.isTrusted ? "true" : "false"}</td>
              </tr>

              <tr>
                <th>Trusted by</th>
                <WrappingTableData>
                  {issuer.isTrusted ? issuer.trustingAuthority : "None"}
                </WrappingTableData>
              </tr>
            </tbody>
          </HTMLTable>
          {TrustButton}
        </TableWrapper>
      </Card>
    </CardWrapper>
  );
};

const LicenseIssuerView = () => {
  const [licenseIssuers, setLicenseIssuers] = useState<LicenseIssuerMessage[]>(
    []
  );
  const { getLicenseIssuers } = useLicenseIssuerApi();
  const { activeKey } = useContext(KeyContext);

  const trustedIssuers: LicenseIssuerMessage[] = [];
  let untrustedIssuers: LicenseIssuerMessage[] = [];

  if (activeKey) {
    licenseIssuers.forEach(issuer => {
      if (issuer?.trustingAuthority === activeKey.address) {
        trustedIssuers.push(issuer);
      } else {
        untrustedIssuers.push(issuer);
      }
    });
  } else {
    untrustedIssuers = licenseIssuers;
  }

  const showTrustButton = activeKey ? true : false;

  const trustedProviderCards = trustedIssuers.map(provider => (
    <ProviderCard
      key={provider.address}
      showTrustButton={showTrustButton}
      issuer={provider}
    />
  ));

  const untrustedProviderCards = untrustedIssuers.map(provider => (
    <ProviderCard
      key={provider.address}
      showTrustButton={showTrustButton}
      issuer={provider}
    />
  ));

  const CalloutFragment = activeKey ? (
    <Callout>You do not trust any license issuers yet</Callout>
  ) : (
    <Callout>Please select a key to see trusted License Issuers</Callout>
  );

  useEffect(() => {
    getLicenseIssuers().then(setLicenseIssuers);
  }, []);

  return (
    <AreaGrid>
      <h1>License Issuers</h1>
      <p>
        License issuers are organizations who can issue medical licenses to
        practitioners. Examples of such organizations include the norwegian
        health authority. License issuers can also register existing licenses to
        them, as may be the case of practitioner mobility. A license issuer must
        be trusted by at least one authority. This page allows authorities to
        see all License issuers and to add trust in them. If License issuers
        misbehave, the trusting authority can remove their trust in them, thus
        preventing them from issuing new licenses on the blockchain. In this
        case, all licenses registered with them will become untrusted.
      </p>
      <h2>License Issuers who you trust</h2>
      {trustedProviderCards.length > 0 ? (
        <CardAreaWrapper>{trustedProviderCards}</CardAreaWrapper>
      ) : (
        CalloutFragment
      )}
      <h2>License Issuers who you do not trust</h2>
      {untrustedProviderCards.length > 0 ? (
        <CardAreaWrapper>{untrustedProviderCards}</CardAreaWrapper>
      ) : (
        <Callout>There is no License Issuers who's not trusted by you.</Callout>
      )}
    </AreaGrid>
  );
};

export default LicenseIssuerView;
