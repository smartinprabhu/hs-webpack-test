/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useMemo } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import { useDispatch, useSelector } from 'react-redux';
import uniqBy from 'lodash/unionBy';
import CommonGrid from '../../commonComponents/commonGrid';
import { ProductCatColumns } from '../../commonComponents/gridColumns';

import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import {
  getPagesCountV2, getCompanyTimezoneDate, getAllowedCompanies, getColumnArrayById,
  isArrayValueExists, queryGeneratorWithUtc,
  getArrayFromValuesByItem, generateArrayFromValue, getListOfOperations,
  getHeaderTabs,
  getTabs,
  getActiveTab,
  queryGeneratorV1,
  getDateAndTimeForDifferentTimeZones,
} from '../../util/appUtils';
import {
  getProductCategoryCount, getProductCategoryList, getParentCategory,
  getProductCategoryFilters, getCheckedRowsConfigPantry, getProductCategory, resetCreateProductCategory, resetUpdateProductCategory, getDelete, resetDelete, getProductCategoryListExport,
} from '../pantryService';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  setSorting,
} from '../../assets/equipmentService';
import { getInventoryValuation } from './utils/utils';
import actionCodes from './data/actionCodes.json';
import actionInvCodes from '../../inventory/data/actionCodes.json';
import { InventoryModule } from '../../util/field';
import ordersNav from '../navbar/navlist.json';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const productCategory = (props) => {
  const { menuType } = props;
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [viewModal, setViewModal] = useState(0);
  const [reload, setReload] = useState(false);
  const [columnFields, setColumns] = useState(customData && customData.listFieldsCPCShows ? customData.listFieldsCPCShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [addModal, showAddModal] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [teamCollapse, setTeamCollapse] = useState(true);
  const [addressGroups, setAddressGroups] = useState([]);
  const [modalAlert, setModalAlert] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [openTeam, setOpenTeam] = useState(false);

  const [editData, setEditData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(false);

  const [scrollDataList, setScrollData] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const companies = getAllowedCompanies(userInfo);
  const {
    productCategoryCount, productCategoryListInfo, productCategoryCountLoading,
    productCategoryFilters, configPantryDetails,
    addProductCategoryInfo, updateProductCategoryInfo, parentCategoryInfo, deleteInfo, pcExportListInfo,
  } = useSelector((state) => state.pantry);

  const { pinEnableData } = useSelector((state) => state.auth);
  const {
    filterInitailValues,
  } = useSelector((state) => state.purchase);

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const searchColumns = InventoryModule.inventoryPantryCategorySearchCoumns;
  const hiddenColumns = InventoryModule.inventoryPantryCategoryHiddenColumns;
  const advanceSearchColumns = InventoryModule.inventoryPantryCategoryAdvanceSearchColumn;

  const columns = useMemo(() => filtersFields.productColumns, []);
  const data = useMemo(() => (productCategoryListInfo.data ? productCategoryListInfo.data : [{}]), [productCategoryListInfo.data]);
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

  const advanceSearchjson = {
    parent_id: setOpenTeam,
  };

  const toggleAlert = () => {
    setModalAlert(false);
  };

  useEffect(() => {
    if ((userInfo && userInfo.data && teamCollapse)) {
      dispatch(getParentCategory(appModels.PRODUCTCATEGORY));
    }
  }, [userInfo, teamCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (productCategoryCount && productCategoryCount.length)) {
      const offsetValues = 0;
      const customFiltersQuery = productCategoryFilters && productCategoryFilters.customFilters ? queryGeneratorV1(productCategoryFilters.customFilters) : '';
      dispatch(getProductCategoryListExport(companies, appModels.PRODUCTCATEGORY, productCategoryCount.length, offsetValues, InventoryModule.inventoryProductCategoryApiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, productCategoryCount, startExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        parent_id: true,
        product_count: true,
        property_valuation: true,
        create_date: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    dispatch(setSorting({ sortBy: false, sortField: false }));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = productCategoryFilters.customFilters ? queryGeneratorWithUtc(productCategoryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getProductCategoryCount(companies, appModels.PRODUCTCATEGORY, customFiltersList, globalFilter));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = productCategoryFilters.customFilters ? queryGeneratorWithUtc(productCategoryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getProductCategoryList(companies, appModels.PRODUCTCATEGORY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue, customFilters, reload]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && ((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data) || (deleteInfo && deleteInfo.data))) {
      const customFiltersList = productCategoryFilters.customFilters ? queryGeneratorWithUtc(productCategoryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getProductCategoryCount(companies, appModels.PRODUCTCATEGORY, customFiltersList, globalFilter));
      dispatch(getProductCategoryList(companies, appModels.PRODUCTCATEGORY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addProductCategoryInfo, updateProductCategoryInfo, deleteInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      const customFiltersList = productCategoryFilters.customFilters ? queryGeneratorWithUtc(productCategoryFilters.customFilters, data, userInfo.data) : '';
      dispatch(getProductCategoryList(companies, appModels.PRODUCTCATEGORY, limit, offsetValue, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offsetValue, sortedValue, customFilters, scrollTop]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId === 0) {
      const customFiltersList = productCategoryFilters.customFilters ? queryGeneratorWithUtc(productCategoryFilters.customFilters, false, userInfo.data) : '';
      dispatch(getProductCategoryList(companies, appModels.PRODUCTCATEGORY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [viewId]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsConfigPantry(payload));
  }, [checkedRows]);

  // useEffect(() => {
  //   if (productCategoryFilters && productCategoryFilters.customFilters) {
  //     setCustomFilters(productCategoryFilters.customFilters);
  //     const vid = isArrayValueExists(productCategoryFilters.customFilters, 'type', 'id');
  //     if (vid) {
  //       if (viewId !== vid) {
  //         setViewId(vid);
  //         dispatch(setInitialValues(false, false, false, false, false));
  //       }
  //     }
  //   }
  // }, [productCategoryFilters]);

  useEffect(() => {
    if (productCategoryFilters && productCategoryFilters.customFilters) {
      setCustomFilters(productCategoryFilters.customFilters);
      const vid = isArrayValueExists(productCategoryFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false, false));
        }
      }
    }
  }, [productCategoryFilters]);

  useEffect(() => {
    if (addProductCategoryInfo && addProductCategoryInfo.data && addProductCategoryInfo.data.length) {
      dispatch(getProductCategory(addProductCategoryInfo.data[0], appModels.PRODUCTCATEGORY));
    }
  }, [addProductCategoryInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getProductCategory(viewId, appModels.PRODUCTCATEGORY));
    }
  }, [viewId]);

  useEffect(() => {
    if (viewId && updateProductCategoryInfo && updateProductCategoryInfo.data) {
      dispatch(getProductCategory(viewId, appModels.PRODUCTCATEGORY));
    }
  }, [updateProductCategoryInfo]);

  useEffect(() => {
    if (productCategoryListInfo && productCategoryListInfo.data && viewId) {
      const arr = [...scrollDataList, ...productCategoryListInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [productCategoryListInfo, viewId]);

  useEffect(() => {
    if (parentCategoryInfo && parentCategoryInfo.data) {
      setAddressGroups(parentCategoryInfo.data);
    }
  }, [parentCategoryInfo]);

  const totalDataCount = productCategoryCount && productCategoryCount.length ? productCategoryCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleTableCellChange = (event) => {
    dispatch(setInitialValues(false, false, false, false, false));
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => parseInt(item) !== parseInt(value)));
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const data = productCategoryListInfo && productCategoryListInfo.data ? productCategoryListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = productCategoryListInfo && productCategoryListInfo.data ? productCategoryListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const addAdjustmentWindow = () => {
    if (document.getElementById('configProductCategoryForm')) {
      document.getElementById('configProductCategoryForm').reset();
    }
    showAddModal(true);
  };

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
    const oldCustomFilters = productCategoryFilters && productCategoryFilters.customFilters
      ? productCategoryFilters.customFilters
      : [];
    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getProductCategoryFilters(customFilters1));
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
          Header: value,
          id: value,
        },
      ];
    }
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = productCategoryFilters && productCategoryFilters.customFilters
        ? productCategoryFilters.customFilters
        : [];
      const filterValues = {
        states:
          productCategoryFilters && productCategoryFilters.states ? productCategoryFilters.states : [],
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
      dispatch(getProductCategoryFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = productCategoryFilters && productCategoryFilters.customFilters
        ? productCategoryFilters.customFilters
        : [];
      const filterValues = {
        states:
          productCategoryFilters && productCategoryFilters.states ? productCategoryFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getProductCategoryFilters(filterValues));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value));
    const customFiltersList = customFilters.filter((item) => item.value !== value);
    dispatch(getProductCategoryFilters(customFiltersList));
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
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getProductCategoryFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const onAddReset = () => {
    dispatch(resetCreateProductCategory());
    showAddModal(false);
  };

  const onClickRemoveData = (id, name, productCount) => {
    if (productCount && productCount > 0) {
      setModalAlert(true);
    } else {
      setRemoveId(id);
      setRemoveName(name);
      showDeleteModal(true);
    }
  };

  const openEditModalWindow = (id) => {
    setSelectedUser(id);
    showEditModal(true);
  };

  const onClickClear = () => {
    dispatch(getProductCategoryFilters([]));
    setValueArray([]);
    filtersFields.productColumns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
  };

  useEffect(() => {
    if (selectedUser && productCategoryListInfo && productCategoryListInfo.data) {
      const teamData = generateArrayFromValue(productCategoryListInfo.data, 'id', selectedUser.id);
      setEditData(teamData);
    }
  }, [selectedUser]);

  const closeModal = () => {
    dispatch(resetCreateProductCategory());
    showAddModal(false);
    dispatch(getParentCategory(appModels.PRODUCTCATEGORY));
  };

  const onUpdateReset = () => {
    dispatch(resetUpdateProductCategory());
    showEditModal(false);
    setSelectedUser(false);
    setEditData([]);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.PRODUCTCATEGORY));
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const handleTeamCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'parent_id', title: 'Parent Category', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getProductCategoryFilters(customFiltersList));
      removeData('data-parent_id');
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getProductCategoryFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const stateValuesList = (productCategoryFilters && productCategoryFilters.customFilters && productCategoryFilters.customFilters.length > 0)
    ? productCategoryFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const addressValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (productCategoryFilters && productCategoryFilters.customFilters && productCategoryFilters.customFilters.length > 0) ? productCategoryFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (productCategoryListInfo && productCategoryListInfo.loading) || (productCategoryCountLoading);

  const isInventory = !!(menuType && menuType === 'Inventory');

  const isCreatable = allowedOperations.includes(isInventory ? actionInvCodes['Add Product Category'] : actionCodes['Add Product Category']);
  const isEditable = allowedOperations.includes(isInventory ? actionInvCodes['Edit Product Category'] : actionCodes['Edit Product Category']);
  const isDeleteable = allowedOperations.includes(isInventory ? actionInvCodes['Delete Product Category'] : actionCodes['Delete Product Category']);

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
    const fields = [
      'name',
      'parent_id',
      // 'product_count',
      // 'property_valuation',
    ];
    let query = '"|",';

    const oldCustomFilters = productCategoryFilters && productCategoryFilters.customFilters
      ? productCategoryFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );
    if (data && data.quickFilterValues && data.quickFilterValues.length) {
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
        dispatch(getProductCategoryFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getProductCategoryFilters(customFilters));
    }
  };

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Pantry Management',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, ordersNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Orders',
    );
  }

  const getNewVisitArray = (array) => {
    const resources = [];
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        const val = array[i];
        val.property_valuation = getInventoryValuation(val.property_valuation);
        val.product_count = val.product_count ? val.product_count : '0';
        val.create_date = getCompanyTimezoneDate(val.create_date, userInfo, 'datetime');
        resources.push(val);
      }
    }
    return resources;
  };

  return (
    <CommonGrid
      className="tickets-table"
      componentClassName="commonGrid"
      sx={{
        height: '90%',
      }}
      createTabs={{
        enable: true,
        menuList: props.menuList,
        tabs: props.tabs,
      }}
      tableData={
        productCategoryListInfo && productCategoryListInfo.data && productCategoryListInfo.data.length
          ? productCategoryListInfo.data
          : []
        }
      columns={ProductCatColumns()}
      checkboxSelection
      pagination
      disableRowSelectionOnClick
      moduleName="Product Category"
      exportFileName="Product Category"
      listCount={totalDataCount}
      exportInfo={{ err: pcExportListInfo.err, loading: pcExportListInfo.loading, data: pcExportListInfo.data ? getNewVisitArray(pcExportListInfo.data) : false }}
      page={currentPage}
      rowCount={totalDataCount}
      limit={limit}
      handlePageChange={handlePageChange}
      setStartExport={setStartExport}
      createOption={{
        enable: allowedOperations.includes(isInventory ? actionInvCodes['Add Product Category'] : actionCodes['Add Product Category']),
        text: 'Add',
        func: () => showAddModal(true),
      }}
      setRows={setRows}
      rows={rows}
      visibleColumns={visibleColumns}
      setVisibleColumns={setVisibleColumns}
      onFilterChanges={onFilterChange}
      loading={productCategoryListInfo && productCategoryListInfo.loading}
      err={productCategoryListInfo && productCategoryListInfo.err}
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
    />
  // <Row className="pt-2">
  //   <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
  //     <Card className="p-2 mb-2 h-100 bg-lightblue">
  //       <CardBody className="bg-color-white p-1 m-0">
  //         <Row className="p-2 itAsset-table-title">
  //           <Col md="9" xs="12" sm="9" lg="9">
  //             <span className="p-0 mr-2 font-weight-800 font-medium">
  //               Product Category List :
  //               {' '}
  //               {columnHide && columnHide.length && totalDataCount}
  //             </span>
  //             {columnHide && columnHide.length && customFilters && customFilters.length ? (
  //               <div className="content-inline">
  //                 {customFilters && customFilters.length && customFilters.map((cf) => (
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
  //                         <span>
  //                           {'  '}
  //                           :
  //                           {' '}
  //                           {decodeURIComponent(cf.value)}
  //                         </span>
  //                       )}
  //                       {(cf.type === 'customdate') && (
  //                         <span>
  //                           {'  '}
  //                           :
  //                           {' '}
  //                           {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
  //                           {' - '}
  //                           {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
  //                         </span>
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
  //               <ListDateFilters
  //                 dateFilters={dateFilters}
  //                 customFilters={customFilters}
  //                 handleCustomFilterClose={handleCustomFilterClose}
  //                 setCustomVariable={setCustomVariable}
  //                 customVariable={customVariable}
  //                 onClickRadioButton={handleRadioboxChange}
  //                 onChangeCustomDate={handleCustomDateChange}
  //                 idNameFilter="productCatDate"
  //                 classNameFilter="drawerPopover popoverDate"
  //               />
  //               {isCreatable && (
  //                 <CreateList name="Add Product Category" showCreateModal={addAdjustmentWindow} />
  //               )}
  //               <ExportList idNameFilter="productCatExport" response={productCategoryListInfo && productCategoryListInfo.data && productCategoryListInfo.data.length} />
  //               <DynamicColumns
  //                 setColumns={setColumns}
  //                 columnFields={columnFields}
  //                 allColumns={allColumns}
  //                 setColumnHide={setColumnHide}
  //                 idNameFilter="productCateColumns"
  //                 className="drawerPopover"
  //               />
  //             </div>
  //             {productCategoryListInfo && productCategoryListInfo.data && productCategoryListInfo.data.length && (
  //               <>
  //                 {document.getElementById('productCatExport') && (
  //                   <Popover placement="bottom" className="drawerPopover" isOpen={filterInitailValues.download} target="productCatExport">
  //                     <PopoverHeader>
  //                       Export
  //                       <img
  //                         src={closeCircleIcon}
  //                         aria-hidden="true"
  //                         className="cursor-pointer mr-1 mt-1 float-right"
  //                         onClick={() => dispatch(setInitialValues(false, false, false, false))}
  //                         alt="close"
  //                       />
  //                     </PopoverHeader>
  //                     <PopoverBody>
  //                       <DataExport
  //                         afterReset={() => dispatch(setInitialValues(false, false, false, false))}
  //                         fields={columnFields}
  //                         sortedValue={sortedValue}
  //                         rows={checkedRows}
  //                         apiFields={InventoryModule.inventoryProductCategoryApiFields}
  //                       />
  //                     </PopoverBody>
  //                   </Popover>
  //                 )}
  //               </>
  //             )}
  //           </Col>
  //         </Row>
  //         {(productCategoryListInfo && productCategoryListInfo.data) && (
  //           <span data-testid="success-case" />
  //         )}
  //         <div className="thin-scrollbar">
  //           <div className="table-responsive common-table">
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
  //                 tableData={productCategoryListInfo}
  //                 inventoryLabelFunction={getInventoryValuation}
  //                 actions={{
  //                   hideSorting: {
  //                     fieldName: ['property_valuation', 'product_count'],
  //                   },
  //                   edit: {
  //                     showEdit: isEditable,
  //                     editFunc: openEditModalWindow,
  //                   },
  //                   delete: {
  //                     showDelete: isDeleteable,
  //                     deleteFunc: onClickRemoveData,
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
  //             {openTeam && (
  //               <DynamicCheckboxFilter
  //                 data={parentCategoryInfo && parentCategoryInfo.data && parentCategoryInfo.data.length > 0 ? parentCategoryInfo : []}
  //                 selectedValues={addressValues}
  //                 dataGroup={addressGroups}
  //                 filtervalue="parent_id"
  //                 onCheckboxChange={handleTeamCheckboxChange}
  //                 toggleClose={() => setOpenTeam(false)}
  //                 openPopover={openTeam}
  //                 target="data-parent_id"
  //                 title="PARENT CATEGORY"
  //                 keyword={keyword}
  //                 setDataGroup={setAddressGroups}
  //               />
  //             )}
  //             {columnHide && columnHide.length ? (
  //               <TableListFormat
  //                 userResponse={userInfo}
  //                 listResponse={productCategoryListInfo}
  //                 countLoad={productCategoryCountLoading}
  //               />
  //             ) : ''}
  //           </div>
  //           {columnHide && !columnHide.length ? (
  //             <div className="text-center mb-4">
  //               Please select the Columns
  //             </div>
  //           ) : ''}
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
  //     className="drawer-bg-lightblue"
  //     width={1250}
  //     visible={addModal}
  //   >

  //     <DrawerHeader
  //       title="Create Product Category"
  //       imagePath={isInventory ? InventoryBlue : pantryBlueIcon}
  //       closeDrawer={() => onAddReset()}
  //       className="w-auto height-28 ml-2 mr-2"
  //     />
  //     <AddProductCategory closeModal={closeModal} selectedUser={false} closeAddModal={() => { showAddModal(false); }} />
  //   </Drawer>
  //   <Modal
  //     size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
  //     className="border-radius-50px modal-dialog-centered add-pantry"
  //     isOpen={deleteModal}
  //   >
  //     <ModalHeaderComponent
  //       title="Delete Product Category"
  //       imagePath={false}
  //       closeModalWindow={() => onRemoveDataCancel()}
  //       response={deleteInfo}
  //     />
  //     <ModalBody className="mt-0 pt-0">
  //       {deleteInfo && (!deleteInfo.data && !deleteInfo.loading && !deleteInfo.err) && (
  //         <p className="text-center">
  //           {`Are you sure, you want to remove ${removeName} ?`}
  //         </p>
  //       )}
  //       {deleteInfo && deleteInfo.loading && (
  //         <div className="text-center mt-3">
  //           <Loader />
  //         </div>
  //       )}
  //       {(deleteInfo && deleteInfo.err) && (
  //         <SuccessAndErrorFormat response={deleteInfo} />
  //       )}
  //       {(deleteInfo && deleteInfo.data) && (
  //         <SuccessAndErrorFormat
  //           response={deleteInfo}
  //           successMessage="Product Category removed successfully.."
  //         />
  //       )}
  //       <div className="pull-right mt-3">
  //         {deleteInfo && !deleteInfo.data && (
  //           <Button
  //             size="sm"
  //             disabled={deleteInfo && deleteInfo.loading}
  //              variant="contained"
  //             onClick={() => onRemoveData(removeId)}
  //           >
  //             Confirm
  //           </Button>
  //         )}
  //         {deleteInfo && deleteInfo.data && (
  //           <Button size="sm"  variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
  //         )}
  //       </div>
  //     </ModalBody>
  //   </Modal>

  //   <Drawer
  //     title=""
  //     closable={false}
  //     className="drawer-bg-lightblue"
  //     width={1250}
  //     visible={editModal}
  //   >

  //     <DrawerHeader
  //       title="Update Product Category"
  //       imagePath={isInventory ? InventoryBlue : pantryBlueIcon}
  //       closeDrawer={() => onUpdateReset()}
  //       className="w-auto height-28 ml-2 mr-2"
  //     />

  //     <AddProductCategory closeModal={() => onUpdateReset()} selectedUser={selectedUser} editData={editData} />
  //   </Drawer>
  //   <Modal isOpen={modalAlert} toggle={toggleAlert} size="sm">
  //     <ModalHeaderComponent size="sm" title="Alert" closeModalWindow={toggleAlert} />
  //     <hr className="m-0" />
  //     <ModalBody>
  //       You can not delete this. Because the product category has number of products.
  //     </ModalBody>
  //     <ModalFooter>
  //       <Button color="primary" onClick={() => { setModalAlert(false); }}>Ok</Button>
  //     </ModalFooter>
  //   </Modal>
  // </Row>
  );
};

export default productCategory;
