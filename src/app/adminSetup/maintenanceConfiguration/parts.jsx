/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import {
  Badge, Card, CardTitle, Collapse, CardBody, Col, Input, Label, Row, Table, UncontrolledTooltip,
  Modal,
  ModalBody,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faTimesCircle,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { Tooltip, Drawer } from 'antd';
import DrawerHeader from '@shared/drawerHeader';

import closeCircleIcon from '@images/icons/closeCircle.svg';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import CreateList from '@shared/listViewFilters/create';
import SearchList from '@shared/listViewFilters/search';
import AddColumns from '@shared/listViewFilters/columns';
import ExportList from '@shared/listViewFilters/export';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import filterIcon from '@images/filter.png';
import collapseIcon from '@images/collapse.png';
import editIcon from '@images/icons/edit.svg';
import productBlack from '@images/icons/productBlack.svg';

import maintenanceData from './data/maintenanceData.json';
import {
  getPagesCount, getTotalCount, generateErrorMessage,
  getLocalDate, getAllowedCompanies,
  getListOfModuleOperations, getArrayFromValuesByItem,
  getColumnArrayById, getCompanyTimezoneDate, getDefaultNoValue, queryGeneratorWithUtc,
} from '../../util/appUtils';
import {
  getParts, getPartsCount, getPartsFilters,
  resetDeleteChecklist,
  getDeleteChecklist,
} from './maintenanceService';
import {
  resetCreateParts, getCheckListData, getActiveStep,
} from '../setupService';
import actionCodes from '../data/actionCodes.json';
import pantryActionCodes from '../../pantryManagement/configuration/data/actionCodes.json';
import { setInitialValues, clearEditProduct } from '../../purchase/purchaseService';
import EditPart from './editPart/editPart';
import DataExport from './partsExport/dataExport';
import AddParts from './addParts';
import Refresh from '@shared/listViewFilters/refresh';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Parts = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [reload, setReload] = useState(false);
  const [page, setPage] = useState(1);
  const [statusValue, setStatusValue] = useState([]);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [customFilterList, setCustomFiltersList] = useState([]);
  const [columns, setColumns] = useState(maintenanceData && maintenanceData.partsTableColumnsShow ? maintenanceData.partsTableColumnsShow : []);
  const [addLink, setAddLink] = useState(false);
  const [customFilters, setCustomFilters] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [filtersIcon, setFilterIcon] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [editData, setEditData] = useState([]);
  const [updateModal, showUpdateModal] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const {
    partsCount, partsListInfo, partsCountLoading,
    partsFilters, checklistDeleteInfo, createPartsInfo,
  } = useSelector((state) => state.maintenance);

  const {
    updateProductInfo,
    filterInitailValues,
  } = useSelector((state) => state.purchase);

  let listTitle = 'Parts';
  let otherTitle = 'Part';
  let pantryProduct = false;
  if (history && history.location && history.location.pathname) {
    const pathName = history.location.pathname;
    if (pathName === '/pantry/configuration') {
      listTitle = 'Product List';
      otherTitle = 'Product';
      pantryProduct = true;
    }
  }
  const allowedOperations = pantryProduct
    ? getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Pantry Management', 'code')
    : getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const menuType = pantryProduct ? 'pantry_product' : 'parts';

  useEffect(() => {
    dispatch(resetDeleteChecklist());
    dispatch(clearEditProduct());
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = partsFilters.customFilters ? queryGeneratorWithUtc(partsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPartsCount(companies, appModels.PARTS, statusValue, customFiltersList, menuType));
    }
  }, [userInfo, statusValue, partsFilters]);

  useEffect(() => {
    if ((userInfo && userInfo.data) || (createPartsInfo && createPartsInfo.data)) {
      const customFiltersList = partsFilters.customFilters ? queryGeneratorWithUtc(partsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getParts(companies, appModels.PARTS, limit, offset, statusValue, customFiltersList, sortBy, sortField, menuType));
      dispatch(resetCreateParts());
    }
  }, [userInfo, offset, sortField, sortBy, statusValue, partsFilters, createPartsInfo, reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (checklistDeleteInfo && checklistDeleteInfo.data)) {
      const customFiltersList = partsFilters.customFilters ? queryGeneratorWithUtc(partsFilters.customFilters,false, userInfo.data) : '';
      dispatch(getPartsCount(companies, appModels.PARTS, statusValue, customFiltersList, menuType));
      dispatch(getParts(companies, appModels.PARTS, limit, offset, statusValue, customFiltersList, sortBy, sortField, menuType));
    }
  }, [checklistDeleteInfo]);

  useEffect(() => {
    if (partsFilters && partsFilters.customFilters) {
      setCustomFilters(partsFilters.customFilters);
    }
  }, [partsFilters]);

  const pages = getPagesCount(partsCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
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
    const { checked } = event.target;
    dispatch(setInitialValues(false, false, false, false));
    if (checked) {
      const data = partsListInfo && partsListInfo.data ? partsListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = partsListInfo && partsListInfo.data ? partsListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
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
    const customFiltersList = customFilters.filter((item) => item.key !== value);
    dispatch(getPartsFilters(customFiltersList));
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
      setCustomFiltersList(filters);
      const oldCustomFilters = partsFilters && partsFilters.customFilters ? partsFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getPartsFilters(customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = partsFilters && partsFilters.customFilters ? partsFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters, ...customFilterList.filter((item) => item !== value)];
      dispatch(getPartsFilters(customFiltersData));
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
      const oldCustomFilters = partsFilters && partsFilters.customFilters ? partsFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getPartsFilters(customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = partsFilters && partsFilters.customFilters ? partsFilters.customFilters : [];
      const customFiltersData = [...oldCustomFilters, ...customFilterList.filter((item) => item !== value)];
      dispatch(getPartsFilters(customFiltersData));
    }
    setOffset(0); setPage(1);
  };

  function searchHandleSubmit(values, { resetForm }) {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    const oldCustomFilters = partsFilters && partsFilters.customFilters ? partsFilters.customFilters : [];
    const customFiltersData = [...oldCustomFilters, ...filters];
    dispatch(getPartsFilters(customFiltersData));
    resetForm({ values: '' });
    setOffset(0); setPage(1);
  }

  const onRemove = (id) => {
    dispatch(getDeleteChecklist(id, appModels.PARTS));
  };

  const openEditModalWindow = (data) => {
    dispatch(clearEditProduct());
    setEditData(data);
    showUpdateModal(true);
  };

  const onRemoveCancel = () => {
    dispatch(resetDeleteChecklist());
    showDeleteModal(false);
  };

  const closeEditModalWindow = () => {
    if ((userInfo && userInfo.data) && (updateProductInfo && updateProductInfo.data)) {
      const customFiltersList = partsFilters.customFilters ? queryGeneratorWithUtc(partsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getParts(companies, appModels.PARTS, limit, offset, statusValue, customFiltersList, sortBy, sortField, menuType));
    }
    dispatch(clearEditProduct());
    setEditData([]);
    showUpdateModal(false);
  };

  const dateFilters = (partsFilters && partsFilters.customFilters && partsFilters.customFilters.length > 0) ? partsFilters.customFilters : [];
  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (partsListInfo && partsListInfo.loading) || (partsCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (partsListInfo && partsListInfo.err) ? generateErrorMessage(partsListInfo) : userErrorMsg;

  const isCreatable = pantryProduct ? allowedOperations.includes(pantryActionCodes['Add Product']) : allowedOperations.includes(actionCodes['Add Part']);
  const isEditable = pantryProduct ? allowedOperations.includes(pantryActionCodes['Edit Product']) : allowedOperations.includes(actionCodes['Edit Part']);
  const isDeleteable = pantryProduct ? allowedOperations.includes(pantryActionCodes['Delete Product']) : allowedOperations.includes(actionCodes['Delete Part']);

  /* if (addLink) {
    if (pantryProduct) {
      return (
        <Redirect to="/pantry/configuration/add-products" />
      );
    }
    return (
      <Redirect to="/maintenance-configuration/add-parts" />
    );
  } */

  const onAddReset = () => {
    const customFiltersList = partsFilters.customFilters ? queryGeneratorWithUtc(partsFilters.customFilters,false, userInfo.data) : '';
    dispatch(getParts(companies, appModels.PARTS, limit, offset, statusValue, customFiltersList, sortBy, sortField, menuType));
    dispatch(getPartsCount(companies, appModels.PARTS, statusValue, customFiltersList, menuType));
    dispatch(resetCreateParts());
    dispatch(getCheckListData([]));
    dispatch(getActiveStep(0));
    setAddLink(false);
  };

  const addWindowOpen = () => {
    dispatch(resetCreateParts());
    dispatch(getCheckListData([]));
    setAddLink(true);
  };

  return (

    <Row className="pt-2">
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12">
        {collapse ? (
          <>
            <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer" id="filters" />
            <UncontrolledTooltip target="filters" placement="right">
              Filters
            </UncontrolledTooltip>
          </>
        ) : (
          <Card className="p-1 bg-lightblue h-100 side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
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
              {statusValue && statusValue.length > 0 && (
                <div
                  aria-hidden="true"
                  className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800"
                  onClick={() => setStatusValue('')}
                  onKeyDown={() => setStatusValue('')}
                >
                  Reset Filters
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </Col>
      <Col className="list" md="12" sm="12" lg={collapse ? 11 : 9} xs="12">
        <Card className={collapse ? 'filter-margin-left p-2 mb-2 h-100 bg-lightblue ' : ' p-2 mb-2 h-100 bg-lightblue'}>
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2">
              <Col md="8" xs="12" sm="8" lg="8">
                <div className="content-inline">
                  <span className="p-0 mr-2 font-weight-800 font-medium">
                    {listTitle}
                    {' '}
                    :
                    {' '}
                    {getTotalCount(partsCount)}
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
                <Refresh
                    loadingTrue={loading}
                    setReload={setReload}
                  />
                  <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                  <SearchList formFields={maintenanceData.fields} searchHandleSubmit={searchHandleSubmit} />
                  {isCreatable && (
                    <CreateList name={`Add ${otherTitle}`} showCreateModal={() => addWindowOpen()} />
                  )}
                  <AddColumns columns={maintenanceData.partsTableColumns} handleColumnChange={handleColumnChange} columnFields={columns} />
                  <ExportList response={partsListInfo && partsListInfo.data && partsListInfo.data.length} />
                </div>
                {partsListInfo && partsListInfo.data && partsListInfo.data.length && (
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
                        menuType={menuType}
                        pantryProduct={pantryProduct}
                        statusValue={statusValue}
                      />
                    </PopoverBody>
                  </Popover>
                )}
              </Col>
            </Row>
            {(partsListInfo && partsListInfo.data) && (
              <span data-testid="success-case" />
            )}
            <div className="thin-scrollbar">
              {(partsListInfo && partsListInfo.data) && (

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
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('list_price'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Sales Price
                        </span>
                      </th>
                      <th className="p-2 min-width-100">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('standard_price'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Cost
                        </span>
                      </th>
                      <th className="p-2 min-width-100">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('weight'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Weight
                        </span>
                      </th>
                      <th className="p-2 min-width-100">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('volume'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Volume
                        </span>
                      </th>
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('create_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Created On
                        </span>
                      </th>
                      {columns.some((selectedValue) => selectedValue.includes('type')) && (
                        <th className="p-2 min-width-100">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('type'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Type
                          </span>
                        </th>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('categ_id')) && (
                        <th className="p-2 min-width-100">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('categ_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Category
                          </span>
                        </th>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                        <th className="p-2 min-width-160">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Company
                          </span>
                        </th>
                      )}
                      {(isEditable || isDeleteable) && (
                        <th className="p-2 min-width-100 text-center">
                          <span>
                            Action
                          </span>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {partsListInfo.data.map((pt) => (

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
                        <td aria-hidden="true" className="w-20">
                          <span className="font-weight-600">{pt.name}</span>
                        </td>
                        <td className="w-15"><span className="font-weight-400 d-inline-block">{pt.list_price ? pt.list_price : '0'}</span></td>
                        <td className="w-15">
                          <span className="font-weight-400 d-inline-block">
                            {pt.standard_price ? `${pt.standard_price}.00` : '0.00'}
                          </span>
                        </td>
                        <td className="w-15"><span className="font-weight-400 d-inline-block">{pt.weight ? `${pt.weight} lb` : '0 lb'}</span></td>
                        <td className="w-15"><span className="font-weight-400 d-inline-block">{pt.volume ? pt.volume : '0'}</span></td>
                        <td className="w-15"><span className="font-weight-400 d-inline-block">{getDefaultNoValue(getCompanyTimezoneDate(pt.create_date, userInfo, 'datetime'))}</span></td>
                        {columns.some((selectedValue) => selectedValue.includes('type')) && (
                          <td>
                            <span className="font-weight-400">
                              {maintenanceData && maintenanceData.productTypes && maintenanceData.productTypes[pt.type] ? maintenanceData.productTypes[pt.type].label : ''}
                            </span>
                          </td>
                        )}
                        {columns.some((selectedValue) => selectedValue.includes('categ_id')) && (
                          <td><span className="font-weight-400">{pt.categ_id ? pt.categ_id[1] : ''}</span></td>
                        )}
                        {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                          <td><span className="font-weight-400">{pt.company_id ? pt.company_id[1] : ''}</span></td>
                        )}
                        {(isEditable || isDeleteable) && (
                          <td className="p-2 w-10 text-center">
                            {isEditable && (
                              <Tooltip title="Edit">
                                <img
                                  aria-hidden="true"
                                  src={editIcon}
                                  className="mr-3 cursor-pointer"
                                  height="12"
                                  width="12"
                                  alt="edit"
                                  onClick={() => { openEditModalWindow(pt); }}
                                />
                              </Tooltip>
                            )}
                            {isDeleteable && (
                              <Tooltip title="Delete">
                                <span className="font-weight-400 d-inline-block" />
                                <FontAwesomeIcon
                                  className="mr-1 ml-1 cursor-pointer"
                                  size="sm"
                                  icon={faTrashAlt}
                                  onClick={() => { setRemoveId(pt.id); setRemoveName(pt.name); showDeleteModal(true); }}
                                />
                              </Tooltip>
                            )}
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
              {loading && (
                <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                  <Loader />
                </div>
              )}

              {((partsListInfo && partsListInfo.err) || isUserError) && (

                <ErrorContent errorTxt={errorMsg} />

              )}
              <Modal size={(checklistDeleteInfo && checklistDeleteInfo.data) ? 'sm' : 'lg'} className="border-radius-50px modal-dialog-centered purchase-modal add-pantry" isOpen={deleteModal}>
                <ModalHeaderComponent title={`Delete ${otherTitle}`} imagePath={false} closeModalWindow={() => onRemoveCancel()} response={checklistDeleteInfo} />
                <ModalBody className="mt-0 pt-0">
                  {checklistDeleteInfo && (!checklistDeleteInfo.data && !checklistDeleteInfo.loading && !checklistDeleteInfo.err) && (
                    <p className="text-center">
                      {`Are you sure, you want to remove ${removeName} ${pantryProduct ? 'product' : 'part'} ?`}
                    </p>
                  )}
                  {checklistDeleteInfo && checklistDeleteInfo.loading && (
                    <div className="text-center mt-3">
                      <Loader />
                    </div>
                  )}
                  {(checklistDeleteInfo && checklistDeleteInfo.err) && (
                    <SuccessAndErrorFormat response={checklistDeleteInfo} />
                  )}
                  {(checklistDeleteInfo && checklistDeleteInfo.data) && (
                    <SuccessAndErrorFormat response={checklistDeleteInfo} successMessage={`${otherTitle} removed successfully..`} />
                  )}
                  <div className="pull-right mt-3">
                    {checklistDeleteInfo && !checklistDeleteInfo.data && (
                      <Button variant="contained" size="sm" disabled={checklistDeleteInfo && checklistDeleteInfo.loading}  onClick={() => onRemove(removeId)}>Confirm</Button>
                    )}
                    {checklistDeleteInfo && checklistDeleteInfo.data && (
                      <Button size="sm"  variant="contained" onClick={() => onRemoveCancel()}>Ok</Button>
                    )}
                  </div>
                </ModalBody>
              </Modal>
              {/* } <Modal size={(updateProductInfo && updateProductInfo.data) ? 'sm' : 'lg'} className="border-radius-50px modal-dialog-centered" isOpen={updateModal}>
                <ModalHeaderComponent title={`Edit ${otherTitle}`} imagePath={false} closeModalWindow={() => closeEditModalWindow()} response={updateProductInfo} />
                <ModalBody className="mt-0 pt-0">
                  {updateProductInfo && !updateProductInfo.data && (
                    <EditPart
                      editData={editData}
                    />
                  )}
                  <ModalFormAlert alertResponse={updateProductInfo} alertText={`${otherTitle} updated successfully..`} />
                  {updateProductInfo && updateProductInfo.data && (<hr />)}
                  <div className="float-right">
                    {updateProductInfo && updateProductInfo.data && (
                    <Button
                      size="sm"
                      type="button"
                       variant="contained"
                      onClick={() => closeEditModalWindow()}
                      disabled={updateProductInfo && updateProductInfo.loading}
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
                visible={updateModal}
              >

                <DrawerHeader
                  title={`Edit ${otherTitle}`}
                  imagePath={productBlack}
                  closeDrawer={() => { showUpdateModal(false); }}
                />
                <EditPart
                  editData={editData}
                  afterReset={() => { closeEditModalWindow(); }}
                  closeEditModal={() => { showUpdateModal(false); }}
                />
              </Drawer>
              <Drawer
                title=""
                closable={false}
                className="drawer-bg-lightblue"
                width={1250}
                visible={addLink}
              >

                <DrawerHeader
                  title={otherTitle}
                  imagePath={productBlack}
                  closeDrawer={() => { setAddLink(false); }}
                />
                <AddParts
                  editId={false}
                  afterReset={() => { onAddReset(); }}
                  closeAddModal={() => { setAddLink(false); }}
                />
              </Drawer>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Parts;
