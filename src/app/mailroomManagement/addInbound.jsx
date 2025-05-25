/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { Button } from '@mui/material';
import { Box } from '@mui/system';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import mailroomBlack from '@images/icons/mailroomBlack.svg';

import BasicForm from './forms/basicForm';
import validationSchema from './formModel/validationSchemaInbound';
import checkoutFormModel from './formModel/checkoutFormModelInbound';
import formInitialValues from './formModel/formInitialValuesInbound';

import { createOrder, updateOrder } from '../pantryManagement/pantryService';
import {
  getInBoundFilters
} from './mailService';
import {
  trimJsonObject,
  extractValueObjects,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddInbound = (props) => {
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const {
    editId, closeModal,
  } = props;
  const dispatch = useDispatch();
  const {
    addOrderInfo,
    updateOrderInfo,
  } = useSelector((state) => state.pantry);
  const {
    mailInboundDetail,
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
        collected_on: values.collected_on ? moment(values.collected_on).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        collected_by: extractValueObjects(values.collected_by),
        notes: values.notes,
        tracking_no: values.tracking_no,
        sender: values.sender,
        shelf: values.shelf,
        courier_id: extractValueObjects(values.courier_id),
        parcel_dimensions: extractValueObjects(values.parcel_dimensions),
        received_on: values.received_on ? moment(values.received_on).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        received_by: extractValueObjects(values.received_by),
        employee_id_seq: values.employee_id_seq && values.employee_id_seq.employee_id_seq,
        employee_work_email: values.employee_work_email && values.employee_work_email.work_email,
      };
      dispatch(updateOrder(editId, appModels.MAILINBOUND, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
     // closeModal();
      const postData = {
        recipient: extractValueObjects(values.recipient),
        employee_id: extractValueObjects(values.employee_id),
        department_id: extractValueObjects(values.recipient) === 'Department' ? extractValueObjects(values.department_id) : false,
        collected_on: values.collected_on ? moment(values.collected_on).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        collected_by: extractValueObjects(values.collected_by),
        notes: values.notes,
        tracking_no: values.tracking_no,
        sender: values.sender,
        shelf: values.shelf,
        courier_id: extractValueObjects(values.courier_id),
        parcel_dimensions: extractValueObjects(values.parcel_dimensions),
        received_on: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
        received_by: userId,
        company_id: userCompanyId,
        employee_id_seq: values.employee_id_seq && values.employee_id_seq.employee_id_seq,
        employee_work_email: values.employee_work_email && values.employee_work_email.work_email,
      };
      const payload = { model: appModels.MAILINBOUND, values: postData };
      dispatch(createOrder(appModels.MAILINBOUND, payload));
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
      dispatch(getInBoundFilters(customFilters));
    }
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={editId && mailInboundDetail && mailInboundDetail.data ? trimJsonObject(mailInboundDetail.data[0]) : formInitialValues}
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
              <BasicForm values={values} formField={formField} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} isOutbound={false} editId={editId} />
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
                      variant="contained"
                      className="submit-btn"
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
        newId={addOrderInfo && addOrderInfo.data && mailInboundDetail && mailInboundDetail.data && mailInboundDetail.data.length > 0 ? mailInboundDetail.data[0].id : false}
        newName={addOrderInfo && addOrderInfo.data && mailInboundDetail && mailInboundDetail.data && mailInboundDetail.data.length > 0 ? mailInboundDetail.data[0].sender : false}
        type={editId ? 'update' : 'create'}
        successOrErrorData={editId ? updateOrderInfo : addOrderInfo}
        headerImage={mailroomBlack}
        headerText="Inbound Mail"
        successRedirect={closeAddMaintenance}
        response={editId ? updateOrderInfo : addOrderInfo}
        onLoadRequest={onLoadRequest}
      />
    </>
  );
};

AddInbound.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddInbound;
