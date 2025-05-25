/* eslint-disable react/jsx-no-useless-fragment */
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
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import PantryBlue from '@images/icons/pantry/pantryBlue.svg';

import BasicForm from './forms/pantryBasicForm';
import validationSchema from './formModel/pantryvalidationSchema';
import checkoutFormModel from './formModel/pantrycheckoutFormModel';
import formInitialValues from './formModel/pantryformInitialValues';
import theme from '../../util/materialTheme';
import {
  trimJsonObject,
  extractValueObjects,
  getColumnArrayById,
  getAllowedCompanies,
} from '../../util/appUtils';

import { createConfigPantry, updateConfigPantry, setLocationId } from '../pantryService';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddPantry = (props) => {
  const {
    editId, afterReset, closeEditModal,
    isTheme,
  } = props;
  const dispatch = useDispatch();
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const {
    configPantryDetails,
    addConfigPantryInfo,
    updateConfigPantryInfo,
  } = useSelector((state) => state.pantry);
  const { userInfo } = useSelector((state) => state.user);
  const {
    siteDetails,
  } = useSelector((state) => state.site);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const companyId = userInfo.data.company ? userInfo.data.company : '';
      formInitialValues.company_id = companyId;
    }
  }, [userInfo]);

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeEditModal();
      const postData = {
        name: values.name,
        maintenance_team_id: extractValueObjects(values.maintenance_team_id),
        spaces_ids: values.spaces_ids && values.spaces_ids.length && values.spaces_ids.length > 0
          ? [[6, 0, getColumnArrayById(values.spaces_ids, 'id')]] : [[6, 0, []]],
        // company_id: extractValueObjects(values.company_id),
        resource_calendar_id: extractValueObjects(values.resource_calendar_id),
      };
      dispatch(updateConfigPantry(editId, appModels.PANTRY, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeEditModal();
      afterReset();
      const { name } = values;
      const maintenanceTeam = extractValueObjects(values.maintenance_team_id);
      const companyId = extractValueObjects(values.company_id);
      const WorkingTime = extractValueObjects(values.resource_calendar_id);
      const locationIds = values.spaces_ids && values.spaces_ids.length && values.spaces_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.spaces_ids, 'id')]] : [[6, 0, []]];

      const postData = { ...values };

      postData.name = name;
      postData.maintenance_team_id = maintenanceTeam;
      postData.resource_calendar_id = WorkingTime;
      postData.spaces_ids = locationIds;
      postData.company_id = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
      const payload = { model: appModels.PANTRY, values: postData };
      dispatch(createConfigPantry(appModels.PANTRY, payload));
    }
  }

  const handleReset = (resetForm) => {
    closeEditModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    if (!editId) {
      resetForm();
      setTimeout(() => {
        if (afterReset) afterReset();
      }, 1000);
    }
  };

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={editId && configPantryDetails && configPantryDetails.data ? trimJsonObject(configPantryDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <PromptIfUnSaved />
              {(addConfigPantryInfo && !addConfigPantryInfo.data && !addConfigPantryInfo.loading) && (
                <>
                  {!isTheme && (
                  <ThemeProvider theme={theme}>
                    <div className="pt-1 pr-5 pl-2 pb-2 mr-2 ml-4 audits-list thin-scrollbar">
                      <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                    </div>
                  </ThemeProvider>
                  )}
                  {isTheme && (
                  <div className="pt-1 pr-5 pl-2 pb-2 mr-2 ml-4 audits-list thin-scrollbar">
                    <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                  </div>
                  )}
                </>
              )}
              {(addConfigPantryInfo && addConfigPantryInfo.err) && (
                <SuccessAndErrorFormat response={addConfigPantryInfo} />
              )}
              {(updateConfigPantryInfo && updateConfigPantryInfo.err) && (
                <SuccessAndErrorFormat response={updateConfigPantryInfo} />
              )}
              {(addConfigPantryInfo && !addConfigPantryInfo.data && !addConfigPantryInfo.loading) && (
              <>
                <>
                  <div className="bg-lightblue sticky-button-1250drawer">
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      type="submit"
                      size="sm"
                       variant="contained"
                    >
                      {!editId ? 'Create' : 'Update'}
                    </Button>
                  </div>
                </>
                <SuccessAndErrorModalWindow
                  isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                  setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                  type={editId ? 'update' : 'create'}
                  successOrErrorData={editId ? updateConfigPantryInfo : addConfigPantryInfo}
                  headerImage={PantryBlue}
                  headerText={editId ? 'Pantry' : 'Pantry'}
                  successRedirect={handleReset.bind(null, resetForm)}
                />
              </>
              )}
              {(updateConfigPantryInfo && !updateConfigPantryInfo.data && !updateConfigPantryInfo.loading) && (
              <>
                <>
                  <div className="bg-lightblue sticky-button-1250drawer">
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      type="submit"
                      size="sm"
                       variant="contained"
                    >
                      {!editId ? 'Create' : 'Update'}
                    </Button>
                  </div>
                </>
                <SuccessAndErrorModalWindow
                  isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                  setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                  type={editId ? 'update' : 'create'}
                  successOrErrorData={editId ? updateConfigPantryInfo : addConfigPantryInfo}
                  headerImage={PantryBlue}
                  headerText={editId ? 'Pantry' : 'Pantry'}
                  successRedirect={handleReset.bind(null, resetForm)}
                />
              </>
              )}
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddPantry.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  isTheme: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  closeEditModal: PropTypes.func.isRequired,
};
AddPantry.defaultProps = {
  isTheme: false,
};

export default AddPantry;
