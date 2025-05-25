import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Row,
  Nav,
  NavLink,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import tabs from './reportsList.json';
import InventoryValuation from './reports/inventoryValuation';
import ProductMoves from './reports/productMoves';
import InventoryReport from './reports/inventoryReport';
import MaterialsIssuedReport from './reports/materialIssued';
import ConsumptionReport from './reports/consumptionReport';
import MaterialsReceivedReport from './reports/materialReceived';
import { getTransferFilters } from '../purchase/purchaseService';
import {
  setInitialValues,
  setCurrentTab,
  getInventoryReportsFilters,
  getMoveFilters,
  resetStockHistory,
  resetCreateStockHistory,
  setInventoryDate,
} from './inventoryService';

const ReportsSegments = () => {
  const [currentTab, setActive] = useState('Material Issued');
  const [activeSet, isSet] = useState(false);
  // const menuList = ['Inventory Report', 'Inventory Valuation', 'Product Moves'];

  // need to add access rights
  const menuList = ['Material Issued', 'Material Received', 'Consumption Report'];

  const dispatch = useDispatch();
  const { currentWorkingTab } = useSelector((state) => state.inventory);

  const { userRoles } = useSelector((state) => state.user);

  // const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'name');

  useEffect(() => {
    dispatch(setCurrentTab(''));
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    if (menuList && menuList.length) {
      const activeMenus = [];
      menuList.map((menu) => (
        tabs && tabs.tabsList && tabs.tabsList[menu] && (
          activeMenus.push(tabs.tabsList[menu].name)
        )
      ));

      // old reports code
      // const index = activeMenus.findIndex((obj) => (obj === 'Inventory Report'));

      const index = activeMenus.findIndex((obj) => (obj === 'Material Issued'));

      if (index === -1) {
        setActive(activeMenus[0]);
      }
    }
  }, [menuList]);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      setActive(currentWorkingTab.data);
    } else if (!activeSet) {
      // old reports code
      // setActive('Inventory Report');

      setActive('Consumption Report');
    }
  }, [currentWorkingTab, activeSet]);

  return (
    <>
      <Card className="border-0 h-100 inventoryreport-card">
        <CardBody className="p-0">
          <Row className="p-1 ml-2 mt-1">
            <Nav>
              {menuList && menuList.map((menu) => (
                tabs && tabs.tabsList && tabs.tabsList[menu] && (
                  <div key={menu} className="mr-4 ml-4">
                    <NavLink
                      className="nav-link-item pt-2 pb-1 pl-1 pr-1"
                      active={currentTab === tabs.tabsList[menu].name}
                      href="#"
                      onClick={() => {
                        dispatch(setCurrentTab(''));
                        setActive(tabs.tabsList[menu].name);
                        isSet(true);
                        dispatch(setInitialValues(false, false, false, false));
                        dispatch(getTransferFilters([], [], []));
                        dispatch(getInventoryReportsFilters([]));
                        dispatch(getMoveFilters([]));
                        dispatch(resetStockHistory());
                        dispatch(resetCreateStockHistory());
                        dispatch(setInventoryDate(false));
                      }}
                    >
                      {tabs.tabsList[menu].name}
                    </NavLink>
                  </div>
                )
              ))}
            </Nav>
          </Row>
          {currentTab === 'Inventory Report'
            ? <InventoryReport />
            : ''}
          {currentTab === 'Inventory Valuation'
            ? <InventoryValuation />
            : ''}
          {currentTab === 'Product Moves'
            ? <ProductMoves />
            : ''}
          {currentTab === 'Material Issued'
            ? <MaterialsIssuedReport />
            : ''}
          {currentTab === 'Material Received'
            ? <MaterialsReceivedReport />
            : ''}
          {currentTab === 'Consumption Report'
            ? <ConsumptionReport />
            : ''}
        </CardBody>
      </Card>
    </>
  );
};

export default ReportsSegments;
