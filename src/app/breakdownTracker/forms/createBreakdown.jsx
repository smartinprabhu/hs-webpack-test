/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Button, Fade, FormControl, Dialog,
} from '@mui/material';
import { Box } from '@mui/system';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment-timezone';
import Alert from '@mui/material/Alert';

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
// import trackerBlackIcon from '@images/icons/complianceBlack.svg';

import trackerBlackIcon from '@images/icons/breakTrackerBlue.svg';

// import BasicForm from './forms/basicForm';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  resetUpdateTenant,
  updateTenant,
} from '../../adminSetup/setupService';
import {
  resetImage,
} from '../../helpdesk/ticketService';
import {
  extractValueObjects,
  getAllowedCompanies,
  getColumnArrayById,
  getDateTimeUtcMuI,
  isArrayColumnExists,
  trimJsonObject,
  extractValueObjectsDisplay,
  getDateLocalMuI,
  getArrayNewFormat,
  getCompanyTimezoneDate,
} from '../../util/appUtils';
import { last } from '../../util/staticFunctions';
import {
  createTracker,
  getTrackerDetail,
  getTrackerFilters,
  resetAddTrackerInfo,
} from '../breakdownService';
import checkoutFormModel from '../formModel/checkoutFormModel';
import formInitialValues from '../formModel/formInitialValues';
import validationSchema from '../formModel/validationSchema';
import IncidentForm from './trackerIncidentForm';
import RequestorForm from './trackerRequestorForm';
import ResolutionForm from './trackerResolutionForm';
import VendorForm from './trackerVendorForm';
import UploadDocuments from '../../commonComponents/uploadDocuments';
import AsyncFileUpload from '../../commonComponents/asyncFileUpload';
import { createCancelReq } from '../../preventiveMaintenance/ppmService';

// import ImageForm from './trackerImages';
// // import AssetForm from './forms/assetForm';
import {
  getRequiredMessage,
} from '../utils/utils';
import DescriptionForm from './trackerDescriptionForm';
import RemarksForm from './trackerRemarksForm';
import RelatedSchedules from '../../inspectionSchedule/viewer/relatedSchedules';
import RelatedPPMSchedules from '../../inspectionSchedule/viewer/relatedPPMSchedules';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddTracker = (props) => {
  const {
    editId, closeModal, afterReset,
    addModal,
  } = props;
  const dispatch = useDispatch();
  const [reload] = useState('1');
  const [dateError, setDateError] = useState(false);
  const [closureDate, setClosureDate] = useState(false);
  const [incidentDates, setIncidentDate] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [parentSchedules, setParentSchedules] = useState([]);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const [checkedPPMRows, setCheckPPMRows] = useState([]);
  const [ppmSchedules, setPPMSchedules] = useState([]);

  const [showRelatedSchedules, setShowRelatedSchedules] = useState(false);
  const [showRelatedPPMSchedules, setShowRelatedPPMSchedules] = useState(false);
  const [typeSelected, setType] = React.useState('all');

  const [trackerRequest, setTrackerRequest] = useState(false);
  const [incidentDateEdit, setIncidentDateEdit] = useState(false);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { addTrackerInfo, trackerDetails, btConfigInfo } = useSelector((state) => state.breakdowntracker);
  const {
    uploadPhoto,
  } = useSelector((state) => state.ticket);
  const { inspectionParentsInfo, ppmAssetsSchedules, inspectionCommenceInfo } = useSelector((state) => state.inspection);

  const {
    ppmSettingsInfo,
  } = useSelector((state) => state.site);

  const configPPMData = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length ? ppmSettingsInfo.data[0] : false;

  const configInspData = inspectionCommenceInfo && inspectionCommenceInfo.data && inspectionCommenceInfo.data.length ? inspectionCommenceInfo.data[0] : false;

  const [error, setError] = React.useState(false);

  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    let timeout;
    if (addModal || editId) {
      timeout = setTimeout(() => {
        setShowStickyBar(true);
      }, 200); // Show after 300ms
    } else {
      setShowStickyBar(false);
    }

    return () => clearTimeout(timeout);
  }, [addModal]);

  useEffect(() => {
    if (inspectionParentsInfo && inspectionParentsInfo.data && inspectionParentsInfo.data.length && inspectionParentsInfo.data[0].category_type) {
      setCheckRows(inspectionParentsInfo.data);
      setParentSchedules(inspectionParentsInfo.data);
    } else {
      setCheckRows([]);
      setParentSchedules([]);
    }
  }, [inspectionParentsInfo]);

  useEffect(() => {
    if (ppmAssetsSchedules && ppmAssetsSchedules.data && ppmAssetsSchedules.data.length && ppmAssetsSchedules.data[0].starts_on) {
      setCheckPPMRows(ppmAssetsSchedules.data);
      setPPMSchedules(ppmAssetsSchedules.data);
    } else {
      setCheckPPMRows([]);
      setPPMSchedules([]);
    }
  }, [ppmAssetsSchedules]);

  const configData = btConfigInfo && btConfigInfo.data && btConfigInfo.data.length ? btConfigInfo.data[0] : false;

  const defaultIntialValues = Array.isArray(configData?.additional_fields_ids) && configData.additional_fields_ids.length > 0
    ? configData.additional_fields_ids
    : [];

  const priorityField = defaultIntialValues ? defaultIntialValues.find((field) => field.label === 'priority') : false;
  const updatedInitialValues = {
    ...formInitialValues,
    priority: priorityField ? { label: priorityField.value, value: priorityField.value } : formInitialValues.priority || '',
  };

  useEffect(() => {
    setIncidentDateEdit(false);
  }, []);

  function checkDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtcMuI(data);
    }
    return result;
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

  function checkDateOnlyObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateLocalMuI(data);
    } else {
      result = moment(data).format('YYYY-MM-DD');
    }
    return result;
  }

  const handleStateChange = async (id) => {
    try {
      const newData = {
        from_date: checkDateOnlyObject(incidentDates),
        to_date: checkDateOnlyObject(closureDate),
        is_all_upcoming: false,
      };
      const postData = {
        requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
        reason: 'breakdown',
        requested_by_id: userInfo && userInfo.data && userInfo.data.id,
        state: configInspData && configInspData.approval_required_for_cancel ? 'Pending' : 'Approved',
        rec_model: appModels.BREAKDOWNTRACKER,
        rec_id: id,
        cancel_approval_authority: configInspData && configInspData.cancel_approval_authority && configInspData.cancel_approval_authority.id ? configInspData.cancel_approval_authority.id : false,
        hx_inspection_ids: [[6, 0, getColumnArrayById(checkedRows, 'id')]],
        expires_on: checkExDatehasObject(closureDate),
        date_range_ids: [[0, 0, newData]],
      };

      if (!(configInspData && configInspData.approval_required_for_cancel)) {
        postData.approved_on = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
        postData.approved_by_id = userInfo && userInfo.data && userInfo.data.id;
        delete postData.cancel_approval_authority;
      }

      const payload = { model: 'hx.inspection_cancel', values: postData };
      dispatch(createCancelReq('hx.inspection_cancel', payload));
    } catch (errors) {
      console.error('Error updating reason or changing state:', errors);
    } finally {
      // Set loading to false once everything is complete
      // setClosureDate(false);
    }
  };

  const handleStatePPMChange = async (id) => {
    try {
      const postData = {
        requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
        reason: 'breakdown',
        requested_by_id: userInfo && userInfo.data && userInfo.data.id,
        state: configPPMData && configPPMData.approval_required_for_cancel ? 'Pending' : 'Approved',
        rec_model: appModels.BREAKDOWNTRACKER,
        rec_id: id,
        cancel_approval_authority: configPPMData && configPPMData.cancel_approval_authority && configPPMData.cancel_approval_authority.id ? configPPMData.cancel_approval_authority.id : false,
        ppm_scheduler_ids: [[6, 0, getColumnArrayById(checkedPPMRows, 'id')]],
        expires_on: checkExDatehasObject(closureDate),
      };

      if (!(configPPMData && configPPMData.approval_required_for_cancel)) {
        postData.approved_on = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
        postData.approved_by_id = userInfo && userInfo.data && userInfo.data.id;
        delete postData.cancel_approval_authority;
      }

      const payload = { model: 'ppm.scheduler_cancel', values: postData };
      dispatch(createCancelReq('ppm.scheduler_cancel', payload));
    } catch (errors) {
      console.error('Error updating reason or changing state:', errors);
    } finally {
      // Set loading to false once everything is complete
      // setClosureDate(false);
    }
  };

  useEffect(() => {
    if (addTrackerInfo && addTrackerInfo.data && addTrackerInfo.data.length) {
      dispatch(getTrackerDetail(addTrackerInfo.data[0], appModels.BREAKDOWNTRACKER));
      if (!editId && configData && (configData.is_cancel_inspection || configData.is_cancel_inspection_space) && checkedRows && checkedRows.length) {
        handleStateChange(addTrackerInfo.data[0]);
      }
      if (!editId && configData && (configData.is_cancel_ppm || configData.is_cancel_ppm_space) && checkedPPMRows && checkedPPMRows.length) {
        if ((configData.is_cancel_inspection || configData.is_cancel_inspection_space)) {
          setTimeout(() => {
            handleStatePPMChange(addTrackerInfo.data[0]);
          }, 1000);
        } else {
          handleStatePPMChange(addTrackerInfo.data[0]);
        }
      }
    }
  }, [userInfo, addTrackerInfo]);

  useEffect(() => {
    if (addModal) {
      dispatch(resetAddTrackerInfo());
      dispatch(resetImage());
    }
  }, [addModal]);

  AsyncFileUpload(addTrackerInfo, uploadPhoto);

  async function submitForm(values, actions) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      let attendedDate = values.attended_on ? values.attended_on : false;
      // let closedDate = values.closed_on ? values.closed_on : false;
      let raisedDate = values.raised_on ? values.raised_on : false;
      let incidentDate = values.incident_date ? values.incident_date : false;
      let expectedClosureDate = values.expexted_closure_date ? values.expexted_closure_date : false;
      if (checkDatehasObject(attendedDate)) {
        attendedDate = getDateTimeUtcMuI(attendedDate);
      }
      /* if (checkDatehasObject(closedDate)) {
        closedDate = getDateTimeUtcMuI(closedDate);
      } */
      if (checkDatehasObject(raisedDate)) {
        raisedDate = getDateTimeUtcMuI(raisedDate);
      }
      if (checkDatehasObject(incidentDate)) {
        incidentDate = getDateTimeUtcMuI(incidentDate);
      }
      expectedClosureDate = checkExDatehasObject(expectedClosureDate);
      const postData = {
        raised_by_id: values.raised_by_id ? extractValueObjects(values.raised_by_id) : '',
        // incident_date: values.incident_date ? values.incident_date : '',
        title: values.title ? values.title : '',
        service_category_id: values.service_category_id ? extractValueObjects(values.service_category_id) : '',
        ciriticality: values.ciriticality ? values.ciriticality.value : '',
        priority: values.priority && values.priority.value ? values.priority.value : values.priority,
        description_of_breakdown: values.description_of_breakdown ? values.description_of_breakdown : '',
        is_results_in_statutory_non_compliance: values.is_results_in_statutory_non_compliance ? values.is_results_in_statutory_non_compliance : false,
        is_breakdown_due_to_ageing: values.is_breakdown_due_to_ageing ? values.is_breakdown_due_to_ageing : false,
        is_service_impacted: values.is_service_impacted ? values.is_service_impacted : false,
        incident_age: values.incident_age ? values.incident_age : '',
        action_taken: values.action_taken ? values.action_taken : '',
        remarks: values.remarks ? values.remarks : '',
        // company_id: values.company_id ? extractValueObjects(values.company_id) : '',
        type: values.type ? values.type : '',
        space_id: values.space_id ? extractValueObjects(values.space_id) : '',
        equipment_id: values.equipment_id ? extractValueObjects(values.equipment_id) : '',
        amc_status: values.amc_status ? extractValueObjects(values.amc_status) : '',
        vendor_name: values.vendor_name ? values.vendor_name : '',
        complaint_no: values.complaint_no ? values.complaint_no : '',
        vendor_sr_number: values.vendor_sr_number ? values.vendor_sr_number : '',
        attended_on: attendedDate,
        // closed_on: closedDate,
        raised_on: raisedDate,
        incident_date: incidentDate,
        expexted_closure_date: expectedClosureDate,
      };
      if (isArrayColumnExists(values.services_impacted_ids ? values.services_impacted_ids : [], 'id')) {
        let selectedServiceData = getColumnArrayById(values.services_impacted_ids, 'id');
        const appendSelected = extractValueObjects(values.services_impacted_ids);
        const isServiceExists = selectedServiceData.filter((item) => item === appendSelected);
        if (isServiceExists && !isServiceExists.length) {
          selectedServiceData = [...selectedServiceData];
        }
        postData.services_impacted_ids = [[6, false, selectedServiceData]];
      }
      if (!getRequiredMessage(postData)) {
        setDateError(false);
        dispatch(updateTenant(editId, postData, appModels.BREAKDOWNTRACKER));
      } else {
        setDateError(getRequiredMessage(postData));
      }
    } else {
      // updateDocuments();
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const serviceImpacted = values.services_impacted_ids && values.services_impacted_ids.length && values.services_impacted_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.services_impacted_ids, 'id')]] : false;

      const Ciriticality = values.ciriticality && values.ciriticality.value ? values.ciriticality.value : '';
      const raisedId = values.raised_by_id ? extractValueObjects(values.raised_by_id) : '';
      const serviceCategoryId = extractValueObjects(values.service_category_id);
      const Priority = values.priority && values.priority.value ? values.priority.value : values.priority;
      const Description = values.description_of_breakdown;
      const ResultSantory = values.is_results_in_statutory_non_compliance ? values.is_results_in_statutory_non_compliance : false;
      const BreakdownDueToAgeing = values.is_breakdown_due_to_ageing ? values.is_breakdown_due_to_ageing : false;
      const serviceCategory = values.is_service_impacted ? values.is_service_impacted : false;
      const incidentAge = values.incident_age;
      const actionTaken = values.action_taken;
      const remark = values.remarks;
      const companyId = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '';
      const types = values.type;
      const spaceId = last(values.space_id);
      const equipmentId = extractValueObjects(values.equipment_id);
      const amcStatus = extractValueObjects(values.amc_status);
      const vendorName = values.vendor_name;
      const complaint = values.complaint_no;
      const vendorSrName = values.vendor_sr_number;

      let attendedDate = values.attended_on ? values.attended_on : false;
      // let closedDate = values.closed_on ? values.closed_on : false;
      let raisedDate = values.raised_on ? values.raised_on : false;
      let incidentDate = values.incident_date ? values.incident_date : false;
      let expectedClosureDate = values.expexted_closure_date ? values.expexted_closure_date : false;
      setClosureDate(expectedClosureDate);
      setIncidentDate(incidentDate);
      if (checkDatehasObject(attendedDate)) {
        attendedDate = getDateTimeUtcMuI(attendedDate);
      }
      /* if (checkDatehasObject(closedDate)) {
        closedDate = getDateTimeUtcMuI(closedDate);
      } */
      if (checkDatehasObject(raisedDate)) {
        raisedDate = getDateTimeUtcMuI(raisedDate);
      }
      if (checkDatehasObject(incidentDate)) {
        incidentDate = getDateTimeUtcMuI(incidentDate);
      }

      expectedClosureDate = checkExDatehasObject(expectedClosureDate);

      const postData = { ...values };

      delete postData.closed_on;

      postData.raised_by_id = raisedId;
      postData.raised_on = raisedDate;
      postData.incident_date = incidentDate;
      postData.expexted_closure_date = expectedClosureDate;
      postData.service_category_id = serviceCategoryId;
      postData.priority = Priority;
      postData.description_of_breakdown = Description;
      postData.is_results_in_statutory_non_compliance = ResultSantory;
      postData.is_breakdown_due_to_ageing = BreakdownDueToAgeing;
      postData.is_service_impacted = serviceCategory;
      postData.services_impacted_ids = serviceImpacted;
      postData.ciriticality = Ciriticality;
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

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    dispatch(resetAddTrackerInfo());
    dispatch(resetUpdateTenant());
    dispatch(resetImage());
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const onLoadRequest = (eid, ename) => {
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: 'Reference',
        type: 'id',
        name: ename,
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

  function handleSubmit(values, actions) {
    submitForm(values, actions);
  }

  return (
    <Formik
      enableReinitialize
      initialValues={editId && trackerDetails && trackerDetails.data ? trimJsonObject(trackerDetails.data[0]) : updatedInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isValid, dirty, setFieldError, setFieldValue, setFieldTouched, resetForm, values,
      }) => (
        <Form id={formId} className="pb-2">
          <Box
            sx={{
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              marginBottom: '50px',
            }}
          >
            <FormControl
              sx={{
                width: '100%',
                padding: '10px 0px 20px 30px',
                borderTop: '1px solid #0000001f',
              }}
            >
              <DescriptionForm formField={formField} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} values={values} />
              <Box sx={{ display: 'flex', gap: '2%' }}>
                <RequestorForm formField={formField} addModal={addModal} setFieldValue={setFieldValue} reloadData={reload} editId={editId || false} setFieldTouched={setFieldTouched} values={values} />
                <IncidentForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} values={values} setIncidentDateEdit={setIncidentDateEdit} />
                <ResolutionForm error={error} setError={setError} incidentDateEdit={incidentDateEdit} formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} values={values} />
                <VendorForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} values={values} />
                {/* {!editId && (
              <ImageForm formField={formField} addModal={addModal} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} />

              )} */}
              </Box>
              <Box sx={{ display: 'flex', gap: '2%' }}>
                <RemarksForm formField={formField} setFieldValue={setFieldValue} values={values} />
                <Box sx={{ width: '50%' }}>
                  {!editId
                    ? (
                      <UploadDocuments
                        saveData={addTrackerInfo}
                        limit="3"
                        model={appModels.BREAKDOWNTRACKER}
                        uploadFileType="images"
                      />
                    )
                    : ''}
                </Box>
              </Box>
            </FormControl>
          </Box>
          <Fade in={showStickyBar}>
            <div className="sticky-button-85drawer-no-align">

              <div
                className="sticky-content-container"
                style={!editId && (values.expexted_closure_date || extractValueObjectsDisplay(values.equipment_id)) && configData && ((configData.change_status_on_assets && extractValueObjectsDisplay(values.equipment_id)) || ((extractValueObjectsDisplay(values.equipment_id) || last(values.space_id)) && values.expexted_closure_date && (configData.is_cancel_ppm_space || configData.is_cancel_ppm || configData.is_cancel_inspection || configData.is_cancel_inspection_space))) ? {} : { float: 'right' }}
              >
                {!editId && (values.expexted_closure_date || extractValueObjectsDisplay(values.equipment_id)) && configData && ((configData.change_status_on_assets && extractValueObjectsDisplay(values.equipment_id)) || ((extractValueObjectsDisplay(values.equipment_id) || last(values.space_id)) && values.expexted_closure_date && (configData.is_cancel_ppm || configData.is_cancel_ppm_space || configData.is_cancel_inspection || configData.is_cancel_inspection_space))) && (
                <div className="alert-container">
                  <Alert severity="error">

                    <p className="font-family-tab mb-0">
                      {configData.change_status_on_assets && extractValueObjectsDisplay(values.equipment_id) && (
                      <>
                        {extractValueObjectsDisplay(values.equipment_id)}
                        {' '}
                        will be moved to Breakdown state
                      </>
                      )}
                      {(extractValueObjectsDisplay(values.equipment_id) || last(values.space_id)) && values.expexted_closure_date && (((configData.is_cancel_ppm && extractValueObjectsDisplay(values.equipment_id)) || (last(values.space_id) && configData.is_cancel_ppm_space)) || (configData.is_cancel_inspection && extractValueObjectsDisplay(values.equipment_id)) || (last(values.space_id) && configData.is_cancel_inspection_space)) && (
                      <>
                        {configData.change_status_on_assets && extractValueObjectsDisplay(values.equipment_id) ? ',' : ''}
                        {' '}
                        This Action may cancel
                        {' '}
                        {(configData.is_cancel_ppm && extractValueObjectsDisplay(values.equipment_id)) || (last(values.space_id) && configData.is_cancel_ppm_space) ? (
                          <span
                            onClick={() => setShowRelatedPPMSchedules(!!(ppmSchedules && ppmSchedules.length > 0))}
                            className={ppmSchedules && ppmSchedules.length > 0 ? 'cursor-pointer text-decoration-underline font-weight-800' : ''}
                          >
                            PPMs
                          </span>
                        )
                          : ''}
                        {' '}
                        {((configData.is_cancel_ppm && extractValueObjectsDisplay(values.equipment_id)) || (last(values.space_id) && configData.is_cancel_ppm_space)) && ((configData.is_cancel_inspection && extractValueObjectsDisplay(values.equipment_id)) || (last(values.space_id) && configData.is_cancel_inspection_space)) ? 'and' : ''}
                        {' '}
                        {(configData.is_cancel_inspection && extractValueObjectsDisplay(values.equipment_id)) || (last(values.space_id) && configData.is_cancel_inspection_space) ? (
                          <span
                            onClick={() => setShowRelatedSchedules(!!(parentSchedules && parentSchedules.length > 0))}
                            className={parentSchedules && parentSchedules.length > 0 ? 'cursor-pointer text-decoration-underline font-weight-800' : ''}
                          >
                            Inspections
                          </span>
                        )
                          : ''}
                        {' '}
                        upto
                        {' '}
                        {getCompanyTimezoneDate(new Date(values.expexted_closure_date), userInfo, 'date')}
                        .
                      </>
                      )}
                    </p>

                  </Alert>
                </div>
                )}
                <div className="button-container">
                  <Button
                    disabled={!editId ? !(isValid && dirty) || error : !isValid || error}
                    type="button"
                    variant="contained"
                    className="submit-btn-lg"
                    onClick={() => handleSubmit(values)}
                  >
                    {!editId ? 'Create Tracker' : 'Update Tracker'}
                  </Button>
                </div>
              </div>

            </div>
          </Fade>
          <Dialog size="lg" fullWidth open={showRelatedSchedules}>
            <DialogHeader title="View Related Inspection Schedules of the Asset" onClose={() => { setShowRelatedSchedules(false); }} />
            <RelatedSchedules
              selectedSchedules={checkedRows && checkedRows.length > 0 ? checkedRows : []}
              typeSelected={typeSelected}
              setEvents={setCheckRows}
              events={parentSchedules && parentSchedules.length > 0 ? parentSchedules : []}
              onClose={() => { setShowRelatedSchedules(false); }}
              isCustomMsg
              endDate={getCompanyTimezoneDate(new Date(values.expexted_closure_date), userInfo, 'date')}
            />
          </Dialog>
          <Dialog size="lg" fullWidth open={showRelatedPPMSchedules}>
            <DialogHeader title="View Related PPM Schedules of the Asset" onClose={() => { setShowRelatedPPMSchedules(false); }} />
            <RelatedPPMSchedules
              selectedSchedules={checkedPPMRows && checkedPPMRows.length > 0 ? checkedPPMRows : []}
              typeSelected={typeSelected}
              setEvents={setCheckPPMRows}
              events={ppmSchedules && ppmSchedules.length > 0 ? ppmSchedules : []}
              onClose={() => { setShowRelatedPPMSchedules(false); }}
              isCustomMsg
            />
          </Dialog>
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
            detailData={trackerDetails}
            successRedirect={handleReset.bind(null, resetForm)}
          />
        </Form>
      )}
    </Formik>
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
