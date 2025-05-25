/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer,
  TextField, Dialog, DialogContent, DialogContentText, DialogActions,
} from '@material-ui/core';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { Autocomplete } from '@material-ui/lab';
import Button from '@mui/material/Button';
import { Tooltip } from 'antd';
import DOMPurify from 'dompurify';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row
} from 'reactstrap';

import editIcon from '@images/icons/edit.svg';
import addIcon from '@images/icons/plusCircleMini.svg';
import DialogHeader from '../../commonComponents/dialogHeader';

import CreateDataEmpty from '@shared/createDataEmpty';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import {
  getAllCompanies,
  getArrayNewFormatUpdateDelete,
  getDefaultNoValue,
} from '../../util/appUtils';
import {
  resetUpdateIncidentInfo, updateIncident,
} from '../ctService';

import ticketData from '../../helpdesk/data/ticketsActions.json';
import { checkInjuries, getInjuriyTypeLabel } from '../../helpdesk/utils/utils';

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

  const { incidentDetailsInfo, updateIncidentInfo, injuiresData } = useSelector((state) => state.hxIncident);

  const loading = incidentDetailsInfo && incidentDetailsInfo.loading;
  const isErr = incidentDetailsInfo && incidentDetailsInfo.err;
  const inspDeata = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.injuries_sustained_ids && inspDeata.injuries_sustained_ids.length > 0);
  const injuriesOriginal = isChecklist ? inspDeata.injuries_sustained_ids : [];
  const injuries = injuriesOriginal.map(injuriesOriginal => ({ ...injuriesOriginal }));

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
        <TableRow key={i}>
          <TableCell className="p-2">
            <TextField type="input" variant="outlined" size="small" name="name" inputProps={{ maxLength: 30 }} value={assetData[i].name} onChange={(e) => onEditDataChange(e, i, 'name')} />
          </TableCell>
          <TableCell className="p-2">
            <TextField type="input" variant="outlined" size="small" name="organization" inputProps={{ maxLength: 30 }} value={assetData[i].organization} onChange={(e) => onEditDataChange(e, i, 'organization')} />
          </TableCell>
          <TableCell className="p-2">
            <TextField type="input" variant="outlined" size="small" name="nature_of_injury" inputProps={{ maxLength: 30 }} value={assetData[i].nature_of_injury} onChange={(e) => onEditDataChange(e, i, 'nature_of_injury')} />
          </TableCell>
          <TableCell className="p-2">
            <TextField type="input" variant="outlined" size="small" name="organ_injured" inputProps={{ maxLength: 30 }} value={assetData[i].organ_injured} onChange={(e) => onEditDataChange(e, i, 'organ_injured')} />
          </TableCell>
          <TableCell className="p-2">
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
          </TableCell>
          <TableCell className="p-2">
            <TextField type="input" variant="outlined" size="small" name="remarks" maxLength="50" value={assetData[i].remarks} onChange={(e) => onEditDataChange(e, i, 'remarks')} />
          </TableCell>
          <TableCell className="p-2" >
            <Tooltip title="Delete">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => onDelete(assetData[i].id, assetData[i].name)}
              />
            </Tooltip>
          </TableCell>
        </TableRow>,
      );
    }
    return tableTr;
  }

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <TableRow key={i}>
          <TableCell className="p-2">{getDefaultNoValue(assetData[i].name)}</TableCell>
          <TableCell className="p-2">{getDefaultNoValue(assetData[i].organization)}</TableCell>
          <TableCell className="p-2">{getDefaultNoValue(assetData[i].nature_of_injury)}</TableCell>
          <TableCell className="p-2">{getDefaultNoValue(assetData[i].organ_injured)}</TableCell>
          <TableCell className="p-2 text-capital">{getDefaultNoValue(assetData[i].status)}</TableCell>
          <TableCell className="p-2">{getDefaultNoValue(assetData[i].remarks)}</TableCell>
          <TableCell className="p-2">
            <Tooltip title="Delete">
              <span className="font-weight-400 d-inline-block" />
              <FontAwesomeIcon
                className="mr-1 ml-1 cursor-pointer"
                size="sm"
                icon={faTrashAlt}
                onClick={() => onDelete(assetData[i].id, assetData[i].name)}
              />
            </Tooltip>
          </TableCell>
        </TableRow>,
      );
    }
    return tableTr;
  }

  const onSave = () => {
    const editId = inspDeata ? inspDeata.id : false;
    const postData = {
      injuries_sustained_ids: appendData && appendData.length > 0 ? getArrayNewFormatUpdateDelete(appendData) : false,
    };
    dispatch(updateIncident(editId, appModels.HXINCIDENT, postData));
  };

  const onUpdate = () => {
    const editId = inspDeata ? inspDeata.id : false;
    const postData = {
      injuries_sustained_ids: editData && editData.length > 0 ? getArrayNewFormatUpdateDelete(editData) : false,
    };
    dispatch(updateIncident(editId, appModels.HXINCIDENT, postData));
  };

  const onRemoveRecord = (id) => {
    const editId = inspDeata ? inspDeata.id : false;
    const postData = {
      injuries_sustained_ids: [[2, id, false]],
    };
    dispatch(updateIncident(editId, appModels.HXINCIDENT, postData));
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
    newData[index][field] = DOMPurify.sanitize(e.target.value);
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
    <Card className="">
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
        <TableContainer component={Paper}>
          <Table responsive className="mb-0 mt-2" width="100%">
            <TableHead>
              <TableRow>
                <TableCell className="p-2 min-width-160 font-weight-700">
                  Name*
                </TableCell>
                <TableCell className="p-2 min-width-100 font-weight-700">
                  Organization*
                </TableCell>
                <TableCell className="p-2 min-width-140 font-weight-700">
                  Nature of Injury*
                </TableCell>
                <TableCell className="p-2 min-width-140 font-weight-700">
                  Organ Injured
                </TableCell>
                <TableCell className="p-2 min-width-160 font-weight-700">
                  Status
                </TableCell>
                <TableCell className="p-2 min-width-160 font-weight-700">
                  Remarks
                </TableCell>
                <TableCell className="p-2 min-width-80 font-weight-700">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!dataEdit
                ? getRow(injuries)
                : getEditRow(editData && editData.length > 0 ? editData : [])}
              {(appendData && appendData.length > 0 && appendData.map((pl, index) => (
                <>
                  {!pl.isRemove && (
                    <TableRow key={index}>
                      <TableCell className="p-2">
                        <TextField type="input" variant="outlined" size="small" name="name" inputProps={{ maxLength: 30 }} value={pl.name} onChange={(e) => onDataChange(e, index, 'name')} />
                      </TableCell>
                      <TableCell className="p-2">
                        <TextField type="input" variant="outlined" size="small" name="organization" inputProps={{ maxLength: 30 }} value={pl.organization} onChange={(e) => onDataChange(e, index, 'organization')} />
                      </TableCell>
                      <TableCell className="p-2">
                        <TextField type="input" variant="outlined" size="small" name="nature_of_injury" inputProps={{ maxLength: 30 }} value={pl.nature_of_injury} onChange={(e) => onDataChange(e, index, 'nature_of_injury')} />
                      </TableCell>
                      <TableCell className="p-2">
                        <TextField type="input" variant="outlined" size="small" name="organ_injured" inputProps={{ maxLength: 30 }} value={pl.organ_injured} onChange={(e) => onDataChange(e, index, 'organ_injured')} />
                      </TableCell>
                      <TableCell className="p-2">
                        <Autocomplete
                          name="status"
                          className="bg-white min-width-160"
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
                      </TableCell>
                      <TableCell className="p-2">
                        <TextareaAutosize style={{
                          width: '-webkit-fill-available',
                          borderRadius: '3px',
                          borderColor: 'rgba(0, 0, 0, 0.23)'
                        }} size="small" name="remarks" value={pl.remarks} maxLength="150" onChange={(e) => onDataChange(e, index, 'remarks')} minRows={1.8} />
                      </TableCell>
                      <TableCell className="p-2">
                        {isManagable && (
                          <Tooltip title="Delete">
                            <span className="font-weight-400 d-inline-block" />
                            <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )))}
            </TableBody>
          </Table>
        </TableContainer>
        <hr className="m-0" />
        {(updateIncidentInfo && updateIncidentInfo.loading) && (
          <div className="text-center mt-3">
            <Loader />
          </div>
        )}
        {dataAdd && !loading && appendData.length > 0 && (
          <div aria-hidden="true" className="float-right cursor-pointer mb-1 mt-2">
            <Button
              type="submit"
              variant="contained"
              className="reset-btn mr-2"
              onClick={() => { setDataAdd(false); setAppendData([]); }}
            >
              Cancel
            </Button>
            <Button
              disabled={!(checkInjuries(appendData))}
              type="submit"
              variant="contained"
              className="mr-2"
              onClick={() => onSave()}
            >
              Save Injuries Sustained
            </Button>
          </div>
        )}
        {dataEdit && (
          <div aria-hidden="true" className="float-right cursor-pointer mb-1 mt-2">
            <Button
              type="submit"
              variant="contained"
              className="reset-btn mr-2"
              onClick={() => { setEditData(injuries); setDataEdit(false); }}
            >
              Cancel
            </Button>
            <Button
              disabled={!(checkInjuries(editData))}
              type="submit"
              variant="contained"
              className="mr-2"
              onClick={() => onUpdate()}
            >
              Update Injuries Sustained
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
          <CreateDataEmpty text="Add your recommendations here." onCreate={loadEmptyTd} />
        )}
        <Dialog size={(updateIncidentInfo && updateIncidentInfo.data) ? 'sm' : 'lg'} open={deleteModal}>
          <DialogHeader title="Delete record" imagePath={false} onClose={() => onRemoveRecordCancel()} response={updateIncidentInfo} sx={{ width: '500px' }} />
          <DialogContent className="mt-0 pt-0">
            <DialogContentText id="alert-dialog-description">
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
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {updateIncidentInfo && !updateIncidentInfo.data && (
              <Button size="sm" variant="contained" disabled={updateIncidentInfo && updateIncidentInfo.loading} onClick={() => onRemoveRecord(removeId)}>Confirm</Button>
            )}
            {updateIncidentInfo && updateIncidentInfo.data && (
              <Button size="sm" variant="contained" onClick={() => onRemoveRecordCancel()}>Ok</Button>
            )}
          </DialogActions>
        </Dialog>
      </CardBody>
    </Card >
  );
};

export default Injuries;
