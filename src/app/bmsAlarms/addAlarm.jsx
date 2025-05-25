/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
  CardBody,
} from 'reactstrap';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
// import trackerBlackIcon from '@images/icons/complianceBlack.svg';

import trackerBlackIcon from '@images/icons/breakTrackerBlue.svg';

// import BasicForm from './forms/basicForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createTracker, getTrackerDetail, resetAddTrackerInfo, getTrackerFilters,
} from './breakdownService';
import {
  updateTenant, resetUpdateTenant,
} from '../adminSetup/setupService';
import {
  trimJsonObject, extractValueObjects,
  getAllCompanies, getDateTimeUtc, prepareDocuments,
} from '../util/appUtils';
import { last } from '../util/staticFunctions';
import {
  resetImage, onDocumentCreatesAttach,
} from '../helpdesk/ticketService';
import RequestorForm from './forms/requestorForm';
import IncidentForm from './forms/incidentForm';
// import AssetForm from './forms/assetForm';
import DescriptionForm from './forms/descriptionForm';
import {
  getRequiredMessage,
} from './utils/utils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddTracker = (props) => {
  const {
    editId, isShow, closeModal, afterReset,
    addModal,
  } = props;
  const dispatch = useDispatch();
  const [reload] = useState('1');
  const [dateError, setDateError] = useState(false);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  const [trackerRequest, setTrackerRequest] = useState(false);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { addTrackerInfo, trackerDetails } = useSelector((state) => state.bmsAlarms);
  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (addTrackerInfo && addTrackerInfo.data && addTrackerInfo.data.length) {
      dispatch(getTrackerDetail(addTrackerInfo.data[0], appModels.BMSALARMS));
    }
  }, [userInfo, addTrackerInfo]);

  useEffect(() => {
    if (addModal) {
      dispatch(resetAddTrackerInfo());
      dispatch(resetImage());
    }
  }, [addModal]);

  function updateDocuments(id) {
    if (uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0 && id) {
      const dcreate = prepareDocuments(uploadPhoto, id);
      dispatch(onDocumentCreatesAttach(dcreate));
    }
  }

  function checkDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtc(data);
    }
    return result;
  }

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      let slaDate = values.planned_sla_end_date ? values.planned_sla_end_date : false;
      if (checkDatehasObject(slaDate)) {
        slaDate = getDateTimeUtc(slaDate);
      }

      const postData = {
        requested_by: values.requested_by,
        subject: values.subject,
        category_id: values.category_id ? extractValueObjects(values.category_id) : false,
        sub_category_id: values.sub_category_id ? extractValueObjects(values.sub_category_id) : false,
        severity: values.severity ? values.severity.value : '',
        description: values.description ? values.description : '',
        company_id: values.company_id ? extractValueObjects(values.company_id) : false,
        type: values.type ? values.type : '',
        space_id: values.space_id ? extractValueObjects(values.space_id) : false,
        equipment_id: values.equipment_id ? extractValueObjects(values.equipment_id) : false,
        maintenance_team_id: values.maintenance_team_id ? extractValueObjects(values.maintenance_team_id) : false,
        planned_sla_end_date: slaDate,
      };
      if (!getRequiredMessage(postData)) {
        setDateError(false);
        dispatch(updateTenant(editId, postData, appModels.BMSALARMS));
      } else {
        setDateError(getRequiredMessage(postData));
      }
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const raisedId = values.requested_by ? values.requested_by : '';
      const categoryId = extractValueObjects(values.category_id);
      const subCategoryId = extractValueObjects(values.sub_category_id);
      const Severity = values.severity && values.severity.value ? values.severity.value : '';
      const companyId = values.company_id ? extractValueObjects(values.company_id) : false;
      const spaceId = (last(values.space_id));
      const equipmentId = extractValueObjects(values.equipment_id);
      const maintenanceTeamId = extractValueObjects(values.maintenance_team_id);

      let slaDate = values.planned_sla_end_date ? values.planned_sla_end_date : false;
      let genOn = values.generated_on ? values.generated_on : false;
      if (checkDatehasObject(slaDate)) {
        slaDate = getDateTimeUtc(slaDate);
      }
      if (checkDatehasObject(genOn)) {
        genOn = getDateTimeUtc(genOn);
      }

      const postData = { ...values };

      delete postData.closed_on;

      postData.requested_by = raisedId;
      postData.planned_sla_end_date = slaDate;
      postData.generated_on = genOn;
      postData.category_id = categoryId;
      postData.severity = Severity;
      postData.sub_category_id = subCategoryId;
      postData.maintenance_team_id = maintenanceTeamId;
      postData.company_id = companyId;
      postData.space_id = spaceId;
      postData.equipment_id = equipmentId;
      const payload = { model: appModels.BMSALARMS, values: postData };
      dispatch(createTracker(appModels.BMSALARMS, payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    //dispatch(resetAddTrackerInfo());
    dispatch(resetUpdateTenant());
    dispatch(resetImage());
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const onLoadRequest = (eid, ename) => {
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      dispatch(getTrackerFilters(customFilters));
    }
    dispatch(resetAddTrackerInfo());
    dispatch(resetUpdateTenant());
    setTrackerRequest(true);
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  return (
    <Row className="drawer-list h-100 thin-scrollbar">
      <Col md="12" sm="12" lg="12" xs="12" className="raiseTicketForm-card">
        <div className="p-0 raiseTicket-card">
          <CardBody className="pl-0">
            <Formik
              enableReinitialize
              initialValues={editId && trackerDetails && trackerDetails.data ? trimJsonObject(trackerDetails.data[0]) : formInitialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                isValid, dirty, setFieldValue, setFieldTouched, resetForm, values, errors,
              }) => (
                <Form id={formId}>
                  <Box
                    sx={{
                      width: '100%',
                      padding: '20px 25px',
                      flexGrow: 1,
                    }}
                    className="createFormScrollbar"
                  >
                    <Row className="helpDesk-form mb-3">
                      <Col xs={12} sm={12} lg={12}>
                        <DescriptionForm editId={editId} formField={formField} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                      </Col>
                      {!isOpenSuccessAndErrorModalWindow && (
                      <Col xs={12} sm={12} lg={6}>
                        <RequestorForm formField={formField} addModal={addModal} setFieldValue={setFieldValue} reloadData={reload} editId={editId || false} setFieldTouched={setFieldTouched} />
                      </Col>
                      )}
                      <Col xs={12} sm={12} lg={6}>
                        <IncidentForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} />
                      </Col>
                    </Row>
                    {/* {(addTrackerInfo && addTrackerInfo.data) && (
                      <>
                        <SuccessAndErrorFormat response={addTrackerInfo} successMessage="BMS Alarm created successfully.." />
                        {!editId && trackerDetails && trackerDetails.data && (
                        <p className="text-center mt-2 mb-0 tab_nav_link">
                          Click here to view
                          {' '}
                          :
                          <span
                            aria-hidden="true"
                            className="ml-2 cursor-pointer text-info"
                            onClick={() => { onLoadRequest(trackerDetails.data[0].id, trackerDetails.data[0].name); dispatch(resetAddTrackerInfo()); }}
                          >
                            {trackerDetails.data[0].subject}
                          </span>
                          {' '}
                          details
                        </p>
                        )}
                      </>
                    )}                     */}
                    {(addTrackerInfo && !addTrackerInfo.data && !addTrackerInfo.loading)
                    && (tenantUpdateInfo && !tenantUpdateInfo.data && !tenantUpdateInfo.loading) && (
                      <div className="float-right sticky-button-85drawer">
                        <Button
                          disabled={!editId ? (!isValid || !dirty) : !isValid}
                          variant="contained"
                          type="button"
                          onClick={() => handleSubmit(values)}
                        >
                          {!editId ? 'Create' : 'Update'}
                        </Button>
                      </div>
                    )}
                    <SuccessAndErrorModalWindow
                      isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                      setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                      newId={trackerDetails && trackerDetails.data && trackerDetails.data.length > 0 ? trackerDetails.data[0].id : false}
                      newName={trackerDetails && trackerDetails.data && trackerDetails.data.length > 0 ? trackerDetails.data[0].subject : false}
                      type={editId ? 'update' : 'create'}
                      successOrErrorData={editId ? tenantUpdateInfo : addTrackerInfo}
                      headerImage={trackerBlackIcon}
                      headerText="BMS Alarm"
                      onLoadRequest={onLoadRequest}
                      successRedirect={handleReset.bind(null, resetForm)}
                    />
                  </Box>
                </Form>
              )}
            </Formik>
          </CardBody>
        </div>
      </Col>
    </Row>
  );
};

AddTracker.propTypes = {
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  addModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddTracker;
