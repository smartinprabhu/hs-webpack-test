/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Button, Row,
  CardBody,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import { Redirect } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
// import trackerBlackIcon from '@images/icons/complianceBlack.svg';

import trackerBlackIcon from '@images/icons/breakTrackerBlue.svg';

// import BasicForm from './forms/basicForm';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createTracker, getTrackerList, getTrackerCount, getTrackerDetail, resetAddTrackerInfo, getTrackerFilters,
} from './breakdownService';
import {
  updateTenant, resetUpdateTenant,
} from '../adminSetup/setupService';
import {
  trimJsonObject, extractValueObjects,
  getAllCompanies, getDateTimeUtc, prepareDocuments, getColumnArrayById, isArrayColumnExists,
} from '../util/appUtils';
import { last } from '../util/staticFunctions';
import {
  resetImage, onDocumentCreatesAttach,
} from '../helpdesk/ticketService';
import RequestorForm from './forms/requestorForm';
import IncidentForm from './forms/incidentForm';
import VendorForm from './forms/vendorForm';
import ResolutionForm from './forms/resolutionForm';
import ImageForm from './forms/images';
// import AssetForm from './forms/assetForm';
import DescriptionForm from './forms/descriptionForm';
import RemarksForm from './forms/remarksForm';
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
  const { addTrackerInfo, trackerDetails } = useSelector((state) => state.breakdowntracker);
  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  /* useEffect(() => {
    if ((userInfo && userInfo.data) && (addTrackerInfo && addTrackerInfo.data)) {
      const statusValues = [];
      const categoryValues = [];
      const appValues = [];
      const customFilters = '';
      dispatch(getTrackerList(companies, appModels.BREAKDOWNTRACKER, limit, offsetValue, statusValues, categoryValues, appValues, customFilters, sortByValue, sortFieldValue));
      dispatch(getTrackerCount(companies, appModels.BREAKDOWNTRACKER, statusValues, categoryValues, appValues, customFilters));
    }
  }, [userInfo, addTrackerInfo]); */

  useEffect(() => {
    if (addTrackerInfo && addTrackerInfo.data && addTrackerInfo.data.length) {
      dispatch(getTrackerDetail(addTrackerInfo.data[0], appModels.BREAKDOWNTRACKER));
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

  useEffect(() => {
    if (addTrackerInfo && addTrackerInfo.data && addTrackerInfo.data.length > 0) {
      if (uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0) {
        updateDocuments(addTrackerInfo.data[0]);
        dispatch(resetImage());
      }
    }
  }, [addTrackerInfo]);

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
      closeModal();
      let attendedDate = values.attended_on ? values.attended_on : false;
      // let closedDate = values.closed_on ? values.closed_on : false;
      let incidentDate = values.incident_date ? values.incident_date : false;
      let expectedClosureDate = values.expexted_closure_date ? values.expexted_closure_date : false;
      if (checkDatehasObject(attendedDate)) {
        attendedDate = getDateTimeUtc(attendedDate);
      }
      /* if (checkDatehasObject(closedDate)) {
        closedDate = getDateTimeUtc(closedDate);
      } */
      if (checkDatehasObject(incidentDate)) {
        incidentDate = getDateTimeUtc(incidentDate);
      }
      if (checkDatehasObject(expectedClosureDate)) {
        expectedClosureDate = getDateTimeUtc(expectedClosureDate);
      }

      const postData = {
        raised_by_id: values.raised_by_id ? extractValueObjects(values.raised_by_id) : '',
        // incident_date: values.incident_date ? values.incident_date : '',
        title: values.title ? values.title : '',
        service_category_id: values.service_category_id ? extractValueObjects(values.service_category_id) : '',
        description_of_breakdown: values.description_of_breakdown ? values.description_of_breakdown : '',
        is_results_in_statutory_non_compliance: values.is_results_in_statutory_non_compliance ? values.is_results_in_statutory_non_compliance : false,
        is_breakdown_due_to_ageing: values.is_breakdown_due_to_ageing ? values.is_breakdown_due_to_ageing : false,
        is_service_impacted: values.is_service_impacted ? values.is_service_impacted : false,
        incident_age: values.incident_age ? values.incident_age : '',
        action_taken: values.action_taken ? values.action_taken : '',
        remarks: values.remarks ? values.remarks : '',
        company_id: values.company_id ? extractValueObjects(values.company_id) : '',
        type: values.type ? values.type : '',
        space_id: values.space_id ? extractValueObjects(values.space_id) : '',
        equipment_id: values.equipment_id ? extractValueObjects(values.equipment_id) : '',
        amc_status: values.amc_status ? extractValueObjects(values.amc_status) : '',
        vendor_name: values.vendor_name ? values.vendor_name : '',
        complaint_no: values.complaint_no ? values.complaint_no : '',
        vendor_sr_number: values.vendor_sr_number ? values.vendor_sr_number : '',
        attended_on: attendedDate,
        // closed_on: closedDate,
        // raised_on: raisedDate,
        incident_date: incidentDate,
        expexted_closure_date: expectedClosureDate,
        services_impacted_ids: values.services_impacted_ids && values.services_impacted_ids.length && values.services_impacted_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.services_impacted_ids, 'id')]] : [[6, 0, []]],
      };
      /* if (isArrayColumnExists(values.services_impacted_ids ? values.services_impacted_ids : [], 'id')) {
        let selectedServiceData = getColumnArrayById(values.services_impacted_ids, 'id');
        const appendSelected = extractValueObjects(values.services_impacted_ids);
        const isServiceExists = selectedServiceData.filter((item) => item === appendSelected);
        if (isServiceExists && !isServiceExists.length) {
          selectedServiceData = [...selectedServiceData];
        }
        postData.services_impacted_ids = [[6, false, selectedServiceData]];
      } */
      if (!getRequiredMessage(postData)) {
        setDateError(false);
        dispatch(updateTenant(editId, postData, appModels.BREAKDOWNTRACKER));
      } else {
        setDateError(getRequiredMessage(postData));
      }
    } else {
      // updateDocuments();
      setIsOpenSuccessAndErrorModalWindow(true);
      closeModal();
      const serviceImpacted = values.services_impacted_ids && values.services_impacted_ids.length && values.services_impacted_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.services_impacted_ids, 'id')]] : [[6, 0, []]];

      const raisedId = values.raised_by_id ? extractValueObjects(values.raised_by_id) : '';
      const serviceCategoryId = extractValueObjects(values.service_category_id);
      const Description = values.description_of_breakdown;
      const ResultSantory = values.is_results_in_statutory_non_compliance ? values.is_results_in_statutory_non_compliance : false;
      const BreakdownDueToAgeing = values.is_breakdown_due_to_ageing ? values.is_breakdown_due_to_ageing : false;
      const serviceCategory = values.is_service_impacted ? values.is_service_impacted : false;
      const incidentAge = values.incident_age;
      const actionTaken = values.action_taken;
      const remark = values.remarks;
      const companyId = values.company_id ? extractValueObjects(values.company_id) : '';
      const types = values.type;
      const spaceId = extractValueObjects(last(values.space_id));
      const equipmentId = extractValueObjects(values.equipment_id);
      const amcStatus = extractValueObjects(values.amc_status);
      const vendorName = values.vendor_name;
      const complaint = values.complaint_no;
      const vendorSrName = values.vendor_sr_number;

      let attendedDate = values.attended_on ? values.attended_on : false;
      // let closedDate = values.closed_on ? values.closed_on : false;
      let incidentDate = values.incident_date ? values.incident_date : false;
      let expectedClosureDate = values.expexted_closure_date ? values.expexted_closure_date : false;
      if (checkDatehasObject(attendedDate)) {
        attendedDate = getDateTimeUtc(attendedDate);
      }
      /* if (checkDatehasObject(closedDate)) {
        closedDate = getDateTimeUtc(closedDate);
      } */
      if (checkDatehasObject(incidentDate)) {
        incidentDate = getDateTimeUtc(incidentDate);
      }
      if (checkDatehasObject(expectedClosureDate)) {
        expectedClosureDate = getDateTimeUtc(expectedClosureDate);
      }

      const postData = { ...values };

      delete postData.closed_on;

      postData.raised_by_id = raisedId;
      postData.raised_on = getDateTimeUtc(new Date());
      postData.incident_date = incidentDate;
      postData.expexted_closure_date = expectedClosureDate;
      postData.service_category_id = serviceCategoryId;
      postData.description_of_breakdown = Description;
      postData.is_results_in_statutory_non_compliance = ResultSantory;
      postData.is_breakdown_due_to_ageing = BreakdownDueToAgeing;
      postData.is_service_impacted = serviceCategory;
      postData.services_impacted_ids = serviceImpacted;
      // postData.incident_age = incidentAge;
      postData.attended_on = attendedDate;
      postData.action_taken = actionTaken;
      // postData.closed_on = closedDate;
      postData.remarks = remark;
      postData.company_id = companyId;
      postData.type = types;
      postData.space_id = spaceId;
      postData.equipment_id = equipmentId;
      postData.amc_status = amcStatus;
      postData.vendor_name = vendorName;
      postData.complaint_no = complaint;
      postData.vendor_sr_number = vendorSrName;
      const payload = { model: appModels.BREAKDOWNTRACKER, values: postData };
      dispatch(createTracker(appModels.BREAKDOWNTRACKER, payload));
      /* if (!getRequiredMessage(postData)) {
        setDateError(false);
        dispatch(createTracker(appModels.BREAKDOWNTRACKER, payload));
      } else {
        setDateError(getRequiredMessage(postData));
      } */
    }
  }

  /* const closeAddMaintenance = () => {
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
  }; */

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    dispatch(resetAddTrackerInfo());
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
        key: 'name',
        value: ename,
        label: 'Reference',
        type: 'id',
      }];
      dispatch(getTrackerFilters(customFilters));
    }
    setTrackerRequest(true);
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  if (trackerRequest) {
    return (<Redirect to="/breakdown-tracker" />);
  }

  const getVendorNameValidation = (values) => {
    if (values && values.amc_status && (values.amc_status.value === 'Valid' || values.amc_status === 'Valid')) {
      if (values.vendor_name && values.vendor_name.length) {
        return false;
      }
      return true;
    }
    return false;
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
                  {!isShow || (addTrackerInfo && addTrackerInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.loading) ? ('') : (

                    <Row className="helpDesk-form">
                      {/* <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} reload={reload} setFieldTouched={setFieldTouched} /> */}
                      <Col xs={12} sm={12} lg={12}>
                        <DescriptionForm formField={formField} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                      </Col>
                      {!isOpenSuccessAndErrorModalWindow && (
                      <Col xs={12} sm={12} lg={3}>
                        <RequestorForm formField={formField} addModal={addModal} setFieldValue={setFieldValue} reloadData={reload} editId={editId || false} setFieldTouched={setFieldTouched} />
                      </Col>
                      )}
                      <Col xs={12} sm={12} lg={3}>
                        <IncidentForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} />
                      </Col>
                      <Col xs={12} sm={12} lg={3}>
                        <ResolutionForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} />
                      </Col>
                      <Col xs={12} sm={12} lg={3}>
                        <VendorForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} />
                      </Col>
                      {!editId && (
                        <Col xs={12} sm={12} lg={4}>
                          <ImageForm formField={formField} addModal={addModal} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} />
                        </Col>

                      )}
                      <Col xs={12} sm={12} lg={editId ? 12 : 8}>
                        <RemarksForm formField={formField} setFieldValue={setFieldValue} />
                      </Col>
                      {/* <Col xs={12} sm={12} lg={3}>
                      <AssetForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} />
                    </Col> */}
                    </Row>
                  )}
                  {/* {dateError && (
                <>
                  <div className="text-danger text-center mt-3">
                    <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                    {dateError}
                  </div>
                </>
              )}
              {(addTrackerInfo && addTrackerInfo.err) && (
                <SuccessAndErrorFormat response={addTrackerInfo} />
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.err) && (
                <SuccessAndErrorFormat response={tenantUpdateInfo} />
              )}
               <>
                {((addTrackerInfo && addTrackerInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data)) && (
                <SuccessAndErrorFormat
                  response={addTrackerInfo.data ? addTrackerInfo : tenantUpdateInfo}
                  successMessage={addTrackerInfo.data ? 'Breakdown Tracker added successfully..' : 'Breakdown Tracker details are updated successfully..'}
                />
                )}
                <div className="float-right">
                  {((addTrackerInfo && addTrackerInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data)) && (
                  <Button
                     variant="contained"
                    size="sm"
                    onClick={closeModal}
                  >
                    Ok
                  </Button>
                  )}
                </div>
                  </> */}
                  {(addTrackerInfo && addTrackerInfo.data) && (
                    <>
                      <SuccessAndErrorFormat response={addTrackerInfo} successMessage="Breakdown Tracker added successfully.." />
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
                            {trackerDetails.data[0].name}
                          </span>
                          {' '}
                          details
                        </p>
                      )}
                    </>
                  )}
                  {(addTrackerInfo && !addTrackerInfo.data && !addTrackerInfo.loading)
                    && (tenantUpdateInfo && !tenantUpdateInfo.data && !tenantUpdateInfo.loading) && (
                      <>
                        <hr />
                        <div className="bg-lightblue sticky-button-1250drawer">
                          <Button
                            disabled={!editId ? (!isValid || !dirty || getVendorNameValidation(values)) : getVendorNameValidation(values) || !isValid}
                            type="submit"
                            size="sm"
                             variant="contained"
                          >
                            {!editId ? 'Create' : 'Update'}
                          </Button>
                        </div>
                      </>
                  )}
                  <SuccessAndErrorModalWindow
                    isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                    setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                    newId={trackerDetails && trackerDetails.data && trackerDetails.data.length > 0 ? trackerDetails.data[0].id : false}
                    newName={trackerDetails && trackerDetails.data && trackerDetails.data.length > 0 ? trackerDetails.data[0].name : false}
                    type={editId ? 'update' : 'create'}
                    successOrErrorData={editId ? tenantUpdateInfo : addTrackerInfo}
                    headerImage={trackerBlackIcon}
                    headerText="Breakdown Tracker"
                    onLoadRequest={onLoadRequest}
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
