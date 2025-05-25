import MenuItem from '@mui/material/MenuItem';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import uniqBy from 'lodash/unionBy';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline, IoLinkOutline } from 'react-icons/io5';
import { RxReload } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';

import {
  Autocomplete,
  Button, IconButton,
  TextField,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import {
  DataGridPro, GridOverlay, GridToolbarColumnsButton,
  GridToolbarFilterButton, GridPagination,
} from '@mui/x-data-grid-pro';
import { FiSearch } from 'react-icons/fi';

import {
  FormControl,
} from '@material-ui/core';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  CgExport,
} from 'react-icons/cg';

import DataTable from '@shared/dataTable';
import ErrorContent from '@shared/errorContent';
import MuiTooltip from '@shared/muiTooltip';

import { Typography } from 'antd';
import { setSorting } from '../assets/equipmentService';
import { setInitialValues } from '../inventory/inventoryService';
import { AddThemeColor } from '../themes/theme';
import {
  exportExcelTableToXlsx,
  getCompanyTimezoneDate,
  getLocalTime,
  getTicketStatus,
  saveExtraLargPdfContent,
  getColumnArrayById,
} from '../util/appUtils';
import DrawerHeader from './drawerHeader';
import GridDateFilter from './gridDateFilter';

const CommonGrid = (props) => {
  const {
    tableData,
    columns,
    className,
    sx,
    moduleName,
    listCount,
    exportInfo,
    exportFileName,
    selectedRows,
    hxincidentStatusJson,
    setEditData,
    isSelection,
    filters,
    visibleColumns,
    setVisibleColumns,
    page,
    onFilterChanges,
    loading,
    onChangeCustomDate,
    rowCount,
    handlePageChange,
    createTabs,
    createOption,
    setStartExport,
    setRows,
    rows,
    limit,
    onClickRadioButton,
    setCustomVariable,
    setViewModal,
    setViewId,
    customVariable,
    configData,
    setAnswerModal,
    setSummaryModal,
    err,
    linkButton,
    showFooter,
    CustomFooter,
    setSelectedRows,
    placeholderText,
    setActive,
    setCurrentTab,
    isSet,
    currentTab,
    removeData,
    noHeader,
    disableFilters,
    componentClassName,
    exportCondition,
    reload,
    tabTable,
    moduleCustomHeader,
    setFilterFromOverview,
    disablePagination,
    leftPinnedColumns,
    rightPinnedColumns,
    disableShowAllButton,
    pdfStaticColumnWidth,
    updateSiteData,
    editMode,
    editModeRow,
    setEditModeRow,
    isToggleButton,
    defaultExcelId,
  } = props;
  const dispatch = useDispatch();

  const ExportOptions = [{ label: 'PDF', name: 'pdf' }, { label: 'EXCEL', name: 'excel' }];

  const { userInfo } = useSelector((state) => state.user);
  const [excelColumnFields, setExcelColumnFields] = useState([]);
  const [sortModel, setSortModel] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [open, setOpen] = useState(false);
  const [exportOption, setExportOption] = useState(ExportOptions[0]);
  const [filterModel, setFilterModel] = useState({
    items: [], logicOperator: 'and', quickFilterValues: [], quickFilterLogicOperator: 'and',
  });
  const [searchValue, setSearchValue] = useState('');
  const [isButtonHover, setButtonHover] = useState(false);

  const currentDate = getLocalTime(new Date());
  const title = `${exportFileName}_On_${currentDate}`;
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';

  const { sortedValue } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (sortedValue && sortedValue.sortField && sortedValue.sortBy) {
      setSortModel([
        {
          field: sortedValue.sortField,
          sort: sortedValue.sortBy.toString().toLowerCase(),
        },
      ]);
    }
  }, [sortedValue]);

  useEffect(() => {
    if (searchValue !== '') {
      onFilterChanges({ quickFilterValues: [searchValue] });
    }
  }, [searchValue]);

  useEffect(() => {
    if (visibleColumns) {
      const array = [];
      columns.map((column) => {
        if (visibleColumns[column.field]) {
          if (column.field !== 'corrective_action') {
            array.push(column.field);
          }
        }
      });
      setExcelColumnFields(array);
    }
  }, [visibleColumns]);

  const onRowClick = (params) => {
    /* setViewId(params.id);
    setViewModal(true); */
  };

  const onCellClick = (params) => {
    if (params.colDef.headerName === 'View Answers' && params.row.stage_id[1] === 'Published') {
      setViewId(params.id); setAnswerModal(true);
    } else if (params.colDef.headerName === 'Answers Summary' && params.row.stage_id[1] === 'Published') {
      setViewId(params.id); setSummaryModal(true);
    } else if (params.colDef.headerName === 'Survey URL' || params.colDef.headerName === 'Checkbox selection') {
      console.log(params);
    } else if (params.colDef.headerName === 'Action' && !params.colDef.actionType) {
      if (removeData) { removeData(params.id, (params.row.sender ? params.row.sender : '')); }
    } else {
      if (setEditData) {
        setEditData(params.row);
      }
      setViewId(params.id); setViewModal(true);
    }
  };

  const setSortingOrder = (data) => {
    if (data && data.length && Array.isArray(data)) {
      const obj = {
        sortBy: data[0].sort.toString().toUpperCase(),
        sortField: data[0].field,
      };
      // dispatch(setSorting(obj));
      setSortModel([
        {
          field: data[0].field,
          sort: data[0].sort,
        },
      ]);
    } else if (data === 'nodata') {
      // dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
      setSortModel([
        {
          field: 'DESC',
          sort: 'create_date',
        },
      ]);
    }
  };

  const PdfExportMenuItem = (props) => {
    const { hideMenu } = props;
    return (
      <MenuItem
        onClick={() => {
          hideMenu?.();
          downloadPdf();
        }}
        disabled={exportInfo.loading}
      >
        Export PDF
      </MenuItem>
    );
  };

  const ExcelExportMenuItem = (props) => {
    const { hideMenu } = props;
    return (
      <MenuItem
        onClick={() => {
          exportExcelTableToXlsx('print_report', title);
          hideMenu?.();
        }}
        disabled={(exportInfo.loading)}
      >
        Export Excel
      </MenuItem>
    );
  };
  const getTableHeaders = (header, property) => {
    const visibleColumnsField = excelColumnFields;
    const headers = [];
    visibleColumnsField.map((id) => {
      const findRowId = columns.find((column) => column.field === id);
      if (findRowId) {
        const obj = {};
        obj[header] = findRowId.headerName;
        obj[property] = findRowId.field;
        headers.push(obj);
      }
    });
    return headers;
  };

  const getTableData = () => {
    const { data } = exportInfo;
    const array = [];
    data
      && data.length
      && data.map((item) => {
        const row = {};
        row.id = item.id;
        excelColumnFields.forEach((field) => {
          const column = columns.find(
            (columnField) => columnField.field === field,
          );
          if (column) {
            row[field] = column && column.func
              ? column.func(item[field], configData || false)
              : item[field];
            row[field] = column.dateField ? getCompanyTimezoneDate(item[field], userInfo, column.dateField).toLocaleString() : row[field];
            row[field] = column.specialStatus ? getTicketStatus(item.state_id, item.is_on_hold_requested, item.is_cancelled).toLocaleString() : row[field];
          }
          array.push(row);
        });
      });
    return uniqBy(array, 'id');
  };

  const downloadPdf = () => {
    const customColumnWidth = pdfStaticColumnWidth || false;
    saveExtraLargPdfContent(
      `${exportFileName}`,
      getTableHeaders('header', 'dataKey'),
      getTableData(),
      `${title}.pdf`,
      companyName,
      filters,
      '',
      customColumnWidth,
    );
  };

  const onKeyEnter = (e) => {
    setSearchValue(e.target.value);
  };

  const CustomToolBar = () => (
    <>
      <header className="header-box2">
        <div className="insights-filter-box">
          <div className="commongrid-header-text">{`${moduleName} (${listCount})`}</div>
          <Tabs value={currentTab} variant="scrollable" scrollButtons>
            {createTabs && createTabs.enable && (
              createTabs.menuList && createTabs.menuList.map((menu) => createTabs.tabs.tabsList && createTabs.tabs.tabsList[menu] && (
                <Tab
                  label={createTabs.tabs.tabsList[menu].name}
                  value={createTabs.tabs.tabsList[menu].name}
                  onClick={() => {
                    dispatch(setCurrentTab(''));
                    setActive(createTabs.tabs.tabsList[menu].name);
                    isSet(true);
                    dispatch(setInitialValues(false, false, false, false));
                  }}
                />
              ))
            )}
          </Tabs>
        </div>
        <div className="insights-filter-box">
          {/* <GridToolbarQuickFilter
            InputProps={{
              disableUnderline: true,
              sx: {
                border: '1px solid #0000001F',
                padding: '5px',
                borderRadius: '4px',
                height: '31px',
                marginTop: '4.2px'
              },
              placeholder: placeholderText ? placeholderText : "Search...",
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch size={20} color={AddThemeColor({}).color} />
                </InputAdornment>
              ),
            }}
          /> */}
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
              placeholder={placeholderText || 'Search...'}
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
          {reload && (
            <MuiTooltip title="Refresh">
              <IconButton className="header-link-btn" color="primary" onClick={() => { if (!reload.loading) setCustomVariable(false); setSearchValue(''); setFilterModel({ items: [], quickFilterValues: [] }); reload.setReload(Math.random()); }}>
                {' '}
                <RxReload size={19} color={AddThemeColor({}).color} />
                {' '}
              </IconButton>
            </MuiTooltip>
          )}
          {linkButton?.show && (
            <MuiTooltip title={copySuccess ? 'Copied!' : 'Copy URL'}>
              <IconButton className="header-link-btn" color="primary" onMouseLeave={() => setCopySuccess(false)} onClick={() => { linkButton.onClick(); setCopySuccess(true); }}>
                {' '}
                <IoLinkOutline size={25} color={AddThemeColor({}).color} />
                {' '}
              </IconButton>
            </MuiTooltip>
          )}
          <GridDateFilter
            onClickRadioButton={onClickRadioButton}
            onChangeCustomDate={onChangeCustomDate}
            setCustomVariable={setCustomVariable}
            customVariable={customVariable}
            setFilterFromOverview={setFilterFromOverview}
          />
          <IconButton className="header-filter-btn">
            <GridToolbarColumnsButton />
          </IconButton>
          <IconButton className="header-filter-btn">
            <GridToolbarFilterButton />
          </IconButton>
          <IconButton className="header-filter-btn" disabled={tableData && tableData.length <= 0} onClick={() => { setShowExport(true); setStartExport(Math.random()); }}>
            <CgExport size={20} color={AddThemeColor({}).color} className="mb-1" />
            <span className="mt-1 ml-1 pl-1 mb-1" style={AddThemeColor({})}> Export </span>
          </IconButton>
          {createOption && createOption.enable && (
            <Button
              onClick={createOption.func}
              type="button"
              variant="contained"
              className="header-create-btn"
            >
              {createOption.text}
            </Button>
          )}
        </div>
      </header>
      {moduleCustomHeader && moduleCustomHeader.props && moduleCustomHeader.props.children && moduleCustomHeader.props.children.length && moduleCustomHeader.props.children[0] !== ''
        ? (
          <div className={`${moduleCustomHeader ? 'my-2 ml-2' : ''}`}>
            {moduleCustomHeader}
          </div>
        ) : ''}
    </>
  );
  const showAllString = { _check_: true };

  const showAll = () => {
    const obj = {};
    const identifiers = Object.keys(visibleColumns);
    // console.log(identifiers, 'identifiers')
    identifiers.filter((id) => {
      obj[id] = true;
    });
    setVisibleColumns(obj);
  };

  const handleRowSelection = (newSelection) => {
    // Filter the selected rows from the full tableData
    setRows(newSelection);
    if (setSelectedRows && isSelection && newSelection) {
      // Get selected rows from the current page
      const newlyChecked = tableData.filter((row) => newSelection.includes(row.id));

      // Get rows from previous selections that are NOT part of the current page (persist across pages)
      //  const persistedSelections = selectedRows.filter(
      //    (row) => !tableData.some((tableRow) => tableRow.id === row.id),
      // );

      // Merge persisted selections with newly checked rows
      // const finalSelectedRows = [...new Map([...persistedSelections, ...newlyChecked].map((row) => [row.id, row])).values()];

      setSelectedRows(newlyChecked);
    }
  };

  return (
    <div className={componentClassName}>
      <DataGridPro
        getRowId={(row) => row.id || row.sl_no}
        className={className}
        sx={sx}
        rows={tableData}
        columns={columns}
        rowHeight={60}
        slots={{
          toolbar: noHeader ? '' : CustomToolBar,
          footer: showFooter ? CustomFooter : undefined,
          noRowsOverlay: () => (
            <GridOverlay>
              {tabTable ? <p className="font-family-tab text-center">No Data Found</p> : <ErrorContent errorTxt="No Data Found" />}
            </GridOverlay>
          ),
        }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            printOptions: { disableToolbarButton: true },
          },
          filterPanel: { linkOperators: ['and'] },
        }}
        initialState={{
          pagination: {
            paginationModel: { pageSize: limit, page: 0 },
          },
          pinnedColumns: { left: leftPinnedColumns || [], right: rightPinnedColumns || [] },
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 150 },
            printOptions: { disableToolbarButton: true },
          },
          filterPanel: {
            linkOperators: ['and'],
          },
          columnsPanel: {
            disableHideAllButton: true,
            disableShowAllButton: !!disableShowAllButton,
          },
        }}
        filterMode={noHeader ? 'client' : 'server'}
        paginationModel={{
          page,
          pageSize: limit,
        }}
        filterModel={filterModel}
        disableColumnSelector={noHeader}
        onFilterModelChange={(data) => { setFilterModel(data); onFilterChanges(data); }}
        checkboxSelection={!noHeader || isSelection}
        onRowClick={onRowClick}
        onCellClick={onCellClick}
        disableRowSelectionOnClick
        sortingMode={noHeader ? 'client' : 'server'}
        sortModel={sortModel}
        onSortModelChange={(data) => setSortingOrder(data)}
        disableSelectionOnClick
        rowCount={rowCount}
        paginationMode={noHeader ? 'client' : 'server'}
        onRowSelectionModelChange={handleRowSelection}
        rowSelectionModel={isSelection ? getColumnArrayById(selectedRows, 'id') : rows}
        selectionModel={rows}
        loading={loading}
        onColumnVisibilityModelChange={(data) => { if (JSON.stringify(data) === JSON.stringify(showAllString)) showAll(); else setVisibleColumns(data); }}
        columnVisibilityModel={visibleColumns}
        page={page}
        onPaginationModelChange={(data) => handlePageChange(data.page)}
        pageSize={limit}
        rowsPerPageOptions={[]}
        pagination={!disablePagination}
        disableColumnFilter={!!disableFilters}
      />
      <div id={defaultExcelId || 'print_report'} className="d-none">
        <table align="center">
          <tbody>
            <tr>
              <td style={{ textAlign: 'left' }} colSpan={getTableHeaders('heading', 'property') && getTableHeaders('heading', 'property').length > 0 ? getTableHeaders('heading', 'property').length : '0'}>
                <b>
                  {exportFileName}
                  {' '}
                  Report
                </b>
              </td>
            </tr>
            <tr>
              <td>Company</td>
              <td style={{ textAlign: 'left' }} colSpan={getTableHeaders('heading', 'property') && getTableHeaders('heading', 'property').length > 0 ? getTableHeaders('heading', 'property').length : '0'}>
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
              <td style={{ textAlign: 'left' }} colSpan={getTableHeaders('heading', 'property') && getTableHeaders('heading', 'property').length > 0 ? getTableHeaders('heading', 'property').length : '0'}>
                <b>{filters}</b>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        {exportInfo && (
          <DataTable
            columns={getTableHeaders('heading', 'property')}
            data={getTableData()}
            propertyAsKey="id"
          />
        )}
      </div>
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
        {((exportCondition && exportCondition.show && exportCondition.filter) || !exportCondition) ? (
          <>
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
              disableClearable={!(exportOption)}
              disabled={exportInfo && exportInfo.loading}
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
            <div
              style={{
                textAlign: 'center',
                padding: exportInfo && exportInfo.loading ? '20px' : '0px',
              }}
            >
              {exportInfo && exportInfo.loading && (
                <CircularProgress color="primary" />
              )}
            </div>
            <Button
              onClick={() => {
                if (exportOption.name === 'pdf') {
                  downloadPdf();
                  setShowExport(false);
                  setExportOption(ExportOptions[0]);
                } else if (exportOption.name === 'excel') {
                  exportExcelTableToXlsx(defaultExcelId || 'print_report', title);
                  setShowExport(false);
                  setExportOption(ExportOptions[0]);
                }
              }}
              type="button"
              disabled={exportInfo?.loading && exportOption && !exportOption.name}
              className="header-export-btn"
              variant="contained"
            >
              Download
            </Button>
          </>
        ) : (
          <Typography className="text-center">
            Apply any filter to export data
          </Typography>
        )}
      </Drawer>
    </div>
  );
};

export default CommonGrid;
