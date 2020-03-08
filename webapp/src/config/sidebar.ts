import SidebarArea from "../types/SidebarArea";

interface SidebarItem {
  headerName: string;
}

const SidebarConfig: Record<SidebarArea, SidebarItem> = {
  home: {
    headerName: "Home"
  },
  trust: {
    headerName: "Trust management"
  },
  keys: {
    headerName: "Key management"
  }
};

export default SidebarConfig;
