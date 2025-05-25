/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Dialog, DialogContent, DialogContentText, Drawer,
} from '@mui/material';
import {
  ModalFooter,
} from 'reactstrap';
import {
  GridPagination,
} from '@mui/x-data-grid-pro';

import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import DrawerHeader from '../../../commonComponents/drawerHeader';
import DialogHeader from '../../../commonComponents/dialogHeader';
import CommonGrid from '../../../commonComponents/commonGridEditable';
import CommonGridNormal from '../../../commonComponents/commonGrid';
import ScheduleInspection from '../../../inspectionSchedule/viewer/addInspectionNew';
import { resetUpdateScheduler } from '../../../preventiveMaintenance/ppmService';
import { InspectionNewColumns } from '../../../commonComponents/gridColumns';
import {
  debounce,
  formatFilterData,
  getAllCompanies,
  getDateAndTimeForDifferentTimeZones,
  queryGeneratorWithUtc,
  valueCheck,
  getListOfOperations,
} from '../../../util/appUtils';
import {
  getArchive,
  resetArchive,
  getInspectionList,
  getInspectionListCount,
  getInspectionListExport,
  getInspectionFilters,
  resetCreateUser,
} from '../../setupService';
import { infoValue } from '../../utils/utils';
import {
  getInspectionSchedulertDetail,
  resetCreateInspection,
} from '../../../inspectionSchedule/inspectionService';
import actionCodes from '../../data/actionCodes.json';

const appModels = require('../../../util/appModels').default;

const InspectionList = ({
  isBulkSelect,
  holidayEnd, 
  holidayStart,
  onScheduleChange,
  resetSchedule,
  finishText,
  oldSchedules,
  afterReset,
}) => {
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { updatePpmSchedulerInfo } = useSelector((state) => state.ppm);
  const { addInspectionScheduleInfo } = useSelector((state) => state.inspection);
  const companies = getAllCompanies(userInfo, userRoles);

  const [limit, setLimit] = useState(isBulkSelect ? 80 : 10);
  const [rows, setRows] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);

  const [visibleColumns, setVisibleColumns] = useState({});
  const [viewId, setViewId] = useState(0);
  const [viewModal, setViewModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [rowselected, setRowselected] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [valueArray, setValueArray] = useState([]);
  const [globalvalue, setGlobalvalue] = useState('');
  const [reload, setReload] = useState(false);
  const [addPPMModal, showAddPPMModal] = useState(false);
  const [formModal, showFormModal] = useState(false);
  const [filterModalReset, setFilterModalReset] = useState(false);
  const { modifiedData } = useSelector((state) => state.setup);

  const [selectedRows, setSelectedRows] = useState(oldSchedules);

  const [removeId, setRemoveId] = useState('');
  const [removeName, setRemoveName] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [editId, setEditId] = useState('');
  const [editModal, showEditModal] = useState(false);
  const [listTrigger, setListTrigger] = useState(false);

  const modalName = 'hx.inspection_checklist';
  const fields = '["id","asset_number", "category_type","commences_on","ends_on","create_date","starts_at","duration","description",("group_id",["id","name"]),("check_list_id",["id","name"]),("maintenance_team_id",["id","name"]),("equipment_id",["id","name"]),("space_id",["id","space_name"]),("task_id",["id","name"]),("company_id",["id","name"])]';

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const {
    adminInspectionCount, adminInspectionList, adminInspectionCountLoading, adminInspectionExport,
    archiveInfo, inspectionFilters,
  } = useSelector((state) => state.setup);

  const {
    inspectionSchedulerDetail,
  } = useSelector((state) => state.inspection);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const isAdd = allowedOperations.includes(actionCodes['Add Inspection Schedule']);
  const isEdit = allowedOperations.includes(actionCodes['Edit Inspection Schedule']);
  const isDelete = allowedOperations.includes(actionCodes['Delete Inspection Schedule']);

  const totalDataCount = adminInspectionCount && adminInspectionCount.length ? adminInspectionCount.length : 0;

  useEffect(() => {
    if (oldSchedules) {
      setSelectedRows(oldSchedules);
    }
  }, []);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && adminInspectionCount
      && adminInspectionCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = inspectionFilters && inspectionFilters.customFilters
        ? queryGeneratorWithUtc((inspectionFilters.customFilters), 'create_date', userInfo.data)
        : '';
      dispatch(
        getInspectionListExport(companies, modalName, adminInspectionCount.length, offsetValue, fields, customFiltersQuery, rowselected, sortedValue.sortBy, sortedValue.sortField, globalFilter),
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
        group_id: true,
        commences_on: true,
        space_id: true,
        equipment_id: true,
        check_list_id: true,
        starts_at: true,
        duration: true,
        maintenance_team_id: true,
        ends_on: true,
        asset_number: true,
        category_type: true,
        task_id: true,
        company_id: false,
        create_date: false,
      });
    }
  }, [visibleColumns]);

  function loadThisMonth() {
    const filters = [
      {
        key: 'This month',
        value: 'This month',
        label: 'This month',
        type: 'date',
        header: 'Date Filter',
        id: 'This month',
      },
    ];

    setValueArray(filters);
    setCustomVariable('This month');
    setFilterText(formatFilterData(filters, globalvalue));
    dispatch(getInspectionFilters(filters));
    setListTrigger(true);
  }

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(getInspectionFilters([]));
      setListTrigger(Math.random());
      if (resetSchedule) {
        resetSchedule();
      }
      setSelectedRows([]);
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

  const handlePageChangeNormal = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  useEffect(() => {
    if (adminInspectionList && adminInspectionList.data) {
      setRows(adminInspectionList.data);
    } else {
      setRows([]);
    }
  }, [adminInspectionList]);

  useEffect(() => {
    if (userInfo && userInfo.data && !editModal && !addPPMModal) {
      const customFiltersList = inspectionFilters.customFilters ? queryGeneratorWithUtc(inspectionFilters.customFilters, 'create_date', userInfo.data) : '';
      dispatch(getInspectionListCount(companies, modalName, customFiltersList, globalFilter, isBulkSelect, holidayStart, holidayEnd));
    }
  }, [listTrigger, userInfo, inspectionFilters.customFilters, globalFilter]);

  useEffect(() => {
    if ((addInspectionScheduleInfo && addInspectionScheduleInfo.data) || (archiveInfo && archiveInfo.data)) {
      dispatch(getInspectionListCount(companies, modalName, customFiltersList, globalFilter));
    }
    if ((updatePpmSchedulerInfo && updatePpmSchedulerInfo.data) || (addInspectionScheduleInfo && addInspectionScheduleInfo.data) || (archiveInfo && archiveInfo.data)) {
      dispatch(getInspectionList(companies, modalName, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, fields));
    }
  }, [updatePpmSchedulerInfo, addInspectionScheduleInfo, archiveInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && !editModal && !addPPMModal) {
      const customFiltersList = inspectionFilters.customFilters ? queryGeneratorWithUtc(inspectionFilters.customFilters, 'create_date', userInfo.data) : '';
      dispatch(getInspectionList(companies, modalName, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, fields, isBulkSelect, holidayStart, holidayEnd));
    }
  }, [listTrigger, userInfo, offset, limit, sortedValue.sortBy, sortedValue.sortField, inspectionFilters.customFilters, globalFilter]);

  const loadingData = (userInfo && userInfo.loading) || (adminInspectionList && adminInspectionList.loading) || (adminInspectionCountLoading);
  const inspDeata = inspectionSchedulerDetail && inspectionSchedulerDetail.data && inspectionSchedulerDetail.data.length ? inspectionSchedulerDetail.data[0] : false;

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
    console.log(filters);
    if (checked) {
      const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters
        ? inspectionFilters.customFilters
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
      dispatch(getInspectionFilters(customFilters1));
    } else {
      const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters
        ? inspectionFilters.customFilters
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
      dispatch(getInspectionFilters(customFilters1));
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
      const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters
        ? inspectionFilters.customFilters
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
      dispatch(getInspectionFilters(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters
        ? inspectionFilters.customFilters
        : [];
      const filterValues = {
        states:
        inspectionFilters && inspectionFilters.states
          ? inspectionFilters.states
          : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData([], globalvalue));
      dispatch(getInspectionFilters(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fieldsList = [
      'category_type',
      'group_id',
      'maintenance_team_id',
      'check_list_id',
      'equipment_id',
      'space_id',
      'asset_number',
      'task_id',
    ];
    let query = '"|","|","|","|","|","|","|",';

    const oldCustomFilters = inspectionFilters && inspectionFilters.customFilters
      ? inspectionFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setGlobalvalue(data?.quickFilterValues?.[0]);
      fieldsList.filter((field) => {
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
        dispatch(getInspectionFilters(customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getInspectionFilters(customFilters));
    }
    setFilterText(formatFilterData(data?.items, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [inspectionFilters],
  );

  const isEditable = isEdit && !isBulkSelect;
  const isDeletable = isDelete && !isBulkSelect;

  const onRemoveDataCancel = () => {
    dispatch(resetArchive());
    showDeleteModal(false);
  };

  const onClickRemoveData = (id, name) => {
    dispatch(resetArchive());
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const onRemoveData = (id) => {
    const postData = {
      active: false,
    };

    dispatch(getArchive(id, modalName, postData));
  };

  const onClickEditData = (id) => {
    dispatch(resetCreateUser());
    dispatch(resetCreateInspection());
    dispatch(resetUpdateScheduler());
    dispatch(getInspectionSchedulertDetail(id, modalName));
    setEditId(id);
    showEditModal(true);
  };

  const onAdd = () => {
    dispatch(resetCreateInspection());
    dispatch(resetCreateUser());
    dispatch(resetUpdateScheduler());
    showAddPPMModal(true);
  };

  const onCloseForm = () => {
    showEditModal(false);
    showAddPPMModal(false);
    dispatch(resetCreateUser());
    dispatch(resetCreateInspection());
    dispatch(resetUpdateScheduler());
    setEditId(false);
  };

  const tableColumns = InspectionNewColumns(onClickEditData, onClickRemoveData, isEditable, isDeletable);

  const handleAdd = () => {
    if (selectedRows) {
      onScheduleChange(selectedRows);
    }
    if (afterReset) afterReset();
  };

  const handleReset = () => {
    setSelectedRows([]);
    onScheduleChange([]);
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
        {count > 0 ? 'Schedules' : 'Schedule'}
        {' '}
        Selected
      </div>

      <GridPagination />
    </div>
  );

  return (
    <>
      {!isBulkSelect && (
      <CommonGrid
        className="tickets-table"
        tableData={
        adminInspectionList && adminInspectionList.data && adminInspectionList.data.length
          ? adminInspectionList.data
          : []
        }
        componentClassName="commonGrid"
        rows={rows}
        isSearch={isBulkSelect}
        isSingleSelect={false}
        dataLoading={adminInspectionList.loading}
        columns={tableColumns}
        setRows={setRows}
        loadingData={loadingData}
        moduleName="Daily Inspections List"
        moduleDescription="(Inspections can be edited or deleted if the current date is before the 'Ends On' date or if it’s not set.)"
        appModelsName={modalName}
        listCount={totalDataCount}
        // errorData={errorMessage}
        createOption={{
          enable: !isBulkSelect && isAdd,
          text: 'Add',
          func: () => onAdd(),
        }}
        showFooter={isBulkSelect}
        CustomFooter={CustomFooter}
        handlePageChange={handlePageChange}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        filterModalReset={filterModalReset}
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
        ishideEditable
        exportInfo={adminInspectionExport}
        exportFileName="Daily Inspections List"
        filters={filterText}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
      />
      )}
      {isBulkSelect && (
      <CommonGridNormal
        className="tickets-table"
        tableData={
        adminInspectionList && adminInspectionList.data && adminInspectionList.data.length
          ? adminInspectionList.data
          : []
        }
        componentClassName="commonGrid"
        rows={rows}
        isSearch={isBulkSelect}
        isSingleSelect={false}
        dataLoading={adminInspectionList.loading}
        columns={tableColumns}
        setRows={setRows}
        loadingData={loadingData}
        moduleName="Daily Inspections List"
        moduleDescription="(Inspections can be edited or deleted if the current date is before the 'Ends On' date or if it’s not set.)"
        appModelsName={modalName}
        listCount={totalDataCount}
        // errorData={errorMessage}
        createOption={{
          enable: !isBulkSelect && isAdd,
          text: 'Add',
          func: () => onAdd(),
        }}
        showFooter={isBulkSelect}
        CustomFooter={CustomFooter}
        handlePageChange={handlePageChangeNormal}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        setViewModal={setViewModal}
        setViewId={setViewId}
        filterModalReset={filterModalReset}
        onFilterChanges={debouncedOnFilterChange}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        setStartExport={setStartExport}
        setRowselected={setRowselected}
        loading={adminInspectionList && adminInspectionList.loading}
        err={adminInspectionList && adminInspectionList.err}
        rowselected={rowselected}
        reload={{
          show: true,
          setReload,
          loadingData,
        }}
        ishideEditable
        exportInfo={adminInspectionExport}
        exportFileName="Daily Inspections List"
        filters={filterText}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
      />
      )}
      {isBulkSelect && (
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
      <Dialog
        PaperProps={{ style: { width: '600px', maxWidth: '600px' } }}
        open={deleteModal}
      >
        <DialogHeader
          title={`Remove ${removeName}`}
          imagePath={false}
          onClose={() => onRemoveDataCancel()}
          response={archiveInfo}
        />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {archiveInfo && (!archiveInfo.data && !archiveInfo.loading && !archiveInfo.err) && (
            <p className="text-center font-family-tab">
              {`Are you sure, you want to remove ${removeName} ?`}
            </p>
            )}
            {archiveInfo && archiveInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(archiveInfo && archiveInfo.err) && (
            <SuccessAndErrorFormat response={archiveInfo} />
            )}
            {(archiveInfo && archiveInfo.data) && (
            <SuccessAndErrorFormat
              response={archiveInfo}
              successMessage={`${removeName} has been removed.`}
            />
            )}
            <div className="text-right mt-3">
              {archiveInfo && !archiveInfo.data && (
              <Button
                size="sm"
                disabled={archiveInfo && archiveInfo.loading}
                variant="contained"
                onClick={() => onRemoveData(removeId)}
              >
                Confirm
              </Button>
              )}
              {archiveInfo && archiveInfo.data && (
              <Button size="sm" variant="contained" onClick={() => onRemoveDataCancel()}>Ok</Button>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addPPMModal}
      >
        <DrawerHeader
          headerName={infoValue('create_inspection_schedule', 'Create Inspection Schedule')}
          subTitle="Create a schedule to inspect assets and equipment regularly, minimizing failures and extending asset life."
          imagePath={false}
          onClose={() => onCloseForm()}
        />
        <ScheduleInspection editId={false} onClose={() => onCloseForm()} />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editModal}
      >
        <DrawerHeader
          headerName="Update Inspection Schedule"
          subTitle="Update a schedule to inspect assets and equipment regularly, minimizing failures and extending asset life."
          imagePath={false}
          onClose={() => onCloseForm()}
        />
        <ScheduleInspection editId={editId} editData={inspDeata} onClose={() => onCloseForm()} />
      </Drawer>
    </>
  );
};

export default InspectionList;
