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
import Drawer from '@mui/material/Drawer';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import {
  FormHelperText,
} from '@material-ui/core';

import {
  faPencil,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DetailViewFormat from '@shared/detailViewFormat';
import ErrorContent from '@shared/errorContent';
import TrackerCheck from '@images/icons/auditBlue.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import DrawerHeader from '../../commonComponents/drawerHeader';
import {
  hxAuditActionStatusJson,
} from '../../commonComponents/utils/util';

import {
  getDeleteAuditAction, resetCreateHxAction, getHxAuditActions, getHxAuditActionDetail, resetDeleteAuditAction,
} from '../auditService';
import DialogHeader from '../../commonComponents/dialogHeader';
import CommonGrid from '../../commonComponents/commonGridStaticData';

import {
  getDefaultNoValue, extractNameObject, getCompanyTimezoneDate,
  generateErrorMessage, getListOfModuleOperations, truncate,
} from '../../util/appUtils';
import appModels from '../../util/appModels';
import { getActionDueDays } from '../utils/utils';
import AuditActionDetails from './auditActionDetails';
import actionCodes from '../data/actionCodes.json';
import CreateNonConformity from './createNonConformity';

const AuditActions = ({ noView, questionId }) => {
  const {
    hxAuditDetailsInfo, hxAuditActions, hxActionCreate, hxAuditActionDetail, hxDeleteAuditAction,
  } = useSelector((state) => state.hxAudits);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const loading = hxAuditActions && hxAuditActions.loading;
  const isErr = hxAuditActions && hxAuditActions.err;
  const inspDeata = hxAuditActions && hxAuditActions.data && hxAuditActions.data.length ? hxAuditActions.data : false;
  const inspDeata1 = hxAuditDetailsInfo && hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length ? hxAuditDetailsInfo.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.length > 0);

  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [viewId, setViewId] = useState(0);
  const [viewModal, setViewModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [dataFormModal, setDataFormModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  const [pageData, setPageData] = useState([]);
  const [type, setType] = useState('Non-conformity');
  const [editData, setEditData] = useState({});

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Audit Management', 'code');

  const isAuditActionCreatable = (inspDeata && inspDeata.state !== 'Signed off' && inspDeata.state !== 'Canceled') && allowedOperations.includes(actionCodes['Create Audit Action']);
  const isAuditActionEditable = (inspDeata && inspDeata.state !== 'Signed off' && inspDeata.state !== 'Canceled') && allowedOperations.includes(actionCodes['Edit Audit Action']);

  useEffect(() => {
    if (inspDeata1 && inspDeata1.id) {
      dispatch(getHxAuditActions(appModels.HXAUDITACTION, inspDeata1.id, questionId));
    }
  }, [inspDeata1, questionId]);

  useEffect(() => {
    if (hxAuditActions && hxAuditActions.data) {
      const sData = hxAuditActions.data.length ? hxAuditActions.data.filter((item) => item.type === type) : [];
      setPageData(sData);
    }
  }, [hxAuditActions, type]);

  useEffect(() => {
    if (viewId) {
      dispatch(getHxAuditActionDetail(viewId, appModels.HXAUDITACTION));
    }
  }, [viewId]);

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
    if (inspDeata1 && inspDeata1.id) {
      dispatch(getHxAuditActions(appModels.HXAUDITACTION, inspDeata1.id, questionId));
    }
  };

  const onDeleteOpen = (id) => {
    if (isAuditActionEditable) {
      setDeleteId(id);
      dispatch(resetDeleteAuditAction());
      setViewModal(false);
    }
  };

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        name: true,
        type: true,
        severity: true,
        deadline: true,
        state: true,
        question_id: false,
        responsible_id: true,
        resolution: true,
        resolution_window_id: true,
        description: true,
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

  const deleteAction = () => {
    if (deleteId) {
      dispatch(getDeleteAuditAction(deleteId, appModels.HXAUDITACTION));
    }
  };

  const onUpdateOpen = (id) => {
    if (isAuditActionEditable) {
      setViewModal(false);
      setViewId(id);
      setDeleteId(false);
      dispatch(resetCreateHxAction());
      setDataFormModal(true);
    }
  };

  const CheckStatus = (val) => (
    <>
      {val.json && val.json.map((statusData) => (
        <strong>
          {(statusData.status === val.val || statusData.text === val.val) && (
            <Box
              sx={{
                backgroundColor: statusData.backgroundColor,
                padding: '4px 8px 4px 8px',
                border: 'none',
                borderRadius: '4px',
                color: statusData.color,
                fontFamily: 'Suisse Intl',
              }}
            >
              {statusData.text}
              {' '}
              {val.val !== 'Closed' ? getActionDueDays(val.deadLine) : ''}
            </Box>
          )}
        </strong>
      ))}
    </>
  );

  const columns = () => (
    [
      {
        field: 'name',
        headerName: 'Name',
        width: 600,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        renderCell: (params) => {
          const actName = getDefaultNoValue(params.row.name);

          return (
            <div
              style={{
                display: 'flex', maxHeight: '70px', overflowY: 'auto', overflowX: 'hidden', padding: '10px', flexDirection: 'column', whiteSpace: 'normal', wordWrap: 'break-word',
              }}
              title={actName}
            >
              <p className="font-family-tab mb-0" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{actName}</p>
            </div>
          );
        },
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'type',
        headerName: 'Type',
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
        field: 'severity',
        headerName: 'Severity',
        width: 150,
        editable: true,
        renderCell: (val) => {
          if (val.row.severity === 'High') {
            return <span className="text-danger font-family-tab font-weight-800">High</span>;
          } if (val.row.severity === 'Medium') {
            return <span className="text-info font-family-tab font-weight-800">Medium</span>;
          } if (val.row.severity === 'Low') {
            return <span className="text-warning font-family-tab font-weight-800">Low</span>;
          }
          return <span className="font-weight-800 font-family-tab">-</span>;
        },
        valueGetter: (params) => getValue(params.value),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'state',
        headerName: 'Status',
        flex: 1,
        minWidth: 190,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(params.value),
        valueOptions: hxAuditActionStatusJson,
        renderCell: (params) => <CheckStatus val={params.value} json={hxAuditActionStatusJson} deadLine={params.row.deadline} />,
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'deadline',
        headerName: 'Deadline',
        flex: 1,
        minWidth: 170,
        valueGetter: (params) => getCompanyTimezoneDate(params.value, userInfo, 'date'),
        func: getValue,
        filterable: false,
      },
      {
        field: 'sla_status',
        headerName: 'SLA Status',
        width: 150,
        editable: true,
        renderCell: (val) => {
          if (val.row.sla_status === 'Within SLA') {
            return <span className="text-success font-family-tab font-weight-800">Within SLA</span>;
          } if (val.row.sla_status === 'SLA Elapsed') {
            return <span className="text-danger font-family-tab font-weight-800">SLA Elapsed</span>;
          }
          return <span className="font-weight-800 font-family-tab">-</span>;
        },
        valueGetter: (params) => getValue(params.value),
        func: getValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'question_id',
        headerName: 'Checklist',
        flex: 3, // More space for longer text
        minWidth: 300,
        editable: false,
        valueGetter: (params) => extractNameObject(params.value, 'question'),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'responsible_id',
        headerName: 'Responsible',
        flex: 1, // More space for longer text
        minWidth: 180,
        editable: false,
        valueGetter: (params) => extractNameObject(params.value, 'name'),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'resolution_window_id',
        headerName: 'Days',
        flex: 1,
        minWidth: 150,
        editable: false,
        valueGetter: (params) => extractNameObject(params.value, 'name'),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'description',
        headerName: 'Description',
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
        field: 'resolution',
        headerName: 'Resolutuon',
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
        actionType: false,
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {!(params.row.state === 'Closed' || params.row.state === 'Cancelled') && isAuditActionEditable && (
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
            {!(params.row.state === 'Closed' || params.row.state === 'Cancelled') && isAuditActionEditable && (
            <Tooltip title="Delete">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => { setFormModal(true); setEditData(params.row); onDeleteOpen(params.id); }}
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

  const formClose = () => {
    if (hxDeleteAuditAction && hxDeleteAuditAction.data && inspDeata1 && inspDeata1.id) {
      dispatch(getHxAuditActions(appModels.HXAUDITACTION, inspDeata1.id, questionId));
    }
    setViewModal(false);
    setFormModal(false);
    setDeleteId(false);
    setEditData(false);
    dispatch(resetDeleteAuditAction());
  };

  const onCreateClose = () => {
    if (inspDeata1 && hxActionCreate && hxActionCreate.data) {
      dispatch(getHxAuditActions(appModels.HXAUDITACTION, inspDeata1.id, questionId));
    }
    dispatch(resetCreateHxAction());
    setDataFormModal(false);
  };

  const rowHeight = 100; // Approximate height of a single row in pixels
  const maxHeight = window.innerHeight - 270; // Max height based on viewport
  const rowCount = isChecklist ? pageData.length + 1 : 1;
  // Calculate the height
  const tableHeight = Math.min(rowCount * rowHeight, maxHeight);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-2 products-list-tab product-orders">
        {isChecklist && (
        <>
          <div className="mb-2 p-2">
            <ButtonGroup
              variant="contained"
              size="small"
              aria-label="Basic button group"
            >
              <Button
                onClick={() => setType('Non-conformity')}
                variant={type === 'Non-conformity' ? 'contained' : 'outlined'}
                color={type === 'Non-conformity' ? 'primary' : 'inherit'}
              >
                Non Conformity
              </Button>
              <Button
                onClick={() => setType('Improvement Opportunity')}
                variant={type === 'Improvement Opportunity' ? 'contained' : 'outlined'}
                color={type === 'Improvement Opportunity' ? 'primary' : 'inherit'}
              >
                Improvement Opportunity
              </Button>
            </ButtonGroup>
          </div>

          <div>
            <CommonGrid
              className="reports-table-tab"
              componentClassName="commonGrid"
              tableData={pageData}
              sx={isChecklist ? { height: `${tableHeight}px` } : { height: '250px', overflow: 'hidden' }}
              page={page}
              columns={columns()}
              rowCount={pageData.length}
              limit={20}
              checkboxSelection
              pagination
              disableRowSelectionOnClick
              exportFileName="Assets Info"
              listCount={pageData.length}
              visibleColumns={visibleColumns}
              onFilterChanges={onFilterChange}
              setVisibleColumns={setVisibleColumns}
              setViewId={setViewId}
              setViewModal={setViewModal}
              tabTable
              loading={hxAuditActions && hxAuditActions.loading}
              err={hxAuditActions && hxAuditActions.err}
              noHeader
              handlePageChange={handlePageChange}
            />
            <Drawer
              PaperProps={{
                sx: { width: '90%' },
              }}
              anchor="right"
              open={!noView && !dataFormModal && !formModal && viewModal}
              ModalProps={{
                disableEnforceFocus: true,
              }}
            >
              <DrawerHeader
                headerName={hxAuditActionDetail && (hxAuditActionDetail.data && hxAuditActionDetail.data.length > 0 && !hxAuditActionDetail.loading)
                  ? hxAuditActionDetail.data[0].name : 'Audit Action'}
                imagePath={TrackerCheck}
                onClose={() => onViewReset()}
              />
              <AuditActionDetails offset={false} />

            </Drawer>
          </div>
        </>
        )}
        <DetailViewFormat detailResponse={hxAuditActions} />
        {!isErr && !(hxAuditActions && hxAuditActions.data && hxAuditActions.data.length > 0) && !loading && (
        <ErrorContent errorTxt="No Data Found" />
        )}
        <Dialog maxWidth="md" open={formModal}>
          <DialogHeader title="Delete Audit Action" onClose={() => formClose()} response={false} imagePath={false} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {!(hxDeleteAuditAction && hxDeleteAuditAction.data) && !(hxDeleteAuditAction.loading) && (
              <Row>
                <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                  <p className="font-family-tab text-center">
                    Are you sure, you want to delete
                    {' '}
                    {editData.name}
                  </p>
                </Col>
              </Row>
              )}
              {hxDeleteAuditAction && hxDeleteAuditAction.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {(hxDeleteAuditAction && hxDeleteAuditAction.err) && (
              <FormHelperText><span className="text-danger font-family-tab">Something went wrong..</span></FormHelperText>
              )}
              {hxDeleteAuditAction && hxDeleteAuditAction.data && !hxDeleteAuditAction.loading && (
              <SuccessAndErrorFormat response={hxDeleteAuditAction} successMessage="The Audit Action deleted successfully." />
              )}
              <hr className="mb-0" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {!(hxDeleteAuditAction && hxDeleteAuditAction.data) && (
            <>
              <Button
                type="button"
                variant="contained"
                className="submit-btn"
                disabled={hxDeleteAuditAction.loading}
                onClick={() => deleteAction()}
              >
                Yes

              </Button>
              <Button
                type="button"
                variant="contained"
                className="reset-btn"
                disabled={hxDeleteAuditAction.loading}
                onClick={() => formClose()}
              >
                No

              </Button>
            </>
            )}
            {(hxDeleteAuditAction && hxDeleteAuditAction.data) && (
            <Button
              type="button"
              variant="contained"
              className="submit-btn"
              onClick={() => formClose()}
              disabled={hxDeleteAuditAction.loading}
            >
              OK
            </Button>
            )}
          </DialogActions>
        </Dialog>
        <Dialog maxWidth="md" open={dataFormModal}>
          <DialogHeader title="Update Audit Action" onClose={() => onCreateClose()} response={false} imagePath={false} />
          <CreateNonConformity
            onRemarksSaveClose={false}
            qtnDataId={viewId}
            currentAnswer={false}
            currentRemarks={false}
            onMessageChange={false}
            qtnName={false}
            editData={editData}
            type={editData.type}
            onClose={() => onCreateClose()}
            auditId={inspDeata1.id}
            qtnId={false}
          />
        </Dialog>
      </Col>
    </Row>
  );
};

export default AuditActions;
