/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
  Card,
  CardBody,
  FormGroup,
} from 'reactstrap';
import { Skeleton } from 'antd';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { Bar, Pie } from 'react-chartjs-2';
import {
  faArrowUp, faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  getCategories, getQuestionGroups, getQuestionsResults,
  getLastCt,
} from '../ctService';
import {
  getAllowedCompanies,
  getColumnArrayById,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getColumnArrayByIdMulti,
} from '../../util/appUtils';
import {
  newpercalculateGoalReports,
} from '../../util/staticFunctions';
import barCharts from '../auditDetail/barCharts.json';

const appModels = require('../../util/appModels').default;

const Reports = () => {
  const dispatch = useDispatch();

  const [typeOpen, setTypeOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);

  const [typeData, setTypeData] = useState(false);
  const [groupData, setGroupData] = useState(false);
  const [periodData, setPeriodData] = useState(false);
  const [groupOptions, setGroupOptions] = useState([]);

  const periodOptions = [{ id: 'Previous Period', name: 'Previous Period' }, { id: 'Same Period Last Year', name: 'Same Period Last Year' }];

  const onTypeChange = (data) => {
    setTypeData(data);
  };

  const onMetricChange = (data) => {
    setGroupData(data);
  };

  const onPeriodChange = (data) => {
    setPeriodData(data);
  };

  const onTypeClear = () => {
    setTypeData(false);
    setGroupOptions([]);
    setTypeOpen(false);
    setGroupData(false);
    setGroupOpen(false);
  };

  const onGroupClear = () => {
    setGroupData(false);
    setGroupOpen(false);
  };

  const onPeriodClear = () => {
    setPeriodData(false);
    setPeriodOpen(false);
  };

  const subMenu = 'Reports';

  const { userInfo } = useSelector((state) => state.user);
  const {
    ctCategories, ctQuestionGroups, ctQuestionDetails, ctlastRecords,
  } = useSelector((state) => state.consumptionTracker);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getCategories(companies, appModels.CONSUMPTIONCATEGORY));
      dispatch(getLastCt(companies, appModels.CONSUMPTIONTRACKER));
    }
  }, [userInfo]);

  useEffect(() => {
    if (typeData && typeData.id) {
      dispatch(getQuestionGroups(typeData.id, appModels.TRACKERLINE));
      setGroupOptions([]);
    }
  }, [typeData]);

  useEffect(() => {
    if (typeData && typeData.id && groupData && groupData.id && periodData && periodData.id) {
      const lastIds = ctlastRecords && ctlastRecords.data ? getColumnArrayById(ctlastRecords.data, 'id') : [];
      dispatch(getQuestionsResults(typeData.id, groupData.id, lastIds, appModels.TRACKERLINE));
    }
  }, [typeData, groupData, periodData]);

  useEffect(() => {
    if (ctQuestionGroups && ctQuestionGroups.data && ctQuestionGroups.data.length) {
      const newArrData = ctQuestionGroups.data.map((cl) => ({
        id: cl.question_group_id && cl.question_group_id.id ? cl.question_group_id.id : '',
        name: cl.question_group_id && cl.question_group_id.name ? cl.question_group_id.name : '',
      }));
      setGroupOptions([...new Map(newArrData.map((item) => [item.id, item])).values()]);
    } else if (ctQuestionGroups && ctQuestionGroups.data && !ctQuestionGroups.data.length) {
      setGroupOptions([]);
    } else if (ctQuestionGroups && ctQuestionGroups.err) {
      setGroupOptions([]);
    }
  }, [ctQuestionGroups]);

  const questionResults = ctQuestionDetails && ctQuestionDetails.data ? ctQuestionDetails.data : [];
  const currentId = ctlastRecords && ctlastRecords.data && ctlastRecords.data.length ? ctlastRecords.data[0].id : 0;
  const previousId = ctlastRecords && ctlastRecords.data && ctlastRecords.data.length > 1 ? ctlastRecords.data[1].id : 0;

  const currentData = questionResults && questionResults.length && currentId ? questionResults.filter((item) => item.tracker_id.id === currentId) : [];
  const previousData = questionResults && questionResults.length && previousId ? questionResults.filter((item) => item.tracker_id.id === previousId) : [];

  const currentQtnsData = currentData && currentData.length ? currentData.filter((item) => item.mro_activity_id.type !== 'Computed') : [];
  const previousQtnsData = previousData && previousData.length ? previousData.filter((item) => item.mro_activity_id.type !== 'Computed') : [];

  const computedData = questionResults && questionResults.length ? questionResults.filter((item) => item.mro_activity_id.type === 'Computed') : [];
  const computedName = computedData && computedData.length ? computedData[0].mro_activity_id.name : '';

  function getComputedValue(givenData) {
    let res = false;
    const data = givenData.filter((item) => item.mro_activity_id.type === 'Computed');
    if (data && data.length) {
      res = data[0];
    }
    return res;
  }

  function getComputedDiifValue(curData, preData) {
    let result = 0;
    const data = curData.filter((item) => item.mro_activity_id.type === 'Computed');
    const data2 = preData.filter((item) => item.mro_activity_id.type === 'Computed');
    if (data && data.length && data2 && data2.length) {
      result = (parseFloat(data2[0].answer ? data2[0].answer : 0) - parseFloat(data[0].answer ? data[0].answer : 0));
    }
    return Math.abs(parseFloat(result).toFixed(2));
  }

  function getComputedDiffScale(curData, preData) {
    let result = 'up';
    const data = curData.filter((item) => item.mro_activity_id.type === 'Computed');
    const data2 = preData.filter((item) => item.mro_activity_id.type === 'Computed');
    if (data && data.length && data2 && data2.length) {
      result = (parseFloat(data2[0].answer ? data2[0].answer : 0) >= parseFloat(data[0].answer ? data[0].answer : 0)) ? 'down' : 'up';
    }
    return result;
  }

  function getChartDatasets(values, labels) {
    let result = {};
    if (values) {
      const datas = [];
      datas.push({
        data: getColumnArrayById(values, 'answer'),
        // label: values[i].mro_activity_id.name,
        backgroundColor: ['#8077ee', '#e31ec9', '#17a2b8', '#ff1e32', '#21ebbc', '#fdca5c', '#00be4b', '#808000', '#FFC0CB', '#ADD8E6', '#FF00FF'],
      });
      result = {
        datasets: datas,
        labels,
      };
    }
    return result;
  }

  function getDatasets(actData, preData) {
    let result = {};
    if (actData && preData) {
      const data = [];
      data.push({
        data: getColumnArrayById(actData, 'answer'),
        label: 'Current Period',
        backgroundColor: '#6699ff',
      });
      data.push({
        data: getColumnArrayById(preData, 'answer'),
        label: 'Previous Period',
        backgroundColor: '#ff9933',
      });
      result = {
        datasets: data,
        labels: getColumnArrayByIdMulti(actData, 'mro_activity_id', 'name'),
      };
    }
    return result;
  }

  const pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      callbacks: {
        label(tooltipItem, data) {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const meta = dataset._meta[Object.keys(dataset._meta)[0]];
          const total = meta.total;
          const currentValue = dataset.data[tooltipItem.index];
          const percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
          return `${currentValue} (${percentage}%)`;
        },
        title(tooltipItem, data) {
          return data.labels[tooltipItem[0].index];
        },
      },
    },
  };

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border">
      <Col sm="12" md="12" lg="12" xs="12">
        <Row>
          <Col sm="12" md="12" lg="12" xs="12" className="p-3">
            <Row>
              <Col sm="12" md="3" lg="3" xs="12">
                <FormGroup className="mb-1">
                  <Autocomplete
                    name="category_id"
                    className="bg-white"
                    open={typeOpen}
                    size="small"
                    onOpen={() => {
                      setTypeOpen(true);
                    }}
                    onClose={() => {
                      setTypeOpen(false);
                    }}
                    value={typeData && typeData.type ? typeData.type : ''}
                    getOptionSelected={(option, value) => (value.length > 0 ? option.type === value.type : '')}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.type)}
                    options={ctCategories && ctCategories.data ? ctCategories.data : []}
                    onChange={(e, data) => onTypeChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        className="without-padding custom-icons"
                        placeholder="Select Type"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {ctCategories && ctCategories.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {typeData && typeData.id && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onTypeClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                                )}
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </FormGroup>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12">
                <FormGroup className="mb-1">
                  <Autocomplete
                    name="qtn_group_id"
                    className="bg-white"
                    open={groupOpen}
                    size="small"
                    onOpen={() => {
                      setGroupOpen(true);
                    }}
                    onClose={() => {
                      setGroupOpen(false);
                    }}
                    value={groupData && groupData.name ? groupData.name : ''}
                    getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={groupOptions}
                    onChange={(e, data) => onMetricChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        className="without-padding custom-icons"
                        placeholder="Select Metric"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {ctQuestionGroups && ctQuestionGroups.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {groupData && groupData.id && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onGroupClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                                )}
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </FormGroup>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12">
                <FormGroup className="mb-1">
                  <Autocomplete
                    name="period"
                    className="bg-white"
                    open={periodOpen}
                    size="small"
                    onOpen={() => {
                      setPeriodOpen(true);
                    }}
                    onClose={() => {
                      setPeriodOpen(false);
                    }}
                    value={periodData && periodData.name ? periodData.name : ''}
                    getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={periodOptions}
                    onChange={(e, data) => onPeriodChange(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        className="without-padding custom-icons"
                        placeholder="Select Period"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <InputAdornment position="end">
                              {periodData && periodData.id && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onPeriodClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>
            {periodData && periodData.id && typeData && typeData.id && groupData && groupData.id && ctQuestionDetails && ctQuestionDetails.loading && (
            <div className="text-center mt-2 mb-2">
              <Skeleton active size="large" />
            </div>
            )}
            {periodData && periodData.id && typeData && typeData.id && groupData && groupData.id && ctQuestionDetails && ctQuestionDetails.data && (
            <Row className="mt-3">
              <Col sm="12" md="5" lg="5" xs="12" className="pr-04">
                <Card className="p-2 grid-layout-custom-card shadow-card-dashboard">
                  <h6 className="m-0">{computedName || ''}</h6>
                  <hr className="m-0" />
                  <CardBody className="pt-2 text-center">
                    <div className="p-2">
                      <h4>
                        {getComputedValue(currentData) && getComputedValue(currentData).answer ? getComputedValue(currentData).answer : 0}
                        <span className="font-tiny">{getComputedValue(currentData) ? getComputedValue(currentData).mro_activity_id.measured_placeholder : ''}</span>
                      </h4>
                      <p className="mb-0">Current Period</p>
                      <p className="mb-0">
                        { getDefaultNoValue(
                          ctlastRecords && ctlastRecords.data && ctlastRecords.data.length > 0
                            ? getCompanyTimezoneDate(ctlastRecords.data[0].start_date, userInfo, 'date')
                            : '',
                        ) }
                        {' '}
                        -
                        {' '}
                        { getDefaultNoValue(
                          ctlastRecords && ctlastRecords.data && ctlastRecords.data.length > 0
                            ? getCompanyTimezoneDate(ctlastRecords.data[0].end_date, userInfo, 'date')
                            : '',
                        ) }
                      </p>
                    </div>
                    <div className="p-2">
                      <h4>
                        {getComputedValue(previousData) && getComputedValue(previousData).answer ? getComputedValue(previousData).answer : 0}
                        <span className="font-tiny">{getComputedValue(previousData) ? getComputedValue(previousData).mro_activity_id.measured_placeholder : ''}</span>
                      </h4>
                      <p className="mb-0">Previous Period</p>
                      <p className="mb-0">
                        { getDefaultNoValue(
                          ctlastRecords && ctlastRecords.data && ctlastRecords.data.length > 1
                            ? getCompanyTimezoneDate(ctlastRecords.data[1].start_date, userInfo, 'date')
                            : '',
                        ) }
                        {' '}
                        -
                        {' '}
                        { getDefaultNoValue(
                          ctlastRecords && ctlastRecords.data && ctlastRecords.data.length > 1
                            ? getCompanyTimezoneDate(ctlastRecords.data[1].end_date, userInfo, 'date')
                            : '',
                        ) }
                      </p>
                    </div>
                    <div className="p-2">
                      <h4>
                        {`${newpercalculateGoalReports(
                          getComputedValue(previousData) && getComputedValue(previousData).answer ? getComputedValue(previousData).answer : 0,
                          getComputedValue(currentData) && getComputedValue(currentData).answer ? getComputedValue(currentData).answer : 0,
                        )} %`}
                        <span className="font-tiny">
                          <FontAwesomeIcon
                            className={`ml-2 ${getComputedDiffScale(currentData, previousData) === 'down' ? 'text-danger' : 'text-success'}`}
                            size="lg"
                            icon={getComputedDiffScale(currentData, previousData) === 'up' ? faArrowUp : faArrowDown}
                          />
                        </span>
                      </h4>
                      <p className="mb-0">
                        {getComputedDiifValue(currentData, previousData)}
                        <span className="font-tiny">{getComputedValue(previousData) ? getComputedValue(previousData).mro_activity_id.measured_placeholder : ''}</span>
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col sm="12" md="7" lg="7" xs="12" className="pl-04">
                <Card className="p-2 grid-layout-custom-card shadow-card-dashboard">
                  <h6 className="m-0">{groupData && groupData.name ? groupData.name : ''}</h6>
                  <hr className="m-0" />
                  <CardBody className="pt-2">
                    <Pie
                      data={getChartDatasets(currentQtnsData, getColumnArrayByIdMulti(currentQtnsData, 'mro_activity_id', 'name'))}
                      options={pieOptions}
                    />
                  </CardBody>
                </Card>
              </Col>
              <Col sm="12" md="12" lg="12" xs="12" className="mt-2">
                <Card className="p-2 grid-layout-custom-card shadow-card-dashboard">
                  <h6 className="m-0">Comparision Trend</h6>
                  <hr className="m-0" />
                  <CardBody className="pt-2">
                    <Bar
                      key="Audit Scorecard"
                      height="300"
                      data={getDatasets(currentQtnsData, previousQtnsData)}
                      options={barCharts.options}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default Reports;
