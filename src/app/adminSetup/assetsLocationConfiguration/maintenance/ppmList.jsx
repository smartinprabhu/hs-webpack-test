import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Dialog, DialogContent, DialogContentText, Drawer,
} from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import DrawerHeader from '../../../commonComponents/drawerHeader';
import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  getEquipmentFilters,
} from '../../../assets/equipmentService';
import CommonGrid from '../../../commonComponents/commonGridEditable';
import SchedulePPM from '../../../preventiveMaintenance/viewer/addPPMsNew';
import { resetBulkPreventive, resetUpdateScheduler } from '../../../preventiveMaintenance/ppmService';
import { PPMNewColumns } from '../../../commonComponents/gridColumns';
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
  getPPMList,
  getPPMListCount,
  getPPMListExport,
} from '../../setupService';
import { infoValue } from '../../utils/utils';
import {
  getPPMDetail,
} from '../../../inspectionSchedule/inspectionService';
import actionCodes from '../../data/actionCodes.json';

const appModels = require('../../../util/appModels').default;

const PpmList = () => {
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { bulkPPMCreate, updatePpmSchedulerInfo } = useSelector((state) => state.ppm);
  const companies = getAllCompanies(userInfo, userRoles);

  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);

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
  const [addPPMModal, showAddPPMModal] = useState(false);
  const [formModal, showFormModal] = useState(false);
  const [filterModalReset, setFilterModalReset] = useState(false);
  const { modifiedData } = useSelector((state) => state.setup);

  const [removeId, setRemoveId] = useState('');
  const [removeName, setRemoveName] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const [editId, setEditId] = useState('');
  const [editModal, showEditModal] = useState(false);

  const modalName = 'ppm.scheduler_week';
  const fields = '["id","state", "category_type","name","ends_on","starts_on","create_date",("schedule_period_id",["id","name"]),("maintenance_team_id",["id","name"]),("equipment_id",["id","name"]),"week",("space_id",["id","space_name"]),("company_id",["id","name"]),("task_id",["id","name"]),"description","performed_by",("order_id",["id","name","state"])]';

  const {
    sortedValue, equipmentFilters,
  } = useSelector((state) => state.equipment);
  const {
    adminPPMCount, adminPPMList, adminPPMCountLoading, adminPPMExport,
    archiveInfo,
  } = useSelector((state) => state.setup);

  const {
    ppmWeekInfo,
  } = useSelector((state) => state.inspection);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const isAdd = allowedOperations.includes(actionCodes['Add PPM Schedule']);
  const isEdit = allowedOperations.includes(actionCodes['Edit PPM Schedule']);
  const isDelete = allowedOperations.includes(actionCodes['Delete PPM Schedule']);

  const totalDataCount = adminPPMCount && adminPPMCount.length ? adminPPMCount.length : 0;

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && adminPPMCount
      && adminPPMCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = equipmentFilters && equipmentFilters.customFilters
        ? queryGeneratorWithUtc((equipmentFilters.customFilters), false, userInfo.data)
        : '';
      dispatch(
        getPPMListExport(companies, modalName, adminPPMCount.length, offsetValue, fields, customFiltersQuery, rowselected, sortedValue.sortBy, sortedValue.sortField, globalFilter),
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
        name: true,
        starts_on: true,
        ends_on: true,
        state: true,
        category_type: true,
        equipment_id: true,
        space_id: true,
        schedule_period_id: true,
        week: true,
        maintenance_team_id: true,
        task_id: true,
        company_id: false,
        performed_by: false,
        order_id: false,
        create_date: false,
        description: false,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, []);

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
    if (adminPPMList && adminPPMList.data) {
      setRows(adminPPMList.data);
    } else {
      setRows([]);
    }
  }, [adminPPMList]);

  useEffect(() => {
    if (userInfo && userInfo.data && !editModal && !addPPMModal) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPPMListCount(companies, modalName, customFiltersList, globalFilter));
    }
  }, [userInfo, equipmentFilters.customFilters, globalFilter]);

  useEffect(() => {
    if ((bulkPPMCreate && bulkPPMCreate.data) || (archiveInfo && archiveInfo.data)) {
      dispatch(getPPMListCount(companies, modalName, customFiltersList, globalFilter));
    }
    if ((updatePpmSchedulerInfo && updatePpmSchedulerInfo.data) || (archiveInfo && archiveInfo.data)) {
      dispatch(getPPMList(companies, modalName, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, fields));
    }
  }, [updatePpmSchedulerInfo, bulkPPMCreate, archiveInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && !editModal && !addPPMModal) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getPPMList(companies, modalName, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, fields));
    }
  }, [userInfo, offset, limit, sortedValue.sortBy, sortedValue.sortField, equipmentFilters.customFilters, globalFilter]);

  const loadingData = (userInfo && userInfo.loading) || (adminPPMList && adminPPMList.loading) || (adminPPMCountLoading);
  const inspDeata = ppmWeekInfo && ppmWeekInfo.data && ppmWeekInfo.data.data
  && ppmWeekInfo.data.data.length ? ppmWeekInfo.data.data[0] : false;

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
    const fieldsList = [
      'name',
      'category_type',
      'state',
      'schedule_period_id',
      'maintenance_team_id',
      'equipment_id',
      'week',
      'space_id',
      'task_id',
      'performed_by',
      'order_id',
    ];
    let query = '"|","|","|","|","|","|","|","|","|","|",';

    const oldCustomFilters = equipmentFilters && equipmentFilters.customFilters
      ? equipmentFilters.customFilters
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

  const isEditable = isEdit;
  const isDeletable = isDelete;

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
    dispatch(resetBulkPreventive());
    dispatch(resetUpdateScheduler());
    dispatch(getPPMDetail(companies, modalName, id, 'edit'));
    setEditId(id);
    showEditModal(true);
  };

  const onAdd = () => {
    dispatch(resetBulkPreventive());
    dispatch(resetUpdateScheduler());
    showAddPPMModal(true);
  };

  const onCloseForm = () => {
    dispatch(resetBulkPreventive());
    dispatch(resetUpdateScheduler());
    setEditId(false);
    showEditModal(false);
    showAddPPMModal(false);
  };

  const tableColumns = PPMNewColumns(onClickEditData, onClickRemoveData, isEditable, isDeletable);

  return (
    <>
      <CommonGrid
        className="tickets-table"
        tableData={
        adminPPMList && adminPPMList.data && adminPPMList.data.length
          ? adminPPMList.data
          : []
        }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setRows={setRows}
        loadingData={loadingData}
        moduleName="PPM Schedules List"
        moduleDescription="(Only PPMs in the Upcoming state can be edited and deleted.)"
        appModelsName={modalName}
        listCount={totalDataCount}
        // errorData={errorMessage}
        createOption={{
          enable: isAdd,
          text: 'Add',
          func: () => onAdd(),
        }}
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
        rowselected={rowselected}
        reload={{
          show: true,
          setReload,
          loadingData,
        }}
        ishideEditable
        exportInfo={adminPPMExport}
        exportFileName="PPM Schedules List"
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
        open={addPPMModal}
      >
        <DrawerHeader
          headerName={infoValue('create_ppm_schedule', 'Create PPM Schedule')}
          subTitle="Develop a proactive maintenance schedule to keep assets, infrastructure, and equipment in top condition, reducing unexpected failures and extending asset life."
          imagePath={false}
          onClose={() => onCloseForm()}
        />
        <SchedulePPM isAdminSetup onClose={() => onCloseForm()} />
      </Drawer>
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
        open={editModal}
      >
        <DrawerHeader
          headerName="Update PPM Schedule"
          subTitle="Develop a proactive maintenance schedule to keep assets, infrastructure, and equipment in top condition, reducing unexpected failures and extending asset life."
          imagePath={false}
          onClose={() => onCloseForm()}
        />
        <SchedulePPM isAdminSetup editId={editId} editData={inspDeata} onClose={() => onCloseForm()} />
      </Drawer>
    </>
  );
};

export default PpmList;
