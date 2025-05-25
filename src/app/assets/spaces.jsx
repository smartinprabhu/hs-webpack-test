/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { Button, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GridPagination,
} from '@mui/x-data-grid-pro';

import {
  Badge,
  ModalFooter,
} from 'reactstrap';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Box } from '@mui/system';
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
import { setInitialValues } from '../purchase/purchaseService';
import actionCodes from './data/assetActionCodes.json';
import actionITCodes from './data/assetActionCodesITAsset.json';
import assetsActions from './data/assetsActions.json';
import filtersFields from './data/filtersFields.json';
import { getActionDueDays } from '../auditManagement/utils/utils';
import {
  getSpacesTableCount,
  getEquipmentFilters,
  getSpacesList,
  getSpaceTableExport,
  resetInitialExportData,
} from './equipmentService';
import {
  resetImage,
} from '../helpdesk/ticketService';

import CommonGrid from '../commonComponents/commonGrid';
import { SpaceColumns } from '../commonComponents/gridColumns';
import { updateHeaderData } from '../core/header/actions';
import { AssetModule } from '../util/field';
import assetSideNav from './navbar/navlist.json';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const TabPanel = (props) => {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            padding: '20px',
          }}
        >
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const Spaces = (props) => {
  const {
    isSearch,
    fields,
    isSingle,
    onAssetChange,
    isMini,
    oldAssets,
    afterReset,
    menuType,
    resetAssets,
    assetCategory,
    assetType,
    isDrawer,
  } = props;
  const limit = 10;
  const subMenu = 'Assets';
  const tableColumns = SpaceColumns();
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
  const [viewModal, setViewModal] = useState(false);
  const [rootInfo, setRootInfo] = useState([]);
  const [columnHide, setColumnHide] = useState([]);
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

  const selectedData = isSearch && !isMini && oldAssets && oldAssets.length ? oldAssets : false;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    spaceTableCount,
    spaceTableInfo,
    spaceTableCountLoading,
    equipmentFilters,
    sortedValue,
    spaceTableExportInfo,
  } = useSelector((state) => state.equipment);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    allowedCompanies,
  } = useSelector((state) => state.setup);
  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const totalDataCount = spaceTableCount && spaceTableCount.length ? spaceTableCount.length : 0;

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
      && spaceTableCount
      && spaceTableCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = equipmentFilters && equipmentFilters.customFilters
        ? queryGeneratorWithUtc(updateValueInArray(equipmentFilters.customFilters), false, userInfo.data)
        : '';
      dispatch(
        getSpaceTableExport(
          companies,
          appModels.SPACE,
          spaceTableCount.length,
          offsetValue,
          AssetModule.assetApiFields,
          customFiltersQuery,
          rows,
          sortedValue.sortBy,
          sortedValue.sortField,
          isITAsset,
          categoryType,
          assetCategory,
        ),
      );
    //  dispatch(getQRCodeImage(userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : false, appModels.MAINTENANCECONFIG));
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
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      setGlobalvalue('');
      dispatch(getEquipmentFilters([]));
      setSelectedRows([]);
      if (resetAssets) {
        resetAssets();
      }
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters ? queryGeneratorWithUtc(updateValueInArray(equipmentFilters.customFilters), false, userInfo.data) : '';
      dispatch(getSpacesTableCount(companies, appModels.SPACE, customFiltersList, isITAsset, categoryType, globalFilter, selectedData, assetCategory));
    }
  }, [userInfo, equipmentFilters.customFilters, sortedValue.sortBy, sortedValue.sortField, globalFilter, assetCategory]);

  useMemo(() => {
    if (userInfo && userInfo.data && sortedValue && sortedValue.sortBy) {
      const customFiltersList = equipmentFilters && equipmentFilters.customFilters ? queryGeneratorWithUtc(updateValueInArray(equipmentFilters.customFilters), false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getSpacesList(companies, appModels.SPACE, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, isITAsset, categoryType, globalFilter, false, selectedData, assetCategory));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, equipmentFilters.customFilters, globalFilter, assetCategory]);

  useEffect(() => {
    if (selectedRows && isSearch && isMini && !isSingle) {
      onAssetChange(selectedRows);
    }
  }, [JSON.stringify(selectedRows)]);

  useEffect(() => {
    if (viewId && isSearch && isSingle) {
      const data = spaceTableInfo && spaceTableInfo.data && spaceTableInfo.data.length
        ? spaceTableInfo.data
        : [];
      const selectedEq = data.filter((item) => item.id === viewId);
      onAssetChange(selectedEq && selectedEq.length ? selectedEq[0] : '');
    }
  }, [viewId, isSearch, isSingle]);

  useEffect(() => {
    if (rootInfo && rootInfo.length && rootInfo[0].value) {
      setViewId(rootInfo[0].value);
      // setViewModal(true);
    }
  }, [rootInfo]);

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
    setSelectedRows([]);
    if (resetAssets) {
      resetAssets();
    }
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
    setSelectedRows([]);
    if (resetAssets) {
      resetAssets();
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
    setSelectedRows([]);
    if (resetAssets) {
      resetAssets();
    }
    setOffset(0);
    setPage(0);
  };

  const loading = (userInfo && userInfo.loading)
    || (spaceTableInfo && spaceTableInfo.loading)
    || spaceTableCountLoading;

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
      'space_name',
      'path_name',
      'asset_category_id',
    ];
    let query = '"|","|",';

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
          dataItem.value = dataItem?.value ? dataItem.value : '';
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

    const customFiltersData = [...dateFilters, ...filtersData];
    setFilterText(formatFilterData(customFiltersData, data?.quickFilterValues?.[0]));
    setSelectedRows([]);
    if (resetAssets) {
      resetAssets();
    }
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
          {count === 1 ? 'Space' : 'Spaces'}
          {' '}
          Selected
        </div>
  
        <GridPagination />
      </div>
    );

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

  return (
    <Box>
      <CommonGrid
        className={isSearch && isMini ? 'tickets-table-mini' : 'tickets-table'}
        componentClassName="commonGrid"
        tableData={
            spaceTableInfo && spaceTableInfo.data && spaceTableInfo.data.length
              ? spaceTableInfo.data
              : []
        }
        columns={SpaceColumns()}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        isSearch={isSearch}
        moduleName="Spaces List"
        exportFileName="Spaces"
        listCount={totalDataCount}
        filters={filterText}
        // exportInfo={rows && rows.length && rows.length > 0 ? equipmentsExportInfo : exportInitialData}
        exportInfo={spaceTableExportInfo}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        isSingleSelect={isSingle}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        isQRExport={isQRExport}
        createOption={{
          enable: false,
        }}
        setRows={setRows}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        rows={rows}
        CustomFooter={CustomFooter}
        showFooter={isSearch && isMini}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={spaceTableInfo && spaceTableInfo.loading}
        err={spaceTableInfo && spaceTableInfo.err}
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
      {isSearch && !isMini && !isSingle && (
      <ModalFooter style={{ bottom: 0, position: 'sticky' }}>
        {(selectedRows && selectedRows.length && selectedRows.length > 0)
          ? (
            <Button
              onClick={() => handleAdd()}
              className=""
              style={{ width: '250px' }}
              variant="contained"
              size="small"
            >
              {' '}
              Add Selected Assets (
              {[...new Map(selectedRows.map((item) => [item.id, item])).values()].length}
              )
            </Button>
          ) : ''}
      </ModalFooter>
      )}

    </Box>
  );
};

Spaces.propTypes = {
  menuType: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  assetType: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isDrawer: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

Spaces.defaultProps = {
  menuType: false,
  assetType: false,
  isDrawer: false,
};

export default Spaces;
