/* eslint-disable no-alert */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  CardBody,
  Row, Col,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import PromptIfUnSaved from '@shared/unSavedPrompt';
import ticketIconBlack from '@images/icons/ticketBlack.svg';
import ticketIcon from '@images/icons/ticketBlue.svg';
import RequestorForm from '../helpdesk/forms/requestorForm';
import TicketForm from '../helpdesk/forms/ticketForm';
import AssetForm from '../helpdesk/forms/assetForm';
import SubjectForm from '../helpdesk/forms/subjectForm';
import IncidentForm from '../helpdesk/forms/incidentForm';
import DescriptionForm from '../helpdesk/forms/descriptionForm';
import ReviewTicket from '../helpdesk/reviewTicket';
import TicketSuccess from '../helpdesk/ticketSuccess';
import validationSchema from './validationSchema';
import checkoutFormModel from '../helpdesk/formModel/checkoutFormModel';
import formInitialValues from '../helpdesk/formModel/formInitialValues';
import ticketActionData from '../helpdesk/data/ticketsActions.json';
import {
  createTicket, resetImage, resetAddTicket, getHelpdeskFilter,
  resetUpdateTicket, updateTicket, activeStepInfo,
  getMaintenanceConfigurationData,
} from '../helpdesk/ticketService';
import {
  resetCreateTenant, updateTenant,
  resetUpdateTenant,
} from '../adminSetup/setupService';
import useStyles from '../helpdesk/styles';
import { last } from '../util/staticFunctions';
import {
  trimJsonObject, 
  extractValueObjects,
} from '../util/appUtils';
import AsyncFileUpload from '../commonComponents/asyncFileUpload';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

function renderStepContent(step, setFieldValue, reload, editId, type, isDrawer) {
  switch (step) {
    case 0:
      return (
        <Row className={!isDrawer ? 'ml-3 audits-list thin-scrollbar helpDesk-form' : 'helpDesk-form'}>
          <Col xs={12} sm={12} lg={12}><SubjectForm formField={formField} setFieldValue={setFieldValue} /></Col>
          <Col xs={12} sm={12} lg={3}><RequestorForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} /></Col>
          <Col xs={12} sm={12} lg={3}><AssetForm formField={formField} setFieldValue={setFieldValue} reloadSpace={reload} type={type} editId={editId} /></Col>
          <Col xs={12} sm={12} lg={3}><IncidentForm formField={formField} setFieldValue={setFieldValue} reloadSpace={reload} /></Col>
          <Col xs={12} sm={12} lg={3}><TicketForm formField={formField} setFieldValue={setFieldValue} reloadSpace={reload} type={type} /></Col>
          <Col xs={12} sm={12} lg={12}><DescriptionForm formField={formField} setFieldValue={setFieldValue} editId={editId} /></Col>
        </Row>
      );
    case 1:
      return <ReviewTicket setFieldValue={setFieldValue} isIncident={type} />;
    default:
      return <TicketSuccess />;
  }
}

const ReportIncident = (props) => {
  const {
    match, editIds, isDrawer, setEditLink, closeModal, afterReset,
  } = props;
  const { params } = match;
  const editId = params && params.editId ? params.editId : editIds;
  const dispatch = useDispatch();
  const history = useHistory();
  const subMenu = 3;
  const classes = useStyles();
  // const [activeStep, setActiveStep] = useState(0);
  // const [isRedirect, setRedirect] = useState(false);
  const [reload, setReload] = useState('1');
  // const [responseModal, showResponseModal] = useState(false);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  let steps = ['Requestor & Ticket Information', 'Summary'];
  if (editId) {
    steps = ['Requestor & Ticket Information'];
  }

  const { userInfo } = useSelector((state) => state.user);
  const {
    updateTicketInfo, addTicketInfo, ticketDetail, uploadPhoto, activeStep,
  } = useSelector((state) => state.ticket);
  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  const currentValidationSchema = validationSchema[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  useEffect(() => {
    dispatch(resetImage());
    dispatch(resetCreateTenant());
    dispatch(resetUpdateTicket());
    dispatch(activeStepInfo(0));
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getMaintenanceConfigurationData(userInfo.data.company.id, appModels.MAINTENANCECONFIG));
    }
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      // eslint-disable-next-line no-nested-ternary
      const companyId = userInfo.data.company ? userInfo.data.company : '';
      const partnerId = userInfo.data.partner_id && userInfo.data.partner_id !== '' ? { id: userInfo.data.partner_id, name: userInfo.data.name } : '';
      const mobileNo = userInfo.data.mobile ? userInfo.data.mobile : '';
      const emailId = userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : '';
      formInitialValues.company_id = companyId;
      formInitialValues.requestee_id = partnerId;
      formInitialValues.email = emailId;
      formInitialValues.mobile = mobileNo;
      formInitialValues.channel = ticketActionData.modes.find((data) => data.value === 'web');
      formInitialValues.issue_type = ticketActionData.issueTypes.find((data) => data.value === 'request');
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && !editId) {
      let companyId = '';
      companyId = userInfo.data.company ? userInfo.data.company : '';
      formInitialValues.company_id = companyId;
      const filterValues = {
        states: null, categories: null, priorities: null, customFilters: null,
      };
      dispatch(getHelpdeskFilter(filterValues));
    }
  }, [userInfo]);

  AsyncFileUpload(addTicketInfo, uploadPhoto);

  function updateRequestorInfo(id, email, mobile) {
    if (id && id !== -77) {
      const updateData = { email, mobile };
      dispatch(updateTenant(id, updateData, appModels.PARTNER));
      dispatch(resetUpdateTenant());
    }
  }

  function checkDataType(arr) {
    const value = last(arr);
    if (value && typeof value === 'string') {
      return arr[0];
    }
    if (value && typeof value === 'number') {
      return last(arr);
    }
    return false;
  }

  async function submitForm(values, actions) {
    if (editId) {
      updateDocuments();
      const postData = {
        mobile: values.mobile,
        email: values.email,
        requestee_id: values.requestee_id ? values.requestee_id.id : '',
        person_name: values.requestee_id ? values.requestee_id.name : '',
        priority_id: values.priority_id ? values.priority_id.id : '',
        category_id: values.category_id ? values.category_id.id : '',
        sub_category_id: values.sub_category_id ? values.sub_category_id.id : '',
        parent_id: values.parent_id ? values.parent_id.id : '',
        equipment_id: values.equipment_id ? values.equipment_id.id : '',
        maintenance_team_id: values.maintenance_team_id ? values.maintenance_team_id.id : '',
        channel: values.channel ? values.channel.value : false,
        asset_id: values.asset_id && values.asset_id.length > 0 ? checkDataType(values.asset_id) : false,
        subject: values.subject,
        description: values.description,
        type_category: values.type_category,
        incident_type_id: extractValueObjects(values.incident_type_id),
        incident_severity_id: extractValueObjects(values.incident_severity_id),
        // incident_state: extractValueObjects(values.incident_state),
      };
      setIsOpenSuccessAndErrorModalWindow(true);
      closeModal();
      const newReqId = values.requestee_id && values.requestee_id.id ? values.requestee_id.id : false;
      const oldReqId = values.requestee_id && values.requestee_id.length && values.requestee_id.length > 0 ? values.requestee_id[0] : false;
      updateRequestorInfo(oldReqId || newReqId, values.email, values.mobile);
      dispatch(updateTicket(editId, appModels.HELPDESK, postData));
      // showResponseModal(true);
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeModal();
      const asset = values.asset_id && values.asset_id.length > 0 ? last(values.asset_id) : false;
      const requesteeId = values.requestee_id && values.requestee_id.id && values.requestee_id.id !== -77 ? values.requestee_id.id : false;
      const personName = values.requestee_id && values.requestee_id.name && values.requestee_id.id !== -77 ? values.requestee_id.name : '';
      const priorityId = values.priority_id && values.priority_id.id ? values.priority_id.id : false;
      const category = values.category_id.id;
      const subcategory = values.sub_category_id.id;
      const equipment = values.equipment_id && values.equipment_id.id ? values.equipment_id.id : false;
      const channel = values.channel && values.channel.value ? values.channel.value : false;
      const company = values.company_id && values.company_id.id ? values.company_id.id : false;
      const maintenanceTeam = values.maintenance_team_id && values.maintenance_team_id.id ? values.maintenance_team_id.id : false;
      const issueType = 'incident';// values.issue_type && values.issue_type.value ? values.issue_type.value : false;
      const parentId = values.parent_id && values.parent_id.id ? values.parent_id.id : false;
      const raiseby = values.raise_by;
      const incidentTypeId = extractValueObjects(values.incident_type_id);
      const incidentSeverityId = extractValueObjects(values.incident_severity_id);
      // const incidentState = extractValueObjects(values.incident_state);

      let typeCategory = 'asset';

      if (equipment) {
        typeCategory = 'equipment';
      }

      updateRequestorInfo(requesteeId, values.email, values.mobile);

      const postData = { ...values };

      postData.requestee_id = requesteeId;
      postData.asset_id = asset;
      postData.category_id = category;
      postData.sub_category_id = subcategory;
      postData.equipment_id = equipment;
      postData.type_category = typeCategory;
      postData.channel = channel;
      postData.company_id = company;
      postData.priority_id = priorityId;
      postData.raise_by = raiseby;
      postData.maintenance_team_id = maintenanceTeam;
      postData.parent_id = parentId;
      postData.issue_type = issueType;
      postData.incident_type_id = incidentTypeId;
      postData.incident_severity_id = incidentSeverityId;
      postData.person_name = personName;
      postData.incident_state = 'Report';
      actions.setSubmitting(true);
      const payload = { model: appModels.HELPDESK, values: postData };
      const createReq = createTicket(payload);
      dispatch(createReq);
      // showResponseModal(true);
      actions.setSubmitting(false);
    }
  }

  function handleSubmit(values, actions) {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      dispatch(activeStepInfo(activeStep + 1));
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  const onCancel = () => {
    dispatch(resetAddTicket());
    dispatch(resetUpdateTicket());
    dispatch(resetImage());
    setActiveStep(0);
  };

  function handleBack() {
    dispatch(activeStepInfo(activeStep - 1));
    setReload('0');
  }

  /* const handleReset = () => {
    showResponseModal(false);
    if (!editId) {
      dispatch(resetTicketDetails());
      setRedirect(true);
    }
    dispatch(resetAddTicket());
    dispatch(resetUpdateTicket());
    dispatch(resetImage());
    setActiveStep(0);
    setEditLink(false);
  }; */

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    dispatch(resetAddTicket());
    dispatch(activeStepInfo(0));
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  /* if (isRedirect) {
    if (history && history.location && history.location.state && history.location.state.insights) {
      return (<Redirect to="/incident-overview" />);
    }
    return (<Redirect to="/incident/incidents" />);
  } */

  const saveBtnTxt = isLastStep ? 'Submit' : 'Next';

  const headingTxtAdd = isLastStep ? 'Summary' : 'Report a Incident Ticket';

  const subHeadingTextAdd = isLastStep ? 'Please check the information before submit' : 'Please enter the required information';

  const btnTxt = editId ? 'Update' : saveBtnTxt;

  const headingTxt = editId ? 'Update an Incident Ticket' : headingTxtAdd;

  const subHeadingText = editId ? 'Please check the information before update' : subHeadingTextAdd;

  const type = 'Incident';

  let rowStyle = 'ml-1 mr-1 mt-2 mb-2 p-3 border incident-Overview';
  if (isDrawer) {
    rowStyle = 'drawer-list h-100 thin-scrollbar';
  }

  return (
    <Row className={rowStyle}>
      <Col sm="12" md="12" lg="12" xs="12" className="raiseTicketForm-card">
        <div className="p-1 raiseTicket-card">
          <CardBody>
            <Formik
              enableReinitialize
              initialValues={editId && ticketDetail && ticketDetail.data ? trimJsonObject(ticketDetail.data[0]) : formInitialValues}
              validationSchema={currentValidationSchema}
              onSubmit={handleSubmit}
            >
              {({
                setFieldValue, resetForm, isValid, dirty,
              }) => (
                <Form id={formId}>
                  <PromptIfUnSaved />
                  {!isDrawer && (
                    <Row className="raiseTicketForm-header">
                      <Col md="4" sm="4" xs="12" lg="4">
                        <h4 className="mb-0">
                          <img src={ticketIconBlack} alt="ticket" className="w-auto height-28 ml-2 mr-2" />
                          {headingTxt}
                        </h4>
                        <p className="text-gray ml-5">
                          <span className="font-weight-300">{subHeadingText}</span>
                        </p>
                      </Col>
                      <Col md="8" sm="8" xs="12" lg="8">
                        <span className="text-right desktop-view">
                          <Button
                             variant="contained"
                            size="sm"
                            onClick={() => handleReset()}
                            className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white tab_nav_link rounded-pill float-right mb-1"
                          >
                            <span>Cancel</span>
                            <FontAwesomeIcon className="ml-2" size="sm" icon={faTimesCircle} />
                          </Button>
                        </span>
                      </Col>
                    </Row>
                  )}
                  {renderStepContent(activeStep, setFieldValue, reload, editId, type, isDrawer)}
                  {/*  <div className={`${classes.wrapper} float-right`}>
                    {activeStep !== 0 && (activeStep !== steps.length) ? (
                      <Button onClick={handleBack} color={activeStep !== steps.length ? 'back' : 'secondary'} className={classes.button}>
                        Back
                      </Button>
                    ) : (<span />)}
                    <div className="bg-lightblue sticky-button-1250drawer">
                      <Button
                      // disabled={!editId ? !(isValid && dirty) : !isValid}
                        type="submit"
                         variant="contained"
                        className={classes.button}
                      >
                        {btnTxt}
                      </Button>
                    </div>
                    </div> */}
                  <div className={`${classes.wrapper} float-right`}>
                    {!isDrawer && activeStep !== 0 && (activeStep !== steps.length) ? (
                      <Button variant="contained" onClick={handleBack} color={activeStep !== steps.length ? 'back' : 'secondary'} className={classes.button}>
                        Back
                      </Button>
                    ) : (<span />)}
                    {!isDrawer && (
                      <Button
                        disabled={!editId ? !(isValid && dirty) : !isValid}
                        type="submit"
                         variant="contained"
                        className={classes.button}
                      >
                        {btnTxt}
                      </Button>
                    )}
                    {isDrawer && (
                      <div className="bg-lightblue pt-0 sticky-button-1250drawer">
                        {isDrawer && activeStep !== 0 && (activeStep !== steps.length) ? (
                          <Button variant="contained" onClick={handleBack} color={activeStep !== steps.length ? 'back' : 'secondary'} className={classes.button}>
                            Back
                          </Button>
                        ) : (<span />)}
                        <Button
                          disabled={!editId ? !(isValid && dirty) : !isValid}
                          type="submit"
                           variant="contained"
                          className={classes.button}
                        >
                          {btnTxt}
                        </Button>
                      </div>
                    )}
                  </div>
                  {/*   <Modal size="sm" className="border-radius-50px lookupModal" isOpen={responseModal}>
                    <ModalHeader className="modal-ticket-header">
                      <Row>
                        <Col sm="12" md="12" lg="12" xs="12">
                          {((addTicketInfo && addTicketInfo.data) || (updateTicketInfo && updateTicketInfo.data)) && (
                            <img
                              aria-hidden="true"
                              className="ml-2 mt-0 tab_nav_link cursor-pointer float-right"
                              onClick={() => handleReset()}
                              alt="close"
                              width="15"
                              height="15"
                              src={closeCirclegreyIcon}
                            />
                          )}
                          {((addTicketInfo && addTicketInfo.err) || (createTenantinfo && createTenantinfo.err) || (updateTicketInfo && updateTicketInfo.err)) && (
                            <img
                              aria-hidden="true"
                              className="ml-2 mt-0 tab_nav_link cursor-pointer float-right"
                              onClick={() => { onCancel(); showResponseModal(false); }}
                              alt="close"
                              width="15"
                              height="15"
                              src={closeCirclegreyIcon}
                            />
                          )}
                          <Row>
                            <Col sm="2" md="2" lg="2" xs="3" className="mt-2 text-right">
                              <img src={ticketIconBlack} alt="ticket" width="20" />
                            </Col>
                            <Col sm="10" md="10" lg="10" xs="9" className="mt-2 p-0">
                              <h6 className="ml-1 font-weight-800 font-medium mb-0">
                                {!editId ? 'Report a Incident' : 'Update a Incident Ticket'}
                              </h6>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </ModalHeader>
                    <ModalBody className="text-center">
                      <TicketSuccess isIncident />
                      <hr className="m-0" />
                    </ModalBody>
                    <div className="text-center p-3">
                      {((addTicketInfo && addTicketInfo.data) || (updateTicketInfo && updateTicketInfo.data)) && (
                        <Button
                          size="sm"
                          type="button"
                           variant="contained"
                          onClick={() => handleReset()}
                          disabled={addTicketInfo && addTicketInfo.loading}
                        >
                          OK
                        </Button>
                      )}
                      {((addTicketInfo && addTicketInfo.err) || (createTenantinfo && createTenantinfo.err) || (updateTicketInfo && updateTicketInfo.err)) && (
                        <Button
                          size="sm"
                          type="button"
                           variant="contained"
                          onClick={() => { onCancel(); showResponseModal(false); }}
                          disabled={addTicketInfo && addTicketInfo.loading}
                        >
                          OK
                        </Button>
                      )}
                    </div>
                      </Modal> */}
                  <SuccessAndErrorModalWindow
                    isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                    setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                    type={editId ? 'update' : 'create'}
                    successOrErrorData={editId ? updateTicketInfo : addTicketInfo}
                    headerImage={ticketIcon}
                    headerText="Incident"
                    successRedirect={handleReset.bind(null, resetForm)}
                  />
                </Form>
              )}
            </Formik>
          </CardBody>
        </div>
      </Col>
    </Row>
  );
};

ReportIncident.defaultProps = {
  match: false,
  editIds: false,
  isDrawer: false,
};

ReportIncident.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  editIds: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  isDrawer: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  setEditLink: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
};

export default ReportIncident;
