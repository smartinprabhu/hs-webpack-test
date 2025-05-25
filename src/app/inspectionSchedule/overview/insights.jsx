/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable import/order */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import moment from 'moment-timezone';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import { Redirect, useHistory } from 'react-router-dom';
import {
  CardBody,
  CardTitle,
  FormFeedback,
  Col,
  Row,
} from 'reactstrap';
import dayjs from 'dayjs';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  Grid, Typography, Alert, Box, Card, CardContent, FormControl,
} from '@mui/material';
import '../../apexDashboards/dashboard.scss';

import './complianceOverview.scss';
import {
  getInspectionDashboard,
  setInspectionDashboardDate,
  getInspectionTeamsDashboard,
  getLastUpdate,
} from '../../preventiveMaintenance/ppmService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getHeaderTabs,
  getTabs,
  getActiveTab,
  getDynamicTabs,
  getCompanyTimezoneDate,
} from '../../util/appUtils';
import {
  newpercalculate,
} from '../../util/staticFunctions';
import customData from './data/customData.json';
import {
  getInspectionCommenceDate, getDashboardFilters, getInspectionStatusGroups,
  resetInspectionViewer, resetInspectionEquipmentGroup, resetInspectionSpaceGroup,
} from '../inspectionService';
import InspectionByTeam from './inspectionByTeam';
import inspectionNav from '../navbar/navlist.json';
import { updateHeaderData } from '../../core/header/actions';

import TrendChart from './trendChart';

const appModels = require('../../util/appModels').default;

const { RangePicker } = DatePicker;

const Insights = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { inspectionDashboard, warehouseLastUpdate } = useSelector((state) => state.ppm);
  const { inspectionCommenceInfo, inspectionStatusGroups } = useSelector((state) => state.inspection);

  const dateFormat = 'DD-MM-y';

  const [datesValue, setDatesValue] = useState([moment(new Date(), dateFormat), moment(new Date(), dateFormat)]);
  const [activeDate, setActiveDate] = useState([
    dayjs(), // Format initial date as a string
    dayjs(),
  ]);
  const [commenceDate, setCommenceDate] = useState(new Date());
  const [isRedirect, setRedirect] = useState(false);

  const companies = getAllowedCompanies(userInfo);

  const lastUpdateTime = warehouseLastUpdate && warehouseLastUpdate.data && warehouseLastUpdate.data.length && warehouseLastUpdate.data[0].last_updated_at ? warehouseLastUpdate.data[0].last_updated_at : false;

  useEffect(() => {
    dispatch(setInspectionDashboardDate([new Date(), new Date()]));
    dispatch(getDashboardFilters(false));
    dispatch(resetInspectionViewer());
    dispatch(resetInspectionEquipmentGroup());
    dispatch(resetInspectionSpaceGroup());
    if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id) {
      dispatch(getInspectionCommenceDate(userInfo.data.company.id, appModels.INSPECTIONCONFIG));
    }
    dispatch(getLastUpdate(appModels.INSPECTIONCHECKLISTLOGS));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && activeDate && (activeDate && activeDate.length && activeDate.length === 2 && activeDate[0] && activeDate[1])) {
      const start = moment(activeDate[0].toDate()).format('YYYY-MM-DD');
      const end = moment(activeDate[1].toDate()).format('YYYY-MM-DD');

      dispatch(getInspectionDashboard(start, end));
      dispatch(getInspectionTeamsDashboard(start, end));
      dispatch(getInspectionStatusGroups(start, end));
    }
  }, [userInfo, activeDate]);

  useEffect(() => {
    if (inspectionCommenceInfo && inspectionCommenceInfo.data) {
      setCommenceDate(new Date(inspectionCommenceInfo.data[0].inspection_commenced_on));
    }
  }, [inspectionCommenceInfo]);

  function onChange(date) {
    setActiveDate(date);
    dispatch(setInspectionDashboardDate(date));
  }

  function getDifferece(date1, date2) {
    // const date1 = new Date();
    const DifferenceInTime = date2.getTime() - date1.getTime();
    const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
    return DifferenceInDays;
  }

  function disableDateday(current) {
    if (!datesValue || datesValue.length === 0) {
      return false;
    }
    let disable = false;
    const subnoofdays = commenceDate ? getDifferece(new Date(datesValue[0]), new Date(commenceDate)) : 0;
    const nofuture = (current >= moment(new Date()).endOf('day'));
    if (subnoofdays > 0 && subnoofdays < 30) {
      const days = Math.abs(subnoofdays);
      const tooLates = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > (days + 1);
      const tooEarlys = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > (days + 1);
      disable = tooEarlys || tooLates || nofuture;
    } else {
      const tooLate = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > 30;
      const tooEarly = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > 30;
      disable = tooEarly || tooLate || nofuture;
    }
    return disable;
  }

  const onLoadViewer = (status, teams, count) => {
    if (count) {
      const filters = [{
        statusOptions: [],
        status: [],
        teams: teams ? [teams] : [],
        selectDate: activeDate && activeDate.length ? [moment(activeDate[0].toDate()).format('YYYY-MM-DD'), moment(activeDate[1].toDate()).format('YYYY-MM-DD')] : [],
      }];
      if (status !== 'Scheduled') {
        filters[0].statusOptions = [
          {
            label: status,
            value: status,
          }];
        filters[0].status = [status];
      }
      dispatch(resetInspectionViewer());
      dispatch(getDashboardFilters(filters));
      setRedirect(true);
      history.push({ pathname: '/inspection-overview/inspection-viewer' });
    }
  };

  // const ninjaData = ninjaDashboard && ninjaDashboard.data ? ninjaDashboard.data.ks_item_data : [];
  // const dataList = ninjaDashboard && ninjaDashboard.data ? ninjaDashboard.data.ks_gridstack_config : false;

  /* const arrGrids = dataList && dataList.length ? JSON.parse(dataList) : [];
  const dataIds = Object.keys(arrGrids);

  const dataArray = getDataArryNot(ninjaData || [], dataIds, 'ks_dashboard_item_type', 'ks_tile'); */

  const colorClasses = customData.states;
  const stateCodes = customData.stateList ? customData.stateList : false;

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (inspectionDashboard && inspectionDashboard.loading)
    || (inspectionStatusGroups && inspectionStatusGroups.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (inspectionDashboard && inspectionDashboard.err) ? generateErrorMessage(inspectionDashboard) : userErrorMsg;

  const total = inspectionDashboard && inspectionDashboard.data && inspectionDashboard.data.length ? inspectionDashboard.data[0].total_count : 0;
  const insData = inspectionDashboard && inspectionDashboard.data && inspectionDashboard.data.length ? inspectionDashboard.data[0] : false;

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Inspection Schedule',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, inspectionNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(inspectionNav && inspectionNav.data && inspectionNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/inspection-overview/inspection/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Insights',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Inspection Schedule',
        moduleName: 'Inspection Schedule',
        menuName: 'Insights',
        link: '/inspection-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <>
      <Grid container spacing={2} sx={{ p: 2, fontFamily: 'Suisse Intl' }}>
        <Grid item xs={12}>
          <Alert severity="info">
            Last Updated at:
            {' '}
            {lastUpdateTime ? getCompanyTimezoneDate(lastUpdateTime, userInfo, 'datetime') : 'N/A'}
          </Alert>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontFamily: 'Suisse Intl',
          }}
        >
          {inspectionCommenceInfo && !inspectionCommenceInfo.loading && (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateRangePicker
                  sx={{ textAlign: 'right' }}
                  localeText={{ start: 'Start Date', end: 'End Date' }}
                  slotProps={{
                    actionBar: {
                      actions: ['clear', 'accept'],
                    },
                    textField: {
                      variant: 'outlined',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          overflow: 'hidden',
                          height: '40px',
                        },
                      },
                    },
                  }}
                  format="DD-MM-YYYY"
                  value={activeDate}
                  onChange={onChange}
                  ampm={false}
                  disableFuture
                />
              </DemoContainer>
            </LocalizationProvider>
            {!activeDate && (
            <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 30 days</FormFeedback>
            )}
          </>
          )}
        </Grid>
        <Grid item xs={12} sx={{ fontFamily: 'Suisse Intl' }}>
          <Grid container spacing={2}>
            {insData && stateCodes && stateCodes.map((sc) => (
              <Grid item xs={12} md={3} key={sc.value}>
                <Card
                  sx={{
                    textAlign: 'center',
                    p: 2,
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.125)',
                    cursor: insData[sc.value] ? 'pointer' : 'default',
                    transition: '0.3s',
                    '&:hover': insData[sc.value] ? { boxShadow: 6 } : {},
                  }}
                  onClick={() => (insData[sc.label] === 'Scheduled' ? () => { } : onLoadViewer(sc.label, false, insData[sc.value]))}
                >
                  <CardContent>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold', fontSize: '15px', mt: '0', fontFamily: 'Suisse Intl',
                      }}
                    >
                      {sc.label}
                      {' '}
                      Inspections
                    </Typography>
                    <Box sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 2, mt: 2,
                    }}
                    >
                      {/* Progress Bar */}
                      <Box sx={{ width: 120, height: 120 }} className="inspection-module">
                        <CircularProgressbarWithChildren
                          value={newpercalculate(total, insData[sc.value])}
                          strokeWidth={9}
                          styles={buildStyles(colorClasses[sc.label].strokeObj)}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: colorClasses[sc.label].strokeObj.pathColor, mt: 0, fontSize: '14px', fontWeight: 'bold',
                            }}
                          >
                            {insData[sc.value] ? newpercalculate(total, insData[sc.value]) : 0}
                            %
                          </Typography>
                        </CircularProgressbarWithChildren>
                      </Box>

                      {/* Number Box */}
                      <Box sx={{ width: 30 }} className="inspection-module">
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '30px', color: colorClasses[sc.label].strokeObj.pathColor }}>
                          {insData[sc.value]}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 2, color: '#6B7280' }}>
                      Out of
                      {' '}
                      {total}
                      {' '}
                      Inspections
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ fontFamily: 'Suisse Intl' }}>
          {!loading && (
          <div className="mt-1 p-0">
            <InspectionByTeam />
          </div>
          )}
        </Grid>
      </Grid>
      {loading && (
        <div className="mb-2 mt-3 p-5" data-testid="loading-case">
          <Loader />
        </div>
      )}
      {((inspectionDashboard && inspectionDashboard.err) || isUserError) && (
        <ErrorContent errorTxt={errorMsg} />
      )}
      {!loading && inspectionStatusGroups && inspectionStatusGroups.data && inspectionStatusGroups.data.length > 0 && inspectionStatusGroups.data[0].labels && (
        <div className="ml-2 mt-0 pt-0 pl-2" style={{ marginRight: '1.3rem' }}>
          <Grid item xs={12} sx={{ fontFamily: 'Suisse Intl' }}>
            <Card className="p-2">
              <CardTitle className="mb-1">
                <h6 className="ml-2" style={{ fontSize: '15px', fontWeight: 'bold' }}>
                  Inspection Trend
                </h6>
              </CardTitle>
              <CardBody className="pt-0 pl-0">
                <TrendChart chartData={inspectionStatusGroups.data[0]} />
              </CardBody>
            </Card>
          </Grid>
        </div>
      )}
    </>
  );
};
export default Insights;
