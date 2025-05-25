/* eslint-disable radix */
/* eslint-disable no-lone-blocks */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import assetIcon from '@images/icons/asset.svg';
import { ThemeProvider } from '@material-ui/core/styles';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import {
  Button,
} from '@mui/material';
import { createProductCategory, updateProductCategory } from '../../../pantryManagement/pantryService';
import {
  extractValueObjects, getAllowedCompanies, getArrayNewFormatUpdateDelete, trimJsonObject,
} from '../../../util/appUtils';
import theme from '../../../util/materialTheme';
import checkoutFormModel from './formModel/assetCheckoutFormModel';
import formInitialValues from './formModel/assetFormInitialValues';
import validationSchema from './formModel/assetValidationSchema';
import BasicForm from './forms/assetCategoryBasicForm';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddAssetCategory = (props) => {
  const { closeModal, editId } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const {
    acInfo, siteDetails,
  } = useSelector((state) => state.site);
  const { userInfo } = useSelector((state) => state.user);

  // useEffect(() => {
  //   if (((updateProductCategoryInfo && updateProductCategoryInfo.data) || (addProductCategoryInfo && addProductCategoryInfo.data))) {
  //     dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
  //   }
  // }, [updateProductCategoryInfo, addProductCategoryInfo]);

  function getNewRequestArray(array) {
    let requestProduts = [];
    if (array && array.length > 0) {
      requestProduts = array.map((pl) => ({
        id: pl.id,
        space_value: pl.space_value,
        space_label_id: extractValueObjects(pl.space_label_id),
        isRemove: pl.isRemove,
      }));
    }
    return requestProduts;
  }

  function handleSubmit(values) {
    let orderData = [];
    if (values.space_label_ids && values.space_label_ids.length > 0) {
      orderData = getNewRequestArray(values.space_label_ids);
    }
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const postData = {
        name: values.name,
        categ_no: values.categ_no,
        alias_name_categ: values.alias_name_categ,
        parent_id: extractValueObjects(values.parent_id),
        commodity_id: extractValueObjects(values.commodity_id),
        type: extractValueObjects(values.type),
        image_medium: values.image_medium
          ? values.image_medium : '',
        space_label_ids: values.space_label_ids && values.space_label_ids.length > 0 ? getArrayNewFormatUpdateDelete(orderData) : false,
      };
      dispatch(updateProductCategory(editId, appModels.EQUIPMENTCATEGORY, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();

      const postData = { ...values };

      postData.name = values.name;
      postData.categ_no = values.categ_no;
      postData.alias_name_categ = values.alias_name_categ;
      postData.parent_id = extractValueObjects(values.parent_id);
      postData.commodity_id = extractValueObjects(values.commodity_id);
      postData.type = extractValueObjects(values.type);
      postData.image_medium = values.image_medium
        ? values.image_medium : '';
      postData.space_label_ids = values.space_label_ids && values.space_label_ids.length > 0 ? getArrayNewFormatUpdateDelete(orderData) : false;
      postData.company_id = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
      const payload = { model: appModels.EQUIPMENTCATEGORY, values: postData };
      dispatch(createProductCategory(appModels.EQUIPMENTCATEGORY, payload));
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
          initialValues={editId && acInfo && acInfo.data && acInfo.data.length ? trimJsonObject(acInfo.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              {(addProductCategoryInfo && !addProductCategoryInfo.data && !addProductCategoryInfo.loading && (acInfo && !acInfo.loading)) ? (
                <ThemeProvider theme={theme}>
                  <div>
                    <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                  </div>
                </ThemeProvider>
              ) : ''}
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (acInfo && acInfo.loading)) && (
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
                  successMessage={addProductCategoryInfo.data ? 'Equipment category added successfully..' : 'Equipment category details are updated successfully..'}
                />
              )} */}
              <div className="float-right m-4 ">
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
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateProductCategoryInfo : addProductCategoryInfo}
                headerImage={assetIcon}
                headerText="Equipment Category"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>

    </Row>
  );
};

AddAssetCategory.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AddAssetCategory;
