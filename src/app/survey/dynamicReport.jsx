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
import surveyNav from './navbar/navlist.json';
import { updateHeaderData } from '../core/header/actions';

const DynamicReports = (props) => {
  const { match } = props;
  const { params } = match;
  const subMenu = params && params.submenu ? params.submenu : false;
  const module = 'Survey';
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
    const tabsDef = getTabs(headerTabs[0].menu, surveyNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(surveyNav && surveyNav.data && surveyNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/survey/dynamic-report');
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
        module: 'Survey',
        moduleName: 'Survey',
        menuName: `dynamic-report/${subMenu}`,
        link: '/survey',
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
