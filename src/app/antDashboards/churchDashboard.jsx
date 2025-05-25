/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, {
  Suspense, lazy, useEffect, useState,
} from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import axios from 'axios';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import closeCircleRed from '@images/icons/closeCircleRed.svg';
import Loader from '@shared/loading';

import { getTabName } from '../util/getDynamicClientData';
import theme from '../util/materialTheme';
import { detectMob } from '../util/appUtils';
import AuthService from '../util/authService';

const MapLocations = lazy(() => import('./sensorsDashboard'));

const appConfig = require('../config/appConfig').default;

const ChurchDashboard = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;

  const authService = AuthService();
  const isMob = detectMob();
  const WEBAPPAPIURL = `${window.location.origin}/`;
  const isAuthenticated = authService.getRefreshToken();

  const [dashboardConfig, setDashboardConfig] = useState({ loading: false, data: null, err: null });

  const headerDiv = document.getElementById('main-header');
  const sidebarDiv = document.getElementById('main-sidebar');
  const mainDiv = document.getElementById('main-body-property');
  const appDiv = document.getElementById('app-main-content');
  const mainContDiv = document.getElementById('main-content-id');

  if (headerDiv && sidebarDiv) {
    headerDiv.style.display = 'none';
    sidebarDiv.style.display = 'none';
  }

  if (mainDiv) {
    mainDiv.style.backgroundColor = '#3a4354';
  }

  if (appDiv) {
    appDiv.className = 'temp-background';
    appDiv.style.backgroundColor = '#3a4354';
  }

  if (mainDiv && !isAuthenticated) {
    mainDiv.style.overflowX = 'hidden';
  }

  if (mainContDiv && !isMob) {
    mainContDiv.className = 'main-content-zoom';
  }

  useEffect(() => {
    if (uuid) {
      setDashboardConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getPublicDashboardData?uuid=${uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
        },
      };
      axios(config)
        .then((response) => setDashboardConfig({
          loading: false, data: response.data.data, count: response.data.data ? 1 : 0, err: null,
        }))
        .catch((error) => {
          setDashboardConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [uuid]);

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;
  const companyDetailData = dashboardConfig && dashboardConfig.data && dashboardConfig.count > 0 ? dashboardConfig.data : '';

  return (
    <div className={!isAuthenticated ? 'main-content-zoom' : ''}>
      <Row className="ml-1 mr-1 mt-2 mb-2 p-2">
        <Col sm="12" md="12" lg="12" xs="12" className="p-2">
          {dashboardConfig && dashboardConfig.loading && (
          <div className="mt-4">
            <Loader color />
          </div>
          )}
          {dashboardConfig && dashboardConfig.data && !dashboardConfig.count && (
          <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
            <div className="text-center mt-3 mb-3">
              <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
              <h4 className="text-danger">Oops! Your request is invalid</h4>
            </div>
          </Col>
          )}
          {dashboardConfig && dashboardConfig.err && (
          <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
            <div className="text-center mt-3 mb-3">
              <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
              <h4 className="text-danger">Oops! Your request is invalid</h4>
            </div>
          </Col>
          )}
          {companyDetailData && (
          <ThemeProvider theme={theme}>
            <Suspense fallback={<Loader color />}>
              <MapLocations detailData={companyDetailData} />
            </Suspense>
          </ThemeProvider>
          )}
        </Col>
      </Row>
    </div>
  );
};

ChurchDashboard.defaultProps = {
  match: false,
};

ChurchDashboard.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default ChurchDashboard;
