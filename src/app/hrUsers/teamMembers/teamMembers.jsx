import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Drawer } from 'antd';
import { Redirect } from 'react-router-dom';

// import DrawerHeader from '@shared/drawerHeader';
import teamMemberIcon from '@images/teamMemberBlue.svg';

import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import AddUser from '../../adminSetup/companyConfiguration/addUser/addUser';
import {
  clearteamMemberFilter,
  getAllowComapaniesData,
  getTeamMemberFilters, getTeamMembersCount,
  getTeamMembersExport,
  getTeamMembersInfo,
  getUserDetails,
  resetAllowedCompanyDetails,
  resetCreateUser,
  resetUpdateUser,
  resetUserDetails,
  resetUsersCount,
} from '../../adminSetup/setupService';
import siteConfigureData from '../../adminSetup/siteConfiguration/data/siteConfigureData.json';
import CommonGrid from '../../commonComponents/commonGrid';
import DrawerHeader from '../../commonComponents/drawerHeader';
import { TeamMemberFields } from '../../commonComponents/gridColumns';
import { updateHeaderData } from '../../core/header/actions';
import {
  getActiveTab,
  getAllowedCompanies,
  getHeaderTabs,
  getListOfModuleOperations, getMenuItems,
  getTabs,
  getTotalCount,
  queryGeneratorWithUtc,
  debounce, formatFilterData,
  getDateAndTimeForDifferentTimeZones, getNextPreview,
} from '../../util/appUtils';
import actionCodes from '../data/actionCodes.json';
import users from '../navbar/navlist.json';
import TeamMemberDetail from './teamMemberDetails/teamMembersDetail';

const appModels = require('../../util/appModels').default;

const TeamMembers = () => {
  const subMenu = 'Team Members';
  const module = 'Users';
  const limit = 10;
  const apiFields = siteConfigureData && siteConfigureData.teamMemberTableColumnsShow ? siteConfigureData.teamMemberTableColumnsShow : [];

  const tableColumns = TeamMemberFields();

  const dispatch = useDispatch();

  const [offset, setOffset] = useState(0);
  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [currentPage, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [editData, setEditData] = useState([]);
  const [startExport, setStartExport] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFilters, setCustomFilters] = useState([]);
  const [reload, setReload] = useState(false);
  const [addTeamMemberModal, showAddTeamMemberModal] = useState(false);
  const [openEditTeamMemberModal, setOpenEditTeamMemberModal] = useState(false);
  const [fetchData, setFetchData] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [customVariable, setCustomVariable] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [addLink, setAddLink] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');
  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    teamMemberInfo, teamMemberCountLoading, teamMemberCount, createUserInfo, teamMembersExportInfo, teamMemberFilters,
    userDetails,
  } = useSelector((state) => state.setup);
  const loading = (teamMemberInfo && teamMemberInfo.loading) || (userInfo && userInfo.loading) || teamMemberCountLoading;

  const { pinEnableData } = useSelector((state) => state.auth);
  const currentPath = location.pathname;
  useEffect(() => {
    dispatch(clearteamMemberFilter());
  }, [currentPath]);

  useEffect(() => {
    if (visibleColumns && Object.keys(visibleColumns) && Object.keys(visibleColumns).length === 0) {
      setVisibleColumns({
        _check_: true,
        name: true,
        maintenance_team_ids: true,
        email: true,
        associates_to: true,
        state: true,
        vendor_id: true,
        employee_id_seq: true,
        hr_department: true,
        resource_calendar_id: true,
        company_id: true,
      });
    }
  }, [visibleColumns]);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'code');

  const isEditable = allowedOperations.includes(actionCodes['Edit Team Member']);
  const isCancelled = userDetails && userDetails.data && userDetails.data.length && userDetails.data[0].state === 'Cancelled';

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (reload) {
      dispatch(getTeamMemberFilters([]));
      setCustomFilters([]);
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(teamMemberInfo && teamMemberInfo.data && teamMemberInfo.data.length && teamMemberInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(teamMemberInfo && teamMemberInfo.data && teamMemberInfo.data.length && teamMemberInfo.data[teamMemberInfo.data.length - 1].id);
    }
  }, [teamMemberInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && (createUserInfo && createUserInfo.data)) {
      const customFiltersList = teamMemberFilters.customFilters ? queryGeneratorWithUtc(teamMemberFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamMembersCount(companies, appModels.TEAMMEMEBERS, false, customFiltersList, globalFilter));
      dispatch(getTeamMembersInfo(companies, appModels.TEAMMEMEBERS, limit, offset, sortedValue.sortBy, sortedValue.sortField, false, customFiltersList, globalFilter));
    }
  }, [createUserInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = teamMemberFilters.customFilters ? queryGeneratorWithUtc(teamMemberFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamMembersCount(companies, appModels.TEAMMEMEBERS, false, customFiltersList, globalFilter));
    }
  }, [userInfo, teamMemberFilters.customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = teamMemberFilters.customFilters ? queryGeneratorWithUtc(teamMemberFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamMembersInfo(companies, appModels.TEAMMEMEBERS, limit, offset, sortedValue.sortBy, sortedValue.sortField, false, customFiltersList, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, teamMemberFilters.customFilters]);

  useEffect(() => {
    if (userDetails && userDetails.data && userDetails.data[0].company_ids) {
      dispatch(getAllowComapaniesData(appModels.COMPANY, userDetails.data[0].company_ids));
    }
  }, [userDetails]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (teamMemberCount && teamMemberCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersList = teamMemberFilters.customFilters ? queryGeneratorWithUtc(teamMemberFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamMembersExport(companies, appModels.TEAMMEMEBERS, getTotalCount(teamMemberCount), offsetValue, apiFields, false, rows, customFiltersList, globalFilter));
    }
  }, [startExport]);

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (viewId && (userInfo && userInfo.data)) {
      dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, undefined, viewId));
    }
  }, [viewId, openEditTeamMemberModal]);

  const valueCheck = (dataArray) => {
    let returnValue = true;
    dataArray.map((item) => {
      if (!item.value) {
        returnValue = false;
      }
    });
    return returnValue;
  };

  useEffect(() => {
    if (teamMemberFilters && teamMemberFilters.customFilters) {
      setCustomFilters(teamMemberFilters.customFilters);
    }
  }, [teamMemberFilters]);

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'email',
      'associates_to',
      'state',
      'vendor_id',
      'employee_id_seq',
      'hr_department',
      'resource_calendar_id',
      'company_id',
    ];
    let query = '"|","|","|","|","|","|","|","|",';
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

  const onResetUserInfo = () => {
    dispatch(resetUserDetails());
    dispatch(resetAllowedCompanyDetails());
  };

  const directModal = () => {
    showAddTeamMemberModal(false);
    if (createUserInfo && createUserInfo.data && createUserInfo.data.length) {
      setViewId(createUserInfo.data[0]);
    }
    dispatch(resetCreateUser());
    dispatch(resetUsersCount());
  };

  const onAddReset = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    dispatch(resetCreateUser());
    dispatch(resetUpdateUser());
    dispatch(resetUsersCount());
    if (userDetails && userDetails.data && userDetails.data.length) {
      dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, undefined, userDetails.data[0].id));
    }
    setAddLink(false);
  };

  const onAddClose = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    setAddLink(false);
  };

  useEffect(() => {
    if (userDetails && userDetails.err && userDetails.err.status === 404) {
      setViewModal(false);
    }
  }, [userDetails]);

  useEffect(() => {
    if (!addTeamMemberModal) {
      setOpenEditTeamMemberModal(false);
    }
  }, [addTeamMemberModal]);


  const onViewReset = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    setOffset(offset);
    setPage(currentPage);
    setViewId(0);
    setViewModal(false);
    showAddTeamMemberModal(false);
  };

  const closeModal = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    dispatch(resetCreateUser());
    showAddTeamMemberModal(false);
  };

  const closeEditModal = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    dispatch(resetUpdateUser());
    setOpenEditTeamMemberModal(false);
  };
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'name');

  if (menuList && menuList.length && !menuList.includes('Team Members')) {
    return (<Redirect to="/teams" />);
  }

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

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Users',
  );
  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, users.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Team Members',
    );
  }

  const handlePageChangeDetail = (page, type) => {
    setDetailArrowNext('');
    setDetailArrowPrev('');
    const nPages = Math.ceil(getTotalCount(teamMemberCount) / limit);
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

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Users',
        moduleName: 'Users',
        menuName: 'Team Members',
        link: '/team-members',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Box>
      {/* <Header
        headerPath="Users"
        nextPath="Team Members"
        pathLink="/team-members"
        headerTabs={tabs.filter((e) => e)}
        activeTab={activeTab}
      /> */}
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          height: '90%',
        }}
        tableData={
          teamMemberInfo && teamMemberInfo.data && teamMemberInfo.data.length ? teamMemberInfo.data : []
        }
        columns={tableColumns}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Team Members List"
        exportFileName="Team Members"
        listCount={getTotalCount(teamMemberCount)}
        exportInfo={teamMembersExportInfo}
        page={currentPage}
        rowCount={getTotalCount(teamMemberCount)}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(actionCodes['Add Team Member']),
          text: 'Add',
          func: () => setAddLink(true),
        }}
        setRows={setRows}
        rows={rows}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        filters={filterText}
        onFilterChanges={debouncedOnFilterChange}
        loading={teamMemberInfo && teamMemberInfo.loading}
        err={teamMemberInfo && teamMemberInfo.err}
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
        open={addLink}
      >

        <DrawerHeader
          headerName="Create Team Member"
          imagePath={teamMemberIcon}
          onClose={onAddClose}
        />
        <AddUser
          afterReset={() => { onAddReset(); }}
          closeEditModal={() => { showAddTeamMemberModal(false); }}
          directToView={directModal}
          closeModal={() => setAddLink(false)}
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
        <TeamMemberDetail onAddReset={onAddReset} closeEditModal={closeEditModal} />
      </Drawer>
    </Box>
    // <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border Assets-list">
    //   {menuList && menuList.length && menuList.includes(subMenu) ? (
    //     <Col sm="12" md="12" lg="12" xs="12">
    //       <Row>
    //         <Col sm="12" md="12" lg="12" xs="12">
    //           <Card className="p-2 mb-2 h-100 bg-lightblue">
    //             <CardBody className="bg-color-white p-1 m-0">
    //               <Row className="p-2">
    //                 <Col md="8" xs="12" sm="8" lg="8">
    //                   <span className="p-0 mr-2 font-weight-800 font-medium">
    //                     Team Members:
    //                     {' '}
    //                     {getTotalCount(teamMemberCount)}
    //                   </span>
    //                   <div className="content-inline" />
    //                 </Col>
    //                 <Col md="4" xs="12" sm="4" lg="4">
    //                   <div className="float-right">
    //                     <Refresh
    //                       loadingTrue={loading}
    //                       setReload={setReload}
    //                     />
    //                     {allowedOperations.includes(actionCodes['Add Team Member']) && (
    //                       <CreateList name="Add Team Member" showCreateModal={() => { onResetUserInfo(); showAddTeamMemberModal(true); }} />
    //                     )}
    //                   </div>
    //                 </Col>
    //               </Row>
    //               <div className="thin-scrollbar">
    //                 <div className="common-table">
    //                   {teamMemberInfo && (
    //                     <DynamicTable
    //                       columnData={teamMemberInfo.data}
    //                       columns={TeamMemberFields()}
    //                       loading={teamMemberInfo.loading}
    //                       setViewId={setViewId}
    //                       setViewModal={setViewModal}
    //                       onFilterChanges={onFilterChange}
    //                       rowCount={getTotalCount(teamMemberCount)}
    //                       page={currentPage}
    //                       limit={limit}
    //                       handlePageChange={handlePageChange}
    //                       exportFileName="Team Members"
    //                       filters={filterStringGenerator(teamMemberFilters)}
    //                       setRows={setRows}
    //                       rows={rows}
    //                       setStartExport={setStartExport}
    //                       exportInfo={teamMembersExportInfo}
    //                       visibleColumns={visibleColumns}
    //                       setVisibleColumns={setVisibleColumns}
    //                     />
    //                   )}
    //                 </div>
    //               </div>
    //             </CardBody>
    //           </Card>
    //         </Col>
    //       </Row>
    //     </Col>
    //   ) : ''}
    //   <Drawer
    //     title=""
    //     closable={false}
    //     className="drawer-bg-lightblue ant-drawer"
    //     width={1250}
    //     visible={addTeamMemberModal}
    //   >

    //     <DrawerHeader
    //       title="Create Team Member"
    //       imagePath={false}
    //       closeDrawer={closeModal}
    //     />
    //     <AddUser
    //       afterReset={() => { onAddReset(); }}
    //       closeEditModal={() => { showAddTeamMemberModal(false); }}
    //       directToView={directModal}
    //       closeModal={closeModal}
    //     />
    //   </Drawer>
    //   {openEditTeamMemberModal && (
    //     <Drawer
    //       title=""
    //       closable={false}
    //       className="drawer-bg-lightblue create-building-compliance"
    //       width={1250}
    //       visible={openEditTeamMemberModal}
    //     >

    //       <DrawerHeader
    //         title="Edit a Team Member"
    //         imagePath={false}
    //         closeDrawer={closeEditModal}
    //       />
    //       <AddUser
    //         closeModal={closeEditModal}
    //         directToView={false}
    //         editData={editData}
    //         afterReset={() => { onAddReset(); }}
    //         isDrawer
    //       />
    //     </Drawer>
    //   )}
    //   <Drawer
    //     title=""
    //     closable={false}
    //     className="drawer-bg-lightblue-no-scroll"
    //     width="80%"
    //     visible={viewModal}
    //   >
    //     <DrawerHeader
    //       title={userDetails && userDetails.data && userDetails.data.length && userDetails.data[0].name ? userDetails.data[0].name : 'Team Member'}
    //       imagePath={teamMemberIcon}
    //       isEditable={isEditable && !isCancelled && (userDetails && !userDetails.loading)}
    //       closeDrawer={() => onViewReset()}
    //       onEdit={() => {
    //         setEditData(userDetails && (userDetails.data && userDetails.data.length > 0) ? userDetails.data[0] : false);
    //         setOpenEditTeamMemberModal(!openEditTeamMemberModal);
    //       }}
    //       onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
    //       onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
    //     />
    //     <TeamMemberDetail />
    //   </Drawer>
    // </Row>
  );
};
export default TeamMembers;
