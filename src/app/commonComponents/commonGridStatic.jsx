import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqBy from 'lodash/unionBy';

import InputAdornment from '@mui/material/InputAdornment';
import { FiSearch } from 'react-icons/fi';
import {
  Button, IconButton,
  TextField, Autocomplete,
  Typography,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import {
  DataGridPro, GridToolbarColumnsButton, GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';

import {
  CgExport, CgRedo,
} from 'react-icons/cg';
import Drawer from '@mui/material/Drawer';
import {
  FormControl,
} from '@material-ui/core';
import OutlinedInput from '@mui/material/OutlinedInput';

import DataTable from '@shared/dataTable';
import MuiTooltip from '@shared/muiTooltip';
import DownloadRequestAlert from './downloadRequestAlertListView';

import { setSortingDashboard } from '../assets/equipmentService';
import { resetCreateTenant } from '../adminSetup/setupService';
import { AddThemeColor } from '../themes/theme';
import {
  saveExtraLargPdfContent,
  getLocalTime,
  exportExcelTableToXlsx,
  getCompanyTimezoneDate,
  getTicketStatus,
} from '../util/appUtils';
import DrawerHeader from './drawerHeader';

const CommonGridStatic = (props) => {
  const {
    dataList, rowCount, page, modelName, noGlobalFilter, configData, setAllReport, handlePageChange, dataListCount, setReload, dataColumns, onViewClick, loading, visibleColumns, setVisibleColumns, exportFileName, onFilterChanges, filters, exportReportData, isLargeReport, setLargeReport, isIot,
  } = props;

  const { userInfo } = useSelector((state) => state.user);
  const [excelColumnFields, setExcelColumnFields] = useState([]);
  const [showExport, setShowExport] = useState(false);
  const [filteredRows, setFilteredRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [exportOption, setExportOption] = useState('');
  const [sortModel, setSortModel] = useState([
    {
      field: 'DESC',
      sort: 'id',
    },
  ]);

  const { sortedValueDashboard } = useSelector((state) => state.equipment);

  const [selectedRows, setSelectedRows] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [actionModal, showActionModal] = useState(false);
  const [filterModel, setFilterModel] = useState({
    items: [], logicOperator: 'and', quickFilterValues: [], quickFilterLogicOperator: 'and',
  });

  const [searchValue, setSearchValue] = useState('');
  const [isButtonHover, setButtonHover] = useState(false);

  const limit = 10;
  const currentDate = getLocalTime(new Date());
  const title = `${exportFileName}_On_${currentDate}`;
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const showAllString = { _check_: true };

  const dispatch = useDispatch();

  useEffect(() => {
    if (searchValue !== '') {
      onFilterChanges({ quickFilterValues: [searchValue] });
    }
  }, [searchValue]);

  useEffect(() => {
    if (sortedValueDashboard && sortedValueDashboard.sortField && sortedValueDashboard.sortBy) {
      setSortModel([
        {
          field: sortedValueDashboard.sortField,
          sort: sortedValueDashboard.sortBy.toString().toLowerCase(),
        },
      ]);
    }
  }, [sortedValueDashboard]);

  useEffect(() => {
    dispatch(setSortingDashboard({ sortBy: 'DESC', sortField: 'id' }));
    setSortModel([
      {
        field: 'DESC',
        sort: 'id',
      },
    ]);
  }, []);

  const setSortingOrder = (data) => {
    if (data && data.length && Array.isArray(data)) {
      const obj = {
        sortBy: data[0].sort.toString().toUpperCase(),
        sortField: data[0].field,
      };
      setSortModel([
        obj,
      ]);
      dispatch(setSortingDashboard(obj));
    } else if (data === 'nodata') {
      dispatch(setSortingDashboard({ sortBy: 'DESC', sortField: 'id' }));
      setSortModel([
        {
          field: 'DESC',
          sort: 'id',
        },
      ]);
    }
  };

  useEffect(() => {
    if (visibleColumns) {
      const array = [];
      dataColumns.map((column) => {
        if (visibleColumns[column.field]) {
          array.push(column.field);
        }
      });
      setExcelColumnFields(array);
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (isLargeReport && rowCount > 2000) {
      showActionModal(true);
    } else {
      showActionModal(false);
    }
  }, [isLargeReport]);

  const getTableHeaders = (header, property) => {
    const visibleColumnsField = excelColumnFields;
    const headers = [];
    visibleColumnsField.map((id) => {
      const findRowId = dataColumns.find((column) => column.field === id);
      if (findRowId) {
        const obj = {};
        obj[header] = findRowId.headerName;
        obj[property] = findRowId.field;
        headers.push(obj);
      }
    });
    return headers;
  };

  const ExportOptions = [{ label: 'PDF', name: 'pdf' }, { label: 'EXCEL', name: 'excel' }];

  function showCustomizedLabel(item, col) {
    let value = '';
    if (typeof item[col.field] === 'object') {
      if (item[col.field].length && item[col.field].length > 1) {
        const array = item[col.field];
        // eslint-disable-next-line no-unused-vars
        const [id, name] = array;
        value = name;
      } else if (col.displayField && item[col.field][col.displayField]) {
        value = item[col.field][col.displayField];
      } else if (item[col.field].id && (item[col.field].name || item[col.field].alias_name || item[col.field].asset_name || item[col.field].space_name || item[col.field].path_name)) {
        value = item[col.field].space_name || item[col.field].path_name || item[col.field].name || item[col.field].alias_name || item[col.field].asset_name;
      }
    }
    return value;
  }

  const getTableData = () => {
    let exportData = dataList;

    if (filteredRows && Object.keys(filteredRows).length) {
      const entries = Object.entries(filteredRows);
      const filteredEntries = entries.filter(([key, value]) => value === true);
      const filteredObject = Object.fromEntries(filteredEntries);
      const selectedRowsId = Object.keys(filteredObject);
      exportData = dataList && dataList.length > 0 && dataList.filter((allData) => selectedRowsId.includes(allData.id.toString()));
    }

    if (selectedRows && selectedRows.length > 0) {
      exportData = dataList && dataList.length > 0 && dataList.filter((allData) => selectedRows.some((selectedId) => allData.id === selectedId));
    }
    const data = exportData;
    const array = [];
    data
            && data.length
            && data.map((item) => {
              const row = {};
              row.id = item.id;
              excelColumnFields.forEach((field) => {
                const column = dataColumns.find(
                  (columnField) => columnField.field === field,
                );
                if (column) {
                  row[field] = column && column.func && !column.displayField
                    ? column.func(item[field], configData || false)
                    : showCustomizedLabel(item, column);
                  row[field] = column.dateField ? getCompanyTimezoneDate(item[field], userInfo, column.dateField).toLocaleString() : row[field];
                  row[field] = column.specialStatus ? getTicketStatus(item.state_id, item.is_on_hold_requested, item.is_cancelled).toLocaleString() : row[field];
                }
                array.push(row);
              });
            });
    return uniqBy(array, 'id');
  };

  const downloadPdf = () => {
    saveExtraLargPdfContent(
      `${exportFileName}`,
      getTableHeaders('header', 'dataKey'),
      getTableData(),
      `${title}.pdf`,
      companyName,
      filters,
    );
  };

  const onKeyEnter = (e) => {
    setSearchValue(e.target.value);
  };

  const CustomToolBar = () => (
    <header className="header-box2">
      <div className="insights-filter-box">
        <span className="font-16 font-weight-500">
          {' '}
          {`List (${visibleRows})`}
        </span>
      </div>
      <div className="insights-filter-box">
        {setReload && !loading && (
        <MuiTooltip title={<Typography>Refresh</Typography>}>
          <IconButton className="mr-2" onClick={() => { setReload(Math.random()); setSearchValue(''); setFilterModel({ items: [], quickFilterValues: [] }); }}>
            <CgRedo size={25} color={AddThemeColor({}).color} className="mb-1" />
          </IconButton>
        </MuiTooltip>
        )}
        {/* <GridToolbarQuickFilter
          InputProps={{
            disableUnderline: true,
            sx: {
              border: '1px solid #0000001F',
              padding: '5px',
              borderRadius: '4px',
              height: '31px',
              marginTop: '4.2px',
            },
            placeholder: 'Search...',
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch size={20} color={AddThemeColor({}).color} />
              </InputAdornment>
            ),
          }}
        /> */}
        {!noGlobalFilter && (
        <FormControl variant="outlined">
          <OutlinedInput
            id="outlined-adornment-weight"
            type="text"
            name="search"
            variant="outlined"
            sx={{
              border: 0,
              padding: '5px',
              borderRadius: '4px',
              height: '30px',
              marginTop: '0px',
            }}
            autoComplete="off"
            placeholder="Search..."
            autoFocus={isButtonHover}
            value={searchValue}
            onMouseLeave={() => setButtonHover(false)}
              // onMouseEnter={() => setButtonHover(true)}
            onClick={() => setButtonHover(true)}
            onChange={(e) => onKeyEnter(e)}
            onKeyDown={(e) => onKeyEnter(e)}
            startAdornment={(
              <InputAdornment position="start">
                <FiSearch size={20} color={AddThemeColor({}).color} />
              </InputAdornment>
              )}
            endAdornment={(
              <InputAdornment position="end">
                {searchValue && (
                  <MuiTooltip title="Clear">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => { setSearchValue(''); onFilterChanges({ quickFilterValues: [] }); }}
                    >
                      <IoCloseOutline size={22} fontSize="small" />
                    </IconButton>
                  </MuiTooltip>
                )}
              </InputAdornment>
              )}
          />
        </FormControl>
        )}
        <IconButton className="header-filter-btn">
          <GridToolbarColumnsButton />
        </IconButton>
        <IconButton className="header-filter-btn">
          <GridToolbarFilterButton />
        </IconButton>
        {!isIot && (
        <IconButton className="header-filter-btn" onClick={() => { if (rowCount < 2000) { setAllReport(true); setShowExport(true); } else { setLargeReport(true); } }}>
          <CgExport size={20} color={AddThemeColor({}).color} className="mb-1" />
          <span className="mt-1 ml-1 pl-1 mb-1" style={AddThemeColor({})}> Export </span>
        </IconButton>
        )}
        {isIot && rowCount < 2000 && (
        <IconButton className="header-filter-btn" onClick={() => { setAllReport(true); setShowExport(true); }}>
          <CgExport size={20} color={AddThemeColor({}).color} className="mb-1" />
          <span className="mt-1 ml-1 pl-1 mb-1" style={AddThemeColor({})}> Export </span>
        </IconButton>
        )}
        {actionModal && (
          <DownloadRequestAlert
            atReset={() => {
              dispatch(resetCreateTenant());
              setLargeReport(false);
              showActionModal(false);
            }}
            webFilters={{
              exportFileName,
            }}
            details={exportReportData}
            actionModal
          />
        )}
      </div>
    </header>
  );


  const showAll = () => {
    const obj = {};
    const identifiers = Object.keys(visibleColumns);
    identifiers.filter((id) => {
      obj[id] = true;
    });
    setVisibleColumns(obj);
  };

  return (
    <>
      <DataGridPro
        rows={dataList}
        columns={dataColumns}
        onCellClick={(params) => { params.colDef.headerName == 'Checkbox selection' ? {} : onViewClick(params); }}
        checkboxSelection
        disableSelectionOnClick
      //  onFilterModelChange={(data) => { setIsFilter(data.items && data.items.length > 0 || data.quickFilterValues && data.quickFilterValues.length > 0); }}
        filterModel={filterModel}
        filterMode="server"
        onFilterModelChange={(data) => { setFilterModel(data); onFilterChanges(data); }}
        onStateChange={(e) => {
          setFilteredRows(e.filter.filteredRowsLookup);
          setVisibleRows(isFilter && e.rowsMeta && e.rowsMeta.positions && e.rowsMeta.positions && e.rowsMeta.positions.length > 0 ? e.rowsMeta.positions.length : rowCount);
        }}
        onRowSelectionModelChange={(data) => {
          setSelectedRows(data);
        }}
        rowSelectionModel={selectedRows}
        rowHeight={45}
        slots={{
          toolbar: CustomToolBar,
        }}
        loading={loading}
        pagination
        initialState={{
          pagination: {
            paginationModel: { pageSize: limit, page: 0 },
          },
        }}
        sortingMode="server"
        sortingOrder={['asc', 'desc']}
        sortModel={sortModel}
        onSortModelChange={setSortingOrder}
        disableRowSelectionOnClick
        disableColumnResize={false}
        experimentalFeatures={{ newEditingApi: true }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            printOptions: { disableToolbarButton: true },
          },
          filterPanel: {
            linkOperators: ['and'],
          },
        }}
        onColumnVisibilityModelChange={(data) => { if (JSON.stringify(data) === JSON.stringify(showAllString)) showAll(); else setVisibleColumns(data); }}
        columnVisibilityModel={visibleColumns}
        rowCount={rowCount}
        paginationMode="server"
        page={page}
        onPaginationModelChange={(data) => handlePageChange(data.page)}
        pageSize={limit}
        rowsPerPageOptions={[10]}
      />
      <div id="print_report" className="d-none">
        <table align="center">
          <tbody>
            <tr>
              <td
                style={{ textAlign: 'left' }}
                colSpan={getTableHeaders('heading', 'property') && getTableHeaders('heading', 'property').length > 0
                  ? getTableHeaders('heading', 'property').length : '0'}
              >
                <b>
                  {exportFileName || ''}
                  {' '}
                  Report
                </b>
              </td>
            </tr>
            <tr>
              <td>Company</td>
              <td
                style={{ textAlign: 'left' }}
                colSpan={getTableHeaders('heading', 'property') && getTableHeaders('heading', 'property').length > 0 ? getTableHeaders('heading', 'property').length : '0'}
              >
                <b>
                  {' '}
                  {userInfo && userInfo.data
                    ? userInfo.data.company.name
                    : 'Company'}
                </b>
              </td>
            </tr>
            <tr>
              <td>{filters && <span>Filters</span>}</td>
              <td
                style={{ textAlign: 'left' }}
                colSpan={getTableHeaders('heading', 'property') && getTableHeaders('heading', 'property').length > 0 ? getTableHeaders('heading', 'property').length : '0'}
              >
                <b>{filters}</b>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <DataTable
          columns={getTableHeaders('heading', 'property')}
          data={getTableData()}
          modelName={modelName}
          propertyAsKey="id"
        />
        <Drawer
          PaperProps={{
            sx: { width: '25%' },
          }}
          anchor="right"
          open={showExport}
        >
          <DrawerHeader
            headerName="Export"
            onClose={() => setShowExport(false)}
          />

          <Autocomplete
            sx={{ padding: '0px 30px 0px 30px' }}
            name="Export"
            label="Export"
            formGroupClassName="m-1"
            open={open}
            size="small"
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            value={exportOption}
            onChange={(e, option) => { setExportOption(option); }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={ExportOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Select Format"
                className="without-padding"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <Button
            onClick={() => {
              if (exportOption.name === 'pdf') {
                downloadPdf();
                setShowExport(false);
                setAllReport(false);
                setExportOption('');
              } else if (exportOption.name === 'excel') {
                exportExcelTableToXlsx('print_report', title);
                setShowExport(false);
                setAllReport(false);
                setExportOption('');
              }
            }}
            type="button"
            className="header-export-btn"
            variant="contained"
          >
            Download
          </Button>
        </Drawer>
      </div>
    </>
  );
};

CommonGridStatic.propTypes = {
  onFilterChanges: () => { },
};
CommonGridStatic.defaultProps = {
  onFilterChanges: () => { },
};

export default CommonGridStatic;
