/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import {
  Button,
} from '@mui/material';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import PurchaseHandBlue from '@images/icons/purchaseHandBlue.svg';

import BasicForm from './forms/basicForm';
import SalesForm from './forms/salesForm';
import AdditionalForm from './forms/additionalForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createVendor, getVendorsList, getVendorsCount,
  storeContacts, resetAddVendorInfo,
} from '../purchaseService';
import {
  updateTenant,
} from '../../adminSetup/setupService';
import theme from '../../util/materialTheme';
// import tabs from './tabs.json';
import {
  getArrayNewFormat, trimJsonObject, getColumnArrayById, getArrayNewFormatUpdateDelete,
  getAllowedCompanies,
} from '../../util/appUtils';
import { removeEmptyArrayElements } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddVendor = (props) => {
  const {
    editId,
    isTheme,
    isModal,
    modalHead,
    afterReset,
    closeModal,
    closeAddModal,
    closeEditModal,
  } = props;
  const dispatch = useDispatch();
  const [reload, setReload] = useState('1');

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { addVendorInfo, vendorDetails } = useSelector((state) => state.purchase);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  useEffect(() => {
    dispatch(storeContacts([]));
    dispatch(resetAddVendorInfo());
    setIsOpenSuccessAndErrorModalWindow(false);
  }, []);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (addVendorInfo && addVendorInfo.data)) {
      const statusValues = [];
      const langValues = [];
      const customFilters = '';
      dispatch(getVendorsList(companies, appModels.PARTNER, limit, offsetValue, statusValues, langValues, customFilters, sortByValue, sortFieldValue));
      dispatch(getVendorsCount(companies, appModels.PARTNER, statusValues, langValues, customFilters));
    }
  }, [userInfo, addVendorInfo]);

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeEditModal();
      const postData = {
        company_type: values.company_type,
        company_name: values.company_name,
        name: values.name,
        street: values.street,
        city: values.city,
        zip: values.zip,
        phone: values.phone,
        mobile: values.mobile,
        email: values.email,
        website: values.website,
        customer: values.customer,
        supplier: values.supplier,
        is_visitor: values.is_visitor,
        is_tenant: values.is_tenant,
        is_fm_services: values.is_fm_services,
        is_command_centre: values.is_command_centre,
        file_path: values.file_path,
        is_man_power_agency: values.is_man_power_agency,
        ref: values.ref,
        barcode: values.barcode,
        comment: values.comment,
        state_id: values.state_id ? values.state_id.id : '',
        country_id: values.country_id ? values.country_id.id : '',
        user_id: values.user_id ? values.user_id.id : '',
        lang: values.lang ? values.lang.value : '',
        property_payment_term_id: values.property_payment_term_id ? values.property_payment_term_id.id : '',
        property_supplier_payment_term_id: values.property_supplier_payment_term_id ? values.property_supplier_payment_term_id.id : '',
        property_account_position_id: values.property_account_position_id ? values.property_account_position_id.id : '',
        website_id: values.website_id ? values.website_id.id : '',
        dedicated_support_user_id: values.dedicated_support_user_id ? values.dedicated_support_user_id.id : '',
        sla_id: values.sla_id ? values.sla_id.id : '',
        property_account_receivable_id: values.property_account_receivable_id ? values.property_account_receivable_id.id : '',
        property_account_payable_id: values.property_account_payable_id ? values.property_account_payable_id.id : '',
        child_ids: values.child_ids && values.child_ids.length > 0 ? getArrayNewFormatUpdateDelete(values.child_ids) : false,
        bank_ids: values.bank_ids && values.bank_ids.length > 0 ? getArrayNewFormatUpdateDelete(removeEmptyArrayElements(values.bank_ids, 'update')) : false,
        category_id: values.category_id && values.category_id.length && values.category_id.length > 0 ? [[6, 0, getColumnArrayById(values.category_id, 'id')]] : [],
        image_medium: values.image_medium ? values.image_medium : '',
        image_small: values.image_small ? values.image_small : '',
        // eslint-disable-next-line no-nested-ternary
        industry_id: values.industry_id && values.industry_id.length ? values.industry_id[0] : values.industry_id.id ? values.industry_id.id : '',
      };
      dispatch(updateTenant(editId, postData, appModels.PARTNER));
    } else {
      const stateId = values.state_id.id;
      const countryId = values.country_id.id;
      const companyValue = userInfo && userInfo.data ? userInfo.data.company.id : '';
      const lang = values.lang && values.lang.value
        ? values.lang.value : false;
      const categoryId = values.category_id && values.category_id.length && values.category_id.length > 0
        ? [[6, 0, getColumnArrayById(values.category_id, 'id')]] : false;
      const companyId = values.company_id && values.company_id.id
        ? values.company_id.id : companyValue;
      const userId = values.user_id && values.user_id.id
        ? values.user_id.id : '';
      const propertyPaymentTermId = values.property_payment_term_id && values.property_payment_term_id.id
        ? values.property_payment_term_id.id : '';
      const propertySupplierPaymentTermId = values.property_supplier_payment_term_id && values.property_supplier_payment_term_id.id
        ? values.property_supplier_payment_term_id.id : '';
      const websiteId = values.website_id && values.website_id.id
        ? values.website_id.id : '';
      const propertyAccountPositionId = values.property_account_position_id && values.property_account_position_id.id
        ? values.property_account_position_id.id : '';
      const dedicatedSupportUserId = values.dedicated_support_user_id && values.dedicated_support_user_id.id
        ? values.dedicated_support_user_id.id : '';
      const slaId = values.sla_id && values.sla_id.id
        ? values.sla_id.id : '';
      const propertyAccountReceivableId = values.property_account_receivable_id && values.property_account_receivable_id.id
        ? values.property_account_receivable_id.id : '';
      const propertyAccountPayableId = values.property_account_payable_id && values.property_account_payable_id.id
        ? values.property_account_payable_id.id : '';
      const imageLogo = values && values.image_medium
        ? values.image_medium : '';
      const industryId = values.industry_id && values.industry_id.id ? values.industry_id.id : '';
      const postData = { ...values };

      postData.state_id = stateId;
      postData.country_id = countryId;
      postData.lang = lang;
      postData.category_id = categoryId;
      postData.company_id = companyId;
      postData.user_id = userId;
      postData.property_payment_term_id = propertyPaymentTermId;
      postData.property_supplier_payment_term_id = propertySupplierPaymentTermId;
      postData.website_id = websiteId;
      postData.property_account_position_id = propertyAccountPositionId;
      postData.dedicated_support_user_id = dedicatedSupportUserId;
      postData.sla_id = slaId;
      postData.property_account_receivable_id = propertyAccountReceivableId;
      postData.property_account_payable_id = propertyAccountPayableId;
      postData.parent_id = false;
      postData.image = imageLogo;
      postData.industry_id = industryId;

      if (values.bank_ids && values.bank_ids.length > 0) {
        postData.bank_ids = getArrayNewFormat(removeEmptyArrayElements(values.bank_ids, 'add'));
      }

      if (values.child_ids && values.child_ids.length > 0) {
        postData.child_ids = getArrayNewFormat(values.child_ids);
      }
      if (!isModal) {
        setIsOpenSuccessAndErrorModalWindow(true);
        closeAddModal();
      }

      const payload = { model: appModels.PARTNER, values: postData };
      dispatch(createVendor(appModels.PARTNER, payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const formData = (setFieldValue) => (
    <>
      {/*  <Nav>
        {tabs && tabs.formTabs.map((item) => (
          <div className="mr-5 ml-5" key={item.id}>
            <NavLink
              className="nav-link-item pt-2 pb-1 pl-1 pr-1"
              active={currentTab === item.name}
              href="#"
              onClick={() => { setActive(item.name); setReload('0'); }}
            >
              {item.name}
            </NavLink>
          </div>
        ))}
        </Nav> */}
      <br />
      <div>
        <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} reload={reload} />
        <SalesForm formField={formField} setFieldValue={setFieldValue} />
        <AdditionalForm formField={formField} editId={editId} setFieldValue={setFieldValue} />
      </div>
      {/*  {currentTab === 'Advanced' && (
      <div className="pt-1 pr-5 pl-4 pb-5 mr-2 ml-4">
        <Row>
          <Col md="12" sm="12" lg="12" xs="12">
            <SalesForm formField={formField} setFieldValue={setFieldValue} />
            <AdditionalForm formField={formField} editId={editId} setFieldValue={setFieldValue} />
          </Col>
        </Row>
      </div>
    )} */}
    </>
  );

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={editId && vendorDetails && vendorDetails.data ? trimJsonObject(vendorDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, resetForm,
          }) => (
            <Form id={formId}>
              {(addVendorInfo && addVendorInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.loading) ? ('') : (
                <>
                  {!isTheme
                    ? (
                      <ThemeProvider theme={theme}>
                        {formData(setFieldValue)}
                      </ThemeProvider>
                    )
                    : formData(setFieldValue)}
                </>
              )}
              {addVendorInfo && addVendorInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {(addVendorInfo && addVendorInfo.err) && (
              <SuccessAndErrorFormat response={addVendorInfo} />
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.err) && (
              <SuccessAndErrorFormat response={tenantUpdateInfo} />
              )}
              {(addVendorInfo && addVendorInfo.data) && (
                <SuccessAndErrorFormat response={addVendorInfo} successMessage={isModal ? modalHead : 'Vendor added successfully..'} />
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.data) && (
                <SuccessAndErrorFormat response={tenantUpdateInfo} successMessage={isModal ? modalHead : 'Vendor Updated successfully..'} />
              )}
              <hr />
              <div className="float-right mr-4 mb-4">
                {(addVendorInfo && addVendorInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data) ? (
                  <Button
                    size="sm"
                    variant="contained"
                    onClick={handleReset.bind(null, resetForm)}
                  >
                    ok
                  </Button>
                ) : (
                  <>
                    {!isModal && (addVendorInfo && !addVendorInfo.data && !addVendorInfo.loading)
                        && (tenantUpdateInfo && !tenantUpdateInfo.data && !tenantUpdateInfo.loading) && (
                        <div className="bg-lightblue sticky-button-1250drawer">
                          <Button
                            disabled={!editId ? !(isValid && dirty) : !isValid}
                            type="submit"
                            size="sm"
                            variant="contained"
                          >
                            {!editId ? 'Create' : 'Update'}
                          </Button>
                        </div>
                    )}
                    {isModal && (addVendorInfo && !addVendorInfo.data && !addVendorInfo.loading)
                        && (tenantUpdateInfo && !tenantUpdateInfo.data && !tenantUpdateInfo.loading) && (
                          <div className="float-right">
                            <Button
                              disabled={!editId ? !(isValid && dirty) : !isValid}
                              type="submit"
                              size="sm"
                              variant="contained"
                            >
                              {!editId ? 'Create' : 'Update'}
                            </Button>
                          </div>
                    )}
                  </>
                )}
              </div>

              {!isModal
                ? (
                  <SuccessAndErrorModalWindow
                    isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                    setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                    type={editId ? 'update' : 'create'}
                    successOrErrorData={editId ? tenantUpdateInfo : addVendorInfo}
                    headerImage={PurchaseHandBlue}
                    headerText="Vendors"
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

AddVendor.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  modalHead: PropTypes.string.isRequired,
  afterReset: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  closeEditModal: PropTypes.func.isRequired,
  closeAddModal: PropTypes.func.isRequired,
  isTheme: PropTypes.bool,
  isModal: PropTypes.bool,
};

AddVendor.defaultProps = {
  isTheme: false,
  isModal: false,
};
export default AddVendor;
