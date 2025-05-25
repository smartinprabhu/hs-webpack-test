/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import {
  Badge, Card, CardBody, CardTitle, Col, Row, Table,
  Modal, Popover, PopoverBody, PopoverHeader,
  UncontrolledTooltip,
  ModalBody, Input, Label,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import editWhiteIcon from '@images/icons/editWhite.svg';
import editIcon from '@images/icons/edit.svg';
import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import ErrorContent from '@shared/errorContent';
import DetailNavigation from '@shared/navigation';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import AddColumns from '@shared/listViewFilters/columns';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import SearchList from '@shared/listViewFilters/search';
import CreateList from '@shared/listViewFilters/create';
import filterIcon from '@images/filter.png';

import ExportList from '@shared/listViewFilters/export';
import RpDetail from './receivedProductsDetail';
import {
  getPagesCountV2, generateErrorMessage, getArrayFromValuesByItem,prepareDocuments,
  getLocalTime, getDefaultNoValue, getColumnArrayById, getLocalDate,
} from '../../../../util/appUtils';
import SideFilters from './sidebar';
import { getStatusTransferLabel } from '../../utils/utils';
import {
  getTransferFilters, resetUpdateReceiptInfo, getQuotatioDetail, resetAddReceiptInfo, getTransferDetail, setIsPo, setInitialValues, setProductRedirectId,
} from '../../../purchaseService';
import AddReceipt from './addReceipt/addReceipt';
import filtersFields from './filters/filtersFields.json';
import DataExport from './dataExport/dataExport';
import {onDocumentCreatesAttach} from '../../../../helpdesk/ticketService'
const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const ReceiveProducts = (props) => {
  const { match } = props;
  const isPurchaseOrder = match.path.includes('purchaseorder');
  const { params } = match;
  const { id } = params;
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [viewId, setViewId] = useState(0);
  const [page, setPage] = useState(1);
  const [statusValue, setStatusValue] = useState(0);
  const [orderValue, setOrderValue] = useState(0);
  const [checkItems, setCheckItems] = useState([]);
  const [checkOrderItems, setCheckOrderItems] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkTypeItems, setCheckTypeItems] = useState([]);
  const [typeValue, setTypeValue] = useState(0);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [isClosed, setIsClosed] = useState(false);
  const [addRfqModal, showAddRfqModal] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [editId, setEditId] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [transferIds, setTransferIds] = useState([]);
  const [isButtonHover1, setButtonHover1] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [columnsList, setColumnsList] = useState(['name', 'partner_id', 'scheduled_date', 'origin', 'backorder_id', 'state']);

  const classes = useStyles();

  const { userInfo } = useSelector((state) => state.user);
  const {
    transfersInfo,
    transferFilters, stockScrapInfo, quotationDetails, transferDetails,
    addReceiptInfo, updateReceiptInfo, filterInitailValues, stateChangeInfo, backorderInfo,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getTransferFilters([], [], [], []));
    }
  }, [userInfo]);

  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (addReceiptInfo && addReceiptInfo.data && addReceiptInfo.data.length &&uploadPhoto&&uploadPhoto.length) {
      const dcreate = prepareDocuments(uploadPhoto, addReceiptInfo.data[0]);
      dispatch(onDocumentCreatesAttach(dcreate));
    }
  }, [userInfo, addReceiptInfo]);

  useEffect(() => {
    if (quotationDetails && quotationDetails.data && quotationDetails.data.length > 0) {
      setTransferIds(quotationDetails.data[0].picking_ids);
    }
  }, [quotationDetails]);

  useEffect(() => {
    if (isPurchaseOrder) {
      dispatch(setIsPo(true));
    }
  }, [isPurchaseOrder]);

  useEffect(() => {
    if (id && (Object.keys(quotationDetails).length) <= 0) {
      dispatch(getQuotatioDetail(id, appModels.PURCHASEORDER));
    }
  }, [id]);

  useEffect(() => {
    if (id && (stockScrapInfo && stockScrapInfo.data)) {
      dispatch(getQuotatioDetail(id, appModels.PURCHASEORDER));
    }
  }, [stockScrapInfo]);

  useEffect(() => {
    if (id && (stateChangeInfo && stateChangeInfo.data)) {
      dispatch(getQuotatioDetail(id, appModels.PURCHASEORDER));
    }
  }, [stateChangeInfo]);

  useEffect(() => {
    if (id && (backorderInfo && (backorderInfo.data || backorderInfo.status))) {
      dispatch(getQuotatioDetail(id, appModels.PURCHASEORDER));
    }
  }, [backorderInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
  }, [viewId]);

  useEffect(() => {
    if (editId && updateReceiptInfo && updateReceiptInfo.data) {
      dispatch(getTransferDetail(editId, appModels.STOCK));
    }
  }, [updateReceiptInfo]);

  useEffect(() => {
    if (transferFilters && transferFilters.statuses) {
      setCheckItems(transferFilters.statuses);
    }
    if (transferFilters && transferFilters.orderes) {
      setCheckOrderItems(transferFilters.orderes);
    }
    if (transferFilters && transferFilters.types) {
      setCheckTypeItems(transferFilters.types);
    }
    if (transferFilters && transferFilters.customFilters) {
      setCustomFilters(transferFilters.customFilters);
    }
  }, [transferFilters]);

  const totalDataCount = transfersInfo && transfersInfo.data && transfersInfo.data.length ? transfersInfo.data.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
  };

  const handleStatusClose = (value) => {
    setStatusValue(value);
    setOrderValue(0);
    setTypeValue(0);
    setIsClosed(Math.random());
    setCheckItems(checkItems.filter((item) => item.id !== value));
    setOffset(0); setPage(1);
  };

  const handleOrderClose = (value) => {
    setOrderValue(value);
    setStatusValue(0);
    setTypeValue(0);
    setIsClosed(Math.random());
    setCheckOrderItems(checkOrderItems.filter((item) => item.id !== value));
    setOffset(0); setPage(1);
  };

  const handleTypeClose = (value) => {
    setTypeValue(value);
    setStatusValue(0);
    setOrderValue(0);
    setIsClosed(Math.random());
    setCheckTypeItems(checkTypeItems.filter((item) => item.id !== value));
    setOffset(0); setPage(1);
  };

  const onReset = () => {
    if (addReceiptInfo && addReceiptInfo.data) {
      dispatch(getQuotatioDetail(id, appModels.PURCHASEORDER));
    }
    dispatch(resetUpdateReceiptInfo());
    dispatch(resetAddReceiptInfo());
    setEdit(false);
    setEditId(false);
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
      const data = transfersInfo && transfersInfo.data ? transfersInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = transfersInfo && transfersInfo.data ? transfersInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const states = transferFilters && transferFilters.statuses ? transferFilters.statuses : [];
    const orders = transferFilters && transferFilters.orderes ? transferFilters.orderes : [];
    const types = transferFilters && transferFilters.types ? transferFilters.types : [];
    const customFiltersList1 = customFilters.filter((item) => item.key !== value);
    dispatch(getTransferFilters(states, orders, types, customFiltersList1));
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (quotationDetails && quotationDetails.loading) || (transfersInfo && transfersInfo.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (transfersInfo && transfersInfo.err) ? generateErrorMessage(transfersInfo) : userErrorMsg;

  const rfqName = quotationDetails && quotationDetails.data ? quotationDetails.data[0].name : '';

  const handleSearchFilter = (values, { resetForm }) => {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    setCustomFilters([...customFilters.filter((item) => item.type !== 'text'), ...filters]);
    const states = transferFilters && transferFilters.statuses ? transferFilters.statuses : [];
    const orders = transferFilters && transferFilters.orderes ? transferFilters.orderes : [];
    const types = transferFilters && transferFilters.types ? transferFilters.types : [];
    const customFiltersList1 = [...customFilters.filter((item) => item.type !== 'text'), ...filters];
    dispatch(getTransferFilters(states, orders, types, customFiltersList1));
    resetForm({ values: '' });
    setOffset(0); setPage(1);
  };

  const dateFilters = transferFilters && transferFilters.customFilters && transferFilters.customFilters.length > 0 ? transferFilters.customFilters : [];

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    const states = transferFilters && transferFilters.statuses ? transferFilters.statuses : [];
    const orders = transferFilters && transferFilters.orderes ? transferFilters.orderes : [];
    const types = transferFilters && transferFilters.types ? transferFilters.types : [];
    const oldCustomFilters = transferFilters && transferFilters.customFilters ? transferFilters.customFilters : [];

    if (checked) {
      setCustomFiltersList(filters);
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getTransferFilters(states, orders, types, customFiltersData));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getTransferFilters(states, orders, types, customFiltersData));
    }
    setOffset(0); setPage(1);
  };

  const handleCustomDateChange = (start, end) => {
    const value = 'Custom';
    const filters = [{
      key: value, value, label: value, type: 'customdate', start, end,
    }];
    const states = transferFilters && transferFilters.statuses ? transferFilters.statuses : [];
    const orders = transferFilters && transferFilters.orderes ? transferFilters.orderes : [];
    const types = transferFilters && transferFilters.types ? transferFilters.types : [];
    const oldCustomFilters = transferFilters && transferFilters.customFilters ? transferFilters.customFilters : [];

    if (start && end) {
      setCustomFiltersList(filters);
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getTransferFilters(states, orders, types, customFiltersData));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getTransferFilters(states, orders, types, customFiltersData));
    }
    setOffset(0); setPage(1);
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
      setColumnsList((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
      setColumnsList(columnsList.filter((item) => item !== value));
    }
  };

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 pr-3 pl-3 pb-3 pt-0 border">
      <Col sm="12" md="12" lg="12" xs="12" className="p-0">
        <CardBody className="p-0">
          <>
            <Row className="m-2">
              <Col md={6} xs={7} className="pr-0">
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12} className="pl-0">
                    <span
                      aria-hidden="true"
                      className="font-weight-800 mr-1 font-medium link-text"
                      onClick={() => { dispatch(setProductRedirectId(false)); }}
                    >
                      <Link to={isPurchaseOrder ? '/purchase/purchaseorders' : '/purchase/requestforquotation'}>
                        {isPurchaseOrder ? 'Purchase Order' : 'Request for Quotation'}
                      </Link>
                      {' '}
                      /
                    </span>
                    <span aria-hidden="true" className="font-weight-800 link-text font-medium cursor-pointer" onClick={() => { dispatch(setProductRedirectId(id)); }}>
                      <Link to={isPurchaseOrder ? '/purchase/purchaseorders' : '/purchase/requestforquotation'}>
                        {rfqName}
                      </Link>
                      {' '}
                      /
                    </span>
                    <span className="font-weight-400 ml-1 font-16">
                      Transfers
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col md={6} sm={6} lg={6} xs={12} className="p-0">
                <span className="text-right desktop-view">
                  <Link to={isPurchaseOrder ? '/purchase/purchaseorders' : '/purchase/requestforquotation'}>
                    <Button
                      variant="contained"
                      onClick={() => { dispatch(setInitialValues(false, false, false, false)); dispatch(setProductRedirectId(id)); }}
                      size="sm"
                      className="hoverColor bg-white pb-1 pt-1 tab_nav_link rounded-pill float-right mb-1"
                    >
                      <span>Cancel </span>
                      <FontAwesomeIcon className="ml-2" size="sm" icon={faTimesCircle} />
                    </Button>
                  </Link>
                </span>
              </Col>
            </Row>
            <hr className="extend-line mt-0" />
          </>
          <Row>
            <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2' : 'pt-2 pl-2 pr-2'}>
              {collapse ? (
                <>
                  <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer" id="filters" />
                  <UncontrolledTooltip target="filters" placement="right">
                    Filters
                  </UncontrolledTooltip>
                </>
              ) : (
                <>
                  <SideFilters
                    offset={offset}
                    id={viewId}
                    ids={transferIds && transferIds.length ? transferIds : false}
                    isAll={false}
                    isClosed={isClosed}
                    statusValue={statusValue}
                    orderValue={orderValue}
                    typeValue={typeValue}
                    afterReset={() => { setPage(1); setOffset(0); }}
                    sortBy={sortBy}
                    sortField={sortField}
                    setCollapse={setCollapse}
                    collapse={collapse}
                  />
                </>
              )}
            </Col>
            <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1' : 'pl-1 pt-2 pr-2'}>
              {viewId ? (
                <div className={collapse ? 'filter-margin-right card h-100' : 'card h-100'}>
                  <Row>
                    <Col sm="12" md="12" lg="12" xs="12">
                      <Card className="bg-lightblue border-0 p-2 h-100">
                        <CardTitle className=" mb-0">
                          <DetailNavigation
                            overviewName=""
                            overviewPath=""
                            listName="Transfers"
                            detailName={transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0].name : ''}
                            afterList={() => { setOffset(offset); setPage(page); setViewId(0); }}
                          />
                          <span className="float-right">
                            {transferDetails && (transferDetails.data && transferDetails.data.length > 0 && transferDetails.data[0].state && transferDetails.data[0].state !== 'done')
                               && (!transferDetails.loading) && (
                               <Button
                                 variant="contained"
                                 size="sm"
                                 onClick={() => { setEditId(transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0].id : false); setEdit(!isEdit); }}
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
                  <RpDetail />
                  <Modal size={(updateReceiptInfo && updateReceiptInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={isEdit}>
                    <ModalHeaderComponent title="Edit Transfer" imagePath={false} closeModalWindow={onReset} response={updateReceiptInfo} />
                    <ModalBody className="pt-0 mt-0">
                      {(updateReceiptInfo && !updateReceiptInfo.data && !updateReceiptInfo.loading) && (
                        <AddReceipt id={id} editId={editId} afterReset={() => onReset()} />
                      )}
                      {updateReceiptInfo && updateReceiptInfo.loading && (
                        <div className="text-center mt-3">
                          <Loader />
                        </div>
                      )}
                      {(updateReceiptInfo && updateReceiptInfo.err) && (
                        <SuccessAndErrorFormat response={updateReceiptInfo} />
                      )}
                      {(updateReceiptInfo && updateReceiptInfo.data) && (
                        <SuccessAndErrorFormat
                          response={updateReceiptInfo}
                          successMessage="Receipt updated successfully..."
                        />
                      )}
                      {updateReceiptInfo && updateReceiptInfo.data && (<hr />)}
                      <div className="float-right">
                        {updateReceiptInfo && updateReceiptInfo.data && (
                          <Button
                            size="sm"
                            type="button"
                            variant="contained"
                            onClick={() => onReset()}
                            disabled={updateReceiptInfo && updateReceiptInfo.loading}
                          >
                            OK
                          </Button>
                        )}
                      </div>
                    </ModalBody>
                  </Modal>
                </div>
              )
                : (
                  quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0) && (
                    <Card className={collapse ? 'filter-margin-right negative-margin-left-15px p-2 mb-2 h-100 bg-lightblue' : 'p-2 mb-2 h-100 bg-lightblue'}>
                      <CardBody className="bg-color-white p-1 m-0">
                        <Row className="p-2">
                          <Col md="8" xs="12" sm="8" lg="8">
                            <div className="content-inline">
                              <span className="p-0 mr-2 font-weight-800 font-medium">
                                Transfers :
                                {' '}
                                {totalDataCount}
                              </span>
                              {(checkItems) && checkItems.map((st) => (
                                <p key={st.id} className="mr-2 content-inline">
                                  <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                                    {st.label}
                                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(st.id)} size="sm" icon={faTimesCircle} />
                                  </Badge>
                                </p>
                              ))}
                              {(checkOrderItems) && checkOrderItems.map((st) => (
                                <p key={st.id} className="mr-2 content-inline">
                                  <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                                    {st.label}
                                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleOrderClose(st.id)} size="sm" icon={faTimesCircle} />
                                  </Badge>
                                </p>
                              ))}
                              {(checkTypeItems) && checkTypeItems.map((tp) => (
                                <p key={tp.id} className="mr-2 content-inline">
                                  <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                                    {tp.label}
                                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleTypeClose(tp.id)} size="sm" icon={faTimesCircle} />
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
                              <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                              <SearchList formFields={filtersFields.fields} searchHandleSubmit={handleSearchFilter} />
                              <CreateList name="Add Transfer" showCreateModal={() => { setEditId(false); showAddRfqModal(true); }} />
                              <AddColumns columns={filtersFields.tableColumns} handleColumnChange={handleColumnChange} columnFields={columns} />
                              <ExportList response={(transfersInfo && transfersInfo.data && transfersInfo.data.length > 0)} />
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
                              <PopoverBody><DataExport afterReset={() => dispatch(setInitialValues(false, false, false, false))} fields={columnsList} /></PopoverBody>
                            </Popover>
                            <Modal size={(addReceiptInfo && addReceiptInfo.data) ? 'sm' : 'xl'} className="border-radius-50px purchase-modal" isOpen={addRfqModal}>
                              <ModalHeaderComponent title="Add Transfer" imagePath={false} closeModalWindow={() => { showAddRfqModal(false); onReset(); }} response={addReceiptInfo} />
                              <ModalBody className="mt-0 pt-0">
                                <AddReceipt
                                  id={id}
                                  editId={false}
                                  afterReset={() => { showAddRfqModal(false); onReset(); }}
                                />
                              </ModalBody>
                            </Modal>
                          </Col>
                        </Row>

                        {(transfersInfo && transfersInfo.data) && (
                        <span data-testid="success-case" />
                        )}
                        <div className="thin-scrollbar">
                          {(transfersInfo && transfersInfo.data) && (

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
                                    Reference
                                  </span>
                                </th>
                                <th className="p-2 min-width-160">
                                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('partner_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                    Partner
                                  </span>
                                </th>
                                <th className="p-2 min-width-160">
                                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('scheduled_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                    Scheduled Date
                                  </span>
                                </th>
                                <th className="p-2 min-width-160">
                                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('origin'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                    Source Document
                                  </span>
                                </th>
                                <th className="p-2 min-width-200">
                                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('backorder_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                    Back Order of
                                  </span>
                                </th>
                                <th className="p-2 min-width-100">
                                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('state'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                    Status
                                  </span>
                                </th>
                                {columns.some((selectedValue) => selectedValue.includes('picking_type_id')) && (
                                <th className="min-width-160 p-2">
                                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('picking_type_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                    Operation Type
                                  </span>
                                </th>
                                )}
                                {columns.some((selectedValue) => selectedValue.includes('location_id')) && (
                                <th className="min-width-160 p-2">
                                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('location_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                    Source Location
                                  </span>
                                </th>
                                )}
                                {columns.some((selectedValue) => selectedValue.includes('location_dest_id')) && (
                                <th className="min-width-200 p-2">
                                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('location_dest_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                    Destination Location
                                  </span>
                                </th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {!loading && transfersInfo.data.map((transfer, index) => (

                                <tr key={transfer.id}>
                                  <td className="w-5">
                                    <div className="checkbox">
                                      <Input
                                        type="checkbox"
                                        value={transfer.id}
                                        id={`checkboxtk${index}`}
                                        className="ml-0"
                                        name={transfer.name}
                                        checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(transfer.id))}
                                        onChange={handleTableCellChange}
                                      />
                                      <Label htmlFor={`checkboxtk${index}`} />
                                    </div>
                                  </td>
                                  <td aria-hidden="true" className="cursor-pointer w-20 p-2" onClick={() => { dispatch(setInitialValues(false, false, false, false)); setViewId(transfer.id); }}>
                                    <span className="font-weight-600">{getDefaultNoValue(transfer.name)}</span>
                                  </td>
                                  <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(transfer.partner_id ? transfer.partner_id[1] : '')}</span></td>
                                  <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(getLocalTime(transfer.scheduled_date))}</span></td>
                                  <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(transfer.origin ? transfer.origin : '')}</span></td>
                                  <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{transfer.backorder_id ? transfer.backorder_id[1] : '-'}</span></td>
                                  <td className="w-15 p-2"><span className="font-weight-400 d-inline-block">{getStatusTransferLabel(transfer.state)}</span></td>
                                  {columns.some((selectedValue) => selectedValue.includes('picking_type_id')) && (
                                  <td className="p-2">
                                    <span className="font-weight-400">
                                      {transfer.picking_type_id && transfer.picking_type_id.length > 0 ? transfer.picking_type_id[1] : getDefaultNoValue(transfer.picking_type_id)}
                                    </span>
                                  </td>
                                  )}
                                  {columns.some((selectedValue) => selectedValue.includes('location_id')) && (
                                  <td className="p-2">
                                    <span className="font-weight-400">
                                      {transfer.location_id && transfer.location_id.length > 0 ? transfer.location_id[1] : getDefaultNoValue(transfer.location_id)}
                                    </span>
                                  </td>
                                  )}
                                  {columns.some((selectedValue) => selectedValue.includes('location_dest_id')) && (
                                  <td className="p-2">
                                    <span className="font-weight-400">
                                      {transfer.location_dest_id && transfer.location_dest_id.length > 0 ? transfer.location_dest_id[1] : getDefaultNoValue(transfer.location_dest_id)}
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
                        </div>
                        {loading && (
                        <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                          <Loader />
                        </div>
                        )}

                        {((transfersInfo && transfersInfo.err) || isUserError) && (

                        <ErrorContent errorTxt={errorMsg} />

                        )}

                        {((quotationDetails && quotationDetails.err) || isUserError) && (

                        <ErrorContent errorTxt={generateErrorMessage(quotationDetails)} />

                        )}
                      </CardBody>
                    </Card>
                  )
                )}

            </Col>
          </Row>
        </CardBody>
      </Col>
    </Row>
  );
};

ReceiveProducts.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
};

export default ReceiveProducts;
