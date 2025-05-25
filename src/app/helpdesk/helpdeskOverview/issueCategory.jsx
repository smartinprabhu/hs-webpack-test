/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
/* eslint new-cap: ["error", { "newIsCap": false }] */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import moment from 'moment-timezone';

import barchartBlueIcon from '@images/icons/barchartBlue.svg';
import ticketBlue from '@images/icons/ticketBlue.svg';
import './helpdeskOverview.scss';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getHelpdeskFilter,
} from '../ticketService';
import {
  generateErrorMessage,
  getDashboardDataStructureTicket,
  generateArrayFromValue,
} from '../../util/appUtils';
import chartOptions from './data/barCharts.json';
import { getDatasets } from '../../visitorManagement/utils/utils';

const IssueCategory = (props) => {
  const { isIncident, selectedDate, currentTab } = props;
  const dispatch = useDispatch();
  const [values, setValue] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    helpdeskDashboard,
  } = useSelector((state) => state.ticket);

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (helpdeskDashboard && helpdeskDashboard.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (helpdeskDashboard && helpdeskDashboard.err) ? generateErrorMessage(helpdeskDashboard) : userErrorMsg;

  const onLoadTickets = (key, value) => {
    let filters = [{
      key: currentTab, value: currentTab, label: currentTab, type: 'date',
    }];
    if (currentTab === 'Custom' && selectedDate && selectedDate[0] !== null) {
      let dates = [`${moment(selectedDate[0]).utc().format('YYYY-MM-DD')} 18:30:00`, `${moment(selectedDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`];
      if (selectedDate[0] === selectedDate[1]) {
        dates = [`${moment(selectedDate[0]).utc().format('YYYY-MM-DD').sub(1, 'day')} 18:30:00`, `${moment(selectedDate[1]).utc().format('YYYY-MM-DD')} 18:30:00`];
      }
      filters = [{
        key: currentTab,
        value: dates,
        label: `Custom - ${moment(selectedDate[0]).utc().format('DD/MM/YYY')} - ${moment(selectedDate[1]).utc().format('DD/MM/YYY')}`,
        type: 'datearray',
      }];
    }
    const categoryValues = [{ id: key, label: value }];
    setValue(categoryValues);
    const filterValues = {
      states: [], categories: categoryValues, priorities: [], customFilters: filters,
    };
    dispatch(getHelpdeskFilter(filterValues));
  };

  if (values.length > 0 && !isIncident) {
    return (<Redirect to="/helpdesk/tickets" />);
  }

  if (values.length > 0 && isIncident) {
    return (<Redirect to="/incident/incidents" />);
  }

  const dashboardData = getDashboardDataStructureTicket(helpdeskDashboard, 'T5CHT');

  const incidentStates = generateArrayFromValue(helpdeskDashboard && helpdeskDashboard.data ? helpdeskDashboard.data : [], 'code', 'IST');

  const isCodeData = helpdeskDashboard && helpdeskDashboard.data ? helpdeskDashboard.data.filter((item) => item.code === 'ASSR') : false;
  const isCodeExists = !!(isCodeData && isCodeData.length);

  return (
    <Card className={`p-2 ${isCodeExists ? 'border-left-0 border-top-0 border-bottom-0' : 'border-0'} h-100`}>
      <CardTitle>
        <h6>
          <img src={barchartBlueIcon} className="mr-2" width="20" height="20" alt="issuecategory" />
          {isIncident ? 'INCIDENT BY STATE' : 'TOP 5 ISSUE CATEGORY'}
        </h6>
      </CardTitle>
      <CardBody className="pt-1">
        {loading && (
          <div className="mb-2 mt-3 p-5" data-testid="loading-case">
            <Loader />
          </div>
        )}
        {((helpdeskDashboard && helpdeskDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        {(!isIncident && dashboardData && !dashboardData.length && (!loading)) && (
          <ErrorContent errorTxt="No text" />
        )}
        {(isIncident && incidentStates && !incidentStates.length && (!loading)) && (
          <ErrorContent errorTxt="No text" />
        )}
        {!isIncident && dashboardData && dashboardData.length > 0 && dashboardData.map((actions, index) => (
          <React.Fragment key={index}>
            <Row
              className="p-0 mb-2 cursor-pointer"
              onClick={() => onLoadTickets(actions.id, actions.label)}
            >
              {isCodeExists && (
                <>
                  <Col md="1" xs="1" sm="1" lg="1" className="p-0 text-left">
                    <span className="font-weight-bold font-medium">
                      {index + 1}
                      .
                    </span>
                  </Col>
                  <Col lg="6" md="6" xs="6" sm="6" className="p-1 text-left bg-med-blue">
                    {actions.label}
                  </Col>
                  <Col lg="5" md="5" xs="5" sm="5" className="p-1 text-right  bg-med-blue">
                    <img src={ticketBlue} className="mr-2" alt="issuecategory" height="13" />
                    <span className="text-lightblue font-weight-bold">
                      {actions.value}
                      {' '}
                      %
                    </span>
                  </Col>
                </>
              )}
              {!isCodeExists && (
                <>
                  <Col lg="6" xs="8" sm="8" md="6" className="p-1 text-left bg-med-blue">
                    <span className="font-weight-bold font-medium mr-2">
                      {index + 1}
                      .
                    </span>
                    {actions.label}
                  </Col>
                  <Col lg="6" xs="3" sm="3" md="6" className="p-1 text-right bg-med-blue">
                    <Row>
                      <Col lg="8" xs="12" sm="12" md="8" />
                      <Col lg="1" xs="12" sm="12" md="1">
                        <img src={ticketBlue} width="20" height="20" alt={actions.value} />
                      </Col>
                      <Col lg="3" xs="12" sm="12" md="3" className="text-left p-1">
                        {actions.value}
                        <span className="ml-1">
                          %
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </>
              )}
            </Row>
          </React.Fragment>
        ))}
        {isIncident && incidentStates && incidentStates.map((actions) => (
          actions.datasets && actions.datasets.length > 0 ? (
            <Bar
              key={actions.name}
              data={getDatasets(actions.datasets, actions.labels)}
              options={chartOptions.options}
            />
          )
            : (
              <ErrorContent errorTxt="No text" />
            )
        ))}
      </CardBody>
    </Card>
  );
};

IssueCategory.propTypes = {
  isIncident: PropTypes.bool,
  selectedDate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  currentTab: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};
IssueCategory.defaultProps = {
  isIncident: false,
};

export default IssueCategory;
