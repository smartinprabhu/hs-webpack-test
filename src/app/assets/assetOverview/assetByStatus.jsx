/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import ClockBlue from '@images/icons/clockBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import '../../visitorManagement/visitorOverview/visitorOverview.scss';
import { getChartDatasets } from '../../visitorManagement/utils/utils';
import { generateErrorMessage, generateArrayFromValue } from '../../util/appUtils';
import chartOptions from '../../visitorManagement/visitorOverview/data/serviceCharts.json';

const AssetsByStatus = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { assetDashboard } = useSelector((state) => state.equipment);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (assetDashboard && assetDashboard.err) ? generateErrorMessage(assetDashboard) : userErrorMsg;
  const assetStatus = generateArrayFromValue(assetDashboard && assetDashboard.data ? assetDashboard.data : [], 'code', 'SOE');

  return (
    <Card className="p-2 border-right-0 border-top-0 border-bottom-0 h-100">
      <CardTitle className="mb-0">
        <h6>
          <img src={ClockBlue} className="mr-2" alt="assets downtime" height="20" width="20" />
          STATUS OF EQUIPMENT
        </h6>
      </CardTitle>
      <CardBody className="pt-2">
        {((assetDashboard && assetDashboard.loading) || isUserLoading) && (
          <div className="mb-2 mt-4">
            <Loader />
          </div>
        )}
        {((assetDashboard && assetDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        {assetStatus && assetStatus.map((actions) => (
          actions.datasets && actions.datasets.length > 0 && actions.labels && actions.labels.length > 0 ? (
            <Pie
              key={actions.name}
              data={getChartDatasets(actions.datasets, actions.labels)}
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
export default AssetsByStatus;
