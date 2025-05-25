/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { Button, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import {
  useFilters, usePagination, useSortBy, useTable,
} from 'react-table';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@mui/material/Drawer';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GridPagination,
} from '@mui/x-data-grid-pro';

import assetIcon from '@images/icons/assetDefault.svg';
import {
  Badge,
  ModalFooter,
} from 'reactstrap';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Box } from '@mui/system';
import DrawerHeader from '../commonComponents/drawerHeader';
import {
  generateErrorMessage,
  getActiveTab,
  getAllCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getListOfOperations,
  getPagesCountV2,
  getTabs,
  isArrayValueExists,
  queryGeneratorV1,
  queryGeneratorWithUtc,
  getDynamicTabs,
  debounce,
  getNewDataGridFilterArray,
  formatFilterData, getNextPreview,
} from '../util/appUtils';
import {
  getEquipmentStateText, updateValueInArray, getValidationTypesText, filterStringGenerator,
} from './utils/utils';
import { AddThemeBackgroundColor } from '../themes/theme';
import { assetStatusJson, criticalitiesJson } from '../commonComponents/utils/util';
import { setInitialValues } from '../purchase/purchaseService';
import actionCodes from './data/assetActionCodes.json';
import actionITCodes from './data/assetActionCodesITAsset.json';
import assetsActions from './data/assetsActions.json';
import filtersFields from './data/filtersFields.json';
import { getActionDueDays } from '../auditManagement/utils/utils';
import {
  getAssetDetail,
  getCategoryGroups,
  getEquipmentCount,
  getEquipmentFilters,
  getEquipmentList,
  getEquipmentsExport,
  getQRCodeImage,
  getMaintenanceGroups,
  getVendorGroups,
  resetAddAssetInfo,
  resetUpdateEquipment,
  storeInitialExportData,
  resetInitialExportData,
} from './equipmentService';
import {
  resetImage,
} from '../helpdesk/ticketService';
import CreateAsset from './forms/createAsset';

import CommonGrid from '../commonComponents/commonGrid';
import { AssetColumns } from '../commonComponents/gridColumns';
import { updateHeaderData } from '../core/header/actions';
import { AssetModule } from '../util/field';
import AssetDetailView from './assetDetailsView/assetDetails';
import assetColumns from './data/assetsActions.json';
import assetSideNav from './navbar/navlist.json';

import AiChat from '../shared/aiChat';

import AuthService from '../util/authService';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Equipments = (props) => {
  const {
    isSearch,
    fields,
    onAssetChange,
    isMini,
    isSingle,
    oldAssets,
    afterReset,
    finishText,
    isCommon,
    menuType,
    resetAssets,
    assetCategory,
    assetType,
    isDrawer,
  } = props;
  const limit = (isSearch && isMini) && !isSingle ? 80 : 10;
  const subMenu = 'Assets';
  const tableColumns = AssetColumns();
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [viewId, setViewId] = useState(0);
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [columnFields, setColumns] = useState([
    'name',
    'equipment_seq',
    'category_id',
    'state',
    'location_id',
    'maintenance_team_id',
  ]);
  const [isEdit, setEdit] = useState(false);
  const [addAssetModal, showAddAssetModal] = useState(false);
  const [categoriesGroups, setCategories] = useState([]);
  const [vendorGroups, setVendors] = useState([]);
  const [partnerGroups, setPartners] = useState([]);
  const [statusGroups, setStatusGroups] = useState([]);
  // const [maintenanceTeamValue, setMaintenanceTeamValue] = useState(0);
  const [maintenanceGroups, setMaintenanceGroups] = useState([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [keyword, setKeyword] = useState(false);
  const [openVendor, setOpenVendor] = useState(false);
  const [openManufacturer, setOpenManufacturer] = useState(false);
  // const [checkMaintenanceTeam, setCheckMaintenanceTeam] = useState([]);
  const [openMaintenanceTeam, setOpenMaintenanceTeam] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [rootInfo, setRootInfo] = useState([]);
  const [columnHide, setColumnHide] = useState([]);
  const apiFields = assetColumns && assetColumns.assetListFields;
  const classes = useStyles();
  const [valueArray, setValueArray] = useState([]);
  const [customVariable, setCustomVariable] = useState(false);
  const [editId, setEditId] = useState(false);
  const [globalvalue, setGlobalvalue] = useState('');

  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState(oldAssets);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');
  const [aiFilter, setAiFilter] = useState(false);
  const [aiFilterTemp, setAiFilterTemp] = useState(false);
  const [aiModal, showAIModal] = useState(false);
  const [isClear, setClear] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const selectedData = isSearch && !isMini && oldAssets && oldAssets.length ? oldAssets : false;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    equipmentsCount,
    equipmentsInfo,
    equipmentsCountLoading,
    equipmentsDetails,
    equipmentFilters,
    addAssetInfo,
    partnerGroupsInfo,
    sortedValue,
    maintenanceGroupsInfo,
    updateEquipment,
    categoryGroupsInfo,
    vendorGroupsInfo,
    moveAssetInfo,
    stateChangeInfo,
    createBreakdownInfo,
    operativeInfo,
    equipmentsExportInfo,
    addReadingInfo,
    exportInitialData,
  } = useSelector((state) => state.equipment);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    allowedCompanies,
  } = useSelector((state) => state.setup);
  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const isITAsset = !!(menuType && menuType === 'ITAsset');

  const isCreatable = allowedOperations.includes(
    isITAsset ? actionITCodes['Add IT Asset'] : actionCodes['Add an Asset'],
  );
  const isEditable = allowedOperations.includes(
    isITAsset ? actionITCodes['Edit IT Asset'] : actionCodes['Edit Asset'],
  );
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  const companyData = useMemo(() => ({ data: userCompanies }), [userCompanies]);

  const isQRExport = allowedOperations.includes(actionCodes['Equipment QR Export']);

  const isAIEnabled = allowedOperations.includes(actionCodes['AI Option']);

  const authService = AuthService();

  const onClearHistory = () => {
    authService.storeAiMessages(JSON.stringify([]));
    setClear(Math.random());
  };

  let listHead = 'Assets List :';
  let categoryType = false;

  if (assetType === 'Components') {
    listHead = 'Components List :';
    categoryType = 'Component';
  } else if (assetType === 'Accessories') {
    listHead = 'Accessories List :';
    categoryType = 'Accessory';
  } else if (assetType === 'Equipments') {
    listHead = 'Equipments List :';
    categoryType = 'Equipment';
  }

  const { pinEnableData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (oldAssets) {
      setSelectedRows(oldAssets);
    }
  }, []);

  useEffect(() => {
    if (isDrawer) {
      setOffset(0);
      setPage(0);
    }
  }, [isDrawer]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        name: true,
        equipment_seq: true,
        category_id: true,
        state: true,
        block_id: true,
        floor_id: true,
        location_id: true,
        parent_id: true,
        maintenance_team_id: true,
        equipment_number: false,
        model: false,
        purchase_date: false,
        serial: false,
        brand: false,
        vendor_id: false,
        monitored_by_id: false,
        managed_by_id: false,
        maintained_by_id: false,
        manufacturer_id: false,
        warranty_start_date: false,
        warranty_end_date: false,
        tag_status: false,
        validation_status: false,
        validated_by: false,
        validated_on: false,
        amc_start_date: false,
        amc_end_date: false,
        amc_type: false,
        criticality: true,
        end_of_life: true,
        company_id: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    dispatch(resetInitialExportData({}));
  }, []);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && equipmentsCount
      && equipmentsCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = equipmentFilters && equipmentFilters.customFilters
        ? queryGeneratorWithUtc(updateValueInArray(equipmentFilters.customFilters), false, userInfo.data)
        : '';
      dispatch(
        getEquipmentsExport(
          companies,
          appModels.EQUIPMENT,
          equipmentsCount.length,
          offsetValue,
          AssetModule.assetApiFields,
          customFiltersQuery,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
          isITAsset,
          categoryType,
        ),
      );
      dispatch(getQRCodeImage(userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : false, appModels.MAINTENANCECONFIG));
    }
  }, [startExport]);

  const getTagStatus = (type) => {
    const filteredType = assetsActions.tagStatsus.filter(
      (data) => data.value === type,
    );
    if (filteredType && filteredType.length) {
      return filteredType[0].label;
    }
    return '-';
  };

  const getCriticalStatus = (type) => {
    const filteredType = assetsActions.criticalities.filter(
      (data) => data.value === type,
    );
    if (filteredType && filteredType.length) {
      return filteredType[0].label;
    }
    return '-';
  };

  useEffect(() => {
    if (equipmentsExportInfo && equipmentsExportInfo.data && equipmentsExportInfo.data.length > 0) {
      equipmentsExportInfo.data.map((data) => {
        data.tag_status = getTagStatus(data.tag_status);
        data.criticality = getCriticalStatus(data.criticality);
        data.validation_status = getValidationTypesText(data.validation_status);
        data.state = `${getEquipmentStateText(data.state)}  ${getActionDueDays(data.end_of_life)}`;
        data.is_qr_tagged = data.is_qr_tagged ? 'Yes' : 'No';
        data.is_nfc_tagged = data.is_nfc_tagged ? 'Yes' : 'No';
        data.is_rfid_tagged = data.is_rfid_tagged ? 'Yes' : 'No';
        data.is_virtually_tagged = data.is_virtually_tagged ? 'Yes' : 'No';
      });
    }
  }, [equipmentsExportInfo]);

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  useEffect(() => {
    if (categoryGroupsInfo && categoryGroupsInfo.data) {
      setCategories(categoryGroupsInfo.data);
    }
  }, [categoryGroupsInfo]);

  useEffect(() => {
    if (maintenanceGroupsInfo && maintenanceGroupsInfo.data) {
      setMaintenanceGroups(maintenanceGroupsInfo.data);
    }
  }, [maintenanceGroupsInfo]);

  useEffect(() => {
    if (vendorGroupsInfo && vendorGroupsInfo.data) {
      setVendors(vendorGroupsInfo.data);
    }
  }, [vendorGroupsInfo]);

  useEffect(() => {
    if (vendorGroupsInfo && vendorGroupsInfo.data) {
      setPartners(vendorGroupsInfo.data);
    }
  }, [vendorGroupsInfo]);

  useEffect(() => {
    if ((addAssetInfo && addAssetInfo.data)
      || (updateEquipment && updateEquipment.data)
      || (moveAssetInfo && moveAssetInfo.data)
      || (stateChangeInfo && stateChangeInfo.data)
      || (createBreakdownInfo && createBreakdownInfo.data)
      || (addReadingInfo && addReadingInfo.data)
      || (operativeInfo && operativeInfo.data)) {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters ? queryGeneratorWithUtc(updateValueInArray(equipmentFilters.customFilters), false, userInfo.data) : '';
      if (addAssetInfo && addAssetInfo.data) {
        dispatch(getEquipmentCount(companies, appModels.EQUIPMENT, customFiltersList, isITAsset, categoryType, globalFilter, selectedData, assetCategory));
      }
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, isITAsset, categoryType, globalFilter, false, selectedData, assetCategory));
    }
  }, [addAssetInfo, sortedValue, updateEquipment, moveAssetInfo, stateChangeInfo, createBreakdownInfo, operativeInfo, addReadingInfo]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      setGlobalvalue('');
      dispatch(getEquipmentFilters([]));
      setAiPrompt('');
      setAiFilter(false);
      setAiFilterTemp(false);
      setSelectedRows([]);
      if (resetAssets) {
        resetAssets();
      }
    }
  }, [reload]);

  const onResetAiFilter = () => {
    setAiPrompt('');
    setAiFilter(false);
    setAiFilterTemp(false);
  };

  useEffect(() => {
    if (userInfo && userInfo.data && openMaintenanceTeam) {
      dispatch(
        getMaintenanceGroups(
          companies,
          appModels.EQUIPMENT,
          'maintenance_team_id',
        ),
      );
    }
  }, [userInfo, openMaintenanceTeam]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters ? queryGeneratorWithUtc(updateValueInArray(equipmentFilters.customFilters), false, userInfo.data) : '';
      dispatch(getEquipmentCount(companies, appModels.EQUIPMENT, customFiltersList, isITAsset, categoryType, globalFilter, selectedData, assetCategory, aiFilterTemp));
    }
  }, [userInfo, equipmentFilters.customFilters, sortedValue.sortBy, sortedValue.sortField, globalFilter, assetCategory, aiFilterTemp]);

  useMemo(() => {
    if (userInfo && userInfo.data && sortedValue && sortedValue.sortBy) {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters ? queryGeneratorWithUtc(updateValueInArray(equipmentFilters.customFilters), false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, isITAsset, categoryType, globalFilter, false, selectedData, assetCategory, aiFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, equipmentFilters.customFilters, globalFilter, assetCategory, aiFilter]);

  useEffect(() => {
    if (viewId) {
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    }
  }, [viewId]);

  /* useEffect(() => {
    console.log('Triggering debounced asset change');
    if (selectedRows && isSearch && isMini && !isSingle) {
      onAssetChange(selectedRows);
    }
  }, [JSON.stringify(selectedRows)]); */

  useEffect(() => {
    if (viewId && isSearch && isSingle) {
      const data = equipmentsInfo && equipmentsInfo.data && equipmentsInfo.data.length
        ? equipmentsInfo.data
        : [];
      const selectedEq = data.filter((item) => item.id === viewId);
      onAssetChange(selectedEq && selectedEq.length ? selectedEq[0] : '');
      if (afterReset) afterReset();
    }
  }, [viewId, isSearch, isSingle]);

  /* useEffect(() => {
    if (
      addAssetInfo &&
      addAssetInfo.data &&
      addAssetInfo.data.length &&
      !viewId
    ) {
      dispatch(
        getAssetDetail(addAssetInfo.data[0], appModels.EQUIPMENT, false)
      );
    }
  }, [addAssetInfo]); */

  useEffect(() => {
    if (rootInfo && rootInfo.length && rootInfo[0].value) {
      setViewId(rootInfo[0].value);
      // setViewModal(true);
    }
  }, [rootInfo]);

  const totalDataCount = equipmentsCount && equipmentsCount.length ? equipmentsCount.length : 0;

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
      setColumns(columnFields.filter((item) => item !== value));
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
      const data = equipmentsInfo && equipmentsInfo.data ? equipmentsInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = equipmentsInfo && equipmentsInfo.data ? equipmentsInfo.data : [];
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
    const oldCustomFilters = equipmentFilters && equipmentFilters.customFilters
      ? equipmentFilters.customFilters
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
    dispatch(getEquipmentFilters(customFilters1));
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
      const oldCustomFilters = equipmentFilters && equipmentFilters.customFilters
        ? equipmentFilters.customFilters
        : [];
      const filterValues = [
        ...(oldCustomFilters.length > 0
          ? oldCustomFilters.filter(
            (item) => item.type !== 'date'
                && item.type !== 'customdate'
                && item.type !== 'datearray',
          )
          : ''),
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
      dispatch(getEquipmentFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = equipmentFilters && equipmentFilters.customFilters
        ? equipmentFilters.customFilters
        : [];
      const filterValues = {
        states:
          equipmentFilters && equipmentFilters.states
            ? equipmentFilters.states
            : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getEquipmentFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    const customFiltersList = equipmentFilters && equipmentFilters.customFilters.filter((item) => item.value !== cfValue);
    dispatch(getEquipmentFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...equipmentFilters.customFilters, ...filters];
      dispatch(getEquipmentFilters(customFiltersList));
      removeData('data-state');
    } else {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters.filter((item) => item.value !== value);
      dispatch(getEquipmentFilters(customFiltersList));
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
      const customFiltersList = [...equipmentFilters.customFilters, ...filters];
      dispatch(getEquipmentFilters(customFiltersList));
      removeData('data-maintenance_team_id');
    } else {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getEquipmentFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleAssignmentCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'assignment_status', title: 'Assignment Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...equipmentFilters.customFilters, ...filters];
      dispatch(getEquipmentFilters(customFiltersList));
    } else {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters.filter((item) => item.value !== value);
      dispatch(getEquipmentFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleTagCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'tag_status', title: 'Tag', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...equipmentFilters.customFilters, ...filters];
      dispatch(getEquipmentFilters(customFiltersList));
    } else {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters.filter((item) => item.value !== value);
      dispatch(getEquipmentFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleTagITCheckboxChange = (event) => {
    const { checked, value, name } = event.target;

    if (checked) {
      const filters = [{
        key: value, title: 'Tag IT', value, valueCheck: true, label: name, type: 'boolean',
      }];
      const customFiltersList = [...equipmentFilters.customFilters, ...filters];
      dispatch(getEquipmentFilters(customFiltersList));
    } else {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters.filter((item) => item.value !== value);
      dispatch(getEquipmentFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCategoryChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'category_id', title: 'Category', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...equipmentFilters.customFilters, ...filters];
      dispatch(getEquipmentFilters(customFiltersList));
      removeData('data-category_id');
    } else {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getEquipmentFilters(customFiltersList));
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
      const customFiltersList = [...equipmentFilters.customFilters, ...filters];
      dispatch(getEquipmentFilters(customFiltersList));
      removeData('data-vendor_id');
    } else {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getEquipmentFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCompanyCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'company_id', title: 'Company', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...equipmentFilters.customFilters, ...filters];
      dispatch(getEquipmentFilters(customFiltersList));
      removeData('data-company_id');
    } else {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getEquipmentFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handlePartnerChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'manufacturer_id', title: 'Manufacturer', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...equipmentFilters.customFilters, ...filters];
      dispatch(getEquipmentFilters(customFiltersList));
      removeData('data-manufacturer_id');
    } else {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getEquipmentFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    dispatch(getEquipmentFilters([]));
    setOffset(0);
    setPage(0);
  };

  const cards = [
    {
      id: 1,
      title: 'AMC expired assets',
      description: 'Show the list of AMC expired assets',
    },
    {
      id: 2,
      title: 'Critical assets',
      description: 'Show the critical assets under electrical category',
    },
    {
      id: 3,
      title: 'High value assets',
      description: 'Show assets with purchase value higher than 100000',
    },
  ];

  const stateValuesList = equipmentFilters
      && equipmentFilters.customFilters
      && equipmentFilters.customFilters.length > 0
    ? equipmentFilters.customFilters.filter(
      (item) => item.type === 'inarray' || item.type === 'boolean',
    )
    : [];

  const vendorValuesList = equipmentFilters
      && equipmentFilters.customFilters
      && equipmentFilters.customFilters.length > 0
    ? equipmentFilters.customFilters.filter(
      (item) => item.type === 'inarray' && item.key === 'vendor_id',
    )
    : [];
  const partnerValuesList = equipmentFilters
      && equipmentFilters.customFilters
      && equipmentFilters.customFilters.length > 0
    ? equipmentFilters.customFilters.filter(
      (item) => item.type === 'inarray' && item.key === 'manufacturer_id',
    )
    : [];

  const maintenanceValuesList = equipmentFilters
      && equipmentFilters.customFilters
      && equipmentFilters.customFilters.length > 0
    ? equipmentFilters.customFilters.filter(
      (item) => item.type === 'inarray' && item.key === 'maintenance_team_id',
    )
    : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');
  const vendorValues = getColumnArrayById(vendorValuesList, 'value');
  const partnerValues = getColumnArrayById(partnerValuesList, 'value');
  const maintenanceTeamValuesList = getColumnArrayById(
    maintenanceValuesList,
    'value',
  );

  const dateFilters = equipmentFilters
      && equipmentFilters.customFilters
      && equipmentFilters.customFilters.length > 0
    ? equipmentFilters.customFilters
    : [];
  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading)
    || (equipmentsInfo && equipmentsInfo.loading)
    || equipmentsCountLoading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = equipmentsInfo && equipmentsInfo.err
    ? generateErrorMessage(equipmentsInfo)
    : userErrorMsg;

  const onViewReset = () => {
    if (document.getElementById('assetForm')) {
      document.getElementById('assetForm').reset();
    }
    setOffset(offset);
    setPage(currentPage);
    setViewId(0);
    setViewModal(false);
    setRootInfo([]);
    showAddAssetModal(false);
    setEdit(false);
    dispatch(resetUpdateEquipment());
    dispatch(resetImage());
  };

  const onEditReset = () => {
    setViewId(0);
    setViewModal(true);
    setRootInfo([]);
    showAddAssetModal(false);
    setEdit(false);
    dispatch(resetUpdateEquipment());
    dispatch(setInitialValues(false, false, false, false));
  };

  const onReset = () => {
    showAddAssetModal(false);
    dispatch(resetAddAssetInfo());
  };

  const onCloseUpdate = () => {
    setEdit(false);
    dispatch(resetUpdateEquipment());
  };

  const searchColumns = [
    'name',
    'category_id',
    'equipment_seq',
    'maintenance_team_id',
    'model',
    'maintained_by_id',
    'managed_by_id',
    'validation_status',
    'validated_by',
    'serial',
    'brand',
    'state',
    'vendor_id',
    'manufacturer_id',
  ];

  const hiddenColumns = [
    'id',
    'equipment_number',
    'model',
    'purchase_date',
    'serial',
    'brand',
    'vendor_id',
    'monitored_by_id',
    'managed_by_id',
    'maintained_by_id',
    'manufacturer_id',
    'warranty_start_date',
    'warranty_end_date',
    'tag_status',
    'validation_status',
    'validated_by',
    'validated_on',
    'amc_start_date',
    'amc_end_date',
    'amc_type',
  ];

  const advanceSearchColumns = [
    'category_id',
    'vendor_id',
    'manufacturer_id',
    'state',
    'maintenance_team_id',
  ];

  useEffect(() => {
    if (userInfo && userInfo.data && openCategory) {
      dispatch(getCategoryGroups(companies, appModels.EQUIPMENT));
    }
  }, [userInfo, openCategory]);

  useEffect(() => {
    if (userInfo && userInfo.data && openVendor) {
      dispatch(getVendorGroups(companies, appModels.EQUIPMENT, 'vendor_id'));
    }
  }, [userInfo, openVendor]);

  useEffect(() => {
    if (userInfo && userInfo.data && openMaintenanceTeam) {
      dispatch(
        getMaintenanceGroups(
          companies,
          appModels.EQUIPMENT,
          'maintenance_team_id',
        ),
      );
    }
  }, [userInfo, openMaintenanceTeam]);

  useEffect(() => {
    if (userInfo && userInfo.data && openManufacturer) {
      dispatch(
        getVendorGroups(companies, appModels.EQUIPMENT, 'manufacturer_id'),
      );
    }
  }, [userInfo, openManufacturer]);

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
      setPage(0);
      dispatch(getEquipmentFilters(filterArray));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const onClickClear = () => {
    dispatch(getEquipmentFilters([]));
    setValueArray([]);
    filtersFields.columns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenMaintenanceTeam(false);
    setOpenCategory(false);
    setOpenStatus(false);
    setOpenVendor(false);
    setOpenManufacturer(false);
  };

  const columns = useMemo(() => filtersFields.columns, []);
  const data = useMemo(
    () => (equipmentsInfo.data ? equipmentsInfo.data : [{}]),
    [equipmentsInfo.data],
  );
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
    if (openCategory) {
      setKeyword(' ');
      setOpenStatus(false);
      setOpenVendor(false);
      setOpenManufacturer(false);
    }
  }, [openCategory]);

  useEffect(() => {
    if (openStatus) {
      setKeyword(' ');
      setOpenCategory(false);
      setOpenVendor(false);
      setOpenManufacturer(false);
    }
  }, [openStatus]);

  useEffect(() => {
    if (openVendor) {
      setKeyword(' ');
      setOpenCategory(false);
      setOpenStatus(false);
      setOpenManufacturer(false);
    }
  }, [openVendor]);

  useEffect(() => {
    if (openManufacturer) {
      setKeyword(' ');
      setOpenCategory(false);
      setOpenStatus(false);
      setOpenVendor(false);
    }
  }, [openManufacturer]);

  const advanceSearchjson = {
    category_id: setOpenCategory,
    vendor_id: setOpenVendor,
    manufacturer_id: setOpenManufacturer,
    state: setOpenStatus,
    maintenance_team_id: setOpenMaintenanceTeam,
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

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (detailArrowNext !== '') {
      setViewId(equipmentsInfo && equipmentsInfo.data && equipmentsInfo.data.length && equipmentsInfo.data[0].id);
    }
    if (detailArrowPrev !== '') {
      setViewId(equipmentsInfo && equipmentsInfo.data && equipmentsInfo.data.length && equipmentsInfo.data[equipmentsInfo.data.length - 1].id);
    }
  }, [equipmentsInfo]);

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

  // useEffect(() => {
  //   const payload = {
  //     rows: checkedRows,
  //   };
  //   dispatch(getCheckedRows(payload));
  // }, [checkedRows]);

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
      'equipment_seq',
      'category_id',
      'state',
      'block_id.space_name',
      'floor_id.space_name',
      'location_id',
      'maintenance_team_id',
      'equipment_number',
      'model',
      'serial',
      'brand',
      'vendor_id',
      'monitored_by_id',
      'managed_by_id',
      'maintained_by_id',
      'manufacturer_id',
      'tag_status',
      'validation_status',
      'parent_id',
      'validated_by',
      'amc_type',
      'criticality',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = equipmentFilters && equipmentFilters.customFilters
      ? equipmentFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters && oldCustomFilters.length ? oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    ) : '';

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setGlobalvalue(data?.quickFilterValues?.[0]);
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
          dataItem.value = dataItem?.value ? encodeURIComponent(dataItem.value) : '';
          dataItem.header = label?.headerName;
        });
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'header'),
        );
        const customFilters = [...dateFilters, ...uniqueCustomFilter];
        dispatch(getEquipmentFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getEquipmentFilters(customFilters));
    }
    const filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : [];

    const statusField = filtersData.length > 0 && filtersData.findIndex((item) => item.field === 'state');
    const criticalityField = filtersData.length > 0 && filtersData.findIndex((item) => item.field === 'criticality');
    if ((statusField !== -1 || statusField === 0 || !statusField) && filtersData[statusField] && filtersData[statusField].value) {
      filtersData[statusField].value = assetStatusJson.find((status) => filtersData[statusField].value === status.status).text;
    }
    if ((criticalityField !== -1 || criticalityField === 0 || !criticalityField) && filtersData[criticalityField] && filtersData[criticalityField].value) {
      filtersData[criticalityField].value = criticalitiesJson.find((status) => filtersData[criticalityField].value === status.status).text;
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
    [equipmentFilters],
  );

  useEffect(() => {
    // if (equipmentFilters && equipmentFilters.states) {
    //   setCheckItems(equipmentFilters.states);
    //   setStatusValue(0);
    // }
    if (equipmentFilters && equipmentFilters.customFilters) {
      setCustomFilters(equipmentFilters.customFilters);
      const idExists = isArrayValueExists(
        equipmentFilters.customFilters,
        'type',
        'id',
      );
      if (idExists) {
        const idData = equipmentFilters.customFilters.filter(
          (item) => item.type === 'id',
        );
        const vId = idData && idData.length ? idData[0].value : false;
        if (vId) {
          setViewId(vId);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [equipmentFilters]);

  useEffect(() => {
    if (equipmentFilters && equipmentFilters.customFilters && equipmentFilters.customFilters.length && valueArray && valueArray.length === 0) {
      setValueArray(equipmentFilters.customFilters);
    }
  }, [equipmentFilters]);

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Asset Registry',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, assetSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(assetSideNav && assetSideNav.data && assetSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/asset-overview/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Assets',
    );
  }

  useEffect(() => {
    if (!isDrawer && !isSearch) {
      dispatch(
        updateHeaderData({
          module: 'Asset Registry',
          moduleName: 'Asset Registry',
          menuName: 'Assets',
          link: '/asset-overview/equipments',
          headerTabs: tabs.filter((e) => e),
          activeTab,
          dispatchFunc: () => getEquipmentFilters({}),
        }),
      );
    }
  }, [activeTab]);

  const handleAdd = () => {
    if (selectedRows) {
      onAssetChange(selectedRows);
    }
    if (afterReset) afterReset();
  };

  const handleReset = () => {
    setSelectedRows([]);
    onAssetChange([]);
    if (afterReset) afterReset();
  };

  const count = selectedRows?.length || 0;

  const CustomFooter = () => (
    <div
      className="font-family-tab"
      style={{
        display: 'flex',
        justifyContent: 'space-between', // puts items on left and right
        alignItems: 'center', // vertically center
        padding: '10px 16px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fafafa',
      }}
    >

      <div
        style={{
          fontWeight: 'bold',
          visibility: count > 0 ? 'visible' : 'hidden',
        }}
      >
        {count}
        {' '}
        Equipment
        {' '}
        Selected
      </div>

      <GridPagination />
    </div>
  );

  return (
    <Box>
      <CommonGrid
        className={isSearch && isMini && !isCommon ? 'tickets-table-mini' : 'tickets-table'}
        componentClassName="commonGrid"
        tableData={
  equipmentsInfo?.data?.length
    ? [...equipmentsInfo.data]
    : []
}
        columns={AssetColumns()}
        checkboxSelection={!isSingle}
        pagination
        disableRowSelectionOnClick
        isSearch={isSearch}
        isSingleSelect={isSingle}
        moduleName="Assets List"
        exportFileName="Assets"
        isModuleDisplayName
        listCount={totalDataCount}
        filters={filterText}
        // exportInfo={rows && rows.length && rows.length > 0 ? equipmentsExportInfo : exportInitialData}
        exportInfo={equipmentsExportInfo}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        isQRExport={isQRExport}
        createOption={{
          enable: allowedOperations.includes(
            isITAsset
              ? actionITCodes['Add IT Asset']
              : actionCodes['Add an Asset'],
          ) && !(isSearch && isMini) && !isSingle,
          text: 'Create an Asset',
          func: () => showAddAssetModal(true),
        }}
        showFooter={isSearch && isMini}
        CustomFooter={CustomFooter}
        setRows={setRows}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        rows={rows}
        isAI={isAIEnabled}
        aiFilter={aiFilter}
        aiPrompt={aiPrompt}
        onResetAiFilter={onResetAiFilter}
        setOpenAI={() => { setClear(false); showAIModal(true); }}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={equipmentsInfo && equipmentsInfo.loading}
        err={equipmentsInfo && equipmentsInfo.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        placeholderText="Search Name, Reference Number ..."
        reload={{
          show: true,
          setReload,
          loading,
        }}
        moduleCustomHeader={(
          <>
            {customFilters && customFilters.length > 0 ? customFilters.map((cf) => (
              ((cf.type === 'id' || cf.type === 'text') && cf.label && cf.label !== '')
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                      {(cf.type === 'text') && (
                      <span>
                        {cf.refNumber ? `${decodeURIComponent(cf.name)} ( ${decodeURIComponent(cf.refNumber)} )` : decodeURIComponent(cf.name)}
                      </span>
                      )}
                      {(cf.type === 'id') && (
                      <span>
                        {cf.label}
                        {'  '}
                        :
                        {' '}
                        {decodeURIComponent(cf.value)}
                      </span>
                      )}
                      <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                    </Badge>
                  </p>
                ) : ''
            )) : ''}
          </>
        )}
      />
      {((isSearch && !isMini && !isSingle) || isCommon) && (
      <ModalFooter style={{ bottom: 0, position: 'sticky' }}>
        {(selectedRows && selectedRows.length && selectedRows.length > 0)
          ? (
            <>
              <Button
                onClick={handleReset}
                className="reset-btn-new1 mr-2"
                style={{ width: '100px' }}
                variant="contained"
                size="small"
              >
                Reset
              </Button>
              <Button
                onClick={() => handleAdd()}
                className="submit-btn-auto"
                style={{ width: '200px' }}
                variant="contained"
                size="small"
              >

                {finishText}

              </Button>
            </>
          ) : ''}
      </ModalFooter>
      )}
      {/* <Drawer
          PaperProps={{
            sx: { width: "85%" },
          }}
          anchor="right"
          open={addLink}
        >
          <DrawerHeader
            headerName={!isIncident ? "Raise a Ticket" : "Raise a Incident Ticket"}
            imagePath={ticketIcon}
            onClose={() => onAddReset()}
          />
          <CreateTicketForm
            randomProp={randomValue}
            editIds={editId}
            closeModal={() => setAddLink(false)}
            afterReset={onAddReset}
          />
        </Drawer> */}
      <Drawer
        PaperProps={{
          sx: { width: '30%' },
        }}
        anchor="right"
        open={aiModal}
        transitionDuration={0}
      >
        <DrawerHeader
          headerName="Ask AI (Beta)"
          isAI
          clearHistory={() => onClearHistory()}
          onClose={() => { showAIModal(false); }}
        />
        <Box
          sx={{
            width: '100%',
            height: '60vh',
            overflow: 'auto',
            marginBottom: '30px',
          }}
          className="hidden-scrollbar"
        >
          <AiChat
            setAiPrompt={setAiPrompt}
            onView={() => showAIModal(false)}
            count={totalDataCount}
            moduleName="Equipments"
            cards={cards}
            isClear={isClear}
            model={appModels.EQUIPMENT}
            setAiFilterTemp={setAiFilterTemp}
            setAiFilter={setAiFilter}
          />
        </Box>
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        ModalProps={{
          disableEnforceFocus: true,
          sx: isSearch ? { zIndex: '1300' } : {},
        }}
        anchor="right"
        open={addAssetModal}
      >
        <DrawerHeader
          headerName={isITAsset ? 'Create IT Asset' : 'Create Asset'}
          imagePath={assetIcon}
          onClose={() => onViewReset()}
        />
        <CreateAsset
          // editIds={editId}
          afterReset={() => {
            onReset();
          }}
          closeAddModal={() => {
            showAddAssetModal(false);
          }}
          isITAsset={isITAsset}
          categoryType={categoryType}
          visibility={addAssetModal}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '98%' },
        }}
        anchor="right"
        open={viewModal && !(isSearch && isMini) && !isSingle}
        ModalProps={{
          disableEnforceFocus: true,
          sx: isSearch ? { zIndex: '1300' } : {},
        }}
      >
        <DrawerHeader
          headerName={
            equipmentsDetails
              && equipmentsDetails.data
              && equipmentsDetails.data.length
              && equipmentsDetails.data[0]
              ? equipmentsDetails.data[0].name
              : ''
          }
          imagePath={assetIcon}
          onClose={onViewReset}
          onPrev={() => {
            getNextPreview(viewId, 'Prev', equipmentsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Prev') : setViewId(getNextPreview(viewId, 'Prev', equipmentsInfo));
          }}
          onNext={() => {
            getNextPreview(viewId, 'Next', equipmentsInfo) === 0 ? handlePageChangeDetail(currentPage + 1, 'Next') : setViewId(getNextPreview(viewId, 'Next', equipmentsInfo));
          }}
        />
        <AssetDetailView
          setEditId={setEditId}
          editId={editId}
          isSearch={isSearch}
          setViewModal={setViewModal}
          viewModal={viewModal}
          isITAsset={isITAsset}
          categoryType={categoryType}
        />
      </Drawer>
    </Box>
  );
};

Equipments.propTypes = {
  menuType: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  assetType: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isDrawer: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

Equipments.defaultProps = {
  menuType: false,
  assetType: false,
  isDrawer: false,
};

export default Equipments;
