/* eslint-disable import/no-unresolved */
import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";



import "./helpdeskOverview.scss";
// import Alerts from './alerts';
import Notifications from "../../dashboard/alerts";
import Insights from "./insights";
import { getMenuItems } from "../../util/appUtils";


const appModels = require("../../util/appModels").default;

const HelpdeskOverview = () => {
  const [isOldDashboard, setOldDashboard] = useState(false)

  const { userRoles, userInfo } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const subMenu = 'Insights';
  const module = 'Helpdesk'

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Helpdesk', 'name');
  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);

  if (!isMenu) {
    return <Redirect to="/helpdesk/tickets" />;
  }

  return (
    <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 ${isOldDashboard ? 'helpdeskOverview' : 'bg-med-blue-dashboard'} border`}>
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className={`p-1 ${isOldDashboard ? 'helpdeskOverview-mainCard' : ''}`}>
          <Col sm="12" md={isOldDashboard ? 8 : 12} lg={isOldDashboard ? 8 : 12} xs="12" className={`p-0 ${isOldDashboard ? 'helpdeskOverview-tickets' : ''}`}>
            <SharedDashboard
              moduleName={module}
              menuName={subMenu}
              setOldDashboard={setOldDashboard}
              isOldDashboard={isOldDashboard}
            />
            {isOldDashboard && (
              <Insights />
            )}
          </Col>
          {isOldDashboard && (
            <Col sm="12" md="12" lg="4" xs="12" className={`p-0 ${isOldDashboard ? 'helpdeskOverview-alarms' : ''}`}>
              <Row className="pb-1 pt-2">
                <Col className="asset-insight-notifications" sm="12" md="12" lg="12" xs="12">
                  <Notifications modelName={appModels.HELPDESK} />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
export default HelpdeskOverview;