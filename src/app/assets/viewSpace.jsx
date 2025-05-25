/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Col, Row,
} from 'reactstrap';
import Loader from '@shared/loading';
import { setInitialValues } from '../purchase/purchaseService';
import SideCollapse from './mapView/sideLocations';
import LocationDetails from './locationDetails/locationDetail';
import CompanyData from './locationDetails/companyData';
import {
  getSpaceData, resetLocationInfo,
} from './equipmentService';
import {
  getActiveTab,
  getHeaderTabs,
  getTabs,
  getDynamicTabs,
} from '../util/appUtils';
import { updateHeaderData } from '../core/header/actions';
import assetSideNav from './navbar/navlist.json';
import { resetCompanyDetail } from '../adminSetup/setupService';

const appModels = require('../util/appModels').default;

const ViewSpace = () => {
  const subMenu = 'Locations';
  const dispatch = useDispatch();
  const { buildingsInfo } = useSelector((state) => state.equipment);
  const { companyDetail } = useSelector((state) => state.setup);
  const [collapse, setCollapse] = useState(false);
  const history = useHistory();
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const referId = history.location && history.location.state && history.location.state.referId ? history.location.state.referId : '';

  useEffect(() => {
    if (history.location.state) {
      dispatch(getSpaceData(appModels.SPACE, referId));
      dispatch(resetCompanyDetail());
      dispatch(resetLocationInfo());
    }
  }, [history]);
  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, [collapse]);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Asset Registry',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, assetSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(assetSideNav && assetSideNav.data && assetSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/asset-overview/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Locations',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Asset Registry',
        moduleName: 'Asset Registry',
        menuName: 'Locations',
        link: '/asset-overview/locations',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
      <Col sm="12" md="12" lg="12" xs="12">
        <Row>
          <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2 Location-hirarchy' : 'pt-2 pl-2 pr-2 Location-hirarchy'}>
              <SideCollapse
                title="Location Hierarchy"
                data={buildingsInfo && buildingsInfo.data ? buildingsInfo.data : []}
                setCollapse={setCollapse}
                collapse={collapse}
              />
          </Col>
          <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1' : 'pl-1 pt-2 pr-2'}>
            {!referId && companyDetail && companyDetail.data
              && (
                <CompanyData collapse={collapse} />
              )}
            {companyDetail && companyDetail.loading && (
              <div className="mb-2 mt-5">
                <Loader />
              </div>
            )}
            {((companyDetail && !companyDetail.data && !companyDetail.loading) || (referId)) && (
            <LocationDetails collapse={collapse} />
            )}
          </Col>
        </Row>
      </Col>
  );
};

export default ViewSpace;
