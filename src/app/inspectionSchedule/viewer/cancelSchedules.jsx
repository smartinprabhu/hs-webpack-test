/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import {
  getGridStringOperators,
} from '@mui/x-data-grid-pro';

import DetailViewFormat from '@shared/detailViewFormat';

import CommonGrid from '../../commonComponents/commonGridStaticData';

import {
  getDefaultNoValue, convertDecimalToTime,
  extractNameObject, truncate,
} from '../../util/appUtils';

const CancelSchedules = () => {
  const {
    hxInspCancelDetails,
  } = useSelector((state) => state.inspection);
  const { userInfo } = useSelector((state) => state.user);

  const inspDeata = hxInspCancelDetails && hxInspCancelDetails.data && hxInspCancelDetails.data.length ? hxInspCancelDetails.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.hx_inspection_ids && inspDeata.hx_inspection_ids.length > 0);

  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});

  const [viewModal, setViewModal] = useState(false);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        category_type: true,
        equipment_id: true,
        space_id: true,
        starts_at: true,
        duration: true,
        group_id: true,
        task_id: true,
      });
    }
  }, [visibleColumns]);

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
        field: 'starts_at',
        headerName: 'Starts On (HH:MM)',
        flex: 1,
        minWidth: 100,
        editable: false,
        valueGetter: (params) => params.value,
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
        field: 'duration',
        headerName: 'Ends On (HH:MM)',
        flex: 1,
        minWidth: 100,
        editable: false,
        valueGetter: (params) => convertDecimalToTime(parseFloat(params.row.starts_at) + parseFloat(params.row.duration)),
        renderCell: (params) => {
          const durationString = convertDecimalToTime(parseFloat(params.row.starts_at) + parseFloat(params.row.duration));
          return (
            <span>{durationString}</span>
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
  const rowCount = isChecklist ? hxInspCancelDetails.data[0].hx_inspection_ids.length + 1 : 1;
  // Calculate the height
  const tableHeight = Math.min(rowCount * rowHeight, maxHeight);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab product-orders">
        <div>
          <CommonGrid
            className="reports-table-tab"
            componentClassName="commonGrid"
            tableData={isChecklist ? hxInspCancelDetails.data[0].hx_inspection_ids : []}
            sx={isChecklist ? { height: `${tableHeight}px` } : { height: '250px', overflow: 'hidden' }}
            page={page}
            columns={columns()}
            rowCount={isChecklist ? hxInspCancelDetails.data[0].hx_inspection_ids.length : 0}
            limit={20}
            checkboxSelection
            pagination
            disableRowSelectionOnClick
            exportFileName="Schedules Info"
            listCount={isChecklist ? hxInspCancelDetails.data[0].hx_inspection_ids.length : 0}
            visibleColumns={visibleColumns}
            onFilterChanges={onFilterChange}
            setVisibleColumns={setVisibleColumns}
            setViewModal={setViewModal}
            loading={hxInspCancelDetails && hxInspCancelDetails.loading}
            err={hxInspCancelDetails && hxInspCancelDetails.err}
            noHeader
            tabTable
            handlePageChange={handlePageChange}
          />
        </div>

        {hxInspCancelDetails && hxInspCancelDetails.loading && (
        <DetailViewFormat detailResponse={hxInspCancelDetails} />
        )}

      </Col>
    </Row>
  );
};

export default CancelSchedules;
