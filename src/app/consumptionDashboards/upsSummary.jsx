/* eslint-disable import/no-unresolved */
import React, { useEffect } from "react";
import DashboardComponent from "@shared/dashboardComponent";
import { useDispatch, useSelector } from "react-redux";
import { getActiveTab, getHeaderTabs, getTabs } from "../util/appUtils";
import upsNav from "././navbar/navlist.json";
import { updateHeaderData } from "../core/header/actions";

const UpsSummary = () => {
  const { userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, "UPS");
  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, upsNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "UPS Summary"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "UPS",
        moduleName: "UPS",
        menuName: "Ups Summary",
        link: "/ups-summary-overview",
        headerTabs: tabs.filter((e) => e),
        activeTab: activeTab,
      })
    );
  }, [activeTab]);

  return (
    <DashboardComponent
      module="UPS"
      moduleName="UPS"
      menuName="Ups Summary"
      link="/ups-summary-overview"
      headerTabs={tabs.filter((e) => e)}
      activeTab={activeTab}
    />
  );
};

export default UpsSummary;
