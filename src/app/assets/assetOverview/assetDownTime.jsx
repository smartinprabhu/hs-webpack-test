/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { HorizontalBar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import clockBlueIcon from '@images/icons/assetDownTime.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import './assetOverview.scss';
import { getDatasets } from '../utils/utils';
import { generateErrorMessage, generateArrayFromValue } from '../../util/appUtils';
import chartOptions from './data/assetCharts.json';

const AssetDownTime = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { assetDashboard } = useSelector((state) => state.equipment);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (assetDashboard && assetDashboard.err) ? generateErrorMessage(assetDashboard) : userErrorMsg;
  const assetDownTimeData = generateArrayFromValue(assetDashboard && assetDashboard.data ? assetDashboard.data : [], 'code', 'ADT');

  return (
    <Card className="p-2 border-0 h-100">
      <CardTitle className="mb-0">
        <h6>
          <img src={clockBlueIcon} className="mr-2" alt="assets downtime" height="20" width="20" />
          ASSET DOWN TIME
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
        {assetDownTimeData && assetDownTimeData.map((actions) => (
          actions.datasets && actions.datasets.length > 0 ? (
            <HorizontalBar
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
export default AssetDownTime;
