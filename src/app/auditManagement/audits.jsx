/* eslint-disable react/no-unknown-property */
/* eslint-disable no-return-assign */
/* eslint-disable no-lone-blocks */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getActiveTab,
  getHeaderTabs,
  getTabs,
} from '../util/appUtils';
import { updateHeaderData } from '../core/header/actions';
import bcSideNav from './navbar/navlist.json';
import CalendarSchedule from './calendarSchedule';

const Audits = () => {
  const moduleName = 'Audit Management';
  const menuName = 'Audits';
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    moduleName,
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, bcSideNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      menuName,
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: moduleName,
        moduleName,
        menuName,
        link: '/audits',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <CalendarSchedule userInfo={userInfo} />
  );
};

export default Audits;
