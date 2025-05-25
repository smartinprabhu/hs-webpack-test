/* eslint-disable no-undef */
/* eslint-disable max-len */

import React, { useEffect } from 'react';
import {
  Row, Col,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import './dashboard.scss';
import CovidResources from './covidResourses';
import CovidInfo from './covidInfo';
import UserActions from './userActions';
import Booking from '../booking/booking';
import SpaceNavbar from '../spaceManagement/navbar/spaceNavbar';
import { getActiveTab, getHeaderTabs, getTabs } from '../util/appUtils';
import { updateHeaderData } from '../core/header/actions';
import sideNav from './navbar/navlist.json'

const appConfig = require('../config/appConfig').default;

const Dashboard = () => {
  const { userInfo, userRoles } = useSelector((state) => state.user);
 // window.OneSignal = window.OneSignal || [];
  const spaceSubMenu = 'Hspace Home';

 /* useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && appConfig.ONESIGNALAPPID && appConfig.ENV && window.location.origin) {
      OneSignal.push(() => {
        OneSignal.sendTags({
          user_id: userInfo.data.id,
          employee_id: userInfo.data.employee.id,
          user_name: userInfo.data.employee.name,
          build: appConfig.ENV,
          instance: window.location.origin,
          current_company: userInfo.data.company.id,
        });
      });
    }
  }, [userInfo && userInfo.data && userInfo.data.company]); */

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "HSpace - Space Management"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, sideNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "Locations"
    );
  }
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "HSpace - Space Management",
        moduleName: "HSpace - Space Management",
        menuName: "Locations",
        link: "/hspace-home",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  const isCovidInfoObj = (userRoles && userRoles.data && userRoles.data.covid && userRoles.data.covid.enable_covid_config);

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 space-management border">
      <Col sm="12" md="12" lg="12" xs="12">
        <SpaceNavbar id={spaceSubMenu} />
        <div className="pt-3"></div>
        <Row className="m-0 dashboard pr-3">
          <Col lg={isCovidInfoObj ? '12' : '7'} xl={isCovidInfoObj ? '7' : '7'} sm={isCovidInfoObj ? '12' : '12'} md={isCovidInfoObj ? '12' : '12'} xs="12" className={isCovidInfoObj ? 'mt-2 pr-0' : 'mt-2'}>
            <Booking />
          </Col>
          {isCovidInfoObj && (
            <Col lg="12" xl="5" sm="12" md="12" xs="12" className="mt-2 pl-0 pr-0">
              <CovidInfo />
            </Col>
          )}
          <Col lg={isCovidInfoObj ? '12' : '5'} sm={isCovidInfoObj ? '12' : '12'} md={isCovidInfoObj ? '12' : '12'} xs="12" xl={isCovidInfoObj ? '7' : '5'} className="mt-2 pr-0">
            <UserActions />
          </Col>
          {isCovidInfoObj && (
            <Col lg="12" sm="12" md="12" xs="12" xl="5" className="mt-2 pl-0 pr-0">
              <CovidResources />
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export default Dashboard;
