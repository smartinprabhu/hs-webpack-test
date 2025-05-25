/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useMemo } from 'react';
import {
  CardBody,
  Badge,
  Col,
  Table,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Pie, Bar } from 'react-chartjs-2';
import { Space } from 'antd';
import {
  Button, Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import { Box } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

import Loader from '@shared/loading';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorContent from '@shared/errorContent';
import ErrorContentStatic from '@shared/errorContentStatic';

import {
  getDefaultNoValue, generateErrorMessage, getDatesOfQueryWitLocal,
  getColumnArrayById, getListOfModuleOperations, getAllowedCompanies,
  getDateAndTimeForDifferentTimeZones,
  savePdfContentData, truncate, getDatePickerFormat,
} from '../../util/appUtils';
import {
  getAnswersReport, setActive, resetSurveyAnswers,
} from '../surveyService';
import { getPercentage } from '../../assets/utils/utils';
import customData from '../data/customData.json';
import { getDatasetsPie, getDatasetsPieArray, getDatasetsGroupArray } from '../utils/utils';
import PrintAnswerReport from './printAnswerReport';
import dateFilter from '../surveyOverview/datefilter.json';
import { AddThemeBackgroundColor, returnThemeColor } from '../../themes/theme';
import actionCodes from '../data/actionCodes.json';

const appModels = require('../../util/appModels').default;

const AnswersReport = (props) => {
  const dispatch = useDispatch();
  const { viewId, detailData } = props;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { surveyDetails, surveyAnswerReport, currentTab } = useSelector((state) => state.survey);
  const [showGraph, setShowGraph] = useState('Switch to Bar Chart');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [open, setOpen] = React.useState(false);
  const [selectedDate, handleDateChange] = React.useState([null, null]);
  const [pdfLoader, setPDFLoader] = useState(false);
  const [exportType, setExportType] = useState('');

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Survey', 'code');
  const isDownloadable = allowedOperations.includes(actionCodes['Download Answers']);

  const companies = getAllowedCompanies(userInfo);

  const surveyUUID = surveyDetails && surveyDetails.data && surveyDetails.data.length > 0 ? surveyDetails.data[0].uuid : false;

  useEffect(() => {
    // dispatch(setActive('Today'));
    dispatch(resetSurveyAnswers([]));
  }, []);

  function handlePdfDownload(detailData) {
    setPDFLoader(true);
    setExportType('pdf');
    setPdfFileName(detailData.title);
  }
  useEffect(() => {
    const questionsLength = surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey_dict
      && surveyAnswerReport.data.survey_dict.page_ids.length && surveyAnswerReport.data.survey_dict.page_ids[0] && surveyAnswerReport.data.survey_dict.page_ids[0].question_ids && surveyAnswerReport.data.survey_dict.page_ids[0].question_ids.length;
    setTimeout(() => {
      setPDFLoader(false);
    }, questionsLength * 2000);
  }, [pdfLoader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const surveyTitle = surveyDetails && (surveyDetails.data && surveyDetails.data.length > 0) ? truncate(surveyDetails.data[0].title, 35) : 'Survey';
      savePdfContentData(`${surveyTitle}-Answer Summary Report `, 'Survey-Answers-Summary', 'answer-elements', 'tables', 'print-survey-report-pdf', surveyAnswerReport, companyName);
    }
    setExportType();
    setPDFLoader(false);
  }, [exportType]);

  useMemo(() => {
    if (userInfo && userInfo.data && surveyDetails && surveyDetails.data && start && end) {
      const ids = surveyDetails.data.length > 0 ? surveyDetails.data[0].uuid : false;
      dispatch(getAnswersReport(ids, start, end));
    }
  }, [surveyUUID, start, end]);

  useEffect(() => {
    if (userInfo && userInfo.data && currentTab && currentTab !== 'Custom') {
      const companyTimeZone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone ? userInfo.data.company.timezone : defaultTimeZone;
      const dates = getDatesOfQueryWitLocal(currentTab, companyTimeZone);
      if (dates.length > 0) {
        setStart(dates[0]);
        setEnd(dates[1]);
      } else {
        const monthDates = getDatesOfQueryWitLocal('This month', companyTimeZone);
        setStart(monthDates[0]);
        setEnd(monthDates[1]);
      }
    }
  }, [userInfo, currentTab]);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        const getDateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, selectedDate[0]?.$d, selectedDate[1]?.$d);
        const startData = getDateRangeObj[0];
        const enddata = getDateRangeObj[1];
        setStart(startData);
        setEnd(enddata);
      }
    }
  }, [selectedDate]);

  function getAnswerTypeData(type, obj) {
    let res = '';
    if (type && obj) {
      if (type === 'date') {
        res = obj.value_date;
      } else if (type === 'free_text') {
        res = obj.value_free_text;
      } else if (type === 'text') {
        res = obj.value_text;
      }
    }
    return res;
  }

  /* useEffect(() => {
    if (viewId) {
      dispatch(getSurveyDetail(viewId, appModels.SURVEY, start, end));
    }
  }, [viewId, start, end]); */

  /* useEffect(() => {
    if (userInfo && userInfo.data && currentTab && currentTab !== 'Custom') {
      const companyTimeZone = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.timezone ? userInfo.data.company.timezone : defaultTimeZone;
      const dates = getDatesOfQueryWithUtc(currentTab, companyTimeZone);
      if (dates.length > 0) {
        setStart(dates[0]);
        setEnd(dates[1]);
      } else {
        const monthDates = getDatesOfQueryWithUtc('This month', companyTimeZone);
        setStart(monthDates[0]);
        setEnd(monthDates[1]);
      }
    }
  }, [userInfo, currentTab]);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        const getDateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, selectedDate[0], selectedDate[1]);
        const start = getDateRangeObj[0];
        const end = getDateRangeObj[1];
        setStart(start);
        setEnd(end);
      }
    }
  }, [selectedDate]); */

  const onDateRangeChange = (dates, datesString) => {
    setStart('');
    setEnd('');
    // dispatch(clearExportAnswersData({}))
    handleDateChange(dates);
  };

  const activeTab = (item) => {
    dispatch(resetSurveyAnswers([]));
    setStart('');
    setEnd('');
    dispatch(setActive(item));
  };

  const activeTab1 = (item) => {
    dispatch(resetSurveyAnswers([]));
    setStart('');
    setEnd('');
    dispatch(setActive(item));
  };

  function getAnswerTypeValues(arr) {
    let result = [];
    if (arr) {
      result = [...arr.reduce((mp, o) => {
        if (!mp.has(getAnswerTypeData(o.answer_type, o))) mp.set(getAnswerTypeData(o.answer_type, o), { ...o, count: 0 });
        mp.get(getAnswerTypeData(o.answer_type, o)).count++;
        return mp;
      }, new Map()).values()];
    }
    return result;
  }

  function getTotalCount(assetData) {
    let result = 0;
    if (assetData.answers && assetData.answers.length) {
      assetData.answers.forEach((item) => {
        result += item.count;
      });
    } else if (assetData.most_common && assetData.most_common.length) {
      assetData.most_common.forEach((item) => {
        result += item[1];
      });
    } else if (assetData && assetData.length) {
      const groupedData = getAnswerTypeValues(assetData);
      groupedData.forEach((item) => {
        result += item.count;
      });
    }
    return result;
  }

  function getRow(assetData, total) {
    const tableTr = [];
    if (assetData.answers && assetData.answers.length) {
      for (let i = 0; i < assetData.answers.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getDefaultNoValue(assetData.answers[i].text)}</td>
            <td className="p-2">{assetData.answers[i].count}</td>
            <td className="p-2">{getPercentage(total, assetData.answers[i].count)}</td>
          </tr>,
        );
      }
    } else if (assetData.most_common && assetData.most_common.length) {
      for (let i = 0; i < assetData.most_common.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{assetData.most_common[i][0]}</td>
            <td className="p-2">{assetData.most_common[i][1]}</td>
            <td className="p-2">{getPercentage(total, assetData.most_common[i][1])}</td>
          </tr>,
        );
      }
    } else if (assetData && assetData.length) {
      const groupedData = getAnswerTypeValues(assetData);
      for (let i = 0; i < groupedData.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getAnswerTypeData(groupedData[i].answer_type, groupedData[i])}</td>
            <td className="p-2">{groupedData[i].count}</td>
            <td className="p-2">{getPercentage(total, groupedData[i].count)}</td>
          </tr>,
        );
      }
    } else {
      tableTr.push(
        <tr>
          <td colSpan="2" align="center">No Data Found</td>
        </tr>,
      );
    }
    return tableTr;
  }

  const pieOptions = {
    ...customData.pieChartOptions,
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => `${data.labels[tooltipItem.index]}: ${data.datasets[0].data[tooltipItem.index]}(${getPercentage(data.datasets[0].data.reduce((acc, val) => acc + val, 0), data.datasets[0].data[tooltipItem.index])}%)`,
        // label: (ttItem) => `${ttItem.label}: ${ttItem.parsed}%`
      },
    },
  };

  const barOptions = {
    ...customData.barChartOptions,
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0, // Set the minimum value for the y-axis
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => `${data.labels[tooltipItem.index]}: ${data.datasets[0].data[tooltipItem.index]}(${getPercentage(data.datasets[0].data.reduce((acc, val) => acc + val, 0), data.datasets[0].data[tooltipItem.index])}%)`,
        // label: (ttItem) => `${ttItem.label}: ${ttItem.parsed}%`
      },
    },
  };

  function getChart(qtnData) {
    let chartDiv = <div />;
    if (qtnData.input_summary && !qtnData.input_summary.answered) {
      chartDiv = (
        <div className="p-3 text-center">
          <h4>No Data Found.</h4>
        </div>
      );
    } else if (qtnData.graph_data && qtnData.graph_data.length > 0 && qtnData.graph_data[0] && qtnData.graph_data[0].values) {
      chartDiv = (
        <div>
          {showGraph !== 'Switch to Bar Chart' ? (
            <Bar
              key={qtnData.graph_data[0].key}
              options={barOptions}
              data={getDatasetsPie(qtnData.graph_data[0].values, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          ) : (
            <Pie
              key={qtnData.graph_data[0].key}
              options={pieOptions}
              data={getDatasetsPie(qtnData.graph_data[0].values, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          )}
        </div>
      );
    } else if (qtnData.prepare_result && qtnData.prepare_result.most_common && qtnData.prepare_result.most_common.length) {
      chartDiv = (
        <div>
          {showGraph !== 'Switch to Bar Chart' ? (
            <Bar
              key={qtnData}
              options={barOptions}
              data={getDatasetsPieArray(qtnData.prepare_result.most_common, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          ) : (
            <Pie
              key={qtnData}
              options={pieOptions}
              data={getDatasetsPieArray(qtnData.prepare_result.most_common, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          )}
        </div>
      );
    } else if (qtnData.graph_data && qtnData.graph_data.length > 0) {
      chartDiv = (
        <div>
          {showGraph !== 'Switch to Bar Chart' ? (
            <Bar
              key={qtnData}
              options={barOptions}
              data={getDatasetsPie(qtnData.graph_data, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          ) : (
            <Pie
              key={qtnData}
              options={pieOptions}
              data={getDatasetsPie(qtnData.graph_data, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          )}
        </div>
      );
    } else if (qtnData.prepare_result && qtnData.prepare_result.length && qtnData.prepare_result.length > 0) {
      chartDiv = (
        <div>
          {showGraph !== 'Switch to Bar Chart' ? (
            <Bar
              key={qtnData}
              options={barOptions}
              data={getDatasetsGroupArray(qtnData.prepare_result, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          ) : (
            <Pie
              key={qtnData}
              options={pieOptions}
              data={getDatasetsGroupArray(qtnData.prepare_result, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          )}
        </div>
      );
    } else {
      chartDiv = (
        <div className="p-3 text-center">
          <h4>No Data Found.</h4>
        </div>
      );
    }
    return chartDiv;
  }

  const isDateValue = (date) => {
    let value = false;
    if (date && date.length > 0) {
      if (date[0] === null || date[1] === null) {
        value = true;
      }
    }
    return value;
  };

  // const reviewerDetails = surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey
  // && surveyAnswerReport.data.survey.reviwer && surveyAnswerReport.data.survey.reviwer.length
  // ? [...new Map(surveyAnswerReport.data.survey.reviwer.map((item) => [item.reviwer_mobile, item])).values()] : false;
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const reviewerDetails = surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey
    && surveyAnswerReport.data.survey.reviwer && surveyAnswerReport.data.survey.reviwer.length
    ? surveyAnswerReport.data.survey.reviwer : false;

  const isError = surveyAnswerReport && surveyAnswerReport.err;
  const isLoading = (surveyAnswerReport && surveyAnswerReport.loading) || (surveyDetails && surveyDetails.loading);
  const userErrorMsg = generateErrorMessage(surveyDetails);
  const errorMsg = (surveyAnswerReport && surveyAnswerReport.err) ? generateErrorMessage(surveyAnswerReport) : userErrorMsg;

  return (
    <React.Fragment className="border-0 h-100">
      <div data-testid="success-case" className="small-table-list thin-scrollbar">
        <Row>
          <Col sm="12" md="12" lg="12" xs="12" className="ml-1 mb-1">
            <span className="pl-3">
              <Space>
                {dateFilter && dateFilter.buttonList.map((item) => (
                  item.name === 'Custom'
                    ? (
                      <Button
                        size="sm"
                        className="py-0 px-1"
                        key={item.id}
                        variant={currentTab === item.name ? 'contained' : 'outlined'}
                        onClick={() => { activeTab(item.name); setOpen(true); handleDateChange([null, null]); }}
                      >
                        {item.name}
                      </Button>
                      // <Button
                      //   key={item.id}
                      //   onClick={() => { setActive(item.name); setOpen(true); handleDateChange(null); }}
                      //   size="sm"
                      //   active={currentTab === item.name}
                      //   className="nav-datafilter pr-2 pl-2 p-0 mr-2 text-dark rounded-pill bg-white mb-1 mobile-btn-full-width btn btn-secondary btn-sm active"
                      // >
                      //   {item.name}
                      // </Button>
                    )
                    : (
                      <Button
                        size="sm"
                        className="py-0 px-1"
                        key={item.id}
                        variant={currentTab === item.name ? 'contained' : 'outlined'}
                        onClick={() => { activeTab1(item.name); setOpen(false); }}
                      >
                        {item.name}
                      </Button>
                    )
                ))}
                {open && currentTab && currentTab === 'Custom' ? (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateRangePicker']}>
                      <DateRangePicker
                        localeText={{ start: 'Start Date', end: 'End Date' }}
                        onChange={onDateRangeChange}
                        value={selectedDate}
                        format={getDatePickerFormat(userInfo, 'date')}
                        slotProps={{
                          actionBar: {
                            actions: ['clear'],
                          },
                          textField: { variant: 'filled' },
                        }}
                        disableFuture
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                ) : ''}
              </Space>
            </span>
            <div className="float-right pr-0 mr-2 pr-3">
              <Button
                size="sm"
                className="py-0 px-1 mr-2"
                variant="outlined"
                onClick={() => {
                  setShowGraph(showGraph !== 'Switch to Bar Chart' ? 'Switch to Bar Chart' : 'Switch to Pie Chart');
                }}
              >
                {showGraph}
              </Button>
              {isDownloadable && (
              <LoadingButton
                size="sm"
                className="py-0 px-1"
                variant="outlined"
                loading={pdfLoader}
                loadingPosition="end"
                onClick={() => { handlePdfDownload(detailData); }}
              >
                <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faFilePdf} />
                <span className="mr-2">PDF Download</span>
                {/* pdfLoader === true ? (
                  <Spinner size="sm" color="light" className="mr-2" />
                ) : ('') */}
              </LoadingButton>
              )}
            </div>
          </Col>
        </Row>

        {/* {!isLoading && reviewerDetails && (
            <div>
              <h6>Reviewer Details</h6>
              <div className="small-table-list thin-scrollbar">
                <Table responsive className="font-weight-400 border-0 assets-table" width="100%">
                  <thead>
                    <tr>
                      <th className="p-2 min-width-100">
                        Name
                      </th>
                      <th className="p-2 min-width-100">
                        Email
                      </th>
                      <th className="p-2 min-width-100">
                        Mobile
                      </th>
                      <th className="p-2 min-width-100">
                        Employee Code
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewerDetails && reviewerDetails.map((rd) => (
                      <tr key={rd.reviwer_mobile}>
                        <td className="p-2">{getDefaultNoValue(rd.reviwer_name)}</td>
                        <td className="p-2">{getDefaultNoValue(getMaskedEmail(rd.email, 'x'))}</td>
                        <td className="p-2">{getDefaultNoValue(getMaskedPhoneNo(rd.reviwer_mobile))}</td>
                        <td className="p-2">{getDefaultNoValue(rd.employee_code)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <hr className="m-0" />
              </div>
            </div>
          )} */}
        {!isLoading && (currentTab !== 'Custom' || (currentTab === 'Custom' && !isDateValue(selectedDate))) && surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey_dict
          && surveyAnswerReport.data.survey_dict.page_ids && surveyAnswerReport.data.survey_dict.page_ids.map((section, index) => (
            <div className="ml-1 p-3">
              <Box
                sx={AddThemeBackgroundColor({
                  width: '100%',
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                })}
              >
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      marginBottom: '5px',
                    }}
                  >
                    <Typography
                      sx={{
                        font: 'normal normal normal 18px Suisse Intl',
                        letterSpacing: '1.05px',
                        color: '#FFFFFF',
                      }}
                    >
                      {section.page && section.page.name ? section.page.name : ''}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                key={section.page}
                sx={{
                  border: `1px solid ${returnThemeColor()}`,
                }}
              // className="p-3"
              >
                {/*  <Row>
                  <h3>{section.page && section.page.name ? section.page.name : ''}</h3>
                </Row>
                <Row className="ml-2">
                  <Button
                     variant="contained"
                    onClick={() => {
                      setShowGraph(showGraph !== 'Switch to Bar Chart' ? 'Switch to Bar Chart' : 'Switch to Pie Chart');
                    }}
                    size="sm"
                    className="pb-05 pt-05 font-11 border-primary bg-white text-primary mr-2 my-1 float-right"
                  >
                    {showGraph}
                  </Button>
                </Row> */}
                {section.question_ids && section.question_ids.map((qtn, index1) => (
                  <div key={qtn.question} id={`answer-elements-${index}${index1}`} className={!index1 ? 'p-2 mt-2 pt-2' : 'p-2 mt-5 pt-5'}>
                    <h6>
                      Q
                      (
                      {index1 + 1}
                      )
                      {'  '}
                      {qtn.question && qtn.question.name ? qtn.question.name : ''}
                      <span className="float-right">
                        <Badge color="info" className="mr-2 badge-text no-border-radius" pill>
                          {qtn.input_summary.total_inputs}
                          {'  '}
                          Total
                        </Badge>
                        <Badge color="success" className="mr-2 badge-text no-border-radius" pill>
                          {qtn.input_summary.answered}
                          {'  '}
                          Answered
                        </Badge>
                        <Badge color="danger" className="mr-2  badge-text no-border-radius" pill>
                          {qtn.input_summary.skipped}
                          {'  '}
                          Skipped
                        </Badge>
                        {qtn.prepare_result && qtn.prepare_result.average && (
                          <Badge color="info" className="mr-2 badge-text no-border-radius" pill>
                            {qtn.prepare_result.average}
                            {'  '}
                            Avg
                          </Badge>
                        )}
                        {qtn.prepare_result && qtn.prepare_result.min && (
                          <Badge color="info" className="mr-2  badge-text no-border-radius" pill>
                            {qtn.prepare_result.min}
                            {'  '}
                            Min
                          </Badge>
                        )}
                        {qtn.prepare_result && qtn.prepare_result.max && (
                          <Badge color="info" className="mr-2  badge-text no-border-radius" pill>
                            {qtn.prepare_result.max}
                            {'  '}
                            Max
                          </Badge>
                        )}
                        {qtn.prepare_result && qtn.prepare_result.sum && (
                          <Badge color="info" className="mr-2  badge-text no-border-radius" pill>
                            {qtn.prepare_result.sum}
                            {'  '}
                            Sum
                          </Badge>
                        )}
                      </span>
                    </h6>
                    <Row>
                      <Col className="pt-2" sm="12" md="6" lg="6" xs="12">
                        {getChart(qtn)}
                      </Col>
                      <Col className="pt-2" id={`tables-${index}${index1}`} sm="12" md="6" lg="6" xs="12">
                        <div className="p-1 small-table-list thin-scrollbar">
                          <Table responsive className="font-weight-400 border-0 assets-table" width="100%">
                            <thead>
                              <tr>
                                <th className="p-2 min-width-160">
                                  Answer Choices
                                </th>
                                <th className="p-2 min-width-160">
                                  User Responses
                                </th>
                                <th className="p-2 min-width-160">
                                  %
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {getRow(qtn.prepare_result ? qtn.prepare_result : [], getTotalCount(qtn.prepare_result ? qtn.prepare_result : []))}
                            </tbody>
                          </Table>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Box>
            </div>
        ))}
      </div>
      <Col md="12" sm="12" lg="12" className="d-none">
        <PrintAnswerReport showGraph={showGraph} surveyDetails={surveyDetails} surveyAnswerReport={surveyAnswerReport} />
      </Col>
      {isLoading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
      )}
      {((surveyAnswerReport && surveyAnswerReport.err) || (isError)) && (
        <CardBody>
          <ErrorContent errorTxt={errorMsg} />
        </CardBody>
      )}
      {(currentTab === 'Custom' && isDateValue(selectedDate)) && (
        <ErrorContentStatic errorTxt="PLEASE SELECT START AND END DATE" />
      )}
    </React.Fragment>
  );
};

export default AnswersReport;
