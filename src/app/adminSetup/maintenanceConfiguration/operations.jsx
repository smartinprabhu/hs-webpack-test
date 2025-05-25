/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import {
  Button,
  Dialog, DialogContent, DialogContentText,
  Drawer,
} from '@mui/material';
import { Box } from '@mui/system';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CommonGrid from '../../commonComponents/commonGrid';
import DrawerHeader from '../../commonComponents/drawerHeader';
import actionCodes from '../data/actionCodes.json';
import { workorderMaintenanceJson } from '../../commonComponents/utils/util';

import { OperationColumns } from '../../commonComponents/gridColumns';
import {
  activeStepInfo,
  getChecklistData,
  getPartsData,
  getToolsData,
  resetCreateOperation, resetUpdateOperation,
} from '../../preventiveMaintenance/ppmService';
import AddPreventiveOperations from '../../preventiveMaintenance/preventiveOperations/addPreventiveOperations';
import {
  debounce,
  formatFilterData,
  getAllowedCompanies,
  getColumnArrayById,
  getDateAndTimeForDifferentTimeZones,
  queryGeneratorWithUtc,
  valueCheck,
  getListOfModuleOperations,
} from '../../util/appUtils';
import DialogHeader from '../../commonComponents/dialogHeader';
import { AdminSetupModule } from '../../util/field';
import {
  getDeleteOperation,
  getOperationsExport,
  getPPMCount,
  getPPMFilters,
  getPPMList,
  resetDeleteOperation,
} from './maintenanceService';

const appModels = require('../../util/appModels').default;

const Operations = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(0);
  const [reload, setReload] = useState(false);
  const [customFilters, setCustomFilters] = useState([]);
  const [addLink, setAddLink] = useState(false);
  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [editId, setEditId] = useState(false);
  const [editLink, setEditLink] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [valueArray, setValueArray] = useState([]);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [rows, setRows] = useState([]);
  const [globalvalue, setGlobalvalue] = useState('');
  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { siteDetails } = useSelector((state) => state.site);
  // const companies = getAllowedCompanies(userInfo);
  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const {
    addPreventiveOperation, updateOperationInfo,
  } = useSelector((state) => state.ppm);

  const {
    ppmCount, ppmInfo, ppmCountLoading,
    ppmFilters, operationDeleteInfo, operationExportData,
  } = useSelector((state) => state.maintenance);  

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Operation']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Operation']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Operation']);

  const totalDataCount = ppmCount && ppmCount.length ? ppmCount.length : 0;

  const getTagStatus = (type) => {
    const filteredType = assetsActions.tagStatsus.filter(
      (data) => data.value === type,
    );
    if (filteredType && filteredType.length) {
      return filteredType[0].label;
    }
    return '-';
  };

  const CheckType = (val) => {
    let data = '-';

    if (workorderMaintenanceJson) {
      workorderMaintenanceJson.forEach((tData) => {
        if (tData.status === val) {
          data = tData.text;
        }
      });
    }

    return data;
  };

  useEffect(() => {
    if (operationExportData && operationExportData.data && operationExportData.data.length > 0) {
      operationExportData.data.map((data) => {
        data.maintenance_type = CheckType(data.maintenance_type);
      });
    }
  }, [operationExportData]);

  useEffect(() => {
    if (userInfo && userInfo.data && (ppmCount && ppmCount.length) && startExport) {
      const offsetValue = 0;
      const customFiltersList1 = ppmFilters.customFilters
        ? queryGeneratorWithUtc(ppmFilters.customFilters)
        : '';
      dispatch(getOperationsExport(companies, appModels.TASK, ppmCount.length, offsetValue, AdminSetupModule.operationApiFields, false, customFiltersList1, rows, globalFilter));
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
        name: true,
        maintenance_type: true,
        order_duration: true,
        active: true,
        create_date: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getPPMFilters([]));
    }
  }, [reload]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFilters1 = ppmFilters.customFilters ? queryGeneratorWithUtc(ppmFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPPMCount(companies, appModels.TASK, false, customFilters1, globalFilter));
    }
  }, [userInfo, ppmFilters.customFilters, globalFilter]);
  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFilters2 = ppmFilters.customFilters ? queryGeneratorWithUtc(ppmFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPPMList(companies, appModels.TASK, limit, offset, customFilters2, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, ppmFilters.customFilters, globalFilter]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (operationDeleteInfo && operationDeleteInfo.data)) {
      const customFiltersData = ppmFilters.customFilters ? queryGeneratorWithUtc(ppmFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPPMCount(companies, appModels.TASK, false, customFiltersData, globalFilter));
      dispatch(getPPMList(companies, appModels.TASK, limit, offset, customFiltersData, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [operationDeleteInfo]);

  useEffect(() => {
    if (((addPreventiveOperation && addPreventiveOperation.data) || (updateOperationInfo && updateOperationInfo.data))) {
      const customFiltersData = ppmFilters.customFilters ? queryGeneratorWithUtc(ppmFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPPMCount(companies, appModels.TASK, false, customFiltersData, globalFilter));
      dispatch(getPPMList(companies, appModels.TASK, limit, offset, customFiltersData, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addPreventiveOperation, updateOperationInfo]);

  useEffect(() => {
    if (ppmFilters && ppmFilters.customFilters) {
      setCustomFilters(ppmFilters.customFilters);
    }
  }, [ppmFilters]);

  const onRemoveOperation = (id) => {
    showDeleteModal(true);
    dispatch(getDeleteOperation(id, appModels.TASK));
  };

  const onRemoveOperationCancel = () => {
    dispatch(resetDeleteOperation());
    showDeleteModal(false);
  };

  const loading = (userInfo && userInfo.loading) || (ppmInfo && ppmInfo.loading) || (ppmCountLoading);

  const onViewReset = () => {
    setAddLink(false);
    dispatch(activeStepInfo(0));
  };

  const onAddReset = () => {
    if (document.getElementById('operationsForm')) {
      document.getElementById('operationsForm').reset();
    }
    dispatch(activeStepInfo(0));
    dispatch(resetCreateOperation());
    setAddLink(false);
  };

  const openEditModalWindow = (id) => {
    dispatch(activeStepInfo(0));
    setEditId(id);
    setEditLink(true);
  };

  const openAddLink = () => {
    dispatch(activeStepInfo(0));
    if (document.getElementById('operationsForm')) {
      document.getElementById('operationsForm').reset();
    }
    dispatch(getChecklistData([]));
    dispatch(getToolsData([]));
    dispatch(getPartsData([]));
    setAddLink(true);
  };

  const onRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const closeEditModalWindow = () => {
    dispatch(activeStepInfo(0));
    setEditLink(false);
    dispatch(resetUpdateOperation());
    setEditId(false);
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

    const oldCustomFilters = ppmFilters && ppmFilters.customFilters
      ? ppmFilters.customFilters
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
    dispatch(getPPMFilters(customFilters1));
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
      const oldCustomFilters = ppmFilters && ppmFilters.customFilters
        ? ppmFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   ppmFilters && ppmFilters.states ? ppmFilters.states : [],
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
      dispatch(getPPMFilters(filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = ppmFilters && ppmFilters.customFilters
        ? ppmFilters.customFilters
        : [];
      const filterValues = {
        // states:
        //   ppmFilters && ppmFilters.states ? ppmFilters.states : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues.customFilters, globalvalue));
      dispatch(getPPMFilters(filterValues.customFilters));
    }
    setOffset(0);
    setPage(0);
  };

  const tableColumns = OperationColumns(openEditModalWindow, onRemoveOperation, isEditable, isDeleteable);

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'name',
      'maintenance_type',
      'order_duration',
      'active',
    ];
    let query = '"|","|","|",';

    const oldCustomFilters = ppmFilters && ppmFilters.customFilters
      ? ppmFilters.customFilters
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
        dispatch(getPPMFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getPPMFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [ppmFilters],
  );

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  return (
    <Box className="insights-box">
      <CommonGrid
        className="tickets-table"
        tableData={
      ppmInfo && ppmInfo.data && ppmInfo.data.length
        ? ppmInfo.data
        : []
    }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setRows={setRows}
        appModelsName={appModels.TASK}
        loading={loading}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => setAddLink(true),
        }}
        moduleName="Maintenance Operation List"
        listCount={totalDataCount}
        handlePageChange={handlePageChange}
        page={currentpage}
        rowCount={totalDataCount}
        limit={limit}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        setStartExport={setStartExport}
        onFilterChanges={debouncedOnFilterChange}
        filters={filterText}
        exportInfo={operationExportData}
        exportFileName="Maintenance Operation"
        setViewModal={setViewModal}
        setViewId={setViewId}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        ModalProps={{
          disableEnforceFocus: true,
        }}
        anchor="right"
        open={addLink}
      >

        <DrawerHeader
          headerName="Create Maintenance Operation"
          imagePath={false}
          onClose={onViewReset}
        />
        <AddPreventiveOperations
          closeModal={() => { setAddLink(false); }}
          afterReset={() => { onAddReset(); }}
          editId={false}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        ModalProps={{
          disableEnforceFocus: true,
        }}
        anchor="right"
        open={editLink}
      >

        <DrawerHeader
          headerName="Update Maintenance Operation"
          imagePath={false}
          onClose={closeEditModalWindow}
        />
        <AddPreventiveOperations editId={editId} closeModal={closeEditModalWindow} />
      </Drawer>
      <Dialog
        size={(operationDeleteInfo && operationDeleteInfo.data) ? 'sm' : 'lg'}
        fullWidth
        open={deleteModal}
      >
        <DialogHeader
          title="Delete Operation"
          imagePath={false}
          onClose={() => onRemoveOperationCancel()}
          response={operationDeleteInfo}
        />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {operationDeleteInfo && (!operationDeleteInfo.data && !operationDeleteInfo.loading && !operationDeleteInfo.err) && (
              <p className="text-center">
                {`Are you sure, you want to remove ${removeName} ?`}
              </p>
            )}
            {operationDeleteInfo && operationDeleteInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
            )}
            {(operationDeleteInfo && operationDeleteInfo.err) && (
              <SuccessAndErrorFormat response={operationDeleteInfo} />
            )}
            {(operationDeleteInfo && operationDeleteInfo.data) && (
              <SuccessAndErrorFormat
                response={operationDeleteInfo}
                successMessage="Operation removed successfully.."
              />
            )}
            <div className="float-right mt-3">
              {operationDeleteInfo && (!operationDeleteInfo.data || (operationDeleteInfo.data && operationDeleteInfo.data.length < 0)) && (
                <Button
                  size="sm"
                  disabled={operationDeleteInfo && operationDeleteInfo.loading}
                  variant="contained"
                  onClick={() => onRemoveData(removeId)}
                >
                  Confirm
                </Button>
              )}
              {operationDeleteInfo && operationDeleteInfo.data && (
                <Button size="sm" variant="contained" onClick={() => onRemoveOperationCancel()}>Ok</Button>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Operations;
