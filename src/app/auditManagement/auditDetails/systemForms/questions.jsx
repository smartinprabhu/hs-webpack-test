/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogContentText, Button, Divider, Box,
} from '@mui/material';

import DialogHeader from '../../../commonComponents/dialogHeader';

import AddQuestions from './addQuestions';
import validationSchema from '../../configuration/formModel/questionValidationSchema';
import checkoutFormModel from '../../configuration/formModel/checkoutFormModel';
import formInitialValues from '../../configuration/formModel/questionFormInitialValues';
import {
  trimJsonObject, getColumnArrayById,
  getArrayNewFormatUpdateDelete,
  extractValueObjects,
} from '../../../util/appUtils';
import {
  getChoiceData, getMatrixData,
} from '../../../survey/surveyService';
import {
  updateHxSystem,
} from '../../auditService';

const appModels = require('../../../util/appModels').default;

const { formField } = checkoutFormModel;

const Questions = (props) => {
  const {
    activityModal, editData, atFinish, systemId, editId, groupId, categoryId, categoryName, questionValues, setQuestions,
  } = props;
  const dispatch = useDispatch();
  const [model, setmodel] = useState(activityModal);
  const toggle = () => {
    setmodel(!model);
    dispatch(getChoiceData([]));
    dispatch(getMatrixData([]));
    atFinish();
  };

  const {
    choiceSelected, matrixSelected,
  } = useSelector((state) => state.survey);

  const generatePassword = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
    let password = '';
    while (password.length < length) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      if (!password.includes(char)) {
        password += char;
      }
    }
    return password;
  };

  function handleSubmit(values) {
    let labels;
    if (editId) {
      labels = getArrayNewFormatUpdateDelete(choiceSelected);
    } else {
      labels = choiceSelected && choiceSelected.length && choiceSelected[0] && typeof choiceSelected[0] === 'number' ? choiceSelected : getArrayNewFormatUpdateDelete(choiceSelected);
    }
    const types = values.type && values.type.value ? values.type.value : false;
    const constrErrorMsg = values.constr_error_msg;
    const validationErrorMsg = values.validation_error_msg;
    const matrixSubtype = values.matrix_subtype && values.matrix_subtype.value ? values.matrix_subtype.value : values.matrix_subtype;
    const displayMode = values.display_mode && values.display_mode.value ? values.display_mode.value : values.display_mode;
    const columnNb = values.column_nb && values.column_nb.value ? values.column_nb.value : values.column_nb;
    const commentsMessage = values.comments_message;
    const questionName = values.question;
    const validationEmail = values.validation_email;
    const constrMandatory = values.constr_mandatory;
    const validationRequired = values.validation_required;
    const validationLengthMin = values.validation_length_min;
    const validationLengthMax = values.validation_length_max;
    const validationMinFloatValue = values.validation_min_float_value;
    const validationMaxFloatValue = values.validation_max_float_value;
    const validationMinDate = (values.validation_min_date && values.validation_min_date !== '') ? values.validation_min_date : false;
    const validationMaxDate = (values.validation_max_date && values.validation_max_date !== '') ? values.validation_max_date : false;
    const commentsAllowed = values.comments_allowed;
    const commentCountAsAnswer = values.comment_count_as_answer;
    const isEnableCondition = values.is_enable_condition;
    const parentId = extractValueObjects(values.parent_id);
    const applicableStandardIds = values.applicable_standard_ids && values.applicable_standard_ids.length > 0 ? [[6, 0, getColumnArrayById(values.applicable_standard_ids, 'id')]] : false;

    const hasAttachment = values.has_attachment;
    const helperText = values.helper_text;
    const applicableScore = values.applicable_score ? parseFloat(values.applicable_score) : 0.00;
    const Procedure = values.procedure;
    const riskLevel = values.risk_level && values.risk_level.value ? values.risk_level.value : values.risk_level;
    const questionGroupId = extractValueObjects(values.question_group_id);
    const basedOnIds = values.based_on_ids && values.based_on_ids.length > 0 ? [[6, 0, getColumnArrayById(values.based_on_ids, 'id')]] : false;

    const dataFormat = {
      id: generatePassword(5),
      answer_type: types, // Replace with actual value if available
      remarks: null, // Replace with actual value if available
      answer_common: null, // Replace with actual value if available
      mro_quest_grp_id: values.question_group_id, // Replace with actual value if available
      achieved_score: null, // Replace with actual value if available
      page_id: {
        id: categoryId,
        title: categoryName,
      },
      mro_activity_id: {
        id: generatePassword(5),
        name: questionName,
        applicable_score: applicableScore,
        applicable_standard_ids: values.applicable_standard_ids && values.applicable_standard_ids.length > 0 ? values.applicable_standard_ids : [],
        helper_text: helperText,
        procedure: Procedure,
        sequence: 100,
      },
    };

    const postData = { ...values };

    postData.type = types;
    postData.sequence = 0;
    postData.constr_error_msg = constrErrorMsg;
    postData.validation_error_msg = validationErrorMsg;
    postData.matrix_subtype = matrixSubtype;
    postData.display_mode = displayMode;
    postData.column_nb = columnNb;
    postData.comments_message = commentsMessage;
    postData.has_attachment = hasAttachment;
    postData.helper_text = helperText;
    postData.applicable_score = applicableScore;
    postData.procedure = Procedure;
    postData.risk_level = riskLevel;
    postData.question_group_id = questionGroupId;
    postData.question = questionName;
    postData.validation_email = validationEmail;
    postData.constr_mandatory = constrMandatory;
    postData.validation_required = validationRequired;
    postData.validation_length_min = validationLengthMin;
    postData.validation_length_max = validationLengthMax;
    postData.validation_min_float_value = validationMinFloatValue;
    postData.validation_max_float_value = validationMaxFloatValue;
    postData.validation_min_date = validationMinDate;
    postData.validation_max_date = validationMaxDate;
    postData.comments_allowed = commentsAllowed;
    postData.comment_count_as_answer = commentCountAsAnswer;
    postData.is_enable_condition = isEnableCondition;
    postData.parent_id = parentId;
    postData.based_on_ids = basedOnIds;
    postData.labels_ids = labels;
    postData.labels_ids_2 = matrixSelected;
    postData.applicable_standard_ids = applicableStandardIds;

    const assetDataList = questionValues.filter((item) => item.page_id.id === categoryId && !item.mro_activity_id.name);

    if (assetDataList && !assetDataList.length) {
      setQuestions([...questionValues, ...[dataFormat]]);
      delete postData.column_nb;
      delete postData.validation_length_min;
      delete postData.validation_length_max;
      delete postData.validation_min_float_value;
      delete postData.validation_max_float_value;
      delete postData.validation_min_date;
      delete postData.validation_max_date;
      const apiData = {
        page_ids: [[1, categoryId, { title: categoryName, question_ids: [[0, 0, postData]] }]],
      };
      dispatch(updateHxSystem(systemId, appModels.HXSYSTEM, apiData, 'nodata'));
    } else if (assetDataList && assetDataList.length === 1) {
      const qIndex = questionValues.findIndex((item) => item.page_id?.id === categoryId && !item.mro_activity_id.name);
      const qValues = [...questionValues];
      qValues[qIndex].id = generatePassword(5);
      qValues[qIndex].answer_type = types;
      qValues[qIndex].mro_quest_grp_id = values.question_group_id;
      qValues[qIndex].mro_activity_id.name = questionName;
      qValues[qIndex].mro_activity_id.applicable_score = applicableScore;
      qValues[qIndex].mro_activity_id.helper_text = helperText;
      qValues[qIndex].mro_activity_id.procedure = Procedure;
      qValues[qIndex].mro_activity_id.applicable_standard_ids = values.applicable_standard_ids && values.applicable_standard_ids.length > 0 ? values.applicable_standard_ids : [];
      setQuestions(qValues);
      delete postData.column_nb;
      delete postData.validation_length_min;
      delete postData.validation_length_max;
      delete postData.validation_min_float_value;
      delete postData.validation_max_float_value;
      delete postData.validation_min_date;
      delete postData.validation_max_date;
      const apiData = {
        page_ids: [[0, 0, { title: categoryName, question_ids: [[0, 0, postData]] }]],
      };
      dispatch(updateHxSystem(systemId, appModels.HXSYSTEM, apiData, 'nodata'));
    }

    dispatch(getChoiceData([]));
    dispatch(getMatrixData([]));
    if (atFinish) atFinish();
  }

  const [checkListClose] = useState(false);

  if (checkListClose) {
    return (
      <Redirect to="/maintenance-configuration" />
    );
  }

  return (
    <Dialog size="xl" fullWidth open={model}>
      <DialogHeader title={!editId ? 'Create a Item' : 'Update a Item'} onClose={() => { toggle(); }} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Formik
            enableReinitialize
            initialValues={editId ? trimJsonObject(editData) : formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isValid, setFieldValue,
            }) => (
              <Form id="questionForm">
                <AddQuestions groupId={groupId} formField={formField} setFieldValue={setFieldValue} editData={editData} />
                <Divider style={{ marginBottom: '10px', marginTop: '10px' }} />
                <Box sx={{ float: 'right' }}>
                  <Button
                    disabled={!(isValid)}
                    type="submit"
                    size="sm"
                    variant="contained"
                  >
                    Confirm
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
Questions.propTypes = {
  activityModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default Questions;
