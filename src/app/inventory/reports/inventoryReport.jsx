/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import {
  CardTitle, Badge, Card, CardBody, Col, Input, Label, Row, Table,
  Modal, ModalBody, Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import ListDateFilters from '@shared/listViewFilters/dateFilters';
import DetailViewFormat from '@shared/detailViewFormat';
import DetailNavigation from '@shared/navigation';
import TableListFormat from '@shared/tableListFormat';
import SearchList from '@shared/listViewFilters/search';
import AddColumns from '@shared/listViewFilters/columns';
import CardTitleCustom from '@shared/sideTools/cardTitleCustom';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ExportList from '@shared/listViewFilters/export';

import CollapseImg from '@shared/sideTools/collapseImg';
import CollapseItemCustom from '@shared/sideTools/collapseItemCustom';
import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';

import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import {
  getPagesCountV2, extractTextObject, numToFloat,
  queryGeneratorV1, getAllowedCompanies, getColumnArrayById,
  isArrayValueExists, getCompanyTimezoneDate, getDefaultNoValue,
  getArrayFromValuesByItem,
  truncate, getLocalDate,
} from '../../util/appUtils';
import {
  getInventoryReportsCount, getInventoryReportsList, setInitialValues,
  getInventoryReportsFilters, getInventoryReport, getStockHistoryDetail,
  setCurrentTab, setInventoryDate,
} from '../inventoryService';
import InventoryReportDetail from './inventoryReportDetail/inventoryReportDetail';
import AddHistory from './addHistory';
import DataExport from './inventoryReportDataExport/dataExport';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const InventoryReport = () => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [columns, setColumns] = useState(customData && customData.listFieldsIRShows ? customData.listFieldsIRShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);

  const [filtersIcon, setFilterIcon] = useState(false);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [codeCollapse, setCodeCollapse] = useState(false);
  const [scrollDataList, setScrollData] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);

  const [addModal, setAddModal] = useState(true);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    invReportCount, invReportListInfo, invReportCountLoading,
    invReportFilters, invReportDetails, createStockHistory, stockHistoryDetail,
    filterInitailValues,
  } = useSelector((state) => state.inventory);

  const customFiltersQuery = invReportFilters && invReportFilters.customFilters ? queryGeneratorV1(invReportFilters.customFilters) : '';
  let context = false;
  if (stockHistoryDetail && stockHistoryDetail.data && stockHistoryDetail.data.length) {
    context = {
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
    if (createStockHistory && createStockHistory.data && createStockHistory.data.length) {
      dispatch(getStockHistoryDetail(createStockHistory.data[0], appModels.STOCKHISTORY));
    }
  }, [createStockHistory]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getInventoryReportsCount(companies, appModels.STOCKQUANT, customFiltersQuery, context));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getInventoryReportsList(companies, appModels.STOCKQUANT, limit, offset, customFiltersQuery, sortBy, sortField, context));
    }
  }, [userInfo, offset, sortField, sortBy, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      dispatch(getInventoryReportsList(companies, appModels.STOCKQUANT, limit, offsetValue, customFiltersQuery, sortBy, sortField, context));
    }
  }, [userInfo, offsetValue, sortField, sortBy, customFilters, scrollTop]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId === 0) {
      dispatch(getInventoryReportsList(companies, appModels.STOCKQUANT, limit, offset, customFiltersQuery, sortBy, sortField, context));
    }
  }, [viewId]);

  useEffect(() => {
    if (userInfo && userInfo.data && stockHistoryDetail && stockHistoryDetail.data && stockHistoryDetail.data.length) {
      dispatch(getInventoryReportsCount(companies, appModels.STOCKQUANT, customFiltersQuery, context));
      dispatch(getInventoryReportsList(companies, appModels.STOCKQUANT, limit, offset, customFiltersQuery, sortBy, sortField, context));
      const type = stockHistoryDetail.data[0].compute_at_date;
      if (type) {
        dispatch(setInventoryDate(stockHistoryDetail.data[0].date));
        dispatch(setCurrentTab('Inventory Valuation'));
      }
    }
  }, [stockHistoryDetail]);

  useEffect(() => {
    if (invReportFilters && invReportFilters.customFilters) {
      setCustomFilters(invReportFilters.customFilters);
      const vid = isArrayValueExists(invReportFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [invReportFilters]);

  useEffect(() => {
    if (!viewId) {
      setScrollData([]);
    }
  }, [viewId]);

  useEffect(() => {
    if (viewId) {
      dispatch(getInventoryReport(viewId, appModels.STOCKQUANT));
    }
  }, [viewId]);

  useEffect(() => {
    if (invReportListInfo && invReportListInfo.data && viewId) {
      const arr = [...scrollDataList, ...invReportListInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [invReportListInfo, viewId]);

  const totalDataCount = invReportCount && invReportCount.length ? invReportCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
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

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const data = invReportListInfo && invReportListInfo.data ? invReportListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = invReportListInfo && invReportListInfo.data ? invReportListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const scrollListCount = scrollDataList && scrollDataList.length ? scrollDataList.length : 0;
    if ((invReportListInfo && !invReportListInfo.loading) && bottom && (totalDataCount !== scrollListCount) && (totalDataCount >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = invReportFilters && invReportFilters.customFilters ? invReportFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getInventoryReportsFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomDateChange = (start, end) => {
    const value = 'Custom';
    const filters = [{
      key: value, value, label: value, type: 'customdate', start, end,
    }];
    if (start && end) {
      const oldCustomFilters = invReportFilters && invReportFilters.customFilters ? invReportFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getInventoryReportsFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (value, customValue) => {
    if (value) {
      setCustomFilters(customFilters.filter((item) => item.value !== value));
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getInventoryReportsFilters(customFiltersList));
    }
    if (value === 0) {
      setCustomFilters(customFilters.filter((item) => item.custom_value !== customValue));
      const customFiltersList = customFilters.filter((item) => item.custom_value !== customValue);
      dispatch(getInventoryReportsFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'location_id.usage', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getInventoryReportsFilters(customFiltersList));
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getInventoryReportsFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCodeCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      let filters = [{
        key: 'quantity', value: 0, label: name, type: 'numless', custom_value: value,
      }];
      if (value === 'Negative_Stock') {
        filters = [{
          key: 'quantity', value: 0, label: name, type: 'numgreat', custom_value: value,
        }];
      }
      if (value === 'Positive_Stock') {
        filters = [{
          key: 'quantity', value: 0, label: name, type: 'numless', custom_value: value,
        }];
      }
      if (value === 'Reservations') {
        filters = [{
          key: 'reserved_quantity', value: 0, label: name, type: 'numless', custom_value: value,
        }];
      }
      const existsStocks = customFilters.filter((item) => !item.custom_value);
      const customFiltersList = [...existsStocks, ...filters];
      dispatch(getInventoryReportsFilters(customFiltersList));
    } else {
      const customFiltersList = customFilters.filter((item) => item.custom_value !== value);
      dispatch(getInventoryReportsFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCustomFilters([]);
    dispatch(getInventoryReportsFilters([]));
    setOffset(0);
    setPage(0);
  };

  const showDetailsView = (id) => {
    dispatch(setInitialValues(false, false, false, false));
    setViewId(id);
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const sVal = values.fieldValue ? values.fieldValue.trim() : '';
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(sVal), label: values.fieldName.label, type: 'text',
    }];
    const customFilters1 = [...customFilters, ...filters];
    resetForm({ values: '' });
    dispatch(getInventoryReportsFilters(customFilters1));
    setOffset(0);
    setPage(0);
  };

  const onAddReset = () => {
    setAddModal(false);
  };

  const stateValuesList = (invReportFilters && invReportFilters.customFilters && invReportFilters.customFilters.length > 0)
    ? invReportFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const compareValuesList = (invReportFilters && invReportFilters.customFilters && invReportFilters.customFilters.length > 0)
    ? invReportFilters.customFilters.filter((item) => (item.type === 'numless' || item.type === 'numgreat')) : [];
  const compareValues = getColumnArrayById(compareValuesList, 'custom_value');

  const dateFilters = (invReportFilters && invReportFilters.customFilters && invReportFilters.customFilters.length > 0) ? invReportFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (invReportListInfo && invReportListInfo.loading) || (invReportCountLoading);
  const detailName = invReportDetails && invReportDetails.data && invReportDetails.data.length ? getDefaultNoValue(extractTextObject(invReportDetails.data[0].product_id)) : '';

  return (

    <Row className="pt-2 report-view">
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2' : 'pt-2 pl-2 pr-2'}>
        {collapse
          ? (
            <CollapseImg onCollapse={() => setCollapse(!collapse)} />
          )
          : (
            <Card className="p-1 h-100 bg-lightblue report-filter" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
              <CardTitleCustom filtersIcon={filtersIcon} onCollapse={() => setCollapse(!collapse)} />
              {viewId
                ? (
                  <>
                    <div className="mr-2 ml-2 mt-2">
                      {customFilters && customFilters.map((cf) => (
                        <p key={cf.value} className="mr-2 content-inline">
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
                            <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf.custom_value)} size="sm" icon={faTimesCircle} />
                          </Badge>
                        </p>
                      ))}
                    </div>
                    {(customFilters && customFilters.length > 0) && (
                      <div aria-hidden="true" className="cursor-pointer text-info text-right mr-2 font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                    )}
                    {(customFilters && customFilters.length > 0) && (
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
                                <span
                                  className="font-weight-700 mb-1 font-medium"
                                  title={getDefaultNoValue(extractTextObject(sl.product_id))}
                                >
                                  {truncate(getDefaultNoValue(extractTextObject(sl.product_id)), 20)}
                                </span>
                              </Col>
                            </Row>
                            <p className="font-weight-400 ml-1 mb-0 font-tiny">{getDefaultNoValue(extractTextObject(sl.location_id))}</p>
                            <p className="font-weight-600 ml-1 mb-0 font-tiny">{getDefaultNoValue(extractTextObject(sl.company_id))}</p>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                    <DetailViewFormat detailResponse={invReportListInfo} />
                  </>
                )
                : (
                  <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
                    <CollapseItemCustom
                      title="LOCATION TYPE"
                      data={filtersFields && filtersFields.locationTypes ? filtersFields.locationTypes : []}
                      selectedValues={stateValues}
                      onCollapse={() => setStatusCollapse(!statusCollapse)}
                      isOpen={statusCollapse}
                      onCheckboxChange={handleStatusCheckboxChange}
                    />
                    <CollapseItemCustom
                      title="STOCK"
                      data={filtersFields && filtersFields.stockTypes ? filtersFields.stockTypes : []}
                      selectedValues={compareValues}
                      onCollapse={() => setCodeCollapse(!codeCollapse)}
                      isOpen={codeCollapse}
                      onCheckboxChange={handleCodeCheckboxChange}
                    />
                    {(customFilters && customFilters.length > 0) && (
                      <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                    )}
                  </CardBody>
                )}
            </Card>
          )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1 inventory-report' : 'inventory-report pl-1 pt-2 pr-2'}>
        {viewId
          ? (
            <div className={collapse ? 'filter-margin-right card h-100 ' : 'card h-100 bg-lightblue '}>
              <Row>
                <Col className="inventory-report" sm="12" md="12" lg="12" xs="12">
                  <Card className="bg-lightblue border-0 p-2 h-100">
                    <CardTitle className="mb-0">
                      <DetailNavigation
                        overviewName=""
                        overviewPath=""
                        listName="Inventory Report List"
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
              <InventoryReportDetail />
            </div>
          )
          : (
            <Card className={collapse ? 'filter-margin-right p-2 mb-2 h-100 bg-lightblue' : 'p-2 mb-2 h-100 bg-lightblue inventoryreport-card'}>
              <CardBody className="bg-color-white p-1 m-0">
                <Row className="p-2">
                  <Col md="8" xs="12" sm="8" lg="8">
                    <div className="content-inline">
                      <span className="p-0 mr-2 font-weight-800 font-medium">
                        Inventory Reports List :
                        {'  '}
                        {totalDataCount}
                      </span>
                      {customFilters && customFilters.map((cf) => (
                        <p key={cf.value} className="mr-2 content-inline">
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
                            <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf.custom_value)} size="sm" icon={faTimesCircle} />
                          </Badge>
                        </p>
                      ))}
                    </div>
                  </Col>
                  <Col md="4" xs="12" sm="4" lg="4">
                    <div className="float-right">
                      <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                      <SearchList formFields={filtersFields.fieldsIR} searchHandleSubmit={searchHandleSubmit} />
                      <AddColumns columns={customData.tableColumnsIR} handleColumnChange={handleColumnChange} columnFields={columns} />
                      <ExportList response={(invReportListInfo && invReportListInfo.data && invReportListInfo.data.length > 0)} />
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
                          context={context}
                        />
                      </PopoverBody>
                    </Popover>
                  </Col>
                </Row>
                <div className="thin-scrollbar">
                  {(invReportListInfo && invReportListInfo.data && invReportListInfo.data.length > 0) && (

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
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('product_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Product
                            </span>
                          </th>
                          <th className="p-2 min-width-200">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('location_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Location
                            </span>
                          </th>
                          <th className="p-2 min-width-200">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('reserved_quantity'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Reserved
                            </span>
                          </th>
                          <th className="p-2 min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('quantity'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Quantity
                            </span>
                          </th>
                          <th className="p-2 min-width-100">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Company
                            </span>
                          </th>
                          {columns.some((selectedValue) => selectedValue.includes('owner_id')) && (
                            <th className="p-2 min-width-100">
                              <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('owner_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                Owner
                              </span>
                            </th>
                          )}
                          {columns.some((selectedValue) => selectedValue.includes('product_uom_id')) && (
                            <th className="p-2 min-width-100">
                              <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('product_uom_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                UOM
                              </span>
                            </th>
                          )}
                          {columns.some((selectedValue) => selectedValue.includes('in_date')) && (
                            <th className="p-2 min-width-200">
                              <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('in_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                Incoming Date
                              </span>
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="table-body">

                        {invReportListInfo.data.map((pt) => (

                          <tr key={pt.id}>
                            <td className="w-5">
                              <div className="checkbox">
                                <Input
                                  type="checkbox"
                                  value={pt.id}
                                  id={`checkboxtk${pt.id}`}
                                  className="ml-0"
                                  name={pt.product_id}
                                  checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(pt.id))}
                                  onChange={handleTableCellChange}
                                />
                                <Label htmlFor={`checkboxtk${pt.id}`} />
                              </div>
                            </td>
                            <td aria-hidden="true" className="w-20 cursor-pointer" onClick={() => showDetailsView(pt.id)}>
                              <span className="font-weight-400 d-inline-block">
                                {getDefaultNoValue(extractTextObject(pt.product_id))}
                              </span>
                            </td>
                            <td className="w-15">
                              <span className="font-weight-400 d-inline-block">
                                {getDefaultNoValue(extractTextObject(pt.location_id))}
                              </span>
                            </td>
                            <td className="w-15">
                              <span className="font-weight-400 d-inline-block">
                                {numToFloat(pt.reserved_quantity)}
                              </span>
                            </td>
                            <td className="w-15">
                              <span className="font-weight-400 d-inline-block">
                                {numToFloat(pt.quantity)}
                              </span>
                            </td>
                            <td className="w-15">
                              <span className="font-weight-400 d-inline-block">
                                {getDefaultNoValue(extractTextObject(pt.company_id))}
                              </span>
                            </td>
                            {columns.some((selectedValue) => selectedValue.includes('owner_id')) && (
                              <td className="w-15"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(extractTextObject(pt.owner_id))}</span></td>
                            )}
                            {columns.some((selectedValue) => selectedValue.includes('product_uom_id')) && (
                              <td className="w-15">
                                <span className="font-weight-400 d-inline-block">
                                  {getDefaultNoValue(extractTextObject(pt.product_uom_id))}
                                </span>
                              </td>
                            )}
                            {columns.some((selectedValue) => selectedValue.includes('in_date')) && (
                              <td className="w-15">
                                <span className="font-weight-400 d-inline-block">
                                  {getDefaultNoValue(getCompanyTimezoneDate(pt.in_date, userInfo, 'datetime'))}
                                </span>
                              </td>
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
                    listResponse={invReportListInfo}
                    countLoad={invReportCountLoading}
                  />
                  <Modal size="md" className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={addModal}>
                    <ModalHeaderComponent title="Inventory Report" imagePath={false} closeModalWindow={() => onAddReset()} response={createStockHistory} />
                    <ModalBody className="mt-0 pt-0">
                      <AddHistory type="report" afterReset={() => onAddReset()} />
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

export default InventoryReport;
