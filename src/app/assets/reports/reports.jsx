import React, { useEffect } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import {
  getPreventiveFilter, getReportId, getLocationId,
} from '../../preventiveMaintenance/ppmService';
import {
  getActiveTab,
  getHeaderTabs,
  getTabs,
  getDynamicTabs,
} from '../../util/appUtils';
import { updateHeaderData } from '../../core/header/actions';
import assetSideNav from '../navbar/navlist.json';

import Navbar from '../navbar/navbar';
import ReportList from './reportList';

const reports = () => {
  const subMenu = 'Reports';
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

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Asset Registry',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, assetSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(assetSideNav && assetSideNav.data && assetSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/asset-overview/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Reports',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Asset Registry',
        moduleName: 'Asset Registry',
        menuName: 'Reports',
        link: '/asset-overview/reports',
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
