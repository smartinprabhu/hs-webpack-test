/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */

import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import {
  Badge, Card, CardTitle, CardBody, Col, Label, Input, Row, Popover, PopoverHeader, PopoverBody, Table,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import moment from 'moment-timezone';
import { DatePicker, Tooltip } from 'antd';
import 'antd/dist/antd.css';

import editIcon from '@images/icons/edit.svg';
import closeCircleIcon from '@images/icons/circleClose.svg';
import Loader from '@shared/loading';
import { getCompanyTimeZoneDate, getDateFormat } from '@shared/dateTimeConvertor';

import actionCodes from './data/adminMaintenanceActionCodes.json';
import {
  getPagesCountV2, getColumnArrayByIdAndKey, isArrayValueExists,
  generateErrorMessage, getDefaultNoValue,
  getListOfOperations,
} from '../util/appUtils';
import ErrorContent from '../shared/errorContent';
import SideFilters from './sidebar/sideFilters';
import DataExport from './dataExport/dataExport';
import {
  getCleaningWorkorderFilter, getCheckedRows, clearCleaning,
} from './adminMaintenanceService';
import ConfirmCleaningModalWindow from './confirmCleaningModalWindow';
import '../employees/employees.scss';
import maintenanceActionCodes from './data/maintenanceActionCodes.json';
import tableHeadings from './tableHeadMaintainence.json';
// import '../booking/createBooking/calendar.scss'
import SpaceNavbar from '../spaceManagement/navbar/spaceNavbar';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));
const { RangePicker } = DatePicker;

const Workorders = () => {
  const limit = 10;
  const subMenu = 1;
  const spaceSubMenu = 'Booking Maintenance';
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [statusValue, setStatusValue] = useState(0);
  const [workorderStatusValue, setWorkorderStatusValue] = useState(0);
  const [typeValue, setTypeValue] = useState(0);
  const [workValue, setWorkValue] = useState('');
  const [checkItems, setCheckItems] = useState([]);
  const [workorderItems, setWorkorderItems] = useState([]);
  const [typeItems, setCheckTypes] = useState([]);
  const [workStatusList, setWorkStatusList] = useState([]);
  const [dateRangePicker, setDateRangePicker] = useState(false);
  const [customFilters, setCustomFilters] = useState([]);
  const [isFilter, showFilter] = useState(false);
  const [isExport, showExport] = useState(false);
  const [viewId, setViewId] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);
  const [exportIds, setExportIds] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isOpenConfirmCleaning, setCleaningModalWindow] = useState(false);
  const [bulkCleaningObj, setBulkCleaningObj] = useState();
  const [dateRange, onChangeDateRange] = useState([null, null]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [totalDataCount, setTotalDataCount] = useState(null);
  const columns = [
    'space_name', 'space_id', 'employee_id', 'vendor_id', 'shift_id', 'planned_in', 'planned_out', 'planned_status', 'asset_category_id', 'state', 'actual_in', 'actual_out',
  ];

  const classes = useStyles();
  const tableHeaders = tableHeadings.tableHeadCleaningManagement;
  const { userInfo, userRoles } = useSelector((state) => state.user);
  // const { userRoles } = useSelector((state) => state.config);
  const {
    maintenanceCount, maintenanceInfo, workordersCount, workorder, maintenanceCountLoading, cleaningWorkorderFilters,
  } = useSelector((state) => state.bookingWorkorder);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const { bulkOrders } = useSelector((state) => state.bookingWorkorder);
  const handleTableCellChange = (event, wOrder) => {
    const { checked, value } = event.target;
    showExport(false);
    if (checked) {
      setCheckRows((state) => [...state, parseInt(value)]);
      setExportIds((state) => [...state, wOrder.booking && wOrder.booking.id]);
    } else {
      setCheckRows(checkedRows.filter((item) => item !== parseInt(value)));
      setExportIds(exportIds.filter((item) => item !== wOrder.booking.id));
    }
  };
  useEffect(() => {
    if (bulkOrders && bulkOrders.data && !isOpenConfirmCleaning) {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  }, [bulkOrders, isOpenConfirmCleaning]);

  const CompanyTzDate = getCompanyTimeZoneDate();
  const exportDisabled = (workorder && !workorder.data) || (checkedRows && checkedRows.length > 0);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      const bulkCleaning = {
        booking_ids: checkedRows,
        employee_id: userInfo.data.employee.id,
        start_date: `${moment(CompanyTzDate).startOf('date').utc().format('YYYY-MM-DD HH:mm:ss')}`,
        end_date: `${moment(CompanyTzDate).utc().format('YYYY-MM-DD HH:mm:ss')}`,
      };
      setBulkCleaningObj(bulkCleaning);
    }
  }, [checkedRows]);

  const setCleaningCompleted = () => {
    showExport(false);
    setCleaningModalWindow(true);
    dispatch(clearCleaning());
  };

  const confirmCleaning = (
    <ConfirmCleaningModalWindow
      openConfirmCleaning={isOpenConfirmCleaning}
      setOpenClose={setCleaningModalWindow}
      bulkCleaningObj={bulkCleaningObj}
      checkedRows={checkedRows}
      setCheckRows={setCheckRows}
      setIsAllChecked={setIsAllChecked}
    />
  );

  // eslint-disable-next-line no-unused-vars
  const onDateRangeChange = (dates, datesString) => {
    onChangeDateRange(dates);
  };

  const clearDateRange = () => {
    setDateRangePicker(false);
    onChangeDateRange([null, null]);
    setTotalDataCount(0);
  };

  const filterOptions = [
    { value: 'Today', label: 'Today' },
    // { value: 'Tomorrow', label: 'Tomorrow' },
    { value: 'This week', label: 'This week' },
    { value: 'This month', label: 'This month' },
    { value: 'This year', label: 'This year' },
    { value: 'Custom', label: 'Custom' },
  ];

  const onChangeDate = (values) => {
    showExport(false);
    setOffset(0);
    setPage(1);
    const { value } = values;
    setSelectedFilter([{ value, label: value }]);
    if (value === 'Custom') {
      setDateRangePicker(true);
      const filters = [{
        key: value, value, label: value, type: 'date',
      }];
      setCustomFilters(filters);
      setTotalDataCount(0);
    } else {
      setDateRangePicker(false);
      onChangeDateRange([null, null]);
      const filters = [{
        key: value, value, label: value, type: 'date',
      }];
      setCustomFilters(filters);
      const filterValues = {
        state: cleaningWorkorderFilters && cleaningWorkorderFilters.state ? cleaningWorkorderFilters.state : [],
        states: cleaningWorkorderFilters && cleaningWorkorderFilters.states ? cleaningWorkorderFilters.states : [],
        types: cleaningWorkorderFilters && cleaningWorkorderFilters.types ? cleaningWorkorderFilters.types : [],
        maintenanceStatus: cleaningWorkorderFilters && cleaningWorkorderFilters.maintenanceStatus ? cleaningWorkorderFilters.maintenanceStatus : [],
        customFilters: filters,
      };
      dispatch(getCleaningWorkorderFilter(filterValues));
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    showExport(false);
    if (checked) {
      const data = workorder && workorder.data ? workorder.data : [];
      setCheckRows(getColumnArrayByIdAndKey(data, 'id', 'state', null, 'ready'));
      setExportIds(getColumnArrayByIdAndKey(data, 'id', 'state', 'booking', 'ready'));
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setExportIds([]);
      setIsAllChecked(false);
      setBulkCleaningObj();
    }
  };
  useEffect(() => {
    const payload = {
      rows: exportIds,
    };
    dispatch(getCheckedRows(payload));
  }, [exportIds]);

  useEffect(() => {
    if (cleaningWorkorderFilters && cleaningWorkorderFilters.states) {
      setCheckItems(cleaningWorkorderFilters.states);
      setStatusValue(0);
    }
    if (cleaningWorkorderFilters && cleaningWorkorderFilters.state) {
      setWorkStatusList(cleaningWorkorderFilters.state);
      setWorkStatusList(0);
    }
    if (cleaningWorkorderFilters && cleaningWorkorderFilters.maintenanceStatus) {
      setWorkorderItems(cleaningWorkorderFilters.maintenanceStatus);
      setWorkorderStatusValue(0);
    }
    if (cleaningWorkorderFilters && cleaningWorkorderFilters.types) {
      setCheckTypes(cleaningWorkorderFilters.types);
      setStatusValue(0);
    }
    if (cleaningWorkorderFilters && cleaningWorkorderFilters.types) {
      setWorkStatusList(cleaningWorkorderFilters.state);
      setStatusValue(0);
    }
    if (cleaningWorkorderFilters && cleaningWorkorderFilters.customFilters) {
      setStatusValue(0);
      setCustomFilters(cleaningWorkorderFilters.customFilters);
      const vid = isArrayValueExists(cleaningWorkorderFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          showFilter(false); showExport(false);
        }
      }
    }
    setCheckRows([]);
    setIsAllChecked(false);
  }, [cleaningWorkorderFilters]);

  // const totalDataCount = workordersCount && workordersCount.data && workorder && workorder.data && workorder.data.length ? workordersCount.data.length : 0;
  useEffect(() => {
    if (workordersCount && workordersCount.data && workorder && workorder.data) {
      setTotalDataCount(workordersCount.data.length);
    } else {
      setTotalDataCount(0);
    }
  }, [workordersCount]);
  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleStatusClose = (value) => {
    setOffset(0);
    setPage(1);
    setStatusValue(value);
    setTypeValue(0);
    setWorkValue('');
    setWorkorderStatusValue(0);
    setCheckItems(checkItems.filter((item) => item.id !== value));
  };

  const handleTypeClose = (value) => {
    setOffset(0);
    setPage(1);
    setTypeValue(value);
    setWorkValue('');
    setStatusValue(0);
    setWorkorderStatusValue(0);
    setCheckTypes(typeItems.filter((item) => item.id !== value));
  };

  const handleworkStatusClose = (value) => {
    setOffset(0);
    setPage(1);
    setWorkValue(value);
    setStatusValue(0);
    setWorkorderStatusValue(0);
    setWorkStatusList(workStatusList.filter((item) => item.wid !== value));
  };

  const handleWorkorderStatusClose = (value) => {
    setOffset(0);
    setPage(1);
    setWorkValue('');
    setStatusValue(0);
    setTypeValue(0);
    setWorkorderStatusValue(value);
    setWorkorderItems(workorderItems.filter((item) => item.id !== value));
  };

  const setSelectedFilterValue = (value) => {
    setSelectedFilter(value);
  };

  const handleCustomFilterClose = (value) => {
    showExport(false);
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const filterValues = {
      state: cleaningWorkorderFilters && cleaningWorkorderFilters.state ? cleaningWorkorderFilters.state : [],
      states: cleaningWorkorderFilters && cleaningWorkorderFilters.states ? cleaningWorkorderFilters.states : [],
      types: cleaningWorkorderFilters && cleaningWorkorderFilters.types ? cleaningWorkorderFilters.types : [],
      maintenanceStatus: cleaningWorkorderFilters && cleaningWorkorderFilters.maintenanceStatus ? cleaningWorkorderFilters.maintenanceStatus : [],
      customFilters: customFilters.filter((item) => item.key !== value),
    };
    dispatch(getCleaningWorkorderFilter(filterValues));
    clearDateRange();
  };
  const isUserError = userInfo && userInfo.data && userInfo.data.err;
  const loading = (userInfo && userInfo.data && userInfo.data.loading) || (workorder && workorder.loading) || (maintenanceCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (workorder && workorder.err && workorder.err.data && workorder.err.data.error && workorder.err.data.error.message === 'No bookings.')
    ? 'No records found' : (workorder && workorder.err) ? generateErrorMessage(workorder) : userErrorMsg;
  const [loadData, setLoadData] = useState(true);

  useEffect(() => {
    if ((dateRangePicker && dateRange && dateRange.length && dateRange[0] === null) || dateRange === null) {
      setLoadData(false);
      setTotalDataCount(0);
    } else if (dateRangePicker && dateRange && dateRange.length > 1 && dateRange[0] !== null) {
      setLoadData(true);
    } else {
      setLoadData(true);
    }
  }, [dateRangePicker, dateRange]);
  let key = 1;
  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 space-management border">
      <Col sm="12" md="12" lg="12" xs="12">
        <SpaceNavbar id={spaceSubMenu} />
        <div className="pt-3"></div>
        <Row className="mx-1 my-2 p-2 pageHeight adminMaintenance">
          <Col sm="12" md="12" lg="12" xs="12">
            <Row className="pt-4">
              <Col md="4" sm="12" lg="3" xs="12" className="mt-1">
                <SideFilters
                  offset={offset}
                  id={viewId}
                  statusValue={statusValue}
                  typeValue={typeValue}
                  setTypeValue={setTypeValue}
                  setWorkValue={setWorkValue}
                  workValue={workValue}
                  workorderStatusValue={workorderStatusValue}
                  setSelectedFilterValue={setSelectedFilterValue}
                  afterReset={() => { setOffset(0); setPage(1); }}
                  sortBy={sortBy}
                  sortField={sortField}
                  columns={columns}
                  dateRange={dateRange}
                  onChangeDateRange={onChangeDateRange}
                  clearDateRange={clearDateRange}
                  showExport={showExport}
                />
              </Col>
              <Col md="8" sm="12" lg="9" xs="12" className="mt-1">
                {viewId ? (
                  <div className="card h-100">
                    <Row>
                      <Col sm="12" md="12" lg="12" xs="12">
                        <Card className="bg-lightblue border-0 pr-2 pl-2 h-100">
                          <CardTitle className="mt-2 mb-0">
                            {/* <DetailNavigation
                          overviewName="Overview"
                          overviewPath="/workorders-overview"
                          listName="Workorders"
                          detailName={workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0) ? workorderDetails.data[0].name : ''}
                          afterList={() => { setOffset(0); setPage(1); setViewId(0); }}
                        /> */}
                            <span className="float-right helpdesk-details">
                              {allowedOperations.includes(actionCodes['Edit WO']) && (
                                <Button   variant="contained" size="sm" className="bg-white text-dark rounded-pill mb-1 mr-2">
                                  <img src={editIcon} className="mr-2 mt-n3px" alt="edit" />
                                  <span className="mr-2">Edit</span>
                                </Button>
                              )}
                              <Button   variant="contained" size="sm" onClick={() => { setOffset(0); setPage(1); setViewId(0); }} className="bg-white text-dark rounded-pill mb-1 mr-2">
                                <img src={closeCircleIcon} className="mr-2 mt-n3px" alt="close" />
                                <span className="mr-2">Close</span>
                              </Button>
                            </span>
                          </CardTitle>
                          <hr className="mt-1 mb-1 border-color-grey" />
                        </Card>
                      </Col>
                    </Row>
                    {/* <OrderDetail /> */}
                  </div>
                ) : (
                  <Card className="p-2 mb-2 h-100 bg-lightblue">
                    <CardBody className="bg-color-white p-1 m-0">
                      <Row className="p-2 maintenance-info">
                        <Col md={12} lg={9} className="maintenance-left">
                          <Row>
                            <Col md={6} lg={4} className="pr-0">
                              <span className="font-weight-600 font-medium mr-2 mt-2">
                                Maintenance List:
                                {' '}
                                {loadData ? totalDataCount : '0'}
                              </span>
                            </Col>
                            <Col md={6} lg={3}>
                              <Select
                                className="select-option"
                                name="filters"
                                onChange={onChangeDate}
                                options={filterOptions}
                                value={dateRangePicker ? [{ value: 'Custom', label: 'Custom' }]
                                  : selectedFilter || cleaningWorkorderFilters && cleaningWorkorderFilters.customFilters}
                              />
                            </Col>
                            <Col md={12} sm={12} lg={4} className="mr-lg-1 my-3 my-lg-0 dateRange-picker">
                              {dateRangePicker && (
                                <RangePicker
                                  onChange={onDateRangeChange}
                                  value={dateRange}
                                  format="DD-MM-y"
                                  size="small"
                                  className="mt-n2px ml-lg-2"
                                />
                              )}
                            </Col>
                          </Row>
                        </Col>
                        <Col md={12} lg={3} className="p-0 maintenance-right">
                          <div className="mt-2">
                            <span className="float-right">
                              {/* <Button
                              className="btn-remove mr-2 font-small"
                              id="Filters"
                              size="sm"
                              data-testid="search"
                            >
                              <FontAwesomeIcon
                                className="cursor-pointer"
                                onClick={() => { showFilter(!isFilter); }}
                                onMouseOver={() => toggle(6)}
                                onMouseLeave={() => setOpenValues([])}
                                icon={faSearch}
                              />
                            </Button> */}
                              {/* <Tooltip
                              placement="top"
                              isOpen={openValues.some((selectedValue) => selectedValue === 6)}
                              target="Filters"
                              data-testid="toolTipSearch"
                            >
                              Search
                          </Tooltip> */}
                            </span>
                            {/* <Popover placement="bottom" isOpen={isFilter} target="Filters">
                            <PopoverHeader>
                              Search
                            <FontAwesomeIcon
                                size="lg"
                                onClick={() => showFilter(false)}
                                className="cursor-pointer float-right"
                                icon={faTimesCircle}
                                data-testid="close"
                              />
                            </PopoverHeader>
                            <PopoverBody><Filters afterReset={() => showFilter(false)} setSelectedFilter={setSelectedFilterValue} /></PopoverBody>
                          </Popover> */}
                            {allowedOperations.includes(maintenanceActionCodes.Export) && (
                              <div className="float-right">
                                <Tooltip title="Export">
                                  <span>
                                    <Button
                                      className={`btn-remove mr-1 font-small ${exportDisabled ? 'pointer-events-none' : ''}`}
                                      id="Export"
                                      size="sm"
                                      disabled={exportDisabled}
                                      onClick={() => { showFilter(false); showExport(!isExport); }}
                                    >
                                      <FontAwesomeIcon
                                        disabled={checkedRows.length <= 0}
                                        className={checkedRows.length <= 0 ? '' : 'cursor-pointer'}
                                        icon={faFileExport}
                                      />
                                    </Button>
                                  </span>
                                </Tooltip>
                                <Popover className="export-popover" placement="bottom" isOpen={isExport} target="Export">
                                  <PopoverHeader>
                                    Export
                                    <img src={closeCircleIcon} className="mr-1 mt-1 float-right" onClick={() => showExport(false)} alt="close" aria-hidden="true" />
                                  </PopoverHeader>
                                  <PopoverBody><DataExport afterReset={() => showExport(false)} fields={columns} dateRange={dateRange} /></PopoverBody>
                                </Popover>
                              </div>
                            )}
                            {allowedOperations.includes(maintenanceActionCodes['Cleaning Completed']) && (
                              <Button   variant="contained" size="sm" className="font-small clean-btn float-right mr-2" onClick={setCleaningCompleted} disabled={checkedRows.length <= 0}>
                                <span className="py-1">
                                  Mark as Cleaned
                                </span>
                              </Button>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row className="pl-4">
                        <>
                          {checkItems && checkItems.map((st) => (
                            <p key={st.id} className="mr-2 content-inline">
                              <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                                {st.label}
                                <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(st.id)} size="sm" icon={faTimesCircle} />
                              </Badge>
                            </p>
                          ))}
                          {typeItems && typeItems.map((cat) => (
                            <p key={cat.id} className="mr-2 content-inline">
                              <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                                {cat.label}
                                <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleTypeClose(cat.id)} size="sm" icon={faTimesCircle} />
                              </Badge>
                            </p>
                          ))}
                          {workStatusList && workStatusList.map((cat) => (
                            <p key={cat.wid} className="mr-2 content-inline">
                              <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                                {cat.label}
                                <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleworkStatusClose(cat.wid)} size="sm" icon={faTimesCircle} />
                              </Badge>
                            </p>
                          ))}
                          {workorderItems && workorderItems.map((wo) => (
                            <p key={wo.id} className="mr-2 content-inline">
                              <Badge color="dark" className="p-2 mb-1 bg-zodiac text-capitalize">
                                {wo.label}
                                <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleWorkorderStatusClose(wo.id)} size="sm" icon={faTimesCircle} />
                              </Badge>
                            </p>
                          ))}
                          {customFilters && customFilters.map((cf) => (
                            <p key={cf.key} className="mr-2 content-inline">
                              <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                                {cf.label}
                                {(cf.type === 'text' || cf.type === 'id') && (
                                  <span>
                                    {'  '}
                                    &quot;
                                    {decodeURIComponent(cf.value)}
                                    &quot;
                                  </span>
                                )}
                                {cf && cf.value !== 'Today' && (
                                  <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                                )}
                              </Badge>
                            </p>
                          ))}
                        </>
                      </Row>

                      {(workorder && workorder.data) && (
                        <span data-testid="success-case" />
                      )}
                      <div className="thin-scrollbar">
                        {/* {(workorder && workorder.data && !loading && loadData) && ( */}
                        <Table responsive>
                          <thead className="thead-bg-color">
                            <tr>
                              <th className="w-5">
                                <div className="checkbox ml-1">
                                  <Input
                                    type="checkbox"
                                    value="all"
                                    className="m-0 position-relative"
                                    name="checkall"
                                    id="checkboxtkhead"
                                    checked={isAllChecked}
                                    onChange={handleTableCellAllChange}
                                  />
                                  <Label htmlFor="checkboxtkhead" />
                                </div>
                              </th>
                              {tableHeaders && tableHeaders.map((head) => (
                                <React.Fragment key={key++}>
                                  <th key={head.id} className="p-2 min-width-160">
                                    <span aria-hidden="true" className="d-inline-block">
                                      {head.label}
                                    </span>
                                  </th>
                                </React.Fragment>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(workorder && workorder.data) && workorder.data.map((wo, index) => (
                              <tr key={`index${key++}`}>
                                <td className="w-5">
                                  <div className="checkbox ml-1">
                                    <Input
                                      type="checkbox"
                                      value={wo.id}
                                      id={`checkboxtk${index}`}
                                      // className="ml-1"
                                      name={wo.name}
                                      disabled={wo.state !== 'ready'}
                                      checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(wo.id))}
                                      onChange={(event) => handleTableCellChange(event, wo)}
                                    />
                                    <Label htmlFor={`checkboxtk${index}`} />
                                  </div>
                                </td>
                                <td
                                  aria-hidden="true"
                                  className="w-15"
                                >
                                  <span className="font-weight-600">{getDefaultNoValue(wo.asset && wo.asset.name)}</span>
                                </td>
                                <td className="font-weight-400">{getDefaultNoValue(wo.asset && wo.asset.path_name ? wo.asset.path_name : '')}</td>
                                <td className="font-weight-400">{getDefaultNoValue(wo.space_category && wo.space_category.name)}</td>
                                <td><span className="font-weight-400 text-capitalize">{getDefaultNoValue(wo.state)}</span></td>
                                {/* <td><span className="font-weight-400">{getDefaultNoValue(wo.state)}</span></td> */}
                                <td className="font-weight-400">
                                  {wo.date_start_scheduled && (
                                    <>{getDefaultNoValue(getDateFormat(wo.date_start_scheduled, userRoles, 'datetime'))}</>
                                  )}
                                </td>
                                {/* <td className="font-weight-400">
                                  {wo.actual_in && (
                                    <TimeZoneDateConvertor date={getDefaultNoValue(wo.actual_in)} format="D MMM YYYY LT" />
                                  )}
                                </td>
                                <td className="font-weight-400">
                                  {wo.actual_out && (
                                    <TimeZoneDateConvertor date={getDefaultNoValue(wo.actual_out)} format="D MMM YYYY LT" />
                                  )}
                                </td> */}
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        {/* )} */}
                        {(!loadData) && (
                          <ErrorContent errorTxt="Please select date" />
                        )}

                        {loading && (
                          <div className="mb-2 mt-3 p-5 " data-testid="loading-case">
                            <Loader />
                          </div>
                        )}
                        {((loadData && workorder && workorder.err) || isUserError) && (
                          <ErrorContent errorTxt={errorMsg} />
                        )}
                        {loading ? (<span />) : (
                          <div className={`${classes.root} float-right`}>
                            <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                          </div>
                        )}
                      </div>
                    </CardBody>
                    {confirmCleaning}
                  </Card>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Workorders;
