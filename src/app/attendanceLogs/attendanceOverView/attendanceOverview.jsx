/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

// import './assetOverview.scss';
// import Activity from './activity';
// import Notifications from '../../dashboard/alerts';
// import AssetsExpiry from './assetsExpiry';
// import AssetsAmcExpiry from './assetsAmcExpiry';

// import AssetDownTime from './assetDownTime';
// import Insights from './insights';
import {
  getActiveTab,
  getHeaderTabs,
  getTabs,
} from '../../util/appUtils';

import SharedDashboard from '../../shared/sharedDashboard';
import { updateHeaderData } from '../../core/header/actions';
import attendenceNav from '../navbar/navList.json';

const appModels = require('../../util/appModels').default;

const AttendenceOverView = () => {

  const subMenu = 'Insights';
  const module = 'Attendance Logs'
  const dispatch = useDispatch();

  const [isOldDashboard, setOldDashboard] = useState(false)

  //   if (!isMenu) {
  //     return (<Redirect to="/attendance-overview" />);
  //   }
  const { userRoles } = useSelector((state) => state.user);
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Attendance Logs"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, attendenceNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Insights"
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Attendance Logs",
        moduleName: "Attendance Logs",
        menuName: "Insights",
        link: "/attendance-overview",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 ${isOldDashboard ? 'Attendance-Overview' : 'bg-med-blue-dashboard'} border`}>
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className="p-1">
          <Col sm="12" md="12" lg="12" xs="12" className="p-0">
            <SharedDashboard
              moduleName={module}
              menuName={subMenu}
              setOldDashboard={setOldDashboard}
              isOldDashboard={isOldDashboard}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default AttendenceOverView;
