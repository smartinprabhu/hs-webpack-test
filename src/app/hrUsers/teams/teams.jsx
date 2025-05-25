/* eslint-disable import/no-unresolved */
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  ModalBody
} from 'reactstrap';
import teamsIcon from '@images/teamsBlue.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import { Button, Drawer } from '@mui/material';
import { Box } from '@mui/system';
import {
  getTeamDetail,
  getTeamFilters,
  getTeamsCount,
  getTeamsExport,
  getTeamsInfo,
  resetCreateTeam, resetEditTeam,
} from '../../adminSetup/setupService';
import AddTeam from '../../adminSetup/siteConfiguration/addTeam';
import TeamDeatail from '../../adminSetup/siteConfiguration/teamDetails/teamDetail';
import CommonGrid from '../../commonComponents/commonGrid';
import DrawerHeader from '../../commonComponents/drawerHeader';
import { updateHeaderData } from '../../core/header/actions';
import {
  getDelete,
  resetDelete
} from '../../pantryManagement/pantryService';
import { TeamsFields } from '../../shared/data/tableFields';
import {
  debounce, formatFilterData,
  getActiveTab,
  getAllowedCompanies,
  getDateAndTimeForDifferentTimeZones, getHeaderTabs,
  getListOfModuleOperations, getMenuItems,
  getNextPreview,
  getTabs,
  queryGeneratorWithUtc
} from '../../util/appUtils';
import { AdminSetupModule } from '../../util/field';
import actionCodes from '../data/actionCodes.json';
import users from '../navbar/navlist.json';

const appModels = require('../../util/appModels').default;

const Teams = ({ isSiteConfig = false }) => {
  const subMenu = 'Maintenance Teams';
  const limit = 10;
  const dispatch = useDispatch();

  const [offset, setOffset] = useState(0);
  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [currentPage, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [startExport, setStartExport] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFilters, setCustomFilters] = useState([]);
  const [reload, setReload] = useState(false);
  const [addTeamModal, showAddTeamModal] = useState(false);
  const [openEditTeamModal, setOpenEditTeamModal] = useState(false);
  const [editData, setEditData] = useState([]);
  const [fetchData, setFetchData] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [addLink, setAddLink] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');
  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    teamInfo, teamCountLoading, teamCount, createTeamInfo, teamsExportInfo,
    teamDetail, teamsFilters,
  } = useSelector((state) => state.setup);
  const {
    deleteInfo,
  } = useSelector((state) => state.pantry);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const companies = getAllowedCompanies(userInfo);
  const totalDataCount = teamCount && teamCount.length ? teamCount.length : 0;
  const loading = (userInfo && userInfo.loading) || teamCountLoading || (teamInfo && teamInfo.loading);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Users', 'code');
  const isEditable = allowedOperations.includes(actionCodes['Edit Team']);
  const isDeleteable = false;

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const onClickRemoveData = (id, name) => {
    setViewModal(false);
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.TEAM));
  };

  const tableColumns = TeamsFields(onClickRemoveData, isDeleteable);

  useEffect(() => {
    if (visibleColumns && Object.keys(visibleColumns) && Object.keys(visibleColumns).length === 0) {
      setVisibleColumns({
        _check_: true,
        name: true,
        member_ids: true,
        team_category_id: true,
        employee_id: true,
        maintenance_cost_analytic_account_id: true,
        team_type: true,
        labour_cost_unit: true,
        company_id: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      dispatch(getTeamFilters([]));
      setCustomFilters([]);
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(teamInfo && teamInfo.data && teamInfo.data.length && teamInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(teamInfo && teamInfo.data && teamInfo.data.length && teamInfo.data[teamInfo.data.length - 1].id);
    }
  }, [teamInfo]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamsCount(companies, appModels.TEAM, customFiltersList, globalFilter));
    }
  }, [userInfo, teamsFilters.customFilters, fetchData]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamsInfo(companies, appModels.TEAM, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter));
      // dispatch(getTeamsCount(companies, appModels.TEAM, customFiltersList, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, teamsFilters.customFilters, fetchData]);

  useEffect(() => {
    if (teamsFilters && teamsFilters.customFilters) {
      setCustomFilters(teamsFilters.customFilters);
    }
  }, [teamsFilters]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (teamCount && teamCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamsExport(companies, appModels.TEAM, teamCount.length, offsetValue, AdminSetupModule.maintenanceApiFields, customFiltersList, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [startExport]);

  useEffect(() => {
    if (viewId) {
      dispatch(getTeamDetail(viewId, appModels.TEAM));
    }
  }, [viewId]);

  useEffect(() => {
    if (createTeamInfo && createTeamInfo.data && createTeamInfo.data.length) {
      dispatch(getTeamDetail(createTeamInfo.data[0], appModels.TEAM));
    }
  }, [createTeamInfo]);

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const valueCheck = (dataArray) => {
    let returnValue = true;
    dataArray.map((item) => {
      if (!item.value) {
        returnValue = false;
      }
    });
    return returnValue;
  };

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'team_category_id',
      'employee_id',
      'maintenance_cost_analytic_account_id',
      'team_type',
      'labour_cost_unit',
      'company_id',
    ];
    let query = '"|","|","|","|","|","|",';
    const oldCustomFilters = teamsFilters && teamsFilters.customFilters ? teamsFilters.customFilters : [];
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
        dispatch(getTeamFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getTeamFilters(customFilters));
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
    [teamsFilters],
  );

  const closeModal = () => {
    if (document.getElementById('teamForm')) {
      document.getElementById('teamForm').reset();
    }
    setAddLink(false);
    dispatch(resetCreateTeam());
  };

  const closeEditModalWindow = () => {
    dispatch(resetEditTeam());
    setOpenEditTeamModal(false);
    dispatch(resetCreateTeam());
    showAddTeamModal(false);
    setEditData([]);
    setAddLink(false);
  };

  const onAddReset = () => {
    dispatch(resetCreateTeam());
    dispatch(resetEditTeam());
    closeEditModalWindow(false);
    setFetchData(Math.random());
    dispatch(getTeamDetail(viewId, appModels.TEAM));
  };

  const onViewReset = () => {
    if (document.getElementById('teamForm')) {
      document.getElementById('teamForm').reset();
    }
    setOffset(offset);
    setPage(currentPage);
    setViewId(0);
    setViewModal(false);
    showAddTeamModal(false);
  };

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Users', 'name');
  const { pinEnableData } = useSelector((state) => state.auth);

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
      const oldCustomFilters = teamsFilters && (teamsFilters.customFilters)
        ? teamsFilters.customFilters
        : [];
      const filterValues = {
        // states: teamMemberFilters && teamMemberFilters.states ? teamMemberFilters.states : [],
        // categories: teamMemberFilters && teamMemberFilters.categories ? teamMemberFilters.categories : [],
        // priorities: teamMemberFilters && teamMemberFilters.priorities ? teamMemberFilters.priorities : [],
        // incidentStates: teamMemberFilters && teamMemberFilters.incidentStates ? teamMemberFilters.incidentStates : [],
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
      dispatch(getTeamFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = teamsFilters && Array.isArray(teamsFilters.customFilters)
        ? teamsFilters.customFilters
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
      dispatch(getTeamFilters(filterValues));
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
      // start = `${moment(startDate).utc().format('YYYY-MM-DD')} 18:30:59`;
      // end = `${moment(endDate).add(1, 'day').utc().format('YYYY-MM-DD')} 18:30:59`;
      // start = `${moment(startDate).tz(companyTimeZone).startOf('date').utc().format('YYYY-MM-DD HH:mm:ss')}`;
      // end = `${moment(endDate).tz(companyTimeZone).endOf('date').utc().format('YYYY-MM-DD HH:mm:ss')}`;
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
      const oldCustomFilters = teamsFilters && teamsFilters.customFilters
        ? teamsFilters.customFilters
        : [];
      const filterValues = {
        states:
          teamsFilters && teamsFilters.states ? teamsFilters.states : [],
        categories:
          teamsFilters && teamsFilters.categories
            ? teamsFilters.categories
            : [],
        priorities:
          teamsFilters && teamsFilters.priorities
            ? teamsFilters.priorities
            : [],
        incidentStates:
          teamsFilters && teamsFilters.incidentStates
            ? teamsFilters.incidentStates
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
      dispatch(getTeamFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = teamsFilters && teamsFilters.customFilters
        ? teamsFilters.customFilters
        : [];
      const filterValues = {
        states:
          teamsFilters && teamsFilters.states ? teamsFilters.states : [],
        categories:
          teamsFilters && teamsFilters.categories
            ? teamsFilters.categories
            : [],
        priorities:
          teamsFilters && teamsFilters.priorities
            ? teamsFilters.priorities
            : [],
        incidentStates:
          teamsFilters && teamsFilters.incidentStates
            ? teamsFilters.incidentStates
            : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getTeamFilters(filterValues.customFilters));
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
      'Teams',
    );
  }

  useEffect(() => {
    if (!isSiteConfig) {
      dispatch(
        updateHeaderData({
          module: 'Users',
          moduleName: 'Users',
          menuName: 'Teams',
          link: '/teams',
          headerTabs: tabs.filter((e) => e),
          activeTab,
        }),
      );
    }
  }, [activeTab]);

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

  return (
    <Box>
      {/* <Header
                    headerPath="Users"
                    nextPath="Teams"
                    pathLink="/teams"
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
          teamInfo && teamInfo.data && teamInfo.data.length ? teamInfo.data : []
        }
        columns={tableColumns}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Teams List"
        exportFileName="Teams"
        listCount={totalDataCount}
        exportInfo={teamsExportInfo}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        filters={filterText}
        onFilterChanges={debouncedOnFilterChange}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(actionCodes['Add Team']),
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
        loading={teamInfo && teamInfo.loading}
        err={teamInfo && teamInfo.err}
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
          headerName="Create a Team"
          imagePath={teamsIcon}
          onClose={closeModal}
        />
        <AddTeam
          closeModal={closeEditModalWindow}
          editData={false}
          afterReset={() => { onAddReset(); }}
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
          headerName={teamDetail && teamDetail.data && teamDetail.data.length && teamDetail.data[0].name ? teamDetail.data[0].name : 'Team'}
          imagePath={teamsIcon}
          onClose={onViewReset}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', teamInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', teamInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', teamInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', teamInfo));
          }}
        />
        <TeamDeatail onAddReset={onAddReset} closeEditModalWindow={closeEditModalWindow} />
      </Drawer>
      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Team"
          imagePath={false}
          closeModalWindow={() => onRemoveDataCancel()}
          response={deleteInfo}
        />
        <ModalBody className="mt-0 pt-0">
          {deleteInfo && (!deleteInfo.data && !deleteInfo.loading && !deleteInfo.err) && (
            <p className="text-center">
              {`Are you sure, you want to remove ${removeName} ?`}
            </p>
          )}
          {deleteInfo && deleteInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
          )}
          {(deleteInfo && deleteInfo.err) && (
            <SuccessAndErrorFormat response={deleteInfo} />
          )}
          {(deleteInfo && deleteInfo.data) && (
            <SuccessAndErrorFormat
              response={deleteInfo}
              successMessage="Team removed successfully.."
            />
          )}
          <div className="pull-right mt-3">
            {deleteInfo && !deleteInfo.data && (
              <Button
                size="sm"
                disabled={deleteInfo && deleteInfo.loading}
                variant="contained"
                onClick={() => onRemoveData(removeId)}
              >
                Confirm
              </Button>
            )}
            {deleteInfo && deleteInfo.data && (
              <Button size="sm" variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </Box>
  );
};
export default Teams;
