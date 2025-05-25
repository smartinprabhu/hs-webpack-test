/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Tooltip } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import externalLinkIcon from '@images/externalLink.svg';
import infoGreen from '@images/icons/infoGreen.svg';
import helpdeskBlue from '@images/icons/helpdeskBlue.svg';
import assetsBlue from '@images/icons/assetsBlue.svg';
import workordersBlue from '@images/icons/workordersBlue.svg';
import {
  getAlarmsNotifications,
  updateAlarm, resetUpdateAlarm,
} from '../../dashboard/dashboardService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getLocalTime,
  truncate,
} from '../../util/appUtils';
// import { getStateLabel, getPriorityLabel } from '../../dashboard/utils/utils';
import {
  getHelpdeskFilter,
} from '../../helpdesk/ticketService';
import {
  getEquipmentFilters,
} from '../../assets/equipmentService';
import {
  getWorkorderFilter,
} from '../../workorders/workorderService';

const appModels = require('../../util/appModels').default;

const defaultIcon = {
  'website.support.ticket': helpdeskBlue,
  'mro.equipment': assetsBlue,
  'mro.order': workordersBlue,
};

const Alarms = () => {
  const limit = 10;
  const [activeId, setActiveId] = useState(false);
  const [isRedirect, setRedirect] = useState(false);
  const [isTicket, setTicket] = useState(false);
  const [isAsset, setAsset] = useState(false);
  const [isOrder, setOrder] = useState(false);
  const [alarmsList, setAlarmsList] = useState([]);
  const [viewId, setViewId] = useState(false);
  const [offsetValue, setOffsetValue] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const {
    alarmsNotificationInfo, alarmUpdateInfo,
  } = useSelector((state) => state.config);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getAlarmsNotifications(companies, userInfo.data.id, appModels.ALARMSNOTIFICATIONS, limit, offsetValue));
    }
  }, [userInfo, scrollTop, offsetValue]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (alarmUpdateInfo && alarmUpdateInfo.data)) {
      dispatch(getAlarmsNotifications(companies, userInfo.data.id, appModels.ALARMSNOTIFICATIONS, limit, offsetValue));
    }
  }, [userInfo, alarmUpdateInfo]);

  useEffect(() => {
    if (alarmsNotificationInfo) {
      if (alarmsNotificationInfo.data && alarmsNotificationInfo.data.length) {
        if (alarmUpdateInfo && alarmUpdateInfo.data) {
          setAlarmsList(alarmsNotificationInfo.data);
          dispatch(resetUpdateAlarm());
        }
        if (alarmUpdateInfo && !alarmUpdateInfo.data) {
          const arr = [...alarmsList, ...alarmsNotificationInfo.data];
          setAlarmsList([...new Map(arr.map((item) => [item.id, item])).values()]);
        }
      } else {
        if (alarmsNotificationInfo && !alarmsNotificationInfo.data && !alarmsNotificationInfo.loading) {
          setAlarmsList([]);
        }
        if (alarmUpdateInfo && alarmUpdateInfo.data) {
          dispatch(resetUpdateAlarm());
        }
      }
    }
  }, [alarmsNotificationInfo, alarmUpdateInfo]);

  useEffect(() => {
    dispatch(resetUpdateAlarm());
  }, []);

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    if ((alarmsNotificationInfo && !alarmsNotificationInfo.loading) && bottom) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

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
    <>

      <Row className="notification-header thin-scrollbar" onScroll={onScroll}>
        <Col md="12" lg="12" sm="12" xs="12">
          {alarmsList && alarmsList.map((actions) => (
            <Row className="pt-3" key={actions.id}>
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="overflow-hidden">
                  <CardBody className="pt-1 pb-1">
                    {(activeId === actions.id && ((alarmUpdateInfo && alarmUpdateInfo.loading) || (alarmsNotificationInfo && alarmsNotificationInfo.loading))) ? (
                      <Loader />
                    )
                      : (
                        <>
                          <Row>
                            <Col md="7" xs="12" sm="7" lg="7" className="p-1">
                              <img src={actions.model_name && defaultIcon[actions.model_name] ? defaultIcon[actions.model_name] : infoGreen} alt="notification" className="mr-2" height="14" />
                              <Tooltip title={actions.name}>
                                <span className="font-weight-800">{truncate(actions.name, 35)}</span>
                              </Tooltip>
                            </Col>
                            <Col md="5" xs="12" sm="5" lg="5" className="text-right p-0">
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
                            {(viewId !== actions.id) && (actions.description && actions.description.length > 70) && (
                            <Col md="12" xs="12" sm="12" lg="12" className="pt-1 ml-2 cursor-pointer" onClick={() => setViewId(actions.id)}>
                              <p className="font-weight-400">{truncate(actions.description, 70)}</p>
                            </Col>
                            )}
                            {((viewId === actions.id) || (actions.description && actions.description.length < 70)) && (
                            <Col md="12" xs="12" sm="12" lg="12" className="pt-1 ml-2">
                              <p className="font-weight-400">{actions.description}</p>
                            </Col>
                            )}
                          </Row>
                          <Row>
                            <Col md="12" xs="12" sm="12" lg="12" className="ml-1">
                              {getActions(actions.alarm_state, actions.mro_alarm_id ? actions.mro_alarm_id[0] : actions.id, actions.id)}
                            </Col>
                          </Row>
                        </>
                      )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          ))}
          {alarmsNotificationInfo && alarmsNotificationInfo.loading && (
          <div className="mb-2 mt-3 p-5" data-testid="loading-case">
            <Loader />
          </div>
          )}
          {alarmsNotificationInfo && alarmsNotificationInfo.err && (
          <ErrorContent errorTxt={generateErrorMessage(alarmsNotificationInfo)} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default Alarms;
