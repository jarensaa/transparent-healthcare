import Home from "../pages/Home/Home";
import Authority from "../pages/Authority/Authority";
import Keys from "../pages/Keys/Keys";
import TreatmentProvider from "../pages/TreatmentProvider/TreatmentProvider";
import { FunctionComponent } from "react";
import Proposal from "../pages/Proposal/Proposal";
import SidebarArea from "../types/SidebarArea";

interface RouteDefinition {
  title: string;
  path: string;
  exact: boolean;
  showInSidebar: boolean;
  sidebarArea?: SidebarArea;
  Component: FunctionComponent;
}

const routes: RouteDefinition[] = [
  {
    title: "Home",
    path: "/",
    exact: true,
    showInSidebar: true,
    sidebarArea: "home",
    Component: Home
  },
  {
    title: "Proposal",
    path: "/proposal/:proposalId",
    exact: true,
    showInSidebar: false,
    Component: Proposal
  },
  {
    title: "Authority",
    path: "/authority",
    exact: true,
    showInSidebar: true,
    sidebarArea: "trust",
    Component: Authority
  },
  {
    title: "Treatment Provider",
    path: "/treatmentProvider",
    exact: true,
    showInSidebar: true,
    sidebarArea: "trust",
    Component: TreatmentProvider
  },
  {
    title: "Keys and funds",
    path: "/keys",
    exact: true,
    showInSidebar: true,
    sidebarArea: "keys",
    Component: Keys
  }
];

export default routes;
