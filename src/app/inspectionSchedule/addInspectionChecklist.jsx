/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
import {
  Row, Col,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import { Button, Divider, FormControl } from "@mui/material";
import { Box } from "@mui/system";

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import BasicForm from './forms/RequestorForm';
import ScheduleForm from './forms/scheduleForm';
import InspectionIcon from '@images/sideNavImages/inspection_black.svg';

// import PpmDetails from './forms/ppmDetails';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  updatePPMScheduler, resetUpdateScheduler, getSelectedEquipmentRows,
} from '../preventiveMaintenance/ppmService';
import {
  createInspection,
} from './inspectionService';
import {
  getCheckedRows, resetEquipmentExport,
} from '../assets/equipmentService';
import useStyles from '../preventiveMaintenance/styles';
import { setCurrentTab } from '../adminSetup/setupService';
import PreviewInspectionSchedule from './previewScreen/previewInspectionSchedule';
import {
  trimJsonObject, extractValueObjects, getAllowedCompanies,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

function renderStepContent(step, setFieldValue, setFieldTouched, reload, editId) {
  switch (step) {
    case 0:
      return (
        <Row>
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue">
            <BasicForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} setFieldTouched={setFieldTouched} />
            <ScheduleForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} />
          </Col>
        </Row>
      );
    case 1:
      return (
        <Row>
          <Col lg="12">
            <PreviewInspectionSchedule setFieldValue={setFieldValue} />
          </Col>
        </Row>
      );
    default:
  }
}

const AddInspectionChecklist = (props) => {
  const {
    editId, setEditLink, setAddLink, afterReset,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [reload, setReload] = useState('1');
  const currentValidationSchema = validationSchema[activeStep];
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const {
    updatePpmSchedulerInfo,
  } = useSelector((state) => state.ppm);

  const {
    inspectionSchedulerDetail, addInspectionScheduleInfo,
  } = useSelector((state) => state.inspection);

  const { userInfo } = useSelector((state) => state.user);

  const companies = getAllowedCompanies(userInfo);

  // let steps = ['Inspection Checklist', 'Summary'];
  let steps = ['Inspection Checklist'];

  if (editId) {
    steps = ['Inspection Checklist'];
  }

  const isLastStep = activeStep === steps.length - 1;

  useEffect(() => {
    dispatch(resetUpdateScheduler());
  }, []);

  async function submitForm(values, actions) {
    if (editId && inspectionSchedulerDetail && inspectionSchedulerDetail.data) {
      setIsOpenSuccessAndErrorModalWindow(true);

      const categoryType = values.category_type && values.category_type.value ? values.category_type.value : false;

      let equipment = extractValueObjects(values.equipment_id);
      let space = extractValueObjects(values.space_id);

      if (categoryType === 'Space') {
        equipment = false;
      }
      if (categoryType === 'Equipment') {
        space = false;
      }
      const postData = {
        duration: parseFloat(values.duration),
        starts_at: parseFloat(values.starts_at),
        remind_before: parseFloat(values.remind_before),
        mo: values.mo,
        tu: values.tu,
        we: values.we,
        th: values.th,
        fr: values.fr,
        sa: values.sa,
        su: values.su,
        at_start_mro: values.at_start_mro,
        at_done_mro: values.at_done_mro,
        at_review_mro: values.at_review_mro,
        enforce_time: values.enforce_time,
        is_allow_future: values.is_allow_future,
        is_allow_past: values.is_allow_past,
        nfc_scan_at_start: values.nfc_scan_at_start,
        nfc_scan_at_done: values.nfc_scan_at_done,
        qr_scan_at_start: values.qr_scan_at_start,
        qr_scan_at_done: values.qr_scan_at_done,
        is_exclude_holidays: values.is_exclude_holidays,
        is_missed_alert: values.is_missed_alert,
        commences_on: values.commences_on ? moment(values.commences_on.$d).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        ends_on: values.ends_on ? moment(values.ends_on.$d).utc().format('YYYY-MM-DD HH:mm:ss') : false,
        maintenance_team_id: extractValueObjects(values.maintenance_team_id),
        task_id: extractValueObjects(values.task_id),
        group_id: extractValueObjects(values.group_id),
        check_list_id: extractValueObjects(values.check_list_id),
        equipment_id: equipment,
        space_id: space,
        parent_id: extractValueObjects(values.parent_id),
        recipients_id: extractValueObjects(values.recipients_id),
        category_type: extractValueObjects(values.category_type),
        priority: extractValueObjects(values.priority),
        description: values.description,
      };
      dispatch(updatePPMScheduler(editId, appModels.INSPECTIONCHECKLIST, postData));
      dispatch(setCurrentTab('Inspection Checklist'));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const group = values.group_id.id;
      const categoryType = values.category_type && values.category_type.value ? values.category_type.value : false;
      let equipment = values.equipment_id.id;
      let space = values.space_id.id;
      const parentSchedule = values.parent_id.id;
      const companyId = companies;
      const maintenanceTeamId = values.maintenance_team_id.id;
      const taskId = values.task_id.id;
      const checklistId = values.check_list_id.id;
      const recipientsId = values.recipients_id.id;
      const commencesOn = values.commences_on ? moment(values.commences_on.$d).utc().format('YYYY-MM-DD HH:mm:ss') : false;
      const endsOn = values.ends_on ? moment(values.ends_on.$d).utc().format('YYYY-MM-DD HH:mm:ss') : false;
      const priority = values.priority && values.priority.value ? values.priority.value : false;

      const postData = { ...values };

      if (categoryType === 'Space') {
        equipment = false;
      }
      if (categoryType === 'Equipment') {
        space = false;
      }

      postData.group_id = group;
      postData.category_type = categoryType;
      postData.company_id = companyId;
      postData.equipment_id = equipment;
      postData.space_id = space;
      postData.parent_id = parentSchedule;
      postData.maintenance_team_id = maintenanceTeamId;
      postData.task_id = taskId;
      postData.check_list_id = checklistId;
      postData.recipients_id = recipientsId;
      postData.priority = priority;
      postData.commences_on = commencesOn;
      postData.ends_on = endsOn;

      actions.setSubmitting(true);
      const payload = { model: appModels.INSPECTIONCHECKLIST, values: postData };
      const createReq = await createInspection(payload);
      dispatch(createReq);
      dispatch(setCurrentTab('Inspection Checklist'));
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
    setEditLink(false);
    setAddLink(false);
    setIsOpenSuccessAndErrorModalWindow(false);
    dispatch(resetEquipmentExport());
    dispatch(getSelectedEquipmentRows([]));
    dispatch(getCheckedRows(null));
    dispatch(setCurrentTab('Inspection Checklist'));
  };

  const handleReset = (resetForm) => {
    resetForm();
    setEditLink();
    setAddLink();
    setIsOpenSuccessAndErrorModalWindow(false);
    dispatch(resetEquipmentExport());
    dispatch(getSelectedEquipmentRows([]));
    dispatch(getCheckedRows(null));
    dispatch(setCurrentTab('Inspection Checklist'));
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  // eslint-disable-next-line no-lone-blocks
  { /* if (closeMaintenance && history.location && history.location.state && history.location.state.referrer) {
    switch (history.location.state.referrer) {
      case 'preventive-schedule':
        return (
          <Redirect to={{
            pathname: '/preventive-schedule',
          }}
          />
        );
      case 'inspection-schedule':
        return (
          <Redirect to={{
            pathname: '/inspection-schedule',
          }}
          />
        );
      case 'maintenance-configuration':
        return (
          <Redirect to={{
            pathname: '/maintenance-configuration',
          }}
          />
        );
      default:
        return (
          <Redirect to={{
            pathname: '/',
          }}
          />
        );
    }
  } */ }

  // const headingTxtAdd = isLastStep ? 'Summary' : 'Inspection Checklist';
  // const headingTxtAdd = 'Inspection Checklist';

  // const subHeadingTextAdd = isLastStep ? 'Please check the information before submit' : 'Please enter the required information';
  // const subHeadingTextAdd = 'Please enter the required information';

  // const headingTxt = editId ? 'Update Inspection Checklist' : headingTxtAdd;

  // const subHeadingText = editId ? 'Please check the information before update' : subHeadingTextAdd;

  return (

    <>
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
      <Formik
        initialValues={editId && inspectionSchedulerDetail && inspectionSchedulerDetail.data && inspectionSchedulerDetail.data.length > 0 ? trimJsonObject(inspectionSchedulerDetail.data[0]) : formInitialValues}
        validationSchema={currentValidationSchema}
        // eslint-disable-next-line react/jsx-no-bind
        onSubmit={handleSubmit}
      >
        {({
          isValid, dirty, setFieldValue, setFieldTouched, resetForm,
        }) => (
          <Form id={formId}>
            <Box
              sx={{
                padding: "0px 0px 0px 20px",
                width: "100%",
              }}
            >
              <FormControl
                sx={{
                  width: "100%",
                  padding: "10px 0px 20px 10px",
                  maxHeight: '600px',
                  overflowY: 'scroll',
                  borderTop: '1px solid #0000001f',
                  overflowX: 'hidden'
                }}
              >
                {renderStepContent(activeStep, setFieldValue, setFieldTouched, reload, editId)}
              </FormControl>
              <Divider style={{ marginBottom: '10px', marginTop: '10px' }} />
              <div className={activeStep !== steps.length ? 'float-right mr-4' : 'text-center'}>
                {activeStep !== 0 && (activeStep !== steps.length || addInspectionScheduleInfo.err) ? (
                  // eslint-disable-next-line react/jsx-no-bind
                  <Button onClick={handleBack} color={activeStep !== steps.length ? 'back' : 'secondary'} className={classes.button}>
                    Back
                  </Button>
                ) : (<span />)}
              </div>
              {activeStep !== steps.length && (
                <Box sx={{ float: 'right', marginRight: '46px' }}>
                  {isLastStep && (
                    <Button
                      type="submit"
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      variant='contained'
                    >
                      {editId ? 'Update' : 'Create'}
                    </Button>
                  )}
                  {!isLastStep && (
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !(isValid)}
                      variant='contained'
                    >
                      Next
                    </Button>
                  )}
                </Box>
              )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updatePpmSchedulerInfo : addInspectionScheduleInfo}
                headerImage={InspectionIcon}
                headerText="Inspection Checklist"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
};

AddInspectionChecklist.defaultProps = {
  editId: false,
  setAddLink: () => { },
  setEditLink: () => { },
};

AddInspectionChecklist.propTypes = {
  //afterReset: PropTypes.func.isRequired,
  setEditLink: PropTypes.func,
  setAddLink: PropTypes.func,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

export default AddInspectionChecklist;
