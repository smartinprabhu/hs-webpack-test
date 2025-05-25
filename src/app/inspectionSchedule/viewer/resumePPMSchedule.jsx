/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  CardBody,
} from 'reactstrap';
import {
  getGridStringOperators,
  GridPagination,
} from '@mui/x-data-grid-pro';

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import CommonGrid from '../../commonComponents/commonGridStaticData';
import { ppmStatusLogJson } from '../../commonComponents/utils/util';
import {
  getDefaultNoValue, extractNameObject,
  convertDecimalToTime,
  getCompanyTimezoneDate,
} from '../../util/appUtils';

const RelatedSchedules = React.memo(({
  setEvents, isTopMsg, topMsg, bottomMsg, isCustomMsg, typeSelected, selectedSchedules, events, onClose, onSaveEvents,
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

  const { hxPpmCancelDetails, resumePPMInfo } = useSelector((state) => state.ppm);

  const { userInfo } = useSelector((state) => state.user);

  const checkStatus = (val) => (
    <Box>
      {ppmStatusLogJson.map(
        (status) => val === status.status && (
        <Box
          sx={{
            backgroundColor: status.backgroundColor,
            padding: '4px 8px 4px 8px',
            border: 'none',
            borderRadius: '4px',
            color: status.color,
            fontFamily: 'Suisse Intl',
          }}
        >
          {status.text}
        </Box>
        ),
      )}
    </Box>
  );

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
        starts_on: true,
        ends_on: true,
        maintenance_team_id: true,
        task_id: true,
        state: true,
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
    onSaveEvents();
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
        renderCell: (params) => (
          <span className="ml-2">{params.value === 'e' ? 'Equipment' : 'Space'}</span>
        ),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'state',
        headerName: 'Status',
        flex: 1,
        minWidth: 160,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        renderCell: (params) => (
          <div className="ml-2">{checkStatus(params.value)}</div>
        ),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'starts_on',
        headerName: 'Starts On',
        flex: 1,
        minWidth: 100,
        editable: false,
        valueGetter: (params) => getCompanyTimezoneDate(params.value, userInfo, 'date'),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'ends_on',
        headerName: 'Ends On',
        flex: 1,
        minWidth: 100,
        editable: false,
        valueGetter: (params) => getCompanyTimezoneDate(params.value, userInfo, 'date'),
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
        valueGetter: (params) => (params.row.category_type === 'e'
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
              <h6 className="font-family-tab mb-0" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{params.row.category_type === 'e' ? equipmentName : spaceName}</h6>
              <p className="font-family-tab mb-0 font-tiny" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{params.row.category_type === 'e' ? locationPathName : spacePathName}</p>
            </div>
          );
        },
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
        field: 'task_id',
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

  const loading = (resumePPMInfo && resumePPMInfo.loading) ;

  return (
    <>
      <DialogContent>
        {resumePPMInfo && resumePPMInfo.data
          ? (
            <DialogContentText id="alert-dialog-description">
              <Row className="justify-content-center font-family-tab">
                {resumePPMInfo && resumePPMInfo.data && !loading && (
                <SuccessAndErrorFormat response={resumePPMInfo} successMessage="The PPM schedule  has been resumed successfully.." />
                )}
                {resumePPMInfo && resumePPMInfo.err && (
                <SuccessAndErrorFormat response={resumePPMInfo} />
                )}
                {loading && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
                )}
              </Row>
            </DialogContentText>
          )
          : (
            <DialogContentText id="alert-dialog-description">
              {topMsg && !(selectedRows && selectedRows.length > 0) && (
              <p className="font-tiny font-family-tab ml-2">{topMsg}</p>
              )}
              {isCustomMsg && bottomMsg && selectedRows && selectedRows.length > 0 && (
              <p className="font-family-tab ml-2">
                {count}
                {' '}
                {count === 1 ? 'Schedule' : 'Schedules are'}
                {' '}
                {bottomMsg}
              </p>
              )}
              <Row className="drawer-table-scroll thin-scrollbar">
                <Col xs={12} sm={12} md={12} lg={12} className="">
                  {hxPpmCancelDetails && !hxPpmCancelDetails.loading && hxPpmCancelDetails.data && partsData && partsData.length > 0 && (

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
                  {hxPpmCancelDetails && hxPpmCancelDetails.loading && (
                  <Loader />
                  )}
                </Col>
              </Row>
            </DialogContentText>
          )}
      </DialogContent>
      {typeSelected && typeSelected !== 'current' && (
      <DialogActions>

        {resumePPMInfo && resumePPMInfo.data
          ? (
            <Button
              type="button"
              disabled={!(selectedRows && selectedRows.length > 0)}
              variant="contained"
              className="submit-btn"
              onClick={() => onClose()}
            >
              Ok
            </Button>
          )
          : (
            <>
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
                disabled={!(selectedRows && selectedRows.length > 0)}
                variant="contained"
                className="submit-btn"
                onClick={() => onSave()}
              >
                Resume
              </Button>
            </>
          )}
      </DialogActions>
      )}

    </>
  );
});

export default RelatedSchedules;
