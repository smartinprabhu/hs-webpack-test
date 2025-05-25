/* eslint-disable max-len */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-unresolved */
import { makeStyles } from '@material-ui/core/styles';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import { Box } from '@mui/system';
import CommonGrid from '../../commonComponents/commonGrid';
import DrawerHeader from '../../commonComponents/drawerHeader';



import { TeamsListSite } from '../../commonComponents/gridColumns';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  debounce,
  formatFilterData,
  generateArrayFromValue,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getListOfModuleOperations,
  getPagesCount,
  queryGeneratorWithUtc,
  valueCheck, getDateAndTimeForDifferentTimeZones
} from '../../util/appUtils';
import { AdminSetupModule } from '../../util/field';
import actionCodes from '../data/actionCodes.json';
import {
  getTeamDetail,
  getTeamFilters,
  getTeamsCount, getTeamsInfo, resetCreateTeam, resetEditTeam, getTeamsExport,
} from '../setupService';
import siteConfigureData from './data/siteConfigureData.json';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Teams = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(siteConfigureData && siteConfigureData.teamTableColumnsShow ? siteConfigureData.teamTableColumnsShow : []);
  const {
    teamInfo, companyDetail, teamCountLoading, teamCount, createTeamInfo, editTeamInfo,
    teamsExportInfo, teamsFilters,
  } = useSelector((state) => state.setup);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const { userRoles } = useSelector((state) => state.user);
  const { filterInitailValues } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');
  const [editData, setEditData] = useState([]);
  const [addTeamModal, showAddTeamModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [openEditTeamModal, setOpenEditTeamModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [rootInfo, setRootInfo] = useState([]);
  const [keyword, setKeyword] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [rows, setRows] = useState([]);
  const [globalvalue, setGlobalvalue] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const { siteDetails } = useSelector((state) => state.site);
  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);

  const [isEdit, setEdit] = useState(false);

  const [valueArray, setValueArray] = useState([]);

  const isEditable = allowedOperations.includes(actionCodes['Edit Team']);

  const classes = useStyles();

  const searchColumns = AdminSetupModule.maintenanceSearchColumn;
  const advanceSearchColumns = AdminSetupModule.adminAdvanceSearchColumn;

  const columns = useMemo(() => (siteConfigureData.columns), []);
  const data = useMemo(() => (teamInfo.data ? teamInfo.data : [{}]), [teamInfo.data]);

  const hiddenColumns = AdminSetupModule.maintenanceHiddenColumn;

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
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
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
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getTeamFilters([]));
    }
  }, [reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (teamCount && teamCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamsExport(companies, appModels.TEAM, teamCount.length, offsetValue, AdminSetupModule.maintenanceApiFields, customFiltersList, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [startExport]);


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
        // states:
        //   teamsFilters && teamsFilters.states ? teamsFilters.states : [],
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
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getTeamFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = teamsFilters && teamsFilters.customFilters
        ? teamsFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   teamsFilters && teamsFilters.states ? teamsFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getTeamFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const tableColumns = TeamsListSite();

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

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };


  const loading = (companyDetail && companyDetail.loading) || (teamInfo && teamInfo.loading) || (teamCountLoading);

  useEffect(() => {
    (async () => {
      if (((companyDetail && companyDetail.data && companyDetail.data.length))) {
        const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
        await dispatch(getTeamsInfo(companies, appModels.TEAM, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter));
      }
    })();
  }, [companyDetail, offset, sortedValue.sortBy, sortedValue.sortField, createTeamInfo, teamsFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (((createTeamInfo && createTeamInfo.data))) {
      const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamsInfo(companies, appModels.TEAM, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter));
      dispatch(getTeamsCount(companies, appModels.TEAM, customFiltersList, globalFilter));
    }
  }, [createTeamInfo]);

  useEffect(() => {
    (async () => {
      if (companyDetail && companyDetail.data && companyDetail.data.length) {
        const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
        await dispatch(getTeamsInfo(companies, appModels.TEAM, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter));
      }
    })();
  }, [companyDetail, globalFilter]);

  useEffect(() => {
    if (companyDetail && companyDetail.data && companyDetail.data.length) {
      const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamsCount(companies, appModels.TEAM, customFiltersList, globalFilter));
    }
  }, [companyDetail]);

  useEffect(() => {
    if (createTeamInfo && createTeamInfo.data && createTeamInfo.data.length) {
      dispatch(getTeamDetail(createTeamInfo.data[0], appModels.TEAM));
    }
  }, [createTeamInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getTeamDetail(viewId, appModels.TEAM));
    }
  }, [viewId]);

  useEffect(() => {
    if (editTeamInfo && editTeamInfo.data && companyDetail && companyDetail.data && companyDetail.data.length) {
      if (viewId) {
        dispatch(getTeamDetail(viewId, appModels.TEAM));
      }
      const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamsInfo(companies, appModels.TEAM, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter));
    }
  }, [editTeamInfo]);

  useEffect(() => {
    if (selectedUser && teamInfo && teamInfo.data) {
      const teamData = generateArrayFromValue(teamInfo.data, 'id', selectedUser.id);
      setEditData(teamData);
      // dispatch(getTeamsInfo(userInfo.data.company.id, appModels.TEAM, 1, 0, undefined, undefined, selectedUser.id));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (teamsFilters && teamsFilters.customFilters) {
      setCustomFilters(teamsFilters.customFilters);
    }
  }, [teamsFilters]);

  useEffect(() => {
    if (rootInfo && rootInfo.length && rootInfo[0].value) {
      setViewId(rootInfo[0].value);
      setViewModal(true);
    }
  }, [rootInfo]);

  useEffect(() => {
    setCustomFilters([]);
    dispatch(getTeamFilters());
  }, []);

  const closeEditModalWindow = () => {
    if (companyDetail && companyDetail.data && editTeamInfo && editTeamInfo.data && companyDetail && companyDetail.data && companyDetail.data.length) {
      const customFiltersList = teamsFilters.customFilters ? queryGeneratorWithUtc(teamsFilters.customFilters, false, userInfo.data) : '';
      dispatch(getTeamsInfo(companies, appModels.TEAM, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, globalFilter));
    }
    dispatch(resetEditTeam());
    setOpenEditTeamModal(false);
    setSelectedUser(false);
    setEditData([]);
  };
  const totalDataCount = teamCount && teamCount.length ? teamCount.length : 0;

  // const pages = getPagesCount(totalDataCount, limit); 

  const closeModal = () => {
    if (document.getElementById('teamForm')) {
      document.getElementById('teamForm').reset();
    }
    dispatch(resetCreateTeam());
    showAddTeamModal(false);
  };

  const directModal = () => {
    showAddTeamModal(false);
    if (createTeamInfo && createTeamInfo.data && createTeamInfo.data.length) {
      setViewId(createTeamInfo.data[0]);
    }
    dispatch(resetCreateTeam());
  };

  const onClickClear = () => {
    dispatch(getTeamFilters([]));
    setValueArray([]);
    const filterField = siteConfigureData && siteConfigureData.columns ? siteConfigureData.columns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter((item) => item.value !== cfValue);
    dispatch(getTeamFilters(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

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
      const uniquecustomFilter = uniqBy(mergeFiltersList, 'key');
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getTeamFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const advanceSearchjson = {

  };

  const onAddReset = () => {
    dispatch(resetCreateTeam());
    dispatch(resetEditTeam());
    closeEditModalWindow(false);
  };

  const onViewReset = () => {
    if (document.getElementById('teamForm')) {
      document.getElementById('teamForm').reset();
    }
    setOffset(offset);
    setPage(currentPage);
    setViewId(0);
    setViewModal(false);
    setRootInfo([]);
    showAddTeamModal(false);
    setEdit(false);
    dispatch(resetEditTeam());
  };

  function getNextPreview(ids, type) {
    const array = teamInfo && teamInfo.data ? teamInfo.data : [];
    let listId = 0;
    if (array && array.length > 0) {
      const index = array.findIndex((element) => element.id === ids);

      if (index > -1) {
        if (type === 'Next') {
          listId = array[index + 1].id;
        } else {
          listId = array[index - 1].id;
        }
      }
    }
    return listId;
  }

  const listedCount = teamInfo && teamInfo.data ? teamCount : 0;

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
        columns={tableColumns}
        setRows={setRows}
        appModelsName={appModels.COMPANY}
        loading={loading}
        // createOption={{
        //   enable: isCreatable,
        //   text: 'Add',
        //   func: () => showAddModal(true),
        // }}
        moduleName="Maintenance Teams List"
        listCount={totalDataCount}
        handlePageChange={handlePageChange}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        setStartExport={setStartExport}
        onFilterChanges={debouncedOnFilterChange}
        filters={filterText}
        exportInfo={teamsExportInfo}
        exportFileName="Teams"
        setViewModal={setViewModal}
        setViewId={setViewId}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
      />
    </Box>
    // <Row className="pt-2">
    //   <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
    //     <Card className="p-2 mb-2 h-100 bg-lightblue">
    //       <CardBody className="bg-color-white p-1 m-0">
    //         <Row className="p-2 itAsset-table-title">
    //           <Col md="9" xs="12" sm="9" lg="9">
    //             <span className="p-0 mr-2 font-weight-800 font-medium">
    //               Maintenance Teams:
    //               {' '}
    //               {columnHide && columnHide.length && listedCount}
    //             </span>
    //             {columnHide && columnHide.length ? (
    //               <div className="content-inline">
    //                 {customFilters && customFilters.map((cf) => (
    //                   <p key={cf.value} className="mr-2 content-inline">
    //                     <Badge color="dark" className="p-2 mb-1 bg-zodiac">
    //                       {(cf.type === 'inarray') ? (
    //                         <>
    //                           {cf.title}
    //                           <span>
    //                             {'  '}
    //                             :
    //                             {' '}
    //                             {decodeURIComponent(cf.arrayLabel ? cf.arrayLabel : cf.label)}
    //                           </span>
    //                         </>
    //                       ) : (
    //                         cf.label
    //                       )}
    //                       {' '}
    //                       {(cf.type === 'text' || cf.type === 'id') && (
    //                       <span>
    //                         {'  '}
    //                         :
    //                         {' '}
    //                         {decodeURIComponent(cf.value)}
    //                       </span>
    //                       )}
    //                       {(cf.type === 'customdate') && (
    //                       <span>
    //                         {'  '}
    //                         :
    //                         {' '}
    //                         {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
    //                         {' - '}
    //                         {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
    //                       </span>
    //                       )}
    //                       <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
    //                     </Badge>
    //                   </p>
    //                 ))}
    //                 {customFilters && customFilters.length ? (
    //                   <span aria-hidden="true" onClick={() => onClickClear()} className="cursor-pointer text-info mr-2">
    //                     Clear
    //                   </span>
    //                 ) : ''}
    //               </div>
    //             ) : ''}
    //           </Col>
    //           <Col md="3" xs="12" sm="3" lg="3">
    //             <div className="float-right">
    //               <Refresh
    //                 loadingTrue={loading}
    //                 setReload={setReload}
    //               />
    //               {allowedOperations.includes(actionCodes['Add Team']) && (
    //               <CreateList name="Add Team" showCreateModal={() => { showAddTeamModal(true); }} />
    //               )}
    //               <ExportList idNameFilter="teamExport" response={teamInfo && teamInfo.data && teamInfo.data.length} />
    //               <DynamicColumns
    //                 setColumns={setColumns}
    //                 columnFields={columnFields}
    //                 allColumns={allColumns}
    //                 setColumnHide={setColumnHide}
    //                 idNameFilter="teamColumns"
    //                 classNameFilter="drawerPopover"
    //               />
    //             </div>
    //             {teamInfo && teamInfo.data && teamInfo.data.length && (
    //               <>
    //                 {document.getElementById('teamExport') && (
    //                   <Popover className="drawerPopover" placement="bottom" isOpen={filterInitailValues.download} target="teamExport">
    //                     <PopoverHeader>
    //                       Export
    //                       <img
    //                         aria-hidden="true"
    //                         alt="close"
    //                         src={closeCircleIcon}
    //                         onClick={() => dispatch(setInitialValues(false, false, false, false))}
    //                         className="cursor-pointer mr-1 mt-1 float-right"
    //                       />
    //                     </PopoverHeader>
    //                     <PopoverBody>
    //                       <div className="p-2">
    //                         <DataExport
    //                           afterReset={() => dispatch(setInitialValues(false, false, false, false))}
    //                           fields={columnFields}
    //                           sortedValue={sortedValue}
    //                           rows={checkedRows}
    //                           apiFields={AdminSetupModule.maintenanceApiFields}
    //                         />
    //                       </div>
    //                     </PopoverBody>
    //                   </Popover>
    //                 )}
    //               </>
    //             )}
    //           </Col>
    //         </Row>
    //         {(teamInfo && teamInfo.data && teamInfo.data.length > 0) && (
    //         <span data-testid="success-case" />
    //         )}
    //         <div className="thin-scrollbar">
    //           <div className="table-responsive common-table pb-1">
    //             <Table responsive {...getTableProps()} className="mt-2">
    //               <CustomTable
    //                 isAllChecked={isAllChecked}
    //                 handleTableCellAllChange={handleTableCellAllChange}
    //                 searchColumns={searchColumns}
    //                 advanceSearchColumns={advanceSearchColumns}
    //                 advanceSearchFunc={advanceSearchjson}
    //                 onChangeFilter={onChangeFilter}
    //                 removeData={removeData}
    //                 setKeyword={setKeyword}
    //                 handleTableCellChange={handleTableCellChange}
    //                 checkedRows={checkedRows}
    //                 setViewId={setViewId}
    //                 setViewModal={setViewModal}
    //                 tableData={teamInfo}
    //                 actions={{
    //                   hideSorting: {
    //                     fieldName: ['member_ids.length', 'team_category_id[1]', 'employee_id[1]', 'maintenance_cost_analytic_account_id[1]', 'company_id[1]'],
    //                   },
    //                 }}
    //                 tableProps={{
    //                   page,
    //                   prepareRow,
    //                   getTableBodyProps,
    //                   headerGroups,
    //                 }}
    //               />
    //             </Table>
    //             {columnHide && columnHide.length ? (
    //               <TableListFormat
    //                 userResponse={userInfo}
    //                 listResponse={teamInfo}
    //                 countLoad={teamCountLoading}
    //               />
    //             ) : ''}
    //             {columnHide && !columnHide.length ? (
    //               <div className="text-center mb-4">
    //                 Please select the Columns
    //               </div>
    //             ) : ''}
    //           </div>
    //           {loading || pages === 0 ? (<span />) : (
    //             <div className={`${classes.root} float-right`}>
    //               {columnHide && columnHide.length ? (<Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />) : ''}
    //             </div>
    //           )}
    //         </div>
    //       </CardBody>
    //     </Card>
    //   </Col>
    //   <Drawer
    //     title=""
    //     closable={false}
    //     className="drawer-bg-lightblue create-building-compliance"
    //     width={1250}
    //     visible={openEditTeamModal}
    //   >

    //     <DrawerHeader
    //       title="Edit a Team"
    //       imagePath={false}
    //       closeDrawer={closeEditModalWindow}
    //     />
    //     <AddTeam
    //       closeModal={closeEditModalWindow}
    //       directToView={false}
    //       selectedUser={selectedUser}
    //       editData={editData}
    //       afterReset={() => { onAddReset(); }}
    //       isDrawer
    //     />
    //   </Drawer>
    //   <Drawer
    //     title=""
    //     closable={false}
    //     className="drawer-bg-lightblue create-building-compliance"
    //     width={1250}
    //     visible={addTeamModal}
    //   >

    //     <DrawerHeader
    //       title="Add a Team"
    //       imagePath={false}
    //       closeDrawer={closeModal}
    //     />
    //     <AddTeam
    //       closeModal={closeModal}
    //       directToView={directModal}
    //       selectedUser={false}
    //       afterReset={() => { onAddReset(); }}
    //       isDrawer
    //     />
    //   </Drawer>
    //   <Drawer
    //     title=""
    //     closable={false}
    //     className="drawer-bg-lightblue"
    //     width={1250}
    //     visible={viewModal}
    //   >
    //     <DrawerHeader
    //       title="Maintenance Teams"
    //       imagePath={false}
    //       isEditable={isEditable && (teamDetail && !teamDetail.loading)}
    //       closeDrawer={() => onViewReset()}
    //       onEdit={() => {
    //         setEditData(teamDetail && (teamDetail.data && teamDetail.data.length > 0) ? teamDetail.data[0] : false);
    //         setOpenEditTeamModal(!openEditTeamModal);
    //       }}
    //       onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
    //       onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
    //     />
    //     <TeamDeatail />
    //   </Drawer>
    // </Row>
  );
};

export default Teams;
