/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/forbid-prop-types */
import { Box, Button } from '@mui/material';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';

import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import ticketIcon from '@images/icons/ticketBlue.svg';
import {
  extractValueObjects,
  getColumnArrayById,
  getArrayFormatCreateSingle,
  trimArrayofObjectValue,
} from '../../util/appUtils';
import {
  createTeam,
  editTeam,
  resetCreateTeam,
} from '../setupService';
import { resetBulkAdd } from '../../helpdesk/actions';
import {
  createBulkData,
} from '../../helpdesk/ticketService';
import formInitialValues from './formModel/formInitialValues';
import teamFormModel from './formModel/teamFormModel';
import validationSchema from './formModel/validationSchema';
// import BasicForm from './formsTeams/basicForm';
import BasicForm from './formsTeams/basicMiniForm';
import { checkRequiredFields } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const { formId, formField } = teamFormModel;

const AddTeam = ({
  closeModal, editData, afterReset, isDrawer, modalHead, isTheme,
}) => {
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [reload, setReload] = useState('1');
  const [partsData, setPartsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [partsAdd, setPartsAdd] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const { createBulkInfoAdd } = useSelector((state) => state.ticket);
  const {
    createTeamInfo, editTeamInfo, teamDetail,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
    }
  }, [partsAdd]);

  function handleSubmit(values) {
    setIsOpenSuccessAndErrorModalWindow(true);
    dispatch(createBulkData(appModels.TEAM, getArrayFormatCreateSingle(trimArrayofObjectValue(partsData, ['name']))));
    /* if (editData && editData.id) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const postData = {
        maintenance_cost_analytic_account_id: extractValueObjects(values.maintenance_cost_analytic_account_id),
        resource_calendar_id: extractValueObjects(values.resource_calendar_id),
        responsible_id: extractValueObjects(values.responsible_id),
        team_category_id: extractValueObjects(values.team_category_id),
        location_ids: values.location_ids && values.location_ids.length && values.location_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : false,
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
        ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : false;
      const postData = { ...values };

      // postData.employee_id = employeeId;
      postData.maintenance_cost_analytic_account_id = maintenanceCostAnalyticId;
      postData.resource_calendar_id = resourceCalendarId;
      postData.responsible_id = responsibleId;
      postData.team_category_id = teamCategoryId;
      postData.location_ids = locationId;
      // postData.company_id = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
      postData.company_id = values.company_id.id;

      const payload = { model: appModels.TEAM, values: postData };
      dispatch(createTeam(appModels.TEAM, payload));
    } */
  }

  useEffect(() => {
    dispatch(resetBulkAdd());
  }, []);

  const handleReset = (resetForm) => {
    dispatch(resetBulkAdd());
    resetForm();
    if (!isDrawer) {
      closeModal();
    }
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 500);
  };

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={editData && editData.id ? (editData) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, resetForm, values,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  width: '100%',
                  padding: '20px 25px',
                  flexGrow: 1,
                }}
                className="createFormScrollbar pt-0"
              >
                <>

                  <BasicForm formField={formField} setPartsAdd={setPartsAdd} setPartsData={setPartsData} partsData={partsData} editId={editData} setFieldValue={setFieldValue} reload={reload} />
                  {/* <AdvancedForm formField={formField} editId={editData} /> */}
                </>
                {((createBulkInfoAdd && createBulkInfoAdd.loading) || (teamDetail && teamDetail.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
                )}
                {(createBulkInfoAdd && !createBulkInfoAdd.data && !createBulkInfoAdd.loading) && (
                <div className={isDrawer ? 'bg-lightblue sticky-button-85drawer' : 'float-right mt-2'}>
                  <span className="text-danger">{errorMessage}</span>
                  <Button
                    disabled={(partsData && partsData.length <= 0) || (!checkRequiredFields(partsData, 'teams'))}
                    type="button"
                    onClick={() => handleSubmit()}
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
                  successOrErrorData={createBulkInfoAdd}
                  headerImage={ticketIcon}
                  headerText="Teams"
                  successRedirect={handleReset.bind(null, resetForm)}
                />
              </Box>
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
