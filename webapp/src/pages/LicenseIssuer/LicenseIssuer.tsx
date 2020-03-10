import React, {
  useContext,
  FunctionComponent,
  useState,
  useEffect
} from "react";
import KeyContext from "../../context/KeyContext";
import { Callout, Card, Button, Intent, Spinner } from "@blueprintjs/core";
import LicenseIssuerMessage from "../../dto/LicenseIssuerMessage";
import useLicenseIssuerApi from "../../hooks/useLicenseIssuerApi";
import endpoints from "../../config/endpoints";

const LicenseIssuerPage: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [licenseIssuer, setLicenseIssuer] = useState<
    LicenseIssuerMessage | undefined
  >(undefined);
  const { activeKey } = useContext(KeyContext);
  const { registerKey } = useLicenseIssuerApi();

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
    } else {
      setLicenseIssuer(undefined);
    }
  }, [activeKey]);

  if (!activeKey) {
    return (
      <div>
        <h1>Treatment Provider</h1>
        <Callout>You must select a key to access this page</Callout>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  const NotRegisteredView = (
    <Card>
      <h4>You are not registered as a License Issuer</h4>
      <Button intent={Intent.SUCCESS} onClick={() => registerKey()}>
        Register
      </Button>
    </Card>
  );

  const RegisteredView = <Card>You are a registered License Issuer</Card>;

  return (
    <div>
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
      {licenseIssuer ? RegisteredView : NotRegisteredView}
    </div>
  );
};

export default LicenseIssuerPage;
