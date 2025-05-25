/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Box } from '@mui/system';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import VisitRequestBlue from '@images/icons/visitorPassCheckBlue.svg';
import { Button, Divider, FormControl } from '@mui/material';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import {
  updateTenant,
} from '../adminSetup/setupService';
import {
  resetImage,
} from '../helpdesk/ticketService';
import {
  checkDatehasObject,
  extractValueObjects,
  getAllowedCompanies,
  getArrayNewFormatUpdateDelete,
  getDateTimeUtcMuI,
  trimJsonObject,
} from '../util/appUtils';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import validationSchema from './formModel/validationSchema';
import AdditionalForm from './forms/additionalForm';
import AssetInfo from './forms/assetInfo';
import BasicForm from './forms/basicForm';
import { getNewRequestArray } from './utils/utils';
import {
  createVisitRequest,
  getVisitorRequestDetail, getVisitorRequestFilters, resetAddVisitRequest,
} from './visitorManagementService';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddVisitRequest = (props) => {
  const {
    editId,
    afterReset,
    closeModal,
    change,
    isShow,
    setChange,
    nameKeyword,
    setNameKeyword,
    visitorConfiguration,
    partsData,
    setPartsData,
    refresh,
  } = props;
  const dispatch = useDispatch();
  // const [reload, setReload] = useState(1);
  const [visitRequest, setVisitRequest] = useState(false);
  const [DataChanged, setDataChanged] = useState(null);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { addVisitRequestInfo, visitorRequestDetails } = useSelector((state) => state.visitorManagement);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [partsAddEnable, setPartsAddEnable] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  const history = useHistory();

  useEffect(() => {
    dispatch(resetAddVisitRequest());
    dispatch(resetImage());
    setVisitRequest(false);
  }, []);

  useEffect(() => {
    if (addVisitRequestInfo && addVisitRequestInfo.data && addVisitRequestInfo.data.length) {
      dispatch(getVisitorRequestDetail(addVisitRequestInfo.data[0], appModels.VISITREQUEST));
    }
  }, [userInfo, addVisitRequestInfo]);

  useEffect(() => {
    let countTrueResult = 0;
    if (partsData && partsData.length) {
      partsData.map((assetsData) => {
        if (assetsData.visitor_asset_name === '' || assetsData.asset_quantity === '0' || assetsData.asset_quantity === '') {
          countTrueResult += 1;
        } else {
          setPartsAddEnable(false);
        }
      });
      if (countTrueResult > 0) {
        setPartsAddEnable(true);
      }
    } else {
      setPartsAddEnable(false);
    }
  }, [partsData, DataChanged]);

  function checkArrayhasDataProduct(data) {
    let result = [];
    if (data && data.length) {
      result = data.filter((item) => (item.visitor_asset_name && (typeof item.visitor_asset_name === 'string')));
    }
    return result;
  }
  function validatePlannedTime(plannedIn, plannedOut) {
    const inTime = new Date(plannedIn);
    const outTime = new Date(plannedOut);

    if (outTime < inTime) {
      return false;
    }
    return true;
  }

  function handleSubmit(values) {
    if (editId) {
      // closeModal();
      let plannedIn = values.planned_in ? values.planned_in : false;
      let plannedOut = values.planned_out ? values.planned_out : false;
      let actualIn = values.actual_in ? values.actual_in : false;
      let actualOut = values.actual_out ? values.actual_out : false;

      if (checkDatehasObject(plannedIn)) {
        plannedIn = getDateTimeUtcMuI(plannedIn);
      }
      if (checkDatehasObject(plannedOut)) {
        plannedOut = getDateTimeUtcMuI(plannedOut);
      }
      if (checkDatehasObject(actualIn)) {
        actualIn = getDateTimeUtcMuI(actualIn);
      }
      if (checkDatehasObject(actualOut)) {
        actualOut = getDateTimeUtcMuI(actualOut);
      }
      const postData = {
        // visit_for: values.visit_for,
        name: values.name,
        visitor_type: values.visitor_type ? values.visitor_type.value : '',
        visitor_name: values.visitor_name ? values.visitor_name.name : '',
        image_medium: values.image_medium ? values.image_medium : '',
        image_small: values.image_small ? values.image_small : '',
        phone: values.phone,
        email: values.email,
        organization: values.organization,
        id_proof: values.id_proof ? values.id_proof.id : '',
        Visitor_id_details: values.Visitor_id_details ? values.Visitor_id_details : '',
        attachment: values.attachment ? values.attachment : '',
        employee_image: values.employee_image ? values.employee_image : '',
        employee_id: values.employee_id ? values.employee_id.id : '',
        employee_phone: values.employee_phone,
        employee_email: values.employee_email,
        host_name: values.host_name,
        host_email: values.host_email,
        allowed_sites_id: values.allowed_sites_id ? values.allowed_sites_id.id : '',
        space_id: values.space_id ? values.space_id.id : '',
        purpose: values.purpose,
        planned_in: plannedIn,
        planned_out: plannedOut,
        actual_in: actualIn,
        actual_out: actualOut,
        entry_status: values.entry_status ? values.entry_status.value : '',
        allow_multiple_entry: values.allow_multiple_entry,
        tenant_id: extractValueObjects(values.tenant_id),
        // origin_status: values.origin_status ? values.origin_status.value : '',
      };
      if (validatePlannedTime(plannedIn, plannedOut)) {
        setErrorMessage(false);
        setIsOpenSuccessAndErrorModalWindow(true);
        dispatch(updateTenant(editId, postData, appModels.VISITREQUEST));
      } else {
        setErrorMessage('Planned Out cannot be less than Planned In.');
      }
    } else {
      let orderData = [];
      if (values.visitor_assets_ids && values.visitor_assets_ids.length > 0) {
        orderData = getNewRequestArray(values.visitor_assets_ids);
      }
      // setIsOpenSuccessAndErrorModalWindow(true);
      // afterReset();
      setChange(false);
      const idProof = values.id_proof.id ? values.id_proof.id : false;
      const idDetails = values.Visitor_id_details ? values.Visitor_id_details : false;
      const employeeId = values.employee_id.id ? values.employee_id.id : false;
      const hostCompany = values.allowed_sites_id.id ? values.allowed_sites_id.id : false;
      const spaceId = values.space_id.id ? values.space_id.id : false;
      const documentProof = values.attachment
        ? values.attachment : '';
      const imageMedium = values.image_medium
        ? values.image_medium : '';
      const employeeImage = values.employee_image
        ? values.employee_image : '';
      const visitorType = values.type_of_visitor ? values.type_of_visitor.name : false;
      // const entryStatus = values.entry_status && values.entry_status.value ? values.entry_status.value : false;
      const originStatus = 'employee_initiated';// values.origin_status && values.origin_status.value ? values.origin_status.value : false;
      const visitorName = values.visitor_name ? values.visitor_name.name : '';
      setNameKeyword(visitorName);
      let plannedIn = values.planned_in ? values.planned_in : false;
      let plannedOut = values.planned_out ? values.planned_out : false;
      // let actualIn = values.actual_in ? values.actual_in : false;
      // let actualOut = values.actual_out ? values.actual_out : false;

      if (checkDatehasObject(plannedIn)) {
        plannedIn = getDateTimeUtcMuI(plannedIn);
      }
      if (checkDatehasObject(plannedOut)) {
        plannedOut = getDateTimeUtcMuI(plannedOut);
      }
      /* if (checkDatehasObject(actualIn)) {
        actualIn = getDateTimeUtcMuI(actualIn);
      }
      if (checkDatehasObject(actualOut)) {
        actualOut = getDateTimeUtcMuI(actualOut);
      } */
      const postData = { ...values };
      postData.id_proof = idProof;
      postData.Visitor_id_details = idDetails;
      postData.employee_id = employeeId;
      postData.allowed_sites_id = hostCompany;
      postData.space_id = spaceId;
      postData.attachment = documentProof;
      postData.image_medium = imageMedium;
      postData.employee_image = employeeImage;
      postData.type_of_visitor = visitorType;
      // postData.entry_status = entryStatus;
      postData.origin_status = originStatus;
      postData.planned_in = plannedIn;
      postData.planned_out = plannedOut;
      // postData.actual_in = actualIn;
      // postData.actual_out = actualOut;
      postData.visitor_name = visitorName;
      // postData.purpose_id = extractValueObjects(values.purpose_id);
      postData.tenant_id = extractValueObjects(values.tenant_id);
      postData.visitor_assets_ids = values.visitor_assets_ids && values.visitor_assets_ids.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : false;
      const payload = { model: appModels.VISITREQUEST, values: postData };
      if (validatePlannedTime(plannedIn, plannedOut)) {
        setErrorMessage(false);
        setIsOpenSuccessAndErrorModalWindow(true);
        dispatch(createVisitRequest(appModels.VISITREQUEST, payload));
      } else {
        setErrorMessage('Planned Out cannot be less than Planned In.');
      }
      setNameKeyword('');
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
      dispatch(getVisitorRequestFilters(customFilters));
    }
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    setVisitRequest(true);
    history.push({ pathname: '/visitormanagement/visitrequest' });
  };

  /* if (visitRequest) {
    return (<Redirect to="/visitormanagement/visitrequest" />);
  } */

  const handleReset = (resetForm) => {
    resetForm();
    afterReset();
    // closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const closeAddMaintenance = () => {
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  const checkAssets = visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length && visitorConfiguration.data[0].is_allow_visitor_assets && visitorConfiguration.data[0].is_allow_visitor_assets;

  return (
    <Formik
      enableReinitialize
      initialValues={editId && visitorRequestDetails && visitorRequestDetails.data ? trimJsonObject(visitorRequestDetails.data[0]) : formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isValid, dirty, setFieldValue, resetForm, setFieldTouched, values,
      }) => (

        <Form id={formId}>
          <Box
            sx={{
              padding: '10px 25px',
              width: '100%',
            }}
          >
            <FormControl
              sx={{
                width: '100%',
              }}
            >
              <>
                <BasicForm
                  formField={formField}
                  editId={editId}
                  setFieldValue={setFieldValue}
                  refresh={refresh}
                  change={change}
                  setChange={setChange}
                  nameKeyword={nameKeyword}
                  setNameKeyword={setNameKeyword}
                  isShow={isShow}
                  values={values}
                />
                <AdditionalForm isShow={isShow} values={values} formField={formField} editId={editId} setFieldTouched={setFieldTouched} setFieldValue={setFieldValue} errorMessage={errorMessage} visitorConfiguration={visitorConfiguration} />
                <AssetInfo
                  checkAssets={checkAssets}
                  setFieldValue={setFieldValue}
                  partsData={partsData}
                  setPartsAddEnable={setPartsAddEnable}
                  setDataChanged={setDataChanged}
                  setPartsData={setPartsData}
                  values={values}
                />
              </>

            </FormControl>
            <Divider style={{ marginBottom: '10px', marginTop: '10px' }} />
            <Box sx={{ float: 'right', marginRight: '46px' }}>
              <Button
                type="button"
                variant="contained"
                onClick={() => handleSubmit(values)}
                disabled={!editId ? (!(isValid && dirty && values.visitor_name && values.visitor_name.id) || partsAddEnable) : !(isValid && (values.visitor_name && typeof values.visitor_name === 'object' ? values.visitor_name.id : true))}
              >
                {editId ? 'Update' : 'Create'}
              </Button>
            </Box>
            {/* (addVisitRequestInfo && addVisitRequestInfo.data) ? (
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => { handleReset.bind(null, resetForm); dispatch(resetAddVisitRequest()); }}
                  className="submit-btn"
                >
                  Ok
                </Button>

              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  className="submit-btn"
                  disabled={!editId ? (!(isValid && dirty && values.visitor_name && values.visitor_name.id) || partsAddEnable) : !(isValid && (values.visitor_name && typeof values.visitor_name === 'object' ? values.visitor_name.id : true))}
                >
                  {!editId ? 'Add' : 'Update'}
                </Button>
              ) */}
          </Box>

          {addVisitRequestInfo && addVisitRequestInfo.loading && (
          <Loader />
          )}
          {/* {(addVisitRequestInfo && addVisitRequestInfo.err) && (
          <SuccessAndErrorFormat response={addVisitRequestInfo} />
          )}
          {(tenantUpdateInfo && tenantUpdateInfo.err) && (
          <SuccessAndErrorFormat response={tenantUpdateInfo} />
          )} */}
          {/* (addVisitRequestInfo && addVisitRequestInfo.data) && (
              <>
                <SuccessAndErrorFormat response={addVisitRequestInfo} successMessage="Visit request added successfully.." />
                {!editId && visitorRequestDetails && visitorRequestDetails.data && (
                  <p className="text-center mt-2 mb-0 tab_nav_link">
                    Click here to view
                    {' '}
                    :
                    <span
                      aria-hidden="true"
                      className="ml-2 cursor-pointer text-info"
                      onClick={() => { onLoadRequest(visitorRequestDetails.data[0].id, visitorRequestDetails.data[0].visitor_name); dispatch(resetAddVisitRequest()); }}
                    >
                      {visitorRequestDetails.data[0].visitor_name}
                    </span>
                    {' '}
                    details
                  </p>
                )}
              </>
                ) */}

          <SuccessAndErrorModalWindow
            isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
            setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
            type={editId ? 'update' : 'create'}
            newId={visitorRequestDetails && visitorRequestDetails.data && visitorRequestDetails.data.length > 0 ? visitorRequestDetails.data[0].id : false}
            newName={visitorRequestDetails && visitorRequestDetails.data && visitorRequestDetails.data.length > 0 ? visitorRequestDetails.data[0].visitor_name : false}
            successOrErrorData={editId ? tenantUpdateInfo : addVisitRequestInfo}
            headerImage={VisitRequestBlue}
            headerText="Visitor Request"
            onLoadRequest={onLoadRequest}
            successRedirect={handleReset.bind(null, resetForm)}
          />
        </Form>
      )}
    </Formik>
  );
};

AddVisitRequest.defaultProps = {
  setChange: () => { },
  setNameKeyword: () => { },
  setPartsData: () => { },
};

AddVisitRequest.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default AddVisitRequest;
