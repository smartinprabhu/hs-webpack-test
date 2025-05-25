/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import moment from 'moment';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import mailroomBlack from '@images/icons/mailroomBlack.svg';

import BasicForm from './forms/basicForm';
import validationSchema from './formModel/validationSchemaOutbound';
import checkoutFormModel from './formModel/checkoutFormModelOutbound';
import formInitialValues from './formModel/formInitialValuesOutbound';
import {
  getOutboundFilters,
} from './mailService';

import { createOrder, updateOrder } from '../pantryManagement/pantryService';
import {
  trimJsonObject,
  extractValueObjects,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddOutbound = (props) => {
  const {
    editId, closeModal,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const {
    addOrderInfo,
    updateOrderInfo,
  } = useSelector((state) => state.pantry);
  const {
    mailOutboundDetail,
  } = useSelector((state) => state.mailroom);
  const { userInfo } = useSelector((state) => state.user);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : '';

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
     // closeModal();
      const postData = {
        recipient: extractValueObjects(values.recipient),
        employee_id: extractValueObjects(values.employee_id),
        department_id: extractValueObjects(values.recipient) === 'Department' ? extractValueObjects(values.department_id) : false,
        sent_on: values.sent_on ? moment(values.sent_on).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        sent_by: extractValueObjects(values.sent_by),
        notes: values.notes,
        tracking_no: values.tracking_no,
        sent_to: values.sent_to,
        address: values.address,
        shelf: values.shelf,
        agent_name: values.agent_name,
        signature: values.signature ? values.signature : '',
        courier_id: extractValueObjects(values.courier_id),
        parcel_dimensions: extractValueObjects(values.parcel_dimensions),
        delivered_on: values.delivered_on ? moment(values.delivered_on).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        delivered_by: extractValueObjects(values.delivered_by),
        employee_id_seq: values.employee_id_seq && values.employee_id_seq.employee_id_seq,
        employee_work_email: values.employee_work_email && values.employee_work_email.work_email,
      };
      dispatch(updateOrder(editId, appModels.MAILOUTBOUND, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
     // closeModal();
      const postData = {
        recipient: extractValueObjects(values.recipient),
        employee_id: extractValueObjects(values.employee_id),
        department_id: extractValueObjects(values.recipient) === 'Department' ? extractValueObjects(values.department_id) : false,
        sent_on: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
        sent_by: userId,
        notes: values.notes,
        tracking_no: values.tracking_no,
        sent_to: values.sent_to,
        address: values.address,
        shelf: values.shelf,
        agent_name: values.agent_name,
        signature: values.signature ? values.signature : '',
        courier_id: extractValueObjects(values.courier_id),
        parcel_dimensions: extractValueObjects(values.parcel_dimensions),
        delivered_on: values.delivered_on ? moment(values.delivered_on).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        delivered_by: extractValueObjects(values.delivered_by),
        company_id: userCompanyId,
        employee_id_seq: values.employee_id_seq && values.employee_id_seq.employee_id_seq,
        employee_work_email: values.employee_work_email && values.employee_work_email.work_email,
      };
      const payload = { model: appModels.MAILOUTBOUND, values: postData };
      dispatch(createOrder(appModels.MAILOUTBOUND, payload));
    }
  }

  const closeAddMaintenance = () => {
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  const onLoadRequest = (eid, ename) => {
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      dispatch(getOutboundFilters(customFilters));
    }
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={editId && mailOutboundDetail && mailOutboundDetail.data ? trimJsonObject(mailOutboundDetail.data[0]) : formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          isValid, values, dirty, setFieldValue, setFieldTouched,
        }) => (
          <Form id={formId}>
            <Box
              sx={{
                padding: '0px 0px 0px 20px',
                width: '100%',
                maxHeight: '100vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                marginBottom: '70px',
              }}
            >
              {(addOrderInfo && !addOrderInfo.data && !addOrderInfo.loading) && (updateOrderInfo && !updateOrderInfo.data && !updateOrderInfo.loading) && (
                <BasicForm values={values} formField={formField} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} isOutbound editId={editId} />
              )}
              {(addOrderInfo && addOrderInfo.err) && (
                <SuccessAndErrorFormat response={addOrderInfo} />
              )}
              {(updateOrderInfo && updateOrderInfo.err) && (
                <SuccessAndErrorFormat response={updateOrderInfo} />
              )}

              {(addOrderInfo && !addOrderInfo.data && !addOrderInfo.loading)
                && (updateOrderInfo && !updateOrderInfo.data && !updateOrderInfo.loading) && (
                  <div className="float-right sticky-button-85drawer">
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      type="submit"
                      className="submit-btn"
                      variant="contained"
                    >
                      {!editId ? 'Create' : 'Update'}
                    </Button>
                  </div>
              )}
            </Box>
          </Form>

        )}
      </Formik>
      <SuccessAndErrorModalWindow
        isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
        setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
        type={editId ? 'update' : 'create'}
        successOrErrorData={editId ? updateOrderInfo : addOrderInfo}
        headerImage={mailroomBlack}
        headerText="Outbound Mail"
        successRedirect={closeAddMaintenance}
        response={editId ? updateOrderInfo : addOrderInfo}
        onLoadRequest={onLoadRequest}
        newId={addOrderInfo && addOrderInfo.data && mailOutboundDetail && mailOutboundDetail.data && mailOutboundDetail.data.length > 0 ? mailOutboundDetail.data[0].id : false}
        newName={addOrderInfo && addOrderInfo.data && mailOutboundDetail && mailOutboundDetail.data && mailOutboundDetail.data.length > 0 ? mailOutboundDetail.data[0].sent_to : false}
      />
    </>
  );
};

AddOutbound.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddOutbound;
