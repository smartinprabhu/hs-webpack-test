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

import { Box } from '@mui/system';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import InventoryBlue from '@images/icons/inventoryBlue.svg';

import BasicForm from './forms/helpdeskSettingsBasicForm';
import validationSchema from './formModel/settingsValidationSchema';
import checkoutFormModel from './formModel/settingsCheckoutFormModel';
import formInitialValues from './formModel/settingsFormInitialValues';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject,
  extractValueObjects, getArrayNewFormatUpdateDelete,
} from '../../../util/appUtils';
import HelpdeskStateEmailForm from './forms/helpdeskStateEmailForm';
import { updateProductCategory } from '../../../pantryManagement/pantryService';
import { getHelpdeskSettingDetails } from '../../siteService';

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
    helpdeskSettingsInfo, siteDetails,
  } = useSelector((state) => state.site);

  useEffect(() => {
    if ((updateProductCategoryInfo && updateProductCategoryInfo.data && siteDetails && siteDetails.data && siteDetails.data.length)) {
      dispatch(getHelpdeskSettingDetails(siteDetails.data[0].id, appModels.MAINTENANCECONFIG));
    }
  }, [updateProductCategoryInfo]);

  let subCategoryValues = helpdeskSettingsInfo && helpdeskSettingsInfo.data && helpdeskSettingsInfo.data.length > 0 ? helpdeskSettingsInfo.data[0].helpdesk_lines : [];

  useEffect(() => {
    if (helpdeskSettingsInfo && helpdeskSettingsInfo.data && helpdeskSettingsInfo.data.length) {
      subCategoryValues = helpdeskSettingsInfo && helpdeskSettingsInfo.data && helpdeskSettingsInfo.data.length > 0 ? helpdeskSettingsInfo.data[0].helpdesk_lines : [];
    }
  }, [helpdeskSettingsInfo]);

  function getNewRequestArray(array) {
    let requestProduts = [];
    if (array && array.length > 0) {
      requestProduts = array.map((pl) => ({
        id: pl.id,
        helpdesk_state: pl.helpdesk_state,
        is_requestee: pl.is_requestee === '' ? false : pl.is_requestee,
        is_maintenance_team: pl.is_maintenance_team === '' ? false : pl.is_maintenance_team,
        is_recipients: pl.is_recipients === '' ? false : pl.is_recipients,
        is_send_email: pl.is_send_email === '' ? false : pl.is_send_email,
        is_push_notify: pl.is_push_notify === '' ? false : pl.is_push_notify,
        is_send_sms: pl.is_send_sms === '' ? false : pl.is_send_sms,
        recipients_ids: pl.recipients_ids_new,
        mail_template_id: pl.mail_template_id_new,
        sms_template_id: pl.sms_template_id_new,
        isRemove: pl.isRemove,
      }));
    }
    return requestProduts;
  }

  function handleSubmit(values) {
    if (helpdeskSettingsInfo && helpdeskSettingsInfo.data && helpdeskSettingsInfo.data.length) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      let orderData = [];
      if (values.helpdesk_lines && values.helpdesk_lines.length > 0) {
        orderData = getNewRequestArray(values.helpdesk_lines);
      }
      const postData = {
        has_site_specific_category: values.has_site_specific_category,
        is_enable_it_ticket: values.is_enable_it_ticket,
        is_auto_generate_mo_helpdesk: values.is_auto_generate_mo_helpdesk,
        helpdesk_attachment_limit: values.helpdesk_attachment_limit,
        send_escatation_mails: values.send_escatation_mails,
        send_reminder_mails: values.send_reminder_mails,
        is_enable_helpdesk_feedback: values.is_enable_helpdesk_feedback,
        helpdesk_button_text: values.helpdesk_button_text,
        is_send_helpdesk_email: values.is_send_helpdesk_email,
        feedback_expiry_days: values.feedback_expiry_days,
        reopen_on_feedback_ticket: values.reopen_on_feedback_ticket,
        email_team_on_dissatisfaction_feedback: values.email_team_on_dissatisfaction_feedback,
        is_enable_external_helpdesk: values.is_enable_external_helpdesk,
        requires_verification_by_otp: values.requires_verification_by_otp,
        has_reviwer_name: values.has_reviwer_name,
        has_reviwer_email: values.has_reviwer_email,
        has_reviwer_mobile: values.has_reviwer_mobile,
        requires_attachment: values.requires_attachment,
        work_location: values.work_location,
        requestor_mobile_visibility: extractValueObjects(values.requestor_mobile_visibility),
        share_mail_template_id: extractValueObjects(values.share_mail_template_id),
        problem_category_type: extractValueObjects(values.problem_category_type),
        helpdesk_survey: extractValueObjects(values.helpdesk_survey),
        helpdesk_lines: values.helpdesk_lines && values.helpdesk_lines.length > 0 ? getArrayNewFormatUpdateDelete(orderData) : false,
        is_vendor_field: values.is_vendor_field,
        vendor_access_type: values.is_vendor_field === 'Yes' ? extractValueObjects(values.vendor_access_type) : '',
        is_age: values.is_age,
        is_constraints: values.is_constraints,
        is_cost: values.is_cost,
      };
      dispatch(updateProductCategory(helpdeskSettingsInfo.data[0].id, appModels.MAINTENANCECONFIG, postData));
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

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && helpdeskSettingsInfo && helpdeskSettingsInfo.data && helpdeskSettingsInfo.data.length ? trimJsonObject(helpdeskSettingsInfo.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  padding: '20px',
                  width: '100%',
                  marginBottom: '50px',
                }}
              >
                <div className="createFormScrollbar">
                  {(addProductCategoryInfo && !addProductCategoryInfo.data && !addProductCategoryInfo.loading) && (
                  <ThemeProvider theme={theme}>
                    <div>
                      <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                      <HelpdeskStateEmailForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} subCategoryValues={subCategoryValues} />
                    </div>
                  </ThemeProvider>
                  )}
                  {((addProductCategoryInfo && addProductCategoryInfo.loading) || (helpdeskSettingsInfo && helpdeskSettingsInfo.loading)) && (
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
                  successMessage={addProductCategoryInfo.data ? 'Helpdesk settings are updated successfully..' : 'Helpdesk settings are updated successfully..'}
                />
              )} */}

                </div>
                <div className="float-right sticky-button-85drawer">
                  <Button
                    disabled={!editId ? !(isValid && dirty) : !isValid}
                    type="submit"
                    size="sm"
                    variant="contained"
                  >
                    {!editId ? 'Add' : 'Update'}
                  </Button>
                </div>
              </Box>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateProductCategoryInfo : addProductCategoryInfo}
                headerImage={InventoryBlue}
                headerText="Helpdesk Settings"
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
