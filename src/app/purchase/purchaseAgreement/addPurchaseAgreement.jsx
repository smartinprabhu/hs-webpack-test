/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Button, Row, Card, CardBody,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import { Redirect } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import PurchaseHandBlue from '@images/icons/purchaseHandBlue.svg';

import BasicForm from './forms/basicForm';
import ProductsForm from './forms/productsForm';
import ProductUpdateForm from './forms/productUpdateForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createAgreementRequest, getPurchaseAgreementList, getPurchaseAgreementCount, getPurchaseAgreementDetail, getPurchaseAgreementFilters,
} from '../purchaseService';
import {
  updateTenant,
} from '../../adminSetup/setupService';
import theme from '../../util/materialTheme';
import {
  getNewRequestArray, getOrderLinesRequest, getProductsLength,
} from './utils/utils';
import { getPartsData } from '../../preventiveMaintenance/ppmService';
import {
  trimJsonObject,
  getAllowedCompanies, checkDatehasObject, getDateTimeUtc, getArrayNewFormat, getArrayNewFormatUpdateDelete,
} from '../../util/appUtils';
import ProductDetails from './purchaseAgreementDetail/products';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddPurchaseAgreement = (props) => {
  const {
    editId,
    isTheme,
    isModal,
    afterReset,
  } = props;
  const dispatch = useDispatch();
  const [agreementId, setAgreementId] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { partsSelected } = useSelector((state) => state.ppm);
  const { addPurchaseAgreementInfo, purchaseAgreementDetails } = useSelector((state) => state.purchase);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  useEffect(() => {
    if ((userInfo && userInfo.data) && (addPurchaseAgreementInfo && addPurchaseAgreementInfo.data)) {
      const customFilters = '';
      dispatch(getPurchaseAgreementList(companies, appModels.PURCHASEAGREEMENT, limit, offsetValue, customFilters, sortByValue, sortFieldValue));
      dispatch(getPurchaseAgreementCount(companies, appModels.PURCHASEAGREEMENT, customFilters)); dispatch(getPartsData([]));
    }
  }, [userInfo, addPurchaseAgreementInfo]);

  useEffect(() => {
    if (addPurchaseAgreementInfo && addPurchaseAgreementInfo.data && addPurchaseAgreementInfo.data.length) {
      dispatch(getPurchaseAgreementDetail(addPurchaseAgreementInfo.data[0], appModels.PURCHASEAGREEMENT));
    }
  }, [userInfo, addPurchaseAgreementInfo]);

  function handleSubmit(values) {
    if (!isModal) {
      setIsOpenSuccessAndErrorModalWindow(true);
      afterReset();
    }
    if (editId) {
      let lineData = [];
      if (values.line_ids && values.line_ids.length > 0) {
        const lineDataNew = getOrderLinesRequest(values.line_ids);
        lineData = getNewRequestArray(lineDataNew);
      }
      let dateEnd = values.date_end ? values.date_end : false;
      let orderingDate = values.ordering_date ? values.ordering_date : false;
      let scheduleDate = values.schedule_date ? values.schedule_date : false;

      if (checkDatehasObject(dateEnd)) {
        dateEnd = getDateTimeUtc(dateEnd);
      }
      if (checkDatehasObject(orderingDate)) {
        orderingDate = getDateTimeUtc(orderingDate);
      }
      if (checkDatehasObject(scheduleDate)) {
        scheduleDate = getDateTimeUtc(scheduleDate);
      }

      const postData = {
        user_id: values.user_id ? values.user_id.id : '',
        type_id: values.type_id ? values.type_id.id : '',
        vendor_id: values.vendor_id ? values.vendor_id.id : '',
        company_id: values.company_id ? values.company_id.id : '',
        date_end: dateEnd,
        line_ids: values.line_ids && values.line_ids.length > 0 ? getArrayNewFormatUpdateDelete(lineData) : false,
        ordering_date: orderingDate,
        schedule_date: scheduleDate,
        origin: values.origin,
      };
      dispatch(updateTenant(editId, postData, appModels.PURCHASEAGREEMENT));
    } else {
      if (isModal) {
        setIsOpenSuccessAndErrorModalWindow(true);
        afterReset();
      }
      const userId = values.user_id.id ? values.user_id.id : false;
      const typeId = values.type_id.id ? values.type_id.id : false;
      const vendorId = values.vendor_id.id ? values.vendor_id.id : false;
      const companyId = values.company_id.id;

      let dateEnd = values.date_end ? values.date_end : false;
      let orderingDate = values.ordering_date ? values.ordering_date : false;
      let scheduleDate = values.schedule_date ? values.schedule_date : false;

      if (checkDatehasObject(dateEnd)) {
        dateEnd = getDateTimeUtc(dateEnd);
      }
      if (checkDatehasObject(orderingDate)) {
        orderingDate = getDateTimeUtc(orderingDate);
      }
      if (checkDatehasObject(scheduleDate)) {
        scheduleDate = getDateTimeUtc(scheduleDate);
      }

      const postData = { ...values };
      postData.user_id = userId;
      postData.type_id = typeId;
      postData.vendor_id = vendorId;
      postData.company_id = companyId;
      postData.date_end = dateEnd;
      postData.ordering_date = orderingDate;
      postData.schedule_date = scheduleDate;
      let lineData = [];
      if (values.line_ids && values.line_ids.length > 0) {
        const lineDataNew = getOrderLinesRequest(values.line_ids);
        lineData = getNewRequestArray(lineDataNew);
        postData.line_ids = getArrayNewFormat(lineData);
      }

      const payload = { model: appModels.PURCHASEAGREEMENT, values: postData };
      dispatch(createAgreementRequest(appModels.PURCHASEAGREEMENT, payload));
    }
  }

  const handleReset = (resetForm) => {
    dispatch(getPartsData([]));
    resetForm();
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const onLoadRequest = (eid, ename) => {
    setAgreementId(eid);
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      if (afterReset) afterReset();
      dispatch(getPurchaseAgreementFilters(customFilters));
    }
  };

  if (agreementId) {
    return (<Redirect to="/purchase/purchaseagreements" />);
  }

  const state = purchaseAgreementDetails && purchaseAgreementDetails.data ? purchaseAgreementDetails.data[0].state : false;
  const currentState = state && (state === 'done');

  const productLength = partsSelected && partsSelected.length > 0 ? getProductsLength(partsSelected) : true;

  const formData = (setFieldValue, setFieldTouched) => (
    <div>
      <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
      {!currentState ? (
        <>
          {(purchaseAgreementDetails && purchaseAgreementDetails.data) ? (
            <ProductUpdateForm setFieldValue={setFieldValue} />
          )
            : (
              <ProductsForm setFieldValue={setFieldValue} />
            )}
        </>
      )
        : (
          <>
            <Card className="no-border-radius mt-2 mb-2">
              <CardBody className="p-0 bg-porcelain">
                <p className="ml-3 mb-1 mt-1 font-weight-600 font-side-heading">Products</p>
              </CardBody>
            </Card>
            <ProductDetails />
          </>
        )}
    </div>
  );

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={editId && purchaseAgreementDetails && purchaseAgreementDetails.data ? trimJsonObject(purchaseAgreementDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, resetForm, setFieldTouched,
          }) => (
            <Form id={formId}>
              {(addPurchaseAgreementInfo && addPurchaseAgreementInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.loading) ? ('') : (
                <>
                  {!isTheme
                    ? (
                      <ThemeProvider theme={theme}>
                        {formData(setFieldValue, setFieldTouched)}
                      </ThemeProvider>
                    )
                    : formData(setFieldValue, setFieldTouched)}
                </>
              )}

              {addPurchaseAgreementInfo && addPurchaseAgreementInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(addPurchaseAgreementInfo && addPurchaseAgreementInfo.err) && (
                <SuccessAndErrorFormat response={addPurchaseAgreementInfo} />
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.err) && (
                <SuccessAndErrorFormat response={tenantUpdateInfo} />
              )}
              {(addPurchaseAgreementInfo && addPurchaseAgreementInfo.data) && (
                <SuccessAndErrorFormat response={addPurchaseAgreementInfo} successMessage="Purchase agreement added successfully.." />
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.data) && (
                <SuccessAndErrorFormat response={tenantUpdateInfo} successMessage="Purchase agreement Updated successfully.." />
              )}
              <hr />
              <div className="float-right mr-4 mb-4">
                {(addPurchaseAgreementInfo && addPurchaseAgreementInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data) ? (
                  <Button
                    size="sm"
                     variant="contained"
                    onClick={handleReset.bind(null, resetForm)}
                  >
                    ok
                  </Button>
                ) : (
                  <>
                    {(addPurchaseAgreementInfo && !addPurchaseAgreementInfo.data && !addPurchaseAgreementInfo.loading)
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
              {addPurchaseAgreementInfo && addPurchaseAgreementInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {(addPurchaseAgreementInfo && addPurchaseAgreementInfo.err) && (
              <SuccessAndErrorFormat response={addPurchaseAgreementInfo} />
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.err) && (
              <SuccessAndErrorFormat response={tenantUpdateInfo} />
              )}
              {(addPurchaseAgreementInfo && addPurchaseAgreementInfo.data) && (
                <>
                  <SuccessAndErrorFormat response={addPurchaseAgreementInfo} successMessage="Purchase agreement added successfully.." />
                    {!editId && purchaseAgreementDetails && purchaseAgreementDetails.data && (
                    <p className="text-center mt-2 mb-0 tab_nav_link">
                      Click here to view
                      {' '}
                      :
                      <span
                        aria-hidden="true"
                        className="ml-2 cursor-pointer text-info"
                        onClick={() => onLoadRequest(purchaseAgreementDetails.data[0].id, purchaseAgreementDetails.data[0].name)}
                      >
                        {purchaseAgreementDetails.data[0].name}
                      </span>
                      {' '}
                      details
                    </p>
                    )}
                </>
              )}
              <hr />
              <div className="float-right m-4">
                {(addPurchaseAgreementInfo && addPurchaseAgreementInfo.data) ? (
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
                    disabled={!editId
                      ? (!(isValid && dirty)
                            || addPurchaseAgreementInfo.loading
                            || ((partsSelected && !partsSelected.length > 0)
                              || !checkProductId(partsSelected)
                              || !checkRequiredFields(partsSelected)))
                      : (!isValid || tenantUpdateInfo.loading || ((productLength) || !checkProductId(partsSelected) || !checkRequiredFields(partsSelected)))}
                    type="submit"
                    size="sm"
                     variant="contained"
                  >
                    {!editId ? 'Add' : 'Update'}
                  </Button>
                )}
              </div>
              <div className="float-right mr-4 mb-4 mt-2">
                <Button
                  disabled={!editId
                    ? (!(isValid && dirty)
                      || addPurchaseAgreementInfo.loading
                      || ((partsSelected && !partsSelected.length > 0)
                        || !checkProductId(partsSelected)
                        || !checkRequiredFields(partsSelected)))
                    : (!isValid || tenantUpdateInfo.loading || ((productLength) || !checkProductId(partsSelected) || !checkRequiredFields(partsSelected)))}
                  type="submit"
                  size="sm"
                   variant="contained"
                >
                  {!editId ? 'Add' : 'Update'}
                </Button>
                  </div> */}
              {!isModal
                ? (
                  <SuccessAndErrorModalWindow
                    isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                    setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                    type={editId ? 'update' : 'create'}
                    successOrErrorData={editId ? tenantUpdateInfo : addPurchaseAgreementInfo}
                    headerImage={PurchaseHandBlue}
                    headerText="Purchase Agreement"
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

AddPurchaseAgreement.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  isTheme: PropTypes.bool,
  isModal: PropTypes.bool,
};

AddPurchaseAgreement.defaultProps = {
  isTheme: false,
  isModal: false,
};

export default AddPurchaseAgreement;
