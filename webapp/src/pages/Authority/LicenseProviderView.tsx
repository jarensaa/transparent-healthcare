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
import LicenseProviderMessage from "../../dto/LicenseProviderMessage";
import useLicenseProviderApi from "../../hooks/useLicenseProviderApi";

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
  height: 110px;
  width: 410px;
`;

const AddTrustButtonWrapper = styled.div`
  align-self: flex-end;
`;

interface ProviderCardProps {
  provider: LicenseProviderMessage;
  showTrustButton: boolean;
}

const ProviderCard: FunctionComponent<ProviderCardProps> = ({
  provider,
  showTrustButton
}) => {
  const {
    addTrustInLicenseProvider,
    removeTrustInLicenseProvider
  } = useLicenseProviderApi();
  const { activeKey } = useContext(KeyContext);

  const TrustButton = showTrustButton ? (
    provider.isTrusted && provider.trustingAuthority == activeKey?.address ? (
      <AddTrustButtonWrapper>
        <Button
          minimal
          intent={Intent.DANGER}
          onClick={() => removeTrustInLicenseProvider(provider.address)}
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
          onClick={() => addTrustInLicenseProvider(provider.address)}
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
                <WrappingTableData>{provider.address}</WrappingTableData>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>IsTrusted</th>
                <td>{provider.isTrusted ? "true" : "false"}</td>
              </tr>
              <tr>
                <th>Trusted by</th>
                <WrappingTableData>
                  {provider.isTrusted ? provider.trustingAuthority : "None"}
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

const LicenseProviderView = () => {
  const [licenseProviders, setLicenseProviders] = useState<
    LicenseProviderMessage[]
  >([]);
  const { activeKey } = useContext(KeyContext);
  const { getLicenseProviders } = useLicenseProviderApi();

  const trustedProviders: LicenseProviderMessage[] = [];
  let untrustedProviders: LicenseProviderMessage[] = [];

  if (activeKey) {
    licenseProviders.forEach(issuer => {
      if (issuer?.trustingAuthority === activeKey.address) {
        trustedProviders.push(issuer);
      } else {
        untrustedProviders.push(issuer);
      }
    });
  } else {
    untrustedProviders = licenseProviders;
  }

  const showTrustButton = activeKey ? true : false;

  const trustedProviderCards = trustedProviders.map(provider => (
    <ProviderCard
      key={provider.address}
      showTrustButton={showTrustButton}
      provider={provider}
    />
  ));

  const untrustedProviderCards = untrustedProviders.map(provider => (
    <ProviderCard
      key={provider.address}
      showTrustButton={showTrustButton}
      provider={provider}
    />
  ));

  const CalloutFragment = activeKey ? (
    <Callout>You do not trust any license providers yet</Callout>
  ) : (
    <Callout>Please select a key to see your trusted license providers</Callout>
  );

  useEffect(() => {
    getLicenseProviders().then(setLicenseProviders);
  }, []);

  return (
    <AreaGrid>
      <h1>License Providers</h1>
      <p>
        License providers are organizations who hire license holders. Examples
        of such organizations include hospitals, clinics, second opinion
        services and e-health apps. A license must be assoicated with a trusted
        license provider to be trusted. If License Providers misbehave, the
        trusting authority can remove their trust in them, thus preventing the
        used licenses from being trusted.
      </p>
      <h2>Treatment providers who you trust</h2>
      {trustedProviderCards.length > 0 ? (
        <CardAreaWrapper>{trustedProviderCards}</CardAreaWrapper>
      ) : (
        CalloutFragment
      )}
      <h2>License providers who you do not trust</h2>
      {untrustedProviderCards.length > 0 ? (
        <CardAreaWrapper>{untrustedProviderCards}</CardAreaWrapper>
      ) : (
        <Callout>
          There are no License Providers who's not trusted by you.
        </Callout>
      )}
    </AreaGrid>
  );
};

export default LicenseProviderView;
