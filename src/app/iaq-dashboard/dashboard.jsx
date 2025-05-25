/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";



import {
  getActiveTab,
  getHeaderTabs,
  getSequencedMenuItems,
  getTabs,
} from "../util/appUtils";

import { resetDefaultFilterInfo, resetNinjaDashboard } from "../analytics/analytics.service";
import DashboardIOTView from "../apexDashboards/assetsDashboard/dashboardIOTView";
import dashboardCodes from "../data/dashboardCodes.json";
import iaqSideNav from "./navbar/navlist.json";
import { updateHeaderData } from "../core/header/actions";

const appModels = require("../util/appModels").default;

const Overview = () => {
  const [menu, setMenu] = useState("");

  const { userRoles } = useSelector((state) => state.user);

  const { pinEnableData } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const code =
    dashboardCodes && dashboardCodes.codes && dashboardCodes.codes.IAQ
      ? dashboardCodes.codes.IAQ
      : "";

  useEffect(() => {
    const getmenus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      "IAQ Dashboard",
      "name"
    );
    let insights = "";
    if (getmenus && getmenus.length) {
      insights = getmenus.find(
        (menu) => menu.name.toLowerCase() === "insights"
      );
    }
    dispatch(resetDefaultFilterInfo());
    dispatch(resetNinjaDashboard());
    setMenu(insights || "");
  }, [userRoles]);

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
      "Insights"
    );
  }

  /* useEffect(() => {
    dispatch(resetNinjaCode());
    dispatch(getNinjaCode(code, appModels.NINJABOARD));
    setIsShow(true);
  }, []); */

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "IAQ Dashboard",
        moduleName: "IAQ",
        menuName: "Insights",
        link: "/iaq-dashboard",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    // <div className={pinEnableData ? "content-box-expand" : "content-box"}>
    <>
      {/* <Header
        headerPath="IAQ"
        nextPath="Insights"
        pathLink="/iaq-dashboard"
        headerTabs={tabs.filter((e) => e)}
        activeTab={activeTab}
      /> */}
      {menu && menu.dashboard_code && (
        <DashboardIOTView
          dashboardCode={menu.dashboard_code}
          dashboardUuid={menu.uuid}
          isIAQ={true}
        />
      )}
    </>
    // </div>
  );
};
export default Overview;
