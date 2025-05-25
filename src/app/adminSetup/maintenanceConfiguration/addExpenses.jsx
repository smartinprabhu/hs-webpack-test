/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
import {
  CardBody,
  Row, Col,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import * as PropTypes from 'prop-types';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import predictiveMaintenance from '@images/icons/preventiveMaintenance.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import BasicForm from './forms/basicForm';
import ExpenseForm from './forms/expenseForm';
// import ScheduleForm from './forms/scheduleForm';
// import PpmDetails from './forms/ppmDetails';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createExpenses, updateExpenses, resetExpenses,
} from './maintenanceService';
import useStyles from '../../preventiveMaintenance/styles';
import { setCurrentTab } from '../setupService';
import PreviewInspectionSchedule from '../../preventiveMaintenance/previewScreen/previewPpmSchedule';
import {
  trimJsonObject, generateErrorMessage, extractValueObjects, getAllowedCompanies,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

function renderStepContent(step, setFieldValue, setFieldTouched, reload, editId) {
  switch (step) {
    case 0:
      return (
        <Row className="pl-1 pt-0 pr-0 mr-0 ml-0">
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue pt-0 ml-0 pr-0">
            <BasicForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} />
            {/* <ScheduleForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} /> */}
          </Col>
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue pt-0 ml-0 pr-0">
            <ExpenseForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} />
          </Col>
        </Row>
      );
    case 1:
      return (
        <Row className="comments-list thin-scrollbar pl-0 pt-0 pr-0 mr-0 ml-0">
          <Col lg="12">
            <PreviewInspectionSchedule setFieldValue={setFieldValue} />
          </Col>
        </Row>
      );
    default:
  }
}

const AddExpenses = (props) => {
  const {
    match, editIds, setAddLink, isDrawer, setEditLink, setListEditLink,
  } = props;
  const { params } = match;
  const editId = params && params.editId ? params.editId : editIds;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [reload, setReload] = useState('1');
  const currentValidationSchema = validationSchema[activeStep];
  const [closeMaintenance, setCloseMaintenance] = useState(false);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const { expensesDetailInfo, addExpensesInfo, updateExpensesInfo } = useSelector((state) => state.maintenance);

  const { userInfo } = useSelector((state) => state.user);

  const companies = getAllowedCompanies(userInfo);

  // let steps = ['Operational Expenses Checklist', 'Summary'];
  let steps = ['Operational Expenses'];

  if (editId) {
    steps = ['Operational Expenses'];
  }

  const isLastStep = activeStep === steps.length - 1;

  const onReset = () => {
    dispatch(resetExpenses());
  };

  useEffect(() => {
    onReset();
  }, []);

  useEffect(() => {
    setAddLink(false);
  }, [closeMaintenance]);

  async function submitForm(values, actions) {
    if (editId && expensesDetailInfo && expensesDetailInfo.data) {
      setIsOpenSuccessAndErrorModalWindow(true);

      const postData = {
        name: values.name,
        consumption: values.consumption,
        unit_cost: values.unit_cost,
        total_cost: values.total_cost,
        from_date: values.from_date ? moment(values.from_date).utc().format('MM/DD/YYYY HH:mm:ss') : false,
        to_date: values.to_date ? moment(values.to_date).utc().format('MM/DD/YYYY HH:mm:ss') : false,
        type_id: extractValueObjects(values.type_id),
        equipment_id: extractValueObjects(values.equipment_id),
        item_id: extractValueObjects(values.item_id),
        description: values.description,
      };
      dispatch(updateExpenses(editId, appModels.OPERATIONALEXPANSES, postData));
      dispatch(setCurrentTab('Operational Expenses'));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const typeId = values.type_id.id;
      const title = values.name;
      const equipmentId = values.equipment_id.id;
      const companyId = companies;
      const subType = values.item_id.id;
      const consumptionCost = values.consumption;
      const unitCost = values.unit_cost;
      const totalCost = values.total_cost;
      const descriptionValue = values.description;

      const fromDate = values.from_date ? moment(values.from_date).utc().format('MM/DD/YYYY HH:mm:ss') : false;
      const toDate = values.to_date ? moment(values.to_date).utc().format('MM/DD/YYYY HH:mm:ss') : false;

      const postData = { ...values };

      postData.type_id = typeId;
      postData.name = title;
      postData.company_id = companyId;
      postData.equipment_id = equipmentId;
      postData.consumption = consumptionCost;
      postData.unit_cost = unitCost;
      postData.total_cost = totalCost;
      postData.item_id = subType;
      postData.from_date = fromDate;
      postData.to_date = toDate;
      postData.description = descriptionValue;
      actions.setSubmitting(true);
      const payload = { model: appModels.OPERATIONALEXPANSES, values: postData };
      const createReq = await createExpenses(payload);
      dispatch(createReq);
      dispatch(setCurrentTab('Operational Expenses'));
      actions.setSubmitting(false);
    }
  }

  function handleSubmit(values, actions) {
    if (isLastStep) {
      submitForm(values, actions);
    } else {
      setActiveStep(activeStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  function handleBack() {
    setActiveStep(activeStep - 1);
    setReload('0');
  }

  const closeAddMaintenance = () => {
    dispatch(resetExpenses());
    setAddLink(false);
    setEditLink(false);
    setListEditLink(false);
    dispatch(setCurrentTab('Operational Expenses'));
    setCloseMaintenance(true);
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  // const headingTxtAdd = isLastStep ? 'Summary' : 'Operational Expenses Checklist';
  // const headingTxtAdd = 'Operational Expenses';

  // const subHeadingTextAdd = isLastStep ? 'Please check the information before submit' : 'Please enter the required information';
  // const subHeadingTextAdd = 'Please enter the required information';

  // const headingTxt = editId ? 'Update Operational Expenses' : headingTxtAdd;

  // const subHeadingText = editId ? 'Please check the information before update' : subHeadingTextAdd;

  let rowStyle = 'ml-1 mr-1 mt-2 mb-2 p-3';

  if (isDrawer) {
    rowStyle = 'audits-list h-100 thin-scrollbar pl-0 pr-0';
  } else if (!isDrawer) {
    rowStyle = '';
  }

  return (

    <Row className={rowStyle}>
      <Col sm="12" md="12" lg="12" xs="12">
        <div className="p-1">
          <CardBody>
            {/* {activeStep !== steps.length && (
              <>
                <Row className="mb-0">
                  <Col md={6} sm={6} lg={6} xs={7} className="pr-0">
                    <Row>
                      <Col md={1} sm={1} lg={1} xs={12}>
                        <img src={predictiveMaintenance} className="mr-2" alt="ppm" height="30" width="30" />
                      </Col>
                      <Col md={10} sm={10} lg={10} xs={12}>
                        <h4 className="mb-0">
                          {headingTxt}
                        </h4>
                        <p className="tab_nav_link">
                          <span className="font-weight-300">{subHeadingText}</span>
                        </p>
                      </Col>
                    </Row>

                  </Col>
                  <Col md={6} sm={6} lg={6} xs={12} className="p-0">
                    <span className="text-right desktop-view">
                      <Button  variant="contained" size="sm" onClick={closeAddMaintenance} className="hoverColor bg-white pb-1 pt-1 tab_nav_link rounded-pill float-right mb-1">
                        <span>Cancel </span>
                        <FontAwesomeIcon className="ml-2" size="sm" icon={faTimesCircle} />
                      </Button>
                    </span>
                  </Col>
                </Row>
                <hr className="mt-0" />
              </>
            )} */}
            <>
              {(editId && (expensesDetailInfo.loading || expensesDetailInfo.err)) ? (
                <>
                  <div />
                  <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                    {expensesDetailInfo && expensesDetailInfo.loading && (
                      <Loader />
                    )}

                    {expensesDetailInfo && expensesDetailInfo.err && (
                      <ErrorContent errorTxt={generateErrorMessage(expensesDetailInfo)} />
                    )}
                  </div>
                </>
              ) : (
                <Formik
                  initialValues={editId && expensesDetailInfo && expensesDetailInfo.data ? trimJsonObject(expensesDetailInfo.data[0]) : formInitialValues}
                  enableReinitialize
                  validationSchema={currentValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    isValid, dirty, setFieldValue, setFieldTouched,
                  }) => (
                    <Form id={formId}>
                      {renderStepContent(activeStep, setFieldValue, setFieldTouched, reload, editId)}

                      <div className={activeStep !== steps.length ? 'float-right' : 'text-center'}>
                        {activeStep !== 0 && (activeStep !== steps.length || addExpensesInfo.err) ? (
                          <Button  variant="contained" onClick={handleBack} color={activeStep !== steps.length ? 'back' : 'secondary'} className={classes.button}>
                            Back
                          </Button>
                        ) : (<span />)}
                        {activeStep !== steps.length && (
                          <>
                            {isLastStep && (
                            <Button
                              type="submit"
                              disabled={!editId ? !(isValid && dirty) : !isValid}
                               variant="contained"
                              className={classes.button}
                            >
                              {editId ? 'Update' : 'Save'}
                            </Button>
                            )}
                            {!isLastStep && (
                            <Button
                              disabled={!editId ? !(isValid && dirty) : !(isValid)}
                               variant="contained"
                              className={classes.button}
                            >
                              Next
                            </Button>
                            )}
                          </>

                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </>
          </CardBody>
        </div>
      </Col>
      <SuccessAndErrorModalWindow
        isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
        setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
        type={editId ? 'update' : 'create'}
        successOrErrorData={editId ? updateExpensesInfo : addExpensesInfo}
        headerImage={predictiveMaintenance}
        headerText="Operational Expenses"
        successRedirect={closeAddMaintenance}
      />
    </Row>
  );
};

AddExpenses.defaultProps = {
  match: false,
  editIds: false,
  setAddLink: () => { },
  setEditLink: () => { },
  setListEditLink: () => { },
};

AddExpenses.propTypes = {
  setAddLink: PropTypes.func,
  setEditLink: PropTypes.func,
  setListEditLink: PropTypes.func,
  match: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  editIds: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  isDrawer: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AddExpenses;
