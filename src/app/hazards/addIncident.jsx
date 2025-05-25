/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Button } from "@mui/material";
import { ThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import AuditBlue from '@images/icons/auditBlue.svg';

import BasicForm from './forms/basicForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createHxIncident, getIncidentsFilters,
  updateIncident, getIncidentAction, resetCtAuditActionInfo,
} from './ctService';
import theme from '../util/materialTheme';
import {
  trimJsonObject, extractValueObjects,
  getDateTimeUtc, prepareDocuments, isAllCompany
} from '../util/appUtils';
import { last } from '../util/staticFunctions';
import AsyncFileUpload from '../commonComponents/asyncFileUpload';

import {
  onDocumentCreatesAttach, resetImage,
} from '../helpdesk/ticketService';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddIncident = (props) => {
  const {
    editId, isShow, closeModal, afterReset,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [auditRequest, setAuditRequest] = useState(false);
  const [isToDo, setToDo] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);

  const {
    addIncidentInfo, incidentDetailsInfo, hxIncidentConfig, updateIncidentInfo,
  } = useSelector((state) => state.hazards);

  const isAllCompanies = isAllCompany(userInfo, userRoles);

  const configData = hxIncidentConfig && hxIncidentConfig.data && hxIncidentConfig.data.length ? hxIncidentConfig.data[0] : false;

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userEmployeeId = userInfo && userInfo.data && userInfo.data.employee ? userInfo.data.employee.id : '';

  const history = useHistory();

  function updateDocuments(id) {
    if (uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0 && id) {
      const dcreate = prepareDocuments(uploadPhoto, id);
      dispatch(onDocumentCreatesAttach(dcreate));
    }
  }

  useEffect(() => {
    setToDo(false);
  }, []);

  AsyncFileUpload(addIncidentInfo, uploadPhoto);

  useEffect(() => {
    if (addIncidentInfo && addIncidentInfo.data && addIncidentInfo.data.length && !editId && isToDo) {
      dispatch(getIncidentAction(addIncidentInfo.data[0], 'action_to_acknowledged', appModels.EHSHAZARD));
      dispatch(resetCtAuditActionInfo());
    }
  }, [addIncidentInfo, isToDo]);

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
      
      //  closeModal();
      const postData = { ...values };

      const companyId = extractValueObjects(values.company_id);

      postData.incident_on = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
      // postData.target_closure_date = values.target_closure_date ? getDateTimeUtc(values.target_closure_date) : false;
      postData.category_id = extractValueObjects(values.category_id);
      // postData.sub_category_id = extractValueObjects(values.sub_category_id);
      // postData.severity_id = extractValueObjects(values.severity_id);
      postData.priority_id = extractValueObjects(values.priority_id);
      postData.equipment_id = extractValueObjects(values.equipment_id);
      // postData.probability_id = extractValueObjects(values.probability_id);
      postData.maintenance_team_id = extractValueObjects(values.maintenance_team_id);
      postData.incident_type_id = extractValueObjects(values.incident_type_id);
      postData.asset_id = values.asset_id ? checkDataType(values.asset_id) : false;
      postData.company_id = isAllCompanies ? companyId : userCompanyId;

      if (postData.has_incident_type) delete postData.has_incident_type;
      if (postData.has_attachment_for_reporting) delete postData.has_attachment_for_reporting;
      setToDo(false);
      const payload = { model: appModels.EHSHAZARD, values: postData };
      dispatch(createHxIncident(appModels.EHSHAZARD, payload));
      setIsOpenSuccessAndErrorModalWindow(true);
    } else {
     
      // closeModal();
      const postData = {
        name: values.name,
        description: values.description,
        type_category: values.type_category,
        target_closure_date: values.target_closure_date ? getDateTimeUtc(values.target_closure_date) : false,
        /// incident_on: values.incident_on ? getDateTimeUtc(values.incident_on) : false,
        category_id: extractValueObjects(values.category_id),
        priority_id: extractValueObjects(values.priority_id),
        equipment_id: extractValueObjects(values.equipment_id),
        maintenance_team_id: extractValueObjects(values.maintenance_team_id),
        incident_type_id: extractValueObjects(values.incident_type_id),
        assigned_id: extractValueObjects(values.assigned_id),
        asset_id: values.asset_id ? checkDataType(values.asset_id) : false,
      };
      dispatch(updateIncident(editId, appModels.EHSHAZARD, postData));
      setIsOpenSuccessAndErrorModalWindow(true);
    }
  }

  function handleSave(values) {
    if (!editId) {
      
      // closeModal();
      const postData = { ...values };

      postData.incident_on = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
      // postData.target_closure_date = values.target_closure_date ? getDateTimeUtc(values.target_closure_date) : false;
      postData.category_id = extractValueObjects(values.category_id);
      // postData.sub_category_id = extractValueObjects(values.sub_category_id);
      // postData.severity_id = extractValueObjects(values.severity_id);
      postData.priority_id = extractValueObjects(values.priority_id);
      postData.equipment_id = extractValueObjects(values.equipment_id);
      // postData.probability_id = extractValueObjects(values.probability_id);
      postData.maintenance_team_id = extractValueObjects(values.maintenance_team_id);
      postData.incident_type_id = extractValueObjects(values.incident_type_id);
      postData.asset_id = values.asset_id ? checkDataType(values.asset_id) : false;
      postData.company_id = userCompanyId;

      if (postData.has_incident_type) delete postData.has_incident_type;
      if (postData.has_attachment_for_reporting) delete postData.has_attachment_for_reporting;
      setToDo(true);
      const payload = { model: appModels.EHSHAZARD, values: postData };
      dispatch(createHxIncident(appModels.EHSHAZARD, payload));
      setIsOpenSuccessAndErrorModalWindow(true);
      
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
    setAuditRequest(false);
    closeModal();
    history.push({ pathname: '/ehs-hazards' });
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

  function isAcknowledgeUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && configData.acknowledge_role_id && configData.acknowledge_role_id.id && userRoleId === configData.acknowledge_role_id.id) {
      res = true;
    }
    return res;
  }

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
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
              <ThemeProvider theme={theme}>
                {isShow && (
                  <div>
                    <BasicForm values={values} formField={formField} isShow={isShow} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                  </div>
                )}
              </ThemeProvider>
              {(addIncidentInfo && addIncidentInfo.err) && (
                <SuccessAndErrorFormat response={addIncidentInfo} />
              )}
              {(addIncidentInfo && !addIncidentInfo.data && !addIncidentInfo.loading)
                && (
                  <>
                    <hr />
                    <div className={`bg-lightblue ${isShow ? 'sticky-button-50drawer' : ''}`}>
                      <Button
                        disabled={!editId ? !(isValid && dirty) || (values.has_attachment_for_reporting === 'Required' && !(uploadPhoto && uploadPhoto.length)) : !(isValid && dirty)}
                        type="submit"
                        variant="contained"
                      >
                        {!editId ? 'Report' : 'Update'}
                      </Button>
                      {!editId && isAcknowledgeUser() && configData.is_acknowledge_required && (
                        <Button
                          disabled={!(isValid && dirty) || (values.has_attachment_for_reporting === 'Required' && !(uploadPhoto && uploadPhoto.length))}
                          type="button"
                          onClick={() => handleSave(values)}
                          variant="contained"
                          className="ml-3"
                        >
                          Report & Acknowledge
                        </Button>
                      )}
                    </div>
                  </>
                )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'report'}
                newId={addIncidentInfo && addIncidentInfo.data && incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length > 0 ? incidentDetailsInfo.data[0].id : false}
                newName={addIncidentInfo && addIncidentInfo.data && incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length > 0 ? incidentDetailsInfo.data[0].name : false}
                successOrErrorData={editId ? updateIncidentInfo : addIncidentInfo}
                headerImage={AuditBlue}
                headerText="Hazard"
                actionMsg={isToDo ? 'Reported and Acknowledged' : false}
                onLoadRequest={onLoadRequest}
                successRedirect={closeAddMaintenance.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
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
