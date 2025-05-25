import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Tab, Tabs,
  Typography,
} from '@mui/material';
import { useHistory } from 'react-router-dom';

import OverviewBack from '@shared/overviewBack';

import { getEquipmentFilters } from '../../../assets/equipmentService';
import {
  getActiveTab,
  getHeaderTabs,
  getMenuItems,
  getTabs,
} from '../../../util/appUtils';
import { setCurrentTab, setInitialValues } from '../../../inventory/inventoryService';
import SchedulePPM from '../../../preventiveMaintenance/viewer/addPPMsNew';

import { updateHeaderData } from '../../../core/header/actions';
import AdminSideNavSite from '../../navbar/navlistSite.json';
import AdminSideNavCompany from '../../navbar/navlistCompany.json';
import Checklists from '../../maintenanceConfiguration/checklists';
import PpmList from './ppmList';
import InspectionList from './inspectionList';

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
  const [currentTab, setActive] = useState('DAILY INSPECTION');
  const [activeSet, isSet] = useState(false);
  const [fromOverview, setFromOverview] = React.useState(false);

  const menuList = [
    'DAILY INSPECTION',
    'PPM SCHEDULES',
    'CHECKLIST BANK',
  ];

  const { pinEnableData } = useSelector((state) => state.auth);
  const [value, setValue] = React.useState(0);

  // const menuList = ['Overview', 'Transfers', 'Inventory Adjustments', 'Scrap', 'Products'];
  const dispatch = useDispatch();
  const history = useHistory();
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
      setActive('DAILY INSPECTION');
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
      'Maintenance',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Maintenance',
        link: '/maintenance',
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

  return (
    <Box sx={{ width: '100%' }}>
      <div className="header-box2" style={moduleId ? { justifyContent: 'normal' } : {}}>
        {moduleId && (
        <OverviewBack moduleId={moduleId} taskId={taskId} onBack={onBackOverview} />
        )}
        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ marginLeft: '-15px' }}>
          {menuList && menuList.length && menuList.map((menu) => (

            <Tab
              label={menu}
            />
          ))}
        </Tabs>
      </div>
      {
        currentTab === 'DAILY INSPECTION'
          ? <InspectionList menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} />
          : ''
      }
      {
        currentTab === 'SCHEDULE PPM'
          ? <SchedulePPM menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} isAdminSetup />
          : ''
      }
      {
        currentTab === 'PPM SCHEDULES'
          ? <PpmList menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab} isAdminSetup />
          : ''
      }
      {
        currentTab === 'CHECKLIST BANK'
          ? (
            <Checklists
              menuList={menuList}
              tabs={tabs}
              setCurrentTab={setCurrentTab}
              setActive={setActive}
              isSet={isSet}
              currentTab={currentTab}
            />
          )
          : ''
      }
    </Box>
  );
};

export default OperationsSegments;
