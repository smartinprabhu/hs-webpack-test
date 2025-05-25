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

import locationTemplate from '@images/templates/floor_template.xlsx';
import { AddThemeBackgroundColor } from '../../themes/theme';
import {
  getBuildings,
  getLocationCount,
  getLocationData,
  resetCreateSpace,
  getEquipmentFilters,
  getLocationExport,
} from '../../assets/equipmentService';
import fieldsArgs from '../data/importFields.json';
import CommonGrid from '../../commonComponents/commonGridEditable';
import DrawerHeader from '../../commonComponents/drawerHeader';
import { FloorColumns } from '../../commonComponents/gridColumnsEditable';
import { resetAssetCategory } from '../../preventiveMaintenance/ppmService';
import {
  extractOptionsObject,
  getAllCompanies,
  debounce,
  formatFilterData,
  generatePassword,
  extractOptionsObjectWithName,
  queryGeneratorWithUtc,
  valueCheck,
  getDateAndTimeForDifferentTimeZones,
} from '../../util/appUtils';
import AddLocation from './addLocation/addLocation';
import locationFormModel from './addLocation/formModel/userFormModel';
import EditSelection from '../../commonComponents/multipleFormFields/editSelection';

const { formField } = locationFormModel;

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

  const [openId, setOpen] = useState('');
  const [buildingOpen, setBuildingOpen] = useState(false);
  const [buildingkeyword, setBuildingKeyword] = useState('');

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
    locationCount, locationInfo, locationCountLoading, createSpaceInfo, sortedValue, buildingsInfo, equipmentFilters, locationExportInfo, bulkUploadInfo,
  } = useSelector((state) => state.equipment);
  const {
    updateBulkInfo, createBulkInfo,
  } = useSelector((state) => state.ticket);
  const totalDataCount = locationCount && locationCount.length ? locationCount.length : 0;

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
        getLocationExport(companies, appModels.LOCATION, false, 'Floor', sortedValue.sortBy, sortedValue.sortField, limit, offsetValue, rowselected, customFiltersQuery, globalFilter),
      );
    }
  }, [startExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        space_name: true,
        sequence_asset_hierarchy: true,
        max_occupancy: true,
        area_sqft: true,
        parent_id: true,
      });
    }
  }, [visibleColumns]);

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
    if (userInfo && userInfo.data && buildingOpen) {
      dispatch(getBuildings(companies, appModels.SPACE, buildingkeyword, ['id', 'space_name'], limit));
    }
  }, [userInfo, buildingkeyword, buildingOpen]);

  useEffect(() => {
    if ((createBulkInfo && createBulkInfo.data) || (updateBulkInfo && updateBulkInfo.data) || (bulkUploadInfo && bulkUploadInfo.data) || (createSpaceInfo && createSpaceInfo.data)) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getLocationCount(companies, appModels.LOCATION, 'Floor', customFiltersList, globalFilter));
      dispatch(getLocationData(companies, appModels.LOCATION, false, 'Floor', sortedValue.sortBy, sortedValue.sortField, limit, offset, customFiltersList, globalFilter));
    }
  }, [createBulkInfo, updateBulkInfo, createSpaceInfo, bulkUploadInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getLocationCount(companies, appModels.LOCATION, 'Floor', customFiltersList, globalFilter));
      dispatch(resetAssetCategory());
    }
  }, [userInfo, equipmentFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getLocationData(companies, appModels.LOCATION, false, 'Floor', sortedValue.sortBy, sortedValue.sortField, limit, offset, customFiltersList, globalFilter));
    }
  }, [userInfo, limit, offset, sortedValue.sortBy, sortedValue.sortField, equipmentFilters.customFilters, globalFilter]);

  const onReset = () => {
    dispatch(resetCreateSpace());
  };

  const buildingOptions = extractOptionsObject(buildingsInfo, 'parent_id');

  const buildingSelection = (paramsEdit) => (
    <EditSelection
      paramsEdit={paramsEdit}
      callData={getBuildings}
      callDataFields={['id', 'space_name']}
      dropdownsInfo={buildingsInfo}
      dropdownOptions={extractOptionsObjectWithName(buildingsInfo, false, 'space_name')}
      moduleName={appModels.SPACE}
      category="Floor"
      optionDisplayName="space_name"
      columns={['id', 'space_name']}
      advanceSearchHeader="Building List"
    />
  );

  /* const buildingSelection = (paramsEdit) => (
    <Autocomplete
      sx={{
        width: '100%',
      }}
      name={formField.BuildingValue.name}
      label={formField.BuildingValue.label}
      open={openId === paramsEdit.row.id}
      isRequired
      size="small"
      onOpen={() => {
        setBuildingOpen(true);
        setOpen(paramsEdit.row.id);
        setBuildingKeyword('');
      }}
      onClose={() => {
        setOpen('');
        setBuildingOpen(false);
        setBuildingKeyword('');
      }}
      value={paramsEdit && paramsEdit.value && paramsEdit.value.id ? paramsEdit.value.space_name : paramsEdit && paramsEdit.value ? paramsEdit.value  : '' }
      loading={buildingsInfo && buildingsInfo.loading && openId === paramsEdit.row.id}
      getOptionSelected={(option, value) => (value.length > 0 ? option.space_name === value.path_name : '')}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
      options={buildingOptions}
      onChange={(event, newValue) => {
        event.stopPropagation();
        paramsEdit.api.setEditCellValue({
          id: paramsEdit.id,
          field: paramsEdit.field,
          value: newValue,
        });
      }}
      apiError={(buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : false}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={(event) => {
            setBuildingKeyword(event.target.value);
          }}
          variant="standard"
          className={((getOldData(params.country_id)) || (params.country_id && params.country_id.id) || (buildingkeyword && buildingkeyword.length > 0))
            ? 'without-padding custom-icons w-100' : 'without-padding custom-icons2 w-100'}
          placeholder="Search & Select"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {buildingsInfo && buildingsInfo.loading && openId === paramsEdit.row.id ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((getOldData(params.country_id)) || (params.country_id && params.country_id.id) || (buildingkeyword && buildingkeyword.length > 0)) && (
                    <IconButton>
                      <IoCloseOutline size={22} fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton>
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
  ); */

  const loadingData = (userInfo && userInfo.loading) || (locationInfo && locationInfo.loading) || (locationCountLoading);

  const tableColumns = FloorColumns(editModeRow, buildingSelection, setErrorMessage);

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
    ];
    let query = '"|","|","|","|",';

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
        moduleName="Floors List"
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
          title: 'Floor Bulk Upload',
          template: locationTemplate,
          modalTitle: 'Floor Bulk Upload',
          modalMsg: 'Floors are uploaded successfully...',
          testFields: fieldsArgs.spaceFields,
          uploadFields: fieldsArgs.spaceUploadFields,
          fieldLabels: fieldsArgs.spaceFieldLabels,
        }}
        trimFields={['space_name', 'max_occupancy', 'area_sqft']}
        defaultFields={{
          name: generatePassword(4),
          company_id: userInfo && userInfo.data && userInfo.data.company
            ? userInfo.data.company.id : '',
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
           helpertext="helpertextfloor"
        rowselected={rowselected}
        reload={{
          show: true,
          setReload,
          loadingData,
        }}
        exportInfo={locationExportInfo}
        exportFileName="Floors"
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
          headerName="Create Floor"
          subTitle="Create Floor for the Building"
          imagePath={false}
          onClose={() => { showAddUserModal(false); }}
        />
        <AddLocation
          category="Floor"
          afterReset={() => { showAddUserModal(false); onReset(); }}
        />
      </Drawer>
    </Box>
  );
};

export default AdminSites;
