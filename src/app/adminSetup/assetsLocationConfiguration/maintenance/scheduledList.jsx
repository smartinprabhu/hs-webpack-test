/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import styles from './StepBasicInfo.module.scss';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import {
  Drawer, Dialog, DialogContent, DialogContentText, DialogActions, Button,
} from '@mui/material';
import {
  getEquipmentFilters,
} from '../../../assets/equipmentService';
import CommonGrid from '../../../commonComponents/commonGridEditable';
import { BulkInspectionColumns } from '../../../commonComponents/gridColumnsEditable';
import {
  debounce,
  formatFilterData,
  getAllCompanies,
  getDateAndTimeForDifferentTimeZones,
  queryGeneratorWithUtc,
  valueCheck,
} from '../../../util/appUtils';
import {
  getArchive,
  getBulkInspection,
  getBulkInspectionCount,
  getBulkInspectionExport,
  resetArchive,
  storeSelectedSpaces,
  storeModifiedData,
} from '../../setupService';
import DialogHeader from '../../../commonComponents/dialogHeader';
import ScheduleForm from './maintenanceSteps';
import DrawerHeader from '../../../commonComponents/drawerHeader';

const appModels = require('../../../util/appModels').default;

const ScheduleList = () => {
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  const [limit, setLimit] = useState(10);
  const [rows, setRows] = useState([]);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

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
  const [editId, setEditId] = useState(false);
  const [editData, setEditData] = useState(false);
  const { modifiedData } = useSelector((state) => state.setup);

  const modalName = appModels.INSPECTIONCHECKBULK;
  const fields = '["id","state", "category_type","commences_on","ends_on","is_enable_time_tracking","min_duration","max_duration","is_exclude_holidays","is_missed_alert",("task_id",["id","name"]),"description","bulk_inspection_json","mo","tu","we","th","fr","sa","su","at_start_mro","at_review_mro","at_done_mro","enforce_time","is_allow_future","is_allow_past","qr_scan_at_start","qr_scan_at_done","nfc_scan_at_start","nfc_scan_at_done",["bulk_lines", ["id",("equipment_id", ["id", "name", "equipment_seq",("maintenance_team_id",["id","name"]),("category_id",["id","name"]), ("location_id", ["id", "path_name"])]),("space_id", ["id", "name", "path_name","space_name", "sequence_asset_hierarchy",("asset_category_id",["id","name"])]),("maintenance_team_id",["id","name"]),("check_list_id",["id","name"]),"duration","starts_at"]],("group_id",["id","name"])]';

  const {
    sortedValue, equipmentFilters,
  } = useSelector((state) => state.equipment);
  const {
    bulkInspectionCount, bulkInspectionInfo, bulkInspectionCountLoading, bulkInspectionExportInfo, archiveInfo, bulkInspectionDetailInfo,
  } = useSelector((state) => state.setup);
  const totalDataCount = bulkInspectionCount && bulkInspectionCount.length ? bulkInspectionCount.length : 0;

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && bulkInspectionCount
      && bulkInspectionCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = equipmentFilters && equipmentFilters.customFilters
        ? queryGeneratorWithUtc((equipmentFilters.customFilters), false, userInfo.data)
        : '';
      dispatch(
        getBulkInspectionExport(companies, modalName, limit, offsetValue, fields, customFiltersQuery, rowselected, sortedValue.sortBy, sortedValue.sortField, globalFilter),
      );
    }
  }, [startExport]);

  const getSubTitleEditScreen = () => {
    let title = '';
    if (modifiedData?.type === 'ah') {
      title = (
        <span>
          You have selected
          {' '}
          {modifiedData.spaceValue && modifiedData.spaceValue.length}
          {' '}
          space(s)  for your schedule. (Space Category -
          {' '}
          {modifiedData?.category?.name}
          )
        </span>
      );
    } else {
      title = (
        <span>
          You have selected
          {' '}
          {modifiedData.equipmentValue && modifiedData.equipmentValue.length}
          {' '}
          piece(s) of equipment for your schedule. (Equipment Category -
          {' '}
          {modifiedData?.category?.name}
          )
        </span>
      );
    }
    return title;
  };

  useEffect(() => {
    getSubTitleEditScreen();
  }, [modifiedData]);


  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        group_id: true,
        category_type: true,
        state: true,
        commences_on: true,
        bulk_lines: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      dispatch(getBulkInspectionDetails([]));
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
    if (bulkInspectionInfo && bulkInspectionInfo.data) {
      setRows(bulkInspectionInfo.data);
    } else {
      setRows([]);
    }
  }, [bulkInspectionInfo]);

  useEffect(() => {
    if (archiveInfo && archiveInfo.data) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getBulkInspectionCount(companies, modalName, customFiltersList, globalFilter));
      dispatch(getBulkInspection(companies, modalName, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, fields));
    }
  }, [archiveInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getBulkInspectionCount(companies, modalName, customFiltersList, globalFilter));
    }
  }, [userInfo, equipmentFilters.customFilters, globalFilter]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getBulkInspection(companies, modalName, limit, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField, globalFilter, fields));
    }
  }, [userInfo, offset, limit, sortedValue.sortBy, sortedValue.sortField, equipmentFilters.customFilters, globalFilter]);

  const loadingData = (userInfo && userInfo.loading) || (bulkInspectionInfo && bulkInspectionInfo.loading) || (bulkInspectionCountLoading);

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
    const fields = [
      'group_id',
      'category_type',
      'state',
      'commences_on',
      'bulk_lines',
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

  const onRemoveDataCancel = () => {
    dispatch(resetArchive());
    showDeleteModal(false);
  };

  const onClickRemoveData = (id, name) => {
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const onRemoveData = (id) => {
    const postData = {
      active: false,
    };

    dispatch(getArchive(id, appModels.INSPECTIONCHECKBULK, postData));
  };

  const onClickEditData = (id, row) => {
    // dispatch(getBulkInspectionDetails(id, appModels.INSPECTIONCHECKBULK));
    setEditId(id);
    setEditData(row);
    showFormModal(true);
  };

  const onClickResumeData = (id, row) => {
    setEditId(id);
    setEditData(row);
    //dispatch(getBulkInspectionDetails(id, appModels.INSPECTIONCHECKBULK));
    showFormModal(true);
  };

  const onReset = () => {
    dispatch(storeSelectedSpaces({
      equipmentValue: [], spaceValue: [], category: '', type: '', maintenanceType: '',
    }));
    dispatch(storeModifiedData({}));
    dispatch(getEquipmentFilters([]));
    showFormModal(false);
  };


  const tableColumns = BulkInspectionColumns(onClickRemoveData, onClickEditData, onClickResumeData);

  return (
    <>
      <CommonGrid
        className="tickets-table"
        tableData={
          bulkInspectionInfo && bulkInspectionInfo.data && bulkInspectionInfo.data.length
            ? bulkInspectionInfo.data
            : []
        }
        componentClassName="commonGrid"
        rows={rows}
        columns={tableColumns}
        setRows={setRows}
        loadingData={loadingData}
        moduleName="Scheduled Inspection List"
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
        rowselected={rowselected}
        reload={{
          show: true,
          setReload,
          loadingData,
        }}
        ishideEditable
        exportInfo={bulkInspectionExportInfo}
        exportFileName="Buildings"
        filters={filterText}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
      />
      <Modal
        size={(archiveInfo && archiveInfo.data) ? 'sm' : 'lg'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={deleteModal}
      >
        <ModalHeaderComponent
          title="Delete Schedule"
          imagePath={false}
          closeModalWindow={() => onRemoveDataCancel()}
          response={archiveInfo}
        />
        <ModalBody className="mt-0 pt-0">
          {archiveInfo && (!archiveInfo.data && !archiveInfo.loading && !archiveInfo.err) && (
            <p className="text-center">
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
              successMessage="Schedule removed successfully.."
            />
          )}
          <div className="pull-right mt-3">
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
        </ModalBody>
      </Modal>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={formModal}
      >
        <DrawerHeader
          headerName="Schedule Planner"
          subTitle={getSubTitleEditScreen()}
          // onClose={() => { onReset(); setMaintenanceType(false); }}
          onClose={() => { dispatch(storeSelectedSpaces({})); setExtraModal(true); }}
        />
        <ScheduleForm
          afterReset={() => {
            onReset();
          }}
          editId={editId}
          editData={editData}
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
            onClick={() => { setExtraModal(false); onReset(); }}
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
  );
};

export default ScheduleList;
