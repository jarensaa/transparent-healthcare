import React, {
  useContext,
  FunctionComponent,
  useState,
  useEffect,
  Fragment
} from "react";
import KeyContext from "../../context/KeyContext";
import { Callout, Intent, Spinner } from "@blueprintjs/core";
import FlexColumn from "../../styles/FlexColumn";
import { TopMarginWrapper } from "../../styles/MarginWrappers";
import useLicenseApi from "../../hooks/useLicenseApi";
import LicenseMessage from "../../dto/LicenseMessage";
import {
  FancyLicenseIssuerCard,
  FancyLicenseProviderCard
} from "./components/FancyLicenseCards";

const ManageLicensePage: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [license, setLicense] = useState<LicenseMessage | undefined>(undefined);
  const { activeKey } = useContext(KeyContext);
  const { getLicenseFromAddress } = useLicenseApi();

  useEffect(() => {
    if (activeKey) {
      setIsLoading(true);
      getLicenseFromAddress(activeKey.address).then(license => {
        setLicense(license);
        setIsLoading(false);
      });
    }
  }, [activeKey]);

  if (!activeKey) {
    return (
      <div>
        <h1>License Management</h1>
        <Callout intent={Intent.WARNING}>
          You must select a key to access this page
        </Callout>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <FlexColumn>
      <h1>Manage your license</h1>
      <p>
        A license is the proof a practitioner holds to show their certification
        to practice medicine. If a practitioner has a trusted license, they may
        sign off on treatments. Once signed, these treatments becomes assoicated
        with the license, acting as proof of work history. For a license it to
        be trusted it must be associated with a trusted license issuer and a
        trusted license provider.
      </p>

      {license ? (
        <Fragment>
          <h2>License info</h2>
          <FancyLicenseIssuerCard license={license} />
          <FancyLicenseProviderCard license={license} />
        </Fragment>
      ) : (
        <Fragment>
          <h2>Your license provider status</h2>
          <Callout intent={Intent.WARNING}>
            You do not have a license. You must get a license issuer to issue
            one for you.
          </Callout>
        </Fragment>
      )}
    </FlexColumn>
  );
};

export default ManageLicensePage;
