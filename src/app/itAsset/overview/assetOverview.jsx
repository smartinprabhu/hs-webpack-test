import React, { useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import '../../assets/assetOverview/assetOverview.scss';
import Notifications from '../../dashboard/alerts';
import AssetsExpiry from '../../assets/assetOverview/assetsExpiry';
import AssetByStatus from '../../assets/assetOverview/assetByStatus';
import Insights from '../../assets/assetOverview/insights';
import Navbar from '../navbar/navbar';
import {
  getMenuItems,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const AssetOverview = () => {
  const [popoverModal, setPopoverModal] = useState(false);

  const { userRoles } = useSelector((state) => state.user);

  const { assetDashboard } = useSelector((state) => state.equipment);

  const subMenu = 'Insights';

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'IT Asset Management', 'name');

  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);

  const isCodeData = assetDashboard && assetDashboard.data ? assetDashboard.data.filter((item) => item.code === 'SOE') : false;
  const isCodeExists = !!(isCodeData && isCodeData.length);

  if (!isMenu) {
    // return (<Redirect to="/assets/locations" />);
  }

  return (
    <>
      <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border itAssetsOverview">
        <Col sm="12" md="12" lg="12" xs="12">
          <Row className="p-1 itAssetsOverview-main">
            <Col sm="12" md="12" lg="8" xs="12" className="p-0 itAssets">
              <Insights menuType="ITAsset" />
              <Row className="m-0 p-3 itAssets-graphs">
                <Col sm="12" md="12" lg={isCodeExists ? '6' : '12'} xs="12" className="p-0 itAssets-upcomingWarranty">
                  <AssetsExpiry popoverModal={popoverModal} setPopoverModal={setPopoverModal} menuType="ITAsset" />
                </Col>
                <Col sm="12" md="12" lg="6" xs="12" className="p-0 assetByStatus">
                  {isCodeExists && (
                  <AssetByStatus />
                  )}
                </Col>
              </Row>
            </Col>
            <Col sm="12" md="12" lg="4" xs="12" className="p-0 asset-insight-notifications">
              <Row className="pb-1 pt-2">
                <Col sm="12" md="12" lg="12" xs="12">
                  <Notifications modelName={appModels.EQUIPMENT} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default AssetOverview;
