import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import {
  getMenuItems, getHeaderTabs, getTabs, getDynamicTabs, getActiveTab,
} from '../../util/appUtils';
import SharedDashboard from '../../shared/sharedDashboard';
import wasteSideNav from '../navbar/navlist.json';
import { updateHeaderData } from '../../core/header/actions';

const appModels = require('../../util/appModels').default;

const ComplianceOverview = () => {
  const [isOldDashboard, setOldDashboard] = useState(false);

  const dispatch = useDispatch();

  const subMenu = 'Insights';
  const module = 'Waste Tracker';
  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Waste Tracker', 'name');

  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);
  if (!isMenu) {
    return (<Redirect to="/waste-trackers" />);
  }

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, 'Waste Tracker');

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, wasteSideNav.data);
    const tabsDef = getTabs(headerTabs[0].menu, wasteSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(wasteSideNav && wasteSideNav.data && wasteSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/waste/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Insights',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Waste Tracker',
        moduleName: 'Waste Tracker',
        menuName: '',
        link: '/waste-trackers',
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
