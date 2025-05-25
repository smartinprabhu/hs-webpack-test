/* eslint-disable react/jsx-no-bind */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import uniqBy from 'lodash/unionBy';
import {
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import { Tooltip /* , Drawer */ } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* import DrawerHeader from '@shared/drawerHeader'; */

import InventoryBlue from '@images/icons/inventoryBlue.svg';

import Drawer from '@mui/material/Drawer';
import CommonGrid from '../../commonComponents/commonGrid';
import DrawerHeader from '../../commonComponents/drawerHeader';
import { LocationColumns } from '../../commonComponents/gridColumns';

import {
  getAllowedCompanies,
  getArrayFromValuesByItem,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  getListOfModuleOperations,
  getPagesCountV2,
  isArrayValueExists,
  queryGeneratorV1,
  queryGeneratorWithUtc,
  truncate, getNextPreview, formatFilterData,
} from '../../util/appUtils';
import { InventoryModule } from '../../util/field';
import actionCodes from '../data/actionCodes.json';
import {
  geLocationListExport,
  getCheckedRowsLOC, getLocation,
  getLocationFilters,
  getLocationList,
  getLocationsCount,
  resetCreateLocation, resetUpdateLocation,
  setInitialValues,
} from '../inventoryService';
import AddLocation from './addLocation';
import customData from './data/customData.json';
import filtersFields from './data/filtersFields.json';
import LocationDetail from './locationDetail/locationDetail';
import { checklistStateLabel } from '../adjustments/utils/utils';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Location = (props) => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const tableColumns = LocationColumns();
  const [offset, setOffset] = useState(0);
  const [reload, setReload] = useState(false);
  const [currentPage, setPage] = useState(0);
  const [columnFields, setColumns] = useState(customData && customData.listFieldsLocationShows ? customData.listFieldsLocationShows : []);
  const apiFields = customData && customData.listFieldsLocationShows ? customData.listFieldsLocationShows : [];
  const [customFilters, setCustomFilters] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [addModal, showAddModal] = useState(false);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [filterText, setFilterText] = useState('');

  const [locationGroups, setLocationGroups] = useState([]);
  const [scrollDataList, setScrollData] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [offsetValue, setOffsetValue] = useState(0);
  const [columnHide, setColumnHide] = useState([]);

  const [rows, setRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [startExport, setStartExport] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});

  // const [viewModal, showViewModal] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [keyword, setKeyword] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);

  const { sortedValue } = useSelector((state) => state.equipment);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [globalvalue, setGlobalvalue] = useState('');
  const {
    siteDetails,
  } = useSelector((state) => state.site);
  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
  const {
    locationCount, locationListInfo, locationCountLoading,
    locationFilters, locationDetails, filterInitailValues,
    addLocationInfo, updateLocationInfo, locationExportListInfo,
  } = useSelector((state) => state.inventory);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Location']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Location']);
  const isViewable = allowedOperations.includes(actionCodes['View Location']);

  useEffect(() => {
    dispatch(getLocationFilters([]));
  }, []);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = locationFilters.customFilters ? queryGeneratorWithUtc(locationFilters.customFilters) : '';
      dispatch(getLocationsCount(companies, appModels.STOCKLOCATION, customFiltersList, globalFilter));
    }
  }, [JSON.stringify(customFilters), reload, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = locationFilters.customFilters ? queryGeneratorWithUtc(locationFilters.customFilters, false, userInfo.data) : '';
      setCheckRows([]);
      dispatch(getLocationList(companies, appModels.STOCKLOCATION, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [offset, sortedValue.sortBy, sortedValue.sortField, JSON.stringify(customFilters), reload, globalFilter]);

  /* useEffect(() => {
    dispatch(setSorting({ sortBy: false, sortField: false }));
  }, []); */

  useEffect(() => {
    if (addLocationInfo && addLocationInfo.data) {
      const customFiltersList = locationFilters.customFilters ? queryGeneratorWithUtc(locationFilters.customFilters, false, userInfo.data) : '';
      dispatch(getLocationsCount(companies, appModels.STOCKLOCATION, customFiltersList));
      dispatch(getLocationList(companies, appModels.STOCKLOCATION, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [addLocationInfo]);

  useEffect(() => {
    if (updateLocationInfo && updateLocationInfo.data) {
      const customFiltersList = locationFilters.customFilters ? queryGeneratorWithUtc(locationFilters.customFilters, false, userInfo.data) : '';
      dispatch(getLocationList(companies, appModels.STOCKLOCATION, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [updateLocationInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId === 0) {
      const customFiltersList = locationFilters.customFilters ? queryGeneratorWithUtc(locationFilters.customFilters, false, userInfo.data) : '';
      dispatch(getLocationList(companies, appModels.STOCKLOCATION, limit, offset, customFiltersList, sortedValue));
    }
  }, [viewId]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (locationCount && locationCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersQuery = locationFilters && locationFilters.customFilters ? queryGeneratorV1(locationFilters.customFilters) : '';
      dispatch(geLocationListExport(companies, appModels.STOCKLOCATION, locationCount.length, offsetValue, apiFields, sortedValue.sortBy, sortedValue.sortField, customFiltersQuery, rows));
    }
  }, [startExport]);

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    dispatch(getCheckedRowsLOC(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (locationFilters && locationFilters.customFilters) {
      setCustomFilters(locationFilters.customFilters);
      const vid = isArrayValueExists(locationFilters.customFilters, 'type', 'id');
      if (vid) {
        if (viewId !== vid) {
          setViewId(vid);
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [locationFilters]);

  useEffect(() => {
    if (viewId) {
      dispatch(getLocation(viewId, appModels.STOCKLOCATION));
    }
  }, [viewId]);

  /* useEffect(() => {
    if (viewId && updateLocationInfo && updateLocationInfo.data) {
      dispatch(getLocation(viewId, appModels.STOCKLOCATION));
    }
  }, [updateLocationInfo]); */

  useEffect(() => {
    if (locationListInfo && locationListInfo.data && viewId) {
      const arr = [...scrollDataList, ...locationListInfo.data];
      setScrollData([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [locationListInfo, viewId]);

  const totalDataCount = locationCount && locationCount.length ? locationCount.length : 0;

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

  const onClickClear = () => {
    dispatch(getLocationFilters([]));
    setValueArray([]);
    filtersFields.locationColumns.map((column) => {
      const ele = document.getElementById(`data${column.accessor}`);
      if (ele) {
        ele.value = null;
      }
    });
    setOpenLocation(false);
  };

  const searchColumns = InventoryModule.locationSearchColumns;

  const hiddenColumns = InventoryModule.locationHiddenColumns;

  const advanceSearchColumns = InventoryModule.locationAdvanceSearchColumn;

  const columns = useMemo(() => filtersFields.locationColumns, []);
  const data = useMemo(() => (locationListInfo.data ? locationListInfo.data : [{}]), [locationListInfo.data]);
  const initialState = {
    hiddenColumns,
  };

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        display_name: true,
        usage: true,
        company_id: true,
        active: true,
        partner_id: false,
        posx: false,
        posy: false,
        posz: false,
        barcode: false,
        create_date: false,
      });
    }
  }, [visibleColumns]);

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'display_name',
      'usage',
      'company_id',
      'partner_id',
      'posx',

    ];
    let query = '"|","|","|","|",';

    const oldCustomFilters = locationFilters && locationFilters.customFilters
      ? locationFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.length > 0 ? (oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    )) : [];

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
        dispatch(getLocationFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getLocationFilters(customFilters));
    }
    const filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : [];
    setFilterText(formatFilterData(filtersData, data?.quickFilterValues?.[0]));
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
    if (openLocation) {
      setKeyword(' ');
    }
  }, [openLocation]);

  const advanceSearchjson = {
    usage: setOpenLocation,
  };

  const removeData = (id) => {
    const ele = document.getElementById(id);
    ele.value = null;
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const data = locationListInfo && locationListInfo.data ? locationListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = locationListInfo && locationListInfo.data ? locationListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const addAdjustmentWindow = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    showAddModal(true);
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
    const oldCustomFilters = locationFilters && locationFilters.customFilters
      ? locationFilters.customFilters
      : [];

    const customFilters1 = [...(oldCustomFilters.length > 0 ? oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate') : ''), ...filters];
    setValueArray([
      ...valueArray.filter(
        (item) => item.type !== 'date' && item.type !== 'customdate',
      ),
      ...filters,
    ]);
    setFilterText(formatFilterData(customFilters1, globalvalue));
    dispatch(getLocationFilters(customFilters1));

    setOffset(0);
    setPage(0);
  };

  const handleRadioboxChangeold = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = locationFilters && locationFilters.customFilters ? locationFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getLocationFilters(customFilters1));
    }
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
      filters = [{
        key: value, value, label: value, type: 'customdate', start, end,
      }];
    }
    if (start && end) {
      const oldCustomFilters = locationFilters && locationFilters.customFilters ? locationFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      setFilterText(formatFilterData(customFilters1, globalvalue));
      dispatch(getLocationFilters(customFilters1));
    }
    setOffset(0);
    setPage(0);
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
        }
        filterArray.push(filters);
      });
      setOffset(0);
      setPage(0);
      const customFiltersList = [];
      const mergeFiltersList = [...customFilters, ...filterArray];
      const uniquecustomFilter = _.reverse(_.uniqBy(_.reverse([...mergeFiltersList]), 'key'));
      uniquecustomFilter.forEach((item) => {
        if (!item.hasOwnProperty('Header')) {
          customFiltersList.push(item);
        }
      });
      dispatch(getLocationFilters(customFiltersList));
      setValueArray(array);
      removeData(`data-${column.id}`, column);
    }
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList = customFilters.filter((item) => item.value !== cfValue);
    dispatch(getLocationFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'usage', title: 'Location Type', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getLocationFilters(customFiltersList));
      removeData('data-usage');
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getLocationFilters(customFiltersList));
    }
    setOffset(0);
    setPage(0);
  };

  const onAddReset = () => {
    dispatch(resetCreateLocation());
    showAddModal(false);
  };

  const onUpdateReset = () => {
    dispatch(resetUpdateLocation());
    showEditModal(false);
  };

  const stateValuesList = (locationFilters && locationFilters.customFilters && locationFilters.customFilters.length > 0) ? locationFilters.customFilters.filter((item) => item.type === 'inarray') : [];
  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (locationFilters && locationFilters.customFilters && locationFilters.customFilters.length > 0) ? locationFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (locationListInfo && locationListInfo.loading) || (locationCountLoading) || (siteDetails && siteDetails.loading);
  /* const detailName = locationDetails && locationDetails.data && locationDetails.data.length ? getDefaultNoValue(locationDetails.data[0].display_name) : ''; */
  const locationData = locationDetails && locationDetails.data && locationDetails.data.length > 0 ? locationDetails.data[0] : '';

  const drawertitleName = (
    <Tooltip title={locationData.name} placement="right">
      {truncate(locationData.name, 50)}
    </Tooltip>
  );

  const onViewReset = () => {
    setViewModal(false);
    setViewId(false);
  };

  function getUsage(staten) {
    if (customData.locationTypeList.find((dd) => dd.value === staten)) {
      return <span>{customData.locationTypes[staten].label}</span>;
    }
    return '-';
  }

  useEffect(() => {
    if (locationExportListInfo && locationExportListInfo.data && locationExportListInfo.data.length > 0) {
      locationExportListInfo.data.map((data) => {
        data.active = checklistStateLabel(data.active);
        locationExportListInfo.data.push(data);
      });
    }
  }, [locationExportListInfo]);

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
          locationListInfo && locationListInfo.data && locationListInfo.data.length
            ? locationListInfo.data
            : []
        }
        columns={LocationColumns()}
        checkboxSelection
        pagination
        filters={filterText}
        disableRowSelectionOnClick
        moduleName="Locations List"
        exportFileName="Locations"
        listCount={totalDataCount}
        exportInfo={locationExportListInfo}
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
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={onFilterChange}
        loading={locationListInfo && locationListInfo.loading}
        err={locationListInfo && locationListInfo.err}
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
        reload={{
          show: true,
          setReload,
          loading,
        }}
      />
      <Drawer
        PaperProps={{
          sx: { width: '50%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Create Location"
          imagePath={InventoryBlue}
          onClose={onAddReset}
        />
        <AddLocation closeAddModal={() => showAddModal(false)} afterReset={onAddReset} editId={false} />
      </Drawer>

      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal}
      >
        <DrawerHeader
          headerName={locationDetails && (locationDetails.data && locationDetails.data.length > 0 && !locationDetails.loading)
            ? drawertitleName : 'Location'}
          imagePath={InventoryBlue}
          isEditable={(isEditable && (locationDetails && !locationDetails.loading))}
          onClose={() => onViewReset()}
          onEdit={() => { setEditId(locationDetails && (locationDetails.data && locationDetails.data.length > 0) ? locationDetails.data[0].id : false); showEditModal(true); }}
          onPrev={() => { setViewId(getNextPreview(viewId, 'Prev', locationListInfo)); }}
          onNext={() => { setViewId(getNextPreview(viewId, 'Next', locationListInfo)); }}
        />
        <LocationDetail />
      </Drawer>
    </>
  );
};

export default Location;
