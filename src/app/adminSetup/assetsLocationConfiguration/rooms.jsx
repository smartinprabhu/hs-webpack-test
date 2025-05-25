/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';

import Drawer from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
} from 'reactstrap';
import locationTemplate from '@images/templates/room_template.xlsx';
import CommonGrid from '../../commonComponents/commonGridEditable';
import DrawerHeader from '../../commonComponents/drawerHeader';
import { AddThemeBackgroundColor } from '../../themes/theme';

import {
  getLocationCount,
  getLocationData,
  resetCreateSpace,
  getEquipmentFilters,
  getLocationExport,
} from '../../assets/equipmentService';
import fieldsArgs from '../data/importFields.json';
import { RoomColumns } from '../../commonComponents/gridColumnsEditable';
import { resetAssetCategory } from '../../preventiveMaintenance/ppmService';
import {
  getAllCompanies,
  debounce,
  formatFilterData,
  queryGeneratorWithUtc,
  valueCheck,
  getDateAndTimeForDifferentTimeZones,
  extractTextObject,
  extractOptionsObjectWithName,
} from '../../util/appUtils';
import AddLocation from './addLocation/addLocation';
import EditSelection from '../../commonComponents/multipleFormFields/editSelection';

const appModels = require('../../util/appModels').default;

const AdminSites = () => {
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const [addUserModal, showAddUserModal] = useState(false);
  const [editModeRow, setEditModeRow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [rowselected, setRowselected] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [globalvalue, setGlobalvalue] = useState('');
  const [reload, setReload] = useState(false);

  const {
    locationCount, locationInfo, locationCountLoading, createSpaceInfo, sortedValue, equipmentFilters, locationExportInfo, buildingsInfo, getFloorsInfo, dropdownLocationInfo, bulkUploadInfo,
  } = useSelector((state) => state.equipment);
  const {
    updateBulkInfo, createBulkInfo,
  } = useSelector((state) => state.ticket);
  const totalDataCount = locationCount && locationCount.length ? locationCount.length : 0;

  useEffect(() => {
    if (locationExportInfo && locationExportInfo.data && locationExportInfo.data.length > 0) {
      locationExportInfo.data.map((data) => {
        if (extractTextObject(data.parent_id?.asset_category_id) === 'Floor') {
          data.parent_id = `${data.parent_id.parent_id?.space_name}/${data.parent_id.space_name}`;
        }
      });
    }
  }, [locationExportInfo]);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && locationCount
      && locationCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = equipmentFilters && equipmentFilters.customFilters
        ? queryGeneratorWithUtc((equipmentFilters.customFilters), false, userInfo.data)
        : '';
      dispatch(
        getLocationExport(companies, appModels.LOCATION, false, 'Room', sortedValue.sortBy, sortedValue.sortField, limit, offsetValue, rowselected, customFiltersQuery, globalFilter),
      );
    }
  }, [startExport]);

  const initialColumns = {
    _check_: true,
    space_name: true,
    name: true,
    sequence_asset_hierarchy: true,
    max_occupancy: true,
    area_sqft: true,
    floor_id: true,
    block_id: true,
    parent_id: true,
  };

  useEffect(() => {
    if (
      (visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0)
    ) {
      setVisibleColumns(initialColumns);
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (editModeRow === true) {
      const myObject = initialColumns;
      Object.keys(myObject).forEach((key) => {
        if (key === 'floor_id' || key === 'block_id' || key === '_check_') {
          myObject[key] = false;
        }
        if (key === 'parent_id') {
          myObject[key] = true;
        }
      });
      setVisibleColumns(myObject);
    }
    if (editModeRow === false) {
      setVisibleColumns(initialColumns);
    }
  }, [editModeRow]);

  useEffect(() => {
    if (reload) {
      dispatch(getEquipmentFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  const handlePageChange = (data) => {
    const { page, pageSize } = data;
    if (pageSize !== limit) {
      setLimit(pageSize);
    }
    const offsetValue = page * pageSize;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (locationInfo && locationInfo.data) {
      setRows(locationInfo.data);
    } else {
      setRows([]);
    }
  }, [locationInfo]);

  useEffect(() => {
    if ((createBulkInfo && createBulkInfo.data) || (updateBulkInfo && updateBulkInfo.data) || (bulkUploadInfo && bulkUploadInfo.data) || (createSpaceInfo && createSpaceInfo.data)) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getLocationCount(companies, appModels.LOCATION, 'Room', customFiltersList, globalFilter));
      dispatch(getLocationData(companies, appModels.LOCATION, false, 'Room', sortedValue.sortBy, sortedValue.sortField, limit, offset, customFiltersList, globalFilter));
    }
  }, [createBulkInfo, updateBulkInfo, createSpaceInfo, bulkUploadInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getLocationCount(companies, appModels.LOCATION, 'Room', customFiltersList, globalFilter));
      dispatch(resetAssetCategory());
    }
  }, [userInfo, equipmentFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getLocationData(companies, appModels.LOCATION, false, 'Room', sortedValue.sortBy, sortedValue.sortField, limit, offset, customFiltersList, globalFilter));
    }
  }, [userInfo, limit, offset, sortedValue.sortBy, sortedValue.sortField, equipmentFilters.customFilters, globalFilter]);

  const onReset = () => {
    dispatch(resetCreateSpace());
  };

  const loadingData = (userInfo && userInfo.loading) || (locationInfo && locationInfo.loading) || (locationCountLoading);

  const floorSelection = (paramsEdit) => (
    <EditSelection
      paramsEdit={paramsEdit}
      callData={getLocationData}
      dropdownsInfo={dropdownLocationInfo}
      dropdownOptions={extractOptionsObjectWithName(dropdownLocationInfo, false, 'space_name')}
      moduleName={appModels.SPACE}
      category="Space"
      optionDisplayName="space_name"
      columns={['id', 'space_name', 'asset_category_id', 'parent_id']}
      advanceSearchHeader="Building/Floor/Wing List"
      advanceSearchFieldName="parent_id"
      isRenderOption
    />
  );

  const tableColumns = RoomColumns(editModeRow, floorSelection, setErrorMessage);

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
      const filterValues = {
        states:
          equipmentFilters && equipmentFilters.states ? equipmentFilters.states : [],
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
      dispatch(getEquipmentFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = equipmentFilters && equipmentFilters.customFilters
        ? equipmentFilters.customFilters
        : [];
      const filterValues = {
        states:
          equipmentFilters && equipmentFilters.states ? equipmentFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getEquipmentFilters(filterValues.customFilters));
    }
    setOffset(0);
    setPage(0);
  };

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'space_name',
      'sequence_asset_hierarchy',
      'max_occupancy',
      'area_sqft',
      'parent_id',
      'block_id',
    ];
    let query = '"|","|","|","|","|",';

    const oldCustomFilters = equipmentFilters && equipmentFilters.customFilters
      ? equipmentFilters.customFilters
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
        dispatch(getEquipmentFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getEquipmentFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [equipmentFilters],
  );

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    const customFiltersList = equipmentFilters && equipmentFilters.customFilters.filter(
      (item) => item.value !== cfValue,
    );
    dispatch(getEquipmentFilters(customFiltersList));
    setOffset(0);
    setPage(0);
  };

  return (
    <Box className="insights-box">
      <CommonGrid
        className="tickets-table"
        tableData={
          locationInfo && locationInfo.data && locationInfo.data.length
            ? locationInfo.data
            : []
        }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setEditModeRow={setEditModeRow}
        editModeRow={editModeRow}
        errorData={errorMessage}
        setRows={setRows}
        loadingData={loadingData}
        dependencyColumsReload={[locationInfo]}
        moduleName="Rooms List"
        deleteFieldsWhenUpdate={['block_id']}
        appModelsName={appModels.LOCATION}
        listCount={totalDataCount}
        createOption={{
          enable: true,
          text: 'Add',
          func: () => showAddUserModal(true),
        }}
        bulkOption={{
          enable: true,
          text: 'Bulk Upload',
          title: 'Room Bulk Upload',
          template: locationTemplate,
          modalTitle: 'Room Bulk Upload',
          modalMsg: 'Rooms are uploaded successfully...',
          testFields: fieldsArgs.spaceFields,
          uploadFields: fieldsArgs.spaceUploadFields,
          fieldLabels: fieldsArgs.spaceFieldLabels,
        }}
        handlePageChange={handlePageChange}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        onFilterChanges={debouncedOnFilterChange}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        setStartExport={setStartExport}
        setRowselected={setRowselected}
        rowselected={rowselected}
        helpertext="helpertextroom"
        reload={{
          show: true,
          setReload,
          loadingData,
        }}
        trimFields={['space_name', 'max_occupancy', 'area_sqft']}
        exportInfo={locationExportInfo}
        exportFileName="Rooms"
        filters={filterText}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        moduleCustomHeader={(
            equipmentFilters && equipmentFilters.customFilters && equipmentFilters.customFilters.length > 0 ? equipmentFilters.customFilters.map((cf) => (
              (cf.field)
                ? (
                  <p key={cf.value} className="mr-2 content-inline">
                    <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                      {(cf.header) && (
                        <span>
                          {decodeURIComponent(cf.header)}
                          {' '}
                          :
                          {' '}
                          {decodeURIComponent(cf.value)}
                        </span>
                      )}
                      {/* <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} /> */}
                    </Badge>
                  </p>
                ) : ''
            )) : ''
        )}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addUserModal}
      >
        <DrawerHeader
          headerName="Create Room"
          subTitle="Create Rooms for the Building/Floor/Wing"
          imagePath={false}
          onClose={() => { showAddUserModal(false); }}
        />
        <AddLocation
          category="Room"
          afterReset={() => { showAddUserModal(false); onReset(); }}
        />
      </Drawer>
    </Box>
  );
};

export default AdminSites;
