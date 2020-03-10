import React, { useState, FunctionComponent, useEffect } from "react";
import TreatmentProviderMessage from "../dto/TreatmentProvider";
import useTreatmentProviderApi from "../hooks/useTreatmentProviderApi";

type AuthorityViewsContextProps = {
  treatmentProviders: TreatmentProviderMessage[];
};

const AuthorityViewsContext = React.createContext<AuthorityViewsContextProps>({
  treatmentProviders: []
});

const AuthorityViewsContextProvider: FunctionComponent = ({ children }) => {
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
    <AuthorityViewsContext.Provider
      value={{
        treatmentProviders: treatmentProviders
      }}
    >
      {children}
    </AuthorityViewsContext.Provider>
  );
};

export { AuthorityViewsContextProvider };
export default AuthorityViewsContext;
