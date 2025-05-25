/* eslint-disable no-lone-blocks */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Button,
} from '@mui/material';

import PromptIfUnSaved from '@shared/unSavedPrompt';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import InventoryBlue from '@images/icons/inventoryBlue.svg';

import BasicForm from './forms/inventorySettingsBasicForm';
import validationSchema from './formModel/settingsValidationSchema';
import checkoutFormModel from './formModel/settingsCheckoutFormModel';
import formInitialValues from './formModel/settingsFormInitialValues';
import theme from '../../../util/materialTheme';
import {

  extractValueObjects, getColumnArrayById, getArrayNewFormatUpdateDelete, isArrayColumnExists,
} from '../../../util/appUtils';

import { updateProductCategory } from '../../../pantryManagement/pantryService';
import { getInventorySettingDetails } from '../../siteService';
import InventoryStateEmailForm from './forms/inventoryStateEmailForm';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const InventorySettings = (props) => {
  const { closeModal, editId } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const {
    inventorySettingsInfo, siteDetails,
  } = useSelector((state) => state.site);

  useEffect(() => {
    if ((updateProductCategoryInfo && updateProductCategoryInfo.data && siteDetails && siteDetails.data && siteDetails.data.length)) {
      dispatch(getInventorySettingDetails(siteDetails.data[0].id, appModels.INVENTORYCONFIG));
    }
  }, [updateProductCategoryInfo]);

  let subCategoryValues = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length > 0 ? inventorySettingsInfo.data[0].line_ids : [];

  useEffect(() => {
    if (inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length) {
      subCategoryValues = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length > 0 ? inventorySettingsInfo.data[0].line_ids : [];
    }
  }, [inventorySettingsInfo]);

  function getNewRequestArray(array) {
    let requestProduts = [];
    if (array && array.length > 0) {
      requestProduts = array.map((pl) => ({
        id: pl.id,
        request_state: pl.request_state,
        code: pl.code,
        is_requestee: pl.is_requestee === '' ? false : pl.is_requestee,
        is_recipients: pl.is_recipients === '' ? false : pl.is_recipients,
        is_send_email: pl.is_send_email === '' ? false : pl.is_send_email,
        recipients_ids: pl.recipients_ids_new,
        isRemove: pl.isRemove,
      }));
    }
    return requestProduts;
  }

  function handleSubmit(values) {
    if (inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length) {
      setIsOpenSuccessAndErrorModalWindow(true);
      //closeModal();
      let orderData = [];
      if (values.line_ids && values.line_ids.length > 0) {
        orderData = getNewRequestArray(values.line_ids);
      }
      const postData = {
        import_batch_size: values.import_batch_size,
        products_list_access: extractValueObjects(values.products_list_access),
        is_reorder_level_email: values.is_reorder_level_email,
        include_reminder_alert_items: values.include_reminder_alert_items,
        product_list_company_id: extractValueObjects(values.product_list_company_id),
        line_ids: values.line_ids && values.line_ids.length > 0 ? getArrayNewFormatUpdateDelete(orderData) : false,
      };
      if (isArrayColumnExists(values.recipients_ids ? values.recipients_ids : [], 'id')) {
        let selectedCompanies = getColumnArrayById(values.recipients_ids, 'id');
        const appendSelectedCompany = extractValueObjects(values.recipients_ids);
        const isParentExists = selectedCompanies.filter((item) => item === appendSelectedCompany);
        if (isParentExists && !isParentExists.length) {
          selectedCompanies = [...selectedCompanies];
        }
        postData.recipients_ids = [[6, false, selectedCompanies]];
      }
      dispatch(updateProductCategory(inventorySettingsInfo.data[0].id, appModels.INVENTORYCONFIG, postData));
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
          initialValues={editId && inventorySettingsInfo.data && inventorySettingsInfo.data.length > 0 ? (inventorySettingsInfo.data[0]) : formInitialValues}
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
                    <InventoryStateEmailForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} subCategoryValues={subCategoryValues} />
                  </div>
                </ThemeProvider>
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (inventorySettingsInfo && inventorySettingsInfo.loading)) && (
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
                headerText="Inventory Settings"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

InventorySettings.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default InventorySettings;
