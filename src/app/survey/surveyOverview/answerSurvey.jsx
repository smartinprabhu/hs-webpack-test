/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Response from '@images/icons/barchartBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import './surveyOverview.scss';
import { getDatasets } from '../utils/utils';
import { generateErrorMessage, generateArrayFromValue } from '../../util/appUtils';
import chartOptions from './data/barCharts.json';

const AnswerSurvey = React.memo(({ surveyDashboard }) => {
  const { userInfo } = useSelector((state) => state.user);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (surveyDashboard && surveyDashboard.err) ? generateErrorMessage(surveyDashboard) : userErrorMsg;
  const surveyData = generateArrayFromValue(surveyDashboard && surveyDashboard.data ? surveyDashboard.data : [], 'code', 'TRBIS');

  return (
    <Card className="p-2 border-0 h-100">
      <CardTitle className="mb-0">
        <h6>
          <img src={Response} className="mr-2" alt="assets downtime" height="20" width="20" />
          TOTAL RESPONSES BY SURVEY
        </h6>
      </CardTitle>
      <CardBody className="pt-2">
        {((surveyDashboard && surveyDashboard.loading) || isUserLoading) && (
          <div className="mb-2 mt-4">
            <Loader />
          </div>
        )}
        {((surveyDashboard && surveyDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        {surveyData && surveyData.map((actions) => (
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

AnswerSurvey.propTypes = {
  surveyDashboard: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default AnswerSurvey;
