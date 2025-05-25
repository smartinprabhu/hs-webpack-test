/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Button, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import PurchaseHandBlue from '@images/icons/purchaseHandBlue.svg';

import BasicForm from './forms/basicForm';
import MasterForm from './forms/masterForm';
import RequestorForm from './forms/requestorForm';
import ProductUpdateForm from './forms/productUpdateForm';
import ProductsForm from './forms/productsForm';
import DescriptionForm from './forms/descriptionForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createPurchaseRequest, getPurchaseRequestList, getPurchaseRequestCount,
  storeContacts,
} from '../purchaseService';
import {
  updateTenant,
} from '../../adminSetup/setupService';
import theme from '../../util/materialTheme';
import {
  getArrayNewFormat, trimJsonObject, getAllowedCompanies, getArrayNewFormatUpdateDelete,
} from '../../util/appUtils';
import { getPurchaseLinesRequest, getNewPurchaseRequestArray } from './utils/utils';
import { getProductsLength } from '../rfq/utils/utils';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddPurchaseRequest = (props) => {
  const {
    editId,
    isTheme,
    isModal,
    afterReset,
  } = props;
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { addPurchaseRequestInfo, requestDetails } = useSelector((state) => state.purchase);
  const { partsSelected } = useSelector((state) => state.ppm);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  useEffect(() => {
    dispatch(storeContacts([]));
  }, []);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (addPurchaseRequestInfo && addPurchaseRequestInfo.data)) {
      const statusValues = [];
      const orderValues = [];
      const vendorValues = [];
      const customFilters = '';
      dispatch(getPurchaseRequestList(companies, appModels.PURCHASEREQUEST, limit, offsetValue, statusValues, orderValues, vendorValues, customFilters, sortByValue, sortFieldValue));
      dispatch(getPurchaseRequestCount(companies, appModels.PURCHASEREQUEST, statusValues, orderValues, vendorValues, customFilters));
    }
  }, [userInfo, addPurchaseRequestInfo]);

  function checkArrayhasDataProduct(data) {
    let result = [];
    if (data && data.length) {
      result = data.filter((item) => (item.product_id && (typeof item.product_id === 'number')));
    }
    return result;
  }

  function handleSubmit(values) {
    if (editId) {
      if (!isModal) {
        setIsOpenSuccessAndErrorModalWindow(true);
        afterReset();
      }
      let requestData = [];
      if (values.request_line && values.request_line.length > 0) {
        const requestDataLine = getPurchaseLinesRequest(values.request_line);
        requestData = getNewPurchaseRequestArray(requestDataLine);
      }
      const postData = {
        requisition_name: values.requisition_name,
        requestor_full_name: values.requestor_full_name,
        requestor_email: values.requestor_email,
        site_spoc: values.site_spoc,
        site_contact_details: values.site_contact_details,
        bill_to_address: values.bill_to_address,
        ship_to_address: values.ship_to_address,
        comments: values.comments,
        HS_requisition_id: values.HS_requisition_id,
        project_id: values.project_id ? values.project_id.id : '',
        account_id: values.account_id ? values.account_id.id : '',
        location_id: values.location_id ? values.location_id.id : '',
        budget_id: values.budget_id ? values.budget_id.id : '',
        sub_category_id: values.sub_category_id ? values.sub_category_id.id : '',
        partner_id: values.partner_id ? values.partner_id.id : '',
        request_line: values.request_line && values.request_line.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(requestData)) : false,
      };
      dispatch(updateTenant(editId, postData, appModels.PURCHASEREQUEST));
    } else {
      if (isModal) {
        setIsOpenSuccessAndErrorModalWindow(true);
        afterReset();
      }
      const projectId = values.project_id.id;
      const accountId = values.account_id.id;
      const locationId = values.location_id.id;
      const budgetId = values.budget_id.id;
      const subCategoryId = values.sub_category_id.id;
      const partnerId = values.partner_id.id;

      const postData = { ...values };

      postData.project_id = projectId;
      postData.account_id = accountId;
      postData.location_id = locationId;
      postData.budget_id = budgetId;
      postData.sub_category_id = subCategoryId;
      postData.partner_id = partnerId;

      let requestData = [];
      if (values.request_line && values.request_line.length > 0) {
        const requestDataLine = getPurchaseLinesRequest(values.request_line);
        requestData = getNewPurchaseRequestArray(requestDataLine);
        postData.request_line = getArrayNewFormat(requestData);
      }

      const payload = { model: appModels.PURCHASEREQUEST, values: postData };
      dispatch(createPurchaseRequest(appModels.PURCHASEREQUEST, payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const productLength = partsSelected && partsSelected.length > 0 ? getProductsLength(partsSelected) : true;

  const formData = (setFieldValue) => (
    <div className="pt-1 pr-5 pl-2 pb-2 mr-2 ml-4">
      <BasicForm formField={formField} editId={editId} />
      <Row className="mb-2 create-purchase-request-form">
        <Col xs={12} sm={6} md={6} lg={6} className="pr-5">
          <MasterForm formField={formField} editId={editId} setFieldValue={setFieldValue} />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6} className="pr-5">
          <RequestorForm formField={formField} editId={editId} setFieldValue={setFieldValue} />
        </Col>
      </Row>
      {(editId) ? (
        <ProductUpdateForm setFieldValue={setFieldValue} />
      )
        : (
          <ProductsForm setFieldValue={setFieldValue} />
        )}
      <DescriptionForm formField={formField} editId={editId} setFieldValue={setFieldValue} />
    </div>
  );

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={editId && requestDetails && requestDetails.data ? trimJsonObject(requestDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, resetForm,
          }) => (
            <Form id={formId}>
              {(addPurchaseRequestInfo && addPurchaseRequestInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.loading) ? ('')
                : (
                  <>
                    {!isTheme
                      ? (
                        <ThemeProvider theme={theme}>
                          {formData(setFieldValue)}
                        </ThemeProvider>
                      )
                      : formData(setFieldValue)}
                  </>
                )}
              {addPurchaseRequestInfo && addPurchaseRequestInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(addPurchaseRequestInfo && addPurchaseRequestInfo.err) && (
                <SuccessAndErrorFormat response={addPurchaseRequestInfo} />
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.err) && (
                <SuccessAndErrorFormat response={tenantUpdateInfo} />
              )}
              {(addPurchaseRequestInfo && addPurchaseRequestInfo.data) && (
                <SuccessAndErrorFormat response={addPurchaseRequestInfo} successMessage="Purchase added successfully.." />
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.data) && (
                <SuccessAndErrorFormat response={tenantUpdateInfo} successMessage="Purchase Updated successfully.." />
              )}
              <hr />
              <div className="float-right mr-4 mb-4">
                {(addPurchaseRequestInfo && addPurchaseRequestInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data) ? (
                  <Button
                    size="sm"
                     variant="contained"
                    onClick={handleReset.bind(null, resetForm)}
                  >
                    ok
                  </Button>
                ) : (
                  // eslint-disable-next-line react/jsx-no-useless-fragment
                  <>
                    {(addPurchaseRequestInfo && !addPurchaseRequestInfo.data && !addPurchaseRequestInfo.loading)
                      && (tenantUpdateInfo && !tenantUpdateInfo.data && !tenantUpdateInfo.loading) && (
                        <div className="bg-lightblue sticky-button-1250drawer">
                          <Button
                            disabled={!editId ? !(isValid && dirty) : !isValid}
                            type="submit"
                            size="sm"
                             variant="contained"
                          >
                            {!editId ? 'Create' : 'Update'}
                          </Button>
                        </div>
                    )}
                  </>
                )}
              </div>
              {/*
              {addPurchaseRequestInfo && addPurchaseRequestInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {(addPurchaseRequestInfo && addPurchaseRequestInfo.err) && (
              <SuccessAndErrorFormat response={addPurchaseRequestInfo} />
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.err) && (
              <SuccessAndErrorFormat response={tenantUpdateInfo} />
              )}
              {isModal && (addPurchaseRequestInfo && addPurchaseRequestInfo.data) && (
              <SuccessAndErrorFormat response={addPurchaseRequestInfo} successMessage="Purchase request added successfully.." />
              )}
              <hr />
              <div className="float-right m-4">
                {isModal && (addPurchaseRequestInfo && addPurchaseRequestInfo.data) ? (
                  <Button
                    type="button"
                    size="sm"
                     variant="contained"
                    onClick={handleReset.bind(null, resetForm)}
                  >
                    Ok
                  </Button>
                ) : (
                  <Button
                    disabled={!editId ? !(isValid && dirty)
                          || ((partsSelected && !partsSelected.length > 0) || !checkProductId(partsSelected) || !checkRequiredFields(partsSelected)) : !isValid
                        || ((productLength) || !checkProductId(partsSelected) || !checkRequiredFields(partsSelected))}
                    type="submit"
                    size="sm"
                     variant="contained"
                  >
                    {!editId ? 'Create' : 'Update'}
                  </Button>
                )}
                    </div> */}
              {!isModal
                ? (
                  <SuccessAndErrorModalWindow
                    isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                    setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                    type={editId ? 'update' : 'create'}
                    successOrErrorData={editId ? tenantUpdateInfo : addPurchaseRequestInfo}
                    headerImage={PurchaseHandBlue}
                    headerText="Purchase Request"
                    successRedirect={handleReset.bind(null, resetForm)}
                  />
                ) : '' }
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddPurchaseRequest.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  isTheme: PropTypes.bool,
  isModal: PropTypes.bool,
};

AddPurchaseRequest.defaultProps = {
  isTheme: false,
  isModal: false,
};

export default AddPurchaseRequest;
