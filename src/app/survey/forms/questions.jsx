/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Dialog, DialogContent, DialogContentText, Button, Divider, Box } from '@mui/material';
import DialogHeader from '../../commonComponents/dialogHeader';

import AddQuestions from './addQuestions';
import validationSchema from '../formModel/questionValidationSchema';
import checkoutFormModel from '../formModel/checkoutFormModel';
import formInitialValues from '../formModel/questionFormInitialValues';
import {
  trimJsonObject, getColumnArrayById,
  getArrayNewFormatUpdateDelete,
} from '../../util/appUtils';
import {
  storeQuestions, resetStoreQuestions, getChoiceData, getMatrixData,
} from '../surveyService';

const { formField } = checkoutFormModel;

const Questions = (props) => {
  const {
    activityModal, editPageIndex, editQuestionId, editData, atFinish, questionData, editId,
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
    questionsInfo, choiceSelected, matrixSelected,
  } = useSelector((state) => state.survey);
  function handleSubmit(values) {
    if (editPageIndex) {
      if (questionData && questionData.length > 0) {
        const data = questionData[editPageIndex - 1];
        data.column_nb = values.column_nb && values.column_nb.value ? values.column_nb.value : values.column_nb;
        data.comment_count_as_answer = values.comment_count_as_answer;
        data.comments_allowed = values.comments_allowed;
        data.comments_message = values.comments_message;
        data.constr_error_msg = values.constr_error_msg;
        data.constr_mandatory = values.constr_mandatory;
        data.description = values.description;
        data.display_mode = values.display_mode && values.display_mode.value ? values.display_mode.value : values.display_mode;
        data.display_name = values.question;
        data.is_enable_condition = values.is_enable_condition;
        data.matrix_subtype = values.matrix_subtype && values.matrix_subtype.value ? values.matrix_subtype.value : values.matrix_subtype;
        data.parent_id = values.parent_id;
        data.validation_email = values.validation_email;
        data.validation_error_msg = values.validation_error_msg;
        data.validation_length_max = values.validation_length_max;
        data.validation_length_min = values.validation_length_min;
        data.validation_max_date = (values.validation_max_date && values.validation_max_date !== '') ? values.validation_max_date : false;
        data.validation_min_date = (values.validation_min_date && values.validation_min_date !== '') ? values.validation_min_date : false;
        data.validation_max_float_value = values.validation_max_float_value;
        data.validation_min_float_value = values.validation_min_float_value;
        data.validation_required = values.validation_required;
        data.question = values.question;
        data.labels_ids = choiceSelected;
        data.labels_ids_2 = matrixSelected;
        data.type = values.type && values.type.value ? values.type.value : values.type;
        data.based_on_ids = values.based_on_ids && values.based_on_ids.length > 0 ? [[6, 0, getColumnArrayById(values.based_on_ids, 'id')]] : false;
        dispatch(resetStoreQuestions([]));
        dispatch(storeQuestions(questionData));
        dispatch(getChoiceData([]));
        dispatch(getMatrixData([]));
      }
      if (atFinish) atFinish();
    } else if (editQuestionId) {
      if (questionsInfo && questionsInfo.data && questionsInfo.data.length > 0) {
        const index = questionsInfo.data.findIndex((obj) => (obj.id === editQuestionId));
        const data = questionsInfo.data[index];
        data.column_nb = values.column_nb && values.column_nb.value ? values.column_nb.value : values.column_nb;
        data.comment_count_as_answer = values.comment_count_as_answer;
        data.comments_allowed = values.comments_allowed;
        data.comments_message = values.comments_message;
        data.constr_error_msg = values.constr_error_msg;
        data.constr_mandatory = values.constr_mandatory;
        data.description = values.description;
        data.display_mode = values.display_mode && values.display_mode.value ? values.display_mode.value : values.display_mode;
        data.display_name = values.question;
        data.is_enable_condition = values.is_enable_condition;
        data.matrix_subtype = values.matrix_subtype && values.matrix_subtype.value ? values.matrix_subtype.value : values.matrix_subtype;
        data.parent_id = values.parent_id;
        data.validation_email = values.validation_email;
        data.validation_error_msg = values.validation_error_msg;
        data.validation_length_max = values.validation_length_max;
        data.validation_length_min = values.validation_length_min;
        data.validation_max_date = (values.validation_max_date && values.validation_max_date !== '') ? values.validation_max_date : false;
        data.validation_min_date = (values.validation_min_date && values.validation_min_date !== '') ? values.validation_min_date : false;
        data.validation_max_float_value = values.validation_max_float_value;
        data.validation_min_float_value = values.validation_min_float_value;
        data.validation_required = values.validation_required;
        data.question = values.question;
        data.labels_ids = choiceSelected && choiceSelected.length && choiceSelected[0] && typeof choiceSelected[0] === 'number' ? choiceSelected : getArrayNewFormatUpdateDelete(choiceSelected);
        data.labels_ids_2 = matrixSelected;
        data.type = values.type && values.type.value ? values.type.value : values.type;
        data.based_on_ids = values.based_on_ids && values.based_on_ids.length > 0 ? [[6, 0, getColumnArrayById(values.based_on_ids, 'id')]] : false;
        dispatch(resetStoreQuestions([]));
        dispatch(storeQuestions(questionsInfo.data));
        dispatch(getChoiceData([]));
        dispatch(getMatrixData([]));
      }
      if (atFinish) atFinish();
    } else {
      let labels;
      if (editId) {
        labels = getArrayNewFormatUpdateDelete(choiceSelected);
      } else {
        labels = choiceSelected;
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
      const parentId = values.parent_id;
      const basedOnIds = values.based_on_ids && values.based_on_ids.length > 0 ? [[6, 0, getColumnArrayById(values.based_on_ids, 'id')]] : false;

      const postData = { ...values };

      postData.type = types;
      postData.sequence = 0;
      postData.stateconstr_error_msg_id = constrErrorMsg;
      postData.validation_error_msg = validationErrorMsg;
      postData.matrix_subtype = matrixSubtype;
      postData.display_mode = displayMode;
      postData.column_nb = columnNb;
      postData.comments_message = commentsMessage;
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

      dispatch(storeQuestions([postData]));
      dispatch(getChoiceData([]));
      dispatch(getMatrixData([]));
      if (atFinish) atFinish();
    }
  }

  const [checkListClose] = useState(false);

  if (checkListClose) {
    return (
      <Redirect to="/maintenance-configuration" />
    );
  }

  return (
    <Dialog size="xl" fullWidth open={model}>
      <DialogHeader title={(!editQuestionId || !editPageIndex) ? 'Create a Question' : 'Update a Question'} onClose={() => { toggle(); }} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Formik
            enableReinitialize
            validateOnMount
            initialValues={(editQuestionId || editData) ? trimJsonObject(editData) : formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isValid, dirty, setFieldValue,
            }) => (
              <Form id="questionForm">
                <AddQuestions formField={formField} setFieldValue={setFieldValue} editQuestionId={editQuestionId} editData={editData} editPageIndex={editPageIndex} />
                <Divider style={{ marginBottom: '10px', marginTop: '10px' }} />
                <Box sx={{ float: 'right'}}>
                  <Button
                    disabled={(!editQuestionId || !editPageIndex) ? !(isValid && dirty) : !(isValid)}
                    type="submit"
                    size="sm"
                    variant='contained'
                  >
                    Confirm
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContentText>
      </DialogContent>
    </Dialog >
  );
};
Questions.propTypes = {
  activityModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  editQuestionId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editPageIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  questionData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default Questions;
