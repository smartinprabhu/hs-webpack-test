/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';

import Drawer from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import assetTemplate from '@images/templates/asset_template.xlsx';
import {
  Badge,
} from 'reactstrap';
import CommonGrid from '../../commonComponents/commonGridEditable';
import DrawerHeader from '../../commonComponents/drawerHeader';
import { AddThemeBackgroundColor } from '../../themes/theme';

import {
  getEquipmentCount,
  getEquipmentFilters,
  getEquipmentList,
  getEquipmentsExport,
  getQRCodeImage,
  resetCreateSpace,
  getCategoryList,
  getTeamList,
} from '../../assets/equipmentService';
import locationFormModel from '../../assets/formModel/checkoutFormModel';
import AddAsset from '../../assets/formsAdmin/createAsset';
import {
  updateValueInArray,
} from '../../assets/utils/utils';
import { AssetColumns } from '../../commonComponents/gridColumnsEditable';
import actionCodes from '../../assets/data/assetActionCodes.json';
import {
  debounce,
  formatFilterData,
  getAllCompanies,
  getDateAndTimeForDifferentTimeZones,
  queryGeneratorWithUtc,
  valueCheck,
  extractOptionsObject,
  extractOptionsObjectWithName,
  getListOfOperations,
} from '../../util/appUtils';
import fieldsArgs from '../data/importFields.json';
import {
  getSpacesList,
} from '../../helpdesk/ticketService';
import { AdminSetupFacilityModule } from '../../util/field';
import { infoValue } from '../utils/utils';
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
  const apiFields = AdminSetupFacilityModule.assetApiFields;

  const {
    equipmentsCount, equipmentsInfo, equipmentsCountLoading, equipmentsExportInfo, addAssetInfo, sortedValue, equipmentFilters, categoriesInfo, teamsInfo, bulkUploadInfo,
  } = useSelector((state) => state.equipment);
  const {
    updateBulkInfo, createBulkInfo, spacesInfo,
  } = useSelector((state) => state.ticket);
  const totalDataCount = equipmentsCount && equipmentsCount.length ? equipmentsCount.length : 0;
  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const isQRExport = allowedOperations.includes(actionCodes['Equipment QR Export']);

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
          apiFields,
          customFiltersQuery,
          rowselected,
          sortedValue.sortBy,
          sortedValue.sortField,
          false,
          false,
        ),
      );
    }
    dispatch(getQRCodeImage(userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : false, appModels.MAINTENANCECONFIG));
  }, [startExport]);

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
        end_of_life: false,
        tag_status: false,
        validation_status: false,
        validated_by: false,
        validated_on: false,
        amc_start_date: false,
        amc_end_date: false,
        amc_type: false,
        company_id: true,
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
    if (equipmentsInfo && equipmentsInfo.data) {
      setRows(equipmentsInfo.data);
    } else {
      setRows([]);
    }
  }, [equipmentsInfo]);

  useEffect(() => {
    if ((createBulkInfo && createBulkInfo.data) || (updateBulkInfo && updateBulkInfo.data) || (addAssetInfo && addAssetInfo.data) || (bulkUploadInfo && bulkUploadInfo.data)) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getEquipmentCount(companies, appModels.EQUIPMENT, customFiltersList, false, false, globalFilter));
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, false, false, globalFilter, apiFields));
    }
  }, [createBulkInfo, updateBulkInfo, addAssetInfo, bulkUploadInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data)) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getEquipmentCount(companies, appModels.EQUIPMENT, customFiltersList, false, false, globalFilter));
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, false, false, globalFilter, apiFields));
    }
  }, [userInfo, limit, offset, sortedValue.sortBy, sortedValue.sortField, equipmentFilters.customFilters, globalFilter]);

  const onReset = () => {
    dispatch(resetCreateSpace());
  };

  const categorySelection = (paramsEdit) => (
    <EditSelection
      paramsEdit={paramsEdit}
      callData={getCategoryList}
      dropdownsInfo={categoriesInfo}
      dropdownOptions={extractOptionsObjectWithName(categoriesInfo, false, 'path_name')}
      moduleName={appModels.EQUIPMENTCATEGORY}
      optionDisplayName="path_name"
      columns={['id', 'path_name']}
      advanceSearchHeader="Category List"
    />
  );

  const teamSelection = (paramsEdit) => (
    <EditSelection
      paramsEdit={paramsEdit}
      callData={getTeamList}
      dropdownsInfo={teamsInfo}
      dropdownOptions={extractOptionsObject(teamsInfo, paramsEdit)}
      moduleName={appModels.TEAM}
      columns={['id', 'name']}
      advanceSearchHeader="Team List"
    />
  );

  const spaceSelection = (paramsEdit) => (
    <EditSelection
      paramsEdit={paramsEdit}
      callData={getSpacesList}
      dropdownsInfo={spacesInfo}
      dropdownOptions={extractOptionsObjectWithName(spacesInfo, false, 'space_name')}
      moduleName={appModels.SPACE}
      optionDisplayName="space_name"
      columns={['id', 'space_name', 'path_name']}
      advanceSearchHeader="Space List"
    />
  );

  const loadingData = (userInfo && userInfo.loading) || (equipmentsInfo && equipmentsInfo.loading) || (equipmentsCountLoading);

  const tableColumns = AssetColumns(editModeRow, categorySelection, teamSelection, spaceSelection, setErrorMessage);

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
      'validated_by',
      'amc_type',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|","|",';

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
          equipmentsInfo && equipmentsInfo.data && equipmentsInfo.data.length
            ? equipmentsInfo.data
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
        dependencyColumsReload={[equipmentsInfo]}
        moduleName="Equipment List"
        appModelsName={appModels.EQUIPMENT}
        listCount={totalDataCount}
        isQRExport={isQRExport}
        createOption={{
          enable: true,
          text: 'Add',
          func: () => showAddUserModal(true),
        }}
        bulkOption={{
          enable: true,
          text: 'Bulk Upload',
          title: 'Equipment Bulk Upload',
          template: assetTemplate,
          modalTitle: 'Equipment Bulk Upload',
          modalMsg: 'Equipment are uploaded successfully...',
          testFields: fieldsArgs.assetFields,
          uploadFields: fieldsArgs.assetUploadFields,
          fieldLabels: fieldsArgs.assetFieldLabels,
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
        reload={{
          show: true,
          setReload,
          loadingData,
        }}
        exportInfo={equipmentsExportInfo}
        trimFields={['name']}
        exportFileName="Equipment"
        filters={filterText}
        helpertext="helpertextequipment"
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
          headerName={infoValue('createequipment', 'Create Equipment')}
          subTitle="Create Equipment"
          imagePath={false}
          onClose={() => { showAddUserModal(false); }}
        />
        <AddAsset
          afterReset={() => { showAddUserModal(false); onReset(); }}
          isAdmin
        />
      </Drawer>
    </Box>
  );
};

export default AdminSites;
