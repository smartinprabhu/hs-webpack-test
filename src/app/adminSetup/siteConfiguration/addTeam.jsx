/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import ticketIcon from '@images/icons/ticketBlue.svg';
import {
  createTeam,
  editTeam,
} from '../setupService';
import validationSchema from './formModel/validationSchema';
import teamFormModel from './formModel/teamFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  getColumnArrayById,
  extractValueObjects,
} from '../../util/appUtils';
import theme from '../../util/materialTheme';
import BasicForm from './formsTeams/basicForm';
import AdvancedForm from './formsTeams/advancedForm';

const appModels = require('../../util/appModels').default;

const { formId, formField } = teamFormModel;

const AddTeam = ({
  closeModal, editData, afterReset, isDrawer, modalHead,
  isTheme,
}) => {
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [reload, setReload] = useState('1');

  const { userInfo } = useSelector((state) => state.user);
  const {
    createTeamInfo, editTeamInfo, teamDetail,
  } = useSelector((state) => state.setup);

  function handleSubmit(values) {
    if (editData && editData.id) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const postData = {
        maintenance_cost_analytic_account_id: extractValueObjects(values.maintenance_cost_analytic_account_id),
        resource_calendar_id: extractValueObjects(values.resource_calendar_id),
        responsible_id: extractValueObjects(values.responsible_id),
        team_category_id: extractValueObjects(values.team_category_id),
        location_ids: values.location_ids && values.location_ids.length && values.location_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : [[6, 0, []]],
        name: values.name,
        labour_cost_unit: values.labour_cost_unit,
        team_type: values.team_type,
      };

      dispatch(editTeam(editData.id, appModels.TEAM, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      // const employeeId = values.employee_id && values.employee_id.id
      // ? values.employee_id.id : '';
      const maintenanceCostAnalyticId = values.maintenance_cost_analytic_account_id && values.maintenance_cost_analytic_account_id.id
        ? values.maintenance_cost_analytic_account_id.id : '';
      const resourceCalendarId = values.resource_calendar_id && values.resource_calendar_id.id
        ? values.resource_calendar_id.id : '';
      const responsibleId = values.responsible_id && values.responsible_id.id
        ? values.responsible_id.id : '';
      const teamCategoryId = values.team_category_id && values.team_category_id.id
        ? values.team_category_id.id : '';

      const locationId = values.location_ids && values.location_ids.length && values.location_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : [[6, 0, []]];
      const postData = { ...values };

      // postData.employee_id = employeeId;
      postData.maintenance_cost_analytic_account_id = maintenanceCostAnalyticId;
      postData.resource_calendar_id = resourceCalendarId;
      postData.responsible_id = responsibleId;
      postData.team_category_id = teamCategoryId;
      postData.location_ids = locationId;
      postData.company_id = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';

      const payload = { model: appModels.TEAM, values: postData };
      dispatch(createTeam(appModels.TEAM, payload));
    }
  }

  useEffect(() => {
    // dispatch(resetCreateTeam());
  }, []);

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Row className="ml-3 mr-3">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editData && editData.id ? (editData) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, resetForm, values,
          }) => (
            <Form id={formId}>
              <>
                {!isTheme && (
                <ThemeProvider theme={theme}>
                  <br />
                  <BasicForm formField={formField} editId={editData} setFieldValue={setFieldValue} reload={reload} />
                  <AdvancedForm formField={formField} editId={editData} />
                </ThemeProvider>
                )}
                {isTheme && (
                <>
                  <br />
                  <BasicForm formField={formField} editId={editData} setFieldValue={setFieldValue} reload={reload} />
                  <AdvancedForm formField={formField} editId={editData} />
                </>
                )}
              </>
              {(createTeamInfo && createTeamInfo.err) && (
              <SuccessAndErrorFormat response={createTeamInfo} />
              )}
              {(createTeamInfo && !createTeamInfo.data && !createTeamInfo.loading)
                && (editTeamInfo && !editTeamInfo.data && !editTeamInfo.loading) && (
                  <div className={isDrawer ? 'bg-lightblue sticky-button-1250drawer' : 'float-right mt-2'}>
                    <Button
                      disabled={!editData ? !(isValid && dirty) : !isValid}
                      type="submit"
                      variant="contained"
                      className="submit-btn"
                    >
                      {!(editData && editData.id) ? 'Create' : 'Update'}
                    </Button>
                  </div>
              )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editData ? 'update' : 'create'}
                successOrErrorData={editData ? editTeamInfo : createTeamInfo}
                headerImage={ticketIcon}
                headerText="Team"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddTeam.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editData: PropTypes.array.isRequired,
  isTheme: PropTypes.bool,
  isDrawer: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
};

AddTeam.defaultProps = {
  isTheme: false,
  isDrawer: false,
};

export default AddTeam;
