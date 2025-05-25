/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Col, Row, Card, Label, FormGroup, Input, CardTitle, CardBody, Table, Modal, ModalBody,
  Popover, PopoverHeader, PopoverBody,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Tooltip, Drawer } from 'antd';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faTimesCircle, faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import DrawerHeader from '@shared/drawerHeader';
import ErrorContent from '@shared/errorContent';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import editIcon from '@images/icons/edit.svg';
import Loader from '@shared/loading';

import CreateList from '@shared/listViewFilters/create';
import AddColumns from '@shared/listViewFilters/columns';
import Upload from '@shared/listViewFilters/upload';
import DetailNavigation from '@shared/navigation';
import ExportList from '@shared/listViewFilters/export';
import BulkUpload from '@shared/bulkUpload';

import editWhiteIcon from '@images/icons/editWhite.svg';
import eyeBlack from '@images/icons/eyeBlack.svg';
import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import memberTemplate from '@images/templates/team_member_template.xlsx';

import {
  generateErrorMessage, getPagesCount, getDefaultNoValue, getTotalCount,
  getAllowedCompanies, getColumnArrayById, getListOfModuleOperations,
  getArrayFromValuesByItem,
} from '../../util/appUtils';
import {
  getTeamMembersCount, getTeamMembersInfo, getUserDetails, resetCreateUser, getAllowComapaniesData,
  resetUserDetails, resetAllowedCompanyDetails, resetUpdateUser, resetUsersCount,
} from '../setupService';
import siteConfigureData from './data/siteConfigureData.json';
import AddUser from '../companyConfiguration/addUser/addUser';
import { setInitialValues } from '../../purchase/purchaseService';
import TeamMemberDetail from './teamMemberDetails/teamMemberDetail';
import DataExport from './teamMembersDataExport/dataExport';
import actionCodes from '../data/actionCodes.json';
import customData from './teamMemberDetails/data/customData.json';
import ActionMembers from './actionMembers';
import fieldsArgs from './data/importFields.json';
import Refresh from '@shared/listViewFilters/refresh';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const faIcons = {
  APPROVE: faCheckCircle,
  APPROVEACTIVE: faCheckCircle,
  CANCEL: faTimesCircle,
  CANCELACTIVE: faTimesCircle,
};

const TeamMembers = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const {
    teamMemberInfo, companyDetail, teamMemberCountLoading, teamMemberCount, createUserInfo, updateUserInfo,
    userDetails, allowCompanies, deleteTeamInfo,
  } = useSelector((state) => state.setup);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [addTeamModal, showAddTeamModal] = useState(false);
  const [columns, setColumns] = useState(siteConfigureData && siteConfigureData.teamMemberTableColumnsShow ? siteConfigureData.teamMemberTableColumnsShow : []);
  const classes = useStyles();
  const [editUserModal, showEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [viewId, setViewId] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [isSearch, setSearch] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [bulkUploadModal, showBulkUploadModal] = useState(false);

  const defaultActionText = 'Actions';

  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [reload, setReload] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
  };

  useEffect(() => {
    if ((selectedUser && selectedUser.id) && (userInfo && userInfo.data)) {
      dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, undefined, selectedUser.id));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (viewId && (userInfo && userInfo.data)) {
      dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, undefined, viewId));
    }
  }, [viewId]);

  useEffect(() => {
    if ((updateUserInfo && updateUserInfo.data) && (userInfo && userInfo.data)) {
      const id = selectedUser ? selectedUser.id : viewId;
      dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, undefined, id));
    }
  }, [updateUserInfo]);

  useEffect(() => {
    if (createUserInfo && createUserInfo.data && createUserInfo.data.length) {
      dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, undefined, createUserInfo.data[0]));
    }
  }, [createUserInfo]);

  const loading = (teamMemberInfo && teamMemberInfo.loading) || (companyDetail && companyDetail.loading) || teamMemberCountLoading;

  useEffect(() => {
    (async () => {
      if (companyDetail && companyDetail.data && companyDetail.data.length) {
        await dispatch(getTeamMembersInfo(companyDetail.data[0].id, appModels.TEAMMEMEBERS, limit, offset, sortBy, sortField, searchValue));
      }
    })();
  }, [companyDetail, offset, sortBy, sortField, isSearch, reload]);

  useEffect(() => {
    (async () => {
      if ((companyDetail && companyDetail.data && companyDetail.data.length) && (createUserInfo && createUserInfo.data)) {
        await dispatch(getTeamMembersInfo(companyDetail.data[0].id, appModels.TEAMMEMEBERS, limit, offset, sortBy, sortField, searchValue));
      }
    })();
  }, [createUserInfo]);

  useEffect(() => {
    (async () => {
      if ((companyDetail && companyDetail.data && companyDetail.data.length) && (updateUserInfo && updateUserInfo.data)) {
        await dispatch(getTeamMembersInfo(companyDetail.data[0].id, appModels.TEAMMEMEBERS, limit, offset, sortBy, sortField, searchValue));
      }
    })();
  }, [updateUserInfo]);

  useEffect(() => {
    if ((companyDetail && companyDetail.data && companyDetail.data.length) && (updateUserInfo && updateUserInfo.data)) {
      dispatch(getTeamMembersCount(companyDetail.data[0].id, appModels.TEAMMEMEBERS, searchValue));
    }
  }, [updateUserInfo]);

  useEffect(() => {
    if ((companyDetail && companyDetail.data && companyDetail.data.length) && (deleteTeamInfo && deleteTeamInfo.data)) {
      const id = selectedUser ? selectedUser.id : viewId;
      dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, undefined, id));
      dispatch(getTeamMembersCount(companyDetail.data[0].id, appModels.TEAMMEMEBERS, searchValue));
      dispatch(getTeamMembersInfo(companyDetail.data[0].id, appModels.TEAMMEMEBERS, limit, offset, sortBy, sortField, searchValue));
    }
  }, [deleteTeamInfo]);

  useEffect(() => {
    if (userDetails && userDetails.data && userDetails.data[0].company_ids && userDetails.data[0].company_ids.length > 0) {
      dispatch(getAllowComapaniesData(appModels.COMPANY, userDetails.data[0].company_ids));
    }
  }, [selectedUser, userDetails]);

  useEffect(() => {
    if (companyDetail && companyDetail.data && companyDetail.data.length) {
      dispatch(getTeamMembersCount(companyDetail.data[0].id, appModels.TEAMMEMEBERS, searchValue));
    }
  }, [companyDetail, isSearch]);

  useEffect(() => {
    if ((companyDetail && companyDetail.data && companyDetail.data.length) && (createUserInfo && createUserInfo.data)) {
      dispatch(getTeamMembersCount(companyDetail.data[0].id, appModels.TEAMMEMEBERS, searchValue));
    }
  }, [createUserInfo]);

  const pages = getPagesCount(teamMemberCount, limit);

  useEffect(() => {
    if (customData && customData.actionTypes && customData.actionTypes[selectedActions]) {
      setActionText(customData.actionTypes[selectedActions].text);
      setActionCode(customData.actionTypes[selectedActions].value);
      showActionModal(true);
    }
  }, [enterAction]);

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const onResetUserInfo = () => {
    dispatch(resetUserDetails());
    dispatch(resetAllowedCompanyDetails());
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const showDetailsView = (id) => {
    dispatch(setInitialValues(false, false, false, false));
    setViewId(id);
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
      const data = teamMemberInfo && teamMemberInfo.data ? teamMemberInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = teamMemberInfo && teamMemberInfo.data ? teamMemberInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const onAddReset = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    dispatch(resetCreateUser());
    showAddTeamModal(false);
  };

  function getRow(teamMemberData) {
    const tableTr = [];
    for (let i = 0; i < teamMemberData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="w-5">
            <div className="checkbox">
              <Input
                type="checkbox"
                value={teamMemberData[i].id}
                id={`checkboxtk${teamMemberData[i].id}`}
                className="ml-0"
                name={teamMemberData[i].name}
                checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(teamMemberData[i].id))}
                onChange={handleTableCellChange}
              />
              <Label htmlFor={`checkboxtk${teamMemberData[i].id}`} />
            </div>
          </td>
          <td
            aria-hidden="true"
            className="p-2 font-weight-600 cursor-pointer"
            onClick={() => showDetailsView(teamMemberData[i].id)}
          >
            {teamMemberData[i].name}
          </td>
          <td className="p-2">{teamMemberData[i].maintenance_team_ids.length}</td>
          <td className="p-2">{getDefaultNoValue(teamMemberData[i].email)}</td>
          <td className="p-2">{getDefaultNoValue(teamMemberData[i].associates_to)}</td>
          <td className="p-2 text-info font-weight-800">{getDefaultNoValue(teamMemberData[i].state)}</td>
          {columns.some((selectedValue) => selectedValue.includes('vendor_id')) && (
            <td className="p-2">{getDefaultNoValue(teamMemberData[i].vendor_id ? teamMemberData[i].vendor_id[1] : '')}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('employee_id_seq')) && (
            <td className="p-2">{getDefaultNoValue(teamMemberData[i].employee_id_seq)}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('hr_department')) && (
            <td className="p-2">{getDefaultNoValue(teamMemberData[i].hr_department ? teamMemberData[i].hr_department[1] : '')}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('resource_calendar_id')) && (
            <td className="p-2">{getDefaultNoValue(teamMemberData[i].resource_calendar_id ? teamMemberData[i].resource_calendar_id[1] : '')}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
            <td className="p-2">{getDefaultNoValue(teamMemberData[i].company_id[1] ? teamMemberData[i].company_id[1] : '')}</td>
          )}
          <td className="p-2">
            <Tooltip title="View">
              <img
                src={eyeBlack}
                aria-hidden="true"
                className="ml-2 cursor-pointer"
                height="12"
                width="12"
                alt="View"
                onClick={() => showDetailsView(teamMemberData[i].id)}
              />
            </Tooltip>
            {allowedOperations.includes(actionCodes['Edit Team Member']) && (
              <Tooltip title="Edit">
                <img
                  aria-hidden="true"
                  src={editIcon}
                  className="ml-3 cursor-pointer"
                  height="12"
                  width="12"
                  alt="edit"
                  onClick={() => { showEditUserModal(true); setSelectedUser(teamMemberData[i]); }}
                />
              </Tooltip>
            )}
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  const onResetEdit = () => {
    showEditUserModal(false);
    dispatch(resetUpdateUser());
    dispatch(resetUsersCount());
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  function checkActionAllowed(actionName) {
    let allowed = false;
    const whState = userDetails && userDetails.data ? userDetails.data[0].state : '';
    if (whState === 'Cancelled') {
      allowed = false;
    }
    if (actionName === 'Approve' && (whState === 'Registered')) {
      allowed = true;
    }
    if (actionName === 'Cancel' && (whState === 'Registered' || whState === 'Approved')) {
      allowed = true;
    }
    return allowed;
  }

  const directModal = () => {
    showAddTeamModal(false);
    if (createUserInfo && createUserInfo.data && createUserInfo.data.length) {
      setViewId(createUserInfo.data[0]);
    }
    dispatch(resetCreateUser());
    dispatch(resetUsersCount());
  };

  const onUploadClose = () => {
    if (companyDetail && companyDetail.data && companyDetail.data.length) {
      dispatch(getTeamMembersCount(companyDetail.data[0].id, appModels.TEAMMEMEBERS, searchValue));
      dispatch(getTeamMembersInfo(companyDetail.data[0].id, appModels.TEAMMEMEBERS, limit, offset, sortBy, sortField, searchValue));
    }
    showBulkUploadModal(false);
  };

  return (
    <>
      {viewId ? (
        <div className="card h-100 bg-lightblue admin-maintenance-team-list-card">
          <Row>
            <Col sm="12" md="12" lg="12" xs="12">
              <Card className="bg-lightblue border-0 p-2 h-100">
                <CardTitle className=" mb-0">
                  <DetailNavigation
                    overviewName=""
                    overviewPath=""
                    listName="Maintenance Team Members List"
                    detailName={userDetails && (userDetails.data && userDetails.data.length > 0) ? userDetails.data[0].name : ''}
                    afterList={() => { setOffset(offset); setPage(page); setViewId(0); }}
                  />
                  <span className="float-right">
                    {(!userDetails.loading) && (
                      <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="mr-2">
                        <DropdownToggle caret className={selectedActionImage !== '' ? 'bg-white text-navy-blue pt-1 pb-1 text-left' : 'btn-navyblue pt-1 pb-1 text-left'}>
                          {selectedActionImage !== ''
                            ? (
                              <FontAwesomeIcon
                                className="mr-2"
                                color="primary"
                                icon={faIcons[`${selectedActionImage}ACTIVE`]}
                              />
                            ) : ''}
                          <span className="font-weight-700">
                            {selectedActions}
                          </span>
                        </DropdownToggle>
                        <DropdownMenu className="w-100">
                          {customData && customData.actionItems.map((actions) => (
                            <DropdownItem
                              id="switchAction"
                              className="pl-2"
                              key={actions.id}
                              disabled={!checkActionAllowed(actions.displayname)}
                              onClick={() => switchActionItem(actions)}
                            >
                              <FontAwesomeIcon
                                className="mr-2"
                                icon={faIcons[actions.name]}
                              />
                              {actions.displayname}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </ButtonDropdown>
                    )}
                    {(!userDetails.loading) && allowedOperations.includes(actionCodes['Add Team Member']) && (
                      <Button
                         variant="contained"
                        size="sm"
                        onClick={() => { setSelectedUser(userDetails && (userDetails.data && userDetails.data.length > 0) ? userDetails.data[0] : false); showEditUserModal(true); }}
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
          <TeamMemberDetail />
          {actionModal && (
            <ActionMembers
              atFinish={() => {
                showActionModal(false);
                setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              actionText={actionText}
              actionCode={actionCode}
              details={userDetails}
              actionModal
            />
          )}
        </div>
      ) : (
        <Card className="p-2 bg-lightblue admin-team-member-table">
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2">
              <Col sm="12" md="5" lg="5" xs="12">
                <div className="content-inline">
                  <span className="p-0 font-weight-600 font-medium mr-2">
                    Team Members:
                    {' '}
                    {getTotalCount(teamMemberCount)}
                  </span>

                </div>
              </Col>
              <Col sm="12" md="7" lg="7" xs="12">
                <Row className="content-center m-0">
                  <Col sm="9" md="9" lg="9" xs="12" className="mt-n15px">
                    <FormGroup className="m-0">
                      <Input
                        type="input"
                        name="search"
                        value={searchValue}
                        id="exampleSearch"
                        placeholder="Search"
                        onChange={onSearchChange}
                        onKeyDown={onSearchChange}
                        className="subjectticket bw-2 mt-2"
                      />
                      {searchValue && searchValue.length
                        ? (
                          <>
                            <FontAwesomeIcon
                              className="float-right mr-32px cursor-pointer mt-n6per"
                              size="sm"
                              type="reset"
                              onClick={() => {
                                setSearchValue('');
                                setPage(1);
                                setOffset(0);
                                setSearch(Math.random());
                              }}
                              icon={faTimesCircle}
                            />
                            <FontAwesomeIcon
                              className="float-right mr-2 cursor-pointer mt-n6per"
                              size="sm"
                              onClick={() => {
                                setSearch(Math.random());
                                setPage(1);
                                setOffset(0);
                              }}
                              icon={faSearch}
                            />
                          </>
                        ) : ''}
                    </FormGroup>
                  </Col>
                  <Col md="3" xs="12" sm="3" lg="3">
                    <div className="float-right">
                      <Refresh
                        loadingTrue={loading}
                        setReload={setReload}
                      />
                      {allowedOperations.includes(actionCodes['Add Team Member']) && (
                        <>
                          <Upload setEnable={() => showBulkUploadModal(true)} />
                          <CreateList name="Add Team Member" showCreateModal={() => { onResetUserInfo(); showAddTeamModal(true); setSelectedUser(null); }} />
                        </>
                      )}
                      <AddColumns
                        columns={siteConfigureData && siteConfigureData.teamMemberTableColumns ? siteConfigureData.teamMemberTableColumns : []}
                        handleColumnChange={handleColumnChange}
                        columnFields={columns}
                      />
                      <ExportList response={teamMemberInfo && teamMemberInfo.data && teamMemberInfo.data.length} />
                    </div>
                    {bulkUploadModal && (
                      <BulkUpload
                        atFinish={() => {
                          onUploadClose();
                        }}
                        targetModel={appModels.TEAMMEMEBERS}
                        modalTitle="Team Member Bulk Upload"
                        modalMsg="Team Members are uploaded successfully..."
                        testFields={fieldsArgs.fields}
                        uploadFields={fieldsArgs.ulpoadFields}
                        sampleTamplate={memberTemplate}
                        labels={fieldsArgs.fieldLabels}
                        bulkUploadModal
                      />
                    )}
                    {teamMemberInfo && teamMemberInfo.data && teamMemberInfo.data.length && (
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
                            searchValue={searchValue}
                          />
                        </PopoverBody>
                      </Popover>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            {teamMemberInfo && teamMemberInfo.data && (
              <Col lg="12" md="12" sm="12" xs="12">
                <Table responsive className="mb-0 mt-3 font-weight-400 border-0">
                  <thead className="bg-lightgrey">
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
                        <span>
                          Teams
                        </span>
                      </th>
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('email'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Email
                        </span>
                      </th>
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('associates_to'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Associated To
                        </span>
                      </th>
                      <th className="p-2 min-width-160">
                        <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('state'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                          Status
                        </span>
                      </th>
                      {columns.some((selectedValue) => selectedValue.includes('vendor_id')) && (
                        <th className="p-2 min-width-160">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('vendor_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Associated Entity
                          </span>
                        </th>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('employee_id_seq')) && (
                        <th className="p-2 min-width-160">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('employee_id_seq'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Employee ID
                          </span>
                        </th>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('hr_department')) && (
                        <th className="p-2 min-width-160">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('hr_department'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Department
                          </span>
                        </th>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('resource_calendar_id')) && (
                        <th className="p-2 min-width-160">
                          <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('resource_calendar_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                            Shift
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
                      <th className="p-2 min-width-100">
                        <span>
                          Action
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRow(teamMemberInfo.data)}
                  </tbody>
                </Table>
                <hr className="m-0" />
              </Col>
            )}
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}

            {loading && (
              <div className="mb-3 mt-3">
                <Loader />
              </div>
            )}
            {(teamMemberInfo && teamMemberInfo.err) && (
              <ErrorContent errorTxt={generateErrorMessage(teamMemberInfo)} />
            )}
            <Drawer
              title=""
              closable={false}
              className="drawer-bg-lightblue ant-drawer"
              width={1250}
              visible={addTeamModal}
            >

              <DrawerHeader
                title="Create Team Member"
                imagePath={false}
                closeDrawer={onAddReset}
              />
              <AddUser
                afterReset={() => { showAddTeamModal(false); onAddReset(); }}
                closeEditModal={() => { showAddTeamModal(false); }}
                directToView={directModal}
              />
            </Drawer>
          </CardBody>
        </Card>
      )}
      <Modal size={(updateUserInfo && updateUserInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={editUserModal}>
        <ModalHeaderComponent title="Edit Team Member" imagePath={false} closeModalWindow={() => { showEditUserModal(false); setSelectedUser(null); onResetEdit(); }} response={updateUserInfo} />
        <ModalBody className="mt-0 pt-0">
          {userDetails && userDetails.data && allowCompanies && allowCompanies.data && (
            <AddUser
              afterReset={() => { showEditUserModal(false); setSelectedUser(null); onResetEdit(); }}
              directToView={false}
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
    </>
  );
};

export default TeamMembers;
