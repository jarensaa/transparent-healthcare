import React, { useContext } from "react";
import TreatmentProviderContext from "../TreatmentProvider/context/TreatmentProviderContext";

const TreatmentProviderView = () => {
  const { treatmentProvider } = useContext(TreatmentProviderContext);

  return <h2>Treatment Provider View</h2>;
};

export default TreatmentProviderView;
