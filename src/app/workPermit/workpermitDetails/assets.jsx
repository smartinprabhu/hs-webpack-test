/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGridStringOperators,
} from '@mui/x-data-grid-pro';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  Button, Dialog,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';

import DetailViewFormat from '@shared/detailViewFormat';

import DialogHeader from '../../commonComponents/dialogHeader';
import CommonGrid from '../../commonComponents/commonGridStaticData';

import actionCodes from '../data/actionCodes.json';

import {
  getDefaultNoValue, getColumnArrayById,
  extractNameObject, getListOfModuleOperations,
} from '../../util/appUtils';
import { updateProductCategory, resetUpdateProductCategory } from '../../pantryManagement/pantryService';
import { getWorkPermitDetails } from '../workPermitService';

import SpaceSelection from '../../inspectionSchedule/viewer/spaceSelection';
import EquipmentsSelection from '../../commonComponents/equipmentsSelection';

import { assetStatusJson } from '../../commonComponents/utils/util';
import DeleteAsset from './deleteAsset';

const appModels = require('../../util/appModels').default;

const Assets = () => {
  const {
    workPermitDetail,
  } = useSelector((state) => state.workpermit);
  const { userRoles } = useSelector((state) => state.user);

  const inspDeata = workPermitDetail && workPermitDetail.data && workPermitDetail.data.length ? workPermitDetail.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.equipment_ids && inspDeata.equipment_ids.length > 0);
  const isChecklist1 = (inspDeata && inspDeata.space_ids && inspDeata.space_ids.length > 0);

  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [visibleColumns1, setVisibleColumns1] = useState({});

  const [assetFilterModal, setAssetFilterModal] = useState(false);
  const [spaceFilterModal, setSpaceFilterModal] = useState(false);

  const dispatch = useDispatch();

  const [formEqModal, setFormEqModal] = useState(false);
  const [formSpaceModal, setFormSpaceModal] = useState(false);
  const [viewId, setViewId] = useState(0);
  const [deleteEqId, setEqDeleteId] = useState(0);
  const [deleteSpaceId, setSpaceDeleteId] = useState(0);
  const [editData, setEditData] = useState({});
  const [viewModal, setViewModal] = useState(false);
  const [dataAdd, setAdd] = useState(false);

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Work Permit',
    'code',
  );

  const { updateProductCategoryInfo } = useSelector((state) => state.pantry);

  const isStatusEditable = inspDeata && inspDeata.state && (inspDeata.state !== 'Cancel' && inspDeata.state !== 'Closed' && inspDeata.state !== 'Permit Rejected');

  const isSingleData = (isChecklist && inspDeata && inspDeata.type === 'Equipment' && inspDeata && inspDeata.equipment_ids && inspDeata.equipment_ids.length === 1) || (isChecklist1 && inspDeata && inspDeata.type === 'Space' && inspDeata && inspDeata.space_ids && inspDeata.space_ids.length === 1);

  const isDeleteable = allowedOperations.includes(actionCodes['Edit Work Permit']) && isStatusEditable && !isSingleData;

  const isUpdate = allowedOperations.includes(actionCodes['Edit Work Permit']) && isStatusEditable;

  const onEquipmentDeleteOpen = (id, isAdd) => {
    if (isDeleteable) {
      if (!isAdd) {
        dispatch(resetUpdateProductCategory());
      }
      setViewId(id);
      setEqDeleteId(id);
      setFormEqModal(true);
      setAdd(!!isAdd);
    }
  };

  const onSpaceDeleteOpen = (id, isAdd) => {
    if (isDeleteable) {
      if (!isAdd) {
        dispatch(resetUpdateProductCategory());
      }
      setViewId(id);
      setSpaceDeleteId(id);
      setFormSpaceModal(true);
      setAdd(!!isAdd);
    }
  };

  const formClose = () => {
    if (updateProductCategoryInfo && updateProductCategoryInfo.data) {
      dispatch(getWorkPermitDetails(inspDeata && inspDeata.id, appModels.WORKPERMIT));
    }
    setFormEqModal(false);
    setFormSpaceModal(false);
    setViewId(false);
    setSpaceDeleteId(false);
    setEqDeleteId(false);
    setAdd(false);
    setEditData(false);
    dispatch(resetUpdateProductCategory());
  };

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        name: true,
        location_id: true,
        category_id: true,
        equipment_seq: true,
        state: true,
      });
    }
  }, [visibleColumns]);

  useEffect(() => {
    if (
      visibleColumns1
      && Object.keys(visibleColumns1)
      && Object.keys(visibleColumns1).length === 0
    ) {
      setVisibleColumns1({
        category_type: true,
        equipment_id: true,
        space_id: true,
        starts_at: true,
        duration: true,
        group_id: true,
        task_id: true,
      });
    }
  }, [visibleColumns1]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const CheckAssetStatus = (val) => (
    <>
      {val.json && val.json.map((statusData) => (
        <strong>
          {(statusData.status === val.val.formattedValue || statusData.text === val.val.formattedValue) && (
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
            </Box>
          )}
        </strong>
      ))}
    </>
  );

  const eqColumns = () => (
    [
      {
        field: 'name',
        headerName: 'Name',
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
        field: 'equipment_seq',
        headerName: 'Asset Number',
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
        field: 'state',
        headerName: 'Status',
        flex: 1,
        minWidth: 180,
        editable: false,
        type: 'singleSelect',
        getOptionLabel: (value) => value?.text,
        getOptionValue: (value) => value?.status,
        valueOptions: assetStatusJson,
        renderCell: (val) => <CheckAssetStatus val={val} json={assetStatusJson} />,
        valueGetter: (params) => getDefaultNoValue(params.value),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'location_id',
        headerName: 'Location',
        flex: 1,
        minWidth: 180,
        editable: false,
        valueGetter: (params) => getDefaultNoValue(extractNameObject(params.value, 'path_name')),
        func: getDefaultNoValue,
        filterOperators: getGridStringOperators().filter(
          (operator) => operator.value === 'contains',
        ),
      },
      {
        field: 'category_id',
        headerName: 'Category',
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
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isDeleteable && (
            <Tooltip title="Delete">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => { setEditData(params.row); onEquipmentDeleteOpen(params.id); }}
              />
            </Tooltip>
            )}
          </>
        ),
      },
    ]);

  const spaceColumns = () => (
    [
      {
        field: 'space_name',
        headerName: 'Name',
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
        field: 'sequence_asset_hierarchy',
        headerName: 'Asset Number',
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
        field: 'path_name',
        headerName: 'Full Path',
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
        field: 'asset_category_id',
        headerName: 'Category',
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
        field: 'action',
        headerName: 'Action',
        actionType: 'both',
        width: 120,
        editable: false,
        renderCell: (params) => (
          <>
            {isDeleteable && (
            <Tooltip title="Delete">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => { setEditData(params.row); onSpaceDeleteOpen(params.id); }}
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

  const onAddAsset = (data) => {
    if (inspDeata && inspDeata.id) {
      let postDataValues = {};
      if (inspDeata && inspDeata.type === 'Equipment') {
        postDataValues = {
          equipment_ids: [[6, 0, getColumnArrayById(data, 'id')]],
        };
        if (data && data.length === 1) {
          postDataValues.equipment_id = data[0].id;
        }
      } else if (inspDeata && inspDeata.type === 'Space') {
        postDataValues = {
          space_ids: [[6, 0, getColumnArrayById(data, 'id')]],
        };
        if (data && data.length === 1) {
          postDataValues.space_id = data[0].id;
        }
      }
      dispatch(updateProductCategory(inspDeata.id, appModels.WORKPERMIT, postDataValues));
      if (inspDeata && inspDeata.type === 'Equipment') {
        onEquipmentDeleteOpen(inspDeata && inspDeata.id, 'add');
      } else if (inspDeata && inspDeata.type === 'Space') {
        onSpaceDeleteOpen(inspDeata && inspDeata.id, 'add');
      }
    }
  };

  const onAssetModalChange = (data) => {
    if (data && data.length) {
      const newData = data.filter((item) => item.name);
      // const allData = [...newData, ...equipments];
      const newData1 = [...new Map(newData.map((item) => [item.id, item])).values()];
      onAddAsset(newData1);
    }
  };

  const onSpaceModalChange = (data) => {
    setSpaceFilterModal(false);
    onAddAsset(data);
  };

  const onEquipmentAdd = (data) => {
    console.log(data);
  };

  const onFetchAssetSchedules = () => {
    setAssetFilterModal(false);
  };

  const rowHeight = 100; // Approximate height of a single row in pixels
  const maxHeight = window.innerHeight - 270; // Max height based on viewport
  const rowCount = isChecklist ? workPermitDetail.data[0].equipment_ids.length + 1 : 1;
  // Calculate the height
  const tableHeight = Math.min(rowCount * rowHeight, maxHeight);

  const rowCount1 = isChecklist1 ? workPermitDetail.data[0].space_ids.length + 1 : 1;
  // Calculate the height
  const tableHeight1 = Math.min(rowCount1 * rowHeight, maxHeight);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab product-orders">
        <div>
          {inspDeata && inspDeata.type === 'Equipment' && (
            <>
              {isUpdate && (
              <div className="text-right mb-2 p-2">
                <Button
                  type="button"
                  variant="contained"
                  size="small"
                  onClick={() => setAssetFilterModal(true)}
                >
                  Select Equipment
                </Button>
                {assetFilterModal && (
                <EquipmentsSelection
                  onAssetModalChange={onAssetModalChange}
                  filterModal={assetFilterModal}
                  setEquipments={onEquipmentAdd}
                  equipments={isChecklist ? workPermitDetail.data[0].equipment_ids : []}
                  finishText="Update Equipment"
                  onClose={onFetchAssetSchedules}
                  onCancel={() => setAssetFilterModal(false)}
                />
                )}
              </div>
              )}
              <CommonGrid
                className="reports-table-tab"
                componentClassName="commonGrid"
                tableData={isChecklist ? workPermitDetail.data[0].equipment_ids : []}
                sx={isChecklist ? { height: `${tableHeight}px` } : { height: '250px', overflow: 'hidden' }}
                page={page}
                columns={eqColumns()}
                rowCount={isChecklist ? workPermitDetail.data[0].equipment_ids.length : 0}
                limit={20}
                checkboxSelection
                pagination
                disableRowSelectionOnClick
                exportFileName="Schedules Info"
                listCount={isChecklist ? workPermitDetail.data[0].equipment_ids.length : 0}
                visibleColumns={visibleColumns}
                onFilterChanges={onFilterChange}
                setVisibleColumns={setVisibleColumns}
                setViewId={setViewId}
                setViewModal={setViewModal}
                loading={workPermitDetail && workPermitDetail.loading}
                err={workPermitDetail && workPermitDetail.err}
                noHeader
                tabTable
                handlePageChange={handlePageChange}
              />
            </>
          )}
          {inspDeata && inspDeata.type === 'Space' && (
            <>
              {isUpdate && (
              <div className="text-right mb-2 p-2">
                <Button
                  type="button"
                  variant="contained"
                  size="small"
                  onClick={() => setSpaceFilterModal(true)}
                >
                  Select Spaces
                </Button>
                {spaceFilterModal && (
                <SpaceSelection
                  filterModal={spaceFilterModal}
                  spaces={isChecklist1 ? workPermitDetail.data[0].space_ids : []}
                  setSpaces={onSpaceModalChange}
                  finishText="Update Spaces"
                  onCancel={() => setSpaceFilterModal(false)}
                />
                )}
              </div>
              )}

              <CommonGrid
                className="reports-table-tab"
                componentClassName="commonGrid"
                tableData={isChecklist1 ? workPermitDetail.data[0].space_ids : []}
                sx={isChecklist1 ? { height: `${tableHeight1}px` } : { height: '250px', overflow: 'hidden' }}
                page={page}
                columns={spaceColumns()}
                rowCount={isChecklist1 ? workPermitDetail.data[0].space_ids.length : 0}
                limit={20}
                checkboxSelection
                pagination
                disableRowSelectionOnClick
                exportFileName="Schedules Info"
                listCount={isChecklist ? workPermitDetail.data[0].space_ids.length : 0}
                visibleColumns={visibleColumns1}
                onFilterChanges={onFilterChange}
                setViewId={setViewId}
                setVisibleColumns={setVisibleColumns1}
                setViewModal={setViewModal}
                loading={workPermitDetail && workPermitDetail.loading}
                err={workPermitDetail && workPermitDetail.err}
                noHeader
                tabTable
                handlePageChange={handlePageChange}
              />
            </>
          )}
        </div>

        {workPermitDetail && workPermitDetail.loading && (
        <DetailViewFormat detailResponse={workPermitDetail} />
        )}

        <Dialog PaperProps={{ style: { width: '600px', maxWidth: '600px' } }} open={formEqModal}>
          <DialogHeader title={`${dataAdd ? 'Update' : 'Delete'} ${editData && editData.name ? editData.name : 'Equipment'}`} onClose={() => formClose()} response={false} imagePath={false} />
          <DeleteAsset isAdd={dataAdd} equipments={isChecklist ? workPermitDetail.data[0].equipment_ids : []} spaces={isChecklist1 ? workPermitDetail.data[0].space_ids : []} deleteId={deleteEqId} type="equipment" wpId={inspDeata && inspDeata.id} editData={editData} onClose={() => formClose()} />
        </Dialog>

        <Dialog PaperProps={{ style: { width: '600px', maxWidth: '600px' } }} open={formSpaceModal}>
          <DialogHeader title={`${dataAdd ? 'Update' : 'Delete'} ${editData && editData.space_name ? editData.space_name : 'Space'}`} onClose={() => formClose()} response={false} imagePath={false} />
          <DeleteAsset isAdd={dataAdd} equipments={isChecklist ? workPermitDetail.data[0].equipment_ids : []} spaces={isChecklist1 ? workPermitDetail.data[0].space_ids : []} deleteId={deleteSpaceId} type="space" wpId={inspDeata && inspDeata.id} editData={editData} onClose={() => formClose()} />
        </Dialog>

      </Col>
    </Row>
  );
};

export default Assets;
