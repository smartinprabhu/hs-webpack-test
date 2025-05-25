import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import PreventiveReports from '../preventiveMaintenance/reports/reports';
import inspectionNav from "./navbar/navlist.json";
import { updateHeaderData } from '../core/header/actions';
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
  getDynamicTabs,
} from '../util/appUtils';

const InspectionReports = () => {
  const { userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Inspection Schedule"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, inspectionNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(inspectionNav && inspectionNav.data && inspectionNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/inspection-overview/inspection/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Reports"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Inspection Schedule",
        moduleName: "Inspection Schedule",
        menuName: "Reports",
        link: "/inspection-overview",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <>
      <PreventiveReports type="Inspection" />
    </>
  )
};
export default InspectionReports;
