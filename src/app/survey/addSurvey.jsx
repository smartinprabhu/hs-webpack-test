/* eslint-disable radix */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Formik, Form } from 'formik';
import { Redirect } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  FormControl, Box, Button,
} from '@mui/material';

import PromptIfUnSaved from '@shared/unSavedPrompt';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import ChecklistSurveyBlue from '@images/icons/checklistSurveyBlue.svg';

import BasicForm from './forms/basicForm';
import AdditionalForm from './forms/additionalForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createSurvey, getSurveyList, getSurveyCount, getSurveyDetail, updateSurvey, resetStorePages,
} from './surveyService';
import theme from '../util/materialTheme';
import {
  getEditArray,
} from './utils/utils';
import {
  trimJsonObject, getColumnArrayById,
  getAllowedCompanies, getArrayNewFormatUpdateDelete, extractValueObjects,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddSurvey = (props) => {
  const {
    editId,
    afterReset,
  } = props;
  const dispatch = useDispatch();
  const [reload, setReload] = useState('1');
  const [survey, setSurvey] = useState(false);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    addSurveyInfo, surveyDetails, surveyUpdateInfo, surveyLocations, surveyTenants,
  } = useSelector((state) => state.survey);

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  useEffect(() => {
    if ((userInfo && userInfo.data) && (addSurveyInfo && addSurveyInfo.data)) {
      const customFilters = '';
      dispatch(getSurveyList(companies, appModels.SURVEY, limit, offsetValue, customFilters, sortByValue, sortFieldValue));
      dispatch(getSurveyCount(companies, appModels.SURVEY, customFilters));
    }
  }, [userInfo, addSurveyInfo]);

  useEffect(() => {
    if (addSurveyInfo && addSurveyInfo.data && addSurveyInfo.data.length) {
      dispatch(getSurveyDetail(addSurveyInfo.data[0], appModels.SURVEY));
    }
  }, [userInfo, addSurveyInfo]);

  function getAddPageIds(array) {
    for (let i = 0; i < array.length; i += 1) {
      // eslint-disable-next-line no-param-reassign
      array[i].sequence = i + 1;
      if (array[i].question_ids && array[i].question_ids.length > 0) {
        const question = array[i];
        if (!array[i].id) {
          for (let j = 0; j < question.question_ids.length; j += 1) {
            const q = question.question_ids[j];
            q.sequence = j + 1;
            if (q.parent_id) {
              q.parent_id = q.parent_id.id ? q.parent_id.id : false;
            }
            if (q.labels_ids && q.labels_ids.length > 0) {
              q.labels_ids = getArrayNewFormatUpdateDelete(q.labels_ids);
            }
            if (q.labels_ids_2 && q.labels_ids_2.length > 0) {
              q.labels_ids_2 = getArrayNewFormatUpdateDelete(q.labels_ids_2);
            }
            if (q.validation_max_date) {
              q.validation_max_date = q.validation_max_date !== '' ? q.validation_max_date : false;
            } else {
              q.validation_max_date = false;
            }
            if (q.validation_min_date) {
              q.validation_min_date = q.validation_min_date !== '' ? q.validation_min_date : false;
            } else {
              q.validation_min_date = false;
            }
          }
          question.question_ids = getArrayNewFormatUpdateDelete(array[i].question_ids);
        }
      }
    }
    return array;
  }

  function getEditPageIds(array) {
    const newArr = [];
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][0] === 2 || (array[i] && array[i][2] && (array[i][2].id || array[i][2].title))) {
        if (array[i] && array[i][2] && array[i][2].question_ids && array[i][2].question_ids.length > 0) {
          const question = array[i][2];
          if (!array[i][2].id) {
            const questionIds = array[i][2].question_ids;
            for (let k = 0; k < questionIds.length; k += 1) {
              const p = questionIds[k];
              p.sequence = k + 1;
              if (p.labels_ids && p.labels_ids.length > 0) {
                p.labels_ids = getArrayNewFormatUpdateDelete(p.labels_ids);
              } else {
                delete p.labels_ids;
              }
              if (p.labels_ids_2 && p.labels_ids_2.length > 0) {
                p.labels_ids_2 = getArrayNewFormatUpdateDelete(p.labels_ids_2);
              }
              if (p.parent_id) {
                p.parent_id = p.parent_id.id ? p.parent_id.id : false;
              } else {
                p.parent_id = false;
              }
            }
            question.question_ids = getArrayNewFormatUpdateDelete(questionIds);
          } else {
            for (let j = 0; j < question.question_ids.length; j += 1) {
              const q = question.question_ids[j];
              if (q.id) {
                if (q.page_id) {
                  q.page_id = extractValueObjects(q.page_id);
                }
                if (q.survey_id) {
                  q.survey_id = extractValueObjects(q.survey_id);
                }
                if (q.parent_id) {
                  q.parent_id = extractValueObjects(q.parent_id);
                }
                if (q.validation_max_date) {
                  q.validation_max_date = q.validation_max_date !== '' ? q.validation_max_date : false;
                } else {
                  q.validation_max_date = false;
                }
                if (q.validation_min_date) {
                  q.validation_min_date = q.validation_min_date !== '' ? q.validation_min_date : false;
                } else {
                  q.validation_min_date = false;
                }
                if (q.column_nb) {
                  q.column_nb = q.column_nb && q.column_nb.value ? q.column_nb.value : q.column_nb;
                }
                if (q.user_input_line_ids && q.user_input_line_ids.length > 0) {
                  const editInputIds = getEditArray(q.user_input_line_ids, 'value');
                  q.user_input_line_ids = getArrayNewFormatUpdateDelete(editInputIds);
                }
                if (q.labels_ids && q.labels_ids.length > 0) {
                  const editLabelIds = getEditArray(q.labels_ids, 'value');
                  q.labels_ids = getArrayNewFormatUpdateDelete(editLabelIds);
                } else {
                  delete q.labels_ids;
                }
                if (q.labels_ids_2 && q.labels_ids_2.length > 0) {
                  const editLabelsIds = getEditArray(q.labels_ids_2, 'value');
                  q.labels_ids_2 = getArrayNewFormatUpdateDelete(editLabelsIds);
                }
              }
            }
            const editQuestionIds = getEditArray(question.question_ids, 'question');
            const arr = getArrayNewFormatUpdateDelete(editQuestionIds);
            question.question_ids = arr;
          }
        }
      } else {
        newArr.push(array[i]);
      }
    }
    if (newArr && newArr.length > 0) {
      return false;
    }
    return array;
  }

  function handleSubmit(values) {
    if (editId) {
      const locationIds = values.location_ids && values.location_ids.length && values.location_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : false;
      const tenantIds = values.tenant_ids && values.tenant_ids.length && values.tenant_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.tenant_ids, 'id')]] : false;
      const recipientsIds = values.recipients_ids && values.recipients_ids.length && values.recipients_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.recipients_ids, 'id')]] : false;
      const postData = {
        title: values.title,
        description: values.description ? values.description : false,
        page_ids: values.page_ids && values.page_ids.length > 0 ? getEditPageIds(getArrayNewFormatUpdateDelete(values.page_ids)) : false,
        category_type: values.category_type && values.category_type.value ? values.category_type.value : values.category_type,
        equipment_id: extractValueObjects(values.equipment_id),
        location_id: extractValueObjects(values.location_id),
        location_ids: locationIds,
        tenant_ids: tenantIds,
        requires_verification_by_otp: values.requires_verification_by_otp ? values.requires_verification_by_otp : false,
        has_reviwer_name: values.has_reviwer_name,
        has_reviwer_email: values.has_reviwer_email,
        has_reviwer_mobile: values.has_reviwer_mobile,
        has_tenant: values.has_tenant,
        has_disclaimer: values.has_disclaimer,
        disclaimer_text: values.disclaimer_text,
        feedback_text: values.feedback_text,
        is_show_all_spaces: values.is_show_all_spaces,
        is_send_email: values.is_send_email,
        ...(values.is_send_email
          && {
            is_repeats: values.is_repeats,
            day: Number(values.day),
            mo: !!values.mo,
            tu: !!values.tu,
            we: !!values.we,
            th: !!values.th,
            fr: !!values.fr,
            sa: !!values.sa,
            su: !!values.su,
            recipients_ids: recipientsIds,
            recurrent_rule: values.recurrent_rule && values.recurrent_rule.value ? values.recurrent_rule.value : values.recurrent_rule,
            deadline: Number(values.deadline),
            answered_already: values.answered_already,
            deadline_elapsed: values.deadline_elapsed,
            escalation_policy_id: extractValueObjects(values.escalation_policy_id),
            campaign_email_id: extractValueObjects(values.campaign_email_id),
            reminder_email_id: extractValueObjects(values.reminder_email_id),
            starts_on: values.starts_on ? values.starts_on : false,
          }),
        space_level: values.space_level && values.space_level.value ? values.space_level.value : values.space_level,
        survey_time: parseFloat(values.survey_time),
        successful_homepage_return_time: values.successful_homepage_return_time ? parseInt(values.successful_homepage_return_time) : 0,
      };
      dispatch(updateSurvey(editId, postData, appModels.SURVEY));
      setIsOpenSuccessAndErrorModalWindow(true);
      dispatch(resetStorePages());
    } else {
      const locationIds = values.location_ids && values.location_ids.length && values.location_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : false;
      const tenantIds = values.tenant_ids && values.tenant_ids.length && values.tenant_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.tenant_ids, 'id')]] : false;
      const recipientsIds = values.recipients_ids && values.recipients_ids.length && values.recipients_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.recipients_ids, 'id')]] : false;
      setIsOpenSuccessAndErrorModalWindow(true);
      // afterReset();
      const postData = {
        title: values.title,
        active: true,
        stage_id: 1,
        notify_on_submitting_feedback: false,
        survey_verfication_email: false,
        survey_verfication_sms: false,
        is_closed: false,
        users_can_go_back: false,
        auth_required: false,
        quizz_mode: false,
        message_attachment_count: 0,
        description: values.description ? values.description : false,
        page_ids: values.page_ids && values.page_ids.length > 0 ? getArrayNewFormatUpdateDelete(getAddPageIds(values.page_ids)) : false,
        category_type: values.category_type && values.category_type.value ? values.category_type.value : false,
        equipment_id: values.equipment_id ? values.equipment_id.id : false,
        location_id: values.location_id ? values.location_id.id : false,
        location_ids: locationIds,
        tenant_ids: tenantIds,
        requires_verification_by_otp: values.requires_verification_by_otp ? values.requires_verification_by_otp : false,
        has_reviwer_name: values.has_reviwer_name,
        has_reviwer_email: values.has_reviwer_email,
        has_reviwer_mobile: values.has_reviwer_mobile,
        has_tenant: values.has_tenant,
        has_disclaimer: values.has_disclaimer,
        disclaimer_text: values.disclaimer_text,
        feedback_text: values.feedback_text,
        is_show_all_spaces: values.is_show_all_spaces,
        is_send_email: values.is_send_email,
        ...(values.is_send_email
          && {
            recipients_ids: recipientsIds,
            is_repeats: values.is_repeats,
            day: Number(values.day),
            mo: values.mo,
            tu: values.tu,
            we: values.we,
            th: values.th,
            fr: values.fr,
            sa: values.sa,
            su: values.su,
            recurrent_rule: values.recurrent_rule && values.recurrent_rule.value ? values.recurrent_rule.value : false,
            deadline: Number(values.deadline),
            answered_already: values.answered_already,
            deadline_elapsed: values.deadline_elapsed,
            escalation_policy_id: extractValueObjects(values.escalation_policy_id),
            campaign_email_id: extractValueObjects(values.campaign_email_id),
            reminder_email_id: extractValueObjects(values.reminder_email_id),
            starts_on: values.starts_on ? values.starts_on : false,
          }),
        space_level: values.space_level && values.space_level.value ? values.space_level.value : '',
        survey_time: values.survey_time === '00:00' ? 0 : parseFloat(values.survey_time),
        successful_homepage_return_time: values.successful_homepage_return_time ? parseInt(values.successful_homepage_return_time) : 0,
      };
      const payload = { model: appModels.SURVEY, values: postData };
      dispatch(createSurvey(appModels.SURVEY, payload));
    }
  }

  function getSurveyLocations(obj) {
    let res = obj;
    const data = surveyLocations && surveyLocations.data ? surveyLocations.data : [];
    if (data && data.length) {
      const postData = { ...obj };
      postData.location_ids = data;
      res = postData;
    }
    const data1 = surveyTenants && surveyTenants.data ? surveyTenants.data : [];
    if (data1 && data1.length) {
      const postData = { ...obj };
      postData.tenant_ids = data1;
      res = postData;
    }
    return res;
  }

  /* const handleReset = (resetForm) => {
    resetForm();
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const onLoadRequest = (eid, ename) => {
    setSurvey(eid);
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      if (afterReset) afterReset();
      dispatch(getSurveyFilters(customFilters));
    }
  }; */

  const handleReset = (resetForm) => {
    resetForm();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  if (survey) {
    return (<Redirect to="/survey" />);
  }

  return (
    <Formik
      enableReinitialize
      initialValues={editId && surveyDetails && surveyDetails.data ? trimJsonObject(getSurveyLocations(surveyDetails.data[0])) : formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isValid, dirty, setFieldValue, setFieldTouched, resetForm,
      }) => (
        <Form id={formId}>
          <PromptIfUnSaved />
          <Box
            sx={{
              width: '100%',
              maxHeight: '100vh',
              overflow: 'auto',
              marginBottom: '30px',
            }}
          >
            <FormControl
              sx={{
                width: '100%',
                padding: '10px 20px 20px 30px',
                // maxHeight: '550px',
                // overflowY: 'scroll',
                borderTop: '1px solid #0000001f',
              }}
            >
              <ThemeProvider theme={theme}>
                <div>
                  <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} reload={reload} />
                  <AdditionalForm editId={editId} formField={formField} setFieldTouched={setFieldTouched} setFieldValue={setFieldValue} />
                </div>
              </ThemeProvider>
            </FormControl>
          </Box>
          {addSurveyInfo && addSurveyInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
          )}
          {(addSurveyInfo && addSurveyInfo.err) && (
            <SuccessAndErrorFormat response={addSurveyInfo} />
          )}
          {(surveyUpdateInfo && surveyUpdateInfo.err) && (
            <SuccessAndErrorFormat response={surveyUpdateInfo} />
          )}
          {/* {((addSurveyInfo && addSurveyInfo.data) || (surveyUpdateInfo && surveyUpdateInfo.data)) && (
                <>
                  <SuccessAndErrorFormat
                    response={addSurveyInfo.data ? addSurveyInfo : surveyUpdateInfo}
                    successMessage={addSurveyInfo.data ? 'Survey added successfully..' : 'Survey details are updated successfully..'}
                  />
                    {!editId && surveyDetails && surveyDetails.data && (
                    <p className="text-center mt-2 mb-0 tab_nav_link">
                      Click here to view
                      {' '}
                      :
                      <span
                        aria-hidden="true"
                        className="ml-2 cursor-pointer text-info"
                        onClick={() => onLoadRequest(surveyDetails.data[0].id, surveyDetails.data[0].title)}
                      >
                        {surveyDetails.data[0].title}
                      </span>
                      {' '}
                      details
                    </p>
                    )}
                </>
                    )}
              <hr />
              <div className="float-right mr-4">
                {(addSurveyInfo && addSurveyInfo.data) || (surveyUpdateInfo && surveyUpdateInfo.data) ? (
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
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      type="submit"
                      size="sm"
                       variant="contained"
                    >
                      {!editId ? 'Add' : 'Update'}
                    </Button>
                  </>
                )}
              </div>
              <>
                {((addSurveyInfo && addSurveyInfo.data) || (surveyUpdateInfo && surveyUpdateInfo.data)) && (
                <SuccessAndErrorFormat
                  response={addSurveyInfo.data ? addSurveyInfo : surveyUpdateInfo}
                  successMessage={addSurveyInfo.data ? 'Work Permit added successfully..' : 'Work Permit details are updated successfully..'}
                />
                )}
              <div className="float-right">
                {((addSurveyInfo && addSurveyInfo.data) || (surveyUpdateInfo && surveyUpdateInfo.data)) && (
                <Button
                   variant="contained"
                  size="sm"
                  onClick={closeDrawer}
                >
                  Ok
                </Button>
                )}
              </div> */}
          <div className="sticky-button-85drawer">
            {(addSurveyInfo && !addSurveyInfo.data && !addSurveyInfo.loading)
              && (surveyUpdateInfo && !surveyUpdateInfo.data && !surveyUpdateInfo.loading) && (
                <Button
                  disabled={!editId ? !(isValid && dirty) : !isValid}
                  type="submit"
                  size="sm"
                  variant="contained"
                >
                  {!editId ? 'Create' : 'Update'}
                </Button>
            )}
          </div>
          <SuccessAndErrorModalWindow
            isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
            setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
            type={editId ? 'update' : 'create'}
            successOrErrorData={editId ? surveyUpdateInfo : addSurveyInfo}
            headerImage={ChecklistSurveyBlue}
            headerText="Survey"
            customErrMsg={editId && surveyDetails && surveyDetails.data && surveyDetails.data.length && surveyDetails.data[0].tot_comp_survey > 0 ? 'There are one or more survey responses attached to this question. Hence, you will not be able to delete it.' : false}
            successRedirect={handleReset.bind(null, resetForm)}
          />
        </Form>
      )}
    </Formik>
  );
};

AddSurvey.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
};

export default AddSurvey;
