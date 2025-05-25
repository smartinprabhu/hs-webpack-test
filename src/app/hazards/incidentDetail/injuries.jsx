/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Input,
  Card,
  CardBody,
  Table,
  Modal, ModalBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';

import addIcon from '@images/icons/plusCircleMini.svg';
import editIcon from '@images/icons/edit.svg';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import DetailViewFormat from '@shared/detailViewFormat';
import ErrorContent from '@shared/errorContent';
import CreateDataEmpty from '@shared/createDataEmpty';

import {
  resetUpdateIncidentInfo, updateIncident,
} from '../ctService';
import {
  getDefaultNoValue, getAllCompanies,
  getArrayNewFormatUpdateDelete,
} from '../../util/appUtils';

import { checkInjuries, getInjuriyTypeLabel } from '../../helpdesk/utils/utils';
import ticketData from '../../helpdesk/data/ticketsActions.json';

const appModels = require('../../util/appModels').default;

const Injuries = () => {
  const dispatch = useDispatch();

  const [appendData, setAppendData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [dataAdd, setDataAdd] = useState(false);
  const [dataEdit, setDataEdit] = useState(false);
  const [injuriyTypeOpen, setInjuriyTypeOpen] = useState(false);

  const [removeName, setRemoveName] = useState('');
  const [removeId, setRemoveId] = useState('');
  const [deleteModal, showDeleteModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo);

  const { incidentDetailsInfo, updateIncidentInfo } = useSelector((state) => state.hazards);

  const loading = incidentDetailsInfo && incidentDetailsInfo.loading;
  const isErr = incidentDetailsInfo && incidentDetailsInfo.err;
  const inspDeata = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.injuries_sustained_ids && inspDeata.injuries_sustained_ids.length > 0);
  const injuries = isChecklist ? inspDeata.injuries_sustained_ids : [];

  useEffect(() => {
    // dispatch(resetUpdateIncidentInfo());
  }, []);

  useEffect(() => {
    if (isChecklist) {
      setEditData(injuries);
    }
  }, [incidentDetailsInfo]);

  useEffect(() => {
    if (updateIncidentInfo && updateIncidentInfo.data) {
      // dispatch(resetUpdateIncidentInfo());
      setAppendData([]);
      setDataAdd(false);
    } else if (updateIncidentInfo && updateIncidentInfo.err) {
      dispatch(resetUpdateIncidentInfo());
    }
  }, [updateIncidentInfo]);

  useEffect(() => {
    if (dataAdd) {
      setAppendData(appendData);
    }
  }, [dataAdd]);

  useEffect(() => {
    if (dataEdit) {
      setEditData(editData);
    }
  }, [dataEdit]);

  const onDelete = (id, name) => {
    dispatch(resetUpdateIncidentInfo());
    setRemoveId(id);
    setRemoveName(name);
    showDeleteModal(true);
  };

  const onEditDataChange = (e, index, field) => {
    const newData = editData;
    newData[index][field] = e.target.value;
    setEditData(newData);
    setDataEdit(Math.random());
  };

  const onDataEditStatusChange = (e, index) => {
    const newData = editData;
    newData[index].status = e.value;
    setEditData(newData);
    setDataEdit(Math.random());
  };

  function getEditRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td>
            <Input type="input" name="name" maxLength="30" value={assetData[i].name} onChange={(e) => onEditDataChange(e, i, 'name')} />
          </td>
          <td>
            <Input type="input" name="organization" maxLength="30" value={assetData[i].organization} onChange={(e) => onEditDataChange(e, i, 'organization')} />
          </td>
          <td>
            <Input type="input" name="nature_of_injury" maxLength="30" value={assetData[i].nature_of_injury} onChange={(e) => onEditDataChange(e, i, 'nature_of_injury')} />
          </td>
          <td>
            <Input type="input" name="organ_injured" maxLength="30" value={assetData[i].organ_injured} onChange={(e) => onEditDataChange(e, i, 'organ_injured')} />
          </td>
          <td>
            <Autocomplete
              name="status"
              className="bg-white min-width-200"
              isRequired
              open={injuriyTypeOpen === i}
              size="small"
              onOpen={() => {
                setInjuriyTypeOpen(i);
              }}
              onClose={() => {
                setInjuriyTypeOpen(false);
              }}
              value={getInjuriyTypeLabel(assetData[i].status)}
              disableClearable
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={ticketData.incidentStatus}
              onChange={(e, data) => onDataEditStatusChange(data, i)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </td>
          <td>
            <Input type="input" name="remarks" maxLength="50" value={assetData[i].remarks} onChange={(e) => onEditDataChange(e, i, 'remarks')} />
          </td>
          <td className="p-2">
            <Tooltip title="Delete">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => onDelete(assetData[i].id, assetData[i].name)}
              />
            </Tooltip>
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].name)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].organization)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].nature_of_injury)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].organ_injured)}</td>
          <td className="p-2 text-capital">{getDefaultNoValue(assetData[i].status)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].remarks)}</td>
          <td className="p-2">
            <Tooltip title="Delete">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => onDelete(assetData[i].id, assetData[i].name)}
              />
            </Tooltip>
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  const onSave = () => {
    const editId = inspDeata ? inspDeata.id : false;
    const postData = {
      injuries_sustained_ids: appendData && appendData.length > 0 ? getArrayNewFormatUpdateDelete(appendData) : false,
    };
    dispatch(updateIncident(editId, appModels.EHSHAZARD, postData));
  };

  const onUpdate = () => {
    const editId = inspDeata ? inspDeata.id : false;
    const postData = {
      injuries_sustained_ids: editData && editData.length > 0 ? getArrayNewFormatUpdateDelete(editData) : false,
    };
    dispatch(updateIncident(editId, appModels.EHSHAZARD, postData));
  };

  const onRemoveRecord = (id) => {
    const editId = inspDeata ? inspDeata.id : false;
    const postData = {
      injuries_sustained_ids: [[2, id, false]],
    };
    dispatch(updateIncident(editId, appModels.EHSHAZARD, postData));
  };

  const onRemoveRecordCancel = () => {
    dispatch(resetUpdateIncidentInfo());
    showDeleteModal(false);
  };

  const loadEmptyTd = () => {
    const newData = appendData && appendData.length ? appendData : [];
    newData.push({
      id: false, name: '', organization: '', nature_of_injury: '', organ_injured: '', status: '', remarks: '',
    });
    setAppendData(newData);
    setDataAdd(Math.random());
  };

  const onDataChange = (e, index, field) => {
    const newData = appendData;
    newData[index][field] = e.target.value;
    setAppendData(newData);
    setDataAdd(Math.random());
  };

  const onDataStatusChange = (e, index) => {
    const newData = appendData;
    newData[index].status = e.value;
    setAppendData(newData);
    setDataAdd(Math.random());
  };

  const removeData = (e, index) => {
    const newData = appendData;
    const { id } = newData[index];
    if (id) {
      newData[index].isRemove = true;
      setAppendData(newData);
      setDataAdd(Math.random());
    } else {
      newData.splice(index, 1);
      setAppendData(newData);
      setDataAdd(Math.random());
    }
  };

  const isManagable = inspDeata && (inspDeata.state === 'Reported' || inspDeata.state === 'Work in Progress' || inspDeata.state === 'Acknowledged');

  return (
    <Card className="h-100">
      <Row>
        <Col md="9" sm="12" xs="12" lg="9">
          <p className="ml-3 mb-0 mt-2 font-weight-600 text-pale-sky font-size-13">INJURIES SUSTAINED</p>
        </Col>
        <Col md="3" sm="12" xs="12" lg="3" className="mb-0 mt-2 text-right">
          {!dataEdit && isManagable && (
          <>
            <Tooltip title="Add">
              <img src={addIcon} aria-hidden="true" className="mr-3 mb-1 cursor-pointer" alt="addequipment" height="15" width="15" onClick={loadEmptyTd} />
            </Tooltip>
            {injuries.length > 0 && !dataAdd && (
            <Tooltip title="Edit">
              <img src={editIcon} aria-hidden="true" className="mr-3 mb-1 cursor-pointer" alt="addequipment" height="15" width="15" onClick={() => setDataEdit(true)} />
            </Tooltip>
            )}
          </>
          )}
        </Col>
      </Row>
      <CardBody className="p-0 calendar-form-content thin-scrollbar">
        <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table " width="100%">
          <thead>
            <tr>
              <th className="p-2 min-width-160">
                Name
              </th>
              <th className="p-2 min-width-100">
                Organization
              </th>
              <th className="p-2 min-width-160">
                Nature of Injury
              </th>
              <th className="p-2 min-width-160">
                Organ Injured
              </th>
              <th className="p-2 min-width-160">
                Status
              </th>
              <th className="p-2 min-width-160">
                Remarks
              </th>
              <th className="p-2 min-width-100">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!dataEdit
              ? getRow(injuries)
              : getEditRow(editData && editData.length > 0 ? editData : [])}
            {(appendData && appendData.length > 0 && appendData.map((pl, index) => (
              <>
                {!pl.isRemove && (
                <tr key={index}>
                  <td>
                    <Input type="input" name="name" maxLength="30" value={pl.name} onChange={(e) => onDataChange(e, index, 'name')} />
                  </td>
                  <td>
                    <Input type="input" name="organization" maxLength="30" value={pl.organization} onChange={(e) => onDataChange(e, index, 'organization')} />
                  </td>
                  <td>
                    <Input type="input" name="nature_of_injury" maxLength="30" value={pl.nature_of_injury} onChange={(e) => onDataChange(e, index, 'nature_of_injury')} />
                  </td>
                  <td>
                    <Input type="input" name="organ_injured" maxLength="30" value={pl.organ_injured} onChange={(e) => onDataChange(e, index, 'organ_injured')} />
                  </td>
                  <td>
                    <Autocomplete
                      name="status"
                      className="bg-white min-width-200"
                      isRequired
                      open={injuriyTypeOpen === index}
                      size="small"
                      onOpen={() => {
                        setInjuriyTypeOpen(index);
                      }}
                      onClose={() => {
                        setInjuriyTypeOpen(false);
                      }}
                      value={getInjuriyTypeLabel(pl.status)}
                      disableClearable
                      getOptionSelected={(option, value) => option.label === value.label}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                      options={ticketData.incidentStatus}
                      onChange={(e, data) => onDataStatusChange(data, index)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          className="without-padding"
                          placeholder="Search"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </td>
                  <td>
                    <Input type="input" name="remarks" value={pl.remarks} maxLength="50" onChange={(e) => onDataChange(e, index, 'remarks')} />
                  </td>
                  <td>
                    {isManagable && (
                    <Tooltip title="Delete">
                      <span className="font-weight-400 d-inline-block" />
                      <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                    </Tooltip>
                    )}
                  </td>
                </tr>
                )}
              </>
            )))}
          </tbody>
        </Table>
        <hr className="m-0" />
        {(updateIncidentInfo && updateIncidentInfo.loading) && (
        <div className="text-center mt-3">
          <Loader />
        </div>
        )}
        {dataAdd && (
        <div aria-hidden="true" className="float-right cursor-pointer mb-1 mt-2">
          <Button
            size="sm"
             variant="contained"
            className="btn-cancel mr-2"
            onClick={() => { setDataAdd(false); setAppendData([]); }}
          >
            Cancel
          </Button>
          <Button
            disabled={!(checkInjuries(appendData))}
            type="submit"
            size="sm"
             variant="contained"
            onClick={() => onSave()}
          >
            Save
          </Button>
        </div>
        )}
        {dataEdit && (
        <div aria-hidden="true" className="float-right cursor-pointer mb-1 mt-2">
          <Button
            size="sm"
             variant="contained"
            className="btn-cancel mr-2"
            onClick={() => setDataEdit(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={!(checkInjuries(editData))}
            type="submit"
            size="sm"
             variant="contained"
            onClick={() => onUpdate()}
          >
            Update
          </Button>
        </div>
        )}
        {loading && (
        <div className="text-center mt-3">
          <Loader />
        </div>
        )}
        {!isErr && inspDeata && !isManagable && !isChecklist && !loading && appendData.length === 0 && (
        <ErrorContent errorTxt="No Data Found" />
        )}
        {!isErr && inspDeata && isManagable && !isChecklist && !loading && appendData.length === 0 && (
        <CreateDataEmpty text="No data found create new record." onCreate={loadEmptyTd} />
        )}
        <Modal size={(updateIncidentInfo && updateIncidentInfo.data) ? 'sm' : 'lg'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={deleteModal}>
          <ModalHeaderComponent title="Delete record" imagePath={false} closeModalWindow={() => onRemoveRecordCancel()} response={updateIncidentInfo} />
          <ModalBody className="mt-0 pt-0">
            {updateIncidentInfo && (!updateIncidentInfo.data && !updateIncidentInfo.loading && !updateIncidentInfo.err) && (
            <p className="text-center">
              {`Are you sure, you want to remove ${removeName} record ?`}
            </p>
            )}
            {updateIncidentInfo && updateIncidentInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(updateIncidentInfo && updateIncidentInfo.err) && (
            <SuccessAndErrorFormat response={updateIncidentInfo} />
            )}
            {(updateIncidentInfo && updateIncidentInfo.data) && (
            <SuccessAndErrorFormat response={updateIncidentInfo} successMessage="Record removed successfully.." />
            )}
            <div className="pull-right mt-3">
              {updateIncidentInfo && !updateIncidentInfo.data && (
              <Button size="sm" disabled={updateIncidentInfo && updateIncidentInfo.loading}  variant="contained" onClick={() => onRemoveRecord(removeId)}>Confirm</Button>
              )}
              {updateIncidentInfo && updateIncidentInfo.data && (
              <Button size="sm"  variant="contained" onClick={() => onRemoveRecordCancel()}>Ok</Button>
              )}
            </div>
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default Injuries;
