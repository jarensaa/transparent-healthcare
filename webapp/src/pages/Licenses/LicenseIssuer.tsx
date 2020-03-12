import React, {
  useContext,
  FunctionComponent,
  useState,
  useEffect,
  ChangeEvent,
  Fragment
} from "react";
import KeyContext from "../../context/KeyContext";
import {
  Callout,
  Button,
  Intent,
  Spinner,
  InputGroup
} from "@blueprintjs/core";
import LicenseIssuerMessage from "../../dto/LicenseIssuerMessage";
import useLicenseIssuerApi from "../../hooks/useLicenseIssuerApi";
import endpoints from "../../config/endpoints";
import styled from "styled-components";
import {
  TopRightMarginWrapper,
  TopMarginWrapper
} from "../../styles/MarginWrappers";
import useLicenseApi from "../../hooks/useLicenseApi";
import LicenseStore from "./types/LicenseStore";
import CardAreaWrapper from "../../styles/CardAreaWrapper";
import LicenseCard from "./components/LicenseCard";
import FlexColumn from "../../styles/FlexColumn";
import LicenseProposalMessage from "../../dto/LicenseProposalMessage";
import ProposalCard from "./components/ProposalCard";

const IssueLicenseWrapper = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: minmax(auto, 350px) 220px;
`;

const LicenseIssuerPage: FunctionComponent = () => {
  const { activeKey } = useContext(KeyContext);
  const {
    registerKey,
    issueLicense,
    getIssuerProposals
  } = useLicenseIssuerApi();
  const { getLicenses, approveIssuerMove } = useLicenseApi();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [licenseIssuer, setLicenseIssuer] = useState<
    LicenseIssuerMessage | undefined
  >(undefined);

  const [issueLicenseAddress, setIssueLicenseAddress] = useState<string>("");
  const [licenseStore, setLicenseStore] = useState<LicenseStore>({
    associatedLicenses: [],
    unassociatedLicenses: []
  });

  const [proposals, setProposals] = useState<LicenseProposalMessage[]>([]);

  useEffect(() => {
    if (activeKey) {
      setIsLoading(true);

      fetch(endpoints.licenseIssuers.getByAddress(activeKey.address)).then(
        async res => {
          if (res.status === 200) {
            const isser: LicenseIssuerMessage = await res.json();
            setLicenseIssuer(isser);
          } else if (res.status === 204) {
            setLicenseIssuer(undefined);
          }
          setIsLoading(false);
        }
      );
      getLicenses().then(licenses => {
        setLicenseStore({
          associatedLicenses: licenses.filter(
            license => license.issuer === activeKey.address
          ),
          unassociatedLicenses: licenses.filter(
            license => license.issuer !== activeKey.address
          )
        });
      });

      getIssuerProposals(activeKey.address).then(setProposals);
    } else {
      setLicenseIssuer(undefined);
      setProposals([]);
      setLicenseStore({
        associatedLicenses: [],
        unassociatedLicenses: []
      });
    }
  }, [activeKey]);

  if (!activeKey) {
    return (
      <div>
        <h1>License Issuer</h1>
        <Callout intent={Intent.WARNING}>
          You must select a key to access this page
        </Callout>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  const NotRegisteredView = (
    <div>
      <Callout intent={Intent.WARNING}>
        You are not a registed license issuer
      </Callout>
      <TopRightMarginWrapper>
        <Button
          intent={Intent.SUCCESS}
          minimal
          rightIcon="arrow-right"
          onClick={() => registerKey()}
        >
          Register
        </Button>
      </TopRightMarginWrapper>
    </div>
  );

  const associatedLicensesCards = (
    <CardAreaWrapper>
      {licenseStore.associatedLicenses.map((license, index) => (
        <LicenseCard key={index} license={license} />
      ))}
    </CardAreaWrapper>
  );

  const unassociatedLicensesCards = (
    <CardAreaWrapper>
      {licenseStore.unassociatedLicenses.map((license, index) => (
        <LicenseCard key={index} license={license} />
      ))}
    </CardAreaWrapper>
  );

  const proposalCards =
    proposals.length > 0 ? (
      <CardAreaWrapper>
        {proposals.map((proposal, index) => (
          <ProposalCard
            approvable
            approveCallback={approveIssuerMove}
            key={index}
            proposal={proposal}
          />
        ))}
      </CardAreaWrapper>
    ) : (
      <Callout intent={Intent.SUCCESS}> There are no pending proposals</Callout>
    );

  const RegisteredView = (
    <Fragment>
      <Callout intent={Intent.SUCCESS}>
        You are a registered License Issuer
      </Callout>
      <TopMarginWrapper>
        {licenseIssuer?.isTrusted ? (
          <Callout intent={Intent.SUCCESS}>
            You are trusted by an authority
          </Callout>
        ) : (
          <Callout intent={Intent.WARNING}>
            You are not trusted by an authority
          </Callout>
        )}
      </TopMarginWrapper>
      <h2>Proposed license moves to you</h2>
      {proposalCards}
      <h2>Issue a new license</h2>
      <IssueLicenseWrapper>
        <InputGroup
          id="text-input"
          placeholder="Address of license"
          value={issueLicenseAddress}
          onChange={(change: ChangeEvent<HTMLInputElement>) =>
            setIssueLicenseAddress(change.currentTarget.value)
          }
        />
        <Button
          intent={Intent.SUCCESS}
          minimal
          rightIcon="arrow-right"
          onClick={() => {
            issueLicense(issueLicenseAddress);
            setIssueLicenseAddress("");
          }}
        >
          Issue license to address
        </Button>
      </IssueLicenseWrapper>
      <h2>Licenses where you are the registered issuer</h2>
      {associatedLicensesCards}
    </Fragment>
  );

  return (
    <FlexColumn>
      <h1>License Issuer</h1>
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
      <h2>Your issuer status</h2>
      {licenseIssuer ? RegisteredView : NotRegisteredView}
      <h2>{licenseIssuer ? "All other licenses" : "Licenses"}</h2>
      {unassociatedLicensesCards}
    </FlexColumn>
  );
};

export default LicenseIssuerPage;
