import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import {
  getPreventiveFilter, getReportId, getLocationId,
} from '../ppmService';

import Navbar from '../navbar/navbar';
import ReportList from './reportList';
import InspectionNavbar from '../../inspectionSchedule/navbar/navbar';
import { updateHeaderData } from '../../core/header/actions';
import {
  getActiveTab, getHeaderTabs, getTabs, getDynamicTabs,
} from '../../util/appUtils';
import PPMSideNav from '../navbar/navlist.json';
import inspectionNav from '../../inspectionSchedule/navbar/navlist.json';

const reports = (props) => {
  const { type } = props;
  const subMenu = 'Report';
  const inspectionSubMenu = 'Reports';
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const filterValues = {
        dates: null, locations: null,
      };
      dispatch(getPreventiveFilter(filterValues));
      dispatch(getReportId());
      dispatch(getLocationId());
    }
  }, [userInfo]);

  const isInspection = !!(type && type === 'Inspection');

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    !isInspection ? '52 Week PPM' : 'Inspection Schedule',
  );

  let activeTab;
  let tabs;

  const navData = !isInspection ? PPMSideNav.data : inspectionNav.data;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, navData);
    let dynamicList = headerTabs[0].menu.filter((item) => !(navData[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, !isInspection ? '/preventive-overview/dynamic-report' : '/inspection-overview/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Report',
    );
  }
  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: !isInspection ? '52 Week PPM' : 'Inspection Schedule',
        moduleName: !isInspection ? '52 Week PPM' : 'Inspection Schedule',
        menuName: !isInspection ? 'Report' : 'Reports',
        link: !isInspection ? '/preventive-overview/preventive/reports' : '/inspection-overview/inspection/reports',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <ReportList isInspection={isInspection} />
  );
};

reports.propTypes = {
  type: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};
reports.defaultProps = {
  type: false,
};

export default reports;
