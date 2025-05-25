/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Col,
  CardBody,
  CardTitle,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import { getSpaceTicketStates } from '../equipmentService';
import { getTicketStateValue } from '../utils/utils';
import { generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const Insights = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const { assetsTicketGroups } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (id) {
      dispatch(getSpaceTicketStates(id, appModels.HELPDESK));
    }
  }, [id]);

  const ticketData = (assetsTicketGroups && assetsTicketGroups.data) ? assetsTicketGroups.data : [];

  const barData = {
    labels: ['Open', 'Progress', 'Closed'],
    datasets: [
      {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        borderWidth: 1,
        hoverBackgroundColor: '#007bff',
        hoverBorderColor: '#007bff',
        data: [getTicketStateValue(ticketData, 'open', 'count'), getTicketStateValue(ticketData, 'progress', 'count'), getTicketStateValue(ticketData, 'done', 'count')],
      },
    ],
  };

  const options = {
    legend: false,
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
      }],
    },
  };

  let result;

  if (assetsTicketGroups && assetsTicketGroups.loading) {
    result = (
      <Loader />
    );
  } else if (assetsTicketGroups && assetsTicketGroups.err) {
    result = (
      <ErrorContent errorTxt={generateErrorMessage(assetsTicketGroups)} />
    );
  } else {
    result = (
      <Bar data={barData} options={options} />
    );
  }

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12">
          <div className="p-2">
            <CardTitle className="m-0">
              <h5 className="p-0">
                Tickets By State
              </h5>
            </CardTitle>
            <CardBody className="p-2">
              {result}
            </CardBody>
          </div>
        </Col>
      </Row>
    </>
  );
};

Insights.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default Insights;
