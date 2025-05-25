/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import {
  Badge, Modal, ModalBody,
} from 'reactstrap';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  useFilters, usePagination, useSortBy, useTable,
} from 'react-table';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import VmsBlack from '@images/sideNavImages/vms_black.svg';
import Action from './visitRequestDetail/actionItems/actionVisitRequest';
import { resetUpdateTenant } from '../adminSetup/setupService';
import CommonGrid from '../commonComponents/commonGrid';
import DrawerHeader from '../commonComponents/drawerHeader';
import { VisitorColumns } from '../commonComponents/gridColumns';
import { updateHeaderData } from '../core/header/actions';
import {
  resetImage,
} from '../helpdesk/ticketService';
import { visitorStatusJson } from '../commonComponents/utils/util';
import CopyVisitorManagementUrl from './copyVisitorManagementUrl';
import { getDelete, resetDelete } from '../pantryManagement/pantryService';
import { setInitialValues } from '../purchase/purchaseService';
import { AddThemeBackgroundColor } from '../themes/theme';
import {
  getActiveTab,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getCompanyTimezoneDate,
  getDateAndTimeForDifferentTimeZones,
  getDefaultNoValue,
  getHeaderTabs,
  getListOfModuleOperations,
  getPagesCountV2,
  getTabs,
  isArrayValueExists,
  queryGeneratorWithUtc,
  formatFilterData, getNextPreview, debounce,
} from '../util/appUtils';
import { VistorManagementModule } from '../util/field';
import AddVisitRequest from './addVisitRequest';
import actionCodes from './data/actionCodes.json';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import visitorsNav from './navbar/navlist.json';
import DialogHeader from '../commonComponents/dialogHeader';
import VisitRequestDetails from './visitRequestDetails/visitRequestDetails';
import {
  getHostCompanyGroups,
  getVisitorRequestCount,
  getVisitorRequestDetail,
  getVisitorRequestFilters,
  getVisitorRequestList,
  getVisitorRequestListExport,
  getVisitorTypeGroups,
  getVmsConfigurationData,
  resetAddVisitRequest,
  resetVisitState,
} from './visitorManagementService';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const VisitRequest = () => {
  const limit = 10;
  const subMenu = 'Visit Request';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [columnsFields, setColumns] = useState([
    'visitor_name',
    'organization',
    'host_name',
    'allowed_sites_id',
    'visitor_badge',
    'actual_in',
    'actual_out',
    'entry_status',
    'state',
    'purpose',
  ]);
  const apiFields = customData && customData.listfieldsVRShows
    ? customData.listfieldsVRShows
    : [];
  const [customFilters, setCustomFilters] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [addVisitRequestModal, showAddVisitRequestModal] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [change, setChange] = useState(false);
  const [removeName, setRemoveName] = useState('');
  const [nameKeyword, setNameKeyword] = useState('');
  const [partsData, setPartsData] = useState([]);
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [scrollDataList, setScrollData] = useState([]);
  const [hostCompanyGroups, setHostCompanyGroups] = useState([]);
  const [isFirstTime, setIsfirstTime] = useState(true);
  const [customVariable, setCustomVariable] = useState(false);
  const [openCopyLink, setOpenCopyLink] = useState(false);
  const [reload, setReload] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [copyUrlModal, showCopyUrlModal] = useState(false);
  const [actionModal, showActionModal] = useState(false);

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [globalvalue, setGlobalvalue] = useState('');
  const [filterText, setFilterText] = useState('');

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const { pinEnableData } = useSelector((state) => state.auth);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Visitor Management',
    'code',
  );
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const companies = getAllowedCompanies(userInfo);
  const {
    visitorRequestCount,
    visitorRequestListInfo,
    visitorRequestCountLoading,
    vmsConfigList,
    visitorConfiguration,
    visitorRequestExport,
    visitorRequestFilters,
    visitorRequestDetails,
    hostCompanyGroupInfo,
    addVisitRequestInfo,
    stateChangeInfo,
    visitorTypeGroupInfo,
    visitorRequestRows,
  } = useSelector((state) => state.visitorManagement);
  const { sortedValue } = useSelector((state) => state.equipment);

  const viewData = visitorRequestDetails
      && visitorRequestDetails.data
      && visitorRequestDetails.data.length > 0
    ? visitorRequestDetails.data[0]
    : false;

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const { deleteInfo } = useSelector((state) => state.pantry);

  const history = useHistory();

  useEffect(() => {
    dispatch(resetAddVisitRequest());
  }, []);

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(visitorRequestListInfo && visitorRequestListInfo.data && visitorRequestListInfo.data.length && visitorRequestListInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(visitorRequestListInfo && visitorRequestListInfo.data && visitorRequestListInfo.data.length && visitorRequestListInfo.data[visitorRequestListInfo.data.length - 1].id);
    }
  }, [visitorRequestListInfo]);

  const getEntryState = (entryStates) => {
    const filteredType = customData.entryStates.filter((data) => data.value === entryStates);
    if (filteredType && filteredType.length) {
      return filteredType[0].label;
    }
    return '-';
  };

  const getDefaultNoValueData = (value) => {
    if (!value) return '-';
    if (typeof value === 'string') {
      try {
        const parsedValue = JSON.parse(value.replace(/'/g, '"'));
        if (parsedValue.label) return parsedValue.label;
      } catch (e) {
        return value;
      }
    }

    return value;
  };

  const isCreatable = allowedOperations.includes(
    actionCodes['Create New Visit Request'],
  );
  const isEditable = allowedOperations.includes(
    actionCodes['Edit Visit Request'],
  );
  const isDeleteable = allowedOperations.includes(
    actionCodes['Delete Visit Request'],
  );

  const isRejectable = allowedOperations.includes(actionCodes.Reject);

  const rejectFunc = () => {
    dispatch(resetVisitState());
    showActionModal(true);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const tableColumnsData = VisitorColumns(setViewId, isRejectable, rejectFunc, isDeleteable, onClickRemoveData);
  const [tableColumns, setTableColumns] = useState(tableColumnsData);

  useEffect(() => {
    setTableColumns(tableColumnsData);

    if (visitorRequestListInfo && visitorRequestListInfo.data && visitorRequestListInfo.data.length > 0) {
      const allAdditionalKeys = new Set();

      // Step 1: Collect all unique keys from additional_fields_ids
      visitorRequestListInfo.data.forEach((data) => {
        if (Array.isArray(data.additional_fields_ids)) {
          data.additional_fields_ids.forEach((field) => {
            allAdditionalKeys.add(field.name);
          });
        }
      });

      const allAdditionalKeysArray = Array.from(allAdditionalKeys);

      visitorRequestListInfo.data = visitorRequestListInfo.data.map((data) => {
        const additionalFieldsObject = Object.fromEntries(allAdditionalKeysArray.map((key) => [key, '-']));

        (data.additional_fields_ids || []).forEach((field) => {
          additionalFieldsObject[field.name] = getDefaultNoValueData(field.value);
        });

        const processedData = {
          ...data,
          ...additionalFieldsObject,
        };

        const newFields = {};
        allAdditionalKeysArray.forEach((key) => {
          if (!(key in visibleColumns)) {
            newFields[key] = true;
          }
        });

        setVisibleColumns({ ...visibleColumns, ...newFields });
        if (allAdditionalKeysArray && allAdditionalKeysArray.length && allAdditionalKeysArray.length > 0) {
          const additionalColumns = allAdditionalKeysArray.map((key) => ({
            field: key,
            headerName: key, // Format header names
            width: 150,
            editable: false,
            filterable: false,
            sortable: false,
            hidden: true,
            valueGetter: (params) => getDefaultNoValueData(params.value) || '-', // Handle missing values
          }));

          setTableColumns([...tableColumns, ...additionalColumns]);
        }
        return processedData;
      });
    }
  }, [visitorRequestListInfo]);

  useEffect(() => {
    setTableColumns(tableColumnsData);
    if (visitorRequestExport && visitorRequestExport.data && visitorRequestExport.data.length > 0) {
      const allAdditionalKeys = new Set();

      // Step 1: Collect all unique keys from additional_fields_ids
      visitorRequestExport.data.forEach((data) => {
        if (Array.isArray(data.additional_fields_ids)) {
          data.additional_fields_ids.forEach((field) => {
            allAdditionalKeys.add(field.name);
          });
        }
      });

      const allAdditionalKeysArray = Array.from(allAdditionalKeys);

      visitorRequestExport.data = visitorRequestExport.data.map((data) => {
        const additionalFieldsObject = Object.fromEntries(allAdditionalKeysArray.map((key) => [key, '-']));

        (data.additional_fields_ids || []).forEach((field) => {
          additionalFieldsObject[field.name] = getDefaultNoValueData(field.value);
        });

        const processedData = {
          ...data,
          entry_status: getEntryState(data.entry_status),
          actual_in: getCompanyTimezoneDate(data.actual_in, userInfo, 'datetime'),
          actual_out: getCompanyTimezoneDate(data.actual_out, userInfo, 'datetime'),
          purpose: data.purpose ? getDefaultNoValue(data.purpose) : getDefaultNoValue(data.purpose_id),
          visitor_name: data.visitor_name || '-',
          visitor_badge: data.visitor_badge || '-',
          organization: data.organization || '-',
          host_name: data.host_name || '-',
          allowed_sites_id: data.allowed_sites_id?.length ? data.allowed_sites_id[1] : '-',
          type_of_visitor: data.type_of_visitor || '-',
          ...additionalFieldsObject,
        };

        // const newFields = {};
        // allAdditionalKeysArray.forEach((key) => {
        //   if (!(key in visibleColumns)) {
        //     newFields[key] = true;
        //   }
        // });

        // setVisibleColumns({...visibleColumns, ...newFields });
        if (allAdditionalKeysArray && allAdditionalKeysArray.length && allAdditionalKeysArray.length > 0) {
          const additionalColumns = allAdditionalKeysArray.map((key) => ({
            field: key,
            headerName: key, // Format header names
            width: 150,
            editable: false,
            filterable: false,
            sortable: false,
            hidden: true,
            valueGetter: (params) => getDefaultNoValueData(params.value) || '-', // Handle missing values
          }));

          setTableColumns([...tableColumns, ...additionalColumns]);
        }
        return processedData;
      });
    }
  }, [visitorRequestExport]);

  useMemo(() => {
    if (history.location
      && history.location.from && history.location.from === 'Insights') {
    } else if (visitorRequestFilters && (!visitorRequestFilters.customFilters || !visitorRequestFilters.customFilters.length || visitorRequestFilters.customFilters.length)) {
      const defaultFilters = [
        {
          key: 'entry_status', title: 'Entry Status', value: 'Invited', label: 'Invited', type: 'inarray', header: 'Entry Status', id: 'entry_status',
        }, {
          key: 'Today', value: 'Today', label: 'Today', type: 'date',
        },
      ];
      setCustomFilters(defaultFilters);
      setValueArray(defaultFilters);
      setIsfirstTime(false);
      dispatch(getVisitorRequestFilters(defaultFilters));
    }
  }, []);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        visitor_name: true,
        organization: true,
        host_name: true,
        tenant_id: true,
        entry_status: true,
        state: true,
        visitor_badge: true,
        actual_in: true,
        actual_out: true,
        phone: false,
        planned_in: false,
        planned_out: false,
        email: false,
        type_of_visitor: false,
        purpose: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        visitor_name: true,
        organization: true,
        host_name: true,
        tenant_id: true,
        entry_status: true,
        state: true,
        visitor_badge: true,
        actual_in: true,
        actual_out: true,
        phone: false,
        planned_in: false,
        planned_out: false,
        email: false,
        type_of_visitor: false,
        purpose: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      setTableColumns(tableColumnsData);
      // const defaultFilters = [
      //   {
      //     key: 'entry_status', title: 'Entry Status', value: 'Invited', label: 'Invited', type: 'inarray', Header: 'Entry Status', id: 'entry_status',
      //   }, {
      //     key: 'Today', value: 'Today', label: 'Today', type: 'date',
      //   },
      // ];
      dispatch(getVisitorRequestFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useMemo(() => {
    if ((userInfo && userInfo.data) && (visitorRequestFilters && visitorRequestFilters.customFilters)) {
      const customFiltersList = visitorRequestFilters.customFilters ? queryGeneratorWithUtc(visitorRequestFilters.customFilters, 'planned_in', userInfo.data) : '';
      setCheckRows([]);
      dispatch(getVisitorRequestList(companies, appModels.VISITREQUEST, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [offset, sortedValue.sortBy, sortedValue.sortField, JSON.stringify(visitorRequestFilters.customFilters), globalFilter]);

  useMemo(() => {
    if ((userInfo && userInfo.data) && (visitorRequestFilters && visitorRequestFilters.customFilters)) {
      const customFiltersList = visitorRequestFilters.customFilters ? queryGeneratorWithUtc(visitorRequestFilters.customFilters, 'planned_in', userInfo.data) : '';
      dispatch(getVisitorRequestCount(companies, appModels.VISITREQUEST, customFiltersList, globalFilter));
    }
  }, [JSON.stringify(visitorRequestFilters.customFilters), globalFilter]);

  useEffect(() => {
    if (addVisitRequestInfo && addVisitRequestInfo.data) {
      const customFiltersList = visitorRequestFilters.customFilters ? queryGeneratorWithUtc(visitorRequestFilters.customFilters, 'planned_in', userInfo.data) : '';
      setIsfirstTime(false);
      dispatch(getVisitorRequestList(companies, appModels.VISITREQUEST, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
      dispatch(getVisitorRequestCount(companies, appModels.VISITREQUEST, customFiltersList, globalFilter));
    }
  }, [addVisitRequestInfo]);

  useEffect(() => {
    if (((tenantUpdateInfo && tenantUpdateInfo.data) || (deleteInfo && deleteInfo.data) || (stateChangeInfo && stateChangeInfo.data))) {
      const customFiltersList = visitorRequestFilters.customFilters ? queryGeneratorWithUtc(visitorRequestFilters.customFilters, 'planned_in', userInfo.data) : '';
      setIsfirstTime(false);
      dispatch(getVisitorRequestList(companies, appModels.VISITREQUEST, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
      dispatch(getVisitorRequestCount(companies, appModels.VISITREQUEST, customFiltersList, globalFilter));
    }
  }, [tenantUpdateInfo, deleteInfo, stateChangeInfo]);

  /* useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(
        getVmsConfigInfo(userInfo.data.company.id, appModels.VMSCONFIGURATION)
      );
    }
  }, [userInfo]); */

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getVmsConfigurationData(userInfo.data.company.id, appModels.VMSCONFIGURATION));
    }
  }, [userInfo]);

  useEffect(() => {
    if (visitorRequestFilters && visitorRequestFilters.customFilters) {
      setCustomFilters(visitorRequestFilters.customFilters);
    }
  }, [visitorRequestFilters]);

  useEffect(() => {
    if (
      !addVisitRequestModal
      && history.location
      && history.location.state
      && history.location.state.referrer
    ) {
      if (history.location.state.referrer === 'add-request') {
        showAddVisitRequestModal(true);
      } else if (history.location.state.referrer === 'view-request') {
        const { uuid } = history.location.state;
        const filters = [
          {
            key: 'uuid',
            value: uuid,
            label: 'UUID',
            type: 'text',
          },
        ];
        dispatch(getVisitorRequestFilters(filters));
      }
    }
  }, [history]);

  useEffect(() => {
    if (visitorRequestFilters && visitorRequestFilters.customFilters) {
      setCustomFilters(visitorRequestFilters.customFilters);
      const vid = isArrayValueExists(visitorRequestFilters.customFilters, 'type', 'id');
      if (history.location
        && history.location.from && history.location.from === 'Insights') {
      } else if (vid) {
        if (viewId !== vid) {
          const data = visitorRequestFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(vid));
          setCustomFilters(data);
          dispatch(getVisitorRequestFilters(data));
          setViewId(vid);
          setViewModal(true);
          const defaultFilters = [
            {
              key: 'entry_status', title: 'Entry Status', value: 'Invited', label: 'Invited', type: 'inarray', header: 'Entry Status', id: 'entry_status',
            }, {
              key: 'Today', value: 'Today', label: 'Today', type: 'date',
            },
          ];
          // setCustomFilters(defaultFilters);
          // setValueArray(defaultFilters);
          setIsfirstTime(false);
          dispatch(getVisitorRequestFilters(defaultFilters));
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [visitorRequestFilters]);

  useEffect(() => {
    if (!viewId) {
      setScrollData([]);
    }
  }, [viewId]);

  useMemo(() => {
    if (viewId) {
      dispatch(getVisitorRequestDetail(viewId, appModels.VISITREQUEST));
    }
  }, [viewId]);

  /* useEffect(() => {
     if (tenantUpdateInfo && tenantUpdateInfo.data) {
       dispatch(getVisitorRequestDetail(viewId, appModels.VISITREQUEST));
     }
   }, [tenantUpdateInfo]); */

  useEffect(() => {
    if (visitorRequestListInfo && visitorRequestListInfo.data && viewId) {
      const arr = [...scrollDataList, ...visitorRequestListInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [visitorRequestListInfo, viewId]);

  const totalDataCount = visitorRequestCount && visitorRequestCount.length
    ? visitorRequestCount.length
    : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columnsFields.filter((item) => item !== value));
    }
  };

  const handleTableCellChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(
        checkedRows.filter((item) => parseInt(item) !== parseInt(value)),
      );
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const data = visitorRequestListInfo && visitorRequestListInfo.data
        ? visitorRequestListInfo.data
        : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = visitorRequestListInfo && visitorRequestListInfo.data
        ? visitorRequestListInfo.data
        : [];
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
        header: 'Date Filter',
        id: value,
      },
    ];
    const oldCustomFilters = visitorRequestFilters && visitorRequestFilters.customFilters
      ? visitorRequestFilters.customFilters
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
    dispatch(getVisitorRequestFilters(customFilters1));

    setOffset(0);
    setPage(0);
  };

  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
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
    if (checked) {
      const oldCustomFilters = visitorRequestFilters && visitorRequestFilters.customFilters
        ? visitorRequestFilters.customFilters
        : [];
      const customFilters1 = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
        ...filters,
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date' && item.type !== 'customdate',
        ),
        ...filters,
      ]);
      dispatch(getVisitorRequestFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };
  useEffect(() => {
    if (
      customFilters
      && customFilters.length
      && valueArray
      && valueArray.length === 0
    ) {
      setValueArray(customFilters);
    }
  }, [customFilters]);

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
      const oldCustomFilters = visitorRequestFilters && visitorRequestFilters.customFilters
        ? visitorRequestFilters.customFilters
        : [];

      const filterValues = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getVisitorRequestFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = visitorRequestFilters && visitorRequestFilters.customFilters
        ? visitorRequestFilters.customFilters
        : [];
      const filterValues = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ];
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getVisitorRequestFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomDateChangeold = (startDate, endDate) => {
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
      const oldCustomFilters = visitorRequestFilters && visitorRequestFilters.customFilters
        ? visitorRequestFilters.customFilters
        : [];
      const customFilters1 = [
        ...oldCustomFilters.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      dispatch(getVisitorRequestFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (fvalue, cf) => {
    setCustomFilters(customFilters.filter((item) => item.value !== fvalue));
    const customFiltersList = customFilters.filter(
      (item) => item.value !== fvalue,
    );
    dispatch(getVisitorRequestFilters(customFiltersList));
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setOffset(0);
    setPage(0);
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [
        {
          key: 'entry_status',
          title: 'Entry Status',
          value,
          label: name,
          type: 'inarray',
        },
      ];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getVisitorRequestFilters(customFiltersList));
      removeData('data-entry_status');
    } else {
      const customFiltersList = customFilters.filter(
        (item) => item.value !== value,
      );
      dispatch(getVisitorRequestFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleApproveStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [
        {
          key: 'state',
          title: 'Approval Status',
          value,
          label: name,
          type: 'inarray',
        },
      ];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getVisitorRequestFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = customFilters.filter(
        (item) => item.value !== value,
      );
      dispatch(getVisitorRequestFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleHostCompanyStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [
        {
          key: 'allowed_sites_id',
          title: 'Host Company',
          value: parseInt(value),
          label: name,
          type: 'inarray',
        },
      ];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getVisitorRequestFilters(customFiltersList));
      removeData('data-allowed_sites_id');
    } else {
      const customFiltersList = customFilters.filter(
        (item) => parseInt(item.value) !== parseInt(value),
      );
      dispatch(getVisitorRequestFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleVisitTypeCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [
        {
          key: 'type_of_visitor',
          title: 'Visitor Type',
          value: encodeURIComponent(value),
          label: name,
          type: 'inarray',
        },
      ];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getVisitorRequestFilters(customFiltersList));
      removeData('data-type_of_visitor');
    } else {
      const customFiltersList = customFilters.filter(
        (item) => item.value !== value,
      );
      dispatch(getVisitorRequestFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  useEffect(() => {
    if (hostCompanyGroupInfo && hostCompanyGroupInfo.data) {
      setHostCompanyGroups(hostCompanyGroupInfo.data);
    }
  }, [hostCompanyGroupInfo]);

  useEffect(() => {
    if (visitorTypeGroupInfo && visitorTypeGroupInfo.data) {
      setVisitorTypeGroups(visitorTypeGroupInfo.data);
    }
  }, [visitorTypeGroupInfo]);

  const onSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = hostCompanyGroups.filter((item) => {
        const searchValue = item.allowed_sites_id
          ? item.allowed_sites_id[1].toString().toUpperCase()
          : '';
        const s = e.target.value.toString().toUpperCase();
        return searchValue.search(s) !== -1;
      });
      setHostCompanyGroups(ndata);
    } else {
      setHostCompanyGroups(
        hostCompanyGroupInfo && hostCompanyGroupInfo.data
          ? hostCompanyGroupInfo.data
          : [],
      );
    }
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCustomFilters([]);
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    dispatch(getVisitorRequestFilters([]));
    dispatch(setInitialValues(false, false, false, false));
    setOffset(0);
    setPage(0);
  };

  const showDetailsView = (id) => {
    dispatch(setInitialValues(false, false, false, false));
    setViewId(id);
    setViewModal(true);
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const sVal = values.fieldValue ? values.fieldValue.trim() : '';
    const filters = [
      {
        key: values.fieldName.value,
        value: encodeURIComponent(sVal),
        label: values.fieldName.label,
        type: 'text',
      },
    ];
    const customFilters1 = [...customFilters, ...filters];
    resetForm({ values: '' });
    dispatch(getVisitorRequestFilters(customFilters1));
    setOffset(0);
    setPage(0);
  };

  const addAdjustmentWindow = () => {
    if (document.getElementById('visitormanagementForm')) {
      document.getElementById('visitormanagementForm').reset();
    }
    showAddVisitRequestModal(true);
  };

  const closeEditModalWindow = () => {
    dispatch(resetUpdateTenant());
    setEdit(false);
    setEditId(false);
  };

  const onReset = () => {
    dispatch(resetImage());
    dispatch(resetAddVisitRequest());
    dispatch(resetUpdateTenant());
  };

  const onResetCreatePage = () => {
    dispatch(resetImage());
    dispatch(resetAddVisitRequest());
    dispatch(resetUpdateTenant());
    setNameKeyword(null);
  };

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.VISITREQUEST));
  };

  const onRemoveDataCancel = () => {
    dispatch(resetDelete());
    showDeleteModal(false);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  const stateValuesList = visitorRequestFilters
      && visitorRequestFilters.customFilters
      && visitorRequestFilters.customFilters.length > 0
    ? visitorRequestFilters.customFilters.filter(
      (item) => item.type === 'inarray',
    )
    : [];

  const visitTypeValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = visitorRequestFilters
      && visitorRequestFilters.customFilters
      && visitorRequestFilters.customFilters.length > 0
    ? visitorRequestFilters.customFilters
    : [];
  const loading = (userInfo && userInfo.loading)
    || (visitorRequestListInfo && visitorRequestListInfo.loading)
    || visitorRequestCountLoading;
  const detailName = visitorRequestDetails
      && visitorRequestDetails.data
      && visitorRequestDetails.data.length
    ? getDefaultNoValue(visitorRequestDetails.data[0].visitor_name)
    : '';

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
      dispatch(getVisitorRequestFilters(filterArray));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const searchColumns = [
    'email',
    'visitor_name',
    'phone',
    'host_name',
    'entry_status',
    'state',
    'type_of_visitor',
    'allowed_sites_id',
    'name',
  ];
  const advanceSearchColumns = [
    'entry_status',
    'state',
    'type_of_visitor',
    'allowed_sites_id',
  ];

  const columns = useMemo(() => filtersFields.columns, []);
  const data = useMemo(
    () => (visitorRequestListInfo.data ? visitorRequestListInfo.data : [{}]),
    [visitorRequestListInfo.data],
  );

  const hiddenColumns = [
    'id',
    'phone',
    'email',
    'type_of_visitor',
    'purpose_id',
    'planned_in',
    'planned_out',
  ];
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

  const [keyword, setKeyword] = useState(false);

  const [openEntryStatus, setOpenEntryStatus] = useState(false);
  const [openVisitorType, setOpenVisitorType] = useState(false);
  const [openApprovalStatus, setOpenApprovalStatus] = useState(false);
  const [openHostCompany, setOpenHostCompany] = useState(false);

  const advanceSearchjson = {
    entry_status: setOpenEntryStatus,
    state: setOpenApprovalStatus,
    type_of_visitor: setOpenVisitorType,
    allowed_sites_id: setOpenHostCompany,
  };
  useEffect(() => {
    if (userInfo && userInfo.data && openHostCompany) {
      dispatch(getHostCompanyGroups(companies, appModels.VISITREQUEST));
    }
  }, [userInfo, openHostCompany]);

  useEffect(() => {
    if (userInfo && userInfo.data && openVisitorType) {
      dispatch(getVisitorTypeGroups(companies, appModels.VISITREQUEST));
    }
  }, [userInfo, openVisitorType]);

  useEffect(() => {
    if (openHostCompany || openApprovalStatus || openApprovalStatus) {
      setKeyword('');
    }
  }, [openHostCompany, openApprovalStatus, openApprovalStatus]);

  const [entryStatusGroups, setEntryStatusGroups] = useState([]);
  const [approvalStatusGroups, setApprovalStatusGroups] = useState([]);
  const [visitorTypeGroups, setVisitorTypeGroups] = useState([]);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && visitorRequestCount
      && visitorRequestCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersList = visitorRequestFilters.customFilters
        ? queryGeneratorWithUtc(visitorRequestFilters.customFilters)
        : '';
      dispatch(
        getVisitorRequestListExport(
          companies,
          appModels.VISITREQUEST,
          visitorRequestCount.length,
          offsetValue,
          VistorManagementModule.visitorApiFields,
          customFiltersList,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
        ),
      );
    }
  }, [startExport]);

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
      'name',
      'visitor_name',
      'organization',
      'host_name',
      'allowed_sites_id',
      'entry_status',
      'state',
      'visitor_badge',
      'actual_in',
      'actual_out',
      'phone',
      'planned_in',
      'planned_out',
      'email',
      'type_of_visitor',
      'purpose',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = visitorRequestFilters && visitorRequestFilters.customFilters
      ? visitorRequestFilters.customFilters
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
        dispatch(getVisitorRequestFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getVisitorRequestFilters(customFilters));
    }

    const filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : [];
    const statusField = filtersData.length > 0 && filtersData.findIndex((item) => item.field === 'entry_status');
    if ((statusField !== -1 || statusField === 0 || !statusField) && filtersData[statusField] && filtersData[statusField].value) {
      filtersData[statusField].value = visitorStatusJson.find((status) => filtersData[statusField].value === status.status).text;
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
    [visitorRequestFilters],
  );

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Visitor Management',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, visitorsNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Visit Request',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Visitor Management',
        moduleName: 'Visitor Management',
        menuName: 'Visit Request',
        link: '/visitormanagement-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  const cancelStateChange = () => {
    dispatch(resetVisitState());
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

  return (
    <Box>
      {/* <Header
        headerPath="Visitor Management"
        nextPath="Visit Request"
        pathLink="/visitormanagement-overview"
        headerTabs={tabss.filter((e) => e)}
        activeTab={activeTab}
      /> */}
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        sx={{
          height: '90%',
        }}
        tableData={
          visitorRequestListInfo
            && visitorRequestListInfo.data
            && visitorRequestListInfo.data.length
            ? visitorRequestListInfo.data
            : []
        }
        columns={tableColumns}
        linkButton={{
          show: visitorConfiguration
            && !visitorConfiguration.loading
            && visitorConfiguration.data
            && visitorConfiguration.data.length
            && visitorConfiguration.data[0].web_encoded_url,
          onClick: () => {
            showCopyUrlModal(true);
          },
        }}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        pdfStaticColumnWidth={{
          purpose: { cellWidth: 150 },
        }}
        moduleName="Visit Request List"
        exportFileName="Visit Request"
        isModuleDisplayName
        listCount={totalDataCount}
        exportInfo={visitorRequestExport}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(
            actionCodes['Create New Visit Request'],
          ),
          text: 'Add',
          func: () => showAddVisitRequestModal(true),
        }}
        setRows={setRows}
        rows={rows}
        dynamicFields
        filters={filterText}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={visitorRequestListInfo && visitorRequestListInfo.loading}
        err={visitorRequestListInfo && visitorRequestListInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        initialtableColumns={tableColumnsData}
        setTableColumns={setTableColumns}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        moduleCustomHeader={(
          <>
            {customFilters && customFilters.length > 0 ? customFilters.map((cf) => (
              (cf.type === 'inarray' || cf.label)
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                      {(cf.type === 'inarray') ? (
                        <>
                          {cf.title}
                          <span>
                            {' '}
                            :
                            {' '}
                            {decodeURIComponent(cf.arrayLabel ? cf.arrayLabel : cf.label)}
                          </span>
                        </>
                      ) : (
                        <>
                          {cf.name ? cf.name : cf.label}
                        </>
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
        open={addVisitRequestModal}
      >
        <DrawerHeader
          headerName="Create Visit request"
          onClose={() => {
            showAddVisitRequestModal(false);
            onReset();
            setChange(false);
            setNameKeyword(null);
            setPartsData([]);
          }}
          imagePath={VmsBlack}
        />
        <AddVisitRequest
          editId={false}
          afterReset={() => {
            showAddVisitRequestModal(false);
            onReset();
          }}
          closeModal={() => {
            showAddVisitRequestModal(false);
            onReset();
          }}
          isShow={addVisitRequestModal}
          change={change}
          setChange={setChange}
          nameKeyword={nameKeyword}
          setNameKeyword={setNameKeyword}
          visitorConfiguration={visitorConfiguration}
          partsData={partsData}
          setPartsData={setPartsData}
        />
      </Drawer>

      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={
            visitorRequestDetails
              && visitorRequestDetails.data
              && visitorRequestDetails.data.length > 0
              ? `${'Visit Request'}${' - '}${visitorRequestDetails.data[0].visitor_name
              }${' ('}${visitorRequestDetails.data[0].name}${')'}`
              : 'Visit Request'
          }
          imagePath={VmsBlack}
          onClose={onViewReset}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', visitorRequestListInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', visitorRequestListInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', visitorRequestListInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', visitorRequestListInfo));
          }}
        />
        <VisitRequestDetails
          editId={editId}
          setEditId={setEditId}
          setViewModal={setViewModal}
        />
      </Drawer>
      <Dialog size="md" open={copyUrlModal}>
        <DialogHeader title="Copy URL" onClose={() => showCopyUrlModal(false)} sx={{ width: '500px' }} hideClose />
        <DialogContent>
          <CopyVisitorManagementUrl resetData={copyUrlModal} />
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            size="sm"
            variant="contained"
            className="float-right mt-2"
            onClick={() => showCopyUrlModal(false)}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered delete-visitRequest"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Visit Request"
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
            successMessage="Visit Request removed successfully.."
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
      {actionModal && (
      <Action
        atReset={() => {
          showActionModal(false); cancelStateChange();
        }}
        actionText="Reject"
        actionCode="action_rejected"
        actionMessage="rejected"
        actionButton="Reject"
        details={visitorRequestDetails}
        actionModal
      />
      )}
    </Box>
  );
};

export default VisitRequest;
