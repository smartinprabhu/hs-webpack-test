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
  getVendorsList, getVendorsCount, getVendorFilters,
  getVendorDetail,
} from '../purchaseService';
import {
  getColumnArrayById, queryGeneratorWithUtc,
  generateErrorMessage, truncate, getDefaultNoValue,
  getAllowedCompanies,
} from '../../util/appUtils';
import customData from './data/customData.json';

const appModels = require('../../util/appModels').default;

const Sidebar = (props) => {
  const {
    offset, id, statusValue, languageValue, afterReset,
    sortBy, sortField, setCollapse, collapse,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkLangValues, setCheckLangValues] = useState([]);
  const [checkLangItems, setCheckLangItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [removedStatusValue, setRemoveStatusValue] = useState(statusValue);
  const [removedLangValue, setRemoveLangValue] = useState(languageValue);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [langCollapse, setLangCollapse] = useState(false);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [viewId, setViewId] = useState(0);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [vendorsList, setVendors] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    vendorFilters, vendorsCount, vendorsInfo,
  } = useSelector((state) => state.purchase);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);

  useEffect(() => {
    if (!id) {
      setVendors([]);
    }
  }, [id]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getVendorDetail(viewId, appModels.PARTNER));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    if (vendorsInfo && vendorsInfo.data && id) {
      const arr = [...vendorsList, ...vendorsInfo.data];
      setVendors([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [vendorsInfo, id]);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    setRemoveStatusValue(statusValue);
  }, [statusValue]);

  useEffect(() => {
    setRemoveLangValue(languageValue);
  }, [languageValue]);

  useEffect(() => {
    if (statusCollapse) {
      setLangCollapse(false);
    }
  }, [statusCollapse]);

  useEffect(() => {
    if (langCollapse) {
      setStatusCollapse(false);
    }
  }, [langCollapse]);

  useEffect(() => {
    if (removedLangValue && removedLangValue !== 0) {
      setCheckLangItems(checkLangItems.filter((item) => item.id !== removedLangValue));
      if (checkLangItems.filter((item) => item.id !== removedLangValue) && checkLangItems.filter((item) => item.id !== removedLangValue).length === 0) {
        dispatch(getVendorFilters(checkItems, checkLangItems.filter((item) => item.id !== removedLangValue)), customFiltersList);
      }
    }
  }, [removedLangValue]);

  useEffect(() => {
    if (removedStatusValue && removedStatusValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== removedStatusValue));
      if (checkItems.filter((item) => item.id !== removedStatusValue) && checkItems.filter((item) => item.id !== removedStatusValue).length === 0) {
        dispatch(getVendorFilters(checkItems.filter((item) => item.id !== removedStatusValue)), checkLangItems, customFiltersList);
      }
    }
  }, [removedStatusValue]);

  useEffect(() => {
    if (vendorFilters && vendorFilters.customFilters) {
      setCustomFilters(vendorFilters.customFilters);
    }
  }, [vendorFilters]);

  useEffect(() => {
    if ((checkItems && checkItems.length > 0) || (checkLangItems && checkLangItems.length > 0)) {
      dispatch(getVendorFilters(checkItems, checkLangItems, customFiltersList));
    }
  }, [checkItems, checkLangItems]);

  useEffect(() => {
    dispatch(getVendorFilters([], [], []));
  }, []);

  useEffect(() => {
    if (userInfo.data && (vendorFilters && (vendorFilters.statuses || vendorFilters.languages || vendorFilters.customFilters))) {
      const statusValues = vendorFilters.statuses ? getColumnArrayById(vendorFilters.statuses, 'id') : [];
      const langValues = vendorFilters.languages ? getColumnArrayById(vendorFilters.languages, 'id') : [];
      const customFilters = vendorFilters.customFilters ? queryGeneratorWithUtc(vendorFilters.customFilters, false, userInfo.data) : '';
      dispatch(getVendorsCount(companies, appModels.PARTNER, statusValues, langValues, customFilters));
    }
  }, [userInfo, vendorFilters]);

  useEffect(() => {
    if (userInfo.data && (vendorFilters && (vendorFilters.statuses || vendorFilters.languages || vendorFilters.customFilters))) {
      const statusValues = vendorFilters.statuses ? getColumnArrayById(vendorFilters.statuses, 'id') : [];
      const langValues = vendorFilters.languages ? getColumnArrayById(vendorFilters.languages, 'id') : [];
      const customFilters = vendorFilters.customFilters ? queryGeneratorWithUtc(vendorFilters.customFilters, false, userInfo.data) : '';
      dispatch(getVendorsList(companies, appModels.PARTNER, limit, offsetValue, statusValues, langValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, vendorFilters, scrollTop]);

  useEffect(() => {
    if (userInfo && userInfo.data && id === 0) {
      const statusValues = vendorFilters.statuses ? getColumnArrayById(vendorFilters.statuses, 'id') : [];
      const langValues = vendorFilters.languages ? getColumnArrayById(vendorFilters.languages, 'id') : [];
      const customFilters = vendorFilters.customFilters ? queryGeneratorWithUtc(vendorFilters.customFilters,false, userInfo.data) : '';
      dispatch(getVendorsList(companies, appModels.PARTNER, limit, offset, statusValues, langValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [id]);

  useEffect(() => {
    if (userInfo.data && (tenantUpdateInfo && tenantUpdateInfo.data)) {
      const statusValues = vendorFilters.statuses ? getColumnArrayById(vendorFilters.statuses, 'id') : [];
      const langValues = vendorFilters.languages ? getColumnArrayById(vendorFilters.languages, 'id') : [];
      const customFilters = vendorFilters.customFilters ? queryGeneratorWithUtc(vendorFilters.customFilters, false, userInfo.data) : '';
      dispatch(getVendorsList(userInfo.data.company.id, appModels.PARTNER, limit, offsetValue, statusValues, langValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [tenantUpdateInfo]);

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
        dispatch(getVendorFilters(checkItems.filter((item) => item.id !== value), checkLangItems, customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setVendors([]);
  };

  const handleLangCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckLangValues((state) => [...state, value]);
      setCheckLangItems((state) => [...state, values]);
    } else {
      setCheckLangValues(checkLangValues.filter((item) => item !== value));
      setCheckLangItems(checkLangItems.filter((item) => item.id !== value));
      if (checkLangItems.filter((item) => item.id !== value) && checkLangItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getVendorFilters(checkItems, checkLangItems.filter((item) => item.id !== value), customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setVendors([]);
  };

  const handleStatusClose = (value) => {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getVendorFilters(checkItems.filter((item) => item.id !== value), checkLangItems, customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setVendors([]);
  };

  const handleLangClose = (value) => {
    setCheckLangValues(checkLangItems.filter((item) => item !== value));
    setCheckLangItems(checkLangItems.filter((item) => item.id !== value));
    if (checkLangItems.filter((item) => item.id !== value) && checkLangItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getVendorFilters(checkItems, checkLangItems.filter((item) => item.id !== value), customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setVendors([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    dispatch(getVendorFilters(checkItems, checkLangItems, customFiltersList.filter((item) => item.key !== value)));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setVendors([]);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCustomFilters([]);
    setCheckLangItems([]);
    setCheckLangValues([]);
    setOffsetValue(0);
    dispatch(getVendorFilters([], [], []));
    if (afterReset) afterReset();
    setVendors([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const total = vendorsCount && vendorsCount.length ? vendorsCount.length : 0;
    const scrollListCount = vendorsList && vendorsList.length ? vendorsList.length : 0;
    if ((vendorsInfo && !vendorsInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const currentId = viewId || id;
  const statusValues = vendorFilters && vendorFilters.statuses ? getColumnArrayById(vendorFilters.statuses, 'id') : [];
  const languageValues = vendorFilters && vendorFilters.languages ? getColumnArrayById(vendorFilters.languages, 'id') : [];

  const statusList = vendorFilters && vendorFilters.statuses ? vendorFilters.statuses : [];
  const languagesList = vendorFilters && vendorFilters.languages ? vendorFilters.languages : [];

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
                  {languagesList && languagesList.map((item) => (
                    <h5 key={item.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                        {item.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleLangClose(item.id)} size="sm" icon={faTimesCircle} />
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
                {((statusValues && statusValues.length > 0) || (languageValues && languageValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
                  <div aria-hidden="true" className="cursor-pointer text-info text-right mr-2 font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                )}
                {((statusValues && statusValues.length > 0) || (languageValues && languageValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
                  <hr className="mt-0 pt-1 mb-2 ml-2 mr-2" />
                )}
                <div onScroll={onScroll} className={vendorsList && vendorsList.length > 9 ? 'height-100 table-scrollable thin-scrollbar' : ''}>
                  {(vendorsList) && vendorsList.map((ven) => (
                    <Card
                      key={ven.id}
                      onClick={() => setViewId(ven.id)}
                      className={(ven.id === currentId) ? 'mb-2 mr-2 ml-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mr-2 ml-2  mb-2'}
                    >
                      <CardBody className="p-2">
                        <Row>
                          <Col sm="12" md="12" lg="12" xs="12">
                            <span className="font-weight-700 mb-1 font-medium" title={ven.name}>{truncate(ven.name, 20)}</span>
                          </Col>
                        </Row>
                        <p className="font-weight-600 mb-0 font-tiny">{getDefaultNoValue(ven.mobile)}</p>
                        <p className="font-weight-600 mb-0 font-tiny">{getDefaultNoValue(ven.email)}</p>
                      </CardBody>
                    </Card>
                  ))}
                  {(vendorsInfo && vendorsInfo.err) && (
                    <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                      <CardBody className="p-2">
                        <ErrorContent errorTxt={generateErrorMessage(vendorsInfo)} />
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
                  {((vendorsInfo && vendorsInfo.loading) || (userInfo && userInfo.loading)) && (
                    <Loader />
                  )}
                </div>
              </div>
            </>
          ) : (
            <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
              <Row className="m-0">
                <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                  <p className="m-0 font-weight-800 collapse-heading">BY TYPE</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setStatusCollapse(!statusCollapse)} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={statusCollapse}>
                <div>
                  {customData.companyTypes.map((mt, index) => (
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
                  <p className="m-0 font-weight-800 collapse-heading">BY LANGUAGE</p>
                </Col>
                <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                  <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setLangCollapse(!langCollapse)} size="sm" icon={langCollapse ? faChevronUp : faChevronDown} />
                </Col>
              </Row>
              <Collapse isOpen={langCollapse}>
                <div>
                  {customData.langugages.map((lan) => (
                    <span className="mb-1 d-block font-weight-500" key={lan.value}>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          id={`checkboxasaction${lan.value}`}
                          name={lan.label}
                          value={lan.value}
                          checked={languageValues.some((selectedValue) => selectedValue === lan.value)}
                          onChange={handleLangCheckboxChange}
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
              {((statusValues && statusValues.length > 0) || (languageValues && languageValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
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
  languageValue: PropTypes.oneOfType([
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
