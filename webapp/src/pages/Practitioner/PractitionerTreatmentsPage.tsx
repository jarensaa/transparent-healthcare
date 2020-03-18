import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
  Fragment
} from "react";
import { Callout, Intent, H1, H2, Button, MenuItem } from "@blueprintjs/core";
import FlexColumn from "../../styles/FlexColumn";
import FancyIssueTreatmentsCard from "./components/FancyIssueTreatmentCard";
import FancyApproveTreatmentsCard from "./components/FancyApproveTreatmentCard";
import FancyLicenseTrustedCard from "./components/FancyLicenseTrustedCard";
import KeyContext from "../../context/KeyContext";
import DescriptionBox from "../../components/DescriptionBox";
import FancyImageCard from "../../components/FancyImageCard";
import { ReactComponent as TreatmentImage } from "../../images/undraw_coming_home_52ir.svg";
import useTreatmentProviderApi from "../../hooks/useTreatmentProviderApi";
import TreatmentProviderHireDTO from "../../dto/TreatmentProvider/TreatmentProviderHireDTO";
import { Select, ItemPredicate, IItemRendererProps } from "@blueprintjs/select";
import highlightText from "../Shared/components/highlighttext";
import LicenseMessage from "../../dto/LicenseMessage";
import useLicenseApi from "../../hooks/useLicenseApi";

const TreatmentProviderSelect = Select.ofType<TreatmentProviderHireDTO>();

const treatmentProviderPredicate: ItemPredicate<TreatmentProviderHireDTO> = (
  query,
  treatmentProvider
) => {
  if (!treatmentProvider.providerAddress) return false;
  const normalizedName = treatmentProvider.providerAddress.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  return normalizedName?.indexOf(normalizedQuery) >= 0;
};

const PractitionerTreatmentPage: FunctionComponent = () => {
  const { activeKey } = useContext(KeyContext);

  const { getProvidersForLicense } = useTreatmentProviderApi();
  const { getLicenseFromAddress } = useLicenseApi();
  const [license, setLicense] = useState<LicenseMessage | undefined>(undefined);

  const [treatmentProviders, setTreatmentProviders] = useState<
    TreatmentProviderHireDTO[]
  >([]);

  const [selectedTreatmentProvider, setSelectedTreatmentProvider] = useState<
    TreatmentProviderHireDTO | undefined
  >(undefined);

  useEffect(() => {
    if (activeKey && license) {
      getProvidersForLicense().then(setTreatmentProviders);
    } else if (activeKey) {
      getLicenseFromAddress(activeKey.address).then(setLicense);
    } else {
      setTreatmentProviders([]);
    }
  }, [activeKey, license]);

  const header = (
    <Fragment>
      <H1>Practitioner treaments</H1>
      <DescriptionBox>
        As in the real world, pracitioners <i>in the field</i> are the ones who
        first issue treatments to patients. Treatments are allways created in
        context of a given treatment provider where they are hired. This page
        allows practitioners to propose treatments if they are trusted.
      </DescriptionBox>
    </Fragment>
  );

  if (!activeKey) {
    return (
      <FlexColumn>
        {header}
        <Callout intent={Intent.WARNING}>
          You must select a key to access this page
        </Callout>
      </FlexColumn>
    );
  }

  if (!license) {
    return (
      <Fragment>
        {header}
        <Callout intent={Intent.WARNING}>
          You do not have a license. You must get a license issuer to issue one
          for you.
        </Callout>
      </Fragment>
    );
  }

  const treatmentProviderRenderer = (
    item: TreatmentProviderHireDTO,
    { query, handleClick }: IItemRendererProps
  ) => {
    const label = " ETH";

    const name = item.providerAddress;

    return (
      <MenuItem
        active={
          selectedTreatmentProvider?.providerAddress === item.providerAddress
        }
        key={item.providerAddress + Math.random().toString(16)}
        onClick={handleClick}
        text={highlightText(name, query)}
      />
    );
  };

  return (
    <FlexColumn>
      {header}
      <H2>License status</H2>
      <FancyLicenseTrustedCard />
      <H2>Issue treatments</H2>
      <FancyImageCard small LeftImage={TreatmentImage}>
        <H2>Choose your treatment provider</H2>
        <p>
          Practitioners issue treatments in context of a treatment provider. You
          must choose one to be able to issue treatments.
        </p>
        <TreatmentProviderSelect
          items={treatmentProviders}
          itemRenderer={treatmentProviderRenderer}
          noResults={<MenuItem disabled={true} text="No results." />}
          onItemSelect={item => setSelectedTreatmentProvider(item)}
          itemPredicate={treatmentProviderPredicate}
        >
          <Button minimal icon="key" intent={Intent.PRIMARY}>
            {selectedTreatmentProvider?.providerAddress ??
              "Select treatment provider"}
          </Button>
        </TreatmentProviderSelect>
      </FancyImageCard>
      <FancyIssueTreatmentsCard treatmentProvider={selectedTreatmentProvider} />
      <H2>Approve treatments</H2>
      <FancyApproveTreatmentsCard />
    </FlexColumn>
  );
};

export default PractitionerTreatmentPage;
