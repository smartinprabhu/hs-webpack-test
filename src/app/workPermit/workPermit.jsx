/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@mui/material/Drawer';
import uniqBy from 'lodash/unionBy';
import * as PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useFilters, usePagination, useSortBy, useTable,
} from 'react-table';
import {
  Badge, Modal,  ModalBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import Loader from '@shared/loading';
import workPermitBlack from '@images/icons/workPermitBlue.svg';

import { Box } from '@mui/system';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DrawerHeader from '../commonComponents/drawerHeader';
import { AddThemeBackgroundColor } from '../themes/theme';
import { getUploadImage, onDocumentCreatesAttach } from '../helpdesk/ticketService';
import AsyncFileUpload from '../commonComponents/asyncFileUpload';
import {
  getActiveTab,
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfModuleOperations,
  getPagesCountV2,
  getTabs,
  prepareDocuments,
  queryGeneratorV1,
  queryGeneratorWithUtc,
  getCompanyTimezoneDate,
  formatFilterData,
  debounce, getNextPreview,
} from '../util/appUtils';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import workPermitNav from './navbar/navlist.json';

import CommonGrid from '../commonComponents/commonGrid';
import { WorkPermitColumns } from '../commonComponents/gridColumns';
import { updateHeaderData } from '../core/header/actions';
import {
  getDelete,
  resetCreateProductCategory,
  resetDelete,
  resetUpdateProductCategory,
} from '../pantryManagement/pantryService';
import { getPartsData } from '../preventiveMaintenance/ppmService';
import {
  setInitialValues,
} from '../purchase/purchaseService';
import { WorkPermitModule } from '../util/field';
import { getCustomStatusName } from './utils/utils';
import {
  getOrderDetail,
} from '../workorders/workorderService';
import actionCodes from './data/actionCodes.json';
import {
  getMaintenanceGroups,
  getNatureGroups, getVendorGroups,
  getWorkPermit, getWorkPermitCount,
  getWorkPermitDetails,
  getWorkPermitExport,
  getWorkPermitFilters,
  getWpConfig,
  getTaskDetails,
  getIpTaskDetails,
  getIPDetailsReset,
} from './workPermitService';
import WorkPermitDetails from './workpermitDetails/workpermitDetails';
import AddWorkPermit from './addWorkPermit';
import OrderDetail from '../workorders/workorderDetails/workorderDetails';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const WorkPermit = (props) => {
  const { match } = props;
  const { params } = match;
  const uuid = params && params.uuid ? params.uuid : false;
  const limit = 10;
  const subMenu = 'Work Permit';
  const classes = useStyles();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listfieldsShows ? customData.listfieldsShows : []);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [vendorGroups, setVendorGroups] = useState([]);
  const [natureGroups, setNatureGroups] = useState([]);
  const [statusGroups, setStatusGroups] = useState([]);
  const [addModal, showAddModal] = useState(false);
  const [filterText, setFilterText] = useState('');

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);
  const [addLink, setAddLink] = useState(false);

  const [columnHide, setColumnHide] = useState([]);
  const [keyword, setKeyword] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [maintenanceGroups, setMaintenanceGroups] = useState([]);
  const [openMaintenanceTeam, setOpenMaintenanceTeam] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);

  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    workPermitsCount,
    workPermits,
    workPermitsCountLoading,
    maintenanceGroupsInfo,
    workPermitFilters,
    workPermitDetail,
    vendorGroupsInfo,
    natureGroupsInfo,
    permitStateChangeInfo,
    workPermitsExport,
    wpTaskLists,
    wpIpLists,
  } = useSelector((state) => state.workpermit);
  const { stateChangeInfo } = useSelector((state) => state.visitorManagement);
  const { actionResultInfo, updatePartsOrderInfo } = useSelector(
    (state) => state.workorder,
  );
  const { workPermitConfig } = useSelector((state) => state.workpermit);
  const { sortedValue } = useSelector((state) => state.equipment);

  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { pinEnableData } = useSelector((state) => state.auth);

  const { addProductCategoryInfo, updateProductCategoryInfo, deleteInfo } = useSelector((state) => state.pantry);
  const apiFields = customData && customData.listFields;

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Work Permit',
    'code',
  );

  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;

  const tableColumns = WorkPermitColumns(workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false);

  const isCreatable = allowedOperations.includes(
    actionCodes['Create Work Permit'],
  );
  const isEditable = allowedOperations.includes(
    actionCodes['Edit Work Permit'],
  );
  const isDeleteable = allowedOperations.includes(
    actionCodes['Delete Work Permit'],
  );

  const [openPermitStatus, setOpenPermitStatus] = useState(false);
  const [openVendorId, setOpenVendorId] = useState(false);
  const [openNatureWork, setOpenNatureWork] = useState(false);

  const advanceSearchjson = {
    state: setOpenPermitStatus,
    vendor_id: setOpenVendorId,
    nature_work_id: setOpenNatureWork,
    maintenance_team_id: setOpenMaintenanceTeam,
  };
  const { uploadPhoto } = useSelector((state) => state.ticket);

  AsyncFileUpload(addProductCategoryInfo, uploadPhoto);

  useEffect(() => {
    if (maintenanceGroupsInfo && maintenanceGroupsInfo.data) {
      setMaintenanceGroups(maintenanceGroupsInfo.data);
    }
  }, [maintenanceGroupsInfo]);

  useEffect(() => {
    if (openPermitStatus || openVendorId || openNatureWork) {
      setKeyword('');
    }
  }, [openPermitStatus, openVendorId, openNatureWork]);

  useEffect(() => {
    if (userInfo && userInfo.data && openVendorId) {
      dispatch(getVendorGroups(companies, appModels.WORKPERMIT));
    }
  }, [userInfo, openVendorId]);

  useEffect(() => {
    if (userInfo && userInfo.data && openMaintenanceTeam) {
      dispatch(getMaintenanceGroups(companies, appModels.WORKPERMIT));
    }
  }, [userInfo, openMaintenanceTeam]);

  useEffect(() => {
    if (userInfo && userInfo.data && openNatureWork) {
      dispatch(getNatureGroups(companies, appModels.WORKPERMIT));
    }
  }, [userInfo, openNatureWork]);

  useEffect(() => {
    if (uuid) {
      /* const filters = [{
        key: 'uuid', value: uuid, label: 'UUID', type: 'text',
      }];
      dispatch(getWorkPermitFilters(filters)); */

      dispatch(setInitialValues(false, false, false, false));
      setViewId(uuid);
      setViewModal(true);
    }
  }, [uuid]);

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
    if (workPermitFilters && workPermitFilters.customFilters) {
      setCustomFilters(workPermitFilters.customFilters);
    }
  }, [workPermitFilters]);

  useEffect(() => {
    if (workPermitsExport && workPermitsExport.data && workPermitsExport.data.length > 0) {
      workPermitsExport.data.map((data) => {
        data.planned_start_time = getCompanyTimezoneDate(data.planned_start_time, userInfo, 'datetime');
        data.planned_end_time = getCompanyTimezoneDate(data.planned_end_time, userInfo, 'datetime');
        data.valid_through = getCompanyTimezoneDate(data.valid_through, userInfo, 'datetime');
        data.state = getCustomStatusName(data.state, workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false);
      });
    }
  }, [workPermitsExport, workPermitConfig]);

  useEffect(() => {
    if (reload) {
      dispatch(getWorkPermitFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = workPermitFilters && workPermitFilters.customFilters
        ? queryGeneratorWithUtc(
          workPermitFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getWorkPermitCount(
          companies,
          appModels.WORKPERMIT,
          customFiltersList,
          globalFilter,
        ),
      );
    }
  }, [userInfo, workPermitFilters.customFilters, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data && sortedValue && sortedValue.sortBy) {
      const customFiltersList = workPermitFilters && workPermitFilters.customFilters ? queryGeneratorWithUtc(workPermitFilters.customFilters, false, userInfo.data) : '';
      dispatch(getWorkPermit(companies, appModels.WORKPERMIT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, workPermitFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (
      (addProductCategoryInfo && addProductCategoryInfo.data)
      || (updateProductCategoryInfo && updateProductCategoryInfo.data)
      || (deleteInfo && deleteInfo.data)
    ) {
      const customFiltersList = workPermitFilters.customFilters
        ? queryGeneratorWithUtc(
          workPermitFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getWorkPermitCount(companies, appModels.WORKPERMIT, customFiltersList),
      );
      dispatch(
        getWorkPermit(
          companies,
          appModels.WORKPERMIT,
          limit,
          offset,
          customFiltersList,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [addProductCategoryInfo, updateProductCategoryInfo, deleteInfo]);

  useEffect(() => {
    if (
      (updateProductCategoryInfo && updateProductCategoryInfo.data)
      || (stateChangeInfo && stateChangeInfo.data)
      || (actionResultInfo && actionResultInfo.data)
      || (updatePartsOrderInfo && updatePartsOrderInfo.data)
      || (permitStateChangeInfo && permitStateChangeInfo.data)
    ) {
      const customFiltersList = workPermitFilters.customFilters
        ? queryGeneratorWithUtc(
          workPermitFilters.customFilters,
          false,
          userInfo.data,
        )
        : '';
      dispatch(
        getWorkPermit(
          companies,
          appModels.WORKPERMIT,
          limit,
          offset,
          customFiltersList,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [stateChangeInfo, actionResultInfo, updatePartsOrderInfo, permitStateChangeInfo]);

  useEffect(() => {
    if (viewId) {
      dispatch(getWorkPermitDetails(viewId, appModels.WORKPERMIT));
    }
  }, [viewId]);

  useEffect(() => {
    if (permitStateChangeInfo && permitStateChangeInfo.data) {
      dispatch(getWorkPermitDetails(viewId, appModels.WORKPERMIT));
    }
  }, [permitStateChangeInfo]);

/*  useEffect(() => {
    if (updateProductCategoryInfo && updateProductCategoryInfo.data) {
     // dispatch(getWorkPermitDetails(viewId, appModels.WORKPERMIT));
    }
  }, [updateProductCategoryInfo]); */

  /* useEffect(() => {
    if (
      addProductCategoryInfo
      && addProductCategoryInfo.data
      && addProductCategoryInfo.data.length
      && !viewId
    ) {
      dispatch(
        getWorkPermitDetails(
          addProductCategoryInfo.data[0],
          appModels.WORKPERMIT,
        ),
      );
    }
  }, [addProductCategoryInfo]); */

  const totalDataCount = workPermitsCount && workPermitsCount.length ? workPermitsCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  /* useEffect(() => {
    if (customFilters && customFilters.length && valueArray && valueArray.length === 0) {
      setValueArray(customFilters);
    }
  }, [customFilters]); */

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const taskId = workPermitDetail && workPermitDetail.data && workPermitDetail.data.length > 0 && workPermitDetail.data[0].task_id && workPermitDetail.data[0].task_id.id;
  const ipId = workPermitDetail && workPermitDetail.data && workPermitDetail.data.length > 0 && workPermitDetail.data[0].issue_permit_checklist_id && workPermitDetail.data[0].issue_permit_checklist_id.id;

  useEffect(() => {
    if (viewModal && taskId && (wpTaskLists && wpTaskLists.data ? wpTaskLists.data.length && wpTaskLists.data[0].id !== taskId : true)) {
      dispatch(getTaskDetails(taskId));
    }
  }, [workPermitDetail, viewModal]);

  useEffect(() => {
    if (viewModal && ipId && (wpIpLists && wpIpLists.data ? wpIpLists.data.length && wpIpLists.data[0].check_list_id !== ipId : true)) {
      dispatch(getIpTaskDetails(ipId));
    } else if (!ipId) {
      dispatch(getIPDetailsReset());
    }
  }, [workPermitDetail, viewModal]);

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
      const data = workPermits && workPermits.data ? workPermits.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = workPermits && workPermits.data ? workPermits.data : [];
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
      const customFiltersList = [...workPermitFilters.customFilters, ...filters];
      dispatch(getWorkPermitFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = workPermitFilters && workPermitFilters.customFilters.filter((item) => item.value !== value);
      dispatch(getWorkPermitFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleVendorChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'vendor_id', title: 'Vendor', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...workPermitFilters.customFilters, ...filters];
      dispatch(getWorkPermitFilters(customFiltersList));
      removeData('data-vendor_id');
    } else {
      const customFiltersList = workPermitFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getWorkPermitFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleMaintenanceCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'maintenance_team_id', title: 'Team', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...workPermitFilters.customFilters, ...filters];
      dispatch(getWorkPermitFilters(customFiltersList));
      removeData('data-maintenance_team_id');
    } else {
      const customFiltersList = workPermitFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getWorkPermitFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleNatureChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'nature_work_id', title: 'Nature of Work', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...workPermitFilters.customFilters, ...filters];
      dispatch(getWorkPermitFilters(customFiltersList));
      removeData('data-nature_work_id');
    } else {
      const customFiltersList = workPermitFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getWorkPermitFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  // const handleRadioboxChange = (event) => {
  //   const { checked, value } = event.target;
  //   const filters = [{
  //     key: value, value, label: value, type: 'date',
  //   }];
  //   if (checked) {
  //     const oldCustomFilters = workPermitFilters && workPermitFilters.customFilters ? workPermitFilters.customFilters : [];
  //     const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
  //     setValueArray([...valueArray.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters]);
  //     dispatch(getWorkPermitFilters(customFilters1));
  //   }
  //   setOffset(0);
  //   setPage(0);
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
    const oldCustomFilters = workPermitFilters && workPermitFilters.customFilters
      ? workPermitFilters.customFilters
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
    dispatch(getWorkPermitFilters(customFilters1));
    setOffset(0);
    setPage(0);
  };

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
      const oldCustomFilters = workPermitFilters && workPermitFilters.customFilters
        ? workPermitFilters.customFilters
        : [];
      const filterValues = {
        states:
          workPermitFilters && workPermitFilters.states
            ? workPermitFilters.states
            : [],
        customFilters: [
          oldCustomFilters.length > 0
            ? oldCustomFilters.filter(
              (item) => item.type !== 'date'
                && item.type !== 'customdate'
                && item.type !== 'datearray',
            )
            : '',
          ...filters,
        ],
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
      dispatch(getWorkPermitFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = workPermitFilters && workPermitFilters.customFilters
        ? workPermitFilters.customFilters
        : [];
      const filterValues = {
        states:
          workPermitFilters && workPermitFilters.states
            ? workPermitFilters.states
            : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      dispatch(getWorkPermitFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (value, cf) => {
    const customFiltersList = workPermitFilters.customFilters.filter((item) => item.value !== value);
    dispatch(getWorkPermitFilters(customFiltersList));
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setOffset(0);
    setPage(0);
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  const addAdjustmentWindow = () => {
    if (document.getElementById('workpermitform')) {
      document.getElementById('workpermitform').reset();
    }
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());
    dispatch(getPartsData([]));
    dispatch(getUploadImage([]));
    showAddModal(true);
  };

  /* useEffect(() => {
    if ((addModal || editModal || viewModal) || (workPermitConfig && !workPermitConfig.data && !workPermitConfig.err)) {
      dispatch(getWpConfig(companies, appModels.WPCONFIGURATION));
    }
  }, [addModal, editModal, viewModal]); */

  useEffect(() => {
    if (workPermitConfig && !workPermitConfig.data && !workPermitConfig.err) {
      dispatch(getWpConfig(companies, appModels.WPCONFIGURATION));
    }
  }, []);

  const onRemoveData = (id) => {
    dispatch(getDelete(id, appModels.WORKPERMIT));
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

  const workData = workPermitDetail && workPermitDetail.data && workPermitDetail.data.length
    ? workPermitDetail.data[0]
    : false;

  const openWorkOrder = () => {
    if (workData && workData.order_id && workData.order_id.id) {
      dispatch(getOrderDetail(workData.order_id.id, appModels.ORDER));
      setViewModal(false);
      setAddLink(true);
    }
  };

  const closeWorkOrder = () => {
    if (workData && workData.id) {
      dispatch(getWorkPermitDetails(workData.id, appModels.WORKPERMIT));
    }
    setViewModal(true);
    showAddModal(false);
    setAddLink(false);
  };

  const closeAddWorkOrder = () => {
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
    showAddModal(false);
    showEditModal(false);
    setViewModal(true);
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());
  };

  const stateValuesList = workPermitFilters
    && workPermitFilters.customFilters
    && workPermitFilters.customFilters.length > 0
    ? workPermitFilters.customFilters.filter(
      (item) => item.type === 'inarray',
    )
    : [];
  const maintenanceValuesList = workPermitFilters
    && workPermitFilters.customFilters
    && workPermitFilters.customFilters.length > 0
    ? workPermitFilters.customFilters.filter(
      (item) => item.type === 'inarray' && item.key === 'maintenance_team_id',
    )
    : [];

  const maintenanceTeamValuesList = getColumnArrayById(
    maintenanceValuesList,
    'value',
  );
  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = workPermitFilters
    && workPermitFilters.customFilters
    && workPermitFilters.customFilters.length > 0
    ? workPermitFilters.customFilters
    : [];
  const loading = (userInfo && userInfo.loading)
    || (workPermits && workPermits.loading)
    || workPermitsCountLoading;

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
      const mergeFiltersList = [...workPermitFilters.customFilters, ...filterArray];
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getWorkPermitFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const onClickClear = () => {
    dispatch(getWorkPermitFilters([]));
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
  };

  const searchColumns = [
    'reference',
    'name',
    'state',
    'vendor_id',
    'nature_work_id',
    'maintenance_team_id',
  ];
  const hiddenColumns = [
    'id',
    'requestor_id',
    'maintenance_team_id',
    'type',
    'duration',
  ];
  const advanceSearchColumns = [
    'state',
    'vendor_id',
    'nature_work_id',
    'maintenance_team_id',
  ];

  const columns = useMemo(() => filtersFields.columns, []);
  const data = useMemo(
    () => (workPermits.data ? workPermits.data : [{}]),
    [workPermits.data],
  );
  const initialState = {
    hiddenColumns,
  };

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && workPermitsCount
      && workPermitsCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = workPermitFilters && workPermitFilters.customFilters
        ? queryGeneratorWithUtc(workPermitFilters.customFilters)
        : '';
      dispatch(
        getWorkPermitExport(
          companies,
          appModels.WORKPERMIT,
          workPermitsCount.length,
          offsetValue,
          WorkPermitModule.workPermitApiFields,
          customFiltersQuery,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
          globalFilter,
        ),
      );
    }
  }, [startExport]);

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
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Work Permit',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, workPermitNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Work Permits',
    );
  }

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(workPermits && workPermits.data && workPermits.data.length && workPermits.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(workPermits && workPermits.data && workPermits.data.length && workPermits.data[workPermits.data.length - 1].id);
    }
  }, [workPermits]);

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
      const dept = {
        department_id: true,
      };
      const visiColumns = {
        _check_: true,
        reference: true,
        name: true,
        vendor_id: true,
        state: true,
        planned_start_time: true,
        planned_end_time: true,
        valid_through: true,
        space_id: true,
        equipment_id: true,
        nature_work_id: true,
        requestor_id: false,
        maintenance_team_id: false,
        type: true,
        duration: false,
      };
      if (wpConfig && wpConfig.is_enable_department) {
        setVisibleColumns({
          ...visiColumns,
          ...dept,
        });
      } else {
        setVisibleColumns(visiColumns);
      }
    }
  }, [visibleColumns, workPermitConfig]);

  const onFilterChange = (data) => {
    const fields = [
      'reference',
      'name',
      'vendor_id',
      'state',
      'space_id',
      'equipment_id',
      'nature_work_id',
      'requestor_id',
      'department_id',
    ];
    let query = '"|","|","|","|","|","|","|","|",';

    const oldCustomFilters = workPermitFilters && workPermitFilters.customFilters
      ? workPermitFilters.customFilters
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
        dispatch(getWorkPermitFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getWorkPermitFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [workPermitFilters],
  );

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Work Permit',
        moduleName: 'Work Permit',
        menuName: 'Work Permits',
        link: '/workpermit-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <Box>
      {/* <Header
        headerPath="Work Permit"
        nextPath="Work Permits"
        pathLink="/workpermit-overview"
        headerTabs={tabs.filter((e) => e)}
        activeTab={activeTab}
      /> */}
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        configData={workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false}
        tableData={
          workPermits && workPermits.data && workPermits.data.length
            ? workPermits.data
            : []
        }
        columns={tableColumns}
        filters={filterText}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Work Permits List"
        exportFileName="Work_Permit"
        isModuleDisplayName
        listCount={totalDataCount}
        exportInfo={JSON.parse(JSON.stringify(workPermitsExport))}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: allowedOperations.includes(
            actionCodes['Create Work Permit'],
          ),
          text: 'Add',
          func: () => { addAdjustmentWindow(); },
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={workPermits && workPermits.loading}
        err={workPermits && workPermits.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        removeData={onClickRemoveData}
        moduleCustomHeader={(
          <>
            {customFilters && customFilters.length > 0 ? customFilters.map((cf) => (
              <>
                {(cf.type === 'id' && cf.label && cf.label !== '')
                  ? (
                    <p key={cf.value} className="mr-2 content-inline">
                      <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                        {(cf.type === 'text') && (
                          <span>
                            {decodeURIComponent(cf.name)}
                          </span>
                        )}
                        {(cf.type === 'id') && (
                          <span>
                            {cf.label}
                            {' '}
                            :
                            {' '}
                            {cf.value}
                          </span>
                        )}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ) : ''}
              </>
            )) : ''}
          </>
        )}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Create Work Permit"
          onClose={closeAddWorkOrder}
          imagePath={workPermitBlack}
        />
        <AddWorkPermit closeModal={closeAddWorkOrder} afterReset={afterReset} visibility={addModal} />
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
            workPermitDetail
              && workPermitDetail.data
              && workPermitDetail.data.length > 0
              ? `${'Work Permit'}${' - '}${workPermitDetail.data[0].name
              }${' ('}${workPermitDetail.data[0].reference}${')'}`
              : 'Work Permit'
          }
          imagePath={workPermitBlack}
          onClose={onViewReset}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', workPermits) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', workPermits));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', workPermits) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', workPermits));
          }}
        />
        <WorkPermitDetails
          editId={editId}
          setEditId={setEditId}
          setViewModal={setViewModal}
          openWorkOrder={openWorkOrder}
        />
      </Drawer>

      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addLink}
      >
        <DrawerHeader
          headerName={workData && workData.order_id && workData.order_id.name ? workData.order_id.name : ''}
          imagePath={workPermitBlack}
          onClose={closeWorkOrder}
        />
        <OrderDetail />
      </Drawer>

      <Modal
        size={(deleteInfo && deleteInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Work Permit"
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
              successMessage="Work Permit removed successfully.."
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
    </Box>
  );
};

WorkPermit.defaultProps = {
  match: false,
};

WorkPermit.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default WorkPermit;
