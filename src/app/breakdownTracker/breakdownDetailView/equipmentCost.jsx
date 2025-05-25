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
import { resetUpdateHxAudit } from '../../auditManagement/auditService';
import { getAssetDetail } from '../../assets/equipmentService';

import CommonGrid from '../../commonComponents/commonGridStaticData';

// import {
//   resetUpdateHxAudit,
//   getHxAuditDetails,
// } from '../auditService';
import {
  getReadings, resetReadings,
} from '../../assets/equipmentService';

import {
  getDefaultNoValue,
  getCompanyTimezoneDateForColumns,
  numToFloat,
} from '../../util/appUtils';
import AddEquipmentCost from './addEquipmentCost';

const appModels = require('../../util/appModels').default;

const AuditEvents = ({ breakdownId }) => {
  const { equipmentsDetails, assetReadings } = useSelector((state) => state.equipment);
  const loading = (equipmentsDetails && equipmentsDetails.loading) || (assetReadings && assetReadings.loading);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { hxAuditUpdate } = useSelector((state) => state.hxAudits);

  const inspDeata = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length ? equipmentsDetails.data[0] : false;

  const isChecklist = (assetReadings && assetReadings.data && assetReadings.data.length > 0);

  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});

  const [formModal, setFormModal] = useState(false);
  const [viewId, setViewId] = useState(0);
  const [deleteId, setDeleteId] = useState(0);
  const [editData, setEditData] = useState({});
  const [viewModal, setViewModal] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if ((equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length && equipmentsDetails.data[0].equipment_cost_ids && equipmentsDetails.data[0].equipment_cost_ids.length)) {
      const fields = ['id', 'name', 'category_id', 'amount', 'date', 'related_model', 'related_model_id', 'description'];
      dispatch(getReadings(equipmentsDetails.data[0].equipment_cost_ids, appModels.EQUIPMENTCOST, false, false, fields));
    } else {
      dispatch(resetReadings());
    }
  }, [equipmentsDetails]);

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
      dispatch(getAssetDetail(inspDeata && inspDeata.id, appModels.EQUIPMENT));
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
    setViewId(id);
    setDeleteId(false);
    dispatch(resetUpdateHxAudit());
    setFormModal(true);
  };

  const onDeleteOpen = (id) => {
    setViewId(id);
    setDeleteId(id);
    dispatch(resetUpdateHxAudit());
    setFormModal(true);
  };

  function numToFloatValue(num) {
    if (num === null || num === undefined || Number.isNaN(num)) {
      return '0.00';
    }
    return parseFloat(num).toFixed(2);
  }

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
        field: 'category_id',
        headerName: 'Category',
        flex: 1,
        minWidth: 160,
        editable: false,
        valueGetter: (params) => getValue(params.value),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'amount',
        headerName: 'Amount',
        flex: 1,
        minWidth: 180,
        editable: false,
        valueGetter: (params) => numToFloat(params.value),
        func: numToFloat,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'date',
        headerName: 'Date',
        width: 160,
        editable: true,
        // valueGetter: (params) => getValue(params.value),
        valueGetter: (params) => getCompanyTimezoneDateForColumns(params.value, 'date'),
        func: getValue,
        filterable: false,
      },
      {
        field: 'description',
        headerName: 'Description',
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
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            <Tooltip title="Edit">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-3 cursor-pointer"
                size="sm"
                icon={faPencil}
                onClick={() => { setEditData(params.row); onUpdateOpen(params.id); }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => { setEditData(params.row); onDeleteOpen(params.id); }}
              />
            </Tooltip>
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
  const rowCount = isChecklist ? assetReadings.data.length + 1 : 1;
  // Calculate the height
  const tableHeight = Math.min(rowCount * rowHeight, maxHeight);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab product-orders">
        <p className="font-family-tab text-info mb-0 font-tiny">Note: Add , Update and Delete Cost</p>
        <div>
          <div className="text-right mb-2 p-2">
            <Button
              onClick={() => onCreateOpen()}
              type="button"
              variant="contained"
              className="header-create-btn"
            >
              Add Cost
            </Button>
          </div>
          <CommonGrid
            className="reports-table-tab"
            componentClassName="commonGrid"
            tableData={isChecklist ? assetReadings.data : []}
            sx={isChecklist ? { height: `${tableHeight}px` } : { height: '250px', overflow: 'hidden' }}
            page={page}
            columns={columns()}
            rowCount={isChecklist ? assetReadings.data.length : 0}
            limit={20}
            checkboxSelection
            pagination
            disableRowSelectionOnClick
            exportFileName="Assets Info"
            listCount={isChecklist ? assetReadings.data.length : 0}
            visibleColumns={visibleColumns}
            onFilterChanges={onFilterChange}
            setVisibleColumns={setVisibleColumns}
            setViewModal={setViewModal}
            setViewId={setViewId}
            loading={loading}
            err={assetReadings && assetReadings.err}
            noHeader
            tabTable
            handlePageChange={handlePageChange}
          />
        </div>

        {assetReadings && assetReadings.loading && (
        <DetailViewFormat detailResponse={assetReadings} />
        )}
        <Dialog maxWidth="md" open={formModal}>
          <DialogHeader title={!deleteId ? `${viewId ? 'Update' : 'Add'} Cost` : 'Delete Cost'} onClose={() => formClose()} response={false} imagePath={false} />
          <AddEquipmentCost deleteId={deleteId} breakdownId={breakdownId} auditId={inspDeata && inspDeata.id} lineId={viewId} editData={editData} onClose={() => formClose()} />
        </Dialog>
      </Col>
    </Row>
  );
};

export default AuditEvents;
