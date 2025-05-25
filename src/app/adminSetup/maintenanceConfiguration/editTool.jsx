/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Label,
  Col,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';

import { InputField, CheckboxFieldGroup } from '@shared/formFields';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  updateTool,
} from './maintenanceService';
import validationSchema from './toolFormModel/validationSchema';
import toolFormModel from './toolFormModel/toolFormModel';
import formInitialValues from './toolFormModel/formInitialValues';
import {
  noSpecialChars,
  decimalKeyPress,
  trimJsonObject,
} from '../../util/appUtils';
import theme from '../../util/materialTheme';

const { formId, formField } = toolFormModel;

const appModels = require('../../util/appModels').default;

const EditTool = (props) => {
  const {
    editData,
    afterReset,
  } = props;
  const dispatch = useDispatch();

  const {
    updateToolInfo,
  } = useSelector((state) => state.maintenance);

  function handleSubmit(values) {
    const isActive = values.active === 'yes';
    const postData = {
      name: values.name,
      tool_cost_unit: values.tool_cost_unit,
      active: isActive,
    };
    dispatch(updateTool(editData ? editData.id : false, appModels.TOOL, postData));
  }

  function getStatusInfo(values, setFieldValue) {
    let isBookAllowed = editData && editData.active ? 'yes' : 'no';

    if (values && values.active !== 'yes' && values.active !== 'no') {
      setFieldValue('active', isBookAllowed);
    }

    if (values && values.active === 'yes') {
      isBookAllowed = 'yes';
    }

    if (values && values.active === 'no') {
      isBookAllowed = 'no';
    }

    return isBookAllowed;
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={editData ? trimJsonObject(editData) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, values, setFieldValue,
          }) => (
            <Form id={formId}>
              {(updateToolInfo && updateToolInfo.data) ? ('') : (
                <ThemeProvider theme={theme}>
                  <Row className="ml-5 mr-5">
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.nameValue.name}
                        label={formField.nameValue.label}
                        isRequired={formField.nameValue.required}
                        placeholder={formField.nameValue.label}
                        type="text"
                        maxLength="50"
                        onKeyPress={noSpecialChars}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.toolCostUnit.name}
                        label={formField.toolCostUnit.label}
                        placeholder={formField.toolCostUnit.label}
                        isRequired={formField.toolCostUnit.required}
                        type="text"
                        maxLength="5"
                        onKeyPress={decimalKeyPress}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <Label for="Status" className="m-0">
                        Status
                        <span className="ml-1 text-danger" />
                      </Label>
                      <br />
                      <CheckboxFieldGroup
                        name="active"
                        checkedvalue="yes"
                        customvalue={getStatusInfo(values, setFieldValue)}
                        id="yes"
                        label="Active"
                      />
                      <CheckboxFieldGroup
                        name="active"
                        checkedvalue="no"
                        customvalue={getStatusInfo(values, setFieldValue)}
                        id="no"
                        label="Inactive"
                      />
                    </Col>
                  </Row>
                </ThemeProvider>
              )}
              {updateToolInfo && updateToolInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {(updateToolInfo && updateToolInfo.err) && (
              <SuccessAndErrorFormat response={updateToolInfo} />
              )}
              {(updateToolInfo && updateToolInfo.data) && (
              <SuccessAndErrorFormat response={updateToolInfo} successMessage="Tool updated successfully.." />
              )}
              <hr />
              <div className="float-right">
                {(updateToolInfo && !updateToolInfo.data) && (
                <Button
                  disabled={!(isValid)}
                  type="submit"
                  size="sm"
                   variant="contained"
                >
                  Update
                </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
        {(updateToolInfo && updateToolInfo.data) && (
        <div className="float-right">
          <Button
            type="button"
            size="sm"
            onClick={afterReset}
             variant="contained"
          >
            Ok
          </Button>
        </div>
        )}
      </Col>
    </Row>
  );
};

EditTool.propTypes = {
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
};

export default EditTool;
