/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import React, { useState, useEffect, useMemo } from 'react';
import {
  
  Modal, 
  ModalBody,
} from 'reactstrap';
import { /* Drawer, */ Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import uniqBy from 'lodash/unionBy';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import InventoryBlue from '@images/icons/inventoryBlue.svg';
/* import DrawerHeader from '@shared/drawerHeader'; */


import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import CommonGrid from '../../../commonComponents/commonGrid';
import { ReorderColumns } from '../../../commonComponents/gridColumns';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  resetDelete, getDelete,
} from '../../../pantryManagement/pantryService';

import {
  getColumnArrayById, getPagesCountV2, truncate, getListOfModuleOperations, queryGeneratorWithUtc, getAllowedCompanies, getDateAndTimeForDifferentTimeZones, debounce, getNextPreview,
} from '../../../util/appUtils';
import {
  getReOrderingRules, getReOrderingCount, getProductTypes,
  setInitialValues, 
  getCheckedRowsReOrderingRules, getReorderRuleDetails,
  clearAddReOrderingRule, clearEditReOderingRule, getReoderingFilters, getReOrderingRulesExport,
} from '../../purchaseService';
import customData from './data/customData.json';
import ReOrderingRulesDetails from './reOrderingRulesDetails';
import AddReorderingRules from './addReorderingRules';
import actionCodes from '../../../inventory/data/actionCodes.json';
import filtersFields from './data/filtersFields.json';
import { InventoryModule } from '../../../util/field';
import {
  getInventorySettingDetails,
} from '../../../siteOnboarding/siteService';

const appModels = require('../../../util/appModels').default;

const ReOrderingRulesList = (props) => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [reload, setReload] = useState(false);
  const [currentPage, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [product, setProduct] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [count, setCount] = useState(0);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkItems, setCheckItems] = useState([]);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [reOrderingRule, setReOrderingRule] = useState('');
  const [isAddReorder, setOpenAddReorderModal] = useState(false);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);

  const [columnsList, setColumnsList] = useState(InventoryModule.reOrderingColumnList);
  const [customFilters, setCustomFilters] = useState([]);
  const [productValue, setProductValue] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editButtonHover, setEditButtonHover] = useState(false);
  const [cancelButtonHover, setCancelButtonHover] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [addModal, showAddModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});

  const [columnHide, setColumnHide] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [productOpen, setProductOpen] = useState(false);
  const [keyword, setKeyword] = useState(false);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [productGroups, setProductGroups] = useState([]);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const apiFields = customData && customData.reorderingListFields;

  const {
    deleteInfo,
  } = useSelector((state) => state.pantry);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    productDetailsInfo, reOrderingRulesInfo, reOrderingRulesCount, reOrderingRulesFilters, filterInitailValues, reOrderingRuleDetailsInfo,
    addReorderInfo, updateReorderInfo, reorderingCountLoading, reorderingFilters, productTypes, reOrderingRulesExportInfo, reOrderingRulesRows,
  } = useSelector((state) => state.purchase);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const listHead = 'Reordering Rules :';
  const totalDataCount = reOrderingRulesCount && reOrderingRulesCount.data && reOrderingRulesCount.data.length ? reOrderingRulesCount.data.length : 0;

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');
  // const isCreatable = allowedOperations.includes(actionCodes['Add Reorder Rule']);
  const isCreatable = true;
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Reorder Rule']);

  const isEditable = allowedOperations.includes(actionCodes['Edit Reorder Rule']);
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();
  const loading = (userInfo && userInfo.loading) || (productDetailsInfo && productDetailsInfo.loading) || (reOrderingRulesInfo && reOrderingRulesInfo.loading);
  const pages = getPagesCountV2(count, limit);
  const dateFilters = (reorderingFilters && reorderingFilters.customFilters && reorderingFilters.customFilters.length > 0) ? reorderingFilters.customFilters : [];

  const companies = getAllowedCompanies(userInfo);

  // const AddReorderingRules = React.lazy(() => import('./addReorderingRules'));

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getInventorySettingDetails(userInfo.data.company.id, appModels.INVENTORYCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getReoderingFilters([]));
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      // const productValuesInfo = reorderingFilters && reorderingFilters.products ? getColumnArrayById(reorderingFilters.products, 'id') : [];
      // const customFilterValuesInfo = reorderingFilters && reorderingFilters.customFilters ? queryGeneratorWithUtc(reorderingFilters.customFilters, 'id', userInfo.data) : [];
      const customFiltersList = reorderingFilters.customFilters ? queryGeneratorWithUtc(reorderingFilters.customFilters, false, userInfo.data) : '';
      dispatch(getReOrderingRules(appModels.REORDERINGRULES, companies, limit, offset, sortedValue.sortBy, sortedValue.sortField, customFiltersList, globalFilter));
    }
  }, [offset, sortedValue.sortBy, sortedValue.sortField, JSON.stringify(customFilters), globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const productValuesInfo = reorderingFilters && reorderingFilters.products ? getColumnArrayById(reorderingFilters.products, 'id') : [];
      const customFiltersList = reorderingFilters.customFilters ? queryGeneratorWithUtc(reorderingFilters.customFilters, false, userInfo.data) : '';
      const customFilterValuesInfo = reorderingFilters && reorderingFilters.customFilters ? queryGeneratorWithUtc(reorderingFilters.customFilters, 'id', userInfo.data) : [];
      dispatch(getReOrderingCount(appModels.REORDERINGRULES, companies, customFiltersList, globalFilter, reload));
    }
  }, [JSON.stringify(customFilters), globalFilter]);

  useEffect(() => {
    if (addReorderInfo && addReorderInfo.data) {
      const customFiltersList = reorderingFilters.customFilters ? queryGeneratorWithUtc(reorderingFilters.customFilters, false, userInfo.data) : '';
      dispatch(getReOrderingRules(appModels.REORDERINGRULES, companies, limit, offset, sortedValue.sortBy, sortedValue.sortField, customFiltersList, globalFilter));
      dispatch(getReOrderingCount(appModels.REORDERINGRULES, companies, customFiltersList, globalFilter));
    }
  }, [addReorderInfo]);

  useEffect(() => {
    if (deleteInfo && deleteInfo.data) {
      const customFiltersList = reorderingFilters.customFilters ? queryGeneratorWithUtc(reorderingFilters.customFilters, false, userInfo.data) : '';
      dispatch(getReOrderingRules(appModels.REORDERINGRULES, companies, limit, offset, sortedValue.sortBy, sortedValue.sortField, customFiltersList, globalFilter));
      dispatch(getReOrderingCount(appModels.REORDERINGRULES, companies, customFiltersList, globalFilter));
    }
  }, [deleteInfo]);

  useEffect(() => {
    if (updateReorderInfo && updateReorderInfo.data) {
      const customFiltersList = reorderingFilters.customFilters ? queryGeneratorWithUtc(reorderingFilters.customFilters, false, userInfo.data) : '';
      dispatch(getReOrderingRules(appModels.REORDERINGRULES, companies, limit, offset, sortedValue.sortBy, sortedValue.sortField, customFiltersList, globalFilter));
    }
  }, [updateReorderInfo]);

  const reOderingRulesLength = reOrderingRulesCount && reOrderingRulesCount.data && reOrderingRulesCount.data.length ? reOrderingRulesCount.data.length : 0;

  useEffect(() => {
    if ((userInfo && userInfo.data) && (reOderingRulesLength)) {
      const offsetValue = 0;
      const customFiltersQuery = reOrderingRulesFilters && reOrderingRulesFilters.customFilters ? reOrderingRulesCount(reOrderingRulesCount.customFilters) : '';
      const rows = reOrderingRulesRows.rows ? reOrderingRulesRows.rows : [];
      dispatch(getReOrderingRulesExport(appModels.REORDERINGRULES, false, reOderingRulesLength, offsetValue, apiFields, sortedValue.sortBy, sortedValue.sortField, customFiltersQuery, rows));
    }
  }, [userInfo, startExport]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsReOrderingRules(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (userInfo && userInfo.data && productDetailsInfo && (productDetailsInfo.data && productDetailsInfo.data.length > 0)) {
      setProduct(productDetailsInfo.data[0]);
    }
  }, [productDetailsInfo, userInfo]);

  /* useEffect(() => {
    if (reOrderingRule) {
      dispatch(getReorderRuleDetails(appModels.REORDERINGRULES, reOrderingRule));
    }
  }, [reOrderingRule, updateReorderInfo]); */

  useEffect(() => {
    if (viewId) {
      dispatch(getReorderRuleDetails(appModels.REORDERINGRULES, viewId));
    }
  }, [viewId]);

  useEffect(() => {
    if (reOrderingRulesCount && reOrderingRulesCount.data && reOrderingRulesCount.data.length) {
      setCount(reOrderingRulesCount.data.length);
    } else {
      setCount(0);
    }
  }, [reOrderingRulesCount]);

  useEffect(() => {
    if (reorderingFilters && reorderingFilters.products) {
      setCheckItems(reorderingFilters.products);
    }
    if (reorderingFilters && reorderingFilters.customFilters) {
      setCustomFilters(reorderingFilters.customFilters);
    }
  }, [reorderingFilters]);

  const handleTableCellChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => item !== value));
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const data = reOrderingRulesInfo && reOrderingRulesInfo.data ? reOrderingRulesInfo.data : [];
      setCheckRows(getColumnArrayById(data, 'id'));
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };
  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
  };
  const handleProductsClose = (value) => {
    setProductValue(value);
    setCheckItems(checkItems.filter((item) => item.id !== value));
  };
  const handleSearchFilter = (values, { resetForm }) => {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    setCustomFilters([...customFilters.filter((item) => item.type !== 'text'), ...filters]);
    const productTypesInfo = reorderingFilters && reorderingFilters.products ? reorderingFilters.products : [];
    const customFiltersInfo = [...customFilters.filter((item) => item.type !== 'text'), ...filters];
    dispatch(getReoderingFilters(productTypesInfo, customFiltersInfo));
    resetForm({ values: '' });
  };
  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const productTypesInfo = reorderingFilters && reorderingFilters.products ? reorderingFilters.products : [];
    dispatch(getReoderingFilters(productTypesInfo, customFilters.filter((item) => item.key !== value)));
  };

  // const handleRadioboxChange = (event) => {
  //   const { checked, value } = event.target;
  //   const filters = [{
  //     key: value, value, label: value, type: 'date',
  //   }];
  //   const oldCustomFilters = reorderingFilters && reorderingFilters.customFilters ? reorderingFilters.customFilters : [];
  //   const productsData = reorderingFilters && reorderingFilters.products ? reorderingFilters.products : [];

  //   if (checked) {
  //     setCustomFiltersList(filters);
  //     const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
  //     dispatch(getReoderingFilters(productsData, customFiltersData));
  //   } else {
  //     setCustomFiltersList(customFiltersList.filter((item) => item !== value));
  //     const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...customFiltersList.filter((item) => item !== value)];
  //     dispatch(getReoderingFilters(productsData, customFiltersData));
  //   }
  // };

  const handleRadioboxChange = (event) => {
    const { value } = event.target;
    const filters = [
      {
        key: value,
        value,
        label: value,
        type: 'date',
        Header: value,
        id: value,
      },
    ];
    const oldCustomFilters = reorderingFilters && reorderingFilters.customFilters
      ? reorderingFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getReoderingFilters(customFilters1));

    setOffset(0);
    setPage(0);
  };

  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = reorderingFilters && reorderingFilters.customFilters ? reorderingFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
      dispatch(getReoderingFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  // const handleCustomDateChange = (start, end) => {
  //   const value = 'Custom';
  //   const filters = [{
  //     key: value, value, label: value, type: 'customdate', start, end,
  //   }];
  //   const oldCustomFilters = reorderingFilters && reorderingFilters.customFilters ? reorderingFilters.customFilters : [];
  //   const productsData = reorderingFilters && reorderingFilters.products ? reorderingFilters.products : [];

  //   if (start && end) {
  //     setCustomFiltersList(filters);
  //     const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
  //     dispatch(getReoderingFilters(productsData, customFiltersData));
  //   } else {
  //     setCustomFiltersList(customFiltersList.filter((item) => item !== value));
  //     const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...customFiltersList.filter((item) => item !== value)];
  //     dispatch(getReoderingFilters(productsData, customFiltersData));
  //   }
  // };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];
    const getDateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, startDate, endDate);

    if (startDate && endDate) {
      start = getDateRangeObj[0];
      end = getDateRangeObj[1];
    }
    if (startDate && endDate) {
      filters = [{
        key: value, value, label: value, type: 'customdate', start, end,
      }];
    }
    if (start && end) {
      const oldCustomFilters = reorderingFilters && reorderingFilters.customFilters ? reorderingFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters]);
      dispatch(getReoderingFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumnsList((state) => [...state, value]);
    } else {
      setColumnsList(columnsList.filter((item) => item !== value));
    }
  };

  useEffect(() => {
    dispatch(getReoderingFilters([], []));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && productOpen) {
      dispatch(getProductTypes(companies, appModels.BULIDINGCOMPLIANCE));
    }
  }, [userInfo, productOpen]);

  /* const onCloseReOrderRule = () => {
    setEdit(false);
    setOffset(offset);
    setPage(page);
    setReOrderingRule(0);
  };

  const onListClick = () => {
    setOffset(offset); setPage(page); setReOrderingRule(0);
  }; */

  const ReOrderingRule = (id) => {
    setReOrderingRule(id);
    setViewId(id);
  };

  const onAddReset = () => {
    if (document.getElementById('reorderForm')) {
      document.getElementById('reorderForm').reset();
    }
    setOpenAddReorderModal(false);
    dispatch(clearAddReOrderingRule());
    showAddModal(false);
  };

  const onCloseDrawer = () => {
    if (document.getElementById('reorderForm')) {
      document.getElementById('reorderForm').reset();
    }
    showAddModal(false);
    setEdit(false);
  };

  const onEditReset = () => {
    setEdit(false);
    dispatch(clearEditReOderingRule());
  };

  const onAddReOrderRule = () => {
    if (document.getElementById('reorderForm')) {
      document.getElementById('reorderForm').reset();
    }
    setOpenAddReorderModal(true);
  };

  const onEditReOrderRule = () => {
    setEdit(true);
  };

  const onViewReset = () => {
    setViewModal(false);
    setViewId(false);
  };

  const ruleData = reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.data && reOrderingRuleDetailsInfo.data.length > 0 ? reOrderingRuleDetailsInfo.data[0] : '';

  const drawertitleName = (
    <Tooltip title={ruleData.name} placement="right">
      {truncate(ruleData, 50)}
    </Tooltip>
  );

  const onClickClear = () => {
    dispatch(getReoderingFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.columns ? filtersFields.columns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    // setOpenCategory(false);
    // setOpenStatus(false);
    // setOpenApplies(false);
  };

  const searchColumns = InventoryModule.reOrderingSearchColumn;
  const advanceSearchColumns = InventoryModule.reOrderingAdvanceSearchColumn;

  const hiddenColumns = InventoryModule.reOrderingHiddenColumn;

  const columns = useMemo(() => filtersFields && filtersFields.columns, []);
  const data = useMemo(() => (reOrderingRulesInfo && reOrderingRulesInfo.data && reOrderingRulesInfo.data.length > 0 ? reOrderingRulesInfo.data : [{}]), [reOrderingRulesInfo.data]);
  const initialState = {
    hiddenColumns,
  };

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        product_id: true,
        location_id: true,
        warehouse_id: true,
        product_max_qty: false,
        product_min_qty: false,
        product_uom: false,
      });
    }
  }, [visibleColumns]);

  const onFilterChange = (data) => {
    const fields = [
      'name', 'warehouse_id', 'location_id', 'product_id', 'location_id',
    ];
    let query = '"|","|","|","|",';

    const oldCustomFilters = reorderingFilters && reorderingFilters.customFilters
      ? reorderingFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.length > 0 ? (oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    )) : [];

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
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
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'columnField'),
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getReoderingFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getReoderingFilters(customFilters));
    }
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [reOrderingRulesFilters],
  );

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

  const advanceSearchjson = {
    product_id: setProductOpen,
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
      setPage(0);
      const customFiltersList = [];
      const mergeFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = uniqBy(mergeFiltersList, 'key');
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getReoderingFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const handleCategoryChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'product_id', title: 'Product', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getReoderingFilters(customFiltersList));
      removeData('data-compliance_category_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getReoderingFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const stateValuesList = (reorderingFilters && reorderingFilters.customFilters && reorderingFilters.customFilters.length > 0)
    ? reorderingFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const onClickEditData = (id, name) => {
    setEditId(id);
    showEditModal(true);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.REORDERINGRULES));
  };

  return (
    <>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        createTabs={{
          enable: true,
          menuList: props.menuList,
          tabs: props.tabs,
        }}
        sx={{
          height: '90%',
        }}
        tableData={
        reOrderingRulesInfo && reOrderingRulesInfo.data && reOrderingRulesInfo.data.length
          ? reOrderingRulesInfo.data
          : []
      }
        columns={ReorderColumns(isDeleteable, onClickRemoveData)}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Reordering Rules"
        exportFileName="Reordering Rules"
        listCount={totalDataCount}
        exportInfo={reOrderingRulesExportInfo}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={reOrderingRulesInfo && reOrderingRulesInfo.loading}
        err={reOrderingRulesInfo && reOrderingRulesInfo.err}
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
      />

      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >

        <DrawerHeader
          headerName={reOrderingRuleDetailsInfo && (reOrderingRuleDetailsInfo.data && reOrderingRuleDetailsInfo.data.length > 0 && !reOrderingRuleDetailsInfo.loading)
            ? ruleData.name : 'Reordering Rules'}
          imagePath={InventoryBlue}
          isEditable={((reOrderingRuleDetailsInfo && !reOrderingRuleDetailsInfo.loading))}
          onClose={() => onViewReset()}
          onEdit={() => { setReOrderingRule(reOrderingRuleDetailsInfo && (reOrderingRuleDetailsInfo.data && reOrderingRuleDetailsInfo.data.length > 0) ? reOrderingRuleDetailsInfo.data[0].id : false); setEdit(true); }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev', reOrderingRulesInfo)); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next', reOrderingRulesInfo)); }}
        />
        <ReOrderingRulesDetails />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '50%' },
        }}
        anchor="right"
        open={addModal}
      >

        <DrawerHeader
          headerName="Create Reordering Rules"
          imagePath={InventoryBlue}
          onClose={onCloseDrawer}
        />
        <AddReorderingRules closeAddModal={() => setOpenAddReorderModal(false)} afterReset={onAddReset} product={false} />
      </Drawer>

      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Reordering Rules"
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
            successMessage="Reordering Rules removed successfully.."
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

    </>
  );
};

export default ReOrderingRulesList;
