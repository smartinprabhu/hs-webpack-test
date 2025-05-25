/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Badge, Collapse, Card, CardBody, CardTitle, Col, Input, Label, Row,
  UncontrolledTooltip, FormGroup,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import ReadMoreText from '@shared/readMoreText';
import collapseIcon from '@images/collapse.png';
import complianceBlackIcon from '@images/icons/complianceBlack.svg';

import {
  getComplianceList, getComplianceCount, getComplianceFilters,
  getComplianceDetail, getActGroups, getCategoryGroups,
} from './complianceService';
import {
  getColumnArrayById, queryGenerator,
  generateErrorMessage, truncate,
  getAllowedCompanies, queryGeneratorWithUtc,
} from '../util/appUtils';
import customData from './data/customData.json';
import { getComplianceStateColor, getStatusLabel } from './utils/utils';
import { getSLALabelIcon } from '../helpdesk/utils/utils';

const appModels = require('../util/appModels').default;

const Sidebar = (props) => {
  const {
    offset, id, statusValue, appValue, categoryValue, afterReset,
    sortBy, sortField, setCollapse, collapse,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkAppValues, setCheckAppValues] = useState([]);
  const [checkCategoryValues, setCheckCategoryValues] = useState([]);
  const [checkAppItems, setCheckAppItems] = useState([]);
  const [checkCategoryItems, setCheckCategoryItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [removedStatusValue, setRemoveStatusValue] = useState(statusValue);
  const [removedAppValue, setRemoveAppValue] = useState(appValue);
  const [removeCategoryValue, setRemoveCategoryValue] = useState(categoryValue);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [appCollapse, setAppCollapse] = useState(false);
  const [actCollapse, setActCollapse] = useState(false);
  const [categoryCollapse, setCategoryCollapse] = useState(false);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [categoryGroups, setCategoryGroups] = useState([]);
  const [viewId, setViewId] = useState(0);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [complianceList, setCompliance] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [listId, setListId] = useState(0);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    complianceFilters, complianceCount, complianceInfo, stateChangeInfo, categoryGroupInfo,
  } = useSelector((state) => state.compliance);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const {
    deleteInfo,
  } = useSelector((state) => state.pantry);

  useEffect(() => {
    if (!id) {
      setCompliance([]);
    } else {
      setListId(id);
    }
  }, [id]);

  useEffect(() => {
    if (categoryGroupInfo && categoryGroupInfo.data) {
      setCategoryGroups(categoryGroupInfo.data);
    }
  }, [categoryGroupInfo]);

  const onCategorySearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = categoryGroups.filter((item) => {
        const searchValue = item.compliance_category_id ? item.compliance_category_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setCategoryGroups(ndata);
    } else {
      setCategoryGroups(categoryGroupInfo && categoryGroupInfo.data ? categoryGroupInfo.data : []);
    }
  };

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getComplianceDetail(viewId, appModels.BULIDINGCOMPLIANCE));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    if (complianceInfo && complianceInfo.data && id) {
      const arr = [...complianceList, ...complianceInfo.data];
      setCompliance([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [complianceInfo, id]);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    setRemoveStatusValue(statusValue);
  }, [statusValue]);

  useEffect(() => {
    setRemoveAppValue(appValue);
  }, [appValue]);

  useEffect(() => {
    setRemoveCategoryValue(categoryValue);
  }, [categoryValue]);

  useEffect(() => {
    if (statusCollapse) {
      setAppCollapse(false);
      setActCollapse(false);
      setCategoryCollapse(false);
    }
  }, [statusCollapse]);

  useEffect(() => {
    if (appCollapse) {
      setStatusCollapse(false);
      setActCollapse(false);
      setCategoryCollapse(false);
    }
  }, [appCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && actCollapse) {
      dispatch(getActGroups(companies, appModels.BULIDINGCOMPLIANCE));
      setStatusCollapse(false);
      setAppCollapse(false);
      setCategoryCollapse(false);
    }
  }, [userInfo, actCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && categoryCollapse) {
      dispatch(getCategoryGroups(companies, appModels.BULIDINGCOMPLIANCE));
      setStatusCollapse(false);
      setAppCollapse(false);
      setActCollapse(false);
    }
  }, [userInfo, categoryCollapse]);

  useEffect(() => {
    if (removedAppValue && removedAppValue !== 0) {
      setCheckAppItems(checkAppItems.filter((item) => item.id !== removedAppValue));
      if (checkAppItems.filter((item) => item.id !== removedAppValue) && checkAppItems.filter((item) => item.id !== removedAppValue).length === 0) {
        dispatch(getComplianceFilters(checkItems, checkCategoryItems, checkAppItems.filter((item) => item.id !== removedAppValue)), customFiltersList);
      }
    }
  }, [removedAppValue]);

  useEffect(() => {
    if (removeCategoryValue && removeCategoryValue !== 0) {
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== removeCategoryValue));
      if (checkCategoryItems.filter((item) => item.id !== removeCategoryValue) && checkCategoryItems.filter((item) => item.id !== removeCategoryValue).length === 0) {
        dispatch(getComplianceFilters(checkItems, checkCategoryItems.filter((item) => item.id !== removeCategoryValue)), checkAppItems, customFiltersList);
      }
    }
  }, [removeCategoryValue]);

  useEffect(() => {
    if (removedStatusValue && removedStatusValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== removedStatusValue));
      if (checkItems.filter((item) => item.id !== removedStatusValue) && checkItems.filter((item) => item.id !== removedStatusValue).length === 0) {
        dispatch(getComplianceFilters(checkItems.filter((item) => item.id !== removedStatusValue)), checkCategoryItems, checkAppItems, customFiltersList);
      }
    }
  }, [removedStatusValue]);

  useEffect(() => {
    if (complianceFilters && complianceFilters.customFilters) {
      setCustomFilters(complianceFilters.customFilters);
    }
  }, [complianceFilters]);

  useEffect(() => {
    if ((checkItems && checkItems.length > 0) || (checkCategoryItems && checkCategoryItems.length > 0) || (checkAppItems && checkAppItems.length > 0)) {
      dispatch(getComplianceFilters(checkItems, checkCategoryItems, checkAppItems, customFiltersList));
    }
  }, [checkItems, checkCategoryItems, checkAppItems]);

  useEffect(() => {
    let statusValues = [];
    let categoryValues = [];
    let appValues = [];
    let filterList = [];
    let callFilter = true;
    if (checkItems && checkItems.length > 0) {
      statusValues = checkItems;
    } else if (complianceFilters && complianceFilters.statuses && complianceFilters.statuses.length > 0) {
      statusValues = complianceFilters.statuses;
      setCheckItems(complianceFilters.statuses);
      callFilter = false;
      setStatusCollapse(true);
    }

    if (checkCategoryItems && checkCategoryItems.length > 0) {
      categoryValues = checkCategoryItems;
    } else if (complianceFilters && complianceFilters.category && complianceFilters.category.length > 0) {
      categoryValues = complianceFilters.category;
      setCheckCategoryItems(complianceFilters.category);
      callFilter = false;
      setCategoryCollapse(true);
    }

    if (checkAppItems && checkAppItems.length > 0) {
      appValues = checkAppItems;
    } else if (complianceFilters && complianceFilters.applies && complianceFilters.applies.length > 0) {
      appValues = complianceFilters.applies;
      setCheckAppItems(complianceFilters.applies);
      callFilter = false;
      setAppCollapse(true);
    }

    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (complianceFilters && complianceFilters.customFilters) {
      filterList = complianceFilters.customFilters;
    }
    if (callFilter) {
      dispatch(getComplianceFilters(statusValues, categoryValues, appValues, filterList));
    }
  }, []);

  useEffect(() => {
    if (userInfo.data && (complianceFilters && (complianceFilters.statuses || complianceFilters.category || complianceFilters.applies || complianceFilters.customFilters))) {
      const statusValues = complianceFilters.statuses ? getColumnArrayById(complianceFilters.statuses, 'id') : [];
      const categoryValues = complianceFilters.category ? getColumnArrayById(complianceFilters.category, 'id') : [];
      const appValues = complianceFilters.applies ? getColumnArrayById(complianceFilters.applies, 'id') : [];
      const customFilters = complianceFilters.customFilters ? queryGeneratorWithUtc(complianceFilters.customFilters, false,  userInfo.data) : '';
      dispatch(getComplianceCount(companies, appModels.BULIDINGCOMPLIANCE, statusValues, categoryValues, appValues, customFilters));
    }
  }, [userInfo, complianceFilters]);

  useEffect(() => {
    if (userInfo.data && (complianceFilters && (complianceFilters.statuses || complianceFilters.category || complianceFilters.applies || complianceFilters.customFilters))) {
      const statusValues = complianceFilters.statuses ? getColumnArrayById(complianceFilters.statuses, 'id') : [];
      const categoryValues = complianceFilters.category ? getColumnArrayById(complianceFilters.category, 'id') : [];
      const appValues = complianceFilters.applies ? getColumnArrayById(complianceFilters.applies, 'id') : [];
      const customFilters = complianceFilters.customFilters ? queryGeneratorWithUtc(complianceFilters.customFilters, false,userInfo.data) : '';
      dispatch(getComplianceList(companies, appModels.BULIDINGCOMPLIANCE, limit, offsetValue, statusValues, categoryValues, appValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, complianceFilters, scrollTop]);

  useEffect(() => {
    if (userInfo.data && ((tenantUpdateInfo && tenantUpdateInfo.data) || (deleteInfo && deleteInfo.data) || (stateChangeInfo && stateChangeInfo.data))) {
      const statusValues = complianceFilters.statuses ? getColumnArrayById(complianceFilters.statuses, 'id') : [];
      const categoryValues = complianceFilters.category ? getColumnArrayById(complianceFilters.category, 'id') : [];
      const appValues = complianceFilters.applies ? getColumnArrayById(complianceFilters.applies, 'id') : [];
      const customFilters = complianceFilters.customFilters ? queryGeneratorWithUtc(complianceFilters.customFilters, false,userInfo.data) : '';
      dispatch(getComplianceList(companies, appModels.BULIDINGCOMPLIANCE, limit, offsetValue, statusValues, categoryValues, appValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [tenantUpdateInfo, stateChangeInfo, deleteInfo]);

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
        dispatch(getComplianceFilters(checkItems.filter((item) => item.id !== value), checkCategoryItems, checkAppItems, customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setCompliance([]);
  };

  const handleAppCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckAppValues((state) => [...state, value]);
      setCheckAppItems((state) => [...state, values]);
    } else {
      setCheckAppValues(checkAppValues.filter((item) => item !== value));
      setCheckAppItems(checkAppItems.filter((item) => item.id !== value));
      if (checkAppItems.filter((item) => item.id !== value) && checkAppItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getComplianceFilters(checkItems, checkCategoryItems, checkAppItems.filter((item) => item.id !== value), customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setCompliance([]);
  };

  const handleCategoryCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckCategoryValues((state) => [...state, value]);
      setCheckCategoryItems((state) => [...state, values]);
    } else {
      setCheckCategoryValues(checkCategoryValues.filter((item) => item !== value));
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== value));
      if (checkCategoryItems.filter((item) => item.id !== value) && checkCategoryItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getComplianceFilters(checkItems, checkCategoryItems.filter((item) => item.id !== value), checkAppItems, customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setCompliance([]);
  };

  const handleStatusClose = (value) => {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getComplianceFilters(checkItems.filter((item) => item.id !== value), checkCategoryItems, checkAppItems, customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setCompliance([]);
  };

  const handleAppClose = (value) => {
    setCheckAppValues(checkAppValues.filter((item) => item !== value));
    setCheckAppItems(checkAppItems.filter((item) => item.id !== value));
    if (checkAppItems.filter((item) => item.id !== value) && checkAppItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getComplianceFilters(checkItems, checkCategoryItems, checkAppItems.filter((item) => item.id !== value), customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setCompliance([]);
  };

  const handleCategoryClose = (value) => {
    setCheckCategoryValues(checkCategoryValues.filter((item) => item !== value));
    setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== value));
    if (checkCategoryItems.filter((item) => item.id !== value) && checkCategoryItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getComplianceFilters(checkItems, checkCategoryItems.filter((item) => item.id !== value), checkAppItems, customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setCompliance([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    dispatch(getComplianceFilters(checkItems, checkCategoryItems, checkAppItems, customFiltersList.filter((item) => item.key !== value)));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setCompliance([]);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCustomFilters([]);
    setCheckAppItems([]);
    setCheckAppValues([]);
    setCheckCategoryItems([]);
    setCheckCategoryValues([]);
    setOffsetValue(0);
    dispatch(getComplianceFilters([], [], [], []));
    if (afterReset) afterReset();
    setCompliance([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const total = complianceCount && complianceCount.length ? complianceCount.length : 0;
    const scrollListCount = complianceList && complianceList.length ? complianceList.length : 0;
    if ((complianceInfo && !complianceInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg1 = (categoryGroupInfo && categoryGroupInfo.err) ? generateErrorMessage(categoryGroupInfo) : userErrorMsg;

  const currentId = listId || viewId;

  const statusValues = complianceFilters && complianceFilters.statuses ? getColumnArrayById(complianceFilters.statuses, 'id') : [];
  const categoryValues = complianceFilters && complianceFilters.category ? getColumnArrayById(complianceFilters.category, 'id') : [];
  const appValues = complianceFilters && complianceFilters.applies ? getColumnArrayById(complianceFilters.applies, 'id') : [];

  const statusList = complianceFilters && complianceFilters.statuses ? complianceFilters.statuses : [];
  const categoryList = complianceFilters && complianceFilters.category ? complianceFilters.category : [];
  const appList = complianceFilters && complianceFilters.applies ? complianceFilters.applies : [];

  return (

    <Card className="side-bar p-1 h-100 bg-lightblue side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
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
                  {appList && appList.map((item) => (
                    <h5 key={item.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {item.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleAppClose(item.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </h5>
                  ))}
                  {categoryList && categoryList.map((item) => (
                    <h5 key={item.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {item.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCategoryClose(item.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </h5>
                  ))}
                  {customFiltersList && customFiltersList.map((cf) => (
                    <h5 key={cf.key} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {truncate(cf.label, 20)}
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
                  || (categoryValues && categoryValues.length > 0) || (appValues && appValues.length > 0)
                  || (customFiltersList && customFiltersList.length > 0)) && (
                  <div aria-hidden="true" className="cursor-pointer text-info text-right mr-2 font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                )}
                {((statusValues && statusValues.length > 0) || (categoryValues && categoryValues.length > 0) || (appValues && appValues.length > 0)
                  || (customFiltersList && customFiltersList.length > 0)) && (
                  <hr className="mt-0 pt-1 mb-2 ml-2 mr-2" />
                )}
                <div onScroll={onScroll} className={complianceList && complianceList.length > 9 ? 'height-100 table-scrollable thin-scrollbar' : ''}>
                  {(complianceList) && complianceList.map((bc) => (
                    <Card
                      key={bc.id}
                      onClick={() => { setListId(0); setViewId(bc.id); }}
                      className={(bc.id === currentId) ? 'mb-2 mr-2 ml-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mr-2 ml-2  mb-2'}
                    >
                      <CardBody className="p-2">
                        <Row>
                          <Col sm="12" md="12" lg="12" xs="12">
                            <img src={complianceBlackIcon} className="mr-1" alt={bc.name} width="17" height="17" />
                            <span className="font-weight-700 mb-1 font-medium" title={bc.name}>{truncate(bc.name, 20)}</span>
                          </Col>
                        </Row>
                        <p className="font-weight-400 mb-1 ml-4 font-tiny">{bc.compliance_act ? bc.compliance_act[1] : ''}</p>
                        <Row>
                          <Col md={6} className="nowrap-content">
                            <span className={`text-${getComplianceStateColor(bc.state)} font-weight-600 mb-0 ml-4 font-11px font-10px`}>
                              {
                              getStatusLabel(bc.state)
                            }
                            </span>
                          </Col>
                          <Col md={6} className="text-right">
                            {getSLALabelIcon(bc.sla_status)}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  ))}
                  {(complianceInfo && complianceInfo.err) && (
                    <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                      <CardBody className="p-2">
                        <ErrorContent errorTxt={generateErrorMessage(complianceInfo)} />
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
                  {((complianceInfo && complianceInfo.loading) || (userInfo && userInfo.loading)) && (
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
                  <p className="m-0 font-weight-800 collapse-heading">BY CATEGORY</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setCategoryCollapse(!categoryCollapse)} size="sm" icon={categoryCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={categoryCollapse}>
                {(categoryGroupInfo && categoryGroupInfo.data && categoryGroupInfo.data.length > 10) && (
                <FormGroup className="mt-2 mb-2">
                  <Input type="input" name="categorySearchValue" placeholder="Please search a category" onChange={onCategorySearchChange} id="categorySearchValue" className="border-radius-50px" />
                </FormGroup>
                )}
                <div className="pl-1">
                  {((categoryGroupInfo && categoryGroupInfo.loading) || isUserLoading) && (
                  <Loader />
                  )}
                  {categoryGroups && categoryGroups.map((cItem, index) => (
                    cItem.compliance_category_id && (
                    <span className="mb-1 d-block font-weight-500" key={cItem.compliance_category_id}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxcaitemaction${index}`}
                          value={cItem.compliance_category_id[0]}
                          name={cItem.compliance_category_id[1]}
                          checked={categoryValues.some((selectedValue) => parseInt(selectedValue) === parseInt(cItem.compliance_category_id[0]))}
                          onChange={handleCategoryCheckboxChange}
                        />
                        <Label htmlFor={`checkboxcaitemaction${index}`}>
                          <ReadMoreText text={cItem.compliance_category_id[1]} />
                        </Label>
                        {' '}
                      </div>
                    </span>
                    )
                  ))}
                  {((categoryGroupInfo && categoryGroupInfo.err) || isUserError) && (
                  <ErrorContent errorTxt={errorMsg1} />
                  )}
                </div>
              </Collapse>
              <hr className="mt-2" />
              <Row className="m-0">
                <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                  <p className="m-0 font-weight-800 collapse-heading">BY APPLIES TO</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setAppCollapse(!appCollapse)} size="sm" icon={appCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={appCollapse}>
                <div>
                  {customData.appliesTo.map((lan) => (
                    <span className="mb-1 d-block font-weight-500" key={lan.value}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxasaction${lan.value}`}
                          name={lan.label}
                          value={lan.value}
                          checked={appValues.some((selectedValue) => selectedValue === lan.value)}
                          onChange={handleAppCheckboxChange}
                        />
                        <Label htmlFor={`checkboxasaction${lan.value}`}>
                          <span>{lan.label}</span>
                        </Label>
                        {' '}
                      </div>
                    </span>
                  ))}
                </div>
              </Collapse>
              <hr className="mt-2" />
              {((statusValues && statusValues.length > 0)
                  || (categoryValues && categoryValues.length > 0)
                  || (appValues && appValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
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
  id: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  appValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  categoryValue: PropTypes.oneOfType([
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
