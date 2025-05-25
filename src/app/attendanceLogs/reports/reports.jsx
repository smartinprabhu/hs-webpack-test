import React, { useEffect } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import attendenceNav from '../navbar/navList.json';
import ReportList from './reportList';
import {
  attendanceFiltersData,
} from '../attendanceService';
import {
  getHeaderTabs, getTabs, getActiveTab,
} from '../../util/appUtils';
import { updateHeaderData } from '../../core/header/actions';

const reports = () => {
  const subMenu = 'Reports';

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(attendanceFiltersData([]));
  }, []);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Attendance Logs',
  );

  let activeTab;
  let tabs;
  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, attendenceNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Reports',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Attendance Logs',
        moduleName: 'Attendance Logs',
        menuName: 'Reports',
        link: '/attendance/reports',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border">
      <Col sm="12" md="12" lg="12" xs="12">
        <ReportList />
      </Col>
    </Row>
  );
};

export default reports;
