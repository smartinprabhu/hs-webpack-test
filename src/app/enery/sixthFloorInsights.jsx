/* eslint-disable import/no-unresolved */
import React from "react";
import DashboardComponent from "@shared/dashboardComponent";
import { useSelector } from "react-redux";
import { getActiveTab, getHeaderTabs, getTabs, getDynamicTabs } from "../util/appUtils";
import upsNav from "././navbar/navlist.json";

const Insights = () => {
  const { userRoles } = useSelector((state) => state.user);

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, "Energy");
  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, upsNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(upsNav && upsNav.data && upsNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/energy-overview/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Insights - 6th Floor"
    );
  }

  return (
    <DashboardComponent
      module="Energy"
      moduleName="Energy"
      menuName="Insights - 6th Floor"
      link="/energy-sixth-floor-insights"
      headerTabs={tabs.filter((e) => e)}
      activeTab={activeTab}
    />
  );
};

export default Insights;
