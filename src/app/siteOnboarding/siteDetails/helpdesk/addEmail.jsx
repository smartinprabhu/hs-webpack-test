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
  extractValueObjects, trimJsonObject, getColumnArrayById, isArrayColumnExists,
} from '../../../util/appUtils';
import checkoutFormModel from './formModel/emailCheckoutFormModel';
import formInitialValues from './formModel/emailFormInitialValues';
import validationSchema from './formModel/emailValidationSchema';
import BasicForm from './forms/emailBasicForm';

const { formId, formField } = checkoutFormModel;

const AddProblemCategory = (props) => {
  const {
    closeModal, editId, setFieldVal, editData, selectedData, editPageIndex,
  } = props;

  function handleSubmit(values) {
    closeModal();
    if (editPageIndex && !editId) {
      if (selectedData && selectedData.length > 0) {
        const postData = selectedData[editPageIndex - 1];
        postData.helpdesk_state = extractValueObjects(values.helpdesk_state);
        postData.is_requestee = values.is_requestee;
        postData.is_maintenance_team = values.is_maintenance_team;
        postData.is_send_email = values.is_send_email;
        postData.mail_template_id = values.mail_template_id.id ? values.mail_template_id : '';
        postData.mail_template_id_new = extractValueObjects(values.mail_template_id);
        postData.is_push_notify = values.is_push_notify;
        postData.is_send_sms = values.is_send_sms;
        postData.is_recipients = values.is_recipients;
        postData.sms_template_id = values.sms_template_id.id ? values.sms_template_id : '';
        postData.sms_template_id_new = extractValueObjects(values.sms_template_id);
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
        helpdesk_state: extractValueObjects(values.helpdesk_state),
        is_requestee: values.is_requestee,
        is_maintenance_team: values.is_maintenance_team,
        is_send_email: values.is_send_email,
        is_recipients: values.is_recipients,
        mail_template_id: values.mail_template_id.id ? values.mail_template_id : '',
        mail_template_id_new: extractValueObjects(values.mail_template_id),
        is_push_notify: values.is_push_notify,
        is_send_sms: values.is_send_sms,
        sms_template_id: values.sms_template_id.id ? values.sms_template_id : '',
        sms_template_id_new: extractValueObjects(values.mail_template_id),
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

      postData.helpdesk_state = extractValueObjects(values.helpdesk_state);
      postData.is_requestee = values.is_requestee;
      postData.is_maintenance_team = values.is_maintenance_team;
      postData.is_send_email = values.is_send_email;
      postData.is_recipients = values.is_recipients;
      postData.mail_template_id = values.mail_template_id.id ? values.mail_template_id : '';
      postData.mail_template_id_new = extractValueObjects(values.mail_template_id);
      postData.recipients_ids = values.recipients_ids && values.recipients_ids.length ? values.recipients_ids : '';
      // postData.recipients_ids = values.recipients_ids && values.recipients_ids.length && values.recipients_ids.length > 0
      //   ? [[6, 0, getColumnArrayById(values.recipients_ids, 'id')]] : [[6, 0, []]];
      postData.id = false;
      postData.recipients_ids_new = values.recipients_ids && values.recipients_ids.length && values.recipients_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.recipients_ids, 'id')]] : [[6, 0, []]];
      postData.id = false;
      postData.is_push_notify = values.is_push_notify;
      postData.is_send_sms = values.is_send_sms;
      postData.sms_template_id = values.sms_template_id.id ? values.sms_template_id : '';
      postData.sms_template_id_new = extractValueObjects(values.sms_template_id);

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
          initialValues={editData ? trimJsonObject(editData) : formInitialValues}
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
              <div className="float-right m-4">
                <div className="sticky-button-85drawer">
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

AddProblemCategory.defaultProps = {
  editPageIndex: false,
  editId: false,
};

AddProblemCategory.propTypes = {
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

export default AddProblemCategory;
