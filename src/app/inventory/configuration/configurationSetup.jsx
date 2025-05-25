/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import Navbar from '../inventoryNavbar/navbar';
import ConfigurationSegments from './configurationSegments';
import { updateHeaderData } from "../../core/header/actions";
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from "../../util/appUtils";
import inventoryNav from "../inventoryNavbar/navlist.json";

const ConfigurationSetup = () => {
  const subMenu = 'Configurations';
  const { userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Inventory"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, inventoryNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Configurations"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Inventory",
        moduleName: "Inventory",
        menuName: "Configurations",
        link: "/inventory-overview/inventory/configurations",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    /*  <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border">
       <Col sm="12" md="12" lg="12">
         <Row className="p-0">
           <Col sm="12" md="12" lg="12" className="p-0"> */
    <ConfigurationSegments />
    /*  </Col>
   </Row>
 </Col>
</Row> */

  );
};

export default ConfigurationSetup;
