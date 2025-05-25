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

import DrawerHeader from '@shared/drawerHeader';
import PurchaseHandBlue from '@images/icons/purchaseHandBlue.svg';
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
import {
  getPagesCountV2, generateErrorMessage, getArrayFromValuesByItem, getDefaultNoValue,
  getCompanyTimezoneDate, getColumnArrayById, isArrayValueExists, getLocalDate, getListOfModuleOperations,
} from '../../util/appUtils';
import SideFilters from './sidebar';
import DataExport from './dataExport/dataExport';
import customData from './data/customData.json';
import {
  getVendorFilters, resetAddVendorInfo, getVendorDetail, getCheckedRowsVendor, setInitialValues,
} from '../purchaseService';
import {
  resetUpdateTenant,
} from '../../adminSetup/setupService';
import AddVendor from './addVendor';
import VendorDetail from './vendorDetails/vendorDetail';
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

const Vendors = () => {
  const limit = 10;
  const subMenu = 'Purchase Info';
  const subTabMenu = 'Vendors';
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [statusValue, setStatusValue] = useState(0);
  const [langValue, setLangValue] = useState(0);
  const [checkItems, setCheckItems] = useState([]);
  const [checkLangItems, setCheckLangItems] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [customFilterList, setCustomFiltersList] = useState([]);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [addVendorModal, showAddVendorModal] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [editId, setEditId] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [columns, setColumns] = useState(['name', 'mobile', 'lang', 'street', 'company_type', 'create_date']);

  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'code');
  const {
    vendorsCount, vendorsInfo, vendorCountLoading,
    vendorFilters, addVendorInfo, vendorDetails, filterInitailValues,
  } = useSelector((state) => state.purchase);

  const { tenantUpdateInfo } = useSelector((state) => state.setup);

  useEffect(() => {
    if (vendorFilters && vendorFilters.statuses) {
      setCheckItems(vendorFilters.statuses);
    }
    if (vendorFilters && vendorFilters.languages) {
      setCheckLangItems(vendorFilters.languages);
    }
    if (vendorFilters && vendorFilters.customFilters) {
      setCustomFilters(vendorFilters.customFilters);
      const vid = isArrayValueExists(vendorFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [vendorFilters]);

  useEffect(() => {
    if (viewId) {
      dispatch(getVendorDetail(viewId, appModels.PARTNER));
    }
  }, [viewId]);

  useEffect(() => {
    if ((tenantUpdateInfo && tenantUpdateInfo.data)) {
      dispatch(getVendorDetail(viewId, appModels.PARTNER));
    }
  }, [tenantUpdateInfo]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsVendor(payload));
  }, [checkedRows]);

  const totalDataCount = vendorsCount && vendorsCount.length ? vendorsCount.length : 0;

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
      const data = vendorsInfo && vendorsInfo.data ? vendorsInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = vendorsInfo && vendorsInfo.data ? vendorsInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const isCreatable = allowedOperations.includes(actionCodes['Add vendors']);
  const isEditable = allowedOperations.includes(actionCodes['Edit vendors']);
  const isViewable = allowedOperations.includes(actionCodes['View vendors']);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleStatusClose = (value) => {
    setStatusValue(value);
    setLangValue(0);
    setCheckItems(checkItems.filter((item) => item.id !== value));
  };

  const handleLangClose = (value) => {
    setLangValue(value);
    setStatusValue(0);
    setCheckItems(checkLangItems.filter((item) => item.id !== value));
  };

  const onReset = () => {
    dispatch(resetAddVendorInfo());
  };

  const showDetailsView = (id) => {
    if (isViewable) {
      dispatch(setInitialValues(false, false, false, false));
      setViewId(id);
    }
  };

  const closeEditModalWindow = () => {
    if (document.getElementById('vendorForm')) {
      document.getElementById('vendorForm').reset();
    }
    dispatch(resetUpdateTenant());
    setEdit(false);
    setEditId(false);
  };

  /* const addVendorWindow = () => {
    dispatch(resetVendorBank());
    showAddVendorModal(true);
  }; */

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const states = vendorFilters && vendorFilters.statuses ? vendorFilters.statuses : [];
    const languages = vendorFilters && vendorFilters.languages ? vendorFilters.languages : [];
    const customFiltersList = customFilters.filter((item) => item.key !== value);
    dispatch(getVendorFilters(states, languages, customFiltersList));
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFiltersList(filters);
      const oldCustomFilters = vendorFilters && vendorFilters.customFilters ? vendorFilters.customFilters : [];
      const states = vendorFilters && vendorFilters.statuses ? vendorFilters.statuses : [];
      const languages = vendorFilters && vendorFilters.languages ? vendorFilters.languages : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getVendorFilters(states, languages, customFilters1));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = vendorFilters && vendorFilters.customFilters ? vendorFilters.customFilters : [];
      const states = vendorFilters && vendorFilters.statuses ? vendorFilters.statuses : [];
      const languages = vendorFilters && vendorFilters.languages ? vendorFilters.languages : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getVendorFilters(states, languages, customFilters1));
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
      const oldCustomFilters = vendorFilters && vendorFilters.customFilters ? vendorFilters.customFilters : [];
      const states = vendorFilters && vendorFilters.statuses ? vendorFilters.statuses : [];
      const languages = vendorFilters && vendorFilters.languages ? vendorFilters.languages : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getVendorFilters(states, languages, customFilters1));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = vendorFilters && vendorFilters.customFilters ? vendorFilters.customFilters : [];
      const states = vendorFilters && vendorFilters.statuses ? vendorFilters.statuses : [];
      const languages = vendorFilters && vendorFilters.languages ? vendorFilters.languages : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getVendorFilters(states, languages, customFilters1));
    }
    setOffset(0); setPage(1);
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    const oldCustomFilters = vendorFilters && vendorFilters.customFilters ? vendorFilters.customFilters : [];
    const states = vendorFilters && vendorFilters.statuses ? vendorFilters.statuses : [];
    const languages = vendorFilters && vendorFilters.languages ? vendorFilters.languages : [];
    const customFilters1 = [...oldCustomFilters, ...filters];
    resetForm({ values: '' });
    setOffset(0); setPage(1);
    dispatch(getVendorFilters(states, languages, customFilters1));
  };

  const dateFilters = (vendorFilters && vendorFilters.customFilters && vendorFilters.customFilters.length > 0) ? vendorFilters.customFilters : [];

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (vendorsInfo && vendorsInfo.loading) || (vendorCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (vendorsInfo && vendorsInfo.err) ? generateErrorMessage(vendorsInfo) : userErrorMsg;

  const addAdjustmentWindow = () => {
    if (document.getElementById('vendorForm')) {
      document.getElementById('vendorForm').reset();
    }
    showAddVendorModal(true);
  };
  return (

    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border purchase-module">
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
            languageValue={langValue}
            afterReset={() => { setPage(page); setOffset(offset); }}
            sortBy={sortBy}
            sortField={sortField}
            setCollapse={setCollapse}
            collapse={collapse}
            setCheckRows={setCheckRows}
          />
        )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1 list' : 'list pl-1 pt-2 pr-2'}>
        {viewId ? (
          <div className={collapse ? 'filter-margin-right card h-100' : 'card h-100 bg-lightblue'}>
            <Row>
              <Col sm="12" md="12" lg="12" xs="12">
                <Card className="bg-lightblue border-0 p-2 h-100">
                  <CardTitle className=" mb-0">
                    <DetailNavigation
                      overviewName=""
                      overviewPath=""
                      listName="Vendors"
                      detailName={vendorDetails && (vendorDetails.data && vendorDetails.data.length > 0) ? vendorDetails.data[0].name : ''}
                      afterList={() => { setOffset(offset); setPage(page); setViewId(0); }}
                    />
                    <span className="float-right">
                      {vendorDetails && (vendorDetails.data && vendorDetails.data.length > 0)
                        && (!vendorDetails.loading && isEditable) && (
                        <Button
                           variant="contained"
                          size="sm"
                          onClick={() => { setEditId(vendorDetails && (vendorDetails.data && vendorDetails.data.length > 0) ? vendorDetails.data[0].id : false); setEdit(!isEdit); }}
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
            <VendorDetail />
            {/*  <Modal size={(tenantUpdateInfo && tenantUpdateInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={isEdit}>
              <ModalHeaderComponent title="Edit Vendor" imagePath={false} closeModalWindow={closeEditModalWindow} response={tenantUpdateInfo} />
              <ModalBody className="pt-0 mt-0">
                {(tenantUpdateInfo && !tenantUpdateInfo.data && !tenantUpdateInfo.loading) && (
                  <AddVendor editId={editId} afterReset={() => closeEditModalWindow()} />
                )}
                {tenantUpdateInfo && tenantUpdateInfo.loading && (
                  <div className="text-center mt-3">
                    <Loader />
                  </div>
                )}
                {(tenantUpdateInfo && tenantUpdateInfo.data) && (
                  <SuccessAndErrorFormat
                    response={tenantUpdateInfo}
                    successMessage="Vendor updated successfully..."
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
                title="Update Vendor"
                imagePath={PurchaseHandBlue}
                closeDrawer={closeEditModalWindow}
              />
              <AddVendor
                editId={editId}
                afterReset={() => closeEditModalWindow()}
                closeEditModal={() => setEdit(false)}
              />
            </Drawer>
          </div>
        ) : (
          <Card className={collapse ? 'filter-margin-right p-2 mb-2 h-100 bg-lightblue' : 'p-2 mb-2 h-100 bg-lightblue'}>
            <CardBody className="bg-color-white p-1 m-0">
              <Row className="p-2">
                <Col md="8" xs="12" sm="8" lg="8">
                  <div className="content-inline">
                    <span className="p-0 mr-2 font-weight-800 font-medium">
                      Vendor List :
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
                    {(checkLangItems) && checkLangItems.map((st) => (
                      <p key={st.id} className="mr-2 content-inline">
                        <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                          {st.label}
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleLangClose(st.id)} size="sm" icon={faTimesCircle} />
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
                    <SearchList formFields={filtersFields.fields} searchHandleSubmit={searchHandleSubmit} />
                    {isCreatable && (
                    <CreateList name="Add Vendor" showCreateModal={addAdjustmentWindow} />
                    )}
                    <AddColumns columns={customData.tableColumnsVendor} handleColumnChange={handleColumnChange} columnFields={columns} />
                    <ExportList response={(vendorsInfo && vendorsInfo.data && vendorsInfo.data.length > 0)} />
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
                  {/*  <Modal size={(addVendorInfo && addVendorInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={addVendorModal}>
                    <ModalHeaderComponent title="Add Vendor" imagePath={false} closeModalWindow={() => { showAddVendorModal(false); onReset(); }} response={addVendorInfo} />
                    <ModalBody className="mt-0 pt-0">
                      <AddVendor
                        editId={false}
                        afterReset={() => { showAddVendorModal(false); onReset(); }}
                      />
                    </ModalBody>
                    </Modal> */}
                  <Drawer
                    title=""
                    closable={false}
                    className="drawer-bg-lightblue"
                    width={1250}
                    visible={addVendorModal}
                  >

                    <DrawerHeader
                      title="Create Vendors"
                      imagePath={PurchaseHandBlue}
                      closeDrawer={() => { showAddVendorModal(false); onReset(); }}
                    />
                    <AddVendor
                      editId={false}
                      afterReset={() => { onReset(); }}
                      closeAddModal={() => { showAddVendorModal(false); }}
                    />
                  </Drawer>
                </Col>
              </Row>
              {(vendorsInfo && vendorsInfo.data) && (
              <span data-testid="success-case" />
              )}
              <div className="thin-scrollbar">
                {(vendorsInfo && vendorsInfo.data) && (

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
                      <th className="p-2 min-width-100">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_type'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Type
                        </span>
                      </th>
                      <th className="p-2 min-width-200">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('create_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Create Date
                        </span>
                      </th>
                      <th className="p-2 min-width-100">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('mobile'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Mobile
                        </span>
                      </th>
                      <th className="p-2 min-width-100">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('lang'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Language
                        </span>
                      </th>
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('street'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Address
                        </span>
                      </th>
                      {columns.some((selectedValue) => selectedValue.includes('email')) && (
                      <th className="min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('email'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Email
                        </span>
                      </th>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                      <th className="min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Company
                        </span>
                      </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>

                    {vendorsInfo.data.map((ven, index) => (

                      <tr key={ven.id}>
                        <td className="w-5">
                          <div className="checkbox">
                            <Input
                              type="checkbox"
                              value={ven.id}
                              id={`checkboxtk${index}`}
                              className="ml-0"
                              name={ven.name}
                              checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(ven.id))}
                              onChange={handleTableCellChange}
                            />
                            <Label htmlFor={`checkboxtk${index}`} />
                          </div>
                        </td>
                        <td aria-hidden="true" className="cursor-pointer w-20" onClick={() => showDetailsView(ven.id)}>
                          <span className="font-weight-600">{ven.name}</span>
                        </td>
                        <td className="w-15">
                          <span className="font-weight-400 d-inline-block">
                            {customData && customData.companyTypeNames && customData.companyTypeNames[ven.company_type] ? customData.companyTypeNames[ven.company_type].label : ''}
                          </span>
                        </td>
                        <td className="w-15"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(getCompanyTimezoneDate(ven.create_date, userInfo, 'datetime'))}</span></td>
                        <td className="w-15"><span className="font-weight-400 d-inline-block">{ven.mobile}</span></td>
                        <td className="w-15">
                          <span className="font-weight-400 d-inline-block">
                            {customData && customData.langugageTypes && customData.langugageTypes[ven.lang] ? customData.langugageTypes[ven.lang].label : ''}
                          </span>
                        </td>
                        <td className="w-15"><span className="font-weight-400 d-inline-block">{ven.street}</span></td>
                        {columns.some((selectedValue) => selectedValue.includes('email')) && (
                        <td><span className="font-weight-400">{ven.email}</span></td>
                        )}
                        {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                        <td><span className="font-weight-400">{ven.company_id ? ven.company_id[1] : ''}</span></td>
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

                {((vendorsInfo && vendorsInfo.err) || isUserError) && (

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

export default Vendors;
