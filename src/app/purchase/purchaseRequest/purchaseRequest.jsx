/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import {
  Button, Badge, Card, CardTitle, CardBody, Col, Row, Popover, PopoverHeader, PopoverBody, Table,
  UncontrolledTooltip,
  Input, Label,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer } from 'antd';

import editWhiteIcon from '@images/icons/editWhite.svg';
import filterIcon from '@images/filter.png';
import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import editIcon from '@images/icons/edit.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import ErrorContent from '@shared/errorContent';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import CreateList from '@shared/listViewFilters/create';
import SearchList from '@shared/listViewFilters/search';
import AddColumns from '@shared/listViewFilters/columns';
import ExportList from '@shared/listViewFilters/export';
import DetailNavigation from '@shared/navigation';
import Loader from '@shared/loading';
import DrawerHeader from '@shared/drawerHeader';
import PurchaseHandBlue from '@images/icons/purchaseHandBlue.svg';
import {
  getPagesCountV2, generateErrorMessage,
  getLocalTime, getColumnArrayById, isArrayValueExists, getDefaultNoValue, getLocalDate,
  getArrayFromValuesByItem, getListOfModuleOperations,
} from '../../util/appUtils';
import SideFilters from './sidebar';
import DataExport from './dataExport/dataExport';
import customData from './data/customData.json';
import {
  getPurchaseRequestFilters, resetAddRequestInfo, getPurchaseRequestDetail, getCheckedRowsPurchaseRequest, setInitialValues,
} from '../purchaseService';
import {
  resetUpdateTenant,
} from '../../adminSetup/setupService';
import { getRequestStateColor, getStatusLabel } from './utils/utils';
import AddPurchaseRequest from './addPurchaseRequest';
import PurchaseRequestDetail from './purchaseRequestDetails/purchaseRequestDetail';
import filtersFields from './data/filtersFields.json';
import PurchaseSegments from '../purchaseSegments';
import actionCodes from './data/actionCodes.json';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const PurchaseRequest = () => {
  const limit = 10;
  const subMenu = 'Purchase Info';
  const subTabMenu = 'Purchase Request';
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [statusValue, setStatusValue] = useState(0);
  const [orderValue, setOrderValue] = useState(0);
  const [vendorValue, setVendorValue] = useState(0);
  const [checkItems, setCheckItems] = useState([]);
  const [checkOrderItems, setCheckOrderItems] = useState([]);
  const [checkVendorItems, setCheckVendorItems] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [customFilterList, setCustomFiltersList] = useState([]);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [addPurchaseRequestModal, showAddPurchaseRequestModal] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [editId, setEditId] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [columns, setColumns] = useState(['requisition_name', 'pr_id', 'partner_id', 'requestor_full_name', 'site_contact_details', 'site_spoc', 'state']);

  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'code');
  const {
    requestCount, requestInfo, requestCountLoading,
    requestFilters, addPurchaseRequestInfo, requestDetails, filterInitailValues,
  } = useSelector((state) => state.purchase);

  const { tenantUpdateInfo } = useSelector((state) => state.setup);

  const dateFilters = (requestFilters && requestFilters.customFilters && requestFilters.customFilters.length > 0) ? requestFilters.customFilters : [];

  useEffect(() => {
    if (requestFilters && requestFilters.statuses) {
      setCheckItems(requestFilters.statuses);
      setStatusValue(0);
    }
    if (requestFilters && requestFilters.orderes) {
      setCheckOrderItems(requestFilters.orderes);
      setOrderValue(0);
    }
    if (requestFilters && requestFilters.vendores) {
      setCheckVendorItems(requestFilters.vendores);
      setVendorValue(0);
    }
    if (requestFilters && requestFilters.customFilters) {
      setCustomFilters(requestFilters.customFilters);
      const vid = isArrayValueExists(requestFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [requestFilters]);

  useEffect(() => {
    if (viewId) {
      dispatch(getPurchaseRequestDetail(viewId, appModels.PURCHASEREQUEST));
    }
  }, [viewId]);

  useEffect(() => {
    if ((tenantUpdateInfo && tenantUpdateInfo.data)) {
      dispatch(getPurchaseRequestDetail(viewId, appModels.PURCHASEREQUEST));
    }
  }, [tenantUpdateInfo]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsPurchaseRequest(payload));
  }, [checkedRows]);

  const totalDataCount = requestCount && requestCount.length ? requestCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

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
      const data = requestInfo && requestInfo.data ? requestInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = requestInfo && requestInfo.data ? requestInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleStatusClose = (value) => {
    setStatusValue(value);
    setOrderValue(0);
    setVendorValue(0);
    setCheckItems(checkItems.filter((item) => item.id !== value));
    setOffset(0); setPage(1);
  };

  const handleOrderClose = (value) => {
    setOrderValue(value);
    setStatusValue(0);
    setVendorValue(0);
    setCheckOrderItems(checkOrderItems.filter((item) => item.id !== value));
    setOffset(0); setPage(1);
  };

  const handleVendorClose = (value) => {
    setVendorValue(value);
    setStatusValue(0);
    setOrderValue(0);
    setCheckVendorItems(checkVendorItems.filter((item) => item.id !== value));
    setOffset(0); setPage(1);
  };

  const onReset = () => {
    dispatch(resetAddRequestInfo());
  };

  const showDetailsView = (id) => {
    dispatch(setInitialValues(false, false, false, false));
    setViewId(id);
  };

  const closeEditModalWindow = () => {
    dispatch(resetUpdateTenant());
    setEdit(false);
    setEditId(false);
  };

  /* const addVendorWindow = () => {
    dispatch(resetVendorBank());
    showAddPurchaseRequestModal(true);
  }; */

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const states = requestFilters && requestFilters.statuses ? requestFilters.statuses : [];
    const orders = requestFilters && requestFilters.orderes ? requestFilters.orderes : [];
    const vendors = requestFilters && requestFilters.vendores ? requestFilters.vendores : [];
    const customFiltersList1 = customFilters.filter((item) => item.key !== value);
    dispatch(getPurchaseRequestFilters(states, orders, vendors, customFiltersList1));
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFiltersList(filters);
      const oldCustomFilters = requestFilters && requestFilters.customFilters ? requestFilters.customFilters : [];
      const states = requestFilters && requestFilters.statuses ? requestFilters.statuses : [];
      const orders = requestFilters && requestFilters.orderes ? requestFilters.orderes : [];
      const vendors = requestFilters && requestFilters.vendores ? requestFilters.vendores : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getPurchaseRequestFilters(states, orders, vendors, customFilters1));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = requestFilters && requestFilters.customFilters ? requestFilters.customFilters : [];
      const states = requestFilters && requestFilters.statuses ? requestFilters.statuses : [];
      const orders = requestFilters && requestFilters.orderes ? requestFilters.orderes : [];
      const vendors = requestFilters && requestFilters.vendores ? requestFilters.vendores : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getPurchaseRequestFilters(states, orders, vendors, customFilters1));
    }
    setOffset(0); setPage(1);
  };

  const handleCustomDateChange = (start, end) => {
    const value = 'Custom';
    const filters = [{
      key: value, value, label: value, type: 'customdate', start, end,
    }];
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = requestFilters && requestFilters.customFilters ? requestFilters.customFilters : [];
      const states = requestFilters && requestFilters.statuses ? requestFilters.statuses : [];
      const orders = requestFilters && requestFilters.orderes ? requestFilters.orderes : [];
      const vendors = requestFilters && requestFilters.vendores ? requestFilters.vendores : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getPurchaseRequestFilters(states, orders, vendors, customFilters1));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = requestFilters && requestFilters.customFilters ? requestFilters.customFilters : [];
      const states = requestFilters && requestFilters.statuses ? requestFilters.statuses : [];
      const orders = requestFilters && requestFilters.orderes ? requestFilters.orderes : [];
      const vendors = requestFilters && requestFilters.vendores ? requestFilters.vendores : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getPurchaseRequestFilters(states, orders, vendors, customFilters1));
    }
    setOffset(0); setPage(1);
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    const states = requestFilters && requestFilters.statuses ? requestFilters.statuses : [];
    const orders = requestFilters && requestFilters.orderes ? requestFilters.orderes : [];
    const vendors = requestFilters && requestFilters.vendores ? requestFilters.vendores : [];
    const customFilters1 = [...filters];
    resetForm({ values: '' });
    setOffset(0); setPage(1);
    dispatch(getPurchaseRequestFilters(states, orders, vendors, customFilters1));
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (requestInfo && requestInfo.loading) || (requestCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (requestInfo && requestInfo.err) ? generateErrorMessage(requestInfo) : userErrorMsg;

  const isCreatable = allowedOperations.includes(actionCodes['Add Request']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Request']);

  const addAdjustmentWindow = () => {
    if (document.getElementById('PurchaseRequestForm')) {
      document.getElementById('PurchaseRequestForm').reset();
    }
    showAddPurchaseRequestModal(true);
  };

  return (

    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border list purchase-module">
      <Col sm="12" md="12" lg="12">
        <PurchaseSegments id={subTabMenu} />
      </Col>
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2' : 'pt-2 pl-2 pr-2'}>
        {collapse ? (
          <>
            <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer filter-left ml-4" id="filters" />
            <UncontrolledTooltip target="filters" placement="right">
              Filters
            </UncontrolledTooltip>
          </>
        ) : (
          <SideFilters
            offset={offset}
            id={viewId}
            statusValue={statusValue}
            orderValue={orderValue}
            vendorValue={vendorValue}
            afterReset={() => { setPage(page); setOffset(offset); }}
            sortBy={sortBy}
            sortField={sortField}
            setCollapse={setCollapse}
            collapse={collapse}
          />
        )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1  products-data-collection' : ' products-data-collection pl-1 pt-2 pr-2'}>
        {viewId ? (
          <div className={collapse ? 'filter-margin-right card h-100' : 'card h-100 bg-lightblue'}>
            <Row>
              <Col sm="12" md="12" lg="12" xs="12">
                <Card className="bg-lightblue border-0 p-2 h-100">
                  <CardTitle className=" mb-0">
                    <DetailNavigation
                      overviewName=""
                      overviewPath=""
                      listName="Purchase Request"
                      detailName={requestDetails && (requestDetails.data && requestDetails.data.length > 0) ? requestDetails.data[0].requisition_name : ''}
                      afterList={() => { setOffset(offset); setPage(page); setViewId(0); }}
                    />
                    <span className="float-right">
                      { requestDetails && (requestDetails.data && requestDetails.data.length > 0 && requestDetails.data[0].state && requestDetails.data[0].state !== 'cancel')
                        && (!requestDetails.loading && isEditable) && (
                        <Button
                           variant="contained"
                          size="sm"
                          onClick={() => { setEditId(requestDetails && (requestDetails.data && requestDetails.data.length > 0) ? requestDetails.data[0].id : false); setEdit(!isEdit); }}
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
                        onClick={() => { setOffset(offset); setPage(page); setViewId(0); }}
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
            <PurchaseRequestDetail />
            {/*  <Modal size={(tenantUpdateInfo && tenantUpdateInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={isEdit}>
              <ModalHeaderComponent title="Edit Purchase Request" imagePath={false} closeModalWindow={closeEditModalWindow} response={tenantUpdateInfo} />
              <ModalBody className="pt-0 mt-0">
                {(tenantUpdateInfo && !tenantUpdateInfo.data && !tenantUpdateInfo.loading) && (
                  <AddPurchaseRequest editId={editId} afterReset={() => closeEditModalWindow()} />
                )}
                {tenantUpdateInfo && tenantUpdateInfo.loading && (
                  <div className="text-center mt-3">
                    <Loader />
                  </div>
                )}
                {(tenantUpdateInfo && tenantUpdateInfo.data) && (
                  <SuccessAndErrorFormat
                    response={tenantUpdateInfo}
                    successMessage="Purchase request updated successfully..."
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
                title="Update Purchase Request"
                imagePath={PurchaseHandBlue}
                closeDrawer={() => { closeEditModalWindow(false); }}
              />
              <AddPurchaseRequest editId={viewId} afterReset={() => closeEditModalWindow()} />
            </Drawer>
          </div>
        ) : (
          <Card className={collapse ? 'filter-margin-right p-2 mb-2 h-100 bg-lightblue' : ' p-2 mb-2 h-100 bg-lightblue'}>
            <CardBody className="bg-color-white p-1 m-0">
              <Row className="p-2">
                <Col md="8" xs="12" sm="8" lg="8">
                  <div className="content-inline">
                    <span className="p-0 mr-2 font-weight-800 font-medium">
                      Purchase Request List:
                      {' '}
                      {totalDataCount}
                    </span>
                    {(checkItems && checkItems.length) ? checkItems.map((st) => (
                      <p key={st.id} className="mr-2 content-inline">
                        <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                          {st.label}
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(st.id)} size="sm" icon={faTimesCircle} />
                        </Badge>
                      </p>
                    )) : ''}
                    {(checkOrderItems) && checkOrderItems.map((st) => (
                      <p key={st.id} className="mr-2 content-inline">
                        <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                          {st.label}
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleOrderClose(st.id)} size="sm" icon={faTimesCircle} />
                        </Badge>
                      </p>
                    ))}
                    {(checkVendorItems) && checkVendorItems.map((st) => (
                      <p key={st.id} className="mr-2 content-inline">
                        <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                          {st.label}
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleVendorClose(st.id)} size="sm" icon={faTimesCircle} />
                        </Badge>
                      </p>
                    ))}
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
                    <ListDateFilters dateFilters={dateFilters} customFilters={customFilters} handleCustomFilterClose={handleCustomFilterClose} setCustomVariable={setCustomVariable} customVariable={customVariable} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                    <SearchList formFields={filtersFields.fields} searchHandleSubmit={searchHandleSubmit} />
                    {isCreatable && (
                    <CreateList name="Add Purchase Request" showCreateModal={addAdjustmentWindow} />
                    )}
                    <AddColumns columns={customData.tableColumns} handleColumnChange={handleColumnChange} columnFields={columns} />
                    <ExportList response={(requestInfo && requestInfo.data && requestInfo.data.length > 0)} />
                  </div>
                  <Popover placement="bottom" className="export-popover" isOpen={filterInitailValues.download} target="Export">
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
                  {/*  <Modal
                    size={(addPurchaseRequestInfo && addPurchaseRequestInfo.data) ? 'sm' : 'xl'}
                    className="border-radius-50px modal-dialog-centered"
                    isOpen={addPurchaseRequestModal}
                  >
                    <ModalHeaderComponent
                      title="Add Purchase Request"
                      imagePath={false}
                      closeModalWindow={() => { showAddPurchaseRequestModal(false); onReset(); }}
                      response={addPurchaseRequestInfo}
                    />
                    <ModalBody className="mt-0 pt-0">
                      <AddPurchaseRequest
                        editId={false}
                        afterReset={() => { showAddPurchaseRequestModal(false); onReset(); }}
                      />
                    </ModalBody>
                    </Modal> */}
                  <Drawer
                    title=""
                    closable={false}
                    className="drawer-bg-lightblue"
                    width={1250}
                    visible={addPurchaseRequestModal}
                  >

                    <DrawerHeader
                      title="Create Purchase Request"
                      imagePath={PurchaseHandBlue}
                      closeDrawer={() => { showAddPurchaseRequestModal(false); onReset(); }}
                    />
                    <AddPurchaseRequest
                      editId={false}
                      afterReset={() => { showAddPurchaseRequestModal(false); onReset(); }}
                    />
                  </Drawer>
                </Col>
              </Row>
              {(requestInfo && requestInfo.data) && (
              <span data-testid="success-case" />
              )}
              <div className="thin-scrollbar">
                {(requestInfo && requestInfo.data) && (

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
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('requisition_name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Requisition Purpose
                        </span>
                      </th>
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('pr_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          PR Code
                        </span>
                      </th>
                      <th className="p-2 min-width-200">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('partner_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Vendor
                        </span>
                      </th>
                      <th className="p-2 min-width-200">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('requestor_full_name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Requestor Name
                        </span>
                      </th>
                      <th className="p-2 min-width-200">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('site_contact_details'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Site Contact Details
                        </span>
                      </th>
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('site_spoc'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Site Spoc
                        </span>
                      </th>
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('state'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Status
                        </span>
                      </th>
                      {columns.some((selectedValue) => selectedValue.includes('requestor_email')) && (
                      <th className="min-width-160 p-2">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('requestor_email'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Email
                        </span>
                      </th>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                      <th className="min-width-160 p-2">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Company
                        </span>
                      </th>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('create_date')) && (
                      <th className="min-width-160 p-2">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('create_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Created On
                        </span>
                      </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {requestInfo.data.map((pr, index) => (
                      <tr key={pr.id}>
                        <td className="w-5">
                          <div className="checkbox">
                            <Input
                              type="checkbox"
                              value={pr.id}
                              id={`checkboxtk${index}`}
                              className="ml-0"
                              name={pr.name}
                              checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(pr.id))}
                              onChange={handleTableCellChange}
                            />
                            <Label htmlFor={`checkboxtk${index}`} />
                          </div>
                        </td>
                        <td aria-hidden="true" className="cursor-pointer w-20 p-2" onClick={() => showDetailsView(pr.id)}>
                          <span className="font-weight-600">{getDefaultNoValue(pr.requisition_name)}</span>
                        </td>
                        <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(pr.pr_id)}</span></td>
                        <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(pr.partner_id ? pr.partner_id[1] : '')}</span></td>
                        <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(pr.requestor_full_name)}</span></td>
                        <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(pr.site_contact_details)}</span></td>
                        <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(pr.site_spoc)}</span></td>
                        <td className="w-15 p-2">
                          <span className={`text-${getRequestStateColor(pr.state)} d-inline-block`}>{getDefaultNoValue(getStatusLabel(pr.state))}</span>
                        </td>
                        {columns.some((selectedValue) => selectedValue.includes('requestor_email')) && (
                        <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(pr.requestor_email)}</span></td>
                        )}
                        {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                        <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(pr.company_id ? pr.company_id[1] : '')}</span></td>
                        )}
                        {columns.some((selectedValue) => selectedValue.includes('create_date')) && (
                        <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(getLocalTime(pr.create_date))}</span></td>
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
                {loading && (
                <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                  <Loader />
                </div>
                )}

                {((requestInfo && requestInfo.err) || isUserError) && (

                <ErrorContent errorTxt={errorMsg} />

                )}
              </div>
            </CardBody>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default PurchaseRequest;
