import React, { FunctionComponent } from "react";
import FancyImageCard from "../../../components/FancyImageCard";

import { ReactComponent as OfficeImage } from "../../../images/undraw_coming_home_52ir.svg";

const TreatmentProviderTreatmentsCard: FunctionComponent = () => {
  return (
    <FancyImageCard LeftImage={OfficeImage}>
      Treatments card is here
    </FancyImageCard>
  );
};

export default TreatmentProviderTreatmentsCard;
