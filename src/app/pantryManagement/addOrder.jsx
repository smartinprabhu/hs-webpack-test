/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Box, Button, Divider } from '@mui/material';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import pantryBlueIcon from '@images/icons/pantry/pantryBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import { AddThemeColor } from '../themes/theme';

import { getSelectedProducts } from '../inventory/inventoryService';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import validationSchema from './formModel/validationSchema';
import BasicForm from './forms/basicForm';
import ProductForm from './forms/productForm';

import {
  extractValueObjects,
  getArrayNewFormatUpdateDelete,
  trimJsonObject,
} from '../util/appUtils';
import { createOrder, updateOrder } from './pantryService';
import { checkProduct, checkRemovedProduct, getNewRequestArray } from './utils/utils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddOrder = (props) => {
  const {
    editId, setAddModal, onLoadPantry, closeAddModal, closeEditModal, partsData,
    setPartsData,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [DataChanged, setDataChanged] = useState(null);
  const [partsAddEnable, setPartsAddEnable] = useState(false);

  const {
    pantryDetails,
    addOrderInfo,
    updateOrderInfo,
  } = useSelector((state) => state.pantry);
  const { userInfo } = useSelector((state) => state.user);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  useEffect(() => {
    let countTrueResult = 0;
    if (partsData && partsData.length) {
      partsData.map((productsData) => {
        if (productsData.product_id === '') {
          countTrueResult += 1;
        } else {
          setPartsAddEnable(false);
        }
      });
      if (countTrueResult > 0) {
        setPartsAddEnable(true);
      }
    } else {
      setPartsAddEnable(false);
    }
  }, [partsData, DataChanged]);

  function checkArrayhasDataProduct(data) {
    let result = [];
    if (data && data.length) {
      result = data.filter((item) => (item.product_id && (typeof item.product_id === 'number')));
    }
    return result;
  }

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeEditModal();
      let orderData = [];
      if (values.order_lines && values.order_lines.length > 0) {
        dispatch(getSelectedProducts(values.order_lines));
        orderData = getNewRequestArray(values.order_lines);
      }
      const postData = {
        employee_id: extractValueObjects(values.employee_id),
        pantry_id: extractValueObjects(values.pantry_id),
        space_id: extractValueObjects(values.space_id),
        order_lines: values.order_lines && values.order_lines.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : false,
      };
      dispatch(updateOrder(editId, appModels.PANTRYORDER, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeAddModal();
      let orderData = [];
      if (values.order_lines && values.order_lines.length > 0) {
        dispatch(getSelectedProducts(values.order_lines));
        orderData = getNewRequestArray(values.order_lines);
      }
      const postData = {
        employee_id: extractValueObjects(values.employee_id),
        pantry_id: extractValueObjects(values.pantry_id),
        space_id: extractValueObjects(values.space_id),
        company_id: userCompanyId,
        order_lines: values.order_lines && values.order_lines.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : false,
      };
      const payload = { model: appModels.PANTRYORDER, values: postData };
      dispatch(createOrder(appModels.PANTRYORDER, payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    setAddModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (setAddModal) setAddModal();
    }, 1000);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={editId && pantryDetails && pantryDetails.data ? trimJsonObject(pantryDetails.data[0]) : formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isValid, dirty, setFieldValue, resetForm,
      }) => (
        <Form id={formId}>
          <Box
            sx={AddThemeColor({
              width: '100%',
              padding: '20px 25px',
              flexGrow: 1,
            })}
            className="createFormScrollbar"
          >
            {(addOrderInfo && !addOrderInfo.data && !addOrderInfo.loading) && (updateOrderInfo && !updateOrderInfo.data && !updateOrderInfo.loading) && (
            <div>
              <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} />
              <ProductForm
                editId={editId}
                setFieldValue={setFieldValue}
                partsData={partsData}
                setPartsData={setPartsData}
                setPartsAddEnable={setPartsAddEnable}
                setDataChanged={setDataChanged}
              />
            </div>
            )}
            {(addOrderInfo && addOrderInfo.err) && (
            <SuccessAndErrorFormat response={addOrderInfo} />
            )}
            {(updateOrderInfo && updateOrderInfo.err) && (
            <SuccessAndErrorFormat response={updateOrderInfo} />
            )}
            {/*  <>
                {((addOrderInfo && addOrderInfo.data) || (updateOrderInfo && updateOrderInfo.data)) && (
                <SuccessAndErrorFormat
                  response={addOrderInfo.data ? addOrderInfo : updateOrderInfo}
                  successMessage={addOrderInfo.data ? 'Pantry added successfully..' : 'Pantry details are updated successfully..'}
                />
                )}
                {(addOrderInfo && addOrderInfo.data) && (
                <>
                  {!editId && pantryDetails && pantryDetails.data && (
                  <p className="text-center mt-2 mb-0 tab_nav_link">
                    Click here to view
                    {' '}
                    Pantry
                    :
                    <span aria-hidden="true" className="ml-2 cursor-pointer text-info" onClick={() => onLoadPantry(pantryDetails.data[0].id)}>{pantryDetails.data[0].name}</span>
                    {' '}
                    details
                  </p>
                  )}
                </>
                )}
                <div className="float-right">
                  {((addOrderInfo && addOrderInfo.data) || (updateOrderInfo && updateOrderInfo.data)) && (
                  <Button
                     variant="contained"
                    size="sm"
                    onClick={setAddModal}
                  >
                    Ok
                  </Button>
                  )}
                </div>
              </> */}
            <Divider style={{ marginBottom: '10px', marginTop: '10px' }} />
            {(addOrderInfo && !addOrderInfo.data && !addOrderInfo.loading) && (updateOrderInfo && !updateOrderInfo.data && !updateOrderInfo.loading) && (
            <div className="bg-lightblue sticky-button-85drawer">
              <Button
                disabled={!editId ? (!(isValid && dirty) || ((partsData && !partsData.length > 0) || !checkProduct(partsData))) : !isValid || (checkRemovedProduct(partsData && partsData.length ? partsData : [])) || !checkProduct(partsData && partsData.length ? partsData : [])}
                type="submit"
                size="sm"
                variant="contained"
              >
                {!editId ? 'Create' : 'Update'}
              </Button>
            </div>
            )}
            <SuccessAndErrorModalWindow
              isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
              setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
              type={editId ? 'update' : 'create'}
              successOrErrorData={editId ? updateOrderInfo : addOrderInfo}
              headerImage={pantryBlueIcon}
              headerText="Pantry"
              successRedirect={handleReset.bind(null, resetForm)}
            />
          </Box>
        </Form>
      )}
    </Formik>
  );
};

AddOrder.propTypes = {
  setAddModal: PropTypes.func.isRequired,
  closeAddModal: PropTypes.func.isRequired,
  closeEditModal: PropTypes.func.isRequired,
  onLoadPantry: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddOrder;
