/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import {
  Button, Dialog, DialogContent, DialogContentText,
  Drawer,
} from '@mui/material';
import { Box } from '@mui/system';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import teamMemberIcon from '@images/teamMemberBlue.svg';
import DialogHeader from '../../commonComponents/dialogHeader';

import CommonGrid from '../../commonComponents/commonGridEditable';
import DrawerHeader from '../../commonComponents/drawerHeader';

import { UserColumns } from '../../commonComponents/gridColumnsEditable';
import { updateHeaderData } from '../../core/header/actions';
import actionCodes1 from '../../hrUsers/data/actionCodes.json';
import TeamMemberDetail from '../../hrUsers/teamMembers/teamMemberDetails/teamMembersDetail';
import {
  debounce,
  formatFilterData,
  getActiveTab,
  getAllowedCompanies,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations,
  getListOfOperations,
  getNextPreview,
  getTabs,
  queryGeneratorWithUtc,
  valueCheck,
} from '../../util/appUtils';
import actionCodes from '../data/actionCodes.json';
import AdminSideNavCompany from '../navbar/navlistCompany.json';
import AdminSideNavSite from '../navbar/navlistSite.json';
import {
  getArchive,
  getTeamMemberFilters,
  getTeamMembersCount,
  getTeamMembersExport,
  getTeamMembersInfo,
  getUserDetails,
  resetArchive,
  resetCreateUser,
  resetUpdateUser,
} from '../setupService';
import Teams from '../siteConfiguration/teamMemberDetails/teams';
import EditUser from './addUser/addUser';
import AddUser from './addUser/addUserMini';
import locationFormModel from './addUser/formModel/userFormModel';

const { formField } = locationFormModel;

const appModels = require('../../util/appModels').default;

const AdminSites = () => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const { sortedValue } = useSelector((state) => state.equipment);
  const [removeName, setRemoveName] = useState('');
  const [isArchive, setIsArchive] = useState(true);
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);
  const [isActiveUser, setActiveType] = useState(true);

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const [editLink, setEditLink] = useState(false);
  const [editId, setEditId] = useState(false);
  const [editData, setEditData] = useState([]);
  const [rowselected, setRowselected] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companiesAllowed = getAllowedCompanies(userInfo);
  const [addUserModal, showAddUserModal] = useState(false);
  const [editModeRow, setEditModeRow] = useState(false);
  const [team, showTeam] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalvalue, setGlobalvalue] = useState('');
  const [customVariable, setCustomVariable] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [startExport, setStartExport] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [reload, setReload] = useState(false);

  const {
    teamMemberCount, teamMemberInfo, teamMemberCountLoading, teamMemberFilters, teamMembersExportInfo, createUserInfo, archiveInfo, userDetails, updateUserInfo,
  } = useSelector((state) => state.setup);
  const {
    updateBulkInfo, createBulkInfo,
  } = useSelector((state) => state.ticket);
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Admin Setup',
  );
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');
  const allowedOperations1 = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const apiFields = ['name', 'email', 'is_mobile_user', 'state', 'associates_to', 'employee_id_seq', 'vendor_id', 'active', 'company_id', 'hr_department', 'resource_calendar_id'];

  const totalDataCount = teamMemberCount && teamMemberCount.length ? teamMemberCount.length : 0;

  const loading = (teamMemberInfo && teamMemberInfo.loading) || (userInfo && userInfo.loading) || teamMemberCountLoading;

  const handlePageChange = (data) => {
    const { page, pageSize } = data;
    if (pageSize !== limit) {
      setLimit(pageSize);
    }
    const offsetValue = page * pageSize;
    setOffset(offsetValue);
    setPage(page);
  };

  let activeTab;
  let tabs;

  const isParent = userInfo && userInfo.data && userInfo.data.is_parent;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, userInfo && userInfo.data && userInfo.data.is_parent ? AdminSideNavCompany.data : AdminSideNavSite.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Users',
    );
  }

  useEffect(() => {
    if (userDetails && userDetails.err && userDetails.err.status === 404) {
      setViewModal(false);
    }
  }, [userDetails]);

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Users',
        link: '/setup-users',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  useEffect(() => {
    if (reload) {
      dispatch(getTeamMemberFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (teamMemberInfo && teamMemberInfo.data) {
      setRows(teamMemberInfo.data);
    } else {
      setRows([]);
    }
  }, [teamMemberInfo]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        email: true,
        is_mobile_user: true,
        state: true,
        associates_to: true,
        employee_id_seq: true,
        vendor_id: true,
        active: true,
        company_id: true,
        hr_department: true,
        resource_calendar_id: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (teamMemberCount && teamMemberCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersList = teamMemberFilters.customFilters ? queryGeneratorWithUtc(teamMemberFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamMembersExport(companiesAllowed, appModels.TEAMMEMEBERS, teamMemberCount.length, offsetValue, apiFields, false, rowselected, customFiltersList, globalFilter, 'isUser', isActiveUser));
    }
  }, [startExport]);

  useEffect(() => {
    if ((createBulkInfo && createBulkInfo.data) || (updateBulkInfo && updateBulkInfo.data) || (createUserInfo && createUserInfo.data) || (updateUserInfo && updateUserInfo.data) || (archiveInfo && archiveInfo.data)) {
      const customFiltersList = teamMemberFilters.customFilters ? queryGeneratorWithUtc(teamMemberFilters.customFilters) : '';
      dispatch(getTeamMembersCount(companiesAllowed, appModels.TEAMMEMEBERS, false, customFiltersList, globalFilter, 'isUser', isActiveUser));
      dispatch(getTeamMembersInfo(companiesAllowed, appModels.TEAMMEMEBERS, limit, offset, sortedValue.sortBy, sortedValue.sortField, false, customFiltersList, globalFilter, apiFields, 'isUser', isActiveUser));
    }
  }, [createBulkInfo, updateBulkInfo, createUserInfo, updateUserInfo, archiveInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = teamMemberFilters.customFilters ? queryGeneratorWithUtc(teamMemberFilters.customFilters) : '';
      dispatch(getTeamMembersCount(companiesAllowed, appModels.TEAMMEMEBERS, false, customFiltersList, globalFilter, 'isUser', isActiveUser));
    }
  }, [userInfo, teamMemberFilters.customFilters, globalFilter, isActiveUser]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = teamMemberFilters.customFilters ? queryGeneratorWithUtc(teamMemberFilters.customFilters) : '';
      dispatch(getTeamMembersInfo(companiesAllowed, appModels.TEAMMEMEBERS, limit, offset, sortedValue.sortBy, sortedValue.sortField, false, customFiltersList, globalFilter, apiFields, 'isUser', isActiveUser));
    }
  }, [userInfo, limit, offset, sortedValue.sortBy, sortedValue.sortField, teamMemberFilters.customFilters, globalFilter, isActiveUser]);

  useEffect(() => {
    if (viewId && (userInfo && userInfo.data)) {
      dispatch(getUserDetails(companiesAllowed, appModels.TEAMMEMEBERS, undefined, viewId));
    }
  }, [viewId]);

  const onReset = () => {
    setEditId(false);
    dispatch(resetCreateUser());
    dispatch(resetUpdateUser());
  };

  const loadingData = (userInfo && userInfo.loading) || (teamMemberInfo && teamMemberInfo.loading) || (teamMemberCountLoading);

  const onClickAssignData = (id) => {
    dispatch(resetArchive());
    showDeleteModal(false);
    setEditId(false);
    dispatch(getUserDetails(companiesAllowed, appModels.TEAMMEMEBERS, undefined, id));
    setEditLink(false);
    showTeam(true);
  };

  const onRemoveDataCancel = () => {
    dispatch(resetArchive());
    showDeleteModal(false);
  };

  const onClickRemoveData = (id, name, active) => {
    dispatch(resetArchive());
    setRemoveId(id);
    setRemoveName(name);
    setIsArchive(active);
    showDeleteModal(true);
  };

  const onRemoveData = (id) => {
    const postData = {
      active: !isArchive,
    };

    dispatch(getArchive(id, appModels.TEAMMEMEBERS, postData));
  };

  useEffect(() => {
    if (userDetails && userDetails.data && userDetails.data.length > 0 && editId) {
      const detailData = userDetails.data[0];
      setEditData(detailData);
      setEditLink(true);
    }
  }, [userDetails, editId]);

  const onClickEditData = (id) => {
    setEditId(id);
    dispatch(getUserDetails(companiesAllowed, appModels.TEAMMEMEBERS, undefined, id));
  };

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'email',
      'is_mobile_user',
      'state',
      'associates_to',
      'employee_id_seq',
      'vendor_id',
      'active',
      'company_id',
      'hr_department',
      'resource_calendar_id',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|",';
    const oldCustomFilters = teamMemberFilters && teamMemberFilters.customFilters ? teamMemberFilters.customFilters : [];
    const dateFilters = oldCustomFilters.filter((item) => item.type === 'date' || item.type === 'customdate');

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      fields.filter((field) => {
        setGlobalvalue(data?.quickFilterValues?.[0]);
        query += `["${field}","ilike","${encodeURIComponent(data.quickFilterValues[0])}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
    }

    if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        data.items.map((dataItem) => {
          const label = tableColumns.find((column) => column.field === dataItem.field);
          dataItem.value = dataItem?.value ? dataItem.value : '';
          dataItem.header = label?.headerName;
        });
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'header'),
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getTeamMemberFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getTeamMemberFilters(customFilters));
    }
    const filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : [];
    const customFiltersData = [...dateFilters, ...filtersData];

    setFilterText(formatFilterData(customFiltersData, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [teamMemberFilters],
  );

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [
      {
        key: value,
        value,
        label: value,
        type: 'date',
        header: 'Date Filter',
        id: value,
      },
    ];
    if (checked) {
      setCustomFiltersList(filters);
      const oldCustomFilters = teamMemberFilters && teamMemberFilters.customFilters
        ? teamMemberFilters.customFilters
        : [];
      const filterValues = {
        customFilters: [...(oldCustomFilters.length > 0
          ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters],
      };
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
        ...filters,
      ]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getTeamMemberFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = teamMemberFilters && Array.isArray(teamMemberFilters.customFilters)
        ? teamMemberFilters.customFilters
        : [];
      const filterValues = {
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray(
        valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
      );
      setFilterText(formatFilterData([], globalvalue));
      dispatch(getTeamMemberFilters(filterValues));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];

    const getDateRangeObj = getDateAndTimeForDifferentTimeZones(
      userInfo,
      startDate,
      endDate,
    );

    if (startDate && endDate) {
      start = getDateRangeObj[0];
      end = getDateRangeObj[1];
    }
    if (startDate && endDate) {
      filters = [
        {
          key: value,
          value,
          label: value,
          type: 'customdate',
          start,
          end,
          header: 'Date Filter',
          id: value,
        },
      ];
    }
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = teamMemberFilters && teamMemberFilters.customFilters
        ? teamMemberFilters.customFilters
        : [];
      const filterValues = {
        states:
          teamMemberFilters && teamMemberFilters.states ? teamMemberFilters.states : [],
        categories:
          teamMemberFilters && teamMemberFilters.categories
            ? teamMemberFilters.categories
            : [],
        priorities:
          teamMemberFilters && teamMemberFilters.priorities
            ? teamMemberFilters.priorities
            : [],
        incidentStates:
          teamMemberFilters && teamMemberFilters.incidentStates
            ? teamMemberFilters.incidentStates
            : [],
        customFilters: [
          ...(oldCustomFilters.length > 0
            ? oldCustomFilters.filter(
              (item) => item.type !== 'date'
                && item.type !== 'customdate'
                && item.type !== 'datearray',
            )
            : ''),
          ...filters,
        ],
      };
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getTeamMemberFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = teamMemberFilters && teamMemberFilters.customFilters
        ? teamMemberFilters.customFilters
        : [];
      const filterValues = {
        states:
          teamMemberFilters && teamMemberFilters.states ? teamMemberFilters.states : [],
        categories:
          teamMemberFilters && teamMemberFilters.categories
            ? teamMemberFilters.categories
            : [],
        priorities:
          teamMemberFilters && teamMemberFilters.priorities
            ? teamMemberFilters.priorities
            : [],
        incidentStates:
          teamMemberFilters && teamMemberFilters.incidentStates
            ? teamMemberFilters.incidentStates
            : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData([], globalvalue));
      dispatch(getTeamMemberFilters(filterValues.customFilters));
    }
    setOffset(0);
    setPage(1);
  };

  const handlePageChangeDetail = (page, type) => {
    setDetailArrowNext('');
    setDetailArrowPrev('');
    const nPages = Math.ceil(totalDataCount / limit);
    if (type === 'Next' && page !== nPages) {
      const offsetValue = page * limit;
      setOffset(offsetValue);
      setPage(page);
      setDetailArrowNext(Math.random());
    }
    if (type === 'Prev' && page !== 1) {
      const offsetValue = ((page - 2) * limit);
      setOffset(offsetValue);
      setPage(page - 2);
      setDetailArrowPrev(Math.random());
    }
  };

  const onAddReset = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    if (userDetails && userDetails.data && userDetails.data.length) {
      dispatch(getUserDetails(companiesAllowed, appModels.TEAMMEMEBERS, undefined, userDetails.data[0].id));
    }
    dispatch(resetCreateUser());
    dispatch(resetUpdateUser());
  };

  const closeEditModal = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    dispatch(resetUpdateUser());
    setViewModal(false);
    setViewId(false);
  };

  const onViewReset = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    setOffset(offset);
    setPage(currentPage);
    setViewId(0);
    setViewModal(false);
  };

  const isEditable = isParent && (allowedOperations1.includes(actionCodes1['Edit Team Member']) || allowedOperations.includes(actionCodes['Edit User']));
  const isCreatable = isParent && (allowedOperations1.includes(actionCodes1['Add Team Member']) || allowedOperations.includes(actionCodes['Add User']));
  const isDeletable = isParent;

  const tableColumns = UserColumns(editModeRow, onClickAssignData, onClickEditData, onClickRemoveData, isEditable, isDeletable);

  return (
    <Box className="insights-box">
      <CommonGrid
        className="tickets-table"
        tableData={
          teamMemberInfo && teamMemberInfo.data && teamMemberInfo.data.length
            ? teamMemberInfo.data
            : []
        }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setEditModeRow={setEditModeRow}
        editModeRow={editModeRow}
        setRows={setRows}
        setActiveType={setActiveType}
        isActiveFilter
        isUserActive={isActiveUser}
        loadingData={loadingData}
        dependencyColumsReload={[teamMemberInfo]}
        moduleName="User List"
        ishideEditable={!isEditable}
        appModelsName={appModels.TEAMMEMEBERS}
        listCount={totalDataCount}
        exportInfo={teamMembersExportInfo}
        exportFileName="Users"
        filters={filterText}
        setRowselected={setRowselected}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        rowselected={rowselected}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        onFilterChanges={debouncedOnFilterChange}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => showAddUserModal(true),
        }}
        handlePageChange={handlePageChange}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        setStartExport={setStartExport}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addUserModal}
      >
        <DrawerHeader
          headerName="Create User"
          subTitle="Create User for the site"
          imagePath={false}
          onClose={() => { showAddUserModal(false); }}
        />
        <AddUser
          afterReset={() => { showAddUserModal(false); onReset(); }}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={team}
      >
        <DrawerHeader
          headerName="Teams"
          subTitle="Add/ View /Delete Teams for the users"
          imagePath={false}
          onClose={() => { showTeam(false); }}
        />
        {/* <AddTeam
          afterReset={() => { showTeam(false); onResetTeam(); }}
          isDrawer
        /> */}
        <Teams />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editLink}
      >
        <DrawerHeader
          headerName="Edit User"
          imagePath={false}
          onClose={() => { setEditId(false); setEditLink(false); }}
        />
        <EditUser
          // closeModal={() => { closeEditModal(); setEditLink(); }}
          directToView={false}
          editData={editData}
          afterReset={() => { onReset(); setEditId(false); setEditLink(false); }}
          isDrawer
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={userDetails && userDetails.data && userDetails.data.length && userDetails.data[0].name ? userDetails.data[0].name : 'Team Member'}
          imagePath={teamMemberIcon}
          onClose={onViewReset}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', teamMemberInfo) === 0
              ? handlePageChangeDetail(currentPage + 1, 'Prev')
              : setViewId(getNextPreview(viewId, 'Prev', teamMemberInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', teamMemberInfo) === 0
              ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', teamMemberInfo));
          }}
        />
        <TeamMemberDetail onAddReset={onAddReset} closeEditModal={closeEditModal} isAdminSetup/>
      </Drawer>
      <Dialog
        size={(archiveInfo && archiveInfo.data) ? 'sm' : 'lg'}
        fullWidth
        open={deleteModal}
      >
        <DialogHeader
          title={`${isArchive ? 'Archive' : 'Unarchive'} User`}
          imagePath={false}
          onClose={() => onRemoveDataCancel()}
          response={archiveInfo}
        />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {archiveInfo && (!archiveInfo.data && !archiveInfo.loading && !archiveInfo.err) && (
            <p className="text-center font-family-tab">
              {`Are you sure, you want to ${isArchive ? 'Archive' : 'Unarchive'} ${removeName} ?`}
            </p>
            )}
            {archiveInfo && archiveInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(archiveInfo && archiveInfo.err) && (
            <SuccessAndErrorFormat response={archiveInfo} />
            )}
            {(archiveInfo && archiveInfo.data) && (
            <SuccessAndErrorFormat
              response={archiveInfo}
              successMessage={`User ${isArchive ? 'archived' : 'unarchived'} successfully..`}
            />
            )}
            <div className="text-right mt-3">
              {archiveInfo && !archiveInfo.data && (
              <Button
                size="sm"
                disabled={archiveInfo && archiveInfo.loading}
                variant="contained"
                onClick={() => onRemoveData(removeId)}
              >
                Confirm
              </Button>
              )}
              {archiveInfo && archiveInfo.data && (
              <Button size="sm" variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminSites;
