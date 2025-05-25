/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';

import auditBlue from '@images/icons/auditBlue.svg';
import Drawer from '@mui/material/Drawer';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import {
  Badge,
} from 'reactstrap';
import DrawerHeader from '../../commonComponents/drawerHeader';
import { AddThemeBackgroundColor } from '../../themes/theme';

import {
  setSorting,
} from '../../assets/equipmentService';
import CommonGrid from '../../commonComponents/commonGrid';
import { AuditColumns } from '../../commonComponents/gridColumns';
import {
  auditStatusJson,
} from '../../commonComponents/utils/util';
import {
  resetCreateProductCategory, resetUpdateProductCategory,
} from '../../pantryManagement/pantryService';
import {
  setInitialValues,
} from '../../purchase/purchaseService';
import {
  debounce,
  formatFilterData,
  getActiveTab,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getPagesCountV2,
  getTabs,
  queryGeneratorWithUtc,
  getNextPreview,
} from '../../util/appUtils';
import { AuditSystemModule } from '../../util/field';
import AuditDetail from '../auditDetail/auditDetail';
import {
  getAuditCount,
  getAuditDetails,
  getAuditExport,
  getAuditFilters,
  getAudits,
  getSystemGroups,
} from '../auditService';
import filtersFields from '../data/filtersFields.json';
import auditNav from '../navbar/navlist.json';
import AddAudit from './addAudit';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Audits = (props) => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(AuditSystemModule.auditAPiFields);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [addModal, showAddModal] = useState(false);
  const [reload, setReload] = useState(false);

  const [openSystem, setOpenSystem] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [keyword, setKeyword] = useState(false);

  const [systemGroups, setSystem] = useState([]);
  const [statusGroups, setStatusGroups] = useState([]);

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [copySuccess, setCopySuccess] = useState(false);
  const [columnHide, setColumnHide] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const [valueArray, setValueArray] = useState([]);
  const apiFields = AuditSystemModule && AuditSystemModule.auditAPiFields;
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);

  const { pinEnableData } = useSelector((state) => state.auth);

  const {
    auditsInfo, auditsCount, auditsCountLoading,
    auditFilters, auditDetail, systemGroupInfo, auditAction, auditsExport,
  } = useSelector((state) => state.audit);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { sortedValue } = useSelector((state) => state.equipment);
  const {
    addProductCategoryInfo, updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  const listHead = 'Audits :';
  const tableColumns = AuditColumns();

  const searchColumns = AuditSystemModule.auditSearchColumn;
  const advanceSearchColumns = AuditSystemModule.auditAdvanceSearchColumn;

  const hiddenColumns = AuditSystemModule.auditHiddenColumn;

  const checkTicketsStatusText = (val) => {
    const status = auditStatusJson.find((statusV) => statusV.status === val);
    return status ? status.text : '';
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(auditsInfo && auditsInfo.data && auditsInfo.data.length && auditsInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(auditsInfo && auditsInfo.data && auditsInfo.data.length && auditsInfo.data[auditsInfo.data.length - 1].id);
    }
  }, [auditsInfo]);

  useEffect(() => {
    if (auditsExport && auditsExport.data && auditsExport.data.length > 0) {
      auditsExport.data.map((data) => {
        data.state = checkTicketsStatusText(data.state);
      });
    }
  }, [auditsExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        reference: true,
        name: true,
        date: true,
        state: true,
        audit_system_id: true,
        facility_manager_id: true,
        create_date: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (auditsCount && auditsCount.length) && startExport) {
      const offsetValues = 0;
      const customFiltersQuery = auditFilters && auditFilters.customFilters ? queryGeneratorWithUtc(auditFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAuditExport(companies, appModels.SYSTEMAUDIT, auditsCount.length, offsetValues, AuditSystemModule.auditAPiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [startExport]);

  useEffect(() => {
    if (systemGroupInfo && systemGroupInfo.data) {
      setSystem(systemGroupInfo.data);
    }
  }, [systemGroupInfo]);

  useEffect(() => {
    if (openSystem) {
      dispatch(getSystemGroups(companies, appModels.SYSTEMAUDIT));
    }
  }, [openSystem]);

  useEffect(() => {
    if (auditFilters && auditFilters.customFilters) {
      setCustomFilters(auditFilters.customFilters);
    }
  }, [auditFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = auditFilters.customFilters ? queryGeneratorWithUtc(auditFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAuditCount(companies, appModels.SYSTEMAUDIT, customFiltersList, globalFilter));
    }
  }, [userInfo, auditFilters.customFilters]);

  useEffect(() => {
    if (reload) {
      dispatch(getAuditFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = auditFilters.customFilters ? queryGeneratorWithUtc(auditFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getAudits(companies, appModels.SYSTEMAUDIT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, auditFilters.customFilters, globalFilter]);

  useEffect(() => {
    if ((addProductCategoryInfo && addProductCategoryInfo.data)) {
      const customFiltersList = auditFilters.customFilters ? queryGeneratorWithUtc(auditFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAuditCount(companies, appModels.SYSTEMAUDIT, customFiltersList, globalFilter));
      dispatch(getAudits(companies, appModels.SYSTEMAUDIT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addProductCategoryInfo]);

  useEffect(() => {
    if ((updateProductCategoryInfo && updateProductCategoryInfo.data)
      || (auditAction && auditAction.data)) {
      const customFiltersList = auditFilters.customFilters ? queryGeneratorWithUtc(auditFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAudits(companies, appModels.SYSTEMAUDIT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addProductCategoryInfo, updateProductCategoryInfo, auditAction]);


  // useEffect(() => {
  //   if (updateProductCategoryInfo && updateProductCategoryInfo.data) {
  //     dispatch(getAuditDetails(viewId, appModels.SYSTEMAUDIT));
  //   }
  // }, [updateProductCategoryInfo]);

  useEffect(() => {
    if (addProductCategoryInfo && addProductCategoryInfo.data && addProductCategoryInfo.data.length && !viewId) {
      dispatch(getAuditDetails(addProductCategoryInfo.data[0], appModels.SYSTEMAUDIT));
    }
  }, [addProductCategoryInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getAuditDetails(viewId, appModels.SYSTEMAUDIT));
    }
  }, [viewId]);

  const onClickClear = () => {
    dispatch(getAuditFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.columns ? filtersFields.columns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenSystem(false);
    setOpenStatus(false);
  };

  const columns = useMemo(() => filtersFields && filtersFields.columns, []);
  const data = useMemo(() => (auditsInfo && auditsInfo.data && auditsInfo.data.length > 0 ? auditsInfo.data : [{}]), [auditsInfo.data]);
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
    if (auditsInfo && auditsInfo.loading) {
      setOpenStatus(false);
      setOpenSystem(false);
    }
  }, [auditsInfo]);

  useEffect(() => {
    if (openSystem) {
      setKeyword(' ');
      setOpenStatus(false);
    }
  }, [openSystem]);

  useEffect(() => {
    if (openStatus) {
      setKeyword(' ');
      setOpenSystem(false);
    }
  }, [openStatus]);

  const totalDataCount = auditsCount && auditsCount.length ? auditsCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
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
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const dataValue = auditsInfo && auditsInfo.data ? auditsInfo.data : [];
      const newArr = [...getColumnArrayById(dataValue, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const dataValue = auditsInfo && auditsInfo.data ? auditsInfo.data : [];
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
      dispatch(getAuditFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getAuditFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  /* useEffect(() => {
    if (customFilters && customFilters.length && valueArray && valueArray.length === 0) {
      setValueArray(customFilters);
    }
  }, [customFilters]); */

  const handleSystemChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'audit_system_id', title: 'System', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getAuditFilters(customFiltersList));
      removeData('data-audit_system_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getAuditFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  /* const handleNatureChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'nature_work_id', title: 'Nature', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getAuditFilters(customFiltersList));
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getAuditFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  }; */

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
    const oldCustomFilters = auditFilters && auditFilters.customFilters
      ? auditFilters.customFilters
      : [];
    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    setFilterText(formatFilterData(customFilters1, globalvalue));
    dispatch(getAuditFilters(customFilters1));
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
      const oldCustomFilters = auditFilters && auditFilters.customFilters
        ? auditFilters.customFilters
        : [];
      const filterValues = {
        states:
          auditFilters && auditFilters.states ? auditFilters.states : [],
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
      dispatch(getAuditFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = auditFilters && auditFilters.customFilters
        ? auditFilters.customFilters
        : [];
      const filterValues = {
        states:
          auditFilters && auditFilters.states ? auditFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getAuditFilters(filterValues.customFilters));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter((item) => item.value !== cfValue);
    dispatch(getAuditFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const closeAddAudit = () => {
    showAddModal(false);
    showEditModal(false);
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());
  };

  const closeEditAudit = () => {  
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());    
    showAddModal(false);
    showEditModal(false);    
    dispatch(getAuditDetails(viewId, appModels.SYSTEMAUDIT));  
    setViewModal(true);
  };

  const addAdjustmentWindow = () => {
    if (document.getElementById('auditSystemform')) {
      document.getElementById('auditSystemform').reset();
    }
    showAddModal(true);
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
      const customFiltersList = [];
      const mergeFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getAuditFilters(customFiltersList));
      // dispatch(getAuditFilters(filterArray));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const advanceSearchjson = {
    audit_system_id: setOpenSystem,
    state: setOpenStatus,
  };

  const uuid = auditDetail && auditDetail.data && auditDetail.data.length ? auditDetail.data[0].uuid : false;
  // eslint-disable-next-line max-len
  const uuid2 = auditDetail && auditDetail.data && auditDetail.data.length && auditDetail.data[0].audit_system_id && auditDetail.data[0].audit_system_id.uuid ? auditDetail.data[0].audit_system_id.uuid : false;

  const stateValuesList = (auditFilters && auditFilters.customFilters && auditFilters.customFilters.length > 0)
    ? auditFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (auditFilters && auditFilters.customFilters && auditFilters.customFilters.length > 0) ? auditFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (auditsInfo && auditsInfo.loading) || (auditsCountLoading);

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
      'reference',
      'name',
      'state',
      'audit_system_id',
      'facility_manager_id',
    ];
    let query = '"|","|","|","|",';

    const oldCustomFilters = auditFilters && auditFilters.customFilters
      ? auditFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setGlobalvalue(data?.quickFilterValues?.[0]);
      fields.filter((field) => {
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
        dispatch(getAuditFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getAuditFilters(customFilters));
    }

    const filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : [];
    const statusField = filtersData.length > 0 && filtersData.findIndex((item) => item.field === 'state');
    if ((statusField !== -1 || statusField === 0 || !statusField) && filtersData[statusField] && filtersData[statusField].value) {
      filtersData[statusField].value = auditStatusJson.find((status) => filtersData[statusField].value === status.status).text;
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
    [auditFilters],
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
    <>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          height: '90%',
        }}
        tableData={auditsInfo && auditsInfo.data && auditsInfo.data.length
          ? auditsInfo.data
          : []}
        createTabs={{
          enable: true,
          menuList: props.menuList,
          tabs: props.tabs,
        }}
        columns={tableColumns}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Audits"
        exportFileName="Audit"
        listCount={totalDataCount}
        exportInfo={auditsExport}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: true,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        subTabs={{
          enable: true,
        }}
        setRows={setRows}
        rows={rows}
        filters={filterText}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={auditsInfo && auditsInfo.loading}
        err={auditsInfo && auditsInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        setActive={props.setActive}
        setCurrentTab={props.setCurrentTab}
        isSet={props.isSet}
        currentTab={props.currentTab}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        moduleCustomHeader={(
          <>
            {customFilters && customFilters.length > 0 ? customFilters.map((cf) => (
              ((cf.type === 'id' || cf.type === 'text') && cf.label && cf.label !== '')
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                      {(cf.type === 'text') && (
                      <span>
                        {decodeURIComponent(cf.name)}
                      </span>
                      )}
                      {(cf.type === 'id') && (
                      <span>
                        {cf.label}
                        {'  '}
                        :
                        {' '}
                        {decodeURIComponent(cf.value)}
                      </span>
                      )}
                      <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                    </Badge>
                  </p>
                ) : ''
            )) : ''}
          </>
        )}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <div className="">
          <DrawerHeader
            headerName={auditDetail && (auditDetail.data && auditDetail.data.length > 0)
              ? `${'Audit'}${' - '}${auditDetail.data[0].name}${' ('}${auditDetail.data[0].reference}${')'}` : 'Audit'}
            imagePath={auditBlue}
            onClose={() => onViewReset()}            
            onPrev={() => {
              getNextPreview(viewId, 'Prev', auditsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', auditsInfo));
            }}
            onNext={() => {
              getNextPreview(viewId, 'Next', auditsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', auditsInfo));
            }}
          />
        </div>
        <AuditDetail setViewModal={setViewModal} editModal={editModal} closeEditAudit={closeEditAudit} editId={editId} showEditModal={showEditModal} setEditId={setEditId} />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addModal}
      >

        <DrawerHeader
          headerName="Create Audit"
          imagePath={auditBlue}
          onClose={closeAddAudit}
        />
        <AddAudit closeModal={closeAddAudit} />
      </Drawer>
      {/* <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={1250}
        visible={editModal}
      >

        <DrawerHeader
          title="Update Audit"
          imagePath={auditBlue}
          closeDrawer={closeEditAudit} />
        <AddAudit editId={editId} closeModal={closeEditAudit} />
      </Drawer> */}
    </>
  );
};

export default Audits;
