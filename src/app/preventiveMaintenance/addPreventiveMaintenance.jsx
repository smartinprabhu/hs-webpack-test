/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
import {
  Button, CardBody,
  Row, Col,
} from 'reactstrap';
import { useHistory, Redirect } from 'react-router-dom';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import * as PropTypes from 'prop-types';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import predictiveMaintenance from '@images/icons/preventiveMaintenance.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import RequestorForm from './forms/requestorForm';
import ScheduleForm from './forms/scheduleForm';
import EquipmentForm from './forms/equipmentForm';
import PpmDetails from './forms/ppmDetails';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createPreventive, updatePPMScheduler, resetUpdateScheduler, getSelectedEquipmentRows,
} from './ppmService';
import {
  getCheckedRows, resetEquipmentExport,
} from '../assets/equipmentService';
import useStyles from './styles';
import { setCurrentTab } from '../adminSetup/setupService';
import PreviewPpmSchedule from './previewScreen/previewPpmSchedule';
import {
  getColumnArrayById, trimJsonObject, generateErrorMessage, extractValueObjects,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

function renderStepContent(step, setFieldValue, setFieldTouched, reload, editId) {
  switch (step) {
    case 0:
      return (
        <Row>
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue"><RequestorForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} /></Col>
          <Col xs={12} sm={12} lg={12} md={12} className="mt-2 mb-2" />
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue"><PpmDetails formField={formField} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} editId={editId} /></Col>
          <Col xs={12} sm={12} lg={12} md={12} className="mt-2 mb-2" />
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue"><ScheduleForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} editId={editId} /></Col>
          <Col xs={12} sm={12} lg={12} md={12} className="mt-2 mb-2" />
          <Col xs={12} sm={12} lg={12} md={12}><EquipmentForm formField={formField} editId={editId} setFieldValue={setFieldValue} /></Col>
        </Row>
      );
    case 1:
      return (
        <Row>
          <Col lg="12">
            <PreviewPpmSchedule setFieldValue={setFieldValue} />
          </Col>
        </Row>
      );
    default:
  }
}

const AddPreventiveMaintenance = (props) => {
  const {
    editId, setEditLink, setAddLink,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [reload, setReload] = useState('1');
  const currentValidationSchema = validationSchema[activeStep];
  const [closeMaintenance, setCloseMaintenance] = useState(false);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const history = useHistory();
  const {
    addPreventiveInfo, ppmDetail, updatePpmSchedulerInfo,
    spacesSelectedList,
  } = useSelector((state) => state.ppm);

  const {
    equipmentRows,
  } = useSelector((state) => state.equipment);

  let steps = ['PPM Information', 'Summary'];

  if (editId) {
    steps = ['PPM Information'];
  }

  const isLastStep = activeStep === steps.length - 1;

  useEffect(() => {
    dispatch(resetUpdateScheduler());
  }, []);

  async function submitForm(values, actions) {
    if (editId && ppmDetail && ppmDetail.data) {
      setIsOpenSuccessAndErrorModalWindow(true);
      let equipmentIds = values.equipment_ids && values.equipment_ids.length > 0 ? [[6, 0, values.equipment_ids]] : false;
      let locationIds = values.location_ids && values.location_ids.length > 0 ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : false;
      const categoryType = extractValueObjects(values.category_type);

      if (categoryType === 'ah') {
        equipmentIds = false;
      } else {
        locationIds = [6, 0, []];
      }

      const postData = {
        name: values.name,
        description: values.name,
        duration: parseFloat(values.duration),
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
        recurrency: values.recurrency,
        interval: values.interval,
        day: values.day,
        enforce_time: values.enforce_time,
        nfc_scan_at_start: values.nfc_scan_at_start,
        nfc_scan_at_done: values.nfc_scan_at_done,
        qr_scan_at_start: values.qr_scan_at_start,
        qr_scan_at_done: values.qr_scan_at_done,
        start_datetime: moment(values.start_datetime).utc().format('YYYY-MM-DD HH:mm:ss'),
        stop_datetime: moment(values.stop_datetime).utc().format('YYYY-MM-DD HH:mm:ss'),
        is_all_records: !!(values.is_all_records && values.is_all_records === 'all'),
        asset_category_id: extractValueObjects(values.asset_category_id),
        category_id: extractValueObjects(values.category_id),
        scheduler_operation_type: extractValueObjects(values.scheduler_operation_type),
        sla_score_type: extractValueObjects(values.sla_score_type),
        maintenance_team_id: extractValueObjects(values.maintenance_team_id),
        task_id: extractValueObjects(values.task_id),
        category_type: extractValueObjects(values.category_type),
        priority: extractValueObjects(values.priority),
        ppm_by: extractValueObjects(values.ppm_by),
        time_period: extractValueObjects(values.time_period),
        rrule_type: extractValueObjects(values.rrule_type),
        month_by: extractValueObjects(values.month_by),
        byday: extractValueObjects(values.byday),
        week_list: extractValueObjects(values.week_list),
        equipment_ids: equipmentIds,
        location_ids: locationIds,
      };
      dispatch(updatePPMScheduler(editId, appModels.PPMCALENDAR, postData));
      dispatch(setCurrentTab('PPM Schedule'));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const assetCategory = values.asset_category_id.id;
      const equipmentCategory = values.category_id.id;
      const maintenanceTeamId = values.maintenance_team_id.id;
      const taskId = values.task_id.id;
      const startDatetime = moment(values.start_datetime).utc().format('YYYY-MM-DD HH:mm:ss');
      const stopDatetime = moment(values.stop_datetime).utc().format('YYYY-MM-DD HH:mm:ss');
      const categoryType = values.category_type && values.category_type.value ? values.category_type.value : false;
      const priority = values.priority && values.priority.value ? values.priority.value : false;
      const PPMBy = values.ppm_by && values.ppm_by.value ? values.ppm_by.value : false;
      const timePeriod = values.time_period && values.time_period.value ? values.time_period.value : false;
      const SchedulerOperationType = values.scheduler_operation_type && values.scheduler_operation_type.value ? values.scheduler_operation_type.value : false;
      const ScoreType = values.sla_score_type && values.sla_score_type.value ? values.sla_score_type.value : false;
      const allRecords = !!(values.is_all_records && values.is_all_records === 'all');
      const ruleType = values.rrule_type && values.rrule_type.value ? values.rrule_type.value : false;
      const monthBy = values.month_by && values.month_by.value ? values.month_by.value : false;
      const byDay = values.byday && values.byday.value ? values.byday.value : false;
      const weekList = values.week_list && values.week_list.value ? values.week_list.value : false;
      let equipmentIds = values.equipment_ids && values.equipment_ids.length > 0 ? [[6, 0, values.equipment_ids]] : false;
      let locationIds = values.location_ids && values.location_ids.length > 0 ? [[6, 0, getColumnArrayById(values.location_ids, 'id')]] : false;
      const descriptionValue = values.name;

      const postData = { ...values };

      if (categoryType === 'ah') {
        equipmentIds = false;
      } else {
        locationIds = [6, 0, []];
      }

      postData.asset_category_id = assetCategory;
      postData.description = descriptionValue;
      postData.category_id = equipmentCategory;
      postData.maintenance_team_id = maintenanceTeamId;
      postData.task_id = taskId;
      postData.category_type = categoryType;
      postData.priority = priority;
      postData.ppm_by = PPMBy;
      postData.time_period = timePeriod;
      postData.scheduler_operation_type = SchedulerOperationType;
      postData.sla_score_type = ScoreType;
      postData.is_all_records = allRecords;
      postData.rrule_type = ruleType;
      postData.month_by = monthBy;
      postData.byday = byDay;
      postData.equipment_ids = equipmentIds;
      postData.location_ids = locationIds;
      postData.start = startDatetime;
      postData.stop = stopDatetime;
      postData.start_datetime = startDatetime;
      postData.stop_datetime = stopDatetime;
      postData.week_list = weekList;
      postData.scheduler_type = 'PPM';
      actions.setSubmitting(true);
      const payload = { model: appModels.PPMCALENDAR, values: postData };
      const createReq = await createPreventive(payload);
      dispatch(createReq);
      dispatch(setCurrentTab('PPM Schedule'));
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
    dispatch(setCurrentTab('PPM Schedule'));
    setCloseMaintenance(true);
  };

  if (closeMaintenance && history.location && history.location.state && history.location.state.referrer) {
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
  }

  const headingTxtAdd = isLastStep ? 'Summary' : 'PPM Schedule';

  const subHeadingTextAdd = isLastStep ? 'Please check the information before submit' : 'Please enter the required information';

  const headingTxt = editId ? 'Update PPM Schedule' : headingTxtAdd;

  const subHeadingText = editId ? 'Please check the information before update' : subHeadingTextAdd;

  const multipleSelected = !((equipmentRows && equipmentRows.rows && equipmentRows.rows.length > 0) || (spacesSelectedList && spacesSelectedList.data && spacesSelectedList.data.length > 0));

  const multipleSelectedOld = !((ppmDetail && ppmDetail.data && ppmDetail.data[0].location_ids && ppmDetail.data[0].location_ids.length > 0)
  || (ppmDetail && ppmDetail.data && ppmDetail.data[0].equipment_ids && ppmDetail.data[0].equipment_ids.length > 0));

  const multipleEditSelected = ((multipleSelected) || (multipleSelectedOld));

  return (

    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
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
              {(editId && (ppmDetail.loading || ppmDetail.err)) ? (
                <>
                  <div />
                  <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                    {ppmDetail && ppmDetail.loading && (
                      <Loader />
                    )}

                    {ppmDetail && ppmDetail.err && (
                      <ErrorContent errorTxt={generateErrorMessage(ppmDetail)} />
                    )}
                  </div>
                </>
              ) : (
                <Formik
                  initialValues={editId && ppmDetail && ppmDetail.data ? trimJsonObject(ppmDetail.data[0]) : formInitialValues}
                  validationSchema={currentValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    isValid, dirty, setFieldValue, setFieldTouched,
                  }) => (
                    <Form id={formId}>
                      {renderStepContent(activeStep, setFieldValue, setFieldTouched, reload, editId)}
                      <hr />
                      <div className={activeStep !== steps.length ? 'float-right' : 'text-center'}>
                        {activeStep !== 0 && (activeStep !== steps.length || addPreventiveInfo.err) ? (
                          <Button variant="contained" onClick={handleBack} color={activeStep !== steps.length ? 'back' : 'secondary'}>
                            Back
                          </Button>
                        ) : (<span />)}
                        {activeStep !== steps.length && (
                        <div className="bg-lightblue sticky-button-1250drawer">
                          {isLastStep && (
                          <Button
                            type="submit"
                            disabled={!editId ? !(isValid && dirty) || multipleSelected : !(isValid) || multipleEditSelected}
                             variant="contained"
                           // className={classes.button}
                          >
                            {editId ? 'Update' : 'Save'}
                          </Button>
                          )}
                          {!isLastStep && (
                          <Button
                            disabled={!editId ? !(isValid && dirty) : !(isValid)}
                             variant="contained"
                          >
                            Next
                          </Button>
                          )}
                        </div>

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
        successOrErrorData={editId ? updatePpmSchedulerInfo : addPreventiveInfo}
        headerImage={predictiveMaintenance}
        headerText="PPM Schedule"
        successRedirect={closeAddMaintenance}
      />
    </Row>
  );
};

AddPreventiveMaintenance.defaultProps = {
  editId: false,
  setAddLink: () => { },
  setEditLink: () => { },
};

AddPreventiveMaintenance.propTypes = {
  setEditLink: PropTypes.func,
  setAddLink: PropTypes.func,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

export default AddPreventiveMaintenance;
