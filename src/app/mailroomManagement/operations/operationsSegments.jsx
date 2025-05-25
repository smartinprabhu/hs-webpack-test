import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import tabs from './operationsList.json';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  setCurrentTab,
} from '../../inventory/inventoryService';
import InBoundMails from './inboundMails';
import OutBoundMails from './outboundMails';
import {  
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from '../../util/appUtils';
import mailRoomNav from "../../mailroomManagement/navbar/navlist.json";
import { Box } from "@mui/system";
import { updateHeaderData } from '../../core/header/actions';

const OperationsSegments = () => {
  const [currentTab, setActive] = useState('Inbound');
  const [activeSet, isSet] = useState(false);
  const menuList = ['Inbound', 'Outbound'];
  const dispatch = useDispatch();
  const { pinEnableData } = useSelector((state) => state.auth);
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const { currentWorkingTab } = useSelector((state) => state.inventory);

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
      const index = activeMenus.findIndex((obj) => (obj === 'Inbound'));
      if (index === -1) {
        setActive(activeMenus[0]);
      }
    }
  }, [menuList]);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      setActive(currentWorkingTab.data);
    } else if (!activeSet) {
      setActive('Inbound');
    }
  }, [currentWorkingTab, activeSet]);

    const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Mail Room Management"
  );

  let activeTab;
  let tabss;
  
  if (headerTabs) {
    tabss = getTabs(headerTabs[0].menu, mailRoomNav.data);    
    activeTab = getActiveTab(
      tabss.filter((e) => e),
      "Operations"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Mail Room",
        moduleName: "Mail Room",
        menuName: "",
        link: "/mailroom/operations",
        headerTabs: tabss.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <>
      {/* <Card className="border-0 desktop-view h-100">
        <CardBody className="p-0"> 
          <Row className="p-1 ml-2 mt-1 operationsSegments-subHeader">
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
                      dispatch(getInBoundFilters([]));
                      dispatch(getOutboundFilters([]));
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
          </Row>*/}
          <Box 
          // className={pinEnableData ? "content-box-expand" : "content-box"}
          >
        {/* <Header
          headerPath="Mail Room"
          nextPath=""
          pathLink="/mailroom/operations"
          headerTabs={tabss.filter((e) => e)}
          activeTab={activeTab}
        /> */}
          {currentTab === 'Inbound'
            ? <InBoundMails menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab}/>
            : ''}
          {currentTab === 'Outbound'
            ? <OutBoundMails menuList={menuList} tabs={tabs} setCurrentTab={setCurrentTab} setActive={setActive} isSet={isSet} currentTab={currentTab}/>
            : ''}
        </Box>
       {/*  </CardBody>
      </Card> */}
    </>
  );
};

export default OperationsSegments;
