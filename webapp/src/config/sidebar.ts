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
  licenses: {
    headerName: "Licenses"
  },
  treatmentProvider: {
    headerName: "Treatment Provider"
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
