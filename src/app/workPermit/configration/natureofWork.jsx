/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import {Drawer, Button} from "@mui/material";
import uniqBy from 'lodash/unionBy';
import * as PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';
import {
  Modal,
  ModalBody,
} from 'reactstrap';


import workOrdersBlue from '@images/icons/workPermitBlack.svg';
import DrawerHeader from "../../commonComponents/drawerHeader";
import customData from '../data/customData.json';
import filtersFields from '../data/filtersFields.json';

import { setSorting } from '../../assets/equipmentService';
import CommonGrid from '../../commonComponents/commonGrid';
import { NatureWorkColumns } from '../../commonComponents/gridColumns';
import {
  resetCreateProductCategory, resetUpdateProductCategory, resetDelete, getDelete
} from '../../pantryManagement/pantryService';
import {
  setInitialValues,
} from '../../purchase/purchaseService';
import {
  formatFilterData,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getListOfModuleOperations,
  getPagesCountV2, debounce,
  queryGeneratorWithUtc
} from '../../util/appUtils';
import { WorkPermitModule } from '../../util/field';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import actionCodes from '../data/actionCodes.json';
import {
  getNatureGroups,
  getNatureofWorkCount,
  getNatureofWorkDetails,
  getNatureofWorkFilters,
  getNatureofWorkList,
  getVendorGroups,
  getNatureofWorkExport
} from '../workPermitService';
import AddNatureofWork from './addNatureofWork';

const appModels = require('../../util/appModels').default;

// const AddNatureofWork = React.lazy(() => import('./addNatureofWork'));

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const NatureofWork = (props) => {
  const { match } = props;
  const { params } = match;
  const uuid = params && params.uuid ? params.uuid : false;
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [columnFields, setColumns] = useState(customData && customData.listNatureFieldsColumns ? customData.listNatureFieldsColumns : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [filterText, setFilterText] = useState('')

  const [filtersIcon, setFilterIcon] = useState(false);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [vendorCollapse, setVendorCollapse] = useState(false);
  const [vendorGroups, setVendorGroups] = useState([]);
  const [natureCollapse, setNatureCollapse] = useState(false);
  const [natureGroups, setNatureGroups] = useState([]);
  const [addModal, showAddModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);
  const [addLink, setAddLink] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [reload, setReload] = useState(false);
  const [columnHide, setColumnHide] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [keyword, setKeyword] = useState(false);

  const apiFields = customData && customData.listNatureFields;
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { pinEnableData } = useSelector((state) => state.auth);
  const companies = getAllowedCompanies(userInfo);
  const {
    natureofWorkCount, natureofWork, natureofWorkCountLoading,
    natureofWorkFilters, natureofWorkDetail, vendorGroupsInfo, natureGroupsInfo, permitStateChangeInfo, natureofWorkExport,
  } = useSelector((state) => state.workpermit);
  const { stateChangeInfo } = useSelector((state) => state.visitorManagement);
  const { actionResultInfo, updatePartsOrderInfo } = useSelector((state) => state.workorder);
  const { sortedValue } = useSelector((state) => state.equipment);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const {
    addProductCategoryInfo, updateProductCategoryInfo, deleteInfo,
  } = useSelector((state) => state.pantry);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Permit', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Create Nature of Work']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Nature of Work']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Nature of Work']);

  // const AddNatureofWork = React.lazy(() => import('./addNatureofWork'));

  useEffect(() => {
    dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
  }, [currentPage]);

  useEffect(() => {
    if (uuid) {
      /* const filters = [{
        key: 'uuid', value: uuid, label: 'UUID', type: 'text',
      }];
      dispatch(getNatureofWorkFilters(filters)); */

      dispatch(setInitialValues(false, false, false, false));
      setViewId(uuid);
      setViewModal(true);
    }
  }, [uuid]);

  const closeAddWorkOrder = () => {
    if (document.getElementById('natureofWork')) {
      document.getElementById('natureofWork').reset();
    }
    showAddModal(false);
    showEditModal(false);
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());
  };

  useEffect(() => {
    if (vendorGroupsInfo && vendorGroupsInfo.data) {
      setVendorGroups(vendorGroupsInfo.data);
    }
  }, [vendorGroupsInfo]);

  useEffect(() => {
    if (natureGroupsInfo && natureGroupsInfo.data) {
      setNatureGroups(natureGroupsInfo.data);
    }
  }, [natureGroupsInfo]);

  useEffect(() => {
    if (vendorCollapse) {
      dispatch(getVendorGroups(companies, appModels.NATUREWORK));
    }
  }, [vendorCollapse]);

  useEffect(() => {
    if (natureCollapse) {
      dispatch(getNatureGroups(companies, appModels.NATUREWORK));
    }
  }, [natureCollapse]);

  useEffect(() => {
    if (
      userInfo &&
      userInfo.data &&
      natureofWorkCount &&
      natureofWorkCount.length
    ) {
      const offsetValue = 0;
      const customFiltersQuery =
        natureofWorkFilters && natureofWorkFilters.customFilters
          ? queryGeneratorWithUtc(natureofWorkFilters.customFilters, false, userInfo.data)
          : "";
      dispatch(
        getNatureofWorkExport(
          companies,
          appModels.NATUREWORK,
          natureofWorkCount.length,
          offsetValue,
          WorkPermitModule.natureWorkAPiFields,
          customFiltersQuery,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        )
      );
    }
  }, [userInfo, startExport]);

  useEffect(() => {
    if ((addProductCategoryInfo && addProductCategoryInfo.data)
      || (updateProductCategoryInfo && updateProductCategoryInfo.data)
      || (deleteInfo && deleteInfo.data)
      || (stateChangeInfo && stateChangeInfo.data)
      || (actionResultInfo && actionResultInfo.data)
      || (updatePartsOrderInfo && updatePartsOrderInfo.data)
      || (permitStateChangeInfo && permitStateChangeInfo.data)) {
      const customFiltersList = natureofWorkFilters.customFilters ? queryGeneratorWithUtc(natureofWorkFilters.customFilters, false, userInfo.data) : '';
      dispatch(getNatureofWorkCount(companies, appModels.NATUREWORK, customFiltersList, globalFilter));
      dispatch(getNatureofWorkList(companies, appModels.NATUREWORK, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addProductCategoryInfo, updateProductCategoryInfo, deleteInfo, stateChangeInfo, actionResultInfo, updatePartsOrderInfo, permitStateChangeInfo]);

  useEffect(() => {
    if (reload) {
      dispatch(getNatureofWorkFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = natureofWorkFilters.customFilters ? queryGeneratorWithUtc(natureofWorkFilters.customFilters, false, userInfo.data) : '';
      dispatch(getNatureofWorkCount(companies, appModels.NATUREWORK, customFiltersList, globalFilter));
    }
  }, [userInfo, JSON.stringify(natureofWorkFilters.customFilters), globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = natureofWorkFilters.customFilters ? queryGeneratorWithUtc(natureofWorkFilters.customFilters, false, userInfo.data) : '';
      dispatch(getNatureofWorkList(companies, appModels.NATUREWORK, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, JSON.stringify(natureofWorkFilters.customFilters), globalFilter]);

  useEffect(() => {
    if (permitStateChangeInfo && permitStateChangeInfo.data) {
      dispatch(getNatureofWorkDetails(viewId, appModels.NATUREWORK));
    }
  }, [permitStateChangeInfo]);

  useEffect(() => {
    if (updateProductCategoryInfo && updateProductCategoryInfo.data) {
      dispatch(getNatureofWorkDetails(viewId, appModels.NATUREWORK));
    }
  }, [updateProductCategoryInfo]);

  useEffect(() => {
    if (editId) {
      dispatch(getNatureofWorkDetails(editId, appModels.NATUREWORK));
    }
  }, [editId]);

  useEffect(() => {
    if (addProductCategoryInfo && addProductCategoryInfo.data && addProductCategoryInfo.data.length && !viewId) {
      dispatch(getNatureofWorkDetails(addProductCategoryInfo.data[0], appModels.NATUREWORK));
    }
  }, [addProductCategoryInfo]);

  const totalDataCount = natureofWorkCount && natureofWorkCount.length ? natureofWorkCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const searchColumns = ['id', 'name', 'reference'];
  const advanceSearchColumns = [];

  const hiddenColumns = ['id', 'company_id', 'ehs_instructions'];

  const columns = useMemo(() => filtersFields && filtersFields.natureOfWorkColumns, []);
  const data = useMemo(() => (natureofWork && natureofWork.data && natureofWork.data.length > 0 ? natureofWork.data : [{}]), [natureofWork.data]);
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

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columnFields.filter((item) => item !== value));
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
      const data = natureofWork && natureofWork.data ? natureofWork.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = natureofWork && natureofWork.data ? natureofWork.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
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
        Header: value,
        id: value,
      },
    ];
    const oldCustomFilters = natureofWorkFilters && natureofWorkFilters.customFilters
      ? natureofWorkFilters.customFilters
      : [];
    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getNatureofWorkFilters(customFilters1));
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
      const oldCustomFilters = natureofWorkFilters && natureofWorkFilters.customFilters
        ? natureofWorkFilters.customFilters
        : [];
      const filterValues = {
        customFilters: [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray') : ''), ...filters],
        // customFilters: [
        //   ...oldCustomFilters.filter(
        //     (item) => item.type !== 'date'
        //       && item.type !== 'customdate'
        //       && item.type !== 'datearray',
        //   ),
        //   ...filters,
        // ],
      };
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(getNatureofWorkFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = natureofWorkFilters && natureofWorkFilters.customFilters
        ? natureofWorkFilters.customFilters
        : [];
      const filterValues = {
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getNatureofWorkFilters(filterValues));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomFilterClose = (value) => {
    const customFiltersList = natureofWorkFilters.customFilters.filter((item) => item.value !== value);
    dispatch(getNatureofWorkFilters(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const addAdjustmentWindow = () => {
    if (document.getElementById('natureofWork')) {
      document.getElementById('natureofWork').reset();
    }
    showAddModal(true);
  };

  const onClickClear = () => {
    dispatch(getNatureofWorkFilters([]));
    setValueArray([]);
    const filterField = filtersFields && filtersFields.natureOfWorkColumns ? filtersFields.natureOfWorkColumns : [];
    filterField.map((columns) => {
      const ele = document.getElementById(`data${columns.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
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
      const mergeFiltersList = [...natureofWorkFilters.customFilters, ...filterArray];
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getNatureofWorkFilters(customFiltersList));
      // dispatch(getNatureofWorkFilters(filterArray));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const stateValuesList = (natureofWorkFilters && natureofWorkFilters.customFilters && natureofWorkFilters.customFilters.length > 0)
    ? natureofWorkFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (natureofWorkFilters && natureofWorkFilters.customFilters && natureofWorkFilters.customFilters.length > 0) ? natureofWorkFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (natureofWork && natureofWork.loading) || (natureofWorkCountLoading);
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

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        task_id: true,
        preparedness_checklist_id: true,
        issue_permit_checklist_id: true,
        approval_authority_id: true,
        issue_permit_approval_id: true,
        ehs_authority_id: true,
        security_office_id: true,
        company_id: false,
        ehs_instructions: false,
      });
    }
  }, [visibleColumns]);

  const onFilterChange = (data) => {
    const fields = [
      'name',
      'task_id',
      'preparedness_checklist_id',
      'approval_authority_id',
      'ehs_authority_id',
      'security_office_id',
      'company_id',
      'ehs_instructions',

    ];
    let query = '"|","|","|","|","|","|","|",';

    const oldCustomFilters = natureofWorkFilters && natureofWorkFilters.customFilters
      ? natureofWorkFilters.customFilters
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
        const label = tableColumns.find((column) => column.field === dataItem.field)
        dataItem.value = dataItem?.value ? dataItem.value : ''
        dataItem.header = label?.headerName
      })
      const uniqueCustomFilter = _.reverse(
        _.uniqBy(_.reverse([...data.items]), "header")
      );
      const customFilters = [...dateFilters, ...uniqueCustomFilter];
      dispatch(getNatureofWorkFilters(customFilters));
    } else {
      const customFilters = [...dateFilters];
      dispatch(getNatureofWorkFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]))
    setOffset(0);
    setPage(0);
  };


  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [natureofWorkFilters]
  );

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
    dispatch(getDelete(id, appModels.NATUREWORK));
  };



  const tableColumns = NatureWorkColumns(onClickEditData, onClickRemoveData, isEditable, isDeleteable);


  return (
    <>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          height: '90%',
        }}
        tableData={
          natureofWork && natureofWork.data && natureofWork.data.length
            ? natureofWork.data
            : []
        }
        createTabs={{
          enable: true,
          menuList: props.menuList,
          tabs: props.tabs,
        }}
        subTabs={{
          enable: true,
        }}
        columns={tableColumns}
        filters={filterText}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Nature of Work List"
        exportFileName="Nature of Work"
        listCount={totalDataCount}
        exportInfo={natureofWorkExport}
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
        reload={{
          show: true,
          setReload,
          loading
        }}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={natureofWork && natureofWork.loading}
        err={natureofWork && natureofWork.err}
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
          sx: { width: "50%" },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Create Nature of Work"
          onClose={closeAddWorkOrder}
          imagePath={workOrdersBlue}
        />
        <AddNatureofWork closeModal={closeAddWorkOrder} />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: "50%" },
        }}
        anchor="right"
        open={editModal}
      >
        <DrawerHeader
          headerName="Edit Nature of Work"
          onClose={closeAddWorkOrder}
          imagePath={workOrdersBlue}
        />
        <AddNatureofWork editId={editId} closeModal={closeAddWorkOrder} />
      </Drawer>
      {/* <Row>
        <Col sm="12" md="12" lg="12" xs="12">
          <Col md="12" sm="12" lg="12" xs="12" className="Assets-list pl-1 pt-2 pr-2 itAsset-tablepage-table">
            <Card className="p-2 mb-2 h-100 bg-lightblue">
              <CardBody className="bg-color-white p-1 m-0">
                <Row className="p-2 itAsset-table-title">
                  <Col md="9" xs="12" sm="9" lg="9">
                    <span className="p-0 mr-2 font-weight-800 font-medium">
                      Nature of Work List :
                      {' '}
                      {columnHide && columnHide.length && totalDataCount}
                    </span>
                    {columnHide && columnHide.length ? (
                      <div className="content-inline">
                        {customFilters && customFilters.map((cf) => (
                          <p key={cf.value} className="mr-2 content-inline">
                            <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                              {(cf.type === 'inarray') ? (
                                <>
                                  {cf.title}
                                  <span>
                                    {'  '}
                                    :
                                    {' '}
                                    {decodeURIComponent(cf.arrayLabel ? cf.arrayLabel : cf.label)}
                                  </span>
                                </>
                              ) : (
                                cf.label
                              )}
                              {' '}
                              {(cf.type === 'text' || cf.type === 'id') && (
                                <span>
                                  {'  '}
                                  :
                                  {' '}
                                  {decodeURIComponent(cf.value)}
                                </span>
                              )}
                              {(cf.type === 'customdate') && (
                                <span>
                                  {'  '}
                                  :
                                  {' '}
                                  {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
                                  {' - '}
                                  {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
                                </span>
                              )}
                              <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
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
                      <ListDateFilters
                        dateFilters={dateFilters}
                        customFilters={customFilters}
                        handleCustomFilterClose={handleCustomFilterClose}
                        setCustomVariable={setCustomVariable}
                        customVariable={customVariable}
                        onClickRadioButton={handleRadioboxChange}
                        onChangeCustomDate={handleCustomDateChange}
                        idNameFilter="natureDate"
                        classNameFilter="drawerPopover popoverDate"
                      />
                      {isCreatable && (
                        <CreateList name="Add Nature of Work" showCreateModal={addAdjustmentWindow} />
                      )}
                      <ExportList idNameFilter="natureExport" />
                      <DynamicColumns
                        setColumns={setColumns}
                        columnFields={columnFields}
                        allColumns={allColumns}
                        setColumnHide={setColumnHide}
                        idNameFilter="natureColumns"
                        classNameFilter="drawerPopover"
                      />
                    </div>
                    {document.getElementById('natureExport') && (
                      <Popover className="drawerPopover" placement="bottom" isOpen={filterInitailValues.download} target="natureExport">
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
                {(natureofWork && natureofWork.data && natureofWork.data.length > 0) && (
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
                        setViewId={setViewId}
                        setViewModal={setViewModal}
                        tableData={natureofWork}
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

          <TableListFormat
            userResponse={userInfo}
            listResponse={natureofWork}
            countLoad={natureofWorkCountLoading}
          />
        </Col>
      </Row> */}
      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Nature of Work"
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
              successMessage="Nature of work removed successfully.."
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

NatureofWork.defaultProps = {
  match: false,
};

NatureofWork.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default NatureofWork;
