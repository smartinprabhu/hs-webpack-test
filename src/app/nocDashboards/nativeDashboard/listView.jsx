/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import VisitorLocation from '@images/icons/analyticsBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import './nativeDashboard.scss';
import { generateErrorMessage } from '../../util/appUtils';

const ListView = (props) => {
  const { chartData } = props;
  const { userInfo } = useSelector((state) => state.user);
  const { nativeDashboard } = useSelector((state) => state.analytics);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (nativeDashboard && nativeDashboard.err) ? generateErrorMessage(nativeDashboard) : userErrorMsg;

  function getTd(value) {
    const tableTd = [];
    if (value && value.length > 0) {
      for (let i = 0; i < value.length; i += 1) {
        tableTd.push(
          <td className="p-2">{value[i]}</td>,
        );
      }
    }
    return tableTd;
  }

  function getRow(datasets) {
    const tableTr = [];
    if (datasets && datasets.length > 0) {
      for (let i = 0; i < datasets.length; i += 1) {
        const value = datasets[i].data;
        tableTr.push(
          <tr key={i}>
            {getTd(value)}
          </tr>,
        );
      }
    }
    return tableTr;
  }

  function getHead(labels) {
    const tableTr = [];
    const value = labels && labels.length > 0 ? labels[0] : [];
    if (value.length > 0) {
      for (let i = 0; i < value.length; i += 1) {
        tableTr.push(
          <th key={value[i]} className="p-2 min-width-200">{value[i]}</th>,
        );
      }
    }
    return tableTr;
  }

  return (
    <Card className="pl-4 border-0 h-100">
      <CardTitle className="mb-0">
        <h6>
          <img src={VisitorLocation} className="mr-2" alt="assets downtime" height="20" width="20" />
          {chartData.name}
        </h6>
      </CardTitle>
      <CardBody className="pt-2">
        {((nativeDashboard && nativeDashboard.loading) || isUserLoading) && (
          <div className="mb-2 mt-4">
            <Loader />
          </div>
        )}
        {((nativeDashboard && nativeDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg} />
        )}
        {chartData.datasets && chartData.datasets.length > 0 ? (
          <div>
            <Table responsive className="mb-0 font-weight-400 border-0" width="100%">
              <thead>
                <tr>
                  {getHead(chartData.labels)}
                </tr>
              </thead>
              <tbody>
                {getRow(chartData.datasets)}
              </tbody>
            </Table>
          </div>
        )
          : (
            <ErrorContent errorTxt="No data found." />
          )}
      </CardBody>
    </Card>
  );
};

ListView.propTypes = {
  chartData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.objectOf(PropTypes.object),
  ]).isRequired,
};
export default ListView;
