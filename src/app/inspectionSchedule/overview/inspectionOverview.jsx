import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import './complianceOverview.scss';
import DashboardComponent from '@shared/dashboardComponent';
import Insights from './insights';
import {
  resetInspectionViewer, resetInspectionSpaceGroup,
} from '../inspectionService';

import { updateHeaderData } from '../../core/header/actions';
import {
  getActiveTab,
  getHeaderTabs,
  getTabs,
  getDynamicTabs,
} from '../../util/appUtils';
import inspectionNav from '../navbar/navlist.json';

const appModels = require('../../util/appModels').default;

const InspectionOverview = () => {
  const dispatch = useDispatch();
  const [isOldDashboard, setOldDashboard] = useState(false);
  const subMenu = 'Insights';
  const module = 'Inspection Schedule';
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    module,
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, inspectionNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(inspectionNav && inspectionNav.data && inspectionNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/inspection-overview/inspection/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      subMenu,
    );
  }

  useEffect(() => {
    dispatch(resetInspectionViewer());
    dispatch(resetInspectionSpaceGroup());
  }, []);

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module,
        moduleName: module,
        menuName: subMenu,
        link: '/inspection-overview',
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
        {isOldDashboard && (
        <Insights />
        )}
      </Col>
      { /* isOldDashboard && (
              <Col sm="12" md="12" lg="4" xs="12" className="p-0">
                <Row className="pb-1 pt-2">
                  <Col className="asset-insight-notifications" sm="12" md="12" lg="12" xs="12">
                    <ChecklistAlarms modelName="Checklist" />
                  </Col>
                </Row>
              </Col>
            ) */}
    </Row>
  );
};
export default InspectionOverview;
