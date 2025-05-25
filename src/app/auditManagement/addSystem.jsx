/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Button, DialogActions } from '@mui/material';
import { Box } from '@mui/system';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import AuditBlue from '@images/icons/auditBlue.svg';
import Loader from '@shared/loading';

import BasicForm from './configuration/forms/basicForm';
import validationSchema from './configuration/formModel/validationSchema';
import checkoutFormModel from './configuration/formModel/checkoutFormModel';
import formInitialValues from './configuration/formModel/formInitialValues';

import {
  trimJsonObject, extractValueObjects,
  getArrayNewFormatCreateNewV1, getArrayNewFormatUpdateDelete,
  getListOfOperations,
} from '../util/appUtils';
import {
  updateHxSystem,
  getHxAuditSystemDetail,
  createHxSystem,
} from './auditService';
import {
  resetStorePages,
} from '../survey/surveyService';
import { last } from '../util/staticFunctions';
import {
  getEditArray,
} from '../survey/utils/utils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddSystem = (props) => {
  const {
    editId, isShow, isCopy, closeModal, afterReset, isDialog, setViewId, setViewModal,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [auditRequest, setAuditRequest] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const { hxSystemCreate, hxAuditSystemDetail, hxSystemUpdate } = useSelector((state) => state.hxAudits);

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  useEffect(() => {
    if (!isCopy && hxSystemCreate && hxSystemCreate.data && hxSystemCreate.data.length) {
      dispatch(getHxAuditSystemDetail(hxSystemCreate.data[0], appModels.HXSYSTEM));
    }
  }, [hxSystemCreate]);

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
            if (q.question_group_id) {
              q.question_group_id = extractValueObjects(q.question_group_id);
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
              if (p.question_group_id) {
                p.question_group_id = extractValueObjects(p.question_group_id)
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
                if (q.question_group_id) {
                  q.question_group_id = extractValueObjects(q.question_group_id);
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

  function getCopyPageIds(array) {
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
                p.labels_ids = getArrayNewFormatCreateNewV1(p.labels_ids);
              } else {
                delete p.labels_ids;
              }
              if (p.labels_ids_2 && p.labels_ids_2.length > 0) {
                p.labels_ids_2 = getArrayNewFormatCreateNewV1(p.labels_ids_2);
              }
              if (p.question_group_id) {
                p.question_group_id = extractValueObjects(p.question_group_id);
              }
              if (p.parent_id) {
                p.parent_id = p.parent_id.id ? p.parent_id.id : false;
              } else {
                p.parent_id = false;
              }
            }
            question.question_ids = getArrayNewFormatCreateNewV1(questionIds);
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
                if (q.question_group_id) {
                  q.question_group_id = extractValueObjects(q.question_group_id);
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
                  q.user_input_line_ids = getArrayNewFormatCreateNewV1(editInputIds);
                }
                if (q.labels_ids && q.labels_ids.length > 0) {
                  const editLabelIds = getEditArray(q.labels_ids, 'value');
                  q.labels_ids = getArrayNewFormatCreateNewV1(editLabelIds);
                } else {
                  delete q.labels_ids;
                }
                if (q.labels_ids_2 && q.labels_ids_2.length > 0) {
                  const editLabelsIds = getEditArray(q.labels_ids_2, 'value');
                  q.labels_ids_2 = getArrayNewFormatCreateNewV1(editLabelsIds);
                }
              }
            }
            const editQuestionIds = getEditArray(question.question_ids, 'question');
            const arr = getArrayNewFormatCreateNewV1(editQuestionIds);
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
    if (editId && !isCopy) {
      setIsOpenSuccessAndErrorModalWindow(true);

      const postData = {
        name: values.name,
        department_id: extractValueObjects(values.department_id),
        scope: values.scope,
        short_code: values.short_code,
        objective: values.objective,
        audit_metric_id: extractValueObjects(values.audit_metric_id),
        terms_and_conditions: values.terms_and_conditions,
        instructions_to_auditee: values.instructions_to_auditee,
        instructions_to_auditor: values.instructions_to_auditor,
        page_ids: values.page_ids && values.page_ids.length > 0 ? getEditPageIds(getArrayNewFormatUpdateDelete(values.page_ids)) : false,

      };
      dispatch(updateHxSystem(editId, appModels.HXSYSTEM, postData));
      setIsOpenSuccessAndErrorModalWindow(true);
      dispatch(resetStorePages());
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);

      const postData = {
        name: isCopy ? `${values.name}-Copy` : values.name,
        department_id: extractValueObjects(values.department_id),
        scope: values.scope,
        short_code: isCopy ? `${values.short_code}-Copy` : values.short_code,
        objective: values.objective,
        audit_metric_id: extractValueObjects(values.audit_metric_id),
        terms_and_conditions: values.terms_and_conditions,
        instructions_to_auditee: values.instructions_to_auditee,
        instructions_to_auditor: values.instructions_to_auditor,
        page_ids: isCopy && values.page_ids && values.page_ids.length > 0 ? (isCopy ? getCopyPageIds(getArrayNewFormatCreateNewV1(values.page_ids)) : getArrayNewFormatUpdateDelete(getAddPageIds(values.page_ids))) : false,
      };
      const payload = { model: appModels.HXSYSTEM, values: postData };
      dispatch(createHxSystem(appModels.HXSYSTEM, payload));
    }
  }

  const onLoadRequest = (eid, ename) => {
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      // dispatch(getIncidentsFilters(customFilters));
    }
    if ((!editId && !isCopy) && setViewId && setViewModal) {
      setViewId(hxSystemCreate && hxSystemCreate.data && hxSystemCreate.data.length && hxSystemCreate.data[0]);
      setViewModal(true);
      closeModal();
    }
    setAuditRequest(false);
    //  history.push({ pathname: '/audits' });
    // closeModal();
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  const closeAddMaintenance = (resetForm) => {
    if (hxSystemCreate && !hxSystemCreate.err) {
      resetForm();
      closeModal();
    }
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={editId && hxAuditSystemDetail && hxAuditSystemDetail.data ? trimJsonObject(hxAuditSystemDetail.data[0]) : formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isValid, dirty, values, setFieldValue, setFieldTouched, resetForm,
      }) => (
        <Form id={formId}>
          <Box
            sx={!isDialog ? {
              padding: '0px 0px 0px 20px',
              width: '100%',
              maxHeight: '100vh',
              overflow: 'auto',
              marginBottom: editId ? '50px' : '70px',
            } : {
              padding: '0px 0px 0px 20px',
              width: '100%',
            }}
          >
            {isShow && !isCopy && (
            <BasicForm isCopy={isCopy} values={values} formField={formField} editId={editId} setFieldValue={setFieldValue} reload="1" />
            )}

            {isCopy && !(hxSystemCreate && hxSystemCreate.data) && (
            <div className="justify-content-center">
              <p className="text-info font-family-tab">Do you want to duplicate this audit system and customize ?</p>
            </div>
            )}

            {(hxSystemCreate && hxSystemCreate.err) && (
            <SuccessAndErrorFormat response={hxSystemCreate} />
            )}
            {isCopy && hxSystemCreate && hxSystemCreate.loading && (
            <div className="mt-4" data-testid="loading-case">
              <Loader />
            </div>
            )}
            {isCopy && hxSystemCreate && hxSystemCreate.data && !hxSystemCreate.loading && (
            <SuccessAndErrorFormat response={hxSystemCreate} successMessage="The System has been duplicated successfully.." />
            )}
            {!isDialog && (
            <div className="float-right sticky-button-75drawer z-Index-1099">
              <Button
                disabled={!editId ? !(isValid && dirty) : isCopy ? !isValid : !(isValid && dirty)}
                type="submit"
                variant="contained"
                className="submit-btn"
              >
                {!editId ? 'Create' : (isCopy ? 'Create' : 'Update')}
              </Button>
            </div>
            )}
            {isDialog && (
            <DialogActions className="">
              {hxSystemCreate && !hxSystemCreate.data && !hxSystemCreate.err && (
              <Button
                disabled={!editId ? !(isValid && dirty) : isCopy ? (!isValid || (hxSystemCreate && hxSystemCreate.loading)) : !(isValid && dirty)}
                type="submit"
                variant="contained"
                className="submit-btn"
              >
                {!editId ? 'Create' : isCopy ? 'Duplicate' : 'Update'}
              </Button>
              )}
              {hxSystemCreate && hxSystemCreate.data && (
              <Button
                type="button"
                variant="contained"
                className="submit-btn"
                onClick={() => closeModal()}
              >
                Ok
              </Button>
              )}
            </DialogActions>
            )}

            {!isCopy && (
            <SuccessAndErrorModalWindow
              isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
              setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
              type={editId && !isCopy ? 'update' : 'create'}
              newId={(!editId || isCopy) && hxSystemCreate && hxSystemCreate.data && hxAuditSystemDetail && hxAuditSystemDetail.data && hxAuditSystemDetail.data.length > 0 ? hxAuditSystemDetail.data[0].id : false}
              newName={(!editId || isCopy) && hxSystemCreate && hxSystemCreate.data && hxAuditSystemDetail && hxAuditSystemDetail.data && hxAuditSystemDetail.data.length > 0 ? hxAuditSystemDetail.data[0].name : false}
              successOrErrorData={editId && !isCopy ? hxSystemUpdate : hxSystemCreate}
              headerImage={AuditBlue}
              headerText="Audit System"
              onLoadRequest={onLoadRequest}
              successRedirect={closeAddMaintenance.bind(null, resetForm)}
              response={editId ? hxSystemUpdate : hxSystemCreate}
            />
            )}
          </Box>
        </Form>
      )}
    </Formik>
  );
};

AddSystem.propTypes = {
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  isShow: PropTypes.bool.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddSystem;
