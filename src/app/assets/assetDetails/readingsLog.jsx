/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
import {
  Card, CardBody, Table, Modal, ModalBody, Label,
  Row, Col, UncontrolledTooltip, Badge, Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import Select from 'react-select';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import {
  getDefaultNoValue,
  extractTextObject,
} from '../../util/appUtils';
import CreateList from '@shared/listViewFilters/create';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { Tooltip } from 'antd';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import editIcon from '@images/icons/edit.svg';
import filterIcon from '@images/filter.png';
import fileMiniIcon from '@images/icons/fileMini.svg';
import fileMiniDisableIcon from '@images/icons/fileMiniDisable.svg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import SearchList from '@shared/listViewFilters/search';
import AddColumns from '@shared/listViewFilters/columns';
import ExportList from '@shared/listViewFilters/export';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import { Bar, Line } from 'react-chartjs-2';
import { groupByMultiple } from '../../util/staticFunctions';
import AddGaugeLog from './addGaugeLog';
import {
  generateErrorMessage, isArrayValueExists, getPagesCountV2, getCompanyTimezoneDate, getLocalDate, getColumnArrayByDate,
} from '../../util/appUtils';
import SideFilters from '../sidebar/readingsLogSideFilters';
import DataExport from '../dataExport/readingsLogDataExport';
import assetsActions from '../data/assetsActions.json';
import filtersFields from '../data/filtersFields.json';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  getReadingsLogFilters, resetAddReadingLogInfo, resetUpdateEquipment,
} from '../equipmentService';
import {
  getDeleteChecklist, resetDeleteChecklist,
} from '../../adminSetup/maintenanceConfiguration/maintenanceService';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const ReadingsLog = (props) => {
  const {
    editId, types, editData, readingsData,
  } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const [type, setType] = useState(types);
  const [statusValue, setStatusValue] = useState(0);
  const [checkItems, setCheckItems] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [addLogModal, showAddLogModal] = useState(false);
  const [customFilters, setCustomFilters] = useState([]);
  const [customFilterList, setCustomFiltersList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [deleteModal, showDeleteModal] = useState(false);
  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [openEditLogModal, setOpenEditLogModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  const [showChart] = useState(false);
  const [chartValue, setChartValue] = useState('bar');
  const [statistic, setStatistic] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [period, setPeriod] = useState('1');
  const [editDataLog, setEditDataLog] = useState([]);
  const [columns, setColumns] = useState([type === 'space' ? 'space_id' : 'equipment_id', 'reading_id', 'sequence', 'date', 'type', 'value']);
  const [showPopover, setShowPopover] = useState(false)
  const classes = useStyles();

  const {
    readingsLogFilters, readingsLog, readingsLogCount, readingsLogCountLoading, addReadingInfo, updateEquipment,
  } = useSelector((state) => state.equipment);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    userInfo,
  } = useSelector((state) => state.user);
  const {
    checklistDeleteInfo,
  } = useSelector((state) => state.maintenance);

  const onRemoveChecklist = (id) => {
    dispatch(getDeleteChecklist(id, appModels.READINGSLOG));
  };

  const onRemoveChecklistCancel = () => {
    dispatch(resetDeleteChecklist());
    showDeleteModal(false);
  };

  useEffect(() => {
    if (editData) {
      const values = { id: editData.reading_id[0], label: editData.reading_id[1] };
      setFilterData(values);
      setType(types);
    }
  }, [editData]);

  useEffect(() => {
    if (readingsLogFilters && readingsLogFilters.statuses) {
      setCheckItems(readingsLogFilters.statuses);
      setStatusValue(0);
    }
    if (readingsLogFilters && readingsLogFilters.customFilters) {
      setCustomFilters(readingsLogFilters.customFilters);
      const vid = isArrayValueExists(readingsLogFilters.customFilters, 'type', 'id');
      if (vid) {
        if (editId !== vid) {
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [readingsLogFilters]);

  const handleCustomFilterClose = (value) => {
    setOffset(0); setPage(1);
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const states = readingsLogFilters && readingsLogFilters.statuses ? readingsLogFilters.statuses : [];
    const customFiltersList = customFilters.filter((item) => item.key !== value);
    dispatch(getReadingsLogFilters(states, customFiltersList));
  };

  const handleStatusClose = (value) => {
    setOffset(0); setPage(1);
    setStatusValue(value);
    setCheckItems(checkItems.filter((item) => item.id !== value));
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFiltersList(filters);
      const oldCustomFilters = readingsLogFilters && readingsLogFilters.customFilters ? readingsLogFilters.customFilters : [];
      const states = readingsLogFilters && readingsLogFilters.statuses ? readingsLogFilters.statuses : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getReadingsLogFilters(states, customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = readingsLogFilters && readingsLogFilters.customFilters ? readingsLogFilters.customFilters : [];
      const states = readingsLogFilters && readingsLogFilters.statuses ? readingsLogFilters.statuses : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...customFilterList.filter((item) => item !== value)];
      dispatch(getReadingsLogFilters(states, customFiltersData));
    }
  };

  const handleCustomDateChange = (start, end) => {
    const value = 'Custom';
    const filters = [{
      key: value, value, label: value, type: 'customdate', start, end,
    }];
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = readingsLogFilters && readingsLogFilters.customFilters ? readingsLogFilters.customFilters : [];
      const states = readingsLogFilters && readingsLogFilters.statuses ? readingsLogFilters.statuses : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getReadingsLogFilters(states, customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = readingsLogFilters && readingsLogFilters.customFilters ? readingsLogFilters.customFilters : [];
      const states = readingsLogFilters && readingsLogFilters.statuses ? readingsLogFilters.statuses : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...customFilterList.filter((item) => item !== value)];
      dispatch(getReadingsLogFilters(states, customFiltersData));
    }
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    const oldCustomFilters = readingsLogFilters && readingsLogFilters.customFilters ? readingsLogFilters.customFilters : [];
    setCustomFilters(filters);
    const states = readingsLogFilters && readingsLogFilters.statuses ? readingsLogFilters.statuses : [];
    const customFiltersData = [...oldCustomFilters, ...filters];
    resetForm({ values: '' });
    dispatch(getReadingsLogFilters(states, customFiltersData));
  };

  const totalDataCount = readingsLogCount && readingsLogCount.length ? readingsLogCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);
  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
  };

  const onReset = () => {
    dispatch(resetAddReadingLogInfo());
  };

  const loading = (readingsLog && readingsLog.loading) || (readingsLogCountLoading);
  const dateFilters = (readingsLogFilters && readingsLogFilters.customFilters && readingsLogFilters.customFilters.length > 0) ? readingsLogFilters.customFilters : [];
  const checkedItems = (readingsLogFilters && readingsLogFilters.statuses) ? readingsLogFilters.statuses : [];

  let chartData = [];
  const backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ];
  const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

  function checkValue(rdata, date) {
    let value = 0;
    const data = rdata.filter((obj) => (getCompanyTimezoneDate(obj.date, userInfo, 'datetime') === date));
    if (data && data.length) value = data[0].value;
    return value;
  }

  function getMeasureValue(logData, grp, ldate) {
    const measureValue = [];
    if (logData.length > 0) {
      const rdata = logData.filter((obj) => (obj.reading_id && obj.reading_id[0] === grp));
      if (ldate && ldate.length) ldate.map((item) => measureValue.push(checkValue(rdata, item)));
    }
    return measureValue;
  }

  function getLabels(logData) {
    const labels = [];
    if (logData.length > 0) {
      logData.map((obj) => {
        if (!labels.includes(getCompanyTimezoneDate(obj.date, userInfo, 'datetime'))) {
          labels.push(getCompanyTimezoneDate(obj.date, userInfo, 'datetime'));
        }
      });
    }
    return labels;
  }

  const dataSet = [];

  if (readingsLog && readingsLog.data) {
    let { data } = readingsLog;
    if (timeRange !== '' || statistic !== '') {
      data = getColumnArrayByDate(data, userInfo, timeRange, period, statistic);
    }
    const rLogs = groupByMultiple(data, (obj) => obj.reading_id[0]);
    const label = getLabels(data);
    // getColumnArrayByDate(readingsLog.data, 'date', userInfo, 'datetime'),
    if (rLogs.length > 0) {
      rLogs.map((item, i) => dataSet.push(
        {
          label: item[0].reading_id[1],
          fill: false,
          data: getMeasureValue(data, item[0].reading_id[0], label),
          backgroundColor: backgroundColor[i],
          borderColor: borderColor[i],
          borderWidth: 1,
        },
      ));
      chartData = {
        labels: label,
        datasets: dataSet,
      };
    }
  }
  const chartOptions = {
    scales: {
      yAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          stacked: true,
        },
      ],
    },
  };

  return (
    <>
      <Row className="readinglog-row">
        <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className="pt-2">
          {collapse ? (
            <>
              <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer" id="filters" />
              <UncontrolledTooltip target="filters" placement="right">
                Filters
              </UncontrolledTooltip>
            </>
          ) : (
            <SideFilters
              offset={offset}
              id={editId}
              statusValue={statusValue}
              afterReset={() => { setOffset(0); setPage(1); }}
              sortBy={sortBy}
              sortField={sortField}
              columns={columns}
              filterData={filterData}
              setCollapse={setCollapse}
              collapse={collapse}
              readingData={readingsData}
            />
          )}
        </Col>
        <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left pt-2 list' : 'list pt-2'}>
          <Card className={collapse ? 'filter-margin-right p-2 mb-2 h-100 bg-lightblue' : 'p-2 mb-2 h-100 bg-lightblue'}>
            <CardBody className="bg-color-white p-1 mt-2">
              <Row className="p-2">
                <Col md="8" xs="12" sm="8" lg="8">
                  <div className="content-inline">
                    <span className="p-0 mr-2 font-weight-800 font-medium">
                      Reading Logs :
                      {' '}
                      {totalDataCount}
                    </span>
                    {(checkedItems) && checkedItems.map((st) => (
                      <p key={st.id} className="mr-2 content-inline">
                        <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                          {st.label}
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(st.id)} size="sm" icon={faTimesCircle} />
                        </Badge>
                      </p>
                    ))}
                    {customFilters && customFilters.map((cf) => (
                      <p key={cf.key} className="mr-2 content-inline">
                        <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                          {cf.value}
                          {'  '}
                          {cf.type === 'date' ? '(Measure Date)' : ''}
                          {(cf.type === 'id') && (
                            <span>
                              {'  '}
                              &quot;
                              {decodeURIComponent(cf.label)}
                              &quot;
                            </span>
                          )}
                          {(cf.type === 'customdate') && (
                            <span>
                              {' - '}
                              &quot;
                              {getLocalDate(cf.start)}
                              {' - '}
                              {getLocalDate(cf.end)}
                              &quot;
                            </span>
                          )}
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                        </Badge>
                      </p>
                    ))}
                  </div>
                </Col>
                <Col md="4" xs="12" sm="4" lg="4">
                  <div className="float-right">
                    <ListDateFilters
                      dateFilters={dateFilters}
                      onClickRadioButton={handleRadioboxChange}
                      onChangeCustomDate={handleCustomDateChange}
                      idNameFilter="readingDate"
                      classNameFilter="drawerPopover popoverDate"
                    />
                    <SearchList formFields={filtersFields.readingLogFields} searchHandleSubmit={searchHandleSubmit} idNameFilter="readingSearch" classNameFilter="drawerPopover" />
                    <CreateList name="Add an Reading Log" showCreateModal={() => showAddLogModal(true)} />
                    <AddColumns
                      columns={assetsActions.tableLogColumns}
                      handleColumnChange={handleColumnChange}
                      columnFields={columns}
                      idNameFilter="readingColumn"
                      classNameFilter="drawerPopover additional-fields popoverSearch"
                    />
                    <Tooltip title="Export" placement="top">
                      {readingsLog?.data && (
                        <img
                          aria-hidden="true"
                          id="logsExport"
                          alt="logsExport"
                          className="cursor-pointer mr-2"
                          onClick={() => { setShowPopover(true) }}
                          src={fileMiniIcon} />
                      )}
                      {readingsLog && !readingsLog.data && (
                        <img
                          aria-hidden="true"
                          id="logsExport"
                          alt="logsExport"
                          className="exportDisabled mr-2"
                          onClick={() => { setShowPopover(true) }}
                          src={fileMiniDisableIcon} />
                      )}
                    </Tooltip>
                    {showPopover && (<Popover
                      placement="bottom"
                      isOpen={showPopover}
                      target="logsExport"
                      className="drawerPopover"
                    >
                      <PopoverHeader>
                        Export
                        <img
                          aria-hidden="true"
                          alt="close"
                          src={closeCircleIcon}
                          onClick={() => setShowPopover(false)}
                          className="cursor-pointer mr-1 mt-1 float-right"
                        />
                      </PopoverHeader>
                      <PopoverBody><DataExport afterReset={() => setShowPopover(false)} fields={columns} editId={editId} type={types} sortBy={sortBy} sortField={sortField} /></PopoverBody>
                    </Popover>
                    )}
                  </div>
                </Col>
              </Row>
              {(readingsLog && readingsLog.data) && (
                <span data-testid="success-case" />
              )}
              {showChart
                ? (
                  <div className="thin-scrollbar">
                    <Row>
                      <Col md="12" sm="12" lg="3">
                        <Label for="chartType">Type</Label>
                        <Select
                          defaultValue={{ value: 'bar', label: 'Bar' }}
                          name="chartType"
                          id="chartType"
                          className="ml-0 mt-2 mb-2"
                          options={[{ value: 'bar', label: 'Bar' }, { value: 'line', label: 'Line' }]}
                          onChange={(e) => setChartValue(e.value)}
                        />
                      </Col>
                      <Col md="12" sm="12" lg="3">
                        <Label for="statistics">Statistics</Label>
                        <Select
                          defaultValue={{ value: 'average', label: 'Average' }}
                          name="statistics"
                          id="statistics"
                          className="ml-0 mt-2 mb-2"
                          onChange={(e) => setStatistic(e.value)}
                          options={[{ value: 'avg', label: 'Average' },
                          { value: 'min', label: 'Minimum' },
                          { value: 'max', label: 'Maximum' },
                          { value: 'sum', label: 'Sum' }]}
                        />
                      </Col>
                      <Col md="12" sm="12" lg="3">
                        <Label for="timeRange">Time Range</Label>
                        <Select
                          defaultValue={{ value: 'last hour', label: 'Last Hour' }}
                          name="timeRange"
                          id="timeRange"
                          className="ml-0 mt-2 mb-2"
                          onChange={(e) => setTimeRange(e.value)}
                          options={[{ value: '1', label: 'Last Hour' },
                          { value: '3', label: 'Last 3 Hours' },
                          { value: '6', label: 'Last 6 Hours' },
                          { value: '12', label: 'Last 12 Hours' },
                          { value: '24', label: 'Last 24 Hours' },
                          { value: 'last 3 days', label: 'Last 3 Days' },
                          { value: 'last 1 week', label: 'Last 1 Week' },
                          { value: 'last 2 weeks', label: 'Last 2 Weeks' }]}
                        />
                      </Col>
                      <Col md="12" sm="12" lg="3">
                        <Label for="period">Period</Label>
                        <Select
                          defaultValue={{ value: '1 minute', label: '1 Minute' }}
                          name="period"
                          id="period"
                          className="ml-0 mt-2 mb-2"
                          onChange={(e) => setPeriod(e.value)}
                          options={[{ value: '1', label: '1 Minute' },
                          { value: '5', label: '5 Minutes' },
                          { value: '15', label: '15 Minutes' },
                          { value: '60', label: '1 Hour' },
                          { value: '360', label: '6 Hours' },
                          { value: '1440', label: '1 Day' }]}
                        />
                      </Col>
                    </Row>
                    {(readingsLog && readingsLog.data) && (
                      <>
                        {chartValue === 'bar'
                          ? <Bar data={chartData} options={chartOptions} />
                          : <Line data={chartData} options={chartOptions} />}
                      </>
                    )}
                    {loading || pages === 0 ? (<span />) : (
                      <div className={`${classes.root} float-right`}>
                        <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                      </div>
                    )}
                    {readingsLog && readingsLog.loading && (
                      <Loader />
                    )}
                  </div>
                ) : ''}
              {!showChart
                ? (
                  <div className="thin-scrollbar">
                    {(readingsLog && readingsLog.data) && (
                      <Table responsive>
                        <thead className="bg-gray-light">
                          <tr>
                            <th className="w-5 min-width-160">
                              <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('reading_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                Reading
                              </span>
                            </th>
                            <th className="w-5 min-width-200">
                              <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                Measure Date
                              </span>
                            </th>
                            <th className="w-5 min-width-160">
                              <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('value'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                Measure Value
                              </span>
                            </th>
                            <th className="w-5 min-width-100">
                              <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('type'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                Type
                              </span>
                            </th>
                            <th className="w-5 min-width-160">
                              <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('equipment_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                {type === 'space' ? 'Space' : 'Equipment'}
                              </span>
                            </th>
                            {columns.some((selectedValue) => selectedValue.includes('planning_run_result')) && (
                              <th className="min-width-200">
                                <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('planning_run_result'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                  Planning Run Result
                                </span>
                              </th>
                            )}
                            {columns.some((selectedValue) => selectedValue.includes('order_id')) && (
                              <th className="min-width-200">
                                <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('order_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                  Maintenance Order
                                </span>
                              </th>
                            )}
                            <th className="w-5 text-center min-width-100">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {readingsLog.data.map((log) => (
                            <tr key={log.id}>
                              <td className="w-5">{log.reading_id ? log.reading_id[1] : ''}</td>
                              <td className="w-10">{getCompanyTimezoneDate(log.date, userInfo, 'datetime')}</td>
                              <td className="w-10">{log.value}</td>
                              <td className="w-5">{log.type}</td>
                              {type === 'space'
                                ? <td className="w-5">{log.space_id ? log.space_id[1] : ''}</td>
                                : <td className="w-5">{log.equipment_id ? log.equipment_id[1] : ''}</td>}
                              {columns.some((selectedValue) => selectedValue.includes('planning_run_result')) && (
                                <td className="w-10"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(log.planning_run_result)}
                                </span></td>
                              )}
                              {columns.some((selectedValue) => selectedValue.includes('order_id')) && (
                                <td className="w-10"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(log.order_id)}</span></td>
                              )}
                              <td className="w-5 text-center">
                                <Tooltip title="Edit">
                                  <img
                                    aria-hidden="true"
                                    src={editIcon}
                                    className="mr-2 pb-2px cursor-pointer"
                                    height="12"
                                    width="12"
                                    alt="edit"
                                    onClick={() => { setSelectedUser(log.id); setEditDataLog(log); setOpenEditLogModal(true); }}
                                  />
                                </Tooltip>
                                <Tooltip title="Delete ">
                                  <span className="font-weight-400 d-inline-block" />
                                  <FontAwesomeIcon
                                    className="mr-3 ml-1 cursor-pointer"
                                    size="sm"
                                    icon={faTrashAlt}
                                    onClick={() => { setRemoveId(log.id); setRemoveName(log.reading_id ? log.reading_id[1] : ''); showDeleteModal(true); }}
                                  />
                                </Tooltip>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                    {loading || pages === 0 ? (<span />) : (
                      <div className={`${classes.root} float-right`}>
                        <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                      </div>
                    )}
                    {readingsLog && readingsLog.loading && (
                      <Loader />
                    )}
                    {readingsLog && readingsLog.err && (
                      <ErrorContent errorTxt={generateErrorMessage(readingsLog)} />
                    )}
                  </div>
                ) : ''}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Modal size={addReadingInfo && addReadingInfo.data ? 'md' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addLogModal}>
        <ModalHeaderComponent title="Add Reading Log" imagePath={false} closeModalWindow={() => { showAddLogModal(false); }} response={false} />
        <ModalBody className="mt-0 pt-0">
          <AddGaugeLog
            viewId={editId}
            type={type}
            afterReset={() => { showAddLogModal(false); onReset(); }}
            readingsData={readingsData}
          />
        </ModalBody>
      </Modal>
      <Modal size={updateEquipment && updateEquipment.data ? 'md' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={openEditLogModal}>
        <ModalHeaderComponent title="Edit Reading Log" imagePath={false} closeModalWindow={() => { setOpenEditLogModal(false); dispatch(resetUpdateEquipment()); }} response={false} />
        <ModalBody className="mt-0 pt-0">
          <AddGaugeLog
            viewId={editId}
            type={type}
            editData={editDataLog}
            selectedUser={selectedUser}
            afterReset={() => { setOpenEditLogModal(false); onReset(); }}
          />
        </ModalBody>
      </Modal>
      <Modal size={(checklistDeleteInfo && checklistDeleteInfo.data) ? 'sm' : 'lg'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={deleteModal}>
        <ModalHeaderComponent title="Delete Reading Logs" imagePath={false} closeModalWindow={() => onRemoveChecklistCancel()} response={checklistDeleteInfo} />
        <ModalBody className="mt-0 pt-0">
          {checklistDeleteInfo && (!checklistDeleteInfo.data && !checklistDeleteInfo.loading && !checklistDeleteInfo.err) && (
            <p className="text-center">
              {`Are you sure, you want to remove ${removeName} reading logs ?`}
            </p>
          )}
          {checklistDeleteInfo && checklistDeleteInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
          )}
          {(checklistDeleteInfo && checklistDeleteInfo.err) && (
            <SuccessAndErrorFormat response={checklistDeleteInfo} />
          )}
          {(checklistDeleteInfo && checklistDeleteInfo.data) && (
            <SuccessAndErrorFormat response={checklistDeleteInfo} successMessage="Reading Logs removed successfully.." />
          )}
          <div className="pull-right mt-3">
            {checklistDeleteInfo && !checklistDeleteInfo.data && (
              <Button size="sm" disabled={checklistDeleteInfo && checklistDeleteInfo.loading}  variant="contained" onClick={() => onRemoveChecklist(removeId)}>Confirm</Button>
            )}
            {checklistDeleteInfo && checklistDeleteInfo.data && (
              <Button size="sm"  variant="contained" onClick={() => onRemoveChecklistCancel()}>Ok</Button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

ReadingsLog.defaultProps = {
  editId: undefined,
};

ReadingsLog.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  types: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  readingsData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default ReadingsLog;
