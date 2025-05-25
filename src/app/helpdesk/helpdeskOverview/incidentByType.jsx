/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import clockBlueIcon from '@images/icons/clockBlue.svg';
import './helpdeskOverview.scss';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateArrayFromValue,
} from '../../util/appUtils';
import chartOptions from './data/barCharts.json';
import { getChartDatasets } from '../../visitorManagement/utils/utils';

const IncidentByType = (props) => {
  const { isIncident } = props;
  const { userInfo } = useSelector((state) => state.user);
  const { helpdeskDashboard } = useSelector((state) => state.ticket);

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (helpdeskDashboard && helpdeskDashboard.loading);

  /* const getTicketCount = (dataset) => {
    const tCount = dataset.reduce((a, b) => a + b, 0);
    return tCount;
  }; */

  const incidentTypes = generateArrayFromValue(helpdeskDashboard && helpdeskDashboard.data ? helpdeskDashboard.data : [], 'code', 'ICT');

  return (
    <>
      <Card className="p-2 border-0 h-100">
        <CardTitle>
          <h6>
            <img src={clockBlueIcon} className="mr-2" width="20" height="20" alt="serviceresponse" />
            {isIncident ? 'INCIDENT BY TYPE' : 'AVERAGE SERVICE RESPONSE RATE'}
          </h6>
        </CardTitle>
        <CardBody className="p-0">
          <Row>
            <Col md="12" sm="12" xs="12" lg="12">
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
    </>
  );
};

IncidentByType.propTypes = {
  isIncident: PropTypes.bool,
};
IncidentByType.defaultProps = {
  isIncident: false,
};

export default IncidentByType;
