import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Typography, Tab, Tabs } from '@mui/material';

import Transfers from "../purchase/rfq/rfqDetails/receiveProducts/receiveTransfers";
import Products from "../purchase/products/products";
import ProductCategory from "../pantryManagement/configuration/productCategory";
import Adjustments from "./adjustments/adjustments";
import Scraps from "./scrap/scraps";
import Overview from "./overview/stockOverview";
import { getTransferFilters } from "../purchase/purchaseService";
import { setInitialValues, setCurrentTab } from "./inventoryService";
import { useTheme } from '../ThemeContext';

import {
  getMenuItems,
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from "../util/appUtils";

import inventoryNav from "./inventoryNavbar/navlist.json";
import { updateHeaderData } from "../core/header/actions";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const OperationsSegments = () => {
  const { themes } = useTheme();
  const [currentTab, setActive] = useState("OVERVIEW");
  const [activeSet, isSet] = useState(false);
  const [fromOverview, setFromOverview] = React.useState(false)

  const menuList = [
    "OVERVIEW",
    "INWARD STOCK",
    "OUTWARD STOCK",
    "SCRAP",
    "MATERIAL REQUESTS",
    "STOCK AUDITS",
  ];

  const { pinEnableData } = useSelector((state) => state.auth);
  const [value, setValue] = React.useState(0);

  // const menuList = ['Overview', 'Transfers', 'Inventory Adjustments', 'Scrap', 'Products'];
  const dispatch = useDispatch();
  const { currentWorkingTab, inventoryStatusDashboard } = useSelector(
    (state) => state.inventory
  );

  const pickingData =
    inventoryStatusDashboard &&
      inventoryStatusDashboard.data &&
      inventoryStatusDashboard.data.Operations
      ? inventoryStatusDashboard.data.Operations
      : [];

  const { userRoles } = useSelector((state) => state.user);
  const menuListConfig = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'name');

  // const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'name');
  useEffect(() => {
    // dispatch(setCurrentTab(''));
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  // useEffect(() => {
  //   if (menuList && menuList.length) {
  //     const activeMenus = [];
  //     menuList.map(
  //       (menu) =>
  //         tabs &&
  //         tabs.tabsList &&
  //         tabs.tabsList[menu] &&
  //         activeMenus.push(tabs.tabsList[menu].name)
  //     );
  //     const index = activeMenus.findIndex((obj) => obj === "Overview");
  //     if (index === -1) {
  //       setActive(activeMenus[0]);
  //     }
  //   }
  // }, [menuList]);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      const findIndex = menuList && menuList.length && menuList.findIndex((value) => value.toLowerCase() === currentWorkingTab.data.toLowerCase())
      setValue(findIndex)
      setFromOverview(true)
      setActive(currentWorkingTab.data.toUpperCase());
    } else if (!activeSet) {
      setActive("OVERVIEW");
      setValue(0)
    }
  }, [currentWorkingTab, activeSet]);

  function getPickingId(code) {
    let res = false;
    if (code) {
      const ogData = pickingData.filter((item) => item.code === code);
      if (ogData && ogData.length) {
        res = ogData[0].id;
      }
    }
    return res;
  }

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
      "Operations"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Inventory",
        moduleName: "Inventory",
        menuName: "Operations",
        link: "/inventory/operations",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);


  const handleTabChange = (event, newValue) => {
    setActive(event.target.innerText);
    setValue(newValue)
    dispatch(getTransferFilters([]))
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <div className='header-box2'>
          <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ marginLeft: '-15px' }}>
            {menuListConfig && menuListConfig.length && menuListConfig.map((menu) => (
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
        {currentTab === "OVERVIEW" ? (
          <Overview
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
        {currentTab === "INWARD STOCK" ? (
          <Transfers
            listName="Inward Stock"
            transferCode="incoming"
            pickingId={getPickingId("incoming")}
            menuList={menuList}
            tabs={tabs}
            setCurrentTab={setCurrentTab}
            setActive={setActive}
            isSet={isSet}
            currentTab={currentTab}
            fromOverview={fromOverview}
            setFromOverview={setFromOverview}
          />
        ) : (
          ""
        )}
        {currentTab === "OUTWARD STOCK" ? (
          <Transfers
            listName="Outward Stock"
            transferCode="outgoing"
            pickingId={getPickingId("outgoing")}
            menuList={menuList}
            tabs={tabs}
            setCurrentTab={setCurrentTab}
            setActive={setActive}
            isSet={isSet}
            currentTab={currentTab}
            fromOverview={fromOverview}
            setFromOverview={setFromOverview}
          />
        ) : (
          ""
        )}
        {currentTab === "MATERIAL REQUESTS" ? (
          <Transfers
            listName="Material Requests"
            transferCode="internal"
            pickingId={getPickingId("internal")}
            menuList={menuList}
            tabs={tabs}
            setCurrentTab={setCurrentTab}
            setActive={setActive}
            isSet={isSet}
            currentTab={currentTab}
            fromOverview={fromOverview}
            setFromOverview={setFromOverview}
          />
        ) : (
          ""
        )}
        {currentTab === "STOCK AUDITS" ? (
          <Adjustments
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
        {currentTab === "SCRAP" ? (
          <Scraps
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
        {currentTab === "Products" ? (
          <Products
            showNavbar="no"
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
        {currentTab === "Product Category" ? (
          <ProductCategory
            menuType="Inventory"
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

export default OperationsSegments;
