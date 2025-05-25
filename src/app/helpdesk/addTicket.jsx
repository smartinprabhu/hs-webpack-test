/* eslint-disable max-len */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-cycle */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Button, CardBody,
  Row, Col,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
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
import RequestorForm from './forms/requestorForm';
import TicketForm from './forms/ticketForm';
import AssetForm from './forms/assetForm';
import SubjectForm from './forms/subjectForm';
import DescriptionForm from './forms/descriptionForm';
import ReviewTicket from './reviewTicket';
import TicketSuccess from './ticketSuccess';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import Navbar from './navbar/navbar';
import ticketActionData from './data/ticketsActions.json';
import {
  createTicket, resetImage, resetAddTicket, getMaintenanceConfigurationData,
  resetUpdateTicket, onDocumentCreatesAttach, updateTicket, activeStepInfo,
} from './ticketService';
import {
  resetCreateTenant, updateTenant,
  resetUpdateTenant,
} from '../adminSetup/setupService';
import useStyles from './styles';
import { last } from '../util/staticFunctions';
import {
  trimJsonObject, prepareDocuments,
  extractValueObjects,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

function renderStepContent(step, setFieldValue, reload, editId, equipment, isDrawer, isFITTracker, isIncident) {
  switch (step) {
    case 0:
      return (
        <Row className={!isDrawer ? 'ml-3 audits-list thin-scrollbar helpDesk-form' : 'helpDesk-form'}>
          <Col xs={12} sm={12} lg={12}><SubjectForm formField={formField} setFieldValue={setFieldValue} /></Col>
          <Col xs={12} sm={12} lg={4}><RequestorForm isIncident={isIncident} isFITTracker={isFITTracker} formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} /></Col>
          <Col xs={12} sm={12} lg={4}><AssetForm isIncident={isIncident} formField={formField} setFieldValue={setFieldValue} reloadSpace={reload} editId={editId} equipment={equipment} /></Col>
          <Col xs={12} sm={12} lg={4}><TicketForm isFITTracker={isFITTracker} formField={formField} setFieldValue={setFieldValue} editId={editId} reloadSpace={reload} /></Col>
          <Col xs={12} sm={12} lg={12}><DescriptionForm formField={formField} setFieldValue={setFieldValue} editId={editId} /></Col>
        </Row>
      );
    case 1:
      return <ReviewTicket isFITTracker={isFITTracker} isIncident={isIncident} setFieldValue={setFieldValue} />;
    default:
      return <TicketSuccess />;
  }
}

const AddTicket = (props) => {
  const {
    match, isModal, editLink, isDrawer, equipmentsDetails, editIds, closeModal, afterReset,
    isFITTracker, isIncident,
  } = props;
  const { params } = match;
  const editId = params && params.editId ? params.editId : editIds;
  const dispatch = useDispatch();
  const subMenu = 'Raise a Ticket';
  const classes = useStyles();
  const [reload, setReload] = useState('1');
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  let steps = ['Requestor & Ticket Information', 'Summary'];
  if (editId) {
    steps = ['Requestor & Ticket Information'];
  }

  const { userInfo } = useSelector((state) => state.user);
  const {
    updateTicketInfo, addTicketInfo, ticketDetail, uploadPhoto, activeStep,
  } = useSelector((state) => state.ticket);

  const { companyDetail } = useSelector((state) => state.setup);

  const isAll = !!(window.localStorage.getItem('isAllCompany') && window.localStorage.getItem('isAllCompany') === 'yes');

  const sitePartnerId = companyDetail && companyDetail.data && companyDetail.data.length && companyDetail.data[0].partner_id && companyDetail.data[0].partner_id.length ? companyDetail.data[0].partner_id[0] : false;

  const currentValidationSchema = validationSchema[activeStep];
  const isLastStep = activeStep === steps.length - 1;
  useEffect(() => {
    dispatch(resetImage());
    dispatch(resetCreateTenant());
    dispatch(resetUpdateTicket());
    dispatch(activeStepInfo(activeStep));
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getMaintenanceConfigurationData(userInfo.data.company.id, appModels.MAINTENANCECONFIG));
    }
  }, []);

  function updateDocuments(id) {
    if (uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0 && id) {
      const dcreate = prepareDocuments(uploadPhoto, id);
      dispatch(onDocumentCreatesAttach(dcreate));
    }
  }

  useEffect(() => {
    if (addTicketInfo && addTicketInfo.data && addTicketInfo.data.length > 0) {
      if (uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0) {
        updateDocuments(addTicketInfo.data[0]);
        dispatch(resetImage());
      }
    }
  }, [addTicketInfo]);

  // eslint-disable-next-line no-nested-ternary
  const userCompaniesList = userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];
  const userCompanies = isAll && userInfo && userInfo.data && userInfo.data.is_parent ? userCompaniesList.filter((item) => item.id !== userInfo.data.company.id) : userCompaniesList;

  function getCompanySetId() {
    let res = '';
    if (isAll && userInfo && userInfo.data && userInfo.data.is_parent) {
      res = '';// userCompanies && userCompanies.length ? userCompanies[0] : {};
    } else {
      res = userInfo.data.company ? userInfo.data.company : '';
    }
    return res;
  }

  useEffect(() => {
    if (userInfo && userInfo.data) {
      // eslint-disable-next-line no-nested-ternary
      const companyId = getCompanySetId();
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

  // useEffect(() => {
  //   if (userInfo && userInfo.data && !editId) {
  //     let companyId = '';
  //     companyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
  //     formInitialValues.company_id = companyId;
  //     const filterValues = {
  //       states: null, categories: null, priorities: null, customFilters: null,
  //     };
  //     dispatch(getHelpdeskFilter(filterValues));
  //   }
  // }, [userInfo]);

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
    let Cost = values.cost && values.cost !== '' ? values.cost : '';
    Cost = Cost.toString().replace(/\,/g, '');
    Cost = parseInt(Cost, 10);
    if (editId) {
      const postData = {
        mobile: values.mobile,
        email: values.email,
        tenant_name: values.tenant_name,
        requestee_id: values.requestee_id ? values.requestee_id.id : '',
        person_name: values.requestee_id ? values.requestee_id.name : '',
        priority_id: values.priority_id ? values.priority_id.id : '',
        category_id: values.category_id ? values.category_id.id : '',
        vendor_id: values.vendor_id ? values.vendor_id.id : '',
        sub_category_id: values.sub_category_id ? values.sub_category_id.id : '',
        parent_id: values.parent_id ? values.parent_id.id : '',
        equipment_id: values.equipment_id ? values.equipment_id.id : '',
        maintenance_team_id: values.maintenance_team_id ? values.maintenance_team_id.id : '',
        channel: values.channel ? values.channel.value : false,
        issue_type: values.issue_type ? values.issue_type.value : false,
        asset_id: values.asset_id && values.asset_id.length > 0 ? checkDataType(values.asset_id) : false,
        subject: values.subject,
        description: values.description,
        type_category: values.type_category,
        constraints: values.constraints,
        cost: Cost,
        ticket_type: extractValueObjects(values.ticket_type),
      };
      setIsOpenSuccessAndErrorModalWindow(true);
      closeModal();
      const newReqId = values.requestee_id && values.requestee_id.id ? values.requestee_id.id : false;
      const oldReqId = values.requestee_id && values.requestee_id.length && values.requestee_id.length > 0 ? values.requestee_id[0] : false;
      updateRequestorInfo(oldReqId || newReqId, values.email, values.mobile);
      dispatch(updateTicket(editId, appModels.HELPDESK, postData));
      // showResponseModal(true);
    } else {
      // updateDocuments(editId);
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
      const issueType = values.issue_type && values.issue_type.value ? values.issue_type.value : false;
      const parentId = values.parent_id && values.parent_id.id ? values.parent_id.id : false;
      const raiseby = values.raise_by;
      const Constraints = values.constraints;
      const customType = values.type_category === 'IT' ? 'IT' : false;
      const vendorId = values.vendor_id && values.vendor_id.id ? values.vendor_id.id : false;
      const ticketType = extractValueObjects(values.ticket_type);

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
      postData.custom_type = customType;
      postData.channel = channel;
      postData.company_id = company;
      postData.priority_id = priorityId;
      postData.raise_by = raiseby;
      postData.constraints = Constraints;
      postData.cost = Cost;
      postData.maintenance_team_id = maintenanceTeam;
      postData.parent_id = parentId;
      postData.issue_type = issueType;
      postData.person_name = personName;
      postData.vendor_id = vendorId;
      postData.ticket_type = ticketType;

      if (isAll && sitePartnerId) {
        postData.partner_id = sitePartnerId;
      }
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
  /* const onCancel = () => {
    dispatch(resetAddTicket());
    dispatch(resetUpdateTicket());
    dispatch(resetImage());
  };

  const onLoadTickets = () => {
    window.location.href = '/helpdesk/tickets';
  }; */

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

  /* if (isRedirect && !isModal) {
    if (history && history.location && history.location.state && history.location.state.insights) {
      return (<Redirect to="/helpdesk-overview" />);
    }
    return (<Redirect to="/helpdesk/tickets" />);
  } */

  const saveBtnTxt = isLastStep ? 'Submit' : 'Next';

  const headingTxtAdd = isLastStep ? 'Summary' : 'Raise a Ticket';

  const subHeadingTextAdd = isLastStep ? 'Please check the information before submit' : 'Please enter the required information';

  const btnTxt = editId ? 'Update' : saveBtnTxt;

  const headingTxt = editId ? 'Update a Ticket' : headingTxtAdd;

  const subHeadingText = editId ? 'Please check the information before update' : subHeadingTextAdd;

  /* const controlResult = (
    <div />
  );

  /*  if (addTicketInfo && addTicketInfo.data) {
    controlResult = (
      <Button
        size="sm"
        type="button"
         variant="contained"
        onClick={() => { onLoadTickets(); handleReset(); }}
        disabled={addTicketInfo && addTicketInfo.loading}
      >
        OK
      </Button>
    );
  } else if (updateTicketInfo && updateTicketInfo.data) {
    controlResult = (
      <Button
        size="sm"
        type="button"
         variant="contained"
        onClick={() => handleReset()}
        disabled={addTicketInfo && addTicketInfo.loading}
      >
        OK
      </Button>
    );
  } else if (addTicketInfo && addTicketInfo.err) {
    controlResult = (
      <Button
        size="sm"
        type="button"
         variant="contained"
        onClick={() => { onCancel(); showResponseModal(false); }}
        disabled={addTicketInfo && addTicketInfo.loading}
      >
        OK
      </Button>
    );
  } else if (updateTicketInfo && updateTicketInfo.err) {
    controlResult = (
      <Button
        size="sm"
        type="button"
         variant="contained"
        onClick={() => { onCancel(); showResponseModal(false); }}
        disabled={addTicketInfo && addTicketInfo.loading}
      >
        OK
      </Button>
    );
  } */
  let rowStyle = 'ml-1 mr-1 mt-2 mb-2 p-3 border helpdeskOverview';

  if (isDrawer) {
    rowStyle = 'drawer-list h-100 thin-scrollbar';
  } else if (isModal) {
    rowStyle = '';
  }

  return (
    <Row className={rowStyle}>
      <Col sm="12" md="12" lg="12" xs="12" className="raiseTicketForm-card">
        <div className="p-0 raiseTicket-card">
          <CardBody className="pl-0">
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
                  <Row className="raiseTicketForm-header">
                    {!isModal && !isDrawer && (
                      <Col md="4" sm="4" xs="12" lg="4">
                        <h4 className="mb-0">
                          <img src={ticketIconBlack} alt="ticket" className="w-auto height-28 ml-2 mr-2" />
                          {headingTxt}
                        </h4>
                        <p className="text-gray ml-5">
                          <span className="font-weight-300">{subHeadingText}</span>
                        </p>
                      </Col>
                    )}
                    <Col md="8" sm="8" xs="12" lg="8">
                      {!isModal && !isDrawer && (
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
                      )}
                    </Col>
                  </Row>
                  {editLink && updateTicketInfo && !updateTicketInfo.data && (
                    renderStepContent(activeStep, setFieldValue, reload, editId, equipmentsDetails, isDrawer, isFITTracker, isIncident)
                  )}
                  <div className={`${classes.wrapper} float-right`}>
                    {!isDrawer && activeStep !== 0 && (activeStep !== steps.length) ? (
                      <Button onClick={handleBack} color={activeStep !== steps.length ? 'back' : 'secondary'} className={classes.button}>
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
                          <Button onClick={handleBack} color={activeStep !== steps.length ? 'back' : 'secondary'} className={classes.button}>
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
                  {/*  <Modal size="sm" className="border-radius-50px lookupModal" isOpen={responseModal}>
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
                          {((addTicketInfo && addTicketInfo.err) || (updateTicketInfo && updateTicketInfo.err)) && (
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
                                {!editId ? 'Raise a Ticket' : 'Update a Ticket'}
                              </h6>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </ModalHeader>
                    <ModalBody className="text-center">
                      <TicketSuccess />
                      <hr className="m-0" />
                    </ModalBody>
                    <div className="text-center p-3">
                      {((addTicketInfo && addTicketInfo.data) || (updateTicketInfo && updateTicketInfo.data) || (addTicketInfo && addTicketInfo.err) || (updateTicketInfo && updateTicketInfo.err)) && (
                        controlResult
                      )}
                    </div>
                      </Modal> */}
                  <SuccessAndErrorModalWindow
                    isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                    setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                    type={editId ? 'update' : 'create'}
                    successOrErrorData={editId ? updateTicketInfo : addTicketInfo}
                    headerImage={ticketIcon}
                    headerText="Ticket"
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

AddTicket.defaultProps = {
  match: false,
  isModal: false,
  equipmentsDetails: false,
  isDrawer: false,
  editIds: false,
};

AddTicket.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  equipmentsDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  isModal: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  isDrawer: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  editIds: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  afterReset: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default AddTicket;
