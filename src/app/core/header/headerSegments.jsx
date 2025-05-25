/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  // Col,
  Nav,
  NavLink,
  Row,
} from 'reactstrap';
import {
  Box,
  Tab, Tabs, Badge,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  detectMob,
  getAllCompanies,
  getPagesCountV2,
  getBaseDomain,
  getJsonString,
  getListOfOperations,
  getLocalDateCustom, getLocalTimeOnly,
  isJsonString,
} from '../../util/appUtils';
import {
  resetNotificationCount,
} from '../../adminSetup/setupService';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faBell,
// } from '@fortawesome/free-solid-svg-icons';
import Alarms from './alarms';
import Announcements from './announcements';
import ReleaseNotes from './releaseNotes';
import ReportDropdown from './downloadReportList';
import { getDownloadRequest, getDownloadRequestCount } from '../../preventiveMaintenance/ppmService';
// import notification from '../../data/notifications.json';
// import closeCirclegreyIcon from '@images/icons/closeCircleGrey.svg';

const appModels = require('../../util/appModels').default;

const HeaderSegments = () => {
  const dispatch = useDispatch();
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [currentTab, setActive] = useState('ALARMS');
  const [activeSet, isSet] = useState(false);
  const menuList = ['ALARMS', 'ANNOUNCEMENTS', 'DOWNLOAD REPORTS', 'RELEASE NOTES'];
  const [value, setValue] = React.useState(0);
  const { notificationCountDR } = useSelector((state) => state.setup);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companiesDownload = getAllCompanies(userInfo, userRoles);

  useEffect(() => {
    if (value === 2) {
      dispatch(
        getDownloadRequest(companiesDownload, appModels.DOWNLOADREQUEST, limit, offset),
      );
      dispatch(
        getDownloadRequestCount(companiesDownload, appModels.DOWNLOADREQUEST),
      );
      dispatch(resetNotificationCount());
    }
  }, [offset, value]);

  const handleTabChange = (event, newValue) => {
    setActive(menuList[newValue]);
    setValue(newValue);
  };

  useEffect(() => {
    if (!activeSet) {
      setActive('ALARMS');
      setValue(0);
    }
  }, [activeSet]);

  useEffect(() => {
    if (notificationCountDR !== 0) {
      setActive('DOWNLOAD REPORTS');
      setValue(2);
    }
  }, [notificationCountDR]);

  return (
    <Box>
      <div className="header-box2">
        <Tabs
          value={value}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="basic tabs example"
        >
          {menuList && menuList.length && menuList.map((menu) => (
            <Tab
              label={menu === 'DOWNLOAD REPORTS' && notificationCountDR !== 0 ? (
                <Badge
                  badgeContent={notificationCountDR}
                  color="error"
                  sx={{ '& .MuiBadge-badge': { fontSize: '10px', height: 16, minWidth: 16 } }}
                >
                  {menu}
                </Badge>
              ) : (
                menu
              )}
              sx={{ fontSize: '13px', color: '#000000' }}
            />
          ))}
        </Tabs>
      </div>
      {currentTab === 'ALARMS'
        ? <Alarms menuList={menuList} setActive={setActive} isSet={isSet} currentTab={currentTab} />
        : ''}
      {currentTab === 'ANNOUNCEMENTS'
        ? <Announcements menuList={menuList} setActive={setActive} isSet={isSet} currentTab={currentTab} />
        : ''}
      {currentTab === 'RELEASE NOTES'
        ? <ReleaseNotes menuList={menuList} setActive={setActive} isSet={isSet} currentTab={currentTab} />
        : ''}
      {currentTab === 'DOWNLOAD REPORTS'
        ? <ReportDropdown menuList={menuList} setActive={setActive} isSet={isSet} currentTab={currentTab} limit={limit} setOffset={setOffset} />
        : ''}
    </Box>
  );
};
export default HeaderSegments;
