/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unstable-nested-components */
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import uniqBy from 'lodash/unionBy';
import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import { IoCloseOutline, IoLinkOutline } from 'react-icons/io5';
import { RxReload } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';

import {
  Autocomplete,
  Button, IconButton,
  TextField, ButtonGroup, Chip,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import {
  DataGridPro, GridOverlay, GridToolbarColumnsButton,
  GridToolbarFilterButton,
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
import { BsStars } from 'react-icons/bs';

import DataTable from '@shared/dataTable';
import ErrorContent from '@shared/errorContent';
import MuiTooltip from '@shared/muiTooltip';

import { Typography } from 'antd';
import { useTheme } from '../ThemeContext';
import { setSorting } from '../assets/equipmentService';
import { setInitialValues } from '../inventory/inventoryService';
import { setActive as activeCurrentTab } from '../survey/surveyService';
import { AddThemeColor } from '../themes/theme';
import {
  exportExcelTableToXlsx,
  getCompanyTimezoneDate,
  extractValueObjectsDisplay,
  getDefaultNoValue,
  getLocalTime,
  getTicketStatus,
  debounceCancel,
  saveExtraLargPdfContent,
  getColumnArrayById,
  getModuleDisplayName,
} from '../util/appUtils';
import DrawerHeader from './drawerHeader';
import GridDateFilter from './gridDateFilter';
import QrExport from '../assets/dataExport/qrExport';

const CommonGrid = React.memo((props) => {
  const { themes } = useTheme();
  const {
    tableData,
    columns,
    className,
    sx,
    moduleName,
    isAI,
    setOpenAI,
    listCount,
    exportInfo,
    isSearch,
    exportFileName,
    dateField,
    showFooter,
    CustomFooter,
    setSelectedRows,
    selectedRows,
    hxincidentStatusJson,
    filters,
    buttonFilterType,
    isButtonFilter,
    setButtonFilterType,
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
    onResetAiFilter,
    aiFilter,
    aiPrompt,
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
    placeholderText,
    setActive,
    setCurrentTab,
    isSet,
    currentTab,
    removeData,
    noHeader,
    isSingleSelect,
    disableFilters,
    componentClassName,
    exportCondition,
    reload,
    moduleCustomHeader,
    buttonNames,
    setFilterFromOverview,
    disablePagination,
    leftPinnedColumns,
    rightPinnedColumns,
    disableShowAllButton,
    pdfStaticColumnWidth,
    updateSiteData,
    editMode,
    isQRExport,
    editModeRow,
    setEditModeRow,
    isToggleButton,
    defaultExcelId,
    isModuleDisplayName,
  } = props;
  const dispatch = useDispatch();
  const { headerData } = useSelector((state) => state.header);

  const prevSelectedRows = React.useRef(selectedRows || []);

  let ExportOptions = [{ label: 'PDF', name: 'pdf' }, { label: 'EXCEL', name: 'excel' }];

  if (moduleName === 'Assets List' && isQRExport) {
    ExportOptions = [{ label: 'PDF', name: 'pdf' }, { label: 'EXCEL', name: 'excel' }, { label: 'QR', name: 'QR' }];
  }

  const anchorRef = React.useRef(null);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [excelColumnFields, setExcelColumnFields] = useState([]);
  const [sortModel, setSortModel] = useState([
    {
      field: 'DESC',
      sort: dateField || 'create_date',
    },
  ]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [exportOption, setExportOption] = useState(ExportOptions[0]);
  const [filterModel, setFilterModel] = useState({
    items: [], logicOperator: 'and', quickFilterValues: [], quickFilterLogicOperator: 'and',
  });
  const [searchValue, setSearchValue] = useState('');
  const [isButtonHover, setButtonHover] = useState(false);

  const exportFileDisplayName = isModuleDisplayName && getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], headerData?.moduleName, 'display') !== '' ? getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], headerData?.moduleName, 'display') : exportFileName;

  const currentDate = getLocalTime(new Date());
  const title = `${exportFileName}_On_${currentDate}`;
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';

  const { sortedValue } = useSelector((state) => state.equipment);

  useEffect(() => {
    dispatch(setSorting({ sortBy: 'DESC', sortField: dateField || 'create_date' }));
    setSortModel([
      {
        field: 'DESC',
        sort: dateField || 'create_date',
      },
    ]);
  }, []);

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
    if (params.colDef.headerName == 'View Answers' && params.row.stage_id[1] == 'Published') { dispatch(activeCurrentTab('Today')); setViewId(params.id); setAnswerModal(true); } else if (params.colDef.headerName == 'Answers Summary' && params.row.stage_id[1] == 'Published') { dispatch(activeCurrentTab('Today')); setViewId(params.id); setSummaryModal(true); } else if (params.colDef.headerName == 'Survey URL' || params.colDef.headerName == 'Checkbox selection') { } else if (params.colDef.headerName == 'Action' && !params.colDef.actionType && removeData) { removeData(params.id, (params.row.sender ? params.row.sender : '')); } else { setViewId(params.id); setViewModal(true); }
  };

  const setSortingOrder = (data) => {
    if (data && data.length && Array.isArray(data)) {
      const obj = {
        sortBy: data[0].sort.toString().toUpperCase(),
        sortField: data[0].field,
      };
      dispatch(setSorting(obj));
    } else if (data === 'nodata') {
      dispatch(setSorting({ sortBy: 'DESC', sortField: dateField || 'create_date' }));
      setSortModel([
        {
          field: 'DESC',
          sort: dateField || 'create_date',
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
            row[field] = column.isAlternate && column.isAlternate === 'yes' && row[field] ? extractValueObjectsDisplay(item[column.alternate]) : getDefaultNoValue(row[field]);
          }
          array.push(row);
        });
      });
    return uniqBy(array, 'id');
  };

  const downloadPdf = () => {
    const customColumnWidth = pdfStaticColumnWidth || false;
    saveExtraLargPdfContent(
      `${exportFileDisplayName}`,
      getTableHeaders('header', 'dataKey'),
      getTableData(),
      `${title}.pdf`,
      companyName,
      filters,
      '',
      customColumnWidth,
    );
  };

  const handleQRExport = () => {
    setTimeout(() => {
      const content = document.getElementById('print_qr_report');
      const pri = document.getElementById('print_frame').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML);
      pri.document.close();
      pri.focus();
      pri.print();
      setShowExport(false);
      setExportOption(ExportOptions[0]);
    }, 2000);
  };

  const onKeyEnter = (e) => {
    setSearchValue(e.target.value);
  };

  const handleToggle = () => {
    setOpenMenu((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenMenu(false);
  };

  const CustomToolBar = () => (
    <>
      <header className="header-box2">
        <div className="insights-filter-box">
          <div className="commongrid-header-text">
            {`${moduleName} (${listCount})`}
            {isAI && aiFilter && (
              <MuiTooltip title={aiPrompt}>
                <Chip
                  label={aiPrompt}
                  color="default"
                  sx={{ width: '200px' }}
                  className="ml-1 cursor-pointer font-family-tab font-tiny"
                  onDelete={onResetAiFilter}
                />
              </MuiTooltip>
            )}
          </div>
          {createTabs && createTabs.enable && (
          <Tabs value={currentTab} variant="scrollable" scrollButtons>

            {createTabs.menuList && createTabs.menuList.map((menu) => createTabs.tabs.tabsList && createTabs.tabs.tabsList[menu] && (
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
            ))}
          </Tabs>
          )}
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
                ...(themes === 'light' && {
                  '& .MuiOutlinedInput-root': {
                    color: '#000000', // Black text in input for light mode
                  },
                  '& .MuiInputAdornment-root': {
                    color: '#000000', // Black icons for adornments
                  },
                  '& .MuiInputBase-input': {
                    color: themes === 'light' ? '#FFFFFF' : '#000000', // Input text color
                    backgroundColor: `${themes === 'light' ? '#2D2E2D' : '#FFFFFF'} !important`, // Input background color
                  },
                }),
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
                  <FiSearch size={20} color={themes === 'light' ? 'white' : AddThemeColor({}).color} />
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
                      <IoCloseOutline size={22} fontSize="small" color={themes === 'light' ? 'white' : AddThemeColor({}).color} />
                    </IconButton>
                  </MuiTooltip>
                  )}
                </InputAdornment>
              )}
            />
          </FormControl>
          {reload && (
            <MuiTooltip title="Refresh">
              <IconButton className="header-link-btn" color="primary" onClick={() => { dispatch(setSorting({ sortBy: 'DESC', sortField: dateField || 'create_date' })); if (!reload.loading) setCustomVariable(false); setSearchValue(''); setFilterModel({ items: [], quickFilterValues: [] }); reload.setReload(Math.random()); }}>
                {' '}
                <RxReload size={19} color={themes === 'light' ? '#000000' : AddThemeColor({}).color} />
                {' '}
              </IconButton>
            </MuiTooltip>
          )}
          {isButtonFilter && (
            <div className="mb-2 mt-2 ml-2 p-2">
              <ButtonGroup
                variant="contained"
                size="small"
                aria-label="Basic button group"
              >
                {!buttonNames && (
                  <>
                    <Button
                      onClick={() => setButtonFilterType('All')}
                      variant={buttonFilterType === 'All' ? 'contained' : 'outlined'}
                      color={buttonFilterType === 'All' ? 'primary' : 'inherit'}
                    >
                      All Actions
                    </Button>
                    <Button
                      onClick={() => setButtonFilterType('My')}
                      variant={buttonFilterType === 'My' ? 'contained' : 'outlined'}
                      color={buttonFilterType === 'My' ? 'primary' : 'inherit'}
                    >
                      My Actions
                    </Button>
                  </>
                )}
                {buttonNames && buttonNames.length > 0 && (
                  <>
                    {buttonNames.map((option) => (
                      <Button
                        onClick={() => setButtonFilterType(option.value)}
                        variant={buttonFilterType === option.value ? 'contained' : 'outlined'}
                        color={buttonFilterType === option.value ? 'primary' : 'inherit'}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </>
                )}
              </ButtonGroup>
            </div>
          )}
          {linkButton?.show && (
            <MuiTooltip title={copySuccess ? 'Copied!' : 'Copy URL'}>
              <IconButton className="header-link-btn" color="primary" onMouseLeave={() => setCopySuccess(false)} onClick={() => { linkButton.onClick(); setCopySuccess(true); }}>
                {' '}
                <IoLinkOutline size={25} color={themes === 'light' ? '#000000' : AddThemeColor({}).color} />
                {' '}
              </IconButton>
            </MuiTooltip>
          )}
          {isAI && (

          <MuiTooltip title="Ask AI (Beta)">
            <IconButton className="header-filter-btn" onClick={setOpenAI}>
              <BsStars size={20} color={themes === 'light' ? '#000000' : AddThemeColor({}).color} className="mb-1" />
            </IconButton>
          </MuiTooltip>

          )}
          <GridDateFilter
            onClickRadioButton={onClickRadioButton}
            onChangeCustomDate={onChangeCustomDate}
            setCustomVariable={setCustomVariable}
            customVariable={customVariable}
            setFilterFromOverview={setFilterFromOverview}
            themes={themes}
          />
          <IconButton className="header-filter-btn">
            <GridToolbarColumnsButton style={{ color: themes === 'light' ? '#000000' : AddThemeColor({}).color }} />
          </IconButton>
          <IconButton className="header-filter-btn">
            <GridToolbarFilterButton style={{ color: themes === 'light' ? '#000000' : AddThemeColor({}).color }} />
          </IconButton>
          {!isSearch && (
          <IconButton className="header-filter-btn" disabled={tableData && tableData.length <= 0} onClick={() => { setShowExport(true); setStartExport(Math.random()); }}>
            <CgExport size={20} color={themes === 'light' ? '#000000' : AddThemeColor({}).color} className="mb-1" />
            <span className="mt-1 ml-1 pl-1 mb-1" style={{ color: themes === 'light' ? '#000000' : AddThemeColor({}).color }}> Export </span>
          </IconButton>
          )}
          {createOption && createOption.enable && !createOption.dropdown && (
            <Button
              onClick={createOption.func}
              type="button"
              variant="contained"
              className="header-create-btn"
            >
              {createOption.text}
            </Button>
          )}
          {createOption && createOption.enable && createOption.dropdown && (
            <>
              <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="Button group with a nested menu"
                sx={{ boxShadow: 'none' }}
              >
                <Button
                  onClick={createOption.func}
                  type="button"
                  variant="contained"
                  className="header-create-btn"
                >
                  {createOption.text}
                </Button>
                <Button
                  size="small"
                  aria-controls={openMenu ? 'split-button-menu' : undefined}
                  aria-expanded={openMenu ? 'true' : undefined}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  className="header-create-btn-no-space"
                  onClick={handleToggle}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Popper
                sx={{ zIndex: 1 }}
                open={openMenu}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu" autoFocusItem>
                          {createOption.options.map((option, index) => (
                            <MenuItem
                              key={option}
                              // selected={index === selectedIndex}
                              onClick={() => { option.func(); setOpenMenu(false); }}
                            >
                              {option.name}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>

            </>
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

  const memoizedRows = useMemo(() => tableData, [tableData]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const rowsRef = React.useRef(tableData);
  const selectedRowsRef = React.useRef(selectedRows || []);

  useEffect(() => {
    rowsRef.current = tableData;
  }, [tableData]);

  useEffect(() => {
    selectedRowsRef.current = selectedRows || [];
  }, [selectedRows]);

  const debouncedHandleRowSelection = useMemo(
    () => debounceCancel((newSelection) => {
      console.log('debouncedHandleRowSelection');
      setButtonHover(false);

      if (!setSelectedRows || !isSearch) {
        setRows(newSelection);
        return;
      }

      if (loading || (Array.isArray(newSelection) && !newSelection.length)) {
        console.log('Skipping selection update: loading or invalid selection');
        return;
      }
      const currentRows = rowsRef.current;
      const selectedRowsPrev = selectedRowsRef.current;
      const newSelectedIds = new Set(newSelection);

      // ✅ Get rows selected on the current page
      const newlyChecked = currentRows.filter((row) => newSelectedIds.has(row.id));

      // ✅ Keep previously selected rows that are NOT in the current page (cross-page persist)
      const previouslySelectedAndPersisted = selectedRowsPrev.filter(
        (row) => !currentRows.some((r) => r.id === row.id),
      );

      // ✅ Merge previous persisted + current newly selected
      const finalSelectedRows = [
        ...new Map([...previouslySelectedAndPersisted, ...newlyChecked].map((row) => [row.id, row])).values(),
      ];

      // 🔁 Update state only if the selection actually changed
      const prevIds = new Set(selectedRowsPrev.map((r) => r.id));
      const nextIds = new Set(finalSelectedRows.map((r) => r.id));
      const isEqual = prevIds.size === nextIds.size && [...prevIds].every((id) => nextIds.has(id));

      if (!isEqual) {
        console.log('Updated selected rows');
        setSelectedRows(finalSelectedRows);
        selectedRowsRef.current = finalSelectedRows;
        prevSelectedRows.current = finalSelectedRows;
      } else {
        console.log('Selection unchanged – skipping state update');
      }
    }, 300),
    [setSelectedRows, isSearch, loading],
  );

  const handleSelectionChange = (newSelection) => {
    debouncedHandleRowSelection(newSelection);
  };

  const showAll = () => {
    const obj = {};
    const identifiers = Object.keys(visibleColumns);
    // console.log(identifiers, 'identifiers')
    identifiers.filter((id) => {
      obj[id] = true;
    });
    setVisibleColumns(obj);
  };

  // Styles: memoized so recompute only when theme changes
  const gridStyles = useMemo(() => ({
    ...(themes === 'light' && {
      '& .MuiDataGrid-virtualScrollerContent': {
        backgroundColor: '#2D2E2D',
        color: '#F7FAFC',
      },
      '.MuiDataGrid-columnHeader': {
        backgroundColor: '#2D2E2D !important',
        color: 'white',
        '& .MuiDataGrid-columnHeader--hover': {
          color: 'white',
        },
        '& .MuiDataGrid-sortIcon': {
          color: 'white',
        },
        '& .MuiDataGrid-menuIconButton': {
          color: 'white',
        },
        '& .MuiDataGrid-menuIconButton:hover, & .MuiDataGrid-sortIcon:hover': {
          color: '#F7FAFC',
        },
      },
      '& .MuiCheckbox-root': {
        color: '#F7FAFC',
      },
      '& .Mui-checked': {
        color: '#F7FAFC',
      },
      '& .MuiDataGrid-cell': {
        borderBottom: '1px solid #000000',
      },
      '& .MuiDataGrid-columnHeadersInner': {
        backgroundColor: '#2D2E2D !important',
        color: '#F7FAFC',
      },
    }),
    ...sx,
  }), [themes, sx]);

  const initialState = useMemo(() => ({
    pagination: {
      paginationModel: { pageSize: limit, page: 0 },
    },
    pinnedColumns: {
      left: leftPinnedColumns || [],
      right: rightPinnedColumns || [],
    },
  }), [limit, leftPinnedColumns, rightPinnedColumns]);

  const slotProps = useMemo(() => ({
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
  }), [disableShowAllButton]);

  // Row Selection
  const rowSelectionModel = useMemo(() => (
    selectedRows && isSearch
      ? getColumnArrayById(selectedRows, 'id')
      : getColumnArrayById(rows, 'id') // ensure it's always an array of IDs
  ), [selectedRows, isSearch, rows]);

  const handleVisibilityChange = useCallback((data) => {
    if (JSON.stringify(data) === JSON.stringify(showAllString)) {
      showAll?.();
    } else {
      setVisibleColumns?.(data);
    }
  }, [showAllString, showAll, setVisibleColumns]);

  const customNoRowsOverlay = useCallback(() => (
    <GridOverlay>
      {showFooter
        ? <p className="font-family-tab text-center">No Data Found</p>
        : <ErrorContent errorTxt="No Data Found" />}
    </GridOverlay>
  ), [showFooter]);

  return (
    <div className={componentClassName}>
      <DataGridPro
        getRowId={(row) => row.id || row.sl_no}
        className={className}
        sx={gridStyles}
        rows={memoizedRows}
        columns={memoizedColumns}
        rowHeight={45}
        slots={{
          footer: showFooter ? CustomFooter : undefined,
          toolbar: noHeader ? '' : CustomToolBar,
          noRowsOverlay: customNoRowsOverlay,
        }}
        initialState={initialState}
        slotProps={slotProps}
        filterMode={noHeader ? 'client' : 'server'}
        paginationModel={{
          page,
          pageSize: limit,
        }}
        filterModel={filterModel}
        onFilterModelChange={(data) => { setFilterModel(data); onFilterChanges(data); }}
        checkboxSelection={!noHeader && !isSingleSelect}
        onRowClick={onRowClick}
        onCellClick={onCellClick}
        disableRowSelectionOnClick
        sortingMode={noHeader ? 'client' : 'server'}
        sortingOrder={['asc', 'desc']}
        sortModel={sortModel}
        onSortModelChange={setSortingOrder}
        disableSelectionOnClick
        rowCount={rowCount}
        paginationMode={noHeader ? 'client' : 'server'}
        onRowSelectionModelChange={handleSelectionChange}
        rowSelectionModel={rowSelectionModel}
        loading={loading}
        onColumnVisibilityModelChange={handleVisibilityChange}
        columnVisibilityModel={visibleColumns}
        onPaginationModelChange={(model) => {
          if (model.page !== page) handlePageChange(model.page);
        }}
        pageSizeOptions={[10]}
        pagination={!disablePagination}
        disableColumnFilter={!!disableFilters}
      />
      <div id={defaultExcelId || 'print_report'} className="d-none">
        <table align="center">
          <tbody>
            <tr>
              <td style={{ textAlign: 'left' }} colSpan={getTableHeaders('heading', 'property') && getTableHeaders('heading', 'property').length > 0 ? getTableHeaders('heading', 'property').length : '0'}>
                <b>
                  {exportFileDisplayName}
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
      {exportOption && exportOption.name === 'QR'
        ? (
          <div className="hidden-div" id="print_qr_report">
            <QrExport data={exportInfo && exportInfo.data ? exportInfo.data : []} />
            <iframe name="print_frame" title="Equipments_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
          </div>
        )
        : ''}
      <Drawer
        PaperProps={{
          sx: { width: '25%' },
        }}
        anchor="right"
        open={showExport}
      >
        <DrawerHeader
          headerName="Export"
          onClose={() => { setShowExport(false); }}
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
                } else if (exportOption.name === 'QR') {
                  handleQRExport();
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
});

export default CommonGrid;
