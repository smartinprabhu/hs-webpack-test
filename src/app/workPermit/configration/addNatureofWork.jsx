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
import { Button } from "@mui/material";

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import workPermitBlack from '@images/icons/workPermitBlack.svg';

import BasicForm from './forms/basicForm';
import validationSchema from '../formModel/natureofWorkValidationSchema';
import checkoutFormModel from '../formModel/naturefoWorkCheckoutFormModel';
import formInitialValues from '../formModel/natureofWorkFormInitialValues';
import { createProductCategory, updateProductCategory } from '../../pantryManagement/pantryService';
import theme from '../../util/materialTheme';
import {
  getAllowedCompanies, trimJsonObject, extractValueObjects,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddNatureofWork = (props) => {
  const {
    editId, closeModal,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { addProductCategoryInfo, updateProductCategoryInfo } = useSelector((state) => state.pantry);
  const { natureofWorkDetail } = useSelector((state) => state.workpermit);

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      const postData = {
        company_id: values.company_id.id,
        name: values.name,
        preparedness_checklist_id: extractValueObjects(values.preparedness_checklist_id),
        issue_permit_checklist_id: extractValueObjects(values.issue_permit_checklist_id),
        task_id: extractValueObjects(values.task_id),
        approval_authority_id: extractValueObjects(values.approval_authority_id),
        issue_permit_approval_id: extractValueObjects(values.issue_permit_approval_id),
        ehs_authority_id: extractValueObjects(values.ehs_authority_id),
        security_office_id: extractValueObjects(values.security_office_id),
        ehs_instructions: extractValueObjects(values.ehs_instructions),
        terms_conditions: extractValueObjects(values.terms_conditions),
        is_can_be_extended: values.is_can_be_extended,
      };
      dispatch(updateProductCategory(editId, appModels.NATUREWORK, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const postData = { ...values };

      const typeValue = values.type ? values.type : false;
      postData.type = typeValue;
      postData.company_id = values.company_id.id;
      postData.is_can_be_extended = values.is_can_be_extended;
      postData.preparedness_checklist_id = extractValueObjects(values.preparedness_checklist_id);
      postData.issue_permit_checklist_id = extractValueObjects(values.issue_permit_checklist_id);
      postData.task_id = extractValueObjects(values.task_id);
      postData.approval_authority_id = extractValueObjects(values.approval_authority_id);
      postData.issue_permit_approval_id = extractValueObjects(values.issue_permit_approval_id) && extractValueObjects(values.issue_permit_approval_id) !== '' ? extractValueObjects(values.issue_permit_approval_id) : extractValueObjects(values.approval_authority_id);
      postData.ehs_authority_id = extractValueObjects(values.ehs_authority_id);
      postData.security_office_id = extractValueObjects(values.security_office_id);
      postData.ehs_instructions = extractValueObjects(values.ehs_instructions);
      postData.terms_conditions = extractValueObjects(values.terms_conditions);

      const payload = { model: appModels.NATUREWORK, values: postData };
      dispatch(createProductCategory(appModels.NATUREWORK, payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (closeModal) closeModal();
    }, 1000);
  };

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && natureofWorkDetail && natureofWorkDetail.data ? trimJsonObject(natureofWorkDetail.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <ThemeProvider theme={theme}>
                <div className="thin-scrollbar p-3">
                  <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                </div>
              </ThemeProvider>
              {(addProductCategoryInfo && addProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={addProductCategoryInfo} />
              )}
              {(updateProductCategoryInfo && updateProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={updateProductCategoryInfo} />
              )}
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
              {(addProductCategoryInfo && !addProductCategoryInfo.data && !addProductCategoryInfo.loading)
                && (updateProductCategoryInfo && !updateProductCategoryInfo.data && !updateProductCategoryInfo.loading) && (
                  <>
                    <div className="float-right sticky-button-50drawer">
                      <Button
                        disabled={!editId ? !(isValid && dirty) : !isValid}
                        type="submit"
                        size="sm"
                        variant="contained"
                      >
                        {!editId ? 'Create' : 'Update'}
                      </Button>
                    </div>
                  </>
                )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateProductCategoryInfo : addProductCategoryInfo}
                headerImage={workPermitBlack}
                headerText="Nature of Work"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddNatureofWork.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddNatureofWork;
