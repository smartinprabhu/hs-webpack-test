/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";

import Navbar from '../navbar/navbar';
import ReportList from './reportList';
import ordersNav from "../navbar/navlist.json";
import { updateHeaderData } from "../../core/header/actions";
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from "../../util/appUtils";

const ReportSetup = () => {
  const subMenu = 'Reports';
  const dispatch = useDispatch();
  const { userRoles } = useSelector((state) => state.user);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Pantry Management"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, ordersNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Report"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Pantry Management",
        moduleName: "Pantry Management",
        menuName: "Report",
        link: "/pantry/reports",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);
  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border">
      <Col sm="12" md="12" lg="12">
        <ReportList />
      </Col>
    </Row>

  );
};

export default ReportSetup;
