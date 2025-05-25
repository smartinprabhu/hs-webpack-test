/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Label,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';

import { InputField, FormikAutocomplete, CheckboxFieldGroup } from '@shared/formFields';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import validationSchema from './formModel/validationSchema';
import meterFormModel from './formModel/meterFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  decimalKeyPressDown,
  trimJsonObject,
  generateErrorMessage,
  getAllCompanies,
} from '../../../util/appUtils';
import theme from '../../../util/materialTheme';
import {
  getOperatingHours, getMetersList, updateEquipmentData, resetUpdateEquipment,
} from '../../equipmentService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = meterFormModel;

const MeterUpdate = (props) => {
  const {
    closeModal,
    editData,
  } = props;
  const dispatch = useDispatch();
  const [atOpen, setAtOpen] = useState(false);
  const [meterOpen, setMeterOpen] = useState(false);
  const [meterKeyword, setMeterKeyword] = useState('');
  const [wtOpen, setWtOpen] = useState(false);
  const [wtKeyword, setWtKeyword] = useState('');

  const { userInfo ,userRoles} = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    updateEquipment, metersInfo, equipmentsDetails,
    hoursInfo,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    dispatch(resetUpdateEquipment());
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && meterOpen) {
        await dispatch(getMetersList(companies, appModels.METERS, meterKeyword));
      }
    })();
  }, [userInfo, meterKeyword, meterOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && wtOpen) {
        await dispatch(getOperatingHours(companies, appModels.RESOURCECALENDAR, wtKeyword));
      }
    })();
  }, [userInfo, wtKeyword, wtOpen]);

  const activeTypes = [{ value: 'Active', label: 'Active' }, { value: 'Inctive', label: 'Inctive' }];

  function getCreateMoInfo(values) {
    let isCreateMo = editData && editData.create_mo ? 'yes' : 'no';

    if (values && values.create_mo === 'yes') {
      isCreateMo = 'yes';
    }

    if (values && values.create_mo === 'no') {
      isCreateMo = 'no';
    }

    return isCreateMo;
  }

  const onMeterKeywordChange = (event) => {
    setMeterKeyword(event.target.value);
  };

  const onWtKeywordChange = (event) => {
    setWtKeyword(event.target.value);
  };

  function handleSubmit(values) {
    const isCreateMo = values.create_mo === 'yes' ? true : editData.create_mo;
    const postData = {
      meter_lines_ids: [[1, editData ? editData.id : 0,
        {
          theoretical_time: parseFloat(values.theoretical_time),
          theorical_utilization: parseFloat(values.theorical_utilization),
          actual_utilization: parseFloat(values.actual_utilization),
          meter_id: values.meter_id ? values.meter_id.id : '',
          resource_calendar_id: values.resource_calendar_id ? values.resource_calendar_id.id : '',
          active_type: values.active_type ? values.active_type.label : '',
          create_mo: isCreateMo,
        }]],
    };
    const id = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    dispatch(updateEquipmentData(id, postData, appModels.EQUIPMENT));
  }

  let meterOptions = [];
  let hourOptions = [];

  if (metersInfo && metersInfo.loading) {
    meterOptions = [{ name: 'Loading..' }];
  }
  if (hoursInfo && hoursInfo.loading) {
    hourOptions = [{ name: 'Loading..' }];
  }

  if (editData && editData.meter_id) {
    const oldId = [{ id: editData.meter_id[0], name: editData.meter_id[1] }];
    const newArr = [...meterOptions, ...oldId];
    meterOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (editData && editData.resource_calendar_id) {
    const oldId = [{ id: editData.resource_calendar_id[0], name: editData.resource_calendar_id[1] }];
    const newArr = [...hourOptions, ...oldId];
    hourOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (metersInfo && metersInfo.data) {
    const arr = [...meterOptions, ...metersInfo.data];
    meterOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (hoursInfo && hoursInfo.data) {
    const arr = [...hourOptions, ...hoursInfo.data];
    hourOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={editData ? trimJsonObject(editData) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, values,
          }) => (
            <Form id={formId}>
              {(updateEquipment && updateEquipment.data) ? ('') : (
                <ThemeProvider theme={theme}>
                  <Row className="ml-5 mr-5">
                    <Col md="6" sm="6" lg="6" xs="12">
                      <FormikAutocomplete
                        name={formField.meterId.name}
                        label={formField.meterId.label}
                        isRequired={formField.meterId.required}
                        oldValue={getOldData(values.meter_id)}
                        open={meterOpen}
                        size="small"
                        value={values.meter_id && values.meter_id.name ? values.meter_id.name : getOldData(values.meter_id)}
                        onOpen={() => {
                          setMeterOpen(true);
                          setMeterKeyword('');
                        }}
                        onClose={() => {
                          setMeterOpen(false);
                          setMeterKeyword('');
                        }}
                        loading={metersInfo && metersInfo.loading}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={meterOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onMeterKeywordChange}
                            variant="outlined"
                            className="without-padding"
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {metersInfo && metersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(metersInfo && metersInfo.err && meterOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(metersInfo)}</span></FormHelperText>) }
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.theoreticalTime.name}
                        label={formField.theoreticalTime.label}
                        isRequired={formField.theoreticalTime.required}
                        placeholder={formField.theoreticalTime.placeholder}
                        type="text"
                        maxLength="10"
                        onKeyPress={decimalKeyPressDown}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.theoricalUtilization.name}
                        label={formField.theoricalUtilization.label}
                        isRequired={formField.theoricalUtilization.required}
                        placeholder={formField.theoricalUtilization.placeholder}
                        maxLength="10"
                        type="text"
                        onKeyPress={decimalKeyPressDown}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.actualUtilization.name}
                        label={formField.actualUtilization.label}
                        isRequired={formField.actualUtilization.required}
                        placeholder={formField.actualUtilization.placeholder}
                        maxLength="10"
                        type="text"
                        onKeyPress={decimalKeyPressDown}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <FormikAutocomplete
                        name={formField.resourceCalendarId.name}
                        label={formField.resourceCalendarId.label}
                        isRequired={formField.resourceCalendarId.required}
                        oldValue={getOldData(values.resource_calendar_id)}
                        open={wtOpen}
                        size="small"
                        value={values.resource_calendar_id && values.resource_calendar_id.name ? values.resource_calendar_id.name : getOldData(values.resource_calendar_id)}
                        onOpen={() => {
                          setWtOpen(true);
                          setWtKeyword('');
                        }}
                        onClose={() => {
                          setWtOpen(false);
                          setWtKeyword('');
                        }}
                        loading={hoursInfo && hoursInfo.loading}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={hourOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onWtKeywordChange}
                            variant="outlined"
                            className="without-padding"
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {hoursInfo && hoursInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(hoursInfo && hoursInfo.err && wtOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(hoursInfo)}</span></FormHelperText>) }
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <FormikAutocomplete
                        name={formField.activeType.name}
                        label={formField.activeType.label}
                        isRequired={formField.activeType.required}
                        oldValue={values.active_type}
                        value={values.active_type && values.active_type.lebel ? values.active_type.lebel : values.active_type}
                        open={atOpen}
                        size="small"
                        onOpen={() => {
                          setAtOpen(true);
                        }}
                        onClose={() => {
                          setAtOpen(false);
                        }}
                        getOptionSelected={(option, value) => option.label === value.label}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                        options={activeTypes}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            className="without-padding"
                            placeholder="Select"
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
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <Label for="Create Mo" className="m-0">
                        Create Mo ?
                        <span className="ml-1 text-danger" />
                      </Label>
                      <br />
                      <CheckboxFieldGroup
                        name="create_mo"
                        checkedvalue="yes"
                        customvalue={getCreateMoInfo(values)}
                        id="yes"
                        label="Yes"
                      />
                      <CheckboxFieldGroup
                        name="create_mo"
                        checkedvalue="no"
                        customvalue={getCreateMoInfo(values)}
                        id="no"
                        label="No"
                      />
                    </Col>
                  </Row>
                </ThemeProvider>
              )}
              <div>
                {updateEquipment && updateEquipment.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
                )}
                {(updateEquipment && updateEquipment.err) && (
                <SuccessAndErrorFormat response={updateEquipment} />
                )}
                {(updateEquipment && updateEquipment.data) && (
                <SuccessAndErrorFormat response={updateEquipment} successMessage="Gauge updated successfully.." />
                )}
              </div>
              <hr />
              <div className="float-right">
                {(updateEquipment && !updateEquipment.data) && (
                  <Button
                    disabled={!(isValid)}
                    type="submit"
                    size="sm"
                     variant="contained"
                  >
                    Update
                  </Button>
                )}
                {(updateEquipment && updateEquipment.data) && (
                <Button
                  type="button"
                  size="sm"
                  onClick={closeModal}
                   variant="contained"
                >
                  Ok
                </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

MeterUpdate.propTypes = {
  closeModal: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  editData: PropTypes.array.isRequired,
};

export default MeterUpdate;
