/* eslint-disable radix */
/* eslint-disable no-lone-blocks */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import InventoryBlue from '@images/icons/inventoryBlue.svg';
import { ThemeProvider } from '@material-ui/core/styles';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import {
  Button,
} from '@mui/material';
import {
  createProductCategory, updateProductCategory, resetCreateProductCategory, resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import {
  extractValueObjects, getAllowedCompanies, getColumnArrayById, trimJsonObject,
} from '../../../util/appUtils';
import {
  setSorting,
} from '../../../assets/equipmentService';
import {
  getPartsData,
} from '../../../preventiveMaintenance/ppmService';
import theme from '../../../util/materialTheme';
import checkoutFormModel from './formModel/problemCategoryGroupcheckoutFormModel';
import formInitialValues from './formModel/problemCategoryGroupformInitialValues';
import validationSchema from './formModel/problemCategoryGroupvalidationSchema';
import BasicForm from './forms/problemCategoryGroupBasicForm';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddProductCategory = (props) => {
  const {
    closeModal, editId,
  } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const {
    pcgInfo, siteDetails,
  } = useSelector((state) => state.site);
  const { userInfo } = useSelector((state) => state.user);
  const { partsSelected } = useSelector((state) => state.ppm);

  useEffect(() => {
    if (((updateProductCategoryInfo && updateProductCategoryInfo.data) || (addProductCategoryInfo && addProductCategoryInfo.data))) {
      dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
    }
  }, [updateProductCategoryInfo, addProductCategoryInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getPartsData([]));
    }
  }, [userInfo]);

  function getInitialData(array) {
    const data = array;
    const result = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i += 1) {
        if (data[i] && !data[i].isRemove) {
          result.push(data[i]);
        }
      }
    }
    return result;
  }

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      //closeModal();
      const categoryId = !values.is_all_asset_category && values.equipment_category_ids && values.equipment_category_ids.length && values.equipment_category_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.equipment_category_ids, 'id')]] : [[6, 0, []]];
      const spaceId = !values.is_all_asset_category && values.space_category_ids && values.space_category_ids.length && values.space_category_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.space_category_ids, 'id')]] : [[6, 0, []]];
      const problemId = values.problem_category_ids && values.problem_category_ids.length && values.problem_category_ids.length > 0
        ? [[6, 0, getColumnArrayById(getInitialData(values.problem_category_ids), 'id')]] : [[6, 0, []]];
      const postData = {
        name: values.name,
        is_all_asset_category: values.is_all_asset_category,
        is_all_category: values.is_all_category,
        equipment_category_ids: categoryId,
        type_category: extractValueObjects((values.type_category)),
        space_category_ids: spaceId,
        problem_category_ids: problemId,

      };
      dispatch(updateProductCategory(editId, appModels.TICKETCATEGORYGROUP, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      //closeModal();
      const spaceId = !values.is_all_asset_category && values.space_category_ids && values.space_category_ids.length && values.space_category_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.space_category_ids, 'id')]] : false;

      const categoryId = !values.is_all_asset_category && values.equipment_category_ids && values.equipment_category_ids.length && values.equipment_category_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.equipment_category_ids, 'id')]] : false;
      const problemId = values.problem_category_ids && values.problem_category_ids.length && values.problem_category_ids.length > 0
        ? [[6, 0, getColumnArrayById(getInitialData(values.problem_category_ids), 'id')]] : [[6, 0, []]];
      const { name } = values;

      const postData = { ...values };

      postData.name = name;
      postData.equipment_category_ids = categoryId;
      postData.type_category = extractValueObjects((values.type_category));
      postData.space_category_ids = spaceId;
      postData.problem_category_ids = problemId;
      postData.company_id = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
      const payload = { model: appModels.TICKETCATEGORYGROUP, values: postData };
      dispatch(createProductCategory(appModels.TICKETCATEGORYGROUP, payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    dispatch(getPartsData([]));
    dispatch(resetCreateProductCategory());
    dispatch(resetUpdateProductCategory());
    setTimeout(() => {
      if (closeModal) closeModal();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && pcgInfo && pcgInfo.data && pcgInfo.data.length > 0 ? trimJsonObject(pcgInfo.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              {(addProductCategoryInfo && !addProductCategoryInfo.data && !addProductCategoryInfo.loading) && (
                <ThemeProvider theme={theme}>
                  <div>
                    <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                  </div>
                </ThemeProvider>
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (pcgInfo && pcgInfo.loading)) && (
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
                  successMessage={addProductCategoryInfo.data ? 'Product category group added successfully..' : 'Product category group details are updated successfully..'}
                />
              )} */}
              <div className="float-right m-4">
                <div className="bg-lightblue sticky-button-85drawer">
                  <Button
                    disabled={!editId
                      ? (!dirty)
                      : (!isValid)}
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
                headerText="Problem Category Group"
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
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AddProductCategory;
