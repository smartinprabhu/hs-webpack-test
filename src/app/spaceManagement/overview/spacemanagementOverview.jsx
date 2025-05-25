/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from "react";
import { Col, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import SpaceNavbar from "../navbar/spaceNavbar";
// import DashboardView from "../../nocDashboards/assetsDashboard/dashboardView";
import dashboardCodes from "../../data/dashboardCodes.json";
import {
  getNinjaCode,
  resetNinjaCode,
} from "../../analytics/analytics.service";
import { getMenuItems } from "../../util/appUtils";

const appModels = require("../../util/appModels").default;

const Dashboard = () => {
    const dispatch = useDispatch();
    const subMenu = 'Insights';
    const { userInfo, userRoles } = useSelector((state) => state.user);
    const { ninjaDashboardCode } = useSelector((state) => state.analytics);
    const menuList = getMenuItems(userRoles && userRoles.data && userRoles.data.allowed_modules ? userRoles.data.allowed_modules : [], 'HSpace - Space Management', 'name');
    
    const isParentSite =
    userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent;
    if(!menuList.includes('Insights') && !isParentSite) {
        return (<Redirect to="/hspace-home" />);
    }

  const moduleId = userRoles?.data?.allowed_modules?.filter(
    (each) => each.name === "HSpace - Space Management"
  )[0]?.id;

  if (!menuList.includes("Insights") && !isParentSite) {
    return history.push(`/mybookings#${moduleId}`);
    //  <Redirect to={`/mybookings#${moduleId}`} />;
  }

  const companyCode =
    dashboardCodes &&
    dashboardCodes.codes &&
    dashboardCodes.codes.CompanySpaceManagement
      ? dashboardCodes.codes.CompanySpaceManagement
      : "";
  const siteCode =
    dashboardCodes &&
    dashboardCodes.codes &&
    dashboardCodes.codes.SiteSpaceManagement
      ? dashboardCodes.codes.SiteSpaceManagement
      : "";

  const code =
    userInfo &&
    userInfo.data &&
    userInfo.data.main_company &&
    userInfo.data.main_company.category &&
    userInfo.data.main_company.category.name &&
    userInfo.data.main_company.category.name === "Company"
      ? companyCode
      : siteCode;

  console.log(code, "code");
  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(resetNinjaCode());
      dispatch(getNinjaCode(code, appModels.NINJABOARD));
    }
  }, [userInfo]);
  return (
    <>
      <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 bg-med-blue-dashboard border`}>
        <Col sm="12" md="12" lg="12" xs="12">
          <SpaceNavbar id={subMenu} />
          <Row className="p-1 insight">
            <Col sm="12" md={12} lg={12} xs="12" className={`p-0`}>
              
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default Dashboard;
