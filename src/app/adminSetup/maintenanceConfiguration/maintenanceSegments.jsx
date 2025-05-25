/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Row,
  Nav,
  NavLink,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import operationsGreyIcon from '@images/icons/operationsGrey.svg';
import ppmGreyIcon from '@images/icons/ppmGrey.svg';
import checklistGreyIcon from '@images/icons/checklistGrey.svg';
import toolGreyIcon from '@images/icons/toolsGrey.svg';
import partsGreyIcon from '@images/icons/partsGrey.svg';
import operationsActiveIcon from '@images/icons/operationsActive.svg';
import ppmActiveIcon from '@images/icons/ppmActive.svg';
import checklistActiveIcon from '@images/icons/checklistActive.svg';
import toolActiveIcon from '@images/icons/toolsActive.svg';
import partsActiveIcon from '@images/icons/partsActive.svg';
// import expenseIcon from '@images/icons/expense_icon.svg';
// import expenseGrey from '@images/icons/expensesGrey.svg';

import tabs from './tabs.json';
import Operations from './operations';
import Checklists from './checklists';
import Tools from './tools';
import Parts from './parts';
import OperationalExpenses from './operationalExpenses';
import PreventiveSchedulerAdmin from '../../preventiveMaintenance/preventiveSchedulerAdmin';
import { getMenuItems } from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';

const faIcons = {
  Operations: operationsGreyIcon,
  'PPM Schedule': ppmGreyIcon,
  Checklist: checklistGreyIcon,
  Tools: toolGreyIcon,
  Parts: partsGreyIcon,
  'Operational Expenses': operationsGreyIcon,
};

const faActiveIcons = {
  Operations: operationsActiveIcon,
  'PPM Schedule': ppmActiveIcon,
  Checklist: checklistActiveIcon,
  Tools: toolActiveIcon,
  Parts: partsActiveIcon,
  'Operational Expenses': operationsActiveIcon,
};

const MaintenanceSegments = () => {
  const dispatch = useDispatch();
  const [currentTab, setActive] = useState('');
  const { userRoles } = useSelector((state) => state.user);
  const { currentWorkingTab } = useSelector((state) => state.setup);

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'name');
  // menuList = menuList.concat(['Operational Expenses']);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      setActive(currentWorkingTab.data);
    } else {
      setActive('Operational Expenses');
    }
  }, [currentWorkingTab]);

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  return (
    <>
      <Card className="admin-maintainance-set border-0">
        <CardBody>
          <Row>
            <Nav>
              {menuList && menuList.map((menu) => (
                tabs && tabs.tabsList && tabs.tabsList[menu] && (
                  <div key={menu} className="mr-2 ml-3">
                    <NavLink
                      className="nav-link-item pt-2 pb-1 pl-1 pr-1"
                      active={currentTab === tabs.tabsList[menu].name}
                      href="#"
                      onClick={() => { setActive(tabs.tabsList[menu].name); dispatch(setInitialValues(false, false, false, false)); }}
                    >
                      <img
                        src={currentTab === tabs.tabsList[menu].name ? faActiveIcons[tabs.tabsList[menu].name] : faIcons[tabs.tabsList[menu].name]}
                        className="mr-2"
                        alt={tabs.tabsList[menu].name}
                        width="17"
                        height="17"
                      />
                      {tabs.tabsList[menu].name}
                    </NavLink>
                  </div>
                )
              ))}
            </Nav>
          </Row>
          <br />
          {currentTab === 'PPM Schedule'
            ? <PreventiveSchedulerAdmin />
            : ''}
          {currentTab === 'Operations'
            ? <Operations />
            : ''}
          {currentTab === 'Checklist'
            ? <Checklists />
            : ''}
          {currentTab === 'Tools'
            ? <Tools />
            : ''}
          {currentTab === 'Parts'
            ? <Parts />
            : ''}
          {currentTab === 'Operational Expenses'
            ? <OperationalExpenses />
            : ''}
        </CardBody>
      </Card>

    </>
  );
};

export default MaintenanceSegments;
