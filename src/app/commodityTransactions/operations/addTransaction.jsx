/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import { Button } from '@mui/material';
import moment from 'moment-timezone';

import PromptIfUnSaved from '@shared/unSavedPrompt';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import TankerBlue from '@images/icons/tankerBlue.svg';

import BasicForm from './forms/transactionBasicForm';
import validationSchema from './formModel/transactionValidationSchema';
import validationSchemaEdit from './formModel/transactionEditValidationSchema';
import checkoutFormModel from './formModel/transactionCheckoutFormModel';
import formInitialValues from './formModel/tankerformInitialValues';
import theme from '../../util/materialTheme';
import {
  trimJsonObject,
  extractValueObjects,
  getDateTimeUtcMuI,
} from '../../util/appUtils';
import { last } from '../../util/staticFunctions';
import { createProductCategory, updateProductCategory } from '../../pantryManagement/pantryService';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddTransaction = (props) => {
  const {
    closeModal, selectedUser, editData, addModal,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const {
    productCategoryDetails,
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtcMuI(data);
    } else {
      result = moment(data).utc().format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  }

  function handleSubmit(values) {
    if (selectedUser) {
      setIsOpenSuccessAndErrorModalWindow(true);
      const previousValues = trimJsonObject(editData[0]);
      const postData = {
        delivery_challan: values.delivery_challan,
        tanker_id: extractValueObjects(values.tanker_id),
        location_id: extractValueObjects(values.location_id),
        initial_reading: parseFloat(values.initial_reading),
        final_reading: parseFloat(values.final_reading),
        in_datetime: previousValues.in_datetime !== values.in_datetime ? checkExDatehasObject(values.in_datetime) : values.in_datetime ? values.in_datetime : false,
        out_datetime: previousValues.out_datetime !== values.out_datetime ? checkExDatehasObject(values.out_datetime) : values.out_datetime ? values.out_datetime : false,
        commodity: extractValueObjects(values.commodity),
        vendor_id: extractValueObjects(values.vendor_id),
        uom_id: extractValueObjects(values.uom_id),
        capacity: values.capacity,
        name: values.name,
        amount: parseFloat(values.amount),
        remark: values.remark,
      };
      dispatch(updateProductCategory(selectedUser.id, appModels.TANKERTRANSACTIONS, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const location = values.location_id && values.location_id.length > 0 ? last(values.location_id) : false;
      const { delivery_challan } = values;
      const { initial_reading } = values;
      const tankerId = extractValueObjects(values.tanker_id);
      const { name } = values;
      const { capacity } = values;
      const inDatetime = checkExDatehasObject(values.in_datetime);
      const commodityId = extractValueObjects(values.commodity);
      const vendorId = extractValueObjects(values.vendor_id);
      const uomId = extractValueObjects(values.uom_id);

      const postData = { ...values };

      postData.delivery_challan = delivery_challan;
      postData.initialReading = parseFloat(initial_reading);
      postData.tanker_id = tankerId;
      postData.location_id = location;
      postData.name = name;
      postData.in_datetime = inDatetime;
      postData.capacity = capacity;
      postData.commodity = commodityId;
      postData.vendor_id = vendorId;
      postData.uom_id = uomId;
      const payload = { model: appModels.TANKERTRANSACTIONS, values: postData };
      dispatch(createProductCategory(appModels.TANKERTRANSACTIONS, payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    if (closeModal) closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={selectedUser && editData && editData.length > 0 ? trimJsonObject(editData[0]) : formInitialValues}
          validationSchema={selectedUser && selectedUser.is_requires_verification && selectedUser.state === 'Submitted' ? validationSchemaEdit : validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <PromptIfUnSaved />
              <ThemeProvider theme={theme}>
                <div>
                  <BasicForm formField={formField} editId={editData} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} addModal={addModal} />
                </div>
              </ThemeProvider>
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (productCategoryDetails && productCategoryDetails.loading)) && (
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
              <>
                <div className="bg-lightblue sticky-button-736drawer">
                  {(addProductCategoryInfo && !addProductCategoryInfo.data && !selectedUser) && (
                    <Button
                      disabled={!(isValid && dirty)}
                      type="submit"
                      size="sm"
                      variant="contained"
                      className="submit-btn float-right"
                    >
                      Tanker In
                    </Button>
                  )}
                  {(selectedUser && updateProductCategoryInfo && !updateProductCategoryInfo.data) && (
                    <Button
                      disabled={!(isValid)}
                      type="submit"
                      size="sm"
                      variant="contained"
                      className="submit-btn float-right"
                    >
                      Update
                    </Button>
                  )}
                </div>
              </>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editData ? 'update' : 'create'}
                successOrErrorData={editData ? updateProductCategoryInfo : addProductCategoryInfo}
                headerImage={TankerBlue}
                headerText="Transaction"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddTransaction.propTypes = {
  closeModal: PropTypes.func.isRequired,
  selectedUser: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.array.isRequired,
};

export default AddTransaction;
