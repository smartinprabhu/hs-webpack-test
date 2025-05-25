/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import AuditBlue from '@images/icons/auditBlue.svg';

import BasicForm from './forms/basicForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';

import {
  trimJsonObject, extractValueObjects,
  getDateTimeUtcMuI, getArrayNewFormatUpdateDeleteNewV1,
  getListOfOperations,
} from '../util/appUtils';
import {
  createHxAudit,
  getHxAuditDetails,
  updateHxAudit,
} from './auditService';
import { last } from '../util/staticFunctions';
import AuditorForm from './forms/auditorForm';
import AuditeeForm from './forms/auditeeForm';
import {
  getNewRequestArray, getNewRequestArrayV2,
} from './utils/utils';
import actionCodes from './data/actionCodes.json';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddAudit = (props) => {
  const {
    editId, isShow, systemData, closeModal, afterReset, setViewId, setViewModal,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [auditRequest, setAuditRequest] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const { hxAuditCreate, hxAuditDetailsInfo, hxAuditUpdate } = useSelector((state) => state.hxAudits);

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  useEffect(() => {
    if (hxAuditCreate && hxAuditCreate.data && hxAuditCreate.data.length) {
      dispatch(getHxAuditDetails(hxAuditCreate.data[0], appModels.HXAUDIT));
    }
  }, [hxAuditCreate]);

  const isAuditorCreatable = allowedOperations.includes(actionCodes['Create Auditor']);
  const isAuditeeCreatable = allowedOperations.includes(actionCodes['Create Auditee']);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userEmployeeId = userInfo && userInfo.data && userInfo.data.employee ? userInfo.data.employee.id : '';

  const history = useHistory();

  function checkDataType(arr) {
    const value = last(arr);
    if (value && typeof value === 'object') {
      return arr.id;
    }
    if (value && typeof value === 'number') {
      return last(arr);
    }
    return false;
  }

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtcMuI(data);
    } else {
      result = moment(data).utc().format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  }

  function checkDateObject(date, datetime) {
    const dateOnly = new Date(date);
    const dateTimes = new Date(datetime);
    const currentHours = dateTimes.getHours();
    const currentMinutes = dateTimes.getMinutes();
    const currentSeconds = dateTimes.getSeconds();
    dateOnly.setHours(currentHours);
    dateOnly.setMinutes(currentMinutes);
    dateOnly.setSeconds(currentSeconds);
    return dateOnly;
  }

  function checkAudit(array) {
    const arrayNew = array.filter((item) => !item.isRemove && item.auditor_id && item.role_id);
    return arrayNew;
  }

  function checkAuditee(array) {
    const arrayNew = array.filter((item) => !item.isRemove && item.team_members_id && item.role_id);
    return arrayNew;
  }

  function checkRemove(array) {
    const arrayNew = array.filter((item) => !item.isRemove);
    return arrayNew;
  }

  function getDatefromTime(date) {
    const dateTime = new Date(date);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(dateTime.getDate()).padStart(2, '0');

    const dateOnly = `${year}-${month}-${day}`;
    return dateOnly;
  }

  function handleSubmit(values) {
    if (!editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      let auditdata = [];
      let auditeData = [];
      if (values.auditors_ids && values.auditors_ids.length > 0) {
        auditdata = getNewRequestArray(values.auditors_ids);
      }
      if (values.auditees_ids && values.auditees_ids.length > 0) {
        auditeData = getNewRequestArrayV2(values.auditees_ids);
      }
      const postData = { ...values };

      postData.planned_start_date = values.planned_start_date ? checkExDatehasObject(values.planned_start_date) : false;
      postData.planned_end_date = values.planned_end_date ? checkExDatehasObject(values.planned_end_date) : false;
      postData.audit_system_id = extractValueObjects(values.audit_system_id);
      postData.department_id = extractValueObjects(values.department_id);
      postData.audit_spoc_id = extractValueObjects(values.audit_spoc_id);
      postData.audit_category_id = extractValueObjects(values.audit_category_id);
      postData.auditors_ids = values.auditors_ids && values.auditors_ids.length > 0 ? getArrayNewFormatUpdateDeleteNewV1(checkAudit(auditdata)) : false;
      postData.auditees_ids = values.auditees_ids && values.auditees_ids.length > 0 ? getArrayNewFormatUpdateDeleteNewV1(checkAuditee(auditeData)) : false;
      delete postData.date_valid;

      let payload = { model: appModels.HXAUDIT, values: postData };

      if (postData.is_repeats && postData.is_repeats === 'Yes' && postData.bulk_events && postData.bulk_events.length > 0) {
        delete postData.is_repeats;
        delete postData.repeat_until;
        delete postData.month;
        const bulkEvents = [...postData.bulk_events];
        delete postData.bulk_events;
        const newPostData = bulkEvents.map((cl) => {
          // Calculate the new start and end dates
          const updatedStartDate = checkExDatehasObject(cl.planned_start_date);
          const updatedEndDate = checkExDatehasObject(cl.planned_end_date);

          return {
            ...postData, // Spread other properties from postData
            planned_start_date: updatedStartDate, // Overwrite with new start date
            planned_end_date: updatedEndDate, // Overwrite with new end date
          };
        });
        delete postData.bulk_events;
        const bulkPostData = [postData, ...newPostData];
        payload = { model: appModels.HXAUDIT, values: bulkPostData };
      } else {
        delete postData.is_repeats;
        delete postData.repeat_until;
        delete postData.month;
        delete postData.bulk_events;
        payload = { model: appModels.HXAUDIT, values: postData };
      }
      dispatch(createHxAudit(appModels.HXAUDIT, payload));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const postData = {
        name: values.name,
        audit_type: values.audit_type,
        scope: values.scope,
        audit_metric_id: values.audit_metric_id,
        overall_score: values.overall_score,
        instructions_to_auditor: values.instructions_to_auditor,
        instructions_to_auditee: values.instructions_to_auditee,
        terms_and_conditions: values.terms_and_conditions,
        objective: values.objective,
        // planned_start_date: values.planned_start_date ? trimJsonObject(hxAuditDetailsInfo.data[0]) && trimJsonObject(hxAuditDetailsInfo.data[0]).planned_start_date !== values.planned_start_date ? checkExDatehasObject(values.planned_start_date) : values.planned_start_date : false,
        // planned_end_date: values.planned_end_date ? trimJsonObject(hxAuditDetailsInfo.data[0]) && trimJsonObject(hxAuditDetailsInfo.data[0]).planned_end_date !== values.planned_end_date ? checkExDatehasObject(values.planned_end_date) : values.planned_end_date : false,
        audit_system_id: extractValueObjects(values.audit_system_id),
        department_id: extractValueObjects(values.department_id),
        audit_spoc_id: extractValueObjects(values.audit_spoc_id),
        audit_category_id: extractValueObjects(values.audit_category_id),
      };
      dispatch(updateHxAudit(editId, appModels.HXAUDIT, postData));
      //  closeModal();
    }
  }

  function isHoldersFilled(data) {
    let res = false;
    const auditors = data.auditors_ids && data.auditors_ids.length ? checkRemove(getNewRequestArray(data.auditors_ids)) : [];
    const auditees = data.auditees_ids && data.auditees_ids.length ? checkRemove(getNewRequestArrayV2(data.auditees_ids)) : [];
    if (auditors && auditors.length) {
      const filledData = checkAudit(auditors);
      if (filledData && !filledData.length) {
        res = true;
      }
    }
    if (auditees && auditees.length) {
      const filledData = checkAuditee(auditees);
      if (filledData && !filledData.length) {
        res = true;
      }
    }
    return res;
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
    if (!editId && setViewId && setViewModal) {
      setViewId(hxAuditCreate && hxAuditCreate.data && hxAuditCreate.data.length && hxAuditCreate.data[0]);
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
    if (hxAuditCreate && !hxAuditCreate.err) {
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
      initialValues={editId && hxAuditDetailsInfo && hxAuditDetailsInfo.data ? trimJsonObject(hxAuditDetailsInfo.data[0]) : formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isValid, dirty, values, setFieldValue, setFieldTouched, resetForm,
      }) => (
        <Form id={formId}>
          <Box
            sx={{
              padding: '0px 0px 0px 20px',
              width: '100%',
              maxHeight: '100vh',
              overflow: 'auto',
              marginBottom: editId ? '50px' : '70px',
            }}
          >
            {isShow && (
            <>
              <BasicForm systemData={systemData} formField={formField} isShow={isShow} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} values={values} />
              {!editId && (
                <>
                  {isAuditorCreatable && (
                  <AuditorForm setFieldValue={setFieldValue} />
                  )}
                  {isAuditeeCreatable && (
                  <AuditeeForm setFieldValue={setFieldValue} />
                  )}
                </>
              )}
            </>
            )}

            {(hxAuditCreate && hxAuditCreate.err) && (
            <SuccessAndErrorFormat response={hxAuditCreate} />
            )}
            <div className="float-right sticky-button-50drawer z-Index-1099">
              <Button
                disabled={!editId ? !(isValid && dirty) || isHoldersFilled(values) : !(isValid && dirty)}
                type="submit"
                variant="contained"
                className="submit-btn"
              >
                {!editId ? 'Create' : 'Update'}
              </Button>
            </div>
            <SuccessAndErrorModalWindow
              isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
              setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
              type={editId ? 'update' : 'create'}
              newId={!editId && hxAuditCreate && hxAuditCreate.data && hxAuditDetailsInfo && hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length > 0 ? hxAuditDetailsInfo.data[0].id : false}
              newName={!editId && hxAuditCreate && hxAuditCreate.data && hxAuditDetailsInfo && hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length > 0 ? hxAuditDetailsInfo.data[0].name : false}
              successOrErrorData={editId ? hxAuditUpdate : hxAuditCreate}
              headerImage={AuditBlue}
              headerText="Audit"
              onLoadRequest={onLoadRequest}
              successRedirect={closeAddMaintenance.bind(null, resetForm)}
              response={editId ? hxAuditUpdate : hxAuditCreate}
            />
          </Box>
        </Form>
      )}
    </Formik>
  );
};

AddAudit.propTypes = {
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  isShow: PropTypes.bool.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddAudit;
