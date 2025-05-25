/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGridStringOperators,
  GridPagination,
} from '@mui/x-data-grid-pro';
import { Tooltip } from 'antd';
import {
  Button, Dialog,
} from '@mui/material';
import {
  faPencil,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DetailViewFormat from '@shared/detailViewFormat';

import DialogHeader from '../../commonComponents/dialogHeader';

import CommonGrid from '../../commonComponents/commonGridStaticData';

import {
  resetUpdateHxAudit,
  getHxAuditDetails,
} from '../auditService';

import {
  getDefaultNoValue, convertDecimalToTime, getCompanyTimezoneDate,
  convertDecimalToTimeReadable, getListOfModuleOperations, truncate,
} from '../../util/appUtils';
import AddEvent from './sections/addEvent';
import actionCodes from '../data/actionCodes.json';

const appModels = require('../../util/appModels').default;

const AuditEvents = () => {
  const { hxAuditDetailsInfo, hxAuditUpdate } = useSelector((state) => state.hxAudits);
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const loading = hxAuditDetailsInfo && hxAuditDetailsInfo.loading;
  const isErr = hxAuditDetailsInfo && hxAuditDetailsInfo.err;
  const inspDeata = hxAuditDetailsInfo && hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length ? hxAuditDetailsInfo.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.audit_events_ids && inspDeata.audit_events_ids.length > 0);

  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});

  const [formModal, setFormModal] = useState(false);
  const [viewId, setViewId] = useState(0);
  const [deleteId, setDeleteId] = useState(0);
  const [editData, setEditData] = useState({});
  const [viewModal, setViewModal] = useState(false);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Audit Management', 'code');

  const isAuditEventCreatable = (inspDeata && inspDeata.state !== 'Signed off' && inspDeata.state !== 'Canceled') && allowedOperations.includes(actionCodes['Create Audit Event']);
  const isAuditEventEditable = (inspDeata && inspDeata.state !== 'Signed off' && inspDeata.state !== 'Canceled') && allowedOperations.includes(actionCodes['Edit Audit Event']);

  const dispatch = useDispatch();

  const totalDuration = useMemo(
    () => (isChecklist ? inspDeata.audit_events_ids.reduce((sum, row) => sum + (row.duration || 0.00), 0.00) : 0.00),
    [hxAuditDetailsInfo],
  );

  const CustomFooter = () => (
    <>
      <div
        className="font-family-tab"
        style={{
          display: 'flex', justifyContent: 'flex-end', padding: '10px', fontWeight: 'bold',
        }}
      >
        Total Duration:
        {' '}

        {convertDecimalToTimeReadable(totalDuration)}
      </div>
      <GridPagination />
    </>
  );

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        name: true,
        date: true,
        duration: true,
        agenda: true,
        notes: true,
        resources: true,
      });
    }
  }, [visibleColumns]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const formClose = () => {
    if (hxAuditUpdate && hxAuditUpdate.data) {
      dispatch(getHxAuditDetails(inspDeata && inspDeata.id, appModels.HXAUDIT));
    }
    setFormModal(false);
    setViewId(false);
    setDeleteId(false);
    setEditData(false);
    dispatch(resetUpdateHxAudit());
  };

  const onCreateOpen = () => {
    setViewId(false);
    setEditData(false);
    setDeleteId(false);
    dispatch(resetUpdateHxAudit());
    setFormModal(true);
  };

  const onUpdateOpen = (id) => {
    if (isAuditEventEditable) {
      setViewId(id);
      setDeleteId(false);
      dispatch(resetUpdateHxAudit());
      setFormModal(true);
    }
  };

  const onDeleteOpen = (id) => {
    if (isAuditEventEditable) {
      setViewId(id);
      setDeleteId(id);
      dispatch(resetUpdateHxAudit());
      setFormModal(true);
    }
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
        field: 'name',
        headerName: 'Title',
        flex: 1,
        minWidth: 180,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'date',
        headerName: 'Event Date & Time',
        flex: 1,
        minWidth: 150,
        valueGetter: (params) => getCompanyTimezoneDate(params.value, userInfo, 'datetime'),
        func: getValue,
        filterable: false,
      },
      {
        field: 'duration',
        headerName: 'Duration (HH:MM)',
        flex: 1,
        minWidth: 100,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        renderCell: (params) => {
          const durationString = convertDecimalToTime(params.value);
          return (
            <span>{durationString}</span>
          );
        },
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },

      {
        field: 'agenda',
        headerName: 'Agenda',
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
        field: 'resources',
        headerName: 'Resources',
        flex: 1,
        minWidth: 180,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'notes',
        headerName: 'Notes',
        flex: 2, // More space for longer text
        minWidth: 200,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        renderCell: (params) => {
          const val = params.value;
          const displayValue = getDefaultNoValue(val);
          return displayValue && displayValue.length > 50 ? (
            <Tooltip title={displayValue} placement="top">
              <span>{truncate(displayValue, 50)}</span>
            </Tooltip>
          ) : (
            <span>{displayValue}</span>
          );
        },
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isAuditEventEditable && (
            <Tooltip title="Edit">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-3 cursor-pointer"
                size="sm"
                icon={faPencil}
                onClick={() => { setEditData(params.row); onUpdateOpen(params.id); }}
              />
            </Tooltip>
            )}
            {isAuditEventEditable && (
            <Tooltip title="Delete">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => { setEditData(params.row); onDeleteOpen(params.id); }}
              />
            </Tooltip>
            )}
          </>
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
  const rowCount = isChecklist ? hxAuditDetailsInfo.data[0].audit_events_ids.length + 1 : 1;
  // Calculate the height
  const tableHeight = Math.min(rowCount * rowHeight, maxHeight);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab product-orders">
        <p className="font-family-tab text-info mb-0 font-tiny">Note: Add / Log , Update and Delete Audit Events</p>
        <div>
          {isAuditEventCreatable && (
          <div className="text-right mb-2 p-2">
            <Button
              onClick={() => onCreateOpen()}
              type="button"
              variant="contained"
              className="header-create-btn"
            >
              Add Audit Event
            </Button>
          </div>
          )}
          <CommonGrid
            className="reports-table-tab"
            componentClassName="commonGrid"
            tableData={isChecklist ? hxAuditDetailsInfo.data[0].audit_events_ids : []}
            sx={isChecklist ? { height: `${tableHeight}px` } : { height: '250px', overflow: 'hidden' }}
            page={page}
            columns={columns()}
            rowCount={isChecklist ? hxAuditDetailsInfo.data[0].audit_events_ids.length : 0}
            limit={20}
            checkboxSelection
            pagination
            disableRowSelectionOnClick
            exportFileName="Assets Info"
            listCount={isChecklist ? hxAuditDetailsInfo.data[0].audit_events_ids.length : 0}
            visibleColumns={visibleColumns}
            onFilterChanges={onFilterChange}
            setVisibleColumns={setVisibleColumns}
            setViewModal={setViewModal}
            loading={hxAuditDetailsInfo && hxAuditDetailsInfo.loading}
            err={hxAuditDetailsInfo && hxAuditDetailsInfo.err}
            showFooter
            CustomFooter={CustomFooter}
            noHeader
            tabTable
            handlePageChange={handlePageChange}
          />
        </div>

        {hxAuditDetailsInfo && hxAuditDetailsInfo.loading && (
        <DetailViewFormat detailResponse={hxAuditDetailsInfo} />
        )}
        <Dialog maxWidth="md" open={formModal}>
          <DialogHeader title={!deleteId ? `${viewId ? 'Update' : 'Add'} Audit Event` : 'Delete Audit Event'} onClose={() => formClose()} response={false} imagePath={false} />
          <AddEvent deleteId={deleteId} auditData={inspDeata} auditId={inspDeata && inspDeata.id} lineId={viewId} editData={editData} onClose={() => formClose()} />
        </Dialog>
      </Col>
    </Row>
  );
};

export default AuditEvents;
