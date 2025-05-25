/* eslint-disable max-len */
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
import { Button, Divider } from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import WorkPermitBlue from '@images/icons/gatepass.svg';

import BasicForm from './forms/basicForm';
import ProductForm from './forms/productForm';
import AssetsForm from './forms/assetsForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  getGatePass, getGatePassCount, getGatePassDetails,
  createGatePass, updateGatePass, resetCreateGatePass, getGatePassPartsData,
} from './gatePassService';
import theme from '../util/materialTheme';
import {
  getAllowedCompanies, trimJsonObject, extractValueObjects, getArrayNewFormatUpdateDelete,
  getColumnArrayById,
  getArrayNewFormatUpdateDeleteNewV1,
  getDateTimeUtcMuI,
} from '../util/appUtils';
import { getNewRequestArray, checkAssetId, checkEquipmentArray, checkEquipmentArrayUpdate, checkEquipmentId, getCustomButtonName, getCustomGatePassStatusName } from './utils/utils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddGatePass = (props) => {
  const {
    editId, closeModal, afterReset, addModal,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    gatePassDetails, gatePassConfig, addGatePassInfo, updateGatePassInfo, partsSelected,
  } = useSelector((state) => state.gatepass);

  const gpConfig = gatePassConfig && gatePassConfig.data && gatePassConfig.data.length ? gatePassConfig.data[0] : false;

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  function checkArrayhasDataProduct(data) {
    let result = [];
    if (data && data.length) {
      result = data.filter((item) => (item.asset_id && (typeof item.asset_id === 'number')));
    }
    return result;
  }

  useEffect(() => {
    if (addGatePassInfo && addGatePassInfo.data && addGatePassInfo.data.length) {
      const customFilters = '';
      dispatch(getGatePass(companies, appModels.GATEPASS, limit, offsetValue, customFilters, sortByValue, sortFieldValue));
      dispatch(getGatePassCount(companies, appModels.GATEPASS, customFilters));
      dispatch(getGatePassDetails(addGatePassInfo.data[0], appModels.GATEPASS));
    }
  }, [addGatePassInfo]);

  // useEffect(() => {
  //   if (updateGatePassInfo && updateGatePassInfo.data && editId) {
  //     const customFilters = '';
  //     dispatch(getGatePass(companies, appModels.GATEPASS, limit, offsetValue, customFilters, sortByValue, sortFieldValue));
  //     dispatch(getGatePassCount(companies, appModels.GATEPASS, customFilters));
  //     dispatch(getGatePassDetails(editId, appModels.GATEPASS));
  //   }
  // }, [updateGatePassInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const empId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : '';
      const empName = userInfo && userInfo.data && userInfo.data.name ? userInfo.data.name : '';
      formInitialValues.requestor_id = { id: empId, name: empName };
      dispatch(getGatePassPartsData([]));
    }
  }, [userInfo]);

  function checkExDatehasObject(data) {
    let result = false;
    console.log(data);
    if (typeof data === 'object' && data !== null) {
      console.log(data);
      result = getDateTimeUtcMuI(data);
    } else if (data) {
      result = moment(data).utc().format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  }

  function handleSubmit(values) {
    if (editId) {
      const previousValues = trimJsonObject(gatePassDetails.data[0]);
      setIsOpenSuccessAndErrorModalWindow(true);
      let orderData = [];
      let assetData = [];
      if (values.order_lines && values.order_lines.length > 0) {
        orderData = getNewRequestArray(values.order_lines);
      }
      if (values.asset_lines && values.asset_lines.length > 0) {
        assetData = getNewRequestArray(values.asset_lines);
      }
      const typeValue = values.type;
      const postData = {
        description: values.description,
        requestor_id: extractValueObjects(values.requestor_id),
        vendor_id: extractValueObjects(values.vendor_id),
        space_id: extractValueObjects(values.space_id),
        gatepass_type: extractValueObjects(values.gatepass_type),
        type: typeValue,
        requested_on: previousValues.requested_on !== values.requested_on ? checkExDatehasObject(values.requested_on) : values.requested_on,
        name: values.name,
        reference: values.reference,
        asset_lines: values.asset_lines && values.asset_lines.length > 0 ? getArrayNewFormatUpdateDeleteNewV1(checkEquipmentArrayUpdate(assetData)) : false,
        email: values.email,
        bearer_return_on: previousValues.bearer_return_on !== values.bearer_return_on ? checkExDatehasObject(values.bearer_return_on) : values.bearer_return_on ? values.bearer_return_on : false,
        to_be_returned_on: previousValues.to_be_returned_on !== values.to_be_returned_on ? checkExDatehasObject(values.to_be_returned_on) : values.to_be_returned_on ? values.to_be_returned_on : false,
        mobile: values.mobile,
        order_lines: values.order_lines && values.order_lines.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : false,
      };
      dispatch(updateGatePass(editId, appModels.GATEPASS, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      let orderData = [];
      let assetData = [];
      console.log(values.asset_lines);
     
      if (values.order_lines && values.order_lines.length > 0) {
        orderData = getNewRequestArray(values.order_lines);
      }
      if (values.asset_lines && values.asset_lines.length > 0) {
        assetData = getNewRequestArray(values.asset_lines);
      }
      console.log(assetData);
      const postData = { ...values };

      const typeValue = values.type ? values.type : false;

      if (postData.has_bearer_mobile) delete postData.has_bearer_mobile;
      if (postData.has_bearer_email) delete postData.has_bearer_email;
      if (postData.has_bearer_return) delete postData.has_bearer_return;
      if (postData.has_space) delete postData.has_space;
      if (postData.has_reference) delete postData.has_reference;
      if (postData.has_vendor) delete postData.has_vendor;
      delete postData.bearer_return_on;
      delete postData.date_valid;

      postData.type = typeValue;
      postData.requestor_id = extractValueObjects(values.requestor_id);
      postData.gatepass_type = extractValueObjects(values.gatepass_type);
      postData.vendor_id = extractValueObjects(values.vendor_id);
      postData.space_id = extractValueObjects(values.space_id);
      // postData.requested_on = values.requested_on ? moment(values.requested_on).utc().format('YYYY-MM-DD HH:mm:ss') : false;
      //  postData.bearer_return_on = checkExDatehasObject(values.bearer_return_on ? values.bearer_return_on : false);
      postData.to_be_returned_on = checkExDatehasObject(values.to_be_returned_on ? values.to_be_returned_on : false);
      postData.order_lines = values.order_lines && values.order_lines.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(orderData)) : false;
      postData.asset_lines = values.asset_lines && values.asset_lines.length > 0 ? getArrayNewFormatUpdateDeleteNewV1(checkEquipmentArray(assetData)) : false;
      const payload = { model: appModels.GATEPASS, values: postData };
      dispatch(createGatePass(appModels.GATEPASS, payload));
    }
  }

  const handleReset = (resetForm) => {
    if (document.getElementById('gatePassForm')) {
      document.getElementById('gatePassForm').reset();
    }
    if (editId) {
      dispatch(getGatePassDetails(editId, appModels.GATEPASS));
    }
    resetForm();
    closeModal();
    dispatch(resetCreateGatePass());
    dispatch(getGatePassPartsData([]));
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && gatePassDetails && gatePassDetails.data ? JSON.parse(JSON.stringify(trimJsonObject(gatePassDetails.data[0]))) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm, values,
          }) => (
            <Form id={formId}>
              <ThemeProvider theme={theme}>
                <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} addModal={addModal} />
                {((values.gatepass_type && values.gatepass_type.value === 'Item') || (values.gatepass_type && values.gatepass_type === 'Item')) && (
                <ProductForm editId={editId} setFieldValue={setFieldValue} />
                )}
                {((values.gatepass_type && values.gatepass_type.value === 'Asset') || (values.gatepass_type && values.gatepass_type === 'Asset')) && (
                <AssetsForm editId={editId} setFieldValue={setFieldValue} />
                )}
              </ThemeProvider>
              {(addGatePassInfo && addGatePassInfo.err) && (
                <SuccessAndErrorFormat response={addGatePassInfo} />
              )}
              {(updateGatePassInfo && updateGatePassInfo.err) && (
                <SuccessAndErrorFormat response={updateGatePassInfo} />
              )}
              <Divider style={{ marginBottom: '10px' }} />
              <Button
                disabled={!editId
                  ? (!(isValid && dirty) || (((values.gatepass_type && values.gatepass_type.value === 'Item') || (values.gatepass_type && values.gatepass_type === 'Item')) && ((partsSelected && !partsSelected.length > 0) || !checkAssetId(partsSelected))) || (((values.gatepass_type && values.gatepass_type.value === 'Asset') || (values.gatepass_type && values.gatepass_type === 'Asset')) && (!(values.asset_lines && values.asset_lines.length) || (values.asset_lines && values.asset_lines.length && !checkEquipmentId(values.asset_lines)))))
                  : ((((values.gatepass_type && values.gatepass_type.value === 'Item') || (values.gatepass_type && values.gatepass_type === 'Item')) && ((partsSelected && !partsSelected.length > 0) || !checkAssetId(partsSelected))) || (((values.gatepass_type && values.gatepass_type.value === 'Asset') || (values.gatepass_type && values.gatepass_type === 'Asset')) && (!(values.asset_lines && values.asset_lines.length) || (values.asset_lines && values.asset_lines.length && !checkEquipmentId(values.asset_lines)))))}
                type="submit"
                size="sm"
                variant="contained"
                className="submit-btn float-right"
              >
                {!editId ? getCustomButtonName('Create', gpConfig) : 'Update'}
              </Button>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : getCustomGatePassStatusName('Created', gpConfig)}
                successOrErrorData={editId ? updateGatePassInfo : addGatePassInfo}
                headerImage={WorkPermitBlue}
                headerText="Gate Pass"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddGatePass.propTypes = {
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddGatePass;
