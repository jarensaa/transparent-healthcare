import React, { useContext, FunctionComponent, Fragment } from "react";
import TreatmentProviderMessage from "../../dto/TreatmentProvider";
import KeyContext from "../../context/KeyContext";
import AuthorityViewsContext from "../../context/TreatmentProviderViewContext";
import styled from "styled-components";
import { Card, HTMLTable, Button, Intent, Callout } from "@blueprintjs/core";
import useTreatmentProviderApi from "../../hooks/useTreatmentProviderApi";

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
  height: 90px;
  width: 410px;
`;

const AddTrustButtonWrapper = styled.div`
  align-self: flex-end;
`;

interface ProviderCardProps {
  provider: TreatmentProviderMessage;
  showTrustButton: boolean;
}

const ProviderCard: FunctionComponent<ProviderCardProps> = ({
  provider,
  showTrustButton
}) => {
  const {
    addTrustInProvider,
    removeTrustInProvider
  } = useTreatmentProviderApi();
  const { activeKey } = useContext(KeyContext);

  const TrustButton = showTrustButton ? (
    provider.isTrusted &&
    activeKey?.address &&
    provider.trustedBy?.includes(activeKey?.address) ? (
      <AddTrustButtonWrapper>
        <Button
          minimal
          intent={Intent.DANGER}
          onClick={() => removeTrustInProvider(provider.address)}
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
          onClick={() => addTrustInProvider(provider.address)}
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
            </tbody>
          </HTMLTable>
          {TrustButton}
        </TableWrapper>
      </Card>
    </CardWrapper>
  );
};

const TreatmentProviderView = () => {
  const { treatmentProviders } = useContext(AuthorityViewsContext);
  const { activeKey } = useContext(KeyContext);

  const trustedProviders: TreatmentProviderMessage[] = [];
  let untrustedProviders: TreatmentProviderMessage[] = [];

  if (activeKey) {
    treatmentProviders.forEach(provider => {
      if (provider?.trustedBy?.includes(activeKey.address)) {
        trustedProviders.push(provider);
      } else {
        untrustedProviders.push(provider);
      }
    });
  } else {
    untrustedProviders = treatmentProviders;
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
    <Callout>You do not trust any treatment providers yet</Callout>
  ) : (
    <Callout>Please select a key to see trusted treatment providers</Callout>
  );

  return (
    <AreaGrid>
      <h1>Treatment Providers</h1>
      <p>
        Treatment providers are organizations who issue treatments to patients.
        These can for example be clinics, hospitals, etc. Top level authorities
        can add trust to treatment providers to add legitimacy to them, and thus
        allow them to issue treatments. If Treatment Providers misbehave, the
        trusting authority can remove their trust in them, thus preventing them
        from issuing new treatments on the blockchain.
      </p>
      <h2>Treatment providers who you trust</h2>
      {trustedProviderCards.length > 0 ? (
        <CardAreaWrapper>{trustedProviderCards}</CardAreaWrapper>
      ) : (
        CalloutFragment
      )}
      <h2>Treatment providers who you do not trust</h2>
      {untrustedProviderCards.length > 0 ? (
        <CardAreaWrapper>{untrustedProviderCards}</CardAreaWrapper>
      ) : (
        <Callout>
          There is no Treatment Providers who's not trusted by you.
        </Callout>
      )}
    </AreaGrid>
  );
};

export default TreatmentProviderView;
