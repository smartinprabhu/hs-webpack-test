import React, { useEffect } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import SiteNavbar from '../siteNavbar/navbar';
import MaintenanceSegmants from '../assetsLocationConfiguration/maintenance/maintenance';
import { updateHeaderData } from '../../core/header/actions';
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from '../../util/appUtils';
import AdminSideNav from '../navbar/navlist.json';

const MaintenanceConfiguration = () => {
  const dispatch = useDispatch();

  const { userRoles } = useSelector((state) => state.user);
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Admin Setup',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, AdminSideNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Maintenance',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Maintenance',
        link: '/setup-maintenance-configuration',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Row className="ml-1 mr-1 mt-1 mb-1">
      <Col sm="12" md="12" lg="12" className="p-0">
        <MaintenanceSegmants />
      </Col>
    </Row>

  );
};

export default MaintenanceConfiguration;
