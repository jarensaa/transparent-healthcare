import SidebarArea from "../types/SidebarArea";

interface SidebarItem {
  headerName: string;
}

const SidebarConfig: Record<SidebarArea, SidebarItem> = {
  home: {
    headerName: "Home"
  },
  authority: {
    headerName: "Authority"
  },
  treatmentProvider: {
    headerName: "Treatment Provider"
  },
  licenses: {
    headerName: "Licenses"
  },
  practitioner: {
    headerName: "Pracitioner view"
  },
  patient: {
    headerName: "Patient view"
  },
  keys: {
    headerName: "Key management"
  }
};

export default SidebarConfig;
