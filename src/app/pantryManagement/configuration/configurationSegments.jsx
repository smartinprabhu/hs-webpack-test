import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/system";

import Pantry from "./pantry";
import ProductCategory from "./productCategory";
import tabs from "./configurationList.json";
import Product from "./product";
import {
  setInitialValues,
  setCurrentTab,
} from "../../inventory/inventoryService";
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from "../../util/appUtils";
import ordersNav from "../navbar/navlist.json";
import { updateHeaderData } from "../../core/header/actions";

const ConfigurationSegments = () => {
  const [currentTab, setActive] = useState("Pantry");
  const [activeSet, isSet] = useState(false);
  const { userRoles } = useSelector((state) => state.user);

  // const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Pantry Management', 'name');
  const menuList = ["Pantry", "Product", "Product Category"];
  const dispatch = useDispatch();
  const { currentWorkingTab } = useSelector((state) => state.setup);
  const { pinEnableData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setCurrentTab(""));
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    if (menuList && menuList.length) {
      const activeMenus = [];
      menuList.map(
        (menu) =>
          tabs &&
          tabs.tabsList &&
          tabs.tabsList[menu] &&
          activeMenus.push(tabs.tabsList[menu].name)
      );
      const index = activeMenus.findIndex((obj) => obj === "Pantry");
      if (index === -1) {
        setActive(activeMenus[0]);
      }
    }
  }, [menuList]);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      setActive(currentWorkingTab.data);
    } else if (!activeSet) {
      setActive("Pantry");
    }
  }, [currentWorkingTab, activeSet]);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Pantry Management"
  );

  let activeTab;
  let tabss;

  if (headerTabs) {
    tabss = getTabs(headerTabs[0].menu, ordersNav.data);
    activeTab = getActiveTab(
      tabss.filter((e) => e),
      "Configuration"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Pantry Management",
        moduleName: "Pantry",
        menuName: "Configuration",
        link: "/pantry-overview",
        headerTabs: tabss.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <>
      {/* <Card className="border-0 desktop-view h-100">
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
                      dispatch(getConfigPantryFilters([]));
                      dispatch(getProductCategoryFilters([]));
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
        </CardBody>
      </Card> */}
      <Box
      //  className={pinEnableData ? 'content-box-expand' : 'content-box'}
      >
        {/* <Header
          headerPath="Pantry"
          nextPath="Orders"
          pathLink="/pantry-overview"
          headerTabs={tabss.filter((e) => e)}
          activeTab={currentTab}
        /> */}
        {currentTab === "Pantry" ? (
          <Pantry
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
        {currentTab === "Product" ? (
          <Product
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
