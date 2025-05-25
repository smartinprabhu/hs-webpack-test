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
import gaugeFormModel from './formModel/gaugeFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  decimalKeyPressDown,
  trimJsonObject,
  generateErrorMessage,
  getAllCompanies,
} from '../../../util/appUtils';
import theme from '../../../util/materialTheme';
import { getGaugesList, updateEquipmentData, resetUpdateEquipment } from '../../equipmentService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = gaugeFormModel;

const GaugeUpdate = (props) => {
  const {
    closeModal,
    editData,
  } = props;
  const dispatch = useDispatch();
  const [atOpen, setAtOpen] = useState(false);
  const [gaugeOpen, setGaugeOpen] = useState(false);
  const [gaugeKeyword, setGaugeKeyword] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    updateEquipment, gaugesInfo, equipmentsDetails,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    dispatch(resetUpdateEquipment());
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && gaugeOpen) {
        await dispatch(getGaugesList(companies, appModels.GAUGES, gaugeKeyword));
      }
    })();
  }, [userInfo, gaugeKeyword, gaugeOpen]);

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

  const onGaugeKeywordChange = (event) => {
    setGaugeKeyword(event.target.value);
  };

  function handleSubmit(values) {
    const isCreateMo = values.create_mo === 'yes' ? true : editData.create_mo;
    const postData = {
      gauge_lines_ids: [[1, editData ? editData.id : 0,
        {
          threshold_min: parseFloat(values.threshold_min),
          threshold_max: parseFloat(values.threshold_max),
          gauge_id: values.gauge_id ? values.gauge_id.id : '',
          active_type: values.active_type ? values.active_type.label : '',
          create_mo: isCreateMo,
        }]],
    };
    const id = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    dispatch(updateEquipmentData(id, postData, appModels.EQUIPMENT));
  }

  let gaugeOptions = [];

  if (gaugesInfo && gaugesInfo.loading) {
    gaugeOptions = [{ name: 'Loading..' }];
  }

  if (editData && editData.gauge_id) {
    const oldId = [{ id: editData.gauge_id[0], name: editData.gauge_id[1] }];
    const newArr = [...gaugeOptions, ...oldId];
    gaugeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (gaugesInfo && gaugesInfo.data) {
    const arr = [...gaugeOptions, ...gaugesInfo.data];
    gaugeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
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
                        name={formField.gaugeId.name}
                        label={formField.gaugeId.label}
                        isRequired={formField.gaugeId.required}
                        oldValue={getOldData(values.gauge_id)}
                        open={gaugeOpen}
                        size="small"
                        value={values.gauge_id && values.gauge_id.name ? values.gauge_id.name : getOldData(values.gauge_id)}
                        onOpen={() => {
                          setGaugeOpen(true);
                          setGaugeKeyword('');
                        }}
                        onClose={() => {
                          setGaugeOpen(false);
                          setGaugeKeyword('');
                        }}
                        loading={gaugesInfo && gaugesInfo.loading}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={gaugeOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onGaugeKeywordChange}
                            variant="outlined"
                            className="without-padding"
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {gaugesInfo && gaugesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(gaugesInfo && gaugesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(gaugesInfo)}</span></FormHelperText>)}
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.thresholdMin.name}
                        label={formField.thresholdMin.label}
                        isRequired={formField.thresholdMin.required}
                        placeholder={formField.thresholdMin.placeholder}
                        type="text"
                        maxLength="10"
                        onKeyPress={decimalKeyPressDown}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.thresholdMax.name}
                        label={formField.thresholdMax.label}
                        isRequired={formField.thresholdMax.required}
                        placeholder={formField.thresholdMax.placeholder}
                        maxLength="10"
                        type="text"
                        onKeyPress={decimalKeyPressDown}
                      />
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

GaugeUpdate.propTypes = {
  closeModal: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  editData: PropTypes.array.isRequired,
};

export default GaugeUpdate;
