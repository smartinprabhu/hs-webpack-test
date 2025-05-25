/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCheckCircle,
  faTimes,
  faCheck,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Tooltip } from 'antd';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import filterImg from '@images/filterBlack.svg';
import bellIcon from '@images/bell.svg';
import externalLinkIcon from '@images/externalLink.svg';
import helpdeskBlue from '@images/icons/helpdeskBlue.svg';
import assetsBlue from '@images/icons/assetsBlue.svg';
import workordersBlue from '@images/icons/workordersBlue.svg';

import './dashboard.scss';
import {
  getAlarms, getAlarmsCount, updateAlarm, resetUpdateAlarm,
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
import {
  getStateLabel, getPriorityLabel, getPriorityClass, getPriorityColor,
} from './utils/utils';
import customData from './data/customData.json';
import {
  getHelpdeskFilter,
} from '../helpdesk/ticketService';
import {
  getEquipmentFilters,
} from '../assets/equipmentService';
import {
  getWorkorderFilter,
} from '../workorders/workorderService';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const defaultIcon = {
  'website.support.ticket': helpdeskBlue,
  'mro.equipment': assetsBlue,
  'mro.order': workordersBlue,
};

const Notifications = () => {
  const dispatch = useDispatch();
  const limit = 5;
  const modelName = false;
  const classes = useStyles();
  const [isFilters, showFilters] = useState(false);
  const [applyFilters, setApplyFilters] = useState(false);
  const [filters, setFilters] = useState([]);
  const [statusValues, setCheckValues] = useState(['Active', 'Acknowledged']);
  const [priorityValues, setPriorityValues] = useState([]);
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

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFilters = filters ? queryGeneratorWithUtc(filters, false, userInfo.data) : '';
      dispatch(getAlarms(companies, userInfo.data.id, appModels.ALARMSNOTIFICATIONS, modelName, limit, offset, statusValues, priorityValues, customFilters));
    }
  }, [userInfo, offset, applyFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFilters = filters ? queryGeneratorWithUtc(filters, false, userInfo.data) : '';
      dispatch(getAlarmsCount(companies, userInfo.data.id, appModels.ALARMSNOTIFICATIONS, modelName, statusValues, priorityValues, customFilters));
    }
  }, [userInfo, applyFilters]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (alarmUpdateInfo && alarmUpdateInfo.data)) {
      const customFilters = filters ? queryGeneratorWithUtc(filters, false, userInfo.data) : '';
      dispatch(getAlarms(companies, userInfo.data.id, appModels.ALARMSNOTIFICATIONS, modelName, limit, offset, statusValues, priorityValues, customFilters));
      dispatch(getAlarmsCount(companies, userInfo.data.id, appModels.ALARMSNOTIFICATIONS, modelName, statusValues, priorityValues, customFilters));
    }
  }, [userInfo, alarmUpdateInfo]);

  useEffect(() => {
    if (alarmsListInfo) {
      if (alarmsListInfo.data && alarmsListInfo.data.length) {
        setAlarmsList(alarmsListInfo.data);
      } else {
        if (alarmUpdateInfo && !alarmUpdateInfo.data) {
          setAlarmsList([]);
        }
        if (alarmUpdateInfo && alarmUpdateInfo.data) {
          dispatch(resetUpdateAlarm());
        }
      }
    }
  }, [alarmsListInfo]);

  useEffect(() => {
    dispatch(resetUpdateAlarm());
  }, []);

  const totalDataCount = alarmsCount && alarmsCount.length ? alarmsCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setActiveId(false);
  };

  const handleStatusChange = (value) => {
    if (statusValues.some((item) => item.includes(value))) {
      setCheckValues(statusValues.filter((item) => !(item.includes(value))));
    } else {
      setCheckValues((state) => [...state, value]);
    }
    setPage(1);
    setOffset(0);
    setActiveId(false);
  };

  const handlePriorityChange = (value) => {
    if (priorityValues.some((item) => item.includes(value))) {
      setPriorityValues(priorityValues.filter((item) => !(item.includes(value))));
    } else {
      setPriorityValues((state) => [...state, value]);
    }
    setPage(1);
    setOffset(0);
    setActiveId(false);
  };

  const handleDateChange = (value, label) => {
    if (filters.some((item) => item.label.includes(label))) {
      setFilters([]);
    } else {
      const dateFilters = [{
        key: value, value: label, label, type: 'date',
      }];
      setFilters(dateFilters);
    }
    setPage(1);
    setOffset(0);
    setActiveId(false);
  };

  function mathOprtation(total, value) {
    const result = total - value;
    return result;
  }

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

  const onUpdate = (ediId, id, status) => {
    setActiveId(id);
    setTimeout(() => {
      onAlarmUpdate(ediId, status);
    }, 1000);
  };

  const onReset = () => {
    showFilters(false);
    setCheckValues([]);
    setPriorityValues([]);
    setFilters([]);
    setApplyFilters(Math.random());
    setActiveId(false);
    setPage(1);
    setOffset(0);
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
    <Card className="h-100">
      <Row className="m-0 pr-3 pl-1 pt-2 pb-0">
        <Col md="12" lg="12" sm="12" xs="12" className="p-2">
          <FontAwesomeIcon className="mr-2" size="2x" icon={faBell} />
          <h3 className="d-inline-block">
            Alarms
          </h3>
        </Col>
      </Row>
      <CardBody className="pt-0 notification-list thin-scrollbar">
        <Row className="sticky">
          <Col sm="12" xs="12" md="12" lg="12">
            <Card className="rounded-0">
              <CardBody className="p-1">
                <Row>
                  <Col md="12" xs="12" sm="12" lg="12" className="p-2 page-actions-header content-center">
                    <Tooltip title="Filter">
                      <div aria-hidden="true" className="ml-3 mt-1 mr-1 cursor-pointer" onClick={() => showFilters(!isFilters)}>
                        {statusValues && statusValues.length ? (
                          <span className="mr-2 badge-text text-status-primary pt-1 pb-1 pr-2 pl-2 border-radius-10px tag-status-info">
                            {' '}
                            <span className="font-weight-800 mr-1">Status: </span>
                            {statusValues.map((st, index) => (
                              index <= 2
                                ? (
                                  <span className="mr-1" key={st}>
                                    {st}
                                    {'  '}
                                    {statusValues.length !== (index + 1) && (<span>,</span>)}
                                    {'  '}
                                  </span>
                                )
                                : (
                                  <span />
                                )
                            ))}
                            {statusValues.length > 3 && (
                              <span className="mr-1">
                                +
                                {' '}
                                {mathOprtation(statusValues.length, 3)}
                              </span>
                            )}
                          </span>
                        ) : (<span />)}

                        {priorityValues && priorityValues.length ? (
                          <span className="mr-2 badge-text text-status-primary pt-1 pb-1 pr-2 pl-2 border-radius-10px tag-status-info">
                            {' '}
                            <span className="font-weight-800 mr-1">Priority: </span>
                            {priorityValues.map((pr, index) => (
                              index <= 2
                                ? (
                                  <span className="mr-1" key={pr}>
                                    {pr}
                                    {'  '}
                                    {priorityValues.length !== (index + 1) && (<span>,</span>)}
                                    {'  '}
                                  </span>
                                )
                                : (
                                  <span />
                                )
                            ))}
                            {priorityValues.length > 3 && (
                            <span className="mr-1">
                              +
                              {' '}
                              {mathOprtation(priorityValues.length, 3)}
                            </span>
                            )}
                          </span>
                        ) : (<span />)}

                        {filters && filters.length ? (
                          <>
                            <br />
                            <br />
                            <span className="mr-2 badge-text text-status-primary pt-1 pb-1 pr-2 pl-2 border-radius-10px tag-status-info">
                              {' '}
                              <span className="font-weight-800 mr-1">Date: </span>
                              {filters.map((pr) => (
                                <span className="mr-1" key={pr.label}>
                                  {pr.label}
                                </span>
                              ))}
                            </span>
                          </>
                        ) : (<span />)}
                      </div>
                    </Tooltip>
                    <div className="content-left">
                      {((filters && filters.length) || (statusValues && statusValues.length) || (priorityValues && priorityValues.length)) ? (
                        <Tooltip title="Clear">
                          <FontAwesomeIcon
                            size="large"
                            className="mr-3 cursor-pointer"
                            icon={faTimes}
                            onClick={() => onReset()}
                          />
                        </Tooltip>
                      ) : (<span />)}
                      <Tooltip title="Filter">
                        <img
                          aria-hidden="true"
                          src={filterImg}
                          alt="filter"
                          className="mr-3 cursor-pointer"
                          onClick={() => showFilters(!isFilters)}
                        />
                      </Tooltip>
                    </div>
                  </Col>
                </Row>
                {isFilters && (
                  <>
                    <Row className="p-4 text-center">
                      <Col md="3" xs="12" sm="12" lg="3">
                        <h6>Status</h6>
                        {customData && customData.statesList && customData.statesList.map((st) => (
                          <p
                            aria-hidden="true"
                            key={st.value}
                            className={statusValues.some((selectedValue) => selectedValue.includes(st.value))
                              ? 'mb-2 font-size-10px font-weight-800 text-status-primary pt-1 pb-1 pr-2 pl-2 border-radius-10px tag-status-info cursor-pointer'
                              : 'mb-2 font-size-10px font-weight-800 bg-white tab_nav_link pt-1 pb-1 pr-2 pl-2 border-radius-10px border cursor-pointer'}
                            onClick={() => handleStatusChange(st.value)}
                          >
                            {statusValues.some((selectedValue) => selectedValue.includes(st.value))
                              ? <FontAwesomeIcon size="sm" color="info" className="mr-1 text-info" icon={faCheck} />
                              : ''}
                            {st.label}
                          </p>
                        ))}
                      </Col>
                      <Col md="3" xs="12" sm="12" lg="3">
                        <h6>Priority</h6>
                        {customData && customData.prioritiesList && customData.prioritiesList.map((pr) => (
                          <p
                            aria-hidden="true"
                            key={pr.value}
                            className={priorityValues.some((selectedValue) => selectedValue.includes(pr.value))
                              ? `${getPriorityClass(pr.value)} cursor-pointer mb-2`
                              : 'mb-2 font-size-10px font-weight-800 bg-white tab_nav_link pt-1 pb-1 pr-2 pl-2 border-radius-10px border cursor-pointer'}
                            onClick={() => handlePriorityChange(pr.value)}
                          >
                            {priorityValues.some((selectedValue) => selectedValue.includes(pr.value))
                              ? <FontAwesomeIcon size="sm" color={getPriorityColor(pr.value)} className={`mr-1 text-${getPriorityColor(pr.value)}`} icon={faCheck} />
                              : ''}
                            {pr.label}
                          </p>
                        ))}
                      </Col>
                      <Col md="3" xs="12" sm="12" lg="3">
                        <h6>Date</h6>
                        {customData && customData.dateFilters && customData.dateFilters.map((dt) => (
                          <p
                            aria-hidden="true"
                            key={dt.value}
                            className={filters.some((selectedValue) => selectedValue.label.includes(dt.label))
                              ? 'mb-2 font-size-10px font-weight-800 text-status-primary pt-1 pb-1 pr-2 pl-2 border-radius-10px tag-status-info cursor-pointer'
                              : 'mb-2 font-size-10px font-weight-800 tab_nav_link bg-white pt-1 pb-1 pr-2 pl-2 border-radius-10px border cursor-pointer'}
                            onClick={() => handleDateChange(dt.value, dt.label)}
                          >
                            {filters.some((selectedValue) => selectedValue.label.includes(dt.label))
                              ? <FontAwesomeIcon size="sm" color="info" className="mr-1 text-info" icon={faCheck} />
                              : ''}
                            {dt.label}
                          </p>
                        ))}
                      </Col>
                    </Row>
                    {((filters && filters.length) || (statusValues && statusValues.length) || (priorityValues && priorityValues.length)) ? (
                      <div className="float-left">
                        <Button
                          size="sm"
                          type="button"
                           variant="contained"
                          className="ml-2"
                          onClick={() => onReset()}
                        >
                          <span className="font-weight-700 font-11 pt-1">Clear all</span>
                        </Button>
                      </div>
                    ) : (<div />)}
                    <div className="float-right">
                      <Button
                        size="sm"
                        type="button"
                         variant="contained"
                        className="mr-2"
                        onClick={() => { showFilters(!isFilters); setApplyFilters(Math.random()); }}
                      >
                        <span className="font-weight-700 font-11 pt-1">Apply</span>
                      </Button>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col md="12" xs="12" sm="12" lg="12">
            {(loading || pages === 0) ? (<span />) : (
              <>
                <div className={`${classes.root} float-left mt-3 ml-1`}>
                  {totalDataCount}
                  {' '}
                  Alarms found
                </div>
                <div className={`${classes.root} float-right`}>
                  <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                </div>
              </>
            )}
          </Col>
        </Row>
        {alarmsList && alarmsList.map((actions) => (
          <Row className="pt-3" key={actions.id}>
            <Col md="12" xs="12" sm="12" lg="12">
              <Card className="overflow-hidden">
                <CardBody className="pt-2 pb-2">
                  {(activeId === actions.id && ((alarmUpdateInfo && alarmUpdateInfo.loading) || (alarmsListInfo && alarmsListInfo.loading))) ? (
                    <Loader />
                  )
                    : (
                      <>
                        <Row>
                          <Col md="9" xs="12" sm="12" lg="9" className="p-1">
                            <img
                              src={actions.model_name && defaultIcon[actions.model_name] ? defaultIcon[actions.model_name] : bellIcon}
                              width="20"
                              height="20"
                              alt="notification"
                              className="ml-1 mr-1"
                            />
                            <Tooltip title={actions.name}>
                              <span className="font-weight-800 mr-2">{truncate(actions.name, 30)}</span>
                            </Tooltip>
                            {getStateLabel(actions.alarm_state)}
                            {getPriorityLabel(actions.priority)}
                          </Col>
                          <Col md="3" xs="12" sm="12" lg="3" className="text-right p-0">
                            <small>{getLocalTime(actions.create_date)}</small>
                            {viewId === actions.id && (
                            <FontAwesomeIcon className="ml-1 cursor-pointer" onClick={() => setViewId(false)} size="sm" icon={faChevronDown} />
                            )}
                          </Col>
                        </Row>
                        <Row>
                          {actions.model_name === 'website.support.ticket' && actions.record && (
                          <Col md="12" xs="12" sm="12" lg="12" className="ml-3">
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
                          <Col md="12" xs="12" sm="12" lg="12" className="ml-3">
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
                          <Col md="12" xs="12" sm="12" lg="12" className="ml-3">
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
                          {(viewId !== actions.id) && (actions.description && actions.description.length > 170) && (
                          <Col md="12" xs="12" sm="12" lg="12" className="pt-1 ml-3 cursor-pointer" onClick={() => setViewId(actions.id)}>
                            <p className="font-weight-400">{truncate(actions.description, 170)}</p>
                          </Col>
                          )}
                          {((viewId === actions.id) || (actions.description && actions.description.length < 170)) && (
                          <Col md="12" xs="12" sm="12" lg="12" className="pt-1 ml-3">
                            <p className="font-weight-400">{actions.description}</p>
                          </Col>
                          )}
                        </Row>
                        <Row>
                          <Col md="4" xs="12" sm="4" lg="4">
                            {getActions(actions.alarm_state, actions.mro_alarm_id ? actions.mro_alarm_id[0] : actions.id, actions.id)}
                          </Col>
                          <Col md="8" xs="12" sm="8" lg="8">
                            {(actions.alarm_state === 'Acknowledged' && actions.acknowledged_by) && (
                            <div className="text-success text-right">
                              <FontAwesomeIcon size="sm" className="mr-2 text-success" icon={faCheckCircle} />
                              <span className="font-tiny">
                                Acknowelged by
                                {'   '}
                                {actions.acknowledged_by[1]}
                                <br />
                                on
                                {'   '}
                                {getLocalTime(actions.acknowledged_on)}
                              </span>
                            </div>
                            )}
                            {(actions.alarm_state === 'Resolved' && actions.resolved_by) && (
                            <div className="text-success text-right">
                              <FontAwesomeIcon size="sm" className="mr-2 text-success" icon={faCheckCircle} />
                              <span className="font-tiny">
                                Resolved by
                                {'   '}
                                {actions.resolved_by[1]}
                                <br />
                                on
                                {'   '}
                                {getLocalTime(actions.resolved_on)}
                              </span>
                            </div>
                            )}
                            {(actions.alarm_state === 'Cancelled' && actions.cancelled_by) && (
                            <div className="text-success text-right">
                              <FontAwesomeIcon size="sm" className="mr-2 text-success" icon={faCheckCircle} />
                              <span className="font-tiny">
                                Cancelled by
                                {'   '}
                                {actions.cancelled_by[1]}
                                <br />
                                on
                                {'   '}
                                {getLocalTime(actions.cancelled_on)}
                              </span>
                            </div>
                            )}
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
        {(loading || pages === 0) ? (<span />) : (
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
      </CardBody>
    </Card>
  );
};

export default Notifications;
