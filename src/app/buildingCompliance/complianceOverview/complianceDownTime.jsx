/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import clockBlueIcon from '@images/icons/clockBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import './complianceOverview.scss';
import { getDatasets } from '../utils/utils';
import { generateErrorMessage, generateArrayFromValue } from '../../util/appUtils';
import chartOptions from './data/complianceCharts.json';

const ComplianceDownTime = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { complianceDashboard } = useSelector((state) => state.compliance);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (complianceDashboard && complianceDashboard.err) ? generateErrorMessage(complianceDashboard) : userErrorMsg;
  const complianceCategory = generateArrayFromValue(complianceDashboard && complianceDashboard.data ? complianceDashboard.data : [], 'code', 'CC');

  return (
    <Card className="p-2 border-0 h-100">
      <CardTitle className="mb-0">
        <h6>
          <img src={clockBlueIcon} className="mr-2" alt="assets downtime" height="20" width="20" />
          COMPLIANCES BY CATEGORY
        </h6>
      </CardTitle>
      <CardBody className="pt-2">
        {((complianceDashboard && complianceDashboard.loading) || isUserLoading) && (
          <div className="mb-2 mt-4">
            <Loader />
          </div>
        )}
        {((complianceDashboard && complianceDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg} />
        )}
        {complianceCategory && complianceCategory.map((actions) => (
          actions.datasets && actions.datasets.length > 0 && actions.labels && actions.labels.length > 0 ? (
            <Bar
              key={actions.name}
              data={getDatasets(actions.datasets, actions.labels)}
              options={chartOptions.options}
            />
          )
            : (
              <ErrorContent errorTxt="No data found." />
            )
        ))}
      </CardBody>
    </Card>
  );
};
export default ComplianceDownTime;
