import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateHeaderData } from '../../core/header/actions';
import {
  getActiveTab,
  getHeaderTabs,
  getTabs,
  getDynamicTabs,
} from '../../util/appUtils';
import upsNav from '../navbar/navlist.json';
import SharedDashboard from '../../shared/sharedDashboard';

const ComplianceOverview = () => {
  const [isOldDashboard, setOldDashboard] = useState(false);
  const subMenu = 'Insights';
  const module = 'Hazards';
  const dispatch = useDispatch();
  const { userRoles } = useSelector((state) => state.user);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    module,
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, upsNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(upsNav && upsNav.data && upsNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/hazard/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      subMenu,
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module,
        moduleName: module,
        menuName: subMenu,
        link: '/hazard-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <SharedDashboard
      moduleName={module}
      menuName={subMenu}
      setOldDashboard={setOldDashboard}
      isOldDashboard={isOldDashboard}
    />
  );
};
export default ComplianceOverview;
