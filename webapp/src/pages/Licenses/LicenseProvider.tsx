import React, {
  useContext,
  FunctionComponent,
  useState,
  useEffect,
  Fragment
} from "react";
import KeyContext from "../../context/KeyContext";
import { Callout, Card, Button, Intent, Spinner } from "@blueprintjs/core";
import endpoints from "../../config/endpoints";
import LicenseProviderMessage from "../../dto/LicenseProviderMessage";
import useLicenseProviderApi from "../../hooks/useLicenseProviderApi";
import FlexColumn from "../../styles/FlexColumn";
import {
  TopRightMarginWrapper,
  TopMarginWrapper
} from "../../styles/MarginWrappers";
import LicenseStore from "./types/LicenseStore";
import useLicenseApi from "../../hooks/useLicenseApi";
import CardAreaWrapper from "../../styles/CardAreaWrapper";
import LicenseCard from "./components/LicenseCard";

const LicenseProviderPage: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [licenseProvider, setLicenseProvider] = useState<
    LicenseProviderMessage | undefined
  >(undefined);
  const { activeKey } = useContext(KeyContext);
  const { registerKey } = useLicenseProviderApi();
  const { getLicenses } = useLicenseApi();

  const [licenseStore, setLicenseStore] = useState<LicenseStore>({
    associatedLicenses: [],
    unassociatedLicenses: []
  });

  useEffect(() => {
    if (activeKey) {
      setIsLoading(true);
      fetch(endpoints.licenseProviders.getByAddress(activeKey.address)).then(
        async res => {
          if (res.status === 200) {
            const provider: LicenseProviderMessage = await res.json();
            setLicenseProvider(provider);
          } else if (res.status === 204) {
            setLicenseProvider(undefined);
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
    } else {
      setLicenseProvider(undefined);
      setLicenseStore({
        associatedLicenses: [],
        unassociatedLicenses: []
      });
    }
  }, [activeKey]);

  if (!activeKey) {
    return (
      <div>
        <h1>License Provider</h1>
        <Callout intent={Intent.WARNING}>
          You must select a key to access this page
        </Callout>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

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

  const NotRegisteredView = (
    <div>
      <Callout intent={Intent.WARNING}>
        You are not a registed license provider
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

  const RegisteredView = (
    <Fragment>
      <Callout intent={Intent.SUCCESS}>
        You are a registered License Provider
      </Callout>
      <TopMarginWrapper>
        {licenseProvider?.isTrusted ? (
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
      <Callout intent={Intent.PRIMARY}>TODO</Callout>
      <h2>Licenses where you are the registered provider</h2>
      {associatedLicensesCards}
    </Fragment>
  );

  return (
    <FlexColumn>
      <h1>License Provider</h1>
      <p>
        License providers are organizations who hire license holders. Examples
        of such organizations include hospitals, clinics, second opinion
        services and e-health apps. A license must be assoicated with a trusted
        license provider to be trusted. If License Providers misbehave, the
        trusting authority can remove their trust in them, thus preventing the
        used licenses from being trusted.
      </p>
      <h2>Your license provider status</h2>
      {licenseProvider ? RegisteredView : NotRegisteredView}
      <h2>{licenseProvider ? "All other licenses" : "Licenses"}</h2>
      {unassociatedLicensesCards}
    </FlexColumn>
  );
};

export default LicenseProviderPage;
