/* eslint-disable react/jsx-no-bind */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
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
import { trimJsonObject } from '../../../util/appUtils';
import BasicForm from './forms/basicForm';
import {
  updateProduct,
} from '../../../purchase/purchaseService';

const { formId, formField } = checkoutFormModel;

const appModels = require('../../../util/appModels').default;

const EditPart = (props) => {
  const {
    editData, afterReset, closeEditModal,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const { updateProductInfo } = useSelector((state) => state.purchase);

  const handleSubmit = (values) => {
    const editId = editData ? editData.id : false;
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeEditModal(false);
      const postData = {
        name: values.name,
        type: values.type && values.type.value ? values.type.value : values.type,
        categ_id: values.categ_id && values.categ_id.id ? values.categ_id.id : values.categ_id[0],
        volume: values.volume,
        weight: values.weight,
        standard_price: values.standard_price ? parseInt(values.standard_price) : '',
        description: values.description,
        list_price: values.list_price,
        uom_id: values.uom_id && values.uom_id.id ? values.uom_id.id : values.uom_id[0],
        uom_po_id: values.uom_po_id && values.uom_po_id.id ? values.uom_po_id.id : values.uom_po_id[0],
      };
      dispatch(updateProduct(appModels.PARTS, editId, postData));
    }
  };

  const handleReset = () => {
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
          initialValues={editData ? trimJsonObject(editData) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, setFieldValue, resetForm,
          }) => (
            <Form id={formId}>
              {((updateProductInfo && updateProductInfo.data) || (updateProductInfo && updateProductInfo.loading)) ? ('') : (
                <ThemeProvider theme={theme}>
                  <div className="pt-1 pr-5 pl-2 mr-2 ml-4 audits-list thin-scrollbar">
                    <BasicForm formField={formField} setFieldValue={setFieldValue} />
                  </div>
                </ThemeProvider>
              )}
              {(updateProductInfo && updateProductInfo.err) && (
                <SuccessAndErrorFormat response={updateProductInfo} />
              )}
              {(updateProductInfo && !updateProductInfo.loading && !updateProductInfo.data) && (
                <hr />
              )}
              <div className="bg-lightblue sticky-button-1250drawer">
                {(updateProductInfo && !updateProductInfo.loading && !updateProductInfo.data) && (
                  <Button
                    disabled={!(isValid)}
                    type="submit"
                    size="sm"
                     variant="contained"
                  >
                    Update
                  </Button>
                )}
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type="update"
                successOrErrorData={updateProductInfo}
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
