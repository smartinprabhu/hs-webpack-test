/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Card, Col, Button, Row, Nav, NavLink,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import BasicForm from './forms/basicForm';
import CovidResource from './forms/covidResource';
import TenantSpaceConfiguration from './forms/tenantSpaceConfiguration';
import EmployeeConfiguration from './forms/employeeConfiguration';
import validationSchema from './formModel/validationSchema';
import tenantFormModel from './formModel/tenantFormModel';
import { updateTenant } from '../../setupService';
import theme from '../../../util/materialTheme';
import tabs from './tabs.json';
import { trimJsonObject, isArrayColumnExists, getColumnArrayById } from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = tenantFormModel;

const EditTenant = () => {
  const dispatch = useDispatch();
  const [currentTab, setActive] = useState('Tenant Space Configuration');

  const { tenantUpdateInfo, tenantDetail } = useSelector((state) => state.setup);

  function getDataValue(arrData) {
    let result = false;
    if (arrData && arrData.length > 0) {
      result = arrData[0];
    }
    return result;
  }

  function handleSubmit(values) {
    const postData = {
      name: values.name,
      mobile: values.mobile,
      email: values.email,
      street: values.street,
      allow_onspot_space_booking: values.allow_onspot_space_booking,
      create_work_schedule: values.create_work_schedule,
      generate_mor_after_release: values.generate_mor_after_release,
      require_checklist: values.require_checklist,
      work_schedule_grace_period: values.work_schedule_grace_period,
      enable_prescreen: values.enable_prescreen,
      prescreen_period: values.prescreen_period,
      prescreen_is_mandatory: values.prescreen_is_mandatory,
      book_from_outlook: values.book_from_outlook,
      enable_access: values.enable_access,
      skip_occupy: values.skip_occupy,
      detect_mask: values.detect_mask,
      face_detection_mandatory: values.face_detection_mandatory,
      prerelease_required: values.prerelease_required,
      prerelease_period: values.prerelease_period,
      auto_release: values.auto_release,
      auto_release_grace_period: values.auto_release_grace_period,
      enable_group_booking: values.enable_group_booking,
      enable_booking_for_others: values.enable_booking_for_others,
      prescreen_required_every_schedule: values.prescreen_required_every_schedule,
      covid_title: values.covid_title,
      allowed_occupancy_per: values.allowed_occupancy_per,
      enable_screening: values.enable_screening,
      allow_after_non_compliance: values.allow_after_non_compliance,
      enable_covid_config: values.enable_covid_config,
      enable_report_covid_incident: values.enable_report_covid_incident,
      require_attendance: values.require_attendance,
      attendance_with_face_detection: values.attendance_with_face_detection,
      otp_validity_period: values.otp_validity_period,
      valid_domains: values.valid_domains,
      allow_user_registration_with_valid_domain: values.allow_user_registration_with_valid_domain,
      tenant_code: values.tenant_code,
      attendance_source: values.attendance_source && values.attendance_source.value
        ? values.attendance_source.value : values.attendance_source,
      conference_room_space_id: values.conference_room_space_id && values.conference_room_space_id.id
        ? values.conference_room_space_id.id : getDataValue(values.conference_room_space_id),
      office_room_space_id: values.office_room_space_id && values.office_room_space_id.id
        ? values.office_room_space_id.id : getDataValue(values.office_room_space_id),
      workstation_space_id: values.workstation_space_id && values.workstation_space_id.id
        ? values.workstation_space_id.id : getDataValue(values.workstation_space_id),
      building_space_id: values.building_space_id && values.building_space_id.id
        ? values.building_space_id.id : getDataValue(values.building_space_id),
      conference_room_space_sub_type_id: values.conference_room_space_sub_type_id && values.conference_room_space_sub_type_id.id
        ? values.conference_room_space_sub_type_id.id : getDataValue(values.conference_room_space_sub_type_id),
      office_room_space_sub_type_id: values.office_room_space_sub_type_id && values.office_room_space_sub_type_id.id
        ? values.office_room_space_sub_type_id.id : getDataValue(values.office_room_space_sub_type_id),
      workstation_space_sub_type_id: values.workstation_space_sub_type_id && values.workstation_space_sub_type_id.id
        ? values.workstation_space_sub_type_id.id : getDataValue(values.workstation_space_sub_type_id),
      enable_landing_page_id: values.enable_landing_page_id && values.enable_landing_page_id.id
        ? values.enable_landing_page_id.id : getDataValue(values.enable_landing_page_id),
      streenable_other_resources_idet: values.enable_other_resources_id && values.enable_other_resources_id.id
        ? values.enable_other_resources_id.id : getDataValue(values.enable_other_resources_id),
      safety_resources_id: values.safety_resources_id && values.safety_resources_id.id
        ? values.safety_resources_id.id : getDataValue(values.safety_resources_id),
      enable_workspace_instruction_id: values.enable_workspace_instruction_id && values.enable_workspace_instruction_id.id
        ? values.enable_workspace_instruction_id.id : getDataValue(values.enable_workspace_instruction_id),
      help_line_id: values.help_line_id && values.help_line_id.id
        ? values.help_line_id.id : getDataValue(values.help_line_id),
      ticket_category_id: values.ticket_category_id && values.ticket_category_id.id
        ? values.ticket_category_id.id : getDataValue(values.ticket_category_id),
      sub_category_id: values.sub_category_id && values.sub_category_id.id
        ? values.sub_category_id.id : getDataValue(values.sub_category_id),
      maintenance_team_id: values.maintenance_team_id && values.maintenance_team_id.id
        ? values.maintenance_team_id.id : getDataValue(values.maintenance_team_id),
      future_limit_uom: values.future_limit_uom && values.future_limit_uom.value
        ? values.future_limit_uom.value : values.future_limit_uom,
      minimum_duration_uom: values.minimum_duration_uom && values.minimum_duration_uom.value
        ? values.minimum_duration_uom.value : values.minimum_duration_uom,
      buffer_period_uom: values.buffer_period_uom && values.buffer_period_uom.value
        ? values.buffer_period_uom.value : values.buffer_period_uom,
    };

    const updateData = { ...postData };

    if (isArrayColumnExists(values.check_list_ids ? values.check_list_ids : [], 'id')) {
      updateData.check_list_ids = [[6, false, getColumnArrayById(values.check_list_ids, 'id')]];
    }

    if (isArrayColumnExists(values.space_neighbour_ids ? values.space_neighbour_ids : [], 'id')) {
      updateData.space_neighbour_ids = [[6, false, getColumnArrayById(values.space_neighbour_ids, 'id')]];
    }

    const id = tenantDetail && tenantDetail.data ? tenantDetail.data[0].id : '';
    dispatch(updateTenant(id, updateData, appModels.PARTNER));
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        {tenantDetail && tenantDetail.loading && (
        <div className="text-center mt-3">
          <Loader />
        </div>
        )}
        {tenantDetail && tenantDetail.data && (
        <Formik
          initialValues={tenantDetail && tenantDetail.data ? trimJsonObject(tenantDetail.data[0]) : {}}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, setFieldValue,
          }) => (
            <Form id={formId}>
              {(tenantUpdateInfo && tenantUpdateInfo.data) ? ('') : (
                <ThemeProvider theme={theme}>
                  <Row className="pl-4 pr-4">
                    <Col md="3" sm="3" lg="3" xs="12" className="m-0 p-1">
                      <Card className="bg-lightblue border-0 h-100 p-3">
                        <BasicForm formField={formField} />
                      </Card>
                    </Col>
                    <Col md="9" sm="9" lg="9" xs="12" className="m-0 p-1">
                      <Card className="bg-lightblue border-0 h-100 p-3">
                        <Nav>
                          {tabs && tabs.formTabs.map((item) => (
                            <div className="mr-5" key={item.id}>
                              <NavLink className="nav-link-item pt-2 pb-1 pl-1 pr-1" active={currentTab === item.name} href="#" onClick={() => setActive(item.name)}>{item.name}</NavLink>
                            </div>
                          ))}
                        </Nav>
                        <br />
                        <div className="form-modal-scroll thin-scrollbar">
                          {currentTab === 'Tenant Space Configuration' && (
                          <TenantSpaceConfiguration formField={formField} setFieldValue={setFieldValue} />
                          )}
                          {currentTab === 'Covid Resource' && (
                          <CovidResource formField={formField} />
                          )}
                          {currentTab === 'Employee Configuration' && (
                          <EmployeeConfiguration formField={formField} setFieldValue={setFieldValue} />
                          )}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </ThemeProvider>
              )}
              {tenantUpdateInfo && tenantUpdateInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.err) && (
              <SuccessAndErrorFormat response={tenantUpdateInfo} />
              )}
              {(tenantUpdateInfo && tenantUpdateInfo.data) && (
              <SuccessAndErrorFormat response={tenantUpdateInfo} successMessage="Tenant updated successfully.." />
              )}
              <hr />
              <div className="float-right mr-4">
                {!(tenantUpdateInfo && tenantUpdateInfo.data) && (
                <Button
                  disabled={!(isValid)}
                  type="submit"
                  size="sm"
                   variant="contained"
                >
                  Save
                </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
        )}
        {(tenantDetail && tenantDetail.err) && (
        <SuccessAndErrorFormat response={tenantDetail} />
        )}
      </Col>
    </Row>
  );
};

export default EditTenant;
