/* eslint-disable no-return-assign */
/* eslint-disable no-lone-blocks */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import React, { useEffect } from 'react';
import Box from '@mui/system/Box';
import { useDispatch, useSelector } from 'react-redux';

import {
  getActiveTab,
  getHeaderTabs,
  getTabs,
} from '../util/appUtils';
import { updateHeaderData } from '../core/header/actions';
import bcSideNav from './navbar/navlist.json';

const AuditReports = () => {
  const moduleName = 'Audit Management';
  const menuName = 'Report';
  const dispatch = useDispatch();

  const { userRoles } = useSelector((state) => state.user);

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
        link: '/audit/reports',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Box />
  );
};

export default AuditReports;
