/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AuthService from '../../util/authService';
import Calendar from './calendarSchedule';
import inspectionNav from '../navbar/navlist.json';
import { updateHeaderData } from '../../core/header/actions';
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
  getDynamicTabs,
} from '../../util/appUtils';
import AccountIdLogin from '../../auth/accountIdLogin';

const InspectionViewer = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;

  const subMenu = 'Inspection Viewer';
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const headerTabs = userRoles && userRoles.data ? getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Inspection Schedule',
  ) : '';

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
      'Inspection Viewer',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Inspection Schedule',
        moduleName: 'Inspection Schedule',
        menuName: 'Inspection Viewer',
        link: '/inspection-overview',
        headerTabs: tabs ? tabs.filter((e) => e) : [],
        activeTab,
      }),
    );
  }, [activeTab]);

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  return (
    <>
      {(!isAuthenticated && uuid) && (
      <AccountIdLogin redirectLink={`/inspection-overview/inspection-viewer/${uuid}`} />
      )}
      {isAuthenticated && (
      <Calendar userInfo={userInfo} uuid={uuid || false} />
      )}
    </>
  );
};

export default InspectionViewer;
