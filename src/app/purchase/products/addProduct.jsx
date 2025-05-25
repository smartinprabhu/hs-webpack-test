/* eslint-disable import/no-unresolved */
/* eslint-disable no-nested-ternary */
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Box, FormControl, Button,
} from '@mui/material';

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
  addProduct, updateProduct, 
  getProductDetails,
} from '../purchaseService';
import { getColumnArrayById, extractValueObjects, getArrayNewFormat } from '../../util/appUtils';

const { formId, formField } = checkoutFormModel;

const appModels = require('../../util/appModels').default;

const AddProduct = React.memo((props) => {
  const {
    isEdit, isUpdate, reset, viewProduct, isTheme,
    isPantry, closeModal, closeAddModal, isModal, visibility, editId,
  } = props;

  const dispatch = useDispatch();
  const [reload, setReload] = useState('1');
  const [edit, setEdit] = useState(false);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const {
    addProductInfo, productDetailsInfo, updateProductInfo, uniqueCodeRecords, companyPrice,
  } = useSelector((state) => state.purchase);

  const {
    inventorySettingsInfo,
  } = useSelector((state) => state.site);

  const duplicateExists = uniqueCodeRecords && uniqueCodeRecords.data && uniqueCodeRecords.data.length > 0;
  const duplicateExistsEdit = uniqueCodeRecords && uniqueCodeRecords.data && uniqueCodeRecords.data.length > 0 && uniqueCodeRecords.data[0].id !== editId;

  const invSettingData = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length ? inventorySettingsInfo.data[0] : false;
  const productsListAccess = invSettingData ? invSettingData.products_list_access : false;
  const productsListId = invSettingData && productsListAccess && productsListAccess === 'Company Level' && invSettingData.product_list_company_id.id ? invSettingData.product_list_company_id.id : false;

  const { userInfo } = useSelector((state) => state.user);
  const companyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  useEffect(() => {
    if (addProductInfo && addProductInfo.data && addProductInfo.data.data && addProductInfo.data.data.length && !isEdit) {
      dispatch(getProductDetails(appModels.PRODUCT, addProductInfo.data.data[0]));
    }
  }, [userInfo, addProductInfo]);

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
    if (editId) {
      if (values.seller_ids && values.seller_ids.length) {
        // eslint-disable-next-line array-callback-return
        values.seller_ids.map((id) => {
          // eslint-disable-next-line no-param-reassign
          id.name = id.name && id.name.length ? id.name[0] : id.name;
        });
      }
      const postData = {
        name: values.name.trim(),
        unique_code: values.unique_code ? values.unique_code.trim() : false,
        type: values.type && values.type.value ? values.type.value : values.type,
        categ_id: values.categ_id && values.categ_id.id ? values.categ_id.id : values.categ_id[0],
        // taxes_id: values.taxes_id ? (values.taxes_id.length > 0 && values.taxes_id[0].id ? [[6, false, getColumnArrayById(values.taxes_id, 'id')]] : [[6, false, values.taxes_id]]) : '',
        // responsible_id: values.responsible_id && (values.responsible_id.id ? values.responsible_id.id
        // : values.responsible_id.length ? values.responsible_id[0] : ''),
        // hs_code_id: values.hs_code_id && (values.hs_code_id.id ? values.hs_code_id.id
        // : values.hs_code_id.length ? values.hs_code_id[0] : ''),
        // barcode: values.barcode,
        // origin_country_id: values.origin_country_id && (values.origin_country_id.id ? values.origin_country_id.id
        // : values.origin_country_id.length ? values.origin_country_id[0] : ''),
        // default_code: values.default_code,
        // volume: values.volume,
        // weight: values.weight,
        // seller_ids: values.seller_ids && values.seller_ids.length ? getArrayNewFormatUpdateDelete(values.seller_ids) : [],
        image_medium: values.image_medium,
        // route_ids: values.route_ids ? [[6, false, values.route_ids]] : [],
        maintenance_ok: values.maintenance_ok,
        sale_ok: values.sale_ok,
        purchase_ok: values.purchase_ok,
        standard_price: parseFloat(values.standard_price ? values.standard_price : 0).toFixed(2),
        // description: values.description,
        // sale_delay: values.sale_delay,
        list_price: values.list_price,
        // company_id: companyId,
        specification: values.specification ? values.specification.trim() : '',
        brand: values.brand ? values.brand.trim() : '',
        cost: values.cost ? values.cost.trim() : '',
        department_id: extractValueObjects(values.department_id),
        preferred_vendor: extractValueObjects(values.preferred_vendor),
        uom_id: extractValueObjects(values.uom_id),
        // reordering_min_qty: values.reordering_min_qty,
        // alert_level_qty: values.alert_level_qty,
        // reordering_max_qty: values.reordering_max_qty,
      };
      postData.standard_price = Number(postData.standard_price);
      if (!isCompany && !isSite) {
        delete postData.standard_price;
      }
      setIsOpenSuccessAndErrorModalWindow(true);
      dispatch(updateProduct(appModels.PRODUCT, editId, postData));
      /* if (!edit || (updateProductInfo && updateProductInfo.err)) {
         setEdit(true);
         setIsOpenSuccessAndErrorModalWindow(true);
         closeModal();
         dispatch(updateProduct(appModels.PARTS, isEdit, postData));
       } */
    } else {
      const postData = {
        name: values.name ? values.name.trim() : '',
        type: values.type ? values.type.value : '',
        unique_code: values.unique_code ? values.unique_code.trim() : false,
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
        standard_price: parseFloat(values.standard_price ? values.standard_price : 0).toFixed(2),
        description: values.description,
        sale_delay: values.sale_delay,
        list_price: values.list_price,
        company_id: productsListId || companyId,
        uom_id: values.uom_id && values.uom_id.id ? values.uom_id.id : '',
        uom_po_id: values.uom_id && values.uom_id.id ? values.uom_id.id : '',
        specification: values.specification ? values.specification.trim() : '',
        brand: values.brand ? values.brand.trim() : '',
        department_id: extractValueObjects(values.department_id),
        preferred_vendor: extractValueObjects(values.preferred_vendor),
        // reordering_min_qty: values.reordering_min_qty,
        // alert_level_qty: values.alert_level_qty,
        // reordering_max_qty: values.reordering_max_qty,
      };
      postData.standard_price = Number(postData.standard_price);
      if (!isCompany && !isSite) {
        delete postData.standard_price;
      }
      if (isPantry) {
        postData.is_pantry_item = true;
      }
      const payload = { model: appModels.PRODUCT, values: postData };
      dispatch(addProduct(appModels.PRODUCT, payload));
      if (!isPantry && !isModal) {
        setIsOpenSuccessAndErrorModalWindow(true);
      }
    }
  };

  const closeAddMaintenance = () => {
    reset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  const handleReset = (resetForm) => {
    resetForm();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (reset) reset();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length ? getCostValues(productDetailsInfo.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, values, dirty, setFieldValue, resetForm,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  width: '100%',
                  maxHeight: '100vh',
                  overflow: 'auto',
                  marginBottom: '40px',
                }}
              >
                <FormControl
                  sx={{
                    width: '100%',
                    padding: '10px 0px 20px 30px',
                    borderTop: '1px solid #0000001f',
                    // display: 'flex',
                  }}
                >
                  {visibility && (
                    <>
                      {!isTheme && (
                        <ThemeProvider theme={theme}>
                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              gap: '35px',
                            }}
                          >
                            <BasicForm formField={formField} setFieldValue={setFieldValue} reload={reload} isEdit={editId} />
                            <AdvanceForm isUpdate={isUpdate} formField={formField} setFieldValue={setFieldValue} viewProduct={viewProduct} reload={reload} isEdit={editId} />
                          </Box>
                        </ThemeProvider>
                      )}
                      {isTheme && (
                        <Box
                          sx={{
                            width: '100%',
                            display: 'flex',
                            gap: '35px',
                          }}
                        >
                          <BasicForm formField={formField} setFieldValue={setFieldValue} reload={reload} isEdit={editId} />
                          <AdvanceForm formField={formField} setFieldValue={setFieldValue} viewProduct={viewProduct} reload={reload} isEdit={editId} />
                        </Box>
                      )}
                    </>
                  )}
                </FormControl>
              </Box>

              {((addProductInfo && addProductInfo.loading) || (updateProductInfo && updateProductInfo.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              <>
                {!isModal && (addProductInfo && !addProductInfo.data && !addProductInfo.loading)
                  && (updateProductInfo && !updateProductInfo.data && !updateProductInfo.loading) && (
                    <div className={!editId ? 'sticky-button-65drawer' : 'sticky-button-50drawer'}>
                      {isEdit && duplicateExistsEdit && values.unique_code && (
                        <span className="ml-2 text-danger">A Record for the entered product code already exists.</span>
                      )}
                      {!isEdit && duplicateExists && values.unique_code && (
                        <span className="ml-2 text-danger">A Record for the entered product code already exists.</span>
                      )}
                      <Button
                        disabled={!isEdit ? !(isValid && dirty) || (duplicateExists && values.unique_code) : !isValid || (duplicateExistsEdit && values.unique_code)}
                        type="submit"
                        variant="contained"
                      >
                        {!editId ? 'Create' : 'Update'}
                      </Button>
                    </div>
                )}
                {isModal && (addProductInfo && !addProductInfo.data && !addProductInfo.loading)
                  && (updateProductInfo && !updateProductInfo.data && !updateProductInfo.loading) && (
                    <div className={!editId ? 'sticky-button-65drawer' : 'sticky-button-50drawer'}>
                      {isEdit && duplicateExistsEdit && values.unique_code && (
                        <span className="ml-2 text-danger">A Record for the entered product code already exists.</span>
                      )}
                      {!isEdit && duplicateExists && values.unique_code && (
                        <span className="ml-2 text-danger">A Record for the entered product code already exists.</span>
                      )}
                      <Button
                        disabled={!isEdit ? !(isValid && dirty) || (duplicateExists && values.unique_code) : !isValid || (duplicateExistsEdit && values.unique_code)}
                        type="submit"
                        size="sm"
                        variant="contained"
                      >
                        {!editId ? 'Create' : 'Update'}
                      </Button>
                    </div>
                )}
              </>
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

              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateProductInfo : addProductInfo}
                headerImage={InventoryBlue}
                headerText="Products"
                // eslint-disable-next-line react/jsx-no-bind
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>

    </Row>
  );
});

AddProduct.propTypes = {
  isEdit: PropTypes.bool,
  editId: PropTypes.bool,
  viewProduct: PropTypes.number,
  reset: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  closeAddModal: PropTypes.func.isRequired,
  isTheme: PropTypes.bool,
  isModal: PropTypes.bool,
  isPantry: PropTypes.bool,
};
AddProduct.defaultProps = {
  isEdit: false,
  editId: false,
  viewProduct: undefined,
  isTheme: false,
  isModal: false,
  isPantry: false,
};
export default AddProduct;
