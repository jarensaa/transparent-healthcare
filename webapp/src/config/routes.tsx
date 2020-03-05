import Home from "../pages/Home/Home";
import Authority from "../pages/Authority/Authority";
import Keys from "../pages/Keys/Keys";
import TreatmentProvider from "../pages/TreatmentProvider/TreatmentProvider";
import { FunctionComponent } from "react";
import Proposal from "../pages/Proposal/Proposal";

interface RouteDefinition {
  title: string;
  path: string;
  exact: boolean;
  showInSidebar: boolean;
  Component: FunctionComponent;
}

const routes: RouteDefinition[] = [
  {
    title: "Home",
    path: "/",
    exact: true,
    showInSidebar: true,
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
    Component: Authority
  },
  {
    title: "Treatment Provider",
    path: "/treatmentProvider",
    exact: true,
    showInSidebar: true,
    Component: TreatmentProvider
  },
  {
    title: "Keys and funds",
    path: "/keys",
    exact: true,
    showInSidebar: true,
    Component: Keys
  }
];

export default routes;
