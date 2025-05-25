/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import ticketBlack from '@images/icons/ticketBlack.svg';
import clockBlueIcon from '@images/icons/clockBlue.svg';
import './helpdeskOverview.scss';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getDatasets } from '../utils/utils';
import { getClassNameBorder, getClassNameText } from '../../workorders/utils/utils';
import ServiceCharts from './data/serviceCharts.json';
import {
  generateErrorMessage,
  getDashboardDataStructure,
  generateArrayFromValue,
} from '../../util/appUtils';
import chartOptions from './data/barCharts.json';
import { getChartDatasets } from '../../visitorManagement/utils/utils';

const ServiceResponse = (props) => {
  const { isIncident } = props;
  const { userInfo } = useSelector((state) => state.user);
  const { helpdeskDashboard } = useSelector((state) => state.ticket);

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (helpdeskDashboard && helpdeskDashboard.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (helpdeskDashboard && helpdeskDashboard.err) ? generateErrorMessage(helpdeskDashboard) : userErrorMsg;

  /* const getTicketCount = (dataset) => {
    const tCount = dataset.reduce((a, b) => a + b, 0);
    return tCount;
  }; */

  const dashboardData = getDashboardDataStructure(helpdeskDashboard, 'ASSR');

  const isCodeData = helpdeskDashboard && helpdeskDashboard.data ? helpdeskDashboard.data.filter((item) => item.code === 'ASSR') : false;
  const isCodeExists = !!(isCodeData && isCodeData.length);

  const incidentTypes = generateArrayFromValue(helpdeskDashboard && helpdeskDashboard.data ? helpdeskDashboard.data : [], 'code', 'ICT');

  return (
    <>
      {isCodeExists && (
      <Card className="p-2 border-0 h-100">
        <CardTitle>
          <h6>
            <img src={clockBlueIcon} className="mr-2" width="20" height="20" alt="serviceresponse" />
            {isIncident ? 'INCIDENT BY TYPE' : 'AVERAGE SERVICE RESPONSE RATE'}
          </h6>
        </CardTitle>
        <CardBody className="p-0">
          <Row className="pb-2 m-0 row-eq-height">
            {
           (!isIncident && helpdeskDashboard && helpdeskDashboard.data) && (dashboardData && dashboardData.length > 0) && helpdeskDashboard.data.map((actions) => (
             actions.code === 'ASSR' && (
               actions.datasets && actions.datasets.length > 0
                 ? (
                   <Col md="6" sm="6" xs="12" lg="3" className="m-4 p-0" key={actions.name}>
                     <div className="imagehead">
                       <div className="icon" />
                       <Doughnut
                         options={ServiceCharts.options}
                         data={getDatasets(actions.datasets, actions.ks_dashboard_item_type)}
                       />
                     </div>
                   </Col>
                 )
                 : ''
             )
           ))
          }

            <Col md="6" sm="6" xs="12" lg="7" className="m-0 p-0">
              {!isIncident && dashboardData && dashboardData.length > 0 && dashboardData.map((sets, index) => (
                <React.Fragment key={sets.label}>
                  <Card className={getClassNameBorder(index)}>
                    <CardBody className="p-1">
                      <span className={getClassNameText(index)}>
                        {sets.value}
                      </span>
                      <span className="float-right">
                        <img src={ticketBlack} className="mr-1" alt="issuecategory" height="12" />
                        <small className="font-weight-bold">
                          {sets.label}
                        </small>
                      </span>
                      <br />
                      <small>{sets.id}</small>
                    </CardBody>
                  </Card>
                </React.Fragment>
              ))}
            </Col>
          </Row>
          <Row>
            <Col md="12" sm="12" xs="12" lg="12">
              {(!isIncident && dashboardData && !dashboardData.length && (!loading)) && (
              <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
              )}
              {(isIncident && incidentTypes && !incidentTypes.length && (!loading)) && (
              <ErrorContent errorTxt="No Data" />
              )}
              {isIncident && incidentTypes && incidentTypes.map((actions) => (
                actions.datasets && actions.datasets.length > 0 ? (
                  <Bar
                    key={actions.name}
                    data={getChartDatasets(actions.datasets, actions.labels)}
                    options={chartOptions.options}
                  />
                )
                  : (
                    <ErrorContent errorTxt="No Data" />
                  )
              ))}
            </Col>
          </Row>
          {loading && (
          <div className="mb-2 mt-3 p-5" data-testid="loading-case">
            <Loader />
          </div>
          )}
          {((helpdeskDashboard && helpdeskDashboard.err) || isUserError) && (
          <ErrorContent errorTxt="No Data" />
          )}
        </CardBody>
      </Card>
      )}
    </>
  );
};

ServiceResponse.propTypes = {
  isIncident: PropTypes.bool,
};
ServiceResponse.defaultProps = {
  isIncident: false,
};

export default ServiceResponse;
