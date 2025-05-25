/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Button } from "@mui/material";

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import InventoryBlue from '@images/icons/inventoryBlue.svg';

// import { propTypes } from 'qrcode.react';
import BasicForm from './forms/basicForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  trimJsonObject,
  extractValueObjects,
} from '../../util/appUtils';

import { createWarehouse, updateWarehouse } from '../inventoryService';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddWarehouse = (props) => {
  const {
    editId, afterReset,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const {
    wareHouseDetails,
    addWarehouseInfo,
    updateWarehouseInfo,
  } = useSelector((state) => state.inventory);

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      const postData = {
        name: values.name,
        code: values.code,
        partner_id: extractValueObjects(values.partner_id),
        company_id: extractValueObjects(values.company_id),
      };
      dispatch(updateWarehouse(editId, appModels.WAREHOUSE, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const { name } = values;
      const { code } = values;
      const partnerId = extractValueObjects(values.partner_id);
      const companyId = extractValueObjects(values.company_id);

      const postData = { ...values };

      postData.name = name;
      postData.code = code;
      postData.partner_id = partnerId;
      postData.company_id = companyId;

      const payload = { model: appModels.WAREHOUSE, values: postData };
      dispatch(createWarehouse(appModels.WAREHOUSE, payload));
    }
  }

  const closeAddMaintenance = () => {
    setIsOpenSuccessAndErrorModalWindow(false);
    afterReset();
  };

  const handleReset = (resetForm) => {
    if (afterReset) afterReset();
    resetForm();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && wareHouseDetails && wareHouseDetails.data ? trimJsonObject(wareHouseDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
              {(addWarehouseInfo && !addWarehouseInfo.data && !addWarehouseInfo.loading) && (
                <>
                  <div className="bg-lightblue sticky-button-736drawer">
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      type="submit"
                      variant='contained'
                    >
                      {!editId ? 'Create' : 'Update'}
                    </Button>
                  </div>
                </>
              )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateWarehouseInfo : addWarehouseInfo}
                headerImage={InventoryBlue}
                headerText="WareHouse"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddWarehouse.propTypes = {
  afterReset: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddWarehouse;
