/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Button } from "@mui/material";
import { Box } from "@mui/system";

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import AuditBlue from '@images/icons/auditBlue.svg';

import BasicForm from './forms/basicForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createHxIncident, getIncidentsFilters,
  updateIncident,
} from './ctService';
import {
  trimJsonObject, extractValueObjects,
  getDateTimeUtc, prepareDocuments,
} from '../util/appUtils';
import { last } from '../util/staticFunctions';

import {
  onDocumentCreatesAttach,
} from '../helpdesk/ticketService';
import AsyncFileUpload from '../commonComponents/asyncFileUpload';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddIncident = (props) => {
  const {
    editId, isShow, closeModal, afterReset, setViewId, setViewModal
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [auditRequest, setAuditRequest] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);

  const { addIncidentInfo, incidentDetailsInfo, updateIncidentInfo } = useSelector((state) => state.hxIncident);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userEmployeeId = userInfo && userInfo.data && userInfo.data.employee ? userInfo.data.employee.id : '';

  const history = useHistory();

  function updateDocuments(id) {
    if (uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0 && id) {
      const dcreate = prepareDocuments(uploadPhoto, id);
      dispatch(onDocumentCreatesAttach(dcreate));
    }
  }

  AsyncFileUpload(addIncidentInfo, uploadPhoto);

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

  function handleSubmit(values) {
    if (!editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const postData = { ...values };

      postData.incident_on = values.incident_on ? getDateTimeUtc(values.incident_on) : false;
      // postData.target_closure_date = values.target_closure_date ? getDateTimeUtc(values.target_closure_date) : false;
      postData.category_id = extractValueObjects(values.category_id);
      postData.sub_category_id = extractValueObjects(values.sub_category_id);
      postData.severity_id = extractValueObjects(values.severity_id);
      postData.priority_id = extractValueObjects(values.priority_id);
      postData.equipment_id = extractValueObjects(values.equipment_id);
      postData.probability_id = extractValueObjects(values.probability_id);
      postData.maintenance_team_id = extractValueObjects(values.maintenance_team_id);
      postData.incident_type_id = extractValueObjects(values.incident_type_id);
      postData.asset_id = values.asset_id ? checkDataType(values.asset_id) : false;
      postData.company_id = userCompanyId;

      if (postData.has_sub_category) delete postData.has_sub_category;
      if (postData.has_incident_type) delete postData.has_incident_type;
      if (postData.has_attachment_for_reporting) delete postData.has_attachment_for_reporting;

      const payload = { model: appModels.HXINCIDENT, values: postData };
      dispatch(createHxIncident(appModels.HXINCIDENT, payload));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const postData = {
        name: values.name,
        person_witnessed: values.person_witnessed,
        description: values.description,
        type_category: values.type_category,
        target_closure_date: values.target_closure_date ? getDateTimeUtc(values.target_closure_date) : false,
        incident_on: values.incident_on ? trimJsonObject(incidentDetailsInfo.data[0]) && trimJsonObject(incidentDetailsInfo.data[0]).incident_on !== values.incident_on ? getDateTimeUtc(values.incident_on) : values.incident_on : false,
        category_id: extractValueObjects(values.category_id),
        sub_category_id: extractValueObjects(values.sub_category_id),
        severity_id: extractValueObjects(values.severity_id),
        priority_id: extractValueObjects(values.priority_id),
        equipment_id: extractValueObjects(values.equipment_id),
        maintenance_team_id: extractValueObjects(values.maintenance_team_id),
        incident_type_id: extractValueObjects(values.incident_type_id),
        probability_id: extractValueObjects(values.probability_id),
        assigned_id: extractValueObjects(values.assigned_id),
        asset_id: values.asset_id ? checkDataType(values.asset_id) : false,
      };
      dispatch(updateIncident(editId, appModels.HXINCIDENT, postData));
      //  closeModal();
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
      dispatch(getIncidentsFilters(customFilters));
    }
    if (setViewId && setViewModal) {
      setViewId(addIncidentInfo && addIncidentInfo.data && addIncidentInfo.data.length && addIncidentInfo.data[0])
      setViewModal(true)
    }
    setAuditRequest(false);
    history.push({ pathname: '/hx-incidents' });
    closeModal();
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  const closeAddMaintenance = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={editId && incidentDetailsInfo && incidentDetailsInfo.data ? trimJsonObject(incidentDetailsInfo.data[0]) : formInitialValues}
        validationSchema={validationSchema(editId)}
        onSubmit={handleSubmit}
      >
        {({
          isValid, dirty, values, setFieldValue, setFieldTouched, resetForm,
        }) => (
          <Form id={formId}>
            <Box
              sx={{
                padding: "0px 0px 0px 20px",
                width: "100%",
                maxHeight: "100vh",
                overflow: 'auto',
                marginBottom: editId ? '50px' : '70px',
              }}
            >
              {isShow && (
                <BasicForm formField={formField} isShow={isShow} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} values={values} />
              )}

              {(addIncidentInfo && addIncidentInfo.err) && (
                <SuccessAndErrorFormat response={addIncidentInfo} />
              )}
              <div className="float-right sticky-button-85drawer">
                <Button
                  disabled={!editId ? !(isValid && dirty) || (values.has_attachment_for_reporting === 'Required' && !(uploadPhoto && uploadPhoto.length)) : !(isValid && dirty)}
                  type="submit"
                  variant='contained'
                  className="submit-btn"
                >
                  {!editId ? 'Create' : 'Update'}
                </Button>
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                newId={addIncidentInfo && addIncidentInfo.data && incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length > 0 ? incidentDetailsInfo.data[0].id : false}
                newName={addIncidentInfo && addIncidentInfo.data && incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length > 0 ? incidentDetailsInfo.data[0].name : false}
                successOrErrorData={editId ? updateIncidentInfo : addIncidentInfo}
                headerImage={AuditBlue}
                headerText="Incident"
                onLoadRequest={onLoadRequest}
                successRedirect={closeAddMaintenance.bind(null, resetForm)}
                response={editId ? updateIncidentInfo : addIncidentInfo}
              />
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

AddIncident.propTypes = {
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  isShow: PropTypes.bool.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddIncident;
