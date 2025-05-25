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

import PromptIfUnSaved from '@shared/unSavedPrompt';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import preventiveMaintenance from '@images/icons/preventiveMaintenance.svg';
import BasicForm from './forms/ppmSettingsBasicForm';
import validationSchema from './formModel/settingsValidationSchema';
import checkoutFormModel from './formModel/settingsCheckoutFormModel';
import formInitialValues from './formModel/settingsFormInitialValues';
import theme from '../../../util/materialTheme';
import {

  extractValueObjects, getColumnArrayById,
} from '../../../util/appUtils';

import { updateProductCategory } from '../../../pantryManagement/pantryService';
import { getPPMSettingsDetails } from '../../siteService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddPPMSettings = (props) => {
  const { closeModal, editId } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const {
    ppmSettingsInfo, siteDetails,
  } = useSelector((state) => state.site);

  useEffect(() => {
    if ((updateProductCategoryInfo && updateProductCategoryInfo.data && siteDetails && siteDetails.data && siteDetails.data.length)) {
      dispatch(getPPMSettingsDetails(siteDetails.data[0].id, appModels.PPMWEEKCONFIG));
    }
  }, [updateProductCategoryInfo]);

  function getNewRequestArray(array) {
    let requestProduts = [];
    if (array && array.length > 0) {
      requestProduts = array.map((pl) => ({
        id: pl.id,
        helpdesk_state: extractValueObjects(pl.helpdesk_state),
        is_requestee: pl.is_requestee,
        is_maintenance_team: pl.is_maintenance_team,
        is_recipients: pl.is_recipients,
        is_send_email: pl.is_send_email,
        is_push_notify: pl.is_push_notify,
        is_send_sms: pl.is_send_sms,
        recipients_ids: pl.recipients_ids && pl.recipients_ids.length && pl.recipients_ids.length > 0
          ? [[6, 0, getColumnArrayById(pl.recipients_ids, 'id')]] : [[6, 0, []]],
        mail_template_id: extractValueObjects(pl.mail_template_id),
        sms_template_id: extractValueObjects(pl.sms_template_id),
        isRemove: pl.isRemove,
      }));
    }
    return requestProduts;
  }

  function handleSubmit(values) {
    if (ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      // let orderData = [];
      // if (values.helpdesk_lines && values.helpdesk_lines.length > 0) {
      //   orderData = getNewRequestArray(values.helpdesk_lines);
      // }
      const postData = {
        at_start_mro: values.at_start_mro,
        at_review_mro: values.at_review_mro,
        at_done_mro: values.at_done_mro,
        qr_scan_at_start: values.qr_scan_at_start,
        qr_scan_at_done: values.qr_scan_at_done,
        generate_ppm_in_advance: extractValueObjects(values.generate_ppm_in_advance),
        review_role_id: extractValueObjects(values.review_role_id),
        sign_off_role_id: extractValueObjects(values.sign_off_role_id),
        enforce_time: values.enforce_time,
        is_review_required: values.is_review_required,
        review_commment_is_required: values.review_commment_is_required,
        is_sign_off_required: values.is_sign_off_required,
        nfc_scan_at_start: values.nfc_scan_at_start,
        nfc_scan_at_done: values.nfc_scan_at_done,
        is_subassets_viewer: values.is_subassets_viewer,
        is_indirect_child: values.is_indirect_child,
        is_parent: values.is_parent,
        is_perform_missed_ppm: values.is_perform_missed_ppm,
        is_provide_missed_reason: values.is_provide_missed_reason,
        service_report_file_formats: values.service_report_file_formats,
        service_report_reason_id: extractValueObjects(values.service_report_reason_id),
        is_external_ppm_to_be_performed: values.is_external_ppm_to_be_performed,
        is_send_external_ppm_email: values.is_send_external_ppm_email,
        is_fence_to_perform_ppm: values.is_fence_to_perform_ppm,
        instructions: values.instructions,
        terms_and_condition: values.terms_and_condition,
        disclaimer: values.disclaimer,
        is_on_hold_approval_required: values.is_on_hold_approval_required,
        on_hold_max_grace_period: Number(values.on_hold_max_grace_period),
        send_email_before_weeks: extractValueObjects(values.send_email_before_weeks),
        send_vendor_emails_as: extractValueObjects(values.send_vendor_emails_as),
        external_reminder_email_template_id: extractValueObjects(values.external_reminder_email_template_id),
        on_hold_approval_id: extractValueObjects(values.on_hold_approval_id),
        on_hold_mail_template_id: extractValueObjects(values.on_hold_mail_template_id),
        on_hold_mail_reject_id: extractValueObjects(values.on_hold_mail_reject_id),
        on_hold_missed_mail_id: extractValueObjects(values.on_hold_missed_mail_id),
        reminder_template_id: extractValueObjects(values.reminder_template_id),
        sla_template_id: extractValueObjects(values.sla_template_id),
        reason_access_level: extractValueObjects(values.reason_access_level),
        // reopen_on_feedback_ticket: values.reopen_on_feedback_ticket,
        // email_team_on_dissatisfaction_feedback: values.email_team_on_dissatisfaction_feedback,
        // is_enable_external_helpdesk: values.is_enable_external_helpdesk,
        // requires_verification_by_otp: values.requires_verification_by_otp,
        // has_reviwer_name: values.has_reviwer_name,
        // has_reviwer_email: values.has_reviwer_email,
        // has_reviwer_mobile: values.has_reviwer_mobile,
        // requires_attachment: values.requires_attachment,
        // work_location: values.work_location,
        // requestor_mobile_visibility: extractValueObjects(values.requestor_mobile_visibility),
        // helpdesk_survey: extractValueObjects(values.helpdesk_survey),
        // helpdesk_lines: values.helpdesk_lines && values.helpdesk_lines.length > 0 ? getArrayNewFormatUpdateDelete(orderData) : false,
      };
      dispatch(updateProductCategory(ppmSettingsInfo.data[0].id, appModels.PPMWEEKCONFIG, postData));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (closeModal) closeModal();
    }, 1000);
  };

  const subCategoryValues = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length > 0 ? ppmSettingsInfo.data[0].helpdesk_lines : [];

  function trimJsonObject(payload) {
    console.log(payload);
    // eslint-disable-next-line array-callback-return
    Object.keys(payload).map((payloadObj) => {
      if (payload[payloadObj] === false) {
        // eslint-disable-next-line no-param-reassign
        payload[payloadObj] = '';
      }
      return null;
    });
    return payload;
  }

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0 helpDesk-form">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && ppmSettingsInfo && ppmSettingsInfo.data ? (ppmSettingsInfo.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <PromptIfUnSaved />
              {(addProductCategoryInfo && !addProductCategoryInfo.data && !addProductCategoryInfo.loading) && (
                <ThemeProvider theme={theme}>
                  <div>
                    <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                  </div>
                </ThemeProvider>
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (ppmSettingsInfo && ppmSettingsInfo.loading)) && (
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
                  successMessage={addProductCategoryInfo.data ? 'Product category added successfully..' : 'Helpdesk settings are updated successfully..'}
                />
              )} */}
              <div className="float-right m-4">
                {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="contained"
                    onClick={handleReset.bind(null, resetForm)}
                  >
                    Ok
                  </Button>
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
                headerImage={preventiveMaintenance}
                headerText="PPM Settings"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddPPMSettings.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AddPPMSettings;
