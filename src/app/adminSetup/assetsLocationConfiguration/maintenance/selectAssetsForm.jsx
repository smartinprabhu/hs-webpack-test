/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import styles from './StepBasicInfo.module.scss';
import { useWizardState, useWizardData } from '../../../commonComponents/ReactFormWizard/wizard/WizardRoot';
import {
  getAllCompanies, queryGeneratorWithUtc, getDateAndTimeForDifferentTimeZones, formatFilterData, valueCheck, debounce, getColumnArrayById,
} from '../../../util/appUtils';
import {
  storeSelectedSpaces, storeModifiedData,
} from '../../setupService';
import StepWrapper from '../../../commonComponents/ReactFormWizard/steps/StepWrapper/StepWrapper';
import CommonGrid from '../../../commonComponents/commonGridEditable';
import { MaintenanceAssetColumns, MaintenanceSpaceColumns } from '../../../commonComponents/gridColumnsEditable';
import {
  getAssetsBasedOnCategoryCount,
  getAssetsBasedOnCategory,
  getEquipmentFilters,
  getAssetsBasedOnCategoryExport,
} from '../../../assets/equipmentService';

const appModels = require('../../../util/appModels').default;

const StepTwoInfo = () => {
  const dispatch = useDispatch();
  const { editValue } = useWizardData();
  const { wizardState, setWizardState } = useWizardState();
  const [equipmentValue, setEquipmentValue] = useState('');
  const [spaceValue, setSpaceValue] = useState('');
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    assetCategoryCount, assetCategoryInfo, assetCategoryCountLoading, sortedValue, equipmentFilters, assetCategoryExportInfo,
  } = useSelector((state) => state.equipment);

  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState(assetCategoryInfo && assetCategoryInfo.data && assetCategoryInfo.data.length ? assetCategoryInfo.data : []);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [rowselected, setRowselected] = useState([]);
  const [rowAllData, setRowAllData] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [globalvalue, setGlobalvalue] = useState('');
  const [reload, setReload] = useState(false);
  const [formModal, showFormModal] = useState(false);
  const [filterModalReset, setFilterModalReset] = useState(false);
  const [loadData, setLoadData] = useState(false);

  const { selectedSpaces, modifiedData } = useSelector((state) => state.setup);

  const category = editValue && editValue[0].editId ? modifiedData?.category : selectedSpaces?.category;
  const type = editValue && editValue[0].editId ? modifiedData?.type : selectedSpaces?.type;
  const maintenanceType = selectedSpaces?.maintenanceType;
  const modalName = type === 'e' ? appModels.EQUIPMENT : appModels.LOCATION;
  const categoryName = type === 'e' ? category && category.name : category && category.name;
  const categoryIdValue = category && category.id;
  const equipmentFields = '["id", "name",("location_id",["id","path_name","space_name"])]';
  const spaceFields = '["id", "space_name","path_name"]';
  const fields = type === 'e' ? equipmentFields : spaceFields;
  const tableColumns = type === 'e' ? MaintenanceAssetColumns() : MaintenanceSpaceColumns();

  const totalDataCount = assetCategoryCount && assetCategoryCount.length ? assetCategoryCount.length : 0;

  const bulkJson = {
    bulkJson: {
    category,
    currentStep: 0,
    userPagination: {
        rowsPerPage: limit,
        page: currentPage,
        offset,
    },
  },
};

  const sendData = editValue && editValue[0].editId ? { ...wizardState, ...modifiedData, ...bulkJson } : { ...wizardState, ...selectedSpaces, ...bulkJson };

   const onNext = () => setWizardState(sendData);

  useEffect(() => {
    // This is just an example; you can use this to set the selectionModel dynamically
    if (assetCategoryInfo && assetCategoryInfo.data && assetCategoryInfo.data.length && Object.keys(wizardState).length && editValue && !editValue[0].editId) {
      if (type === 'e') {
        setRowselected(getColumnArrayById(wizardState?.equipmentValue, 'id'));
       } else {
        setRowselected(getColumnArrayById(wizardState?.spaceValue, 'id'));
       }
    }
  }, [wizardState, assetCategoryInfo]);

  useEffect(() => {
    if (assetCategoryInfo && assetCategoryInfo.data && assetCategoryInfo.data.length && Object.keys(modifiedData).length && editValue && editValue[0].editId) {
      if (type === 'e') {
        setRowselected(getColumnArrayById(modifiedData?.equipmentValue, 'id'));
       } else {
        setRowselected(getColumnArrayById(modifiedData?.spaceValue, 'id'));
       }
    }
  }, [modifiedData, rows]);

  useEffect(() => {
    if (type === 'e') {
      if (rowAllData && rowAllData.length) {
      setEquipmentValue(rowAllData);
      if (editValue && editValue[0].editId) {
      dispatch(storeModifiedData({
 ...modifiedData, equipmentValue: rowAllData, category, type,
}));
      } else {
      dispatch(storeSelectedSpaces({
        equipmentValue: rowAllData, spaceValue, category, type, maintenanceType,
      }));
    }
    }
    } else if (type === 'ah') {
      if (rowAllData && rowAllData.length) {
        if (editValue && editValue[0].editId) {
        dispatch(storeModifiedData({
 ...modifiedData, spaceValue: rowAllData, category, type,
}));
        } else {
      dispatch(storeSelectedSpaces({
        equipmentValue, spaceValue: rowAllData, category, type, maintenanceType,
      }));
    }
      setSpaceValue(rowAllData);
    }
    }
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
        getAssetsBasedOnCategoryExport(companies, modalName, limit, offsetValue, fields, customFiltersQuery, rowselected, sortedValue.sortBy, sortedValue.sortField, type, categoryIdValue, globalFilter),
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
    if (assetCategoryInfo && assetCategoryInfo.data && assetCategoryInfo.data.length) {
      setRows(assetCategoryInfo.data);
    } else {
      // setRows([]);
    }
  }, [assetCategoryInfo]);

  const onReset = () => {
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


  useEffect(() => {
    if (editValue && editValue[0].editId && !loadData && Object.keys(modifiedData).length) {
      // const bulkJsonEdit = modifiedData.bulkJson && (modifiedData.bulkJson).replace(/'/g, '"');
      // const bulkjsondata = JSON.parse(bulkJsonEdit);
      // const bulkPagination = bulkjsondata.userPagination;
      // if (modifiedData.state === 'Draft' && bulkjsondata) {
      //   setPage(bulkPagination?.currentPage);
      //   setOffset(bulkPagination?.offset);
      //   setLimit(bulkPagination?.limit);
      // } else {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAssetsBasedOnCategoryCount(companies, modalName, customFiltersList, type, categoryIdValue, globalFilter));
      dispatch(getAssetsBasedOnCategory(companies, modalName, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, type, categoryIdValue, globalFilter, fields));
      //}
      setLoadData(true);
    }
  }, [modifiedData]);

  useEffect(() => {
    if ((equipmentFilters.customFilters && equipmentFilters.customFilters.length) || (globalFilter && globalFilter !== '')) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAssetsBasedOnCategoryCount(companies, modalName, customFiltersList, type, categoryIdValue, globalFilter));
    }
  }, [equipmentFilters.customFilters, globalFilter]);

  useEffect(() => {
    if ((equipmentFilters.customFilters && equipmentFilters.customFilters.length) || (globalFilter && globalFilter !== '')) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getAssetsBasedOnCategory(companies, modalName, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, false, type, categoryIdValue, globalFilter, fields));
    }
  }, [equipmentFilters.customFilters, globalFilter]);

  const loadingData = (userInfo && userInfo.loading) || (assetCategoryInfo && assetCategoryInfo.loading) || (assetCategoryCountLoading);

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
    const fields = type === 'e' ? [
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
    <StepWrapper onNext={onNext}>
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
      // reload={{
      //     show: true,
      //     setReload,
      //     loadingData,
      //   }}
        ishideEditable
        exportInfo={assetCategoryExportInfo}
        exportFileName="Buildings"
        filters={filterText}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
      />
    </StepWrapper>
  // <MultipleSearchModal
  //   modelName={modelValue}
  //   afterReset={() => { setExtraModal(false); }}
  //   fieldName={fieldName}
  //   fields={columns}
  //   company={companyValue}
  //   modalName={modalName}
  //   otherFieldName={otherFieldName}
  //   otherFieldValue={otherFieldValue}
  //   setFieldValue={type === 'e' ? setEquipmentValue : setSpaceValue}
  //   headers={headers}
  //   oldValues={oldValues}
  //   onNext={onNext}
  //   setMaintenanceType={setMaintenanceType}
  // />
  );
};

export default StepTwoInfo;
