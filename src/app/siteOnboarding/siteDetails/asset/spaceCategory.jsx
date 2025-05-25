/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import workOrdersBlue from '@images/icons/workOrders.svg';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog, DialogContent, DialogContentText,
  Drawer,
} from '@mui/material';
import { Box } from '@mui/system';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFilters,
  usePagination, useSortBy, useTable,
} from 'react-table';
import CommonGrid from '../../../commonComponents/commonGrid';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import AddSpaceCategory from './addSpaceCategory';

import DialogHeader from '../../../commonComponents/dialogHeader';
import { SpaceCategoryList } from '../../../commonComponents/gridColumns';
import {
  getDelete, resetCreateProductCategory, resetDelete, resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import { getPartsData } from '../../../preventiveMaintenance/ppmService';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import {
  debounce,
  formatFilterData,
  getAllowedCompanies, getArrayFromValuesByItem, getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getListOfOperations, getPagesCountV2, queryGeneratorWithUtc,
  valueCheck,
} from '../../../util/appUtils';
import {
  getScDetails, getSpaceCategoryCount,
  getSpaceCategoryFilters, getSpaceCategoryList, getSpaceCategoryListExport,
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

const SpaceCategory = () => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listFieldsSCShows ? customData.listFieldsSCShows : []);
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

  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [rows, setRows] = useState([]);
  const [reload, setReload] = useState(false);
  const [globalvalue, setGlobalvalue] = useState('');
  const [viewModal, setViewModal] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    spaceCategoryCount, spaceCategoryListInfo, spaceCategoryCountLoading,
    spaceCategoryFilters, scExportListInfo,
  } = useSelector((state) => state.site);

  const companies = getAllowedCompanies(userInfo);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const {
    addProductCategoryInfo, updateProductCategoryInfo, deleteInfo,
  } = useSelector((state) => state.pantry);
  const apiFields = customData && customData.listFieldsSC;

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Space Category']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Space Category']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Space Category']);

  const searchColumns = ['id', 'name', 'parent_id'];
  const hiddenColumns = ['id'];
  const advanceSearchColumns = [];

  const columns = useMemo(() => filtersFields.spaceCategoryColumns, []);
  const data = useMemo(() => (spaceCategoryListInfo.data ? spaceCategoryListInfo.data : [{}]), [spaceCategoryListInfo.data]);
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
      dispatch(getSpaceCategoryFilters([]));
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

    const oldCustomFilters = spaceCategoryFilters && spaceCategoryFilters.customFilters
      ? spaceCategoryFilters.customFilters
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
    dispatch(getSpaceCategoryFilters(customFilters1));
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
      const oldCustomFilters = spaceCategoryFilters && spaceCategoryFilters.customFilters
        ? spaceCategoryFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   spaceCategoryFilters && spaceCategoryFilters.states ? spaceCategoryFilters.states : [],
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
      dispatch(getSpaceCategoryFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = spaceCategoryFilters && spaceCategoryFilters.customFilters
        ? spaceCategoryFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   spaceCategoryFilters && spaceCategoryFilters.states ? spaceCategoryFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getSpaceCategoryFilters(filterValues.customFilters));
    }
    setOffset(0);
    setPage(0);
  };

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (userInfo && userInfo.data && (spaceCategoryCount && spaceCategoryCount.length) && startExport) {
      const offsetValue = 0;
      // setPdfBody([]);
      const customFiltersList = spaceCategoryFilters.customFilters
        ? queryGeneratorWithUtc(spaceCategoryFilters.customFilters)
        : '';
      // const rows = surveyRows.rows ? surveyRows.rows : [];
      dispatch(
        getSpaceCategoryListExport(
          companies,
          appModels.ASSETCATEGORY,
          spaceCategoryCount.length,
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
      const customFiltersList = spaceCategoryFilters.customFilters ? queryGeneratorWithUtc(spaceCategoryFilters.customFilters) : '';
      dispatch(getSpaceCategoryCount(companies, appModels.ASSETCATEGORY, customFiltersList, globalFilter));
      dispatch(getSpaceCategoryList(companies, appModels.ASSETCATEGORY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addProductCategoryInfo, updateProductCategoryInfo, deleteInfo]);

  useEffect(() => {
    if (spaceCategoryFilters && spaceCategoryFilters.customFilters) {
      setCustomFilters(spaceCategoryFilters.customFilters);
    }
  }, [spaceCategoryFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = spaceCategoryFilters.customFilters ? queryGeneratorWithUtc(spaceCategoryFilters.customFilters) : '';
      dispatch(getSpaceCategoryCount(companies, appModels.ASSETCATEGORY, customFiltersList, globalFilter));
    }
  }, [userInfo, spaceCategoryFilters.customFilters, sortedValue.sortBy, sortedValue.sortField, globalFilter]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = spaceCategoryFilters.customFilters ? queryGeneratorWithUtc(spaceCategoryFilters.customFilters) : '';
      dispatch(getSpaceCategoryList(companies, appModels.ASSETCATEGORY, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, globalFilter, spaceCategoryFilters.customFilters]);

  useEffect(() => {
    if (viewId) {
      dispatch(getScDetails(viewId, appModels.ASSETCATEGORY));
    }
  }, [viewId]);

  useEffect(() => {
    if (updateProductCategoryInfo && updateProductCategoryInfo.data) {
      dispatch(getScDetails(viewId, appModels.ASSETCATEGORY));
    }
  }, [updateProductCategoryInfo]);

  useEffect(() => {
    if (addProductCategoryInfo && addProductCategoryInfo.data && addProductCategoryInfo.data.length && !viewId) {
      dispatch(getScDetails(addProductCategoryInfo.data[0], appModels.ASSETCATEGORY));
    }
  }, [addProductCategoryInfo]);

  const totalDataCount = spaceCategoryCount && spaceCategoryCount.length ? spaceCategoryCount.length : 0;

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
      const data = spaceCategoryListInfo && spaceCategoryListInfo.data ? spaceCategoryListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = spaceCategoryListInfo && spaceCategoryListInfo.data ? spaceCategoryListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleCustomFilterClose = (value, cf) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value));
    const customFiltersList = customFilters.filter((item) => item.value !== value);
    dispatch(getSpaceCategoryFilters(customFiltersList));
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setOffset(0);
    setPage(0);
  };

  const addAdjustmentWindow = () => {
    if (document.getElementById('spaceCategoryForm')) {
      document.getElementById('spaceCategoryForm').reset();
    }
    dispatch(resetCreateProductCategory());
    dispatch(getPartsData([]));
    showAddModal(true);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.ASSETCATEGORY));
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const openEditModalWindow = (id) => {
    if (document.getElementById('spaceCategoryForm')) {
      document.getElementById('spaceCategoryForm').reset();
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
    if (document.getElementById('spaceCategoryForm')) {
      document.getElementById('spaceCategoryForm').reset();
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
    if (document.getElementById('spaceCategoryForm')) {
      document.getElementById('spaceCategoryForm').reset();
    }
    showEditModal(false);
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());
  };

  const dateFilters = (spaceCategoryFilters && spaceCategoryFilters.customFilters && spaceCategoryFilters.customFilters.length > 0) ? spaceCategoryFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (spaceCategoryListInfo && spaceCategoryListInfo.loading) || (spaceCategoryCountLoading);

  const tableColumns = SpaceCategoryList(openEditModalWindow, onClickRemoveData, isEditable, isDeleteable);

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'parent_id',
    ];
    let query = '"|",';

    const oldCustomFilters = spaceCategoryFilters && spaceCategoryFilters.customFilters
      ? spaceCategoryFilters.customFilters
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
        dispatch(getSpaceCategoryFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getSpaceCategoryFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [spaceCategoryFilters],
  );

  return (
    <Box className="insights-box">
      <CommonGrid
        className="tickets-table"
        tableData={
          spaceCategoryListInfo && spaceCategoryListInfo.data && spaceCategoryListInfo.data.length
            ? spaceCategoryListInfo.data
            : []
        }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setRows={setRows}
        appModelsName={appModels.ASSETCATEGORY}
        loading={loading}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => showAddModal(true),
        }}
        moduleName="Space Category List"
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
        exportInfo={scExportListInfo}
        exportFileName="Space Category"
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
          headerName="Create Space Category"
          imagePath={workOrdersBlue}
          onClose={closeAddWorkOrder}
        />
        <AddSpaceCategory closeModal={closeAddWorkOrder} afterReset={afterReset} />
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
          headerName="Update Space Category"
          imagePath={workOrdersBlue}
          onClose={closeEditWorkOrder}
        />
        <AddSpaceCategory editId={editId} closeModal={closeEditWorkOrder} />
      </Drawer>
      <Dialog
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        fullWidth
        open={deleteModal}
      >
        <DialogHeader
          title="Delete Space Category"
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
                successMessage="Space Category removed successfully.."
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
  );
};

export default SpaceCategory;
