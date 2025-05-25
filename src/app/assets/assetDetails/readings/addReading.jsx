/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import { Button } from '@mui/material';

import PromptIfUnSaved from '@shared/unSavedPrompt';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import ReadingForm from './forms/readingForm';
import validationSchema from './formModel/readingValidationSchema';
import readingFormModel from './formModel/readingFormModel';
import formInitialValues from './formModel/readingFormInitialValues';
import {
  updateEquipmentData, getAssetDetail,
} from '../../equipmentService';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject, checkDatehasObject, getDateTimeUtc,
} from '../../../util/appUtils';
import {
  getRequiredMessageReading,
} from '../../utils/utils';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = readingFormModel;

const AddReading = (props) => {
  const {
    afterReset, viewId, selectedUser, editData, isTheme,
  } = props;
  const dispatch = useDispatch();
  const [dateError, setDateError] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const { updateEquipment } = useSelector((state) => state.equipment);

  function getOldDataId(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[0] : false;
  }

  function getOldDataValue(oldData) {
    return oldData || false;
  }

  function handleSubmit(values) {
    setDateError(false);
    let date = values.date ? values.date : false;
    if (checkDatehasObject(date)) {
      date = getDateTimeUtc(date);
    }
    const typeValue = values.type;
    const reading = values.reading_id.id ? values.reading_id.id : getOldDataId(values.reading_id);
    const condition = values.condition && values.condition.value ? values.condition.value : getOldDataValue(values.condition);
    const dataType = values.data_type && values.data_type.value ? values.data_type.value : getOldDataValue(values.data_type);
    const uom = values.uom_id && values.uom_id.id ? values.uom_id.id : getOldDataId(values.uom_id);
    const isActive = values.is_active === 'yes';
    const toDo = values.to_do && values.to_do.value ? values.to_do.value : getOldDataValue(values.to_do);
    const isAllow = values.is_allow_manual_reading ? values.is_allow_manual_reading : false;
    const validateEntry = values.validation_required ? values.validation_required : false;
    const aggregateTimeperiod = values.aggregate_timeperiod && values.aggregate_timeperiod.value ? values.aggregate_timeperiod.value : getOldDataValue(values.aggregate_timeperiod);
    const threshold = values.threshold ? values.threshold : 0;
    const recurrent = values.recurrent && values.recurrent.value ? values.recurrent.value : getOldDataValue(values.recurrent);
    const orderGeneratedOn = values.order_generated_on_quotient ? values.order_generated_on_quotient : 1;
    const propogate = values.is_propogate ? values.is_propogate : false;
    const thresholdMin = values.threshold_min ? values.threshold_min : 0;
    const thresholdMax = values.threshold_max ? values.threshold_max : 0;
    const minimumValue = values.validation_min_float_value ? values.validation_min_float_value : 0;
    const maximumValue = values.validation_max_float_value ? values.validation_max_float_value : 0;
    const validationErrMsg = values.validation_error_msg ? values.validation_error_msg : 'The answer you entered has an invalid format.';
    const checklistId = values.check_list_id && values.check_list_id.id ? values.check_list_id.id : getOldDataId(values.check_list_id);
    const teamCategory = values.team_category_id && values.team_category_id.id ? values.team_category_id.id : getOldDataId(values.team_category_id);
    const maintenanceType = values.maintenance_type && values.maintenance_type.value ? values.maintenance_type.value : getOldDataValue(values.maintenance_type);
    const isMroPropagate = values.is_mro_propagate ? values.is_mro_propagate : false;
    const alarmName = values.alarm_name ? values.alarm_name : false;
    const priority = values.priority && values.priority.value ? values.priority.value : 'Low';
    const categoryId = values.category_id && values.category_id.id ? values.category_id.id : getOldDataId(values.category_id);
    const alarmRecipients = values.alarm_recipients && values.alarm_recipients.id ? values.alarm_recipients.id : false;
    const isPropagateAlarms = values.is_propagate_alarms ? values.is_propagate_alarms : true;
    const message = values.message ? values.message : false;
    const description = values.description ? values.description : 'false';
    const alarmActions = values.alarm_actions && values.alarm_actions.id ? values.alarm_actions.id : getOldDataId(values.alarm_actions);
    const fontIcon = values.font_awesome_icon ? values.font_awesome_icon : 'fa-alert';
    const ttl = values.ttl ? values.ttl : -1;
    const value = values.value ? values.value : 0;
    const measureId = values.measure_id && values.measure_id.id ? values.measure_id.id : getOldDataId(values.measure_id);
    const equipmentId = values.log_equipment_id && values.log_equipment_id.id ? values.log_equipment_id.id : getOldDataId(values.log_equipment_id);
    const companyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : false;

    let addValue = 0;
    let id = viewId;

    if (selectedUser) {
      addValue = 1;
      id = selectedUser;
    }

    const postData = {
      company_id: companyId,
      reading_id: reading,
      type: typeValue,
      // uom_id: uom,
      is_active: isActive,
      to_do: toDo,
      data_type: dataType,
      is_allow_manual_reading: isAllow,
      condition,
      validation_required: validateEntry,
      aggregate_timeperiod: aggregateTimeperiod,
      recurrent,
      threshold,
      order_generated_on_quotient: orderGeneratedOn,
      is_propogate: propogate,
      threshold_min: thresholdMin,
      threshold_max: thresholdMax,
      validation_min_float_value: minimumValue,
      validation_max_float_value: maximumValue,
      validation_error_msg: validationErrMsg,
      check_list_id: checklistId,
      team_category_id: teamCategory,
      maintenance_type: maintenanceType,
      is_mro_propagate: isMroPropagate,
      alarm_name: alarmName,
      priority,
      category_id: categoryId,
      alarm_recipients: alarmRecipients,
      is_propagate_alarms: isPropagateAlarms,
      message,
      description,
      alarm_actions: alarmActions,
      font_awesome_icon: fontIcon,
      ttl,
      date,
      value,
      measure_id: measureId,
      log_equipment_id: equipmentId,
    };

    const postValue = { reading_lines_ids: [[addValue, id || 0, postData]] };
    if (!getRequiredMessageReading([postData])) {
      setDateError(false);
      dispatch(updateEquipmentData(viewId, postValue, appModels.EQUIPMENT));
    } else {
      setDateError(getRequiredMessageReading([postData]));
    }
  }

  const handleReset = (resetForm) => {    
    dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    resetForm();
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={selectedUser && editData ? trimJsonObject(editData) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, resetForm, setFieldTouched,
          }) => (
            <Form id={formId}>
              <PromptIfUnSaved />
              {(updateEquipment && updateEquipment.data) ? ('') : (
                <>
                  {!isTheme && (
                    <ThemeProvider theme={theme}>
                      <div className="audits-list thin-scrollbar">
                        <ReadingForm formField={formField} setFieldTouched={setFieldTouched} editId={selectedUser} setFieldValue={setFieldValue} />
                      </div>
                    </ThemeProvider>
                  )}
                  {isTheme && (
                    <div className="audits-list thin-scrollbar">
                      <ReadingForm formField={formField} setFieldTouched={setFieldTouched} editId={selectedUser} setFieldValue={setFieldValue} />
                    </div>
                  )}
                </>
              )}
              {updateEquipment && updateEquipment.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {dateError && (
                <div className="text-danger text-center mt-3">
                  <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                  {dateError}
                </div>
              )}
              {(updateEquipment && updateEquipment.err) && (
                <SuccessAndErrorFormat response={updateEquipment} />
              )}
              {(updateEquipment && updateEquipment.data) && (
                <SuccessAndErrorFormat response={updateEquipment} successMessage={`Reading ${selectedUser ? 'Updated' : 'added'} successfully..`} />
              )}
              <hr />
              <div className="float-right mr-4">
                {(updateEquipment && updateEquipment.data) ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="contained"
                    onClick={handleReset.bind(null, resetForm)}
                  >
                    Ok
                  </Button>
                ) : (
                  <>
                    {/* <Button
                      type="button"
                      size="sm"
                       variant="contained"
                      className="btn-cancel mr-2"
                      onClick={handleReset.bind(null, resetForm)}
                    >
                      Cancel
                    </Button> */}
                    <Button
                      disabled={!(isValid && dirty)}
                      type="submit"
                      size="sm"
                      variant="contained"
                    >
                      {selectedUser && editData ? 'Update' : 'Add'}
                    </Button>
                  </>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddReading.defaultProps = {
  isTheme: false,
};

AddReading.propTypes = {
  afterReset: PropTypes.func.isRequired,
  viewId: PropTypes.number.isRequired,
  selectedUser: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.array.isRequired,
  isTheme: PropTypes.bool,
};

export default AddReading;
