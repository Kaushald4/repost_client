import { getAllCommunitiesAction } from "@/features/community";
import SidebarShell from "./SidebarShell";

export const Sidebar = async () => {
  const data = await getAllCommunitiesAction();

  return <SidebarShell initialData={data.data} />;
};
