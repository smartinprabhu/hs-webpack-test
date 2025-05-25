/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment-timezone';
import {
  Badge, Collapse, Card, CardBody, CardTitle, Col, Input, Label, Row, UncontrolledTooltip,
  FormGroup,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import assetDefault from '@images/icons/assetDefault.svg';
import collapseIcon from '@images/collapse.png';

import {
  getTransfers, getTransferFilters, getTransferDetail,
  getTransfersCount, getStockPickingTypesList,
} from '../../../purchaseService';
import {
  getColumnArrayById, generateErrorMessage, truncate, getDefaultNoValue,
  getAllowedCompanies, extractTextObject, queryGeneratorWithUtc,
} from '../../../../util/appUtils';
import customData from '../../data/customData.json';

const { RangePicker } = DatePicker;
const appModels = require('../../../../util/appModels').default;

const Sidebar = (props) => {
  const {
    offset, id, ids, isAll, statusValue, orderValue, typeValue, isClosed, afterReset, setCollapse, collapse,
    sortBy, sortField,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkOrderValues, setCheckOrderValues] = useState([]);
  const [checkOrderItems, setCheckOrderItems] = useState([]);
  const [checkTypeValues, setCheckTypeValues] = useState([]);
  const [checkTypeItems, setCheckTypeItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [orderCollapse, setOrderCollapse] = useState(false);
  const [typeCollapse, setTypesCollapse] = useState(false);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [typeGroups, setTypeGroups] = useState([]);
  const [transfer, setTransfer] = useState([]);
  const [viewId, setViewId] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [datefilterList, setDatefilterList] = useState([]);
  const [selectedDate, setSelectedDate] = useState([null, null]);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    transferFilters, transfersInfo, stateChangeInfo, backorderInfo,
    transfersCount, addReceiptInfo, operationTypesInfo, stateValidateInfo,
  } = useSelector((state) => state.purchase);

  const stateData = stateChangeInfo && stateChangeInfo.data ? stateChangeInfo.data : false;
  const validateData = stateValidateInfo && stateValidateInfo.data ? stateValidateInfo.data : false;
  const boData = backorderInfo && backorderInfo.data ? backorderInfo.data : false;

  const isStateNotChange = (stateData && stateData.data && typeof stateData.data === 'object');
  const isStateChange = (stateData && stateData.data && typeof stateData.data === 'boolean') || (stateData && !isStateNotChange && stateData.status);

  const isNotValidated = (validateData && validateData.data && typeof validateData.data === 'object');
  const isValidated = (validateData && validateData.data && typeof validateData.data === 'boolean') || (validateData && !isNotValidated && validateData.status);

  const isBoNoStatus = (boData && boData.data && typeof boData.data === 'object');
  const isBoStatus = (boData && boData.data && typeof boData.data === 'boolean') || (boData && !isBoNoStatus && boData.status);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    if (!id) {
      setTransfer([]);
    }
  }, [id]);

  useEffect(() => {
    if (operationTypesInfo && operationTypesInfo.data) {
      setTypeGroups(operationTypesInfo.data);
    }
  }, [operationTypesInfo]);

  useEffect(() => {
    if (statusCollapse) {
      setOrderCollapse(false);
      setTypesCollapse(false);
    }
  }, [statusCollapse]);

  useEffect(() => {
    if (orderCollapse) {
      setStatusCollapse(false);
      setTypesCollapse(false);
    }
  }, [orderCollapse]);

  useEffect(() => {
    if (typeCollapse) {
      setStatusCollapse(false);
      setOrderCollapse(false);
    }
  }, [typeCollapse]);

  useEffect(() => {
    if (userInfo && userInfo.data && typeCollapse) {
      dispatch(getStockPickingTypesList(companies, appModels.STOCKPICKINGTYPES, [], []));
    }
  }, [userInfo, typeCollapse]);

  useEffect(() => {
    if (transfersInfo && transfersInfo.data && id) {
      const arr = [...transfer, ...transfersInfo.data];
      setTransfer([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [transfersInfo, id]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    if (transferFilters && transferFilters.customFilters) {
      setCustomFilters(transferFilters.customFilters);
    }
  }, [transferFilters]);

  useEffect(() => {
    if (orderValue && orderValue !== 0) {
      setCheckOrderItems(checkOrderItems.filter((item) => item.id !== orderValue));
      if (orderValue === 'Custom') {
        setDatefilterList([]);
        setSelectedDate([null, null]);
      }
      if (checkOrderItems.filter((item) => item.id !== orderValue) && checkOrderItems.filter((item) => item.id !== orderValue).length === 0
      && (checkItems && !checkItems.length) && (checkTypeItems && !checkTypeItems.length)) {
        dispatch(getTransferFilters(checkItems, checkOrderItems.filter((item) => item.id !== orderValue), checkTypeItems, customFiltersList));
      }
    }
    if (statusValue && statusValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== statusValue));
      if (checkItems.filter((item) => item.id !== statusValue) && checkItems.filter((item) => item.id !== statusValue).length === 0
      && (checkOrderItems && !checkOrderItems.length) && (checkTypeItems && !checkTypeItems.length)) {
        dispatch(getTransferFilters(checkItems.filter((item) => item.id !== statusValue), checkOrderItems, checkTypeItems, customFiltersList));
      }
    }
    if (typeValue && typeValue !== 0) {
      setCheckTypeItems(checkTypeItems.filter((item) => item.id !== typeValue));
      if (checkTypeItems.filter((item) => item.id !== typeValue) && checkTypeItems.filter((item) => item.id !== typeValue).length === 0
      && (checkOrderItems && !checkOrderItems.length) && (checkItems && !checkItems.length)) {
        dispatch(getTransferFilters(checkItems, checkOrderItems, checkTypeItems.filter((item) => item.id !== typeValue), customFiltersList));
      }
    }
  }, [isClosed]);

  useEffect(() => {
    if ((checkItems && checkItems.length > 0) || (checkOrderItems && checkOrderItems.length > 0) || (checkTypeItems && checkTypeItems.length > 0)) {
      dispatch(getTransferFilters(checkItems, checkOrderItems, checkTypeItems, customFiltersList));
    }
  }, [checkItems, checkOrderItems, checkTypeItems]);

  useEffect(() => {
    let statusValues = [];
    let typeValues = [];
    let filterList = [];
    let callFilter = true;
    if (checkItems && checkItems.length > 0) {
      statusValues = checkItems;
    } else if (transferFilters && transferFilters.statuses && transferFilters.statuses.length > 0) {
      statusValues = transferFilters.statuses;
      setCheckItems(transferFilters.statuses);
      callFilter = false;
      setStatusCollapse(true);
    }
    if (checkTypeItems && checkTypeItems.length > 0) {
      typeValues = checkTypeItems;
    } else if (transferFilters && transferFilters.types && transferFilters.types.length > 0) {
      typeValues = transferFilters.types;
      setCheckTypeItems(transferFilters.types);
      callFilter = false;
      setTypesCollapse(true);
    }
    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (transferFilters && transferFilters.customFilters) {
      filterList = transferFilters.customFilters;
    }
    if (callFilter) {
      dispatch(getTransferFilters(statusValues, [], typeValues, filterList));
    }
  }, []);

  useEffect(() => {
    if ((ids)
    && ((userInfo && userInfo.data && transferFilters) && (transferFilters.statuses || transferFilters.orderes || transferFilters.types || transferFilters.customFilters))) {
      const statusValues = transferFilters.statuses ? getColumnArrayById(transferFilters.statuses, 'id') : [];
      const orderValues = transferFilters.orderes ? transferFilters.orderes : [];
      const typeValues = transferFilters.types ? getColumnArrayById(transferFilters.types, 'id') : [];
      const customFilters = transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters,false, userInfo.data) : '';
      dispatch(getTransfers(companies, ids, appModels.STOCK, limit, offsetValue, statusValues, orderValues, typeValues, customFilters, sortByValue, sortFieldValue));
    } else if ((!ids)
    && ((userInfo && userInfo.data && transferFilters) && (transferFilters.statuses || transferFilters.orderes || transferFilters.types || transferFilters.customFilters))) {
      const statusValues = transferFilters.statuses ? getColumnArrayById(transferFilters.statuses, 'id') : [];
      const orderValues = transferFilters.orderes ? transferFilters.orderes : [];
      const typeValues = transferFilters.types ? getColumnArrayById(transferFilters.types, 'id') : [];
      const customFilters = transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters,false, userInfo.data) : '';
      const idList = !isAll ? [] : false;
      dispatch(getTransfers(companies, idList, appModels.STOCK, limit, offsetValue, statusValues, orderValues, typeValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [userInfo, ids, offsetValue, sortByValue, sortFieldValue, transferFilters, scrollTop]);

  useEffect(() => {
    if (userInfo && userInfo.data && id === 0 && isAll) {
      const statusValues = transferFilters.statuses ? getColumnArrayById(transferFilters.statuses, 'id') : [];
      const orderValues = transferFilters.orderes ? transferFilters.orderes : [];
      const typeValues = transferFilters.types ? getColumnArrayById(transferFilters.types, 'id') : [];
      const customFilters = transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters, false, userInfo.data) : '';
      const idList = ids || false;
      dispatch(getTransfers(companies, idList, appModels.STOCK, limit, offsetValue, statusValues, orderValues, typeValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [id, isAll]);

  useEffect(() => {
    if (ids
      && userInfo && userInfo.data && transferFilters && (transferFilters.statuses || transferFilters.orderes || transferFilters.types || transferFilters.customFilters)) {
      const statusValues = transferFilters.statuses ? getColumnArrayById(transferFilters.statuses, 'id') : [];
      const orderValues = transferFilters.orderes ? transferFilters.orderes : [];
      const typeValues = transferFilters.types ? getColumnArrayById(transferFilters.types, 'id') : [];
      const customFilters = transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters,false, userInfo.data) : '';
      dispatch(getTransfersCount(companies, ids, appModels.STOCK, statusValues, orderValues, typeValues, customFilters));
    } else if ((!ids)
    && (userInfo && userInfo.data && transferFilters) && (transferFilters.statuses || transferFilters.orderes || transferFilters.types || transferFilters.customFilters)) {
      const statusValues = transferFilters.statuses ? getColumnArrayById(transferFilters.statuses, 'id') : [];
      const orderValues = transferFilters.orderes ? transferFilters.orderes : [];
      const typeValues = transferFilters.types ? getColumnArrayById(transferFilters.types, 'id') : [];
      const customFilters = transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters,false, userInfo.data) : '';
      const idList = !isAll ? [] : false;
      dispatch(getTransfersCount(companies, idList, appModels.STOCK, statusValues, orderValues, typeValues, customFilters));
    }
  }, [userInfo, ids, transferFilters]);

  useEffect(() => {
    if ((isStateChange) || (isValidated) || (isBoStatus)) {
      const statusValues = transferFilters.statuses ? getColumnArrayById(transferFilters.statuses, 'id') : [];
      const orderValues = transferFilters.orderes ? transferFilters.orderes : [];
      const typeValues = transferFilters.types ? getColumnArrayById(transferFilters.types, 'id') : [];
      const customFilters = transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTransfersCount(companies, ids, appModels.STOCK, statusValues, orderValues, typeValues, customFilters));
      dispatch(getTransfers(companies, ids, appModels.STOCK, limit, offsetValue, statusValues, orderValues, typeValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [stateChangeInfo, backorderInfo, stateValidateInfo]);

  useEffect(() => {
    if (addReceiptInfo && addReceiptInfo.data && isAll) {
      const statusValues = transferFilters.statuses ? getColumnArrayById(transferFilters.statuses, 'id') : [];
      const orderValues = transferFilters.orderes ? transferFilters.orderes : [];
      const typeValues = transferFilters.types ? getColumnArrayById(transferFilters.types, 'id') : [];
      const customFilters = transferFilters.customFilters ? queryGeneratorWithUtc(transferFilters.customFilters,false, userInfo.data) : '';
      dispatch(getTransfersCount(companies, ids, appModels.STOCK, statusValues, orderValues, typeValues, customFilters));
      dispatch(getTransfers(companies, ids, appModels.STOCK, limit, offsetValue, statusValues, orderValues, typeValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [addReceiptInfo, isAll]);

  const onDateRangeChange = (dates) => {
    setSelectedDate(dates);
  };

  const handleCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckValues((state) => [...state, value]);
      setCheckItems((state) => [...state, values]);
    } else {
      setCheckValues(checkValues.filter((item) => item !== value));
      setCheckItems(checkItems.filter((item) => item.id !== value));
      if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getTransferFilters(checkItems.filter((item) => item.id !== value), checkOrderItems, checkTypeItems, customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTransfer([]);
  };

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        const start = `${moment(selectedDate[0]).utc().format('YYYY-MM-DD')}`;
        const end = `${moment(selectedDate[1]).utc().format('YYYY-MM-DD')}`;
        const startLabel = `${moment(selectedDate[0]).utc().format('DD/MM/YYYY')}`;
        const endLabel = `${moment(selectedDate[1]).utc().format('DD/MM/YYYY')}`;
        const value = 'Custom';
        const label = `${value} - ${startLabel} - ${endLabel}`;
        const filters = {
          id: 'Custom', label, start, end,
        };
        setCheckOrderValues(checkOrderValues.filter((item) => item !== value));
        setCheckOrderItems(checkOrderItems.filter((item) => item.id !== value));
        setCheckOrderValues((state) => [...state, value]);
        setCheckOrderItems((state) => [...state, filters]);
        setOffsetValue(0);
        if (afterReset) afterReset();
        setTransfer([]);
      }
    }
  }, [selectedDate]);

  const handleOrderCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      if (value === 'Custom') {
        const filters = [{
          key: value, value, label: value, type: 'date',
        }];
        setDatefilterList(filters);
      } else {
        setCheckOrderValues((state) => [...state, value]);
        setCheckOrderItems((state) => [...state, values]);
      }
    } else {
      if (value === 'Custom') {
        setDatefilterList([]);
        setSelectedDate([null, null]);
      }
      setCheckOrderValues(checkOrderValues.filter((item) => item !== value));
      setCheckOrderItems(checkOrderItems.filter((item) => item.id !== value));
      if (checkOrderItems.filter((item) => item.id !== value) && checkOrderItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getTransferFilters(checkItems, checkOrderItems.filter((item) => item.id !== value), checkTypeItems, customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTransfer([]);
  };

  const handleTypeCheckboxChange = (event, data) => {
    const { checked, value, name } = event.target;
    const whname = data && data.warehouse_id ? data.warehouse_id[1] : 'Warehouse';
    const values = {
      id: value, label: `${name} (${data.code}) - ${whname}`, source_id: data.default_location_src_id, destination_id: data.default_location_dest_id, name,
    };
    if (checked) {
      setCheckTypeValues((state) => [...state, value]);
      setCheckTypeItems((state) => [...state, values]);
    } else {
      setCheckTypeValues(checkTypeValues.filter((item) => item !== value));
      setCheckTypeItems(checkTypeItems.filter((item) => item.id !== value));
      if (checkTypeItems.filter((item) => item.id !== value) && checkTypeItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getTransferFilters(checkItems, checkOrderItems, checkTypeItems.filter((item) => item.id !== value), customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTransfer([]);
  };

  const handleStatusClose = (value) => {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getTransferFilters(checkItems.filter((item) => item.id !== value), checkOrderItems, checkTypeItems, customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTransfer([]);
  };

  const handleOrderClose = (value) => {
    setCheckOrderValues(checkOrderValues.filter((item) => item !== value));
    setCheckOrderItems(checkOrderItems.filter((item) => item.id !== value));
    if (checkOrderItems.filter((item) => item.id !== value) && checkOrderItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getTransferFilters(checkItems, checkOrderItems.filter((item) => item.id !== value), checkTypeItems, customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTransfer([]);
  };

  const handleTypeClose = (value) => {
    setCheckTypeValues(checkTypeValues.filter((item) => item !== value));
    setCheckTypeItems(checkTypeItems.filter((item) => item.id !== value));
    if (checkTypeItems.filter((item) => item.id !== value) && checkTypeItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getTransferFilters(checkItems, checkOrderItems, checkTypeItems.filter((item) => item.id !== value), customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTransfer([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    dispatch(getTransferFilters(checkItems, checkOrderItems, checkTypeItems, customFiltersList.filter((item) => item.key !== value)));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setTransfer([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const total = transfersCount && transfersCount.length ? transfersCount.length : 0;
    const scrollListCount = transfer && transfer.length ? transfer.length : 0;
    if ((transfersInfo && !transfersInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCheckOrderValues([]);
    setCheckOrderItems([]);
    setCheckTypeValues([]);
    setCheckTypeItems([]);
    setCustomFilters([]);
    setDatefilterList([]);
    setSelectedDate([null, null]);
    setOffsetValue(0);
    dispatch(getTransferFilters([], [], [], []));
    if (afterReset) afterReset();
    setTransfer([]);
  };

  const onTypeSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = typeGroups.filter((item) => {
        const searchValue = item.name ? item.name.toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setTypeGroups(ndata);
    } else {
      setTypeGroups(operationTypesInfo && operationTypesInfo.data ? operationTypesInfo.data : []);
    }
  };

  const statusValues = transferFilters && transferFilters.statuses ? getColumnArrayById(transferFilters.statuses, 'id') : [];
  const orderDateValues = transferFilters && transferFilters.orderes ? getColumnArrayById(transferFilters.orderes, 'id') : [];
  const typeValues = transferFilters && transferFilters.types ? getColumnArrayById(transferFilters.types, 'id') : [];

  const currentId = viewId || id;

  const statusList = transferFilters && transferFilters.statuses ? transferFilters.statuses : [];
  const orderDateList = transferFilters && transferFilters.orderes ? transferFilters.orderes : [];
  const typesList = transferFilters && transferFilters.types ? transferFilters.types : [];
  const datefilterNew = datefilterList && datefilterList.length > 0 ? datefilterList : [];

  return (

    <Card className="p-1 h-100 bg-lightblue side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
      {!collapse ? (
        <>
          <CardTitle className="mt-2 ml-2 mb-1 mr-2">
            <Row lg="12" sm="12" md="12">
              <Col lg="10" sm="10" md="10" className="mr-0">
                <h4>
                  Filters
                </h4>
              </Col>
              {filtersIcon && (
              <Col lg="2" sm="2" md="2" className="mt-1">
                <img
                  src={collapseIcon}
                  height="25px"
                  aria-hidden="true"
                  width="25px"
                  alt="Collapse"
                  onClick={() => setCollapse(!collapse)}
                  className="cursor-pointer collapse-margin-left-align"
                  id="collapse"
                />
                <UncontrolledTooltip target="collapse" placement="right">
                  Collapse
                </UncontrolledTooltip>
              </Col>
              )}
            </Row>
          </CardTitle>
          <hr className="m-0 border-color-grey ml-2px" />
          {id ? (
            <>
              <div>
                <div className="mr-2 ml-2 mt-2">
                  {statusList && statusList.map((team) => (
                    <h5 key={team.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {team.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(team.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </h5>
                  ))}
                  {orderDateList && orderDateList.map((item) => (
                    <h5 key={item.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {item.label}
                        {' '}
                        (Scheduled Date)
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleOrderClose(item.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </h5>
                  ))}
                  {typesList && typesList.map((item) => (
                    <h5 key={item.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {item.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleTypeClose(item.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </h5>
                  ))}
                  {customFiltersList && customFiltersList.map((cf) => (
                    <h5 key={cf.key} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {cf.label}
                        {' '}
                        {cf.type === 'date' ? '(Create Date)' : ''}
                        {(cf.type === 'text' || cf.type === 'id') && (
                        <span>
                          {'  '}
                          &quot;
                          {decodeURIComponent(cf.value)}
                          &quot;
                        </span>
                        )}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </h5>
                  ))}
                </div>
                {((statusValues && statusValues.length > 0)
          || (orderDateValues && orderDateValues.length > 0) || (typeValues && typeValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
            <div aria-hidden="true" className="cursor-pointer text-info text-right mr-2 font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                )}
                {((statusValues && statusValues.length > 0)
          || (orderDateValues && orderDateValues.length > 0) || (typeValues && typeValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
            <hr className="mt-0 pt-1 mb-2 ml-2 mr-2" />
                )}
                <div onScroll={onScroll} className={transfer && transfer.length > 9 ? 'height-100 table-scrollable thin-scrollbar' : ''}>
                  {(transfer) && transfer.map((al) => (
                    <Card
                      key={al.id}
                      onClick={() => setViewId(al.id)}
                      className={(al.id === currentId) ? 'mb-2 mr-2 ml-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mr-2 ml-2  mb-2'}
                    >
                      <CardBody className="p-2">
                        <Row>
                          <Col sm="12" md="12" lg="12" xs="12">
                            <img src={assetDefault} className="mr-1" alt={al.name} width="17" height="17" />
                            <span className="font-weight-700 mb-1 font-medium" title={al.name}>{truncate(al.name, 20)}</span>
                          </Col>
                        </Row>
                        <span className="font-weight-400 mb-1 ml-4 font-tiny">
                          {getDefaultNoValue(al.partner_id ? al.partner_id[1] : '')}
                        </span>
                        <p className="text-info font-weight-600 mb-0 ml-4">
                          {' '}
                          {getDefaultNoValue(al.origin)}
                        </p>
                      </CardBody>
                    </Card>
                  ))}
                  {(transfersInfo && transfersInfo.err) && (
                  <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                    <CardBody className="p-2">
                      <ErrorContent errorTxt={generateErrorMessage(transfersInfo)} />
                    </CardBody>
                  </Card>
                  )}

                  {(userInfo && userInfo.err) && (
                  <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                    <CardBody className="p-2">
                      <ErrorContent errorTxt={generateErrorMessage(userInfo)} />
                    </CardBody>
                  </Card>
                  )}
                  {((transfersInfo && transfersInfo.loading) || (userInfo && userInfo.loading)) && (
                  <Loader />
                  )}
                </div>
              </div>
            </>
          ) : (
            <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
              <Row className="m-0">
                <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                  <p className="m-0 font-weight-800 collapse-heading">BY STATUS</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setStatusCollapse(!statusCollapse)} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={statusCollapse}>
                <div>
                  {customData.statusTransferTypes.map((st, index) => (
                    <span className="mb-1 d-block font-weight-500" key={st.value}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxasaction${index}`}
                          name={st.label}
                          value={st.value}
                          checked={statusValues.some((selectedValue) => selectedValue === st.value)}
                          onChange={handleCheckboxChange}
                        />
                        <Label htmlFor={`checkboxasaction${index}`}>
                          <span>{st.label}</span>
                        </Label>
                        {' '}
                      </div>
                    </span>
                  ))}
                </div>
              </Collapse>
              <hr className="mt-2" />
              <Row className="m-0">
                <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                  <p className="m-0 font-weight-800 collapse-heading">BY SCHEDULED DATE</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setOrderCollapse(!orderCollapse)} size="sm" icon={orderCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={orderCollapse}>
                <div>
                  {customData.orderDateFilters.map((od) => (
                    <>
                      <span className="mb-1 d-block font-weight-500" key={od.value}>
                        <div className="checkbox">
                          <Input
                            type="checkbox"
                            id={`checkboxasaction${od.value}`}
                            name={od.label}
                            value={od.value}
                            checked={(datefilterNew && od.label === 'Custom')
                              ? datefilterNew.some((selectedValue) => selectedValue.label === 'Custom') : orderDateValues.some((selectedValue) => selectedValue === od.value)}
                            onChange={handleOrderCheckboxChange}
                          />
                          <Label htmlFor={`checkboxasaction${od.value}`}>
                            <span>{od.label}</span>
                          </Label>
                          {' '}
                        </div>
                      </span>
                      {od.label === 'Custom' && datefilterNew.some((selectedValue) => selectedValue.label === 'Custom') ? (
                        <>
                          <RangePicker
                            onChange={onDateRangeChange}
                            value={selectedDate}
                            format="DD-MM-y"
                            size="small"
                            allowClear={false}
                            className="mt-1 mx-wd-220"
                          />
                        </>
                      ) : ''}
                    </>
                  ))}
                </div>
              </Collapse>
              <hr className="mt-2" />
              <Row className="m-0">
                <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                  <p className="m-0 font-weight-800 collapse-heading">BY OPERATION TYPE</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setTypesCollapse(!typeCollapse)} size="sm" icon={typeCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={typeCollapse}>
                {(operationTypesInfo && operationTypesInfo.data && operationTypesInfo.data.length > 10) && (
                <FormGroup className="mt-2 mb-2">
                  <Input type="input" name="teamSearchValue" placeholder="Please search a type" onChange={onTypeSearchChange} id="categorySearchValue" className="border-radius-50px" />
                </FormGroup>
                )}
                <div>
                  {(operationTypesInfo && operationTypesInfo.loading) && (
                  <Loader />
                  )}
                </div>
                <div>
                  {operationTypesInfo && operationTypesInfo.data && typeGroups && typeGroups.map((od) => (
                    <span className="mb-1 d-block font-weight-500" key={od.id}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxasaction${od.id}`}
                          name={od.name}
                          value={od.id}
                          checked={typeValues.some((selectedValue) => parseInt(selectedValue) === parseInt(od.id))}
                          onChange={(e) => handleTypeCheckboxChange(e, od)}
                        />
                        <Label htmlFor={`checkboxasaction${od.id}`}>
                          <span>
                            {od.name}
                            {od.warehouse_id && (
                              <>
                                -
                                {' '}
                                {extractTextObject(od.warehouse_id)}
                              </>
                            )}
                          </span>
                        </Label>
                        {' '}
                      </div>
                    </span>
                  ))}
                </div>
                {(operationTypesInfo && operationTypesInfo.err) && (
                  <ErrorContent errorTxt={operationTypesInfo} />
                )}
              </Collapse>
              <hr className="mt-2" />
              {((statusValues && statusValues.length > 0)
          || (orderDateValues && orderDateValues.length > 0) || (typeValues && typeValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
          <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
              )}
            </CardBody>
          )}
        </>
      ) : ''}
    </Card>

  );
};

Sidebar.propTypes = {
  offset: PropTypes.number.isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  id: PropTypes.number.isRequired,
  orderValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  typeValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  isClosed: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  ids: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
  isAll: PropTypes.bool.isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  setCollapse: PropTypes.func.isRequired,
  collapse: PropTypes.bool.isRequired,
};

export default Sidebar;
