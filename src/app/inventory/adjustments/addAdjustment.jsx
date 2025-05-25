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
import moment from 'moment';
import { FormControl, Button, Box } from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import InventoryBlue from '@images/icons/inventoryBlue.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import BasicForm from './forms/basicForm';
import ProductsForm from './forms/productUpdateForm';
import ProductsAddForm from './forms/productAddForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import theme from '../../util/materialTheme';
import {
  trimJsonObject,
  extractValueObjects,
  getArrayNewFormatUpdateDelete,
  getListOfModuleOperations,
  generateErrorMessage,
} from '../../util/appUtils';
import actionCodes from '../data/actionCodes.json';
import { getNewRequestArray, getNewRequestAddArray } from './utils/utils';

import {
  createAdjustment, updateAdjustment, getSelectedProducts, setValidateStock,
  resetValidateStock,
} from '../inventoryService';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddAdjustment = (props) => {
  const {
    editId, isShow, afterReset, isDrawerOpen,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const {
    adjustmentDetail,
    addAdjustmentInfo,
    updateAdjustmentInfo,
    productsListSelected,
    auditExistsInfo,
  } = useSelector((state) => state.inventory);
  const { userRoles } = useSelector((state) => state.user);

  const [isToDo, setToDo] = useState(false);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[0] : '';
  }

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isValidatable = allowedOperations.includes(actionCodes['Validate Adjustment']);
  const duplicateExists = auditExistsInfo && auditExistsInfo.err;

  useEffect(() => {
    setToDo(false);
    dispatch(resetValidateStock());
  }, []);

  function checkArrayhasDataProduct(data) {
    let result = [];
    if (data && data.length) {
      result = data.filter((item) => (item.product_id && (typeof item.product_id === 'number')) && (item.location_id && (typeof item.location_id === 'number')));
    }
    return result;
  }

  useEffect(() => {
    setToDo(false);
  }, []);

  useEffect(() => {
    if (addAdjustmentInfo && addAdjustmentInfo.data && addAdjustmentInfo.data.length && !editId && isToDo) {
      dispatch(setValidateStock(addAdjustmentInfo.data[0], false));
    }
  }, [addAdjustmentInfo, isToDo]);

  function handleSubmit(values) {
    // const companyId = extractValueObjects(values.company_id);
    setIsOpenSuccessAndErrorModalWindow(true);
    if (editId) {
      let orderData = [];
      if (values.line_ids && values.line_ids.length > 0) {
        dispatch(getSelectedProducts(values.line_ids));
        orderData = getNewRequestArray(values.line_ids);
      }
      const postData = {
        name: values.name,
        filter: 'partial',
        // exhausted: values.exhausted,
        // date: values.date ? moment(values.date).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        location_id: extractValueObjects(values.location_id),
        reason_id: extractValueObjects(values.reason_id),
        // category_id: extractValueObjects(values.category_id),
        //  product_id: extractValueObjects(values.product_id),
        // company_id: companyId,
        comments: values.comments,
        line_ids: values.line_ids && values.line_ids.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : [],
      };
      dispatch(updateAdjustment(editId, appModels.INVENTORY, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      dispatch(resetValidateStock());
      /* const locationId = extractValueObjects(values.location_id);
      const companyId = extractValueObjects(values.company_id);
      const categoryId = extractValueObjects(values.category_id);
      const productId = extractValueObjects(values.product_id);
      const inventoryDate = values.date ? moment(values.date).format('YYYY-MM-DD HH:mm:ss') : false; */

      // const postData = { ...values };

      if (values.line_ids && values.line_ids.length > 0) {
        dispatch(getSelectedProducts(values.line_ids));
      }

      const postData = {
        name: values.name,
        comments: values.comments,
        filter: 'partial',
        // exhausted: values.exhausted,
        date: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
        location_id: extractValueObjects(values.location_id),
        reason_id: extractValueObjects(values.reason_id),
        line_ids: values.line_ids && values.line_ids.length > 0 ? getNewRequestAddArray(values.line_ids) : [],
        // category_id: extractValueObjects(values.category_id),
        //  product_id: extractValueObjects(values.product_id),
        // company_id: companyId,
        // line_ids: values.line_ids && values.line_ids.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : false,
      };

      /* postData.location_id = locationId;
      postData.company_id = companyId;
      postData.category_id = categoryId;
      postData.product_id = productId;
      postData.date = inventoryDate; */
      setToDo(false);
      const payload = { values: [postData] };
      dispatch(createAdjustment(appModels.INVENTORY, payload));
    }
  }

  const handleSave = (values) => {
    setIsOpenSuccessAndErrorModalWindow(true);
    dispatch(resetValidateStock());
    if (values.line_ids && values.line_ids.length > 0) {
      dispatch(getSelectedProducts(values.line_ids));
    }

    const postData = {
      name: values.name,
      filter: 'partial',
      comments: values.comments,
      // exhausted: values.exhausted,
      date: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
      location_id: extractValueObjects(values.location_id),
      reason_id: extractValueObjects(values.reason_id),
      line_ids: values.line_ids && values.line_ids.length > 0 ? getNewRequestAddArray(values.line_ids) : [],
      // category_id: extractValueObjects(values.category_id),
      //  product_id: extractValueObjects(values.product_id),
      // company_id: companyId,
      // line_ids: values.line_ids && values.line_ids.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : false,
    };
    setToDo(true);
    const payload = { values: [postData] };
    dispatch(createAdjustment(appModels.INVENTORY, payload));
  };

  const handleReset = (resetForm) => {
    resetForm();
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pt-2">
      <Col md="12" sm="12" lg="12" xs="12" className="p-0">
        <Formik
          enableReinitialize
          initialValues={editId && adjustmentDetail && adjustmentDetail.data ? trimJsonObject(adjustmentDetail.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, values, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <FormControl
                  sx={{
                    width: '100%',
                    padding: '10px 0px 20px 30px',
                    maxHeight: '600px',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    borderTop: '1px solid #0000001f',
                  }}
                >
                  {(isShow) && (
                    <div>
                      <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                      {!editId && (
                        <ProductsAddForm setFieldValue={setFieldValue} productValues={productsListSelected || []} />
                      )}
                      {editId && (adjustmentDetail && adjustmentDetail.data && adjustmentDetail.data[0].state && adjustmentDetail.data[0].state === 'confirm') && (
                        <ProductsForm isDrawerOpen={isDrawerOpen} setFieldValue={setFieldValue} productValues={productsListSelected || []} />
                      )}
                    </div>
                  )}
                </FormControl>
              </Box>
              {(addAdjustmentInfo && !addAdjustmentInfo.data && !addAdjustmentInfo.loading) && (
                <div className="bg-lightblue sticky-button-736drawer-Table">
                  <Button
                    disabled={!editId ? !(isValid && dirty) || (values.line_ids && values.line_ids.length === 0) || (auditExistsInfo && auditExistsInfo.loading) || (!editId && duplicateExists && ((values.location_id && values.location_id.id) || getOldData(values.location_id)) && (values.line_ids && values.line_ids.length > 0)) : !isValid || (values.line_ids && values.line_ids.length === 0)}
                    type="submit"
                    size="sm"
                    variant="contained"
                  >
                    {!editId ? 'Submit' : 'Update'}
                  </Button>
                  {!editId && isValidatable && (
                    <Button
                      disabled={!(isValid && dirty) || (values.line_ids && values.line_ids.length === 0) || (auditExistsInfo && auditExistsInfo.loading) || (!editId && duplicateExists && ((values.location_id && values.location_id.id) || getOldData(values.location_id)))}
                      onClick={() => handleSave(values)}
                      className="ml-3"
                      variant="contained"
                    >
                      Submit & Validate
                    </Button>
                  )}
                    {!editId && duplicateExists && ((values.location_id && values.location_id.id)) && (values.line_ids && values.line_ids.length > 0) && (
                    <p className="m-0 text-danger">{generateErrorMessage(auditExistsInfo)}</p>
                    )}
                </div>
              )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateAdjustmentInfo : addAdjustmentInfo}
                headerImage={InventoryBlue}
                headerText="Stock Audit"
                actionMsg={isToDo ? 'Created and Validated' : false}
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddAdjustment.propTypes = {
  afterReset: PropTypes.func.isRequired,
  isDrawerOpen: PropTypes.bool.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddAdjustment;
