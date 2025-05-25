/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import Navbar from './inventoryNavbar/navbar';
import ReportList from './reportList';
import { updateHeaderData } from "../core/header/actions";
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from "../util/appUtils";
import inventoryNav from "./inventoryNavbar/navlist.json";

const ReportsSetup = () => {
  const subMenu = 'Reports';
  const { userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Inventory"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, inventoryNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Reports"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Inventory",
        moduleName: "Inventory",
        menuName: "Reports",
        link: "/inventory-overview/inventory/reports",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <ReportList />
  );
};

export default ReportsSetup;
