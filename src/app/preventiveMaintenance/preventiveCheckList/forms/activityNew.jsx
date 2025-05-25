/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import {
  Dialog, DialogContent, DialogContentText,
  Button, Divider,
} from '@mui/material';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DialogHeader from '../../../commonComponents/dialogHeader';
import ActivitySegments from './activitySegments';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  resetAddActivity, updateActivity, resetUpdateActivity, resetChoiceOptions,
} from '../../ppmService';
import {
  getArrayNewFormatUpdateDelete, trimJsonObject, extractValueObjects, getColumnArrayById, getArrayNewFormat,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const Activity = (props) => {
  const {
    activityModal, editId, editData, atFinish, checklistEditId,
  } = props;
  const dispatch = useDispatch();
  const [model, setmodel] = useState(activityModal);
  const toggle = () => {
    setmodel(!model);
    dispatch(resetAddActivity());
    dispatch(resetUpdateActivity());
    atFinish();
  };
  const {
    addPreventiveChecklist, updateActivityInfo, checklistQuestionList, choiceOptionInfo,
  } = useSelector((state) => state.ppm);

  useEffect(() => {
    dispatch(resetAddActivity());
    dispatch(resetUpdateActivity());
    dispatch(resetChoiceOptions());
  }, []);

  const getArrayModify = (array) => {
    const newData = [];
    if (array.length) {
      for (let i = 0; i < array.length; i += 1) {
        const question = array[i];
        // let questionGroup = question.mro_quest_grp_id;
        // questionGroup = questionGroup && questionGroup.id ? questionGroup.id : false;
        // question.mro_quest_grp_id = questionGroup;
        // let questionReadingGroup = question.reading_id;
        // questionReadingGroup = questionReadingGroup && questionReadingGroup.id ? questionReadingGroup.id : false;
        // question.reading_id = questionReadingGroup;
        if (choiceOptionInfo && choiceOptionInfo.data && choiceOptionInfo.data.length) {
          question.labels_ids = getArrayNewFormat(choiceOptionInfo.data);
        }
        newData.push(question);
      }
    }
    return newData;
  };

  function handleSubmit(values) {
    if (checklistEditId && editId) {
      const activityLines = [{
        id: editId,
        name: values.name,
        constr_mandatory: values.constr_mandatory,
        has_attachment: values.has_attachment,
        mandatory_photo: values.mandatory_photo,
        expected_text: values.expected_text,
        expected_value_suggested: values.expected_value_suggested,
        is_multiple_line: values.is_multiple_line,
        constr_error_msg: values.constr_error_msg,
        validation_required: values.validation_required,
        expected_type: values.expected_type,
        comments_allowed: values.comments_allowed,
        mro_quest_grp_id: extractValueObjects(values.mro_quest_grp_id),
        reading_id: extractValueObjects(values.reading_id),
        inspection_method: extractValueObjects(values.inspection_method),
        requires_action: extractValueObjects(values.requires_action),
        type: values.type && values.type.value
          ? values.type.value : editData.type,
        expected_min_number: values.expected_min_number ? parseFloat(values.expected_min_number) : 0,
        expected_max_number: values.expected_max_number ? parseFloat(values.expected_max_number) : 0,
        labels_ids: values.labels_ids && values.labels_ids.length > 0 ? getArrayNewFormatUpdateDelete(values.labels_ids) : false,
        feedback: values.feedback,
        preventive_actions: values.preventive_actions,
        corrective_actions: values.corrective_actions,
        requires_verification: values.requires_verification,
        is_resolution: values.is_resolution,
        is_enable_condition: values.is_enable_condition,
        parent_id: extractValueObjects(values.parent_id),
        based_on_ids: values.based_on_ids && values.based_on_ids.length > 0 ? [[6, 0, getColumnArrayById(values.based_on_ids, 'id')]] : false,
      }];
      const postData = {
        activity_lines: activityLines && activityLines.length > 0 ? getArrayNewFormatUpdateDelete(getArrayModify(activityLines), checklistQuestionList.data[0].activity_lines) : false,
      };
      dispatch(updateActivity(checklistEditId, appModels.PPMCHECKLIST, postData));
    } else if (checklistEditId) {
      const activityLines = [{
        name: values.name,
        constr_mandatory: values.constr_mandatory,
        has_attachment: values.has_attachment,
        mandatory_photo: values.mandatory_photo,
        expected_text: values.expected_text,
        expected_value_suggested: values.expected_value_suggested,
        is_multiple_line: values.is_multiple_line,
        constr_error_msg: values.constr_error_msg,
        validation_required: values.validation_required,
        expected_type: values.expected_type,
        comments_allowed: values.comments_allowed,
        mro_quest_grp_id: extractValueObjects(values.mro_quest_grp_id),
        reading_id: extractValueObjects(values.reading_id),
        inspection_method: extractValueObjects(values.inspection_method),
        requires_action: extractValueObjects(values.requires_action),
        type: values.type.value,
        expected_min_number: values.expected_min_number ? parseFloat(values.expected_min_number) : 0,
        expected_max_number: values.expected_max_number ? parseFloat(values.expected_max_number) : 0,
        labels_ids: values.labels_ids && values.labels_ids.length > 0 ? getArrayNewFormatUpdateDelete(values.labels_ids) : false,
        feedback: values.feedback,
        preventive_actions: values.preventive_actions,
        corrective_actions: values.corrective_actions,
        requires_verification: values.requires_verification,
        is_resolution: values.is_resolution,
        is_enable_condition: values.is_enable_condition,
        parent_id: extractValueObjects(values.parent_id),
        based_on_ids: values.based_on_ids && values.based_on_ids.length > 0 ? [[6, 0, getColumnArrayById(values.based_on_ids, 'id')]] : false,
      }];
      const postData = {
        activity_lines: activityLines && activityLines.length > 0
          ? getArrayNewFormatUpdateDelete(getArrayModify(activityLines), checklistQuestionList && checklistQuestionList.length && checklistQuestionList.data[0].activity_lines) : false,
      };
      dispatch(updateActivity(checklistEditId, appModels.PPMCHECKLIST, postData));
    }
  }

  return (
    <Dialog maxWidth="lg" open={model}>
      <DialogHeader title={!editId ? 'Create Question' : 'Update Question'} imagePath={false} onClose={() => { toggle(); }} response={updateActivityInfo} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Row>
            <Col sm="12" md="12" lg="12" xs="12" className="pl-2 pr-2">
              <div className="p-1">
                <CardBody className="pt-0 pb-0">
                  <>
                    <Formik
                      enableReinitialize
                      initialValues={!editId ? formInitialValues : trimJsonObject(editData)}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({
                        isValid, dirty, setFieldValue, values,
                      }) => (
                        <Form id={formId}>
                          {updateActivityInfo && !updateActivityInfo.data && (
                            <Row className="comments-list thin-scrollbar">
                              <Col xs={12} sm={12} lg={12} md={12}><ActivitySegments formField={formField} setFieldValue={setFieldValue} editId={editId} editData={editData} /></Col>
                            </Row>
                          )}
                          {(!editId && updateActivityInfo && updateActivityInfo.data) && (
                            <SuccessAndErrorFormat response={updateActivityInfo} successMessage="Question created successfully.." />
                          )}
                          {updateActivityInfo && updateActivityInfo.loading && (
                            <div className="text-center mt-3">
                              <Loader />
                            </div>
                          )}
                          {(updateActivityInfo && updateActivityInfo.err) && (
                            <SuccessAndErrorFormat response={updateActivityInfo} />
                          )}
                          {(editId && updateActivityInfo && updateActivityInfo.data) && (
                            <SuccessAndErrorFormat response={updateActivityInfo} successMessage="Question updated successfully.." />
                          )}
                          <Divider className="mb-2" />
                          {!editId && (
                            <div className="float-right">
                              {updateActivityInfo && updateActivityInfo.data && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="contained"
                                  onClick={toggle}
                                >
                                  Ok
                                </Button>
                              )}
                              {updateActivityInfo && !updateActivityInfo.data && (
                                <Button
                                  disabled={!(isValid && dirty) || (updateActivityInfo && updateActivityInfo.loading)}
                                  type="submit"
                                  onClick={() => handleSubmit(values)}
                                  size="sm"
                                  variant="contained"
                                >
                                  Confirm
                                </Button>
                              )}
                            </div>
                          )}
                          {editId && (
                            <div className="float-right">
                              {updateActivityInfo && !updateActivityInfo.data && (
                                <Button
                                  disabled={!(isValid) || (updateActivityInfo && updateActivityInfo.loading)}
                                  type="submit"
                                  variant="contained"
                                  size="sm"
                                  className="ml-1"
                                >
                                  Update
                                </Button>
                              )}
                            </div>
                          )}
                        </Form>
                      )}
                    </Formik>
                    {editId && (
                      <div className="float-right">
                        {updateActivityInfo && updateActivityInfo.data && (
                          <Button
                            type="button"
                            size="sm"
                            variant="contained"
                            onClick={toggle}
                          >
                            Ok
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                </CardBody>
              </div>
            </Col>
          </Row>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
Activity.propTypes = {
  activityModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default Activity;
