/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import OperationsSegments from './operation';
import { updateHeaderData } from "../core/header/actions";
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from "../util/appUtils";
import SustainabilityNav from './navlist.json';

const OperationsSetup = () => {
  const subMenu = 'Operations';
  const { userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "ESG Tracker"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, SustainabilityNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Environment"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "ESG Tracker",
        moduleName: "ESG Monitoring",
        menuName: "Environment",
        link: "/environment",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);
  return (
    /*   <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border">
        <Col sm="12" md="12" lg="12">
          <Row className="p-0">
            <Col sm="12" md="12" lg="12" className="p-0"> */
    <OperationsSegments />
    /*   </Col>
    </Row>
  </Col>
</Row> */

  );
};

export default OperationsSetup;
