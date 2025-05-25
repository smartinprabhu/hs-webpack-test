/* eslint-disable react/forbid-prop-types */
/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-no-duplicate-props */
import {
  Input, CardBody,
  Row, Col, Table,
} from 'reactstrap';
import moment from 'moment';
import { Button } from '@mui/material';
import { DatePicker } from 'antd';
import * as PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import {
  FormControl, CircularProgress, TextField, FormHelperText, 
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import uniqBy from 'lodash/uniqBy';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import addIcon from '@images/icons/plusCircleBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import theme from '../../util/materialTheme';
import {
  decimalKeyPressDown, getAllCompanies, generateErrorMessage, checkDatehasObject, getDateTimeUtc, getDateTimeSeconds,
} from '../../util/appUtils';
import {
  getReading, createReadingLog, resetAddReadingLogInfo, updateEquipmentData, resetUpdateEquipment, getSpaceTypes,
} from '../equipmentService';
import {
  getRequiredMessage, getNewArrayReading, getNewArrayUpdateReading,
} from '../utils/utils';
import { getEquipmentList } from '../../helpdesk/ticketService';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const AddGaugeLog = (props) => {
  const {
    viewId, type,
    selectedUser, editData,
    afterReset,
    readingsData,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [checkListData, setCheckListData] = useState([]);
  const [readingLineData, setReadingLineData] = useState([]);
  const [checkListAdd, setCheckListAdd] = useState('');
  const [equipmentKeyWord, setEquipmentKeyword] = useState('');
  const [spaceKeyWord, setSpaceKeyword] = useState('');
  const [readingKeyword, setReadingKeyword] = useState('');
  const [equipmentOpen, setEquipmentOpen] = useState('');
  const [spaceOpen, setSpaceOpen] = useState('');
  const [readingOpen, setReadingOpen] = useState('');
  const [dateError, setDateError] = useState(false);
  const [readingOptions, setReadingOptions] = useState(false);
  const history = useHistory();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    addReadingInfo, readingsList, assetReadings, equipmentsDetails, updateEquipment, getSpaceInfo,
  } = useSelector((state) => state.equipment);
  const { equipmentInfo } = useSelector((state) => state.ticket);
  const { spaceInfo } = useSelector((state) => state.equipment);

  const companyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  useEffect(() => {
    if (checkListAdd) {
      setCheckListData(checkListData);
    }
  }, [checkListAdd]);

  const onReset = () => {
    dispatch(resetAddReadingLogInfo());
  };

  useEffect(() => {
    onReset();
  }, []);

  const getReadingLineValues = (id, readingLines) => {
    let readingData = [];
    if (id && readingLines && readingLines.data && readingLines.data.length > 0) {
      readingData = readingLines.data.filter((item) => item.reading_id && item.reading_id[0] === id);
      if (readingData && readingData.length > 0) {
        const arr = [...readingLineData, ...readingData];
        setReadingLineData(arr);
      }
    }
  };

  useEffect(() => {
    if (editData) {
      const readingIdValue = editData.reading_id && editData.reading_id.length > 0 ? editData.reading_id[0] : '';
      getReadingLineValues(readingIdValue, assetReadings);
    }
  }, [editData]);

  const onToolsAdd = () => {
    if (selectedUser) {
      const newData = getNewArrayUpdateReading(checkListData);
      if (newData && newData.length > 0) {
        const postData = newData[0];
        if (!getRequiredMessage(readingLineData, newData)) {
          setDateError(false);
          dispatch(updateEquipmentData(selectedUser, postData, appModels.READINGSLOG));
        } else {
          setDateError(getRequiredMessage(readingLineData, newData));
        }
      }
    } else {
      const newData = getNewArrayReading(checkListData);
      const payload = { model: appModels.READINGSLOG, values: newData };
      if (!getRequiredMessage(readingLineData, newData)) {
        setDateError(false);
        dispatch(createReadingLog(appModels.READINGSLOG, payload));
      } else {
        setDateError(getRequiredMessage(readingLineData, newData));
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyWord));
      }
    })();
  }, [equipmentOpen, equipmentKeyWord]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getSpaceTypes(companies, appModels.EQUIPMENT, spaceKeyWord));
      }
    })();
  }, [spaceOpen, spaceKeyWord]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && typeof readingOpen === 'number') {
        await dispatch(getReading(appModels.READINGS, readingKeyword));
      }
    })();
  }, [readingOpen, readingKeyword]);

  const equipmentId = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 ? equipmentsDetails.data[0].id : '';
  const equipmentName = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 ? equipmentsDetails.data[0].name : '';

  const spaceId = getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length > 0 ? getSpaceInfo.data[0].id : '';
  const spaceName = getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length > 0 ? getSpaceInfo.data[0].name : '';

  useEffect(() => {
    if (editData) {
      const newData = checkListData;
      const equipmentIdValue = editData.equipment_id && editData.equipment_id.length > 0 ? [editData.equipment_id[0], editData.equipment_id[1]] : [equipmentId, equipmentName];
      const spaceIdValue = editData.space_id && editData.space_id.length > 0 ? [editData.space_id[0], editData.space_id[1]] : [spaceId, spaceName];
      const readingIdValue = editData.reading_id && editData.reading_id.length > 0 ? [editData.reading_id[0], editData.reading_id[1]] : '';
      const measureDate = editData.date ? editData.date : '';
      newData.push({
        equipment_id: type === 'space' ? false : viewId, reading_id: readingIdValue, readingValue: readingIdValue, equipmentValue: equipmentIdValue, spaceValue: spaceIdValue, value: editData.value, date: measureDate, date_utc: measureDate, space_id: type === 'space' ? viewId : false, company_id: companyId, logType: type,
      });
      setCheckListData(newData);
      setCheckListAdd(Math.random());
    }
  }, [editData]);

  const loadEmptyTd = () => {
    const newData = checkListData;
    newData.push({
      equipment_id: type === 'space' ? false : viewId, reading_id: '', readingValue: '', equipmentValue: [equipmentId, equipmentName], spaceValue: [spaceId, spaceName], value: 0.00, date: '', space_id: type === 'space' ? viewId : false, company_id: companyId, logType: type,
    });
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const removeData = (e, index) => {
    const checkData = checkListData;
    checkData.splice(index, 1);
    setCheckListData(checkData);
    setCheckListAdd(Math.random());
  };

  const onChangeCheckList = (e, name, index) => {
    const newData = checkListData;
    let field = 'readingValue';
    if (name === 'equipment_id') {
      field = 'equipmentValue';
    }
    if (name === 'space_id') {
      field = 'spaceValue';
    }
    if (name === 'reading_id') {
      getReadingLineValues(e.id, assetReadings);
    }
    newData[index][field] = e ? [e.id, e.name] : [];
    newData[index][name] = e.id;
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const onNameChange = (e, index) => {
    const newData = checkListData;
    newData[index][e.target.name] = e.target.value;
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const onPlannedDateChange = (e, index) => {
    const newData = checkListData;
    let dateUtc = false;
    newData[index].date = e;
    if (checkDatehasObject(e)) {
      dateUtc = getDateTimeUtc(e);
    }
    newData[index].date_utc = dateUtc;
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const disabledDate = (current) => {
    let disable = false;
    disable = current && current < moment().subtract(1, 'day').endOf('day');
    return disable;
  };

  const onReadingKeywordChange = (event) => {
    setReadingKeyword(event.target.value);
  };

  const onEquipmentKeywordChange = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  let equipmentOptions = [];

  if (equipmentInfo && equipmentInfo.loading) {
    equipmentOptions = [{ name: 'Loading..' }];
  }
  if (equipmentInfo && equipmentInfo.data) {
    equipmentOptions = equipmentInfo.data;
  }

  let spaceOptions = [];

  if (spaceInfo && spaceInfo.loading) {
    spaceOptions = [{ name: 'Loading..' }];
  }
  if (spaceInfo && spaceInfo.data) {
    spaceOptions = spaceInfo.data;
  }

  useEffect(() => {
    if (readingsData && readingsData.length) {
      let options = [];
      readingsData.map((option) => {
        options.push({
          name: option.reading_id[1],
          id: option.reading_id[0],
        });
      });
      options = uniqBy(options, 'id');
      setReadingOptions(options);
    }
  }, [readingsData]);

  return (

    <Row className="ml-1 mr-1 mt-2 mb-2 pb-3 pt-0 border-0">
      <Col sm="12" md="12" lg="12" xs="12" className="p-0">
        <div className="p-1">
          <CardBody>
            <ThemeProvider theme={theme}>
              {((addReadingInfo && !addReadingInfo.data && !addReadingInfo.loading) && (updateEquipment && !updateEquipment.data && !updateEquipment.loading)) && (
                <Row className="ml-2">
                  <Col sm="12" md="12" lg="12" xs="12" className="p-0">
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>
                            {type === 'space' ? 'Space' : 'Equipment'}
                            <span className="ml-1 text-danger">*</span>
                          </th>
                          <th>
                            Reading
                            <span className="ml-1 text-danger">*</span>
                          </th>
                          <th>
                            Date
                            <span className="ml-1 text-danger">*</span>
                          </th>
                          <th>
                            Measure Value
                            <span className="ml-1 text-danger">*</span>
                          </th>
                          <th>Manage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!selectedUser && (
                          <tr>
                            <td colSpan="9" align="left">
                              <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer" onClick={loadEmptyTd}>
                                <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                                <span className="text-lightblue mr-5">Add</span>
                              </div>
                            </td>
                          </tr>
                        )}
                        {(checkListData.map((cl, index) => (
                          <tr key={cl.id}>
                            {type === 'space'
                              ? (
                                <td>
                                  <FormControl>
                                    <Autocomplete
                                      name="products"
                                      className="bg-white min-width-200"
                                      open={spaceOpen === index}
                                      size="small"
                                      disabled
                                      onOpen={() => {
                                        setSpaceOpen(index);
                                        setSpaceKeyword('');
                                      }}
                                      onClose={() => {
                                        setSpaceOpen('');
                                        setSpaceKeyword('');
                                      }}
                                      classes={{
                                        option: classes.option,
                                      }}
                                      value={cl.spaceValue && cl.spaceValue.length ? cl.spaceValue[1] : ''}
                                      disableClearable={!(cl.spaceValue)}
                                      getOptionSelected={(option, value) => option.name === value.name}
                                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                                      options={spaceOptions}
                                      onChange={(e, data) => { onChangeCheckList(data, 'space_id', index); }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          onChange={onSpaceKeywordChange}
                                          variant="outlined"
                                          className={cl.spaceValue && cl.spaceValue.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                          placeholder="Search & Select"
                                          InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                              <>
                                                {(spaceInfo && spaceInfo.loading) && (spaceOpen === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                              </>
                                            ),
                                          }}
                                        />
                                      )}
                                    />
                                    {((spaceInfo && spaceInfo.err) && (spaceOpen === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spaceInfo)}</span></FormHelperText>)}
                                  </FormControl>
                                </td>
                              )
                              : (
                                <td>
                                  <FormControl>
                                    <Autocomplete
                                      name="products"
                                      className="bg-white min-width-200"
                                      open={equipmentOpen === index}
                                      size="small"
                                      disabled
                                      onOpen={() => {
                                        setEquipmentOpen(index);
                                        setEquipmentKeyword('');
                                      }}
                                      onClose={() => {
                                        setEquipmentOpen('');
                                        setEquipmentKeyword('');
                                      }}
                                      classes={{
                                        option: classes.option,
                                      }}
                                      value={cl.equipmentValue && cl.equipmentValue.length ? cl.equipmentValue[1] : ''}
                                      disableClearable={!(cl.equipmentValue)}
                                      getOptionSelected={(option, value) => option.name === value.name}
                                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                                      options={equipmentOptions}
                                      onChange={(e, data) => { onChangeCheckList(data, 'equipment_id', index); }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          onChange={onEquipmentKeywordChange}
                                          variant="outlined"
                                          className={cl.equipmentValue && cl.equipmentValue.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                          placeholder="Search & Select"
                                          InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                              <>
                                                {(equipmentInfo && equipmentInfo.loading) && (equipmentOpen === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                              </>
                                            ),
                                          }}
                                        />
                                      )}
                                    />
                                    {((equipmentInfo && equipmentInfo.err) && (equipmentOpen === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}
                                  </FormControl>
                                </td>
                              )}
                            <td>
                              <FormControl>
                                <Autocomplete
                                  name="products"
                                  className="bg-white min-width-200"
                                  open={readingOpen === index}
                                  size="small"
                                  onOpen={() => {
                                    setReadingOpen(index);
                                    setReadingKeyword('');
                                  }}
                                  disabled={selectedUser}
                                  onClose={() => {
                                    setReadingOpen('');
                                    setReadingKeyword('');
                                  }}
                                  classes={{
                                    option: classes.option,
                                  }}
                                  value={cl.readingValue && cl.readingValue.length ? cl.readingValue[1] : ''}
                                  disableClearable={!(cl.reading_id)}
                                  // value={cl.reading_id && cl.reading_id.length ? cl.reading_id[1] : ''}
                                  getOptionSelected={(option, value) => option.name === value.name}
                                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                                  options={readingOptions}
                                  onChange={(e, data) => { onChangeCheckList(data, 'reading_id', index); }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      onChange={onReadingKeywordChange}
                                      variant="outlined"
                                      className={cl.reading_id && cl.reading_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                      placeholder="Search & Select"
                                      InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                          <>
                                            {(readingsList && readingsList.loading) && (readingOpen === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                          </>
                                        ),
                                      }}
                                    />
                                  )}
                                />
                                {((readingsList && readingsList.err) && (readingOpen === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(readingsList)}</span></FormHelperText>)}
                              </FormControl>
                            </td>
                            <td>
                              <DatePicker
                                format="DD/MM/YYYY HH:mm:ss"
                                value={cl.date ? moment(new Date(getDateTimeSeconds(cl.date)), 'DD/MM/YYYY HH:mm:ss') : ''}
                                className="w-100"
                                // disabledDate={disabledDate}
                                showTime={{ format: 'HH:mm:ss' }}
                                onChange={(e) => onPlannedDateChange(e, index)}
                              />
                            </td>
                            <td>
                              <Input
                                type="input"
                                name="value"
                                value={cl.value}
                                onKeyPress={decimalKeyPressDown}
                                onChange={(e) => onNameChange(e, index)}
                              />
                            </td>
                            <td>
                              <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                            </td>
                          </tr>
                        )))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}
              {dateError && (
                <div className="text-danger text-center mt-3">
                  <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                    {dateError}
                </div>
              )}
                {(addReadingInfo && addReadingInfo.err) && (
                <SuccessAndErrorFormat response={addReadingInfo} />
              )}
                {(updateEquipment && updateEquipment.err) && (
                <SuccessAndErrorFormat response={updateEquipment} />
              )}
              {addReadingInfo && addReadingInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {updateEquipment && updateEquipment.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {((addReadingInfo && addReadingInfo.data) || (updateEquipment && updateEquipment.data)) && (
                <SuccessAndErrorFormat response={addReadingInfo} successMessage="Reading Logs added successfully.." />
              )}
              {(updateEquipment && updateEquipment.data) && (
                <SuccessAndErrorFormat response={updateEquipment} successMessage="Reading Logs updated successfully.." />
              )}
            </ThemeProvider>
            <hr />
            <div className="float-right">
              {(!selectedUser && addReadingInfo && !addReadingInfo.data) && (
              <Button
                disabled={checkListData && checkListData.length === 0}
                type="submit"
                variant="contained"
                className="submit-btn float-right"
                onClick={onToolsAdd}
              >
                Add
              </Button>
              )}
              {(selectedUser && updateEquipment && !updateEquipment.data) && (
              <Button
                disabled={checkListData && checkListData.length === 0}
                type="submit"
                onClick={onToolsAdd}
                variant="contained"
                className="submit-btn float-right"
              >
                Update
              </Button>
              )}
              {((addReadingInfo && addReadingInfo.data) || (updateEquipment && updateEquipment.data)) && (
              <Button
                type="button"
                variant="contained"
                className="submit-btn float-right"
                onClick={() => { dispatch(resetAddReadingLogInfo()); dispatch(resetUpdateEquipment()); afterReset(); }}
              >
                Ok
              </Button>
              )}
            </div>
          </CardBody>
        </div>
      </Col>
    </Row>
  );
};

AddGaugeLog.propTypes = {
  viewId: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  afterReset: PropTypes.func.isRequired,
  selectedUser: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.array.isRequired,
};
export default AddGaugeLog;
