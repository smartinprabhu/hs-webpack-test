/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import {
  Dialog, DialogContent, DialogContentText, Button,
} from '@mui/material';

import DialogHeader from '../../../commonComponents/dialogHeader';
import validationSchema from '../../configuration/formModel/pageValidationSchema';
import checkoutFormModel from '../../configuration/formModel/checkoutFormModel';
import formInitialValues from '../../configuration/formModel/pageFormInitialValues';

import {
  trimJsonObject, getDefaultNoValue,
} from '../../../util/appUtils'; 
import MuiTextField from '../../../commonComponents/formFields/muiTextField';

const appModels = require('../../../util/appModels').default;

const { formField } = checkoutFormModel;

const AddPage = (props) => {
  const {
    pageModal, editId, editData, atFinish, systemId, questionValues, setQuestions,
  } = props;
  const dispatch = useDispatch();
  const [model, setmodel] = useState(pageModal);

  const toggle = () => {
    setmodel(!model);
    atFinish();
  };

  const generatePassword = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
    let password = '';
    while (password.length < length) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      if (!password.includes(char)) {
        password += char;
      }
    }
    return password;
  };

  function handleSubmit(values) {
    if (editId) {
      if (atFinish) atFinish();
    } else {
      const pageTitle = values.title;

      const pageData = {
        id: null,
        answer_type: null, // Replace with actual value if available
        remarks: null, // Replace with actual value if available
        answer_common: null, // Replace with actual value if available
        mro_quest_grp_id: null, // Replace with actual value if available
        achieved_score: null, // Replace with actual value if available
        page_id: {
          id: generatePassword(5),
          title: pageTitle,
        },
        mro_activity_id: {
          id: null,
          name: null,
          applicable_score: null,
          applicable_standard_ids: [],
          helper_text: null,
          procedure: null,
          sequence: 100,
        },
      };
      setQuestions([...questionValues, ...[pageData]]); 
      if (atFinish) atFinish();
    }
  }

  return (
    <Dialog size="md" fullWidth open={model}>
      <DialogHeader title={!editId ? 'Create New' : 'Update'} onClose={() => { toggle(); }} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">

          <Formik
            enableReinitialize
            initialValues={(editId || editData) ? trimJsonObject(editData) : formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isValid, setFieldValue,
            }) => (
              <Form id="pageForm">
                <MuiTextField
                  name={formField.pageTitle.name}
                  label={formField.pageTitle.label}
                  isRequired
                  setFieldValue={setFieldValue}
                  formGroupClassName="m-1"
                  type="text"
                  inputProps={{ maxLength: 30 }}
                  sx={{ padding: '10px', marginBottom: '20px' }}
                />

                <div className="float-right">
                  <Button
                    disabled={!(isValid)}
                    type="submit"
                    size="sm"
                    variant="contained"
                  >
                    Confirm
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

AddPage.propTypes = {
  pageModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};

export default AddPage;
