/* eslint-disable no-unneeded-ternary */
/* eslint-disable radix */
/* eslint-disable no-lone-blocks */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';
import {
  Button,
} from '@mui/material';
import {
  extractValueObjects, isArrayColumnExists, getColumnArrayById,
} from '../../../util/appUtils';
import checkoutFormModel from './formModel/emailCheckoutFormModel';
import formInitialValues from './formModel/emailFormInitialValues';
import validationSchema from './formModel/emailValidationSchema';
import BasicForm from './forms/emailBasicForm';

const { formId, formField } = checkoutFormModel;

const AddEmail = (props) => {
  const {
    closeModal, editId, setFieldVal, editData, selectedData, editPageIndex,
  } = props;

  { /* function handleSubmit(values) {
    closeModal();
    if (editId) {
      const postData = {
        request_state: extractValueObjects(values.request_state),
        code: values.code,
        is_requestee: values.is_requestee,
        is_recipients: values.is_recipients,
        recipients_ids: extractValueObjects(values.recipients_ids),
        is_send_email: values.is_send_email,
        id: values.id,
      };

      const newData = [postData];
      const arr = [...partsSelected, ...newData];
      const newArrData = [...new Map(arr.map((item) => [item.id, item])).values()];
      setFieldVal(newArrData);
    } else {
      const postData = { ...values };

      postData.request_state = extractValueObjects(values.request_state);
      postData.code = extractValueObjects(values.code);
      postData.is_requestee = values.is_requestee;
      postData.is_recipients = values.is_recipients;
      postData.recipients_ids = extractValueObjects(values.recipients_ids);
      postData.is_send_email = values.is_send_email;
      postData.id = false;
      const newData = [postData];
      const newArrData = [...partsSelected, ...newData];
      setFieldVal(newArrData);
      dispatch(getGatePassPartsData(newArrData));
    }
  } */ }

  function handleSubmit(values) {
    closeModal();
    if (editPageIndex && !editId) {
      if (selectedData && selectedData.length > 0) {
        const postData = selectedData[editPageIndex - 1];
        postData.state = extractValueObjects(values.state);
        postData.message_type = extractValueObjects(values.message_type);
        postData.is_authorizer = values.is_authorizer;
        postData.is_ehs = values.is_ehs;
        postData.is_vendor = values.is_vendor;
        postData.is_requestor = values.is_requestor;
        postData.is_security = values.is_security;
        postData.recipients_ids = values.recipients_ids && values.recipients_ids.length ? values.recipients_ids : '';
        postData.id = false;
        if (isArrayColumnExists(values.recipients_ids ? values.recipients_ids : [], 'id')) {
          let selectedIds = getColumnArrayById(values.recipients_ids, 'id');
          const appendRecipients = extractValueObjects(values.recipients_ids);
          const isRecipientsExists = selectedIds.filter((item) => item === appendRecipients);
          if (isRecipientsExists && !isRecipientsExists.length) {
            selectedIds = [...selectedIds];
          }
          postData.recipients_ids_new = [[6, false, selectedIds]];
        }
        const newData = [postData];
        const arr = [...selectedData];
        // const newArrData = [...new Map(arr.map((item) => [item.helpdesk_state, item])).values()];
        setFieldVal(arr);
      }
    } else if (editId) {
      const postData = {
        state: extractValueObjects(values.state),
        message_type: extractValueObjects(values.message_type),
        is_authorizer: values.is_authorizer,
        is_ehs: values.is_ehs,
        is_vendor: values.is_vendor,
        is_requestor: values.is_requestor,
        is_security: values.is_security,
        recipients_ids: values.recipients_ids && values.recipients_ids.length ? values.recipients_ids : '',
        id: values.id,
      };
      if (isArrayColumnExists(values.recipients_ids ? values.recipients_ids : [], 'id')) {
        let selectedIds = getColumnArrayById(values.recipients_ids, 'id');
        const appendRecipients = extractValueObjects(values.recipients_ids);
        const isRecipientsExists = selectedIds.filter((item) => item === appendRecipients);
        if (isRecipientsExists && !isRecipientsExists.length) {
          selectedIds = [...selectedIds];
        }
        postData.recipients_ids_new = [[6, false, selectedIds]];
      }
      const newData = [postData];
      const arr = [...selectedData, ...newData];
      const newArrData = [...new Map(arr.map((item) => [item.id, item])).values()];
      setFieldVal(newArrData);
    } else {
      const postData = { ...values };

      postData.state = extractValueObjects(values.state);
      postData.message_type = extractValueObjects(values.message_type);
      postData.is_authorizer = values.is_authorizer;
      postData.is_ehs = values.is_ehs;
      postData.is_vendor = values.is_vendor;
      postData.is_requestor = values.is_requestor;
      postData.is_security = values.is_security;
      postData.recipients_ids = values.recipients_ids && values.recipients_ids.length ? values.recipients_ids : '';
      // postData.recipients_ids = values.recipients_ids && values.recipients_ids.length && values.recipients_ids.length > 0
      //   ? [[6, 0, getColumnArrayById(values.recipients_ids, 'id')]] : [[6, 0, []]];
      postData.id = false;
      postData.recipients_ids_new = values.recipients_ids && values.recipients_ids.length && values.recipients_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.recipients_ids, 'id')]] : [[6, 0, []]];
      postData.id = false;
      const newData = [postData];
      const newArrData = [...selectedData, ...newData];
      setFieldVal(newArrData);
    }
  }

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={(editData ? editData : formInitialValues)}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched,
          }) => (
            <Form id={formId}>
              <div>
                <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} editPageIndex={editPageIndex} selectedData={selectedData} />
              </div>
              <hr />
              <div className="float-right m-4">
                <div className="bg-lightblue sticky-button-1250drawer">
                  <Button
                    disabled={!editId && !editPageIndex ? !(isValid && dirty) : !isValid}
                    type="submit"
                    size="sm"
                    variant="contained"
                  >
                    {!editId && !editPageIndex ? 'Add' : 'Update'}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Col>

    </Row>
  );
};

AddEmail.defaultProps = {
  editPageIndex: false,
  editId: false,
};

AddEmail.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editPageIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]),
  setFieldVal: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]),
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  selectedData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default AddEmail;
