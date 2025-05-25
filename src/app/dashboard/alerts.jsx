/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardTitle,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Tooltip } from 'antd';
import { Redirect } from 'react-router-dom';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import bellIcon from '@images/bell.svg';
import externalLinkIcon from '@images/externalLink.svg';

import './dashboard.scss';
import {
  getAlarms, getAlarmsCount, updateAlarm, resetUpdateAlarm,
  resetAlarm,
} from './dashboardService';

import {
  getAllowedCompanies,
  queryGenerator,
  getPagesCountV2,
  generateErrorMessage,
  getLocalTime,
  truncate,
  queryGeneratorWithUtc,
} from '../util/appUtils';
// import { getStateLabel, getPriorityLabel } from './utils/utils';
import {
  getHelpdeskFilter,
} from '../helpdesk/ticketService';
import {
  getEquipmentFilters,
} from '../assets/equipmentService';
import {
  getWorkorderFilter,
} from '../workorders/workorderService';
import customData from './data/customData.json';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Alerts = (props) => {
  const {
    modelName,
  } = props;

  const dispatch = useDispatch();
  const limit = 5;
  const classes = useStyles();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState(false);
  const [isRedirect, setRedirect] = useState(false);
  const [isTicket, setTicket] = useState(false);
  const [isAsset, setAsset] = useState(false);
  const [isOrder, setOrder] = useState(false);
  const [alarmsList, setAlarmsList] = useState([]);
  const [viewId, setViewId] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    alarmsListInfo, alarmsCount, alarmsCountLoading, alarmUpdateInfo,
  } = useSelector((state) => state.config);
  const companies = getAllowedCompanies(userInfo);

  const filters = [];
  const customFilters = queryGeneratorWithUtc(filters, false, userInfo.data);
  const statusValues = customData && customData.defaultStates ? customData.defaultStates : [];
  const priorityValues = [];

  useEffect(() => {
    dispatch(resetUpdateAlarm());
    dispatch(resetAlarm());
    setAlarmsList([]);
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getAlarms(companies, userInfo.data.id, appModels.ALARMSNOTIFICATIONS, modelName, limit, offset, statusValues, priorityValues, customFilters));
    }
  }, [userInfo, offset, modelName]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      setAlarmsList([]);
      dispatch(getAlarmsCount(companies, userInfo.data.id, appModels.ALARMSNOTIFICATIONS, modelName, statusValues, priorityValues, customFilters));
    }
  }, [userInfo, modelName]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (alarmUpdateInfo && alarmUpdateInfo.data)) {
      dispatch(getAlarms(companies, userInfo.data.id, appModels.ALARMSNOTIFICATIONS, modelName, limit, offset, statusValues, priorityValues, customFilters));
      dispatch(getAlarmsCount(companies, userInfo.data.id, appModels.ALARMSNOTIFICATIONS, modelName, statusValues, priorityValues, customFilters));
    }
  }, [userInfo, alarmUpdateInfo]);

  useEffect(() => {
    if (alarmsListInfo) {
      if (alarmsListInfo.data) {
        if (alarmsListInfo.data.length) {
          if (alarmsListInfo.data[0].model_name === modelName) {
            setAlarmsList(alarmsListInfo.data);
          } else {
            setAlarmsList([]);
          }
        } else {
          setAlarmsList([]);
        }
      } else {
        if (alarmUpdateInfo && alarmsListInfo.err) {
          setAlarmsList([]);
        }
        if (alarmUpdateInfo && !alarmUpdateInfo.data) {
          setAlarmsList([]);
        }
        if (alarmUpdateInfo && alarmUpdateInfo.data) {
          dispatch(resetUpdateAlarm());
        }
      }
    }
  }, [alarmsListInfo, alarmsCount, modelName]);

  const totalDataCount = alarmsCount && alarmsCount.length ? alarmsCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setActiveId(false);
  };

  const onIDLoad = (id) => {
    const ticketFilters = [{
      key: 'id', value: id, label: 'ID', type: 'id',
    }];
    const filterValues = {
      statusValues: [],
      categories: [],
      priorities: [],
      customFilters: ticketFilters,
    };
    dispatch(getHelpdeskFilter(filterValues));
    setTicket(true);
    setRedirect(true);
  };

  const onAssetIDLoad = (id) => {
    const assetFilters = [{
      key: 'id',
      value: id,
      label: 'ID',
      type: 'id',
    }];
    dispatch(getEquipmentFilters(assetFilters));
    setAsset(true);
    setRedirect(true);
  };

  const onOrderIDLoad = (id) => {
    const workFilters = [{
      key: 'id', value: id, label: 'ID', type: 'id',
    }];
    const filterValues = {
      statusValues: [],
      teams: [],
      priorities: [],
      customFilters: workFilters,
    };
    dispatch(getWorkorderFilter(filterValues));
    setOrder(true);
    setRedirect(true);
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (alarmsListInfo && alarmsListInfo.loading) || (alarmsCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (alarmsListInfo && alarmsListInfo.err) ? generateErrorMessage(alarmsListInfo) : userErrorMsg;

  const onAlarmUpdate = (editId, status) => {
    const postData = {
      state: status,
    };
    dispatch(updateAlarm(editId, appModels.ALARMS, postData));
  };

  const onUpdate = (ediId, id, status) => {
    setActiveId(id);
    setTimeout(() => {
      onAlarmUpdate(ediId, status);
    }, 1000);
  };

  function getActions(messageType, ediId, id) {
    let buttonReview = '';
    if (messageType) {
      if (messageType === 'Acknowledged') {
        buttonReview = (
          <>
            <Button
              size="sm"
              type="button"
               variant="contained"
              className="mr-2"
              onClick={() => onUpdate(ediId, id, 'Resolved')}
            >
              <span className="font-weight-700 font-11 pt-1">Resolve</span>
            </Button>
            <Button
              size="sm"
              type="button"
               variant="contained"
              onClick={() => onUpdate(ediId, id, 'Active')}
              className="btn-cancel"
            >
              <span className="font-weight-700 font-11 pt-1">Release</span>
            </Button>
          </>
        );
      } else if (messageType === 'Active') {
        buttonReview = (
          <>
            <Button
              size="sm"
              type="button"
               variant="contained"
              className="mr-2"
              onClick={() => onUpdate(ediId, id, 'Acknowledged')}
            >
              <span className="font-weight-700 font-11 pt-1">Acknowledge</span>
            </Button>
            <Button
              size="sm"
              type="button"
               variant="contained"
              className="btn-cancel"
              onClick={() => onUpdate(ediId, id, 'Cancelled')}
            >
              <span className="font-weight-700 font-11 pt-1">Cancel</span>
            </Button>
          </>
        );
      }
    }
    return buttonReview;
  }

  if (isRedirect && isTicket) {
    return (<Redirect to="/helpdesk/tickets" />);
  }

  if (isRedirect && isAsset) {
    return (<Redirect to="/assets/equipments" />);
  }

  if (isRedirect && isOrder) {
    return (<Redirect to="/maintenance/workorders" />);
  }

  return (
    <Card className="p-2 border-0 h-100">
      <CardTitle className="mb-0">
        <h6>
          <img src={bellIcon} className="mr-2" alt="alerts" width="20" height="20" />
          ALARMS
        </h6>
      </CardTitle>
      <CardBody className="alarms-list p-0 thin-scrollbar">
        <Row className="mb-2">
          <Col md="12" xs="12" sm="12" lg="12">
            {!loading && (alarmsListInfo && alarmsListInfo.data && alarmsListInfo.data[0].model_name === modelName) && (
            <>
              <div className={`${classes.root} float-left mt-3 ml-3`}>
                {totalDataCount}
                {' '}
                Alarms found
              </div>
            </>
            )}
          </Col>
        </Row>
        {alarmsList && alarmsList.map((actions) => (
          <Row className="pb-2 m-0" key={actions.id}>
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="border-left-dark bg-thinblue overflow-hidden">
                <CardBody className="pt-2 pb-2">
                  {(activeId === actions.id && ((alarmUpdateInfo && alarmUpdateInfo.loading) || (alarmsListInfo && alarmsListInfo.loading))) ? (
                    <Loader />
                  )
                    : (
                      <>
                        <Row>
                          <Col md="7" sm="12" xs="12" lg="7" className="p-1">
                            <img src={bellIcon} className="mr-1" alt="alerts" width="15" height="15" />
                            <Tooltip title={actions.name}>
                              <span className="font-weight-800">{truncate(actions.name, 30)}</span>
                            </Tooltip>
                          </Col>
                          <Col md="5" sm="12" xs="12" lg="5" className="text-right p-0">
                            <small>{getLocalTime(actions.create_date)}</small>
                            {viewId === actions.id && (
                            <FontAwesomeIcon className="ml-1 cursor-pointer" onClick={() => setViewId(false)} size="sm" icon={faChevronDown} />
                            )}
                          </Col>
                        </Row>
                        <Row>
                          {actions.model_name === 'website.support.ticket' && actions.record && (
                          <Col md="12" xs="12" sm="12" lg="12" className="ml-2">
                            <span className="font-weight-700 mr-2">
                              #
                              {actions.record_name}
                            </span>
                            <img
                              aria-hidden="true"
                              src={externalLinkIcon}
                              alt="notification"
                              height="15"
                              width="15"
                              className="cursor-pointer mt-n3px"
                              onClick={() => onIDLoad(actions.record)}
                            />
                          </Col>
                          )}
                          {actions.model_name === 'mro.equipment' && actions.record && (
                          <Col md="12" xs="12" sm="12" lg="12" className="ml-2">
                            <span className="font-weight-700 mr-2">
                              #
                              {actions.record_name}
                            </span>
                            <img
                              aria-hidden="true"
                              src={externalLinkIcon}
                              alt="notification"
                              height="15"
                              width="15"
                              className="cursor-pointer mt-n3px"
                              onClick={() => onAssetIDLoad(actions.record)}
                            />
                          </Col>
                          )}
                          {actions.model_name === 'mro.order' && actions.record && (
                          <Col md="12" xs="12" sm="12" lg="12" className="ml-2">
                            <span className="font-weight-700 mr-2">
                              #
                              {actions.record_name}
                            </span>
                            <img
                              aria-hidden="true"
                              src={externalLinkIcon}
                              alt="notification"
                              height="15"
                              width="15"
                              className="cursor-pointer mt-n3px"
                              onClick={() => onOrderIDLoad(actions.record)}
                            />
                          </Col>
                          )}
                        </Row>
                        <Row>
                          {(viewId !== actions.id) && (actions.description && actions.description.length > 50) && (
                          <Col md="12" xs="12" sm="12" lg="12" className="pt-1 ml-2 cursor-pointer" onClick={() => setViewId(actions.id)}>
                            <p className="font-weight-400">{truncate(actions.description, 50)}</p>
                          </Col>
                          )}
                          {((viewId === actions.id) || (actions.description && actions.description.length < 50)) && (
                          <Col md="12" xs="12" sm="12" lg="12" className="pt-1 ml-2">
                            <p className="font-weight-400">{actions.description}</p>
                          </Col>
                          )}
                        </Row>
                        <Row>
                          <Col md="12" xs="12" sm="12" lg="12">
                            {getActions(actions.alarm_state, actions.mro_alarm_id ? actions.mro_alarm_id[0] : actions.id, actions.id)}
                          </Col>
                        </Row>
                      </>
                    )}
                </CardBody>
                <div className="arrow-down-normal-notify" />
              </Card>
            </Col>
          </Row>
        ))}
        {!loading && (alarmsListInfo && alarmsListInfo.data && alarmsListInfo.data[0].model_name === modelName) && (
          <Row>
            <Col md="12" xs="12" sm="12" lg="12" className="page-actions-header">
              <div className={`${classes.root} margin-right-auto content-left`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            </Col>
          </Row>
        )}
        {!activeId && loading && (
        <div className="mb-2 mt-3 p-5" data-testid="loading-case">
          <Loader />
        </div>
        )}
        {((alarmsListInfo && alarmsListInfo.err) || isUserError) && (
        <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        {(alarmsListInfo && alarmsListInfo.data && alarmsListInfo.data[0].model_name !== modelName) && (
        <ErrorContent errorTxt="No text" />
        )}
      </CardBody>
    </Card>
  );
};

Alerts.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default Alerts;
