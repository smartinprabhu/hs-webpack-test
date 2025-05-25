/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import {
  getGridStringOperators,
  GridPagination,
} from '@mui/x-data-grid-pro';

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { useSelector } from 'react-redux';

import Loader from '@shared/loading';

import CommonGrid from '../../commonComponents/commonGridStaticData';
import {
  getDefaultNoValue, extractNameObject,
  convertDecimalToTime,
} from '../../util/appUtils';

const RelatedSchedules = React.memo(({
  setEvents, isCustomMsg, isInformMsg, isExclude, endDate, typeSelected, selectedSchedules, events, onClose,
}) => {
  const [partsData, setPartsData] = useState(events);
  const [triggerChange, setTriggerChange] = useState('');
  const [orgData, setOriginal] = useState(JSON.stringify(events));
  const [orgData1, setOriginal1] = useState(JSON.stringify(selectedSchedules));

  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});

  const [viewModal, setViewModal] = useState(false);

  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState(selectedSchedules);

  const { inspectionParentsInfo } = useSelector((state) => state.inspection);

  useEffect(() => {
    if (
      visibleColumns
        && Object.keys(visibleColumns)
        && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        category_type: true,
        equipment_id: true,
        space_id: true,
        starts_at: true,
        duration: true,
        group_id: true,
        task_id: true,
        maintenance_team_id: true,
      });
    }
  }, [visibleColumns]);

  /* useEffect(() => {
    setFieldValue('bulk_events', partsData);
  }, [triggerChange]); */

  useEffect(() => {
    setOriginal(JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    setOriginal1(JSON.stringify(selectedSchedules));
  }, [selectedSchedules]);

  const removeData = (e, index) => {
    const newItems = [...partsData];
    newItems.splice(index, 1);
    setPartsData(newItems);
    setTriggerChange(Math.random());
  };

  const onReset = () => {
    setPartsData(JSON.parse(orgData));
    setSelectedRows(JSON.parse(orgData1));
    setTriggerChange(Math.random());
  };

  const onSave = () => {
    setEvents(selectedRows);
    onClose();
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const getValue = (value) => {
    let fieldValue = value || '-';
    if (Array.isArray(fieldValue)) {
      fieldValue = value[1];
    } else if (fieldValue && typeof fieldValue === 'object' && !Object.keys(fieldValue).length) {
      fieldValue = '-';
    } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.name) {
      fieldValue = value.name;
    } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.path_name) {
      fieldValue = value.path_name;
    } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.space_name) {
      fieldValue = value.space_name;
    }
    return fieldValue;
  };

  const columns = () => (
    [
      {
        field: 'category_type',
        headerName: 'Type',
        flex: 1,
        minWidth: 160,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'equipment_id',
        headerName: 'Asset Name',
        flex: 1,
        minWidth: 180,
        editable: false,
        valueGetter: (params) => (params.row.category_type === 'Equipment'
          ? getDefaultNoValue(extractNameObject(params.row.equipment_id, 'name'))
          : getDefaultNoValue(extractNameObject(params.row.space_id, 'space_name'))),
        renderCell: (params) => {
          const equipmentName = getDefaultNoValue(extractNameObject(params.row.equipment_id, 'name'));
          const spaceName = getDefaultNoValue(extractNameObject(params.row.space_id, 'space_name'));
          const locationPathName = getDefaultNoValue(
            params.row.equipment_id && params.row.equipment_id.location_id && params.row.equipment_id.location_id.path_name
              ? extractNameObject(params.row.equipment_id.location_id, 'path_name')
              : '',
          );
          const spacePathName = getDefaultNoValue(
            params.row.space_id && params.row.space_id && params.row.space_id.path_name
              ? extractNameObject(params.row.space_id, 'path_name')
              : '',
          );

          return (
            <div
              style={{
                display: 'flex', flexDirection: 'column', whiteSpace: 'normal', wordWrap: 'break-word',
              }}
              className="ml-2"
            >
              <h6 className="font-family-tab mb-0" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{params.row.category_type === 'Equipment' ? equipmentName : spaceName}</h6>
              <p className="font-family-tab mb-0 font-tiny" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{params.row.category_type === 'Equipment' ? locationPathName : spacePathName}</p>
            </div>
          );
        },
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'group_id',
        headerName: 'Scheduler',
        flex: 1,
        minWidth: 180,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(extractNameObject(params.value, 'name')),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'check_list_id',
        headerName: 'Checklist',
        flex: 1,
        minWidth: 180,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(extractNameObject(params.value, 'name')),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'maintenance_team_id',
        headerName: 'Maintenance Team',
        flex: 1,
        minWidth: 180,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(extractNameObject(params.value, 'name')),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'starts_at',
        headerName: 'Starts On (HH:MM)',
        flex: 1,
        minWidth: 100,
        editable: false,
        valueGetter: (params) => params.value,
        renderCell: (params) => {
          const durationString = convertDecimalToTime(params.value);
          return (
            <span className="ml-2">{durationString}</span>
          );
        },
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'duration',
        headerName: 'Ends On (HH:MM)',
        flex: 1,
        minWidth: 100,
        editable: false,
        valueGetter: (params) => convertDecimalToTime(parseFloat(params.row.starts_at) + parseFloat(params.row.duration)),
        renderCell: (params) => {
          const durationString = convertDecimalToTime(parseFloat(params.row.starts_at) + parseFloat(params.row.duration));
          return (
            <span className="ml-2">{durationString}</span>
          );
        },
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
    ]);

  const onFilterChange = (data) => {
    if (data.items && data.items.length) {
      setPage(0);
    }
  };

  const rowHeight = 100; // Approximate height of a single row in pixels
  const maxHeight = window.innerHeight - 270; // Max height based on viewport
  const rowCount = partsData.length ? partsData.length + 1 : 1;
  // Calculate the height
  const tableHeight = Math.min(rowCount * rowHeight, maxHeight);

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
        {count === 1 ? 'Schedule' : 'Schedules'}
        {' '}
        Selected
      </div>

      <GridPagination />
    </div>
  );

  return (
    <>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {isCustomMsg && selectedRows && selectedRows.length > 0 && (
          <p className="font-family-tab ml-2">
            {count}
            {' '}
            {count === 1 ? 'Schedule' : 'Schedules are'}
            {' '}
            selected for cancellation up to
            {' '}
            {endDate}
            . You may deselect to retain the Inspections.
          </p>
          )}
          {isInformMsg && selectedRows && selectedRows.length > 0 && (
          <p className="font-family-tab ml-2">
            {count}
            {' '}
            {count === 1 ? 'Schedule' : 'Schedules are'}
            {' '}
            selected for cancellation. You may deselect to retain the Inspections.
          </p>
          )}
          {isExclude && (
            <p className="font-family-tab ml-2">
              Please select the inspection schedules you wish to exclude.
            </p>
          )}
          <Row className="drawer-table-scroll thin-scrollbar">
            <Col xs={12} sm={12} md={12} lg={12} className="">
              {inspectionParentsInfo && !inspectionParentsInfo.loading && inspectionParentsInfo.data && partsData && partsData.length > 0 && (

              <CommonGrid
                className="reports-table-tab"
                componentClassName="commonGrid"
                tableData={partsData}
                // sx={partsData.length > 0 ? { height: `${tableHeight}px` } : { height: '250px', overflow: 'hidden' }}
                page={page}
                columns={columns()}
                rowCount={partsData.length}
                limit={20}
                checkboxSelection
                pagination
                disableRowSelectionOnClick
                exportFileName="Schedules"
                listCount={partsData.length}
                visibleColumns={visibleColumns}
                onFilterChanges={onFilterChange}
                setVisibleColumns={setVisibleColumns}
                setViewModal={setViewModal}
                setViewId={setViewModal}
                isSelection={typeSelected && typeSelected !== 'current'}
                setRows={setRows}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                loading={false}
                err={false}
                noHeader
                tabTable
                showFooter
                CustomFooter={CustomFooter}
                handlePageChange={handlePageChange}
              />
              )}
              {inspectionParentsInfo && inspectionParentsInfo.loading && (
              <Loader />
              )}
            </Col>
          </Row>
        </DialogContentText>
      </DialogContent>
      {typeSelected && typeSelected !== 'current' && (
      <DialogActions>
        <Button
          type="button"
          variant="contained"
          className="reset-btn mr-2"
          onClick={() => onReset()}
        >
          Reset

        </Button>
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          onClick={() => onSave()}
        >
          Save

        </Button>
      </DialogActions>
      )}

    </>
  );
});

export default RelatedSchedules;
