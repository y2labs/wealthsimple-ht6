import React from 'react';
import SidebarPetInfo from 'SidebarPetInfo';
import SidebarUserInfo from 'SidebarUserInfo';

const Sidebar = () => {
  return (
    <div>
      <div className="sidebar--wrapper">
        <SidebarPetInfo />
      </div>

      <div className="sidebar--wrapper">
        <SidebarUserInfo />
      </div>
    </div>
  );
};

export default Sidebar;
