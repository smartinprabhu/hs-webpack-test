/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
import {
  CardBody,
  Row, Col,
} from 'reactstrap';
import { Redirect, useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import {
  Button,
  Divider,
} from '@mui/material';

import predictiveMaintenance from '@images/sideNavImages/ppm_black.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import RequestorForm from './forms/requestorForm';
import CheckListForm from './forms/checkListForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createPreventiveChecklist, resetQuestionChecklist, getCheckListData, updatePPMChecklist, resetUpdateChecklist, activeStepInfo,
} from '../ppmService';
import useStyles from '../styles';
import {
  getArrayNewFormat, getArrayNewFormatCrud, trimJsonObject,
} from '../../util/appUtils';
// import activeStepInfo from '../../helpdesk/ticketService';
import { setCurrentTab } from '../../adminSetup/setupService';
import PreviewPpmChecklist from './previewScreen/previewPpmChecklist';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

function renderStepContent(step, setFieldValue, editId, editData) {
  switch (step) {
    case 0:
      return (
        <Row className="comments-list thin-scrollbar">
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue"><RequestorForm formField={formField} editData={editData} /></Col>
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue mt-3"><CheckListForm setFieldValue={setFieldValue} formField={formField} editId={editId} editData={editData} /></Col>
        </Row>
      );
    case 1:
      return (
        <Row className="comments-list thin-scrollbar">
          <Col lg="12">
            <PreviewPpmChecklist setFieldValue={setFieldValue} />
          </Col>
        </Row>
      );
    default:
  }
}

const AddPreventiveCheckList = (props) => {
  const {
    match, category, assetType, isInspection,
  } = props;
  const { params } = match;
  // const { editId, isWorkPermit } = params;
  const {
    editId, isWorkPermit, closeModal, afterReset, editData,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [showResponseModal] = useState(false);
  const [closeChecklist, setCloseChecklist] = useState(false);
  // const [activeStep, activeStepInfo] = useState(0);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const {
    addPreventiveChecklist, ppmCheckListData, updateCheckLisInfo, activeStep, questionChecklist,
  } = useSelector((state) => state.ppm);
  const {
    choiceOptionInfo,
  } = useSelector((state) => state.survey);
  // const {
  //   activeStep,
  // } = useSelector((state) => state.ticket);

  let steps = ['Checklist', 'Summary'];

  if (editId) {
    steps = ['Checklist'];
  }

  useEffect(() => {
    if (editData && editData.id) {
      dispatch(getCheckListData(editData.id, appModels.PPMCHECKLIST));
    }
  }, [editData]);

  const isLastStep = activeStep === steps.length - 1;

  const getArrayModify = (array) => {
    const newData = [];
    if (array.length) {
      for (let i = 0; i < array.length; i += 1) {
        const question = array[i];
        let questionGroup = question.mro_quest_grp_id;
        questionGroup = questionGroup && questionGroup.id ? questionGroup.id : false;
        question.mro_quest_grp_id = questionGroup;
        let questionReadingGroup = question.reading_id;
        questionReadingGroup = questionReadingGroup && questionReadingGroup.id ? questionReadingGroup.id : false;
        question.reading_id = questionReadingGroup;
        if (choiceOptionInfo && choiceOptionInfo.data && choiceOptionInfo.data.length) {
          question.labels_ids = getArrayNewFormat(choiceOptionInfo.data);
        }
        newData.push(question);
      }
    }
    return newData;
  };

  // useEffect(() => {
  //   dispatch(activeStepInfo(activeStep));
  // }, []);

  async function handleSubmit(values, actions) {
    if (isLastStep) {
      if (editId && ppmCheckListData && ppmCheckListData.data) {
        setIsOpenSuccessAndErrorModalWindow(true);
        const postData = {
          name: values.name,
          activity_lines: values.activity_lines && values.activity_lines.length > 0 ? getArrayNewFormatCrud(getArrayModify(values.activity_lines), ppmCheckListData.data[0].activity_lines) : false,
        };
        dispatch(updatePPMChecklist(editId, appModels.PPMCHECKLIST, postData));
        // dispatch(setCurrentTab('Checklist'));
        // showResponseModal(true);
      } else {
        setIsOpenSuccessAndErrorModalWindow(true);
        const activityLines = values.activity_lines && values.activity_lines.length > 0 ? getArrayNewFormat(getArrayModify(values.activity_lines)) : false;
        const postData = { ...values };
        postData.activity_lines = activityLines;
        postData.category_type = assetType === 'e' ? 'Equipment' : 'Space';
        if (isInspection) {
          if (assetType === 'e') {
            postData.equipment_category_id = category;
          } else {
            postData.asset_category_id = category;
          }
        }
        const payload = { model: appModels.PPMCHECKLIST, values: postData };
        dispatch(createPreventiveChecklist(payload));
        dispatch(setCurrentTab('Checklist'));
        showResponseModal(true);
      }
    } else {
      dispatch(activeStepInfo(activeStep + 1));
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  // const handleReset = (resetForm) => {
  //   resetForm();
  //   dispatch(resetQuestionChecklist());
  //   dispatch(resetAddChecklist());
  //   showResponseModal(false);
  // };

  const closeAddCheckList = () => {
    dispatch(setCurrentTab('Checklist'));
    setCloseChecklist(true);
    dispatch(resetQuestionChecklist());
    dispatch(resetUpdateChecklist());
  };

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    dispatch(setCurrentTab('Checklist'));
    // setCloseChecklist(true);
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  function handleBack() {
    dispatch(activeStepInfo(activeStep - 1));
  }

  if (closeChecklist && history.location && history.location.pathname && history.location.pathname) {
    switch (history.location.pathname) {
      case '/workpermits-configuration/add-checklist':
        return (
          <Redirect to={{
            pathname: '/workpermits-configuration',
          }}
          />
        );
      case `/maintenance-configuration/edit-checklist/${editId}`:
        return (
          <Redirect to={{
            pathname: '/maintenance-configuration',
          }}
          />
        );
      case `/workpermits-configuration/edit-checklist/${editId}`:
        return (
          <Redirect to={{
            pathname: '/workpermits-configuration',
          }}
          />
        );
      case '/maintenance-configuration/add-checklist':
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

  /* if (closeChecklist) {
    return (<Redirect to="/workpermits-configuration" />);
  } */

  const saveBtnTxt = isLastStep ? 'Submit' : 'Next';

  const headingTxtAdd = isLastStep ? 'Summary' : 'Checklist';

  const subHeadingTextAdd = isLastStep ? 'Please check the information before submit' : 'Please enter the required information';

  const btnTxt = editId ? 'Update' : saveBtnTxt;

  const headingTxt = editId ? 'Update Checklist' : headingTxtAdd;

  const subHeadingText = editId ? 'Please check the information before update' : subHeadingTextAdd;

  return (
    <div className="p-1">
      <CardBody>
        {activeStep !== steps.length && (
          <>
            {/* <Col md={6} xs={7} className="pr-0 mb-3">
              <Row>
                <Col lg={1} md={1} sm={1} xs={12} className="pl-0 mt-3">
                  <img src={predictiveMaintenance} className="mr-2" alt="ppm" height="35" width="35" />
                </Col>
                <Col lg={10} md={10} sm={10} xs={12} className="pl-0">
                  <Typography
                    sx={AddThemeColor({
                      font: 'normal normal medium 20px/24px Suisse Intl',
                      letterSpacing: '0.7px',
                      fontWeight: 600,
                      fontSize: '25px',
                    })}
                  >
                    {headingTxt}
                  </Typography>
                  <Typography className="tab_nav_link">
                    {subHeadingText}
                  </Typography>
                </Col>
              </Row>
            </Col> */}
            {/* <Col md={6} sm={6} lg={6} xs={12} className="p-0">
                    <span className="text-right desktop-view">
                      <Button  variant="contained" size="sm" onClick={closeAddCheckList} className="hoverColor bg-white pb-1 pt-1 tab_nav_link rounded-pill float-right mb-1">
                        <span>Cancel </span>
                        <FontAwesomeIcon className="ml-2" size="sm" icon={faTimesCircle} />
                      </Button>
                    </span>
                  </Col> */}
          </>
        )}
        {/* {(addPreventiveChecklist && addPreventiveChecklist.data
              && activeStep === steps.length) || (updateCheckLisInfo && updateCheckLisInfo.data) || (editId && (ppmCheckListData.loading || ppmCheckListData.err)) ? (
                <>
                  <div />
                  <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                    {ppmCheckListData && ppmCheckListData.loading && (
                      <Loader />
                    )}

                    {ppmCheckListData && ppmCheckListData.err && (
                      <ErrorContent errorTxt={generateErrorMessage(ppmCheckListData)} />
                    )}
                  </div>
                </>
              ) : ( */}
        <Formik
          enableReinitialize
          initialValues={editId && ppmCheckListData && ppmCheckListData.data ? trimJsonObject(ppmCheckListData.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, resetForm,
          }) => (
            <Form id={formId}>
              {renderStepContent(activeStep, setFieldValue, editId)}
              <Divider className="mb-2" />
              <div className="float-right sticky-button-75drawer">
                {activeStep !== 0 && (activeStep !== steps.length || addPreventiveChecklist.err) ? (
                  <Button
                    onClick={handleBack}
                    size="sm"
                    variant="contained"
                    className="mr-2"
                  >
                    Back
                  </Button>
                ) : (<span />)}
                {activeStep !== steps.length && (
                  <>
                    {isLastStep && (
                      <Button
                        type="submit"
                        disabled={!editId ? !(isValid && dirty) : false}
                        size="sm"
                        variant="contained"
                      >
                        {editId ? 'Update' : 'Submit'}
                      </Button>
                    )}
                    {!isLastStep && (
                      <Button
                        type="submit"
                        disabled={!(isValid && dirty)}
                        size="sm"
                        variant="contained"
                        className="submit-btn float-right"
                      >
                        Next
                      </Button>
                    )}
                    {/* <Button
                              // disabled={!editId ? !(isValid && dirty) : !isValid}
                        type="submit"
                         variant="contained"
                        className={classes.button}
                      >
                        {btnTxt}
                      </Button> */}
                  </>

                )}
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateCheckLisInfo : addPreventiveChecklist}
                headerImage={predictiveMaintenance}
                headerText="Checklist"
                formType="Update"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
        {/* )} */}
      </CardBody>
    </div>
  );
};

AddPreventiveCheckList.defaultProps = {
  match: false,
  editId: false,
  editData: false,
  isWorkPermit: false,
  isInspection: false,
};

AddPreventiveCheckList.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  isWorkPermit: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isInspection: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
};

export default AddPreventiveCheckList;
