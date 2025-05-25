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
import WorkPermitBlue from '@images/icons/workPermitBlue.svg';

import BasicForm from './forms/workpermitSettingsBasicForm';
import validationSchema from './formModel/settingsValidationSchema';
import checkoutFormModel from './formModel/settingsCheckoutFormModel';
import formInitialValues from './formModel/settingsFormInitialValues';
import WorkPernitStateEmailForm from './forms/workPermitStateEmailForm';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject,
  extractValueObjects,
  getArrayNewFormatUpdateDelete,
} from '../../../util/appUtils';

import { updateProductCategory } from '../../../pantryManagement/pantryService';
import { getWorkpermitSettingDetails } from '../../siteService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddWorkPermitSettings = (props) => {
  const { closeModal, editId } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const {
    workpermitSettingsInfo, siteDetails,
  } = useSelector((state) => state.site);

  useEffect(() => {
    if ((updateProductCategoryInfo && updateProductCategoryInfo.data && siteDetails && siteDetails.data && siteDetails.data.length)) {
      dispatch(getWorkpermitSettingDetails(siteDetails.data[0].id, appModels.WPCONFIGURATION));
    }
  }, [updateProductCategoryInfo]);

  function getNewRequestArray(array) {
    let requestProduts = [];
    if (array && array.length > 0) {
      requestProduts = array.map((pl) => ({
        id: pl.id,
        state: pl.state,
        message_type: pl.message_type,
        is_authorizer: pl.is_authorizer === '' ? false : pl.is_authorizer,
        is_ehs: pl.is_ehs === '' ? false : pl.is_ehs,
        is_vendor: pl.is_vendor === '' ? false : pl.is_vendor,
        is_requestor: pl.is_requestor === '' ? false : pl.is_requestor,
        is_security: pl.is_vendor === '' ? false : pl.is_security,
        recipients_ids: pl.recipients_ids_new,
        isRemove: pl.isRemove,
      }));
    }
    return requestProduts;
  }

  function handleSubmit(values) {
    if (workpermitSettingsInfo && workpermitSettingsInfo.data && workpermitSettingsInfo.data.length) {
      setIsOpenSuccessAndErrorModalWindow(true);
      let orderData = [];
      if (values.line_ids && values.line_ids.length > 0) {
        orderData = getNewRequestArray(values.line_ids);
      }
      // closeModal();
      const postData = {
        work_location: values.work_location,
        asset_type: values.asset_type,
        line_ids: values.line_ids && values.line_ids.length > 0 ? getArrayNewFormatUpdateDelete(orderData) : false,
        po_reference: values.po_reference,
        is_parts_required: values.is_parts_required,
        is_prepared_required: values.is_prepared_required,
        is_ehs_required: values.is_ehs_required,
        review_required: values.review_required,
        night_shift_from: values.night_shift_from,
        night_shift_to: values.night_shift_to,
        night_approval_authority_shift_id: extractValueObjects(values.night_approval_authority_shift_id),
        night_from_time_editable: values.night_from_time_editable,
        night_to_time_editable: values.night_to_time_editable,
        ngt_max_dur_from_time: values.ngt_max_dur_from_time,
        ngt_max_dur_to_time: values.ngt_max_dur_to_time,
        night_title: values.night_title,
        is_night_type_of_work: values.is_night_type_of_work,
        special_shift_from: values.special_shift_from,
        special_shift_to: values.special_shift_to,
        special_approval_authority_shift_id: extractValueObjects(values.special_approval_authority_shift_id),
        special_from_time_editable: values.special_from_time_editable,
        special_to_time_editable: values.special_to_time_editable,
        spl_max_dur_from_time: values.spl_max_dur_from_time,
        spl_max_dur_to_time: values.spl_max_dur_to_time,
        special_title: values.special_title,
        is_special_type_of_work: values.is_special_type_of_work,
        general_shift_from: values.general_shift_from,
        general_shift_to: values.general_shift_to,
        general_approval_authority_shift_id: extractValueObjects(values.general_approval_authority_shift_id),
        general_from_time_editable: values.general_from_time_editable,
        general_to_time_editable: values.general_to_time_editable,
        gen_max_dur_from_time: values.gen_max_dur_from_time,
        gen_max_dur_to_time: values.gen_max_dur_to_time,
        general_title: values.general_title,
        is_general_type_of_work: values.is_general_type_of_work,
        request_message_type: values.request_message_type,
        request_authorizer: values.request_authorizer,
        authorized_message_type: values.authorized_message_type,
        authorized_authorizer: values.authorized_authorizer,
        authorized_ehs: values.authorized_ehs,
        authorized_vendor: values.authorized_vendor,
        authorized_requestor: values.authorized_requestor,
        prepared_message_type: values.prepared_message_type,
        prepared_authorizer: values.prepared_authorizer,
        prepared_requestor: values.prepared_requestor,
        prepared_ehs: values.prepared_ehs,
        issued_message_type: values.issued_message_type,
        issued_authorizer: values.issued_authorizer,
        issued_ehs: values.issued_ehs,
        issued_vendor: values.issued_vendor,
        issued_requestor: values.issued_requestor,
        issued_security: values.issued_security,
        ehs_message_type: values.ehs_message_type,
        ehs_authorizer: values.ehs_authorizer,
        ehs_ehs: values.ehs_ehs,
        ehs_vendor: values.ehs_vendor,
        ehs_requestor: values.ehs_requestor,
        ehs_security: values.ehs_security,
        order_message_type: values.order_message_type,
        order_review: values.order_review,
        order_authorizer: values.order_authorizer,
        closed_message_type: values.closed_message_type,
        closed_authorizer: values.closed_authorizer,
        closed_ehs: values.closed_ehs,
        closed_vendor: values.closed_vendor,
        closed_requestor: values.closed_requestor,
        closed_security: values.closed_security,
        within_a_day: values.within_a_day,
        requested_status: values.requested_status,
        approved_status: values.approved_status,
        prepared_status: values.prepared_status,
        issued_permit_status: values.issued_permit_status,
        validated_status: values.validated_status,
        work_in_progress_status: values.work_in_progress_status,
        on_hold_status: values.on_hold_status,
        closed_status: values.closed_status,
        permit_rejected_status: values.permit_rejected_status,
        elapsed_status: values.elapsed_status,
        cancel_status: values.cancel_status,
        requested_button: values.requested_button,
        approved_button: values.approved_button,
        prepared_button: values.prepared_button,
        issued_permit_button: values.issued_permit_button,
        validated_button: values.validated_button,
        work_in_progress_button: values.work_in_progress_button,
        on_hold_button: values.on_hold_button,
        closed_button: values.closed_button,
        permit_rejected_button: values.permit_rejected_button,
        elapsed_button: values.elapsed_button,
        cancel_button: values.cancel_button,
        edit_actual_start_dt: values.edit_actual_start_dt,
        edit_actual_end_dt: values.edit_actual_end_dt,
        is_enable_type_of_work: values.is_enable_type_of_work,
        type_of_work_access_level: values.type_of_work_access_level,
        is_enable_department: values.is_enable_department,
        department_access_level: values.department_access_level,
      };
      dispatch(updateProductCategory(workpermitSettingsInfo.data[0].id, appModels.WPCONFIGURATION, postData));
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
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0 helpDesk-form">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && workpermitSettingsInfo && workpermitSettingsInfo.data ? trimJsonObject(workpermitSettingsInfo.data[0]) : formInitialValues}
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
                    <WorkPernitStateEmailForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                  </div>
                </ThemeProvider>
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (workpermitSettingsInfo && workpermitSettingsInfo.loading)) && (
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
                  successMessage={addProductCategoryInfo.data ? 'Work Permit settings added successfully..' : 'Work Permit settings are updated successfully..'}
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
                headerImage={WorkPermitBlue}
                headerText="Work Permit Settings"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddWorkPermitSettings.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AddWorkPermitSettings;
