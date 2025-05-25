/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-shadow */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { Box } from '@mui/system';
import { Button, Divider, FormControl } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  resetCreateTenant,
  createTenant,
} from '../../setupService';
import validationSchema from './formModel/validationSchema';
import tenantFormModel from './formModel/tenantFormModel';
import formInitialValues from './formModel/formInitialValues';
import theme from '../../../util/materialTheme';
import BasicSetup from './basicSetup';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = tenantFormModel;

const AddCustomer = (props) => {
  const {
    requestorName,
    setFieldValue,
    afterReset,
    type,
    updateField,
    isComplaince,
    maintenanceConfigurationData,
    helpdeskCompanyId,
    moduleName,
  } = props;
  const dispatch = useDispatch();
  const [personName, setPersonName] = useState(requestorName);
  const { userInfo } = useSelector((state) => state.user);
  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    if (((userInfo && userInfo.data) && (createTenantinfo && createTenantinfo.data))) {
      if (moduleName === 'shareTicketHelpdesk') {
        setFieldValue({ id: createTenantinfo.data[0], name: personName });
      } else {
        setFieldValue(updateField || 'requestee_id', { id: createTenantinfo.data[0], name: personName });
      }
    }
    if (createTenantinfo && createTenantinfo.err) {
      if (moduleName === 'shareTicketHelpdesk') {
        setFieldValue(false);
      } else {
        setFieldValue(updateField || 'requestee_id', false);
      }
    }
  }, [userInfo, createTenantinfo]);

  useEffect(() => {
    dispatch(resetCreateTenant());
  }, []);

  const isSite = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].vendor_access_type === 'Site';
  const isCompany = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].vendor_access_type === 'Company';
  const isInstance = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].vendor_access_type === 'Instance';
  const isAll = !!(window.localStorage.getItem('isAllCompany') && window.localStorage.getItem('isAllCompany') === 'yes');

  const onReset = () => {
    // dispatch(resetCreateTenant());
    if (afterReset) afterReset();
  };

  function handleSubmit(values) {
    if (!updateField) {
      setFieldValue('mobile', values.mobile);
      setFieldValue('email', values.email);
    }
    setPersonName(values.name);
    const postData = { ...values };
    if (type === 'vendor') {
      postData.supplier = true;
    } else {
      postData.customer = true;
    }
    if (isComplaince) {
      postData.is_compliance = true;
    }
    if (moduleName === 'helpdesk' || moduleName === 'shareTicketHelpdesk') {
      if (isInstance && !isAll) {
        postData.company_id = 1;
      } else if (isCompany && !isAll) {
        postData.company_id = userInfo.data && userInfo.data.company && userInfo.data.company.parent_id && userInfo.data.company.parent_id.id ? userInfo.data.company.parent_id.id : false;
      } else if (isAll) {
        postData.company_id = helpdeskCompanyId || '';
      } else {
        postData.company_id = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
      }
    } else {
      postData.company_id = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
    }
    const payload = { model: appModels.PARTNER, values: postData };
    dispatch(createTenant(appModels.PARTNER, payload));
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, values
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <FormControl
                  sx={{
                    width: "100%",
                    padding: "20px 0px 20px 30px",
                    maxHeight: '620px',
                    borderTop: '1px solid #0000001f',
                  }}
                >

                  {(createTenantinfo && createTenantinfo.data) ? ('') : (
                    <BasicSetup formField={formField} setFieldValue={setFieldValue} personName={personName} />
                  )}
                  {createTenantinfo && createTenantinfo.loading && (
                    <div className="text-center mt-3">
                      <Loader />
                    </div>
                  )}
                  {(createTenantinfo && createTenantinfo.err) && (
                    <SuccessAndErrorFormat response={createTenantinfo} />
                  )}
                  {(createTenantinfo && createTenantinfo.data) && (
                    <SuccessAndErrorFormat response={createTenantinfo} successMessage={type === 'vendor' ? 'Vendor Created Successfully' : 'Customer added successfully..'} />
                  )}
                </FormControl>
                <Divider style={{ marginBottom: '10px', marginTop: '0px' }} />
                {(createTenantinfo && createTenantinfo.data) && (
                  <Box sx={{ float: 'right', marginRight: '20px' }}>
                    <Button
                      variant='contained'
                      type="button"
                      onClick={() => onReset()}
                    >
                      Ok
                    </Button>
                  </Box>
                )}
                {(createTenantinfo && !createTenantinfo.data) && (
                  <Box sx={{ float: 'right', marginRight: '20px' }}>
                    <Button
                      disabled={!(isValid && dirty) || (createTenantinfo && createTenantinfo.loading)}
                      variant='contained'
                      type="button"
                      onClick={() => handleSubmit(values)}
                    >
                      Add
                    </Button>
                  </Box>
                )}
              </Box>
            </Form>)}
        </Formik>
      </Col>
    </Row>
  );
};

AddCustomer.propTypes = {
  requestorName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  afterReset: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  updateField: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isComplaince: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  helpdeskCompanyId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  moduleName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  maintenanceConfigurationData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

AddCustomer.defaultProps = {
  updateField: false,
  maintenanceConfigurationData: false,
  helpdeskCompanyId: false,
  moduleName: false,
  isComplaince: false,
};

export default AddCustomer;
