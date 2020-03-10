import React, {
  useContext,
  useState,
  useEffect,
  FunctionComponent
} from "react";
import TreatmentProviderMessage from "../../dto/TreatmentProvider";
import KeyContext from "../../context/KeyContext";
import TreatmentProviderViewContext from "../../context/TreatmentProviderViewContext";
import styled from "styled-components";
import { Card, HTMLTable } from "@blueprintjs/core";

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
  height: 150px;
  width: 410px;
`;

interface ProviderCardProps {
  provider: TreatmentProviderMessage;
}

const ProviderCard: FunctionComponent<ProviderCardProps> = ({ provider }) => {
  return (
    <CardWrapper>
      <Card elevation={1}>
        <TableWrapper>
          <HTMLTable small>
            <thead>
              <tr>
                <th>Address</th>
                <td>{provider.address}</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>IsTrusted</th>
                <td>{provider.isTrusted ? "true" : "false"}</td>
              </tr>
            </tbody>
          </HTMLTable>
        </TableWrapper>
      </Card>
    </CardWrapper>
  );
};

const TreatmentProviderView = () => {
  const { treatmentProviders } = useContext(TreatmentProviderViewContext);
  const { activeKey } = useContext(KeyContext);

  const trustedProviders: TreatmentProviderMessage[] = [];
  let untrustedProviders: TreatmentProviderMessage[] = [];

  if (activeKey) {
    treatmentProviders.forEach(provider => {
      if (provider?.trustedBy?.includes(activeKey.address)) {
        treatmentProviders.push(provider);
      } else {
        untrustedProviders.push(provider);
      }
    });
  } else {
    untrustedProviders = treatmentProviders;
  }

  const trustedProviderCards = trustedProviders.map(provider => (
    <ProviderCard key={provider.address} provider={provider} />
  ));

  const untrustedProviderCards = untrustedProviders.map(provider => (
    <ProviderCard key={provider.address} provider={provider} />
  ));

  return (
    <AreaGrid>
      <h1>Treatment Providers</h1>
      <CardAreaWrapper>{untrustedProviderCards}</CardAreaWrapper>
    </AreaGrid>
  );
};

export default TreatmentProviderView;
