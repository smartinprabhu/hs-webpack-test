/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import {
  Badge, Button, Card, CardBody, CardTitle, Col, Row, Table,
  Modal, Popover, PopoverBody, PopoverHeader,
  UncontrolledTooltip,
  ModalBody, Input, Label,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import editWhiteIcon from '@images/icons/editWhite.svg';
import editIcon from '@images/icons/edit.svg';
import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import ErrorContent from '@shared/errorContent';
import DetailNavigation from '@shared/navigation';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import AddColumns from '@shared/listViewFilters/columns';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import SearchList from '@shared/listViewFilters/search';
import CreateList from '@shared/listViewFilters/create';
import filterIcon from '@images/filter.png';
import ExportList from '@shared/listViewFilters/export';

import SideFiters from './sideFilters';
import AddReorderingRules from './addReorderingRules';
import {
  getDefaultNoValue, getColumnArrayById, generateErrorMessage, getPagesCountV2, getLocalDate,
} from '../../../util/appUtils';
import {
  setInitialValues, reorderingRulesFilters,
  getCheckedRowsReOrderingRules, getReorderRuleDetails, setProducts, setProductId,
  clearAddReOrderingRule, clearEditReOderingRule,
} from '../../purchaseService';
import customDataJson from './data/customData.json';
import DataExport from './dataExport/dataExport';
import ReOrderingRulesDetails from './reOrderingRulesDetails';

const appModels = require('../../../util/appModels').default;

const ReOrderingRules = (props) => {
  const { match } = props;
  const isProduct = match.path.includes('products');
  const { params } = match;
  const { id } = params;
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [product, setProduct] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [count, setCount] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkItems, setCheckItems] = useState([]);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [reOrderingRule, setReOrderingRule] = useState('');
  const [isAddReorder, setOpenAddReorderModal] = useState(false);
  const [columnsList, setColumnsList] = useState(['name', 'product_id', 'location_id', 'warehouse_id', 'qty_multiple']);
  const [customFilters, setCustomFilters] = useState([]);
  const [productValue, setProductValue] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editButtonHover, setEditButtonHover] = useState(false);
  const [cancelButtonHover, setCancelButtonHover] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    productDetailsInfo, reOrderingRulesInfo, reOrderingRulesCount, reOrderingRulesFilters, filterInitailValues, reOrderingRuleDetailsInfo,
    addReorderInfo, updateReorderInfo,
  } = useSelector((state) => state.purchase);

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();
  const loading = (userInfo && userInfo.loading) || (productDetailsInfo && productDetailsInfo.loading) || (reOrderingRulesInfo && reOrderingRulesInfo.loading);
  const pages = getPagesCountV2(count, limit);
  const dateFilters = (reOrderingRulesFilters && reOrderingRulesFilters.customFilters && reOrderingRulesFilters.customFilters.length > 0) ? reOrderingRulesFilters.customFilters : [];

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsReOrderingRules(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (userInfo && userInfo.data && productDetailsInfo && (productDetailsInfo.data && productDetailsInfo.data.length > 0)) {
      setProduct(productDetailsInfo.data[0]);
    }
  }, [productDetailsInfo, userInfo]);
  useEffect(() => {
    if (reOrderingRule) {
      dispatch(getReorderRuleDetails(appModels.REORDERINGRULES, reOrderingRule));
    }
  }, [reOrderingRule, updateReorderInfo]);

  useEffect(() => {
    if (reOrderingRulesCount && reOrderingRulesCount.data && reOrderingRulesCount.data.length) {
      setCount(reOrderingRulesCount.data.length);
    } else {
      setCount(0);
    }
  }, [reOrderingRulesCount]);
  useEffect(() => {
    if (reOrderingRulesFilters && reOrderingRulesFilters.products) {
      setCheckItems(reOrderingRulesFilters.products);
    }
    if (reOrderingRulesFilters && reOrderingRulesFilters.customFilters) {
      setCustomFilters(reOrderingRulesFilters.customFilters);
    }
  }, [reOrderingRulesFilters]);

  const handleTableCellChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => item !== value));
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const data = reOrderingRulesInfo && reOrderingRulesInfo.data ? reOrderingRulesInfo.data : [];
      setCheckRows(getColumnArrayById(data, 'id'));
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };
  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
  };
  const handleProductsClose = (value) => {
    setProductValue(value);
    setCheckItems(checkItems.filter((item) => item.id !== value));
  };
  const handleSearchFilter = (values, { resetForm }) => {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    setCustomFilters([...customFilters.filter((item) => item.type !== 'text'), ...filters]);
    const productTypesInfo = reOrderingRulesFilters && reOrderingRulesFilters.products ? reOrderingRulesFilters.products : [];
    const customFiltersInfo = [...customFilters.filter((item) => item.type !== 'text'), ...filters];
    dispatch(reorderingRulesFilters(productTypesInfo, customFiltersInfo));
    resetForm({ values: '' });
  };
  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const productTypesInfo = reOrderingRulesFilters && reOrderingRulesFilters.products ? reOrderingRulesFilters.products : [];
    dispatch(reorderingRulesFilters(productTypesInfo, customFilters.filter((item) => item.key !== value)));
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    const oldCustomFilters = reOrderingRulesFilters && reOrderingRulesFilters.customFilters ? reOrderingRulesFilters.customFilters : [];
    const productsData = reOrderingRulesFilters && reOrderingRulesFilters.products ? reOrderingRulesFilters.products : [];

    if (checked) {
      setCustomFiltersList(filters);
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(reorderingRulesFilters(productsData, customFiltersData));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...customFiltersList.filter((item) => item !== value)];
      dispatch(reorderingRulesFilters(productsData, customFiltersData));
    }
  };

  const handleCustomDateChange = (start, end) => {
    const value = 'Custom';
    const filters = [{
      key: value, value, label: value, type: 'customdate', start, end,
    }];
    const oldCustomFilters = reOrderingRulesFilters && reOrderingRulesFilters.customFilters ? reOrderingRulesFilters.customFilters : [];
    const productsData = reOrderingRulesFilters && reOrderingRulesFilters.products ? reOrderingRulesFilters.products : [];

    if (start && end) {
      setCustomFiltersList(filters);
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(reorderingRulesFilters(productsData, customFiltersData));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...customFiltersList.filter((item) => item !== value)];
      dispatch(reorderingRulesFilters(productsData, customFiltersData));
    }
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumnsList((state) => [...state, value]);
    } else {
      setColumnsList(columnsList.filter((item) => item !== value));
    }
  };

  useEffect(() => {
    dispatch(reorderingRulesFilters([], []));
  }, []);

  const onCloseReOrderRule = () => {
    setOffset(offset);
    setPage(page);
    setReOrderingRule(0);
  };
  useEffect(() => {
    if (isProduct) {
      dispatch(setProducts(true));
    }
  }, [isProduct]);

  const onListClick = () => {
    setOffset(offset); setPage(page); setReOrderingRule(0);
  };

  const onSetProduct = () => {
    dispatch(setProductId(id));
  };
  const onAddReset = () => {
    setOpenAddReorderModal(false);
    dispatch(clearAddReOrderingRule());
    dispatch(clearEditReOderingRule());
  };
  const onEditReset = () => {
    setEdit(false);
    dispatch(clearEditReOderingRule());
    dispatch(clearAddReOrderingRule());
  };

  const onAddReOrderRule = () => {
    setOpenAddReorderModal(true);
  };

  const onEditReOrderRule = () => {
    setEdit(true);
  };

  return (
    <>
      {product ? (
        <Row className="ml-1 mr-1 mt-2 mb-2 pr-3 pl-3 pb-3 pt-0 border">
          <Col sm="12" md="12" lg="12" xs="12">
            <div className="p-1">
              <CardBody>
                <>
                  <Row className="mb-2">
                    <Col md={6} xs={7} className="pr-0">
                      <Row>
                        <Col lg={12} md={12} sm={12} xs={12} className="pl-0">
                          <span className="font-weight-800 mr-1 font-medium link-text">
                            <Link to="/purchase/products">
                              Products
                            </Link>
                            {' '}
                            /
                          </span>
                          <span aria-hidden="true" className="font-weight-800 link-text font-medium cursor-pointer" onClick={() => { onSetProduct(); onListClick(); }}>
                            <Link to="/purchase/products">
                              {product.name}
                            </Link>
                            {' '}
                            /
                          </span>
                          <span className="font-weight-400 ml-1 font-16">
                            ReOrderingRules
                          </span>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6} sm={6} lg={6} xs={12} className="p-0">
                      <span className="text-right desktop-view">
                        <Link to="/purchase/products">
                          <Button  variant="contained" size="sm" className="hoverColor bg-white pb-1 pt-1 tab_nav_link rounded-pill float-right mb-1">
                            <span>Cancel </span>
                            <FontAwesomeIcon className="ml-2" size="sm" icon={faTimesCircle} />
                          </Button>
                        </Link>
                      </span>
                    </Col>
                  </Row>
                  <hr className="extend-line mt-0" />
                  <Row>
                    <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className="pt-2 pr-3 pl-0">
                      {collapse ? (
                        <>
                          <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer" id="filters" />
                          <UncontrolledTooltip target="filters" placement="right">
                            Filters
                          </UncontrolledTooltip>
                        </>
                      ) : (
                        <SideFiters
                          offset={offset}
                          sortField={sortField}
                          sortBy={sortBy}
                          productValue={productValue}
                          setProductValue={setProductValue}
                          id={id}
                          filterData={{ label: product.name, id: product.product_variant_id && product.product_variant_id.length > 0 ? product.product_variant_id[0] : product.id }}
                          collapse={collapse}
                          setCollapse={setCollapse}
                          reOrderingRuleId={reOrderingRule}
                          setReOrderingRule={setReOrderingRule}
                          afterReset={() => { setPage(0); setOffset(0); }}
                        />
                      )}
                    </Col>
                    <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left pt-2' : 'pt-2'}>
                      {reOrderingRule ? (
                        <div className={collapse ? 'filter-margin-right card h-100' : 'card h-100'}>
                          <Row>
                            <Col sm="12" md="12" lg="12" xs="12">
                              <Card className="bg-lightblue border-0 p-2 h-100">
                                <CardTitle className=" mb-0">
                                  <DetailNavigation
                                    overviewName="Products"
                                    overviewPath="/purchase"
                                    listName="Reordering Rules"
                                    detailName={reOrderingRuleDetailsInfo && (reOrderingRuleDetailsInfo.data && reOrderingRuleDetailsInfo.data.length > 0)
                                      ? reOrderingRuleDetailsInfo.data[0].name : ''}
                                    afterList={() => { setOffset(offset); setPage(page); setReOrderingRule(0); }}
                                  />
                                  <span className="float-right">
                                    {productDetailsInfo && !productDetailsInfo.loading ? (
                                      <Button
                                         variant="contained"
                                        size="sm"
                                        onClick={onEditReOrderRule}
                                        onMouseLeave={() => setEditButtonHover(false)}
                                        onMouseEnter={() => setEditButtonHover(true)}
                                        className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                                      >
                                        <img src={editButtonHover ? editWhiteIcon : editIcon} className="mr-2 pb-2px" height="12" width="12" alt="edit" />
                                        <span className="mr-2">Edit</span>
                                      </Button>
                                    ) : ''}
                                    <Button
                                       variant="contained"
                                      size="sm"
                                      onClick={onCloseReOrderRule}
                                      onMouseLeave={() => setCancelButtonHover(false)}
                                      onMouseEnter={() => setCancelButtonHover(true)}
                                      className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                                    >
                                      <img src={cancelButtonHover ? closeCircleWhiteIcon : closeCircleIcon} className="mr-2 pb-2px" height="12" width="12" alt="close" />
                                      <span className="mr-2">Close</span>
                                    </Button>
                                    <Modal size={updateReorderInfo && updateReorderInfo.data ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={isEdit}>
                                      <ModalHeaderComponent
                                        title="Edit Reordering Rules"
                                        imagePath={false}
                                        closeModalWindow={onEditReset}
                                        response={updateReorderInfo}
                                      />
                                      <ModalBody className="mt-0 pt-0">
                                        <AddReorderingRules onReset={onEditReset} isEdit={isEdit} reOrderingRule={reOrderingRule} />
                                      </ModalBody>
                                    </Modal>
                                  </span>
                                </CardTitle>
                              </Card>
                            </Col>
                          </Row>
                          {reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.loading ? (
                            <Loader />
                          ) : reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.err ? (
                            <ErrorContent errorTxt={reOrderingRuleDetailsInfo.err} />
                          ) : (<ReOrderingRulesDetails />)}
                        </div>
                      ) : (
                        <Card className={collapse ? 'filter-margin-right negative-margin-left-15px p-2 mb-2 h-100 bg-lightblue' : 'p-2 mb-2 h-100 bg-lightblue'}>
                          <CardBody className="bg-color-white p-1 m-0">
                            <Row className="p-2">
                              <Col md="8" xs="12" sm="8" lg="8">
                                <div className="content-inline">
                                  <span className="p-0 mr-2 font-weight-800 font-medium">
                                    Reordering Rules :
                                    {count}
                                  </span>
                                  {(checkItems) && checkItems.map((st) => (
                                    <p key={st.id} className="mr-2 content-inline">
                                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                                        {st.label}
                                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleProductsClose(st.id)} size="sm" icon={faTimesCircle} />
                                      </Badge>
                                    </p>
                                  ))}
                                  {(customFilters) && customFilters.map((cf) => (
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
                                        {(cf.type === 'customdate') && (
                                          <span>
                                            {' - '}
                                            &quot;
                                            {getLocalDate(cf.start)}
                                            {' - '}
                                            {getLocalDate(cf.end)}
                                            &quot;
                                          </span>
                                        )}
                                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                                      </Badge>
                                    </p>
                                  ))}
                                </div>
                              </Col>
                              <Col md="4" xs="12" sm="4" lg="4">
                                <div className="float-right">
                                  <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                                  <SearchList formFields={customDataJson.searchFields} searchHandleSubmit={handleSearchFilter} />
                                  <CreateList name="Add Reordering Rules" showCreateModal={onAddReOrderRule} />
                                  <Modal size={addReorderInfo && addReorderInfo.data ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={isAddReorder}>
                                    <ModalHeaderComponent
                                      title="Add Reordering Rules"
                                      imagePath={false}
                                      closeModalWindow={onAddReset}
                                      response={addReorderInfo}
                                    />
                                    <ModalBody className="mt-0 pt-0">
                                      <AddReorderingRules onReset={onAddReset} product={product} />
                                    </ModalBody>
                                  </Modal>
                                  <AddColumns columns={customDataJson.tableColumns} handleColumnChange={handleColumnChange} columnFields={columnsList} />
                                  <ExportList response={reOrderingRulesInfo && reOrderingRulesInfo.data && reOrderingRulesInfo.data.length > 0} />
                                  <Popover placement="bottom" isOpen={filterInitailValues.download} target="Export">
                                    <PopoverHeader>
                                      Export
                                      <img
                                        src={closeCircleIcon}
                                        aria-hidden="true"
                                        className="cursor-pointer mr-1 mt-1 float-right"
                                        onClick={() => dispatch(setInitialValues(false, false, false, false))}
                                        alt="close"
                                      />
                                    </PopoverHeader>
                                    <PopoverBody><DataExport afterReset={() => dispatch(setInitialValues(false, false, false, false))} fields={columnsList} productId={id} /></PopoverBody>
                                  </Popover>
                                </div>
                              </Col>
                            </Row>
                            <Table responsive>
                              <thead className="bg-gray-light">
                                <tr>
                                  <th>
                                    <div className="checkbox">
                                      <Input
                                        type="checkbox"
                                        value="all"
                                        className="m-0 position-relative"
                                        name="checkall"
                                        id="checkboxtkhead"
                                        checked={isAllChecked}
                                        onChange={handleTableCellAllChange}
                                      />
                                      <Label htmlFor="checkboxtkhead" />
                                    </div>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                      Name
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('product_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                      Product
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('location_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                      Location
                                    </span>
                                  </th>
                                  <th className="p-2 min-width-160">
                                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('warehouse_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                      Warehouse
                                    </span>
                                  </th>
                                  {/* <th className="p-2 min-width-160">
                                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('qty_multiple'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                      Quantity Multiple
                                    </span>
                                  </th> */}
                                  {columnsList.some((selectedValue) => selectedValue.includes('product_min_qty')) && (
                                    <th className="p-2 min-width-160">
                                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('product_min_qty'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                        Reorder Level
                                      </span>
                                    </th>
                                  )}
                                  {columnsList.some((selectedValue) => selectedValue.includes('product_max_qty')) && (
                                    <th className="p-2 min-width-160">
                                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('product_max_qty'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                        Reorder Quantity
                                      </span>
                                    </th>
                                  )}
                                  {columnsList.some((selectedValue) => selectedValue.includes('product_uom')) && (
                                    <th className="p-2 min-width-160">
                                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('product_uom'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                        Unit Of Measure
                                      </span>
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {reOrderingRulesInfo && reOrderingRulesInfo.data && reOrderingRulesInfo.data.length > 0 && (
                                  reOrderingRulesInfo.data.map((rule, index) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <tr key={index}>
                                      <td className="w-5">
                                        <div className="checkbox">
                                          <Input
                                            type="checkbox"
                                            value={rule.id}
                                            id={`checkboxtk${index}`}
                                            className="ml-0"
                                            name={rule.name}
                                            checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(rule.id))}
                                            onChange={handleTableCellChange}
                                          />
                                          <Label htmlFor={`checkboxtk${index}`} />
                                        </div>
                                      </td>
                                      <td className="w-15 cursor-pointer" onClick={() => setReOrderingRule(rule.id)} aria-hidden>
                                        <span className="font-weight-400 d-inline-block">
                                          {rule.name ? rule.name : getDefaultNoValue(rule.name)}
                                        </span>
                                      </td>
                                      <td className="w-15">
                                        <span className="font-weight-400 d-inline-block">
                                          {rule.product_id && rule.product_id.length ? rule.product_id[1] : getDefaultNoValue(rule.product_id)}
                                        </span>
                                      </td>
                                      <td className="w-15">
                                        <span className="font-weight-400 d-inline-block">
                                          {rule.location_id && rule.location_id.length ? rule.location_id[1] : getDefaultNoValue(rule.location_id)}
                                        </span>
                                      </td>
                                      <td className="w-15">
                                        <span className="font-weight-400 d-inline-block">
                                          {rule.warehouse_id && rule.warehouse_id.length ? rule.warehouse_id[1] : getDefaultNoValue(rule.warehouse_id)}
                                        </span>
                                      </td>
                                      {/* <td className="w-15">
                                        <span className="font-weight-400 d-inline-block">
                                          {rule.qty_multiple ? rule.qty_multiple : getDefaultNoValue(rule.qty_multiple)}
                                        </span>
                                      </td> */}
                                      {columnsList.some((selectedValue) => selectedValue.includes('product_min_qty')) && (
                                        <td className="w-15">
                                          <span className="font-weight-400 d-inline-block">
                                            {rule.product_min_qty ? rule.product_min_qty : getDefaultNoValue(rule.product_min_qty)}
                                          </span>
                                        </td>
                                      )}
                                      {columnsList.some((selectedValue) => selectedValue.includes('product_max_qty')) && (
                                        <td className="w-15">
                                          <span className="font-weight-400 d-inline-block">
                                            {rule.product_max_qty ? rule.product_max_qty : getDefaultNoValue(rule.product_max_qty)}
                                          </span>
                                        </td>
                                      )}
                                      {columnsList.some((selectedValue) => selectedValue.includes('product_uom')) && (
                                        <td className="w-15">
                                          <span className="font-weight-400 d-inline-block">
                                            {rule.product_uom && rule.product_uom.length ? rule.product_uom[1] : getDefaultNoValue(rule.product_uom)}
                                          </span>
                                        </td>
                                      )}
                                    </tr>
                                  )))}
                              </tbody>
                            </Table>
                            {reOrderingRulesInfo && reOrderingRulesInfo.err ? (
                              <ErrorContent errorTxt={generateErrorMessage(reOrderingRulesInfo)} />
                            ) : ''}
                            {loading ? (
                              <Loader />
                            ) : ''}
                            {loading || pages === 0 ? (<span />) : (
                              <div className={`${classes.root} float-right`}>
                                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      )}
                    </Col>
                  </Row>
                </>
              </CardBody>
            </div>
          </Col>
        </Row>
      ) : ''}
    </>
  );
};
ReOrderingRules.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
};
export default ReOrderingRules;