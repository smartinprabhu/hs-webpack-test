/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import ErrorContent from '@shared/errorContent';
import VisitorLocation from '@images/icons/analyticsBlue.svg';
import Loader from '@shared/loading';
import './nativeDashboard.scss';
import { getDatasets } from '../utils/utils';
import { generateErrorMessage } from '../../util/appUtils';
import chartOptions from './data/serviceCharts.json';

const PieChart = React.memo((props) => {
  const { chartData } = props;
  const { userInfo } = useSelector((state) => state.user);
  const { nativeDashboard } = useSelector((state) => state.analytics);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (nativeDashboard && nativeDashboard.err) ? generateErrorMessage(nativeDashboard) : userErrorMsg;

  return (
    <Card className="pl-4 border-0 h-100">
      <CardTitle className="mb-0">
        <h6>
          <img src={VisitorLocation} className="mr-2" alt="assets downtime" height="20" width="20" />
          {chartData.name}
        </h6>
      </CardTitle>
      <CardBody>
        {((nativeDashboard && nativeDashboard.loading) || isUserLoading) && (
          <div className="mb-2 mt-4">
            <Loader />
          </div>
        )}
        {((nativeDashboard && nativeDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg} />
        )}
        {chartData.datasets && chartData.datasets.length > 0 && chartData.labels.length > 0 ? (
          <Pie
            key={chartData.name}
            options={chartOptions.options}
            data={getDatasets(chartData.datasets, chartData.labels)}
          />
        )
          : (
            <ErrorContent errorTxt="No data here." />
          )}
      </CardBody>
    </Card>
  );
});

PieChart.propTypes = {
  chartData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.objectOf(PropTypes.object),
  ]).isRequired,
};
export default PieChart;
