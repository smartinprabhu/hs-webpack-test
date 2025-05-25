/* eslint-disable import/no-unresolved */
/* eslint-disable no-nested-ternary */
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import { Button } from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import InventoryBlue from '@images/icons/inventoryBlue.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import theme from '../../util/materialTheme';
import BasicForm from './forms/basicForm';
import AdvanceForm from './forms/advancedForm';
import {
  getInventorySettingDetails,
} from '../../siteOnboarding/siteService';
import {
  addProduct, updateProduct, clearEditProduct,
  getProductDetails, getCompanyPrice,
} from '../purchaseService';
import {
  getColumnArrayById, getArrayNewFormatUpdateDelete, getArrayNewFormat, extractValueObjects,
} from '../../util/appUtils';

const { formId, formField } = checkoutFormModel;

const appModels = require('../../util/appModels').default;

const AddProductMini = ({
  isEdit, reset, viewProduct, isTheme,
  isPantry, closeModal, closeAddModal, isModal,
  productName, setProductKeyword, productCategoryId,
}) => {
  const dispatch = useDispatch();
  const [reload, setReload] = useState('1');
  const [save, setSave] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const {
    addProductInfo, productDetailsInfo, updateProductInfo, uniqueCodeRecords, companyPrice,
  } = useSelector((state) => state.purchase);
  const { userInfo } = useSelector((state) => state.user);
  const companyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  const {
    inventorySettingsInfo,
  } = useSelector((state) => state.site);

  const duplicateExists = uniqueCodeRecords && uniqueCodeRecords.data && uniqueCodeRecords.data.length > 0;
  const duplicateExistsEdit = uniqueCodeRecords && uniqueCodeRecords.data && uniqueCodeRecords.data.length > 0 && uniqueCodeRecords.data[0].id !== isEdit;

  const invSettingData = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length ? inventorySettingsInfo.data[0] : false;
  const productsListAccess = invSettingData ? invSettingData.products_list_access : false;
  const productsListId = invSettingData && productsListAccess && productsListAccess === 'Company Level' && invSettingData.product_list_company_id.id ? invSettingData.product_list_company_id.id : false;

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getInventorySettingDetails(userInfo.data.company.id, appModels.INVENTORYCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (addProductInfo && addProductInfo.data && addProductInfo.data.data && addProductInfo.data.data.length && !isEdit) {
      dispatch(getProductDetails(appModels.PRODUCT, addProductInfo.data.data[0]));
    }
  }, [userInfo, addProductInfo]);

  useEffect(() => {
    if (productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length) {
      const strProduct = `product.product,${productDetailsInfo.data[0].id}`;
      const parentId = userInfo.data && userInfo.data.company && userInfo.data.company.parent_id && userInfo.data.company.parent_id.id ? userInfo.data.company.parent_id.id : false;
      let cids = [companyId];
      if (parentId) {
        cids = [parentId, companyId];
      }
      dispatch(getCompanyPrice(productDetailsInfo.data[0].id));
    }
  }, [productDetailsInfo]);

  const getCost = () => {
    const res = companyPrice && companyPrice.data && companyPrice.data.length && companyPrice.data[0].value ? companyPrice.data[0].value : 0;
    return res;
  };

  function getCostValues(datas) {
    const editData = { ...datas };
    editData.standard_price = getCost();
    return editData;
  }

  const currentCompany = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : false;

  const isCompany = currentCompany && productsListId && (productsListId === currentCompany);
  const isSite = productsListAccess && productsListAccess === 'Own Site Level';

  const onLoadProduct = (eid) => {
    if (eid && productDetailsInfo && productDetailsInfo.data) {
      /* const customFilters = [{
          key: 'id',
          value: eid,
          label: productDetailsInfo.data[0].name,
          type: 'id',
          refer_link: '/overview',
          refer_id: productDetailsInfo.data[0].id,
          refer_label: productDetailsInfo.data[0].name,
          refer_type: 'id',
        }]; */
      reset(); // clearAddProduct(); clearEditProduct();
      // dispatch(productFilters([], [], customFilters));
    }
  };

  const handleSubmit = (values) => {
    // setProductKeyword(values.name);
    if (setProductKeyword) {
      setProductKeyword(values.name);
    }
    if (viewProduct) {
      if (values.seller_ids && values.seller_ids.length) {
        // eslint-disable-next-line array-callback-return
        values.seller_ids.map((id) => {
          // eslint-disable-next-line no-param-reassign
          id.name = id.name && id.name.length ? id.name[0] : id.name;
        });
      }
      const postData = {
        name: values.name,
        unique_code: values.unique_code ? values.unique_code.trim() : false,
        type: values.type && values.type.value ? values.type.value : values.type,
        categ_id: values.categ_id && values.categ_id.id ? values.categ_id.id : values.categ_id[0],
        taxes_id: values.taxes_id ? (values.taxes_id.length > 0 && values.taxes_id[0].id ? [[6, false, getColumnArrayById(values.taxes_id, 'id')]] : [[6, false, values.taxes_id]]) : '',
        responsible_id: values.responsible_id && (values.responsible_id.id ? values.responsible_id.id
          : values.responsible_id.length ? values.responsible_id[0] : ''),
        hs_code_id: values.hs_code_id && (values.hs_code_id.id ? values.hs_code_id.id
          : values.hs_code_id.length ? values.hs_code_id[0] : ''),
        // barcode: values.barcode,
        origin_country_id: values.origin_country_id && (values.origin_country_id.id ? values.origin_country_id.id
          : values.origin_country_id.length ? values.origin_country_id[0] : ''),
        default_code: values.default_code,
        volume: values.volume,
        weight: values.weight,
        seller_ids: values.seller_ids && values.seller_ids.length ? getArrayNewFormatUpdateDelete(values.seller_ids) : [],
        image_medium: values.image_medium,
        route_ids: values.route_ids ? [[6, false, values.route_ids]] : [],
        maintenance_ok: values.maintenance_ok,
        sale_ok: values.sale_ok,
        purchase_ok: values.purchase_ok,
        standard_price: parseInt(values.standard_price),
        description: values.description,
        sale_delay: values.sale_delay,
        list_price: values.list_price,
        // company_id: companyId,
        preferred_vendor: extractValueObjects(values.preferred_vendor),

      };
      if (!isCompany && !isSite) {
        delete postData.standard_price;
      }
      if (!edit || (updateProductInfo && updateProductInfo.err)) {
        setEdit(true);
        setIsOpenSuccessAndErrorModalWindow(true);
        closeModal();
        dispatch(updateProduct(appModels.PRODUCT, viewProduct, postData));
      }
    } else {
      const postData = {
        name: values.name ? values.name : '',
        unique_code: values.unique_code ? values.unique_code : false,
        type: values.type ? values.type.value : '',
        categ_id: values.categ_id ? values.categ_id.id : '',
        taxes_id: values.taxes_id && values.taxes_id.length && values.taxes_id.length > 0
          ? [[6, false, getColumnArrayById(values.taxes_id, 'id')]] : false,
        responsible_id: values.responsible_id ? values.responsible_id.id : '',
        hs_code_id: values.hs_code_id ? values.hs_code_id.id : '',
        // barcode: values.barcode,
        origin_country_id: values.origin_country_id ? values.origin_country_id.id : '',
        default_code: values.default_code,
        volume: values.volume,
        weight: values.weight,
        seller_ids: values.seller_ids && values.seller_ids.length ? getArrayNewFormat(values.seller_ids) : [],
        image_medium: values.image_medium,
        route_ids: values.route_ids ? [[6, false, values.route_ids]] : [],
        maintenance_ok: values.maintenance_ok,
        sale_ok: values.sale_ok,
        purchase_ok: values.purchase_ok,
        standard_price: parseInt(values.standard_price),
        description: values.description,
        sale_delay: values.sale_delay,
        list_price: values.list_price,
        company_id: productsListId || companyId,
        uom_id: values.uom_id && values.uom_id.id ? values.uom_id.id : '',
        uom_po_id: values.uom_id && values.uom_id.id ? values.uom_id.id : '',
        preferred_vendor: extractValueObjects(values.preferred_vendor),

      };
      if (!isCompany && !isSite) {
        delete postData.standard_price;
      }
      if (isPantry) {
        postData.is_pantry_item = true;
      }
      const payload = { model: appModels.PRODUCT, values: postData };
      if (!save || (addProductInfo && addProductInfo.err)) {
        setSave(true);
        dispatch(addProduct(appModels.PRODUCT, payload));
        if (!isPantry && !isModal) {
          setIsOpenSuccessAndErrorModalWindow(true);
          closeAddModal();
        }
      }
    }
  };

  const closeAddMaintenance = () => {
    reset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  const handleReset = (resetForm) => {
    resetForm();
    reset();
    setIsOpenSuccessAndErrorModalWindow(false);
    if (reset) reset();
  };

  return (
    <Row className="pl-0 pr-0 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={isEdit && productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length ? getCostValues(productDetailsInfo.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, values, dirty, setFieldValue, resetForm,
          }) => (
            <Form id={formId}>
              {((addProductInfo && addProductInfo.data) || (updateProductInfo && updateProductInfo.data)) ? ('') : (
                <>
                  {!isTheme && (
                    <ThemeProvider theme={theme}>
                      <div>
                        <BasicForm formField={formField} setFieldValue={setFieldValue} reload={reload} isEdit={isEdit} />
                        <AdvanceForm formField={formField} setFieldValue={setFieldValue} viewProduct={viewProduct} reload={reload} isEdit={isEdit} />
                      </div>
                    </ThemeProvider>
                  )}
                  {isTheme && (
                    <div>
                      <BasicForm
                        formField={formField}
                        productCategoryId={productCategoryId}
                        productNameDynamic={productName}
                        setFieldValue={setFieldValue}
                        reload={reload}
                        isEdit={isEdit}
                        isTheme={isTheme}
                      />
                    </div>
                  )}
                </>
              )}
              {(updateProductInfo && updateProductInfo.err) && (
                <SuccessAndErrorFormat response={updateProductInfo} />
              )}
              {(updateProductInfo && updateProductInfo.data) && (
                <SuccessAndErrorFormat response={updateProductInfo} successMessage="Product Updated successfully" />
              )}
              {((addProductInfo && addProductInfo.loading) || (updateProductInfo && updateProductInfo.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(addProductInfo && addProductInfo.err) && (
                <SuccessAndErrorFormat response={addProductInfo} />
              )}
              {(addProductInfo && addProductInfo.data) && (
                <>
                  <SuccessAndErrorFormat response={addProductInfo} successMessage="Product added successfully" />
                  {/* {!isEdit && productDetailsInfo && productDetailsInfo.data && (
                      <p className="text-center mt-2 mb-0 tab_nav_link">
                        Click here to view Product:
                        <span aria-hidden="true" className="ml-2 cursor-pointer text-info" onClick={() => onLoadProduct(productDetailsInfo.data[0].id)}>{productDetailsInfo.data[0].name}</span>
                        {' '}
                        details
                      </p>
                   )} */}
                </>
              )}
              <hr />

              {(addProductInfo && addProductInfo.data) || (updateProductInfo && updateProductInfo.data) ? (
                <div className="float-right mr-4">
                  <Button
                    variant="contained"
                    onClick={() => { reset(); clearEditProduct(); }}
                  >
                    ok
                  </Button>

                </div>
              ) : (
                <>
                  {!isModal && (addProductInfo && !addProductInfo.data && !addProductInfo.loading)
                    && (updateProductInfo && !updateProductInfo.data && !updateProductInfo.loading) && (
                      //  <div className="bg-lightblue sticky-button-1250drawer">
                      <div className="text-right">
                        <Button
                          disabled={!isEdit ? !(isValid && dirty) || (duplicateExists && values.unique_code) : !isValid || (duplicateExistsEdit && values.unique_code)}
                          type="submit"
                          variant="contained"
                        >
                          {!isEdit ? 'Create' : 'Update'}
                        </Button>
                        {isEdit && duplicateExistsEdit && values.unique_code && (
                          <p className="m-0 text-danger">A Record for the entered product code already exists.</p>
                        )}
                        {!isEdit && duplicateExists && values.unique_code && (
                          <p className="m-0 text-danger">A Record for the entered product code already exists.</p>
                        )}
                      </div>
                  )}
                  {isModal && (addProductInfo && !addProductInfo.data && !addProductInfo.loading)
                    && (updateProductInfo && !updateProductInfo.data && !updateProductInfo.loading) && (
                      <div className="text-right">
                        <Button
                          disabled={!isEdit ? !(isValid && dirty) || (duplicateExists && values.unique_code) : !isValid || (duplicateExistsEdit && values.unique_code)}
                          type="submit"
                          variant="contained"
                        >
                          {!isEdit ? 'Create' : 'Update'}
                          {isEdit && duplicateExistsEdit && values.unique_code && (
                            <p className="m-0 text-danger">A Record for the entered product code already exists.</p>
                          )}
                          {!isEdit && duplicateExists && values.unique_code && (
                            <p className="m-0 text-danger">A Record for the entered product code already exists.</p>
                          )}
                        </Button>
                      </div>
                  )}
                </>
              )}
              {/* <div className="float-right m-4">
                  <>
                    <Button
                      disabled={!isEdit ? !(isValid && dirty) : !isValid}
                      type="submit"
                      size="sm"
                       variant="contained"
                    >
                      {!viewProduct ? 'Add' : 'Update'}
                    </Button>
                  </>
                  </div> */}
              {!isModal
                ? (
                  <SuccessAndErrorModalWindow
                    isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                    setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                    type={isEdit ? 'update' : 'create'}
                    successOrErrorData={isEdit ? updateProductInfo : addProductInfo}
                    headerImage={InventoryBlue}
                    headerText="Products"
                    // eslint-disable-next-line react/jsx-no-bind
                    successRedirect={handleReset.bind(null, resetForm)}
                  />
                ) : ''}
            </Form>
          )}
        </Formik>
      </Col>

    </Row>
  );
};

AddProductMini.propTypes = {
  isEdit: PropTypes.bool,
  viewProduct: PropTypes.number,
  reset: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  closeAddModal: PropTypes.func.isRequired,
  isTheme: PropTypes.bool,
  isModal: PropTypes.bool,
  isPantry: PropTypes.bool,
  productName: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};
AddProductMini.defaultProps = {
  isEdit: false,
  viewProduct: undefined,
  isTheme: false,
  isModal: false,
  isPantry: false,
  productName: false,
};
export default AddProductMini;
