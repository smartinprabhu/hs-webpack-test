import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box } from "@mui/system";
import tabs from "./operationList.json";
import { setCurrentTab } from "../../inventory/inventoryService";
import { setInitialValues } from "../../purchase/purchaseService";
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from "../../util/appUtils";
import Audits from "./audits";
import Opportunities from "./opportunities";
import NonConformities from "./nonConformities";
import auditNav from "../navbar/navlist.json";
import { updateHeaderData } from "../../core/header/actions";

const OperationSegments = () => {
  const [currentTab, setActive] = useState("Audits");
  const [activeSet, isSet] = useState(false);
  const { userRoles } = useSelector((state) => state.user);

  // let menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Audit System', 'name');
  // menuList = menuList.concat(['Actions']);
  const menuList = ["Audits", "Actions"];
  const dispatch = useDispatch();
  const { currentWorkingTab } = useSelector((state) => state.inventory);
  const { pinEnableData } = useSelector((state) => state.auth);

  useEffect(() => {
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
      const index = activeMenus.findIndex((obj) => obj === "Audits");
      if (index === -1) {
        setActive(activeMenus[0]);
      }
    }
  }, [menuList]);

  useEffect(() => {
    if (currentWorkingTab && currentWorkingTab.data) {
      setActive(currentWorkingTab.data);
    } else if (!activeSet) {
      setActive("Audits");
    }
  }, [currentWorkingTab, activeSet]);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Audit System"
  );

  let activeTab;
  let tabss;

  if (headerTabs) {
    tabss = getTabs(headerTabs[0].menu, auditNav.data);
    activeTab = getActiveTab(
      tabss.filter((e) => e),
      "Operations"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Audit System",
        moduleName: "Audit System",
        menuName: "Operations",
        link: "/audit-overview",
        headerTabs: tabss.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    // <Card className="border-0 audit-operations h-100">
    //   <CardBody className="p-0">
    //     <Row className="p-1 ml-2 mt-1">
    //       <Nav>
    //         {menuList && menuList.map((menu) => (
    //           tabs && tabs.tabsList && tabs.tabsList[menu] && (
    //             <div key={menu} className="mr-4 ml-4">
    //               <NavLink
    //                 className="nav-link-item pt-2 pb-1 pl-1 pr-1"
    //                 active={currentTab === tabs.tabsList[menu].name}
    //                 href="#"
    //                 onClick={() => {
    //                   dispatch(setCurrentTab(''));
    //                   dispatch(getAuditFilters([]));
    //                   dispatch(getNonConformitieFilters([]));
    //                   setActive(tabs.tabsList[menu].name);
    //                   isSet(true);
    //                   dispatch(setInitialValues(false, false, false, false));
    //                 }}
    //               >
    //                 {tabs.tabsList[menu].name}
    //               </NavLink>
    //             </div>
    //           )
    //         ))}
    //       </Nav>
    //     </Row>

    //   </CardBody>
    // </Card>
    <Box
    //  className={pinEnableData ? "content-box-expand" : "content-box"}
    >
      {/* <Header
        headerPath="Audit System"
        nextPath="Operations"
        pathLink="/audit-overview"
        headerTabs={tabss.filter((e) => e)}
        activeTab={currentTab}
      /> */}
      {currentTab === "Audits" ? (
        <Audits
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
      {currentTab === "Opportunities" ? (
        <Opportunities
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
      {currentTab === "Actions" ? (
        <NonConformities
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
  );
};

export default OperationSegments;
