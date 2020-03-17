import React, {
  FunctionComponent,
  useState,
  useEffect,
  Fragment,
  useContext
} from "react";
import FancyImageCard from "../../../components/FancyImageCard";

import { ReactComponent as OfficeImage } from "../../../images/undraw_stand_out_1oag.svg";
import useTreatmentProviderApi from "../../../hooks/useTreatmentProviderApi";
import TreatmentProviderHireDTO from "../../../dto/TreatmentProvider/TreatmentProviderHireDTO";
import FlexColumn from "../../../styles/FlexColumn";
import { H3, Card, H6, Divider } from "@blueprintjs/core";
import KeyContext from "../../../context/KeyContext";
import { TopMarginWrapper } from "../../../styles/MarginWrappers";
import FlexRow from "../../../styles/FlexRow";

const HiredPractitionersCard: FunctionComponent = () => {
  const [licenses, setLicenses] = useState<TreatmentProviderHireDTO[]>();
  const { getLicensesForProvider } = useTreatmentProviderApi();
  const { activeKey } = useContext(KeyContext);

  useEffect(() => {
    getLicensesForProvider().then(setLicenses);
  }, [activeKey]);

  const licensesCards = licenses?.map((license, index) => (
    <TopMarginWrapper key={index}>
      <Card>
        <H6>Their address</H6>
        {license.licenseAddress}
        <Divider></Divider>
        <H6>Their access token</H6>
        {license.token}
      </Card>
    </TopMarginWrapper>
  )) ?? <Fragment />;

  console.log(licenses);

  return (
    <FancyImageCard
      standardWidth
      imageAlignment="flex-start"
      LeftImage={OfficeImage}
    >
      <FlexColumn>
        <H3>Your hired pracitioners</H3>
        {licensesCards}
      </FlexColumn>
    </FancyImageCard>
  );
};

export default HiredPractitionersCard;
