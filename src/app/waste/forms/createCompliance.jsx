/* eslint-disable radix */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { Button, Divider } from '@mui/material';

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import complianceBlackIcon from '@images/icons/complianceBlack.svg';
import CreateBasicForm from './createBasicForm';
import validationSchema from '../formModel/validationSchema';
import checkoutFormModel from '../formModel/checkoutFormModel';
import formInitialValues from '../formModel/formInitialValues';
import {
  createCompliance, getComplianceList, getComplianceCount, getComplianceDetail, resetAddComplianceInfo, resetComplianceTemplate, getComplianceFilters,
} from '../complianceService';
import {
  updateTenant, resetUpdateTenant,
} from '../../adminSetup/setupService';
import {
  trimJsonObject, 
  getAllowedCompanies, getDateTimeUtc,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const CreateCompliance = (props) => {
  const {
    editId, closeModal, afterReset,
  } = props;
  const dispatch = useDispatch();
  const [reload] = useState('1');
  const [dateError, setDateError] = useState(false);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { addComplianceInfo, complianceDetails } = useSelector((state) => state.compliance);

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  // useEffect(() => {
  //   if ((userInfo && userInfo.data) && (addComplianceInfo && addComplianceInfo.data)) {
  //     const statusValues = [];
  //     const categoryValues = [];
  //     const appValues = [];
  //     const customFilters = '';
  //     dispatch(getComplianceList(companies, appModels.WASTETRACKER, limit, offsetValue, statusValues, categoryValues, appValues, customFilters, sortByValue, sortFieldValue));
  //     dispatch(getComplianceCount(companies, appModels.WASTETRACKER, statusValues, categoryValues, appValues, customFilters));
  //   }
  // }, [userInfo, addComplianceInfo]);

  useEffect(() => {
    if (addComplianceInfo && addComplianceInfo.data && addComplianceInfo.data.length) {
      dispatch(getComplianceDetail(addComplianceInfo.data[0], appModels.WASTETRACKER));
    }
  }, [userInfo, addComplianceInfo]);

  useEffect(() => {
    dispatch(resetAddComplianceInfo());
    dispatch(resetComplianceTemplate());
  }, []);

  function checkDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtc(data);
    }
    return result;
  }

  async function submitForm(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const operValue = values.operation && values.operation.id ? values.operation.id : values.operation;
      const typeValue = values.type && values.type.id ? values.type.id : false;
      let loggedOn = values.logged_on ? values.logged_on : new Date();
      const weightKg = values.weight ? parseFloat(values.weight) : 0;
      if (checkDatehasObject(loggedOn)) {
        loggedOn = getDateTimeUtc(loggedOn);
      }

      const postDataValues = {
        operation: operValue,
        type: typeValue,
        logged_on: loggedOn,
        weight: weightKg,
        vendor: values.vendor,
        tenant: values.tenant,
        carried_by: values.carried_by,
        accompanied_by: values.accompanied_by,
        security_by: values.security_by,
      };
      dispatch(updateTenant(editId, postDataValues, appModels.WASTETRACKER));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();

      const operValue = values.operation && values.operation.id ? values.operation.id : values.operation;
      const typeValue = values.type && values.type.id ? values.type.id : false;
      let loggedOn = values.logged_on ? values.logged_on : new Date();
      const weightKg = values.weight ? parseFloat(values.weight) : 0;
      if (checkDatehasObject(loggedOn)) {
        loggedOn = getDateTimeUtc(loggedOn);
      }

      const postData = { ...values };

      postData.operation = operValue;
      postData.type = typeValue;
      postData.logged_on = loggedOn;
      postData.weight = weightKg;

      const payload = { model: appModels.WASTETRACKER, values: postData };
      dispatch(createCompliance(appModels.WASTETRACKER, payload));
    }
  }

  /* const closeAddMaintenance = () => {
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
  }; */

   const onLoadRequest = (eid, ename) => {
      if (eid) {
        const customFilters = [{
          key: 'id',
          value: eid,
          label: 'ID',
          type: 'id',
          title: 'Name',
          name: ename,
        }];
        dispatch(getComplianceFilters(customFilters));
      }
      // setComplianceRequest(false);
      if (afterReset) afterReset();
      setIsOpenSuccessAndErrorModalWindow(false);
    };

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    dispatch(resetAddComplianceInfo());
    dispatch(resetUpdateTenant());
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  function handleSubmit(values, actions) {
    submitForm(values, actions);
  }

  return (
    <Formik
      enableReinitialize
      initialValues={editId && complianceDetails && complianceDetails.data ? trimJsonObject(complianceDetails.data[0]) : formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isValid, dirty, setFieldValue, setFieldTouched, resetForm, values,
      }) => (
        <Form id={formId}>
          <Box
            sx={{
              padding: '20px',
              width: '100%',
            }}
          >
            <CreateBasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} reload={reload} setFieldTouched={setFieldTouched} />
            <Divider style={{ marginBottom: '10px' }} />
            <div className="bg-lightblue sticky-button-50drawer">
              <Button
                type="button"
                variant="contained"
                onClick={() => handleSubmit(values)}
                className="submit-btn"
                disabled={!editId ? !(isValid && dirty) : !isValid}
              >
                {!editId ? 'Create' : 'Update'}
              </Button>
            </div>
          </Box>
          <SuccessAndErrorModalWindow
            isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
            setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
            type={editId ? 'update' : 'create'}
            newId={complianceDetails && complianceDetails.data && complianceDetails.data.length > 0 ? complianceDetails.data[0].id : false}
            newName={complianceDetails && complianceDetails.data && complianceDetails.data.length > 0 ? complianceDetails.data[0].name : false}
            successOrErrorData={editId ? tenantUpdateInfo : addComplianceInfo}
            headerImage={complianceBlackIcon}
            headerText="Waste tracker"
           onLoadRequest={onLoadRequest}
            successRedirect={handleReset.bind(null, resetForm)}
          />
        </Form>
      )}
    </Formik>
  );
};

CreateCompliance.propTypes = {
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default CreateCompliance;
