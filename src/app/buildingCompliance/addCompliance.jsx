/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Button, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import complianceBlackIcon from '@images/icons/complianceBlack.svg';
import BasicForm from './forms/basicForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createCompliance, getComplianceList, getComplianceCount, getComplianceFilters, getComplianceDetail, resetAddComplianceInfo, resetComplianceTemplate,
} from './complianceService';
import {
  updateTenant, resetUpdateTenant,
} from '../adminSetup/setupService';
import theme from '../util/materialTheme';
import {
  trimJsonObject, getColumnArrayById,
  isAllCompany, getDateTimeUtc, getAllCompanies, extractValueObjects,
} from '../util/appUtils';
import {
  getRequiredMessage,
} from './utils/utils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddCompliance = (props) => {
  const {
    editId, isUpdate, closeModal, afterReset,
  } = props;
  const dispatch = useDispatch();
  const [reload] = useState('1');
  const [dateError, setDateError] = useState(false);
  const [complianceRequest, setComplianceRequest] = useState(false);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const { addComplianceInfo, complianceDetails, complianceFilters } = useSelector((state) => state.compliance);
  const [repeatUntildata, setRepeatUntildata] = useState(false);
  const [endsOnData, setEendsOnData] = useState('');
  const [nextExpiryDateData, setNextExpiryDateData] = useState('');

  const isAllCompanies = isAllCompany(userInfo, userRoles);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

  const offsetValue = 0;
  const limit = 10;
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

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
    } else if (isValid && dirty && repeatData && repeatData.value && endsOnData !== '' && (nextExpiry < endDate1)) {
      validation = false;
    } else if (isValid && dirty && repeatData && repeatData.value && endsOnData !== '' && (nextExpiry > endDate1)) {
      validation = true;
    } else if (isValid && dirty && repeatData && repeatData.value && endsOnData !== '') {
      validation = true;
    } else if (isValid && dirty) {
      validation = true;
    } else if ((!isValid && dirty) || (isValid && !dirty)) {
      validation = false;
    }
    return validation;
  }

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeModal();
      let nextExpiryDate = values.next_expiry_date ? values.next_expiry_date : false;
      let endDate = values.end_date ? values.end_date : false;
      if (checkDatehasObject(nextExpiryDate)) {
        nextExpiryDate = getDateTimeUtc(nextExpiryDate);
      }
      if (checkDatehasObject(endDate)) {
        endDate = getDateTimeUtc(endDate);
      }
      let locationIds = false;
      let companyIds = false;
      let assetId = false;
      const appliesTo = values.applies_to && values.applies_to.value ? values.applies_to.value : values.applies_to;
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
        renewal_lead_time: values.renewal_lead_time ? values.renewal_lead_time : false,
        expiry_schedule: values.expiry_schedule ? values.expiry_schedule : false,
        next_expiry_date: nextExpiryDate,
        end_date: endDate,
        location_ids: locationIds,
        company_ids: companyIds,
        url_link: values.url_link,
        asset_ids: assetId,
      };
      if (!getRequiredMessage(postData)) {
        setDateError(false);
        dispatch(updateTenant(editId, postData, appModels.BULIDINGCOMPLIANCE));
      } else {
        setDateError(getRequiredMessage(postData));
      }
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeModal();
      dispatch(getComplianceFilters(complianceFilters.customFilters ? complianceFilters.customFilters.filter((item) => item.type !== 'id') : []));
      const complianceId = values.compliance_id.id;
      const complianceCategory = values.compliance_category_id.id;
      const complianceAct = values.compliance_act.id;
      const submittedTo = values.submitted_to.id;
      const appliesTo = values.applies_to && values.applies_to.value ? values.applies_to.value : false;
      const responsibleId = values.responsible_id.id;
      const expiryScheduleType = values.expiry_schedule_type && values.expiry_schedule_type.value ? values.expiry_schedule_type.value : false;
      const expirySchedule = values.expiry_schedule ? values.expiry_schedule : false;
      const repeatUntil = values.repeat_until && values.repeat_until.value ? values.repeat_until.value : false;
      const hasExpiry = values.is_has_expiry ? values.is_has_expiry : false;
      const renewalLeadTime = values.renewal_lead_time ? values.renewal_lead_time : false;
      let nextExpiryDate = values.next_expiry_date ? values.next_expiry_date : false;
      const typeValue = values.type && values.type.value ? values.type.value : values.type;
      let endDate = values.end_date ? values.end_date : false;
      if (checkDatehasObject(nextExpiryDate)) {
        nextExpiryDate = getDateTimeUtc(nextExpiryDate);
      }
      if (checkDatehasObject(endDate)) {
        endDate = getDateTimeUtc(endDate);
      }

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

  const onLoadRequest = (eid, ename) => {
    if (eid) {
      const customFilters = [{
        key: 'name',
        value: ename,
        label: 'Name',
        type: 'id',
        title: 'Name',
      }];
      dispatch(getComplianceFilters(customFilters));
    }
    setComplianceRequest(false);
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && complianceDetails && complianceDetails.data ? trimJsonObject(complianceDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, values, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              {(addComplianceInfo && addComplianceInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.loading) ? ('') : (
                <ThemeProvider theme={theme}>
                  <div>
                    <BasicForm isUpdate={isUpdate} setEendsOnData={setEendsOnData} setNextExpiryDateData={setNextExpiryDateData} setRepeatUntildata={setRepeatUntildata} formField={formField} editId={editId} setFieldValue={setFieldValue} reload={reload} setFieldTouched={setFieldTouched} />
                  </div>
                </ThemeProvider>
              )}
              {/* {dateError && (
                <>
                  <div className="text-danger text-center mt-3">
                    <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                    {dateError}
                  </div>
                </>
              )}
              {(addComplianceInfo && addComplianceInfo.err) && (
                <SuccessAndErrorFormat response={addComplianceInfo} />
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.err) && (
                <SuccessAndErrorFormat response={tenantUpdateInfo} />
              )}
               <>
                {((addComplianceInfo && addComplianceInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data)) && (
                <SuccessAndErrorFormat
                  response={addComplianceInfo.data ? addComplianceInfo : tenantUpdateInfo}
                  successMessage={addComplianceInfo.data ? 'Building Compliance added successfully..' : 'Building Compliance details are updated successfully..'}
                />
                )}
                <div className="float-right">
                  {((addComplianceInfo && addComplianceInfo.data) || (tenantUpdateInfo && tenantUpdateInfo.data)) && (
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
              {(addComplianceInfo && !addComplianceInfo.data && !addComplianceInfo.loading)
                && (tenantUpdateInfo && !tenantUpdateInfo.data && !tenantUpdateInfo.loading) && (
                  <>
                    <hr />
                    <div className="bg-lightblue sticky-button-1250drawer">
                      <Button
                        disabled={!editId ? !(handleValidation(isValid, dirty, repeatUntildata, nextExpiryDateData, endsOnData)) || getRequiredMessage(values) : (!isValid) || getRequiredMessage(values)}
                        type="submit"
                        size="sm"
                         variant="contained"
                      >
                        {!editId ? 'Create' : 'Update'}
                      </Button>
                      {getRequiredMessage(values) && (
                      <p className="m-0 text-danger">{getRequiredMessage(values)}</p>
                      )}
                    </div>
                  </>
              )}
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
      </Col>
    </Row>
  );
};

AddCompliance.propTypes = {
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddCompliance;
