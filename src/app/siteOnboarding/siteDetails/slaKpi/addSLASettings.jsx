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

import BasicForm from './forms/slaKpiSettingsBasicForm';
import validationSchema from './formModel/settingsValidationSchema';
import checkoutFormModel from './formModel/settingsCheckoutFormModel';
import formInitialValues from './formModel/settingsFormInitialValues';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject, getArrayNewFormatUpdateDelete, extractValueObjects,
} from '../../../util/appUtils';
import SlaKpiStateEmailForm from './forms/slaKpiStateEmailForm';

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
    siteDetails,
  } = useSelector((state) => state.site);
  const {
    slaAuditConfig,
  } = useSelector((state) => state.slaAudit);

  useEffect(() => {
    if ((updateProductCategoryInfo && updateProductCategoryInfo.data && siteDetails && siteDetails.data && siteDetails.data.length)) {
      dispatch(getVMSSettingDetails(siteDetails.data[0].id, appModels.SLAAUDITCONFIG));
    }
  }, [updateProductCategoryInfo]);

  function getNewRequestArray(array) {
    let requestProduts = [];
    if (array && array.length > 0) {
      requestProduts = array.map((pl) => ({
        id: pl.id,
        sla_state: pl.sla_state,
        is_requestee: pl.is_requestee === '' ? false : pl.is_requestee,
        is_recipients: pl.is_recipients === '' ? false : pl.is_recipients,
        is_send_email: pl.is_send_email === '' ? false : pl.is_send_email,
        recipients_ids: pl.recipients_ids_new,
        mail_template_id: pl.mail_template_id_new,
        isRemove: pl.isRemove,
      }));
    }
    return requestProduts;
  }

  function handleSubmit(values) {
    if (slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      let orderData = [];
      if (values.line_ids && values.line_ids.length > 0) {
        orderData = getNewRequestArray(values.line_ids);
      }
      const postData = {
        sla_category_access: extractValueObjects(values.sla_category_access),
        has_target: values.has_target,
        is_second_level_approval: values.is_second_level_approval,
        audit_template_access: extractValueObjects(values.audit_template_access),
        sla_json_data: values.sla_json_data,
        line_ids: values.line_ids && values.line_ids.length > 0 ? getArrayNewFormatUpdateDelete(orderData) : false,
      };
      dispatch(updateProductCategory(slaAuditConfig.data[0].id, appModels.SLAAUDITCONFIG, postData));
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
          initialValues={editId && slaAuditConfig && slaAuditConfig.data ? trimJsonObject(slaAuditConfig.data[0]) : formInitialValues}
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
                    <SlaKpiStateEmailForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                  </div>
                </ThemeProvider>
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (slaAuditConfig && slaAuditConfig.loading)) && (
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
                headerText="SLA KPI Settings"
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
