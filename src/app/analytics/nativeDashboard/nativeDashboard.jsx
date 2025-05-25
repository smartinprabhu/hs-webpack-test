/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import moment from 'moment-timezone';
import {
  Button,
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
} from '../analytics.service';
import {
  getFirstDayofMonth, getLastDayofMonth, generateErrorMessage,
} from '../../util/appUtils';
import { getDatesOfQuery } from '../utils/utils';
import dateFilter from './datefilter.json';

const { RangePicker } = DatePicker;

const NativeDashboard = (props) => {
  const {
    dashboardId,
  } = props;

  const dispatch = useDispatch();
  const [currentTab, setActive] = useState('This month');
  const [selectedDate, handleDateChange] = useState([null, null]);
  const [open, setOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const { nativeDashboard } = useSelector((state) => state.analytics);

  useEffect(() => {
    if (userInfo && userInfo.data && currentTab && currentTab !== 'Custom') {
      const dates = getDatesOfQuery(currentTab);
      if (dates.length > 0) {
        const start = `${dates[0]} 23:59:59`;
        const end = `${dates[1]} 23:59:59`;
        dispatch(getNativeDashboard(start, end, dashboardId));
      } else {
        const start = `${getFirstDayofMonth()} 23:59:59`;
        const end = `${getLastDayofMonth()} 23:59:59`;
        dispatch(getNativeDashboard(start, end, dashboardId));
      }
    }
  }, [userInfo, currentTab, dashboardId]);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        const start = `${moment(selectedDate[0]).utc().format('YYYY-MM-DD')} 23:59:59`;
        const end = `${moment(selectedDate[1]).utc().format('YYYY-MM-DD')} 23:59:59`;
        dispatch(getNativeDashboard(start, end, dashboardId));
      }
    }
  }, [selectedDate]);

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
            <span className="date-btn-group text-right">
              {dateFilter && dateFilter.buttonList.map((item) => (
                item.name === 'Custom'
                  ? (
                    <>
                      <Button
                        key={item.id}
                        onClick={() => { setActive(item.name); setOpen(true); handleDateChange(null); }}
                        size="sm"
                        active={currentTab === item.name}
                        className="nav-datafilter pr-2 pl-2 p-0 mr-2 text-grey rounded-pill bg-white mb-1 mobile-btn-full-width"
                      >
                        {item.name}
                      </Button>
                      {open ? (
                        <RangePicker
                          onChange={onDateRangeChange}
                          value={selectedDate}
                          format="DD-MM-y"
                          size="small"
                          className="mt-n2px"
                        />
                      ) : ('')}
                    </>
                  )
                  : (
                    <Button
                      key={item.id}
                      onClick={() => { setActive(item.name); setOpen(false); }}
                      size="sm"
                      active={currentTab === item.name}
                      className="nav-datafilter pr-2 pl-2 p-0 mr-2 text-grey rounded-pill bg-white mb-1 mobile-btn-full-width"
                    >
                      {item.name}
                    </Button>
                  )
              ))}
            </span>
          </Col>
        </>
      </Row>
      <br />
      <Tile />
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

NativeDashboard.propTypes = {
  dashboardId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default NativeDashboard;
