/* eslint-disable no-lone-blocks */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import PromptIfUnSaved from '@shared/unSavedPrompt';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import InventoryBlue from '@images/icons/inventoryBlue.svg';

import BasicForm from './forms/productCategoryBasicForm';
import validationSchema from './formModel/productCategoryvalidationSchema';
import checkoutFormModel from './formModel/productCategorycheckoutFormModel';
import formInitialValues from './formModel/productCategoryformInitialValues';
import theme from '../../util/materialTheme';
import {
  trimJsonObject,
  extractValueObjects,
} from '../../util/appUtils';

import { createProductCategory, updateProductCategory } from '../pantryService';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddProductCategory = (props) => {
  const {
    closeModal, selectedUser, editData, closeAddModal,
  } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    productCategoryDetails,
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  function handleSubmit(values) {
    setIsOpenSuccessAndErrorModalWindow(true);
    closeModal();
    console.log(values);
    if (selectedUser) {
      const postData = {
        name: values.name,
        parent_id: extractValueObjects(values.parent_id),
      };
      dispatch(updateProductCategory(selectedUser.id, appModels.PRODUCTCATEGORY, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeAddModal();
      const { name } = values;
      const parentId = extractValueObjects(values.parent_id);

      const postData = { ...values };

      postData.name = name;
      postData.parent_id = parentId;
      const payload = { model: appModels.PRODUCTCATEGORY, values: postData };
      dispatch(createProductCategory(appModels.PRODUCTCATEGORY, payload));
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
          initialValues={selectedUser ? trimJsonObject(selectedUser) : formInitialValues}
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
                  <BasicForm formField={formField} editId={editData} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                </div>
              </ThemeProvider>
              )}
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
                {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) && (
                <SuccessAndErrorFormat
                  response={addProductCategoryInfo.data ? addProductCategoryInfo : updateProductCategoryInfo}
                  successMessage={addProductCategoryInfo.data ? 'Product category added successfully..' : 'Product category details are updated successfully..'}
                />
                )}
              </>
              <hr />
              {/*
                <div className="float-right">
                  {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) && (
                  <Button
                     variant="contained"
                    size="sm"
                    onClick={closeModal}
                  >
                    Ok
                  </Button>
                 )}
                 </> */}
              {/* <div className="float-right">
                {(addProductCategoryInfo && !addProductCategoryInfo.data && !selectedUser) && (
                <Button
                  disabled={!(isValid && dirty)}
                  type="submit"
                   variant="contained"
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
                )} */}
              <div className="float-right m-4">
                {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) ? (
                  <Button
                    type="button"
                    size="sm"
                     variant="contained"
                    onClick={handleReset.bind(null, resetForm)}
                  >
                    Ok
                  </Button>
                ) : (
                  <div className="bg-lightblue sticky-button-1250drawer">
                    <Button
                      disabled={!editData ? !(isValid && dirty) : !isValid}
                      type="submit"
                      size="sm"
                       variant="contained"
                    >
                      {!editData ? 'Add' : 'Update'}
                    </Button>
                  </div>
                )}
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editData ? 'update' : 'create'}
                successOrErrorData={editData ? updateProductCategoryInfo : addProductCategoryInfo}
                headerImage={InventoryBlue}
                headerText="Product Category"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>

    </Row>
  );
};

AddProductCategory.propTypes = {
  closeModal: PropTypes.func.isRequired,
  closeAddModal: PropTypes.func.isRequired,
  selectedUser: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.array.isRequired,
};

export default AddProductCategory;
