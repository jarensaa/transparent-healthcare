import Home from "../pages/Home/Home";
import Authority from "../pages/Authority/Authority";
import Keys from "../pages/Keys/Keys";
import TreatmentProvider from "../pages/TreatmentProvider/TreatmentProvider";
import { FunctionComponent } from "react";
import Proposal from "../pages/Proposal/Proposal";
import SidebarArea from "../types/SidebarArea";
import TreatmentProviderView from "../pages/Authority/TreatmentProviderView";
import LicenseIssuerView from "../pages/Authority/LicenseIssuerView";
import LicenseProviderView from "../pages/Authority/LicenseProviderView";
import LicenseIssuerPage from "../pages/LicenseIssuer/LicenseIssuer";

interface RouteDefinition {
  title: string;
  path: string;
  exact: boolean;
  Component: FunctionComponent;
  sidebarArea?: SidebarArea;
}

const routes: RouteDefinition[] = [
  {
    title: "Home",
    path: "/",
    exact: true,
    Component: Home,
    sidebarArea: "home"
  },
  {
    title: "Proposal",
    path: "/proposal/:proposalId",
    exact: true,
    Component: Proposal
  },
  {
    title: "Authority",
    path: "/authority",
    exact: true,
    Component: Authority,
    sidebarArea: "authority"
  },
  {
    title: "Treatment Providers",
    path: "/authority/treatmentproviders",
    exact: true,
    Component: TreatmentProviderView,
    sidebarArea: "authority"
  },
  {
    title: "License Issuers",
    path: "/authority/licenseissuers",
    exact: true,
    Component: LicenseIssuerView,
    sidebarArea: "authority"
  },
  {
    title: "License Providers",
    path: "/authority/licenseproviders",
    exact: true,
    Component: LicenseProviderView,
    sidebarArea: "authority"
  },
  {
    title: "Treatment Providers",
    path: "/treatmentProvider",
    exact: true,
    Component: TreatmentProvider,
    sidebarArea: "treatmentProvider"
  },
  {
    title: "Issuer",
    path: "/licenseissuer",
    exact: true,
    Component: LicenseIssuerPage,
    sidebarArea: "licenses"
  },
  {
    title: "Keys and funds",
    path: "/keys",
    exact: true,
    Component: Keys,
    sidebarArea: "keys"
  }
];

export default routes;
