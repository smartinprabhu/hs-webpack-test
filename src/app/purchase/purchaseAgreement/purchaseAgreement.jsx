/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import {
  CardTitle, Button, Badge, Card, CardBody, Col, Input, Label, Row, Table, Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Drawer } from 'antd';

import DrawerHeader from '@shared/drawerHeader';
import editIcon from '@images/icons/edit.svg';
import editWhiteIcon from '@images/icons/editWhite.svg';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import DetailViewFormat from '@shared/detailViewFormat';
import DetailNavigation from '@shared/navigation';
import TableListFormat from '@shared/tableListFormat';
import SearchList from '@shared/listViewFilters/search';
import AddColumns from '@shared/listViewFilters/columns';
import CreateList from '@shared/listViewFilters/create';
import CardTitleCustom from '@shared/sideTools/cardTitleCustom';
import CollapseImg from '@shared/sideTools/collapseImg';
import CollapseItemCustom from '@shared/sideTools/collapseItemCustom';
import CollapseItemCustomDate from '@shared/sideTools/collapseItemCustomDate';
import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import ExportList from '@shared/listViewFilters/export';
import PurchaseHandBlue from '@images/icons/purchaseHandBlue.svg';
import DataExport from './dataExport/dataExport';

import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import {
  getPagesCountV2, extractTextObject, getArrayFromValuesByItem,
  queryGeneratorV1, getAllowedCompanies, getColumnArrayById, queryGeneratorWithUtc,
  isArrayValueExists, getCompanyTimezoneDate, getDefaultNoValue,
  truncate, getLocalDate, getDatesOfQuery, getListOfModuleOperations,
} from '../../util/appUtils';
import { getPartsData } from '../../preventiveMaintenance/ppmService';
import {
  resetUpdateTenant,
} from '../../adminSetup/setupService';
import {
  setInitialValues, getPurchaseAgreementCount, getPurchaseAgreementList,
  getPurchaseAgreementFilters, getPurchaseAgreementRows, getPurchaseAgreementDetail, resetAddAgreementRequest, resetAgreementInfo,
} from '../purchaseService';
import {
  getAgreeStatusLabel, getAgreeStatusColor,
} from './utils/utils';
import AddPurchaseAgreement from './addPurchaseAgreement';
import PurchaseSegments from '../purchaseSegments';
import PurchaseAgreementDetail from './purchaseAgreementDetail/purchaseAgreementDetail';
import actionCodes from './data/actionCodes.json';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const PurchaseAgreement = () => {
  const limit = 10;
  const subMenu = 'Purchase Info';
  const subTabMenu = 'Purchase Agreements';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [columns, setColumns] = useState(customData && customData.listfieldsAgreeShows ? customData.listfieldsAgreeShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);
  const [addAgreeRequestModal, showAddAgreeRequestModal] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(false);
  const [datefilterList, setDatefilterList] = useState([]);
  const [selectedDate, setSelectedDate] = useState([null, null]);

  const [filtersIcon, setFilterIcon] = useState(false);
  const [agreeStateCollapse, setAgreeStateCollapse] = useState(true);
  const [orderCollapse, setOrderCollapse] = useState(false);
  const [scrollDataList, setScrollData] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);
  const { filterInitailValues } = useSelector((state) => state.purchase);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'code');
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const companies = getAllowedCompanies(userInfo);
  const {
    purchaseAgreementCount, purchaseAgreementListInfo, purchaseAgreementCountLoading,
    purchaseAgreementFilters, purchaseAgreementDetails, agreementStateChangeInfo,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = purchaseAgreementFilters.customFilters ? queryGeneratorWithUtc(purchaseAgreementFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPurchaseAgreementCount(companies, appModels.PURCHASEAGREEMENT, customFiltersList));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = purchaseAgreementFilters.customFilters ? queryGeneratorWithUtc(purchaseAgreementFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPurchaseAgreementList(companies, appModels.PURCHASEAGREEMENT, limit, offset, customFiltersList, sortBy, sortField));
    }
  }, [userInfo, offset, sortField, sortBy, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      const customFiltersList = purchaseAgreementFilters.customFilters ? queryGeneratorWithUtc(purchaseAgreementFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPurchaseAgreementList(companies, appModels.PURCHASEAGREEMENT, limit, offsetValue, customFiltersList, sortBy, sortField));
    }
  }, [userInfo, offsetValue, sortField, sortBy, customFilters, scrollTop]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId === 0) {
      const customFiltersList = purchaseAgreementFilters.customFilters ? queryGeneratorWithUtc(purchaseAgreementFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPurchaseAgreementList(companies, appModels.PURCHASEAGREEMENT, limit, offset, customFiltersList, sortBy, sortField));
    }
  }, [viewId]);

  useEffect(() => {
    if (userInfo && userInfo.data && (tenantUpdateInfo && tenantUpdateInfo.data) && ((agreementStateChangeInfo && agreementStateChangeInfo.data) || agreementStateChangeInfo.status)) {
      const customFiltersList = purchaseAgreementFilters.customFilters ? queryGeneratorWithUtc(purchaseAgreementFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPurchaseAgreementList(companies, appModels.PURCHASEAGREEMENT, limit, offset, customFiltersList, sortBy, sortField));
      dispatch(getPurchaseAgreementCount(companies, appModels.PURCHASEAGREEMENT, customFiltersList));
    }
  }, [tenantUpdateInfo, agreementStateChangeInfo]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getPurchaseAgreementRows(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (purchaseAgreementFilters && purchaseAgreementFilters.customFilters) {
      setCustomFilters(purchaseAgreementFilters.customFilters);
      const vid = isArrayValueExists(purchaseAgreementFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          const data = purchaseAgreementFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(vid));
          setCustomFilters(data);
          dispatch(getPurchaseAgreementFilters(data));
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [purchaseAgreementFilters]);

  useEffect(() => {
    if (!viewId) {
      setScrollData([]);
    }
  }, [viewId]);

  useEffect(() => {
    if (viewId) {
      dispatch(getPurchaseAgreementDetail(viewId, appModels.PURCHASEAGREEMENT));
    }
  }, [viewId]);

  useEffect(() => {
    if ((viewId && tenantUpdateInfo && tenantUpdateInfo.data)) {
      dispatch(getPurchaseAgreementDetail(viewId, appModels.PURCHASEAGREEMENT));
    }
  }, [tenantUpdateInfo]);

  useEffect(() => {
    if (purchaseAgreementListInfo && purchaseAgreementListInfo.data && viewId) {
      const arr = [...scrollDataList, ...purchaseAgreementListInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [purchaseAgreementListInfo, viewId]);

  const totalDataCount = purchaseAgreementCount && purchaseAgreementCount.length ? purchaseAgreementCount.length : 0;

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
      const data = purchaseAgreementListInfo && purchaseAgreementListInfo.data ? purchaseAgreementListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = purchaseAgreementListInfo && purchaseAgreementListInfo.data ? purchaseAgreementListInfo.data : [];
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
    if ((purchaseAgreementListInfo && !purchaseAgreementListInfo.loading) && bottom && (totalDataCount !== scrollListCount) && (totalDataCount >= offsetValue)) {
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
      const oldCustomFilters = purchaseAgreementFilters && purchaseAgreementFilters.customFilters ? purchaseAgreementFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getPurchaseAgreementFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomDateChange = (start, end) => {
    const value = 'Custom';
    const filters = [{
      key: value, value, label: value, type: 'customdate', start, end,
    }];
    if (start && end) {
      const oldCustomFilters = purchaseAgreementFilters && purchaseAgreementFilters.customFilters ? purchaseAgreementFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getPurchaseAgreementFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
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
        const filters = [{
          key: 'ordering_date', value, label, type: 'datecompare', start, end,
        }];
        const customFilterCurrentList = customFilters.filter((item) => item.value !== value);
        const customFiltersList = [...customFilterCurrentList, ...filters];
        dispatch(getPurchaseAgreementFilters(customFiltersList));
        setOffset(0);
        setPage(1);
      }
    }
  }, [selectedDate]);

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value));
    const customFiltersList = customFilters.filter((item) => item.value !== value);
    dispatch(getPurchaseAgreementFilters(customFiltersList));
    if (value === 'Custom') {
      setDatefilterList([]);
      setSelectedDate([null, null]);
    }
    setOffset(0);
    setPage(1);
  };

  const handleStateTypeCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getPurchaseAgreementFilters(customFiltersList));
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getPurchaseAgreementFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handleOrderCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      if (value === 'Custom') {
        const filters = [{
          key: value, title: 'Order Date', value, label: value, type: 'date',
        }];
        setDatefilterList(filters);
        const customFilterCurrentList = customFilters.filter((item) => item.type !== 'datecompare');
        dispatch(getPurchaseAgreementFilters(customFilterCurrentList));
      } else {
        const dateArray = getDatesOfQuery(value);
        const filters = [{
          key: 'ordering_date', title: 'Order Date', value, label: name, type: 'datecompare', start: dateArray[0], end: dateArray[1],
        }];
        setDatefilterList([]);
        setSelectedDate([null, null]);
        const customFilterCurrentList = customFilters.filter((item) => item.type !== 'datecompare');
        const customFiltersList = [...customFilterCurrentList, ...filters];
        dispatch(getPurchaseAgreementFilters(customFiltersList));
      }
    } else {
      if (value === 'Custom') {
        setDatefilterList([]);
        setSelectedDate([null, null]);
      }
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getPurchaseAgreementFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCustomFilters([]);
    dispatch(getPurchaseAgreementFilters([]));
    setDatefilterList([]);
    setSelectedDate([null, null]);
    setOffset(0);
    setPage(1);
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
    dispatch(getPurchaseAgreementFilters(customFilters1));
    setOffset(0);
    setPage(1);
  };

  const openEditModal = () => {
    dispatch(resetUpdateTenant());
    setEdit(true);
  };

  const closeEditModalWindow = () => {
    dispatch(resetUpdateTenant());
    setEdit(false);
    setEditId(false);
  };

  const onReset = () => {
    if (document.getElementById('purchaseagreementForm')) {
      document.getElementById('purchaseagreementForm').reset();
    }
    dispatch(resetAddAgreementRequest());
    dispatch(resetUpdateTenant());
    dispatch(getPartsData([]));
  };

  const stateValuesList = (purchaseAgreementFilters && purchaseAgreementFilters.customFilters && purchaseAgreementFilters.customFilters.length > 0)
    ? purchaseAgreementFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const agreeValues = getColumnArrayById(stateValuesList, 'value');

  const orderValuesList = (purchaseAgreementFilters && purchaseAgreementFilters.customFilters && purchaseAgreementFilters.customFilters.length > 0)
    ? purchaseAgreementFilters.customFilters.filter((item) => item.type === 'datecompare') : [];

  const orderValues = getColumnArrayById(orderValuesList, 'value');

  const dateFilters = (purchaseAgreementFilters && purchaseAgreementFilters.customFilters && purchaseAgreementFilters.customFilters.length > 0)
    ? purchaseAgreementFilters.customFilters.filter((item) => item.type === 'date') : [];
  const loading = (userInfo && userInfo.loading) || (purchaseAgreementListInfo && purchaseAgreementListInfo.loading) || (purchaseAgreementCountLoading);
  const detailName = purchaseAgreementDetails && purchaseAgreementDetails.data && purchaseAgreementDetails.data.length ? getDefaultNoValue(purchaseAgreementDetails.data[0].name) : '';

  function setSelectedDates(dates) {
    setSelectedDate(dates);
  }

  const isCreatable = allowedOperations.includes(actionCodes['Add Agreements']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Agreements']);

  const addAdjustmentWindow = () => {
    if (document.getElementById('purchaseagreementForm')) {
      document.getElementById('purchaseagreementForm').reset();
    }
    dispatch(resetAgreementInfo());
    showAddAgreeRequestModal(true);
  };

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border purchase-module">
      <Col sm="12" md="12" lg="12">
        <PurchaseSegments id={subTabMenu} />
      </Col>
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2' : 'pt-2 pl-2 pr-2'}>
        {collapse
          ? (
            <CollapseImg onCollapse={() => setCollapse(!collapse)} />
          )
          : (
            <Card className="p-1 h-100 bg-lightblue side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
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
                            <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value)} size="sm" icon={faTimesCircle} />
                          </Badge>
                        </p>
                      ))}
                    </div>
                    {customFilters && customFilters.length > 0 && (
                    <div aria-hidden="true" className="cursor-pointer text-info text-right mr-2 font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                    )}
                    {customFilters && customFilters.length > 0 && (
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
                                <span className="font-weight-700 ml-1 mb-1 font-medium" title={sl.name}>{truncate(sl.name, 20)}</span>
                              </Col>
                            </Row>
                            <p className="font-weight-600 ml-1 mb-0 font-tiny">
                              {' '}
                              {getDefaultNoValue(getCompanyTimezoneDate(sl.ordering_date, userInfo, 'datetime'))}
                            </p>
                            <p className="font-weight-400 ml-1 mb-0 font-tiny">
                              {' '}
                              <span className={`text-${getAgreeStatusColor(sl.state)} d-inline-block`}>
                                {getDefaultNoValue(getAgreeStatusLabel(sl.state))}
                              </span>
                            </p>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                    <DetailViewFormat detailResponse={purchaseAgreementListInfo} />
                  </>
                )
                : (
                  <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
                    <CollapseItemCustom
                      title="STATUS"
                      data={customData && customData.agreeStates ? customData.agreeStates : []}
                      selectedValues={agreeValues}
                      onCollapse={() => setAgreeStateCollapse(!agreeStateCollapse)}
                      isOpen={agreeStateCollapse}
                      onCheckboxChange={handleStateTypeCheckboxChange}
                    />
                    <CollapseItemCustomDate
                      title="ORDERD DATE"
                      data={customData && customData.orderDateFilters ? customData.orderDateFilters : []}
                      selectedValues={orderValues}
                      onCollapse={() => setOrderCollapse(!orderCollapse)}
                      afterSelect={(dates) => setSelectedDates(dates)}
                      isOpen={orderCollapse}
                      datefilterList={datefilterList}
                      onCheckboxChange={handleOrderCheckboxChange}
                    />
                    {customFilters && customFilters.length > 0 && (
                    <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                    )}
                  </CardBody>
                )}
            </Card>
          )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1 products-data-collection list' : 'products-data-collection list pl-1 pt-2 pr-2'}>
        {viewId
          ? (
            <div className={collapse ? 'filter-margin-right card h-100' : 'card h-100 bg-lightblue'}>
              <Row>
                <Col sm="12" md="12" lg="12" xs="12">
                  <Card className="bg-lightblue border-0 p-2 h-100">
                    <CardTitle className="mb-0">
                      <DetailNavigation
                        overviewName=""
                        overviewPath=""
                        listName="Purchase Agreements List"
                        detailName={detailName}
                        afterList={() => { setOffset(offset); setPage(page); setViewId(0); setOffsetValue(0); }}
                      />
                      <span className="float-right">
                        {purchaseAgreementDetails && (purchaseAgreementDetails.data && purchaseAgreementDetails.data.length > 0)
                          && (!purchaseAgreementDetails.loading && isEditable) && (
                          <Button
                             variant="contained"
                            size="sm"
                            onClick={() => {
                              setEditId(purchaseAgreementDetails && (purchaseAgreementDetails.data && purchaseAgreementDetails.data.length > 0) ? purchaseAgreementDetails.data[0].id : false);
                              openEditModal();
                            }}
                            onMouseLeave={() => setButtonHover1(false)}
                            onMouseEnter={() => setButtonHover1(true)}
                            className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                          >
                            <img src={isButtonHover1 ? editWhiteIcon : editIcon} className="mr-2 pb-2px" height="12" width="12" alt="edit" />
                            <span className="mr-2">Edit</span>
                          </Button>
                        )}
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
              <PurchaseAgreementDetail />
              {/* <Modal size={(tenantUpdateInfo && tenantUpdateInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={isEdit}>
                <ModalHeaderComponent title="Edit Purchase Agreement" imagePath={false} closeModalWindow={closeEditModalWindow} response={tenantUpdateInfo} />
                <ModalBody className="pt-0 mt-0">
                  {(tenantUpdateInfo && !tenantUpdateInfo.data && !tenantUpdateInfo.loading) && (
                  <AddPurchaseAgreement editId={editId} afterReset={() => closeEditModalWindow()} />
                  )}
                  {tenantUpdateInfo && tenantUpdateInfo.loading && (
                  <div className="text-center mt-3">
                    <Loader />
                  </div>
                  )}
                  {(tenantUpdateInfo && tenantUpdateInfo.data) && (
                  <SuccessAndErrorFormat
                    response={tenantUpdateInfo}
                    successMessage="Purchase agreement updated successfully..."
                  />
                  )}
                  {tenantUpdateInfo && tenantUpdateInfo.data && (<hr />)}
                  <div className="float-right">
                    {tenantUpdateInfo && tenantUpdateInfo.data && (
                    <Button
                      size="sm"
                      type="button"
                       variant="contained"
                      onClick={() => closeEditModalWindow()}
                      disabled={tenantUpdateInfo && tenantUpdateInfo.loading}
                    >
                      OK
                    </Button>
                    )}
                  </div>
                </ModalBody>
              </Modal> */}
              <Drawer
                title=""
                closable={false}
                className="drawer-bg-lightblue"
                width={1250}
                visible={isEdit}
              >

                <DrawerHeader
                  title="Update Purchase Agreement"
                  imagePath={PurchaseHandBlue}
                  closeDrawer={() => { closeEditModalWindow(false); onReset(); }}
                />
                <AddPurchaseAgreement
                  editId={editId}
                  afterReset={() => setEdit(false)}
                />
              </Drawer>

            </div>
          )
          : (
            <Card className={collapse ? 'filter-margin-right p-2 mb-2 h-100 bg-lightblue' : 'p-2 mb-2 h-100 bg-lightblue'}>
              <CardBody className="bg-color-white p-1 m-0">
                <Row className="p-2">
                  <Col md="8" xs="12" sm="8" lg="8">
                    <div className="content-inline">
                      <span className="p-0 mr-2 font-weight-800 font-medium">
                        Purchase Agreements List :
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
                            <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value)} size="sm" icon={faTimesCircle} />
                          </Badge>
                        </p>
                      ))}
                    </div>
                  </Col>
                  <Col md="4" xs="12" sm="4" lg="4">
                    <div className="float-right">
                      <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                      <SearchList formFields={filtersFields.fieldsVR} searchHandleSubmit={searchHandleSubmit} />
                      {isCreatable && (
                        <CreateList name="Add Purchase Agreement" showCreateModal={addAdjustmentWindow} />
                      )}
                      <AddColumns columns={customData.tableColumnsAgree} handleColumnChange={handleColumnChange} columnFields={columns} />
                      <ExportList response={(purchaseAgreementListInfo && purchaseAgreementListInfo.data && purchaseAgreementListInfo.data.length > 0)} />
                    </div>
                    <Popover placement="bottom"  className="export-popover" isOpen={filterInitailValues.download} target="Export">
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
                      <PopoverBody><DataExport afterReset={() => dispatch(setInitialValues(false, false, false, false))} fields={columns} /></PopoverBody>
                    </Popover>
                  </Col>
                </Row>
                {/*  <Modal size={(addPurchaseAgreementInfo && addPurchaseAgreementInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addAgreeRequestModal}>
                  <ModalHeaderComponent
                    title="Add Purchase Agreement"
                    imagePath={false}
                    closeModalWindow={() => { showAddAgreeRequestModal(false); onReset(); }}
                    response={addPurchaseAgreementInfo}
                  />
                  <ModalBody className="mt-0 pt-0">
                    <AddPurchaseAgreement
                      editId={false}
                      afterReset={() => { showAddAgreeRequestModal(false); onReset(); }}
                    />
                  </ModalBody>
                      </Modal> */}
                <Drawer
                  title=""
                  closable={false}
                  className="drawer-bg-lightblue"
                  width={1250}
                  visible={addAgreeRequestModal}
                >

                  <DrawerHeader
                    title="Create Purchase Agreement"
                    imagePath={PurchaseHandBlue}
                    closeDrawer={() => { showAddAgreeRequestModal(false); onReset(); }}
                  />
                  <AddPurchaseAgreement
                    editId={false}
                    afterReset={() => { showAddAgreeRequestModal(false); onReset(); }}
                  />
                </Drawer>
                <div className="thin-scrollbar">
                  {(purchaseAgreementListInfo && purchaseAgreementListInfo.data && purchaseAgreementListInfo.data.length > 0) && (
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
                        <th className="p-2 min-width-200">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Agreement Reference
                          </span>
                        </th>
                        <th className="p-2 min-width-200">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('ordering_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Order Date
                          </span>
                        </th>
                        <th className="p-2 min-width-200">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('date_end'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Agreement Deadline
                          </span>
                        </th>
                        <th className="p-2 min-width-200">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('user_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Purchase Representative
                          </span>
                        </th>
                        <th className="p-2 min-width-200">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('type_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Agreement Type
                          </span>
                        </th>
                        <th className="p-2 min-width-100">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('state'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Status
                          </span>
                        </th>
                        {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                        <th className="p-2 min-width-160">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Company
                          </span>
                        </th>
                        )}
                        {columns.some((selectedValue) => selectedValue.includes('create_date')) && (
                        <th className="p-2 min-width-200">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('create_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Created On
                          </span>
                        </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {!loading && purchaseAgreementListInfo.data.map((pt) => (
                        <tr key={pt.id}>
                          <td className="w-5 p-2">
                            <div className="checkbox ml-1">
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
                          <td aria-hidden="true" className="w-20 p-2 cursor-pointer" onClick={() => showDetailsView(pt.id)}>
                            <span className="font-weight-600">
                              {' '}
                              {getDefaultNoValue(pt.name)}
                              {' '}
                            </span>
                          </td>
                          <td className="w-15 p-2">
                            <span className="font-weight-400 d-inline-block">
                              {' '}
                              {getDefaultNoValue(getCompanyTimezoneDate(pt.ordering_date, userInfo, 'datetime'))}
                            </span>
                          </td>
                          <td className="w-15 p-2">
                            <span className="font-weight-400 d-inline-block">
                              {getDefaultNoValue(getCompanyTimezoneDate(pt.date_end, userInfo, 'datetime'))}
                            </span>
                          </td>
                          <td className="w-15 p-2">
                            <span className="font-weight-400 d-inline-block">
                              {getDefaultNoValue(extractTextObject(pt.user_id))}
                            </span>
                          </td>
                          <td className="w-15 p-2">
                            <span className="font-weight-400 d-inline-block">
                              {getDefaultNoValue(extractTextObject(pt.type_id))}
                            </span>
                          </td>
                          <td className="w-15 p-2">
                            <span className="font-weight-400 d-inline-block">
                              <span className={`text-${getAgreeStatusColor(pt.state)} d-inline-block`}>{getAgreeStatusLabel(pt.state)}</span>
                            </span>
                          </td>
                          {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                          <td className="w-15 p-2">
                            <span className="font-weight-400 d-inline-block">
                              {getDefaultNoValue(extractTextObject(pt.company_id))}
                            </span>
                          </td>
                          )}
                          {columns.some((selectedValue) => selectedValue.includes('create_date')) && (
                          <td className="w-15 p-2">
                            <span className="font-weight-400 d-inline-block">
                              {getDefaultNoValue(getCompanyTimezoneDate(pt.create_date, userInfo, 'datetime'))}
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
                    listResponse={purchaseAgreementListInfo}
                    countLoad={purchaseAgreementCountLoading}
                  />
                </div>
              </CardBody>
            </Card>
          )}
      </Col>
    </Row>
  );
};

export default PurchaseAgreement;
