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
  extractNameObject, getCompanyTimezoneDate,
} from '../../util/appUtils';

const CancelDateRanges = () => {
  const {
    hxInspCancelDetails,
  } = useSelector((state) => state.inspection);
  const { userInfo } = useSelector((state) => state.user);

  const inspDeata = hxInspCancelDetails && hxInspCancelDetails.data && hxInspCancelDetails.data.length ? hxInspCancelDetails.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.date_range_ids && inspDeata.date_range_ids.length > 0);

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
        from_date: true,
        to_date: true,
        is_all_upcoming: true,
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
        field: 'from_date',
        headerName: 'Start Date',
        flex: 1,
        minWidth: 160,
        editable: false,
        valueGetter: (params) => getCompanyTimezoneDate(params.value, userInfo, 'date'),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'to_date',
        headerName: 'End Date',
        flex: 1,
        minWidth: 160,
        editable: false,
        valueGetter: (params) => getCompanyTimezoneDate(params.value, userInfo, 'date'),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'is_all_upcoming',
        headerName: 'All Upcoming',
        flex: 1,
        minWidth: 100,
        editable: false,
        valueGetter: (params) => params.value,
        renderCell: (params) => {
          const durationString = params.value ? 'Yes' : 'No';
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

  const rowHeight = 90; // Approximate height of a single row in pixels
  const maxHeight = window.innerHeight - 270; // Max height based on viewport
  const rowCount = isChecklist ? hxInspCancelDetails.data[0].date_range_ids.length + 1 : 1;
  // Calculate the height
  const tableHeight = Math.min(rowCount * rowHeight, maxHeight);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab product-orders">
        <div>
          <CommonGrid
            className="reports-table-tab"
            componentClassName="commonGrid"
            tableData={isChecklist ? hxInspCancelDetails.data[0].date_range_ids : []}
            sx={isChecklist ? { height: `${tableHeight}px` } : { height: '250px', overflow: 'hidden' }}
            page={page}
            columns={columns()}
            rowCount={isChecklist ? hxInspCancelDetails.data[0].date_range_ids.length : 0}
            limit={20}
            checkboxSelection
            pagination
            disableRowSelectionOnClick
            exportFileName="Schedules Info"
            listCount={isChecklist ? hxInspCancelDetails.data[0].date_range_ids.length : 0}
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

export default CancelDateRanges;
