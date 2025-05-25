import React, { useEffect } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import SiteNavbar from './siteNavbar/navbar';
import ViewSpaceAdmin from '../assets/viewSpaceAdmin';
import { updateHeaderData } from '../core/header/actions';
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from '../util/appUtils';
import AdminSideNavSite from './navbar/navlistSite.json';
import AdminSideNavCompany from './navbar/navlistCompany.json';

const AssetConfiguration = () => {
  const dispatch = useDispatch();

  const { userRoles, userInfo } = useSelector((state) => state.user);
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Admin Setup',
  );

  let activeTab;
  let tabss;

  if (headerTabs) {
    tabss = getTabs(headerTabs[0].menu, userInfo && userInfo.data && userInfo.data.is_parent ? AdminSideNavCompany.data : AdminSideNavSite.data);
    activeTab = getActiveTab(
      tabss.filter((e) => e),
      'Facility',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Facility',
        link: '/setup-facility',
        headerTabs: tabss.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border">
      <Col sm="12" md="12" lg="12">
        <ViewSpaceAdmin />
      </Col>
    </Row>

  );
};

export default AssetConfiguration;
