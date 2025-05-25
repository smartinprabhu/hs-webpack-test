/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import './assetOverview.scss';
// import Activity from './activity';
import Notifications from '../../dashboard/alerts';
import AssetsExpiry from './assetsExpiry';
import AssetsAmcExpiry from './assetsAmcExpiry';

import AssetDownTime from './assetDownTime';
import Insights from './insights';
import Navbar from '../navbar/navbar';
import {
  getMenuItems,
} from '../../util/appUtils';
import DashboardView from "../../apexDashboards/assetsDashboard/dashboardView";
import Header from '../../core/header/header'

import { getNinjaCode, resetNinjaCode } from '../../analytics/analytics.service';
import dashboardCodes from '../../data/dashboardCodes.json';
import SharedDashboard from '../../shared/sharedDashboard';

import PageLoader from "@shared/pageLoader";

const appModels = require('../../util/appModels').default;

const AssetOverview = () => {
  const [popoverModal, setPopoverModal] = useState(false);
  const { userRoles } = useSelector((state) => state.user);
  const [isOldDashboard, setOldDashboard] = useState(false)
  const { assetDashboard } = useSelector((state) => state.equipment);

  const { ninjaDashboardCode } = useSelector((state) => state.analytics);
  const { pinEnableData } = useSelector((state) => state.auth);

  const subMenu = 'Insights';
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Asset Registry', 'name');
  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);
  const isCodeData = assetDashboard && assetDashboard.data ? assetDashboard.data.filter((item) => item.code === 'ADT') : false;
  const isCodeExists = !!(isCodeData && isCodeData.length);

  if (!isMenu) {
    return (<Redirect to="/assets/locations" />);
  }

  return (
    <div className={pinEnableData ? "content-box-expand" : "content-box"}>
      <Header
        headerPath="Asset Registry"
        nextPath="Insights"
        pathLink="/asset-overview"
      />
      {isShow &&
        ninjaDashboardCode &&
        ninjaDashboardCode.data &&
        ninjaDashboardCode.data.length > 0 &&
        !ninjaDashboardCode.loading && (
          <DashboardView
            code={ninjaDashboardCode.data[0].id}
            defaultDate={ninjaDashboardCode.data[0].ks_date_filter_selection}
            dashboardInterval={ninjaDashboardCode.data[0].ks_set_interval}
            dashboardLayouts={ninjaDashboardCode.data[0].dashboard_json}
            dashboardColors={ninjaDashboardCode.data[0].ks_dashboard_items_ids}
          />
        )}
      {(!isShow || (ninjaDashboardCode && ninjaDashboardCode.loading)) && (
        <PageLoader type="max" />
      )}
      {isOldDashboard && <Insights />}
      {isOldDashboard && (
        <Col
          sm="12"
          md="12"
          lg="4"
          xs="12"
          className={`p-0 ${isOldDashboard ? 'Asset-Overview' : ''}`}
        >
          <Row className="pb-1 pt-2">
            <Col
              className="asset-insight-notifications"
              sm="12"
              md="12"
              lg="12"
              xs="12"
            >
              <Notifications modelName={appModels.EQUIPMENT} />
            </Col>
          </Row>
        </Col>
      )}
    </div>
    // <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 ${isOldDashboard ? 'Asset-Overview' : 'bg-med-blue-dashboard'} border`}>
    //   <Col sm="12" md="12" lg="12" xs="12">
    //     <Navbar id={subMenu} />
    //     <Row className="p-1 insight">
    //       <Col sm="12" md={isOldDashboard ? 8 : 12} lg={isOldDashboard ? 8 : 12} xs="12" className="p-0">
    //         {isShow && ninjaDashboardCode && ninjaDashboardCode.data && ninjaDashboardCode.data.length > 0 && !ninjaDashboardCode.loading && (
    //         <DashboardView
    //           code={ninjaDashboardCode.data[0].id}
    //           defaultDate={ninjaDashboardCode.data[0].ks_date_filter_selection}
    //           dashboardInterval={ninjaDashboardCode.data[0].ks_set_interval}
    //           dashboardLayouts={ninjaDashboardCode.data[0].dashboard_json}
    //           dashboardColors={ninjaDashboardCode.data[0].ks_dashboard_items_ids}
    //         />
    //         )}
    //         {(!isShow || (ninjaDashboardCode && ninjaDashboardCode.loading)) && (
    //         <div className="text-center mt-2 mb-2">
    //           <Spin />
    //         </div>
    //         )}
    //         {isOldDashboard && (
    //           <>
    //             <Insights />
    //             <Row className="m-0 p-3">
    //               <Col sm="12" md="12" lg="6" xs="12" className="p-0">
    //                 <AssetsExpiry popoverModal={popoverModal} setPopoverModal={setPopoverModal} />
    //               </Col>
    //               <Col sm="12" md="12" lg="6" xs="12" className="p-0">
    //                 <AssetsAmcExpiry />
    //               </Col>
    //               <Col sm="12" md="12" lg="6" xs="12" className="p-0">
    //                 {isCodeExists && (
    //                 <AssetDownTime />
    //                 )}
    //               </Col>
    //             </Row>
    //           </>
    //         )}
    //       </Col>
    //       {isOldDashboard && (
    //       <Col sm="12" md="12" lg="4" xs="12" className="p-0">
    //         <Row className="pb-1 pt-2">
    //           <Col className="asset-insight-notifications" sm="12" md="12" lg="12" xs="12">
    //             <Notifications modelName={appModels.EQUIPMENT} />
    //           </Col>
    //         </Row>
    //       </Col>
    //       )}
    //     </Row>
    //   </Col>
    // </Row>
  );
};
export default AssetOverview;
