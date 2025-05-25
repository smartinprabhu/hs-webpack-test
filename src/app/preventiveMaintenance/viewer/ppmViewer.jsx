/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import 'antd/dist/antd.css';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Calendar from './calendarSchedule';
import {
  getMenuItems, getDynamicTabs,
  getActiveTab, getHeaderTabs, getTabs,
} from '../../util/appUtils';
import { updateHeaderData } from '../../core/header/actions';
import PPMSideNav from '../navbar/navlist.json';
import AuthService from '../../util/authService';

import AccountIdLogin from '../../auth/accountIdLogin';

const PpmViewer = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const subMenu = 'PPM Viewer';
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  const headerTabs = isAuthenticated ? getHeaderTabs(
    userRoles?.data?.allowed_modules,
    '52 Week PPM',
  ) : false;


  const location = useLocation();
  const path = location.pathname;

  let activeTab;
  let tabs;

  if (headerTabs && isAuthenticated) {
    const tabsDef = getTabs(headerTabs[0].menu, PPMSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(PPMSideNav && PPMSideNav.data && PPMSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/preventive-overview/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Viewer',
    );
  }
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(
        updateHeaderData({
          module: '52 Week PPM',
          moduleName: '52 Week PPM',
          menuName: 'Viewer',
          link: '/preventive-overview/preventive-viewer',
          headerTabs: tabs.filter((e) => e),
          activeTab,
        }),
      );
    }
  }, [activeTab]);

  return (
    <>
      {(!isAuthenticated && uuid) && (
      <AccountIdLogin redirectLink={path} />
      )}
      {isAuthenticated && (
      <Calendar userInfo={userInfo} uuid={uuid} />
      )}
    </>
  );
};

export default PpmViewer;
