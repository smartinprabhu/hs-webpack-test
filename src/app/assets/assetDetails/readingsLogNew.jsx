/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
} from 'reactstrap';

import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@mui/system';
import {
  Dialog, DialogContent, DialogContentText, Button,
} from '@mui/material';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  getDeleteChecklist, resetDeleteChecklist,
} from '../../adminSetup/maintenanceConfiguration/maintenanceService';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  debounce,
  formatFilterData,
  getColumnArrayByDate,
  getColumnArrayById,
  getCompanyTimezoneDate,
  getPagesCountV2,
  isArrayValueExists,
  queryGeneratorWithUtc,
  valueCheck,
  getDateAndTimeForDifferentTimeZones,
  getListOfModuleOperations,
} from '../../util/appUtils';
import DialogHeader from '../../commonComponents/dialogHeader';
import { groupByMultiple } from '../../util/staticFunctions';
import {
  getReadingsLog,
  getReadingsLogCounts,
  getReadingsLogFilters, resetAddReadingLogInfo, getReadingsLogExport, resetUpdateEquipment,
} from '../equipmentService';
import AddGaugeLog from './addGaugeLog';
import actionCodes from '../data/assetActionCodes.json';

import CommonGrid from '../../commonComponents/commonGrid';
import { ReadingLogsColumns } from '../../commonComponents/gridColumns';
import { AddThemeBackgroundColor } from '../../themes/theme';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const ReadingsLog = (props) => {
  const {
    editId, types, editData, readingsData,
  } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const [type, setType] = useState(types);
  const [statusValue, setStatusValue] = useState(0);
  const [checkItems, setCheckItems] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentPage, setPage] = useState(0);
  const [addLogModal, showAddLogModal] = useState(false);
  const [customFilters, setCustomFilters] = useState([]);
  const [customFilterList, setCustomFiltersList] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [deleteModal, showDeleteModal] = useState(false);
  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [openEditLogModal, setOpenEditLogModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  const [showChart] = useState(false);
  const [chartValue, setChartValue] = useState('bar');
  const [statistic, setStatistic] = useState('');
  const [timeRange, setTimeRange] = useState('');
  const [period, setPeriod] = useState('1');
  const [editDataLog, setEditDataLog] = useState([]);
  const [columns, setColumns] = useState([type === 'space' ? 'space_id' : 'equipment_id', 'reading_id', 'sequence', 'date', 'type', 'value']);
  const [showPopover, setShowPopover] = useState(false);
  const [fields, setFields] = useState(columns);
  const classes = useStyles();

  const [visibleColumns, setVisibleColumns] = useState({});
  const [rows, setRows] = useState([]);
  const [reload, setReload] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [startExport, setStartExport] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);
  const [rowselected, setRowselected] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [globalvalue, setGlobalvalue] = useState('');

  const {
    readingsLogFilters, readingsLog, readingsLogCount, readingsLogCountLoading, addReadingInfo, updateEquipment, readingsLogExportInfo,
  } = useSelector((state) => state.equipment);
  const { sortedValue } = useSelector((state) => state.equipment);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    userInfo, userRoles,
  } = useSelector((state) => state.user);
  const {
    checklistDeleteInfo,
  } = useSelector((state) => state.maintenance);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Asset Registry', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Reading Log']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Reading Log']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Reading Log']);

  const onRemoveChecklist = (id) => {
    dispatch(getDeleteChecklist(id, appModels.READINGSLOG));
  };

  const onRemoveChecklistCancel = () => {
    dispatch(resetDeleteChecklist());
    showDeleteModal(false);
  };
  /* useEffect(() => {
    if (filterData && filterData.id && filterData.label) {
      dispatch(getReadingsLogFilters([filterData], customFilters));
    }
  }, [filterData]); */

  const onClickEditData = (log) => {
    setSelectedUser(log.id); setEditDataLog(log); setOpenEditLogModal(true);
  };

  const onClickRemoveData = (log) => {
    setRemoveId(log.id); setRemoveName(log.reading_id ? log.reading_id[1] : ''); showDeleteModal(true);
  };

  const tableColumns = ReadingLogsColumns(onClickEditData, onClickRemoveData, isEditable, isDeleteable);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && readingsLogCount
      && readingsLogCount.length && startExport
    ) {
      const offsetValue = 0;
      const customFiltersQuery = readingsLogFilters && readingsLogFilters.customFilters
        ? queryGeneratorWithUtc(readingsLogFilters.customFilters)
        : '';
      const domain = fields && fields.length ? fields[0] : 'equipment_id';
      dispatch(
        getReadingsLogExport(editId, appModels.READINGSLOG, readingsLogCount.length, offsetValue, fields, domain, false, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField, globalFilter),
      );
    }
  }, [startExport]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      const visiColumns = {
        _check_: true,
        reading_id: true,
        date: true,
        value: true,
        type: true,
        equipment_id: true,
        planning_run_result: false,
        order_id: false,
      };
      setVisibleColumns(visiColumns);
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (reload) {
      setCustomFilters([]);
      dispatch(getReadingsLogFilters([]));
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
    }
  }, [reload]);

  useEffect(() => {
    if (editData) {
      const values = { id: editData.reading_id[0], label: editData.reading_id[1] };
      setFilterData(values);
      setType(types);
    }
  }, [editData]);

  useEffect(() => {
    if (readingsLogFilters && readingsLogFilters.statuses) {
      setCheckItems(readingsLogFilters.statuses);
      setStatusValue(0);
    }
    if (readingsLogFilters && readingsLogFilters.customFilters) {
      setCustomFilters(readingsLogFilters.customFilters);
      const vid = isArrayValueExists(readingsLogFilters.customFilters, 'type', 'id');
      if (vid) {
        if (editId !== vid) {
          dispatch(setInitialValues(false, false, false, false));
        }
      }
    }
  }, [readingsLogFilters]);

  useEffect(() => {
    if (filterData && filterData.id && filterData.label) {
      const defaultFilters = [
        {
          key: 'reading_id', title: 'Reading', value: filterData.label, label: 'Reading', type: 'id', Header: 'Reading', id: filterData.id,
        },
      ];
      dispatch(getReadingsLogFilters(false, defaultFilters));
    }
  }, [filterData]);

  useEffect(() => {
    if (readingsLogFilters && readingsLogFilters.customFilters) {
      setCustomFilters(readingsLogFilters.customFilters);
    }
  }, [readingsLogFilters]);

  useEffect(() => {
    if (readingsLogFilters && (readingsLogFilters.statuses || readingsLogFilters.customFilters)) {
      const statusValues = readingsLogFilters.statuses ? getColumnArrayById(readingsLogFilters.statuses, 'id') : [];
      const customFilters = readingsLogFilters.customFilters ? queryGeneratorWithUtc(readingsLogFilters.customFilters, false, userInfo.data) : '';
      const domain = fields && fields.length ? fields[0] : 'equipment_id';
      dispatch(getReadingsLogCounts(editId, appModels.READINGSLOG, domain, statusValues, customFilters, globalFilter));
    }
  }, [readingsLogFilters]);

  useEffect(() => {
    if (readingsLogFilters && (readingsLogFilters.statuses || readingsLogFilters.customFilters)) {
      const statusValues = readingsLogFilters.statuses ? getColumnArrayById(readingsLogFilters.statuses, 'id') : [];
      const customFilters = readingsLogFilters.customFilters ? queryGeneratorWithUtc(readingsLogFilters.customFilters, false, userInfo.data) : '';
      const domain = fields && fields.length ? fields[0] : 'equipment_id';
      dispatch(getReadingsLog(editId, appModels.READINGSLOG, limit, offset, fields, domain, statusValues, customFilters, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [readingsLogFilters, offset, sortedValue.sortBy, sortedValue.sortField]);

  useEffect(() => {
    if (userInfo && userInfo.data && ((addReadingInfo && addReadingInfo.data) || (checklistDeleteInfo && checklistDeleteInfo.data) || (updateEquipment && updateEquipment.data))) {
      const statusValues = readingsLogFilters.statuses ? getColumnArrayById(readingsLogFilters.statuses, 'id') : [];
      const customFilters = readingsLogFilters.customFilters ? queryGeneratorWithUtc(readingsLogFilters.customFilters, false, userInfo.data) : '';
      const domain = fields && fields.length ? fields[0] : 'equipment_id';
      dispatch(getReadingsLogCounts(editId, appModels.READINGSLOG, domain, false, customFilters, globalFilter));
      dispatch(getReadingsLog(editId, appModels.READINGSLOG, limit, offset, fields, domain, statusValues, customFilters, sortedValue.sortBy, sortedValue.sortField, globalFilter));
    }
  }, [addReadingInfo, checklistDeleteInfo, updateEquipment]);

  const handleCustomFilterClose = (value, cf) => {
    const customFiltersList = readingsLogFilters.customFilters.filter((item) => item.value !== value);
    dispatch(getReadingsLogFilters(false, customFiltersList));
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setOffset(0);
    setPage(0);
  };

  const handleStatusClose = (value) => {
    setOffset(0); setPage(0);
    setStatusValue(value);
    setCheckItems(checkItems.filter((item) => item.id !== value));
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
    const oldCustomFilters = readingsLogFilters && readingsLogFilters.customFilters
      ? readingsLogFilters.customFilters
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
    dispatch(getReadingsLogFilters(false, customFilters1));
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
      const oldCustomFilters = readingsLogFilters && readingsLogFilters.customFilters
        ? readingsLogFilters.customFilters
        : [];
      const filterValues = {
        states:
          readingsLogFilters && readingsLogFilters.states
            ? readingsLogFilters.states
            : [],
        customFilters: [
          oldCustomFilters.length > 0
            ? oldCustomFilters.filter(
              (item) => item.type !== 'date'
                && item.type !== 'customdate'
                && item.type !== 'datearray',
            )
            : '',
          ...filters,
        ],
      };
      setValueArray([
        ...valueArray.filter(
          (item) => item.type !== 'date'
            && item.type !== 'customdate'
            && item.type !== 'datearray',
        ),
        ...filters,
      ]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getReadingsLogFilters(false, filterValues.customFilters));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = readingsLogFilters && readingsLogFilters.customFilters
        ? readingsLogFilters.customFilters
        : [];
      const filterValues = {
        states:
          readingsLogFilters && readingsLogFilters.states
            ? readingsLogFilters.states
            : [],
        customFilters: [
          ...oldCustomFilters,
          ...customFiltersList.filter((item) => item !== value),
        ],
      };
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(getReadingsLogFilters(false, filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    const oldCustomFilters = readingsLogFilters && readingsLogFilters.customFilters ? readingsLogFilters.customFilters : [];
    setCustomFilters(filters);
    const states = readingsLogFilters && readingsLogFilters.statuses ? readingsLogFilters.statuses : [];
    const customFiltersData = [...oldCustomFilters, ...filters];
    resetForm({ values: '' });
    dispatch(getReadingsLogFilters(states, customFiltersData));
  };

  const totalDataCount = readingsLogCount && readingsLogCount.length ? readingsLogCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);
  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
  };

  const onReset = () => {
    dispatch(resetAddReadingLogInfo());
    dispatch(resetUpdateEquipment());
  };

  const loading = (readingsLog && readingsLog.loading) || (readingsLogCountLoading);
  const dateFilters = (readingsLogFilters && readingsLogFilters.customFilters && readingsLogFilters.customFilters.length > 0) ? readingsLogFilters.customFilters : [];
  const checkedItems = (readingsLogFilters && readingsLogFilters.statuses) ? readingsLogFilters.statuses : [];

  let chartData = [];
  const backgroundColor = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ];
  const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

  function checkValue(rdata, date) {
    let value = 0;
    const data = rdata.filter((obj) => (getCompanyTimezoneDate(obj.date, userInfo, 'datetime') === date));
    if (data && data.length) value = data[0].value;
    return value;
  }

  function getMeasureValue(logData, grp, ldate) {
    const measureValue = [];
    if (logData.length > 0) {
      const rdata = logData.filter((obj) => (obj.reading_id && obj.reading_id[0] === grp));
      if (ldate && ldate.length) ldate.map((item) => measureValue.push(checkValue(rdata, item)));
    }
    return measureValue;
  }

  function getLabels(logData) {
    const labels = [];
    if (logData.length > 0) {
      logData.map((obj) => {
        if (!labels.includes(getCompanyTimezoneDate(obj.date, userInfo, 'datetime'))) {
          labels.push(getCompanyTimezoneDate(obj.date, userInfo, 'datetime'));
        }
      });
    }
    return labels;
  }

  const dataSet = [];

  if (readingsLog && readingsLog.data) {
    let { data } = readingsLog;
    if (timeRange !== '' || statistic !== '') {
      data = getColumnArrayByDate(data, userInfo, timeRange, period, statistic);
    }
    const rLogs = groupByMultiple(data, (obj) => obj.reading_id[0]);
    const label = getLabels(data);
    // getColumnArrayByDate(readingsLog.data, 'date', userInfo, 'datetime'),
    if (rLogs.length > 0) {
      rLogs.map((item, i) => dataSet.push(
        {
          label: item[0].reading_id[1],
          fill: false,
          data: getMeasureValue(data, item[0].reading_id[0], label),
          backgroundColor: backgroundColor[i],
          borderColor: borderColor[i],
          borderWidth: 1,
        },
      ));
      chartData = {
        labels: label,
        datasets: dataSet,
      };
    }
  }
  const chartOptions = {
    scales: {
      yAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      xAxes: [
        {
          stacked: true,
        },
      ],
    },
  };

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const onFilterChange = (data) => {
    const fields = [
      'reading_id',
      'date',
      'value',
      'type',
      'equipment_id',
      'planning_run_result',
      'order_id',
    ];
    let query = '"|","|","|","|","|","|",';

    const oldCustomFilters = readingsLogFilters && readingsLogFilters.customFilters
      ? readingsLogFilters.customFilters
      : [];
    const dateFilters = oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    );

    if (data && data.quickFilterValues && data.quickFilterValues.length && (data.quickFilterValues[0]).length > 1) {
      fields.filter((field) => {
        query += `["${field}","ilike","${encodeURIComponent(data.quickFilterValues[0])}"],`;
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
        dispatch(getReadingsLogFilters(false, customFilters));
      }
    } else {
      const customFilters = [...dateFilters];
      dispatch(getReadingsLogFilters(false, customFilters));
    }
    const filtersData = data.items && data.items.length ? JSON.parse(JSON.stringify(data?.items)) : [];
    const customFiltersData = [...dateFilters, ...filtersData];
    setFilterText(formatFilterData(customFiltersData, data?.quickFilterValues?.[0]));
    setOffset(0);
    setPage(0);
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [readingsLogFilters],
  );

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        tableData={
          readingsLog && readingsLog.data && readingsLog.data.length
            ? readingsLog.data
            : []
        }
        columns={tableColumns}
        filters={filterText}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Reading Logs"
        exportFileName="Reading Logs"
        listCount={totalDataCount}
        exportInfo={readingsLogExportInfo}
        page={currentPage}
        rowCount={totalDataCount}
        limit={limit}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        createOption={{
          enable: isCreatable,
          text: 'Add',
          func: () => showAddLogModal(true),
        }}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={readingsLog && readingsLog.loading}
        err={readingsLog && readingsLog.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        defaultExcelId="print_report_reading"
      //   setViewModal={setViewModal}
      //   setViewId={setViewId}
        reload={{
          show: true,
          setReload,
          loading,
        }}
      //   removeData={onClickRemoveData}
        moduleCustomHeader={(
          <>
            {customFilters && customFilters.length > 0 ? customFilters.map((cf) => (
              <>
                {(cf.type === 'id' && cf.label && cf.label !== '')
                  ? (
                    <p key={cf.value} className="mr-2 content-inline">
                      <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                        {(cf.type === 'text') && (
                        <span>
                          {decodeURIComponent(cf.name)}
                        </span>
                        )}
                        {(cf.type === 'id') && (
                        <span>
                          {cf.label}
                          {' '}
                          :
                          {' '}
                          {cf.value}
                        </span>
                        )}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ) : ''}
              </>
            )) : ''}
          </>
      )}
      />
      <Dialog size={addReadingInfo && addReadingInfo.data ? 'md' : 'xl'} fullWidth open={addLogModal}>
        <DialogHeader title="Add Reading Log" imagePath={false} onClose={() => { dispatch(resetAddReadingLogInfo()); showAddLogModal(false); }} response={false} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddGaugeLog
              viewId={editId}
              type={type}
              afterReset={() => { showAddLogModal(false); onReset(); }}
              readingsData={readingsData}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size={updateEquipment && updateEquipment.data ? 'md' : 'xl'} fullWidth open={openEditLogModal}>
        <DialogHeader title="Edit Reading Log" imagePath={false} onClose={() => {  dispatch(resetUpdateEquipment()); setOpenEditLogModal(false); }} response={false} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddGaugeLog
              viewId={editId}
              type={type}
              editData={editDataLog}
              selectedUser={selectedUser}
              afterReset={() => { setOpenEditLogModal(false); onReset(); }}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size={(checklistDeleteInfo && checklistDeleteInfo.data) ? 'sm' : 'lg'} fullWidth open={deleteModal}>
        <DialogHeader title="Delete Reading Logs" imagePath={false} onClose={() => onRemoveChecklistCancel()} response={checklistDeleteInfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {checklistDeleteInfo && (!checklistDeleteInfo.data && !checklistDeleteInfo.loading && !checklistDeleteInfo.err) && (
            <p className="text-center">
              {`Are you sure, you want to remove ${removeName} reading logs ?`}
            </p>
            )}
            {checklistDeleteInfo && checklistDeleteInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(checklistDeleteInfo && checklistDeleteInfo.err) && (
            <SuccessAndErrorFormat response={checklistDeleteInfo} />
            )}
            {(checklistDeleteInfo && checklistDeleteInfo.data) && (
            <SuccessAndErrorFormat response={checklistDeleteInfo} successMessage="Reading Logs removed successfully.." />
            )}
            <div className="float-right mt-3">
              {checklistDeleteInfo && !checklistDeleteInfo.data && (
              <Button size="sm" disabled={checklistDeleteInfo && checklistDeleteInfo.loading} variant="contained" onClick={() => onRemoveChecklist(removeId)}>Confirm</Button>
              )}
              {checklistDeleteInfo && checklistDeleteInfo.data && (
              <Button size="sm" variant="contained" onClick={() => onRemoveChecklistCancel()}>Ok</Button>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

ReadingsLog.defaultProps = {
  editId: undefined,
};

ReadingsLog.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  types: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  readingsData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default ReadingsLog;
