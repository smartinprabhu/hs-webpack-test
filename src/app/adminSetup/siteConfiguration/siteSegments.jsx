import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Tab, Tabs,
} from '@mui/material';
import { useHistory } from 'react-router-dom';

import OverviewBack from '@shared/overviewBack';

import { updateHeaderData } from '../../core/header/actions';
import {
  setCurrentTab,
} from '../../inventory/inventoryService';
import {
  getActiveTab,
  getHeaderTabs,
  getMenuItems,
  getTabs,
} from '../../util/appUtils';
import { getCompanyDetail, getSiteFilters } from '../setupService';
import Shifts from './shifts';
import tabs from './tabs.json';
import TeamMembers from './teamMembers';
// import Teams from './teamsListEditable';
import Tenants from './tenants';
import adminSetupNav from '../navbar/navlist.json';
import { resetBulkUpdate } from '../../helpdesk/actions';
import { getEquipmentFilters } from '../../assets/equipmentService';

import Buildings from '../assetsLocationConfiguration/buildings';

import Floors from '../assetsLocationConfiguration/floors';
import Wings from '../assetsLocationConfiguration/wings';
import Rooms from '../assetsLocationConfiguration/rooms';
import Spaces from '../assetsLocationConfiguration/spaces';
import Assets from '../assetsLocationConfiguration/assets';
import SpaceBulkUpload from '../assetsLocationConfiguration/spaceBulkUpload';

const appModels = require('../../util/appModels').default;

const SiteSegments = () => {
  const dispatch = useDispatch();
  const [activeSet, isSet] = useState(false);
  const [currentTab, setActive] = useState('Buildings');
  const [value, setValue] = React.useState(0);
  const { userRoles, userInfo } = useSelector((state) => state.user);
  const menuList1 = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'name');
  const menuList = menuList1.concat(['Bulk Upload']);
  const menuSiteList = ['Buildings', 'Floors', 'Wings', 'Rooms', 'Spaces', 'Equipment', 'Bulk Upload'];
  const { currentWorkingTab } = useSelector((state) => state.inventory);

  const history = useHistory();

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      const findIndex = menuSiteList && menuSiteList.length && menuSiteList.findIndex((val) => val.toLowerCase() === currentWorkingTab.data.toLowerCase());
      setValue(findIndex);
      setActive(currentWorkingTab.data.toUpperCase());
    } else if (!activeSet) {
      setActive('BUILDINGS');
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
        dispatchFunc: () => { getEquipmentFilters([]); dispatch(setCurrentTab('')); },
      }),
    );
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    dispatch(getEquipmentFilters([]));
    dispatch(resetBulkUpdate([]));
    setActive(event.target.innerText);
    setValue(newValue);
    dispatch(getSiteFilters([]));
  };

  const setSequence = (menus) => menus.sort((a, b) => a.sequence - b.sequence);

  const onBackOverview = (taskId, moduleId) => {
    if (moduleId && taskId) {
      dispatch(setCurrentTab(''));
      history.push({ pathname: 'setup-overview', state: { taskId, moduleId } });
    }
  };

  const moduleId = history.location && history.location.state && history.location.state.moduleId;
  const taskId = history.location && history.location.state && history.location.state.taskId;

  return (
    <Box>
      <div className="header-box2" style={moduleId ? { justifyContent: 'normal' } : {}}>
        {moduleId && (
        <OverviewBack moduleId={moduleId} taskId={taskId} onBack={onBackOverview} />
        )}
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
      {/* {currentTab === 'TEAMS'
        ? <Teams menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
        : ''} */}
      {currentTab === 'TEAM MEMBERS'
        ? <TeamMembers menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
        : ''}
      {currentTab === 'SHIFTS'
        ? <Shifts menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
        : ''}
      {currentTab === 'TENANTS'
        ? <Tenants menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
        : ''}
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
        currentTab === 'WINGS'
          ? <Wings menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
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
        currentTab === 'BULK UPLOAD'
          ? <SpaceBulkUpload />
          : ''
      }
    </Box>
  );
};

export default SiteSegments;
