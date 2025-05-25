/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { Box } from '@mui/system';
import {
  Button,
  Drawer,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import workOrdersBlue from '@images/icons/workPermitBlue.svg';
import { makeStyles } from '@material-ui/core/styles';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFilters,
  usePagination, useSortBy, useTable,
} from 'react-table';
import { ProblemCategoryList } from '../../../commonComponents/gridColumns';
import DialogHeader from '../../../commonComponents/dialogHeader';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import CommonGrid from '../../../commonComponents/commonGrid';
import {
  getDelete, resetCreateProductCategory, resetDelete, resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import {
  getPartsData,
} from '../../../preventiveMaintenance/ppmService';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import {
  getAllowedCompanies, getArrayFromValuesByItem, getColumnArrayById,
  getDateAndTimeForDifferentTimeZones, getListOfOperations, getPagesCountV2,
  queryGeneratorWithUtc,
  valueCheck,
  debounce,
  formatFilterData,
} from '../../../util/appUtils';
import {
  getPcDetails, getProblemCategoryCount, getProblemCategoryListExport,
  getProblemCategoryFilters, getProblemCategoryList,
} from '../../siteService';
import AddProblemCategory from './addProblemCategory';
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

const ProblemCategory = () => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [columnFields, setColumns] = useState(customData && customData.listFieldsPCShows ? customData.listFieldsPCShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [addModal, showAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [valueArray, setValueArray] = useState([]);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [rows, setRows] = useState([]);
  const [globalvalue, setGlobalvalue] = useState('');
  const [reload, setReload] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    problemCategoryCount, problemCategoryListInfo, problemCategoryCountLoading,
    problemCategoryFilters, pcExportListInfo,
  } = useSelector((state) => state.site);

  const companies = getAllowedCompanies(userInfo);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const {
    addProductCategoryInfo, updateProductCategoryInfo, deleteInfo,
  } = useSelector((state) => state.pantry);
  const apiFields = customData && customData.listFieldsPCShows;

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Problem Category']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Problem Category']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Problem Category']);

  const searchColumns = ['id', 'name'];
  const hiddenColumns = ['id'];
  const advanceSearchColumns = ['team_category_id'];

  const columns = useMemo(() => filtersFields.problemCategoryColumns, []);
  const data = useMemo(() => (problemCategoryListInfo.data ? problemCategoryListInfo.data : [{}]), [problemCategoryListInfo.data]);
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
    if (userInfo && userInfo.data && (problemCategoryCount && problemCategoryCount.length) && startExport) {
      const offsetValue = 0;
      // setPdfBody([]);
      const customFiltersList = problemCategoryFilters.customFilters
        ? queryGeneratorWithUtc(problemCategoryFilters.customFilters)
        : '';
        // const rows = surveyRows.rows ? surveyRows.rows : [];
      dispatch(
        getProblemCategoryListExport(
          companies,
          appModels.TICKETCATEGORY,
          problemCategoryCount.length,
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
    if (
      visibleColumns
        && Object.keys(visibleColumns)
        && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        team_category_id: true,
        company_id: true,
        create_date: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getProblemCategoryFilters([]));
    }
  }, [reload]);

  // useEffect(() => {
  //   dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
  // }, []);

  useEffect(() => {
    if ((addProductCategoryInfo && addProductCategoryInfo.data)
      || (updateProductCategoryInfo && updateProductCategoryInfo.data)
      || (deleteInfo && deleteInfo.data)) {
      const customFiltersList = problemCategoryFilters.customFilters ? queryGeneratorWithUtc(problemCategoryFilters.customFilters) : '';
      dispatch(getProblemCategoryCount(companies, appModels.TICKETCATEGORY, customFiltersList, globalFilter));
      dispatch(getProblemCategoryList(companies, appModels.TICKETCATEGORY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addProductCategoryInfo, updateProductCategoryInfo, deleteInfo]);

  useEffect(() => {
    if (problemCategoryFilters && problemCategoryFilters.customFilters) {
      setCustomFilters(problemCategoryFilters.customFilters);
    }
  }, [problemCategoryFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = problemCategoryFilters.customFilters ? queryGeneratorWithUtc(problemCategoryFilters.customFilters) : '';
      dispatch(getProblemCategoryCount(companies, appModels.TICKETCATEGORY, customFiltersList, globalFilter));
    }
  }, [userInfo, customFilters, sortedValue.sortBy, sortedValue.sortField, globalFilter]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = problemCategoryFilters.customFilters ? queryGeneratorWithUtc(problemCategoryFilters.customFilters) : '';
      dispatch(getProblemCategoryList(companies, appModels.TICKETCATEGORY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, globalFilter, customFilters]);

  useEffect(() => {
    if (viewId) {
      dispatch(getPcDetails(viewId, appModels.TICKETCATEGORY));
    }
  }, [viewId]);

  useEffect(() => {
    if (updateProductCategoryInfo && updateProductCategoryInfo.data) {
      dispatch(getPcDetails(viewId, appModels.TICKETCATEGORY));
    }
  }, [updateProductCategoryInfo]);

  useEffect(() => {
    if (addProductCategoryInfo && addProductCategoryInfo.data && addProductCategoryInfo.data.length && !viewId) {
      dispatch(getPcDetails(addProductCategoryInfo.data[0], appModels.TICKETCATEGORY));
    }
  }, [addProductCategoryInfo]);

  const totalDataCount = problemCategoryCount && problemCategoryCount.length ? problemCategoryCount.length : 0;

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
      const data = problemCategoryListInfo && problemCategoryListInfo.data ? problemCategoryListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = problemCategoryListInfo && problemCategoryListInfo.data ? problemCategoryListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleCustomFilterClose = (value, cf) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value));
    const customFiltersList = customFilters.filter((item) => item.value !== value);
    dispatch(getProblemCategoryFilters(customFiltersList));
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setOffset(0);
    setPage(1);
  };

  const addAdjustmentWindow = () => {
    dispatch(resetCreateProductCategory());
    if (document.getElementById('configProductCategoryForm')) {
      document.getElementById('configProductCategoryForm').reset();
    }
    dispatch(getPartsData([]));
    showAddModal(true);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.TICKETCATEGORY));
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const openEditModalWindow = (editDataObj) => {
    if (document.getElementById('configProductCategoryForm')) {
      document.getElementById('configProductCategoryForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setViewId(editDataObj);
    setEditId(editDataObj);
    showEditModal(true);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const closeAddWorkOrder = () => {
    if (document.getElementById('configProductCategoryForm')) {
      document.getElementById('configProductCategoryForm').reset();
    }
    dispatch(getPartsData([]));
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());
    showAddModal(false);
    showEditModal(false);
  };

  const closeEditWorkOrder = () => {
    setViewId(false);
    if (document.getElementById('configProductCategoryForm')) {
      document.getElementById('configProductCategoryForm').reset();
    }
    dispatch(getPartsData([]));
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());
    showEditModal(false);
  };

  const dateFilters = (problemCategoryFilters && problemCategoryFilters.customFilters && problemCategoryFilters.customFilters.length > 0) ? problemCategoryFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (problemCategoryListInfo && problemCategoryListInfo.loading) || (problemCategoryCountLoading);

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
      setPage(1);
      const customFiltersList = [];
      const mergeFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getProblemCategoryFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const onClickClear = () => {
    dispatch(getProblemCategoryFilters([]));
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
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

    const oldCustomFilters = problemCategoryFilters && problemCategoryFilters.customFilters
      ? problemCategoryFilters.customFilters
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
    dispatch(getProblemCategoryFilters(customFilters1));
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
      const oldCustomFilters = problemCategoryFilters && problemCategoryFilters.customFilters
        ? problemCategoryFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   problemCategoryFilters && problemCategoryFilters.states ? problemCategoryFilters.states : [],
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
      dispatch(getProblemCategoryFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = problemCategoryFilters && problemCategoryFilters.customFilters
        ? problemCategoryFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   problemCategoryFilters && problemCategoryFilters.states ? problemCategoryFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getProblemCategoryFilters(filterValues.customFilters));
    }
    setOffset(0);
    setPage(0);
  };

  const tableColumns = ProblemCategoryList(openEditModalWindow, onClickRemoveData, isEditable, isDeleteable);

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'team_category_id',
      'company_id',
    ];
    let query = '"|","|",';

    const oldCustomFilters = problemCategoryFilters && problemCategoryFilters.customFilters
      ? problemCategoryFilters.customFilters
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
        dispatch(getProblemCategoryFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getProblemCategoryFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [problemCategoryFilters],
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
      problemCategoryListInfo && problemCategoryListInfo.data && problemCategoryListInfo.data.length
        ? problemCategoryListInfo.data
        : []
    }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setRows={setRows}
        appModelsName={appModels.TICKETCATEGORY}
        loading={loading}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        moduleName="Problem Category List"
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
        exportInfo={pcExportListInfo}
        exportFileName="Problem Category"
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
                headerName="Create Problem Category"
                imagePath={workOrdersBlue}
                onClose={closeAddWorkOrder}
              />
              <AddProblemCategory closeModal={closeAddWorkOrder} />
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
                headerName="Update Problem Category"
                imagePath={workOrdersBlue}
                onClose={closeEditWorkOrder}
              />
              <AddProblemCategory editId={editId} closeModal={closeEditWorkOrder} />
            </Drawer>
            <Dialog
              size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
              fullWidth
              open={deleteModal}
            >
        <DialogHeader
          title="Delete Problem Category"
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
                successMessage="Problem Category removed successfully.."
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
  //               Problem Category List :
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
  //                 idNameFilter="problemDate"
  //                 classNameFilter="drawerPopover popoverDate"
  //               />
  //               {/* {isCreatable && ( */}
  //                 <CreateList name="Add Problem Category" showCreateModal={addAdjustmentWindow} />
  //               {/* )} */}
  //               <ExportList idNameFilter="problemCatExport" />
  //               <DynamicColumns
  //                 setColumns={setColumns}
  //                 columnFields={columnFields}
  //                 allColumns={allColumns}
  //                 setColumnHide={setColumnHide}
  //                 idNameFilter="problemColumns"
  //                 classNameFilter="drawerPopover"
  //               />
  //             </div>
  //             {document.getElementById('problemCatExport') && (
  //             <Popover className="drawerPopover" placement="bottom" isOpen={filterInitailValues.download} target="problemCatExport">
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
  //         {(problemCategoryListInfo && problemCategoryListInfo.data) && (
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
  //                 tableData={problemCategoryListInfo}
  //                 actions={{
  //                   edit: {
  //                     showEdit: true,
  //                     editFunc: openEditModalWindow,
  //                   },
  //                   delete: {
  //                     showDelete: true,
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
  //                 listResponse={problemCategoryListInfo}
  //                 countLoad={problemCategoryCountLoading}
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
  //               title="Create Problem Category"
  //               imagePath={workOrdersBlue}
  //               closeDrawer={closeAddWorkOrder}
  //             />
  //             <AddProblemCategory closeModal={closeAddWorkOrder} />
  //           </Drawer>
  //           <Drawer
  //             title=""
  //             closable={false}
  //             className="drawer-bg-lightblue"
  //             width={1250}
  //             visible={editModal}
  //           >

  //             <DrawerHeader
  //               title="Update Problem Category"
  //               imagePath={workOrdersBlue}
  //               closeDrawer={closeEditWorkOrder}
  //             />
  //             <AddProblemCategory editId={editId} closeModal={closeEditWorkOrder} />
  //           </Drawer>
  //           <Modal
  //             size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
  //             className="border-radius-50px modal-dialog-centered"
  //             isOpen={deleteModal}
  //           >
  //             <ModalHeaderComponent
  //               title="Delete Problem Category"
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
  //                   successMessage="Problem Category removed successfully.."
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

export default ProblemCategory;
