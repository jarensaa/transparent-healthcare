import React, {
  useContext,
  FunctionComponent,
  useState,
  useEffect
} from "react";
import KeyContext from "../../context/KeyContext";
import { Callout, Card, Button, Intent, Spinner } from "@blueprintjs/core";
import endpoints from "../../config/endpoints";
import LicenseProviderMessage from "../../dto/LicenseProviderMessage";
import useLicenseProviderApi from "../../hooks/useLicenseProviderApi";

const LicenseProviderPage: FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [licenseProvider, setLicenseProvider] = useState<
    LicenseProviderMessage | undefined
  >(undefined);
  const { activeKey } = useContext(KeyContext);
  const { registerKey } = useLicenseProviderApi();

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
    } else {
      setLicenseProvider(undefined);
    }
  }, [activeKey]);

  if (!activeKey) {
    return (
      <div>
        <h1>License Provider</h1>
        <Callout>You must select a key to access this page</Callout>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  const NotRegisteredView = (
    <Card>
      <h4>You are not registered as a License Provider</h4>
      <Button intent={Intent.SUCCESS} onClick={() => registerKey()}>
        Register
      </Button>
    </Card>
  );

  const RegisteredView = <Card>You are a registered License Provider</Card>;

  return (
    <div>
      <h1>License Provider</h1>
      <p>
        License providers are organizations who hire license holders. Examples
        of such organizations include hospitals, clinics, second opinion
        services and e-health apps. A license must be assoicated with a trusted
        license provider to be trusted. If License Providers misbehave, the
        trusting authority can remove their trust in them, thus preventing the
        used licenses from being trusted.
      </p>
      {licenseProvider ? RegisteredView : NotRegisteredView}
    </div>
  );
};

export default LicenseProviderPage;
