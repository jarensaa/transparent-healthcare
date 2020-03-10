import React, { useContext } from "react";
import KeyContext from "../../context/KeyContext";
import { Callout, Card, Button, Intent, Spinner } from "@blueprintjs/core";
import TreatmentProviderContext, {
  TreatmentProviderContextProvider
} from "./context/TreatmentProviderContext";
import useTreatmentProviderApi from "../../hooks/useTreatmentProviderApi";

const TreatmentProviderPage = () => {
  const { activeKey } = useContext(KeyContext);
  const { isLoading, treatmentProvider } = useContext(TreatmentProviderContext);
  const { registerKey } = useTreatmentProviderApi();

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
      <h4>You are not registered as a Treatment Provider.</h4>
      <Button intent={Intent.SUCCESS} onClick={registerKey}>
        Register
      </Button>
    </Card>
  );

  const RegisteredView = <Card>You are a registered treatment provider.</Card>;

  return (
    <div>
      <h1>TreatmentProvider</h1>
      {treatmentProvider ? RegisteredView : NotRegisteredView}
    </div>
  );
};

const TreatmentProvider = () => {
  return (
    <TreatmentProviderContextProvider>
      <TreatmentProviderPage />
    </TreatmentProviderContextProvider>
  );
};

export default TreatmentProvider;
