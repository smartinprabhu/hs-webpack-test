import React, { useEffect } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import {
  getPreventiveFilter, getReportId, getLocationId,
} from '../../preventiveMaintenance/ppmService';

import Navbar from '../navbar/navbar';
import ReportList from './reportList';
import { getTabs,
  getActiveTab,
  getHeaderTabs,
} from "../../util/appUtils";
import { updateHeaderData } from "../../core/header/actions";
import bcSideNav from "../navbar/navlist.json";

const reports = () => {
  const subMenu = 'Reports';
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);


  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Building Compliance"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, bcSideNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Reports"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Building Compliance",
        moduleName: "Building Compliance",
        menuName: "Reports",
        link: "/buildingcompliance/reports",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

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
