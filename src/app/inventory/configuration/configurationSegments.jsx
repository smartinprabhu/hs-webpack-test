import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Warehouses from "./warehouses";
import Locations from "./location";
import OperationTypes from "./operationTypes";
import ReorderingRules from "../../purchase/products/reorderingRules/reorderingRulesList";

import inventoryNav from "../inventoryNavbar/navlist.json";
import { Box } from "@mui/system";
import { Tab, Tabs } from '@mui/material';


import { setInitialValues, setCurrentTab } from "../inventoryService";

import { getHeaderTabs, getTabs, getActiveTab, getMenuItems } from "../../util/appUtils";
import { updateHeaderData } from "../../core/header/actions";
import { useTheme } from '../../ThemeContext';

const ConfigurationSegments = ({ props }) => {
  const { themes } = useTheme();
  const [currentTab, setActive] = useState("WAREHOUSES");
  const [activeSet, isSet] = useState(false);
  const [value, setValue] = useState(0);

  const { pinEnableData } = useSelector((state) => state.auth);
  const menuList = [
    "WAREHOUSES",
    "LOCATIONS",
    "OPERATION TYPES",
    "REORDERING RULES",
  ];
  const dispatch = useDispatch();
  const { currentWorkingTab } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(setCurrentTab(""));
    dispatch(setInitialValues(false, false, false, false));
  }, []);
  const { userRoles } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      setActive(currentWorkingTab.data);
    } else if (!activeSet) {
      setActive("WAREHOUSES");
    }
  }, [currentWorkingTab, activeSet]);

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
        link: "/inventory/configurations",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActive(event.target.innerText);
    setValue(newValue)
  };
  const menuListConfig = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'name');
  let menuArray = []
  let tabsArray = ['Warehouses', 'Locations', 'Operation types', 'Reordering Rules']
  if (menuListConfig?.length) {
    tabsArray.map((menu) => {
      if (menuListConfig.includes(menu)) {
        menuArray.push(menu)
      }
    })
  }
  return (
    <>
      <Box>
        <div className='header-box2'>
          <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ marginLeft: '-15px' }}>
            {menuArray && menuArray.length && menuArray.map((menu) => (
              menuList.includes(menu.toUpperCase()) && (
                <Tab
                  label={menu}
                  // sx={{
                  //   '&.Mui-selected': {
                  //     color: themes === 'light' ? '#FFFFFF' : '#28a745', // White for selected in light mode, Green for selected in dark mode
                  //   },
                  //   '&:not(.Mui-selected)': {
                  //     color: themes === 'light' ? '#808080' : 'black', // Gray for unselected in light mode, White for unselected in dark mode
                  //   },
                  // }}
                />
              ))
            )}
          </Tabs>
        </div>
        {currentTab === "WAREHOUSES" ? (
          <Warehouses
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
        {currentTab === "LOCATIONS" ? (
          <Locations
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
        {currentTab === "OPERATION TYPES" ? (
          <OperationTypes
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
        {currentTab === "REORDERING RULES" ? (
          <ReorderingRules
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

export default ConfigurationSegments;
