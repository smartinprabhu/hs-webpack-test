/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import { FormControl, Button, Box } from "@mui/material";

import PromptIfUnSaved from '@shared/unSavedPrompt';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import InventoryBlue from '@images/icons/inventoryBlue.svg';

import BasicForm from './forms/basicOPTForm';
import validationSchema from './formModel/optValidationSchema';
import locationFormModel from './formModel/optFormModel';
import formInitialValues from './formModel/optFormInitialValues';
import theme from '../../util/materialTheme';
import {
  trimJsonObject, extractValueObjects, getColumnArrayById,
} from '../../util/appUtils';

import { createOperationType, updateOperationType } from '../inventoryService';

const appModels = require('../../util/appModels').default;

const { formId, formField } = locationFormModel;

const AddOperationType = (props) => {
  const {
    editId, afterReset,
    isTheme,
  } = props;
  const dispatch = useDispatch();
  const [currentTab, setActive] = useState('Basic');
  const [reload, setReload] = useState('1');
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const {
    operationTypeDetails,
    addOpTypeInfo,
    updateOpTypeInfo,
  } = useSelector((state) => state.inventory);

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      const postData = {
        name: values.name,
        show_operations: values.show_operations,
        show_reserved: values.show_reserved,
        code: extractValueObjects(values.code),
        sequence_id: extractValueObjects(values.sequence_id),
        warehouse_id: extractValueObjects(values.warehouse_id),
        default_location_src_id: extractValueObjects(values.default_location_src_id),
        default_location_dest_id: extractValueObjects(values.default_location_dest_id),
        return_picking_type_id: extractValueObjects(values.posreturn_picking_type_id),
        barcode: values.barcode,
        is_confirmed: values.is_confirmed,
        approval_user_role_ids: values.approval_user_role_ids && values.approval_user_role_ids.length && values.approval_user_role_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.approval_user_role_ids, 'id')]] : [[6, 0, []]],
        is_request_expiry: values.is_request_expiry,
        expiry_duration: values.expiry_duration,
        is_expiry_email: values.is_expiry_email,
        is_reminder_email: values.is_reminder_email,
        reminder_duration: values.reminder_duration,
        requested: values.requested,
        approved: values.approved,
        rejected: values.rejected,
        delivered: values.delivered,
        bn_requested: values.bn_requested,
        bn_approved: values.bn_approved,
        bn_rejected: values.bn_rejected,
        bn_delivered: values.bn_delivered,
      };
      dispatch(updateOperationType(editId, appModels.STOCKPICKINGTYPES, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const { name } = values;
      const code = extractValueObjects(values.code);
      const { barcode } = values;
      const roleId = values.approval_user_role_ids && values.approval_user_role_ids.length && values.approval_user_role_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.approval_user_role_ids, 'id')]] : [[6, 0, []]];
      const showOperations = values.show_operations;
      const showReserved = values.show_reserved;
      const isConfirmed = values.is_confirmed;
      const isRequestExpiry = values.is_request_expiry;
      const expiryDuration = values.expiry_duration;
      const isExpiryEmail = values.is_expiry_email;
      const reminderDuration = values.reminder_duration;
      const Requested = values.requested;
      const Approved = values.approved;
      const Rejected = values.rejected;
      const Delivered = values.delivered;
      const bnRequested = values.bn_requested;
      const bnApproved = values.bn_approved;
      const bnRejected = values.bn_rejected;
      const bnDelivered = values.bn_delivered;
      const sequenceId = extractValueObjects(values.sequence_id);
      const warehouseId = extractValueObjects(values.warehouse_id);
      const srcId = extractValueObjects(values.default_location_src_id);
      const destId = extractValueObjects(values.default_location_dest_id);
      const typeId = extractValueObjects(values.return_picking_type_id);

      const postData = { ...values };

      postData.name = name;
      postData.code = code;
      postData.barcode = barcode;
      postData.sequence_id = sequenceId;
      postData.warehouse_id = warehouseId;
      postData.default_location_src_id = srcId;
      postData.default_location_dest_id = destId;
      postData.return_picking_type_id = typeId;
      postData.approval_user_role_ids = roleId;
      postData.show_operations = showOperations;
      postData.show_reserved = showReserved;
      postData.is_confirmed = isConfirmed;
      postData.is_request_expiry = isRequestExpiry;
      postData.expiry_duration = expiryDuration;
      postData.is_expiry_email = isExpiryEmail;
      postData.reminder_duration = reminderDuration;
      postData.requested = Requested;
      postData.approved = Approved;
      postData.rejected = Rejected;
      postData.delivered = Delivered;
      postData.bn_requested = bnRequested;
      postData.bn_approved = bnApproved;
      postData.bn_rejected = bnRejected;
      postData.bn_delivered = bnDelivered;
      const payload = { model: appModels.STOCKPICKINGTYPES, values: postData };
      dispatch(createOperationType(appModels.STOCKPICKINGTYPES, payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
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
          initialValues={editId && operationTypeDetails && operationTypeDetails.data ? trimJsonObject(operationTypeDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  width: "100%",
                  maxHeight: "100vh",
                  overflow: 'auto',
                  marginBottom: '30px',
                }}
              >
                <FormControl
                  sx={{
                    width: "100%",
                    padding: "10px 0px 20px 30px",
                    // maxHeight: '600px',
                    //overflowY: 'scroll',
                    overflowX: 'hidden',
                    borderTop: '1px solid #0000001f',
                  }}
                >
                  <PromptIfUnSaved />
                  {!isTheme && (
                    <ThemeProvider theme={theme}>
                      <br />
                      <BasicForm formField={formField} setFieldValue={setFieldValue} reload={reload} setFieldTouched={setFieldTouched} />
                    </ThemeProvider>
                  )}
                  {isTheme && (
                    <>
                      <br />
                      <BasicForm formField={formField} setFieldValue={setFieldValue} reload={reload} setFieldTouched={setFieldTouched} />
                    </>
                  )}
                  {(addOpTypeInfo && !addOpTypeInfo.data && !addOpTypeInfo.loading) && (
                    <div className="bg-lightblue sticky-button-50drawer">
                      <Button
                        disabled={!editId ? !(isValid && dirty) : !isValid}
                        type="submit"
                        variant="contained"
                      >
                        {!editId ? 'Create' : 'Update'}
                      </Button>
                    </div>
                  )}
                </FormControl>
              </Box>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateOpTypeInfo : addOpTypeInfo}
                headerImage={InventoryBlue}
                headerText="Operation Type"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddOperationType.propTypes = {
  afterReset: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  isTheme: PropTypes.bool,
};

AddOperationType.defaultProps = {
  isTheme: false,
};

export default AddOperationType;
