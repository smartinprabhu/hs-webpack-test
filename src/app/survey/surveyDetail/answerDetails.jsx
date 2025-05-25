/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useMemo, useState } from 'react';
import {
  faAngleDown, faTimesCircle, faFileExcel, faArrowAltCircleLeft, faArrowAltCircleRight,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ErrorContent from '@shared/errorContent';
import ErrorContentStatic from '@shared/errorContentStatic';
import Loader from '@shared/loading';
import { Space } from 'antd';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardBody, Col, Row,
  Spinner, Input, Badge,
} from 'reactstrap';
import {
  Box, Grid, Button, Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import { convertUtcTimetoCompanyTimeZone } from '@shared/dateTimeConvertor';

import {
  setInitialValues,
} from '../../purchase/purchaseService';
import {
  extractNameObject, generateErrorMessage, getAllowedCompanies, getCompanyTimezoneDate, getCompanyTimezoneDateExportTime, getDateAndTimeForDifferentTimeZones, getDatesOfQueryWithUtc, truncate, getDefaultNoValue, numToFloat,
  getDatePickerFormat, getListOfModuleOperations, exportExcelTableToXlsx,
} from '../../util/appUtils';
import ViewAnswersDataTable from '../dataExport/viewAnswersDataTable';

import { getExportFileName } from '../../util/getDynamicClientData';
import { groupByMultiple } from '../../util/staticFunctions';
import dateFilter from '../surveyOverview/datefilter.json';
import {
  getAnswersListInPDF, getAnswersDetailsCount, setActive, getAnswersDetails, clearAnswersData,
} from '../surveyService';
import tableFields from './printFields.json';
import { AddThemeBackgroundColor } from '../../themes/theme';
import actionCodes from '../data/actionCodes.json';

const dataFields = tableFields.fields;
const appModels = require('../../util/appModels').default;

const AnswerDetails = (props) => {
  const {
    afterReset, closeDrawer,
  } = props;
  const dispatch = useDispatch();
  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);
  const [load, setLoad] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [userName, setUserName] = useState('');
  // const [currentTab, setActive] = useState('This month');
  const [open, setOpen] = React.useState(false);
  const [selectedDate, handleDateChange] = React.useState([null, null]);
  const [exportType, setExportType] = useState('');
  const [isButtonHover, setButtonHover] = useState(false);
  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const [exceldataFields, setExceldataFields] = useState([]);
  const [filteredExceldataFields, setFilteredExceldataFields] = useState([]);

  const [offset, setOffset] = useState(0);
  const [jumpCount, setJumpCount] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    surveyDetails,
    answerDetails,
    currentTab,
    answersListExport,
    answersListCount,
  } = useSelector((state) => state.survey);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Survey', 'code');
  const isDownloadable = allowedOperations.includes(actionCodes['Download Answers']);

  const exportFileName = getExportFileName('Survey_On');

  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';

  const surveyTitle = surveyDetails && (surveyDetails.data && surveyDetails.data.length > 0) ? truncate(surveyDetails.data[0].title, 35) : 'Survey';

  const companySurvey = surveyDetails && surveyDetails.data && surveyDetails.data.length > 0 && surveyDetails.data[0].company_id && surveyDetails.data[0].company_id.length > 0 ? surveyDetails.data[0].company_id[1] : '';

  const isAnsDataExport = answersListExport && answersListExport.data && answersListExport.data.length ? answersListExport.data : false;

  const isData = answerDetails && answerDetails.data && answerDetails.data.length ? answerDetails.data[0] : false;

  function getLocationName() {
    let res = '-';
    if (isData.location_id && isData.location_id.id) {
      res = isData.location_id.path_name;
    } else if (isData.equipment_id && isData.equipment_id.id && isData.equipment_id.location_id.id && isData.equipment_id.location_id.path_name) {
      res = isData.equipment_id.location_id.path_name;
    }
    return res;
  }

  function getLocationExcelName(data) {
    let res = '-';
    if (data.location_id && data.location_id.id) {
      res = data.location_id.path_name;
    } else if (data.equipment_id && data.equipment_id.id && data.equipment_id.location_id.id && data.equipment_id.location_id.path_name) {
      res = data.equipment_id.location_id.path_name;
    }
    return res;
  }

  function getBlockName() {
    let res = '-';
    if (isData.location_id && isData.location_id.id && isData.location_id.block_id && isData.location_id.block_id.space_name) {
      res = isData.location_id.block_id.space_name;
    } else if (isData.equipment_id && isData.equipment_id.id && isData.equipment_id.location_id.id && isData.equipment_id.block_id && isData.equipment_id.block_id.space_name) {
      res = isData.equipment_id.block_id.space_name;
    }
    return res;
  }

  function getBlockExcelName(data) {
    let res = '-';
    if (data.location_id && data.location_id.id && data.location_id.block_id && data.location_id.block_id.space_name) {
      res = data.location_id.block_id.space_name;
    } else if (data.equipment_id && data.equipment_id.id && data.equipment_id.location_id.id && data.equipment_id.block_id && data.equipment_id.block_id.space_name) {
      res = data.equipment_id.block_id.space_name;
    }
    return res;
  }

  function getFloorName() {
    let res = '-';
    if (isData.location_id && isData.location_id.id && isData.location_id.floor_id && isData.location_id.floor_id.space_name) {
      res = isData.location_id.floor_id.space_name;
    } else if (isData.equipment_id && isData.equipment_id.id && isData.equipment_id.location_id.id && isData.equipment_id.floor_id && isData.equipment_id.floor_id.space_name) {
      res = isData.equipment_id.floor_id.space_name;
    }
    return res;
  }

  function getFloorExcelName(data) {
    let res = '-';
    if (data.location_id && data.location_id.id && data.location_id.floor_id && data.location_id.floor_id.space_name) {
      res = data.location_id.floor_id.space_name;
    } else if (data.equipment_id && data.equipment_id.id && data.equipment_id.location_id.id && data.equipment_id.floor_id && data.equipment_id.floor_id.space_name) {
      res = data.equipment_id.floor_id.space_name;
    }
    return res;
  }

  const sortSections = (dataSections) => {
    const dataSectionsNew = dataSections.sort(
      (a, b) => a.question_id.sequence - b.question_id.sequence,
    );
    return dataSectionsNew;
  };

  const uniqueQuestions = (dataSections) => {
    const dataSectionsNew = [...new Map(dataSections.map((v) => [v.question_id.id, v])).values()];
    return dataSectionsNew;
  };

  useEffect(() => {
    // dispatch(setActive('Today'));
  }, []);

  function exportTableToExcel(tableID, fileTitle = '') {
    try {
      const dataType = 'application/vnd.ms-excel';
      const tableSelect = document.getElementById(tableID);
      const tableHTML = tableSelect.outerHTML;

      // Specify file name
      const fileName = fileTitle ? `${fileTitle}.xls` : 'excel_data.xls';

      // Create download link element
      const downloadLink = document.createElement('a');

      document.body.appendChild(downloadLink);

      const blob = new Blob(['\ufeff', tableHTML], { type: dataType });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
        setExportType('');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const handlePDFExport = (tableID, fileTitle = '') => {
    setTimeout(() => {
      const content = document.getElementById(tableID);
      const pri = document.getElementById('print_frame').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML);
      pri.document.close();
      pri.focus();
      pri.print();
      setExportType('');
    }, 2000);
  };

  useMemo(() => {
    const questionsData = [];
    if (surveyDetails) {
      questionsData.push({ id: 'Quiz Score', uid: 11115, heading: 'Quiz Score' });
      if (surveyDetails && surveyDetails.data && surveyDetails.data[0] && (surveyDetails.data[0].has_reviwer_name === 'Optional' || surveyDetails.data[0].has_reviwer_name === 'Required')) {
        questionsData.push({ id: 'UserName', uid: 11110, heading: 'UserName' });
      }
      if (surveyDetails && surveyDetails.data && surveyDetails.data[0] && (surveyDetails.data[0].has_tenant === 'Optional' || surveyDetails.data[0].has_tenant === 'Required')) {
        questionsData.push({ id: 'Tenant', uid: 11122, heading: 'Tenant' });
      }
      if (surveyDetails && surveyDetails.data && surveyDetails.data[0] && (surveyDetails.data[0].has_employee_code === 'Optional' || surveyDetails.data[0].has_employee_code === 'Required')) {
        questionsData.push({ id: 'Employee ID', uid: 11111, heading: 'Employee ID' });
      }
      if (surveyDetails && surveyDetails.data && surveyDetails.data[0] && (surveyDetails.data[0].has_reviwer_email === 'Optional' || surveyDetails.data[0].has_reviwer_email === 'Required')) {
        questionsData.push({ id: 'Email', uid: 11112, heading: 'Email' });
      }
      if (surveyDetails && surveyDetails.data && surveyDetails.data[0] && (surveyDetails.data[0].has_reviwer_mobile === 'Optional' || surveyDetails.data[0].has_reviwer_mobile === 'Required')) {
        questionsData.push({ id: 'Mobile', uid: 11113, heading: 'Mobile' });
      }
      questionsData.push({ id: 'Site', uid: 11119, heading: 'Site' });
      questionsData.push({ id: 'Block', uid: 11116, heading: 'Block' });
      questionsData.push({ id: 'Floor', uid: 11117, heading: 'Floor' });
      questionsData.push({ id: 'Location', uid: 11118, heading: 'Location' });
    }
    if (isAnsDataExport && answersListExport.data && answersListExport.data.length) {
      answersListExport.data.length && answersListExport.data.map((rev, index1) => {
        rev && rev.user_input_line_ids.length && sortSections(rev.user_input_line_ids[0]).map((questions, index) => {
          if (questions.question_id) {
            questionsData.push({ uid: questions.question_id.id, id: `question${index1}`, heading: questions.question_id.question });
          }
        });
      });
      questionsData.push({
        id: 'Answered On', uid: 11114, heading: 'Answered On', type: 'datetime',
      });
    }
    setExceldataFields(questionsData);

    setTimeout(() => {
      if (exportType === 'excel' && isAnsDataExport && answersListExport.data && answersListExport.data.length) {
        exportExcelTableToXlsx('print_report_survey', exportFileName);
        // if (afterReset) afterReset();
        dispatch(setInitialValues(false, false, false, false));
      } else if (exportType === 'pdf' && isAnsDataExport && answersListExport.data && answersListExport.data.length) {
        handlePDFExport('print_report_survey', exportFileName);
        // if (afterReset) afterReset();
        dispatch(setInitialValues(false, false, false, false));
      }
    }, 1000);
  }, [answersListExport]);

  useEffect(() => {
    if (exceldataFields && exceldataFields.length) {
      const uniqueAuthors = [...new Map(exceldataFields.map((v) => [v.uid, v])).values()];
      setFilteredExceldataFields(uniqueAuthors);
    }
  }, [exceldataFields]);

  useEffect(() => {
    if (currentTab === 'Custom') {
      dispatch(clearAnswersData());
    }
  }, [currentTab]);

  useEffect(() => {
    if (surveyDetails && surveyDetails.data && surveyDetails.data.length && surveyDetails.data.length > 0 && start && end) {
      const { id } = surveyDetails.data[0];
      dispatch(getAnswersDetails(companies, appModels.SURVEYUSERINPUTS, id, start, end, offset, searchValue));
    }
  }, [surveyDetails, start, end, currentTab, offset, searchValue]);

  useEffect(() => {
    if (surveyDetails && surveyDetails.data && surveyDetails.data.length && surveyDetails.data.length > 0 && start && end) {
      const { id } = surveyDetails.data[0];
      dispatch(getAnswersDetailsCount(companies, appModels.SURVEYUSERINPUTS, id, start, end, searchValue));
    }
  }, [surveyDetails, start, end, currentTab, searchValue]);

  useEffect(() => {
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
    setOffset(0);
    setJumpCount('');
  }, [userInfo, currentTab]);

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        const getDateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, selectedDate[0]?.$d, selectedDate[1]?.$d);
        const start = getDateRangeObj[0];
        const end = getDateRangeObj[1];
        setStart(start);
        setEnd(end);
      }
    }
  }, [selectedDate]);

  const onDateRangeChange = (dates, datesString) => {
    dispatch(clearAnswersData([]));
    setStart('');
    setEnd('');
    handleDateChange(dates);
  };

  const loading = (answerDetails && answerDetails.loading);

  const isErrAnswerDetail = !loading && answerDetails && answerDetails.data && !answerDetails.data.length;

  const activeTab = (item) => {
    dispatch(clearAnswersData([]));
    setStart('');
    setEnd('');
    setSearchValue('');
    setOffset(0);
    setJumpCount('');
    dispatch(setActive(item));
  };

  const activeTab1 = (item) => {
    dispatch(clearAnswersData([]));
    setStart('');
    setEnd('');
    setSearchValue('');
    setOffset(0);
    setJumpCount('');
    dispatch(setActive(item));
  };

  const totalLength = answersListCount && answersListCount.data && answersListCount.data.length ? answersListCount.data.length : 0;

  const onOffesetSearchChange = (e) => {
    if (e.key === 'Enter' && (parseInt(e.target.value) - 1) < totalLength) {
      setOffset(e.target.value > 0 ? parseInt(e.target.value) - 1 : 0);
    }
    if ((parseInt(e.target.value)) > totalLength) {
      e.preventDefault();
      return false;
    }
    setJumpCount(e.target.value);
  };

  const onNameSearchChange = (e) => {
    if (e.key === 'Enter') {
      setSearchValue(e.target.value);
      setOffset(0);
      setJumpCount('');
    }
  };

  function getAnswerValue(obj) {
    let res = '';
    if (obj.answer_type === 'number') {
      res = obj.value_number;
    } else if (obj.answer_type === 'date') {
      res = obj.value_date;
    } else if (obj.answer_type === 'suggestion') {
      res = extractNameObject(obj.value_suggested, 'value');
    } else if (obj.answer_type === 'text') {
      res = obj.value_text;
    } else if (obj.answer_type === 'free_text') {
      res = obj.value_free_text;
    }
    return res;
  }

  function findAnswerOn() {
    let res = isData && isData.date_create ? isData.date_create : '';
    if (isData && isData.user_input_line_ids && isData.user_input_line_ids.length) {
      const data = uniqueQuestions(isData.user_input_line_ids);
      data.sort((a, b) => new Date(b.date_create) - new Date(a.date_create));
      res = data[0].date_create;
    }
    return res;
  }

  function findAnswerOnExport(arr, initialDate) {
    let res = initialDate;
    if (arr && arr.length) {
      const data = uniqueQuestions(arr);
      data.sort((a, b) => new Date(b.date_create) - new Date(a.date_create));
      res = data[0].date_create;
    }
    return res;
  }

  const getExcelNewArray = (array) => {
    const bodyObj = [];
    if (array && array.length > 0) {
      const ansObj = [];

      for (let i = 0; i < array.length; i += 1) {
        const val = [];
        const ansData = array[i].user_input_line_ids;
        val['Quiz Score'] = array[i].quizz_score;
        val.UserName = array[i].reviwer_name && array[i].reviwer_name ? array[i].reviwer_name : '-';
        val.Email = array[i].email ? array[i].email : '-';
        val['Employee ID'] = array[i].employee_code ? array[i].employee_code : '-';
        val.Tenant = array[i].partner_id && array[i].partner_id.display_name ? array[i].partner_id.display_name : '-';
        val.Mobile = array[i].reviwer_mobile ? array[i].reviwer_mobile : '-';
        val.Site = companySurvey;
        val.Block = getBlockExcelName(array[i]);
        val.Floor = getFloorExcelName(array[i]);
        val.Location = getLocationExcelName(array[i]);
        const answerObj = [];
        let ansDate = array[i].date_create;
        if (ansData && ansData.length) {
          for (let j = 0; j < ansData.length; j += 1) {
            ansDate = findAnswerOnExport(ansData[j], array[i].date_create);
            const ansObjectLoop = sortSections(ansData[j]);
            for (let k = 0; k < ansObjectLoop.length; k += 1) {
              if (answerObj[`${ansObjectLoop[k].question_id.question}`]) {
                answerObj[`${ansObjectLoop[k].question_id.question}`] = ansObjectLoop[k] && ansObjectLoop[k].value_suggested ? getDefaultNoValue(getAnswerValue(ansObjectLoop[k])) : '-';
              } else {
                answerObj[`${ansObjectLoop[k].question_id.question}`] = ansObjectLoop[k] && ansObjectLoop[k].value_suggested ? getDefaultNoValue(getAnswerValue(ansObjectLoop[k])) : '-';
              }
              // answerObj['Answered On'] = ansObjectLoop[k] && ansObjectLoop[k].date_create ? getDefaultNoValue(exportType === 'pdf' ? getCompanyTimezoneDate(ansObjectLoop[k] && ansObjectLoop[k].date_create, userInfo, 'datetime') : getCompanyTimezoneDateExportTime(ansObjectLoop[k] && ansObjectLoop[k].date_create, userInfo, 'datetime')) : '-';
            }
          }
          val.questionsArray = answerObj;
          val['Answered On'] = getDefaultNoValue(exportType === 'pdf' ? getCompanyTimezoneDate(ansDate, userInfo, 'datetime') : getCompanyTimezoneDateExportTime(ansDate, userInfo, 'datetime'));
          bodyObj.push(val);
        }
      }
    }
    return bodyObj;
  };

  const onExport = () => {
    if (surveyDetails && surveyDetails.data && surveyDetails.data.length) {
      const { id } = surveyDetails.data[0];
      setExportType('excel');
      // const getName = isData && isData.map((asset) => asset.reviwer_name);
      dispatch(getAnswersListInPDF(companies, appModels.SURVEYUSERINPUTS, id, false, start, end, totalLength, searchValue));
    }
  };

  const onPdfExport = () => {
    if (surveyDetails && surveyDetails.data && surveyDetails.data.length) {
      const { id } = surveyDetails.data[0];
      setExportType('pdf');
      // const getName = isData && isData.map((asset) => asset.reviwer_name);
      dispatch(getAnswersListInPDF(companies, appModels.SURVEYUSERINPUTS, id, false, start, end, totalLength, searchValue));
    }
  };

  const totalScoreSurvey = surveyDetails && surveyDetails.data && surveyDetails.data.length && surveyDetails.data.length > 0 ? surveyDetails.data[0].total_score_survey : 0;

  function getTotalScore() {
    let count = 0;
    const countMembers = isData && isData.length;
    count = totalScoreSurvey * totalLength;
    return totalScoreSurvey; // return column data..
  }

  function getTotalScoreMembers() {
    let count = 0;
    /* const array = isData && isData.user_input_line_ids && sortSections(uniqueQuestions(isData.user_input_line_ids));
    console.log(array);
    for (let i = 0; i < array.length; i += 1) {
      count += array[i].quizz_score;
    } */
    if (isData && isData.quizz_score) {
      count = isData.quizz_score;
    }
    return count; // return column data..
  }

  function getArrayToCommaValues(array, key, obj) {
    let ids = '';
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        if (array[i].id !== '') {
          if (obj.question_id.id === array[i].question_id.id) {
            ids += `${extractNameObject(array[i][key], 'value')},`;
          }
        }
      }
      ids = ids.substring(0, ids.length - 1);
    }
    return ids;
  }

  const handleCustomFilterClose = () => {
    setSearchValue('');
    setOffset(0);
    setJumpCount('');
  };

  const isDateValue = (date) => {
    let value = false;
    if (date && date.length > 0) {
      if (date[0] === null || date[1] === null) {
        value = true;
      }
    }
    return value;
  };

  const pages = isData && isData.user_input_line_ids ? groupByMultiple(uniqueQuestions(isData.user_input_line_ids), (obj) => (obj.page_id && obj.page_id.title ? obj.page_id.title : '')) : [];

  function getPageQuestions(arr, title) {
    let res = [];
    const data = arr.filter((item) => item.page_id && item.page_id.title && item.page_id.title === title);
    if (data && data.length) {
      res = data;
    }
    return res;
  }

  const companyTimeZone = userInfo && userInfo.data && userInfo.data.company.timezone;
  const startFilter = convertUtcTimetoCompanyTimeZone(start, 'DD-MM-YYYY', companyTimeZone);
  const endFilter = convertUtcTimetoCompanyTimeZone(end, 'DD-MM-YYYY', companyTimeZone);
  const searchFilter = searchValue ? `, Filter : "${searchValue}"` : '';
  const appliedFilters = startFilter !== endFilter ? `${currentTab}: (${startFilter})-(${endFilter}) ${searchFilter}` : `${currentTab}: (${startFilter}) ${searchFilter}`;

  return (
    <div data-testid="success-case" className="small-table-list thin-scrollbar">
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="ml-1 mb-1">
          <span className="px-3">
            <Space>
              {dateFilter && dateFilter.buttonList.map((item) => (
                item.name === 'Custom'
                  ? (
                    <Button
                      key={item.id}
                      className="py-0 px-1"
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
                      key={item.id}
                      className="py-0 px-1"
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
          <div className={`float-right pr-0 mr-2 pr-3 ${currentTab && currentTab === 'Custom' ? 'mt-3' : ''}`}>
            {isData && isDownloadable && (
              <>
                <Button
                  onClick={() => onExport()}
                  size="sm"
                  className="py-0 px-1 mr-2"
                  variant="outlined"
                >
                  <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faFileExcel} />
                  <span className="mr-2">Excel Download</span>
                  {answersListExport && answersListExport.loading && (
                  <Spinner size="sm" color="dark" className="mr-2" />
                  )}
                </Button>
                <Button
                  onClick={() => onPdfExport()}
                  size="sm"
                  className="py-0 px-1"
                  variant="outlined"
                >
                  <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faFilePdf} />
                  <span className="mr-2">PDF Download</span>
                  {answersListExport && answersListExport.loading && (
                  <Spinner size="sm" color="dark" className="mr-2" />
                  )}
                </Button>
              </>
            )}
          </div>
        </Col>
      </Row>
      {!loading && isData && totalScoreSurvey && totalScoreSurvey !== 0 && totalScoreSurvey !== '' ? (
        <Row className="score-sub-cards mb-4">
          <Col sm="6" md="6" lg="6" xs="6">
            <Card className="border-0 bg-med-blue p-2 h-100 text-center">
              <CardBody className="p-2">
                {getTotalScoreMembers()}
                {' '}
                /
                {' '}
                <span className="font-tiny">{getTotalScore()}</span>
              </CardBody>
              <div>
                <span className="font-weight-700">Overall Score</span>
              </div>
            </Card>
          </Col>
          <Col sm="6" md="6" lg="6" xs="6">
            <Card className="border-0 bg-med-blue p-2 h-100 text-center">
              <CardBody className="p-2">
                {numToFloat(
                  (getTotalScoreMembers() / getTotalScore()) * 100,
                )}
              </CardBody>
              <div>
                <span className="font-weight-700">Overall Percentage (%)</span>
              </div>
            </Card>
          </Col>
        </Row>
      )
        : ''}
      {!loading && isData && totalScoreSurvey && totalScoreSurvey !== 0 && totalScoreSurvey !== '' ? (
        <Row className="score-sub-cards mb-4">
          <Col sm="6" md="6" lg="6" xs="6">
            <Card className="border-0 bg-med-blue p-2 h-100 text-center">
              <CardBody className="p-2">
                {getTotalScoreMembers()}
                {' '}
                /
                {' '}
                <span className="font-tiny">{getTotalScore()}</span>
              </CardBody>
              <div>
                <span className="font-weight-700">Overall Score</span>
              </div>
            </Card>
          </Col>
          <Col sm="6" md="6" lg="6" xs="6">
            <Card className="border-0 bg-med-blue p-2 h-100 text-center">
              <CardBody className="p-2">
                {numToFloat(
                  (getTotalScoreMembers() / getTotalScore()) * 100,
                )}
              </CardBody>
              <div>
                <span className="font-weight-700">Overall Percentage (%)</span>
              </div>
            </Card>
          </Col>
        </Row>
      ) : ''}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div className="hidden-div" id="print_report_survey">
          {(exportType === 'excel' || exportType === 'pdf') && (
            <table align="center">
              <tbody>
                <tr>
                  <td align="center" colSpan={3}>{companyName}</td>
                </tr>
                <tr>
                  <td align="center" colSpan={3}>{`${surveyTitle}-View Answers Report`}</td>
                </tr>
                <tr>
                  <td align="center" colSpan={3}>{appliedFilters}</td>
                </tr>
              </tbody>
            </table>
          )}
          <br />
          {(exportType === 'excel' || exportType === 'pdf') ? (
            <ViewAnswersDataTable columns={filteredExceldataFields} data={isAnsDataExport && isAnsDataExport.length > 0 ? getExcelNewArray(isAnsDataExport.reverse()) : []} />
          ) : ''}
        </div>
        <iframe name="print_frame" title="Survey_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      </Col>
      <Card className="border-0">
        {loading && (
          <div className="mb-2 mt-4">
            <Loader />
          </div>
        )}
        {((answerDetails && answerDetails.err) || isErrAnswerDetail) && searchValue && (
          <Row>
            <Col md="3" sm="12" lg="3" className="page-actions-header content-center">
              <Badge color="dark" className="ml-2 p-2 mb-1 bg-zodiac">
                {searchValue}
                <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose()} size="sm" icon={faTimesCircle} />
              </Badge>
            </Col>
          </Row>
        )}
        {(answerDetails && answerDetails.err && !(currentTab === 'Custom' && isDateValue(selectedDate))) && (
          <ErrorContent errorTxt={generateErrorMessage(answerDetails)} />
        )}
        {(isErrAnswerDetail && !(currentTab === 'Custom' && isDateValue(selectedDate))) && (
          <ErrorContent errorTxt="No Data Found" />
        )}
        {(currentTab === 'Custom' && isDateValue(selectedDate)) && (
          <ErrorContentStatic errorTxt="PLEASE SELECT START AND END DATE" />
        )}
        {!(currentTab === 'Custom' && isDateValue(selectedDate)) && isData && (
          <div className="p-3">
            <Box
              sx={AddThemeBackgroundColor({
                width: '100%',
                height: 'auto',
                padding: '20px',
                alignItems: 'center',
                fontFamily: 'Suisse Intl',
                color: '#fff',
                fontSize: '18px',
                paddingTop: '12px',
              })}
              className="ml-1"
            >
              <Row>
                <Col md="12" sm="12" lg="12">
                  <Row>
                    <Col md="9" sm="12" lg="9" className="page-actions-header content-center">
                      Reviewers:
                      {' '}
                      {offset + 1}
                      {' '}
                      /
                      {totalLength}
                      {'  '}
                      {'  '}
                      {(!searchValue && parseInt(totalLength) > 10) && (
                        <Input type="text" id="quantity" vlaue={searchValue} placeholder="Search" onKeyDown={onNameSearchChange} onChange={onNameSearchChange} maxLength="50" className="ml-2" style={{ width: '30%' }} />
                      )}
                      {searchValue && (
                        <Badge color="dark" className="ml-2 p-2 mb-1 bg-zodiac">
                          {searchValue}
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose()} size="sm" icon={faTimesCircle} />
                        </Badge>
                      )}
                    </Col>
                    <Col md="3" sm="12" lg="3" style={{ right: '-10%' }}>
                      <div className="page-actions-header content-center">
                        {parseInt(offset) > 0 && (
                          <FontAwesomeIcon onClick={() => { setOffset(offset - 1); setJumpCount(''); }} className="mr-2 cursor-pointer" color="primary" size="lg" icon={faArrowAltCircleLeft} />
                        )}
                        {/* parseInt(totalLength) > 10 && (
                          <Input type="text" id="quantity" value={jumpCount} placeholder="Jump to" onKeyPress={integerKeyPress} onKeyDown={onOffesetSearchChange} onChange={onOffesetSearchChange} maxLength="4" className="" style={{ width: '30%' }} />
                        ) */}
                        {parseInt(offset + 1) < parseInt(totalLength) && (
                          <FontAwesomeIcon className="ml-2 mr-2 cursor-pointer" onClick={() => { setOffset(offset + 1); setJumpCount(''); }} color="primary" size="lg" icon={faArrowAltCircleRight} />
                        )}
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Box
                sx={{
                  color: '#fff',
                  padding: '5px',
                }}
              >
                <Grid container spacing={1}>
                  {/* First Row */}
                  <Grid item xs={3}>
                    <Typography className="font-family-tab" variant="body2">
                      <strong>Quiz Score:</strong>
                      {' '}
                      {isData.quizz_score}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography className="font-family-tab" variant="body2">
                      <strong>Name:</strong>
                      {' '}
                      {getDefaultNoValue(isData.reviwer_name)}
                    </Typography>
                  </Grid>
                  {(surveyDetails && surveyDetails.data && surveyDetails.data[0] && (surveyDetails.data[0].has_employee_code === 'Optional' || surveyDetails.data[0].has_employee_code === 'Required')) && (
                  <Grid item xs={3}>
                    <Typography className="font-family-tab" variant="body2">
                      <strong>Employee ID:</strong>
                      {' '}
                      {getDefaultNoValue(isData.employee_code)}
                    </Typography>
                  </Grid>
                  )}
                  {(surveyDetails && surveyDetails.data && surveyDetails.data[0] && (surveyDetails.data[0].has_reviwer_email === 'Optional' || surveyDetails.data[0].has_reviwer_email === 'Required')) && (
                  <Grid item xs={3}>
                    <Typography className="font-family-tab" variant="body2">
                      <strong>Email:</strong>
                      {' '}
                      <span className="font-tiny">{getDefaultNoValue(truncate(isData.email, 30))}</span>
                    </Typography>
                  </Grid>
                  )}

                  {/* Second Row */}
                  <Grid item xs={3}>
                    <Typography className="font-family-tab" variant="body2">
                      <strong>Site:</strong>
                      {' '}
                      {companySurvey}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography className="font-family-tab" variant="body2">
                      <strong>Block:</strong>
                      {' '}
                      {getBlockName()}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography className="font-family-tab" variant="body2">
                      <strong>Floor:</strong>
                      {' '}
                      {getFloorName()}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography className="font-family-tab" variant="body2">
                      <strong>Location:</strong>
                      {' '}
                      <span className="font-tiny">{getLocationName()}</span>
                    </Typography>
                  </Grid>

                  {(surveyDetails && surveyDetails.data && surveyDetails.data[0] && (surveyDetails.data[0].has_tenant === 'Optional' || surveyDetails.data[0].has_tenant === 'Required')) && (
                  <Grid item xs={3}>
                    <Typography className="font-family-tab" variant="body2">
                      <strong>Tenant:</strong>
                      {' '}
                      {getDefaultNoValue(isData.partner_id && isData.partner_id.display_name ? isData.partner_id.display_name : '')}
                    </Typography>
                  </Grid>
                  )}
                  <Grid item xs={3}>
                    <Typography className="font-family-tab" variant="body2">
                      <strong>Answered On:</strong>
                      {' '}
                      {getCompanyTimezoneDate(findAnswerOn(), userInfo, 'datetime')}
                    </Typography>
                  </Grid>

                </Grid>
              </Box>

            </Box>
          </div>
        )}
      </Card>
      {!(currentTab === 'Custom' && isDateValue(selectedDate)) && isData && (
        <div className="p-3">
          <Box>
            <Card className="border-0">
              {(isData && isData.user_input_line_ids && pages && pages.length > 0) && pages.map((pg) => (
                <>
                  <Typography className="mb-2">
                    <span className="font-weight-800">
                      {extractNameObject(pg[0].page_id, 'title')}
                    </span>
                  </Typography>
                  {isData && isData.user_input_line_ids && getPageQuestions(sortSections(uniqueQuestions(isData.user_input_line_ids)), pg[0].page_id.title).map((item, index) => (
                    <div className="p-2" key={item.id}>
                      <Typography className="m-0">
                        <span className="font-weight-800 mr-2">{`Q${index + 1})`}</span>
                        {extractNameObject(item.question_id, 'question')}
                      </Typography>
                      <Typography className="mt-2 ml-4 pl-3 font-weight-600">
                        {getAnswerValue(item, isData.user_input_line_ids)}
                      </Typography>
                      <hr className="mt-2" />
                    </div>
                  ))}
                </>
              ))}
            </Card>
          </Box>
        </div>
      )}
    </div>
  );
};

AnswerDetails.propTypes = {
  afterReset: PropTypes.func.isRequired,
  closeDrawer: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
};
export default AnswerDetails;
