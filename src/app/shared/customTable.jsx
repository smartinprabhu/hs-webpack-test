/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-destructuring */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import {
  Label, Input, Button,
} from 'reactstrap';
import { Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import {
  faCopy, faTrashAlt, faArrowUp, faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { SubdirectoryArrowLeft } from '@material-ui/icons';
import editIcon from '@images/icons/edit.svg';
import chartIcon from '@images/chart.svg';
import listIcon from '@images/list.svg';

import {
  getCompanyTimezoneDate, extractTextObject, copyToClipboard, truncate,
} from '../util/appUtils';
import { setSorting } from '../assets/equipmentService';
import { getAge } from '../breakdownTracker/utils/utils';

const CustomTable = (props) => {
  const dispatch = useDispatch();
  const {
    isAllChecked,
    handleTableCellAllChange,
    searchColumns,
    onChangeFilter,
    stateLabelFunction,
    incidentStateLabelFunction,
    getServiceImpactLabel,
    priorityLabelFunction,
    maintenanceLabelFunction,
    escalationLevelLabelFunction,
    checklistStateLabelFunction,
    checklistCategoryLabelFunction,
    listPantryData,
    listCatData,
    typeCtegoryLabelFunction,
    entryStatusLabelFunction,
    slaStatusLabelFunction,
    stageLabelFunction,
    categoryTypeFunction,
    getUsage,
    transferLabelFunction,
    getppmLabel,
    channelLabelFunction,
    numToFloat,
    operationData,
    getType,
    inventoryLabelFunction,
    productLabelFunction,
    listDataID,
    setKeyword,
    handleTableCellChange,
    checkedRows,
    setViewId,
    setViewModal,
    tableData,
    tableProps,
    actions,
    advanceSearchColumns,
    advanceSearchFunc,
    minWidth,
    viewModal,
  } = props;

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const { userInfo } = useSelector((state) => state.user);
  const { inventoryStatusDashboard } = useSelector((state) => state.inventory);

  const [copySuccess, setCopySuccess] = useState(false);

  const onCilckTextField = (column) => {
    if (advanceSearchColumns.includes(column.id) && tableData && !tableData.loading) {
      advanceSearchFunc[column.id](true);
    }
  };

  const setSortingOrder = (column) => {
    const obj = {
      sortBy: sortedValue.sortBy === 'ASC' ? 'DESC' : 'ASC',
      sortField: column.id,
    };
    dispatch(setSorting(obj));
  };

  const getValue = (value, cell) => {
    let fieldValue = value || '-';
    if (Array.isArray(fieldValue)) {
      fieldValue = value[1];
    }
    if (!value && cell.column && cell.column.alternate === 'equipment_location_id') {
      fieldValue = cell.row.original.equipment_location_id && cell.row.original.equipment_location_id.length && cell.row.original.equipment_location_id[1];
    }
    if (!value && cell.column && cell.column.alternate === 'purpose_id') {
      fieldValue = cell.row.original.purpose_id && cell.row.original.purpose_id.length ? cell.row.original.purpose_id[1] : '-';
    }
    if (value && cell.column.id === 'incident_age') {
      fieldValue = getAge(cell.row.original.incident_date, cell.row.original.closed_on);
    }
    return fieldValue;
  };

  function getStatusFieldName(strName) {
    let res = '';
    if (strName === 'Requested') {
      res = 'requested_display';
    } else if (strName === 'Approved') {
      res = 'approved_display';
    } else if (strName === 'Delivered') {
      res = 'delivered_display';
    } else if (strName === 'Rejected') {
      res = 'rejected_display';
    }
    return res;
  }

  function getPickingName(str, stName) {
    let res = '';
    if (str && stName) {
      const dName = getStatusFieldName(stName);
      const pickingData = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
      const ogData = pickingData.filter((item) => (item.code === str));
      if (ogData && ogData.length && dName) {
        res = ogData[0][dName];
      }
    }
    return res;
  }

  function getValidLabel(value, cell) {
    let res = '';
    if (cell.row && cell.row.original && cell.row.original.picking_type_code) {
      res = getPickingName(cell.row.original.picking_type_code, value);
    }
    return res;
  }
  const hideSorting = (hideSortArray, columnId) => {
    let isSort = false;
    if (hideSortArray.includes(columnId)) {
      isSort = true;
    }
    return isSort;
  };

  let index = 1;

  useEffect(() => {
    if (viewModal && copySuccess) {
      setViewModal(false);
      setCopySuccess(true);
    }
  }, [viewModal, copySuccess]);

  return (
    <div>
      <thead className="bg-gray-light">
        {
          tableProps.headerGroups.map((headerGroup) => (
            <>
              <tr {...headerGroup.getHeaderGroupProps()} key={index++}>
                <th className="p-3">
                  <div className="checkbox pr-3">
                    <Input
                      type="checkbox"
                      value="all"
                      className="mt-5 position-absolute"
                      name="checkall"
                      id="checkboxtkhead"
                      checked={isAllChecked}
                      onChange={handleTableCellAllChange}
                    />
                    <Label htmlFor="checkboxtkhead" />
                  </div>
                </th>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    onClick={() => setSortingOrder(column)}
                  >
                    {column.render('Header')}
                    {actions && actions.hideSorting && hideSorting(actions.hideSorting.fieldName, column.id)
                      ? ''
                      : (
                        <span>
                          {sortedValue && sortedValue.sortField === column.id ? (
                            <FontAwesomeIcon className="ml-2 cursor-pointer" color="green" size="md" icon={sortedValue.sortBy === 'ASC' ? faArrowUp : faArrowDown} />
                          ) : ' ⬍ '}
                        </span>
                      )}
                  </th>
                ))}
                {(actions && actions.answersSummary) ? (
                  <th className="min-width-200">
                    <span>
                      Answers Summary
                    </span>
                  </th>
                ) : ''}
                {(actions && actions.viewAnswers) ? (
                  <th className="min-width-200">
                    <span>
                      View Answers
                    </span>
                  </th>
                ) : ''}
                {((actions && actions.delete && actions.delete.showDelete
                ) || (actions && actions.edit && actions.edit.showEdit)) ? (
                  <th className="min-width-100">
                    <span>
                      Action
                    </span>
                  </th>
                  ) : ''}
              </tr>
              <tr {...headerGroup.getHeaderGroupProps()}>
                <th />
                {headerGroup.headers.map((column) => (
                  <th
                    className={column.id === 'checkbox' ? ' '
                      : column.id === 'id' ? 'min-width-100 pr-4' : minWidth || 'min-width-200 pr-4'}
                    {...column.getHeaderProps()}
                  >
                    {searchColumns.includes(column.id) && (
                      <TextField
                        onClick={() => { if (tableData.data) { onCilckTextField(column); } }}
                        id={`data-${column.id}`}
                        autoComplete="off"
                        value={column.filterVal}
                        className="input-search min-width-100"
                        placeholder={advanceSearchColumns.includes(column.id) ? 'Search and Select...' : 'Search and Enter...'}
                        disabled={tableData.err || tableData.loading}
                        onKeyPress={(ev) => {
                          if (ev.key === 'Enter' && ev.target.value && !advanceSearchColumns.includes(column.id)) {
                            onChangeFilter(column, 'text');
                            setKeyword('');
                            column.fValue = false;
                            ev.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          column.value = e.target.value;
                          column.fValue = e.target.value;
                          setKeyword(e.target.value);
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment>
                              <IconButton disabled>
                                {!advanceSearchColumns.includes(column.id) && column && column.fValue && column && column.fValue.length ? (
                                  <SubdirectoryArrowLeft />
                                )
                                  : <SearchIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </th>
                ))}
                {(actions && (actions.answersSummary)) ? (
                  <th />
                ) : ''}
                {(actions && (actions.viewAnswers)) ? (
                  <th />
                ) : ''}
                {(actions && actions.delete && actions.delete.showDelete) ? (
                  <th />
                ) : ''}

              </tr>
            </>
          ))
        }
      </thead>
      {(tableData && tableData.data) && (
        <tbody {...tableProps.getTableBodyProps()}>
          {tableProps.page.map((row) => {
            tableProps.prepareRow(row);
            return (
              <tr
                key={row.id}
                {...row.getRowProps()}
              >
                {row.cells && row.cells.length ? (
                  <td>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxt${tableData.data[row.index].id}`}
                        className="ml-0"
                        name="name"
                        checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(tableData.data[row.index].id))}
                        onClick={(e) => { handleTableCellChange({ target: { checked: !checkedRows.includes(tableData.data[row.index].id), value: tableData.data[row.index].id } }); }}
                      />
                      <Label htmlFor={`checkboxt${tableData.data[row.index].id}`} />
                    </div>
                  </td>
                ) : ''}
                {row.cells.map((cell) => (
                  <>
                    {cell.column.Header !== 'checkbox' && (
                      <td
                        aria-hidden="true"
                        className={`sort-by cursor-pointer td-border pl-0 font-weight-400 ${cell.column.id === 'state' || cell.column.id === 'state_id' ? 'text-center' : ''}`}
                        data-testid={cell.value}
                        onClick={() => { if (!copySuccess) { setViewId(cell.row.original.id); setViewModal(true); } }}
                        {...cell.getCellProps()}
                      >
                        {!cell.column.optionFunction && (cell.column.id) && (cell.value === false) ? '-' : '' }
                        {cell.column.id === 'state' || cell.column.id === 'state_id' || cell.column.id === 'incident_state' && cell.column.func ? (
                          <>

                            {stateLabelFunction(cell.value && Array.isArray(cell.value) ? cell.value[1] : cell.value)}
                          </>
                        ) : ''}
                        {cell.column.id === 'incident_state' && cell.column.func ? (
                          <>

                            {incidentStateLabelFunction(cell.value && Array.isArray(cell.value) ? cell.value[1] : cell.value)}
                          </>
                        ) : ''}
                        {cell.column.id === 'priority' || cell.column.id === 'priority_id' && cell.column.func ? (
                          <>
                            {priorityLabelFunction(cell.value && Array.isArray(cell.value) ? cell.value[1] : cell.value)}
                          </>
                        ) : ''}
                        {cell.column.id === 'maintenance_team_id' && cell.column.func ? cell.value && cell.value.length && cell.value[1] : ''}
                        {cell.column.id === 'maintenance_type' && cell.column.func ? maintenanceLabelFunction(cell.value) : ''}
                        {cell.column.id === 'level' && cell.column.func ? escalationLevelLabelFunction(cell.value) : ''}
                        {cell.column.id === 'active' && cell.column.func ? checklistStateLabelFunction(cell.value) : ''}
                        {cell.column.id === 'is_all_category' && cell.column.func ? checklistCategoryLabelFunction(cell.value) : ''}
                        {cell.column.id === 'pantry_ids' && cell.column.func ? listPantryData(cell.value, 'name') : ''}
                        {cell.column.id === 'categ_id' && cell.column.func ? listCatData(cell.value, 'display_name') : ''}
                        {cell.column.id === 'type_category' && cell.column.func ? typeCtegoryLabelFunction(cell.value) : ''}
                        {cell.column.id === 'channel' && cell.column.func ? channelLabelFunction(cell.value) : ''}
                        {cell.column.id === 'qty_available' && cell.column.func ? numToFloat(cell.value) : ''}
                        {cell.column.id === 'code' && cell.column.func ? operationData(cell.value) : ''}
                        {cell.column.id === 'type' && cell.column.func ? getType(cell.value) : ''}
                        {cell.column.id === 'entry_status' && cell.column.func ? entryStatusLabelFunction(cell.value) : ''}
                        {cell.column.id === 'sla_status' && cell.column.func ? slaStatusLabelFunction(cell.value) : ''}
                        {(cell.column.id === 'partner_id' && cell.column.func) || (cell.column.id == 'company_id' && cell.column.func) ? listDataID(cell.value) : ''}
                        {cell.column.id === 'stage_id' && cell.column.func ? stageLabelFunction(extractTextObject(cell.value)) : ''}
                        {cell.column.id === 'category_type' && cell.column.func ? categoryTypeFunction(cell.value) : ''}
                        {cell.column.id === 'usage' && cell.column.func ? getUsage(cell.value) : ''}
                        {cell.column.id === 'ppm_by' && cell.column.func ? getppmLabel(cell.value) : ''}
                        {cell.column.id === 'property_valuation' && cell.column.func ? inventoryLabelFunction(cell.value) : ''}
                        {cell.column.id === 'product_count' && cell.column.func ? productLabelFunction(cell.value) : ''}
                        {cell.column.id === 'description' && (
                          <Tooltip title={cell.value}>
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncate(cell.value, 50), { USE_PROFILES: { html: true } }) }} />
                          </Tooltip>
                        )}
                        {cell.column.id === 'corrective_action' && (
                          <Tooltip title={<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cell.value, { USE_PROFILES: { html: true } }) }} />}>
                            <span className="text-info">{cell.value ? 'View' : ''}</span>
                          </Tooltip>
                        )}
                        {cell.column.id === 'last_comments' && (
                          <Tooltip title={<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cell.value, { USE_PROFILES: { html: true } }) }} />}>
                            <span className="text-info">{cell.value ? 'View' : ''}</span>
                          </Tooltip>
                        )}
                        {cell.column.id === 'action_taken' && (
                          cell.value ? (
                            <Tooltip title={cell.value}>
                              {truncate(cell.value, 40)}
                            </Tooltip>
                          ) : ''
                        )}
                        {cell.column.id === 'remarks' && (
                          cell.value ? (
                            <Tooltip title={cell.value}>
                              {truncate(cell.value, 40)}
                            </Tooltip>
                          ) : ''
                        )}
                        {cell.column.id === 'constraints' && (
                          cell.value ? (
                            <Tooltip title={cell.value}>
                              {truncate(cell.value, 40)}
                            </Tooltip>
                          ) : ''
                        )}
                        {cell.column.id === 'purpose' && (
                          cell.value ? (
                            <Tooltip title={cell.value}>
                              {truncate(cell.value, 40)}
                            </Tooltip>
                          ) : ''
                        )}
                        {cell.column.id === 'log_note' && (
                          cell.value ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncate(cell.value, 100), { USE_PROFILES: { html: true } }) }} /> : ''
                        )}
                        {cell.column.id === 'log_note_date' && cell.value ? cell.value !== '-' ? (getCompanyTimezoneDate(cell.value, userInfo, 'datetime')) : '-' : ''}
                        {cell.column.id === 'request_state' && cell.column.func ? transferLabelFunction(cell.value, getValidLabel(cell.value, cell)) : ''}
                        {(cell.column.id === 'reordering_min_qty' || cell.column.id === 'reordering_max_qty' || cell.column.id === 'alert_level_qty') && cell.column.func ? numToFloat(cell.value) : ''}
                        {!cell.column.func && !cell.column.optionFunction && !cell.column.dateFunction && cell.column.id !== 'description' && cell.column.id !== 'corrective_action' && cell.column.id !== 'last_comments' && cell.column.id !== 'action_taken' && cell.column.id !== 'remarks' && cell.column.id !== 'purpose' && cell.column.id !== 'constraints' && cell.column.id !== 'log_note' && cell.column.id !== 'log_note_date' && !cell.column.copyUrlFunc && getValue(cell.value, cell)}
                        {cell.column.dateFunction && cell.column.dateDisplayType ? getCompanyTimezoneDate(cell.value, userInfo, cell.column.dateDisplayType) : ''}
                        {cell.column.optionFunction ? (cell.value ? 'Yes' : 'No') : ''}
                        {cell.column.copyUrlFunc
                          ? (
                            <Tooltip title={copySuccess ? 'Copied!' : 'Copy URL'}>
                              <FontAwesomeIcon
                                className="ml-2 cursor-pointer"
                                onMouseLeave={() => setCopySuccess(false)}
                                onClick={() => { copyToClipboard(cell.value, 'survey'); setCopySuccess(true); }}
                                size="sm"
                                color="#1582c8"
                                icon={faCopy}
                              />
                            </Tooltip>
                          )
                          : ''}
                      </td>
                    )}
                  </>
                ))}
                {row.cells && row.cells.length
                  ? ((actions && actions.answersSummary) && (
                    <td className="w-15 pl-0">
                      {(actions && actions.answersSummary && row.cells[0].row.values.stage_id && row.cells[0].row.values.stage_id.length && row.cells[0].row.values.stage_id[1] !== 'Draft') ? (
                        <Button
                           variant="contained"
                          onClick={() => { setViewId(row.cells[0].row.values.id); actions.answersSummary.answersSummaryFunc(); }}
                          size="sm p-0"
                        >
                          <img src={chartIcon} className="cursor-pointer mx-1 mb-1" alt="Answers Summary" aria-hidden="true" height={12} width={12} />
                          <span className="mr-2 font-11px">Answers Summary</span>
                        </Button>
                      ) : <span className="pl-5">-</span>}
                    </td>
                  ))
                  : ''}
                {row.cells && row.cells.length
                  ? ((actions && actions.viewAnswers) && (
                    <td className="w-15 pl-0">
                      {(actions && actions.viewAnswers && row.cells[0].row.values.stage_id && row.cells[0].row.values.stage_id.length && row.cells[0].row.values.stage_id[1] !== 'Draft') ? (
                        <Tooltip title="View Answers">
                          <Button
                             variant="contained"
                            onClick={() => { setViewId(row.cells[0].row.values.id); actions.viewAnswers.viewAnswersFunc(); }}
                            size="sm p-0"
                          >
                            <img src={listIcon} className="cursor-pointer mx-1" alt="View Answers" aria-hidden="true" height={12} width={12} />
                            <span className="mr-2 font-11px">View Answers</span>
                          </Button>
                        </Tooltip>
                      ) : <span className="pl-5">-</span>}
                    </td>
                  ))
                  : ''}
                {row.cells && row.cells.length
                  ? ((actions && actions.delete && actions.delete.showDelete) && (
                    <td className="w-15 p-2">
                      {(actions && actions.edit && actions.edit.showEdit) && (
                        <Tooltip title="Edit">
                          <img
                            aria-hidden
                            src={editIcon}
                            className="cursor-pointer mr-2"
                            height="12"
                            width="12"
                            alt="edit"
                            onClick={() => actions.edit.editFunc(row.values)}
                          />
                        </Tooltip>
                      )}
                      {(actions && actions.delete && actions.delete.showDelete) && (
                        <Tooltip title="Delete">
                          <span className="font-weight-400 d-inline-block" />
                          <FontAwesomeIcon
                            className="mr-1 ml-1 cursor-pointer"
                            size="sm"
                            icon={faTrashAlt}
                            onClick={() => { actions.delete.displayFieldName ? (actions.delete.deleteFunc(row.values.id, row.values[actions.delete.displayFieldName])) : (actions.delete.deleteFunc(row.values.id, row.values.name)); }}
                          />
                        </Tooltip>
                      )}
                    </td>
                  )
                  ) : ''}

              </tr>
            );
          })}
        </tbody>
      )}
    </div>
  );
};
export default CustomTable;
