/* eslint-disable no-lone-blocks */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { ThemeProvider } from '@material-ui/core/styles';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import {
  Button,
} from '@mui/material';

import { Box } from '@mui/system';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import preventiveMaintenance from '@images/icons/preventiveMaintenance.svg';
import {
  extractValueObjects,
} from '../../../util/appUtils';
import theme from '../../../util/materialTheme';
import checkoutFormModel from './formModel/settingsCheckoutFormModel';
import formInitialValues from './formModel/settingsFormInitialValues';
import validationSchema from './formModel/settingsValidationSchema';
import BasicForm from './forms/maintenanceSettingsBasicForm';

import { updateProductCategory, resetUpdateProductCategory } from '../../../pantryManagement/pantryService';
import { getHelpdeskSettingDetails } from '../../siteService';

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
    helpdeskSettingsInfo, siteDetails,
  } = useSelector((state) => state.site);

  useEffect(() => {
    if ((updateProductCategoryInfo && updateProductCategoryInfo.data && siteDetails && siteDetails.data && siteDetails.data.length)) {
      dispatch(getHelpdeskSettingDetails(siteDetails.data[0].id, appModels.MAINTENANCECONFIG));
    }
  }, [updateProductCategoryInfo]);

  function handleSubmit(values) {
    if (helpdeskSettingsInfo && helpdeskSettingsInfo.data && helpdeskSettingsInfo.data.length) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const postData = {
        at_start_mro: values.at_start_mro,
        at_review_mro: values.at_review_mro,
        at_done_mro: values.at_done_mro,
        is_auto_confirm: values.is_auto_confirm,
        qr_scan_at_start: values.qr_scan_at_start,
        qr_scan_at_done: values.qr_scan_at_done,
        nfc_scan_at_start: values.nfc_scan_at_start,
        nfc_scan_at_done: values.nfc_scan_at_done,
        is_photo_mandatory: values.is_photo_mandatory,
        qr_code_image: values.qr_code_image,
        submit_globally_in_app: values.submit_globally_in_app,
        is_smartlogger_scan: values.is_smartlogger_scan,
        auto_sync_interval_mobile: values.auto_sync_interval_mobile,
        os_app_id: values.os_app_id,
        os_url: values.os_url,
        has_audit_mode_qr: values.has_audit_mode_qr,
        has_audit_mode_nfc: values.has_audit_mode_nfc,
        has_audit_mode_rfid: values.has_audit_mode_rfid,
        has_audit_mode_manual: values.has_audit_mode_manual,
        is_generate_one_wo_for_each_reading: values.is_generate_one_wo_for_each_reading,
        os_app_key: values.os_app_key,
        response: values.response,
        hspace_app_key: values.hspace_app_key,
        hsense_app_url: values.hsense_app_url,
        hsense_support_email: values.hsense_support_email,
        hsense_website_url: values.hsense_website_url,
        resource_calendar_id: extractValueObjects(values.resource_calendar_id),
      };
      dispatch(updateProductCategory(helpdeskSettingsInfo.data[0].id, appModels.MAINTENANCECONFIG, postData));
    }
  }

  const handleReset = (resetForm) => {
    if (document.getElementById('MaintenanceSettingsForm')) {
      document.getElementById('MaintenanceSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    resetForm();
    closeModal();
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
          initialValues={editId && helpdeskSettingsInfo && helpdeskSettingsInfo.data ? (helpdeskSettingsInfo.data[0]) : formInitialValues}
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
                  paddingRight: '15px',
                }}
              >
                <div className="createFormScrollbar">
                  {(addProductCategoryInfo && !addProductCategoryInfo.data && !addProductCategoryInfo.loading) && (
                    <ThemeProvider theme={theme}>
                      <div>
                        <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
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
                  successMessage={addProductCategoryInfo.data ? 'Maintenance settings added successfully..' : 'Maintenance settings are updated successfully..'}
                />
              )}
              <hr /> */}
                </div>
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
              </Box>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateProductCategoryInfo : addProductCategoryInfo}
                headerImage={preventiveMaintenance}
                headerText="Maintenance Settings"
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
