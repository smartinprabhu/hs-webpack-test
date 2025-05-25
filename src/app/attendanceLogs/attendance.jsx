/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AttendanceIcon from '@images/attendanceIcon.svg';
import { Box } from '@mui/system';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
} from 'reactstrap';

import Drawer from '@mui/material/Drawer';
import DrawerHeader from '../commonComponents/drawerHeader';
import CommonGrid from '../commonComponents/commonGrid';

import { AddThemeBackgroundColor } from '../themes/theme';

import { updateHeaderData } from '../core/header/actions';
import { AttendanceFields } from '../shared/data/tableFields';
import {
  debounce,
  formatFilterData,
  getActiveTab,
  getAllCompanies,
  getDateAndTimeForDifferentTimeZones,
  getHeaderTabs,
  getNextPreview,
  getTabs,
  queryGeneratorWithUtc,
  valueCheck,
} from '../util/appUtils';
import AttendanceDetails from './details/attendanceDetails';
import { AttendanceModule } from '../util/field';
import {
  attendanceFiltersData,
  getAttendanceCount, getAttendanceExport,
  getAttendanceLogs, getAttendanceDetails,
} from './attendanceService';
import attendenceNav from './navbar/navList.json';

const appModels = require('../util/appModels').default;

const Templates = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);
  const [offset, setOffset] = useState(0);
  const [currentpage, setPage] = useState(0);
  const [customFilters, setCustomFilters] = useState([]);
  const [startExport, setStartExport] = useState(false);
  const [rows, setRows] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [globalFilter, setGlobalFilter] = useState(false);
  const [customFiltersList, setCustomFiltersList] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [globalvalue, setGlobalvalue] = useState('');
  const [customVariable, setCustomVariable] = useState(false);
  const [valueArray, setValueArray] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [viewId, setViewId] = useState(0);
  const [detailArrowNext, setDetailArrowNext] = useState('');
  const [detailArrowPrev, setDetailArrowPrev] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const {
    attendanceCount, attendanceLogs,
    attendanceFiltersInfo, attendanceExportInfo, attendanceCountLoading, attendanceDetailsInfo,
  } = useSelector((state) => state.attendance);

  const companies = getAllCompanies(userInfo);

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        employee_id: true,
        create_date: true,
        type: true,
        valid: true,
        vendor_id: true,
        device_id: true,
        department_id: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && attendanceCount
      && attendanceCount.length
    ) {
      const offsetValue = 0;
      const customFiltersData = attendanceFiltersInfo.customFilters ? queryGeneratorWithUtc(attendanceFiltersInfo.customFilters) : '';
      dispatch(getAttendanceExport(companies, appModels.ATTENDANCE, AttendanceModule.logApiFields, attendanceCount.length, offsetValue, false, false, customFiltersData, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [startExport]);

  useEffect(() => {
    if (reload) {
      setPage(0);
      setOffset(0);
      setGlobalFilter(false);
      dispatch(attendanceFiltersData([]));
    }
  }, [reload]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFilterValuesInfo = attendanceFiltersInfo && attendanceFiltersInfo.customFilters ? queryGeneratorWithUtc(attendanceFiltersInfo.customFilters, false, userInfo.data) : [];
      dispatch(getAttendanceCount(companies, appModels.ATTENDANCE, false, false, customFilterValuesInfo, globalFilter));
    }
  }, [attendanceFiltersInfo.customFilters, globalFilter]);

  useMemo(() => {
    if (userInfo && userInfo.data) {
      const customFilterValuesInfo = attendanceFiltersInfo && attendanceFiltersInfo.customFilters ? queryGeneratorWithUtc(attendanceFiltersInfo.customFilters, false, userInfo.data) : [];
      dispatch(getAttendanceLogs(companies, appModels.ATTENDANCE, limit, offset, sortedValue.sortBy, sortedValue.sortField, false, false, customFilterValuesInfo, globalFilter));
    }
  }, [userInfo, offset, sortedValue.sortBy, sortedValue.sortField, attendanceFiltersInfo.customFilters, globalFilter]);

  useEffect(() => {
    if (viewId) {
      dispatch(getAttendanceDetails(appModels.ATTENDANCE, viewId));
    }
  }, [viewId]);

  const totalDataCount = attendanceCount && attendanceCount.length ? attendanceCount.length : 0;

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
    const oldCustomFilters = attendanceFiltersInfo && attendanceFiltersInfo.customFilters
      ? attendanceFiltersInfo.customFilters
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
    dispatch(attendanceFiltersData(customFilters1));
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
      [start, end] = getDateRangeObj;
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
      const oldCustomFilters = attendanceFiltersInfo && attendanceFiltersInfo.customFilters
        ? attendanceFiltersInfo.customFilters
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
      dispatch(attendanceFiltersData(filterValues));
    } else {
      setCustomFiltersList(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = attendanceFiltersInfo && attendanceFiltersInfo.customFilters
        ? attendanceFiltersInfo.customFilters
        : [];
      const filterValues = [
        ...oldCustomFilters,
        ...customFiltersList.filter((item) => item !== value),
      ];
      setValueArray([...valueArray.filter((item) => item !== value)]);
      setFilterText(formatFilterData(filterValues, globalvalue));
      dispatch(attendanceFiltersData(filterValues));
    }
    setOffset(0);
    setPage(0);
  };

  const handleCustomFilterClose = (cfValue, cf) => {
    const ele = document.getElementById(`data-${cf.key}`);
    if (ele) {
      ele.value = null;
    }
    setValueArray(valueArray.filter((item) => item.id !== cf.key));
    setCustomFilters(customFilters.filter((item) => item.value !== cfValue));
    const customFiltersList1 = customFilters.filter((item) => item.value !== cfValue);
    dispatch(attendanceFiltersData(customFiltersList1));
    setOffset(0);
    setPage(1);
  };

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Attendance Logs',
  );

  let activeTab;
  let tabs;
  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, attendenceNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Attendance',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Attendance Logs',
        moduleName: 'Attendance Logs',
        menuName: 'Attendance',
        link: '/attendance',
        headerTabs: tabs.filter((e) => e),
        activeTab,
        dispatchFunc: () => attendanceFiltersData({}),
      }),
    );
  }, [activeTab]);

  const handlePageChange = (page) => {
    const offsetValue = page * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const tableColumns = AttendanceFields();

  const updateValueConditionally = (filters, filterData) => {
    let updated = false;

    filters.forEach((filter) => {
      if (filterData && filterData[0] && typeof filterData[0].value === 'string') {
        const filterValue = filterData[0].value.toLowerCase();
        if (filterValue === 'yes') {
          filter.value = true; // Ensure 'filter.value' is writable
          updated = true;
        } else if (filterValue === 'no') {
          filter.value = false;
          updated = true;
        }
      } else {
        console.error('Invalid filterData or filterData[0]');
      }
    });

    // Return the updated filters only if modifications were made, else return original
    return updated ? filters : filters;
  };

  const onFilterChange = (data) => {
    setGlobalvalue('');
    const fields = [
      'employee_id',
      'type',
      'valid',
      'vendor_id',
      'device_id',
      'department_id',
    ];
    let query = '"|","|","|","|","|",';

    const oldCustomFilters = attendanceFiltersInfo && attendanceFiltersInfo.customFilters
      ? attendanceFiltersInfo.customFilters
      : [];
    const dateFilters = oldCustomFilters && oldCustomFilters.length ? oldCustomFilters.filter(
      (item) => item.type === 'date' || item.type === 'customdate',
    ) : [];

    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setGlobalvalue(data?.quickFilterValues?.[0]);
      fields.forEach((field) => {
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

        let customFiltersUnique = [...dateFilters, ...uniqueCustomFilter];
     //   customFiltersUnique = customFiltersUnique && customFiltersUnique.length && customFiltersUnique.length > 0 ? updateValueConditionally(customFiltersUnique, data.items) : customFiltersUnique;
        dispatch(attendanceFiltersData(customFiltersUnique));
      }
    } else {
      const customFiltersValue = [...dateFilters];
      dispatch(attendanceFiltersData(customFiltersValue));
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
    [attendanceFiltersInfo],
  );

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  const handlePageChangeDetail = (page, type) => {
    setDetailArrowNext('');
    setDetailArrowPrev('');
    const nPages = Math.ceil(totalDataCount / limit);
    if (type === 'Next' && page !== nPages) {
      const offsetValue = page * limit;
      setOffset(offsetValue);
      setPage(page);
      setDetailArrowNext(Math.random());
    }
    if (type === 'Prev' && page !== 1) {
      const offsetValue = ((page - 2) * limit);
      setOffset(offsetValue);
      setPage(page - 2);
      setDetailArrowPrev(Math.random());
    }
  };

  const loading = (userInfo && userInfo.loading) || (attendanceLogs && attendanceLogs.loading) || (attendanceCountLoading);

  return (
    <Box>
      <CommonGrid
        className="tickets-table"
        componentClassName="commonGrid"
        tableData={
          attendanceLogs && attendanceLogs.data && attendanceLogs.data.length
            ? attendanceLogs.data
            : []
        }
        columns={tableColumns}
        checkboxSelection
        pagination
        disableRowSelectionOnClick
        moduleName="Attendance"
        exportFileName="Attendance"
        listCount={totalDataCount}
        exportInfo={attendanceExportInfo}
        page={currentpage}
        rowCount={totalDataCount}
        limit={limit}
        filters={filterText}
        handlePageChange={handlePageChange}
        setStartExport={setStartExport}
        setRows={setRows}
        rows={rows}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        onFilterChanges={debouncedOnFilterChange}
        loading={attendanceLogs && attendanceLogs.loading}
        err={attendanceLogs && attendanceLogs.err}
        onClickRadioButton={handleRadioboxChange}
        onChangeCustomDate={handleCustomDateChange}
        setCustomVariable={setCustomVariable}
        customVariable={customVariable}
        setViewModal={setViewModal}
        setViewId={setViewId}
        reload={{
          show: true,
          setReload,
          loading,
        }}
        moduleCustomHeader={(
          customFilters && customFilters.length > 0 ? customFilters.map((cf) => (
            (cf.type === 'id' && cf.label && cf.label !== '')
              ? (
                <p key={cf.value} className="mr-2 content-inline">
                  <Badge style={AddThemeBackgroundColor({})} className="p-2 mb-1">
                    {(cf.type === 'text' || cf.type === 'id') && (
                      <span>
                        {decodeURIComponent(cf.name)}
                      </span>
                    )}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf)} size="sm" icon={faTimesCircle} />
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
        open={viewModal}
      >
        <DrawerHeader
          headerName={attendanceDetailsInfo && (attendanceDetailsInfo.data && attendanceDetailsInfo.data.length > 0)
            ? attendanceDetailsInfo.data[0].user_id[1] : 'Attendance'}
          imagePath={AttendanceIcon}
          onClose={() => onViewReset()}
          onPrev={() => {
            const nextPreview = getNextPreview(viewId, 'Prev', attendanceLogs);
            if (nextPreview === 0) {
              handlePageChangeDetail(currentpage + 1, 'Prev');
            } else {
              setViewId(nextPreview);
            }
          }}
          onNext={() => {
            const nextPreview = getNextPreview(viewId, 'Next', attendanceLogs);
            if (nextPreview === 0) {
              handlePageChangeDetail(currentpage + 1, 'Next');
            } else {
              setViewId(nextPreview);
            }
          }}
        />
        <AttendanceDetails />
      </Drawer>
    </Box>
  );
};

export default Templates;
