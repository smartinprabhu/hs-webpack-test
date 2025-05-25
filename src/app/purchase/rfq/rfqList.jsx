/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Badge, Button, Card, CardBody, CardTitle, Col, Row, Table,
  PopoverHeader, PopoverBody, Popover,
  Input, Label,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer } from 'antd';

import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import editWhiteIcon from '@images/icons/editWhite.svg';
import editIcon from '@images/icons/edit.svg';
import PurchaseHandBlue from '@images/icons/purchaseHandBlue.svg';
import ErrorContent from '@shared/errorContent';
import DetailNavigation from '@shared/navigation';
import DrawerHeader from '@shared/drawerHeader';
import Loader from '@shared/loading';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import CreateList from '@shared/listViewFilters/create';
import ExportList from '@shared/listViewFilters/export';
import SearchList from '@shared/listViewFilters/search';
import AddColumns from '@shared/listViewFilters/columns';
import RfqDetail from './rfqDetails/rfqDetail';

import {
  getPagesCountV2, generateErrorMessage, getCompanyTimezoneDate,
  getDefaultNoValue, isArrayValueExists, getColumnArrayById, getLocalDate, getListOfModuleOperations,
} from '../../util/appUtils';
import { getRfqStateColor, getStatusLabel } from './utils/utils';
import { getPartsData } from '../../preventiveMaintenance/ppmService';
import {
  getQuotationFilters, getQuotatioDetail, resetAddRfqInfo, resetUpdateRfqInfo, resetQuotationInfo, getCheckedRowsRequest, setInitialValues,
} from '../purchaseService';
import AddRfq from './addRfq';
import AddPurchaseOrder from '../purchaseOrder/addPurchaseOrder';
import formFields from './filters/filtersFields.json';
import DataExport from './dataExport/dataExport';
import customData from './data/customData.json';
import actionCodes from './data/actionCodes.json';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const RfqList = ({
  getStatusValue, pageVal, offsetNumber, isPo, collapse,
}) => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(offsetNumber);
  const [viewId, setViewId] = useState(0);
  const [page, setPage] = useState(pageVal);
  const [statusValue, setStatusValue] = useState(0);
  const [orderValue, setOrderValue] = useState(0);
  const [vendorValue, setVendorValue] = useState(0);
  const [checkItems, setCheckItems] = useState([]);
  const [checkOrderItems, setCheckOrderItems] = useState([]);
  const [checkVendorItems, setCheckVendorItems] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [addRfqModal, showAddRfqModal] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [columns, setColumns] = useState([
    'name',
    'date_order',
    'partner_id',
    'company_id',
    'date_planned',
    'user_id',
    'amount_untaxed',
    'amount_total',
    'state',
  ]);

  const [customFiltersList, setCustomFiltersList] = useState([]);
  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'code');
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    quotationCount, quotationInfo, quotationCountLoading,
    quotationFilters, addRfqInfo, quotationDetails, productRedirectId,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const dateFilters = (quotationFilters && quotationFilters.customFilters && quotationFilters.customFilters.length > 0) ? quotationFilters.customFilters : [];

  useEffect(() => {
    if (viewId) {
      dispatch(getQuotatioDetail(viewId, appModels.PURCHASEORDER));
    }
  }, [viewId]);

  useEffect(() => {
    if (productRedirectId) {
      setViewId(productRedirectId);
    }
  }, [productRedirectId]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsRequest(payload));
  }, [checkedRows]);

  useEffect(() => {
    getStatusValue(statusValue, orderValue, vendorValue, offset, viewId, sortBy, sortField, page);
  }, [statusValue, orderValue, vendorValue, offset, viewId, sortBy, sortField, page]);

  useEffect(() => {
    if (quotationFilters && quotationFilters.statuses) {
      setCheckItems(quotationFilters.statuses);
      setStatusValue(0);
    }
    if (quotationFilters && quotationFilters.orderes) {
      setCheckOrderItems(quotationFilters.orderes);
      setOrderValue(0);
    }
    if (quotationFilters && quotationFilters.vendores) {
      setCheckVendorItems(quotationFilters.vendores);
      setVendorValue(0);
    }
    if (quotationFilters && quotationFilters.customFilters) {
      setCustomFilters(quotationFilters.customFilters);
      const vid = isArrayValueExists(quotationFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [quotationFilters]);

  const totalDataCount = quotationCount && quotationCount.length ? quotationCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

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
  };

  const handleOrderClose = (value) => {
    setOrderValue(value);
    setStatusValue(0);
    setVendorValue(0);
    setCheckOrderItems(checkOrderItems.filter((item) => item.id !== value));
  };

  const handleVendorClose = (value) => {
    setVendorValue(value);
    setStatusValue(0);
    setOrderValue(0);
    setCheckVendorItems(checkVendorItems.filter((item) => item.id !== value));
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
      const data = quotationInfo && quotationInfo.data ? quotationInfo.data : [];
      const newArr = getColumnArrayById(data, 'id');
      setCheckRows([...newArr, ...checkedRows]);
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  const onReset = () => {
    dispatch(resetAddRfqInfo());
    dispatch(resetUpdateRfqInfo());
    dispatch(getPartsData([]));
  };

  const onResetQuotationInfo = () => {
    dispatch(resetQuotationInfo());
  };

  /* const showCreateModal = () => {
    onResetQuotationInfo();
    showAddRfqModal(true);
  }; */

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const states = quotationFilters && quotationFilters.statuses ? quotationFilters.statuses : [];
    const orders = quotationFilters && quotationFilters.orderes ? quotationFilters.orderes : [];
    const vendors = quotationFilters && quotationFilters.vendores ? quotationFilters.vendores : [];
    const customFiltersList1 = customFilters.filter((item) => item.key !== value);
    dispatch(getQuotationFilters(states, orders, vendors, customFiltersList1));
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFiltersList(filters);
      const oldCustomFilters = quotationFilters && quotationFilters.customFilters ? quotationFilters.customFilters : [];
      const states = quotationFilters && quotationFilters.statuses ? quotationFilters.statuses : [];
      const orders = quotationFilters && quotationFilters.orderes ? quotationFilters.orderes : [];
      const vendors = quotationFilters && quotationFilters.vendores ? quotationFilters.vendores : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getQuotationFilters(states, orders, vendors, customFilters1));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = quotationFilters && quotationFilters.customFilters ? quotationFilters.customFilters : [];
      const states = quotationFilters && quotationFilters.statuses ? quotationFilters.statuses : [];
      const orders = quotationFilters && quotationFilters.orderes ? quotationFilters.orderes : [];
      const vendors = quotationFilters && quotationFilters.vendores ? quotationFilters.vendores : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getQuotationFilters(states, orders, vendors, customFilters1));
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
      const oldCustomFilters = quotationFilters && quotationFilters.customFilters ? quotationFilters.customFilters : [];
      const states = quotationFilters && quotationFilters.statuses ? quotationFilters.statuses : [];
      const orders = quotationFilters && quotationFilters.orderes ? quotationFilters.orderes : [];
      const vendors = quotationFilters && quotationFilters.vendores ? quotationFilters.vendores : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getQuotationFilters(states, orders, vendors, customFilters1));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = quotationFilters && quotationFilters.customFilters ? quotationFilters.customFilters : [];
      const states = quotationFilters && quotationFilters.statuses ? quotationFilters.statuses : [];
      const orders = quotationFilters && quotationFilters.orderes ? quotationFilters.orderes : [];
      const vendors = quotationFilters && quotationFilters.vendores ? quotationFilters.vendores : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getQuotationFilters(states, orders, vendors, customFilters1));
    }
    setOffset(0); setPage(1);
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    const oldCustomFilters = quotationFilters && quotationFilters.customFilters ? quotationFilters.customFilters : [];
    const states = quotationFilters && quotationFilters.statuses ? quotationFilters.statuses : [];
    const orders = quotationFilters && quotationFilters.orderes ? quotationFilters.orderes : [];
    const vendors = quotationFilters && quotationFilters.vendores ? quotationFilters.vendores : [];
    const customFilters1 = [...oldCustomFilters, ...filters];
    resetForm({ values: '' });
    setOffset(0); setPage(1);
    dispatch(getQuotationFilters(states, orders, vendors, customFilters1));
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (quotationInfo && quotationInfo.loading) || (quotationCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (quotationInfo && quotationInfo.err) ? generateErrorMessage(quotationInfo) : userErrorMsg;

  const isCreatable = isPo ? allowedOperations.includes(actionCodes['Add Orders']) : allowedOperations.includes(actionCodes['Add  Quotation']);
  const isEditable = isPo ? allowedOperations.includes(actionCodes['Edit Orders']) : allowedOperations.includes(actionCodes['Edit Quotation']);

  const addAdjustmentWindow = () => {
    dispatch(resetAddRfqInfo());
    dispatch(resetQuotationInfo());
    showAddRfqModal(true);
  };

  return (
    <>
      {viewId ? (
        <div className={collapse ? 'filter-margin-right card h-100 products-data-collection' : 'products-data-collection card h-100'}>
          <Row>
            <Col className="list" sm="12" md="12" lg="12" xs="12">
              <Card className="bg-lightblue border-0 p-2 h-100">
                <CardTitle className=" mb-0">
                  <DetailNavigation
                    overviewName=""
                    overviewPath=""
                    listName={isPo ? 'Purchase Order' : 'Request for Quotation'}
                    detailName={quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0) ? quotationDetails.data[0].name : ''}
                    afterList={() => { setOffset(offset); setPage(page); setViewId(0); }}
                  />
                  <span className="float-right">
                    {quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0)
                      && (!quotationDetails.loading && isEditable) && (
                      <Button
                         variant="contained"
                        size="sm"
                        onClick={() => { setEdit(!isEdit); }}
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
          <RfqDetail isEdit={isEdit} afterReset={() => { setEdit(false); onReset(); setPage(1); setOffset(0); }} isPurchaseOrder={isPo} />
        </div>
      )
        : (
          <Card className={collapse ? 'filter-margin-right p-2 mb-2 h-100 bg-lightblue ' : 'p-2 mb-2 h-100 bg-lightblue'}>
            <CardBody className="bg-color-white p-1 m-0">
              <Row className="p-2">
                <Col md="8" xs="12" sm="8" lg="8">
                  <div className="content-inline">
                    <span className="p-0 mr-2 font-weight-800 font-medium">
                      {isPo ? 'Purchase Orders :' : 'Request for Quotation :'}
                      {' '}
                      {!loading ? totalDataCount : ''}
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
                          {(cf.type === 'text' || cf.type === 'id') && (
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
                    <SearchList formFields={formFields.fields} searchHandleSubmit={searchHandleSubmit} />
                    {isCreatable && (
                      <CreateList name={isPo ? 'Add Purchase Order' : 'Add RFQ'} showCreateModal={addAdjustmentWindow} />
                    )}
                    <AddColumns columns={customData.tableColumns} handleColumnChange={handleColumnChange} columnFields={columns} />
                    <ExportList response={(quotationInfo && quotationInfo.data && quotationInfo.data.length > 0)} />
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
                    <PopoverBody><DataExport afterReset={() => dispatch(setInitialValues(false, false, false, false))} fields={columns} isPurchaseOrder={isPo} /></PopoverBody>
                  </Popover>
                  {/* }  <Modal className="border-radius-50px modal-dialog-centered purchase-modal" size={(addRfqInfo && addRfqInfo.data) ? 'sm' : 'xl'} isOpen={addRfqModal}>
                    <ModalHeaderComponent title={isPo ? 'Add Purchase Order' : 'Add RFQ'} imagePath={false} closeModalWindow={() => { showAddRfqModal(false); onReset(); }} response={addRfqInfo} />
                    <ModalBody className="mt-0 pt-0">
                      {isPo ? (
                        <AddPurchaseOrder afterReset={() => { showAddRfqModal(false); onReset(); }} />
                      ) : (
                        <AddRfq
                          afterReset={() => { showAddRfqModal(false); onReset(); }}
                          purchaseAgreementId={false}
                          vendorId={false}
                        />
                      )}
                    </ModalBody>
                      </Modal> */}
                  <Drawer
                    title=""
                    closable={false}
                    className="drawer-bg-lightblue"
                    width={1250}
                    visible={addRfqModal}
                  >

                    <DrawerHeader
                      title={isPo ? 'Add Purchase Order' : 'Add RFQ'}
                      imagePath={PurchaseHandBlue}
                      closeDrawer={() => { showAddRfqModal(false); onReset(); }}
                    />
                    {isPo ? (
                      <AddPurchaseOrder afterReset={() => { showAddRfqModal(false); onReset(); }} closeAddModal={() => { showAddRfqModal(false); }} />
                    ) : (
                      <AddRfq
                        afterReset={() => { showAddRfqModal(false); onReset(); }}
                        closeAddModal={() => { showAddRfqModal(false); }}
                        purchaseAgreementId={false}
                        vendorId={false}
                      />
                    )}
                  </Drawer>
                </Col>
              </Row>
              {(quotationInfo && quotationInfo.data) && (
                <span data-testid="success-case" />
              )}
              <div className="thin-scrollbar">
                {(quotationInfo && quotationInfo.data) && (
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
                        <th className="p-2 min-width-100">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Reference
                          </span>
                        </th>
                        <th className="p-2 min-width-200">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('date_order'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Order Date
                          </span>
                        </th>
                        <th className="p-2 min-width-100">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('partner_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Vendor
                          </span>
                        </th>
                        <th className="p-2 min-width-100">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Company
                          </span>
                        </th>
                        <th className="p-2 min-width-200">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('date_planned'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Scheduled Date
                          </span>
                        </th>
                        <th className="p-2 min-width-200">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('user_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Purchase Representative
                          </span>
                        </th>
                        <th className="p-2 min-width-100">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('amount_untaxed'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Untaxed
                          </span>
                        </th>
                        <th className="p-2 min-width-160">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('amount_total'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Total
                          </span>
                        </th>
                        <th className="p-2 min-width-160">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('state'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Status
                          </span>
                        </th>
                        {columns.some((selectedValue) => selectedValue.includes('partner_ref')) && (
                          <th className="p-2 min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('partner_ref'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Partner Reference
                            </span>
                          </th>
                        )}
                        {columns.some((selectedValue) => selectedValue.includes('display_name')) && (
                          <th className="p-2 min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('display_name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Display Name
                            </span>
                          </th>
                        )}
                        {columns.some((selectedValue) => selectedValue.includes('requisition_id')) && (
                          <th className="p-2 min-width-200">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('display_name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Purchase Agreement
                            </span>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {!loading && quotationInfo.data.map((rfq, index) => (
                        <tr key={rfq.id}>
                          <td className="w-5">
                            <div className="checkbox">
                              <Input
                                type="checkbox"
                                value={rfq.id}
                                id={`checkboxtk${index}`}
                                className="ml-0"
                                name={rfq.name}
                                checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(rfq.id))}
                                onChange={handleTableCellChange}
                              />
                              <Label htmlFor={`checkboxtk${index}`} />
                            </div>
                          </td>
                          <td aria-hidden="true" className="cursor-pointer w-20 p-2" onClick={() => { dispatch(setInitialValues(false, false, false, false)); setViewId(rfq.id); }}>
                            <span className="font-weight-600">{getDefaultNoValue(rfq.name)}</span>
                          </td>
                          <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(getCompanyTimezoneDate(rfq.date_order, userInfo, 'datetime'))}</span></td>
                          <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(rfq.partner_id ? rfq.partner_id[1] : '')}</span></td>
                          <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(rfq.company_id ? rfq.company_id[1] : '')}</span></td>
                          <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(getCompanyTimezoneDate(rfq.date_planned, userInfo, 'datetime'))}</span></td>
                          <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(rfq.user_id ? rfq.user_id[1] : '')}</span></td>
                          <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{rfq.amount_untaxed ? `${rfq.amount_untaxed} Rs` : '0.00 Rs'}</span></td>
                          <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{rfq.amount_total ? `${rfq.amount_total} Rs` : '0.00 Rs'}</span></td>
                          <td className="w-15 p-2">
                            <span className={`text-${getRfqStateColor(rfq.state)} d-inline-block`}>{getStatusLabel(rfq.state)}</span>
                          </td>
                          {columns.some((selectedValue) => selectedValue.includes('partner_ref')) && (
                            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(rfq.partner_ref)}</span></td>
                          )}
                          {columns.some((selectedValue) => selectedValue.includes('display_name')) && (
                            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(rfq.display_name ? rfq.display_name : '')}</span></td>
                          )}
                          {columns.some((selectedValue) => selectedValue.includes('requisition_id')) && (
                            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(rfq.requisition_id ? rfq.requisition_id[1] : '')}</span></td>
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
                {((quotationInfo && quotationInfo.err) || isUserError) && (
                  <ErrorContent errorTxt={errorMsg} />
                )}
              </div>
            </CardBody>
          </Card>
        )}
    </>
  );
};

RfqList.defaultProps = {
  isPo: false,
  collapse: false,
};

RfqList.propTypes = {
  offsetNumber: PropTypes.number.isRequired,
  pageVal: PropTypes.number.isRequired,
  getStatusValue: PropTypes.func.isRequired,
  isPo: PropTypes.bool,
  collapse: PropTypes.bool,
};

export default RfqList;
