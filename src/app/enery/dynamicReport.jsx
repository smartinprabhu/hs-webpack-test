/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';

import SharedDashboard from '../shared/sharedDashboard';
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
  getDynamicTabs,
} from '../util/appUtils';
import upsNav from './navbar/navlist.json';
import { updateHeaderData } from '../core/header/actions';

const DynamicReports = (props) => {
  const { match } = props;
  const { params } = match;
  const subMenu = params && params.submenu ? params.submenu : false;
  const module = 'Energy';
  const [isOldDashboard, setOldDashboard] = useState(false);
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
    dynamicList = getDynamicTabs(dynamicList, '/energy-overview/dynamic-report');
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
        menuName: `dynamic-report/${subMenu}`,
        link: '/energy-overview/dynamic-report',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Box>
      <SharedDashboard
        moduleName={module}
        menuName={subMenu}
        setOldDashboard={setOldDashboard}
        isOldDashboard={isOldDashboard}
        isHomeDashboards
      />
    </Box>
  );
};
export default DynamicReports;
