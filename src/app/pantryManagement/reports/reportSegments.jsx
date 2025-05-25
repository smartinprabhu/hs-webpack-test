import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Row,
  Nav,
  NavLink,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import InventoryReport from './inventoryReport';
import EmployeeReport from './employeeReport';
import tabs from './reportList.json';
import { getTransferFilters } from '../../purchase/purchaseService';
import {
  setInitialValues,
  setCurrentTab,
} from '../../inventory/inventoryService';
import {
  getMenuItems,
} from '../../util/appUtils';

const ReportSegments = () => {
  const [currentTab, setActive] = useState('Pantry');
  const [activeSet, isSet] = useState(false);
  const { userRoles } = useSelector((state) => state.user);

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Pantry Management', 'name');
  const dispatch = useDispatch();
  const { currentWorkingTab } = useSelector((state) => state.setup);

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
      const index = activeMenus.findIndex((obj) => (obj === 'Pantry'));
      if (index === -1) {
        setActive(activeMenus[0]);
      }
    }
  }, [menuList]);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      setActive(currentWorkingTab.data);
    } else if (!activeSet) {
      setActive('Pantry');
    }
  }, [currentWorkingTab, activeSet]);

  return (
    <>
      <Card className="border-0 h-100">
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
          {currentTab === 'Employee Pantry Orders'
            ? <EmployeeReport />
            : ''}
        </CardBody>
      </Card>
    </>
  );
};

export default ReportSegments;
