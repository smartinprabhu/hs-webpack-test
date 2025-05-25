/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Badge, Collapse, Card, CardBody, CardTitle, Col, Input, Label, Row, UncontrolledTooltip,
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
  getColumnArrayById, generateErrorMessage, truncate, getLocalTime, getDefaultNoValue, getAllowedCompanies, queryGeneratorWithUtc
} from '../../../util/appUtils';
import {
  getReOrderingRules, getReOrderingCount, getProductTypes, reorderingRulesFilters,
} from '../../purchaseService';

const appModels = require('../../../util/appModels').default;

const SideFilters = (props) => {
  const {
    sortBy, sortField, offset, productValue, setCollapse, collapse, afterReset, id, setProductValue, reOrderingRuleId, setReOrderingRule, filterData,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [checkProductItems, setCheckProductItems] = useState([]);
  const [checkProductValues, setCheckProductValues] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [removeProductValue, setRemoveProductValue] = useState(productValue);
  const [productCollapse, setProductCollapse] = useState(true);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [reOrderRules, setReOrderRules] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const { userInfo } = useSelector((state) => state.user);
  const {
    reOrderingRulesInfo, reOrderingRulesCount, productTypes, reOrderingRulesFilters, addReorderInfo,
  } = useSelector((state) => state.purchase);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (reOrderingRulesInfo && reOrderingRulesInfo.data && reOrderingRuleId) {
      const arr = [...reOrderRules, ...reOrderingRulesInfo.data];
      setReOrderRules([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [reOrderingRulesInfo, reOrderingRuleId]);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    if (!reOrderingRuleId) {
      setReOrderRules([]);
    }
  }, [reOrderingRuleId]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductTypes(appModels.REORDERINGRULES));
    }
  }, [userInfo]);
  const productFilterValues = reOrderingRulesFilters && reOrderingRulesFilters.products ? getColumnArrayById(reOrderingRulesFilters.products, 'id') : [];
  const productFilterData = reOrderingRulesFilters && reOrderingRulesFilters.products ? reOrderingRulesFilters.products : [];

  useEffect(() => {
    if (userInfo && userInfo.data && id && reOrderingRulesFilters && (reOrderingRulesFilters.products || reOrderingRulesFilters.customFilters)) {
      const productValuesInfo = reOrderingRulesFilters && reOrderingRulesFilters.products ? getColumnArrayById(reOrderingRulesFilters.products, 'id') : [];
      const customFilterValuesInfo = reOrderingRulesFilters && reOrderingRulesFilters.customFilters ? queryGeneratorWithUtc(reOrderingRulesFilters.customFilters, 'id', userInfo.data) : [];
      dispatch(getReOrderingRules(appModels.REORDERINGRULES, companies, limit, offset, sortBy, sortField, productValuesInfo, customFilterValuesInfo));
    }
  }, [userInfo, offset, sortByValue, sortFieldValue, id, reOrderingRulesFilters, scrollTop, addReorderInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && id && reOrderingRulesFilters && (reOrderingRulesFilters.products || reOrderingRulesFilters.customFilters)) {
      const productValuesInfo = reOrderingRulesFilters && reOrderingRulesFilters.products ? getColumnArrayById(reOrderingRulesFilters.products, 'id') : [];
      const customFilterValuesInfo = reOrderingRulesFilters && reOrderingRulesFilters.customFilters ? queryGeneratorWithUtc(reOrderingRulesFilters.customFilters, 'id', userInfo.data) : [];
      dispatch(getReOrderingCount(appModels.REORDERINGRULES, companies, productValuesInfo, customFilterValuesInfo));
    }
  }, [userInfo, offset, sortByValue, sortFieldValue, id, reOrderingRulesFilters, scrollTop, addReorderInfo]);

  const handleProductTypeChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckProductItems((state) => [...state, values]);
      setCheckProductValues((state) => [...state, value]);
    } else {
      setCheckProductItems(checkProductItems.filter((item) => item.id !== value));
      setCheckProductValues(checkProductValues.filter((item) => item !== value));
      if (checkProductItems.filter((item) => item.id !== value) && checkProductItems.filter((item) => item.id !== value).length === 0) {
        dispatch(reorderingRulesFilters(checkProductItems.filter((item) => item.id !== value), customFiltersList));
      }
    }
    if (afterReset) {
      afterReset();
    }
    setOffsetValue(0);
    setReOrderRules([]);
  };
  useEffect(() => {
    if (filterData && filterData.id && filterData.label) {
      setCheckProductItems((state) => [...state, filterData]);
      setCheckProductValues((state) => [...state, filterData.id]);
    }
  }, []);

  useEffect(() => {
    if ((checkProductItems && checkProductItems.length) || (customFiltersList && customFiltersList.length)) {
      dispatch(reorderingRulesFilters(checkProductItems, customFiltersList));
    }
  }, [checkProductItems, checkProductValues, customFiltersList]);

  useEffect(() => {
    if (reOrderingRulesFilters && reOrderingRulesFilters.customFilters) {
      setCustomFilters(reOrderingRulesFilters.customFilters);
    }
  }, [reOrderingRulesFilters]);

  useEffect(() => {
    if (productValue) {
      setRemoveProductValue(productValue);
    }
  }, [productValue]);

  useEffect(() => {
    if (removeProductValue) {
      setProductValue(false);
      setCheckProductItems(checkProductItems.filter((item) => item.id !== removeProductValue));
      if (checkProductItems.filter((item) => item.id !== removeProductValue) && checkProductItems.filter((item) => item.id !== removeProductValue).length === 0) {
        dispatch(reorderingRulesFilters(checkProductItems.filter((item) => item.id !== removeProductValue), customFiltersList));
      }
    }
  }, [removeProductValue]);

  const handleResetClick = (e) => {
    e.preventDefault();
    setCustomFilters([]);
    setCheckProductItems([]);
    setCheckProductValues([]);
    if (afterReset) afterReset();
    dispatch(reorderingRulesFilters([], []));
  };

  const handleProductClose = (value) => {
    setCheckProductValues(checkProductValues.filter((item) => item.id !== value));
    setCheckProductItems(checkProductItems.filter((item) => item.id !== value));
    if (checkProductItems.filter((item) => item.id !== value) && checkProductItems.filter((item) => item.id !== value).length === 0) {
      dispatch(reorderingRulesFilters(checkProductItems.filter((item) => item.id !== value), customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setReOrderRules([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    const productValuesInfo = reOrderingRulesFilters && reOrderingRulesFilters.products ? getColumnArrayById(reOrderingRulesFilters.products, 'id') : [];
    const customFilters = customFiltersList.filter((item) => item.key !== value);
    if (customFilters && customFilters.length === 0) {
      dispatch(reorderingRulesFilters(productValuesInfo, customFilters));
    }
    setReOrderRules([]);
  };
  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const total = reOrderingRulesCount && reOrderingRulesCount.data && reOrderingRulesCount.data.length ? reOrderingRulesCount.data.length : 0;
    const scrollListCount = reOrderRules && reOrderRules.length ? reOrderRules.length : 0;
    if ((reOrderingRulesInfo && !reOrderingRulesInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };
  return (
    <>
      <Card className="p-1 bg-lightblue area-height-100 side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
        {!collapse && (
          <>
            {reOrderingRuleId ? (
              <>
                <CardTitle className="mt-2 ml-2 mb-1 mr-2">
                  <Row lg="12" sm="12" md="12">
                    <Col lg="10" sm="10" md="10" className="mr-0">
                      <h5>
                        Reordering Rules List
                      </h5>
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
                          className="cursor-pointer collapse-margin-left"
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
                <div className="mr-2 ml-2 mt-2">
                  {productFilterData && productFilterData.map((product) => (
                    <p key={product.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {product.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleProductClose(product.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                  {customFiltersList && customFiltersList.map((cf) => (
                    <p key={cf.key} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {cf.label}
                        {cf.type === 'text' && (
                          <span>
                            {'  '}
                            &quot;
                            {decodeURIComponent(cf.value)}
                            &quot;
                          </span>
                        )}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                  <div onScroll={onScroll} className={reOrderRules && reOrderRules.length > 5 ? 'height-100 table-scrollable thin-scrollbar' : ''}>
                    {(reOrderRules) && reOrderRules.map((rl) => (
                      <Card
                        key={rl.id}
                        onClick={() => setReOrderingRule(rl.id)}
                        className={(rl.id === reOrderingRuleId) ? 'mb-2 mr-2 ml-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mr-2 ml-2  mb-2'}
                      >
                        <CardBody className="p-2">
                          <Row>
                            <Col sm="12" md="12" lg="12" xs="12">
                              <span className="font-weight-700 mb-1 font-medium" title={rl.name}>{truncate(rl.name, 20)}</span>
                            </Col>
                          </Row>
                          <span className="font-weight-300">
                            {getLocalTime(rl.create_date)}
                          </span>
                          <p className="text-info font-weight-600 mb-0">
                            {' '}
                            {rl.product_id && rl.product_id.length ? rl.product_id[1] : getDefaultNoValue(rl.product_id)}
                          </p>
                        </CardBody>
                      </Card>
                    ))}
                    {((reOrderingRulesInfo && reOrderingRulesInfo.loading) || (userInfo && userInfo.loading)) && (
                      <Loader />
                    )}
                    {(userInfo && userInfo.err) && (
                      <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                        <CardBody className="p-2">
                          <ErrorContent errorTxt={generateErrorMessage(userInfo)} />
                        </CardBody>
                      </Card>
                    )}
                    {(reOrderingRulesInfo && reOrderingRulesInfo.err) && (
                      <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                        <CardBody className="p-2">
                          <ErrorContent errorTxt={generateErrorMessage(reOrderingRulesInfo)} />
                        </CardBody>
                      </Card>
                    )}
                  </div>
                </div>
              </>
            ) : (
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
                        className="cursor-pointer collapse-margin-left"
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
                <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
                  <Row className="m-0">
                    <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                      <p className="mb-2 font-weight-800 collapse-heading">BY PRODUCT</p>
                    </Col>
                    <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                      <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setProductCollapse(!productCollapse)} size="sm" icon={productCollapse ? faChevronUp : faChevronDown} />
                    </Col>
                  </Row>
                  <Collapse isOpen={productCollapse}>
                    <div>
                      {productTypes && productTypes.data && productTypes.data.length ? (
                        productTypes.data.map((product, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <span className="mb-1 d-block font-weight-500" key={index}>
                            <div className="checkbox">
                              <Input
                                type="checkbox"
                                id={`checkbox${index}`}
                                name={product.product_id && product.product_id.length ? product.product_id[1] : ''}
                                value={product.product_id && product.product_id.length ? product.product_id[0] : ''}
                                checked={productFilterValues.some((selectedValue) => parseInt(selectedValue) === parseInt(product.product_id[0]))}
                                onChange={handleProductTypeChange}
                              />
                              <Label htmlFor={`checkbox${index}`}>
                                <span>{product.product_id && product.product_id.length ? product.product_id[1] : ''}</span>
                              </Label>
                              {' '}
                            </div>
                          </span>
                        ))) : ''}
                    </div>
                  </Collapse>
                  <hr className="mt-2" />
                  {((customFiltersList && customFiltersList.length > 0) || (productFilterValues && productFilterValues.length > 0)) && (
                  <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                  )}
                </CardBody>
              </>
            )}
          </>
        )}
      </Card>
    </>
  );
};

SideFilters.propTypes = {
  offset: PropTypes.number.isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  setCollapse: PropTypes.func.isRequired,
  collapse: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  reOrderingRuleId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  setReOrderingRule: PropTypes.func.isRequired,
  setProductValue: PropTypes.func.isRequired,
  productValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  filterData: PropTypes.object,
};
SideFilters.defaultProps = {
  filterData: {},
};
export default SideFilters;
