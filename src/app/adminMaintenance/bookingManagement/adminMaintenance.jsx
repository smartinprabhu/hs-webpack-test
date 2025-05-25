/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import {
  Badge, Card, CardBody, Col, Label, Input, Row, Popover, PopoverHeader, PopoverBody, Table,
  Modal, ModalBody, ModalFooter, Spinner,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faFileExport,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { DatePicker, Tooltip } from 'antd';
import 'antd/dist/antd.css';

import closeCircleIcon from '@images/icons/circleClose.svg';
import Loader from '@shared/loading';
import { getDateFormat } from '@shared/dateTimeConvertor';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SpaceNavbar from '../../spaceManagement/navbar/spaceNavbar';

import maintenanceActionCodes from '../data/maintenanceActionCodes.json';

import {
  getPagesCountV2, isArrayValueExists, getColumnArrayByIdAndKey,
  generateErrorMessage, getDefaultNoValue,
  getListOfOperations,
} from '../../util/appUtils';
import ErrorContent from '../../shared/errorContent';
import SideFilters from './sidebar/sideFilters';
import Filters from './filters/filters';
import DataExport from './dataExport/dataExport';
import {
  getWorkorderFilter, getCheckedRows, deleteBooking, clearBookingData, setClearCleaningWorkOrderFilters,
} from '../adminMaintenanceService';
import '../../employees/employees.scss';
import tableHeadings from '../tableHeadMaintainence.json';

const { RangePicker } = DatePicker;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Workorders = () => {
  const limit = 10;
  const subMenu = 1;
  const spaceSubMenu = 'Booking Maintenance';
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  // const [sortBy, setSortBy] = useState('DESC');
  // const [sortField, setSortField] = useState('create_date');
  const [statusValue, setStatusValue] = useState(0);
  const [workorderStatusValue, setWorkorderStatusValue] = useState(0);
  const [typeValue, setTypeValue] = useState(0);
  const [checkItems, setCheckItems] = useState([]);
  const [bookingCheckBoxType, setBookingCheckBoxType] = useState([]);
  const [dateRangePicker, setDateRangePicker] = useState(false);
  const [workorderItems, setWorkorderItems] = useState([]);
  const [typeItems, setCheckTypes] = useState([]);
  const [searchItems, setSearchItems] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [isFilter, showFilter] = useState(false);
  const [isExportWithEmployee, showExportWithEmployee] = useState(false);
  const [isExportWithOutEmployee, showExportWithOutEmployee] = useState(false);
  const [viewId, setViewId] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isOpenBookingModal, openBookingModal] = useState(false);
  const [isOpenDeleteBookingModal, openDeleteBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [dateRange, onChangeDateRange] = useState([null, null]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [totalDataCount, setTotalDataCount] = useState(null);
  const [bookingTypeItemsCleared, setBookingTypeItemsCleared] = useState(false);
  const [bookingCheckboxTypeCleared, setBookingCheckboxTypeCleared] = useState(true);
  const columnsWithEmployee = [
    'space_name', 'space_id', 'employee_id', 'vendor_id', 'shift_id', 'planned_in', 'planned_out', 'planned_status', 'asset_category_id', 'state', 'actual_in', 'actual_out',
  ];
  const columnsWithOutEmployee = [
    'space_name', 'space_id', 'vendor_id', 'shift_id', 'planned_in', 'planned_out', 'planned_status', 'asset_category_id', 'state', 'actual_in', 'actual_out',
  ];
  const tableHeaders = tableHeadings.tableHeadBookingManagement;

  const toggleBookingModal = () => {
    dispatch(clearBookingData());
    openBookingModal(false);
    openDeleteBookingModal(false);
    dispatch(setClearCleaningWorkOrderFilters());
  };

  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    maintenanceCount, maintenanceInfo, maintenanceCountLoading, workorderFilters, bookingDelete,
  } = useSelector((state) => state.bookingWorkorder);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const exportButtonDisabled = (maintenanceInfo && !maintenanceInfo.data) || (checkedRows && checkedRows.length > 0) || ((dateRangePicker && dateRange && dateRange.length && dateRange[0] === null) || dateRange === null);
  const searchOptionDisabled = (dateRangePicker && dateRange && dateRange.length && dateRange[0] === null) || dateRange === null;

  const handleTableCellChange = (event) => {
    showExportWithOutEmployee(false);
    showExportWithEmployee(false);
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, parseInt(value)]);
    } else {
      setCheckRows(checkedRows.filter((item) => item !== parseInt(value)));
      setIsAllChecked(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      dispatch(setClearCleaningWorkOrderFilters());
    }
  }, [userInfo]);

  const handleTableCellAllChange = (event) => {
    showExportWithOutEmployee(false);
    showExportWithEmployee(false);
    const { checked } = event.target;
    if (checked) {
      const data = maintenanceInfo && maintenanceInfo.data ? maintenanceInfo.data : [];
      setCheckRows(getColumnArrayByIdAndKey(data, 'id', 'state', null, 'Booked'));
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  useEffect(() => {
    const selectedBookings = checkedRows.map((bookItem) => maintenanceInfo && maintenanceInfo.data.filter((item) => item.id === bookItem && item.state === 'Booked'));
    setBookingDetails(selectedBookings.flat());
  }, [checkedRows]);

  const clearDateRange = () => {
    setDateRangePicker(false);
    onChangeDateRange([null, null]);
    setTotalDataCount(0);
  };

  const filterOptions = [
    { value: 'Today', label: 'Today' },
    { value: 'Tomorrow', label: 'Tomorrow' },
    { value: 'This week', label: 'This week' },
    { value: 'This month', label: 'This month' },
    { value: 'This year', label: 'This year' },
    { value: 'Custom', label: 'Custom' },
  ];

  // eslint-disable-next-line no-unused-vars
  const onDateRangeChange = (dates, datesString) => {
    onChangeDateRange(dates);
  };

  const onChangeDate = (values) => {
    showExportWithOutEmployee(false);
    showExportWithEmployee(false);
    setOffset(0);
    setPage(1);
    const { value } = values;
    if (value === 'Custom') {
      setDateRangePicker(true);
      setSelectedFilter([{ value, label: value }]);
      const filters = [{
        key: value, value, label: value, type: 'date',
      }];
      setCustomFilters(filters);
      setTotalDataCount(0);
    } else {
      onChangeDateRange([null, null]);
      setSelectedFilter([{ value, label: value }]);
      setDateRangePicker(false);
      const filters = [{
        key: value, value, label: value, type: 'date',
      }];
      setCustomFilters(filters);
      const filterValues = {
        bookingType: workorderFilters && workorderFilters.bookingType ? workorderFilters.bookingType : [],
        states: workorderFilters && workorderFilters.states ? workorderFilters.states : [],
        types: workorderFilters && workorderFilters.types ? workorderFilters.types : [],
        maintenanceStatus: workorderFilters && workorderFilters.types ? workorderFilters.maintenanceStatus : [],
        customFilters: filters,
        searchFilters: searchItems.filter((item) => item.key !== value),
      };
      dispatch(getWorkorderFilter(filterValues));
    }
  };

  useEffect(() => {
    if ((dateRangePicker && dateRange && dateRange.length && dateRange[0] === null) || dateRange === null) {
      showExportWithEmployee(false);
      showExportWithOutEmployee(false);
    }
  }, [dateRangePicker, dateRange]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRows(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (workorderFilters && workorderFilters.bookingType) {
      setBookingCheckBoxType(workorderFilters.bookingType);
    }
    if (workorderFilters && workorderFilters.searchFilters) {
      setSearchItems(workorderFilters.searchFilters);
    }
    if (workorderFilters && workorderFilters.states) {
      setCheckItems(workorderFilters.states);
      setStatusValue(0);
    }
    if (workorderFilters && workorderFilters.maintenanceStatus) {
      setWorkorderItems(workorderFilters.maintenanceStatus);
      setWorkorderStatusValue(0);
    }
    if (workorderFilters && workorderFilters.types) {
      setCheckTypes(workorderFilters.types);
      setStatusValue(0);
    }
    if (workorderFilters && workorderFilters.customFilters) {
      setStatusValue(0);
      setCustomFilters(workorderFilters.customFilters);
      const vid = isArrayValueExists(workorderFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          showFilter(false);
        }
      }
    }
    setCheckRows([]);
    setIsAllChecked(false);
  }, [workorderFilters]);

  useEffect(() => {
    if (maintenanceCount && maintenanceCount.length) {
      setTotalDataCount(maintenanceCount.length);
    } else {
      setTotalDataCount(0);
    }
  }, [maintenanceCount]);

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
    setWorkorderStatusValue(0);
    setCheckItems(checkItems.filter((item) => item.id !== value));
    showExportWithOutEmployee(false);
    showExportWithEmployee(false);
  };

  const handleTypeClose = (value) => {
    setOffset(0);
    setPage(1);
    setTypeValue(value);
    setStatusValue(0);
    setWorkorderStatusValue(0);
    setCheckTypes(typeItems.filter((item) => item.id !== value));
    setBookingTypeItemsCleared(true);
    setBookingCheckboxTypeCleared(true);
    showExportWithOutEmployee(false);
    showExportWithEmployee(false);
  };

  const handleWorkorderStatusClose = (value) => {
    setOffset(0);
    setPage(1);
    setStatusValue(0);
    setTypeValue(0);
    setWorkorderStatusValue(value);
    setWorkorderItems(workorderItems.filter((item) => item.id !== value));
    showExportWithOutEmployee(false);
    setBookingTypeItemsCleared(true);
    setBookingCheckboxTypeCleared(true);
    showExportWithEmployee(false);
  };
  const setSelectedFilterValue = (value) => {
    setSelectedFilter(value);
  };

  const deleteBookingItem = () => {
    openDeleteBookingModal(true);
    dispatch(deleteBooking(checkedRows));
    setOffset(0);
    setPage(1);
  };

  const handleCustomFilterClose = (value) => {
    setOffset(0);
    setPage(1);
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const filterValues = {
      bookingType: workorderFilters && workorderFilters.bookingType ? workorderFilters.bookingType : [],
      states: workorderFilters && workorderFilters.states ? workorderFilters.states : [],
      types: workorderFilters && workorderFilters.types ? workorderFilters.types : [],
      maintenanceStatus: workorderFilters && workorderFilters.types ? workorderFilters.maintenanceStatus : [],
      customFilters: customFilters.filter((item) => item.key !== value),
    };
    dispatch(getWorkorderFilter(filterValues));
    clearDateRange();
    showExportWithOutEmployee(false);
    showExportWithEmployee(false);
  };

  const handleBookingTypeClose = (value) => {
    setOffset(0);
    setPage(1);
    setBookingCheckBoxType(bookingCheckBoxType.filter((item) => item.id !== value));
    const filterValues = {
      bookingType: bookingCheckBoxType.filter((item) => item.id !== value),
      states: workorderFilters && workorderFilters.states ? workorderFilters.states : [],
      types: workorderFilters && workorderFilters.types ? workorderFilters.types : [],
      maintenanceStatus: workorderFilters && workorderFilters.types ? workorderFilters.maintenanceStatus : [],
      customFilters: workorderFilters && workorderFilters.customFilters ? workorderFilters.customFilters : [],
    };
    dispatch(getWorkorderFilter(filterValues));
    setBookingCheckboxTypeCleared(true);
    clearDateRange();
    showExportWithOutEmployee(false);
    showExportWithEmployee(false);
  };

  const handleSearchFilterClose = (value) => {
    showExportWithOutEmployee(false);
    showExportWithEmployee(false);
    setOffset(0);
    setPage(1);
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const filterValues = {
      bookingType: workorderFilters && workorderFilters.bookingType ? workorderFilters.bookingType : [],
      states: workorderFilters && workorderFilters.states ? workorderFilters.states : [],
      types: workorderFilters && workorderFilters.types ? workorderFilters.types : [],
      maintenanceStatus: workorderFilters && workorderFilters.types ? workorderFilters.maintenanceStatus : [],
      customFilters: workorderFilters && workorderFilters.customFilters ? workorderFilters.customFilters : [],
      searchFilters: searchItems.filter((item) => item.key !== value),
    };
    dispatch(getWorkorderFilter(filterValues));
  };
  const isUserError = userInfo && userInfo.data && userInfo.data.err;
  const loading = (userInfo && userInfo.data && userInfo.data.loading) || (maintenanceInfo && maintenanceInfo.loading) || (maintenanceCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (maintenanceInfo && maintenanceInfo.err) ? generateErrorMessage(maintenanceInfo) : userErrorMsg;
  const [loadData, setLoadData] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line no-mixed-operators
    if (dateRangePicker && (dateRange && dateRange.length && dateRange[0] === null || dateRange === null)) {
      setLoadData(false);
      setTotalDataCount(0);
    } else if (dateRangePicker && dateRange && dateRange.length > 1 && dateRange[0] !== null) {
      setLoadData(true);
    } else {
      setLoadData(true);
    }
  }, [dateRangePicker, dateRange]);

  useEffect(() => {
    setSearchItems([]);
  }, [userInfo]);

  useEffect(() => {
    if (bookingCheckboxTypeCleared) {
      setBookingCheckBoxType([]);
    }
  }, [bookingCheckboxTypeCleared]);

  const deleteBoookingSummary = (bookingDetailsRes) => (
    <React.Fragment key={bookingDetailsRes.id}>
      <tr>
        <td
          aria-hidden="true"
          className="w-15"
        >
          <span className="font-weight-600">{getDefaultNoValue(bookingDetailsRes.space && bookingDetailsRes.space.space_name)}</span>
        </td>
        <td className="font-weight-400">{getDefaultNoValue(bookingDetailsRes.space && bookingDetailsRes.space.space_path_name ? bookingDetailsRes.space.space_path_name : '')}</td>
        <td className="font-weight-400">{getDefaultNoValue(bookingDetailsRes.space.category_id && bookingDetailsRes.space.category_id.name)}</td>
        <td><span className="font-weight-400">{getDefaultNoValue(bookingDetailsRes.state)}</span></td>
        <td><span className="font-weight-400">{getDefaultNoValue(bookingDetailsRes.employee.name)}</span></td>
        <td className="font-weight-400">
          {bookingDetailsRes.planned_in && (
            <>{getDefaultNoValue(getDateFormat(bookingDetailsRes.planned_in, userRoles, 'datetime'))}</>
          )}
        </td>
        <td className="font-weight-400">
          {bookingDetailsRes.planned_out && (
            <>{getDefaultNoValue(getDateFormat(bookingDetailsRes.planned_out, userRoles, 'datetime'))}</>
          )}
        </td>
      </tr>
    </React.Fragment>
  );
  let key = 1;
  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 space-management border">
      <Col sm="12" md="12" lg="12" xs="12">
        <SpaceNavbar id={spaceSubMenu}/>
        <div className="pt-3"></div>
        <Row className="adminMaintenance">
          <Col sm="12" md="12" lg="12" xs="12">
            <Row className="pt-4">
              <Col md="4" sm="12" lg="3" xs="12" className="mt-1">
                <SideFilters
                  offset={offset}
                  id={viewId}
                  statusValue={statusValue}
                  typeValue={typeValue}
                  setTypeValue={setTypeValue}
                  bookingCheckboxTypeCleared={bookingCheckboxTypeCleared}
                  setBookingCheckboxTypeCleared={setBookingCheckboxTypeCleared}
                  bookingTypeItemsCleared={bookingTypeItemsCleared}
                  setBookingTypeItemsCleared={setBookingTypeItemsCleared}
                  workorderStatusValue={workorderStatusValue}
                  setSelectedFilterValue={setSelectedFilterValue}
                  afterReset={() => { setOffset(0); setPage(1); }}
                  isOpenDeleteBookingModal={isOpenDeleteBookingModal}
                  // sortBy={sortBy}
                  // sortField={sortField}
                  columns={columnsWithEmployee}
                  dateRange={dateRange}
                  showFilter={showFilter}
                  onChangeDateRange={onChangeDateRange}
                  clearDateRange={clearDateRange}
                  setSearchItems={setSearchItems}
                  searchItems={searchItems}
                  showExportWithEmployee={showExportWithEmployee}
                  showExportWithOutEmployee={showExportWithOutEmployee}
                />
              </Col>
              <Col md="8" sm="12" lg="9" xs="12" className="mt-1">
                <Card className="p-2 mb-2 h-100 bg-lightblue">
                  <CardBody className="bg-color-white p-1 m-0">
                    <Row className="p-2 maintenance-info">
                      <Col md={12} lg={9} className="maintenance-left">
                        <Row>
                          <Col md={6} lg={4} className="pr-0">
                            <span className="font-weight-600 font-medium mr-2 mt-2">
                              Booking List:
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
                                : selectedFilter || (workorderFilters && workorderFilters.customFilters)}
                            />
                          </Col>
                          <Col md={12} sm={12} lg={4} className="select-option ml-n-15px mr-lg-1 my-3 my-lg-0 dateRange-picker">
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
                          <Tooltip title="Search">
                            <span className="float-right">
                              <Button
                              variant="contained"
                                className={`btn-search mr-1 font-small ${searchOptionDisabled ? 'pointer-events-none' : ''}`}
                                id="Filters"
                                onClick={() => { showFilter(!isFilter); showExportWithOutEmployee(false); showExportWithEmployee(false); }}
                                size="sm"
                                disabled={searchOptionDisabled}
                                data-testid="search"
                              >
                                <FontAwesomeIcon
                                  className="cursor-pointer"
                                  icon={faSearch}
                                />
                              </Button>
                            </span>
                          </Tooltip>
                          <Popover placement="bottom" isOpen={isFilter} target="Filters">
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
                          </Popover>
                          <Tooltip title="Export With Employee Details">
                            <span className="float-right">
                              <Button
                                className={`btn-export-emp btn-remove mr-1 font-small ${exportButtonDisabled ? 'pointer-events-none' : ''}`}
                                id="ExportwithEmp"
                                variant="contained"
                                size="sm"
                                onClick={() => { showExportWithEmployee(true); showFilter(false); showExportWithOutEmployee(false); }}
                                disabled={exportButtonDisabled}
                              >
                                <FontAwesomeIcon
                                  disabled={checkedRows && checkedRows.length < 1}
                                  className={checkedRows && checkedRows.length < 1 ? '' : 'cursor-pointer'}
                                  icon={faFileExport}
                                />
                              </Button>
                            </span>
                          </Tooltip>
                          <Popover placement="bottom" isOpen={isExportWithEmployee} target="ExportwithEmp" className="export-popover bookPopoverWidth">
                            <PopoverHeader>
                              Export
                              <img src={closeCircleIcon} className="cursor-pointer mr-1 mt-1 float-right" onClick={() => showExportWithEmployee(false)} alt="close" aria-hidden="true" />
                            </PopoverHeader>
                            <PopoverBody><DataExport employeeField afterReset={() => showExportWithEmployee(false)} fields={columnsWithEmployee} dateRange={dateRange} /></PopoverBody>
                          </Popover>
                          <Tooltip title="Export With Employee Details">
                            <span className="float-right">
                              <Button
                              variant="contained"
                                className={`btn-export-emp btn-remove mr-1 font-small ${exportButtonDisabled ? 'pointer-events-none' : ''}`}
                                id="ExportwithOutEmp"
                                size="sm"
                                onClick={() => { showExportWithOutEmployee(true); showFilter(false); showExportWithEmployee(false); }}
                                disabled={exportButtonDisabled}
                              >
                                <FontAwesomeIcon
                                  disabled={checkedRows && checkedRows.length < 1}
                                  className={checkedRows && checkedRows.length < 1 ? '' : 'cursor-pointer'}
                                  icon={faFileExport}
                                />
                              </Button>
                            </span>
                          </Tooltip>
                          <Popover className="export-popover" placement="bottom" isOpen={isExportWithOutEmployee} target="ExportwithOutEmp">
                            <PopoverHeader>
                              Export
                              <img src={closeCircleIcon} className="cursor-pointer mr-1 mt-1 float-right" onClick={() => showExportWithOutEmployee(false)} alt="close" aria-hidden="true" />
                            </PopoverHeader>
                            <PopoverBody><DataExport employeeField={false} afterReset={() => showExportWithOutEmployee(false)} fields={columnsWithOutEmployee} dateRange={dateRange} /></PopoverBody>
                          </Popover>
                          <span className="float-right">
                            {allowedOperations.includes(maintenanceActionCodes['Delete Booking']) && (
                              <Button
                                className="p-1 mt-0 mr-1 cancel-btn font-small"
                                variant="contained"
                                size="sm"
                                data-testid="delete"
                                disabled={checkedRows && checkedRows.length < 1}
                                onClick={() => { dispatch(clearBookingData()); openBookingModal(true); }}
                              >
                                Cancel Bookings
                              </Button>
                            )}
                          </span>
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
                        {searchItems && searchItems.map((cf) => (
                          <p key={cf.key} className="mr-2 content-inline">
                            <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                              {cf.label}
                              {(cf.type === 'text' || cf.type === 'id' || cf.type === 'array') && (
                                <span>
                                  {'  '}
                                  &quot;
                                  {decodeURIComponent(cf.value)}
                                  &quot;
                                </span>
                              )}
                              <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleSearchFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
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
                        {workorderItems && workorderItems.map((wo) => (
                          <p key={wo.id} className="mr-2 content-inline">
                            <Badge color="dark" className="p-2 mb-1 bg-zodiac text-capitalize">
                              {wo.label}
                              <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleWorkorderStatusClose(wo.id)} size="sm" icon={faTimesCircle} />
                            </Badge>
                          </p>
                        ))}
                        {bookingCheckBoxType && bookingCheckBoxType.map((wo) => (
                          <p key={wo.id} className="mr-2 content-inline">
                            <Badge color="dark" className="p-2 mb-1 bg-zodiac text-capitalize">
                              {wo.label}
                              <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleBookingTypeClose(wo.id)} size="sm" icon={faTimesCircle} />
                            </Badge>
                          </p>
                        ))}
                        {customFilters && customFilters.map((cf) => (
                          <p key={cf.key} className="mr-2 content-inline">
                            <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                              {cf.label}
                              {(cf.type === 'text' || cf.type === 'id' || cf.type === 'array') && (
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
                    {(maintenanceInfo && maintenanceInfo.data) && (
                      <span data-testid="success-case" />
                    )}
                    <div className="mb-2 ml-2">
                      Only bookings with
                      {' '}
                      <b>Booked</b>
                      {' '}
                      status can be cancelled
                    </div>
                    <div className="thin-scrollbar maintenance">
                      {/* {(maintenanceInfo && maintenanceInfo.data && !loading && loadData) && ( */}
                      <Table responsive>
                        <thead className="thead-bg-color">
                          <tr>
                            {allowedOperations.includes(maintenanceActionCodes['Delete Booking']) && (
                              <th className="w-5">
                                <div className="checkbox">
                                  <Input
                                    type="checkbox"
                                    value="all"
                                    className="m-0 position-relative"
                                    name="checkall"
                                    id="checkboxtkhead"
                                    checked={isAllChecked && checkedRows && checkedRows.length > 0}
                                    onChange={handleTableCellAllChange}
                                  />
                                  <Label htmlFor="checkboxtkhead" />
                                </div>
                              </th>
                            )}
                            {tableHeaders && tableHeaders.map((head) => (
                              <>
                                {allowedOperations.includes(maintenanceActionCodes['Delete Booking']) ? (
                                  <th key={head.id} className="p-2 min-width-160">
                                    <span aria-hidden="true" className="d-inline-block">
                                      {head.label}
                                    </span>
                                  </th>
                                ) : (
                                  <th key={head.id} className="p-2 min-width-160">
                                    <span aria-hidden="true" className={head.id === 1 ? "position-relative headerLabel" : "position-relative"}>
                                      {head.label}
                                    </span>
                                  </th>
                                )}
                              </>
                            ))}
                          </tr>
                        </thead>
                        <tbody className={maintenanceInfo && maintenanceInfo.data ? '' : "errBody"}>
                          {((loadData && maintenanceInfo && maintenanceInfo.err) || isUserError) && (
                            <ErrorContent errorTxt={errorMsg} />
                          )}
                          {loading && (
                            <div className=" loader mb-2 mt-3 p-5 " data-testid="loading-case">
                              <Loader />
                            </div>
                          )}
                          {(maintenanceInfo && maintenanceInfo.data) && maintenanceInfo.data.map((wo, index) => (
                            <tr key={wo.id}>
                              {allowedOperations.includes(maintenanceActionCodes['Delete Booking']) && (
                                <td className="w-5">
                                  <div className="checkbox">
                                    <Input
                                      type="checkbox"
                                      value={wo.id}
                                      id={`checkboxtk${index}`}
                                      className={`ml-0 ${wo.state !== 'Booked' ? 'cursor-disabled' : ''}`}
                                      disabled={wo.state !== 'Booked'}
                                      name={wo.name}
                                      checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(wo.id))}
                                      onChange={handleTableCellChange}
                                    />
                                    <Label htmlFor={`checkboxtk${index}`} />
                                  </div>
                                </td>
                              )}
                              <td
                                aria-hidden="true"
                                className="w-15"
                              >
                                {allowedOperations.includes(maintenanceActionCodes['Delete Booking']) ? (
                                  <span className="font-weight-600">{getDefaultNoValue(wo.space && wo.space.space_name)}</span>
                                ) : (
                                  <span className="font-weight-600 m-2">{getDefaultNoValue(wo.space && wo.space.space_name)}</span>
                                )}
                              </td>
                              <td className="font-weight-400">{getDefaultNoValue(wo.space && wo.space.space_path_name ? wo.space.space_path_name : '')}</td>
                              <td className="font-weight-400">{getDefaultNoValue(wo.space.category_id && wo.space.category_id.name)}</td>
                              <td><span className="font-weight-400">{getDefaultNoValue(wo.state)}</span></td>
                              <td><span className="font-weight-400">{getDefaultNoValue(wo.employee.name)}</span></td>
                              <td><span className="font-weight-400">{wo.employee && wo.employee.employee_number}</span></td>
                              <td className="font-weight-400">
                                {wo && wo.booked_by_id && wo.booked_by_id.name}
                              </td>
                              <td className="font-weight-400">
                                {wo.planned_in && (
                                  <>{getDefaultNoValue(getDateFormat(wo.planned_in, userRoles, 'datetime'))}</>
                                )}
                              </td>
                              <td className="font-weight-400">
                                {wo.planned_out && (
                                  <>{getDefaultNoValue(getDateFormat(wo.planned_out, userRoles, 'datetime'))}</>
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
                              <td className="font-weight-400">
                                {wo.is_guest ? 'Yes' : 'No'}
                              </td>
                              <td className="font-weight-400">
                                {wo.is_guest ? wo.visitor && wo.visitor.visitor_id && wo.visitor.visitor_id.map((guest) => `${guest.name}`).join(', ') : '-'}
                              </td>
                              <td className="font-weight-400">
                                {wo.is_guest ? wo.visitor && wo.visitor.visitor_id && wo.visitor.visitor_id.map((guest) => `${guest.email && guest.email.email}`).join(', ') : '-'}
                              </td>

                              <td className="font-weight-400">
                                {wo.neighbourhood_group_id && wo.neighbourhood_group_id.neighbourhood_name ? wo.neighbourhood_group_id.neighbourhood_name : '-'}
                              </td>
                              {/* <td className="font-weight-400">
                              {wo.neighbourhood_group_id && wo.neighbourhood_group_id.neighbourhood_group_name ? wo.neighbourhood_group_id.neighbourhood_group_name: '-'}
                            </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      {/* )} */}
                      {(!loadData) && (
                        <ErrorContent errorTxt="Please select date" />
                      )}
                      {/* {loading && (
                    <div className="mb-2 mt-3 p-5 " data-testid="loading-case">
                      <Loader />
                    </div>
                  )}
                  {((loadData && maintenanceInfo && maintenanceInfo.err) || isUserError) && (
                    <ErrorContent errorTxt={errorMsg} />
                  )} */}
                      {!loadData ? (<span />) : (
                        <div className={`${classes.root} float-right`}>
                          <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                        </div>
                      )}
                      {isOpenBookingModal && (
                        <Modal className="cancel-bookings" backdrop="static" isOpen={isOpenBookingModal} toggle={toggleBookingModal} size={bookingDelete && bookingDelete.data ? 'sm' : 'lg'}>
                          <ModalHeaderComponent title="Cancel Bookings" closeModalWindow={toggleBookingModal} response={bookingDelete} />
                          <hr className="m-0" />
                          <ModalBody className="mx-3 bookingSummary thin-scrollbar">
                            {!isOpenDeleteBookingModal && !bookingDelete.data && (
                              <Table responsive>
                                <thead className="bg-gray-light">
                                  <tr>
                                    <th className="p-2 min-width-160">
                                      <span aria-hidden="true">
                                        Space Name
                                      </span>
                                    </th>
                                    <th className="p-2 min-width-160">
                                      <span aria-hidden="true">
                                        Space Location
                                      </span>
                                    </th>
                                    <th className="p-2 min-width-160">
                                      <span aria-hidden="true">
                                        Space Category
                                      </span>
                                    </th>
                                    <th className="p-2 min-width-160">
                                      <span aria-hidden="true">
                                        Booking Status
                                      </span>
                                    </th>
                                    <th className="p-2 min-width-160">
                                      <span aria-hidden="true">
                                        Employee Name
                                      </span>
                                    </th>
                                    <th className="p-2 min-width-160">
                                      <span aria-hidden="true">
                                        Planned In
                                      </span>
                                    </th>
                                    <th className="p-2 min-width-160">
                                      <span aria-hidden="true">
                                        Planned Out
                                      </span>
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.isArray(bookingDetails) && (
                                    bookingDetails.map((bookingItem) => (
                                      <React.Fragment key={bookingItem.id}>
                                        {deleteBoookingSummary(bookingItem)}
                                      </React.Fragment>
                                    ))
                                  )}
                                  {!Array.isArray(bookingDetails) && (
                                    deleteBoookingSummary(bookingDetails)
                                  )}
                                </tbody>
                              </Table>
                            )}
                            <div className="text-center">
                              {bookingDelete && bookingDelete.data && (<div className="text-success mt-2 text-center">Booking Deleted Successfully</div>)}
                              {bookingDelete && bookingDelete.err && (<div className="text-danger mt-2 text-center">{generateErrorMessage(bookingDelete)}</div>)}
                            </div>
                          </ModalBody>
                          {allowedOperations.includes(maintenanceActionCodes['Delete Booking']) && (
                            <ModalFooter>
                              {bookingDelete && !bookingDelete.data && (
                                <Button  variant="contained" size="sm" onClick={() => deleteBookingItem(bookingDetails.id)} className="confirm-btn">
                                  {bookingDelete && bookingDelete.loading && (
                                    <Spinner size="sm" className="mr-2" />
                                  )}
                                  Confirm
                                </Button>
                              )}
                              {bookingDelete && bookingDelete.data && (
                                <Button className="confirm-btn"  variant="contained" size="sm" onClick={toggleBookingModal}>Ok</Button>
                              )}
                            </ModalFooter>
                          )}
                        </Modal>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      </Row>
  );
};

export default Workorders;
