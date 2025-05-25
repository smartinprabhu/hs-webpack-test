/* eslint-disable max-len */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import Table from '@mui/material/Table';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect, useMemo } from 'react';
import {
  Badge, Card, CardBody, Col, CardTitle, Row, Modal, ModalBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';
import uniqBy from 'lodash/unionBy';

import editWhiteIcon from '@images/icons/editWhite.svg';
import editIcon from '@images/icons/edit.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import DynamicColumns from '@shared/filters/dynamicColumns';
import DynamicCheckboxFilter from '@shared/filters/dynamicCheckboxFilter';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import TableListFormat from '@shared/tableListFormat';
import CreateList from '@shared/listViewFilters/create';
import Loader from '@shared/loading';
import DetailNavigation from '@shared/navigation';
import maintenanceData from '../maintenanceConfiguration/data/maintenanceData.json';
import filtersFields from './filterFields.json';
import CustomTable from '../../shared/customTable';
import {
  getPagesCountV2, generateErrorMessage, getAllowedCompanies,
  getListOfModuleOperations, getColumnArrayById, getArrayFromValuesByItem, getCompanyTimezoneDate,
  queryGeneratorV1,
} from '../../util/appUtils';
import { getActiveText } from '../employees/utils/utils';
import {
  getAllowComapaniesData, getUserDetails, getUserFilters, resetCreateUser,
  resetUserDetails, resetAllowedCompanyDetails, getRolesGroups, getUsersList, getUsersCount,
} from '../setupService';
import {
  setSorting,
} from '../../assets/equipmentService';
import AddUser from './addUser/addUser';
import UserInfo from './userInfo';
import { setInitialValues } from '../../purchase/purchaseService';
import actionCodes from '../data/actionCodes.json';
import Refresh from '@shared/listViewFilters/refresh';
import { AdminSetupModule } from '../../util/field';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const appModels = require('../../util/appModels').default;

const AdminUser = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [customFilters, setCustomFilters] = useState([]);
  const [columnFields, setColumns] = useState(maintenanceData && maintenanceData.listfieldsShows ? maintenanceData.listfieldsShows : []);
  const [addUserModal, showAddUserModal] = useState(false);
  const [editUserModal, showEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewId, setViewId] = useState(0);
  const [viewModal, setViewModal] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [valueArray, setValueArray] = useState([]);
  const [openCompany, setOpenCompany] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [statusGroups, setStatusGroups] = useState([]);
  const [companyGroups, setCompanyGroups] = useState([]);
  const [reload, setReload] = useState(false);

  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { sortedValue } = useSelector((state) => state.equipment);
  const companiesAllowed = getAllowedCompanies(userInfo);
  const {
    userCount, userListInfo, userCountLoading, userDetails,
    userFilters, allowCompanies, updateUserInfo, createUserInfo, roleGroupsInfo, allowedCompanies,
  } = useSelector((state) => state.setup);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const searchColumns = AdminSetupModule.adminSearchColumn;
  const advanceSearchColumns = AdminSetupModule.adminAdvanceSearchColumn;

  const hiddenColumns = AdminSetupModule.adminHiddenColumn;

  const stateValuesList = (userFilters && userFilters.customFilters && userFilters.customFilters.length > 0)
    ? userFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  useEffect(() => {
    if ((userInfo && userInfo.data) && openStatus) {
      dispatch(getRolesGroups(companiesAllowed, appModels.USERROLE));
    }
  }, [userInfo, openStatus]);

  useEffect(() => {
    dispatch(getUserFilters([]));
  }, []);

  const getPickingData = (array) => {
    const pickData = array;
    for (let i = 0; i < pickData.length; i += 1) {
      const pickValue = `${pickData[i].name}`;
      pickData[i].role_ids = [pickData[i].id, pickValue];
    }
    return pickData;
  };

  useEffect(() => {
    if (roleGroupsInfo && roleGroupsInfo.data) {
      const pickingGroup = getPickingData(roleGroupsInfo.data);
      setStatusGroups(pickingGroup);
    }
  }, [roleGroupsInfo]);

  const getPickingCompany = (array) => {
    const pickData = array;
    for (let i = 0; i < pickData.length; i += 1) {
      const pickValue = `${pickData[i].name}`;
      pickData[i].company_id = [pickData[i].id, pickValue];
    }
    return pickData;
  };

  useEffect(() => {
    if (openCompany && userCompanies) {
      const pickingGroup = getPickingCompany(userCompanies);
      setCompanyGroups(pickingGroup);
    }
  }, [openCompany, userCompanies]);

  useEffect(() => {
    dispatch(setSorting({ sortBy: false, sortField: false }));
  }, []);

  useEffect(() => {
    if (selectedUser && selectedUser.id && userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getUserDetails(companiesAllowed, appModels.TEAMMEMEBERS, selectedUser.id));
    }
  }, [selectedUser]);

  useEffect(() => {
    if ((userDetails && userDetails.data && userDetails.data[0].company_ids && userDetails.data[0].company_ids.length > 0)) {
      dispatch(getAllowComapaniesData(appModels.COMPANY, userDetails.data[0].company_ids));
    }
  }, [selectedUser, userDetails]);

  useEffect(() => {
    if (updateUserInfo && updateUserInfo.data && userInfo && userInfo.data && userInfo.data.company) {
      const id = userDetails && userDetails.data ? userDetails.data[0].user_id[0] : '';
      dispatch(getUserDetails(companiesAllowed, appModels.TEAMMEMEBERS, id));
    }
  }, [updateUserInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getUserDetails(companiesAllowed, appModels.TEAMMEMEBERS, viewId));
    }
  }, [userInfo, viewId]);

  useEffect(() => {
    if (userFilters && userFilters.customFilters) {
      setCustomFilters(userFilters.customFilters);
    }
  }, [userFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = userFilters.customFilters ? queryGeneratorV1(userFilters.customFilters) : '';
      dispatch(getUsersCount(companiesAllowed, appModels.USER, customFiltersList));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = userFilters.customFilters ? queryGeneratorV1(userFilters.customFilters) : '';
      dispatch(getUsersList(companiesAllowed, appModels.USER, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, offset, sortedValue, customFilters, reload]);

  const totalDataCount = userCount && userCount.length ? userCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const onReset = () => {
    dispatch(resetCreateUser());
  };

  const onResetUserInfo = () => {
    showAddUserModal(true);
    dispatch(resetUserDetails());
    dispatch(resetAllowedCompanyDetails());
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
      const data = userListInfo && userListInfo.data ? userListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = userListInfo && userListInfo.data ? userListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter((item) => item.value !== cfValue);
    dispatch(getUserFilters(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = userFilters && userFilters.customFilters ? userFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getUserFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];
    if (startDate && endDate) {
      start = `${moment(startDate).utc().format('YYYY-MM-DD')} 18:30:59`;
      end = `${moment(endDate).add(1, 'day').utc().format('YYYY-MM-DD')} 18:30:59`;
    }
    if (startDate && endDate) {
      filters = [{
        key: value, value, label: value, type: 'customdate', start, end,
      }];
    }
    if (start && end) {
      const oldCustomFilters = userFilters && userFilters.customFilters ? userFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
      dispatch(getUserFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  const onClickClear = () => {
    dispatch(getUserFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.columns ? filtersFields.columns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenCompany(false);
    setOpenStatus(false);
  };

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const columns = useMemo(() => filtersFields && filtersFields.columns, []);
  const data = useMemo(() => (userListInfo && userListInfo.data && userListInfo.data.length > 0 ? userListInfo.data : [{}]), [userListInfo.data]);
  const initialState = {
    hiddenColumns,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    allColumns,
  } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useFilters,
    useSortBy,
    usePagination,
  );

  useEffect(() => {
    if (openCompany) {
      // setKeyword(' ');
      setOpenStatus(false);
    }
  }, [openCompany]);

  useEffect(() => {
    if (openStatus) {
      // setKeyword(' ');
      setOpenCompany(false);
    }
  }, [openStatus]);

  const onChangeFilter = (column, text) => {
    column.value = column.value === undefined ? '' : column.value;
    let array = valueArray;
    const filterArray = [];
    if (column.value) {
      array.push(column);
      array = uniqBy(array, 'Header');
      array.map((key) => {
        const filters = {
          key: key.key ? key.key : key.id,
          title: key.title ? key.title : key.Header,
          value: encodeURIComponent(key.value),
          label: key.label ? key.label : key.Header,
          type: key.type ? key.type : text,
          arrayLabel: key.label,
        };
        if (key.start && key.end) {
          filters.start = key.start;
          filters.end = key.end;
        }
        filterArray.push(filters);
      });
      setOffset(0);
      setPage(1);
      const customFiltersList = [];
      const mergeFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getUserFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const advanceSearchjson = {
    company_id: setOpenCompany,
    role_ids: setOpenStatus,
  };

  const handleStatusChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'role_ids', title: 'Role', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getUserFilters(customFiltersList));
      removeData('data-role_ids');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getUserFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCompanyChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'company_id', title: 'Company', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getUserFilters(customFiltersList));
      removeData('data-company_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getUserFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const dateFilters = (userFilters && userFilters.customFilters && userFilters.customFilters.length > 0) ? userFilters.customFilters : [];
  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (userListInfo && userListInfo.loading) || (userCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (userListInfo && userListInfo.err) ? generateErrorMessage(userListInfo) : userErrorMsg;

  return (

    <Row className="pt-2">
      <Col sm="12" md="12" lg="12" xs="12">
        <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
          {viewId ? (
            <div className="card h-100">
              <Row>
                <Col sm="12" md="12" lg="12" xs="12">
                  <Card className="bg-lightblue border-0 pr-2 pl-2 h-100">
                    <CardTitle className="mt-2 mb-0">
                      <Row>
                        <Col sm="12" md="9" lg="9" xs="12" className="card-mb-3">
                          <DetailNavigation
                            overviewName="Company Configuration"
                            overviewPath="/site-configuration"
                            listName="Admin user list"
                            detailName={userDetails && (userDetails.data && userDetails.data.length > 0) ? userDetails.data[0].name : ''}
                            afterList={() => { setOffset(offset); setPage(page); setViewId(0); }}
                          />
                        </Col>
                        <Col sm="12" md="3" lg="3" xs="12">
                          <span className="float-right">
                            {allowedOperations.includes(actionCodes['Edit User']) && (
                            <Button
                               variant="contained"
                              size="sm"
                              onClick={() => { dispatch(setInitialValues(false, false, false)); showEditUserModal(true); }}
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
                        </Col>
                      </Row>
                    </CardTitle>
                    <hr className="mt-1 mb-1 border-color-grey" />
                  </Card>
                </Col>
              </Row>
              <UserInfo />
              <Modal size={(createUserInfo && createUserInfo.data) || (updateUserInfo && updateUserInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={editUserModal}>
                <ModalHeaderComponent title="Edit User" imagePath={false} closeModalWindow={() => { showEditUserModal(false); }} response={updateUserInfo} />
                <ModalBody className="mt-0 pt-0">
                  {userDetails && userDetails.data && allowCompanies && allowCompanies.data && (
                  <AddUser
                    afterReset={() => { showEditUserModal(false); onReset(); }}
                    selectedUser={selectedUser}
                  />
                  )}
                  {((userDetails && userDetails.loading) || (allowCompanies && allowCompanies.loading)) && (
                  <div className="mt-5 text-center" data-testid="loading-case">
                    <Loader />
                  </div>
                  )}
                </ModalBody>
              </Modal>
            </div>
          ) : (
            <Card className="p-2 mb-2 h-100 bg-lightblue">
              <CardBody className="bg-color-white p-1 m-0">
                <Row className="p-2 itAsset-table-title">
                  <Col md="9" xs="12" sm="9" lg="9">
                    <span className="p-0 mr-2 font-weight-800 font-medium">
                      Admin User List :
                      {' '}
                      {columnHide && columnHide.length && totalDataCount}
                    </span>
                    {columnHide && columnHide.length ? (
                      <div className="content-inline">
                        {customFilters && customFilters.length ? customFilters.map((cf) => (
                          <p key={cf.value} className="mr-2 content-inline">
                            <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                              {(cf.type === 'inarray') ? (
                                <>
                                  {cf.title}
                                  <span>
                                    {'  '}
                                    :
                                    {' '}
                                    {decodeURIComponent(cf.arrayLabel ? cf.arrayLabel : cf.label)}
                                  </span>
                                </>
                              ) : (
                                cf.label
                              )}
                              {' '}
                              {(cf.type === 'text' || cf.type === 'id') && (
                              <span>
                                {'  '}
                                :
                                {' '}
                                {decodeURIComponent(cf.value)}
                              </span>
                              )}
                              {(cf.type === 'customdate') && (
                              <span>
                                {'  '}
                                :
                                {' '}
                                {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
                                {' - '}
                                {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
                              </span>
                              )}
                              <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                            </Badge>
                          </p>
                        )) : ''}
                        {customFilters && customFilters.length ? (
                          <span aria-hidden="true" onClick={() => onClickClear()} className="cursor-pointer text-info mr-2">
                            Clear
                          </span>
                        ) : ''}
                      </div>
                    ) : ''}
                  </Col>
                  <Col md="3" xs="12" sm="3" lg="3">
                    <div className="float-right">
                        <Refresh
                          loadingTrue={loading}
                          setReload={setReload}
                        />
                      <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                      {allowedOperations.includes(actionCodes['Add User']) && (
                      <CreateList name="Add User" showCreateModal={() => onResetUserInfo()} />
                      )}
                      <DynamicColumns
                        setColumns={setColumns}
                        columnFields={columnFields}
                        allColumns={allColumns}
                        setColumnHide={setColumnHide}
                      />
                    </div>
                  </Col>
                </Row>
                {(userListInfo && userListInfo.data && userListInfo.data.length > 0) && (
                <span data-testid="success-case" />
                )}
                <div className="thin-scrollbar">
                  <div className="table-responsive common-table">
                    <Table responsive {...getTableProps()} className="mt-2 max-width">
                      <CustomTable
                        isAllChecked={isAllChecked}
                        handleTableCellAllChange={handleTableCellAllChange}
                        searchColumns={searchColumns}
                        advanceSearchColumns={advanceSearchColumns}
                        advanceSearchFunc={advanceSearchjson}
                        onChangeFilter={onChangeFilter}
                        removeData={removeData}
                        setKeyword={setKeyword}
                        handleTableCellChange={handleTableCellChange}
                        checkedRows={checkedRows}
                        setViewId={setViewId}
                        setViewModal={setViewModal}
                        tableData={userListInfo}
                        checklistStateLabelFunction={getActiveText}
                        tableProps={{
                          page,
                          prepareRow,
                          getTableBodyProps,
                          headerGroups,
                        }}
                      />
                    </Table>
                    {openStatus && (
                    <DynamicCheckboxFilter
                      data={roleGroupsInfo}
                      selectedValues={stateValues}
                      dataGroup={statusGroups}
                      filtervalue="role_ids"
                      onCheckboxChange={handleStatusChange}
                      toggleClose={() => setOpenStatus(false)}
                      openPopover={openStatus}
                      target="data-role_ids"
                      title="ROLE"
                      keyword={keyword}
                      setDataGroup={setStatusGroups}
                    />
                    )}
                    {openCompany && (
                    <DynamicCheckboxFilter
                      data={userCompanies}
                      selectedValues={stateValues}
                      dataGroup={companyGroups}
                      filtervalue="company_id"
                      onCheckboxChange={handleCompanyChange}
                      toggleClose={() => setOpenCompany(false)}
                      openPopover={openCompany}
                      target="data-company_id"
                      title="COMPANY"
                      keyword={keyword}
                      setDataGroup={setCompanyGroups}
                    />
                    )}
                    {columnHide && columnHide.length ? (
                      <TableListFormat
                        userResponse={userInfo}
                        listResponse={userListInfo}
                        countLoad={userCountLoading}
                      />
                    ) : ''}
                    {columnHide && !columnHide.length ? (
                      <div className="text-center mb-4">
                        Please select the Columns
                      </div>
                    ) : ''}
                  </div>
                  {loading || pages === 0 ? (<span />) : (
                    <div className={`${classes.root} float-right`}>
                      {columnHide && columnHide.length ? (<Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />) : ''}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </Col>
      </Col>
      <Modal
        size={(createUserInfo && createUserInfo.data) || (updateUserInfo && updateUserInfo.data) ? 'sm' : 'xl'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={addUserModal}
      >
        <ModalHeaderComponent title="Add User" imagePath={false} closeModalWindow={() => { showAddUserModal(false); }} response={createUserInfo} />
        <ModalBody className="mt-0 pt-0">
          <AddUser
            afterReset={() => { showAddUserModal(false); onReset(); }}
          />
        </ModalBody>
      </Modal>
    </Row>
  );
};

export default AdminUser;
