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
  getColumnArrayById, generateErrorMessage, truncate, getDefaultNoValue, getLocalTime,
  getAllowedCompanies, queryGeneratorWithUtc
} from '../../util/appUtils';
import filterJson from './data/customData.json';
import { getProductList, getProductsCount, productFilters } from '../purchaseService';

const appModels = require('../../util/appModels').default;

const SideFilters = (props) => {
  const {
    id, afterReset, offset, sortBy, sortField, typeValue, categoryValue,
    setViewProduct, setCollapse, collapse,
  } = props;

  const dispatch = useDispatch();
  const limit = 10;

  const {
    productFiltersInfo, productsCount, productCategoryInfo, productsInfo, addProductInfo, updateProductInfo,
  } = useSelector((state) => state.purchase);

  const { userInfo } = useSelector((state) => state.user);
  const [categoryCollapse, setCategoryCollapse] = useState(false);
  const [typeCollapse, setTypeCollapse] = useState(true);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [checkTypeItems, setCheckTypeItems] = useState([]);
  const [checkTypeValues, setCheckTypeValues] = useState([]);
  const [checkCategoryitems, setCheckCategoryItems] = useState([]);
  const [checkCategoryValues, setCheckCategoryValues] = useState([]);
  const [removeTypeValue, setRemoveTypeValue] = useState(typeValue);
  const [removeCategoryValue, setRemoveCategoryValue] = useState(categoryValue);
  const [products, setProducts] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [filtersIcon, setFilterIcon] = useState(false);

  const companies = getAllowedCompanies(userInfo);

  const categoryValues = productFiltersInfo && productFiltersInfo.categories ? getColumnArrayById(productFiltersInfo.categories, 'id') : [];
  const typeValues = productFiltersInfo && productFiltersInfo.types ? getColumnArrayById(productFiltersInfo.types, 'id') : [];

  const categoryData = productFiltersInfo && productFiltersInfo.categories ? productFiltersInfo.categories : [];
  const typeData = productFiltersInfo && productFiltersInfo.types ? productFiltersInfo.types : [];

  useEffect(() => {
    if (typeValue) {
      setRemoveTypeValue(typeValue);
    }
  }, [typeValue]);

  useEffect(() => {
    if (categoryValue) {
      setRemoveCategoryValue(categoryValue);
    }
  }, [categoryValue]);

  useEffect(() => {
    if (productsInfo && productsInfo.data && id) {
      const arr = [...products, ...productsInfo.data];
      setProducts([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [productsInfo, id]);

  useEffect(() => {
    if (!id) {
      setProducts([]);
    }
  }, [id]);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    if (removeTypeValue && removeTypeValue !== 0) {
      setCheckTypeItems(checkTypeItems.filter((item) => item.id !== removeTypeValue));
      if (checkTypeItems.filter((item) => item.id !== removeTypeValue) && checkTypeItems.filter((item) => item.id !== removeTypeValue).length === 0) {
        dispatch(productFilters(checkCategoryitems, checkTypeItems.filter((item) => item.id !== removeTypeValue), customFiltersList));
      }
    }
  }, [removeTypeValue]);

  useEffect(() => {
    if (removeCategoryValue && removeCategoryValue !== 0) {
      setCheckCategoryItems(checkCategoryitems.filter((item) => item.id !== removeCategoryValue));
      if (checkCategoryitems.filter((item) => item.id !== removeCategoryValue) && checkCategoryitems.filter((item) => item.id !== removeCategoryValue).length === 0) {
        dispatch(productFilters(checkCategoryitems.filter((item) => item.id !== removeCategoryValue), checkTypeItems, customFiltersList));
      }
    }
  }, [removeCategoryValue]);

  useEffect(() => {
    if (typeCollapse) {
      setCategoryCollapse(false);
    }
  }, [typeCollapse]);

  useEffect(() => {
    if (categoryCollapse) {
      setTypeCollapse(false);
    }
  }, [categoryCollapse]);

  useEffect(() => {
    if ((checkTypeItems && checkTypeItems.length) || (checkCategoryitems && checkCategoryitems.length) || (customFiltersList && customFiltersList.length)) {
      dispatch(productFilters(checkCategoryitems, checkTypeItems, customFiltersList));
    }
  }, [checkTypeItems, checkCategoryitems, customFiltersList]);

  useEffect(() => {
    if (productFiltersInfo && productFiltersInfo.customFilters) {
      setCustomFilters(productFiltersInfo.customFilters);
    }
  }, [productFiltersInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && (productFiltersInfo && (productFiltersInfo.categories || productFiltersInfo.types || productFiltersInfo.customFilters))) {
      const categoryValuesInfo = productFiltersInfo && productFiltersInfo.categories ? getColumnArrayById(productFiltersInfo.categories, 'id') : [];
      const typeValuesInfo = productFiltersInfo && productFiltersInfo.types ? getColumnArrayById(productFiltersInfo.types, 'id') : [];
      const customFilterValuesInfo = productFiltersInfo && productFiltersInfo.customFilters ? queryGeneratorWithUtc(productFiltersInfo.customFilters, 'id', userInfo.data) : [];
      dispatch(getProductsCount(companies, appModels.PARTS, categoryValuesInfo, typeValuesInfo, customFilterValuesInfo));
    }
  }, [productFiltersInfo, userInfo, scrollTop, offsetValue, sortByValue, sortFieldValue, addProductInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && (productFiltersInfo && (productFiltersInfo.categories || productFiltersInfo.types || productFiltersInfo.customFilters))) {
      const categoryValuesInfo = productFiltersInfo && productFiltersInfo.categories ? getColumnArrayById(productFiltersInfo.categories, 'id') : [];
      const typeValuesInfo = productFiltersInfo && productFiltersInfo.types ? getColumnArrayById(productFiltersInfo.types, 'id') : [];
      const customFilterValuesInfo = productFiltersInfo && productFiltersInfo.customFilters ? queryGeneratorWithUtc(productFiltersInfo.customFilters, 'id', userInfo.data) : [];
      dispatch(getProductList(companies, appModels.PARTS, limit, offsetValue, sortByValue, sortFieldValue, categoryValuesInfo, typeValuesInfo, customFilterValuesInfo));
    }
  }, [productFiltersInfo, userInfo, scrollTop, offsetValue, sortByValue, sortFieldValue, addProductInfo, updateProductInfo]);

  const handleProductTypeChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckTypeItems((state) => [...state, values]);
      setCheckTypeValues((state) => [...state, value]);
    } else {
      setCheckTypeItems(checkTypeItems.filter((item) => item.id !== value));
      setCheckTypeValues(checkTypeValues.filter((item) => item !== value));
      if (checkTypeItems.filter((item) => item.id !== value) && checkTypeItems.filter((item) => item.id !== value).length === 0) {
        dispatch(productFilters(checkCategoryitems, checkTypeItems.filter((item) => item.id !== value), customFiltersList));
      }
    }
    if (afterReset) {
      afterReset();
    }
    setOffsetValue(0);
    setProducts([]);
  };

  const handleProductCategoryChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckCategoryItems((state) => [...state, values]);
      setCheckCategoryValues((state) => [...state, value]);
    } else {
      setCheckCategoryItems(checkCategoryitems.filter((item) => item.id !== value));
      setCheckCategoryValues(checkCategoryValues.filter((item) => item !== value));
      if (checkCategoryitems.filter((item) => item.id !== value) && checkCategoryitems.filter((item) => item.id !== value).length === 0) {
        dispatch(productFilters(checkCategoryitems.filter((item) => item.id !== value), checkTypeItems, customFiltersList));
      }
    }
    if (afterReset) {
      afterReset();
    }
    setOffsetValue(0);
    setProducts([]);
  };

  const handleTypeClose = (value) => {
    setCheckTypeValues(checkTypeValues.filter((item) => item.id !== value));
    setCheckTypeItems(checkTypeItems.filter((item) => item.id !== value));
    if (checkTypeItems.filter((item) => item.id !== value) && checkTypeItems.filter((item) => item.id !== value).length === 0) {
      dispatch(productFilters(checkCategoryitems, checkTypeItems.filter((item) => item.id !== value), customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setProducts([]);
  };

  const handleCategoryClose = (value) => {
    setCheckCategoryValues(checkCategoryValues.filter((item) => item.id !== value));
    setCheckCategoryItems(checkCategoryitems.filter((item) => item.id !== value));
    if (checkCategoryitems.filter((item) => item.id !== value) && checkCategoryitems.filter((item) => item.id !== value).length === 0) {
      dispatch(productFilters(checkCategoryitems.filter((item) => item.id !== value), checkTypeItems, customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setProducts([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    const categoryValuesInfo = productFiltersInfo && productFiltersInfo.categories ? getColumnArrayById(productFiltersInfo.categories, 'id') : [];
    const typeValuesInfo = productFiltersInfo && productFiltersInfo.types ? getColumnArrayById(productFiltersInfo.types, 'id') : [];
    const customFilters = customFiltersList.filter((item) => item.key !== value);
    dispatch(productFilters(categoryValuesInfo, typeValuesInfo, customFilters));
    setProducts([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const total = productsCount && productsCount.data && productsCount.data.length ? productsCount.data.length : 0;
    const scrollListCount = products && products.length ? products.length : 0;
    if ((productsInfo && !productsInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const getType = (productType) => {
    const filteredType = filterJson.productType.filter((data) => data.value === productType);
    if (filteredType && filteredType.length) {
      return filteredType[0].name;
    }
    return '-';
  };
  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckCategoryItems([]);
    setCheckCategoryValues([]);
    setCheckTypeItems([]);
    setCheckTypeValues([]);
    setCustomFilters([]);
    setOffsetValue(0);
    dispatch(productFilters([], [], []));
    if (afterReset) afterReset();
    setProducts([]);
  };

  return (
    <>
      <Card className="p-1 bg-lightblue area-height-100 side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
        {!collapse && (
        <>
          {id ? (
            <>
              <CardTitle className="mt-2 ml-2 mb-1 mr-2">
                <Row lg="12" sm="12" md="12">
                  <Col lg="10" sm="10" md="10" className="mr-0">
                    <h4>
                      Product List
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
              <div>
                <div className="mr-2 ml-2 mt-2">
                  {typeData && typeData.map((type) => (
                    <p key={type.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {type.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleTypeClose(type.id)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                  {categoryData && categoryData.map((category) => (
                    <p key={category.id} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {category.label}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCategoryClose(category.id)} size="sm" icon={faTimesCircle} />
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
                  <div onScroll={onScroll} className={products && products.length > 9 ? 'height-100 table-scrollable thin-scrollbar' : ''}>
                    {(products) && products.map((al) => (
                      <Card
                        key={al.id}
                        onClick={() => setViewProduct(al.id)}
                        className={(al.id === id) ? 'mb-2 mr-2 ml-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mr-2 ml-2  mb-2'}
                      >
                        <CardBody className="p-2">
                          <Row>
                            <Col sm="12" md="12" lg="12" xs="12">
                              <span className="font-weight-700 mb-1 font-medium" title={al.name}>{truncate(al.name, 20)}</span>
                            </Col>
                          </Row>
                          <span className="font-weight-300">
                            {getLocalTime(al.create_date)}
                          </span>
                          <p className="text-info font-weight-600 mb-0">
                            {' '}
                            {getDefaultNoValue(getType(al.type))}
                          </p>
                        </CardBody>
                      </Card>
                    ))}
                    {((productsInfo && productsInfo.loading) || (userInfo && userInfo.loading)) && (
                    <Loader />
                    )}
                    {(userInfo && userInfo.err) && (
                    <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                      <CardBody className="p-2">
                        <ErrorContent errorTxt={generateErrorMessage(userInfo)} />
                      </CardBody>
                    </Card>
                    )}
                    {(productsInfo && productsInfo.err) && (
                    <Card className="mr-2 ml-2 mb-2 border-nepal-1px">
                      <CardBody className="p-2">
                        <ErrorContent errorTxt={generateErrorMessage(productsInfo)} />
                      </CardBody>
                    </Card>
                    )}
                  </div>
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
                    <p className="m-0 font-weight-800 collapse-heading">BY PRODUCT TYPE</p>
                  </Col>
                  <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                    <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setTypeCollapse(!typeCollapse)} size="sm" icon={typeCollapse ? faChevronUp : faChevronDown} />
                  </Col>
                </Row>
                <Collapse isOpen={typeCollapse}>
                  <div>
                    {filterJson.productType.map((type) => (
                      <span className="mb-1 d-block font-weight-500" key={type.id}>
                        <div className="checkbox">
                          <Input
                            type="checkbox"
                            id={`checkbox${type.name}`}
                            name={type.name}
                            value={type.value}
                            checked={typeValues.some((selectedValue) => selectedValue === type.value)}
                            onChange={handleProductTypeChange}
                          />
                          <Label htmlFor={`checkbox${type.name}`}>
                            <span>{type.name}</span>
                          </Label>
                          {' '}
                        </div>
                      </span>
                    ))}
                  </div>
                </Collapse>
                <hr className="mt-2" />
                <Row className="m-0">
                  <Col md="10" xs="10" sm="10" lg="10" className="p-0">
                    <p className="m-0 font-weight-800 collapse-heading">BY PRODUCT CATEGORY</p>
                  </Col>
                  <Col md="2" xs="2" sm="2" lg="2" className="text-right p-0">
                    <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setCategoryCollapse(!categoryCollapse)} size="sm" icon={categoryCollapse ? faChevronUp : faChevronDown} />
                  </Col>
                </Row>
                <Collapse isOpen={categoryCollapse}>
                  <div>
                    {productCategoryInfo && productCategoryInfo.data && productCategoryInfo.data.length && productCategoryInfo.data.map((category) => (
                      <span className="mb-1 d-block font-weight-500" key={category.id}>
                        <div className="checkbox">
                          <Input
                            type="checkbox"
                            id={`checkboxasaction${category.name}`}
                            name={category.name}
                            value={category.id}
                            checked={categoryValues.some((selectedValue) => parseInt(selectedValue) === parseInt(category.id))}
                            onChange={handleProductCategoryChange}
                          />
                          <Label htmlFor={`checkboxasaction${category.name}`}>
                            <span>{category.name}</span>
                          </Label>
                          {' '}
                        </div>
                      </span>
                    ))}
                    {productCategoryInfo && productCategoryInfo.loading && (
                    <Loader />
                    )}
                  </div>
                </Collapse>
                <hr className="mt-2" />
                {((customFiltersList && customFiltersList.length > 0) || (categoryValues && categoryValues.length > 0) || (typeValues && typeValues.length > 0)) && (
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
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  offset: PropTypes.number.isRequired,
  setViewProduct: PropTypes.func,
  typeValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  categoryValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  setCollapse: PropTypes.func,
  collapse: PropTypes.bool,
};
SideFilters.defaultProps = {
  setViewProduct: undefined,
  setCollapse: () => { },
  collapse: false,
};
export default SideFilters;
