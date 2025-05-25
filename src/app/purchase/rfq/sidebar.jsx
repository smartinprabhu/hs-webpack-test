/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import {
  Badge, Collapse, Card, CardBody, CardTitle, Col, FormGroup, Input, Label, Row, UncontrolledTooltip,
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
  getRequestQuotationList, getRequestQuotationCount, getQuotationFilters, getVendorGroups, getQuotatioDetail,
} from '../purchaseService';
import {
  getColumnArrayById, generateErrorMessage, truncate, getDefaultNoValue,
  getAllowedCompanies, queryGeneratorWithUtc, getDateAndTimeForDifferentTimeZones
} from '../../util/appUtils';
import customData from './data/customData.json';

const { RangePicker } = DatePicker;
const appModels = require('../../util/appModels').default;

const Sidebar = (props) => {
  const {
    offset, id, statusValue, orderValue, vendorValue, afterReset,
    sortBy, sortField, isPurchaseOrder, collapse, setCollapse,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkOrderValues, setCheckOrderValues] = useState([]);
  const [checkOrderItems, setCheckOrderItems] = useState([]);
  const [checkVendorValues, setCheckVendorValues] = useState([]);
  const [checkVendorItems, setCheckVendorItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [removedStatusValue, setRemoveStatusValue] = useState(statusValue);
  const [removedOrderValue, setRemoveOrderValue] = useState(orderValue);
  const [removedVendorValue, setRemoveVendorValue] = useState(vendorValue);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [orderCollapse, setOrderCollapse] = useState(false);
  const [vendorCollapse, setVendorCollapse] = useState(false);
  const [vendorGroups, setVendorGroups] = useState([]);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [quotationList, setQuotation] = useState([]);
  const [viewId, setViewId] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [datefilterList, setDatefilterList] = useState([]);
  const [selectedDate, setSelectedDate] = useState([null, null]);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    quotationFilters, vendorGroupInfo, quotationInfo, quotationCount, stateChangeInfo, updateRfqInfo, backorderInfo, isRequestQuotation,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (!isRequestQuotation) {
      dispatch(getQuotationFilters([], [], [], []));
    }
  }, [isRequestQuotation]);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    if (!id) {
      setQuotation([]);
    }
  }, [id]);

  useEffect(() => {
    setRemoveStatusValue(statusValue);
  }, [statusValue]);

  useEffect(() => {
    setRemoveOrderValue(orderValue);
  }, [orderValue]);

  useEffect(() => {
    setRemoveVendorValue(vendorValue);
  }, [vendorValue]);

  useEffect(() => {
    if (statusCollapse) {
      setOrderCollapse(false);
      setVendorCollapse(false);
    }
  }, [statusCollapse]);

  useEffect(() => {
    if (orderCollapse) {
      setStatusCollapse(false);
      setVendorCollapse(false);
    }
  }, [orderCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && vendorCollapse) {
      dispatch(getVendorGroups(companies, appModels.PURCHASEORDER));
      setOrderCollapse(false);
      setStatusCollapse(false);
    }
  }, [userInfo, vendorCollapse]);

  useEffect(() => {
    if (quotationInfo && quotationInfo.data && id) {
      const arr = [...quotationList, ...quotationInfo.data];
      setQuotation([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [quotationInfo, id]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getQuotatioDetail(viewId, appModels.PURCHASEORDER));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    if (removedVendorValue && removedVendorValue !== 0) {
      setCheckVendorItems(checkVendorItems.filter((item) => item.id !== removedVendorValue));
      if (checkVendorItems.filter((item) => item.id !== removedVendorValue) && checkVendorItems.filter((item) => item.id !== removedVendorValue).length === 0) {
        dispatch(getQuotationFilters(checkItems, checkOrderItems, checkVendorItems.filter((item) => item.id !== removedVendorValue)), customFiltersList);
      }
    }
  }, [removedVendorValue]);

  useEffect(() => {
    if (removedOrderValue && removedOrderValue !== 0) {
      setCheckOrderItems(checkOrderItems.filter((item) => item.id !== removedOrderValue));
      if (removedOrderValue === 'Custom') {
        setDatefilterList([]);
        setSelectedDate([null, null]);
      }
      if (checkOrderItems.filter((item) => item.id !== removedOrderValue) && checkOrderItems.filter((item) => item.id !== removedOrderValue).length === 0) {
        setDatefilterList([]);
        setSelectedDate([null, null]);
        dispatch(getQuotationFilters(checkItems, checkOrderItems.filter((item) => item.id !== removedOrderValue)), checkVendorItems, customFiltersList);
      }
    }
  }, [removedOrderValue]);

  useEffect(() => {
    if (removedStatusValue && removedStatusValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== removedStatusValue));
      if (checkItems.filter((item) => item.id !== removedStatusValue) && checkItems.filter((item) => item.id !== removedStatusValue).length === 0) {
        dispatch(getQuotationFilters(checkItems.filter((item) => item.id !== removedStatusValue)), checkOrderItems, checkVendorItems, customFiltersList);
      }
    }
  }, [removedStatusValue]);

  useEffect(() => {
    if (vendorGroupInfo && vendorGroupInfo.data) {
      setVendorGroups(vendorGroupInfo.data);
    }
  }, [vendorGroupInfo]);

  const onDateRangeChange = (dates) => {
    setSelectedDate(dates);
  };

  const onVendorSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = vendorGroups.filter((item) => {
        const searchValue = item.partner_id ? item.partner_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setVendorGroups(ndata);
    } else {
      setVendorGroups(vendorGroupInfo && vendorGroupInfo.data ? vendorGroupInfo.data : []);
    }
  };

  useEffect(() => {
    if ((checkItems && checkItems.length > 0) || (checkOrderItems && checkOrderItems.length > 0) || (checkVendorItems && checkVendorItems.length > 0)) {
      dispatch(getQuotationFilters(checkItems, checkOrderItems, checkVendorItems, customFiltersList));
    }
  }, [checkItems, checkOrderItems, checkVendorItems]);

  useEffect(() => {
    if (userInfo.data && (quotationFilters && (quotationFilters.statuses || quotationFilters.orderes || quotationFilters.vendores || quotationFilters.customFilters))) {
      const statusValues = quotationFilters.statuses ? getColumnArrayById(quotationFilters.statuses, 'id') : [];
      const orderValues = quotationFilters.orderes ? quotationFilters.orderes : [];
      const vendorValues = quotationFilters.vendores ? getColumnArrayById(quotationFilters.vendores, 'id') : [];
      const customFilters = quotationFilters.customFilters ? queryGeneratorWithUtc(quotationFilters.customFilters, false, userInfo.data) : '';
      dispatch(getRequestQuotationCount(companies, appModels.PURCHASEORDER, statusValues, orderValues, vendorValues, customFilters, isPurchaseOrder));
    }
  }, [userInfo, quotationFilters]);

  useEffect(() => {
    if (userInfo.data && (quotationFilters && (quotationFilters.statuses || quotationFilters.orderes || quotationFilters.vendores || quotationFilters.customFilters))) {
      const statusValues = quotationFilters.statuses ? getColumnArrayById(quotationFilters.statuses, 'id') : [];
      const orderValues = quotationFilters.orderes ? quotationFilters.orderes : [];
      const vendorValues = quotationFilters.vendores ? getColumnArrayById(quotationFilters.vendores, 'id') : [];
      const customFilters = quotationFilters.customFilters ? queryGeneratorWithUtc(quotationFilters.customFilters, false,userInfo.data) : '';
      dispatch(getRequestQuotationList(
        companies, appModels.PURCHASEORDER, limit, offsetValue, statusValues, orderValues, vendorValues, customFilters, sortByValue, sortFieldValue, isPurchaseOrder,
      ));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, quotationFilters, scrollTop]);

  useEffect(() => {
    if (((userInfo && userInfo.data) && ((stateChangeInfo && stateChangeInfo.data) || (updateRfqInfo && updateRfqInfo.data) || (backorderInfo && (backorderInfo.data || backorderInfo.status))))) {
      const statusValues = quotationFilters.statuses ? getColumnArrayById(quotationFilters.statuses, 'id') : [];
      const orderValues = quotationFilters.orderes ? quotationFilters.orderes : [];
      const vendorValues = quotationFilters.vendores ? getColumnArrayById(quotationFilters.vendores, 'id') : [];
      const customFilters = quotationFilters.customFilters ? queryGeneratorWithUtc(quotationFilters.customFilters, false,userInfo.data) : '';
      dispatch(getRequestQuotationList(
        companies, appModels.PURCHASEORDER, limit, offsetValue, statusValues, orderValues, vendorValues, customFilters, sortByValue, sortFieldValue, isPurchaseOrder,
      ));
    }
  }, [stateChangeInfo, updateRfqInfo, backorderInfo]);

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
        dispatch(getQuotationFilters(checkItems.filter((item) => item.id !== value), checkOrderItems, checkVendorItems, customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setQuotation([]);
  };

  useEffect(() => {
    if (selectedDate) {
      if (selectedDate && selectedDate[0] && selectedDate[0] !== null) {
        const dateObj = getDateAndTimeForDifferentTimeZones(userInfo, selectedDate[0], selectedDate[1] )

        const start = dateObj[0];
        const end = dateObj[1];
        const startLabel = start;
        const endLabel = end;
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
        setQuotation([]);
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
        dispatch(getQuotationFilters(checkItems, checkOrderItems.filter((item) => item.id !== value), checkVendorItems, customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setQuotation([]);
  };

  const handleVendorCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckVendorValues((state) => [...state, value]);
      setCheckVendorItems((state) => [...state, values]);
    } else {
      setCheckVendorValues(checkVendorValues.filter((item) => item !== value));
      setCheckVendorItems(checkVendorItems.filter((item) => item.id !== value));
      if (checkVendorItems.filter((item) => item.id !== value) && checkVendorItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getQuotationFilters(checkItems, checkOrderItems, checkVendorItems.filter((item) => item.id !== value), customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setQuotation([]);
  };

  const handleStatusClose = (value) => {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getQuotationFilters(checkItems.filter((item) => item.id !== value), checkOrderItems, checkVendorItems, customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setQuotation([]);
  };

  const handleOrderClose = (value) => {
    setCheckOrderValues(checkOrderValues.filter((item) => item !== value));
    setCheckOrderItems(checkOrderItems.filter((item) => item.id !== value));
    if (checkOrderItems.filter((item) => item.id !== value) && checkOrderItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getQuotationFilters(checkItems, checkOrderItems.filter((item) => item.id !== value), customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setQuotation([]);
  };

  const handleVendorClose = (value) => {
    setCheckVendorValues(checkVendorValues.filter((item) => item !== value));
    setCheckVendorItems(checkVendorItems.filter((item) => item.id !== value));
    if (checkVendorItems.filter((item) => item.id !== value) && checkVendorItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getQuotationFilters(checkItems, checkVendorItems.filter((item) => item.id !== value), customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setQuotation([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    dispatch(getQuotationFilters(checkItems, checkOrderItems, checkVendorItems, customFiltersList.filter((item) => item.key !== value)));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setQuotation([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const total = quotationCount && quotationCount.length ? quotationCount.length : 0;
    const scrollListCount = quotationList && quotationList.length ? quotationList.length : 0;
    if ((quotationInfo && !quotationInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
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
    setCheckVendorValues([]);
    setCheckVendorItems([]);
    setCustomFilters([]);
    setDatefilterList([]);
    setSelectedDate([null, null]);
    dispatch(getQuotationFilters([], [], [], []));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setQuotation([]);
  };

  const statusValues = quotationFilters && quotationFilters.statuses ? getColumnArrayById(quotationFilters.statuses, 'id') : [];
  const orderDateValues = quotationFilters && quotationFilters.orderes ? getColumnArrayById(quotationFilters.orderes, 'id') : [];
  const vendorValues = quotationFilters && quotationFilters.vendores ? getColumnArrayById(quotationFilters.vendores, 'id') : [];

  const currentId = viewId || id;

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (vendorGroupInfo && vendorGroupInfo.err) ? generateErrorMessage(vendorGroupInfo) : userErrorMsg;

  const statusList = quotationFilters && quotationFilters.statuses ? quotationFilters.statuses : [];
  const orderDateList = quotationFilters && quotationFilters.orderes ? quotationFilters.orderes : [];
  const vendorList = quotationFilters && quotationFilters.vendores ? quotationFilters.vendores : [];
  const datefilterNew = datefilterList && datefilterList.length > 0 ? datefilterList : [];

  return (

    <Card className="p-1 bg-lightblue area-height-100 side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
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
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleOrderClose(item.id)} size="sm" icon={faTimesCircle} />
                  </Badge>
                </h5>
              ))}
              {vendorList && vendorList.map((item) => (
                <h5 key={item.id} className="mr-2 content-inline">
                  <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                    {item.label}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleVendorClose(item.id)} size="sm" icon={faTimesCircle} />
                  </Badge>
                </h5>
              ))}
              {customFiltersList && customFiltersList.map((cf) => (
                <h5 key={cf.key} className="mr-2 content-inline">
                  <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                    {cf.label}
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
          || (orderDateValues && orderDateValues.length > 0) || (vendorValues && vendorValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
            <div aria-hidden="true" className="cursor-pointer text-info text-right mr-2 font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
            )}
            {((statusValues && statusValues.length > 0)
          || (orderDateValues && orderDateValues.length > 0) || (vendorValues && vendorValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
            <hr className="mt-0 pt-1 mb-2 ml-2 mr-2" />
            )}
            <div onScroll={onScroll} className={quotationList && quotationList.length > 9 ? 'height-100 table-scrollable thin-scrollbar' : ''}>
              {(quotationList) && quotationList.map((al) => (
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
                      {getDefaultNoValue(al.partner_ref)}
                    </p>
                  </CardBody>
                </Card>
              ))}
              {(quotationInfo && quotationInfo.err) && (
              <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                <CardBody className="p-2">
                  <ErrorContent errorTxt={generateErrorMessage(quotationInfo)} />
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
              {((quotationInfo && quotationInfo.loading) || (userInfo && userInfo.loading)) && (
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
            {isPurchaseOrder ? (
              <div>
                {customData.poStatusTypes.map((st, index) => (
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
            ) : (
              <div>
                {customData.statusTypes.map((st, index) => (
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
            )}
          </Collapse>
          <hr className="mt-2" />
          <Row className="m-0">
            <Col md="8" xs="8" sm="8" lg="8" className="p-0">
              <p className="m-0 font-weight-800 collapse-heading">BY ORDERED DATE</p>
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
              <p className="m-0 font-weight-800 collapse-heading">BY VENDOR</p>
            </Col>
            <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
              <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setVendorCollapse(!vendorCollapse)} size="sm" icon={vendorCollapse ? faChevronUp : faChevronDown} />
            </Col>
          </Row>
          <Collapse isOpen={vendorCollapse}>
            {(vendorGroupInfo && vendorGroupInfo.data && vendorGroupInfo.data.length > 10) && (
            <FormGroup className="mt-2 mb-2">
              <Input type="input" name="vendorSearchValue" placeholder="Please search a vendor" onChange={onVendorSearchChange} id="vendorSearchValue" className="border-radius-50px" />
            </FormGroup>
            )}
            <div className="pl-1">
              {((vendorGroupInfo && vendorGroupInfo.loading) || isUserLoading) && (
              <Loader />
              )}
              {vendorGroups && vendorGroups.map((vendorItem, index) => (
                vendorItem.partner_id && (
                <span className="mb-1 d-block font-weight-500" key={vendorItem.partner_id}>
                  <div className="checkbox">
                    <Input
                      type="checkbox"
                      id={`checkboxcitemaction${index}`}
                      value={vendorItem.partner_id[0]}
                      name={vendorItem.partner_id[1]}
                      checked={vendorValues.some((selectedValue) => parseInt(selectedValue) === parseInt(vendorItem.partner_id[0]))}
                      onChange={handleVendorCheckboxChange}
                    />
                    <Label htmlFor={`checkboxcitemaction${index}`}>
                      <span>{vendorItem.partner_id[1]}</span>
                    </Label>
                    {' '}
                  </div>
                </span>
                )
              ))}
              {((vendorGroupInfo && vendorGroupInfo.err) || isUserError) && (
              <ErrorContent errorTxt={errorMsg} />
              )}
            </div>
          </Collapse>
          <hr className="mt-2" />
          {((statusValues && statusValues.length > 0)
          || (orderDateValues && orderDateValues.length > 0) || (vendorValues && vendorValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
          <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
          )}
        </CardBody>
      )}
    </Card>

  );
};

Sidebar.defaultProps = {
  isPurchaseOrder: false,
  setCollapse: () => {},
  collapse: false,
};

Sidebar.propTypes = {
  offset: PropTypes.number.isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  orderValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  vendorValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  isPurchaseOrder: PropTypes.bool,
  setCollapse: PropTypes.func,
  collapse: PropTypes.bool,
};

export default Sidebar;
