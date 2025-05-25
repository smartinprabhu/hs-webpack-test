/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Navbar from "./navbar";
import { getMenuItems, getSequencedMenuItems } from "../util/appUtils";

const Dashboard = () => {
  const [currentDashboard, setCurrentDashboard] = useState(0);
  const [currentTab, setActive] = useState(0);

  const { userRoles } = useSelector((state) => state.user);
  useSelector((state) => state.auth);

  const menuList = getMenuItems(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    "Occupancy",
    "name"
  );
  const menus = getSequencedMenuItems(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    "Occupancy",
    "name"
  );

  const [isOldDashboard, setOldDashboard] = useState(false);

  useEffect(() => {
    if (menus && menus.length && !currentDashboard) {
      setCurrentDashboard(menus[0]);
    }
  }, [menus]);

  return (
    <div
    //  className={pinEnableData ? 'content-box-expand' : 'content-box'}
    >
      {!isOldDashboard && menuList && menuList.length > 0 && (
        <Navbar
          setActive={setActive}
          setCurrentDashboard={setCurrentDashboard}
          currentTab={currentTab}
          currentDashboard={currentDashboard}
        />
      )}
    </div>
  );
};
export default Dashboard;
