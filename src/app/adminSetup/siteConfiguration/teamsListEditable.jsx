/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';

import {
  Autocomplete,
  CircularProgress,
  TextField,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
} from 'reactstrap';
import CommonGrid from '../../commonComponents/commonGridEditable';
import DrawerHeader from '../../commonComponents/drawerHeader';
import { AdminSetupFacilityModule, AdminSetupModule } from '../../util/field';
import Members from './teamDetails/members';

import { TeamsColumns } from '../../commonComponents/gridColumnsEditable';
import {
  debounce,
  formatFilterData,
  getAllCompanies,
  getListOfModuleOperations,
  getOldData,
  getTotalCount,
  queryGeneratorWithUtc,
  valueCheck,
  getDateAndTimeForDifferentTimeZones,
} from '../../util/appUtils';
import actionCodes from '../data/actionCodes.json';
import {
  getMaintenanceCostAnalysis,
  getTeamCategory,
  getTeamFilters,
  getTeamDetail,
  getTeamsCount,
  getTeamsInfo,
  getWorkingTime,
  resetCreateTeam,
  getTeamsExport,
} from '../setupService';
import { AddThemeBackgroundColor } from '../../themes/theme';
import AddTeam from './addTeamAdmin';
import locationFormModel from './formModel/teamFormModel';
import { infoValue } from '../utils/utils';

const { formField } = locationFormModel;

const appModels = require('../../util/appModels').default;

const AdminSites = () => {
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const [rows, setRows] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const { sortedValue } = useSelector((state) => state.equipment);
  const [reload, setReload] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [addTeamModal, showAddTeamModal] = useState(false);
  const [editModeRow, setEditModeRow] = useState(false);
  const [teamCategoryOpen, setTeamCategoryOpen] = useState(false);
  const [teamCategoryKeyword, setTeamCategoryKeyword] = useState('');
  const [workingTimeOpen, setWorkingTimeOpen] = useState(false);
  const [workingTimeKeyword, setWorkingTimeKeyword] = useState('');
  const [maintenanceCostOpen, setMaintenanceCostOpen] = useState(false);
  const [maintenanceCostKeyword, setMaintenanceCostKeyword] = useState('');
  const [workingTimeValue, setWorkingTimeValue] = useState('');
  const [costValue, setCostValue] = useState('');
  const [openId, setOpen] = useState('');
  const [teamMember, showTeamMember] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [rowselected, setRowselected] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [globalvalue, setGlobalvalue] = useState('');
  const apiFields = AdminSetupFacilityModule.teamListApiFields;

  const {
    teamInfo, companyDetail, teamCountLoading, teamCount, createTeamInfo, teamsFilters, siteDetails, teamCategoryInfo, maintenanceCostInfo, workingTimeInfo, teamsExportInfo,
  } = useSelector((state) => state.setup);
  const {
    updateBulkInfo, createBulkInfo,
  } = useSelector((state) => state.ticket);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllCompanies(userInfo, userRoles);

  const totalDataCount = teamCount && teamCount.length ? teamCount.length : 0;

  const loading = (userInfo && userInfo.loading)
    || (teamInfo && teamInfo.loading)
    || teamCountLoading;

  const handlePageChange = (data) => {
    const { page, pageSize } = data;
    if (pageSize !== limit) {
      setLimit(pageSize);
    }
    const offsetValue = page * pageSize;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (teamInfo && teamInfo.data) {
      setRows(teamInfo.data);
    } else {
      setRows([]);
    }
  }, [teamInfo]);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && teamCount
      && teamCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = teamsFilters && teamsFilters.customFilters
        ? queryGeneratorWithUtc(teamsFilters.customFilters)
        : '';
      dispatch(
        getTeamsExport(
          companies,
          appModels.TEAM,
          teamCount.length,
          offsetValue,
          AdminSetupModule.maintenanceApiFields,
          customFiltersQuery,
          rowselected,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [startExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        team_category_id: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      dispatch(getTeamFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if ((updateBulkInfo && updateBulkInfo.data)) {
      const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamsInfo(companies, appModels.TEAM, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter, apiFields));
    }
  }, [updateBulkInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamsCount(companies, appModels.TEAM, customFiltersList, globalFilter));
    }
  }, [userInfo, teamsFilters.customFilters, globalFilter]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
        await dispatch(getTeamsInfo(companies, appModels.TEAM, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter, apiFields));
      }
    })();
  }, [userInfo, limit, offset, sortedValue.sortBy, sortedValue.sortField, teamsFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (createBulkInfo && createBulkInfo.data) {
      const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamsCount(companies, appModels.TEAM, customFiltersList, globalFilter));
      dispatch(getTeamsInfo(companies, appModels.TEAM, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, false, apiFields));
    }
  }, [createBulkInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamCategoryOpen) {
        await dispatch(getTeamCategory(companies, appModels.CATEGORY, teamCategoryKeyword));
      }
    })();
  }, [teamCategoryOpen, teamCategoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && addTeamModal) {
        await dispatch(getWorkingTime(companies, appModels.RESOURCECALENDAR, workingTimeKeyword, ['id'], 1));
      }
    })();
    // }, [workingTimeOpen, workingTimeKeyword]);
  }, [addTeamModal]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && addTeamModal) {
        await dispatch(getMaintenanceCostAnalysis(companies, appModels.ACCOUNT, maintenanceCostKeyword, ['id'], 1));
      }
    })();
    // }, [maintenanceCostOpen, maintenanceCostKeyword]);
  }, [addTeamModal]);

  useEffect(() => {
    if (workingTimeInfo && workingTimeInfo.data && workingTimeInfo.data.length) {
      const defaultData = workingTimeInfo.data;
      if (defaultData && defaultData.length) {
        setWorkingTimeValue(defaultData[0]);
      }
    }
  }, [workingTimeInfo]);

  useEffect(() => {
    if (maintenanceCostInfo && maintenanceCostInfo.data && maintenanceCostInfo.data.length) {
      const defaultData = maintenanceCostInfo.data;
      if (defaultData && defaultData.length) {
        setCostValue(defaultData[0]);
      }
    }
  }, [maintenanceCostInfo]);

  const onReset = () => {
    dispatch(resetCreateTeam());
  };

  const onTeamCategoryKeywordChange = (event) => {
    setTeamCategoryKeyword(event.target.value);
  };

  const onWorkingTimeKeywordChange = (event) => {
    setWorkingTimeKeyword(event.target.value);
  };

  const onMaintenanceCostKeywordChange = (event) => {
    setMaintenanceCostKeyword(event.target.value);
  };

  let teamCategoryOptions = [];
  let workingTimeOptions = [];
  let maintenanceCostOptions = [];

  if (teamCategoryInfo && teamCategoryInfo.loading) {
    teamCategoryOptions = [{ name: 'Loading..' }];
  }
  if (teamCategoryInfo && teamCategoryInfo.data) {
    teamCategoryOptions = teamCategoryInfo.data;
  }

  if (workingTimeInfo && workingTimeInfo.loading) {
    workingTimeOptions = [{ name: 'Loading..' }];
  }
  if (workingTimeInfo && workingTimeInfo.data) {
    workingTimeOptions = workingTimeInfo.data;
  }

  if (maintenanceCostInfo && maintenanceCostInfo.loading) {
    maintenanceCostOptions = [{ name: 'Loading..' }];
  }
  if (maintenanceCostInfo && maintenanceCostInfo.data) {
    maintenanceCostOptions = maintenanceCostInfo.data;
  }

  const categorySelection = (paramsEdit) => (
    <Autocomplete
      sx={{
        width: '100%',
      }}
      name={formField.teamCategory.name}
      label={formField.teamCategory.label}
      isRequired={formField.teamCategory.required}
      className="bg-white"
      open={openId === paramsEdit.row.id}
      size="small"
      value={paramsEdit && paramsEdit.value && paramsEdit.value.id ? paramsEdit.value.name : getOldData(paramsEdit.value)}
      onOpen={() => {
        setOpen(paramsEdit.row.id);
        setTeamCategoryOpen(true);
        setTeamCategoryKeyword('');
      }}
      onClose={() => {
        setOpen('');
        setTeamCategoryOpen(false);
        setTeamCategoryKeyword('');
      }}
      onChange={(event, newValue) => {
        event.stopPropagation();
        paramsEdit.api.setEditCellValue({
          id: paramsEdit.id,
          field: paramsEdit.field,
          value: newValue,
        });
      }}
      loading={teamCategoryInfo && teamCategoryInfo.loading}
      getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={teamCategoryOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={onTeamCategoryKeywordChange}
          variant="standard"
          className="without-padding"
          placeholder="Search & Select"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {teamCategoryInfo && teamCategoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );

  const maintenanceCost = (paramsEdit) => (

    <Autocomplete
      sx={{
        width: '100%',
      }}
      name={formField.maitenanceCostsAnalyticAccount.name}
      label={formField.maitenanceCostsAnalyticAccount.label}
      isRequired={formField.maitenanceCostsAnalyticAccount.required}
      className="bg-white"
      open={maintenanceCostOpen}
      size="small"
      onOpen={() => {
        setMaintenanceCostOpen(true);
        setMaintenanceCostKeyword('');
      }}
      onClose={() => {
        setMaintenanceCostOpen(false);
        setMaintenanceCostKeyword('');
      }}
      onChange={(event, newValue) => {
        event.stopPropagation();
        paramsEdit.api.setEditCellValue({
          id: paramsEdit.id,
          field: paramsEdit.field,
          value: newValue,
        });
      }}
      value={paramsEdit.maintenance_cost_analytic_account_id && paramsEdit.maintenance_cost_analytic_account_id.length
        ? paramsEdit.maintenance_cost_analytic_account_id[1] : paramsEdit.maintenance_cost_analytic_account_id && paramsEdit.maintenance_cost_analytic_account_id.name
          ? paramsEdit.maintenance_cost_analytic_account_id.name : costValue}
      loading={maintenanceCostInfo && maintenanceCostInfo.loading}
      getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={maintenanceCostOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={onMaintenanceCostKeywordChange}
          label={formField.maitenanceCostsAnalyticAccount.label}
          variant="standard"
          className="without-padding"
          placeholder="Search & Select"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {maintenanceCostInfo && maintenanceCostInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );

  const workingTime = (paramsEdit) => (
    <Autocomplete
      sx={{
        width: '100%',
      }}
      name={formField.workingTime.name}
      label={formField.workingTime.label}
      isRequired={formField.workingTime.required}
      className="bg-white mt-1"
      open={workingTimeOpen}
      value={paramsEdit.resource_calendar_id && paramsEdit.resource_calendar_id.length
        ? paramsEdit.resource_calendar_id[1] : paramsEdit.resource_calendar_id && paramsEdit.resource_calendar_id.name ? paramsEdit.resource_calendar_id.name : workingTimeValue}
      size="small"
      onOpen={() => {
        setWorkingTimeOpen(true);
        setWorkingTimeKeyword('');
      }}
      onClose={() => {
        setWorkingTimeOpen(false);
        setWorkingTimeKeyword('');
      }}
      onChange={(event, newValue) => {
        event.stopPropagation();
        paramsEdit.api.setEditCellValue({
          id: paramsEdit.id,
          field: paramsEdit.field,
          value: newValue,
        });
      }}
      loading={workingTimeInfo && workingTimeInfo.loading}
      getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={workingTimeOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          label={formField.workingTime.label}
          onChange={onWorkingTimeKeywordChange}
          variant="standard"
          className="without-padding"
          placeholder="Search & Select"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {workingTimeInfo && workingTimeInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );

  const onClickTeamMember = (id) => {
    dispatch(getTeamDetail(id, appModels.TEAM));
    showTeamMember(true);
  };

  const loadingData = (userInfo && userInfo.loading) || (teamInfo && teamInfo.loading) || (teamCountLoading);
  const tableColumns = TeamsColumns(editModeRow, categorySelection, setErrorMessage, onClickTeamMember);
  // const tableColumns = TeamsColumns(editModeRow, categorySelection, maintenanceCost, workingTime);

  const handleRadioboxChange = (event) => {
    const { value } = event.target;
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
    const oldCustomFilters = teamsFilters && teamsFilters.customFilters
      ? teamsFilters.customFilters
      : [];
    const customFilters1 = [
      ...(oldCustomFilters.length > 0
        ? oldCustomFilters.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        )
        : ''),
      ...filters,
    ];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    setFilterText(formatFilterData(customFilters1, globalvalue));
    dispatch(getTeamFilters(customFilters1));
    setOffset(0);
    setPage(0);
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
      const oldCustomFilters = teamsFilters && teamsFilters.customFilters
        ? teamsFilters.customFilters
        : [];
      const filterValues = {
        states:
          teamsFilters && teamsFilters.states ? teamsFilters.states : [],
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
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
    setPage(0);
  };

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'team_category_id',
    ];
    let query = '"|",';

    const oldCustomFilters = teamsFilters && teamsFilters.customFilters
      ? teamsFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setGlobalvalue(data?.quickFilterValues?.[0]);
      fields.filter((field) => {
        query += `["${field}","ilike","${data.quickFilterValues[0]}"],`;
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
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [teamsFilters],
  );

  return (
    <Box className="insights-box">
      <CommonGrid
        className="tickets-table"
        tableData={
          teamInfo && teamInfo.data && teamInfo.data.length
            ? teamInfo.data
            : []
        }
        componentClassName="commonGrid"
        rows={rows}
        errorData={errorMessage}
        columns={tableColumns}
        rowHeight={45}
        setRows={setRows}
        loadingData={loadingData}
        dependencyColumsReload={[teamInfo]}
        moduleName="Teams List"
        appModelsName={appModels.TEAM}
        listCount={totalDataCount}
        createOption={{
          enable: allowedOperations.includes(actionCodes['Add Team']),
          text: 'Add',
          func: () => showAddTeamModal(true),
        }}
        setEditModeRow={setEditModeRow}
        editModeRow={editModeRow}
        defaultFields={{
          maintenance_cost_analytic_account_id: costValue,
          resource_calendar_id: workingTimeValue,
          company_id: userInfo && userInfo.data && userInfo.data.company
            ? userInfo.data.company.id : '',
        }}
        handlePageChange={handlePageChange}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        onFilterChanges={debouncedOnFilterChange}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        setStartExport={setStartExport}
        setRowselected={setRowselected}
        rowselected={rowselected}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        trimFields={['name']}
        exportInfo={teamsExportInfo}
        exportFileName="Teams"
        filters={filterText}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        moduleCustomHeader={(
          teamsFilters && teamsFilters.customFilters && teamsFilters.customFilters.length > 0 ? teamsFilters.customFilters.map((cf) => (
            (cf.field)
              ? (
                <p key={cf.value} className="mr-2 content-inline">
                  <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                    {(cf.header) && (
                      <span>
                        {decodeURIComponent(cf.header)}
                        {' '}
                        :
                        {' '}
                        {decodeURIComponent(cf.value)}
                      </span>
                    )}
                    {/* <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} /> */}
                  </Badge>
                </p>
              ) : ''
          )) : ''
        )}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addTeamModal}
      >
        <DrawerHeader
          headerName="Create Team"
          subTitle="Create Maintenance Team for the site"
          imagePath={false}
          onClose={() => { showAddTeamModal(false); }}
        />
        <AddTeam
          afterReset={() => { showAddTeamModal(false); onReset(); }}
          isDrawer
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={teamMember}
      >
        <DrawerHeader
          headerName="Teams Members"
          subTitle="Add/ View /Delete Teams Members for the team"
          imagePath={false}
          onClose={() => { showTeamMember(false); }}
        />
        {/* <AddTeam
          afterReset={() => { showTeamMember(false); onResetTeam(); }}
          isDrawer
        /> */}
        <Members />
      </Drawer>
    </Box>
  );
};

export default AdminSites;
