/* eslint-disable no-prototype-builtins */
/* eslint-disable object-shorthand */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect, useMemo } from 'react';
import Button from '@mui/material/Button';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
/* import DrawerHeader from '@shared/drawerHeader'; */
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import Drawer from '@mui/material/Drawer';
import mailroomBlue from '@images/icons/mailroomBlue.svg';
import uniqBy from 'lodash/unionBy';

import CommonGrid from '../../commonComponents/commonGrid';
import { InboundMailColumns } from '../../commonComponents/gridColumns';
import DrawerHeader from '../../commonComponents/drawerHeader';

import { updateHeaderData } from '../../core/header/actions';

import customData from '../data/customData.json';
import filtersFields from '../data/filtersFields.json';
import {
  getPagesCountV2, generateErrorMessage,
  queryGeneratorV1, getAllowedCompanies, getColumnArrayById,
  queryGeneratorWithUtc,
  getArrayFromValuesByItem, getListOfModuleOperations, getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getTabs,
  getActiveTab,
} from '../../util/appUtils';
import {
  getInboundMail, getInboundMailCount,
  getInBoundFilters, getInboundMailDetails, getInboundMailExport,
} from '../mailService';
import {
  setInitialValues,
} from '../../purchase/purchaseService';
import {
  setSorting,
} from '../../assets/equipmentService';
import {
  resetCreateOrder,
  resetUpdateOrder,
  getDelete, resetDelete,
} from '../../pantryManagement/pantryService';
import InboundDetail from './inboundDetail/inboundDetail';
import AddInbound from '../addInbound';
import actionCodes from '../data/actionCodes.json';
import { MailRoomManagementModule } from '../../util/field';

import mailRoomNav from '../navbar/navlist.json';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const InboundMails = (props) => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(1);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [statusGroups, setStatusGroups] = useState([]);
  const [recipientGroups, setRecipientGroups] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const apiFields = customData && customData.listfieldsShows ? customData.listfieldsShows : [];
  const [valueArray, setValueArray] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);

  const { pinEnableData } = useSelector((state) => state.auth);
  const [startExport, setStartExport] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [addModal, showAddModal] = useState(false);

  const [openStatus, setOpenStatus] = useState(false);
  const [openRecipient, setOpenRecipient] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);
  const [columnHide, setColumnHide] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [reload, setReload] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    mailInboundsCount, mailInbounds, mailInboundsCountLoading,
    mailInboundFilters, mailInboundDetail, mailInboundsExport,
  } = useSelector((state) => state.mailroom);
  const { stateChangeInfo } = useSelector((state) => state.visitorManagement);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { sortedValue } = useSelector((state) => state.equipment);

  const {
    addOrderInfo, updateOrderInfo, deleteInfo,
  } = useSelector((state) => state.pantry);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Mail Room Management', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Create Inbound']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Inbound']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Inbound']);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (mailInbounds && mailInbounds.err) ? generateErrorMessage(mailInbounds) : userErrorMsg;

  useEffect(() => {
    if (reload) {
      dispatch(getInBoundFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      const customFiltersList = '';
    }
  }, [reload]);

  useEffect(() => {
    if ((addOrderInfo && addOrderInfo.data) || (updateOrderInfo && updateOrderInfo.data) || (deleteInfo && deleteInfo.data) || (stateChangeInfo && stateChangeInfo.data)) {
      const customFiltersList = mailInboundFilters.customFilters ? queryGeneratorWithUtc(mailInboundFilters.customFilters, false, userInfo.data) : '';
      dispatch(getInboundMailCount(companies, appModels.MAILINBOUND, customFiltersList));
      dispatch(getInboundMail(companies, appModels.MAILINBOUND, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [addOrderInfo, updateOrderInfo, deleteInfo, stateChangeInfo]);

  useEffect(() => {
    if (mailInboundFilters && mailInboundFilters.customFilters) {
      setCustomFilters(mailInboundFilters.customFilters);
    }
  }, [mailInboundFilters]);

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(mailInbounds && mailInbounds.data && mailInbounds.data.length && mailInbounds.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(mailInbounds && mailInbounds.data && mailInbounds.data.length && mailInbounds.data[mailInbounds.data.length - 1].id);
    }
  }, [mailInbounds]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (mailInboundsCount && mailInboundsCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersQuery = mailInboundFilters && mailInboundFilters.customFilters ? queryGeneratorV1(mailInboundFilters.customFilters) : '';
      dispatch(getInboundMailExport(companies, appModels.MAILINBOUND, mailInboundsCount.length, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, startExport]);

  useEffect(() => {
    dispatch(setSorting({ sortBy: false, sortField: false }));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      // const customFiltersList = mailInboundFilters.customFilters ? queryGeneratorWithUtc(mailInboundFilters.customFilters, false, userInfo.data) : '';
      const customFilters = mailInboundFilters.customFilters ? queryGeneratorWithUtc(mailInboundFilters.customFilters, false, userInfo.data) : '';

      dispatch(getInboundMailCount(companies, appModels.MAILINBOUND, customFilters, globalFilter));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = mailInboundFilters.customFilters ? queryGeneratorWithUtc(mailInboundFilters.customFilters, false, userInfo.data) : '';
      // setCheckRows([])
      dispatch(getInboundMail(companies, appModels.MAILINBOUND, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, customFilters, globalFilter]);

  useEffect(() => {
    if (viewId) {
      dispatch(getInboundMailDetails(viewId, appModels.MAILINBOUND));
    }
  }, [viewId]);

  useEffect(() => {
    if (addOrderInfo && addOrderInfo.data && addOrderInfo.data.length && !viewId) {
      dispatch(getInboundMailDetails(addOrderInfo.data[0], appModels.MAILINBOUND));
    }
  }, [addOrderInfo]);

  const totalDataCount = mailInboundsCount && mailInboundsCount.length ? mailInboundsCount.length : 0;

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
      const data = mailInbounds && mailInbounds.data ? mailInbounds.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = mailInbounds && mailInbounds.data ? mailInbounds.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
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
        sender: true,
        employee_id: true,
        state: true,
        received_on: true,
        received_by: true,
        parcel_dimensions: true,
        tracking_no: true,
        courier_id: false,
        recipient: false,
        department_id: false,
        collected_on: false,
        collected_by: false,
      });
    }
  }, [visibleColumns]);

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getInBoundFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getInBoundFilters(customFiltersList));
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
      dispatch(getInBoundFilters(customFiltersList));
      removeData('data-recipient');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getInBoundFilters(customFiltersList));
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
    const oldCustomFilters = mailInboundFilters && mailInboundFilters.customFilters
      ? mailInboundFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    dispatch(getInBoundFilters(customFilters1));

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
      const oldCustomFilters = mailInboundFilters && mailInboundFilters.customFilters
        ? mailInboundFilters.customFilters
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
      dispatch(getInBoundFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = mailInboundFilters && mailInboundFilters.customFilters
        ? mailInboundFilters.customFilters
        : [];
      const filterValues = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getInBoundFilters(filterValues));
    }
    setOffset(0);
    setPage(1);
  };

  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = mailInboundFilters && mailInboundFilters.customFilters ? mailInboundFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getInBoundFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomDateChangeOld = (startDate, endDate) => {
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
      const oldCustomFilters = mailInboundFilters && mailInboundFilters.customFilters ? mailInboundFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      dispatch(getInBoundFilters(customFilters1));
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
    dispatch(getInBoundFilters(customFiltersList));
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

  const closeWindow = () => {
    showAddModal(false);

    showEditModal(false);
  };

  const onViewEditReset = () => {
    showEditModal(false);
    if (updateOrderInfo && updateOrderInfo.data) {
      dispatch(getInboundMailDetails(editId, appModels.MAILINBOUND));
    }
    dispatch(resetUpdateOrder());
    dispatch(resetCreateOrder());
  };

  function getNextPreview(ids, type) {
    const array = mailInbounds && mailInbounds.data ? mailInbounds.data : [];
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

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.MAILINBOUND));
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const onClickClear = () => {
    dispatch(getInBoundFilters([]));
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenStatus(false);
    setOpenRecipient(false);
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

  useEffect(() => {
    if (mailInbounds && mailInbounds.loading) {
      setOpenStatus(false);
      setOpenRecipient(false);
    }
  }, [mailInbounds]);

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
      dispatch(getInBoundFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const removeData = (id, column) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const stateValuesList = (mailInboundFilters && mailInboundFilters.customFilters && mailInboundFilters.customFilters.length > 0)
    ? mailInboundFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (mailInboundFilters && mailInboundFilters.customFilters && mailInboundFilters.customFilters.length > 0) ? mailInboundFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (mailInbounds && mailInbounds.loading) || (mailInboundsCountLoading);
  const detailData = mailInboundDetail && (mailInboundDetail.data && mailInboundDetail.data.length > 0) ? mailInboundDetail.data[0] : '';

  const onFilterChange = (data) => {
    const fields = [
      'id',
      'sender',
      'employee_id',
      'state',
      'received_on',
      'received_by',
      'parcel_dimensions',
      'tracking_no',
      'courier_id',
      'recipient',
      'department_id',
      'collected_on',
      'collected_by',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = mailInboundFilters && mailInboundFilters.customFilters
      ? mailInboundFilters.customFilters
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
        dispatch(getInBoundFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getInBoundFilters(customFilters));
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
        createTabs={{
          enable: true,
          menuList: props.menuList,
          tabs: props.tabs,
        }}
        sx={{
          height: '90%',
        }}
        tableData={
            mailInbounds && mailInbounds.data && mailInbounds.data.length
              ? mailInbounds.data
              : []
          }
        columns={InboundMailColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Inbound"
        exportFileName="Inbound"
        listCount={totalDataCount}
        exportInfo={mailInboundsExport}
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
        loading={mailInbounds && mailInbounds.loading}
        err={mailInbounds && mailInbounds.err}
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
        removeData={onClickRemoveData}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Add Inbound Mail"
          onClose={closeWindow}
        />
        <AddInbound closeModal={() => onViewReset()} />
      </Drawer>

      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName="Inbound Mail"
          imagePath={mailroomBlue}
          onClose={() => onViewReset()}
          onEdit={() => { setEditId(mailInboundDetail && (mailInboundDetail.data && mailInboundDetail.data.length > 0) ? mailInboundDetail.data[0].id : false); showEditModal(!editModal); }}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', mailInbounds) === 0 ? handlePageChangeDetail(currentpage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', mailInbounds));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', mailInbounds) === 0 ? handlePageChangeDetail(currentpage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', mailInbounds));
          }}
        />
        <InboundDetail isEditable={(isEditable && (mailInboundDetail && !mailInboundDetail.loading && detailData.state !== 'Delivered'))} />
      </Drawer>

      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Inbound Mail"
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
              successMessage="Inbound Mail removed successfully.."
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

export default InboundMails;
