/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';
import { Box, Button, FormControl } from "@mui/material";

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import AuditBlue from '@images/icons/auditBlue.svg';

import BasicForm from './forms/basicForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createSlaAudit, getSlaAuditFilters,
} from './auditService';
import theme from '../util/materialTheme';
import {
  trimJsonObject, extractValueObjects,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddWorkPermit = (props) => {
  const {
    editId, isShow, closeModal, afterReset,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [auditRequest, setAuditRequest] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const { addSlaAuditInfo, slaAuditDetails, auditExistsInfo } = useSelector((state) => state.slaAudit);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userEmployeeId = userInfo && userInfo.data && userInfo.data.employee ? userInfo.data.employee.id : '';
  const duplicateExists = auditExistsInfo && auditExistsInfo.data && auditExistsInfo.data.length > 0;

  const history = useHistory();

  function handleSubmit(values) {
    if (!editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeModal();
      const postData = { ...values };

      postData.audit_date = values.audit_date ? moment(values.audit_date).utc().format('YYYY-MM-DD') : false;
      postData.audit_template_id = extractValueObjects(values.audit_template_id);
      // postData.created_by_id = userEmployeeId;
      postData.created_on = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
      postData.company_id = userCompanyId;

      const payload = { model: appModels.SLAAUDIT, values: postData };
      dispatch(createSlaAudit(appModels.SLAAUDIT, payload));
    }
  }

  const onLoadRequest = (eid, ename) => {
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      dispatch(getSlaAuditFilters(customFilters));
    }
    setAuditRequest(false);
    history.push({ pathname: '/sla-audits' });
    closeModal();
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  if (auditRequest) {
    return (<Redirect to="/sla-audits" />);
  }

  const closeAddMaintenance = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && slaAuditDetails && slaAuditDetails.data ? trimJsonObject(slaAuditDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, values, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              {(addSlaAuditInfo && !addSlaAuditInfo.data
                && !addSlaAuditInfo.loading) && (
                  <ThemeProvider theme={theme}>
                    <Box
                      sx={{
                        width: "100%",
                      }}
                    >
                      <FormControl
                        sx={{
                          width: "100%",
                          padding: "10px 0px 20px 30px",
                          borderTop: '1px solid #0000001f',
                        }}
                      >
                        <BasicForm formField={formField} isShow={isShow} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                      </FormControl>
                    </Box>
                  </ThemeProvider>
                )}
              {(addSlaAuditInfo && addSlaAuditInfo.err) && (
                <SuccessAndErrorFormat response={addSlaAuditInfo} />
              )}
              {(addSlaAuditInfo && !addSlaAuditInfo.data && !addSlaAuditInfo.loading)
                && (
                  <>
                    <hr />
                    <div className={`bg-lightblue ${isShow ? 'sticky-button-50drawer' : ''}`}>
                      <Button
                        disabled={!editId ? !(isValid && dirty) || (auditExistsInfo && auditExistsInfo.loading) || (duplicateExists && values.audit_date && values.audit_template_id && values.audit_template_id.id) : !isValid}
                        type="submit"
                        variant="contained"
                      >
                        {!editId ? 'Create' : 'Update'}
                      </Button>
                      {duplicateExists && values.audit_date && values.audit_template_id && values.audit_template_id.id && (
                        <p className="m-0 text-danger">A Record for the selected Period and Template already exists.</p>
                      )}
                    </div>
                  </>
                )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                newId={slaAuditDetails && slaAuditDetails.data && slaAuditDetails.data.length > 0 ? slaAuditDetails.data[0].id : false}
                newName={slaAuditDetails && slaAuditDetails.data && slaAuditDetails.data.length > 0 ? slaAuditDetails.data[0].name : false}
                successOrErrorData={editId ? false : addSlaAuditInfo}
                headerImage={AuditBlue}
                headerText="SLA Audit"
                onLoadRequest={onLoadRequest}
                successRedirect={closeAddMaintenance.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddWorkPermit.propTypes = {
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  isShow: PropTypes.bool.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddWorkPermit;
