/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import {
  Col,
  Row,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import JoditEditor from 'jodit-react';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { InputField, FormikAutocomplete } from '@shared/formFields';
import {
  addActivity, getActivityTypes,
} from '../../purchaseService';
import validationSchema from './formModel/validationSchema';
import scheduleFormModel from './formModel/scheduleFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  generateErrorMessage,
} from '../../../util/appUtils';
import { getEmployeeList } from '../../../assets/equipmentService';

import theme from '../../../util/materialTheme';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = scheduleFormModel;

const AddSheduleActivity = (props) => {
  const {
    detail,
    modalName,
    resModelId,
    afterReset,
  } = props;
  const dispatch = useDispatch();
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeShow, setEmployeeOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const editor = useRef(null);
  const [isEditor, showEditor] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    activityTypesInfo,
    createActivityInfo,
  } = useSelector((state) => state.purchase);
  const { employeesInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeShow) {
        await dispatch(getEmployeeList(userInfo.data.company.id, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeShow]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeOpen) {
        await dispatch(getActivityTypes(userInfo.data.company.id, appModels.MAILACTIVITYTYPES));
      }
    })();
  }, [userInfo, typeOpen]);

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  function handleSubmit(values) {
    const activityTypeId = values.activity_type_id ? values.activity_type_id.id : '';
    const userId = values.user_id && values.user_id.id
      ? values.user_id.id : false;

    const postData = { ...values };

    postData.activity_type_id = activityTypeId;
    postData.user_id = userId;
    const viewId = detail && detail.data && detail.data.length > 0 ? detail.data[0].id : '';
    postData.res_id = viewId;
    postData.res_model = modalName;
    postData.res_model_id = resModelId;
    const payload = { model: appModels.MAILACTIVITY, values: postData };
    dispatch(addActivity(appModels.MAILACTIVITY, payload));
  }

  const toggle = () => {
    afterReset();
  };

  let typesOptions = [];
  let employeeOptions = [];

  if (activityTypesInfo && activityTypesInfo.loading) {
    typesOptions = [{ name: 'Loading..' }];
  }
  if (activityTypesInfo && activityTypesInfo.data) {
    typesOptions = activityTypesInfo.data;
  }

  if (employeesInfo && employeesInfo.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (employeesInfo && employeesInfo.data) {
    employeeOptions = employeesInfo.data;
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        {createActivityInfo && createActivityInfo.loading && (
        <div className="text-center mt-3">
          <Loader />
        </div>
        )}
        {(createActivityInfo && !createActivityInfo.data && !createActivityInfo.loading) && (
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, values, errors, touched, setFieldValue,
          }) => (
            <Form id={formId}>
              <ThemeProvider theme={theme}>
                <Row className="">
                  <Col md="6" sm="6" lg="6" xs="12">
                    <Col md="12" sm="11" lg="11" xs="11">
                      <FormikAutocomplete
                        name={formField.activityTypeId.name}
                        label={formField.activityTypeId.label}
                        isRequired={formField.activityTypeId.required}
                        formGroupClassName="mb-1"
                        className="bg-white"
                        open={typeOpen}
                        size="small"
                        onOpen={() => {
                          setTypeOpen(true);
                        }}
                        onClose={() => {
                          setTypeOpen(false);
                        }}
                        loading={activityTypesInfo && activityTypesInfo.loading}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={typesOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            className="without-padding"
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {activityTypesInfo && activityTypesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(activityTypesInfo && activityTypesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(activityTypesInfo)}</span></FormHelperText>) }
                    </Col>
                    <Col md="12" sm="11" lg="11" xs="11">
                      <InputField
                        name={formField.summary.name}
                        label={formField.summary.label}
                        isRequired={formField.summary.required}
                        formGroupClassName="mb-1"
                        type="text"
                        maxLength="50"
                      />
                    </Col>
                  </Col>
                  <Col md="6" sm="6" lg="6" xs="12">
                    <Col md="12" sm="11" lg="11" xs="11">
                      <InputField
                        name={formField.dateDeadline.name}
                        label={formField.dateDeadline.label}
                        isRequired={formField.dateDeadline.required}
                        formGroupClassName="mb-1"
                        type="date"
                        min={moment(new Date()).format('YYYY-MM-DD')}
                      />
                    </Col>
                    <Col md="12" sm="11" lg="11" xs="11">
                      <FormikAutocomplete
                        name={formField.userId.name}
                        label={formField.userId.label}
                        isRequired={formField.userId.required}
                        formGroupClassName="mb-1"
                        className="bg-white"
                        open={employeeShow}
                        size="small"
                        onOpen={() => {
                          setEmployeeOpen(true);
                          setEmployeeKeyword('');
                        }}
                        onClose={() => {
                          setEmployeeOpen(false);
                          setEmployeeKeyword('');
                        }}
                        loading={employeesInfo && employeesInfo.loading}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={employeeOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onEmployeeKeywordChange}
                            variant="outlined"
                            className="without-padding"
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(employeesInfo && employeesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(employeesInfo)}</span></FormHelperText>) }
                    </Col>
                  </Col>
                  <Col md="12" sm="12" lg="12" xs="12" className="mt-3 ml-3">
                    <FormGroup className="mr-5">
                      <Label htmlFor="note">
                        Note
                        {' '}
                        <span className="text-danger">*</span>
                      </Label>
                      {!isEditor && (
                      <Input
                        type="input"
                        name={formField.Note.name}
                        value={values.note}
                        className="subjectticket bw-2 mt-0"
                        placeholder="Please provide note"
                        onClick={() => showEditor(true)}
                        onMouseLeave={() => showEditor(false)}
                      />
                      )}
                      {isEditor && (
                        <div className="mr-4">
                          <JoditEditor
                            ref={editor}
                            value={values.note}
                            onChange={(data) => setFieldValue('note', data)}
                            onBlur={(data) => setFieldValue('note', data)}
                          />
                        </div>
                      )}
                      { isEditor
                        ? ((!values.note) || (errors.note && touched.note)) && (<span className="text-danger ml-1 font-11 mt-3">Note is required</span>)
                        : ''}
                    </FormGroup>
                  </Col>
                  {(createActivityInfo && createActivityInfo.err) && (
                  <SuccessAndErrorFormat response={createActivityInfo} />
                  )}
                </Row>
                <div className="float-right mr-4">
                  <Button
                    disabled={!(isValid && dirty)}
                    type="submit"
                    size="sm"
                    variant="contained"
                  >
                    Create
                  </Button>
                </div>
              </ThemeProvider>
            </Form>
          )}
        </Formik>
        )}
        {(createActivityInfo && createActivityInfo.data) && (
        <div>
          <SuccessAndErrorFormat response={createActivityInfo} successMessage="Schedule created successfully.." />
          <hr />
          <div className="float-right mr-4">
            <Button
              type="button"
              variant="contained"
              size="sm"
              onClick={toggle}
            >
              Ok
            </Button>
          </div>
        </div>
        )}
      </Col>
    </Row>
  );
};

AddSheduleActivity.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  modalName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  resModelId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
};

export default AddSheduleActivity;
