/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Button,
  Divider,
  FormControl,
} from '@mui/material';
import { Box } from '@mui/system';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
  Col, Row,
} from 'reactstrap';

import AuditBlue from '@images/icons/auditBlue.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import { createProductCategory, updateProductCategory} from '../../pantryManagement/pantryService';
import {
  extractValueObjects,
  getAllowedCompanies, trimJsonObject,
} from '../../util/appUtils';
import theme from '../../util/materialTheme';
import { last } from '../../util/staticFunctions';
import {
  getAuditCount, getAuditDetails, getAuditFilters,
  getAudits,
} from '../auditService';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import validationSchema from './formModel/validationSchema';
import BasicForm from './forms/basicForm';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddWorkPermit = (props) => {
  const {
    editId, closeModal, afterReset,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [auditRequest, setAuditRequest] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { addProductCategoryInfo, updateProductCategoryInfo } = useSelector((state) => state.pantry);
  const { auditDetail, auditFilters } = useSelector((state) => state.audit);

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  useEffect(() => {
    if ((userInfo && userInfo.data) && (addProductCategoryInfo && addProductCategoryInfo.data)) {
      let customFilters = '';
      if (auditFilters && auditFilters.customFilters !== {}) {
        customFilters = auditFilters.customFilters;
      }
      dispatch(getAudits(companies, appModels.SYSTEMAUDIT, limit, offsetValue, customFilters, sortByValue, sortFieldValue));
      dispatch(getAuditCount(companies, appModels.SYSTEMAUDIT, customFilters));
    }
  }, [userInfo, addProductCategoryInfo, auditFilters]);

  useEffect(() => {
    if (addProductCategoryInfo && addProductCategoryInfo.data && addProductCategoryInfo.data.length) {
      dispatch(getAuditDetails(addProductCategoryInfo.data[0], appModels.SYSTEMAUDIT));
    }
  }, [userInfo, addProductCategoryInfo]);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      //closeModal();
      const postData = {
        name: values.name,
        date: values.date ? values.date : false,
        audit_system_id: extractValueObjects(values.audit_system_id),
        facility_manager_id: extractValueObjects(values.facility_manager_id),
        facility_manager_contact: values.facility_manager_contact,
        facility_manager_email: values.facility_manager_email,
        space_id: extractValueObjects(values.space_id),
        sys_auditor_id: extractValueObjects(values.sys_auditor_id),
        auditor_designation: values.auditor_designation,
        auditor_contact: values.auditor_contact,
        auditor_email: values.auditor_email,
      };
      dispatch(updateProductCategory(editId, appModels.SYSTEMAUDIT, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      //closeModal();
      const postData = { ...values };
      postData.date = values.date ? values.date : false;
      postData.audit_system_id = extractValueObjects(values.audit_system_id);
      postData.facility_manager_id = extractValueObjects(values.facility_manager_id);
      postData.space_id = last(values.space_id);
      postData.sys_auditor_id = extractValueObjects(values.sys_auditor_id);
      postData.company_id = userCompanyId;

      const payload = { model: appModels.SYSTEMAUDIT, values: postData };
      dispatch(createProductCategory(appModels.SYSTEMAUDIT, payload));
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
      dispatch(getAuditFilters(customFilters));
    }
    setAuditRequest(false);
    //closeModal();
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  if (auditRequest) {
    return (<Redirect to="/audit-operations" />);
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
          initialValues={editId && auditDetail && auditDetail.data ? trimJsonObject(auditDetail.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm, values,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  width: '100%',
                  maxHeight: '100vh',
                  overflow: 'auto',
                  marginBottom: '30px',
                }}
              >
                <FormControl
                  sx={{
                    width: '100%',
                    padding: '10px 0px 20px 30px',
                    // maxHeight: '600px',
                    // overflowY: 'scroll',
                    overflow: 'auto',
                    borderTop: '1px solid #0000001f',
                  }}
                >
                  <ThemeProvider theme={theme}>
                    <div>
                      <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                    </div>
                  </ThemeProvider>
                  {/* {(addProductCategoryInfo && addProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={addProductCategoryInfo} />
              )}
              {(updateProductCategoryInfo && updateProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={updateProductCategoryInfo} />
              )} */}
                </FormControl>
              </Box>
              {/*  <>
                {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) && (
                <SuccessAndErrorFormat
                  response={addProductCategoryInfo.data ? addProductCategoryInfo : updateProductCategoryInfo}
                  successMessage={addProductCategoryInfo.data ? 'Work Permit added successfully..' : 'Work Permit updated successfully..'}
                />
                )}
                <div className="float-right">
                  {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) && (
                    <Button
                       variant="contained"
                      size="sm"
                      onClick={closeModal}
                    >
                      Ok
                    </Button>
                  )}
                </div>
              </> */}
              <Divider style={{ marginBottom: '10px', marginTop: '10px' }} />
              {(addProductCategoryInfo && !addProductCategoryInfo.data && !addProductCategoryInfo.loading)
                && (updateProductCategoryInfo && !updateProductCategoryInfo.data && !updateProductCategoryInfo.loading) && (
                  <div className="float-right sticky-button-85drawer">
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                       type="button"
                      size="sm"
                      variant="contained"
                      onClick={() => handleSubmit(values)}
                    >
                      {!editId ? 'Create' : 'Update'}
                    </Button>
                  </div>
              )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                newId={auditDetail && auditDetail.data && auditDetail.data.length > 0 ? auditDetail.data[0].id : false}
                newName={auditDetail && auditDetail.data && auditDetail.data.length > 0 ? auditDetail.data[0].name : false}
                successOrErrorData={editId ? updateProductCategoryInfo : addProductCategoryInfo}
                headerImage={AuditBlue}
                headerText="Audit"
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
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddWorkPermit;
