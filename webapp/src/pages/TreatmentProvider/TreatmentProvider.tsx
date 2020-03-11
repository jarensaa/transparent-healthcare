import React, { useContext, useEffect, useState } from "react";
import KeyContext from "../../context/KeyContext";
import { Callout, Card, Button, Intent, Spinner } from "@blueprintjs/core";
import TreatmentProviderContext, {
  TreatmentProviderContextProvider
} from "./context/TreatmentProviderContext";
import useTreatmentProviderApi from "../../hooks/useTreatmentProviderApi";
import useTreatmentApi from "../../hooks/useTreatmentApi";
import TreatmentMessage from "../../dto/TreatmentMessage";
import { TopRightMarginWrapper } from "../../styles/MarginWrappers";

const TreatmentProviderPage = () => {
  const { activeKey } = useContext(KeyContext);
  const { isLoading, treatmentProvider } = useContext(TreatmentProviderContext);

  const [treatments, setTreatments] = useState<TreatmentMessage[]>([]);

  const { registerKey } = useTreatmentProviderApi();
  const { getTreatments } = useTreatmentApi();

  useEffect(() => {
    if (activeKey) {
      getTreatments().then(setTreatments);
    }
  }, [activeKey]);

  if (!activeKey) {
    return (
      <div>
        <h1>Treatment Provider</h1>
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
        You are not a registed treatment provider
      </Callout>
      <TopRightMarginWrapper>
        <Button
          intent={Intent.SUCCESS}
          minimal
          rightIcon="arrow-right"
          onClick={registerKey}
        >
          Register
        </Button>
      </TopRightMarginWrapper>
    </div>
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
