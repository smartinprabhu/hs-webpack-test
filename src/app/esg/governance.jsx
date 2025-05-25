import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardComponent from "@shared/dashboardComponent";
import { getActiveTab, getHeaderTabs, getTabs } from "../util/appUtils";
import esgSidenav from "./navbar/navlist.json";
import { updateHeaderData } from "../core/header/actions";

const Governance = () => {
  const { userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, "ESG");

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, esgSidenav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Governance"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "ESG",
        moduleName: "ESG",
        menuName: "Governance",
        link: "/esg-governance",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <DashboardComponent
      module="ESG"
      moduleName="ESG"
      menuName="Governance"
      link="/esg-governance"
      headerTabs={tabs.filter((e) => e)}
      activeTab={activeTab}
    />
  );
};

export default Governance;
