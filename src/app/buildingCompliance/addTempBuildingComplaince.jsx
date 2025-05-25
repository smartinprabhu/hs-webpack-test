/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import complianceBlackIcon from '@images/icons/complianceBlack.svg';
import BasicForm from './forms/basicTempForm';
import validationSchema from './tempFormModel/validationSchema';
import checkoutFormModel from './tempFormModel/checkoutFormModel';
import formInitialValues from './tempFormModel/formInitialValues';
import {
  createCompliance, getComplianceTempList, getComplianceTempCount, getComplianceTempFilters, getComplianceDetail, resetAddComplianceInfo, resetComplianceTemplate,
} from './complianceService';
import {
  updateTenant, resetUpdateTenant,
} from '../adminSetup/setupService';
import theme from '../util/materialTheme';
import {
  trimJsonObject, getColumnArrayById,
  getAllCompanies, getDateTimeUtc, isAllCompany,
  extractValueObjects,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddTempBuildingComplaince = (props) => {
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
      dispatch(getComplianceTempList(companies, appModels.COMPLIANCETEMPLATE, limit, offsetValue, statusValues, categoryValues, appValues, customFilters, sortByValue, sortFieldValue));
      dispatch(getComplianceTempCount(companies, appModels.COMPLIANCETEMPLATE, statusValues, categoryValues, appValues, customFilters));
    }
  }, [userInfo, addComplianceInfo]);

  useEffect(() => {
    if (addComplianceInfo && addComplianceInfo.data && addComplianceInfo.data.length) {
      dispatch(getComplianceDetail(addComplianceInfo.data[0], appModels.COMPLIANCETEMPLATE));
    }
  }, [userInfo, addComplianceInfo]);

  useEffect(() => {
    dispatch(resetAddComplianceInfo());
    dispatch(resetComplianceTemplate());
  }, []);

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const postData = {
        name: values.name,
        compliance_category_id: values.compliance_category_id ? values.compliance_category_id.id : '',
        compliance_act: values.compliance_act ? values.compliance_act.id : '',
        submitted_to: values.submitted_to ? values.submitted_to.id : '',
        expiry_schedule_type: values.expiry_schedule_type ? values.expiry_schedule_type.value : '',
        is_has_expiry: values.is_has_expiry ? values.is_has_expiry : false,
        renewal_lead_time: values.renewal_lead_time ? values.renewal_lead_time : false,
        expiry_schedule: values.expiry_schedule ? values.expiry_schedule : false,
        type: values.type && values.type.value ? values.type.value : values.type,
        url_link: values.url_link,
      };
      dispatch(updateTenant(editId, postData, appModels.COMPLIANCETEMPLATE));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      dispatch(getComplianceTempFilters(complianceFilters.customFilters ? complianceFilters.customFilters.filter((item) => item.type !== 'id') : []));
      const complianceCategory = values.compliance_category_id.id;
      const complianceAct = values.compliance_act.id;
      const submittedTo = values.submitted_to.id;
      const expiryScheduleType = values.expiry_schedule_type && values.expiry_schedule_type.value ? values.expiry_schedule_type.value : false;
      const expirySchedule = values.expiry_schedule ? values.expiry_schedule : false;
      const hasExpiry = values.is_has_expiry ? values.is_has_expiry : false;
      const renewalLeadTime = values.renewal_lead_time ? values.renewal_lead_time : false;
      const typeValue = values.type && values.type.value ? values.type.value : values.type;

      const postData = { ...values };

      postData.compliance_category_id = complianceCategory;
      postData.compliance_act = complianceAct;
      postData.submitted_to = submittedTo;
      postData.expiry_schedule_type = expiryScheduleType;
      postData.expiry_schedule = expirySchedule;
      postData.is_has_expiry = hasExpiry;
      postData.renewal_lead_time = renewalLeadTime;
      postData.type = typeValue;
      postData.company_id = userCompanyId;

      const payload = { model: appModels.COMPLIANCETEMPLATE, values: postData };
      dispatch(createCompliance(appModels.COMPLIANCETEMPLATE, payload));
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
    dispatch(getComplianceTempFilters(complianceFilters.customFilters ? complianceFilters.customFilters.filter((item) => item.type !== 'id') : []));
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
        name: ename,
      }];
      dispatch(getComplianceTempFilters(customFilters));
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
                  <Box
                    sx={{
                      padding: '20px',
                      width: '100%',
                      marginBottom: '50px',
                    }}
                  >
                    <div className="">
                      <BasicForm isUpdate={isUpdate} setEendsOnData={setEendsOnData} setNextExpiryDateData={setNextExpiryDateData} setRepeatUntildata={setRepeatUntildata} formField={formField} editId={editId} setFieldValue={setFieldValue} reload={reload} setFieldTouched={setFieldTouched} />
                    </div>
                  </Box>
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
                  <div className="float-right sticky-button-85drawer">
                    <Button
                      disabled={editId ? (!isValid || (complianceDetails && complianceDetails.loading)) : !(isValid && dirty)}
                      type="button"
                      variant="contained"
                      onClick={() => handleSubmit(values)}
                      className="submit-btn"
                    >
                      {!editId ? 'Create' : 'Update'}
                    </Button>
                  </div>
              )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                newId={complianceDetails && complianceDetails.data && complianceDetails.data.length > 0 && !(addComplianceInfo && addComplianceInfo.loading) ? complianceDetails.data[0].id : false}
                newName={complianceDetails && complianceDetails.data && complianceDetails.data.length > 0 && !(addComplianceInfo && addComplianceInfo.loading) ? complianceDetails.data[0].name : false}
                successOrErrorData={editId ? tenantUpdateInfo : addComplianceInfo}
                headerImage={complianceBlackIcon}
                headerText="Building Template"
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

AddTempBuildingComplaince.propTypes = {
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddTempBuildingComplaince;
