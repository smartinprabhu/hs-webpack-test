/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFilters,
  usePagination, useSortBy, useTable,
} from 'react-table';
import workOrdersBlue from '@images/icons/workOrders.svg';
import { Box } from '@mui/system';
import {
  Button,
  Dialog, DialogContent, DialogContentText,
  Drawer,
} from '@mui/material';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import CommonGrid from '../../../commonComponents/commonGrid';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import DialogHeader from '../../../commonComponents/dialogHeader';

import { EquipmentCategory } from '../../../commonComponents/gridColumns';
import {
  getDelete, resetCreateProductCategory, resetDelete, resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import { getPartsData } from '../../../preventiveMaintenance/ppmService';
import {
  debounce,
  formatFilterData,
  getAllowedCompanies,
  getListOfOperations, getPagesCountV2,
  queryGeneratorWithUtc,
  valueCheck, getDateAndTimeForDifferentTimeZones,
} from '../../../util/appUtils';
import AddAssetCategory from './addAssetCategory';
import {
  getAcDetails, getAssetCategoryCount,
  getAssetCategoryFilters, getAssetCategoryList, getAssetCategoryListExport,
} from '../../siteService';
import actionCodes from './data/actionCodes.json';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AssetCategory = () => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listFieldsACShows ? customData.listFieldsACShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [addModal, showAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [viewModal, setViewModal] = useState('');

  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [rows, setRows] = useState([]);
  const [reload, setReload] = useState(false);
  const [globalvalue, setGlobalvalue] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    assetCategoryCount, assetCategoryListInfo, assetCategoryCountLoading,
    assetCategoryFilters, acExportListInfo,
  } = useSelector((state) => state.site);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const companies = getAllowedCompanies(userInfo);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const {
    addProductCategoryInfo, updateProductCategoryInfo, deleteInfo,
  } = useSelector((state) => state.pantry);
  const apiFields = customData && customData.listFieldsAC;

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Equipment Category']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Equipment Category']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Equipment Category']);

  const searchColumns = ['id', 'name', 'parent_id'];
  const hiddenColumns = ['id'];
  const advanceSearchColumns = [];

  const columns = useMemo(() => filtersFields.assetCategoryColumns, []);
  const data = useMemo(() => (assetCategoryListInfo.data ? assetCategoryListInfo.data : [{}]), [assetCategoryListInfo.data]);
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

  // useEffect(() => {
  //   dispatch(setSorting({ sortBy: false, sortField: false }));
  // }, []);

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
        create_date: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getAssetCategoryFilters([]));
    }
  }, [reload]);

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

    const oldCustomFilters = assetCategoryFilters && assetCategoryFilters.customFilters
      ? assetCategoryFilters.customFilters
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
    dispatch(getAssetCategoryFilters(customFilters1));
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
      const oldCustomFilters = assetCategoryFilters && assetCategoryFilters.customFilters
        ? assetCategoryFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   assetCategoryFilters && assetCategoryFilters.states ? assetCategoryFilters.states : [],
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
      dispatch(getAssetCategoryFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = assetCategoryFilters && assetCategoryFilters.customFilters
        ? assetCategoryFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   assetCategoryFilters && assetCategoryFilters.states ? assetCategoryFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getAssetCategoryFilters(filterValues.customFilters));
    }
    setOffset(0);
    setPage(0);
  };

  
  useEffect(() => {
    if (userInfo && userInfo.data && (assetCategoryCount && assetCategoryCount.length) && startExport) {
      const offsetValue = 0;
      // setPdfBody([]);
      const customFiltersList = assetCategoryFilters.customFilters
        ? queryGeneratorWithUtc(assetCategoryFilters.customFilters)
        : '';
      // const rows = surveyRows.rows ? surveyRows.rows : [];
      dispatch(
        getAssetCategoryListExport(
          companies,
          appModels.EQUIPMENTCATEGORY,
          assetCategoryCount.length,
          offsetValue,
          apiFields,
          customFiltersList,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [startExport]);

  useEffect(() => {
    if ((addProductCategoryInfo && addProductCategoryInfo.data)
      || (updateProductCategoryInfo && updateProductCategoryInfo.data)
      || (deleteInfo && deleteInfo.data)) {
      const customFiltersList = assetCategoryFilters.customFilters ? queryGeneratorWithUtc(assetCategoryFilters.customFilters) : '';
      dispatch(getAssetCategoryCount(companies, appModels.EQUIPMENTCATEGORY, customFiltersList, globalFilter));
      dispatch(getAssetCategoryList(companies, appModels.EQUIPMENTCATEGORY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addProductCategoryInfo, updateProductCategoryInfo, deleteInfo]);

  useEffect(() => {
    if (assetCategoryFilters && assetCategoryFilters.customFilters) {
      setCustomFilters(assetCategoryFilters.customFilters);
    }
  }, [assetCategoryFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = assetCategoryFilters.customFilters ? queryGeneratorWithUtc(assetCategoryFilters.customFilters) : '';
      dispatch(getAssetCategoryCount(companies, appModels.EQUIPMENTCATEGORY, customFiltersList, globalFilter));
    }
  }, [userInfo, assetCategoryFilters.customFilters, sortedValue.sortBy, sortedValue.sortField, globalFilter]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = assetCategoryFilters.customFilters ? queryGeneratorWithUtc(assetCategoryFilters.customFilters) : '';
      dispatch(getAssetCategoryList(companies, appModels.EQUIPMENTCATEGORY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, globalFilter, assetCategoryFilters.customFilters]);

  useEffect(() => {
    if (viewId) {
      dispatch(getAcDetails(viewId, appModels.EQUIPMENTCATEGORY));
    }
  }, [viewId]);

  useEffect(() => {
    if (updateProductCategoryInfo && updateProductCategoryInfo.data) {
      dispatch(getAcDetails(viewId, appModels.EQUIPMENTCATEGORY));
    }
  }, [updateProductCategoryInfo]);

  useEffect(() => {
    if (addProductCategoryInfo && addProductCategoryInfo.data && addProductCategoryInfo.data.length && !viewId) {
      dispatch(getAcDetails(addProductCategoryInfo.data[0], appModels.EQUIPMENTCATEGORY));
    }
  }, [addProductCategoryInfo]);

  const totalDataCount = assetCategoryCount && assetCategoryCount.length ? assetCategoryCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const addAdjustmentWindow = () => {
    if (document.getElementById('assetCategoryForm')) {
      document.getElementById('assetCategoryForm').reset();
    }
    dispatch(resetCreateProductCategory());
    dispatch(getPartsData([]));
    showAddModal(true);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.EQUIPMENTCATEGORY));
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const openEditModalWindow = (id) => {
    if (document.getElementById('assetCategoryForm')) {
      document.getElementById('assetCategoryForm').reset();
    }
    setViewId(id);
    setEditId(id);
    showEditModal(true);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const closeAddWorkOrder = () => {
    if (document.getElementById('assetCategoryForm')) {
      document.getElementById('assetCategoryForm').reset();
    }
    showAddModal(false);
    showEditModal(false);
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());
  };

  const afterReset = () => {
    showAddModal(false);
    showEditModal(false);
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());
  };

  const closeEditWorkOrder = () => {
    if (document.getElementById('assetCategoryForm')) {
      document.getElementById('assetCategoryForm').reset();
    }
    showEditModal(false);
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());
  };

  const dateFilters = (assetCategoryFilters && assetCategoryFilters.customFilters && assetCategoryFilters.customFilters.length > 0) ? assetCategoryFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (assetCategoryListInfo && assetCategoryListInfo.loading) || (assetCategoryCountLoading);

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
          datefield: key.datefield,
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
      dispatch(getAssetCategoryFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const onClickClear = () => {
    dispatch(getAssetCategoryFilters([]));
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
  };

  const tableColumns = EquipmentCategory(openEditModalWindow, onClickRemoveData, isEditable, isDeleteable);

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'parent_id',
    ];
    let query = '"|",';

    const oldCustomFilters = assetCategoryFilters && assetCategoryFilters.customFilters
      ? assetCategoryFilters.customFilters
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
        dispatch(getAssetCategoryFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getAssetCategoryFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [assetCategoryFilters],
  );

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };


  return (
    <Box className="insights-box">
      <CommonGrid
        className="tickets-table"
        tableData={
      assetCategoryListInfo && assetCategoryListInfo.data && assetCategoryListInfo.data.length
        ? assetCategoryListInfo.data
        : []
    }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setRows={setRows}
        appModelsName={appModels.EQUIPMENTCATEGORY}
        loading={loading}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        moduleName="Equipment Category List"
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
        exportInfo={acExportListInfo}
        exportFileName="Equipment Category"
        setViewModal={setViewModal}
        setViewId={setViewId}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
      />
       <Drawer
         PaperProps={{
           sx: { width: '85%' },
         }}
         ModalProps={{
           disableEnforceFocus: true,
         }}
         anchor="right"
         open={addModal}
       >
              <DrawerHeader
                headerName="Create Equipment Category"
                imagePath={workOrdersBlue}
                onClose={closeAddWorkOrder}
              />
              <AddAssetCategory closeModal={closeAddWorkOrder} afterReset={afterReset} />
       </Drawer>
            <Drawer
              PaperProps={{
                sx: { width: '85%' },
              }}
              ModalProps={{
                disableEnforceFocus: true,
              }}
              anchor="right"
              open={editModal}
            >

              <DrawerHeader
                headerName="Update Equipment Category"
                imagePath={workOrdersBlue}
                onClose={closeEditWorkOrder}
              />
              <AddAssetCategory editId={editId} closeModal={closeEditWorkOrder} />
            </Drawer>
               <Dialog
                 size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
                 fullWidth
                 open={deleteModal}
               >
        <DialogHeader
          title="Delete Equipment Category"
          imagePath={false}
          onClose={() => onRemoveDataCancel()}
          response={deleteInfo}
        />
        <DialogContent>
        <DialogContentText id="alert-dialog-description">
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
                    successMessage="Equipment Category removed successfully.."
                  />
                )}
                <div className="float-right mt-3">
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
        </DialogContentText>
        </DialogContent>
               </Dialog>
    </Box>
  // <Row className="pt-2">
  //   <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
  //     <Card className="p-2 mb-2 h-100 bg-lightblue">
  //       <CardBody className="bg-color-white p-1 m-0">
  //         <Row className="p-2 itAsset-table-title">
  //           <Col md="9" xs="12" sm="9" lg="9">
  //             <span className="p-0 mr-2 font-weight-800 font-medium">
  //               Equipment Category List :
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
  //               <ListDateFilters
  //                 dateFilters={dateFilters}
  //                 onClickRadioButton={handleRadioboxChange}
  //                 onChangeCustomDate={handleCustomDateChange}
  //                 idNameFilter="assetDate"
  //                 classNameFilter="drawerPopover popoverDate"
  //               />
  //               {isCreatable && (
  //                 <CreateList name="Add Equipment Category" showCreateModal={addAdjustmentWindow} />
  //               )}
  //               <ExportList idNameFilter="assetExport" />
  //               <DynamicColumns
  //                 setColumns={setColumns}
  //                 columnFields={columnFields}
  //                 allColumns={allColumns}
  //                 setColumnHide={setColumnHide}
  //                 idNameFilter="assetColumns"
  //                 classNameFilter="drawerPopover"
  //               />
  //             </div>
  //             {document.getElementById('assetExport') && (
  //             <Popover className="drawerPopover" placement="bottom" isOpen={filterInitailValues.download} target="assetExport">
  //               <PopoverHeader>
  //                 Export
  //                 <img
  //                   src={closeCircleIcon}
  //                   aria-hidden="true"
  //                   className="cursor-pointer mr-1 mt-1 float-right"
  //                   onClick={() => dispatch(setInitialValues(false, false, false, false))}
  //                   alt="close"
  //                 />
  //               </PopoverHeader>
  //               <PopoverBody>
  //                 <DataExport
  //                   afterReset={() => dispatch(setInitialValues(false, false, false, false))}
  //                   fields={columnFields}
  //                   sortedValue={sortedValue}
  //                   rows={checkedRows}
  //                   apiFields={apiFields}
  //                 />
  //               </PopoverBody>
  //             </Popover>
  //             )}
  //           </Col>
  //         </Row>
  //         {(assetCategoryListInfo && assetCategoryListInfo.data) && (
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
  //                 onChangeFilter={onChangeFilter}
  //                 removeData={removeData}
  //                 setKeyword={setKeyword}
  //                 handleTableCellChange={handleTableCellChange}
  //                 checkedRows={checkedRows}
  //                 setViewId={setViewId}
  //                 tableData={assetCategoryListInfo}
  //                 actions={{
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
  //             {columnHide && columnHide.length ? (
  //               <TableListFormat
  //                 userResponse={userInfo}
  //                 listResponse={assetCategoryListInfo}
  //                 countLoad={assetCategoryCountLoading}
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

  //           <Drawer
  //             title=""
  //             closable={false}
  //             className="drawer-bg-lightblue"
  //             width={1250}
  //             visible={addModal}
  //           >

  //             <DrawerHeader
  //               title="Create Equipment Category"
  //               imagePath={workOrdersBlue}
  //               closeDrawer={closeAddWorkOrder}
  //             />
  //             <AddAssetCategory closeModal={closeAddWorkOrder} afterReset={afterReset} />
  //           </Drawer>
  //           <Drawer
  //             title=""
  //             closable={false}
  //             className="drawer-bg-lightblue"
  //             width={1250}
  //             visible={editModal}
  //           >

  //             <DrawerHeader
  //               title="Update Equipment Category"
  //               imagePath={workOrdersBlue}
  //               closeDrawer={closeEditWorkOrder}
  //             />
  //             <AddAssetCategory editId={editId} closeModal={closeEditWorkOrder} />
  //           </Drawer>
  //           <Modal
  //             size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
  //             className="border-radius-50px modal-dialog-centered"
  //             isOpen={deleteModal}
  //           >
  //             <ModalHeaderComponent
  //               title="Delete Equipment Category"
  //               imagePath={false}
  //               closeModalWindow={() => onRemoveDataCancel()}
  //               response={deleteInfo}
  //             />
  //             <ModalBody className="mt-0 pt-0">
  //               {deleteInfo && (!deleteInfo.data && !deleteInfo.loading && !deleteInfo.err) && (
  //                 <p className="text-center">
  //                   {`Are you sure, you want to remove ${removeName} ?`}
  //                 </p>
  //               )}
  //               {deleteInfo && deleteInfo.loading && (
  //                 <div className="text-center mt-3">
  //                   <Loader />
  //                 </div>
  //               )}
  //               {(deleteInfo && deleteInfo.err) && (
  //                 <SuccessAndErrorFormat response={deleteInfo} />
  //               )}
  //               {(deleteInfo && deleteInfo.data) && (
  //                 <SuccessAndErrorFormat
  //                   response={deleteInfo}
  //                   successMessage="Equipment Category removed successfully.."
  //                 />
  //               )}
  //               <div className="pull-right mt-3">
  //                 {deleteInfo && !deleteInfo.data && (
  //                   <Button
  //                     size="sm"
  //                     disabled={deleteInfo && deleteInfo.loading}
  //                      variant="contained"
  //                     onClick={() => onRemoveData(removeId)}
  //                   >
  //                     Confirm
  //                   </Button>
  //                 )}
  //                 {deleteInfo && deleteInfo.data && (
  //                   <Button size="sm"  variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
  //                 )}
  //               </div>
  //             </ModalBody>
  //           </Modal>
  //         </div>
  //       </CardBody>
  //     </Card>
  //   </Col>
  // </Row>
  );
};

export default AssetCategory;
