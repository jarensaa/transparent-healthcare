import SidebarArea from "../types/SidebarArea";

interface SidebarItem {
  headerName: string;
}

const SidebarConfig: Record<SidebarArea, SidebarItem> = {
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
    headerName: "Patient"
  },
  keys: {
    headerName: "Key management"
  }
};

export default SidebarConfig;
