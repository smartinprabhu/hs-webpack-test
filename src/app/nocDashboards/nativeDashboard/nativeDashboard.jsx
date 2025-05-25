/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import moment from 'moment-timezone';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import './nativeDashboard.scss';
import Barchart from './barChart';
import PieChart from './pieChart';
import ListView from './listView';
import Tile from './insights';

import {
  getNativeDashboard,
} from '../../analytics/analytics.service';
import {
  generateErrorMessage,
} from '../../util/appUtils';
import { getDatesOfQuery } from '../../analytics/utils/utils';

const { RangePicker } = DatePicker;

const nativeDashboards = (props) => {
  const {
    dashboardId,
  } = props;

  const dispatch = useDispatch();
  const datesList = getDatesOfQuery('This month');
  const [selectedDate, handleDateChange] = useState(datesList);

  const { userInfo } = useSelector((state) => state.user);
  const { nativeDashboard } = useSelector((state) => state.analytics);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate.length && selectedDate[0] && selectedDate[0] !== null) {
        const start = `${moment(selectedDate[0]).utc().format('YYYY-MM-DD')} 23:59:59`;
        const end = `${moment(selectedDate[1]).utc().format('YYYY-MM-DD')} 23:59:59`;
        dispatch(getNativeDashboard(start, end, dashboardId));
      }
    }
  }, [selectedDate, dashboardId]);

  // eslint-disable-next-line no-unused-vars
  const onDateRangeChange = (dates, datesString) => {
    handleDateChange(dates);
  };

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (nativeDashboard && nativeDashboard.err) ? generateErrorMessage(nativeDashboard) : userErrorMsg;

  return (
    <>
      <Row>
        <>
          <Col sm="12" md="12" lg="12" xs="12">
            <span className="date-btn-group float-right">
              <RangePicker
                onChange={onDateRangeChange}
                value={selectedDate}
                format="DD-MM-y"
                size="small"
                className="mt-n2px"
              />
            </span>
          </Col>
        </>
      </Row>
      <br />
      <Row>
        <Tile />
      </Row>
      <Row>
        {nativeDashboard && nativeDashboard.data && nativeDashboard.data.length > 0 && nativeDashboard.data.map((item) => (
          <>
            {item.ks_dashboard_item_type === 'ks_bar_chart' && (
              <Col sm="12" md="12" lg="6" xs="12">
                <Barchart chartData={item} />
              </Col>
            )}
            {item.ks_dashboard_item_type === 'ks_pie_chart' && (
            <Col sm="12" md="12" lg="6" xs="12">
              <PieChart chartData={item} />
            </Col>
            )}
            {item.ks_dashboard_item_type === 'ks_list_view' && (
            <Col sm="12" md="12" lg="12" xs="12">
              <ListView chartData={item} />
            </Col>
            )}
          </>
        ))}
      </Row>
      {((nativeDashboard && nativeDashboard.loading) || (isUserLoading)) && (
        <div className="mb-4 mt-2">
          <Loader />
        </div>
      )}
      {((nativeDashboard && nativeDashboard.err) || (isUserError)) && (
        <ErrorContent errorTxt={errorMsg} />
      )}
    </>
  );
};

nativeDashboards.propTypes = {
  dashboardId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default nativeDashboards;
