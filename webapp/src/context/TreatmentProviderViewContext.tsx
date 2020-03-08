import React, { useState, FunctionComponent, useEffect } from "react";
import TreatmentProviderMessage from "../dto/TreatmentProvider";
import endpoints from "../config/endpoints";
import useTreatmentProviderApi from "../hooks/useTreatmentProviderApi";

type TreatmentProviderViewPropos = {
  treatmentProviders: TreatmentProviderMessage[];
};

const TreatmentProviderViewContext = React.createContext<
  TreatmentProviderViewPropos
>({
  treatmentProviders: []
});

const TreatmentProviderViewContextProvider: FunctionComponent = ({
  children
}) => {
  const [treatmentProviders, setTreatmentProviders] = useState<
    TreatmentProviderMessage[]
  >([]);

  const { getTreatmentProviders } = useTreatmentProviderApi();

  useEffect(() => {
    getTreatmentProviders().then(providers =>
      setTreatmentProviders(treatmentProviders => [
        ...treatmentProviders,
        ...providers
      ])
    );
  }, []);

  return (
    <TreatmentProviderViewContext.Provider
      value={{
        treatmentProviders: treatmentProviders
      }}
    >
      {children}
    </TreatmentProviderViewContext.Provider>
  );
};

export { TreatmentProviderViewContextProvider };
export default TreatmentProviderViewContext;
