/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
} from 'react-table';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import uniqBy from 'lodash/unionBy';
import Drawer from '@mui/material/Drawer';

import maintenanceData from './data/maintenanceData.json';
import {
  setSorting,
} from '../../assets/equipmentService';
import {
  getPagesCount, getTotalCount, generateErrorMessage,
  queryGenerator, getAllowedCompanies,
  getListOfModuleOperations, getArrayFromValuesByItem,
  getColumnArrayById, queryGeneratorWithUtc, getDateAndTimeForDifferentTimeZones,
  formatFilterData, debounce,
} from '../../util/appUtils';
import {
  getCheckList, getCheckListCount, getChecklistFilters,
  getDeleteChecklist, resetDeleteChecklist, getChecklistsExport,
} from './maintenanceService';
import {
  resetAddActivity, resetQuestionChecklist, resetUpdateChecklist, activeStepInfo, setQuestionData, setQuestionList, resetPpmChecklist, getCheckListData,
} from '../../preventiveMaintenance/ppmService';
import { setInitialValues } from '../../purchase/purchaseService';
import actionCodes from '../data/actionCodes.json';
import actionWorkPermitCodes from '../../workPermit/data/actionCodes.json';
import AddPreventiveCheckList from '../../preventiveMaintenance/preventiveCheckList/addPreventiveCheckList';
import CommonGrid from '../../commonComponents/commonGrid';
import { ChecklistColumns } from '../../commonComponents/gridColumns';
import { WorkPermitModule } from '../../util/field';
import DrawerHeader from '../../commonComponents/drawerHeader';

// import getChecklistStateLabel from '../../workPermit/utils/utils';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Checklists = (props) => {
  const { menuType } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [columnFields, setColumns] = useState(maintenanceData && maintenanceData.checklistTableColumnsShow ? maintenanceData.checklistTableColumnsShow : []);
  const [addLink, setAddLink] = useState(false);
  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [editId, setEditId] = useState(false);
  const [editData, setEditData] = useState(false);
  const [editLink, setEditLink] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [filterText, setFilterText] = useState('');

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [reload, setReload] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewId, setViewId] = useState(0);
  const apiFields = maintenanceData && maintenanceData.checklistTableApiFields;
  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { pinEnableData } = useSelector((state) => state.auth);
  const companies = getAllowedCompanies(userInfo);
  const {
    addPreventiveChecklist, updateCheckLisInfo, activeStep,
  } = useSelector((state) => state.ppm);

  const {
    checklistCount, checklistInfo, checklistCountLoading,
    checkListFilters, checklistDeleteInfo, checklistExportData,
  } = useSelector((state) => state.maintenance);
  const { sortedValue } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (checklistExportData && checklistExportData.data && checklistExportData.data.length > 0) {
      checklistExportData.data.map((data) => {
        data.active = data.active ? 'Yes' : 'No';
      });
    }
  }, [checklistExportData]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersData = checkListFilters.customFilters ? queryGeneratorWithUtc(checkListFilters.customFilters, false, userInfo.data) : '';
      dispatch(getCheckListCount(companies, appModels.PPMCHECKLIST, customFiltersData, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, JSON.stringify(checkListFilters), reload, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersData = checkListFilters.customFilters ? queryGeneratorWithUtc(checkListFilters.customFilters, false, userInfo.data) : '';
      dispatch(getCheckList(companies, appModels.PPMCHECKLIST, limit, offset, customFiltersData, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
    dispatch(resetAddActivity());
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, JSON.stringify(checkListFilters), reload, globalFilter]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (checklistDeleteInfo && checklistDeleteInfo.data)) {
      const customFiltersData = checkListFilters.customFilters ? queryGeneratorWithUtc(checkListFilters.customFilters, false, userInfo.data) : '';
      dispatch(getCheckListCount(companies, appModels.PPMCHECKLIST, customFiltersData, globalFilter));
      dispatch(getCheckList(companies, appModels.PPMCHECKLIST, limit, offset, customFiltersData, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [checklistDeleteInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && ((updateCheckLisInfo && updateCheckLisInfo.data) || (addPreventiveChecklist && addPreventiveChecklist.data))) {
      const customFiltersData = checkListFilters.customFilters ? queryGeneratorWithUtc(checkListFilters.customFilters, false, userInfo.data) : '';
      dispatch(getCheckListCount(companies, appModels.PPMCHECKLIST, customFiltersData, globalFilter));
      dispatch(getCheckList(companies, appModels.PPMCHECKLIST, limit, offset, customFiltersData, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [updateCheckLisInfo]);

  // useEffect(() => {
  //   if (editId) {
  //     dispatch(getCheckListData(editId, appModels.PPMCHECKLIST));
  //   }
  // }, [editId]);

  const searchColumns = WorkPermitModule.checkListSearchColumn;
  const advanceSearchColumns = WorkPermitModule.checkListAdvanceSearchColumn;

  const hiddenColumns = ['id', 'company_id', 'ehs_instructions'];

  const columns = useMemo(() => maintenanceData && maintenanceData.columns, []);
  const data = useMemo(() => (checklistInfo && checklistInfo.data && checklistInfo.data.length > 0 ? checklistInfo.data : [{}]), [checklistInfo.data]);
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

  const pages = getPagesCount(checklistCount, limit);

  // const handleRadioboxChange = (event) => {
  //   const { checked, value } = event.target;
  //   const filters = [{
  //     key: value, value, label: value, type: 'date',
  //   }];
  //   if (checked) {
  //     setCustomFiltersList(filters);
  //     const oldCustomFilters = checkListFilters && checkListFilters.customFilters ? checkListFilters.customFilters : [];
  //     const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
  //     dispatch(getChecklistFilters(customFiltersData));
  //   } else {
  //     setCustomFiltersList(customFiltersList.filter((item) => item !== value));
  //     const oldCustomFilters = checkListFilters && checkListFilters.customFilters ? checkListFilters.customFilters : [];
  //     const customFiltersData = [...oldCustomFilters, ...customFiltersList.filter((item) => item !== value)];
  //     dispatch(getChecklistFilters(customFiltersData));
  //   }
  //   setOffset(0); setPage(1);
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
    const oldCustomFilters = checkListFilters && checkListFilters.customFilters
      ? checkListFilters.customFilters
      : [];
    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getChecklistFilters(customFilters1));
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
      const oldCustomFilters = checkListFilters && checkListFilters.customFilters
        ? checkListFilters.customFilters
        : [];
      const filterValues = {
        states:
          checkListFilters && checkListFilters.states ? checkListFilters.states : [],
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
      dispatch(getChecklistFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = checkListFilters && checkListFilters.customFilters
        ? checkListFilters.customFilters
        : [];
      const filterValues = {
        states:
          checkListFilters && checkListFilters.states ? checkListFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getChecklistFilters(filterValues));
    }
    setOffset(0);
    setPage(1);
  };

  function searchHandleSubmit(values, { resetForm }) {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    const oldCustomFilters = checkListFilters && checkListFilters.customFilters ? checkListFilters.customFilters : [];
    const customFiltersData = [...oldCustomFilters, ...filters];
    dispatch(getChecklistFilters(customFiltersData));
    resetForm({ values: '' });
    setOffset(0); setPage(1);
  }

  const dateFilters = (checkListFilters && checkListFilters.customFilters && checkListFilters.customFilters.length > 0) ? checkListFilters.customFilters : [];

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columnFields.filter((item) => item !== value));
    }
  };

  const checklistStateLabelFunction = (staten) => {
    if (maintenanceData && maintenanceData.states[staten] && staten === true) {
      return <p className="text-success font-weight-700">{maintenanceData.states[staten].text}</p>;
    }
    return <p className="text-danger font-weight-700">No</p>;
  };

  const handleCustomFilterClose = (value) => {
    const customFiltersData = checkListFilters.customFilters.filter((item) => item.key !== value);
    dispatch(getChecklistFilters(customFiltersData));
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
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
    const { checked } = event.target;
    dispatch(setInitialValues(false, false, false, false));
    if (checked) {
      const data = checklistInfo && checklistInfo.data ? checklistInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = checklistInfo && checklistInfo.data ? checklistInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const onRemoveChecklist = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const onRemove = (id) => {
    dispatch(getDeleteChecklist(id, appModels.PPMCHECKLIST));
  };

  const onRemoveChecklistCancel = () => {
    dispatch(resetDeleteChecklist());
    showDeleteModal(false);
  };

  const onClickClear = () => {
    dispatch(getChecklistFilters([]));
    setValueArray([]);
    const filterField = maintenanceData && maintenanceData.columns ? maintenanceData.columns : [];
    filterField.map((columnsValue) => {
      const ele = document.getElementById(`data${columnsValue.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
  };

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };
  useEffect(() => {
    dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
  }, [currentPage]);

  const isWorkPermit = !!(menuType && menuType === 'WorkPermit');
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], (isWorkPermit ? 'Work Permit' : 'Admin Setup'), 'code');

  const isCreatable = allowedOperations.includes(isWorkPermit ? actionWorkPermitCodes['Add Checklist'] : actionCodes['Add Checklist']);
  const isEditable = allowedOperations.includes(isWorkPermit ? actionWorkPermitCodes['Edit Checklist'] : actionCodes['Edit Checklist']);

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (checklistInfo && checklistInfo.loading) || (checklistCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (checklistInfo && checklistInfo.err) ? generateErrorMessage(checklistInfo) : userErrorMsg;

  const onClickEditData = (id, row) => {
    dispatch(getCheckListData(id, appModels.PPMCHECKLIST));
    setEditId(id);
    setEditData(row);
    setEditLink(true);
    dispatch(resetPpmChecklist());
    dispatch(resetQuestionChecklist());
    dispatch(setQuestionList([]));
    dispatch(setQuestionData([]));
  };

  const tableColumns = ChecklistColumns(onClickEditData, false, isEditable, false);

  // if (addLink && isWorkPermit) {
  //   return (<Redirect to="/workpermits-configuration/add-checklist" />);
  // }

  // if (addLink && !isWorkPermit) {
  //   return (<Redirect to="/maintenance-configuration/add-checklist" />);
  // }

  // if (editLink && isWorkPermit) {
  //   return (<Redirect to={`/workpermits-configuration/edit-checklist/${editId}`} />);
  // }

  // if (editLink && !isWorkPermit) {
  //   return (<Redirect to={`/maintenance-configuration/edit-checklist/${editId}`} />);
  // }

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
      const customFilter = [];
      const mergeFiltersList = [...checkListFilters.customFilters, ...filterArray];
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFilter.push(item);
        }
      });
      dispatch(getChecklistFilters(customFilter));
      // dispatch(getChecklistFilters(filterArray));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  function generateChecklistErrorMessage(errData, checklistName) {
    if (errData && errData.err) {
      if (errData.err.data && !errData.err.data.status) {
        return (
          <span>
            Failed to delete.
            <br />
            <br />
            {`The checklist \"${checklistName}\" is configured in Inspection checklists.`}
          </span>
        );
      }
      if (errData.err.data && errData.err.data.error) {
        return errData.err.data.error.message;
      }
      if (errData.err.statusText) {
        return errData.err.statusText;
      }
      return 'Something went Wrong..';
    }
    return '';
  }

  const openEditModalWindow = (id) => {
    setEditId(id.id);
    setEditData(id);
    setEditLink(true);
    dispatch(resetPpmChecklist());
    dispatch(resetQuestionChecklist());
    dispatch(setQuestionList([]));
    dispatch(setQuestionData([]));
  };

  const onAddReset = () => {
    dispatch(setQuestionData([]));
    setAddLink(false);
    setEditId(false);
  };

  const onUpdateReset = () => {
    setEditLink(false);
    setEditId(false);
    dispatch(setQuestionData([]));
    dispatch(resetQuestionChecklist());
    dispatch(resetPpmChecklist());
  };

  const addAdjustmentWindow = () => {
    dispatch(setQuestionData([]));
    dispatch(resetQuestionChecklist());
    dispatch(resetPpmChecklist());
    dispatch(setQuestionList([]));
    setAddLink(true);
    if (document.getElementById('checklistForm')) {
      document.getElementById('checklistForm').reset();
    }
  };

  const closeModal = () => {
    dispatch(resetQuestionChecklist());
    dispatch(setQuestionList([]));
    dispatch(resetUpdateChecklist());
    dispatch(setQuestionData([]));
    dispatch(activeStepInfo(0));
    setAddLink(false);
    if (document.getElementById('checklistForm')) {
      document.getElementById('checklistForm').reset();
    }
  };

  const closeEditModal = () => {
    dispatch(setQuestionList([]));
    dispatch(resetPpmChecklist());
    dispatch(resetUpdateChecklist());
    dispatch(activeStepInfo(0));
    setEditLink(false);
  };

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
      'active',
      'company_id',
    ];
    let query = '"|","|",';

    const oldCustomFilters = checkListFilters && checkListFilters.customFilters
      ? checkListFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      fields.filter((field) => {
        query += `["${field}","ilike","${encodeURIComponent(data.quickFilterValues[0])}"],`;
      });
      query = query.substring(0, query.length - 1);
      setGlobalFilter(query);
    } else {
      setGlobalFilter(false);
    }
    if (data.items && data.items.length) {
      data.items.map((dataItem) => {
        const label = tableColumns.find((column) => column.field === dataItem.field);
        dataItem.value = dataItem?.value ? dataItem.value : '';
        dataItem.header = label?.headerName;
      });
      const uniqueCustomFilter = _.reverse(
        _.uniqBy(_.reverse([...data.items]), 'header'),
      );
      const customFilters = [...dateFilters, ...uniqueCustomFilter];
      dispatch(getChecklistFilters(customFilters));
    } else {
      const customFilters = [...dateFilters];
      dispatch(getChecklistFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [checkListFilters],
  );

  const onAddd = () => {
    dispatch(setQuestionData([]));
    dispatch(resetAddActivity());
    dispatch(resetQuestionChecklist());
    dispatch(resetPpmChecklist());
    dispatch(setQuestionList([]));
    setAddLink(true);
  };

  useEffect(() => {
    if ((userInfo && userInfo.data) && (checklistCount) && startExport) {
      const offsetValues = 0;
      const customFiltersData = checkListFilters.customFilters ? queryGenerator(checkListFilters.customFilters) : '';
      dispatch(getChecklistsExport(companies, appModels.PPMCHECKLIST, getTotalCount(checklistCount), offsetValues, apiFields, customFiltersData, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, checklistCount, startExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        active: true,
        create_date: true,
        company_id: true,
      });
    }
  }, [visibleColumns]);

  return (
    <>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          height: '90%',
        }}
        tableData={
          checklistInfo && checklistInfo.data && checklistInfo.data.length
            ? checklistInfo.data
            : []
        }
        createTabs={{
          enable: true,
          menuList: props.menuList,
          tabs: props.tabs,
        }}
        columns={tableColumns}
        filters={filterText}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="CheckList List"
        exportFileName="Checklists"
        listCount={getTotalCount(checklistCount)}
        exportInfo={{ err: checklistExportData.err, loading: checklistExportData.loading, data: checklistExportData.data ? checklistExportData.data : false }}
        page={currentPage}
        rowCount={getTotalCount(checklistCount)}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => onAddd(),
        }}
        subTabs={{
          enable: true,
        }}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={checklistInfo && checklistInfo.loading}
        err={checklistInfo && checklistInfo.err}
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
      <Drawer
        PaperProps={{
          sx: { width: '75%' },
        }}
        anchor="right"
        open={addLink}
      >
        <DrawerHeader
          headerName="Create Checklist"
          onClose={() => onAddReset()}
          imagePath={false}
        />
        <AddPreventiveCheckList
          afterReset={() => { onAddReset(); }}
          closeModal={() => { closeModal(); }}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '75%' },
        }}
        anchor="right"
        open={editLink}
      >

        <DrawerHeader
          headerName="Update Checklist"
          imagePath={false}
          onClose={() => onUpdateReset()}
        />
        <AddPreventiveCheckList
          afterReset={() => { onUpdateReset(); }}
          closeModal={() => { closeEditModal(); }}
          editId={editId}
          editData={editData}
        />
      </Drawer>

      {/* <Row className="pt-2">
        <Col sm="12" md="12" lg="12" xs="12">
          <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
            <Card className="p-2 mb-2 h-100 bg-lightblue">
              <CardBody className="bg-color-white p-1 m-0">
                <Row className="p-2 itAsset-table-title">
                  <Col md="9" xs="12" sm="9" lg="9">
                    <span className="p-0 mr-2 font-weight-800 font-medium">
                      CheckList :
                      {' '}
                      {columnHide && columnHide.length && getTotalCount(checklistCount)}
                    </span>
                    {columnHide && columnHide.length ? (
                      <div className="content-inline">
                        {customFilters && customFilters.map((cf) => (
                          <p key={cf.key} className="mr-2 content-inline">
                            <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                              {cf.label}
                              {cf.type === 'text' && (
                                <span>
                                  {'  '}
                                  &quot;
                                  {decodeURIComponent(cf.value)}
                                  &quot;
                                </span>
                              )}
                              {(cf.type === 'customdate') && (
                                <span>
                                  {' - '}
                                  &quot;
                                  {getLocalDate(cf.start)}
                                  {' - '}
                                  {getLocalDate(cf.end)}
                                  &quot;
                                </span>
                              )}
                              <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                            </Badge>
                          </p>
                        ))}
                        {customFilters && customFilters.length ? (
                          <span aria-hidden="true" onClick={() => onClickClear()} className="cursor-pointer text-info mr-2">
                            Clear
                          </span>
                        ) : ''}
                      </div>
                    ) : ''}
                  </Col>
                  <Col md="3" xs="12" sm="3" lg="3">
                    <div className="float-right">
                      <ListDateFilters dateFilters={dateFilters} customFilters={customFilters} handleCustomFilterClose={handleCustomFilterClose} setCustomVariable={setCustomVariable} customVariable={customVariable} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} idNameFilter="checklistDate"
                        classNameFilter="drawerPopover popoverDate" />
                      {isCreatable && (
                        <CreateList
                          name="Add Checklists"
                          showCreateModal={addAdjustmentWindow}
                        />
                      )}
                      <ExportList idNameFilter="checklistExport" />
                      <DynamicColumns
                        setColumns={setColumns}
                        columnFields={columnFields}
                        allColumns={allColumns}
                        setColumnHide={setColumnHide}
                        idNameFilter="checklistColumns"
                        classNameFilter="drawerPopover"
                      />
                    </div>
                    {document.getElementById('checklistExport') && (
                      <Popover className="drawerPopover" placement="bottom" isOpen={filterInitailValues.download} target="checklistExport">
                        <PopoverHeader>
                          Export
                          <img
                            aria-hidden="true"
                            alt="close"
                            src={closeCircleIcon}
                            onClick={() => dispatch(setInitialValues(false, false, false, false))}
                            className="cursor-pointer mr-1 mt-1 float-right"
                          />
                        </PopoverHeader>
                        <PopoverBody>
                          <div className="p-2">
                            <DataExport
                              afterReset={() => dispatch(setInitialValues(false, false, false, false))}
                              fields={columnFields}
                              sortedValue={sortedValue}
                              rows={checkedRows}
                              apiFields={apiFields}
                            />
                          </div>
                        </PopoverBody>
                      </Popover>
                    )}
                  </Col>
                </Row>
                {(checklistInfo && checklistInfo.data && checklistInfo.data.length > 0) && (
                  <span data-testid="success-case" />
                )}
                <div className="thin-scrollbar">
                  <div className="table-responsive common-table">
                    <Table responsive {...getTableProps()} className="mt-2 max-width">
                      <CustomTable
                        isAllChecked={isAllChecked}
                        handleTableCellAllChange={handleTableCellAllChange}
                        searchColumns={searchColumns}
                        advanceSearchColumns={advanceSearchColumns}
                        onChangeFilter={onChangeFilter}
                        removeData={removeData}
                        setKeyword={setKeyword}
                        handleTableCellChange={handleTableCellChange}
                        checkedRows={checkedRows}
                        tableData={checklistInfo}
                        checklistStateLabelFunction={checklistStateLabelFunction}
                        actions={{
                          hideSorting: {
                            fieldName: ['active', 'company_id'],
                          },
                          edit: {
                            showEdit: true,
                            editFunc: openEditModalWindow,
                          },
                          delete: {
                            showDelete: true,
                            deleteFunc: onRemoveChecklist,
                          },
                        }}
                        tableProps={{
                          page,
                          prepareRow,
                          getTableBodyProps,
                          headerGroups,
                        }}
                      />
                    </Table>
                    {columnHide && !columnHide.length ? (
                      <div className="text-center mb-4">
                        Please select the Columns
                      </div>
                    ) : ''}
                  </div>
                  {loading || pages === 0 ? (<span />) : (
                    <div className={`${classes.root} float-right`}>
                      {columnHide && columnHide.length ? (<Pagination count={pages} page={currentPage} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />) : ''}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          {loading && (
            <div className="mb-2 mt-3 p-5" data-testid="loading-case">
              <Loader />
            </div>
          )}

          {((checklistInfo && checklistInfo.err) || isUserError) && (

            <ErrorContent errorTxt={errorMsg} />

          )}
          <Modal size={(checklistDeleteInfo && checklistDeleteInfo.data) ? 'sm' : 'lg'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={deleteModal}>
            <ModalHeaderComponent title="Delete Checklist" imagePath={false} closeModalWindow={() => onRemoveChecklistCancel()} response={checklistDeleteInfo} />
            <ModalBody className="mt-0 pt-0">
              {checklistDeleteInfo && (!checklistDeleteInfo.data && !checklistDeleteInfo.loading && !checklistDeleteInfo.err) && (
                <p className="text-center">
                  {`Are you sure, you want to remove ${removeName} checklist ?`}
                </p>
              )}
              {checklistDeleteInfo && checklistDeleteInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {checklistDeleteInfo && checklistDeleteInfo.err && (
                <div className="text-danger text-center mt-3">
                  <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                  {generateChecklistErrorMessage(checklistDeleteInfo, removeName)}
                </div>
              )}
              {(checklistDeleteInfo && checklistDeleteInfo.data) && (
                <SuccessAndErrorFormat response={checklistDeleteInfo} successMessage="Checklist removed successfully.." />
              )}
              <div className="pull-right mt-3">
                {checklistDeleteInfo && !checklistDeleteInfo.data && !checklistDeleteInfo.err && (
                  <Button size="sm" disabled={checklistDeleteInfo && checklistDeleteInfo.loading}  variant="contained" onClick={() => onRemove(removeId)}>Confirm</Button>
                )}
                {checklistDeleteInfo && (checklistDeleteInfo.data || checklistDeleteInfo.err) && (
                  <Button size="sm"  variant="contained" onClick={() => onRemoveChecklistCancel()}>Ok</Button>
                )}
              </div>
            </ModalBody>
          </Modal>

        </Col>
      </Row> */}
    </>
  );
};

Checklists.propTypes = {
  menuType: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

Checklists.defaultProps = {
  menuType: false,
};

export default Checklists;
