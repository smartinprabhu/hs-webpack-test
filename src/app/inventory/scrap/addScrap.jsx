/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Box, Button, FormControl } from '@mui/material';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row,
} from 'reactstrap';

import InventoryBlue from '@images/icons/inventoryBlue.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import {
  extractValueObjects,
  getListOfModuleOperations,
  trimJsonObject,
} from '../../util/appUtils';
import actionCodes from '../data/actionCodes.json';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import validationSchema from './formModel/validationSchema';
import BasicForm from './forms/basicForm';

import {
  createScrap,
  getActionData, resetActionData,
  updateScrap,
} from '../inventoryService';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddScrap = (props) => {
  const {
    isShow, editId, afterReset, closeModal,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const {
    scrapDetail,
    addScrapInfo,
    updateScrapInfo,
  } = useSelector((state) => state.inventory);

  const { userRoles } = useSelector((state) => state.user);

  const [isToDo, setToDo] = useState(false);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isValidatable = allowedOperations.includes(actionCodes['Validate Scrap']);

  useEffect(() => {
    setToDo(false);
  }, []);

  useEffect(() => {
    if (addScrapInfo && addScrapInfo.data && addScrapInfo.data.length && !editId && isToDo) {
      dispatch(getActionData(addScrapInfo.data[0], 'action_validate', appModels.STOCKSCRAP));
      dispatch(resetActionData());
    }
  }, [addScrapInfo, isToDo]);

  useEffect(() => {
    if (updateScrapInfo && updateScrapInfo.data) {
      if (closeModal) closeModal();
    }
  }, [updateScrapInfo]);

  function handleSubmit(values) {
    setIsOpenSuccessAndErrorModalWindow(true);
    if (editId) {
      const postData = {
        name: values.name,
        scrap_qty: values.scrap_qty,
        // origin: values.origin,
        // date_expected: values.date_expected ? moment(values.date_expected).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        location_id: extractValueObjects(values.location_id),
        product_uom_id: extractValueObjects(values.product_uom_id),
        scrap_location_id: extractValueObjects(values.scrap_location_id),
        product_id: extractValueObjects(values.product_id),
      };
      dispatch(updateScrap(editId, appModels.STOCKSCRAP, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const locationId = extractValueObjects(values.location_id);
      const productUomId = extractValueObjects(values.product_uom_id);
      const scrapLocationId = extractValueObjects(values.scrap_location_id);
      const productId = extractValueObjects(values.product_id);
      // const dateExpected = values.date_expected ? moment(values.date_expected).utc().format('YYYY-MM-DD HH:mm:ss') : false;

      const postData = { ...values };

      postData.location_id = locationId;
      postData.product_uom_id = productUomId;
      postData.scrap_location_id = scrapLocationId;
      postData.product_id = productId;
      // postData.date_expected = dateExpected;
      setToDo(false);
      const payload = { model: appModels.STOCKSCRAP, values: postData };
      dispatch(createScrap(appModels.STOCKSCRAP, payload));
    }
  }

  const handleSave = (values) => {
    setIsOpenSuccessAndErrorModalWindow(true);
    const locationId = extractValueObjects(values.location_id);
    const productUomId = extractValueObjects(values.product_uom_id);
    const scrapLocationId = values.scrap_location_id;
    const productId = extractValueObjects(values.product_id);
    // const dateExpected = values.date_expected ? moment(values.date_expected).utc().format('YYYY-MM-DD HH:mm:ss') : false;

    const postData = { ...values };

    postData.location_id = locationId;
    postData.product_uom_id = productUomId;
    postData.scrap_location_id = scrapLocationId;
    postData.product_id = productId;
    // postData.date_expected = dateExpected;
    setToDo(true);
    const payload = { model: appModels.STOCKSCRAP, values: postData };
    dispatch(createScrap(appModels.STOCKSCRAP, payload));
  };

  const handleReset = (resetForm) => {
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    resetForm();
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-2">
      <Col md="12" sm="12" lg="12" xs="12" className="p-0">
        <Formik
          enableReinitialize
          initialValues={editId && scrapDetail && scrapDetail.data ? trimJsonObject(scrapDetail.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, values, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <FormControl
                  sx={{
                    width: '100%',
                    padding: '20px 30px 20px 30px',
                    borderTop: '1px solid #0000001f',
                  }}
                >
                  {isShow && (
                    <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                  )}
                </FormControl>
                {(addScrapInfo && !addScrapInfo.data && !addScrapInfo.loading) && (

                  <div className="bg-lightblue sticky-button-736drawer">
                    {!editId && !(values.scrap_location_id) && (
                    <p className="text-danger">Scrap Location is not assigned</p>
                    )}
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      type="submit"
                      variant="contained"
                    >
                      {!editId ? 'Submit' : 'Update'}
                    </Button>
                      {!editId && isValidatable && (
                        <Button
                          disabled={!(isValid && dirty)}
                          onClick={() => handleSave(values)}
                          className="ml-3"
                          variant="contained"
                        >
                          Submit & Validate
                        </Button>
                      )}
                  </div>
                )}
                <SuccessAndErrorModalWindow
                  isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                  setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                  type={editId ? 'update' : 'create'}
                  successOrErrorData={editId ? updateScrapInfo : addScrapInfo}
                  headerImage={InventoryBlue}
                  headerText="Inventory Scrap"
                  actionMsg={isToDo ? 'Created and Validated' : false}
                  successRedirect={handleReset.bind(null, resetForm)}
                />
              </Box>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddScrap.propTypes = {
  afterReset: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddScrap;
