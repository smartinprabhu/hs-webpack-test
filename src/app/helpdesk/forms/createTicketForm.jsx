/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import { Button, FormControl } from '@mui/material';
import * as PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { Formik, Form } from 'formik';

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import ticketIcon from '@images/icons/ticketBlack.svg';
import validationSchema from '../formModel/validationSchema';
import checkoutFormModel from '../formModel/checkoutFormModel';
import formInitialValues from '../formModel/formInitialValues';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import RequestorForm from './ticketRequestorForm';
import AssetForm from './ticketAssetForm';
import InfoForm from './ticketInformationForm';
import {
  trimJsonObject, extractValueObjects,
  getTenentOptions,
} from '../../util/appUtils';
import ticketActionData from '../data/ticketsActions.json';
import {
  createTicket, resetImage, resetAddTicket,
  resetUpdateTicket, updateTicket, activeStepInfo, getTicketDetail,
  getHelpdeskFilter, getMaintenanceConfigurationData,
  getTenantConfiguration,
} from '../ticketService';
import AsyncFileUpload from '../../commonComponents/asyncFileUpload';
import {
  resetCreateTenant, updateTenant,
  resetUpdateTenant,
} from '../../adminSetup/setupService';
import { last } from '../../util/staticFunctions';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const CreateTicketForm = (props) => {
  const {
    match, equipmentsDetails, isDrawer, isAIEnabled, editIds, closeModal, afterReset, setAddLink,
  } = props;
  const { params } = match;
  const editId = params && params.editId ? params.editId : editIds;
  const { userInfo } = useSelector((state) => state.user);
  const {
    updateTicketInfo, addTicketInfo, tenantConfig, ticketDetail, uploadPhoto, activeStep, maintenanceConfigurationData,
  } = useSelector((state) => state.ticket);
  const dispatch = useDispatch();

  const configData = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0];

  let isChannel = configData && configData.channel_visible === 'None';
  let isTicketType = configData && configData.ticket_type_visible === 'None';
  let isTeam = configData && configData.maintenance_team_visible === 'None';

  const isTenantTicket = userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant';

  if (userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant' && getTenentOptions(userInfo, tenantConfig)) {
    const tConfig = getTenentOptions(userInfo, tenantConfig);
    isChannel = tConfig.channel_visible === 'None';
    isTicketType = tConfig.ticket_type_visible === 'None';
    isTeam = tConfig.maintenance_team_visible === 'None';
  }

  function getTenantConfig(id) {
    let res = { isChannel: false, isTicketType: false, isTeam: false };
    if (getTenentOptions(userInfo, tenantConfig, id)) {
      const tConfig = getTenentOptions(userInfo, tenantConfig, id);
      res = { isChannel: tConfig.channel_visible === 'None', isTicketType: tConfig.ticket_type_visible === 'None', isTeam: tConfig.maintenance_team_visible === 'None' };
    }
    return res;
  }

  const [ticketRequest, setTicketRequest] = useState(false);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [reload, setReload] = useState('1');

  useEffect(() => {
    dispatch(resetImage());
    dispatch(resetCreateTenant());
    dispatch(resetUpdateTicket());
    dispatch(activeStepInfo(activeStep));
    if (!isDrawer && userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getMaintenanceConfigurationData(userInfo.data.company.id, appModels.MAINTENANCECONFIG));
    }
    if (userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant') {
      dispatch(getTenantConfiguration());
    }
  }, []);

  useEffect(() => {
    if (addTicketInfo && addTicketInfo.data && addTicketInfo.data.length) {
      dispatch(
        getTicketDetail(addTicketInfo.data[0], appModels.HELPDESK),
      );
    }
  }, [userInfo, addTicketInfo]);

  AsyncFileUpload(addTicketInfo, uploadPhoto);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      // eslint-disable-next-line no-nested-ternary
      const companyId = userInfo.data.company ? userInfo.data.company : '';
      const partnerId = userInfo.data.partner_id && userInfo.data.partner_id !== '' ? { id: userInfo.data.partner_id, name: userInfo.data.name } : '';
      const mobileNo = userInfo.data.mobile ? userInfo.data.mobile : '';
      const emailId = userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : '';
      formInitialValues.company_id = companyId;
      formInitialValues.requestee_id = partnerId;
      formInitialValues.email = emailId;
      formInitialValues.mobile = mobileNo;
      formInitialValues.channel = ticketActionData.modes.find((data) => data.value === 'web');
      formInitialValues.issue_type = ticketActionData.issueTypes.find((data) => data.value === 'request');
    }
  }, [userInfo]);

  function updateRequestorInfo(id, email, mobile) {
    if (id && id !== -77) {
      const updateData = { email, mobile };
      dispatch(updateTenant(id, updateData, appModels.PARTNER));
      dispatch(resetUpdateTenant());
    }
  }

  function checkDataType(arr) {
    const value = last(arr);
    if (value && typeof value === 'string') {
      return arr[0];
    }
    if (value && typeof value === 'number') {
      return last(arr);
    }
    return false;
  }

  async function submitForm(values, actions) {
    let Cost = values.cost && values.cost !== '' ? values.cost : '';
    Cost = Cost.toString().replace(/\,/g, '');
    Cost = parseInt(Cost, 10);
    if (editId) {
      const postData = {
        mobile: values.mobile,
        email: values.email,
        tenant_name: values.tenant_name,
        requestee_id: extractValueObjects(values.requestee_id),
        // person_name: values.requestee_id && values.requestee_id.name && values.requestee_id.id !== -77 ? values.requestee_id.name : extractValueObjectsDisplay(values.requestee_id),
        priority_id: extractValueObjects(values.priority_id),
        category_id: extractValueObjects(values.category_id),
        vendor_id: extractValueObjects(values.vendor_id),
        sub_category_id: extractValueObjects(values.sub_category_id),
        parent_id: extractValueObjects(values.parent_id),
        equipment_id: extractValueObjects(values.equipment_id),
        maintenance_team_id: extractValueObjects(values.maintenance_team_id),
        company_id: extractValueObjects(values.company_id),
        tenant_id: extractValueObjects(values.tenant_id),
        channel: values.channel ? values.channel.value : false,
        issue_type: values.issue_type ? values.issue_type.value : false,
        // asset_id: extractValueObjects(values.asset_id),
        asset_id: !isTenantTicket ? (values.asset_id && values.asset_id.length > 0 ? last(values.asset_id) : false) : extractValueObjects(values.asset_id),
        subject: values.subject,
        description: values.description,
        type_category: values.type_category,
        constraints: values.constraints,
        cost: Cost || 0,
        ticket_type: extractValueObjects(values.ticket_type),
      };
      const tenatConfig = getTenantConfig(postData.tenant_id);

      if (postData.asset_id && typeof postData.asset_id === 'string') {
        delete postData.asset_id;
      }
      if (!isTenantTicket) {
        if (isTicketType) {
          delete postData.ticket_type;
        }
        if (isTeam) {
          delete postData.maintenance_team_id;
        }
        if (isChannel) {
          delete postData.channel;
        }
      } else if (isTenantTicket) {
        if (tenatConfig.isTicketType) {
          delete postData.ticket_type;
        }
        if (tenatConfig.isTeam) {
          delete postData.maintenance_team_id;
        }
        if (tenatConfig.isChannel) {
          delete postData.channel;
        }
      }
      const newReqId = values.requestee_id && values.requestee_id.id ? values.requestee_id.id : false;
      const oldReqId = values.requestee_id && values.requestee_id.length && values.requestee_id.length > 0 ? values.requestee_id[0] : false;
      // updateRequestorInfo(oldReqId || newReqId, values.email, values.mobile);
      dispatch(updateTicket(editId, appModels.HELPDESK, postData));
      setIsOpenSuccessAndErrorModalWindow(true);
    } else {
      const asset = !isTenantTicket ? (values.asset_id && values.asset_id.length > 0 ? last(values.asset_id) : false) : extractValueObjects(values.asset_id);
      const requesteeId = values.requestee_id && values.requestee_id.id && values.requestee_id.id !== -77 ? values.requestee_id.id : false;
      const personName = values.requestee_id && values.requestee_id.name && values.requestee_id.id !== -77 ? values.requestee_id.name : '';
      const priorityId = values.priority_id && values.priority_id.id ? values.priority_id.id : false;
      const category = values.category_id.id;
      const subcategory = values.sub_category_id.id;
      const equipment = values.equipment_id && values.equipment_id.id ? values.equipment_id.id : false;
      const channel = values.channel && values.channel.value ? values.channel.value : false;
      const company = values.company_id && values.company_id.id ? values.company_id.id : false;
      const maintenanceTeam = values.maintenance_team_id && values.maintenance_team_id.id ? values.maintenance_team_id.id : false;
      const issueType = values.issue_type && values.issue_type.value ? values.issue_type.value : false;
      const parentId = values.parent_id && values.parent_id.id ? values.parent_id.id : false;
      const raiseby = values.raise_by;
      const customType = values.type_category === 'IT' ? 'IT' : false;
      const vendorId = values.vendor_id && values.vendor_id.id ? values.vendor_id.id : false;
      const Constraints = values.constraints;
      const tenantName = values.tenant_name;
      const ticketType = extractValueObjects(values.ticket_type);
      const tenantId = extractValueObjects(values.tenant_id);
      let typeCategory = 'asset';

      if (equipment) {
        typeCategory = 'equipment';
      }
      // updateRequestorInfo(requesteeId, values.email, values.mobile);
      const postData = { ...values };
      postData.requestee_id = requesteeId;
      postData.asset_id = asset;
      postData.tenant_id = tenantId;
      postData.category_id = category;
      postData.sub_category_id = subcategory;
      postData.equipment_id = equipment;
      postData.type_category = typeCategory;
      postData.custom_type = customType;
      postData.channel = channel;
      postData.company_id = company;
      postData.priority_id = priorityId;
      postData.raise_by = raiseby;
      postData.maintenance_team_id = maintenanceTeam;
      postData.parent_id = parentId;
      postData.issue_type = issueType;
      // postData.person_name = personName;
      postData.vendor_id = vendorId;
      postData.constraints = Constraints;
      postData.cost = Cost;
      postData.ticket_type = ticketType;
      postData.tenant_name = tenantName;

      const tenatConfig = getTenantConfig(postData.tenant_id);

      if (!isTenantTicket) {
        if (isTicketType) {
          delete postData.ticket_type;
        }
        if (isTeam) {
          delete postData.maintenance_team_id;
        }
        if (isChannel) {
          delete postData.channel;
        }
      } else if (isTenantTicket) {
        if (tenatConfig.isTicketType) {
          delete postData.ticket_type;
        }
        if (tenatConfig.isTeam) {
          delete postData.maintenance_team_id;
        }
        if (tenatConfig.isChannel) {
          delete postData.channel;
        }
      }

      if (postData.has_team) { delete postData.has_team; }
      if (postData.has_ticket_type) { delete postData.has_ticket_type; }
      if (postData.has_channel) { delete postData.has_channel; }
      if (postData.has_tenant) { delete postData.has_tenant; }

      const payload = { model: appModels.HELPDESK, values: postData };
      const createReq = createTicket(payload);
      dispatch(createReq);
      setIsOpenSuccessAndErrorModalWindow(true);
    }
  }
  function handleSubmit(values, actions) {
    submitForm(values, actions);
  }
  function handleBack() {
    dispatch(activeStepInfo(activeStep - 1));
    setReload('0');
  }
  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    dispatch(resetAddTicket());
    dispatch(activeStepInfo(0));
    setAddLink(false);
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const onLoadRequest = (eid, ename) => {
    if (eid) {
      const filters = [{
        key: 'id', value: eid, label: ename, type: 'id', name: ename,
      }];
      const filterValues = {
        statusValues: false,
        categories: false,
        priorities: false,
        customFilters: filters,
      };
      dispatch(getHelpdeskFilter(filterValues));
    }
    setTicketRequest(true);
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  if (ticketRequest) {
    return <Redirect to="/helpdesk-insights-overview/helpdesk/tickets" />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={editId && ticketDetail && ticketDetail.data ? trimJsonObject(ticketDetail.data[0]) : formInitialValues}
      validationSchema={validationSchema[0]}
      onSubmit={handleSubmit}
    >
      {({
        setFieldValue, errors, resetForm, isValid, dirty, values,
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
              <MuiTextField
                fullWidth
                sx={{
                  width: '96%',
                }}
                name={formField.subject.name}
                label={formField.subject.label}
                setFieldValue={setFieldValue}
                variant="standard"
                isRequired
                value={values[formField.subject.name]}
                isAI={isAIEnabled}
              />
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  gap: '35px',
                }}
              >
                <RequestorForm errors={errors} formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} values={values} />
                <AssetForm isAIEnabled={isAIEnabled} formField={formField} setFieldValue={setFieldValue} reloadSpace={reload} editId={editId} equipment={equipmentsDetails} values={values} />
                <InfoForm formField={formField} setFieldValue={setFieldValue} editId={editId} reloadSpace={reload} values={values} />
              </Box>
            </FormControl>
          </Box>
          <div className="sticky-button-85drawer">
            <Button
              type="button"
              variant="contained"
              onClick={() => handleSubmit(values)}
              disabled={!editId ? !(isValid && dirty) : !isValid}
            >
              {editId ? 'Update a Ticket' : 'Raise a Ticket'}
            </Button>
          </div>
          <SuccessAndErrorModalWindow
            isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
            setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
            type={editId ? 'update' : 'create'}
            successOrErrorData={editId ? updateTicketInfo : addTicketInfo}
            detailData={ticketDetail}
            headerImage={ticketIcon}
            headerText="Ticket"
            newId={addTicketInfo && addTicketInfo.data && ticketDetail && ticketDetail.data && ticketDetail.data.length > 0 ? ticketDetail.data[0].id : false}
            newName={addTicketInfo && addTicketInfo.data && ticketDetail && ticketDetail.data && ticketDetail.data.length > 0 ? ticketDetail.data[0].ticket_number : false}
            onLoadRequest={onLoadRequest}
            successRedirect={handleReset.bind(null, resetForm)}
          />
        </Form>
      )}
    </Formik>
  );
};

CreateTicketForm.defaultProps = {
  match: false,
  isModal: false,
  equipmentsDetails: false,
  isDrawer: false,
  editIds: false,
  setAddLink: () => { },
};

CreateTicketForm.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  equipmentsDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  isModal: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  isDrawer: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  editIds: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  setAddLink: PropTypes.func,
  afterReset: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default CreateTicketForm;
