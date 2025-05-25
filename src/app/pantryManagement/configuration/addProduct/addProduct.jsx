/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import moment from 'moment';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import predictiveMaintenance from '@images/icons/preventiveMaintenance.svg';

import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import theme from '../../../util/materialTheme';
import { trimJsonObject, extractValueObjects, getColumnArrayById } from '../../../util/appUtils';
import BasicForm from './forms/basicForm';
import {
  updateProduct,
} from '../../../purchase/purchaseService';
import {
  createParts,
} from '../../../adminSetup/setupService';

const { formId, formField } = checkoutFormModel;

const appModels = require('../../../util/appModels').default;

const EditPart = (props) => {
  const {
    editData, afterReset, closeEditModal,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const { updateProductInfo } = useSelector((state) => state.purchase);
  const {
    createPartsInfo,
  } = useSelector((state) => state.setup);
  const { userInfo } = useSelector((state) => state.user);

  const editId = editData ? editData.id : false;

  const handleSubmit = (values) => {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeEditModal();
      const status = values.active && values.active.value ? values.active.value : values.active;
      const postData = {
        name: values.name,
        categ_id: values.categ_id && values.categ_id.id ? values.categ_id.id : values.categ_id[0],
        minimum_order_qty: values.minimum_order_qty ? parseInt(values.minimum_order_qty) : '',
        maximum_order_qty: values.maximum_order_qty ? parseInt(values.maximum_order_qty) : '',
        new_until: values.new_until ? moment(values.new_until).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        image_medium: values.image_medium ? values.image_medium : '',
        pantry_ids: values.pantry_ids && values.pantry_ids.length && values.pantry_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.pantry_ids, 'id')]] : [[6, 0, []]],
        uom_id: values.uom_id && values.uom_id.id ? values.uom_id.id : values.uom_id[0],
        uom_po_id: values.uom_po_id && values.uom_po_id.id ? values.uom_po_id.id : values.uom_po_id[0],
        active: status === 'Active' || status ? 1 : 0,
      };
      dispatch(updateProduct(appModels.PARTS, editId, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeEditModal();
      const { name } = values;
      const { minimum_order_qty } = values;
      const { maximum_order_qty } = values;
      const pantryIds = values.pantry_ids && values.pantry_ids.length && values.pantry_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.pantry_ids, 'id')]] : [[6, 0, []]];
      const status = values.active && values.active.value ? values.active.value : values.active;

      const postData = { ...values };

      postData.name = name;
      postData.categ_id = extractValueObjects(values.categ_id);
      postData.new_until = values.new_until ? moment(values.new_until).utc().format('YYYY-MM-DD HH:mm:ss') : false;
      postData.pantry_ids = pantryIds;
      postData.minimum_order_qty = minimum_order_qty;
      postData.maximum_order_qty = maximum_order_qty;
      postData.is_pantry_item = true;
      postData.image_medium = values.image_medium
        ? values.image_medium : '';
      postData.uom_id = extractValueObjects(values.uom_id);
      postData.uom_po_id = extractValueObjects(values.uom_po_id);
      postData.active = status === 'Active' ? 1 : 0;

      const payload = { model: appModels.PARTS, values: postData };
      dispatch(createParts(appModels.PARTS, payload));
    }
  };

  const handleReset = (resetForm) => {
    resetForm();
    closeEditModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editData ? trimJsonObject(editData) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              {((updateProductInfo && updateProductInfo.data)
                || (updateProductInfo && updateProductInfo.loading) || (createPartsInfo && createPartsInfo.data) || (createPartsInfo && createPartsInfo.loading)) ? ('') : (
                  <ThemeProvider theme={theme}>
                    <div className="pt-1 pr-5 pl-2 mr-2 ml-4 audits-list thin-scrollbar">
                      <BasicForm formField={formField} editId={editId} editData={editData} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                    </div>
                  </ThemeProvider>
                )}
              {(updateProductInfo && updateProductInfo.err) && (
                <SuccessAndErrorFormat response={updateProductInfo} />
              )}
              {(createPartsInfo && createPartsInfo.err) && (
                <SuccessAndErrorFormat response={createPartsInfo} />
              )}
              {((updateProductInfo && !updateProductInfo.loading && !updateProductInfo.data) || (createPartsInfo && !createPartsInfo.loading && !createPartsInfo.data)) && (
                <hr />
              )}
              <div className="bg-lightblue sticky-button-1250drawer">
                {((updateProductInfo && !updateProductInfo.loading && !updateProductInfo.data) || (createPartsInfo && !createPartsInfo.loading && !createPartsInfo.data)) && (
                  <Button
                    disabled={!(isValid)}
                    type="submit"
                    size="sm"
                     variant="contained"
                  >
                    {!editData ? 'Create' : 'Update'}
                  </Button>
                )}
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateProductInfo : createPartsInfo}
                headerImage={predictiveMaintenance}
                headerText="Product"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

EditPart.propTypes = {
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  closeEditModal: PropTypes.func.isRequired,
};
export default EditPart;
