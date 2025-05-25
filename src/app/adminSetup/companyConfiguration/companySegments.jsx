/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Tab, Tabs,
} from '@mui/material';
import {
  getActiveTab,
  getHeaderTabs,
  getMenuItemsForCompanyConfig, getMenuItemsForSite,
  getTabs,
} from '../../util/appUtils';
import tabs from './tabs.json';

import CompanyInfo from '../companyInfo';
import AdminUser from './adminUserListEditable';
import Sites from './sitesList/adminSitesListEditable';
import Buildings from '../assetsLocationConfiguration/buildings';
import Floors from '../assetsLocationConfiguration/floors';
import Rooms from '../assetsLocationConfiguration/rooms';
import Spaces from '../assetsLocationConfiguration/spaces';
import Assets from '../assetsLocationConfiguration/assets';
import { resetBulkUpdate } from '../../helpdesk/actions';
import { getCompanyDetail, getSiteFilters, getTeamFilters } from '../setupService';
import { getEquipmentFilters } from '../../assets/equipmentService';

import { updateHeaderData } from '../../core/header/actions';
import {
  setCurrentTab,
} from '../../inventory/inventoryService';
import adminSetupNav from '../navbar/navlist.json';
import Shifts from '../siteConfiguration/shifts';
import TeamMembers from '../siteConfiguration/teamMembers';
import Teams from '../siteConfiguration/teamsListEditable';
import Tenants from '../siteConfiguration/tenants';

const appModels = require('../../util/appModels').default;

const CompanySegments = () => {
  const dispatch = useDispatch();
  const [activeSet, isSet] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [value, setValue] = React.useState(0);
  // let menuList = ['Company Configuration'];
  let menuList = ['Facility'];
  // const menuSiteList = ['Teams', 'Team Members', 'Shifts', 'Tenants'];
  const menuSiteList = ['Teams', 'Buildings', 'Floors', 'Rooms', 'Spaces', 'Assets'];
  const allowedMenuList = getMenuItemsForCompanyConfig(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'Company Configuration', 'name');
  menuList = menuList.concat(allowedMenuList);
  const allMenuSiteList = getMenuItemsForSite(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', menuSiteList, 'name');
  menuList = menuList.concat(allMenuSiteList);
  const [currentTab, setActive] = useState('Sites');
  const { currentWorkingTab } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(getCompanyDetail(userInfo.data.company.id, appModels.COMPANY));
  }, []);

  /* useEffect(() => {
    if (menuList && menuList.length) {
      const activeMenus = [];
      menuList.map((menu) => (
        tabs && tabs.tabsList && tabs.tabsList[menu] && (
          activeMenus.push(tabs.tabsList[menu].name)
        )
      ));
      const index = activeMenus.findIndex((obj) => (obj === 'COMPANY INFO'));
      if (index === -1) {
        setActive(activeMenus[0]);
      }
    }
  }, [menuList]); */

  /* const onClose = () => {
    if (userInfo && userInfo.data) {
      dispatch(getCompanyDetail(userInfo.data.company.id, appModels.COMPANY));
    }
  }; */

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      const findIndex = menuList && menuList.length && menuList.findIndex((val) => val.toLowerCase() === currentWorkingTab.data.toLowerCase());
      setValue(findIndex);
      setActive(currentWorkingTab.data.toUpperCase());
    } else if (!activeSet) {
      setActive('SITES');
      setValue(0);
    }
  }, [currentWorkingTab, activeSet]);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Admin Setup',
  );

  let activeTab;
  let tabss;

  if (headerTabs) {
    tabss = getTabs(headerTabs[0].menu, adminSetupNav.data);
    activeTab = getActiveTab(
      tabss.filter((e) => e),
      'Facility',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Facility',
        link: '/setup-facility',
        headerTabs: tabss.filter((e) => e),
        activeTab,
        dispatchFunc: () => getEquipmentFilters([]),
      }),
    );
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    dispatch(getEquipmentFilters([]));
    dispatch(resetBulkUpdate([]));
    dispatch(getTeamFilters([]));
    setActive(event.target.innerText);
    setValue(newValue);
    dispatch(getSiteFilters([]));
  };

  const setSequence = (menus) => menus.sort((a, b) => a.sequence - b.sequence);

  return (
    <Box>
      <div className="header-box2">
        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ marginLeft: '-15px' }}>
          {menuList && menuList.length && setSequence(menuList).map((menu) => (
            tabs && tabs.tabsList && tabs.tabsList[menu] && tabs.tabsList[menu].name && (
            <Tab
              label={tabs.tabsList[menu].name}
            />
            )
          ))}
        </Tabs>
      </div>
      {
        currentTab === 'COMPANY INFO'
          ? <CompanyInfo menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'SITES'
          ? <Sites menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'BUILDINGS'
          ? <Buildings menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'FLOORS'
          ? <Floors menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'ROOMS'
          ? <Rooms menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'SPACES'
          ? <Spaces menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'EQUIPMENT'
          ? <Assets menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'ADMIN USER'
          ? <AdminUser menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'TEAMS'
          ? <Teams menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'TEAM MEMBERS'
          ? <TeamMembers menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'SHIFTS'
          ? <Shifts menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'TENANTS'
          ? <Tenants menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
    </Box>
  );
};

export default CompanySegments;
