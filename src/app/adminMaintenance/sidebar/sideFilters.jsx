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
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';

import {
  getTypeGroups, getStateGroups, getCleaningWorkorderFilter, getWorkordersCount, getWorkorders, setClearCleaningWorkOrderFilters,
} from '../adminMaintenanceService';
import {
  getSLALabelIcon,
} from '../utils/utils';
import {
  getColumnArray, getColumnArrayById, queryGeneratorByDateAndTimeByKey,
  generateErrorMessage,
} from '../../util/appUtils';
import filtersFields from '../filters/filtersFields.json';

const appModels = require('../../util/appModels').default;

const SideFilters = (props) => {
  const {
    offset, id, statusValue, setSelectedFilterValue, afterReset,
    sortBy, sortField, workorderStatusValue, typeValue, setTypeValue, workValue, setWorkValue, dateRange, onChangeDateRange, clearDateRange, showExport,
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
  const [checkTypeValues, setTypeValues] = useState([]);
  const [maintenanceStatusItems, setMaintenanceStatusItems] = useState([]);
  // const [maintenanceStatusValues, setMaintenanceStatusValues] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [statusCollapse] = useState(true);
  const [typeCollapse, setTypeCollapse] = useState(true);
  // const [mantenanceStatusCollapse, setMantenanceStatusCollapse] = useState(true);
  const [workorders, setWorkorders] = useState([]);
  const [customFiltersList, setCustomFilters] = useState([]);
  const companyTZDate = getCompanyTimeZoneDate();
  const [workOrderCollapse, setworkOrderCollapse] = useState(true);
  const [workOrderStatusItem, setWorkOrderStatusItem] = useState([]);
  const [workStatusValues, setWorkStatusValues] = useState([]);
  const { userInfo } = useSelector((state) => state.user);
  const {
    maintenanceCount, maintenanceInfo, cleaningWorkorderFilters, typeGroupsInfo, workorder,
  } = useSelector((state) => state.bookingWorkorder);
  const { bulkOrders } = useSelector((state) => state.bookingWorkorder);
  const companyTimeZone=userInfo && userInfo.data &&userInfo.data.company&&userInfo.data.company.timezone

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
    if (workValue && workValue !== '') {
      setWorkOrderStatusItem(workOrderStatusItem.filter((item) => item.wid !== workValue));
      setWorkValue(0);
    }
  }, [workValue]);

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
    const query = `["date_planned",">=","${start}"],["date_planned","<=","${end}"]`;
    return query;
  };
  const workorderFiltersCall = cleaningWorkorderFilters && (cleaningWorkorderFilters.states && cleaningWorkorderFilters.states.length
    || cleaningWorkorderFilters.maintenanceStatus && cleaningWorkorderFilters.maintenanceStatus.length
    || cleaningWorkorderFilters.types && cleaningWorkorderFilters.types.length
    || cleaningWorkorderFilters.state && cleaningWorkorderFilters.state.length
    || cleaningWorkorderFilters.customFilters);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && workorderFiltersCall) {
      const statusValues = cleaningWorkorderFilters.states ? getColumnArray(cleaningWorkorderFilters.states, 'id') : [];
      const typeValues = cleaningWorkorderFilters.types ? getColumnArrayById(cleaningWorkorderFilters.types, 'id') : [];
      const workorderValue = cleaningWorkorderFilters.state ? getColumnArrayById(cleaningWorkorderFilters.state, 'value') : [];

      if (cleaningWorkorderFilters.customFilters && !cleaningWorkorderFilters.customFilters.length) {
        setSelectedFilterValue(null);
        cleaningWorkorderFilters.customFilters = [{
          value: 'Today', label: 'Today', type: 'date', key: 'Today',
        }];
      }
      let customFilters;
      if (dateRange && dateRange[0] !== null && dateRange[1] !== null) {
        customFilters = setDateRange(dateRange);
        cleaningWorkorderFilters.customFilters = [];
      } else {
        const today = setDateRange([companyTZDate, companyTZDate]);
        customFilters = cleaningWorkorderFilters.customFilters && cleaningWorkorderFilters.customFilters.length ? queryGeneratorByDateAndTimeByKey(cleaningWorkorderFilters.customFilters, 'date_planned',companyTimeZone) : today;
      }
      dispatch(getWorkordersCount(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id, statusValues, typeValues, workorderValue, customFilters, true, true));
    }
  }, [userInfo, cleaningWorkorderFilters, dateRange]);

  useEffect(() => {
    if (cleaningWorkorderFilters && cleaningWorkorderFilters.customFilters) {
      setCustomFilters(cleaningWorkorderFilters.customFilters);
    }
  }, [cleaningWorkorderFilters]);

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
    if (userInfo && userInfo.data && userInfo.data.company && workorderFiltersCall) {
      const statusValues = cleaningWorkorderFilters.states ? getColumnArray(cleaningWorkorderFilters.states, 'id') : [];
      const typeValues = cleaningWorkorderFilters.types ? getColumnArray(cleaningWorkorderFilters.types, 'id', 'int') : [];
      const workorderValue = cleaningWorkorderFilters.state ? getColumnArray(cleaningWorkorderFilters.state, 'value') : [];
      if (cleaningWorkorderFilters.customFilters && !cleaningWorkorderFilters.customFilters.length) {
        setSelectedFilterValue(null);
        cleaningWorkorderFilters.customFilters = [{
          value: 'Today', label: 'Today', type: 'date', key: 'Today',
        }];
      }
      let customFilters;
      if (dateRange && dateRange[0] !== null && dateRange[1] !== null) {
        customFilters = setDateRange(dateRange);
        cleaningWorkorderFilters.customFilters = [];
      } else {
        const today = setDateRange([companyTZDate, companyTZDate]);
        customFilters = cleaningWorkorderFilters.customFilters && cleaningWorkorderFilters.customFilters.length ? queryGeneratorByDateAndTimeByKey(cleaningWorkorderFilters.customFilters, 'date_planned',companyTimeZone) : today;
      }
      dispatch(getWorkorders(userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id, workorderValue, limit, offsetValue, statusValues, typeValues, customFilters, sortByValue, sortFieldValue, true, true));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, cleaningWorkorderFilters, scrollTop, dateRange]);

  useEffect(() => {
    const payload = {
      state: workOrderStatusItem, states: checkItems, types: typeItems, customFilters: customFiltersList, maintenanceStatus: maintenanceStatusItems,
    };
    dispatch(getCleaningWorkorderFilter(payload));
  }, [checkItems, typeItems, maintenanceStatusItems, workOrderStatusItem]);

  useEffect(() => {
    if (bulkOrders && bulkOrders.data) {
      const payload = {
        state: workOrderStatusItem, states: checkItems, types: typeItems, customFilters: customFiltersList, maintenanceStatus: maintenanceStatusItems,
      };
      dispatch(getCleaningWorkorderFilter(payload));
    }
  }, [bulkOrders]);

  useEffect(() => {
    const payload = {
      state: workOrderStatusItem,
      states: checkItems,
      types: typeItems,
      customFilters: customFiltersList,
      maintenanceStatus: maintenanceStatusItems,
    };
    dispatch(getCleaningWorkorderFilter(payload));
  }, []);

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setTypeValues([]);
    // setWorkOrderStatusItem([])
    showExport(false);
    setWorkOrderStatusItem([]);
    setWorkStatusValues([]);
    setMaintenanceStatusItems([]);
    // setMaintenanceStatusValues([]);
    setTypeItems([]);
    setCustomFilters([]);
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
    onChangeDateRange([null, null]);
    clearDateRange();
    dispatch(setClearCleaningWorkOrderFilters());
  };

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      setCheckValues([]);
      setCheckItems([]);
      setTypeValues([]);
      // setWorkOrderStatuses('')
      setWorkOrderStatusItem([]);
      setWorkStatusValues([]);

      showExport(false);

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
  // const handleCheckboxChange = (event) => {
  //   const { checked, value, name } = event.target;
  //   const values = { id: value, label: name };
  //   if (checked) {
  //     setCheckValues((state) => [...state, value]);
  //     setCheckItems((state) => [...state, values]);
  //   } else {
  //     setCheckValues(checkValues.filter((item) => item !== value));
  //     setCheckItems(checkItems.filter((item) => item.id !== value));
  //     if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
  //       const payload = {
  //         states: checkItems.filter((item) => item.id !== value), types: typeItems, customFilters: customFiltersList, maintenanceStatus: maintenanceStatusItems,
  //       };
  //       dispatch(getWorkorderFilter(payload));
  //     }
  //   }
  //   setOffsetValue(0);
  //   if (afterReset) afterReset();
  //   setWorkorders([]);
  // };

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
    showExport(false);
    const { checked, name } = event.target;
    const values = { id: type.id, label: name };
    if (checked) {
      setTypeValues((state) => [...state, parseInt(type.id)]);
      setTypeItems((state) => uniqBy([...state, values], 'id'));
    } else {
      setTypeValues(checkTypeValues.filter((item) => item !== type.wid));
      setTypeItems(typeItems.filter((item) => item.id !== type.id));
      if (typeItems.filter((item) => item.id !== type.id) && typeItems.filter((item) => item.id !== type.id).length === 0) {
        const payload = {
          types: typeItems.filter((item) => item.id !== type.id), state: workOrderStatusItem, states: checkItems, customFilters: customFiltersList, maintenanceStatus: maintenanceStatusItems,
        };
        dispatch(getCleaningWorkorderFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  const handleWorkOrderStatusCheckBox = (event, type) => {
    showExport(false);
    const { checked } = event.target;
    const values = { wid: type.wid, label: type.label, value: type.value };
    if (checked) {
      setWorkStatusValues((state) => uniqBy([...state, 'value']));
      setWorkOrderStatusItem((state) => uniqBy([...state, values], 'wid'));
    } else {
      setWorkStatusValues(workStatusValues.filter((item) => item !== type.value));
      setWorkOrderStatusItem(workOrderStatusItem.filter((item) => item.wid !== type.wid));
      if (workOrderStatusItem.filter((item) => item.wid !== type.wid) && workOrderStatusItem.filter((item) => item.wid !== type.wid).length === 0) {
        const payload = {
          state: workOrderStatusItem.filter((item) => item.wid !== type.wid), types: typeItems, states: checkItems, customFilters: customFiltersList, maintenanceStatus: maintenanceStatusItems,
        };
        dispatch(getCleaningWorkorderFilter(payload));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setWorkorders([]);
  };

  function handleStatusClose(value) {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    setOffsetValue(0);
    if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
      const payload = {
        states: checkItems.filter((item) => item.id !== value), state: workOrderStatusItem, types: typeItems, customFilters: customFiltersList, maintenanceStatus: maintenanceStatusItems,
      };
      dispatch(getCleaningWorkorderFilter(payload));
    }
    if (afterReset) afterReset();
    setWorkorders([]);
  }

  const isUserError = userInfo && userInfo.data && userInfo.data.err;
  const isUserLoading = userInfo && userInfo.data && userInfo.data.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const currentId = viewId || id;
  // const errorMsgStatus = (stateGroupsInfo && stateGroupsInfo.err) ? generateErrorMessage(stateGroupsInfo) : userErrorMsg;
  // const states = stateGroupsInfo && stateGroupsInfo.data ? stateGroupsInfo.data : [];
  // const statusValues = workorderFilters && workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
  const maintenanceStatusList = cleaningWorkorderFilters && cleaningWorkorderFilters.maintenanceStatus ? getColumnArray(cleaningWorkorderFilters.maintenanceStatus, 'id') : [];
  const statusList = cleaningWorkorderFilters && cleaningWorkorderFilters.states ? cleaningWorkorderFilters.states : [];

  const errorMsgType = (typeGroupsInfo && typeGroupsInfo.err) ? generateErrorMessage(typeGroupsInfo) : userErrorMsg;
  const types = typeGroupsInfo && typeGroupsInfo.data ? typeGroupsInfo.data : [];
  const typeValues = cleaningWorkorderFilters && cleaningWorkorderFilters.types ? getColumnArray(cleaningWorkorderFilters.types, 'id') : [];
  const typeList = cleaningWorkorderFilters && cleaningWorkorderFilters.types ? cleaningWorkorderFilters.types : [];
  const workStatusList = cleaningWorkorderFilters && cleaningWorkorderFilters.state ? cleaningWorkorderFilters.state : [];
  const workStatusValue = cleaningWorkorderFilters && cleaningWorkorderFilters.state ? getColumnArray(cleaningWorkorderFilters.state, 'wid') : [];
  return (
    <Card className="p-1 bg-lightblue h-100">
      <CardTitle className="mt-2 ml-2 mb-1 mr-2 sfilterarrow">
        <h3>
          Filter
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

          {workStatusList && workStatusList.map((item) => (
            <h5 key={item.wid} className="mr-2 content-inline">
              <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                {item.label}
                <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(item.wid)} size="sm" icon={faTimesCircle} />
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
          {/* <Row className="m-0">
            <Col md="8" xs="8" sm="8" lg="8" className="p-0">
              <p className="m-0 font-weight-800 collapse-heading">By Workorder Status</p>
            </Col>
            <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
              <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setMantenanceStatusCollapse(!mantenanceStatusCollapse)} size="sm" icon={typeCollapse ? faChevronUp : faChevronDown} />
            </Col>
          </Row>
          <Collapse isOpen={mantenanceStatusCollapse}>
            <div>
              {maintenanceStatus && maintenanceStatus.map((workOrderstatus) => (
                workOrderstatus.status && (
                <span className="mb-1 d-block font-weight-500" key={workOrderstatus.status}>
                  <div className="checkbox">
                    <Input
                      type="checkbox"
                      id={`checkboxcgroup${workOrderstatus.status}`}
                      value={workOrderstatus.status}
                      name={workOrderstatus.status}
                      checked={maintenanceStatusList.some((selectedValue) => selectedValue.includes(workOrderstatus.status))}
                      onChange={(event) => handleMaintenanceCheckboxChange(event, workOrderstatus)}
                    />
                    {' '}
                    <Label htmlFor={`checkboxcgroup${workOrderstatus.status}`}><span>{workOrderstatus.label}</span></Label>
                  </div>
                </span>
                )
              ))}
            </div>
          </Collapse>
          <hr className="mt-2" /> */}
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
                <span className="mb-1 d-block font-weight-500" key={typeItem.name}>
                  <div className="checkbox">
                    <Input
                      type="checkbox"
                      id={`checkboxcgroup${typeItem.name}`}
                      disabled={workorder && workorder.loading}
                      value={typeItem.name}
                      name={typeItem.name}
                      checked={typeValues.some((selectedValue) => selectedValue.includes(typeItem.id))}
                      onChange={(event) => handleTypeCheckboxChange(event, typeItem)}
                    />
                    {' '}
                    <Label htmlFor={`checkboxcgroup${typeItem.name}`}><span className="margin-left-15px">{typeItem.name}</span></Label>
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
              <p className="m-0 mb-2 font-weight-800 collapse-heading">By Workorder Status</p>
            </Col>
            <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
              <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setworkOrderCollapse(!workOrderCollapse)} size="sm" icon={workOrderCollapse ? faChevronUp : faChevronDown} />
            </Col>
          </Row>
          <Collapse isOpen={workOrderCollapse}>
            <div className="ml-n1">
              {((maintenanceInfo && maintenanceInfo.loading) || (isUserLoading)) && (
              <Loader />
              )}
              {filtersFields && filtersFields.workorderStatus && filtersFields.workorderStatus.map((typeItem) => (
                typeItem.label && (
                <span className="mb-1 d-block font-weight-500" key={typeItem.label}>
                  <div className="checkbox">
                    <Input
                      type="checkbox"
                      id={`checkboxcgroup${typeItem.label}`}
                      value={typeItem.label}
                      name={typeItem.label}
                      disabled={workorder && workorder.loading}
                      checked={workStatusValue.some((selectedValue) => (selectedValue).includes(typeItem.wid))}
                      onChange={(event) => handleWorkOrderStatusCheckBox(event, typeItem)}
                    />
                    {' '}
                    <Label htmlFor={`checkboxcgroup${typeItem.label}`}><span className="margin-left-15px">{typeItem.label}</span></Label>
                  </div>
                </span>
                )
              ))}
              {((isUserError)) && (
              <ErrorContent errorTxt={errorMsgType} />
              )}
            </div>
          </Collapse>
          <hr className="mt-2" />

          {((statusList && statusList.length > 0)
              || (typeList && typeList.length > 0) || (workStatusList && workStatusList.length > 0)
              || (maintenanceStatusList && maintenanceStatusList.length > 0)
              || (dateRange && dateRange[0] !== null && dateRange[1] !== null)
              || (customFiltersList && customFiltersList.length > 0) && !find(customFiltersList, { key: 'Today' })) && (
                <div aria-hidden="true" className="text-right reset-filter cursor-pointer my-2 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
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
  afterReset: PropTypes.func.isRequired,
  showExport: PropTypes.func,
  setSelectedFilterValue: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  workorderStatusValue: PropTypes.number,
  typeValue: PropTypes.number,
  dateRange: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  workValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  setWorkValue: PropTypes.func,
  onChangeDateRange: PropTypes.func,
  clearDateRange: PropTypes.func,
  setTypeValue: PropTypes.func,
};
SideFilters.defaultProps = {
  workorderStatusValue: undefined,
  typeValue: undefined,
  dateRange: undefined,
  onChangeDateRange: undefined,
  clearDateRange: undefined,
  setTypeValue: undefined,
  showExport: undefined,
  workValue: undefined,
  setWorkValue: undefined,
};
export default SideFilters;
