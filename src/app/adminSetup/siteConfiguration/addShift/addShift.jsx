/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Button,
  Col,
  Row,
  Nav,
  NavLink,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';

import { InputField } from '@shared/formFields';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import validationSchema from './formModel/validationSchema';
import shiftFormModel from './formModel/shiftFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createShift,
  resetCreateShift,
  getShiftUpdate,
} from '../../setupService';
import tabs from '../data/siteConfigureData.json';
import {
  noSpecialChars,
  decimalKeyPress,
  trimJsonObject,
} from '../../../util/appUtils';
import theme from '../../../util/materialTheme';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = shiftFormModel;

const AddShift = (props) => {
  const {
    afterReset,
    editId,
  } = props;
  const dispatch = useDispatch();
  const [currentTab, setActive] = useState('Basic');

  const { userInfo } = useSelector((state) => state.user);
  const {
    createShiftInfo,
    shiftDetail,
    updateShiftInfo,
  } = useSelector((state) => state.setup);

  const onReset = () => {
    dispatch(resetCreateShift());
    if (afterReset) afterReset();
  };

  function handleSubmit(values) {
    if (editId) {
      const postData = {
        name: values.name,
        description: values.description,
        start_time: values.start_time,
        duration: values.duration,
        lc_grace: values.lc_grace,
        eg_grace: values.eg_grace,
        half_day_from: values.half_day_from,
        half_day_to: values.half_day_to,
        lt_period: values.lt_period,
      };
      dispatch(getShiftUpdate(editId, postData, appModels.SHIFT));
    } else {
      const postData = { ...values };
      postData.company_id = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
      const payload = { model: appModels.SHIFT, values: postData };
      dispatch(createShift(appModels.SHIFT, payload));
    }
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={editId && shiftDetail && shiftDetail.data ? trimJsonObject(shiftDetail.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty,
          }) => (
            <Form id={formId}>
              {(createShiftInfo && createShiftInfo.data) ? ('') : (
                <ThemeProvider theme={theme}>
                  <Nav>
                    {tabs && tabs.formTabs.map((item) => (
                      <div className="mr-5 ml-5 pl-1" key={item.id}>
                        <NavLink className="nav-link-item pt-2 pb-1 pl-1 pr-1" active={currentTab === item.name} href="#" onClick={() => setActive(item.name)}>{item.name}</NavLink>
                      </div>
                    ))}
                  </Nav>
                  <br />
                  {currentTab === 'Basic' && (
                  <Row className="ml-5 mr-5">
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.nameValue.name}
                        label={formField.nameValue.label}
                        isRequired={formField.nameValue.required}
                        type="text"
                        maxLength="2"
                        onKeyPress={noSpecialChars}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.startTime.name}
                        label={formField.startTime.label}
                        isRequired={formField.startTime.required}
                        maxLength="5"
                        type="text"
                        onKeyPress={decimalKeyPress}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="6">
                      <InputField
                        name={formField.description.name}
                        label={formField.description.label}
                        maxLength="50"
                        isRequired={formField.description.required}
                        type="text"
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.duration.name}
                        label={formField.duration.label}
                        isRequired={formField.duration.required}
                        maxLength="2"
                        type="text"
                        onKeyPress={decimalKeyPress}
                      />
                    </Col>
                  </Row>
                  )}
                  {currentTab === 'Advanced' && (
                  <Row className="ml-5 mr-5">
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.lcGrace.name}
                        label={formField.lcGrace.label}
                        isRequired={formField.lcGrace.required}
                        maxLength="5"
                        type="text"
                        onKeyPress={decimalKeyPress}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.egGrace.name}
                        label={formField.egGrace.label}
                        isRequired={formField.egGrace.required}
                        maxLength="5"
                        type="text"
                        onKeyPress={decimalKeyPress}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.halfDayFrom.name}
                        label={formField.halfDayFrom.label}
                        isRequired={formField.halfDayFrom.required}
                        maxLength="5"
                        type="text"
                        onKeyPress={decimalKeyPress}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.halfDayTo.name}
                        label={formField.halfDayTo.label}
                        isRequired={formField.halfDayTo.required}
                        maxLength="5"
                        type="text"
                        onKeyPress={decimalKeyPress}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.ltPeriod.name}
                        label={formField.ltPeriod.label}
                        maxLength="5"
                        isRequired={formField.ltPeriod.required}
                        type="text"
                        onKeyPress={decimalKeyPress}
                      />
                    </Col>
                  </Row>
                  )}
                </ThemeProvider>
              )}
              <div>
                {createShiftInfo && createShiftInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
                )}
                {(createShiftInfo && createShiftInfo.err) && (
                <SuccessAndErrorFormat response={createShiftInfo} />
                )}
                {(updateShiftInfo && updateShiftInfo.err) && (
                <SuccessAndErrorFormat response={updateShiftInfo} />
                )}
                {(createShiftInfo && createShiftInfo.data) && (
                <SuccessAndErrorFormat response={createShiftInfo} successMessage="Shift added successfully.." />
                )}
              </div>
              <hr />
              <div className="float-right">
                {(createShiftInfo && !createShiftInfo.data) && (
                  <Button
                    disabled={!editId ? !(isValid && dirty) : !isValid}
                    type="submit"
                    size="sm"
                     variant="contained"
                  >
                    {!editId ? 'Create' : 'Update'}
                  </Button>
                )}
                {(createShiftInfo && createShiftInfo.data) && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onReset()}
                   variant="contained"
                >
                  Ok
                </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddShift.propTypes = {
  afterReset: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddShift;
