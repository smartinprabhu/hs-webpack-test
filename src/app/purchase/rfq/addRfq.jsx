/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Button, Row, Card, CardBody,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import PurchaseHandBlue from '@images/icons/purchaseHandBlue.svg';

import BasicForm from './forms/basicForm';
import ProductsForm from './forms/productsForm';
import ProductUpdateForm from './forms/productUpdateForm';
import AdditionalForm from './forms/additionalForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createRfq, getRequestQuotationList, getRequestQuotationCount,
  updateRfq,
} from '../purchaseService';
import { getPartsData } from '../../preventiveMaintenance/ppmService';
import theme from '../../util/materialTheme';
import {
  getArrayNewFormat, getArrayNewFormatUpdateDelete, trimJsonObject, getAllowedCompanies, getDateTimeUtc,
} from '../../util/appUtils';
import { getNewRequestArray, getOrderLinesRequest } from '../utils/utils';
import {
  checkProductId, getProductsLength, checkSheduleDate, checkProductsScheduleDate, checkRequiredFields,
} from './utils/utils';
import './rfqDetails/style.scss';
import ProductDetails from './rfqDetails/products';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddRfq = (props) => {
  const {
    editId,
    afterReset,
    closeAddModal,
    closeEditModal,
    purchaseAgreementId,
    vendorId,
  } = props;
  const dispatch = useDispatch();
  const [isDone, setIsDone] = useState(false);
  const [dateError, setDateError] = useState(false);
  const orderDateNotVisibleState = ['purchase', 'done', 'cancel'];
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { addRfqInfo, quotationDetails, updateRfqInfo } = useSelector((state) => state.purchase);
  const { partsSelected } = useSelector((state) => state.ppm);

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  useEffect(() => {
    if ((userInfo && userInfo.data) && (addRfqInfo && addRfqInfo.data)) {
      const statusValues = [];
      const orderValues = [];
      const vendorValues = [];
      const customFilters = '';
      dispatch(getRequestQuotationList(companies, appModels.PURCHASEORDER, limit, offsetValue, statusValues, orderValues, vendorValues, customFilters, sortByValue, sortFieldValue));
      dispatch(getRequestQuotationCount(companies, appModels.PURCHASEORDER, statusValues, orderValues, vendorValues, customFilters));
      dispatch(getPartsData([]));
    }
  }, [userInfo, addRfqInfo]);

  function checkArrayhasDataProduct(data) {
    let result = [];
    if (data && data.length) {
      result = data.filter((item) => (item.product_id && (typeof item.product_id === 'number')));
    }
    return result;
  }

  function checkDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtc(data);
    }
    return result;
  }

  function handleSubmit(values) {
    setDateError(false);
    if (quotationDetails && quotationDetails.data) {
      let orderData = [];
      if (values.order_line && values.order_line.length > 0) {
        const orderDataLine = getOrderLinesRequest(values.order_line);
        orderData = getNewRequestArray(orderDataLine);
      }
      let dateOrder = values.date_order ? values.date_order : false;
      let datePlanned = values.date_planned ? values.date_planned : false;
      if (checkDatehasObject(dateOrder)) {
        dateOrder = getDateTimeUtc(dateOrder);
      }
      if (checkDatehasObject(datePlanned)) {
        datePlanned = getDateTimeUtc(datePlanned);
      }

      const postDataValues = {
        partner_id: values.partner_id ? values.partner_id.id : '',
        incoterm_id: values.incoterm_id ? values.incoterm_id.id : '',
        picking_type_id: values.picking_type_id ? values.picking_type_id.id : '',
        requisition_id: values.requisition_id ? values.requisition_id.id : '',
        request_id: values.request_id ? values.request_id.id : '',
        user_id: values.user_id ? values.user_id.id : '',
        invoice_status: values.invoice_status ? values.invoice_status.value : '',
        payment_term_id: values.payment_term_id ? values.payment_term_id.id : '',
        fiscal_position_id: values.fiscal_position_id ? values.fiscal_position_id.id : '',
        date_order: dateOrder,
        date_planned: datePlanned,
        partner_ref: values.partner_ref,
        order_line: values.order_line && values.order_line.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : false,
        amount_untaxed: values.amount_untaxed,
        amount_tax: values.amount_tax,
        amount_total: values.amount_total,
      };
      const id = quotationDetails && quotationDetails.data ? quotationDetails.data[0].id : '';
      const state = quotationDetails && quotationDetails.data ? quotationDetails.data[0].state : '';
      const productSheduleDate = orderDateNotVisibleState.includes(state) ? true
        : checkSheduleDate(dateOrder, datePlanned);
      if (checkProductsScheduleDate(dateOrder, values.order_line) && productSheduleDate) {
        setDateError(false);
        setIsOpenSuccessAndErrorModalWindow(true);
        closeEditModal();
        dispatch(updateRfq(id, appModels.PURCHASEORDER, postDataValues));
      } else {
        setDateError(true);
      }
    } else {
      let partnerId = false;
      if (values.partner_id && values.partner_id.id) {
        partnerId = values.partner_id.id;
      } else {
        partnerId = values.partner_id.length && values.partner_id.length > 0 ? values.partner_id[0] : false;
      }
      const companyId = values.company_id.id;
      const incotermId = values.incoterm_id && values.incoterm_id.id
        ? values.incoterm_id.id : false;
      const pickingTypeId = values.picking_type_id && values.picking_type_id.id
        ? values.picking_type_id.id : false;
      const requisitionId = values.requisition_id && values.requisition_id.id
        ? values.requisition_id.id : false;
      const requestId = values.request_id && values.request_id.id
        ? values.request_id.id : false;
      const userId = values.user_id && values.user_id.id
        ? values.user_id.id : false;
      const invoiceStatus = values.invoice_status && values.invoice_status.value
        ? values.invoice_status.value : '';
      const paymentTermId = values.payment_term_id && values.payment_term_id.id
        ? values.payment_term_id.id : '';
      const fiscalPositionId = values.fiscal_position_id && values.fiscal_position_id.id
        ? values.fiscal_position_id.id : '';
      let dateOrder = values.date_order ? values.date_order : false;
      let datePlanned = values.date_planned ? values.date_planned : false;
      if (checkDatehasObject(dateOrder)) {
        dateOrder = getDateTimeUtc(dateOrder);
      }
      if (checkDatehasObject(datePlanned)) {
        datePlanned = getDateTimeUtc(datePlanned);
      }
      const postData = { ...values };

      postData.partner_id = partnerId;
      postData.company_id = companyId;
      postData.picking_type_id = pickingTypeId;
      postData.requisition_id = requisitionId;
      postData.request_id = requestId;
      postData.incoterm_id = incotermId;
      postData.user_id = userId;
      postData.invoice_status = invoiceStatus;
      postData.payment_term_id = paymentTermId;
      postData.fiscal_position_id = fiscalPositionId;
      postData.date_order = dateOrder;
      postData.date_planned = datePlanned;
      let orderData = [];
      if (values.order_line && values.order_line.length > 0) {
        const orderDataLine = getOrderLinesRequest(values.order_line);
        orderData = getNewRequestArray(orderDataLine);
        postData.order_line = getArrayNewFormat(orderData);
      }
      const payload = { model: appModels.PURCHASEORDER, values: postData };
      if (checkSheduleDate(dateOrder, datePlanned) && checkProductsScheduleDate(dateOrder, values.order_line)) {
        setDateError(false);
        setIsOpenSuccessAndErrorModalWindow(true);
        closeAddModal();
        dispatch(createRfq(appModels.PURCHASEORDER, payload));
      } else {
        setDateError(true);
      }
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

  const handleUpdateReset = () => {
    setIsDone(true);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const state = quotationDetails && quotationDetails.data ? quotationDetails.data[0].state : false;
  const currentState = !!(state && (state === 'done' || state === 'cancel'));

  const productLength = partsSelected && partsSelected.length > 0 ? getProductsLength(partsSelected) : true;

  const closeAddMaintenance = () => {
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={quotationDetails && quotationDetails.data ? trimJsonObject(quotationDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, resetForm, setFieldTouched,
          }) => (
            <Form id={formId}>
              {(isDone || ((addRfqInfo && addRfqInfo.data)
                  || (updateRfqInfo && updateRfqInfo.data) || (updateRfqInfo && updateRfqInfo.loading))) ? ('') : (
                    <ThemeProvider theme={theme}>
                      <div className="pt-1 pr-5 pl-2 pb-5 mr-2 ml-4">
                        <BasicForm
                          editId={editId}
                          formField={formField}
                          setFieldValue={setFieldValue}
                          setFieldTouched={setFieldTouched}
                          purchaseAgreementId={purchaseAgreementId}
                          vendorId={vendorId}
                        />
                        {!currentState ? (
                          <>
                            {(quotationDetails && quotationDetails.data) ? (
                              <ProductUpdateForm setFieldValue={setFieldValue} />
                            )
                              : (
                                <ProductsForm setFieldValue={setFieldValue} />
                              )}
                          </>
                        ) : (
                          <>
                            <Card className="no-border-radius mt-2 mb-2">
                              <CardBody className="p-0 bg-porcelain">
                                <p className="ml-3 mb-1 mt-1 font-weight-600 font-side-heading">Products</p>
                              </CardBody>
                            </Card>
                            <ProductDetails />
                          </>
                        )}
                        <AdditionalForm editId={editId} formField={formField} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                      </div>
                    </ThemeProvider>
                )}
              {addRfqInfo && addRfqInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {(addRfqInfo && addRfqInfo.err) && (
              <SuccessAndErrorFormat response={addRfqInfo} />
              )}
              {(addRfqInfo && addRfqInfo.data) && (
              <SuccessAndErrorFormat response={addRfqInfo} successMessage="Quotation added successfully.." />
              )}
              {updateRfqInfo && updateRfqInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {dateError && (
                <div className="text-danger text-center mt-3">
                  <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                    {orderDateNotVisibleState.includes(state) ? 'Schedule dates under products should be greater than order date '
                      : 'Schedule Date & schedule dates under products should be greater than order date.'}
                </div>
              )}
              {(updateRfqInfo && updateRfqInfo.err) && (
              <SuccessAndErrorFormat response={updateRfqInfo} />
              )}
              {(updateRfqInfo && updateRfqInfo.data) && (
              <SuccessAndErrorFormat response={updateRfqInfo} successMessage="Quotation updated successfully.." />
              )}
              <br />
              {(quotationDetails && !quotationDetails.data && !quotationDetails.loading && !quotationDetails.err) && (
                <div className="bg-lightblue sticky-button-1250drawer">
                {(addRfqInfo && addRfqInfo.data) ? (
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
                    disabled={!(isValid && dirty) || addRfqInfo.loading || ((partsSelected && !partsSelected.length > 0) || !checkProductId(partsSelected) || !checkRequiredFields(partsSelected))}
                    type="submit"
                    size="sm"
                     variant="contained"
                  >
                    Create
                  </Button>
                )}
              </div>
              )}
              {(quotationDetails && (quotationDetails.data || quotationDetails.err) && !quotationDetails.loading) && (
              <div className="bg-lightblue sticky-button-1250drawer">
                {(updateRfqInfo && !updateRfqInfo.data) && (
                <Button
                  disabled={!isValid || updateRfqInfo.loading || ((productLength) || !checkProductId(partsSelected) || !checkRequiredFields(partsSelected))}
                  type="submit"
                  size="sm"
                   variant="contained"
                >
                  Update
                </Button>
                )}
              </div>
              )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateRfqInfo : addRfqInfo}
                headerImage={PurchaseHandBlue}
                headerText="Request for Quotation"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
        {(quotationDetails && (quotationDetails.data || quotationDetails.err)) && (
          <div className="float-right m-4">
            {(updateRfqInfo && updateRfqInfo.data) && (
              <Button
                type="button"
                size="sm"
                 variant="contained"
                onClick={() => handleUpdateReset()}
              >
                Ok
              </Button>
            )}
          </div>
        )}
      </Col>
    </Row>
  );
};

AddRfq.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  closeAddModal: PropTypes.func.isRequired,
  closeEditModal: PropTypes.func.isRequired,
  purchaseAgreementId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  vendorId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddRfq;
