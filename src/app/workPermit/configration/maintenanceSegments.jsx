/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import operationsGreyIcon from "@images/icons/operationsGrey.svg";
import checklistGreyIcon from "@images/icons/checklistGrey.svg";
import operationsActiveIcon from "@images/icons/operationsActive.svg";
import checklistActiveIcon from "@images/icons/checklistActive.svg";
import { Box } from "@mui/system";
// import expenseIcon from '@images/icons/expense_icon.svg';
// import expenseGrey from '@images/icons/expensesGrey.svg';
import { getChecklistFilters } from '../../adminSetup/maintenanceConfiguration/maintenanceService'
import tabs from '../tabs.json';
import NatureofWork from './natureofWork';
import Checklists from '../../adminSetup/maintenanceConfiguration/checklists';
import { getActiveTab, getHeaderTabs, getTabs } from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';

import workPermitNav from "../navbar/navlist.json";
import { getNatureofWorkFilters } from "../workPermitService";
import { updateHeaderData } from "../../core/header/actions";
import { setCurrentTab } from "../../inventory/inventoryService";
const faIcons = {
  "Nature of Work": operationsGreyIcon,
  Checklist: checklistGreyIcon,
};

const faActiveIcons = {
  "Nature of Work": operationsActiveIcon,
  Checklist: checklistActiveIcon,
};

const MaintenanceSegments = () => {
  const dispatch = useDispatch();
  const [currentTab, setActive] = useState("");
  const [activeSet, isSet] = useState(false);
  const { userRoles } = useSelector((state) => state.user);
  const { currentWorkingTab } = useSelector((state) => state.setup);
  const { pinEnableData } = useSelector((state) => state.auth);

  // const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Permit', 'name');
  // menuList = menuList.concat(['Checklist'], ['Nature of Work']);
  const menuList = ["Checklist", "Nature of Work"];
  // useEffect(() => {
  //   if (currentWorkingTab && currentWorkingTab.data) {
  //     setActive(currentWorkingTab.data);
  //   } else {
  //     setActive('Checklist');
  //   }
  // }, [currentWorkingTab]);

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    dispatch(getChecklistFilters([]));
    dispatch(getNatureofWorkFilters([]));
  }, [currentTab])

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      setActive(currentWorkingTab.data);
    } else if (!activeSet) {
      setActive("Checklist");
    }
  }, [currentWorkingTab, activeSet]);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Work Permit"
  );

  let activeTab;
  let tabss;

  if (headerTabs) {
    tabss = getTabs(headerTabs[0].menu, workPermitNav.data);
    activeTab = getActiveTab(
      tabss.filter((e) => e),
      "Configuration"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Work Permit",
        moduleName: "Work Permit",
        menuName: "Configuration",
        link: "/workpermits-configuration",
        headerTabs: tabss.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <>
      {/* <Row>
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
        <br /> */}
      <Box>
        {currentTab === "Nature of Work" ? (
          <NatureofWork
            menuList={menuList}
            tabs={tabs}
            setCurrentTab={setCurrentTab}
            setActive={setActive}
            isSet={isSet}
            currentTab={currentTab}
          />
        ) : (
          ""
        )}
        {currentTab === "Checklist" ? (
          <Checklists
            menuType="WorkPermit"
            menuList={menuList}
            tabs={tabs}
            setCurrentTab={setCurrentTab}
            setActive={setActive}
            isSet={isSet}
            currentTab={currentTab}
          />
        ) : (
          ""
        )}
      </Box>
    </>
  );
};

export default MaintenanceSegments;
