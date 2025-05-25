/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Card,
  CardBody,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Radio, Skeleton } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';

import ErrorContent from '@shared/errorContent';
import {
  getAlarmsGroup,
} from '../dashboard/dashboardService';

import customData from '../dashboard/data/customData.json';
import {
  getDatesOfQuery,
  getCompanyTimezoneDate,
  detectMob,
  translateText,
} from '../util/appUtils';
import BarChart from './arrayDataComponents/barChart';

const GroupCharts = () => {
  const dispatch = useDispatch();
  const isMob = detectMob();

  const [activeField, setActiveField] = useState(false);
  const [dateField, setDateField] = useState(false);
  const [barValues, setBarValues] = useState([]);
  const [lineValues, setLineValues] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    alarmsGroups,
  } = useSelector((state) => state.config);

  function getPrName(probj) {
    let pr = translateText('High', userInfo);
    if (probj.low) {
      pr = translateText('Low', userInfo);
    } else if (probj.medium) {
      pr = translateText('Medium', userInfo);
    } else if (probj.high) {
      pr = translateText('High', userInfo);
    }
    return pr;
  }

  function getPrCount(name, probj) {
    let pr = 0;
    if (name === translateText('High', userInfo)) {
      pr = probj.high;
    } else if (name === translateText('Low', userInfo)) {
      pr = probj.low;
    } else if (name === translateText('Medium', userInfo)) {
      pr = probj.medium;
    }
    return pr;
  }

  useEffect(() => {
    if (alarmsGroups && alarmsGroups.data) {
      const newArrData = alarmsGroups.data.map((cl) => ({
        date: getCompanyTimezoneDate(cl.date, userInfo, dateField === 'Today' ? 'datetime' : 'date'),
        company: cl.company_id && cl.company_id.id ? cl.company_id.name : '',
        count: cl.count,
        priority: cl.company_id && cl.company_id.priority ? getPrName(cl.company_id.priority) : translateText('High', userInfo),
        prioritycount: cl.company_id && cl.company_id.priority ? getPrCount(getPrName(cl.company_id.priority), cl.company_id.priority) : 0,
      }));
      if (activeField === 'company') {
        setBarValues(newArrData);
      } else if (activeField === 'priority') {
        setLineValues(newArrData);
      } else {
        setBarValues(newArrData);
        setLineValues(newArrData);
      }
    }
  }, [alarmsGroups]);

  useEffect(() => {
    const label = 'Last 7 days';
    const dates = getDatesOfQuery(label);
    if (dates.length > 0) {
      const start = `${moment(dates[0]).format('YYYY-MM-DD')} 18:30:00`;
      const end = `${moment(dates[1]).format('YYYY-MM-DD')} 18:30:00`;
      dispatch(getAlarmsGroup(start, end));
    }
  }, []);

  const handleCheckboxCompanyChange = (event) => {
    const { checked, value } = event.target;
    if (checked && value) {
      setActiveField('company');
      setDateField(value);
      const dates = getDatesOfQuery(value);
      if (dates.length > 0) {
        const start = `${moment(dates[0]).format('YYYY-MM-DD')} 18:30:00`;
        const end = `${moment(dates[1]).format('YYYY-MM-DD')} 18:30:00`;
        dispatch(getAlarmsGroup(start, end));
      }
    }
  };

  const handleCheckboxPriorityChange = (event) => {
    const { checked, value } = event.target;
    if (checked && value) {
      setActiveField('priority');
      setDateField(value);
      const dates = getDatesOfQuery(value);
      if (dates.length > 0) {
        const start = `${moment(dates[0]).format('YYYY-MM-DD')} 18:30:00`;
        const end = `${moment(dates[1]).format('YYYY-MM-DD')} 18:30:00`;
        dispatch(getAlarmsGroup(start, end));
      }
    }
  };

  const loading = (alarmsGroups && alarmsGroups.loading);

  return (
    <>
      { /* <Row className={isMob ? 'm-0 pt-0 pb-0' : 'pl-2 pr-2 pb-2'}>
        <Col sm="12" md="6" xs="12" lg="6" className={isMob ? 'mb-2' : 'pr-1'}>
          <Card className="h-100 box-shadow-grey">
            <h6 className="pl-3 pr-3 pt-3">
              <FontAwesomeIcon className="mr-2" size="lg" icon={faBell} />
              {translateText('Alarms By Sites', userInfo)}
              {!isMob && (
              <span className="float-right">
                <Radio.Group defaultValue="Last 7 days" size="small" onChange={(e) => handleCheckboxCompanyChange(e)}>
                  {customData.dateFiltersSh.map((cl) => (
                    <Radio.Button value={cl.label}>{translateText(cl.label, userInfo)}</Radio.Button>
                  ))}
                </Radio.Group>
              </span>
              )}
              {isMob && (
              <p className="text-center mt-3 mb-0">
                <Radio.Group defaultValue="Last 7 days" size="small" onChange={(e) => handleCheckboxCompanyChange(e)}>
                  {customData.dateFiltersSh.map((cl) => (
                    <Radio.Button value={cl.label}>{translateText(cl.label, userInfo)}</Radio.Button>
                  ))}
                </Radio.Group>
              </p>
              )}
            </h6>
            <CardBody>
              {loading && (activeField === 'company' || !activeField) && (
              <Loader />
              )}
              <BarChart barData={barValues} xField="date" yField="count" seriesField="company" />
            </CardBody>
          </Card>
              </Col> */ }
      <Col sm="12" md="6" xs="12" lg="6" className={isMob ? 'mb-2' : 'pl-1 pr-1'}>
        <Card className="h-100 box-shadow-grey">
          <h6 className="pl-3 pr-3 pt-3">
            <FontAwesomeIcon className="mr-2" size="lg" icon={faBell} />
            {translateText('Alarms By Priority', userInfo)}
            {!isMob && (
              <span className="float-right">
                <Radio.Group defaultValue="Last 7 days" size="small" onChange={(e) => handleCheckboxPriorityChange(e)}>
                  {customData.dateFiltersSh.map((cl) => (
                    <Radio.Button value={cl.label}>{translateText(cl.label, userInfo)}</Radio.Button>
                  ))}
                </Radio.Group>
              </span>
            )}
            {isMob && (
              <p className="text-center mt-3 mb-0">
                <Radio.Group defaultValue="Last 7 days" size="small" onChange={(e) => handleCheckboxPriorityChange(e)}>
                  {customData.dateFiltersSh.map((cl) => (
                    <Radio.Button value={cl.label}>{translateText(cl.label, userInfo)}</Radio.Button>
                  ))}
                </Radio.Group>
              </p>
            )}
          </h6>
          <CardBody>
            {loading && (activeField === 'priority' || !activeField) && (
            <Skeleton
              active
              size="large"
              paragraph={{
                rows: 7,
              }}
            />
            )}
            {!loading && (
            <BarChart
              barData={lineValues}
              xField="date"
              yField="prioritycount"
              seriesField="priority"
              colorField="priority"
              colors={['#ff9933', '#ffff80', '#ff3333']}
            />
            )}
          </CardBody>
        </Card>
      </Col>
      { /* </Row> */ }

      {(alarmsGroups && alarmsGroups.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt="No Data" />
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default GroupCharts;
