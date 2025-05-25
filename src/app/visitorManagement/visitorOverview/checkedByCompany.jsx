/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import VisitorLocation from '@images/icons/visitorCompany.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import './visitorOverview.scss';
import { getChartDatasets } from '../utils/utils';
import { generateErrorMessage, generateArrayFromValue } from '../../util/appUtils';
import chartOptions from './data/serviceCharts.json';

const checkedByCompany = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { visitorDashboard } = useSelector((state) => state.visitorManagement);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (visitorDashboard && visitorDashboard.err) ? generateErrorMessage(visitorDashboard) : userErrorMsg;
  const visitorCompany = generateArrayFromValue(visitorDashboard && visitorDashboard.data ? visitorDashboard.data : [], 'code', 'CIVBHC');

  return (
    <Card className="p-2 border-0 h-100">
      <CardTitle className="mb-0">
        <h6>
          <img src={VisitorLocation} className="mr-2" alt="assets downtime" height="20" width="20" />
          CHECKED IN VISITORS BY TENANT
        </h6>
      </CardTitle>
      <CardBody className="pt-2">
        {((visitorDashboard && visitorDashboard.loading) || isUserLoading) && (
          <div className="mb-2 mt-4">
            <Loader />
          </div>
        )}
        {((visitorDashboard && visitorDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        {visitorCompany && visitorCompany.map((actions) => (
          actions.datasets && actions.datasets.length > 0 && actions.labels && actions.labels.length > 0 ? (
            <Doughnut
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
export default checkedByCompany;
