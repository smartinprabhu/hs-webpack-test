/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CardOverview from './cardOverview';
import { updateHeaderData } from '../../core/header/actions';
import {
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from '../../util/appUtils';
import SustainabilityNav from '../navlist.json';
import ChartOverview from './chartOverview';

const Overview = () => {
  const { userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'ESG Tracker',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, SustainabilityNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Overview',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'ESG Tracker',
        moduleName: 'ESG Monitoring',
        menuName: 'Overview',
        link: '/esg-monitoring/overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <div className="insights-box-no-height">
      <div id="dynamic-dashboard">
        <div className="header-box2">
          <div className="insights-filter-box">
            <div className="commongrid-header-text">
              {' '}
              Executive Overview
            </div>
          </div>
          <div className="insights-filter-box" id="action-buttons" />
        </div>

        <div className="p-2 m-1">
          <CardOverview />
          <ChartOverview />
        </div>

      </div>
    </div>
  );
};

export default Overview;
