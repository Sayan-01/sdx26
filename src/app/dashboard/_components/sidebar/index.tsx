import React from "react";
import { SidebarComp } from "./sidebar-comp";

const Sidebar = ({userId}: {userId: string}) => {
  return (
    <>
      <SidebarComp defaultOption={true} userId={userId} />
      <SidebarComp userId={userId} />
    </>
  );
};

export default Sidebar;
