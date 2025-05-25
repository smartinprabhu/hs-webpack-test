import React, { useEffect, useMemo, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import FiterChart from './filterChart';

import {
  generateErrorMessage,
  isJsonString,
  getJsonString,
} from '../util/appUtils';
import {
  getExtraSelectionMultiple,
} from '../helpdesk/ticketService';

import { getDcDashboard } from '../analytics/analytics.service';

const Dashboard = ({ uuid, dashboardCode }) => {
  const sampleData = [
    { category: 'A', value: 10 },
    { category: 'B', value: 20 },
    { category: 'C', value: 30 },
    { category: 'D', value: 40 },
    // Add more data points as needed
  ];

  const [dashboardData, setDashboardData] = useState([]);
  const [isCalled, setIsCalled] = useState(false);

  const dispatch = useDispatch();
  const { dcDashboardInfo } = useSelector((state) => state.analytics);

  const {
    listDataMultipleInfo,
  } = useSelector((state) => state.ticket);

  useMemo(() => {
    if (uuid && dashboardCode) {
      dispatch(
        getDcDashboard(dashboardCode, uuid),
      );
      setIsCalled(Math.random());
    }
  }, [uuid]);

  useMemo(() => {
    if (isCalled && dcDashboardInfo && dcDashboardInfo.data && dcDashboardInfo.data.length && uuid) {
      if (dcDashboardInfo.data[0].configuration && isJsonString(dcDashboardInfo.data[0].configuration) && getJsonString(dcDashboardInfo.data[0].configuration) && getJsonString(dcDashboardInfo.data[0].configuration).data) {
        const dataSource = getJsonString(dcDashboardInfo.data[0].configuration).data;
        dispatch(
          getExtraSelectionMultiple(
            false,
            dataSource.model,
            dataSource.limit,
            0,
            dataSource.fields,
            dataSource.domain,
            false,
            false,
            'isIot',
            uuid,
          ),
        );
      }
    }
  }, [isCalled, dcDashboardInfo]);

  useEffect(() => {
    if (dcDashboardInfo && dcDashboardInfo.data && dcDashboardInfo.data.length && !listDataMultipleInfo.loading && listDataMultipleInfo && listDataMultipleInfo.data) {
      setDashboardData(listDataMultipleInfo.data);
    }
  }, [listDataMultipleInfo]);

  function getSetupData(config) {
    let res = [];
    if (config && isJsonString(config) && getJsonString(config) && getJsonString(config).charts) {
      res = getJsonString(config).charts;
    }
    return res;
  }

  return (
    <div className="insights-box">
      <div id="dynamic-dashboard">
        <div className="header-box2">
          <div className="insights-filter-box">
            <div className="commongrid-header-text">
              {' '}
              Analytics Dashboard
            </div>
          </div>
          <div className="insights-filter-box" id="action-buttons" />
        </div>
        <div>
          {listDataMultipleInfo && !listDataMultipleInfo.loading && listDataMultipleInfo.data && !dcDashboardInfo.loading && dcDashboardInfo && dcDashboardInfo.data && (
          <FiterChart datas={dashboardData} setupData={getSetupData(dcDashboardInfo.data[0].configuration)} />
          )}
          {dcDashboardInfo && dcDashboardInfo.err && (
            <ErrorContent errorTxt={generateErrorMessage(dcDashboardInfo)} />
          )}
          {listDataMultipleInfo && listDataMultipleInfo.err && (
            <ErrorContent errorTxt={generateErrorMessage(listDataMultipleInfo)} />
          )}
          {!(uuid && dashboardCode) && (
          <ErrorContent errorTxt="No Data Found." />
          )}
          {((dcDashboardInfo && dcDashboardInfo.loading) || (listDataMultipleInfo && listDataMultipleInfo.loading)) && (
          <div className="mb-3 mt-3 text-center">
            <Loader />
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
