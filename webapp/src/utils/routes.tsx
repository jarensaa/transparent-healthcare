import Home from "../pages/Home/Home";
import Authority from "../pages/Authority/Authority";
import Keys from "../pages/Keys/Keys";
import TreatmentProvider from "../pages/TreatmentProvider/TreatmentProvider";

interface RouteDefinition {
  title: string;
  path: string;
  Component: any;
  exact: boolean;
}

const routes: RouteDefinition[] = [
  {
    title: "Home",
    path: "/",
    exact: true,
    Component: Home
  },
  {
    title: "Authority",
    path: "/authority",
    exact: true,
    Component: Authority
  },
  {
    title: "TreatmentProvider",
    path: "/treatmentProvider",
    exact: true,
    Component: TreatmentProvider
  },
  {
    title: "Keys",
    path: "/keys",
    exact: true,
    Component: Keys
  }
];

export default routes;
