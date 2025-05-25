/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Tooltip } from 'antd';
import moment from 'moment-timezone';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';

import complianceCheck from '@images/icons/complianceCheck.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { storeDateFilters } from '../../visitorManagement/visitorManagementService';
import { getTotal } from '../utils/utils';
// import { getDatesOfQuery } from '../../helpdesk/utils/utils';
import {
  newpercalculate,
} from '../../util/staticFunctions';
import './complianceOverview.scss';
import {
  getTrackerDashboard, getTrackerFilters,
} from '../breakdownService';
import {
  truncate, generateErrorMessage, generateArrayFromValue, getDatesOfQueryWithUtc, defaultTimeZone,
} from '../../util/appUtils';

import complianceData from '../data/customData.json';

const Insights = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { trackerDashboard } = useSelector((state) => state.breakdowntracker);
  const [currentTab] = useState('This month');
  const [values, setValue] = useState([]);
  const selectedDate = [null, null];

  const [prefix] = useState('Go to ');

  useEffect(() => {
    dispatch(storeDateFilters([null, null]));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && currentTab && currentTab !== 'Custom') {
      const companyTimeZone = userInfo && userInfo.data.company && userInfo.data.company.timezone ? userInfo.data.company.timezone : defaultTimeZone;

      const dates = getDatesOfQueryWithUtc(currentTab, companyTimeZone);
      if (dates.length > 0) {
        const start = dates[0];
        const end = dates[1];
        dispatch(getTrackerDashboard(start, end));
      } else {
        const monthDates = getDatesOfQueryWithUtc('This month', companyTimeZone);
        const start = monthDates[0];
        const end = monthDates[1];
        dispatch(getTrackerDashboard(start, end));
      }
    }
  }, [userInfo, currentTab]);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        let start = `${moment(selectedDate[0]).utc().format('YYYY-MM-DD')} 18:30:00`;
        let end = `${moment(selectedDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`;
        if (start === end) {
          start = `${moment(selectedDate[0]).subtract(1, 'day').utc().format('YYYY-MM-DD')} 18:30:00`;
          end = `${moment(selectedDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`;
        }
        dispatch(getTrackerDashboard(start, end));
      }
    }
  }, [selectedDate]);

  // eslint-disable-next-line no-unused-vars

  const onLoadTracker = (tags) => {
    if (tags) {
      setValue(tags);
      dispatch(getTrackerFilters(tags));
    }
  };

  const total = getTotal(trackerDashboard && trackerDashboard.data ? trackerDashboard.data : []);

  if (values.length > 0) {
    return (<Redirect to="/breakdown-tracker" />);
  }

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (trackerDashboard && trackerDashboard.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (trackerDashboard && trackerDashboard.err) ? generateErrorMessage(trackerDashboard) : userErrorMsg;

  const gridData = generateArrayFromValue(trackerDashboard && trackerDashboard.data ? trackerDashboard.data : [], 'ks_dashboard_item_type', 'ks_tile');
  const gridCards = gridData.sort((a, b) => a.sequence - b.sequence);

  return (
    <>
      <Row className="m-0 pl-3 pt-2">
        <h6 className="mt-2 ml-2">
          {' '}
          <img src={complianceCheck} alt="compliance" className="mr-2" height="20" width="20" />
          BREAKDOWNTRACKER
        </h6>
      </Row>
      <Row className="m-0 pt-2 pl-3 pr-3 pb-3">
        {
          gridCards && gridCards.map((actions) => (
            actions.ks_dashboard_item_type === 'ks_tile' && (
              <Col sm="12" md="12" lg="3" xs="12" className="p-1" key={actions.name}>
                <Card
                  className="border-0 bg-med-blue h-100 text-center"
                >
                  <CardTitle className="m-0 pt-4">
                    <h6 className="pb-3 font-weight-800">
                      {actions.name}
                    </h6>
                  </CardTitle>
                  <Tooltip title={`${actions.name}(${actions.datasets && actions.datasets[0] ? actions.datasets && actions.datasets[0] : 0})`}>
                    <CardBody id="Tooltip-Insights" className="pb-1 pl-5 pr-5 pt-0">
                      <CircularProgressbarWithChildren
                        value={newpercalculate(total, actions.datasets)}
                        strokeWidth={9}
                        styles={buildStyles({
                          textColor: '#3a4354',
                          backgroundColor: '#c1c1c1',
                          pathColor: '#4d626e',
                        })}
                      >
                        <div className="m-1 font-size-13">
                          <strong>{actions.datasets}</strong>
                        </div>
                        <div className="font-11 text-grayish-blue">
                          <strong>{`${newpercalculate(total, actions.datasets)}%`}</strong>
                        </div>
                      </CircularProgressbarWithChildren>
                    </CardBody>
                  </Tooltip>
                  <CardFooter className="bg-med-blue border-0 pt-0">
                    {actions.datasets && actions.datasets[0] !== 0 && actions.code ? (
                      <Button
                         variant="contained"
                        size="sm"
                        onClick={() => onLoadTracker(complianceData.dashboardStatus[actions.code].tags)}
                        className="bg-white  text-dark rounded-pill  mb-1"
                      >
                        <small className="text-center font-weight-800">
                          {' '}
                          {prefix}
                          {' '}
                          {truncate(actions.name, 10)}
                        </small>
                        <FontAwesomeIcon className="ml-2" size="sm" icon={faArrowRight} />
                      </Button>
                    )
                      : (
                        <Button  variant="contained" size="sm" disabled className="bg-white  text-dark rounded-pill  mb-1">
                          <small className="text-center font-weight-800">
                            {prefix}
                            {' '}
                            {truncate(actions.name, 10)}
                          </small>
                          <FontAwesomeIcon className="ml-2" size="sm" icon={faArrowRight} />
                        </Button>
                      )}
                  </CardFooter>
                </Card>
                <br />
              </Col>
            )
          ))
        }
      </Row>
      {loading && (
        <div className="mb-2 mt-3 p-5" data-testid="loading-case">
          <Loader />
        </div>
      )}
      {((trackerDashboard && trackerDashboard.err) || isUserError) && (
        <ErrorContent errorTxt={errorMsg} />
      )}
      <hr className="ml-3 mr-3 mb-0 mt-2" />
    </>
  );
};
export default Insights;
