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
import LicenseIssuerPage from "../pages/Licenses/LicenseIssuer";
import LicenseProviderPage from "../pages/Licenses/LicenseProvider";
import ManageLicensePage from "../pages/Practitioner/ManageLicense";
import IssueTreatmentPage from "../pages/TreatmentProvider/IssueTreatmentPage";
import ApproveTreatmentsPage from "../pages/Practitioner/ApproveTreatmentsPage";
import PatientMyJournalPage from "../pages/Patient/PatientMyJournalPage";
import EvaluateTreatmentsPage from "../pages/Patient/EvaluateTreatmentsPage";
import PractitionersList from "../pages/Patient/PractitionersList";

interface RouteDefinition {
  title: string;
  path: string;
  exact: boolean;
  Component: FunctionComponent;
  sidebarArea?: SidebarArea;
}

const routes: RouteDefinition[] = [
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
    title: "Issuer",
    path: "/licenseissuer",
    exact: true,
    Component: LicenseIssuerPage,
    sidebarArea: "licenses"
  },
  {
    title: "Provider",
    path: "/licenseprovider",
    exact: true,
    Component: LicenseProviderPage,
    sidebarArea: "licenses"
  },
  {
    title: "Treatment Providers",
    path: "/treatmentProvider",
    exact: true,
    Component: TreatmentProvider,
    sidebarArea: "treatmentProvider"
  },
  {
    title: "Issue treatment",
    path: "/issuetreatment",
    exact: true,
    Component: IssueTreatmentPage,
    sidebarArea: "treatmentProvider"
  },
  {
    title: "Manage license",
    path: "/license",
    exact: true,
    Component: ManageLicensePage,
    sidebarArea: "practitioner"
  },
  {
    title: "Treatments",
    path: "/license/treatments",
    exact: true,
    Component: ApproveTreatmentsPage,
    sidebarArea: "practitioner"
  },
  {
    title: "My journal",
    path: "/patient/journal",
    exact: true,
    Component: PatientMyJournalPage,
    sidebarArea: "patient"
  },
  {
    title: "My evaluations",
    path: "/patient/evaluations",
    exact: true,
    Component: EvaluateTreatmentsPage,
    sidebarArea: "patient"
  },
  {
    title: "Practitioners view",
    path: "/license/list",
    exact: true,
    Component: PractitionersList,
    sidebarArea: "patient"
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
