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
import { Redirect } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { Button, Divider } from "@mui/material";

import DialogHeader from '../../../commonComponents/dialogHeader';
import PromptIfUnSaved from '@shared/unSavedPrompt';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ActivitySegments from './activitySegments';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createActivity, resetAddActivity, updateActivity, resetUpdateActivity, resetChoiceOptions,
} from '../../ppmService';
import {
  getArrayNewFormatUpdateDelete, trimJsonObject, getArrayNewFormatUpdate, extractValueObjects, getColumnArrayById,
} from '../../../util/appUtils';
import { setCurrentTab } from '../../../adminSetup/setupService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const Activity = (props) => {
  const {
    activityModal, editId, editData, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [model, setmodel] = useState(activityModal);
  const toggle = () => {
    setmodel(!model);
    dispatch(resetAddActivity());
    dispatch(resetUpdateActivity());
    atFinish();
  };
  const { addActivityInfo, updateActivityInfo, questionChecklist } = useSelector((state) => state.ppm);

  useEffect(() => {
    dispatch(resetAddActivity());
    dispatch(resetUpdateActivity());
    dispatch(resetChoiceOptions());
  }, []);

  function handleSubmit(values) {
    if (editId) {
      const postData = {
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
      };
      dispatch(updateActivity(editId, appModels.ACTIVITY, postData));
    } else {
      const questionType = values.type.value;
      const expectedMin = values.expected_min_number ? parseFloat(values.expected_min_number) : 0;
      const expectedMax = values.expected_max_number ? parseFloat(values.expected_max_number) : 0;
      const groupId = extractValueObjects(values.mro_quest_grp_id);
      const smartId = extractValueObjects(values.reading_id);
      const insMethod = extractValueObjects(values.inspection_method);
      const reqAction = extractValueObjects(values.requires_action);
      const labelIds = values.labels_ids && values.labels_ids.length > 0 ? getArrayNewFormatUpdate(values.labels_ids) : false;
      const feedBack = values.feedback ? values.feedback : '';
      const preventiveAction = values.preventive_actions ? values.preventive_actions : '';
      const correctiveAction = values.corrective_actions ? values.corrective_actions : '';
      const requiresVerification = values.requires_verification ? values.requires_verification : '';
      const isResolution = values.is_resolution ? values.is_resolution : '';
      const enableCondition = values.is_enable_condition ? values.is_enable_condition : '';
      const parentId = extractValueObjects(values.parent_id);
      const optionId = values.based_on_ids && values.based_on_ids.length && values.based_on_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.based_on_ids, 'id')]] : false;
      const postData = { ...values };

      postData.type = questionType;
      postData.mro_quest_grp_id = groupId;
      postData.reading_id = smartId;
      postData.inspection_method = insMethod;
      postData.requires_action = reqAction;
      postData.labels_ids = labelIds;
      postData.expected_min_number = expectedMin;
      postData.expected_max_number = expectedMax;
      postData.feedback = feedBack;
      postData.preventive_actions = preventiveAction;
      postData.corrective_actions = correctiveAction;
      postData.requires_verification = requiresVerification;
      postData.is_enable_condition = enableCondition;
      postData.is_resolution = isResolution;
      postData.parent_id = parentId;
      postData.based_on_ids = optionId;
      const payload = { model: appModels.ACTIVITY, values: postData };
      dispatch(createActivity(payload));
      dispatch(setCurrentTab('Checklist'));
    }
  }

  const [checkListClose] = useState(false);

  // const setCheckListClose = () => {
  //   dispatch(setCurrentTab('Checklist'));
  //   setCheckListCloseOpen(true);
  // };
  if (checkListClose) {
    return (
      <Redirect to="/maintenance-configuration" />
    );
  }
  // const handleReset = (resetForm) => {
  //   resetForm();
  //   dispatch(resetAddActivity());
  // };

  return (
    <Dialog maxWidth="lg" open={model}>
      <DialogHeader title={!editId ? 'Create Question' : 'Update Question'} imagePath={false} onClose={() => { toggle(); }} response={addActivityInfo} />
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
                        isValid, dirty, setFieldValue,
                      }) => (
                        <Form id={formId}>
                          {(addActivityInfo && !addActivityInfo.data) && (
                            <PromptIfUnSaved />
                          )}
                          {addActivityInfo && !addActivityInfo.data && updateActivityInfo && !updateActivityInfo.data && (
                            <Row className="comments-list thin-scrollbar">
                              <Col xs={12} sm={12} lg={12} md={12}><ActivitySegments formField={formField} setFieldValue={setFieldValue} editId={editId} editData={editData} /></Col>
                            </Row>
                          )}
                          {addActivityInfo && addActivityInfo.loading && (
                            <div className="text-center mt-3">
                              <Loader />
                            </div>
                          )}
                          {(addActivityInfo && addActivityInfo.err) && (
                            <SuccessAndErrorFormat response={addActivityInfo} />
                          )}
                          {(addActivityInfo && addActivityInfo.data) && (
                            <SuccessAndErrorFormat response={addActivityInfo} successMessage="Question created successfully.." />
                          )}
                          {updateActivityInfo && updateActivityInfo.loading && (
                            <div className="text-center mt-3">
                              <Loader />
                            </div>
                          )}
                          {(updateActivityInfo && updateActivityInfo.err) && (
                            <SuccessAndErrorFormat response={updateActivityInfo} />
                          )}
                          {(updateActivityInfo && updateActivityInfo.data) && (
                            <SuccessAndErrorFormat response={updateActivityInfo} successMessage="Question updated successfully.." />
                          )}
                          <Divider  className='mb-2'/>
                          {!editId && (
                            <div className="float-right">
                              {addActivityInfo && addActivityInfo.data && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="contained"
                                  onClick={toggle}
                                >
                                  Ok
                                </Button>
                              )}
                              {addActivityInfo && !addActivityInfo.data && (
                                <Button
                                  disabled={!(isValid && dirty) || (addActivityInfo && addActivityInfo.loading)}
                                  type="submit"
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
