import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Tab, Tabs,
} from '@mui/material';

import {
  getActiveTab,
  getHeaderTabs,
  getMenuItems,
  getTabs,
} from '../util/appUtils';
import { setCurrentTab, setInitialValues } from '../inventory/inventoryService';
import {
  getHxAuditConfigData,
  getAuditorsFilters,
  getSystemFilters,
} from './auditService';

import { updateHeaderData } from '../core/header/actions';
import bcSideNav from './navbar/navlist.json';
import AuditConfiguration from './auditConfiguration';
import Auditors from './auditors';

const appModels = require('../util/appModels').default;

const ConfigurationSegments = () => {
  const [currentTab, setActive] = useState('AUDIT SYSTEM');
  const [activeSet, isSet] = useState(false);

  const menuList = [
    'AUDIT SYSTEM',
    'AUDITORS',
  ];

  const moduleName = 'Audit Management';
  const menuName = 'Configurations';

  const [value, setValue] = React.useState(0);

  const dispatch = useDispatch();
  const { currentWorkingTab } = useSelector(
    (state) => state.inventory,
  );

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const menuListConfig = ['Audit System', 'Auditors']; // getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], moduleName, 'name');

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getHxAuditConfigData(userInfo.data.company.id, appModels.HXAUDITCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      const findIndex = menuList && menuList.length && menuList.findIndex((item) => item.toLowerCase() === currentWorkingTab.data.toLowerCase());
      setValue(findIndex);
      setActive(currentWorkingTab.data.toUpperCase());
    } else if (!activeSet) {
      setActive('AUDIT SYSTEM');
      setValue(0);
    }
  }, [currentWorkingTab, activeSet]);

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
        link: '/audits/configuration',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActive(event.target.innerText);
    setValue(newValue);
    dispatch(getAuditorsFilters([]));
    dispatch(getSystemFilters([]));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <div className="header-box2">
        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ marginLeft: '-15px' }}>
          {menuListConfig && menuListConfig.length && menuListConfig.map((menu) => (
            menuList.includes(menu.toUpperCase()) && (
              <Tab
                label={menu}
              />
            )))}
        </Tabs>
      </div>
      {
        currentTab === 'AUDIT SYSTEM'
          ? <AuditConfiguration />
          : ''
      }
      {
        currentTab === 'AUDITORS'
          ? <Auditors />
          : ''
      }
    </Box>
  );
};

export default ConfigurationSegments;
