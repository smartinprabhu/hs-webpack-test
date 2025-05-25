import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import DashboardComponent from '@shared/dashboardComponent';

import { updateHeaderData } from '../core/header/actions';
import {
  getActiveTab,
  getHeaderTabs,
  getTabs,
  getDynamicTabs,
} from '../util/appUtils';
import inspectionNav from './navbar/navlist.json';

const Overview = () => {
  const dispatch = useDispatch();
  const [isOldDashboard, setOldDashboard] = useState(false);
  const subMenu = 'Insights';
  const module = 'ESG';
  const { userRoles } = useSelector((state) => state.user);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    module,
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, inspectionNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(inspectionNav && inspectionNav.data && inspectionNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/esg/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      subMenu,
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module,
        moduleName: module,
        menuName: subMenu,
        link: '/esg/overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Row className="">
      <Col sm="12" md="12" lg="12" xs="12" className="">
        <DashboardComponent
          module={module}
          menuName={subMenu}
          moduleName={module}
          setOldDashboard={setOldDashboard}
          isOldDashboard={isOldDashboard}
        />
      </Col>
    </Row>
  );
};
export default Overview;
