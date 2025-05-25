/* eslint-disable no-lone-blocks */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import {
  Button
} from '@mui/material';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';

import PromptIfUnSaved from '@shared/unSavedPrompt';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import InventoryBlue from '@images/icons/inventoryBlue.svg';

import BasicForm from './forms/escalationBasicForm';
import validationSchema from './formModel/escalationLevelvalidationSchema';
import checkoutFormModel from './formModel/escalationLevelcheckoutFormModel';
import formInitialValues from './formModel/escalationLevelformInitialValues';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject,
  extractValueObjects,
  getColumnArrayById, isArrayColumnExists,
} from '../../../util/appUtils';

import {
  createEscalationLevel, updateEscalationLevel,
} from '../../../pantryManagement/pantryService';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddEscalationLevel = (props) => {
  const {
    closeModal, selectedUser, editData, closeAddModal,
  } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    productCategoryDetails,
    addEscalationLevelInfo,
    updateEscalationLevelInfo,
  } = useSelector((state) => state.pantry);
  const { esInfo } = useSelector((state) => state.site);

  function handleSubmit(values) {
    if (selectedUser) {
      setIsOpenSuccessAndErrorModalWindow(true);
     // closeModal();
      const categoryId = values.category_id && values.category_id.length && values.category_id.length > 0
        ? [[6, 0, getColumnArrayById(values.category_id, 'id')]] : [[6, 0, []]];
      const spaceId = values.space_category_id && values.space_category_id.length && values.space_category_id.length > 0
        ? [[6, 0, getColumnArrayById(values.space_category_id, 'id')]] : [[6, 0, []]];
      const locationId = values.location_ids && values.location_ids.length && values.location_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : [[6, 0, []]];
      const postData = {
        name: values.name,
        location_ids: locationId,
        level: extractValueObjects(values.level),
        category_id: categoryId,
        type_category: extractValueObjects((values.type_category)),
        space_category_id: spaceId,
      };
      if (isArrayColumnExists(values.recipients_ids ? values.recipients_ids : [], 'id')) {
        let selectedCompanies = getColumnArrayById(values.recipients_ids, 'id');
        const appendSelectedCompany = extractValueObjects(values.recipients_ids);
        const isParentExists = selectedCompanies.filter((item) => item === appendSelectedCompany);
        if (isParentExists && !isParentExists.length) {
          selectedCompanies = [...selectedCompanies];
        }
        postData.recipients_ids = [[6, false, selectedCompanies]];
      }
      dispatch(updateEscalationLevel(selectedUser, appModels.ESCALATIONLEVEL, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      //closeModal();
      const { name } = values;
      const level = values.level ? extractValueObjects(values.level) : false;
      const typeId = extractValueObjects(values.type_category);
      const postData = { ...values };

      const recipientId = values.recipients_ids && values.recipients_ids.length && values.recipients_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.recipients_ids, 'id')]] : false;

      const spaceId = values.space_category_id && values.space_category_id.length && values.space_category_id.length > 0
        ? [[6, 0, getColumnArrayById(values.space_category_id, 'id')]] : false;

      const categoryId = values.category_id && values.category_id.length && values.category_id.length > 0
        ? [[6, 0, getColumnArrayById(values.category_id, 'id')]] : false;

      const locationId = values.location_ids && values.location_ids.length && values.location_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : false;

      postData.name = name;
      postData.location_ids = locationId;
      postData.recipients_ids = recipientId;
      postData.level = level;
      postData.category_id = categoryId;
      postData.type_category = typeId;
      postData.space_category_id = spaceId;
      const payload = { model: appModels.ESCALATIONLEVEL, values: postData };
      dispatch(createEscalationLevel(appModels.ESCALATIONLEVEL, payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (closeModal) closeModal();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-4 ml-4">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={selectedUser && esInfo && esInfo.data ? trimJsonObject(esInfo.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <PromptIfUnSaved />
              <ThemeProvider theme={theme}>
                <div>
                  <BasicForm formField={formField} editId={editData} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                </div>
              </ThemeProvider>
              {/* )} */}
              {((addEscalationLevelInfo && addEscalationLevelInfo.loading) || (productCategoryDetails && productCategoryDetails.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {/* {(addEscalationLevelInfo && addEscalationLevelInfo.err) && (
                <SuccessAndErrorFormat response={addEscalationLevelInfo} />
              )}
              {(updateEscalationLevelInfo && updateEscalationLevelInfo.err) && (
                <SuccessAndErrorFormat response={updateEscalationLevelInfo} />
              )}
              <hr /> */}
              <div className="float-right m-4">
                <div className="sticky-button-85drawer">
                  <Button
                    disabled={!editData ? !(isValid && dirty) : !isValid}
                    type="submit"
                    size="sm"
                    variant="contained"
                  >
                    {!editData ? 'Add' : 'Update'}
                  </Button>
                </div>
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editData ? 'update' : 'create'}
                successOrErrorData={editData ? updateEscalationLevelInfo : addEscalationLevelInfo}
                headerImage={InventoryBlue}
                headerText="Escalation Level"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>

    </Row>
  );
};

AddEscalationLevel.propTypes = {
  closeModal: PropTypes.func.isRequired,
  closeAddModal: PropTypes.func.isRequired,
  selectedUser: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.array.isRequired,
};

export default AddEscalationLevel;
