/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGridStringOperators,
} from '@mui/x-data-grid-pro';
import {
  Button, Dialog,
} from '@mui/material';
import {
  faPencil,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DetailViewFormat from '@shared/detailViewFormat';

import CommonGrid from '../../commonComponents/commonGridStaticData';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  resetUpdateHxAudit,
  getHxAuditDetails,
} from '../auditService';
import {
  getDefaultNoValue, extractNameObject, getAllowedCompanies,
  generateErrorMessage, getListOfModuleOperations, truncate,
  getCompanyTimezoneDate,
} from '../../util/appUtils';
import AddAuditor from './sections/addAuditor';
import actionCodes from '../data/actionCodes.json';

const appModels = require('../../util/appModels').default;

const Auditors = () => {
  const { hxAuditDetailsInfo, hxAuditUpdate } = useSelector((state) => state.hxAudits);
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const loading = hxAuditDetailsInfo && hxAuditDetailsInfo.loading;
  const isErr = hxAuditDetailsInfo && hxAuditDetailsInfo.err;
  const inspDeata = hxAuditDetailsInfo && hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length ? hxAuditDetailsInfo.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.auditors_ids && inspDeata.auditors_ids.length > 0);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Audit Management', 'code');

  const isAuditorCreatable = (inspDeata && inspDeata.state !== 'Signed off' && inspDeata.state !== 'Canceled') && allowedOperations.includes(actionCodes['Create Auditor']);
  const isAuditorEditable = (inspDeata && inspDeata.state !== 'Signed off' && inspDeata.state !== 'Canceled') && allowedOperations.includes(actionCodes['Edit Auditor']);

  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});

  const [formModal, setFormModal] = useState(false);
  const [viewId, setViewId] = useState(0);
  const [deleteId, setDeleteId] = useState(0);
  const [editData, setEditData] = useState({});
  const [viewModal, setViewModal] = useState(false);

  const dispatch = useDispatch();

  const handlePageChange = (page) => {
    setPage(page);
  };

  const formClose = () => {
    if (hxAuditUpdate && hxAuditUpdate.data) {
      dispatch(getHxAuditDetails(inspDeata && inspDeata.id, appModels.HXAUDIT));
    }
    setFormModal(false);
    setViewId(false);
    setEditData(false);
    setDeleteId(false);
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
    if (isAuditorEditable) {
      setViewId(id);
      setDeleteId(false);
      dispatch(resetUpdateHxAudit());
      setFormModal(true);
    }
  };

  const onDeleteOpen = (id) => {
    if (isAuditorEditable) {
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
        field: 'auditor_id',
        headerName: 'Name',
        flex: 2,
        minWidth: 200,
        editable: false,
        valueGetter: (params) => extractNameObject(params.value, 'name'),
        renderCell: (params) => (
          <div style={{
            display: 'flex', flexDirection: 'column', whiteSpace: 'normal', wordWrap: 'break-word',
          }}
          >
            <p className="font-family-tab mb-0" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
              {extractNameObject(params.row.auditor_id, 'name')}
            </p>
          </div>
        ),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'role_id',
        headerName: 'Function',
        flex: 1,
        minWidth: 100,
        valueGetter: (params) => extractNameObject(params.value, 'name'),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'type',
        headerName: 'Type',
        flex: 1,
        minWidth: 150,
        valueGetter: (params) => getDefaultNoValue(extractNameObject(params.row.auditor_id, 'type')),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'certification_status',
        headerName: 'Certification Status',
        flex: 1,
        minWidth: 150,
        valueGetter: (params) => getDefaultNoValue(extractNameObject(params.row.auditor_id, 'certification_status')),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'certificate_expires_on',
        headerName: 'Certification Expiry',
        flex: 1,
        minWidth: 200,
        valueGetter: (params) => getCompanyTimezoneDate(
          getDefaultNoValue(extractNameObject(params.row.auditor_id, 'certificate_expires_on')),
          userInfo,
          'datetime',
        ),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'is_spoc',
        headerName: 'SPOC',
        flex: 1,
        minWidth: 100,
        valueGetter: (params) => (params.value ? 'Yes' : 'No'),
        func: getValue,
        filterable: false,
      },
      {
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isAuditorEditable && (
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
            {isAuditorEditable && (
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

  // Update visibleColumns initialization in useEffect
  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        auditor_id: true,
        role_id: true,
        type: true,
        certification_status: true,
        certificate_expires_on: true,
        is_spoc: true,
      });
    }
  }, [visibleColumns]);

  const onFilterChange = (data) => {
    if (data.items && data.items.length) {
      setPage(0);
    }
  };

  const rowHeight = 80; // Approximate height of a single row in pixels
  const maxHeight = window.innerHeight - 270; // Max height based on viewport
  const rowCount = isChecklist ? hxAuditDetailsInfo.data[0].auditors_ids.length + 1 : 1;
  // Calculate the height
  const tableHeight = Math.min(rowCount * rowHeight, maxHeight);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="pr-3 pl-3 pb-3 products-list-tab product-orders">

        <div>
          <h6 className="font-family-tab mb-2 display-flex content-center">
            Auditors
            {isAuditorCreatable && (
            <span className="text-right margin-left-auto">
              <Button
                onClick={() => onCreateOpen()}
                type="button"
                variant="contained"
                className="header-create-btn"
              >
                Add Auditor
              </Button>
            </span>
            )}
          </h6>
          <CommonGrid
            className="reports-table-tab"
            sx={isChecklist ? { height: `${tableHeight}px` } : { height: '250px', overflow: 'hidden' }}
            componentClassName="commonGrid"
            tableData={isChecklist ? hxAuditDetailsInfo.data[0].auditors_ids : []}
            page={page}
            columns={columns()}
            rowCount={isChecklist ? hxAuditDetailsInfo.data[0].auditors_ids.length : 0}
            limit={20}
            checkboxSelection
            pagination
            tabTable
            disableRowSelectionOnClick
            exportFileName="Assets Info"
            listCount={isChecklist ? hxAuditDetailsInfo.data[0].auditors_ids.length : 0}
            visibleColumns={visibleColumns}
            onFilterChanges={onFilterChange}
            setVisibleColumns={setVisibleColumns}
            setViewModal={setViewModal}
            loading={hxAuditDetailsInfo && hxAuditDetailsInfo.loading}
            err={hxAuditDetailsInfo && hxAuditDetailsInfo.err}
            noHeader
            handlePageChange={handlePageChange}
          />
        </div>

        {hxAuditDetailsInfo && hxAuditDetailsInfo.loading && (
        <DetailViewFormat detailResponse={hxAuditDetailsInfo} />
        )}
        <Dialog maxWidth="md" open={formModal}>
          <DialogHeader title={!deleteId ? `${viewId ? 'Update' : 'Add'} Auditor` : 'Delete Auditor'} onClose={() => formClose()} response={false} imagePath={false} />
          <AddAuditor deleteId={deleteId} auditId={inspDeata && inspDeata.id} lineId={viewId} editData={editData} onClose={() => formClose()} />
        </Dialog>
      </Col>
    </Row>
  );
};

export default Auditors;
