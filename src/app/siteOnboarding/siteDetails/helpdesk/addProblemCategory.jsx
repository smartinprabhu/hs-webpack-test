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
  extractValueObjects, getAllowedCompanies, getArrayNewFormatUpdateDelete, getColumnArrayById, trimJsonObject,
} from '../../../util/appUtils';
import {
  setSorting,
} from '../../../assets/equipmentService';
import {
  getPartsData,
} from '../../../preventiveMaintenance/ppmService';
import theme from '../../../util/materialTheme';
import checkoutFormModel from './formModel/problemCategorycheckoutFormModel';
import formInitialValues from './formModel/problemCategoryformInitialValues';
import validationSchema from './formModel/problemCategoryvalidationSchema';
import BasicForm from './forms/problemCategoryBasicForm';
import SubCategoryForm from './forms/subCategoryForm';
import { checkPrirority } from '../../utils/utils';

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
    pcInfo, siteDetails,
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
    let result = [];
    if (data.length > 0) {
      for (let i = 0; i < data.length; i += 1) {
        if (data[i] && data[i].isRemove && data[i].isRemove === true) {
          delete data[i].isRemove;
        }
      }
    }
    result = data.filter((item) => (item.id));
    return result;
  }

  let subCategoryValues = pcInfo && pcInfo.data && pcInfo.data.length > 0 ? getInitialData(pcInfo.data[0].subcategory_ids) : [];

  useEffect(() => {
    if (pcInfo && pcInfo.data && pcInfo.data.length) {
      dispatch(getPartsData([]));
      subCategoryValues = pcInfo && pcInfo.data && pcInfo.data.length > 0 ? getInitialData(pcInfo.data[0].subcategory_ids) : [];
    }
  }, [pcInfo]);

  function checkArrayhasDataProduct(data) {
    let result = [];
    if (data && data.length) {
      result = data.filter((item) => (item.name !== ''));
    }
    return result;
  }

  function getNewRequestArray(array) {
    let requestProduts = [];
    if (array && array.length > 0) {
      requestProduts = array.map((pl) => ({
        id: pl.id,
        name: pl.name,
        priority: extractValueObjects(pl.priority),
        sla_timer: pl.sla_timer ? parseInt(pl.sla_timer) : 0,
        isRemove: pl.isRemove,
      }));
    }
    return requestProduts;
  }
  function handleSubmit(values) {
    let orderData = [];
    if (values.subcategory_ids && values.subcategory_ids.length > 0) {
      orderData = getNewRequestArray(values.subcategory_ids);
    }
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
     // closeModal();
      const postData = {
        name: values.name,
        is_incident: values.is_incident,
        team_category_id: extractValueObjects(values.team_category_id),
        incident_type_id: extractValueObjects(values.incident_type_id),
        cat_user_ids: values.cat_user_ids && values.cat_user_ids.length && values.cat_user_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.cat_user_ids, 'id')]] : [[6, 0, []]],
        access_group_ids: values.access_group_ids && values.access_group_ids.length && values.access_group_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.access_group_ids, 'id')]] : [[6, 0, []]],
        subcategory_ids: values.subcategory_ids && values.subcategory_ids.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : false,
      };
      dispatch(updateProductCategory(editId, appModels.TICKETCATEGORY, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      //closeModal();
      const { name } = values;
      const teamCategoryId = extractValueObjects(values.team_category_id);
      const incidentTypeId = extractValueObjects(values.incident_type_id);
      const userIds = values.cat_user_ids && values.cat_user_ids.length && values.cat_user_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.cat_user_ids, 'id')]] : [[6, 0, []]];
      const accessIds = values.access_group_ids && values.access_group_ids.length && values.access_group_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.access_group_ids, 'id')]] : [[6, 0, []]];

      const postData = { ...values };

      postData.name = name;
      postData.team_category_id = teamCategoryId;
      postData.incident_type_id = incidentTypeId;
      postData.cat_user_ids = userIds;
      postData.access_group_ids = accessIds;
      postData.subcategory_ids = values.subcategory_ids && values.subcategory_ids.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : false;
      postData.company_id = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
      const payload = { model: appModels.TICKETCATEGORY, values: postData };
      dispatch(createProductCategory(appModels.TICKETCATEGORY, payload));
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
          initialValues={editId && pcInfo && pcInfo.data && pcInfo.data.length > 0 ? trimJsonObject(pcInfo.data[0]) : formInitialValues}
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
                    <SubCategoryForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} subCategoryValues={subCategoryValues} />
                  </div>
                </ThemeProvider>
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (pcInfo && pcInfo.loading)) && (
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
                  successMessage={addProductCategoryInfo.data ? 'Product category added successfully..' : 'Product category details are updated successfully..'}
                />
              )} */}
              <div className="float-right m-4">
                <div className="sticky-button-85drawer">
                  <Button
                    disabled={!editId
                      ? (!dirty || (partsSelected && !partsSelected.length > 0) || !checkPrirority(partsSelected))
                      : (!isValid || (partsSelected && !partsSelected.length > 0) || !checkPrirority(partsSelected))}
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
                headerText="Problem Category"
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
