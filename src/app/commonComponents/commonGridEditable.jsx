/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import ButtonGroup from '@mui/material/ButtonGroup';
import {
  DataGridPro,
  GridActionsCellItem,
  GridOverlay,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';

import {
  FormControl,
} from '@material-ui/core';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button, IconButton,
  TextField, Autocomplete, Switch, Alert,
} from '@mui/material';
import uniqBy from 'lodash/unionBy';
import Drawer from '@mui/material/Drawer';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { darken } from '@mui/material/styles';
import DataTable from '@shared/dataTable';
import MuiTooltip from '@shared/muiTooltip';
import {
  CgExport,
} from 'react-icons/cg';
import { FiSearch } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { RxReload } from 'react-icons/rx';
import { Typography } from 'antd';
import CircularProgress from '@mui/material/CircularProgress';
import BulkUpload from '@shared/bulkUpload';
import { infoValue } from '../adminSetup/utils/utils';
import { setSorting } from '../assets/equipmentService';
import { resetBulkUpdate } from '../helpdesk/actions';
import {
  createBulkData,
  updateBulkData,
} from '../helpdesk/ticketService';
import {
  getDeleteChecklist,
  resetDeleteChecklist,
} from '../adminSetup/maintenanceConfiguration/maintenanceService';
import { AddThemeColor } from '../themes/theme';
import {
  exportExcelTableToXlsx,
  getArrayFormatCreate12,
  getArrayFormatUpdate12,
  getCompanyTimezoneDate,
  getTicketStatus,
  saveExtraLargPdfContent,
  getLocalTime,
  getColumnArrayById,
  generateErrorMessage,
  trimArrayofObjectValue,
  deleteSpecificKeyfromArray,
} from '../util/appUtils';
import DrawerHeader from './drawerHeader';
import GridDateFilter from './gridDateFilter';
import QrExport from '../assets/dataExport/qrExport';
import { useTheme } from '../ThemeContext';

const CommonGridEditable = (props) => {
  const { themes } = useTheme();
  const {
    columns,
    componentClassName,
    rows,
    setRows,
    setRowselected,
    rowselected,
    loadingData,
    className,
    dependencyColumsReload,
    createOption,
    dataLoading,
    moduleName,
    moduleDescription,
    listCount,
    editModeRow,
    setActiveType,
    isActiveFilter,
    isUserActive,
    setEditModeRow,
    appModelsName,
    defaultFields,
    handlePageChange,
    page,
    rowCount,
    limit,
    placeholderText,
    onFilterChanges,
    onClickRadioButton,
    onChangeCustomDate,
    setCustomVariable,
    customVariable,
    setFilterFromOverview,
    setStartExport,
    reload,
    setVisibleColumns,
    visibleColumns,
    disableShowAllButton,
    exportInfo,
    exportFileName,
    exportCondition,
    filters,
    pdfStaticColumnWidth,
    noHeader,
    configData,
    bulkOption,
    moduleCustomHeader,
    errorData,
    trimFields,
    ishideEditable,
    filterModalReset,
    setRowAllData,
    isStickyFooter,
    ishideDateFilter,
    ishideColumns,
    ishideExport,
    ishidePagination,
    deleteOption,
    isQRExport,
    deleteFieldsWhenUpdate,
    setViewModal,
    setViewId,
    helpertext,
  } = props;
  const dispatch = useDispatch();
  let ExportOptions = [{ label: 'PDF', name: 'pdf' }, { label: 'EXCEL', name: 'excel' }];

  if (isQRExport) {
    ExportOptions = [{ label: 'PDF', name: 'pdf' }, { label: 'EXCEL', name: 'excel' }, { label: 'QR', name: 'QR' }];
  }

  const [sortModel, setSortModel] = useState([
    {
      field: 'DESC',
      sort: 'create_date',
    },
  ]);
  const { sortedValue } = useSelector((state) => state.equipment);
  const { checklistDeleteInfo } = useSelector((state) => state.maintenance);
  const [searchValue, setSearchValue] = useState('');
  const [isButtonHover, setButtonHover] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [excelColumnFields, setExcelColumnFields] = useState([]);
  const [exportOption, setExportOption] = useState(ExportOptions[0]);
  const [open, setOpen] = useState(false);
  const [bulkUploadModal, showBulkUploadModal] = useState(false);
  const [filterModel, setFilterModel] = useState({
    items: [], logicOperator: 'and', quickFilterValues: [], quickFilterLogicOperator: 'and',
  });
  const { userInfo } = useSelector((state) => state.user);
  const currentDate = getLocalTime(new Date());
  const title = `${exportFileName}_On_${currentDate}`;
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';

  const {
    updateBulkInfo, createBulkInfo,
  } = useSelector((state) => state.ticket);

  const [isSaving, setIsSaving] = React.useState(false);
  // const [editModeRow, setEditModeRow] = React.useState(false);

  const apiRef = useGridApiRef();

  const [hasUnsavedRows, setHasUnsavedRows] = React.useState(false);
  const unsavedChangesRef = React.useRef({
    unsavedRows: {},
    rowsBeforeChange: {},
  });

  useEffect(() => {
    dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
    setSortModel([
      {
        field: 'DESC',
        sort: 'create_date',
      },
    ]);
  }, []);

  useEffect(() => {
    if (filterModalReset) {
      setSearchValue('');
      setFilterModel({ items: [], quickFilterValues: [] });
      reload.setReload(Math.random());
    }
  }, [filterModalReset]);

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

  const setSortingOrder = (data) => {
    if (data && data.length && Array.isArray(data)) {
      const obj = {
        sortBy: data[0].sort.toString().toUpperCase(),
        sortField: data[0].field,
      };
      dispatch(setSorting(obj));
    } else if (data === 'nodata') {
      dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
      setSortModel([
        {
          field: 'DESC',
          sort: 'create_date',
        },
      ]);
    }
  };

  useEffect(() => {
    if (checklistDeleteInfo && checklistDeleteInfo.loading) {
      setIsSaving(true);
    } else if (checklistDeleteInfo && checklistDeleteInfo.data && checklistDeleteInfo.data.length) {
      setIsSaving(false);
      setHasUnsavedRows(false);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
      dispatch(resetDeleteChecklist());
    } else if ((checklistDeleteInfo && checklistDeleteInfo.data && !checklistDeleteInfo.data.length) || (checklistDeleteInfo && checklistDeleteInfo.err)) {
      setIsSaving(false);
      // dispatch(resetDeleteChecklist());
    }
  }, [checklistDeleteInfo]);

  useEffect(() => {
    if (updateBulkInfo && updateBulkInfo.loading) {
      setIsSaving(true);
    } else if (updateBulkInfo && updateBulkInfo.data && updateBulkInfo.data.length) {
      setIsSaving(false);
      setHasUnsavedRows(false);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
      // dispatch(resetBulkUpdate());
    } else if ((updateBulkInfo && updateBulkInfo.data && !updateBulkInfo.data.length) || (updateBulkInfo && updateBulkInfo.err)) {
      setIsSaving(false);
      dispatch(resetBulkUpdate());
    }
  }, [updateBulkInfo]);

  useEffect(() => {
    if (createBulkInfo && createBulkInfo.loading) {
      setIsSaving(true);
    } else if (createBulkInfo && createBulkInfo.data && createBulkInfo.data.length) {
      setIsSaving(false);
      setHasUnsavedRows(false);
      unsavedChangesRef.current = {
        unsavedRows: {},
        rowsBeforeChange: {},
      };
      dispatch(resetBulkUpdate());
    } else if ((createBulkInfo && createBulkInfo.data && !createBulkInfo.data.length) || (createBulkInfo && createBulkInfo.err)) {
      if (unsavedChangesRef && unsavedChangesRef.current && unsavedChangesRef.current.unsavedRows) {
        const dataMissed = Object.values(
          unsavedChangesRef.current.unsavedRows,
        ).filter((row) => row._action === 'add');
        const emptyAdd = rows.filter((item) => !(item._action && item._action === 'add'));
        const newArr = [...emptyAdd, ...dataMissed];
        setRows(newArr);
      } else {
        setHasUnsavedRows(false);
      }
      setIsSaving(false);
      dispatch(resetBulkUpdate());
    }
  }, [createBulkInfo]);

  const onCellClick = (params) => {
    if (params.colDef.headerName !== 'Action' && params.colDef.headerName !== 'Checkbox selection' && setViewId && params.row.active && !editModeRow) { setViewId(params.id); setViewModal(true); } else if (params.colDef.headerName == 'Checkbox selection') { }
  };

  const columnsEditable = React.useMemo(() => (editModeRow ? [
    ...columns, (
      {
        headerName: 'Actions',
        field: 'actions',
        type: 'actions',
        getActions: ({ id, row }) => [
          <MuiTooltip title="Undo">
            <span>
              <GridActionsCellItem
                icon={<RestoreIcon />}
                label="Discard changes"
                disabled={unsavedChangesRef.current.unsavedRows[id] === undefined}
                onClick={() => {
                  apiRef.current.updateRows([
                    unsavedChangesRef.current.rowsBeforeChange[id],
                  ]);
                  delete unsavedChangesRef.current.rowsBeforeChange[id];
                  delete unsavedChangesRef.current.unsavedRows[id];
                  setHasUnsavedRows(
                    Object.keys(unsavedChangesRef.current.unsavedRows).length > 0,
                  );
                }}
              />
            </span>
          </MuiTooltip>,
          <MuiTooltip title="Delete">
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              // disabled={!isDeletable}
              onClick={() => {
                unsavedChangesRef.current.unsavedRows[id] = {
                  ...row,
                  _action: 'delete',
                };
                if (!unsavedChangesRef.current.rowsBeforeChange[id]) {
                  unsavedChangesRef.current.rowsBeforeChange[id] = row;
                }
                setHasUnsavedRows(true);
                apiRef.current.updateRows([row]); // to trigger row render
              }}
            />
          </MuiTooltip>,
        ],
      }),
  ] : [...columns]), [unsavedChangesRef, apiRef, { dependencyColumsReload }]);

  const [loading, setLoading] = React.useState(false);

  const processRowUpdate = (newRow, oldRow) => {
    const rowId = newRow.id;
    if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
      unsavedChangesRef.current.unsavedRows[rowId] = newRow;
    } else {
      // unsavedChangesRef.current.unsavedRows[rowId] = oldRow;
      apiRef.current.updateRows([oldRow]);
    }
    if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
      unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
    }
    setHasUnsavedRows(
      Object.keys(unsavedChangesRef.current.unsavedRows).length > 0,
    );
    // rows[index] = newRow;
    // setRows(rows);
    return newRow;

    /* const rowId = newRow.id;
    const diff = {};
    Object.keys(oldRow).forEach((key) => {
      if (newRow[key] && oldRow[key] !== newRow[key]) {
        diff[key] = newRow[key];
        diff.id = newRow.id;
        if (newRow._action) {
          diff._action = newRow._action;
        }
      }
    });

    unsavedChangesRef.current.unsavedRows[rowId] = (Object.keys(diff).length > 0) ? diff : {};
    if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
      unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
    }
    setHasUnsavedRows(true);
    return newRow; */
  };

  const discardChanges = () => {
    setHasUnsavedRows(false);
    apiRef.current.updateRows(
      Object.values(unsavedChangesRef.current.rowsBeforeChange),
    );
    unsavedChangesRef.current = {
      unsavedRows: {},
      rowsBeforeChange: {},
    };
  };

  const saveChanges = async () => {
    try {
      // Persist updates in the database
      setIsSaving(true);

      // setIsSaving(false);
      const rowsToDelete = Object.values(
        unsavedChangesRef.current.unsavedRows,
      ).filter((row) => row._action === 'delete');

      const rowsToAdd = Object.values(
        unsavedChangesRef.current.unsavedRows,
      ).filter((row) => row._action === 'add');

      const rowsToUpdate = Object.values(
        unsavedChangesRef.current.unsavedRows,
      ).filter((row) => !row._action);
      if (rowsToUpdate && rowsToUpdate.length) {
        const newRowUpdate = deleteFieldsWhenUpdate && deleteFieldsWhenUpdate.length > 0 ? deleteSpecificKeyfromArray(rowsToUpdate, deleteFieldsWhenUpdate) : rowsToUpdate;
        const trimValuesUpdate = trimFields && trimFields.length > 0
          ? trimArrayofObjectValue(newRowUpdate, trimFields) : newRowUpdate;
        await dispatch(updateBulkData(appModelsName, getArrayFormatUpdate12(trimValuesUpdate)));
      }

      if (rowsToAdd && rowsToAdd.length) {
        rowsToAdd.map((bodyData) => {
          Object.keys(bodyData).forEach((key) => {
            bodyData[key] = bodyData[key] && typeof bodyData[key] === 'object' && bodyData[key].id ? bodyData[key].id : bodyData[key];
          });
        });
        await dispatch(createBulkData(appModelsName, getArrayFormatCreate12(rowsToAdd)));
      }

      if (rowsToDelete && rowsToDelete.length) {
        /* setIsSaving(false);
        setHasUnsavedRows(false);
        unsavedChangesRef.current = {
          unsavedRows: {},
          rowsBeforeChange: {},
        }; */
        await dispatch(getDeleteChecklist(getColumnArrayById(rowsToDelete, 'id'), appModelsName));
      }

      const filteredArray = rows.filter((item1) => !rowsToDelete.some((item2) => item2.id === item1.id));
      setRows(filteredArray);
    } catch (error) {
      setIsSaving(false);
    }
  };

  const handleClick = () => {
    const id = rows && rows.length ? rows.length + 1 : 1;
    /* unsavedChangesRef.current = {
      unsavedRows: [{
        id, date: '', cam_area: '', occupancy_in: '', _action: 'add',
      }],
      rowsBeforeChange: rows,
    }; */
    const fieldsList = columns;
    if (fieldsList && fieldsList.length) {
      const newObj = {};
      fieldsList.forEach((item) => {
        if (item.type === 'date' || item.type === 'datetime') {
          newObj[item.field] = new Date();
        } else {
          newObj[item.field] = '';
        }
      });
      newObj.id = id;
      // newObj._action = 'add';
      const addAction = { _action: 'add' };
      setRows((existingRows) => {
        const updatedRows = structuredClone(existingRows);
        const newRow = { ...newObj, ...addAction, ...defaultFields };
        updatedRows.unshift(newRow);
        return updatedRows;
      });
      // setRows((oldRows) => [...oldRows, newObj]);
      setHasUnsavedRows(true);
    }
  };

  const handlSwitchChange = (event) => {
    if (event.target.checked) {
      setEditModeRow(true);
    } else {
      setEditModeRow(false);
      discardChanges();
    }
  };

  const handleProcessRowUpdateError = React.useCallback((error) => {
    // handle error if validation fails while saving data
    console.log(error);
  }, []);

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

  const responseDelete = checklistDeleteInfo;
  const responseUpdate = updateBulkInfo;

  const CustomToolBar = () => (
    <>
      <header className="header-box2">
        <div className="insights-filter-box">
          <div className="commongrid-header-text">
            {`${moduleName} (${listCount})`}
            {infoValue(helpertext || '')}
            {moduleDescription && (
            <p className="mb-0 font-tiny font-weight-400 font-family-tab">{moduleDescription}</p>
            )}
          </div>
        </div>
        <div className="insights-filter-box">
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
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => { setSearchValue(''); onFilterChanges({ quickFilterValues: [] }); }}
                    >
                      <IoCloseOutline size={22} fontSize="small" color={themes === 'light' ? '#000000' : AddThemeColor({}).color} />
                    </IconButton>
                  )}
                </InputAdornment>
              )}
            />
          </FormControl>
          {!editModeRow && (
            <>
              {reload && (
                <MuiTooltip title="Refresh">
                  <IconButton
                    className="header-link-btn"
                    color="primary"
                    onClick={() => {
                      if (!reload.loading) setCustomVariable(false);
                      setSearchValue('');
                      setFilterModel({ items: [], quickFilterValues: [] });
                      reload.setReload(Math.random());
                    }}
                  >
                    {' '}
                    <RxReload size={19} color={themes === 'light' ? '#000000' : AddThemeColor({}).color} />
                    {' '}
                  </IconButton>
                </MuiTooltip>
              )}
              {isActiveFilter && (
                <ButtonGroup className="ml-2" variant="contained" size="small" aria-label="outlined primary button group">
                  <>
                    <Button
                      onClick={() => setActiveType(true)}
                      variant={isUserActive ? 'contained' : 'outlined'}
                      color={isUserActive ? 'primary' : 'inherit'}
                    >
                      Active
                    </Button>
                    <Button
                      onClick={() => setActiveType(false)}
                      variant={!isUserActive ? 'contained' : 'outlined'}
                      color={!isUserActive ? 'primary' : 'inherit'}
                    >
                      Inactive
                    </Button>
                  </>
                </ButtonGroup>
              )}
              {ishideDateFilter ? '' : (
                <GridDateFilter
                  onClickRadioButton={onClickRadioButton}
                  onChangeCustomDate={onChangeCustomDate}
                  setCustomVariable={setCustomVariable}
                  customVariable={customVariable}
                  setFilterFromOverview={setFilterFromOverview}
                />
              )}
              {ishideColumns ? '' : (
                <IconButton className="header-filter-btn">
                  <GridToolbarColumnsButton />
                </IconButton>
              )}
            </>
          )}
          <IconButton className="header-filter-btn">
            <GridToolbarFilterButton />
          </IconButton>
          {!editModeRow && !ishideExport && (
          <>
            <IconButton className="header-filter-btn" disabled={rows && rows.length <= 0} onClick={() => { setShowExport(true); setStartExport(Math.random()); }}>
              <CgExport size={20} color={themes === 'light' ? '#000000' : AddThemeColor({}).color} className="mb-1" />
              <span className="mt-1 ml-1 pl-1 mb-1" style={{ color: themes === 'light' ? '#000000' : AddThemeColor({}).color }}> Export </span>
            </IconButton>
          </>
          )}
          {ishideEditable ? '' : (
            <FormGroup className="ml-3 mt-1">
              <FormControlLabel
                control={(
                  <Switch
                    checked={editModeRow}
                    disabled={errorData}
                    onChange={(e) => handlSwitchChange(e)}
                    inputProps={{ role: 'switch' }}
                  />
                )}
                label="Editable"
                sx={{
                  ...(themes === 'light' && {
                    color: '#ffffff', // White text
                  }),
                }}
              />
            </FormGroup>
          )}
          {!editModeRow && createOption && createOption.enable && (
            <Button
              onClick={createOption.func}
              type="button"
              variant="contained"
              className="header-create-btn"
            >
              {createOption.text}
            </Button>
          )}
          {!editModeRow && deleteOption && deleteOption.enable && (
            <Button
              onClick={deleteOption.func}
              type="button"
              variant="contained"
              className="header-create-btn"
            >
              {deleteOption.text}
              (
              {deleteOption.count}
              )
            </Button>
          )}
          {!editModeRow && bulkOption && bulkOption.enable && (
            <Button
              onClick={() => { showBulkUploadModal(true); }}
              type="button"
              variant="contained"
              className="header-create-btn"
            >
              {bulkOption.text}
            </Button>
          )}
          {editModeRow && (
            <>
              {/* <Button
              disabled={isSaving}
              onClick={handleClick}
              startIcon={<AddIcon />}
            >
              Add
            </Button> */}
              <LoadingButton
                disabled={!hasUnsavedRows || errorData}
                loading={isSaving}
                onClick={saveChanges}
                startIcon={<SaveIcon />}
                loadingPosition="start"
              >
                <span>Save</span>
              </LoadingButton>
              <Button
                disabled={!hasUnsavedRows || isSaving || errorData}
                onClick={discardChanges}
                startIcon={<RestoreIcon />}
              >
                Discard all changes
              </Button>
            </>
          )}
        </div>
      </header>
      {responseDelete && responseDelete.err && (responseDelete.err.data || responseDelete.err.error || responseDelete.err.statusText) && (
        <Alert severity="warning" onClose={() => { dispatch(resetDeleteChecklist()); }}>
          {generateErrorMessage(responseDelete)}
        </Alert>
      )}
      {responseUpdate && responseUpdate.err && (responseUpdate.err.data || responseUpdate.err.error || responseUpdate.err.statusText) && (
        <Alert severity="warning" onClose={() => { dispatch(resetBulkUpdate()); }}>
          {generateErrorMessage(responseUpdate)}
        </Alert>
      )}
      {responseUpdate && (responseUpdate.data || responseUpdate.status)
        && !(responseDelete && responseDelete.err && (responseDelete.err.data || responseDelete.err.error || responseDelete.err.statusText)) && (
          <Alert severity="success" onClose={() => { dispatch(resetBulkUpdate()); }}>
            Edited data updated successfully.
          </Alert>
      )}
      {hasUnsavedRows && !errorData && !(responseDelete && responseDelete.err && (responseDelete.err.data || responseDelete.err.error || responseDelete.err.statusText))
        ? (
          <Alert severity="warning">
            You made some changes in the list. Please save.
          </Alert>
        ) : ''}
      {errorData
        ? (
          <Alert severity="warning">
            {errorData}
          </Alert>
        ) : ''}
      {editModeRow
        ? (
          <Alert severity="info">
            Double Click to Edit.
          </Alert>
        ) : ''}
      {/* hasUnsavedRows && !errorData
            ?   <div className="text-danger text-center mt-3">
          <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />    <span className="text-danger">You made some changes in list. Please save.</span></div> : ''}
          {errorData
            ?   <div className="text-danger text-center mt-3">
          <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />    <span className="text-danger">{errorData}</span></div> : '' */}
      {moduleCustomHeader
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

  return (
    <div className={componentClassName}>
      <DataGridPro
        getRowId={(row) => row.id || row.sl_no}
        className={className}
        rows={rows}
        columns={columnsEditable}
        rowHeight={45}
        apiRef={apiRef}
        loading={loading || isSaving || loadingData || createBulkInfo && createBulkInfo.loading || (updateBulkInfo && updateBulkInfo.loading) || (checklistDeleteInfo && checklistDeleteInfo.loading)}
        cellSelection
        processRowUpdate={processRowUpdate}
        disableRowSelectionOnClick
        onClipboardPasteStart={() => setLoading(true)}
        onClipboardPasteEnd={() => setLoading(false)}
        experimentalFeatures={{ clipboardPaste: true }}
        // unstable_ignoreValueFormatterDuringExport
        sx={{
          '& .MuiDataGrid-row.row--removed': {
            backgroundColor: (theme) => {
              if (theme.palette.mode === 'light') {
                return 'rgba(255, 170, 170, 0.3)';
              }
              return darken('rgba(255, 170, 170, 1)', 0.7);
            },
          },
          '& .MuiDataGrid-row.row--edited': {
            backgroundColor: (theme) => {
              if (theme.palette.mode === 'light') {
                return 'rgba(255, 254, 176, 0.3)';
              }
              return darken('rgba(255, 254, 176, 1)', 0.6);
            },
          },
          '& .MuiDataGrid-footerContainer': isStickyFooter ? {
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
          } : '',
          ...(themes === 'light' && {
            '& .MuiDataGrid-virtualScrollerContent': {
              backgroundColor: '#2D2E2D', // Set background color for light mode
              color: ' #F7FAFC ',
            },
            '.MuiDataGrid-columnHeader': {
              backgroundColor: '#2D2E2D !important', // Ensure background color is applied to headers
              color: 'white', // Column header text color in light mode
              '& .MuiDataGrid-columnHeader--hover': {
                color: 'white', // Change header text color on hover
              },
              '& .MuiDataGrid-sortIcon': {
                color: 'white', // Sort arrow color
              },
              '& .MuiDataGrid-menuIconButton': {
                color: 'white', // Three-dot menu icon color
              },
              '& .MuiDataGrid-menuIconButton:hover, & .MuiDataGrid-sortIcon:hover': {
                color: '#F7FAFC', // Change icon color to lighter white on hover
              },
            },
            '& .MuiCheckbox-root': {
              color: '#F7FAFC', // Checkbox color in light mode
            },
            '& .Mui-checked': {
              color: '#F7FAFC', // Checked checkbox color in light mode (default Material-UI primary color)
            },
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #000000', // Row separator line color in light mode
            },
            '& .MuiDataGrid-columnHeadersInner': {
              backgroundColor: '#2D2E2D !important', // Set background color for light mode
              color: ' #F7FAFC ',
            },
          }),
        }}
        getRowClassName={({ id }) => {
          const unsavedRow = unsavedChangesRef.current.unsavedRows[id];
          if (unsavedRow) {
            if (unsavedRow._action === 'delete') {
              return 'row--removed';
            }
            return 'row--edited';
          }
          return '';
        }}
        slots={{
          toolbar: noHeader ? '' : CustomToolBar,
          noRowsOverlay: () => (
            <GridOverlay>
              {!dataLoading && (
              <SuccessAndErrorFormat
                response={false}
                showCreate
                isCreate={!editModeRow && createOption && createOption.enable}
                onCreate={createOption.func}
                createName={createOption.text}
                staticInfoMessage={`There are no records to display. Click '${createOption.text}' to add a new entry and start managing your data.`}
              />
              )}
            </GridOverlay>
          ),
        }}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        sortingMode={noHeader ? 'client' : 'server'}
        sortingOrder={['asc', 'desc']}
        sortModel={sortModel}
        onSortModelChange={(data) => setSortingOrder(data)}
        initialState={{
          pagination: {
            paginationModel: { pageSize: limit, page: 0 },
          },
          pinnedColumns: { left: [], right: [] },
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
        // editMode="row"
        filterModel={filterModel}
        paginationModel={{
          page,
          pageSize: limit,
        }}
        paginationMode="server"
        page={page}
        onCellClick={!editModeRow && onCellClick}
        onPaginationModelChange={(data) => handlePageChange(data)}
        pageSize={limit}
        rowsPerPageOptions={[10]}
        pageSizeOptions={ishidePagination ? [] : [10, 20, 50, 100, 500]}
        pagination={!ishidePagination}
        rowCount={rowCount}
        onColumnVisibilityModelChange={(data) => { if (JSON.stringify(data) === JSON.stringify(showAllString)) showAll(); else setVisibleColumns(data); }}
        columnVisibilityModel={visibleColumns}
        onFilterModelChange={(data) => { setFilterModel(data); onFilterChanges(data); }}
        checkboxSelection={!noHeader}
        rowSelectionModel={rowselected}
        onRowSelectionModelChange={(data) => {
          setRowselected(data);
          const selectedIDs = data;
          const selectedRowData = rows && rows.length && rows.filter(({ id }) => selectedIDs.includes(id));
          setRowAllData(selectedRowData);
        }}
      />
      <div id="print_report" className="d-none">
        <table align="center">
          <tbody>
            <tr>
              <td
                style={{ textAlign: 'left' }}
                colSpan={getTableHeaders('heading', 'property') && getTableHeaders('heading', 'property').length > 0 ? getTableHeaders('heading', 'property').length : '0'}
              >
                <b>
                  {exportFileName}
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
                  exportExcelTableToXlsx('print_report', title);
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
      {bulkUploadModal && (
        <BulkUpload
          atFinish={() => {
            showBulkUploadModal(false);
          }}
          targetModel={appModelsName}
          modalTitle={bulkOption.title}
          modalMsg={bulkOption.modalMsg}
          testFields={bulkOption.testFields}
          uploadFields={bulkOption.uploadFields}
          sampleTamplate={bulkOption.template}
          labels={bulkOption.fieldLabels}
          bulkUploadModal
        />
      )}
    </div>
  );
};

/* CommonGridEditable.propTypes = {
  columns: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  defaultFields: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
    PropTypes.array,
  ]),
  createOption: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  rows: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  dependencyColumsReload: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  loadingData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  reload: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  visibleColumns: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  filters: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  pdfStaticColumnWidth: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  exportInfo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  componentClassName: PropTypes.oneOfType([
    PropTypes.string,
  ]).isRequired,
  placeholderText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  customVariable: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  exportCondition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  setRows: PropTypes.func,
  setCustomVariable: PropTypes.func,
  setFilterFromOverview: PropTypes.func,
  setVisibleColumns: PropTypes.func,
  setStartExport: PropTypes.func,
  handlePageChange: PropTypes.func,
  onFilterChanges: PropTypes.func,
  onClickRadioButton: PropTypes.func,
  onChangeCustomDate: PropTypes.func,
  setEditModeRow: PropTypes.func.isRequired,
  editModeRow: PropTypes.bool.isRequired,
  disableShowAllButton: PropTypes.bool,
  className: PropTypes.string.isRequired,
  moduleName: PropTypes.string.isRequired,
  exportFileName: PropTypes.string.isRequired,
  appModelsName: PropTypes.string.isRequired,
  listCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
};

CommonGridEditable.defaultProps = {
  setRows: () => { },
  setCustomVariable: () => { },
  setFilterFromOverview: () => { },
  setStartExport: () => { },
  setVisibleColumns: () => { },
  defaultFields: {},
  createOption: false,
  handlePageChange: {},
  onFilterChanges: {},
  onClickRadioButton: {},
  onChangeCustomDate: {},
  visibleColumns: {},
  exportInfo: {},
  filters: {},
  placeholderText: false,
  customVariable: false,
  exportCondition: false,
  disableShowAllButton: false,
  pdfStaticColumnWidth: false,
}; */
CommonGridEditable.defaultProps = {
  setRowAllData: () => { },
  setRowselected: () => { },
};

export default CommonGridEditable;
