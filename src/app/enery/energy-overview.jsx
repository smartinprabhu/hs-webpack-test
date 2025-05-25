/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import SharedDashboard from '../shared/sharedDashboard';

import {
  getActiveTab,
  getHeaderTabs,
  getSequencedMenuItems,
  getTabs,
  getDynamicTabs,
} from '../util/appUtils';

import upsNav from './navbar/navlist.json';
import { updateHeaderData } from '../core/header/actions';

const appModels = require('../util/appModels').default;

const EnergyOverView = () => {
  const subMenu = 'Insights';
  const module = 'Energy';
  const dispatch = useDispatch();

  const [isOldDashboard, setOldDashboard] = useState(false);
  const [checkMenu, setCheckMenu] = useState('');
  const [menu, setMenu] = useState('');

  //   if (!isMenu) {
  //     return (<Redirect to="/attendance-overview" />);
  //   }
  const { userRoles } = useSelector((state) => state.user);
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Energy',
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
      'Insights',
    );
  }

  const history = useHistory();

  const moduleId = userRoles?.data?.allowed_modules?.filter(
    (each) => each.name === 'Energy',
  )[0]?.id;

  useEffect(() => {
    const getmenus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      'Energy',
      'name',
    );
    let insights = '';
    if (getmenus && getmenus.length) {
      insights = getmenus.find(
        (menu) => menu.name.toLowerCase() === 'insights',
      );
    }
    setCheckMenu(true);
    setMenu(insights || '');
  }, [userRoles]);

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Energy',
        moduleName: 'Energy',
        menuName: 'Insights',
        link: '/energy-insights-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  if (!menu && checkMenu) {
    return (
      // <Redirect
      //   to={{
      //     pathname: `/energy-insights-overview/energy-sixth-floor-insights#${moduleId}`,
      //   }}
      // />
      history.push(`/energy-sixth-floor-insights#${moduleId}`)
    );
  }

  return (
    <SharedDashboard
      moduleName={module}
      menuName={subMenu}
      setOldDashboard={setOldDashboard}
      isOldDashboard={isOldDashboard}
    />
  );
};

export default EnergyOverView;
