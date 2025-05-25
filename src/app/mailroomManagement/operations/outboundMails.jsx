/* eslint-disable no-prototype-builtins */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* import DrawerHeader from '@shared/drawerHeader'; */
import uniqBy from 'lodash/unionBy';

import Drawer from '@mui/material/Drawer';
import mailroomBlue from '@images/icons/mailroomBlue.svg';
import CommonGrid from '../../commonComponents/commonGrid';
import { OutboundMailColumns } from '../../commonComponents/gridColumns';
import DrawerHeader from '../../commonComponents/drawerHeader';

import customData from '../data/customData.json';
import filtersFields from '../data/filtersFields.json';
import {
  getPagesCountV2,
  queryGeneratorV1, getAllowedCompanies, getColumnArrayById,
  queryGeneratorWithUtc,
  getArrayFromValuesByItem, getListOfModuleOperations, getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from '../../util/appUtils';
import {
  getOutboundMail, getOutboundMailCount,
  getOutboundFilters, getOutboundMailDetails, getOutboundMailExport,
} from '../mailService';
import {
  setSorting,
} from '../../assets/equipmentService';
import {
  resetCreateOrder,
  resetUpdateOrder,
  getDelete, resetDelete,
} from '../../pantryManagement/pantryService';
import {
  setInitialValues,
} from '../../purchase/purchaseService';
import OutboundDetail from './outboundDetail/InboundDetail';
import AddOutbound from '../addOutbound';
import actionCodes from '../data/actionCodes.json';
import { MailRoomManagementModule } from '../../util/field';

import mailRoomNav from '../navbar/navlist.json';
import { updateHeaderData } from '../../core/header/actions';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const OutboundMails = (props) => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShowsOutbound ? customData.listfieldsShowsOutbound : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [statusGroups, setStatusGroups] = useState([]);
  const [recipientGroups, setRecipientGroups] = useState([]);
  const apiFields = customData && customData.listfieldsShowsOutbound ? customData.listfieldsShowsOutbound : [];
  const [columnHide, setColumnHide] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openRecipient, setOpenRecipient] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');
  const [viewModal, setViewModal] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [customFiltersList, setCustomFiltersList] = useState([]);

  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [startExport, setStartExport] = useState(false);

  const { pinEnableData } = useSelector((state) => state.auth);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [addModal, showAddModal] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [reload, setReload] = useState(false);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    mailOutboundsCount, mailOutbounds, mailOutboundsCountLoading,
    mailOutboundFilters, mailOutboundDetail, mailOutboundsExport,
  } = useSelector((state) => state.mailroom);
  const { stateChangeInfo } = useSelector((state) => state.visitorManagement);
  const { sortedValue } = useSelector((state) => state.equipment);

  const {
    addOrderInfo, updateOrderInfo, deleteInfo,
  } = useSelector((state) => state.pantry);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Mail Room Management', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Create Outbound']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Outbound']);
  // const userErrorMsg = generateErrorMessage(userInfo);
  // const errorMsg = (mailOutbounds && mailOutbounds.err) ? generateErrorMessage(mailOutbounds) : userErrorMsg;

  useEffect(() => {
    if (reload) {
      dispatch(getOutboundFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      const customFiltersList = '';
    }
  }, [reload]);

  useEffect(() => {
    if ((addOrderInfo && addOrderInfo.data) || (updateOrderInfo && updateOrderInfo.data) || (deleteInfo && deleteInfo.data) || (stateChangeInfo && stateChangeInfo.data)) {
      const customFiltersList = mailOutboundFilters.customFilters ? queryGeneratorWithUtc(mailOutboundFilters.customFilters, false, userInfo.data) : '';
      dispatch(getOutboundMailCount(companies, appModels.MAILOUTBOUND, customFiltersList));
      dispatch(getOutboundMail(companies, appModels.MAILOUTBOUND, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [addOrderInfo, updateOrderInfo, deleteInfo, stateChangeInfo]);

  useEffect(() => {
    if (mailOutboundFilters && mailOutboundFilters.customFilters) {
      setCustomFilters(mailOutboundFilters.customFilters);
    }
  }, [mailOutboundFilters]);

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(mailOutbounds && mailOutbounds.data && mailOutbounds.data.length && mailOutbounds.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(mailOutbounds && mailOutbounds.data && mailOutbounds.data.length && mailOutbounds.data[mailOutbounds.data.length - 1].id);
    }
  }, [mailOutbounds]);

  useEffect(() => {
    dispatch(setSorting({ sortBy: false, sortField: false }));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = mailOutboundFilters.customFilters ? queryGeneratorWithUtc(mailOutboundFilters.customFilters, false, userInfo.data) : '';
      dispatch(getOutboundMailCount(companies, appModels.MAILOUTBOUND, customFiltersList, globalFilter));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (mailOutboundsCount && mailOutboundsCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersQuery = mailOutboundFilters && mailOutboundFilters.customFilters ? queryGeneratorV1(mailOutboundFilters.customFilters) : '';
      dispatch(getOutboundMailExport(companies, appModels.MAILOUTBOUND, mailOutboundsCount.length, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [startExport]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = mailOutboundFilters.customFilters ? queryGeneratorWithUtc(mailOutboundFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getOutboundMail(companies, appModels.MAILOUTBOUND, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, customFilters]);

  useEffect(() => {
    if (viewId) {
      dispatch(getOutboundMailDetails(viewId, appModels.MAILOUTBOUND));
    }
  }, [viewId]);

  useEffect(() => {
    if (addOrderInfo && addOrderInfo.data && addOrderInfo.data.length && !viewId) {
      dispatch(getOutboundMailDetails(addOrderInfo.data[0], appModels.MAILOUTBOUND));
    }
  }, [addOrderInfo]);

  const totalDataCount = mailOutboundsCount && mailOutboundsCount.length ? mailOutboundsCount.length : 0;

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
      const data = mailOutbounds && mailOutbounds.data ? mailOutbounds.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = mailOutbounds && mailOutbounds.data ? mailOutbounds.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getOutboundFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getOutboundFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const handleRecipientCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'recipient', title: 'Type', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getOutboundFilters(customFiltersList));
      removeData('data-recipient');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getOutboundFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
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
    const oldCustomFilters = mailOutboundFilters && mailOutboundFilters.customFilters
      ? mailOutboundFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getOutboundFilters(customFilters1));

    setOffset(0);
    setPage(1);
  };

  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = mailOutboundFilters && mailOutboundFilters.customFilters ? mailOutboundFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getOutboundFilters(customFilters1));
    }
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
      const oldCustomFilters = mailOutboundFilters && mailOutboundFilters.customFilters
        ? mailOutboundFilters.customFilters
        : [];
      const filterValues = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(getOutboundFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = mailOutboundFilters && mailOutboundFilters.customFilters
        ? mailOutboundFilters.customFilters
        : [];
      const filterValues = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getOutboundFilters(filterValues));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomDateChangeold = (startDate, endDate) => {
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
      const oldCustomFilters = mailOutboundFilters && mailOutboundFilters.customFilters ? mailOutboundFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      dispatch(getOutboundFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter((item) => item.value !== cfValue);
    dispatch(getOutboundFilters(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    showAddModal(false);
    dispatch(resetUpdateOrder());
    dispatch(resetCreateOrder());
  };

  const onViewEditReset = () => {
    showEditModal(false);
    if (updateOrderInfo && updateOrderInfo.data) {
      dispatch(getOutboundMailDetails(editId, appModels.MAILOUTBOUND));
    }
    dispatch(resetUpdateOrder());
    dispatch(resetCreateOrder());
  };

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        id: true,
        employee_id: true,
        sent_to: true,
        state: true,
        sent_on: true,
        received_by: true,
        parcel_dimensions: true,
        tracking_no: true,
        courier_id: false,
        recipient: false,
        department_id: false,
        delivered_on: false,
        delivered_by: false,
      });
    }
  }, [visibleColumns]);

  function getNextPreview(ids, type) {
    const array = mailOutbounds && mailOutbounds.data ? mailOutbounds.data : [];
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

  const searchColumns = MailRoomManagementModule.outBoundSearchColumn;

  const hiddenColumns = MailRoomManagementModule.outBoundHiddenColumn;

  const advanceSearchColumns = MailRoomManagementModule.outBoundAdvanceSearchColumn;

  const addOrderWindow = () => {
    showAddModal(true);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.MAILOUTBOUND));
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const onClickClear = () => {
    dispatch(getOutboundFilters([]));
    setValueArray([]);
    filtersFields.columnsOutBound.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenStatus(false);
    setOpenRecipient(false);
  };

  useEffect(() => {
    if (mailOutbounds && mailOutbounds.loading) {
      setOpenStatus(false);
      setOpenRecipient(false);
    }
  }, [mailOutbounds]);

  useEffect(() => {
    if (openRecipient) {
      setKeyword(' ');
      setOpenStatus(false);
    }
  }, [openRecipient]);

  useEffect(() => {
    if (openStatus) {
      setKeyword(' ');
      setOpenRecipient(false);
    }
  }, [openStatus]);

  const advanceSearchjson = {
    recipient: setOpenRecipient,
    state: setOpenStatus,
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
          value: key.value,
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
      dispatch(getOutboundFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
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

  const closeWindow = () => {
    showAddModal(false);
    showEditModal(false);
  };

  const removeData = (id, column) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const stateValuesList = (mailOutboundFilters && mailOutboundFilters.customFilters && mailOutboundFilters.customFilters.length > 0)
    ? mailOutboundFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (mailOutboundFilters && mailOutboundFilters.customFilters && mailOutboundFilters.customFilters.length > 0) ? mailOutboundFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (mailOutbounds && mailOutbounds.loading) || (mailOutboundsCountLoading);

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
      'id',
      'employee_id',
      'sent_to',
      'state',
      'sent_on',

      'parcel_dimensions',
      'tracking_no',
      'courier_id',
      'recipient',
      'department_id',
      'delivered_on',
      'delivered_by',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = mailOutboundFilters && mailOutboundFilters.customFilters
      ? mailOutboundFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.length > 0 ? (oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    )) : [];

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
        dispatch(getOutboundFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getOutboundFilters(customFilters));
    }
  };

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Mail Room Management',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, mailRoomNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Operations',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Mail Room Management',
        moduleName: 'Mail Room Management',
        menuName: '',
        link: '/mailroom/operations',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <>
      {/* <Box className={pinEnableData ? "content-box-expand" : "content-box"}>
    <Header
      headerPath="Mail Room"
      nextPath=""
      pathLink="/mailroom/operations"
      headerTabs={tabs.filter((e) => e)}
      activeTab={activeTab}
    /> */}
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
        mailOutbounds && mailOutbounds.data && mailOutbounds.data.length
          ? mailOutbounds.data
          : []
      }
        columns={OutboundMailColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Outbound"
        exportFileName="Outbound"
        listCount={totalDataCount}
        exportInfo={mailOutboundsExport}
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
        reload={{
          show: true,
          setReload,
          loading,
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={onFilterChange}
        loading={mailOutbounds && mailOutbounds.loading}
        err={mailOutbounds && mailOutbounds.err}
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
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Add Outbound Mail"
          onClose={closeWindow}
        />
        <AddOutbound closeModal={() => onViewReset()} />
      </Drawer>

      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName="Outbound Mail"
          imagePath={mailroomBlue}
          onClose={() => onViewReset()}
          onEdit={() => {
            setEditId(mailOutboundDetail && (mailOutboundDetail.data && mailOutboundDetail.data.length > 0) ? mailOutboundDetail.data[0].id : false);
            showEditModal(!editModal);
          }}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', mailOutbounds) === 0 ? handlePageChangeDetail(currentpage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', mailOutbounds));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', mailOutbounds) === 0 ? handlePageChangeDetail(currentpage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', mailOutbounds));
          }}
        />
        <OutboundDetail isEditable={(isEditable && (mailOutboundDetail && !mailOutboundDetail.loading))} />
      </Drawer>

    </>
  );
};

export default OutboundMails;
