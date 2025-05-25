import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import tabs from './operationsList.json';
import { setInitialValues } from '../../purchase/purchaseService';
import {  
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from '../../util/appUtils';
import CommodityTransNav from "../../commodityTransactions/navbar/navlist.json";
import { Box } from "@mui/system";
import {
  setCurrentTab,
} from '../../inventory/inventoryService';
import Transaction from './transactions';
import Tankers from './tankers';
import { getTankerFilters } from '../tankerService';
import { updateHeaderData } from '../../core/header/actions';

const OperationsSegments = () => {
  const [currentTab, setActive] = useState('Transactions');
  const [activeSet, isSet] = useState(false);
  const menuList = ['Transactions', 'Tankers'];
  const dispatch = useDispatch();
  const { currentWorkingTab } = useSelector((state) => state.inventory);
  const { pinEnableData } = useSelector((state) => state.auth);
  const { userInfo, userRoles } = useSelector((state) => state.user);

  
  useEffect(() => {
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
      const index = activeMenus.findIndex((obj) => (obj === 'Transactions'));
      if (index === -1) {
        setActive(activeMenus[0]);
      }
    }
  }, [menuList]);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      setActive(currentWorkingTab.data);
    } else if (!activeSet) {
      setActive('Transactions');
    }
  }, [currentWorkingTab, activeSet]);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Commodity Transactions"
  );

  let activeTab;
  let tabsList;
  
  if (headerTabs) {
    tabsList = getTabs(headerTabs[0].menu, CommodityTransNav.data);    
    activeTab = getActiveTab(
      tabsList.filter((e) => e),
      "Operations"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Commodity Transactions",
        moduleName: "Commodity Transactions",
        menuName: "Commodity",
        link: "/commodity/operations",
        headerTabs: tabsList.filter((e) => e),
        activeTab,
        dispatchFunc: () => getTankerFilters({}),
      })
    );
  }, [activeTab]);

  return (
    <>
     {/*  <Card className="border-0 h-100 commodity-operation-card">
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
                        dispatch(getTankerFilters([]));
                        dispatch(resetVisitState());
                        dispatch(setInitialValues(false, false, false, false));
                      }}
                    >
                      {tabs.tabsList[menu].name}
                    </NavLink>
                  </div>
                )
              ))}
            </Nav>
          </Row> */}
          <Box
          //  className={pinEnableData ? "content-box-expand" : "content-box"}
           >
          {/* <Header
            headerPath="Commodity"
            nextPath=""
            pathLink="/commodity/operations"
            headerTabs={tabsList.filter((e) => e)}
            activeTab={activeTab}
          /> */}
          {currentTab === 'Transactions'
            ? <Transaction menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab}/>
            : ''}
          {currentTab === 'Tankers'
            ? <Tankers menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab}/>
            : ''}
        </Box>
       {/*  </CardBody>
      </Card> */}
    </>
  );
};

export default OperationsSegments;
