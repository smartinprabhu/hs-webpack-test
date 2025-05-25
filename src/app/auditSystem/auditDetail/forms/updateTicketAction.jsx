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

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import WorkPermitBlue from '@images/icons/workPermitBlue.svg';

import BasicForm from './ticketForm';
import validationSchema from '../ticketFormModel/validationSchema';
import checkoutFormModel from '../ticketFormModel/checkoutFormModel';
import formInitialValues from '../ticketFormModel/formInitialValues';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject, extractValueObjects,
} from '../../../util/appUtils';
import { getAuditAction } from '../../auditService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const updateTicketAction = (props) => {
  const {
    editId, closeModal, detailData, isAuditAction, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const { auditAction } = useSelector((state) => state.audit);

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      if (!isAuditAction) {
        closeModal();
      }
      const postData = [
        extractValueObjects(values.equipment_id) ? extractValueObjects(values.equipment_id) : null,
        extractValueObjects(values.space_id) ? extractValueObjects(values.space_id) : null,
        extractValueObjects(values.category_id),
        extractValueObjects(values.sub_category_id),
      ];
      dispatch(getAuditAction(editId, 'create_helpdesk', appModels.AUDITACTION, postData));
    }
  }

  const closeAddMaintenance = () => {
    if (isAuditAction) {
      atFinish();
      setIsOpenSuccessAndErrorModalWindow(false);
    } else {
      closeModal();
      setIsOpenSuccessAndErrorModalWindow(false);
    }
  };

  return (
    <Row className="m-3">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue,
          }) => (
            <Form id={formId}>
              {(auditAction && !auditAction.data && !auditAction.loading) && (
                <ThemeProvider theme={theme}>
                  <div className="comments-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
                    <BasicForm
                      formField={formField}
                      editId={editId}
                      setFieldValue={setFieldValue}
                    />
                  </div>
                </ThemeProvider>
              )}
              {(auditAction && auditAction.err) && (
              <SuccessAndErrorFormat response={auditAction} />
              )}
              {(auditAction && !auditAction.data && !auditAction.loading) && (
                <>
                  <hr />
                  <div className="float-right sticky-button-85drawer">
                    <Button
                      disabled={!(isValid && dirty)}
                      type="submit"
                      size="sm"
                      variant="contained"
                      className="submit-btn"
                    >
                      Create
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
        type="Create"
        successOrErrorData={auditAction}
        headerImage={WorkPermitBlue}
        headerText="Ticket"
        successRedirect={closeAddMaintenance}
      />
    </Row>
  );
};

updateTicketAction.defaultProps = {
  isAuditAction: false,
};

updateTicketAction.propTypes = {
  closeModal: PropTypes.func.isRequired,
  atFinish: PropTypes.func.isRequired,
  isAuditAction: PropTypes.bool,
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

export default updateTicketAction;
