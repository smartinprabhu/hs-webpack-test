/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Badge, Collapse, Card, CardBody, CardTitle, Col, Label, Input, Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import ordersIcon from '@images/orders.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import { getCompanyTimeZoneDate } from '@shared/dateTimeConvertor';
import moment from 'moment-timezone';
import find from 'lodash/find';

import {
  getTypeGroups, getStateGroups, getWorkorderFilter, getMaintenance, setclearBookingWorkorderFilters,
  getMaintenanceCount, setClearCleaningWorkOrderFilters, setclearBookingsCount, setclearBookingMaintainanceInfo,
} from '../../adminMaintenanceService';
import {
  getColumnArray, getColumnArrayById, queryGeneratorByDateAndTimeByKey,
  generateErrorMessage, queryGenerator, bookingTypeVariables,
} from '../../../util/appUtils';
import { getSLALabelIcon } from '../../utils/utils';

const appModels = require('../../../util/appModels').default;

const SideFilters = (props) => {
  const {
    offset, id, statusValue, setSelectedFilterValue, afterReset, setSearchItems, bookingCheckboxTypeCleared,
    searchItems, showFilter, bookingTypeItemsCleared, setBookingTypeItemsCleared, setBookingCheckboxTypeCleared,
    sortBy, sortField, workorderStatusValue, typeValue, setTypeValue, dateRange, onChangeDateRange, clearDateRange, showExportWithEmployee, showExportWithOutEmployee, isOpenDeleteBookingModal,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [viewId, setViewId] = useState('');
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [checkItems, setCheckItems] = useState([]);
  const [checkValues, setCheckValues] = useState([]);
  const [typeItems, setTypeItems] = useState([]);
  const [bookingTypeItems, setBookingTypeItems] = useState([]);
  const [checkTypeValues, setTypeValues] = useState([]);
  const [maintenanceStatusItems, setMaintenanceStatusItems] = useState([]);
  const [changeCheckedState, setChangeCheckedState] = useState(false);
  const [bookingCheckBoxType, setBookingCheckBoxType] = useState("All Bookings Type");
  const [scrollTop, setScrollTop] = useState(0);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [typeCollapse, setTypeCollapse] = useState(false);
  // const [mantenanceStatusCollapse, setMantenanceStatusCollapse] = useState(false);
  const [workorders, setWorkorders] = useState([]);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [bookingTypeCollapse, setBookingTypeCollapse] = useState(false);
  const companyTZDate = getCompanyTimeZoneDate();

  const { userInfo } = useSelector((state) => state.user);
  const companyTimeZone=userInfo  && userInfo.data &&userInfo.data.company&&userInfo.data.company.timezone

  const {
    maintenanceCount, maintenanceInfo, stateGroupsInfo, workorderFilters, bookingDelete,
  } = useSelector((state) => state.workorder);

  const {
     typeGroupsInfo,
  } = useSelector((state) => state.bookingWorkorder);
  
  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company) && statusCollapse) {
      dispatch(getStateGroups(userInfo.data.company.id, appModels.EMPLOYEESTATE));
      // setPriorityCollapse(false);
    }
  }, [userInfo, statusCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company) && typeCollapse) {
      dispatch(getTypeGroups(userInfo.data.company.id, appModels.ASSETCATEGORY));
      // setPriorityCollapse(false);
    }
  }, [userInfo, typeCollapse]);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    if (!id) {
      setWorkorders([]);
    }
  }, [id]);

  useEffect(() => {
    if (statusValue && statusValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== statusValue));
    }
  }, [statusValue]);

  useEffect(() => {
    if (typeValue && typeValue !== 0) {
      setTypeItems(typeItems.filter((item) => item.id !== typeValue));
      setTypeValue(0);
    }
  }, [typeValue]);

  useEffect(() => {
    if (workorderStatusValue && workorderStatusValue !== 0) {
      setMaintenanceStatusItems(maintenanceStatusItems.filter((item) => item.id !== workorderStatusValue));
    }
  }, [workorderStatusValue]);

  useEffect(() => {
    if (maintenanceInfo && maintenanceInfo.data && id) {
      const arr = [...workorders, ...maintenanceInfo.data];
      setWorkorders([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [maintenanceInfo, id]);

  const setDateRange = (dateRangeObj) => {
    const start = `${moment(dateRangeObj[0]).tz(companyTimeZone).startOf('date').utc()
      .format('YYYY-MM-DD HH:mm:ss')}`;
    const end = `${moment(dateRangeObj[1]).tz(companyTimeZone).endOf('date').utc()
      .format('YYYY-MM-DD HH:mm:ss')}`;
    const query = `["planned_in",">=","${start}"],["planned_in","<=","${end}"]`;

    return query;
  };

  useEffect(() => {
    if (bookingCheckboxTypeCleared) {
      setBookingCheckBoxType('All Bookings Type');
      setBookingTypeItems([]);
      setBookingCheckboxTypeCleared(false);
    }
  }, [bookingCheckboxTypeCleared]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && workorderFilters) {
      const statusValues = workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
      const typeValues = workorderFilters.types ? getColumnArrayById(workorderFilters.types, 'id') : [];
      const bookingTypeValues = workorderFilters.bookingType ? getColumnArray(workorderFilters.bookingType, 'id') : [];
      if (workorderFilters.customFilters && !workorderFilters.customFilters.length) {
        setSelectedFilterValue(null);
        workorderFilters.customFilters = [{
          value: 'Today', label: 'Today', type: 'date', key: 'Today',
        }];
      }
      let customFilters;
      if (dateRange && dateRange[0] !== null && dateRange[1] !== null) {
        customFilters = setDateRange(dateRange);
        workorderFilters.customFilters = [];
      } else {
        const today = setDateRange([companyTZDate, companyTZDate]);
        customFilters = workorderFilters.customFilters && workorderFilters.customFilters.length ? queryGeneratorByDateAndTimeByKey(workorderFilters.customFilters, 'planned_in',companyTimeZone) : today;
      }
      let searchFilter;
      if (workorderFilters && workorderFilters.searchFilters && workorderFilters.searchFilters.length) {
        searchFilter = queryGenerator(workorderFilters.searchFilters);
      }
      dispatch(getMaintenanceCount(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id, statusValues, typeValues, customFilters, false, undefined, searchFilter, bookingTypeValues));
    }
  }, [userInfo, workorderFilters, dateRange, isOpenDeleteBookingModal]);

  useEffect(() => {
    if (workorderFilters && workorderFilters.customFilters) {
      setCustomFilters(workorderFilters.customFilters);
    }
  }, [workorderFilters]);

  useEffect(() => {
    if (bookingDelete && bookingDelete.data) {
      const payload = {
        bookingType: bookingTypeItems, states: workorderFilters.states, types: workorderFilters.types, customFilters: workorderFilters.customFilters, searchFilters: searchItems,
      };
      dispatch(getWorkorderFilter(payload));
    }
  }, [bookingDelete]);

  // const handleCustomFilterClose = (value) => {
  //   setCustomFilters(customFiltersList.filter((item) => item.key !== value));
  //   const payload = {
  //     states: checkItems, types: typeItems, customFilters: customFiltersList.filter((item) => item.key !== value),
  //   };
  //   dispatch(getWorkorderFilter(payload));
  //   setOffsetValue(0);
  //   if (afterReset) afterReset();
  //   setWorkorders([]);
  // };

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && (workorderFilters && (workorderFilters.states || workorderFilters.maintenanceStatus || workorderFilters.types || workorderFilters.customFilters))) {
      const statusValues = workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
      const typeValues = workorderFilters.types ? getColumnArray(workorderFilters.types, 'id', 'int') : [];
      const bookingTypeValues = workorderFilters.bookingType ? getColumnArray(workorderFilters.bookingType, 'id') : [];
      if (workorderFilters.customFilters && !workorderFilters.customFilters.length) {
        setSelectedFilterValue(null);
        workorderFilters.customFilters = [{
          value: 'Today', label: 'Today', type: 'date', key: 'Today',
        }];
      }
      let customFilters;
      if (dateRange && dateRange[0] !== null && dateRange[1] !== null) {
        customFilters = setDateRange(dateRange);
        workorderFilters.customFilters = [];
      } else {
        const today = setDateRange([companyTZDate, companyTZDate]);
        customFilters = workorderFilters.customFilters && workorderFilters.customFilters.length ? queryGeneratorByDateAndTimeByKey(workorderFilters.customFilters, 'planned_in', companyTimeZone) : today;
      }
      let searchFilter;
      if (workorderFilters && workorderFilters.searchFilters && workorderFilters.searchFilters.length) {
        searchFilter = queryGeneratorByDateAndTimeByKey(workorderFilters.searchFilters);
      }
      showFilter(false);
      dispatch(getMaintenance(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id, limit, offsetValue, statusValues, typeValues, customFilters, sortByValue, sortFieldValue, false, undefined, searchFilter, bookingTypeValues));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, workorderFilters, scrollTop, dateRange, isOpenDeleteBookingModal]);

  useEffect(() => {
    const payload = {
      bookingType: bookingTypeItems, states: checkItems, types: typeItems, customFilters: customFiltersList, maintenanceStatus: maintenanceStatusItems, searchFilters: searchItems,
    };
    dispatch(getWorkorderFilter(payload));
  }, [checkItems, typeItems, maintenanceStatusItems, bookingCheckBoxType, bookingTypeItems]);

  useEffect(() => {
    let statusValues = [];
    let typeValues = [];
    let filterList = [];
    let maintenanceList = [];
    let callFilter = true;
    if (checkItems && checkItems.length > 0) {
      statusValues = checkItems;
    } else if (workorderFilters && workorderFilters.states && workorderFilters.states.length > 0) {
      statusValues = workorderFilters.states;
      setCheckItems(workorderFilters.states);
      callFilter = false;
      setStatusCollapse(true);
    }

    if (maintenanceStatusItems && maintenanceStatusItems.length > 0) {
      maintenanceList = maintenanceStatusItems;
    } else if (workorderFilters && workorderFilters.maintenanceStatus && workorderFilters.maintenanceStatus.length > 0) {
      maintenanceList = workorderFilters.maintenanceStatus;
      setMaintenanceStatusItems(workorderFilters.maintenanceStatus);
      callFilter = false;
      // setMantenanceStatusCollapse(true);
    }

    if (typeItems && typeItems.length > 0) {
      typeValues = typeItems;
    } else if (workorderFilters && workorderFilters.types && workorderFilters.types.length > 0) {
      typeValues = workorderFilters.types;
      setTypeItems(workorderFilters.types);
      callFilter = false;
      setTypeCollapse(true);
    }

    filterList = customFiltersList;

    if (callFilter) {
      const payload = {
        bookingType: bookingTypeItems, states: statusValues, types: typeValues, customFilters: filterList, maintenanceStatus: maintenanceList, searchFilters: searchItems,
      };
      dispatch(getWorkorderFilter(payload));
    }
  }, []);

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setTypeValues([]);
    setSearchItems([]);
    showExportWithEmployee(false);
    showExportWithOutEmployee(false);
    setMaintenanceStatusItems([]);
    setBookingTypeItems([]);
    setBookingCheckBoxType('All Bookings Type');
    setTypeItems([]);
    setCustomFilters([]);
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
    onChangeDateRange([null, null]);
    clearDateRange();
    dispatch(setclearBookingMaintainanceInfo());
    dispatch(setclearBookingsCount());
    dispatch(setClearCleaningWorkOrderFilters());
    dispatch(setclearBookingWorkorderFilters());
  };

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      setCheckValues([]);
      setCheckItems([]);
      setTypeValues([]);
      setSearchItems([]);
      showExportWithEmployee(false);
      showExportWithOutEmployee(false);
      setMaintenanceStatusItems([]);
      // setMaintenanceStatusValues([]);
      setTypeItems([]);
      setCustomFilters([]);
      setOffsetValue(0);
      if (afterReset) afterReset();
      setWorkorders([]);
      onChangeDateRange([null, null]);
    }
  }, [userInfo]);

  const onScroll = (e) => {
    e.preventDefault();
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    const total = maintenanceCount && maintenanceCount.length ? maintenanceCount.length : 0;
    const scrollListCount = workorders && workorders.length ? workorders.length : 0;
    if ((maintenanceInfo && !maintenanceInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const handleCheckboxChange = (event) => {
    showExportWithEmployee(false);
    showExportWithOutEmployee(false);
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckValues((state) => [...state, value]);
      setCheckItems((state) => [...state, values]);
    } else {
      setCheckValues(checkValues.filter((item) => item !== value));
      setCheckItems(checkItems.filter((item) => item.id !== value));
      if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
        const payload = {
          bookingType: bookingTypeItems, states: checkItems.filter((item) => item.id !== value), types: typeItems, customFilters: customFiltersList, maintenanceStatus: maintenanceStatusItems, searchFilters: searchItems,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  // const handleMaintenanceCheckboxChange = (event, workOrderstatus) => {
  //   const { checked, value } = event.target;
  //   const values = { id: value, label: workOrderstatus.label };
  //   if (checked) {
  //     setMaintenanceStatusValues((state) => [...state, value]);
  //     setMaintenanceStatusItems((state) => [...state, values]);
  //   } else {
  //     setMaintenanceStatusValues(maintenanceStatusValues.filter((item) => item !== value));
  //     setMaintenanceStatusItems(maintenanceStatusItems.filter((item) => item.id !== value));
  //     if (maintenanceStatusItems.filter((item) => item.id !== value) && maintenanceStatusItems.filter((item) => item.id !== value).length === 0) {
  //       const payload = {
  //         maintenanceStatus: maintenanceStatusItems.filter((item) => item.id !== value), states: checkItems, customFilters: customFiltersList,
  //       };
  //       dispatch(getWorkorderFilter(payload));
  //     }
  //   }
  //   setOffsetValue(0);
  //   if (afterReset) afterReset();
  //   setWorkorders([]);
  // };

  const handleTypeCheckboxChange = (event, type) => {
    showExportWithEmployee(false);
    showExportWithOutEmployee(false);
    const { checked, name } = event.target;
    const values = { id: type.id, label: name };
    if (checked) {
      setTypeValues((state) => [...state, parseInt(type.id)]);
      setTypeItems((state) => [...state, values]);
    } else {
      setTypeValues(checkTypeValues.filter((item) => item !== type.id));
      setTypeItems(typeItems.filter((item) => item.id !== type.id));
      if (typeItems.filter((item) => item.id !== type.id) && typeItems.filter((item) => item.id !== type.id).length === 0) {
        const payload = {
          bookingType: bookingTypeItems, types: typeItems.filter((item) => item.id !== type.id), states: checkItems, customFilters: customFiltersList, maintenanceStatus: maintenanceStatusItems, searchFilters: searchItems,
        };
        dispatch(getWorkorderFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleStatusClose = (value) => {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    setOffsetValue(0);
    if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
      const payload = {
        states: checkItems.filter((item) => item.id !== value), types: typeItems, customFilters: customFiltersList, maintenanceStatus: maintenanceStatusItems, searchFilters: searchItems,
      };
      dispatch(getWorkorderFilter(payload));
    }
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const isUserError = userInfo && userInfo.data && userInfo.data.err;
  const isUserLoading = userInfo && userInfo.data && userInfo.data.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const currentId = viewId || id;
  const errorMsgStatus = (stateGroupsInfo && stateGroupsInfo.err) ? generateErrorMessage(stateGroupsInfo) : userErrorMsg;
  const states = stateGroupsInfo && stateGroupsInfo.data ? stateGroupsInfo.data : [];
  const statusValues = workorderFilters && workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
  const maintenanceStatusList = workorderFilters && workorderFilters.maintenanceStatus ? getColumnArray(workorderFilters.maintenanceStatus, 'id') : [];
  const statusList = workorderFilters && workorderFilters.states ? workorderFilters.states : [];

  const errorMsgType = (typeGroupsInfo && typeGroupsInfo.err) ? generateErrorMessage(typeGroupsInfo) : userErrorMsg;
  const types = typeGroupsInfo && typeGroupsInfo.data ? typeGroupsInfo.data : [];
  const typeValues = workorderFilters && workorderFilters.types ? getColumnArray(workorderFilters.types, 'id') : [];
  const typeList = workorderFilters && workorderFilters.types ? workorderFilters.types : [];
  const bookingTypeValues = workorderFilters && workorderFilters.bookingType && workorderFilters.bookingType.length > 0 ? getColumnArray(workorderFilters.bookingType, 'id') : [];
  useEffect(() => {
    if (workorderFilters && workorderFilters.states && workorderFilters.states.length) {
      if (workorderFilters.states.length !== 0) {
        setChangeCheckedState(true);
      }
    } else {
      setChangeCheckedState(false);
    }
  }, [workorderFilters]);

  const handleChange = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setTypeValues([]);
    setSearchItems([]);
    showExportWithEmployee(false);
    showExportWithOutEmployee(false);
  };

  function handleBookingTypeChange(e) {
    const { checked, name } = e.target;
    if (checked) {
      if (name === 'Employee') {
        setBookingTypeItems([]);
        setBookingCheckBoxType(name);
      }
      if (name === 'Guest') {
        setBookingTypeItems([]);
        setBookingCheckBoxType(name);
      }
      if (name === 'All Bookings Type') {
        setBookingTypeItems([]);
        setBookingCheckBoxType('All Bookings Type');
      }
    } else {
      if (name === 'Guest') {
        setBookingTypeItems([]);
        setBookingCheckBoxType('All Bookings Type');
      }
      if (name === 'Employee') {
        setBookingTypeItems([]);
        setBookingCheckBoxType('All Bookings Type');
      } else {
        setBookingCheckBoxType('All Bookings Type');
      }
    }
  }
  useEffect(() => {
    if (bookingCheckBoxType !== 'All Bookings Type') {
      const values = { id: bookingCheckBoxType, label: bookingCheckBoxType };
      setBookingTypeItems((state) => [...state, values]);
      // setCheckItems((state) => [...state, values]);
    }
  }, [bookingCheckBoxType]);

  return (
    <Card className="p-1 bg-lightblue h-100">
      <CardTitle className="mt-2 ml-2 mb-1 mr-2 sfilterarrow">
        <h3>
          Filters
        </h3>
        <hr className="m-0 border-color-grey" />
      </CardTitle>
      {id ? (
        <div onScroll={onScroll} className="pt-0 pl-0 pr-1 height-100 table-scrollable thin-scrollbar">
          {(workorders) && workorders.map((wo) => (
            <Card
              key={wo.id}
              onClick={() => setViewId(wo.id)}
              className={(wo.id === currentId) ? 'mb-2 ml-2 mr-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mb-2 ml-2 mr-2'}
            >
              <CardBody className="p-2">
                <Row>
                  <Col md={12} className="nowrap-content">
                    <img src={ordersIcon} className="mr-1" alt={wo.name} height="16" width="16" />
                    <span className="font-weight-700 font-15">{wo.name}</span>
                  </Col>
                </Row>
                <span className="font-weight-400 mb-1 ml-3 font-tiny">
                  #
                  {wo.sequence}
                </span>
                <Row>
                  <Col md={6} className="nowrap-content">
                    <span className="text-info font-weight-600 mb-0 ml-3 font-tiny">{wo.asset_category_id[1]}</span>
                  </Col>
                  <Col md={6} className="text-right">
                    {getSLALabelIcon(wo.date_scheduled, wo.date_execution)}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}

          {statusList && statusList.map((item) => (
            <h5 key={item.id} className="mr-2 content-inline">
              <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                {item.label}
                <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(item.id)} size="sm" icon={faTimesCircle} />
              </Badge>
            </h5>
          ))}

          {typeList && typeList.map((item) => (
            <h5 key={item.id} className="mr-2 content-inline">
              <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                {item.label}
                <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(item.id)} size="sm" icon={faTimesCircle} />
              </Badge>
            </h5>
          ))}

          {(maintenanceInfo && maintenanceInfo.err) && (
          <Card className="mb-2 mr-2 ml-2 border-nepal-1px">
            <CardBody className="p-2">
              <ErrorContent errorTxt={generateErrorMessage(maintenanceInfo)} />
            </CardBody>
          </Card>
          )}

          {(userInfo && userInfo.data && userInfo.data.err) && (
          <Card className="mb-2 mr-2 ml-2 border-nepal-1px">
            <CardBody className="p-2">
              <ErrorContent errorTxt={generateErrorMessage(userInfo)} />
            </CardBody>
          </Card>
          )}

          {((maintenanceInfo && maintenanceInfo.loading) || (userInfo && userInfo.data && userInfo.data.loading)) && (
          <Loader />
          )}
          <br />
          <br />
        </div>
      ) : (
          <CardBody className="pl-2 p-0 mt-2 h-100 position-relative scrollable-list thin-scrollbar">
            <Row className="m-0">
              <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                <p className="m-0 mb-2 font-weight-800 collapse-heading">By Booking Status</p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setStatusCollapse(!statusCollapse)} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={statusCollapse}>
              <div className="ml-n1">
                {((stateGroupsInfo && stateGroupsInfo.loading) || isUserLoading) && (
                  <Loader />
                )}
                <div className="checkbox mt-1">
                  <Input
                    type="checkbox"
                    id="All Bookings"
                    value="All Bookings"
                    name="All Bookings"
                    checked={!changeCheckedState}
                    onChange={handleChange}
                  />
                  <Label htmlFor="All Bookings">
                    <span className="margin-left-15px font-weight-500">All Bookings</span>
                  </Label>
                </div>
                {states && states.map((state, index) => (
                  state && (
                    <span className="mb-1 mt-1 d-block font-weight-500" key={state.state}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxstateaction${index}`}
                          value={state.state}
                          name={state.state}
                          checked={statusValues.some((selectedValue) => selectedValue.includes(state.state))}
                          onChange={handleCheckboxChange}
                        />
                        <Label htmlFor={`checkboxstateaction${index}`}>
                          <span className="margin-left-15px">{state.state}</span>
                        </Label>
                        {' '}
                      </div>
                    </span>
                  )
                ))}
                {((stateGroupsInfo && stateGroupsInfo.err) || isUserError) && (
                  <ErrorContent errorTxt={errorMsgStatus} />
                )}
              </div>
            </Collapse>
            <hr className="mt-2" />
            <Row className="m-0">
              <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                <p className="m-0 mb-2 font-weight-800 collapse-heading">By Space Category</p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setTypeCollapse(!typeCollapse)} size="sm" icon={typeCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={typeCollapse}>
              <div className="ml-n1">
                {((typeGroupsInfo && typeGroupsInfo.loading) || (isUserLoading)) && (
                  <Loader />
                )}
                {types && types.map((typeItem) => (
                  typeItem.name && (
                    <span className="mb-1 mt-1 d-block font-weight-500" key={typeItem.name}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxcgroup${typeItem.name}`}
                          value={typeItem.name}
                          name={typeItem.name}
                          checked={typeValues.some((selectedValue) => selectedValue.includes(typeItem.id))}
                          onChange={(event) => handleTypeCheckboxChange(event, typeItem)}
                        />
                        {' '}
                        <Label htmlFor={`checkboxcgroup${typeItem.name}`}><span>{typeItem.name}</span></Label>
                      </div>
                    </span>
                  )
                ))}
                {((typeGroupsInfo && typeGroupsInfo.err) || (isUserError)) && (
                  <ErrorContent errorTxt={errorMsgType} />
                )}
              </div>
            </Collapse>
            <hr className="mt-2" />
            <Row className="m-0">
              <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                <p className="m-0 mb-2 font-weight-800 collapse-heading">By Booking Category</p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setBookingTypeCollapse(!bookingTypeCollapse)} size="sm" icon={bookingTypeCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={bookingTypeCollapse}>
              {bookingTypeVariables && bookingTypeVariables.map((bookingTypes) => (
                <div className="checkbox mt-1">
                  <Input
                    type="checkbox"
                    id={bookingTypes.name}
                    name={bookingTypes.name}
                    checked={bookingCheckBoxType === bookingTypes.name}
                    onChange={handleBookingTypeChange}
                    disabled={maintenanceInfo && maintenanceInfo.loading}
                  />
                  <Label htmlFor={bookingTypes.name}>
                    <span className="margin-left-15px font-weight-500">{bookingTypes.name}</span>
                  </Label>
                </div>
              ))}
            </Collapse>
            <hr className="mt-2" />
            {((statusList && statusList.length > 0)
              || (typeList && typeList.length > 0)
              || (maintenanceStatusList && maintenanceStatusList.length > 0)
              || (dateRange && dateRange[0] !== null && dateRange[1] !== null)
              || (searchItems && searchItems.length)
              || (bookingCheckBoxType && bookingCheckBoxType.length > 0 && bookingCheckBoxType !== 'All Bookings Type')
              || (customFiltersList && customFiltersList.length > 0) && !find(customFiltersList, { key: 'Today' })) && (
                <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
              )}
          </CardBody>
        )}
    </Card>
  );
};

SideFilters.propTypes = {
  offset: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  bookingCheckboxTypeCleared: PropTypes.bool.isRequired,
  setBookingCheckboxTypeCleared: PropTypes.func.isRequired,
  bookingTypeItemsCleared: PropTypes.bool.isRequired,
  setBookingTypeItemsCleared: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  showExportWithEmployee: PropTypes.func,
  showExportWithOutEmployee: PropTypes.func,
  setSelectedFilterValue: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
  sortField: PropTypes.string,
  workorderStatusValue: PropTypes.number,
  typeValue: PropTypes.number,
  dateRange: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  onChangeDateRange: PropTypes.func,
  clearDateRange: PropTypes.func,
  setTypeValue: PropTypes.func,
  setSearchItems: PropTypes.func,
  showFilter: PropTypes.func,
  searchItems: PropTypes.oneOfType([
    PropTypes.array,
  ]),
};

SideFilters.defaultProps = {
  workorderStatusValue: undefined,
  typeValue: undefined,
  dateRange: undefined,
  onChangeDateRange: undefined,
  clearDateRange: undefined,
  setTypeValue: undefined,
  setSearchItems: undefined,
  searchItems: undefined,
  showExportWithEmployee: undefined,
  showExportWithOutEmployee: undefined,
  showFilter: undefined,
  sortBy: undefined,
  sortField: undefined,
};

export default SideFilters;
