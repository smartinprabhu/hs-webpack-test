import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Tab, Tabs,
  Typography,
} from '@mui/material';
import { useHistory } from 'react-router-dom';

import OverviewBack from '@shared/overviewBack';

import { getEquipmentFilters } from '../../assets/equipmentService';
import { setCurrentTab, setInitialValues } from '../../inventory/inventoryService';
import {
  getActiveTab,
  getHeaderTabs,
  getMenuItems,
  getTabs,
} from '../../util/appUtils';
import Teams from './teamsListEditable';
import tabss from './tabsTeams.json';

import { updateHeaderData } from '../../core/header/actions';
import AdminSideNavCompany from '../navbar/navlistCompany.json';
import AdminSideNavSite from '../navbar/navlistSite.json';

const CustomTabPanel = (props) => {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const OperationsSegments = () => {
  const [currentTab, setActive] = useState('Teams');
  const [activeSet, isSet] = useState(false);
  const [fromOverview, setFromOverview] = React.useState(false);

  const menuList = ['Teams'];

  const { pinEnableData } = useSelector((state) => state.auth);
  const [value, setValue] = React.useState(0);
  const history = useHistory();

  // const menuList = ['Overview', 'Transfers', 'Inventory Adjustments', 'Scrap', 'Products'];
  const dispatch = useDispatch();
  const { currentWorkingTab } = useSelector(
    (state) => state.inventory,
  );

  const { userRoles, userInfo } = useSelector((state) => state.user);
  const menuListConfig = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'name');

  // const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'name');
  useEffect(() => {
    // dispatch(setCurrentTab(''));
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      const findIndex = menuList && menuList.length && menuList.findIndex((value) => value.toLowerCase() === currentWorkingTab.data.toLowerCase());
      setValue(findIndex);
      setFromOverview(true);
      setActive(currentWorkingTab.data.toUpperCase());
    } else if (!activeSet) {
      setActive('TEAMS');
      setValue(0);
    }
  }, [currentWorkingTab, activeSet]);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Admin Setup',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, userInfo && userInfo.data && userInfo.data.is_parent ? AdminSideNavCompany.data : AdminSideNavSite.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Team Management',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Team Management',
        link: '/setup-team-management',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActive(event.target.innerText);
    setValue(newValue);
    dispatch(getEquipmentFilters([]));
  };

  const onBackOverview = (taskId, moduleId) => {
    if (moduleId && taskId) {
      dispatch(setCurrentTab(''));
      history.push({ pathname: 'setup-overview', state: { taskId, moduleId } });
    }
  };

  const moduleId = history.location && history.location.state && history.location.state.moduleId;
  const taskId = history.location && history.location.state && history.location.state.taskId;

  const setSequence = (menus) => menus.sort((a, b) => a.sequence - b.sequence);

  return (
    <Box sx={{ width: '100%' }}>
      <div className="header-box2" style={moduleId ? { justifyContent: 'normal' } : {}}>
        {moduleId && (
          <OverviewBack moduleId={moduleId} taskId={taskId} onBack={onBackOverview} />
        )}
        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ marginLeft: '-15px' }}>
          {menuList && menuList.length && setSequence(menuList).map((menu) => (
            tabss && tabss.tabsList && tabss.tabsList[menu] && tabss.tabsList[menu].name && (
              <Tab
                label={tabss.tabsList[menu].name}
              />
            )
          ))}
        </Tabs>
      </div>
      {currentTab === 'TEAMS'
        ? <Teams menuList={menuList} tabs={tabss} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
        : ''}
    </Box>
  );
};

export default OperationsSegments;
