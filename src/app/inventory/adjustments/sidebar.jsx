/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Badge, Collapse, Card, CardBody, CardTitle, Col, Input, Label, Row,
  UncontrolledTooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import collapseIcon from '@images/collapse.png';
import {
  getAdjustmentsList, getAdjustmentsCount, getAdjustmentFilters,
  getAdjustmentDetail,
} from '../inventoryService';
import {
  getColumnArrayById, queryGenerator,
  generateErrorMessage, truncate,
  getAllowedCompanies,
  getDefaultNoValue, extractTextObject,
} from '../../util/appUtils';
import { getStateLabel } from './utils/utils';
import customData from './data/customData.json';

const appModels = require('../../util/appModels').default;

const Sidebar = (props) => {
  const {
    offset, id, statusValue, dateValue, afterReset,
    sortBy, sortField, setCollapse, collapse,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkDates, setCheckDates] = useState([]);
  const [checkDatesItems, setCheckDatesItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [removedStatusValue, setRemoveStatusValue] = useState(statusValue);
  const [removedDateValue, setRemoveDateValue] = useState(dateValue);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [inventoryCollapse, setInventoryCollapse] = useState(false);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [viewId, setViewId] = useState(0);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [scrollDataList, setScrollData] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    adjustmentFilters, adjustmentCount, adjustmentsInfo,
    addAdjustmentInfo, updateAdjustmentInfo, actionResultInfo,
  } = useSelector((state) => state.inventory);

  useEffect(() => {
    if (!id) {
      setScrollData([]);
    }
  }, [id]);

  useEffect(() => {
    if (adjustmentsInfo && adjustmentsInfo.data && id) {
      const arr = [...scrollDataList, ...adjustmentsInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [adjustmentsInfo, id]);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    if (statusCollapse) {
      setInventoryCollapse(false);
    }
  }, [statusCollapse]);

  useEffect(() => {
    if (inventoryCollapse) {
      setStatusCollapse(false);
    }
  }, [inventoryCollapse]);

  useEffect(() => {
    setRemoveStatusValue(statusValue);
  }, [statusValue]);

  useEffect(() => {
    setRemoveDateValue(dateValue);
  }, [dateValue]);

  useEffect(() => {
    if (removedStatusValue && removedStatusValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== removedStatusValue));
      if (checkItems.filter((item) => item.id !== removedStatusValue) && checkItems.filter((item) => item.id !== removedStatusValue).length === 0) {
        dispatch(getAdjustmentFilters(checkItems.filter((item) => item.id !== removedStatusValue)), checkDatesItems, customFiltersList);
      }
    }
  }, [removedStatusValue]);

  useEffect(() => {
    if (removedDateValue && removedDateValue !== 0) {
      setCheckDatesItems(checkDatesItems.filter((item) => item.id !== removedDateValue));
      if (checkDatesItems.filter((item) => item.id !== removedDateValue) && checkDatesItems.filter((item) => item.id !== removedDateValue).length === 0) {
        dispatch(getAdjustmentFilters(checkItems, checkDatesItems.filter((item) => item.id !== removedDateValue)), customFiltersList);
      }
    }
  }, [removedDateValue]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getAdjustmentDetail(viewId, appModels.INVENTORY));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    if (adjustmentFilters && adjustmentFilters.customFilters) {
      setCustomFilters(adjustmentFilters.customFilters);
    }
  }, [adjustmentFilters]);

  useEffect(() => {
    if ((checkItems && checkItems.length > 0) || (checkDatesItems && checkDatesItems.length > 0)) {
      dispatch(getAdjustmentFilters(checkItems, checkDatesItems, customFiltersList));
    }
  }, [checkItems, checkDatesItems]);

  useEffect(() => {
    dispatch(getAdjustmentFilters([], [], []));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && (adjustmentFilters && (adjustmentFilters.statuses || adjustmentFilters.dates || adjustmentFilters.customFilters))) {
      const statusValues = adjustmentFilters.statuses ? getColumnArrayById(adjustmentFilters.statuses, 'id') : [];
      const dateValues = adjustmentFilters.dates ? getColumnArrayById(adjustmentFilters.dates, 'id') : [];
      const customFilters = adjustmentFilters.customFilters ? queryGenerator(adjustmentFilters.customFilters) : '';
      dispatch(getAdjustmentsCount(companies, appModels.INVENTORY, statusValues, dateValues, customFilters));
    }
  }, [userInfo, adjustmentFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && (adjustmentFilters && (adjustmentFilters.statuses || adjustmentFilters.dates || adjustmentFilters.customFilters))) {
      const statusValues = adjustmentFilters.statuses ? getColumnArrayById(adjustmentFilters.statuses, 'id') : [];
      const dateValues = adjustmentFilters.dates ? getColumnArrayById(adjustmentFilters.dates, 'id') : [];
      const customFilters = adjustmentFilters.customFilters ? queryGenerator(adjustmentFilters.customFilters) : '';
      dispatch(getAdjustmentsList(companies, appModels.INVENTORY, limit, offsetValue, statusValues, dateValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, adjustmentFilters, scrollTop]);

  useEffect(() => {
    if (userInfo && userInfo.data && id === 0) {
      const statusValues = adjustmentFilters.statuses ? getColumnArrayById(adjustmentFilters.statuses, 'id') : [];
      const dateValues = adjustmentFilters.dates ? getColumnArrayById(adjustmentFilters.dates, 'id') : [];
      const customFilters = adjustmentFilters.customFilters ? queryGenerator(adjustmentFilters.customFilters) : '';
      dispatch(getAdjustmentsList(companies, appModels.INVENTORY, limit, offset, statusValues, dateValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [id]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && ((addAdjustmentInfo && addAdjustmentInfo.data) || (updateAdjustmentInfo && updateAdjustmentInfo.data))) {
      const statusValues = adjustmentFilters.statuses ? getColumnArrayById(adjustmentFilters.statuses, 'id') : [];
      const dateValues = adjustmentFilters.dates ? getColumnArrayById(adjustmentFilters.dates, 'id') : [];
      const customFilters = adjustmentFilters.customFilters ? queryGenerator(adjustmentFilters.customFilters) : '';
      dispatch(getAdjustmentsCount(companies, appModels.INVENTORY, statusValues, dateValues, customFilters));
      dispatch(getAdjustmentsList(companies, appModels.INVENTORY, limit, offsetValue, statusValues, dateValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [addAdjustmentInfo, updateAdjustmentInfo]);

  useEffect(() => {
    if (actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status)) {
      const statusValues = adjustmentFilters.statuses ? getColumnArrayById(adjustmentFilters.statuses, 'id') : [];
      const dateValues = adjustmentFilters.dates ? getColumnArrayById(adjustmentFilters.dates, 'id') : [];
      const customFilters = adjustmentFilters.customFilters ? queryGenerator(adjustmentFilters.customFilters) : '';
      dispatch(getAdjustmentsList(companies, appModels.INVENTORY, limit, offsetValue, statusValues, dateValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [actionResultInfo]);

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
        dispatch(getAdjustmentFilters(checkItems.filter((item) => item.id !== value), checkDatesItems, customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setScrollData([]);
  };

  const handleDateCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckDates((state) => [...state, value]);
      setCheckDatesItems((state) => [...state, values]);
    } else {
      setCheckDates(checkDates.filter((item) => item !== value));
      setCheckDatesItems(checkDatesItems.filter((item) => item.id !== value));
      if (checkDatesItems.filter((item) => item.id !== value) && checkDatesItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getAdjustmentFilters(checkItems, checkDatesItems.filter((item) => item.id !== value), customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setScrollData([]);
  };

  const handleStatusClose = (value) => {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getAdjustmentFilters(checkItems.filter((item) => item.id !== value), checkDatesItems, customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setScrollData([]);
  };

  const handleDateClose = (value) => {
    setCheckDates(checkDates.filter((item) => item !== value));
    setCheckDatesItems(checkDatesItems.filter((item) => item.id !== value));
    if (checkDatesItems.filter((item) => item.id !== value) && checkDatesItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getAdjustmentFilters(checkItems, checkDatesItems.filter((item) => item.id !== value), customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setScrollData([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    dispatch(getAdjustmentFilters(checkItems, checkDatesItems, customFiltersList.filter((item) => item.key !== value)));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setScrollData([]);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCheckDates([]);
    setCheckDatesItems([]);
    setCustomFilters([]);
    setOffsetValue(0);
    dispatch(getAdjustmentFilters([], [], []));
    if (afterReset) afterReset();
    setScrollData([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const total = adjustmentCount && adjustmentCount.length ? adjustmentCount.length : 0;
    const scrollListCount = scrollDataList && scrollDataList.length ? scrollDataList.length : 0;
    if ((adjustmentsInfo && !adjustmentsInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const currentId = viewId || id;
  const statusValues = adjustmentFilters && adjustmentFilters.statuses ? getColumnArrayById(adjustmentFilters.statuses, 'id') : [];
  const dateValues = adjustmentFilters && adjustmentFilters.dates ? getColumnArrayById(adjustmentFilters.dates, 'id') : [];

  const statusList = adjustmentFilters && adjustmentFilters.statuses ? adjustmentFilters.statuses : [];
  const dateList = adjustmentFilters && adjustmentFilters.dates ? adjustmentFilters.dates : [];

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
          {/* {id ? (
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
                  {dateList && dateList.map((dt) => (
                    <h5 key={dt.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {dt.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleDateClose(dt.id)} size="sm" icon={faTimesCircle} />
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
                {((statusValues && statusValues.length > 0) || (dateValues && dateValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
                  <div aria-hidden="true" className="cursor-pointer text-info text-right mr-2 font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                )}
                {((statusValues && statusValues.length > 0) || (dateValues && dateValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
                  <hr className="mt-0 pt-1 mb-2 ml-2 mr-2" />
                )}
                <div onScroll={onScroll} className={scrollDataList && scrollDataList.length > 9 ? 'height-100 table-scrollable thin-scrollbar' : ''}>
                  {(scrollDataList) && scrollDataList.map((adj) => (
                    <Card
                      key={adj.id}
                      onClick={() => setViewId(adj.id)}
                      className={(adj.id === currentId) ? 'mb-2 mr-2 ml-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mr-2 ml-2  mb-2'}
                    >
                      <CardBody className="p-2">
                        <Row>
                          <Col sm="12" md="12" lg="12" xs="12">
                            <span className="font-weight-700 mb-1 font-medium" title={adj.name}>{truncate(adj.name, 20)}</span>
                          </Col>
                        </Row>
                        <p className="font-weight-400 ml-1 mb-0 font-tiny">{getDefaultNoValue(extractTextObject(adj.location_id))}</p>
                        <p className="font-weight-600 ml-1 mb-0 font-tiny">{getStateLabel(adj.state)}</p>
                      </CardBody>
                    </Card>
                  ))}
                  {(adjustmentsInfo && adjustmentsInfo.err) && (
                    <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                      <CardBody className="p-2">
                        <ErrorContent errorTxt={generateErrorMessage(adjustmentsInfo)} />
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
                  {((adjustmentsInfo && adjustmentsInfo.loading) || (userInfo && userInfo.loading)) && (
                    <Loader />
                  )}
                </div>
              </div>
            </>
          ) : ( */}
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
                {customData.stateTypes.map((mt, index) => (
                  <span className="mb-1 d-block font-weight-500" key={mt.value}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxasaction${index}`}
                        name={mt.label}
                        value={mt.value}
                        checked={statusValues.some((selectedValue) => selectedValue === mt.value)}
                        onChange={handleCheckboxChange}
                      />
                      <Label htmlFor={`checkboxasaction${index}`}>
                        <span>{mt.label}</span>
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
                <p className="m-0 font-weight-800 collapse-heading">BY INVENTORY DATE</p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setInventoryCollapse(!inventoryCollapse)} size="sm" icon={inventoryCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={inventoryCollapse}>
              <div>
                {customData.orderDateFilters.map((od) => (
                  <span className="mb-1 d-block font-weight-500" key={od.value}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxasaction${od.value}`}
                        name={od.label}
                        value={od.value}
                        checked={dateValues.some((selectedValue) => selectedValue === od.value)}
                        onChange={handleDateCheckboxChange}
                      />
                      <Label htmlFor={`checkboxasaction${od.value}`}>
                        <span>{od.label}</span>
                      </Label>
                      {' '}
                    </div>
                  </span>
                ))}
              </div>
            </Collapse>
            <hr className="mt-2" />
            {((statusValues && statusValues.length > 0) || (dateValues && dateValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
              <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
            )}
          </CardBody>
        </>
      ) : ''}
    </Card>

  );
};

Sidebar.propTypes = {
  offset: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  dateValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  setCollapse: PropTypes.func,
  collapse: PropTypes.bool,
};

Sidebar.defaultProps = {
  setCollapse: () => { },
  collapse: false,
};

export default Sidebar;
