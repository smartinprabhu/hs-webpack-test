/* eslint-disable import/no-unresolved */
import React, { useEffect } from "react";
import DashboardComponent from "@shared/dashboardComponent";
import { useDispatch, useSelector } from "react-redux";
import { getActiveTab, getHeaderTabs, getTabs, getDynamicTabs } from "../util/appUtils";
import washroomNav from "././navbar/navlist.json";
import { updateHeaderData } from "../core/header/actions";

const SmartWashroom = () => {
  const { userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Smart Washroom"
  );
  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, washroomNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(washroomNav && washroomNav.data && washroomNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/smart-clean/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Insights"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Smart Washroom",
        moduleName: "Smart Washroom",
        menuName: "Insights",
        link: "/smart-clean",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <DashboardComponent
      module="Smart Washroom"
      moduleName="Smart Washroom"
      menuName="Insights"
      link="/smart-clean"
      headerTabs={tabs.filter((e) => e)}
      activeTab={activeTab}
    />
  );
};

export default SmartWashroom;
