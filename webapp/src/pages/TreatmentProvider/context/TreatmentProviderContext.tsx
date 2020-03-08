import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext
} from "react";
import TreatmentProviderMessage from "../../../dto/TreatmentProvider";
import KeyContext from "../../../context/KeyContext";
import useTreatmentProviderApi from "../../../hooks/useTreatmentProviderApi";

type TreatmentProviderContextProps = {
  isLoading: boolean;
  treatmentProvider?: TreatmentProviderMessage;
  register(address: string): void;
};

const TreatmentProviderContext = React.createContext<
  TreatmentProviderContextProps
>({
  isLoading: true,
  register: (address: string) => {}
});

const TreatmentProviderContextProvider: FunctionComponent = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [treatmentProvider, setTreatmentProvider] = useState<
    TreatmentProviderMessage | undefined
  >();
  const { activeKey } = useContext(KeyContext);
  const { registerKey, getTreatmentProvider } = useTreatmentProviderApi();

  useEffect(() => {
    setIsLoading(true);
    if (activeKey) {
      getTreatmentProvider(activeKey.address).then(res => {
        setTreatmentProvider(res);
        setIsLoading(false);
      });
    }
  }, [activeKey]);

  const register = (address: string) => {
    setIsLoading(true);
    registerKey().then(res => {
      setIsLoading(false);
    });
  };

  return (
    <TreatmentProviderContext.Provider
      value={{
        isLoading: isLoading,
        register: register,
        treatmentProvider: treatmentProvider
      }}
    >
      {children}
    </TreatmentProviderContext.Provider>
  );
};

export { TreatmentProviderContextProvider };
export default TreatmentProviderContext;
