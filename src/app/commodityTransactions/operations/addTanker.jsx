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
import { Button } from '@mui/material';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import TankerBlue from '@images/icons/tankerBlue.svg';

import BasicForm from './forms/tankerBasicForm';
import validationSchema from './formModel/tankervalidationSchema';
import checkoutFormModel from './formModel/tankercheckoutFormModel';
import formInitialValues from './formModel/tankerformInitialValues';
import theme from '../../util/materialTheme';
import {
  trimJsonObject,
  extractValueObjects,
} from '../../util/appUtils';

import { createProductCategory, updateProductCategory } from '../../pantryManagement/pantryService';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddTanker = (props) => {
  const {
    closeModal, selectedUser, isModal, setFieldValue, tankerKeyword, editData,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const {
    productCategoryDetails,
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  useEffect(() => {
    if (addProductCategoryInfo && addProductCategoryInfo.data && addProductCategoryInfo.data.length) {
      if (setFieldValue) {
        setFieldValue('tanker_id', { id: addProductCategoryInfo.data[0], name: tankerKeyword });
      }
    }
  }, [addProductCategoryInfo]);

  function handleSubmit(values) {
    if (selectedUser) {
      setIsOpenSuccessAndErrorModalWindow(true);
      const postData = {
        name: values.name,
        commodity: extractValueObjects(values.commodity),
        vendor_id: extractValueObjects(values.vendor_id),
        uom_id: extractValueObjects(values.uom_id),
        capacity: values.capacity,
      };
      dispatch(updateProductCategory(selectedUser, appModels.TANKERS, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const { name } = values;
      const { capacity } = values;
      const commodityId = extractValueObjects(values.commodity);
      const vendorId = extractValueObjects(values.vendor_id);
      const uomId = extractValueObjects(values.uom_id);

      const postData = { ...values };

      postData.name = name;
      postData.capacity = capacity;
      postData.commodity = commodityId;
      postData.vendor_id = vendorId;
      postData.uom_id = uomId;
      const payload = { model: appModels.TANKERS, values: postData };
      dispatch(createProductCategory(appModels.TANKERS, payload));
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
          initialValues={selectedUser && editData && editData.length > 0 ? trimJsonObject(editData[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <ThemeProvider theme={theme}>
                <div>
                  <BasicForm tankerKeyword={tankerKeyword} formField={formField} editId={editData} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
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
                <div className={`bg-lightblue ${!tankerKeyword && !isModal ? 'sticky-button-736drawer' : ''}`}>
                  {(addProductCategoryInfo && !addProductCategoryInfo.data && !selectedUser) && (
                    <Button
                      disabled={!(isValid && dirty)}
                      type="submit"
                      variant="contained"
                      className="submit-btn float-right"
                      size="sm"
                    >
                      Add
                    </Button>
                  )}
                  {(selectedUser && updateProductCategoryInfo && !updateProductCategoryInfo.data) && (
                    <Button
                      disabled={!(isValid)}
                      type="submit"
                       variant="contained"
                      size="sm"
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
                headerText="Tanker"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddTanker.propTypes = {
  closeModal: PropTypes.func.isRequired,
  selectedUser: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.array.isRequired,
};

export default AddTanker;
