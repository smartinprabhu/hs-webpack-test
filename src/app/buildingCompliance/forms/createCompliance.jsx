/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import moment from 'moment';

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import complianceBlackIcon from '@images/icons/complianceBlack.svg';

import CreateBasicForm from './createBasicForm';
import validationSchema from '../formModel/validationSchema';
import checkoutFormModel from '../formModel/checkoutFormModel';
import formInitialValues from '../formModel/formInitialValues';
import {
  createCompliance, getComplianceList, getComplianceFilters, getComplianceCount, getComplianceDetail, resetAddComplianceInfo, resetComplianceTemplate,
} from '../complianceService';
import {
  updateTenant, resetUpdateTenant,
} from '../../adminSetup/setupService';
import {
  trimJsonObject, getColumnArrayById,
  getAllCompanies, getDateTimeUtc, isAllCompany, extractValueObjects,
} from '../../util/appUtils';
import {
  getRequiredMessage,
} from '../utils/utils';

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
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { addComplianceInfo, complianceDetails, complianceFilters } = useSelector((state) => state.compliance);
  const [repeatUntildata, setRepeatUntildata] = useState(false);
  const [endsOnData, setEendsOnData] = useState('');
  const [nextExpiryDateData, setNextExpiryDateData] = useState('');

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  const isAllCompanies = isAllCompany(userInfo, userRoles);
  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  useEffect(() => {
    if ((userInfo && userInfo.data) && (addComplianceInfo && addComplianceInfo.data)) {
      const statusValues = [];
      const categoryValues = [];
      const appValues = [];
      const customFilters = '';
      dispatch(getComplianceList(companies, appModels.BULIDINGCOMPLIANCE, limit, offsetValue, statusValues, categoryValues, appValues, customFilters, sortByValue, sortFieldValue));
      dispatch(getComplianceCount(companies, appModels.BULIDINGCOMPLIANCE, statusValues, categoryValues, appValues, customFilters));
    }
  }, [userInfo, addComplianceInfo]);

  useEffect(() => {
    if (addComplianceInfo && addComplianceInfo.data && addComplianceInfo.data.length) {
      dispatch(getComplianceDetail(addComplianceInfo.data[0], appModels.BULIDINGCOMPLIANCE));
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

  function handleValidation(isValid, dirty, repeatData, nextExpiry, endDate1) {
    let validation;
    if (isValid && dirty && repeatData && repeatData.value === 'Ends On' && endsOnData === '') {
      validation = false;
    } /* else if (isValid && dirty && repeatData && repeatData.value && endsOnData !== '' && (nextExpiry < endDate1)) {
      validation = false;
    } else if (isValid && dirty && repeatData && repeatData.value && endsOnData !== '' && (nextExpiry > endDate1)) {
      validation = true;
    } */ else if (isValid && dirty && repeatData && repeatData.value && endsOnData !== '') {
      validation = true;
    } else if (isValid && dirty) {
      validation = true;
    } else if ((!isValid && dirty) || (isValid && !dirty)) {
      validation = false;
    }
    return validation;
  }

  async function submitForm(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const nextExpiryDate = values.next_expiry_date ? moment(values.next_expiry_date.$d).utc().format('YYYY-MM-DD HH:mm:ss') : false;
      const endDate = values.end_date ? moment(values.end_date.$d).utc().format('YYYY-MM-DD HH:mm:ss') : false;
      let locationIds = false;
      let companyIds = false;
      let assetId = false;
      const appliesTo = values.applies_to && values.applies_to.value ? values.applies_to.value : values.applies_to;
      const typeValue = values.type && values.type.value ? values.type.value : values.type;
      if (appliesTo === 'Location') {
        locationIds = values.location_ids && values.location_ids.length && values.location_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : false;
      }
      if (appliesTo === 'Site') {
        companyIds = values.company_ids && values.company_ids.length && values.company_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.company_ids, 'id')]] : false;
      }
      if (appliesTo === 'Asset') {
        assetId = values.asset_ids && values.asset_ids.length && values.asset_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.asset_ids, 'id')]] : false;
      }
      const postData = {
        compliance_id: values.compliance_id ? values.compliance_id.id : '',
        compliance_category_id: values.compliance_category_id ? values.compliance_category_id.id : '',
        compliance_act: values.compliance_act ? values.compliance_act.id : '',
        submitted_to: values.submitted_to ? values.submitted_to.id : '',
        responsible_id: values.responsible_id ? values.responsible_id.id : '',
        applies_to: appliesTo,
        expiry_schedule_type: values.expiry_schedule_type ? values.expiry_schedule_type.value : '',
        repeat_until: values.repeat_until ? values.repeat_until.value : '',
        is_has_expiry: values.is_has_expiry ? values.is_has_expiry : false,
        renewal_lead_time: values.renewal_lead_time ? parseInt(values.renewal_lead_time) : 0,
        expiry_schedule: values.expiry_schedule ? parseInt(values.expiry_schedule) : 0,
        next_expiry_date: nextExpiryDate,
        end_date: endDate,
        location_ids: locationIds,
        company_ids: companyIds,
        asset_ids: assetId,
        license_number: values.license_number,
        description: values.description,
        url_link: values.url_link,
        type: typeValue,
      };
      if (!getRequiredMessage(postData)) {
        setDateError(false);
        dispatch(updateTenant(editId, postData, appModels.BULIDINGCOMPLIANCE));
      } else {
        setDateError(getRequiredMessage(postData));
      }
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const complianceId = values.compliance_id.id;
      const complianceCategory = values.compliance_category_id.id;
      const complianceAct = values.compliance_act.id;
      const submittedTo = values.submitted_to.id;
      const appliesTo = values.applies_to && values.applies_to.value ? values.applies_to.value : false;
      const responsibleId = values.responsible_id.id;
      const expiryScheduleType = values.expiry_schedule_type && values.expiry_schedule_type.value ? values.expiry_schedule_type.value : false;
      const expirySchedule = values.expiry_schedule ? parseInt(values.expiry_schedule) : 0;
      const repeatUntil = values.repeat_until && values.repeat_until.value ? values.repeat_until.value : false;
      const hasExpiry = values.is_has_expiry ? values.is_has_expiry : false;
      const renewalLeadTime = values.renewal_lead_time ? parseInt(values.renewal_lead_time) : 0;
      const typeValue = values.type && values.type.value ? values.type.value : values.type;
      const nextExpiryDate = values.next_expiry_date ? moment(values.next_expiry_date.$d).utc().format('YYYY-MM-DD HH:mm:ss') : false;
      const endDate = values.end_date ? moment(values.end_date.$d).utc().format('YYYY-MM-DD HH:mm:ss') : false;

      const locationIds = values.location_ids && values.location_ids.length && values.location_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : false;
      const companyIds = values.company_ids && values.company_ids.length && values.company_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.company_ids, 'id')]] : false;
      const assetId = values.asset_ids && values.asset_ids.length && values.asset_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.asset_ids, 'id')]] : false;

      const companyId = extractValueObjects(values.company_id);

      const postData = { ...values };

      postData.compliance_id = complianceId;
      postData.compliance_category_id = complianceCategory;
      postData.compliance_act = complianceAct;
      postData.submitted_to = submittedTo;
      postData.applies_to = appliesTo;
      postData.responsible_id = responsibleId;
      postData.expiry_schedule_type = expiryScheduleType;
      postData.expiry_schedule = expirySchedule;
      postData.repeat_until = repeatUntil;
      postData.next_expiry_date = nextExpiryDate;
      postData.end_date = endDate;
      postData.location_ids = locationIds;
      postData.company_ids = companyIds;
      postData.asset_ids = assetId;
      postData.is_has_expiry = hasExpiry;
      postData.renewal_lead_time = renewalLeadTime;
      postData.type = typeValue;
      postData.company_id = isAllCompanies ? companyId : userCompanyId;

      const payload = { model: appModels.BULIDINGCOMPLIANCE, values: postData };
      dispatch(createCompliance(appModels.BULIDINGCOMPLIANCE, payload));
      /* if (!getRequiredMessage(postData)) {
        setDateError(false);
        dispatch(createCompliance(appModels.BULIDINGCOMPLIANCE, payload));
      } else {
        setDateError(getRequiredMessage(postData));
      } */
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
    dispatch(getComplianceFilters(complianceFilters.customFilters ? complianceFilters.customFilters.filter((item) => item.type !== 'id') : []));
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
              marginBottom: '50px',
            }}
          >
            <div className="createFormScrollbar">
              <CreateBasicForm
                formField={formField}
                editId={editId}
                setFieldValue={setFieldValue}
                reload={reload}
                setFieldTouched={setFieldTouched}
                setEendsOnData={setEendsOnData}
                setNextExpiryDateData={setNextExpiryDateData}
                setRepeatUntildata={setRepeatUntildata}
              />
            </div>
            <div className="float-right sticky-button-85drawer">
              <Button
                type="button"
                variant="contained"
                onClick={() => handleSubmit(values)}
                className="submit-btn"
                disabled={!editId ? !(handleValidation(isValid, dirty, repeatUntildata, nextExpiryDateData, endsOnData)) || getRequiredMessage(values) : (!isValid) || getRequiredMessage(values)}
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
            headerText="Building Compliance"
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
