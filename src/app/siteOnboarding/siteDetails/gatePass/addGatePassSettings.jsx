/* eslint-disable no-lone-blocks */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import PromptIfUnSaved from '@shared/unSavedPrompt';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import InventoryBlue from '@images/icons/inventoryBlue.svg';

import BasicForm from './forms/gatePassSettingsBasicForm';
import OrderLineForm from './forms/requesteeForm';
import validationSchema from './formModel/settingsValidationSchema';
import checkoutFormModel from './formModel/settingsCheckoutFormModel';
import formInitialValues from './formModel/settingsFormInitialValues';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject,
  extractValueObjects, getArrayNewFormatUpdateDelete, getColumnArrayById, isArrayColumnExists,
} from '../../../util/appUtils';
// import HelpdeskStateEmailForm from './forms/helpdeskStateEmailForm';
import { updateProductCategory, resetUpdateProductCategory } from '../../../pantryManagement/pantryService';
import { getGatePassDetails } from '../../siteService';
import { getOperationData, getChecklistData } from '../../../preventiveMaintenance/ppmService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddGatePassSettings = (props) => {
  const { closeModal, editId } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const {
    gatePassSettingsInfo, siteDetails,
  } = useSelector((state) => state.site);

  useEffect(() => {
    dispatch(resetUpdateProductCategory());
    dispatch(getChecklistData());
  }, []);

  useEffect(() => {
    if ((updateProductCategoryInfo && updateProductCategoryInfo.data && siteDetails && siteDetails.data && siteDetails.data.length)) {
      dispatch(getGatePassDetails(siteDetails.data[0].id, appModels.GATEPASSCONFIGURATION));
    }
  }, [updateProductCategoryInfo]);

  useEffect(() => {
    if (gatePassSettingsInfo && gatePassSettingsInfo.data && gatePassSettingsInfo.data.length && gatePassSettingsInfo.data[0].id) {
      dispatch(getOperationData(gatePassSettingsInfo.data[0].id, appModels.GATEPASSCONFIGURATION));
    }
  }, [gatePassSettingsInfo]);

  let subCategoryValues = gatePassSettingsInfo && gatePassSettingsInfo.data && gatePassSettingsInfo.data.length > 0 ? gatePassSettingsInfo.data[0].order_lines : [];

  useEffect(() => {
    if (gatePassSettingsInfo && gatePassSettingsInfo.data && gatePassSettingsInfo.data.length) {
      subCategoryValues = gatePassSettingsInfo && gatePassSettingsInfo.data && gatePassSettingsInfo.data.length > 0 ? gatePassSettingsInfo.data[0].order_lines : [];
    }
  }, [gatePassSettingsInfo]);

  function getRecipientPost(arr) {
    let recipienPost = arr;
    if (isArrayColumnExists(arr || [], 'id')) {
      let selectedCompanies = getColumnArrayById(arr, 'id');
      const appendSelectedCompany = extractValueObjects(arr);
      const isParentExists = selectedCompanies.filter((item) => item === appendSelectedCompany);
      if (isParentExists && !isParentExists.length) {
        selectedCompanies = [...selectedCompanies];
      }
      recipienPost = [[6, false, selectedCompanies]];
    }
    return recipienPost;
  }

  function getNewRequestArray(array) {
    let requestProduts = [];
    if (array && array.length > 0) {
      requestProduts = array.map((pl) => ({
        id: pl.id,
        state: pl.state,
        is_requestee: pl.is_requestee === '' ? false : pl.is_requestee,
        recipients_ids: getRecipientPost(pl.recipients_ids),
        isRemove: pl.isRemove,
      }));
    }
    return requestProduts;
  }

  function checkArrayhasData(array) {
    const newData = [];
    if (array.length) {
      for (let i = 0; i < array.length; i += 1) {
        const p = array[i];
        // p.state = p.state[1];
        // p.check_list_id = p.check_list_id[0];
        // p.category_type = p.category_type ? p.category_type[0] : '';
        // p.equipment_id = p.equipment_id ? p.equipment_id[0] : false;
        // p.location_id = p.location_id ? p.location_id[0] : false;
        p.id = p.id;
        p.state = p.state;
        p.is_requestee = p.is_requestee === '' ? false : p.is_requestee;
        p.recipients_ids = p.recipients_ids ? p.recipients_ids : false;
        p.isRemove = p.isRemove;
        newData.push(p);
      }
    }
    return newData;
  }

  function handleSubmit(values) {
    if (gatePassSettingsInfo && gatePassSettingsInfo.data && gatePassSettingsInfo.data.length) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeModal();
      let orderData = [];
      if (values.order_lines && values.order_lines.length > 0) {
        orderData = getNewRequestArray(values.order_lines);
      }
      const postData = {
        bearer_email: values.bearer_email,
        bearer_mobile: values.bearer_mobile,
        attachment: values.attachment,
        space: values.space,
        reference: values.reference,
        reference_display: values.reference_display,
        approval_required: values.approval_required,
        approval_button: values.approval_button,
        company_id: extractValueObjects(values.company_id),
        uuid: values.uuid,
        order_lines: values.order_lines && values.order_lines.length > 0 ? getArrayNewFormatUpdateDelete(getNewRequestArray(values.order_lines)) : false,
      };
      if (isArrayColumnExists(values.approval_recipients_ids ? values.approval_recipients_ids : [], 'id')) {
        let selectedCompanies = getColumnArrayById(values.approval_recipients_ids, 'id');
        const appendSelectedCompany = extractValueObjects(values.approval_recipients_ids);
        const isParentExists = selectedCompanies.filter((item) => item === appendSelectedCompany);
        if (isParentExists && !isParentExists.length) {
          selectedCompanies = [...selectedCompanies];
        }
        postData.approval_recipients_ids = [[6, false, selectedCompanies]];
      }
      dispatch(updateProductCategory(gatePassSettingsInfo.data[0].id, appModels.GATEPASSCONFIGURATION, postData));
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
          initialValues={editId && gatePassSettingsInfo && gatePassSettingsInfo.data && gatePassSettingsInfo.data.length ? trimJsonObject(gatePassSettingsInfo.data[0]) : formInitialValues}
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
                    <OrderLineForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} subCategoryValues={subCategoryValues} />
                  </div>
                </ThemeProvider>
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (gatePassSettingsInfo && gatePassSettingsInfo.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(addProductCategoryInfo && addProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={addProductCategoryInfo} />
              )}
              {(updateProductCategoryInfo && updateProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={updateProductCategoryInfo} />
              )}
              <hr />
              <div className="float-right m-4">
                <div className="bg-lightblue sticky-button-1250drawer">
                  <Button
                    disabled={!editId ? !(isValid && dirty) : !isValid}
                    type="submit"
                    size="sm"
                   variant="contained"
                  >
                    {!editId ? 'Add' : 'Update'}
                  </Button>
                </div>
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateProductCategoryInfo : addProductCategoryInfo}
                headerImage={InventoryBlue}
                headerText="GatePass Settings"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddGatePassSettings.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AddGatePassSettings;
