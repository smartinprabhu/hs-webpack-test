/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import * as PropTypes from 'prop-types';
import {
  Dialog, DialogContent, DialogContentText, Button,
} from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import { createHxQuestionGroup, resetHxQuestionGroup } from '../../auditService';

import DialogHeader from '../../../commonComponents/dialogHeader';

import MuiTextField from '../../../commonComponents/formFields/muiTextField';

const AddQuestionGroup = (props) => {
  const {
    addModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [model, setmodel] = useState(addModal);

  const { createQtnGroupInfo } = useSelector((state) => state.hxAudits);

  const toggle = () => {
    dispatch(resetHxQuestionGroup());
    setmodel(!model);
    atFinish();
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .nullable()
      .required('Title is Required'),
  });

  function handleSubmit(values) {
    const postData = {
      name: values.name,
    };
    const payload = { model: 'survey.question_group', values: postData };
    dispatch(createHxQuestionGroup('survey.question_group', payload));
  }

  const formInitialValues = {
    name: '',
  };

  return (
    <Dialog size="md" fullWidth open={model}>
      <DialogHeader title="Create New Section" onClose={() => { toggle(); }} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {createQtnGroupInfo && !createQtnGroupInfo.data && !createQtnGroupInfo.loading && (
          <Formik
            enableReinitialize
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isValid, setFieldValue,
            }) => (
              <Form id="qtnGroupForm">
                <MuiTextField
                  name="name"
                  label="Title"
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
                    Create
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          )}
          <div className="justify-content-center">
            {createQtnGroupInfo && createQtnGroupInfo.data && (
            <SuccessAndErrorFormat response={createQtnGroupInfo} successMessage="The Question Group has been published successfully.." />
            )}
            {createQtnGroupInfo && createQtnGroupInfo.err && (
            <SuccessAndErrorFormat response={createQtnGroupInfo} />
            )}
            {createQtnGroupInfo && createQtnGroupInfo.loading && (
            <div className="mt-4" data-testid="loading-case">
              <Loader />
            </div>
            )}
          </div>
          {createQtnGroupInfo && createQtnGroupInfo.data && (
            <div className="float-right mt-2">
              <Button
                type="button"
                size="sm"
                onClick={() => toggle()}
                variant="contained"
              >
                Ok
              </Button>
            </div>
          )}

        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

AddQuestionGroup.propTypes = {
  addModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};

export default AddQuestionGroup;
