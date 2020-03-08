import Home from "../pages/Home/Home";
import Authority from "../pages/Authority/Authority";
import Keys from "../pages/Keys/Keys";
import TreatmentProvider from "../pages/TreatmentProvider/TreatmentProvider";
import { FunctionComponent } from "react";
import Proposal from "../pages/Proposal/Proposal";
import SidebarArea from "../types/SidebarArea";
import TreatmentProviderView from "../pages/Authority/TreatmentProviderView";

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
    title: "Treatment Providers",
    path: "/treatmentProvider",
    exact: true,
    Component: TreatmentProvider,
    sidebarArea: "treatmentProvider"
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
