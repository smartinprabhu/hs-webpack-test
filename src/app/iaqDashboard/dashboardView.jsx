/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, {
  useState, useEffect, useMemo,
} from 'react';
import {
  Card, CardBody, Col, Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import {
  Tooltip, Skeleton,
} from 'antd';
import {
  faExpandAlt,
  faTimesCircle,
  faCheck,
  faClock,
  faClose,
  faPencilAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorContent from '@shared/errorContent';

import ChartCards from './chartCards';
import '../nocDashboards/assetsDashboard/style.css';

import {
  getSpaceEquipments,
  resetSpaceEquipments,
  getThresholdData,
} from '../assets/equipmentService';
import {
  updateDashboardLayouts,
} from '../analytics/analytics.service';
import { generateErrorMessage, getListOfModuleOperations } from '../util/appUtils';
import {
  getDiifTime,
} from '../nocDashboards/utils/utils';

const appModels = require('../util/appModels').default;

const DashboardView = React.memo((props) => {
  const {
    code,
    dashboardName,
    dashboardInterval,
    dashboardLayouts,
    dashboardColors,
  } = props;
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [expandMode, setExpandMode] = useState(false);
  const [customLayouts, setCustomLayouts] = useState({});

  const [isTimer, setTimer] = useState(false);
  const [fetchTime, setFetchTime] = useState(false);
  const [isUpdateLoad, setIsUpdateLoad] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { updateLayoutInfo } = useSelector((state) => state.analytics);

  const {
    spaceThresholds,
  } = useSelector((state) => state.equipment);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Dashboards', 'code');

  const isEditable = allowedOperations.includes('edit_ninja_dashboard');

  useEffect(() => {
    if (dashboardInterval) {
      // setLoadable(false);
      const interval = setInterval(() => {
        setTimer(Math.random());
        setFetchTime(new Date(Date.now() - dashboardInterval));
      }, dashboardInterval);
        // clearInterval(interval);
    }
  }, [dashboardInterval]);

  useEffect(() => {
    if (isTimer && dashboardInterval && code) {
      // dispatch(getThresholdData());
    }
  }, [isTimer]);

  const loading = (spaceThresholds && spaceThresholds.loading);

  useMemo(() => {
    if (code) {
      setTimer(false);
      setFetchTime(false);
      dispatch(resetSpaceEquipments());
      dispatch(getThresholdData());
    }
  }, [code]);

  useEffect(() => {
    if (spaceThresholds && spaceThresholds.data && userInfo && userInfo.data && userInfo.data.company) {
      const sortBy = 'DESC';
      const sortField = 'create_date';
      const category = false;
      const currentSpaceData = spaceThresholds.data.filter((li) => li.asset_category_id && li.asset_category_id.name === 'Floor');
      if (currentSpaceData && currentSpaceData.length) {
        dispatch(getSpaceEquipments(userInfo.data.company.id, currentSpaceData[0].id, category, appModels.EQUIPMENT, sortBy, sortField, true));
      }
    }
  }, [spaceThresholds]);

  useEffect(() => {
    if (updateLayoutInfo && updateLayoutInfo.data && code && isUpdateLoad) {
      setIsUpdateLoad(false);
      dispatch(getThresholdData());
    }
  }, [updateLayoutInfo]);

  const onUpdate = () => {
    if (code) {
      const postData = {
        dashboard_json: customLayouts,
      };
      dispatch(updateDashboardLayouts(code, appModels.NINJABOARD, postData));
    }
    setEditMode(false);
  };

  const onExpand = () => {
    const elem = document.documentElement; // document.getElementById('main-body-property');
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }

    const headerDiv = document.getElementById('main-header');
    const sidebarDiv = document.getElementById('main-sidebar');

    if (headerDiv && sidebarDiv) {
      headerDiv.style.display = 'none';
      sidebarDiv.style.display = 'none';
    }
    setExpandMode(true);
  };

  const onExpandClose = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }

    const headerDiv = document.getElementById('main-header');
    const sidebarDiv = document.getElementById('main-sidebar');

    if (headerDiv && sidebarDiv) {
      headerDiv.style.display = 'initial';
      sidebarDiv.style.display = 'block';
    }
    setExpandMode(false);
  };

  return (
    <Row id="dynamic-dashboard">
      <Col md="12" sm="12" lg="12" xs="12" className="">
        <Card className="p-2 mb-2 h-100 bg-med-blue-dashboard border-0">
          <CardBody className="p-1 m-0">
            <Row className="row-cols-sm-12">
              <Col md="7" sm="12" xs="12" lg="7">
                <h4 className="text-uppercase">
                  {dashboardName}
                  {fetchTime && getDiifTime(fetchTime) && (
                    <Tooltip title={getDiifTime(fetchTime)} placement="top">
                      <span className="font-size-16px">
                        <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faClock} />
                      </span>
                    </Tooltip>
                  )}
                </h4>
              </Col>
              <Col md="5" sm="12" xs="12" lg="5" id="action-buttons">
                <div className="d-flex mt-2 float-right content-center">
                  {!loading && (
                  <>
                    {!expandMode && (
                    <>
                      {editMode ? (
                        <>
                          <Tooltip title="Update" placement="top">
                            <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={() => onUpdate()} icon={faCheck} />
                          </Tooltip>
                          <Tooltip title="Discard" placement="top">
                            <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={() => { setEditMode(false); setCustomLayouts(dashboardLayouts); }} icon={faClose} />
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          {isEditable && (
                          <Tooltip title="Edit" placement="top">
                            <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={() => setEditMode(true)} icon={faPencilAlt} />
                          </Tooltip>
                          )}
                        </>
                      )}
                    </>
                    )}
                    {!editMode && (
                    <Tooltip title={expandMode ? 'Close' : 'Full Screen'} placement="top">
                      {expandMode ? (
                        <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={() => onExpandClose()} icon={faTimesCircle} />
                      ) : (
                        <FontAwesomeIcon className="ml-2 cursor-pointer" size="lg" onClick={() => onExpand()} icon={faExpandAlt} />
                      )}
                    </Tooltip>
                    )}
                  </>
                  )}
                </div>
              </Col>
            </Row>
            <>
              {loading && (
                <div className="text-center mt-2 mb-2">
                  <Skeleton active size="large" />
                </div>
              )}
              <ChartCards
                editMode={editMode}
                code={code}
                setCustomLayouts={setCustomLayouts}
                dashboardLayouts={dashboardLayouts}
                dashboardColors={dashboardColors}
                customLayouts={customLayouts}
              />

              {spaceThresholds && spaceThresholds.err && (
                <ErrorContent errorTxt={generateErrorMessage(spaceThresholds)} />
              )}
            </>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
});

DashboardView.propTypes = {
  code: PropTypes.number.isRequired,
  dashboardName: PropTypes.string.isRequired,
  dashboardInterval: PropTypes.number.isRequired,
  dashboardLayouts: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  dashboardColors: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DashboardView;
