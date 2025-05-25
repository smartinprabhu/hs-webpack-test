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
import mailroomBlue from '@images/icons/mailroomBlue.svg';

import BasicForm from './forms/mailRoomSettingsBasicForm';
import validationSchema from './formModel/settingsValidationSchema';
import checkoutFormModel from './formModel/settingsCheckoutFormModel';
import formInitialValues from './formModel/settingsFormInitialValues';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject,
} from '../../../util/appUtils';
import { updateProductCategory } from '../../../pantryManagement/pantryService';
import { getMailRoomSettingDetails } from '../../siteService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddMailRoomSetting = (props) => {
  const { closeModal, editId } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const {
    mailroomSettingsInfo, siteDetails,
  } = useSelector((state) => state.site);

  useEffect(() => {
    if ((updateProductCategoryInfo && updateProductCategoryInfo.data && siteDetails && siteDetails.data && siteDetails.data.length)) {
      dispatch(getMailRoomSettingDetails(siteDetails.data[0].id, appModels.MAILROOMCONFIG));
    }
  }, [updateProductCategoryInfo]);

  function handleSubmit(values) {
    if (mailroomSettingsInfo && mailroomSettingsInfo.data && mailroomSettingsInfo.data.length) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeModal();
      const postData = {
        inbound_collection_period: values.inbound_collection_period,
        outbound_collection_period: values.outbound_collection_period,
        inbound_reminders: values.inbound_reminders,
        outbound_reminders: values.outbound_reminders,
      };
      dispatch(updateProductCategory(mailroomSettingsInfo.data[0].id, appModels.MAILROOMCONFIG, postData));
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
          initialValues={editId && mailroomSettingsInfo && mailroomSettingsInfo.data && mailroomSettingsInfo.data.length ? trimJsonObject(mailroomSettingsInfo.data[0]) : formInitialValues}
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
              {((addProductCategoryInfo && addProductCategoryInfo.loading) || (mailroomSettingsInfo && mailroomSettingsInfo.loading)) && (
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
                  successMessage={addProductCategoryInfo.data ? 'MailRoom settings are updated successfully..' : 'MailRoom settings are updated successfully..'}
                />
              )}
              <hr />
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
                headerImage={mailroomBlue}
                headerText="MailRoom Settings"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddMailRoomSetting.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AddMailRoomSetting;
