/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { Pie } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import BarchartBlue from '@images/icons/barchartBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import './overview.scss';
import { getChartDatasets } from './utils/utils';
import { generateErrorMessage, generateArrayFromValue } from '../../util/appUtils';
import chartOptions from './data/serviceCharts.json';

const ProductsByStatus = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { inventoryDashboard } = useSelector((state) => state.inventory);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (inventoryDashboard && inventoryDashboard.err) ? generateErrorMessage(inventoryDashboard) : userErrorMsg;
  const productStatus = generateArrayFromValue(inventoryDashboard && inventoryDashboard.data ? inventoryDashboard.data : [], 'code', 'PBS');

  return (
    <Card className="p-2 border-0 h-100">
      <CardTitle className="mb-0">
        <h6>
          <img src={BarchartBlue} className="mr-2" alt="assets downtime" height="20" width="20" />
          PRODUCTS BY STATUS
        </h6>
      </CardTitle>
      <CardBody className="pt-2">
        {((inventoryDashboard && inventoryDashboard.loading) || isUserLoading) && (
          <div className="mb-2 mt-4">
            <Loader />
          </div>
        )}
        {((inventoryDashboard && inventoryDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        {productStatus && productStatus.map((actions) => (
          actions.datasets && actions.datasets.length > 0 && actions.labels && actions.labels.length > 0 ? (
            <div>
              <Pie
                key={actions.name}
                data={getChartDatasets(actions.datasets, actions.labels)}
                options={chartOptions.options}
                width={400}
                height={400}
              />
            </div>
          )
            : (
              <ErrorContent errorTxt="No text" />
            )
        ))}
      </CardBody>
    </Card>
  );
};
export default ProductsByStatus;
