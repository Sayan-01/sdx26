import React from "react";
import { SidebarComp } from "../../../../components/global/sidebar-comp";
import { sidebarNav, sidebarUtils } from "../../../../constants";

const Sidebar = ({ userId }: { userId: string }) => {
  return (
    <>
      <SidebarComp
        defaultOption={true}
        userId={userId}
        sidebarNav={sidebarNav}
        sidebarUtils={sidebarUtils}
      />
      <SidebarComp
        userId={userId}
        sidebarNav={sidebarNav}
        sidebarUtils={sidebarUtils}
      />
    </>
  );
};

export default Sidebar;
