/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer, Tooltip,
} from '@mui/material';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import auditBlue from '@images/icons/auditBlue.svg';
import DrawerHeader from '../../commonComponents/drawerHeader';

import CommonGrid from '../../commonComponents/commonGrid';
import { AuditActionColumns } from '../../commonComponents/gridColumns';
import auditNav from '../navbar/navlist.json';

import {
  setSorting,
} from '../../assets/equipmentService';
import {
  setInitialValues,
} from '../../purchase/purchaseService';
import {
  getActiveTab,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getPagesCountV2,
  getTabs,
  queryGeneratorWithUtc,
  debounce,
  formatFilterData,
  getNextPreview,
  truncate,
} from '../../util/appUtils';
import { AuditSystemModule } from '../../util/field';
import {
  getNonConformitieCount,
  getNonConformitieDetails,
  getNonConformitieExport,
  getNonConformitieFilters,
  getNonConformities,
  getStatusGroups,
} from '../auditService';
import customData from '../data/customData.json';
import filtersFields from '../data/filtersFields.json';
import NonConformitiesDetail from '../nonConformitiesDetail/nonConformitiesDetail';
import {
  auditActionStatusJson,
} from '../../commonComponents/utils/util';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const NonConformities = (props) => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShowsNC ? customData.listfieldsShowsNC : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [stageGroups, setStageGroups] = useState([]);

  const [filtersIcon, setFilterIcon] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [openStage, setOpenStage] = useState(false);
  const [openResponsive, setOpenResponsive] = useState(false);

  const [valueArray, setValueArray] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [statusGroups, setStatusGroups] = useState([]);
  const [responseGroups, setResponseGroups] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [reload, setReload] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);

  
  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { sortedValue } = useSelector((state) => state.equipment);

  const { pinEnableData } = useSelector((state) => state.auth);

  const companies = getAllowedCompanies(userInfo);
  const {
    nonConformitiesInfo, nonConformitiesCount, nonConformitiesCountLoading,
    nonConformitieFilters, nonConformitieDetail, statusGroupInfo, nonConformitiesExport, auditAction,
  } = useSelector((state) => state.audit);
  const apiFields = customData.listFields;
  const listHead = 'Actions :';
  const { filterInitailValues } = useSelector((state) => state.purchase);

  const checkTicketsStatusText = (val) => {
    const status = auditActionStatusJson.find((statusV) => statusV.status === val);
    return status ? status.text : '';
  };


  useEffect(() => {
    if (nonConformitiesExport && nonConformitiesExport.data && nonConformitiesExport.data.length > 0) {
      nonConformitiesExport.data.map((data) => {
        data.state = checkTicketsStatusText(data.state);
      });
    }
  }, [nonConformitiesExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        date_deadline: true,
        state: true,
        type_action: true,
        user_id: true,
        audit_id: true,
        helpdesk_id: true,
        create_date: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      dispatch(getNonConformitieFilters([]));
      setPage(0);
      setOffset(0);
      setCustomFilters([]);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (statusGroupInfo && statusGroupInfo.data) {
      setStageGroups(statusGroupInfo.data);
    }
  }, [statusGroupInfo]);

  useEffect(() => {
    if (openStage) {
      dispatch(getStatusGroups(companies, appModels.AUDITACTION));
    }
  }, [openStage]);

  useEffect(() => {
    if (nonConformitieFilters && nonConformitieFilters.customFilters) {
      setCustomFilters(nonConformitieFilters.customFilters);
    }
  }, [nonConformitieFilters]);

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(nonConformitiesInfo && nonConformitiesInfo.data && nonConformitiesInfo.data.length && nonConformitiesInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(nonConformitiesInfo && nonConformitiesInfo.data && nonConformitiesInfo.data.length && nonConformitiesInfo.data[nonConformitiesInfo.data.length - 1].id);
    }
  }, [nonConformitiesInfo]);

  
  useEffect(() => {
    if ( (auditAction && auditAction.data)) {
      const customFiltersList = nonConformitieFilters.customFilters ? queryGeneratorWithUtc(nonConformitieFilters.customFilters, false, userInfo.data) : '';
      dispatch(getNonConformitieCount(companies, appModels.AUDITACTION, customFiltersList, globalFilter));
      dispatch(getNonConformities(companies, appModels.AUDITACTION, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [ auditAction]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = nonConformitieFilters.customFilters ? queryGeneratorWithUtc(nonConformitieFilters.customFilters, false, userInfo.data) : '';
      dispatch(getNonConformitieCount(companies, appModels.AUDITACTION, customFiltersList, globalFilter));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = nonConformitieFilters.customFilters ? queryGeneratorWithUtc(nonConformitieFilters.customFilters, false, userInfo.data) : '';
      dispatch(getNonConformities(companies, appModels.AUDITACTION, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue, customFilters]);

  useEffect(() => {
    if (viewId) {
      dispatch(getNonConformitieDetails(viewId, appModels.AUDITACTION));
    }
  }, [viewId]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (nonConformitiesCount && nonConformitiesCount.length)) {
      const offsetValues = 0;
      const customFiltersQuery = nonConformitieFilters && nonConformitieFilters.customFilters ? queryGeneratorWithUtc(nonConformitieFilters.customFilters, false, userInfo.data) : '';
      dispatch(getNonConformitieExport(companies, appModels.AUDITACTION, nonConformitiesCount.length, offsetValues, AuditSystemModule.actionApiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [startExport]);

  const totalDataCount = nonConformitiesCount && nonConformitiesCount.length ? nonConformitiesCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const onClickClear = () => {
    dispatch(getNonConformitieFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.columnsNcFields ? filtersFields.columnsNcFields : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenResponsive(false);
    setOpenStage(false);
    setOpenStatus(false);
  };

  const searchColumns = AuditSystemModule.actionSearchColumn;
  const advanceSearchColumns = AuditSystemModule.actionAdvanceSearchColumn;

  const hiddenColumns = AuditSystemModule.actionHiddenColumn;

  const columns = useMemo(() => filtersFields && filtersFields.columnsNcFields, []);
  const data = useMemo(() => (nonConformitiesInfo && nonConformitiesInfo.data && nonConformitiesInfo.data.length > 0 ? nonConformitiesInfo.data : [{}]), [nonConformitiesInfo.data]);
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
    if (nonConformitiesInfo && nonConformitiesInfo.loading) {
      setOpenStatus(false);
      setOpenStage(false);
      setOpenResponsive(false);
    }
  }, [nonConformitiesInfo]);

  useEffect(() => {
    if (openStage) {
      setKeyword(' ');
      setOpenStatus(false);
      setOpenResponsive(false);
    }
  }, [openStage]);

  useEffect(() => {
    if (openStatus) {
      setKeyword(' ');
      setOpenStage(false);
      setOpenResponsive(false);
    }
  }, [openStatus]);

  useEffect(() => {
    if (openResponsive) {
      setKeyword(' ');
      setOpenStage(false);
      setOpenStatus(false);
    }
  }, [openResponsive]);

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
      const dataValue = nonConformitiesInfo && nonConformitiesInfo.data ? nonConformitiesInfo.data : [];
      const newArr = [...getColumnArrayById(dataValue, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const dataValue = nonConformitiesInfo && nonConformitiesInfo.data ? nonConformitiesInfo.data : [];
      const ids = getColumnArrayById(dataValue, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getNonConformitieFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getNonConformitieFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleRtCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'type_action', title: 'Responsible Type', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getNonConformitieFilters(customFiltersList));
      removeData('data-type_action');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getNonConformitieFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleStatusChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'audit_id', title: 'Audit', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getNonConformitieFilters(customFiltersList));
      removeData('data-audit_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getNonConformitieFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const onStatusSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = stageGroups.filter((item) => {
        const searchValue = item.audit_id ? item.audit_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setStageGroups(ndata);
    } else {
      setStageGroups(statusGroupInfo && statusGroupInfo.data ? statusGroupInfo.data : []);
    }
  };

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
    const oldCustomFilters = nonConformitieFilters && nonConformitieFilters.customFilters
      ? nonConformitieFilters.customFilters
      : [];
    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    setFilterText(formatFilterData(customFilters1, globalvalue));
    dispatch(getNonConformitieFilters(customFilters1));
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
      const oldCustomFilters = nonConformitieFilters && nonConformitieFilters.customFilters
        ? nonConformitieFilters.customFilters
        : [];
      const filterValues = {
        states:
          nonConformitieFilters && nonConformitieFilters.states ? nonConformitieFilters.states : [],
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
      dispatch(getNonConformitieFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = nonConformitieFilters && nonConformitieFilters.customFilters
        ? nonConformitieFilters.customFilters
        : [];
      const filterValues = {
        states:
          nonConformitieFilters && nonConformitieFilters.states ? nonConformitieFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getNonConformitieFilters(filterValues.customFilters));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value));
    const customFiltersList = customFilters.filter((item) => item.value !== value);
    dispatch(getNonConformitieFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCustomFilters([]);
    dispatch(getNonConformitieFilters([]));
    setOffset(0);
    setPage(0);
  };

  const showDetailsView = (id) => {
    dispatch(setInitialValues(false, false, false, false));
    setViewId(id);
    setViewModal(true);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const sVal = values.fieldValue ? values.fieldValue.trim() : '';
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(sVal), label: values.fieldName.label, type: 'text',
    }];
    const customFilters1 = [...customFilters, ...filters];
    resetForm({ values: '' });
    dispatch(getNonConformitieFilters(customFilters1));
    setOffset(0);
    setPage(0);
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
      setPage(0);
      const customFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = [...new Map(customFiltersList.map((m) => [m.key, m])).values()];
      dispatch(getNonConformitieFilters(uniquecustomFilter));
      // dispatch(getAuditFilters(filterArray));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const advanceSearchjson = {
    type_action: setOpenResponsive,
    audit_id: setOpenStage,
    state: setOpenStatus,
  };

  const stateValuesList = (nonConformitieFilters && nonConformitieFilters.customFilters && nonConformitieFilters.customFilters.length > 0)
    ? nonConformitieFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (nonConformitieFilters && nonConformitieFilters.customFilters && nonConformitieFilters.customFilters.length > 0) ? nonConformitieFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (nonConformitiesInfo && nonConformitiesInfo.loading) || (nonConformitiesCountLoading);

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

  const tableColumns = AuditActionColumns();

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'state',
      'type_action',
      'user_id',
      'audit_id',
      'helpdesk_id',
    ];
    let query = '"|","|","|","|","|",';

    const oldCustomFilters = nonConformitieFilters && nonConformitieFilters.customFilters
      ? nonConformitieFilters.customFilters
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
        dispatch(getNonConformitieFilters(customFilters));
      }
    } else {
      const CustomFilters = [...dateFilters];
      dispatch(getNonConformitieFilters(CustomFilters));
    }

    const filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : [];
    const statusField = filtersData.length > 0 && filtersData.findIndex((item) => item.field === 'state');
    if ((statusField !== -1 || statusField === 0 || !statusField) && filtersData[statusField] && filtersData[statusField].value) {
      filtersData[statusField].value = auditActionStatusJson.find((status) => filtersData[statusField].value === status.status).text;
    }
    const customFiltersData = [...dateFilters, ...filtersData];

    setFilterText(formatFilterData(customFiltersData, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [nonConformitieFilters],
  );

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Audit System',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, auditNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Audit',
    );
  }

  const titleName = nonConformitieDetail && (nonConformitieDetail.data && nonConformitieDetail.data.length > 0) ? nonConformitieDetail.data[0].name :'';

  const truncatedTitle = truncate(
    typeof titleName === 'string' ? titleName : JSON.stringify(titleName),
    90
  );

  const headerWithTooltip = (
    <Tooltip title={titleName} placement="bottom">
      <span>{truncatedTitle ? `Actions - ${truncatedTitle}` : 'Actions'}</span>
    </Tooltip>
  );
  

  return (
    <>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          height: '90%',
        }}
        tableData={
          nonConformitiesInfo && nonConformitiesInfo.data && nonConformitiesInfo.data.length
            ? nonConformitiesInfo.data
            : []
        }
        createTabs={{
          enable: true,
          menuList: props.menuList,
          tabs: props.tabs,
        }}
        columns={tableColumns}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Actions"
        exportFileName="Audit Actions"
        listCount={totalDataCount}
        exportInfo={nonConformitiesExport}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={nonConformitiesInfo && nonConformitiesInfo.loading}
        err={nonConformitiesInfo && nonConformitiesInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        filters={filterText}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        setActive={props.setActive}
        setCurrentTab={props.setCurrentTab}
        isSet={props.isSet}
        currentTab={props.currentTab}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={headerWithTooltip}
          imagePath={auditBlue}
          onClose={() => onViewReset()}
          isEditable={editModal && (nonConformitieDetail && !nonConformitieDetail.loading)}
          onEdit={() => {
            setEditId(nonConformitieDetail && (nonConformitieDetail.data && nonConformitieDetail.data.length > 0) ? nonConformitieDetail.data[0].id : false);
            showEditModal(!editModal);
          }}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', nonConformitiesInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', nonConformitiesInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', nonConformitiesInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', nonConformitiesInfo));
          }}
        />
        <NonConformitiesDetail setViewModal={setViewModal} />
      </Drawer>
    </>

  );
};

export default NonConformities;
