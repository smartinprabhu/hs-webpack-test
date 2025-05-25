/* eslint-disable no-lone-blocks */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import PromptIfUnSaved from '@shared/unSavedPrompt';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import auditBlue from '@images/icons/auditBlue.svg';

import BasicForm from './forms/auditSettingsBasicForm';
import validationSchema from './formModel/settingsValidationSchema';
import checkoutFormModel from './formModel/settingsCheckoutFormModel';
import formInitialValues from './formModel/settingsFormInitialValues';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject,
  extractValueObjects,
} from '../../../util/appUtils';
import { updateProductCategory } from '../../../pantryManagement/pantryService';
import { getAuditSettingDetails } from '../../siteService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddAuditSettings = (props) => {
  const { closeModal, editId } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const {
    auditSettingsInfo, siteDetails,
  } = useSelector((state) => state.site);

  useEffect(() => {
    if ((updateProductCategoryInfo && updateProductCategoryInfo.data && siteDetails && siteDetails.data && siteDetails.data.length)) {
      dispatch(getAuditSettingDetails(siteDetails.data[0].id, appModels.AUDITCONFIG));
    }
  }, [updateProductCategoryInfo]);

  function handleSubmit(values) {
    if (auditSettingsInfo && auditSettingsInfo.data && auditSettingsInfo.data.length) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeModal();
      const postData = {
        auto_create_tickets_from_action: values.auto_create_tickets_from_action,
        sub_category_id: extractValueObjects(values.sub_category_id),
        category_id: extractValueObjects(values.category_id),
        space_id: extractValueObjects(values.space_id),
        company_id: extractValueObjects(values.company_id),
      };
      dispatch(updateProductCategory(auditSettingsInfo.data[0].id, appModels.AUDITCONFIG, postData));
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
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0 helpDesk-form">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && auditSettingsInfo && auditSettingsInfo.data && auditSettingsInfo.data.length ? trimJsonObject(auditSettingsInfo.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <PromptIfUnSaved />
              {(addProductCategoryInfo && !addProductCategoryInfo.data && !addProductCategoryInfo.loading) && (
                <ThemeProvider theme={theme}>
                  <div>
                    <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                  </div>
                </ThemeProvider>
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (auditSettingsInfo && auditSettingsInfo.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(addProductCategoryInfo && addProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={addProductCategoryInfo} />
              )}
              {(updateProductCategoryInfo && updateProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={updateProductCategoryInfo} />
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) && (
                <SuccessAndErrorFormat
                  response={addProductCategoryInfo.data ? addProductCategoryInfo : updateProductCategoryInfo}
                  successMessage={addProductCategoryInfo.data ? 'Audit settings are updated successfully..' : 'Audit settings are updated successfully..'}
                />
              )}
              <div className="float-right m-4">
                {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) ? (
                  <Button
                    type="button"
                    size="sm"
                   variant="contained"
                    onClick={handleReset.bind(null, resetForm)}
                  >
                    Ok
                  </Button>
                ) : (
                  <div className="bg-lightblue sticky-button-1250drawer">
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      type="submit"
                      size="sm"
                     variant="contained"
                    >
                      {!editId ? 'Add' : 'Update'}
                    </Button>
                  </div>
                )}
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateProductCategoryInfo : addProductCategoryInfo}
                headerImage={auditBlue}
                headerText="Audit Settings"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddAuditSettings.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AddAuditSettings;
