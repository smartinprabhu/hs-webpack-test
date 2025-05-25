/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import {
  Badge, Card, CardTitle, Collapse, CardBody, Col, Input, Label, Row, Table, UncontrolledTooltip,
  Modal, ModalBody, Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import TableListFormat from '@shared/tableListFormat';
import SearchList from '@shared/listViewFilters/search';
import AddColumns from '@shared/listViewFilters/columns';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ExportList from '@shared/listViewFilters/export';
import DetailViewFormat from '@shared/detailViewFormat';
import DetailNavigation from '@shared/navigation';

import filterIcon from '@images/filter.png';
import collapseIcon from '@images/collapse.png';
import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';

import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import {
  getPagesCountV2, extractTextObject, numToFloat, getArrayFromValuesByItem,
  queryGenerator, getAllowedCompanies, getColumnArrayById, getLocalDate,
  getDefaultNoValue, truncate,
} from '../../util/appUtils';
import {
  getValuationsCount, getValuationsList, setInitialValues,
  getStockHistoryDetail, setInventoryDate,
} from '../inventoryService';
import { getProductDetails, getCompanyPrice } from '../../purchase/purchaseService';
import AddHistory from './addHistory';
import DataExport from './valuationDataExport/dataExport';
import ProductDetails from '../../purchase/products/productDetails';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const InventoryValuation = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [statusValue, setStatusValue] = useState([]);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [columns, setColumns] = useState(customData && customData.listFieldsShows ? customData.listFieldsShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [filtersIcon, setFilterIcon] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [scrollDataList, setScrollData] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);
  const [isButtonHover, setButtonHover] = useState(false);

  const classes = useStyles();

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    valuationCount, valuationsList, valuationCountLoading,
    createStockHistory, stockHistoryDetail, filterInitailValues,
    currentInventoryDate,
  } = useSelector((state) => state.inventory);

  const { productDetailsInfo } = useSelector((state) => state.purchase);

  let contextValue = false;
  if (stockHistoryDetail && stockHistoryDetail.data && stockHistoryDetail.data.length) {
    contextValue = {
      active_id: stockHistoryDetail.data[0].id,
      active_ids: [stockHistoryDetail.data[0].id],
      active_model: appModels.STOCKHISTORY,
      company_owned: true,
      create: false,
      default_compute_at_date: stockHistoryDetail.data[0].compute_at_date,
      edit: false,
      to_date: stockHistoryDetail.data[0].date,
      valuation: true,
    };
  }
  useEffect(() => {
    if (currentInventoryDate && !currentInventoryDate.data) {
      setAddModal(true);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = customFilters ? queryGenerator(customFilters) : '';
      dispatch(getValuationsCount(companies, appModels.PRODUCT, statusValue, customFiltersList, contextValue, currentInventoryDate));
    }
  }, [userInfo, statusValue, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = customFilters ? queryGenerator(customFilters) : '';
      dispatch(getValuationsList(companies, appModels.PRODUCT, limit, offset, statusValue, customFiltersList, sortBy, sortField, contextValue, currentInventoryDate));
    }
  }, [userInfo, offset, sortField, sortBy, statusValue, customFilters, scrollTop]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId === 0) {
      const customFiltersList = customFilters ? queryGenerator(customFilters) : '';
      dispatch(getValuationsList(companies, appModels.PRODUCT, limit, offset, statusValue, customFiltersList, sortBy, sortField, contextValue, currentInventoryDate));
    }
  }, [viewId]);

  useEffect(() => {
    if (currentInventoryDate && !currentInventoryDate.data && createStockHistory && createStockHistory.data && createStockHistory.data.length) {
      dispatch(getStockHistoryDetail(createStockHistory.data[0], appModels.STOCKHISTORY));
      dispatch(setInventoryDate(false));
    }
  }, [createStockHistory]);

  useEffect(() => {
    if (stockHistoryDetail && stockHistoryDetail.data && stockHistoryDetail.data.length) {
      const customFiltersList = customFilters ? queryGenerator(customFilters) : '';
      const context = {
        active_id: stockHistoryDetail.data[0].id,
        active_ids: [stockHistoryDetail.data[0].id],
        active_model: appModels.STOCKHISTORY,
        company_owned: true,
        create: false,
        default_compute_at_date: stockHistoryDetail.data[0].compute_at_date,
        edit: false,
        to_date: stockHistoryDetail.data[0].date,
        valuation: true,
      };
      dispatch(getValuationsCount(companies, appModels.PRODUCT, statusValue, customFiltersList, context, currentInventoryDate));
      dispatch(getValuationsList(companies, appModels.PRODUCT, limit, offset, statusValue, customFiltersList, sortBy, sortField, context, currentInventoryDate));
    }
  }, [stockHistoryDetail]);

  useEffect(() => {
    if (isAllChecked && valuationsList && valuationsList.data) {
      const data = valuationsList && valuationsList.data ? valuationsList.data : [];
      setCheckRows(getColumnArrayById(data, 'id'));
    }
  }, [offset, valuationsList]);

  useEffect(() => {
    if (!viewId) {
      setScrollData([]);
    }
  }, [viewId]);

  useEffect(() => {
    if (viewId) {
      dispatch(getProductDetails(appModels.PRODUCT, viewId));
    }
  }, [viewId]);

  useEffect(() => {
    if (productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length) {
      const strProduct = `product.product,${productDetailsInfo.data[0].id}`;
      const parentId = userInfo.data && userInfo.data.company && userInfo.data.company.parent_id && userInfo.data.company.parent_id.id ? userInfo.data.company.parent_id.id : false;
      const companyId = userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : false;
      let cids = [companyId];
      if (parentId) {
        cids = [parentId, companyId];
      }
      dispatch(getCompanyPrice(productDetailsInfo.data[0].id));
    }
  }, [productDetailsInfo]);

  useEffect(() => {
    if (valuationsList && valuationsList.data && viewId) {
      const arr = [...scrollDataList, ...valuationsList.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [valuationsList, viewId]);

  const totalDataCount = valuationCount && valuationCount.length ? valuationCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetData = (index - 1) * limit;
    setOffset(offsetData);
    setPage(index);
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    setOffset(0); setPage(0);
  };

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setStatusValue(value);
    } else {
      setStatusValue('');
    }
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = customFilters || [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setCustomFilters([...customFilters, ...customFiltersData]);
    } else {
      const oldCustomFilters = customFilters || [];
      const customFiltersData = [...oldCustomFilters, ...customFilters.filter((item) => item !== value)];
      setCustomFilters([...customFilters, ...customFiltersData]);
    }
    setOffset(0); setPage(0);
  };

  const handleCustomDateChange = (start, end) => {
    const value = 'Custom';
    const filters = [{
      key: value, value, label: value, type: 'customdate', start, end,
    }];
    if (start && end) {
      const oldCustomFilters = customFilters || [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setCustomFilters([...customFilters, ...customFiltersData]);
    } else {
      const oldCustomFilters = customFilters || [];
      const customFiltersData = [...oldCustomFilters, ...customFilters.filter((item) => item !== value)];
      setCustomFilters([...customFilters, ...customFiltersData]);
    }
    setOffset(0); setPage(0);
  };

  const handleTableCellChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => parseInt(item) !== parseInt(value)));
    }
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const scrollListCount = scrollDataList && scrollDataList.length ? scrollDataList.length : 0;
    if ((valuationsList && !valuationsList.loading) && bottom && (totalDataCount !== scrollListCount) && (totalDataCount >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const data = valuationsList && valuationsList.data ? valuationsList.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = valuationsList && valuationsList.data ? valuationsList.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const onAddReset = () => {
    setAddModal(false);
  };

  const showDetailsView = (id) => {
    dispatch(setInitialValues(false, false, false, false));
    setViewId(id);
  };

  const handleResetClick = () => {
    setCustomFilters([]);
    setStatusValue('');
    setOffset(0);
    setPage(0);
  };

  function searchHandleSubmit(values, { resetForm }) {
    const sVal = values.fieldValue ? values.fieldValue.trim() : '';
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(sVal), label: values.fieldName.label, type: 'text',
    }];
    setCustomFilters([...customFilters, ...filters]);
    resetForm({ values: '' });
    setOffset(0); setPage(0);
  }

  const dateFilters = (customFilters && customFilters.length > 0) ? customFilters : [];
  const loading = (userInfo && userInfo.loading) || (valuationsList && valuationsList.loading) || (valuationCountLoading)
    || (createStockHistory && createStockHistory.loading) || (createStockHistory && createStockHistory.loading);

  const detailName = productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length ? getDefaultNoValue(productDetailsInfo.data[0].name) : '';

  return (

    <Row className="pt-2">
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2' : 'pt-2 pl-2 pr-2'}>
        {collapse ? (
          <>
            <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer filter-left ml-4" id="filters" />
            <UncontrolledTooltip target="filters" placement="right">
              Filters
            </UncontrolledTooltip>
          </>
        ) : (
          <Card className="p-1 h-100 bg-lightblue valuation-filter" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
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
            {viewId
              ? (
                <>
                  <div className="mr-2 ml-2 mt-2">
                    {statusValue && statusValue === 'yes' && (
                      <p className="mr-2 content-inline">
                        <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                          Active
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => setStatusValue('')} size="sm" icon={faTimesCircle} />
                        </Badge>
                      </p>
                    )}
                    {statusValue && statusValue === 'no' && (
                      <p className="mr-2 content-inline">
                        <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                          Inactive
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => setStatusValue('')} size="sm" icon={faTimesCircle} />
                        </Badge>
                      </p>
                    )}
                    {statusValue && statusValue === 'all' && (
                      <p className="mr-2 content-inline">
                        <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                          All
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => setStatusValue('')} size="sm" icon={faTimesCircle} />
                        </Badge>
                      </p>
                    )}
                    {customFilters && customFilters.map((cf) => (
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
                  {((statusValue && statusValue.length) || (customFilters && customFilters.length > 0)) && (
                    <div aria-hidden="true" className="cursor-pointer text-info text-right mr-2 font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                  )}
                  {((statusValue && statusValue.length) || (customFilters && customFilters.length > 0)) && (
                    <hr className="mt-0 pt-1 mb-2 ml-2 mr-2" />
                  )}
                  <div onScroll={onScroll} className={scrollDataList && scrollDataList.length > 9 ? 'height-100 table-scrollable thin-scrollbar' : ''}>
                    {(scrollDataList) && scrollDataList.map((sl) => (
                      <Card
                        key={sl.id}
                        onClick={() => setViewId(sl.id)}
                        className={(sl.id === viewId) ? 'mb-2 mr-2 ml-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mr-2 ml-2  mb-2'}
                      >
                        <CardBody className="p-2">
                          <Row>
                            <Col sm="12" md="12" lg="12" xs="12">
                              <span className="font-weight-700 mb-1 font-medium" title={sl.name}>{truncate(sl.display_name, 20)}</span>
                            </Col>
                          </Row>
                          <p className="font-weight-400 ml-1 mb-0 font-tiny">{numToFloat(sl.qty_at_date)}</p>
                          <p className="font-weight-600 ml-1 mb-0 font-tiny">{getDefaultNoValue(extractTextObject(sl.company_id))}</p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                  <DetailViewFormat detailResponse={valuationsList} />

                </>
              )
              : (
                <CardBody className="ml-2 p-0 mt-2 h-100 position-relative scrollable-list thin-scrollbar">
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
                      <span className="mb-1 d-block font-weight-500">
                        <div className="checkbox">
                          <Input
                            type="checkbox"
                            id="checkboxfilter3"
                            name="active"
                            value="all"
                            checked={statusValue === 'all'}
                            onChange={handleCheckboxChange}
                          />
                          <Label htmlFor="checkboxfilter3">
                            <span>All</span>
                          </Label>
                          {' '}
                        </div>
                        <div className="checkbox">
                          <Input
                            type="checkbox"
                            id="checkboxfilter1"
                            name="active"
                            value="yes"
                            checked={statusValue === 'yes'}
                            onChange={handleCheckboxChange}
                          />
                          <Label htmlFor="checkboxfilter1">
                            <span>Active</span>
                          </Label>
                          {' '}
                        </div>
                        <div className="checkbox">
                          <Input
                            type="checkbox"
                            id="checkboxfilter2"
                            name="active"
                            value="no"
                            checked={statusValue === 'no'}
                            onChange={handleCheckboxChange}
                          />
                          <Label htmlFor="checkboxfilter2">
                            <span>Inactive</span>
                          </Label>
                          {' '}
                        </div>
                      </span>
                    </div>
                  </Collapse>
                  <hr className="mt-2" />
                  {((statusValue && statusValue.length) || (customFilters && customFilters.length > 0)) && (
                    <div
                      aria-hidden="true"
                      className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800"
                      onClick={() => handleResetClick()}
                      onKeyDown={() => handleResetClick()}
                    >
                      Reset Filters
                    </div>
                  )}
                </CardBody>
              )}
          </Card>
        )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1' : 'pl-1 pt-2 pr-2'}>
        {viewId
          ? (
            <div className={collapse ? 'filter-margin-right card h-100' : 'card h-100 bg-lightblue'}>
              <Row>
                <Col sm="12" md="12" lg="12" xs="12">
                  <Card className="bg-lightblue border-0 p-2 h-100 ">
                    <CardTitle className="mb-0">
                      <DetailNavigation
                        overviewName=""
                        overviewPath=""
                        listName="Inventory Valuation List"
                        detailName={detailName}
                        afterList={() => { setOffset(offset); setPage(page); setViewId(0); setOffsetValue(0); }}
                      />
                      <span className="float-right">
                        <Button
                           variant="contained"
                          size="sm"
                          onClick={() => { setOffset(offset); setPage(page); setViewId(0); setOffsetValue(0); }}
                          onMouseLeave={() => setButtonHover(false)}
                          onMouseEnter={() => setButtonHover(true)}
                          className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                        >
                          <img src={isButtonHover ? closeCircleWhiteIcon : closeCircleIcon} className="mr-2 pb-2px" height="12" width="12" alt="close" />
                          <span className="mr-2">Close</span>
                        </Button>
                      </span>
                    </CardTitle>
                    <hr className="mt-1 mb-1 border-color-grey" />
                  </Card>
                </Col>
              </Row>
              {productDetailsInfo && productDetailsInfo.loading ? (
                <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                  <Loader />
                </div>
              ) : productDetailsInfo && productDetailsInfo.err ? (<ErrorContent errorTxt={productDetailsInfo} />
              ) : (<ProductDetails isEdit={false} />)}
            </div>
          )
          : (
            <Card className={collapse ? 'filter-margin-right p-2 mb-2 h-100 bg-lightblue' : 'p-2 mb-2 h-100 bg-lightblue inventoryvaluation-card'}>
              <CardBody className="bg-color-white p-1 m-0">
                <Row className="p-2">
                  <Col md="8" xs="12" sm="8" lg="8">
                    <div className="content-inline">
                      <span className="p-0 mr-2 font-weight-800 font-medium">
                        Inventory Valuation List :
                        {'  '}
                        {totalDataCount}
                      </span>
                      {statusValue && statusValue === 'yes' && (
                        <p className="mr-2 content-inline">
                          <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                            Active
                            <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => setStatusValue('')} size="sm" icon={faTimesCircle} />
                          </Badge>
                        </p>
                      )}
                      {statusValue && statusValue === 'no' && (
                        <p className="mr-2 content-inline">
                          <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                            Inactive
                            <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => setStatusValue('')} size="sm" icon={faTimesCircle} />
                          </Badge>
                        </p>
                      )}
                      {statusValue && statusValue === 'all' && (
                        <p className="mr-2 content-inline">
                          <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                            All
                            <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => setStatusValue('')} size="sm" icon={faTimesCircle} />
                          </Badge>
                        </p>
                      )}
                      {customFilters && customFilters.map((cf) => (
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
                      <SearchList formFields={filtersFields.fields} searchHandleSubmit={searchHandleSubmit} />
                      <AddColumns columns={customData.tableColumns} handleColumnChange={handleColumnChange} columnFields={columns} />
                      <ExportList response={(valuationsList && valuationsList.data && valuationsList.data.length > 0)} />
                    </div>
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
                      <PopoverBody>
                        <DataExport
                          afterReset={() => dispatch(setInitialValues(false, false, false, false))}
                          fields={columns}
                          rows={checkedRows}
                          statusValue={statusValue}
                          customFilters={customFilters}
                          context={contextValue}
                        />
                      </PopoverBody>
                    </Popover>
                  </Col>
                </Row>
                <div className="thin-scrollbar">
                  {(valuationsList && valuationsList.data && valuationsList.data.length > 0) && (

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
                            <span>
                              Name
                            </span>
                          </th>
                          <th className="p-2 min-width-160">
                            <span>
                              Quantity
                            </span>
                          </th>
                          <th className="p-2 min-width-100">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('uom_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              UOM
                            </span>
                          </th>
                          {columns.some((selectedValue) => selectedValue.includes('stock_value')) && (
                            <th className="p-2 min-width-100">
                              <span>
                                Value
                              </span>
                            </th>
                          )}
                          {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                            <th className="p-2 min-width-100">
                              <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                Company
                              </span>
                            </th>
                          )}
                          {columns.some((selectedValue) => selectedValue.includes('active')) && (
                            <th className="p-2 min-width-100">
                              <span>
                                Status
                              </span>
                            </th>
                          )}
                          {columns.some((selectedValue) => selectedValue.includes('price')) && (
                            <th className="p-2 min-width-100">
                              <span>
                                Price
                              </span>
                            </th>
                          )}
                          {columns.some((selectedValue) => selectedValue.includes('weight')) && (
                            <th className="p-2 min-width-100">
                              <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('weight'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                Weight
                              </span>
                            </th>
                          )}
                          {columns.some((selectedValue) => selectedValue.includes('volume')) && (
                            <th className="p-2 min-width-100">
                              <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('volume'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                Volume
                              </span>
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="table-body">

                        {valuationsList.data.map((pt) => (

                          <tr key={pt.id}>
                            <td className="w-5">
                              <div className="checkbox">
                                <Input
                                  type="checkbox"
                                  value={pt.id}
                                  id={`checkboxtk${pt.id}`}
                                  className="ml-0"
                                  name={pt.name}
                                  checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(pt.id))}
                                  onChange={handleTableCellChange}
                                />
                                <Label htmlFor={`checkboxtk${pt.id}`} />
                              </div>
                            </td>
                            <td aria-hidden="true" className="w-20 cursor-pointer" onClick={() => showDetailsView(pt.id)}>
                              <span className="font-weight-600">{pt.display_name}</span>
                            </td>
                            <td className="w-15"><span className="font-weight-400 d-inline-block">{numToFloat(pt.qty_at_date)}</span></td>
                            <td className="w-15">
                              <span className="font-weight-400 d-inline-block">
                                {extractTextObject(pt.uom_id)}
                              </span>
                            </td>
                            {columns.some((selectedValue) => selectedValue.includes('stock_value')) && (
                              <td className="w-15"><span className="font-weight-400 d-inline-block">{numToFloat(pt.stock_value)}</span></td>
                            )}
                            {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                              <td className="w-15">
                                <span className="font-weight-400 d-inline-block">
                                  {extractTextObject(pt.company_id)}
                                </span>
                              </td>
                            )}
                            {columns.some((selectedValue) => selectedValue.includes('active')) && (
                              <td className="w-15">
                                <span className="font-weight-600 d-inline-block">
                                  <span className={pt.active ? 'text-info' : 'text-danger'}>{pt.active ? 'Active' : 'Inactive'}</span>
                                </span>
                              </td>
                            )}
                            {columns.some((selectedValue) => selectedValue.includes('price')) && (
                              <td className="w-15"><span className="font-weight-400 d-inline-block">{numToFloat(pt.price)}</span></td>
                            )}
                            {columns.some((selectedValue) => selectedValue.includes('weight')) && (
                              <td className="w-15"><span className="font-weight-400 d-inline-block">{pt.weight ? `${pt.weight} lb` : '0 lb'}</span></td>
                            )}
                            {columns.some((selectedValue) => selectedValue.includes('volume')) && (
                              <td className="w-15"><span className="font-weight-400 d-inline-block">{pt.volume ? pt.volume : '0'}</span></td>
                            )}
                          </tr>

                        ))}
                      </tbody>
                    </Table>

                  )}
                  {loading || pages === 0 ? (<span />) : (
                    <div className={`${classes.root} float-right`}>
                      <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                    </div>
                  )}

                  <TableListFormat
                    userResponse={userInfo}
                    listResponse={valuationsList}
                    countLoad={valuationCountLoading || (createStockHistory && createStockHistory.loading) || (createStockHistory && createStockHistory.loading)}
                  />
                  <Modal size="md" className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={addModal}>
                    <ModalHeaderComponent title="Inventory Valuation" imagePath={false} closeModalWindow={() => onAddReset()} response={createStockHistory} />
                    <ModalBody className="mt-0 pt-0">
                      <AddHistory type="valuation" afterReset={() => onAddReset()} />
                    </ModalBody>
                  </Modal>
                </div>
              </CardBody>
            </Card>
          )}
      </Col>
    </Row>
  );
};

export default InventoryValuation;
