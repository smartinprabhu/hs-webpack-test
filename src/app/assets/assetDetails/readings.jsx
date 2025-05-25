/* eslint-disable no-loop-func */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import editIcon from '@images/icons/edit.svg';
import CreateList from '@shared/listViewFilters/create';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  Dialog, DialogContent, DialogContentText, Drawer, Button,
} from '@mui/material';
import { getReadings, resetUpdateEquipment, resetAddReadingLogInfo } from '../equipmentService';
import { setInitialValues } from '../../purchase/purchaseService';
import { getDefaultNoValue, generateErrorMessage, getListOfModuleOperations } from '../../util/appUtils';
import ReadingsDetailInfo from './readingsDetailInfo';
import AddReading from './readings/addReading';
import ReadingLog from './readingsLogNew';
import actionCodes from '../data/assetActionCodes.json';
import {
  getDeleteChecklist, resetDeleteChecklist,
} from '../../adminSetup/maintenanceConfiguration/maintenanceService';
import DialogHeader from '../../commonComponents/dialogHeader';
import DrawerHeader from '../../commonComponents/drawerHeader';

const appModels = require('../../util/appModels').default;

const Readings = React.memo((props) => {
  const {
    ids, viewId, type, setViewModal, setEquipmentDetails, editReadings,
  } = props;
  const dispatch = useDispatch();
  const [editData, setEditData] = useState([]);
  const [readingModal, showReadingModal] = useState(false);
  const [viewLogLink, setViewLogLink] = useState(false);
  const [addReadingModal, showAddReadingModal] = useState(false);
  const [deleteModal, showDeleteModal] = useState(false);
  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [openEditReadingModal, setOpenEditReadingModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);

  const [sortBy, setSortBy] = useState('ASC');
  const [sortField, setSortField] = useState('reading_id');
  const {
    userInfo, userRoles,
  } = useSelector((state) => state.user);
  const {
    checklistDeleteInfo,
  } = useSelector((state) => state.maintenance);
  const {
    assetReadings, addReadingInfo, equipmentsDetails, getSpaceInfo, updateEquipment,
  } = useSelector((state) => state.equipment);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Asset Registry', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Reading']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Reading']);
  const isDeleteable = allowedOperations.includes(actionCodes['Delete Reading']);

  let titleName = '';
  if (type === 'space') {
    titleName = getSpaceInfo && (getSpaceInfo.data && getSpaceInfo.data.length > 0) ? getSpaceInfo.data[0].name : false;
  } else {
    titleName = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0].name : false;
  }

  useEffect(() => {
    if (ids) {
      dispatch(getReadings(ids, appModels.READINGSLINE, sortField, sortBy));
    }
  }, [ids, sortField, sortBy]);

  const onRemoveChecklist = (id) => {
    dispatch(getDeleteChecklist(id, appModels.READINGSLINE));
  };

  const onRemoveChecklistCancel = () => {
    if (ids) {
      dispatch(getReadings(ids, appModels.READINGSLINE, sortField, sortBy));
    }
    dispatch(resetDeleteChecklist());
    showDeleteModal(false);
  };

  const onViewLogs = (assetData) => {
    dispatch(setInitialValues(false, false, false, false));
    setEditData(assetData);
    setViewLogLink(true);
    setViewModal(true);
    setEquipmentDetails(false);
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">
            <span
              aria-hidden="true"
              className="font-weight-600 cursor-pointer"
              onClick={() => { setEditData(assetData[i]); showReadingModal(true); }}
            >
              {getDefaultNoValue(assetData[i].reading_id ? assetData[i].reading_id[1] : '')}
            </span>
          </td>
          <td className="p-2">{assetData[i].is_active ? 'Yes' : 'No'}</td>
          <td className="p-2">{assetData[i].type}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].uom_id ? assetData[i].uom_id[1] : '')}</td>
          <td className="p-2">
            {!editReadings && (
              <Button
                variant="contained"
                size="sm"
                className="pb-05 pt-05 font-11 rounded-pill mb-1 mr-2"
                onClick={() => { onViewLogs(assetData[i]); }}
              >
                View Logs
              </Button>
            )}
            {isEditable && (
            <img
              aria-hidden="true"
              src={editIcon}
              className="cursor-pointer ml-1 mr-3"
              height="12"
              width="12"
              alt="edit"
              onClick={() => { setSelectedUser(assetData[i].id); setEditData(assetData[i]); setOpenEditReadingModal(true); dispatch(resetUpdateEquipment()); }}
            />
            )}
            {!editReadings && isDeleteable && (
              <FontAwesomeIcon
                className="mr-3 ml-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => { setRemoveId(assetData[i].id); setRemoveName(assetData[i].reading_id ? assetData[i].reading_id[1] : ''); showDeleteModal(true); }}
              />
            )}
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  const onAddReset = () => {
    if (ids) {
      // dispatch(getReadings(ids, appModels.READINGSLINE, sortField, sortBy));
    }
    dispatch(resetUpdateEquipment());
    dispatch(resetAddReadingLogInfo());
  };

  const onReset = () => {
    dispatch(resetUpdateEquipment());
    dispatch(resetAddReadingLogInfo());
  };

  const closeReadings = () => {
    setViewLogLink(false);
    setViewModal(true);
    setEquipmentDetails(true);
    dispatch(setInitialValues(false, false, false, false));
  };

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className={`p-3 ${!editReadings ? 'bg-white comments-list thin-scrollbar' : ''}`}>
          <h6>
            Readings
            {!editReadings && isCreatable && (
              <span className="float-right">
                <CreateList name="Add an Reading" showCreateModal={() => { dispatch(resetUpdateEquipment()); showAddReadingModal(true); }} />
              </span>
            )}
          </h6>
          {(assetReadings && assetReadings.data) && (
            <div>
              <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                <thead className="bg-gray-light">
                  <tr>
                    <th className="p-2 min-width-160">
                      <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('reading_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Reading
                      </span>
                    </th>
                    <th className="p-2 min-width-80">
                      Active
                    </th>
                    <th className="p-2 min-width-100">
                      <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('type'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Type
                      </span>
                    </th>
                    <th className="p-2 min-width-160">
                      <span aria-hidden className="sort-by cursor-pointer" onClick={() => { setSortField('uom_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Unit of Measure
                      </span>
                    </th>
                    <th className="p-2 min-width-160">
                      Manage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getRow(assetReadings && assetReadings.data ? assetReadings.data : [])}
                </tbody>
              </Table>
              <hr className="m-0" />
            </div>
          )}
          {assetReadings && assetReadings.loading && (
            <Loader />
          )}
          {(assetReadings && assetReadings.err) && (
            <ErrorContent errorTxt={generateErrorMessage(assetReadings)} />
          )}
        </Col>
      </Row>
      <Dialog size="lg" fullWidth open={readingModal}>
        <DialogHeader title="Readings Overview" imagePath={false} onClose={() => { showReadingModal(false); }} response={[]} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <ReadingsDetailInfo editData={editData} afterReset={() => { showReadingModal(false); }} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        maxWidth={updateEquipment && updateEquipment.data}
        fullWidth={updateEquipment && !updateEquipment.data}
        open={addReadingModal}
      >
        <DialogHeader title="Add Reading" imagePath={false} onClose={() => { showAddReadingModal(false); onReset(); }} response={addReadingInfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddReading
              viewId={viewId}
              editData={[]}
              afterReset={() => { showAddReadingModal(false); onAddReset(); }}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        size="lg"
        maxWidth={updateEquipment && updateEquipment.data}
        fullWidth={updateEquipment && !updateEquipment.data}
        open={openEditReadingModal}
      >
        <DialogHeader title="Edit Reading" imagePath={false} onClose={() => { setOpenEditReadingModal(false); onReset(); }} response={addReadingInfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddReading
              viewId={viewId}
              editData={editData}
              selectedUser={selectedUser}
              isTheme={editReadings}
              afterReset={() => { setOpenEditReadingModal(false); onReset(); }}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" maxWidth open={deleteModal}>
        <DialogHeader title="Delete Reading" imagePath={false} onClose={() => onRemoveChecklistCancel()} response={checklistDeleteInfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {checklistDeleteInfo && (!checklistDeleteInfo.data && !checklistDeleteInfo.loading && !checklistDeleteInfo.err) && (
              <p className="text-center">
                {`Are you sure, you want to remove ${removeName} readings ?`}
              </p>
            )}
            {checklistDeleteInfo && checklistDeleteInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
            )}
            {(checklistDeleteInfo && checklistDeleteInfo.err) && (
              <SuccessAndErrorFormat response={checklistDeleteInfo} />
            )}
            {(checklistDeleteInfo && checklistDeleteInfo.data) && (
              <SuccessAndErrorFormat response={checklistDeleteInfo} successMessage="Reading removed successfully.." />
            )}
            <div className="pull-right mt-3">
              {checklistDeleteInfo && !checklistDeleteInfo.data && (
                <Button size="sm" disabled={checklistDeleteInfo && checklistDeleteInfo.loading} variant="contained" onClick={() => onRemoveChecklist(removeId)}>Confirm</Button>
              )}
              {checklistDeleteInfo && checklistDeleteInfo.data && (
                <Button size="sm" variant="contained" onClick={() => onRemoveChecklistCancel()}>Ok</Button>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewLogLink}
      >
        <DrawerHeader
          headerName="Reading Logs"
          imagePath=""
          onClose={closeReadings}
        />
        <ReadingLog types={type} editId={viewId} editData={editData} readingsData={assetReadings && assetReadings.data ? assetReadings.data : []} />
      </Drawer>
    </>
  );
});

Readings.defaultProps = {
  setViewModal: () => { },
  editReadings: false,
  setEquipmentDetails: () => { },
};

Readings.propTypes = {
  viewId: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  setViewModal: PropTypes.func,
  setEquipmentDetails: PropTypes.func,
  editReadings: PropTypes.bool,
};
export default Readings;
