/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import {
  faArrowLeft, faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import analyticsBlue from '@images/icons/analytics.svg';
import NativeDashboard from '../analytics/nativeDashboard/nativeDashboard';
import customData from './data/customData.json';

const DashboardView = () => {
  const listDashboards = customData && customData.dashboards ? customData.dashboards : [];
  const [dashboardKey, setDashboardKey] = useState(0);
  const [dashboardId, setDashboardId] = useState(listDashboards && listDashboards.length > 0 ? listDashboards[0].name : '');

  const onNext = () => {
    const nextValue = dashboardKey + 1;
    if (nextValue < listDashboards.length) {
      setDashboardKey(nextValue);
      if (listDashboards && listDashboards[nextValue]) {
        setDashboardId(listDashboards[nextValue].name);
      }
    }
  };

  const onPrev = () => {
    const prevValue = dashboardKey - 1;
    if (prevValue >= 0) {
      setDashboardKey(prevValue);
      if (listDashboards && listDashboards[prevValue]) {
        setDashboardId(listDashboards[prevValue].name);
      }
    }
  };

  return (
    <>
      <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border">
        <Col sm="12" md="12" lg="12" xs="12">
          <Row className="pl-2 m-0">
            <Col md="9" sm="9" lg="9" xs="12" className="p-0">
              <div className="d-inline-flex">
                <h3 className="mt-1">
                  <img src={analyticsBlue} alt="analytics" width="25" height="25" className="mr-3 mb-1" />
                  <span>
                    NOC Dashboard &gt;
                    {' '}
                    {dashboardId}
                  </span>
                </h3>
              </div>
            </Col>
            <Col sm="3" md="3" lg="3" xs="12" className="text-right mt-2">
              <FontAwesomeIcon className={!dashboardKey ? 'mr-3' : 'mr-3 cursor-pointer'} disabled={!dashboardKey} size="md" onClick={() => onPrev()} icon={faArrowLeft} />
              <FontAwesomeIcon
                className={dashboardKey + 1 === listDashboards.length ? 'mr-2' : 'mr-2 cursor-pointer'}
                disabled={dashboardKey + 1 === listDashboards.length}
                size="md"
                onClick={() => onNext()}
                icon={faArrowRight}
              />
            </Col>
          </Row>
          <hr className="mt-1" />
          <NativeDashboard dashboardId={dashboardId} />
        </Col>
      </Row>
    </>
  );
};

export default DashboardView;
