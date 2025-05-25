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
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from '../../util/appUtils';
import ReportList from './reportList';
import woSideNav from "../navbar/navlist.json";
import { updateHeaderData } from "../../core/header/actions";

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
    "Work Orders"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, woSideNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Reports"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Work Orders",
        moduleName: "Work Orders",
        menuName: "Reports",
        link: "/maintenance/reports",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
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
