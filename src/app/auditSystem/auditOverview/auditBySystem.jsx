/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import VisitorLocation from '@images/icons/barchartBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import './visitorOverview.scss';
import { getDatasets } from '../utils/utils';
import { generateErrorMessage, generateArrayFromValue } from '../../util/appUtils';
import chartOptions from './data/barCharts.json';

const AuditByStatus = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { auditDashboard } = useSelector((state) => state.audit);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (auditDashboard && auditDashboard.err) ? generateErrorMessage(auditDashboard) : userErrorMsg;
  const visitorCompany = generateArrayFromValue(auditDashboard && auditDashboard.data ? auditDashboard.data : [], 'name', 'Audit By System');

  return (
    <Card className="p-2 border-left-0 border-top-0 audit-by-system border-bottom-0 h-100">
      <CardTitle className="mb-0">
        <h6>
          <img src={VisitorLocation} className="mr-2" alt="assets downtime" height="20" width="20" />
          AUDIT BY SYSTEM
        </h6>
      </CardTitle>
      <CardBody className="pt-2">
        {((auditDashboard && auditDashboard.loading) || isUserLoading) && (
          <div className="mb-2 mt-4">
            <Loader />
          </div>
        )}
        {((auditDashboard && auditDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        {visitorCompany && visitorCompany.map((actions) => (
          actions.datasets && actions.datasets.length > 0 && actions.labels && actions.labels.length > 0 ? (
            <div>
              <Bar
                key={actions.name}
                data={getDatasets(actions.datasets, actions.labels)}
                options={chartOptions.options}
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
export default AuditByStatus;
