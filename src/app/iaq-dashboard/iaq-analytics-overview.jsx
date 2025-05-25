import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardComponent from "@shared/dashboardComponent";
import { getActiveTab, getHeaderTabs, getTabs } from "../util/appUtils";

import iaqSideNav from "./navbar/navlist.json";
import { updateHeaderData } from "../core/header/actions";

const IaqAnalyticsOverview = () => {
  const { userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "IAQ Dashboard"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, iaqSideNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Analytics"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "IAQ Dashboard",
        moduleName: "IAQ",
        menuName: "Analytics",
        link: "/iaq-analytics-overview",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <DashboardComponent
      module="IAQ Dashboard"
      moduleName="IAQ Dashboard"
      menuName="Analytics"
      link="/iaq-analytics-overview"
      headerTabs={tabs.filter((e) => e)}
      activeTab={activeTab}
    />
  );
};

export default IaqAnalyticsOverview;
