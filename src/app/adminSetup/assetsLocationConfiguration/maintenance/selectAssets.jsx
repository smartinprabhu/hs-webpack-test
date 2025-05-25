/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import styles from './StepBasicInfo.module.scss';
import {
 Drawer, Dialog, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material';
import { useWizardState } from '../../../commonComponents/ReactFormWizard/wizard/WizardRoot';
import {
  getAllCompanies, queryGeneratorWithUtc, getDateAndTimeForDifferentTimeZones, formatFilterData, valueCheck, debounce,
} from '../../../util/appUtils';
import {
  storeSelectedSpaces,
  storeModifiedData,
} from '../../setupService';
import DialogHeader from '../../../commonComponents/dialogHeader';
import ScheduleForm from './maintenanceForm';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import CommonGrid from '../../../commonComponents/commonGridEditable';
import { MaintenanceAssetColumns, MaintenanceSpaceColumns } from '../../../commonComponents/gridColumnsEditable';
import {
  getAssetsBasedOnCategoryCount,
  getAssetsBasedOnCategory,
  getEquipmentFilters,
  getAssetsBasedOnCategoryExport,
} from '../../../assets/equipmentService';

const appModels = require('../../../util/appModels').default;

const StepTwoInfo = ({ categoryId, typeValue }) => {
  const dispatch = useDispatch();
  const { wizardState, setWizardState } = useWizardState();
  const [equipmentValue, setEquipmentValue] = useState([]);
  const [spaceValue, setSpaceValue] = useState([]);
  const category = categoryId;
  const type = typeValue;
  const [maintenanceType, setMaintenanceType] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);

  const [addUserModal, showAddUserModal] = useState(false);
  const [editModeRow, setEditModeRow] = useState(false);
  const [rowAllData, setRowAllData] = useState(false);

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
  const [formModal, showFormModal] = useState(false);
  const [filterModalReset, setFilterModalReset] = useState(false);
  const [storeData, setStoreData] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [categoryExportName, setCategory] = useState(false);
  const { selectedSpaces, modifiedData } = useSelector((state) => state.setup);

  const modalName = typeValue === 'e' ? appModels.EQUIPMENT : appModels.LOCATION;
  const categoryName = typeValue === 'e' ? categoryId && categoryId.path_name : categoryId && categoryId.name;
  const categoryIdValue = categoryId && categoryId.id;

  const fields = typeValue === 'e' ? '["id", "name",("location_id",["id","path_name","space_name"])]' : '["id", "space_name","path_name"]';

  const {
    assetCategoryCount, assetCategoryInfo, assetCategoryCountLoading, sortedValue, equipmentFilters, assetCategoryExportInfo,
  } = useSelector((state) => state.equipment);
  const totalDataCount = assetCategoryCount && assetCategoryCount.length ? assetCategoryCount.length : 0;

  const onNext = () => {
    dispatch(storeSelectedSpaces({
      equipmentValue,
      spaceValue,
      category: categoryId,
      type: typeValue,
      maintenanceType,
    }));
  };

  useEffect(() => {
    dispatch(storeSelectedSpaces({
      equipmentValue, spaceValue, category: categoryId, type: typeValue, maintenanceType,
    }));
  }, [maintenanceType, categoryId, typeValue]);

  const getSubTitle = () => {
    let title = '';
    if (type === 'ah') {
        title = (
          <span>
            You have selected
            {' '}
            {selectedSpaces.spaceValue && selectedSpaces.spaceValue.length}
            {' '}
            space(s)  for your schedule. (Space Category -
            {' '}
            {category?.name}
            )
          </span>
      );
    } else {
      title = (
        <span>
          You have selected
          {' '}
          {selectedSpaces.equipmentValue && selectedSpaces.equipmentValue.length}
          {' '}
          piece(s) of equipment for your schedule. (Equipment Category -
          {' '}
          {category?.path_name}
          )
        </span>
      );
    }
    return title;
  };

  useEffect(() => {
    getSubTitle();
  }, [selectedSpaces]);

  useEffect(() => {
    setFilterModalReset(Math.random());
    setEquipmentValue('');
    setSpaceValue('');
  }, [categoryId, typeValue]);

  useEffect(() => {
    dispatch(storeSelectedSpaces({
      equipmentValue, spaceValue, category: categoryId, type: typeValue, maintenanceType,
    }));
  }, [storeData]);

  useEffect(() => {
    setFilterModalReset(Math.random());
    setEquipmentValue('');
    setRowselected([]);
    setSpaceValue('');
  }, [categoryId, typeValue]);

  useEffect(() => {
setCategory(categoryName);
  }, [categoryName]);

  useEffect(() => {
    if (typeValue === 'e') {
      setEquipmentValue(rowAllData);
    } else if (typeValue === 'ah') {
      setSpaceValue(rowAllData);
    }
    setStoreData(Math.random());
  }, [rowAllData]);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && assetCategoryCount
      && assetCategoryCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = equipmentFilters && equipmentFilters.customFilters
        ? queryGeneratorWithUtc((equipmentFilters.customFilters), false, userInfo.data)
        : '';
      dispatch(
        getAssetsBasedOnCategoryExport(companies, modalName, limit, offsetValue, fields, customFiltersQuery, rowselected, sortedValue.sortBy, sortedValue.sortField, typeValue, categoryIdValue, globalFilter),
      );
    }
  }, [startExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      if (typeValue === 'e') {
        setVisibleColumns({
          _check_: true,
          name: true,
          location_id: true,
        });
      } else {
      setVisibleColumns({
        _check_: true,
        space_name: true,
        path_name: true,
      });
    }
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
    if (assetCategoryInfo && assetCategoryInfo.data) {
      setRows(assetCategoryInfo.data);
    } else {
      setRows([]);
    }
  }, [assetCategoryInfo, categoryId]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAssetsBasedOnCategoryCount(companies, modalName, customFiltersList, typeValue, categoryIdValue, globalFilter));
    }
  }, [userInfo, equipmentFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAssetsBasedOnCategory(companies, modalName, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, typeValue, categoryIdValue, globalFilter, fields));
    }
  }, [userInfo, offset, limit, sortedValue.sortBy, sortedValue.sortField, equipmentFilters.customFilters, globalFilter]);

  const onReset = () => {
    dispatch(storeSelectedSpaces({
      equipmentValue: [], spaceValue: [], category, type, maintenanceType: '',
    }));
    dispatch(storeModifiedData([]));
    dispatch(getEquipmentFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    showFormModal(false);
  };

  const handleRowAssetClick = (data) => {
    setEquipmentValue([data]);
    onNext();
  };

  const handleRowSpaceClick = (data) => {
    setSpaceValue([data]);
    onNext();
  };

  const loadingData = (userInfo && userInfo.loading) || (assetCategoryInfo && assetCategoryInfo.loading) || (assetCategoryCountLoading);

  const tableColumns = typeValue === 'e'
    ? MaintenanceAssetColumns(setMaintenanceType, handleRowAssetClick, showFormModal, true)
    : MaintenanceSpaceColumns(setMaintenanceType, handleRowSpaceClick, showFormModal, true);

  const handleRadioboxChange = (event) => {
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
    } else {
      const oldCustomFilters = equipmentFilters && equipmentFilters.customFilters
        ? equipmentFilters.customFilters
        : [];
      const customFilters1 = [
        ...(oldCustomFilters.length > 0
          ? oldCustomFilters.filter(
            (item) => item.type !== 'date',
          )
          : ''),
      ];
      setValueArray([
        ...valueArray.filter(
          (item) => item !== value,
        ),
      ]);
      setFilterText(formatFilterData([], globalvalue));
      dispatch(getEquipmentFilters(customFilters1));
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
      setFilterText(formatFilterData([], globalvalue));
      dispatch(getEquipmentFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = typeValue === 'e' ? [
      'name',
      'location_id',
    ] : [
      'space_name',
      'path_name',
    ];
    let query = '"|",';

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
    <>
      <CommonGrid
        className="tickets-table"
        tableData={
        assetCategoryInfo && assetCategoryInfo.data && assetCategoryInfo.data.length
          ? assetCategoryInfo.data
          : []
      }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setRows={setRows}
        loadingData={loadingData}
        moduleName={`${categoryName} ` + 'List'}
        appModelsName={appModels.LOCATION}
        listCount={totalDataCount}
    // errorData={errorMessage}
        createOption={rowselected && rowselected.length > 0 ? {
          enable: true,
          text: 'Add Schedule',
          func: () => showFormModal(true),
        } : false}
        handlePageChange={handlePageChange}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        filterModalReset={filterModalReset}
        onFilterChanges={debouncedOnFilterChange}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        setStartExport={setStartExport}
        setRowselected={setRowselected}
        setRowAllData={setRowAllData}
        rowselected={rowselected}
        reload={{
          show: true,
          setReload,
          loadingData,
        }}
        ishideEditable
        exportInfo={assetCategoryExportInfo}
        exportFileName="Buildings"
        filters={filterText}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={formModal}
      >
        <DrawerHeader
          headerName="Schedule Planner"
          subTitle={getSubTitle()}
          // onClose={() => { onReset(); setMaintenanceType(false); }}
          onClose={() => { dispatch(storeSelectedSpaces({})); setExtraModal(true); }}
        />
        <ScheduleForm
          afterReset={() => {
            onReset();
          }}
          closeAddModal={() => {
            showFormModal(false);
          }}
          categoryId
          typeValue
          maintenanceType
        />
      </Drawer>
      <Dialog
        maxWidth="lg"
        open={extraModal}
      >
        <DialogHeader title="Warning" imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to leave? Any unsaved changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
            backgroundColor: '#ed5e68',
          }}
            variant="contained"
            onClick={() => { setExtraModal(false); onReset(); setMaintenanceType(false); }}
            autoFocus
          >
            Leave
          </Button>
          <Button
            sx={{
            backgroundColor: '#8388a4',
          }}
            variant="contained"
            onClick={() => setExtraModal(false)}
          >
            Stay
          </Button>
        </DialogActions>
      </Dialog>
    </>
  // <MultipleSearchModal
  //   modelName={modelValue}
  //   afterReset={() => { setExtraModal(false); }}
  //   fieldName={fieldName}
  //   fields={columns}
  //   company={companyValue}
  //   modalName={modalName}
  //   otherFieldName={otherFieldName}
  //   otherFieldValue={otherFieldValue}
  //   setFieldValue={typeValue === 'e' ? setEquipmentValue : setSpaceValue}
  //   headers={headers}
  //   oldValues={oldValues}
  //   onNext={onNext}
  //   setMaintenanceType={setMaintenanceType}
  // />
  );
};

export default StepTwoInfo;
