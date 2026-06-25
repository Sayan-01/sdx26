import React from "react";
import { SidebarComp } from "../../../../components/global/sidebar-comp";
import { sidebarNav, sidebarUtils } from "../../../../constants";

const Sidebar = ({ userId, activePlan }: { userId: string; activePlan: string }) => {
  return (
    <>
      <SidebarComp
        defaultOption={true}
        userId={userId}
        activePlan={activePlan}
        sidebarNav={sidebarNav}
        sidebarUtils={sidebarUtils}
      />
      <SidebarComp
        userId={userId}
        activePlan={activePlan}
        sidebarNav={sidebarNav}
        sidebarUtils={sidebarUtils}
      />
    </>
  );
};

export default Sidebar;
