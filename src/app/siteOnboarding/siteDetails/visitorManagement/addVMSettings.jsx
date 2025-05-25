/* eslint-disable no-lone-blocks */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import {
  Button,
} from '@mui/material';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import InventoryBlue from '@images/icons/visitorpassBlue.svg';

import BasicForm from './forms/visitorSettingsBasicForm';
import validationSchema from './formModel/settingsValidationSchema';
import checkoutFormModel from './formModel/settingsCheckoutFormModel';
import formInitialValues from './formModel/settingsFormInitialValues';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject,
  extractValueObjects, getColumnArrayById,
} from '../../../util/appUtils';

import { updateProductCategory } from '../../../pantryManagement/pantryService';
import { getVMSSettingDetails, setAllowedHostId, setAllowedDomainId } from '../../siteService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddHelpdeskSettings = (props) => {
  const { closeModal, editId } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const {
    visitorSettingsInfo, siteDetails,
  } = useSelector((state) => state.site);

  useEffect(() => {
    if ((updateProductCategoryInfo && updateProductCategoryInfo.data && siteDetails && siteDetails.data && siteDetails.data.length)) {
      dispatch(getVMSSettingDetails(siteDetails.data[0].id, appModels.VMSCONFIGURATION));
    }
  }, [updateProductCategoryInfo]);

  function handleSubmit(values) {
    if (visitorSettingsInfo && visitorSettingsInfo.data && visitorSettingsInfo.data.length) {
      setIsOpenSuccessAndErrorModalWindow(true);
      //closeModal();
      const postData = {
        has_visitor_email: values.has_visitor_email,
        has_visitor_mobile: values.has_visitor_mobile,
        has_visitor_company: values.has_visitor_company,
        has_visitor_type: values.has_visitor_type,
        has_purpose: values.has_purpose,
        has_photo: values.has_photo,
        has_identity_proof: values.has_identity_proof,
        has_identity_proof_number: values.has_identity_proof_number,
        has_vistor_id_details: values.has_vistor_id_details,
        has_visitor_badge: values.has_visitor_badge,
        has_host_company: values.has_host_company,
        has_host_email: values.has_host_email,
        has_host_name: values.has_host_name,
        is_send_otp_email: values.is_send_otp_email,
        is_send_otp_sms: values.is_send_otp_sms,
        is_send_whatsapp_message: values.is_send_whatsapp_message,
        is_send_visitor_invitation_email: values.is_send_visitor_invitation_email,
        is_send_visitor_invitation_sms: values.is_send_visitor_invitation_sms,
        is_send_visitor_invitation_whatsapp: values.is_send_visitor_invitation_whatsapp,
        is_enable_host_email_verification: values.is_enable_host_email_verification,
        host_disclaimer: values.host_disclaimer,
        is_send_request_email: values.is_send_request_email,
        is_send_request_sms: values.is_send_request_sms,
        is_send_request_whatsapp: values.is_send_request_whatsapp,
        is_send_check_in_email: values.is_send_check_in_email,
        is_send_check_in_sms: values.is_send_check_in_sms,
        is_send_check_in_whatsapp: values.is_send_check_in_whatsapp,
        check_in_qr: values.check_in_qr,
        check_in_otp: values.check_in_otp,
        check_in_grace_period: values.check_in_grace_period,
        is_send_check_out_email: values.is_send_check_out_email,
        is_send_check_out_sms: values.is_send_check_out_sms,
        is_send_check_out_whatsapp: values.is_send_check_out_whatsapp,
        is_send_approval_email: values.is_send_approval_email,
        is_send_approval_sms: values.is_send_approval_sms,
        is_send_approval_whatsapp: values.is_send_approval_whatsapp,
        is_send_elapsed_email: values.is_send_elapsed_email,
        is_send_elapsed_sms: values.is_send_elapsed_sms,
        is_send_elapsed_whatsapp: values.is_send_elapsed_whatsapp,
        allow_gallery_images: values.allow_gallery_images,
        enable_prescreen: values.enable_prescreen,
        prescreen_button_text: values.prescreen_button_text,
        is_send_prescreen_email: values.is_send_prescreen_email,
        approval_required_from_host: values.approval_required_from_host,
        close_visit_request_by: values.close_visit_request_by,
        enable_public_visit_request: values.enable_public_visit_request,
        is_allow_visitor_assets: values.is_allow_visitor_assets,
        is_enable_conditions: values.is_enable_conditions,
        terms_and_conditions: values.terms_and_conditions,
        visit_request_created_text: values.visit_request_created_text,
        visit_pass_header: values.visit_pass_header,
        feedback_during_checkout: values.feedback_during_checkout,
        feedback_button_text: values.feedback_button_text,
        is_send_feedback_email: values.is_send_feedback_email,
        prescreen_survey: extractValueObjects(values.prescreen_survey),
        feedback_survey: extractValueObjects(values.feedback_survey),
        visitor_invitation_template_id: extractValueObjects(values.visitor_invitation_template_id),
        otp_template_id: extractValueObjects(values.otp_template_id),
        request_template_id: extractValueObjects(values.request_template_id),
        check_in_template_id: extractValueObjects(values.check_in_template_id),
        check_out_template_id: extractValueObjects(values.check_out_template_id),
        approval_template_id: extractValueObjects(values.approval_template_id),
        elapsed_template_id: extractValueObjects(values.elapsed_template_id),
        allowed_sites_ids: values.allowed_sites_ids && values.allowed_sites_ids.length && values.allowed_sites_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.allowed_sites_ids, 'id')]] : [[6, 0, []]],
        allowed_domains_host_ids: values.allowed_domains_host_ids && values.allowed_domains_host_ids.length && values.allowed_domains_host_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.allowed_domains_host_ids, 'id')]] : [[6, 0, []]],
        visitor_types: values.visitor_types && values.visitor_types.length && values.visitor_types.length > 0
          ? [[6, 0, getColumnArrayById(values.visitor_types, 'id')]] : [[6, 0, []]],
        visitor_allowed_asset_ids: values.visitor_allowed_asset_ids && values.visitor_allowed_asset_ids.length && values.visitor_allowed_asset_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.visitor_allowed_asset_ids, 'id')]] : [[6, 0, []]],
      };
      dispatch(updateProductCategory(visitorSettingsInfo.data[0].id, appModels.VMSCONFIGURATION, postData));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    dispatch(setAllowedHostId([]));
    dispatch(setAllowedDomainId([]));
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (closeModal) closeModal();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0 helpDesk-form">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && visitorSettingsInfo && visitorSettingsInfo.data ? trimJsonObject(visitorSettingsInfo.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              {(addProductCategoryInfo && !addProductCategoryInfo.data && !addProductCategoryInfo.loading) && (
                <ThemeProvider theme={theme}>
                  <div>
                    <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                  </div>
                </ThemeProvider>
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (visitorSettingsInfo && visitorSettingsInfo.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {/* {(addProductCategoryInfo && addProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={addProductCategoryInfo} />
              )}
              {(updateProductCategoryInfo && updateProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={updateProductCategoryInfo} />
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) && (
                <SuccessAndErrorFormat
                  response={addProductCategoryInfo.data ? addProductCategoryInfo : updateProductCategoryInfo}
                  successMessage={addProductCategoryInfo.data ? 'Visitor management settings added successfully..' : 'Visitor management settings are updated successfully..'}
                />
              )} */}
              <hr />
              <div className="float-right m-4">
                {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) ? (
                  ''
                ) : (
                  <div className="bg-lightblue sticky-button-85drawer">
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      type="submit"
                      size="sm"
                      variant="contained"
                    >
                      {!editId ? 'Add' : 'Update'}
                    </Button>
                  </div>
                )}
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateProductCategoryInfo : addProductCategoryInfo}
                headerImage={InventoryBlue}
                headerText="Visitor Management Settings"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddHelpdeskSettings.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AddHelpdeskSettings;
