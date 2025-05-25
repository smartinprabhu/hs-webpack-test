/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import Response from '@images/icons/barchartBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import '../../survey/surveyOverview/surveyOverview.scss';
import { getDatasets } from '../../survey/utils/utils';
import { generateErrorMessage, generateArrayFromValue } from '../../util/appUtils';
import chartOptions from './data/barCharts.json';

const ByNatureOfWork = React.memo(() => {
  const { userInfo } = useSelector((state) => state.user);
  const { workPermitDashboard } = useSelector((state) => state.workpermit);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (workPermitDashboard && workPermitDashboard.err) ? generateErrorMessage(workPermitDashboard) : userErrorMsg;
  const workData = generateArrayFromValue(workPermitDashboard && workPermitDashboard.data ? workPermitDashboard.data : [], 'code', 'BNW');

  return (
    <Card className="p-2 border-0 h-100">
      <CardTitle className="mb-0">
        <h6>
          <img src={Response} className="mr-2" alt="assets downtime" height="20" width="20" />
          BY NATURE OF WORK
        </h6>
      </CardTitle>
      <CardBody className="pt-2">
        {((workPermitDashboard && workPermitDashboard.loading) || isUserLoading) && (
          <div className="mb-2 mt-4">
            <Loader />
          </div>
        )}
        {((workPermitDashboard && workPermitDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        {workData && workData.map((actions) => (
          actions.datasets && actions.datasets.length > 0 && actions.labels && actions.labels.length > 0 ? (
            <Bar
              key={actions.name}
              height="300"
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
});

export default ByNatureOfWork;
