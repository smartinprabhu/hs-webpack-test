/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import Navbar from '../navbar/navbar';
import ConfigurationSegments from './configurationSegments';
import ordersNav from "../navbar/navlist.json";
import { updateHeaderData } from "../../core/header/actions";
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from "../../util/appUtils";

const ConfigurationSetup = () => {
  const subMenu = 'Configuration';
  const dispatch = useDispatch();
  const { userRoles } = useSelector((state) => state.user);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Pantry Management"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, ordersNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Configuration"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Pantry Management",
        moduleName: "Pantry Management",
        menuName: "Configuration",
        link: "/pantry/configuration",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <ConfigurationSegments />

  );
};

export default ConfigurationSetup;
