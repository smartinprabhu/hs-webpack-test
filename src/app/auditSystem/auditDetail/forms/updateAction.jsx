/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import {
  Button,
} from '@mui/material';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import WorkPermitBlue from '@images/icons/workPermitBlue.svg';

import BasicForm from './basicForm';
import validationSchema from '../formModel/validationSchema';
import checkoutFormModel from '../formModel/checkoutFormModel';
import formInitialValues from '../formModel/formInitialValues';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject, extractValueObjects,
} from '../../../util/appUtils';
import { updateAuditActionData } from '../../auditService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const UpdateAction = (props) => {
  const {
    editId, closeModal, detailData,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const { updateAuditAction } = useSelector((state) => state.audit);

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeModal();
      const postData = {
        name: values.name,
        date_deadline: values.date_deadline ? moment(values.date_deadline).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        user_id: extractValueObjects(values.user_id),
      };
      dispatch(updateAuditActionData(editId, appModels.AUDITACTION, postData));
    }
  }

  const closeAddMaintenance = () => {
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  return (
    <Row className="m-3">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && detailData.id ? trimJsonObject(detailData) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, values,
          }) => (
            <Form id={formId}>
              {(updateAuditAction && !updateAuditAction.data && !updateAuditAction.loading) && (
              <ThemeProvider theme={theme}>
                <div className="comments-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
                  <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                </div>
              </ThemeProvider>
              )}
              {(updateAuditAction && updateAuditAction.err) && (
                <SuccessAndErrorFormat response={updateAuditAction} />
              )}
              {(updateAuditAction && !updateAuditAction.data && !updateAuditAction.loading) && (
              <>
                <hr />
                <div className="float-right sticky-button-85drawer">
                  <Button
                    disabled={!editId ? !(isValid && dirty) : !isValid}
                    type="submit"
                    size="sm"
                    variant="contained"
                    className="submit-btn"
                  >
                    {!editId ? 'Create' : 'Update'}
                  </Button>
                </div>
              </>
              )}
            </Form>
          )}
        </Formik>
      </Col>
      <SuccessAndErrorModalWindow
        isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
        setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
        type="update"
        successOrErrorData={updateAuditAction}
        headerImage={WorkPermitBlue}
        headerText="Audit Action"
        successRedirect={closeAddMaintenance}
      />
    </Row>
  );
};

UpdateAction.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default UpdateAction;
