/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateHeaderData } from '../../core/header/actions';
import {
  getActiveTab,
  getHeaderTabs,
  getTabs,
} from '../../util/appUtils';
import AdminSideNavSite from '../navbar/navlistSite.json';
import AdminSideNavCompany from '../navbar/navlistCompany.json';
import TeamSegments from './teamSegments';

const OperationsSetup = () => {
  const subMenu = 'Operations';
  const { userRoles, userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Admin Setup',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, userInfo && userInfo.data && userInfo.data.is_parent ? AdminSideNavCompany.data : AdminSideNavSite.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Team Management',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Team Management',
        link: '/setup-team-management',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);
  return (
    /*   <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border">
        <Col sm="12" md="12" lg="12">
          <Row className="p-0">
            <Col sm="12" md="12" lg="12" className="p-0"> */
    <TeamSegments />
    /*   </Col>
    </Row>
  </Col>
</Row> */

  );
};

export default OperationsSetup;
