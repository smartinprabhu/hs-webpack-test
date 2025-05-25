/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
/* eslint-disable no-mixed-operators */
/* eslint-disable camelcase */
/* eslint-disable react/no-danger */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Modal, ModalBody, ModalFooter, Row, Col, Input, Container, Spinner, Form,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './preScreening.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import difference from 'lodash/difference';
import pull from 'lodash/pull';
import uniq from 'lodash/uniq';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import mask2 from '@images/peopleWearingMasks.png';
import mask from '@images/wearingMaskPeople.png';
import screeningIcon from '@images/screening.ico';
import wearMaskIcon from '@images/wearAMask.ico';
import symptomsIcon from '@images/symptoms.ico';
import workStationIcon from '@images/workstation.ico';
import CancelButtonGrey from '@shared/cancelButtonGreyRounded';
import CustomRadio from '@shared/customRadioButton';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import { getQuestionaireData, saveProcessedPreScreening } from './preScreeningService';

const useStyles = makeStyles(() => ({
  root: {
    align: 'center',
    fontWeight: 900,
  },
}));

const PreScreensModalWindow = ({ modalWindowOpen, openModalWindow, bookingData }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [screeningData, updateScreening] = useState({
    screening1: {
      completed: false,
      display: true,
    },
    screening2: {
      display: false,
      completed: false,
    },
    screening3: {
      display: false,
      completed: false,
    },
  });
  const [MandatoryQuestionnaireId, setMandatoryQuestionnaireId] = useState([]);

  const [currentScreening, setCurrentScreening] = useState(1);
  const { questionarieData } = useSelector((state) => state.preScreening);
  const { preScreeningProcess } = useSelector((state) => state.preScreening);
  // const {
  //   userRoles,
  // } = useSelector((state) => state.config);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  // const [preScreenAdvice, setPreScreenAdvice] = useState('');
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState({});
  const [data, setDataForForm] = useState([]);
  const [formDataObj, setFormDataObj] = useState({});
  const [checkValidityforError, setCheckValidityForError] = useState([]);
  const [dataIds, setDataForFormIds] = useState([]);

  // const [dropdownOpen, setDropdownOpen] = useState(false);
  // const toggle = () => setDropdownOpen((prevState) => !prevState);
  const occupy = userRoles && userRoles.data && userRoles.data.occupy;
  const workspace_instruction = userRoles && userRoles.data && userRoles.data.covid && userRoles.data.covid.workspace_instruction;

  useEffect(() => {
    if (!occupy.detect_mask) {
      setCurrentScreening(currentScreening + 1);
      const updateScreeningData = { ...screeningData };
      let key = `screening${currentScreening}`;
      updateScreeningData[key] = {
        display: false,
        completed: true,
      };
      key = `screening${currentScreening + 1}`;
      updateScreeningData[key] = {
        display: true,
        completed: false,
      };
      updateScreening(updateScreeningData);
    }
  }, [occupy, bookingData]);

  useEffect(() => {
    if (userRoles && userRoles.data && userRoles.data.prescreen && userRoles.data.prescreen.checklists && userRoles.data.prescreen.checklists.length > 0) {
      dispatch(getQuestionaireData(userRoles.data.prescreen.checklists[0].id));
      // updateScreen();
    }
  }, []);

  const processedPreScreeningData = () => {
    const processedData = questionarieData.data.map((q) => ({
      answer: formData[q.id],
      employee_id: userInfo.data.employee.id,
      vendor_id: userInfo.data.vendor.id,
      mro_activity_id: q.id,
      check_list_id: userRoles.data.prescreen.checklists[0].id,
      shift_id: bookingData.id,
      type: q.type,
    }));
    return processedData;
  };

  const finishAction = () => {
    const prescreenData = processedPreScreeningData();
    if ((!preScreeningProcess
      && !preScreeningProcess.data
      && !preScreeningProcess.data.length)
      || !preScreeningProcess.err
    ) {
      dispatch(saveProcessedPreScreening(prescreenData));
    }
  };

  /* eslint-disable no-param-reassign */
  const updateScreen = (updateScreeningData, key) => {
    setCurrentScreening(currentScreening + 1);
    // update completed screen
    updateScreeningData[key].display = false;
    updateScreeningData[key].completed = true;

    // update next screen display
    key = `screening${currentScreening + 1}`;
    updateScreeningData[key] = {
      display: true,
      completed: false,
    };
    updateScreening(updateScreeningData);
  };

  const validateForm = () => {
    let flag = true;
    setFormError({});
    const formObject = {};
    questionarieData.data.map((ques) => {
      if ((ques.constr_mandatory && !formData[ques.id])
        || (ques.constr_mandatory && formData[ques.id] === '')) {
        formObject[ques.id] = 'This field is required!';
        flag = false;
      }
    });
    setFormError(formObject);
    return flag;
  };

  useEffect(() => {
    if (questionarieData && questionarieData.data && questionarieData.data.length > 0) {
      questionarieData.data.map((ques) => {
        if (ques.constr_mandatory) setMandatoryQuestionnaireId((state) => [...state, ques.id]);
      });
    }
  }, [questionarieData]);

  const nextView = () => {
    const updateScreeningData = { ...screeningData };
    const key = `screening${currentScreening}`;
    if (currentScreening === 2) {
      if (Object.keys(formData) && Object.keys(formData).length) {
        if (validateForm()) {
          updateScreen(updateScreeningData, key);
        }
      } else {
        validateForm();
      }
    } else {
      updateScreen(updateScreeningData, key);
    }
  };

  const backView = () => {
    let key = `screening${currentScreening}`;
    screeningData[key] = {
      display: false,
      completed: false,
    };
    key = `screening${currentScreening - 1}`;
    setCurrentScreening(currentScreening - 1);
    updateScreening({
      ...screeningData,
      [key]: {
        display: true,
        completed: false,
      },
    });
  };

  const onChangeEvent = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  useEffect(() => {
    setDataForForm(Object.keys(formData).map((key) => parseInt(key)));
  }, [formData]);

  useEffect(() => {
    Object.keys(formData).map((key) => {
      if (formData[key] === 'Yes' || formData[key] === 'No') {
        setDataForFormIds((state) => uniq([...state, parseInt(key)]));
      }
    });
  }, [formData]);

  const checkValidity = {
    No: false,
    Yes: true,
  };

  useEffect(() => {
    if (data && data.length > 0) {
      data.map((formDataItem) => {
        const checkValidityObject = formDataObj;
        checkValidityObject[formDataItem] = checkValidity[formData[formDataItem]];
        setFormDataObj(checkValidityObject);
      });
    }
  }, [questionarieData, formData, data]);

  useEffect(() => {
    if (questionarieData && questionarieData.data && questionarieData.data.length > 0) {
      questionarieData.data.map((questionnaire) => {
        if (formDataObj[questionnaire.id] === questionnaire.expected_type && questionnaire.type === 'boolean') {
          let questionnaireIds = checkValidityforError;
          /* eslint-disable no-unused-vars */
          questionnaireIds = uniq(questionnaireIds.push(questionnaire.id));
          setCheckValidityForError((state) => [...state, questionnaire.id]);
        } else {
          const questionnaireIds = uniq(pull(checkValidityforError, questionnaire.id));
          setCheckValidityForError(questionnaireIds);
        }
      });
    }
  }, [formDataObj, formData, dataIds]);

  const differenceData = difference(dataIds, checkValidityforError);

  const [showPrescreenEmpInputValidationErrMsg, setPrescreenEmpInputValidationErrMsg] = useState(false);

  useEffect(() => {
    if (differenceData && differenceData.length > 0 && difference(MandatoryQuestionnaireId, data) && difference(MandatoryQuestionnaireId, data).length === 0) {
      setPrescreenEmpInputValidationErrMsg(true);
    } else {
      setPrescreenEmpInputValidationErrMsg(false);
    }
  }, [differenceData]);

  // const handleDropDownChange = (value) => {
  //   setPreScreenAdvice(value);
  // };

  return (
    <Modal className="prescreen-modal" centered size="xl" backdrop="static" isOpen={modalWindowOpen} toggle={openModalWindow}>
      <ModalBody>
        <Row>
          <Col sm="1" xs="2" md="1" lg="1" className="text-center pr-2">
            <img src={screeningIcon} alt="Screening" width="35" height="35" />
          </Col>
          <Col sm="11" xs="10" md="11" lg="11" className="pl-0">
            {preScreeningProcess && !preScreeningProcess.data && (
              <CancelButtonGrey className="float-right mt-1" openCloseModalWindow={openModalWindow} />
            )}
            <div className="mb-0 font-weight-900 font-size-20px">
              Screening Process
            </div>
            <div className="light-text">
              Please answer truthfully the following questions.
            </div>
          </Col>
        </Row>
        <Row className="px-4 h-400 thin-scrollbar">
          <Col xs={{ size: 10 }} sm={{ size: 4 }} md={{ size: 4 }} lg={{ size: 4 }} className="ml-5">
            {occupy && occupy.detect_mask && (
              <>
                <Row className="mt-4">
                  <Col xs="2" sm="1" md="1" lg="1">
                    <div className="gray-circle">
                      <img src={wearMaskIcon} alt="Wear A Mask" width="40" height="40" />
                    </div>
                  </Col>
                  <Col xs="10" sm="11" md="11" lg="11">
                    <span className="centerH mt-2">
                      <span>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {' '}
                        Mask Detected
                      </span>
                    </span>
                  </Col>
                </Row>
                <div className="h-line" />
              </>
            )}
            <Row className="mt-4">
              <Col xs="2" sm="1" md="1" lg="1">
                <div className="gray-circle">
                  <img src={symptomsIcon} alt="Symptoms" width="40" height="40" />
                </div>
              </Col>
              <Col xs="10" sm="11" md="11" lg="11">
                <span className="centerH mt-2" style={{ opacity: (screeningData.screening2.display || screeningData.screening2.completed) ? '1' : '0.5' }}>
                  <span>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    {' '}
                    No symptoms found today
                  </span>
                </span>
              </Col>
            </Row>
            <div className="h-line" />
            <Row className="mt-4">
              <Col xs="2" sm="1" md="1" lg="1">
                <div className="gray-circle">
                  <img src={workStationIcon} alt="Work Station" width="40" height="40" />
                </div>
              </Col>
              <Col xs="10" sm="11" md="11" lg="11">
                <span className="centerH mt-2" style={{ opacity: (screeningData.screening3.display || screeningData.screening3.completed) ? '1' : '0.5' }}>
                  <span>
                    <FontAwesomeIcon icon={faCheckCircle} />
                    {' '}
                    Workspace instructions accepted
                  </span>
                </span>
              </Col>
            </Row>
          </Col>
          <Col className="mt-4">
            {!screeningData.screening3.completed && (
              <Row className="row-center-align">
                <div className="gray-circle" style={{ width: '55px', height: '55px' }}>
                  {screeningData.screening1.display && occupy && occupy.detect_mask && <img src={wearMaskIcon} alt="Wear A Mask" className="w-100" />}
                  {screeningData.screening2.display && <img src={symptomsIcon} alt="Symptoms" className="w-100" />}
                  {screeningData.screening3.display && <img src={workStationIcon} alt="Work Station" className="w-100" />}

                </div>
                {screeningData.screening1.display && occupy && occupy.detect_mask && <p className="q-title ml-3">Please wear a mask when entering a building</p>}
                {screeningData.screening2.display && <p className="q-title ml-3">Please answer truthfully the following questions.</p>}
                {screeningData.screening3.display && (
                  <p className="q-title ml-3">
                    {workspace_instruction && workspace_instruction.name}
                    <span style={{ fontSize: '13px' }}>
                      <br />
                      I acknowledge that I shall follow the practices given below.
                      {' '}
                    </span>
                  </p>
                )}
                {screeningData.screening1.display && occupy && occupy.detect_mask && <img className="ml-5" src={mask} alt="People Wearing Mask" style={{ width: '80%' }} />}
              </Row>
            )}
            <Row className="mt-3">
              {screeningData.screening2.display && (
                <Container className="screening-right-container mr-0">
                  <div className="ml-n2">Are you experiencing any of the symptoms?</div>
                  <Col sm="11">
                    <hr className="mt-1 mb-2 ml-n4" />
                  </Col>
                  <Form className="mb-4">
                    <Row className="ml-2">
                      <Col>
                        {questionarieData && questionarieData.data && questionarieData.data.map((q) => (
                          <div className="mt-1" key={q.id}>
                            <Col sm="12" className="pl-0 ml-n3">
                              {q && q.constr_mandatory && (
                                <span className="text-danger font-size-20px">*</span>
                              )}
                              {q.name}
                            </Col>
                            {q.type && q.type === 'boolean' && (
                              <Row sm="12">
                                <Col sm="6 pl-0 ml-n2" xs="5" lg="6">
                                  <CustomRadio
                                    name={q.id.toString()}
                                    checked={formData[q.id] === 'Yes'}
                                    onChange={(e) => { onChangeEvent(e); }}
                                    value="Yes"
                                    color={formData && checkValidity[formData[q.id]] !== q.expected_type ? 'secondary' : 'default'}
                                  />
                                  {' '}
                                  Yes
                                </Col>
                                <Col sm="6" xs="5" lg="6">
                                  <CustomRadio
                                    name={q.id.toString()}
                                    checked={formData[q.id] === 'No'}
                                    onChange={(e) => { onChangeEvent(e); }}
                                    value="No"
                                    color={formData && checkValidity[formData[q.id]] !== q.expected_type ? 'secondary' : 'default'}
                                  />
                                  {' '}
                                  No
                                </Col>
                                {formError && formError[q.id] && <div className="text-danger mt-1">{formError[q.id]}</div>}
                              </Row>
                            )}
                            {q.type && q.type === 'textbox' && (
                              <Col sm="12" className="pl-0">
                                <Input
                                  className="ml-n3 width92"
                                  type="textarea"
                                  name={q.id}
                                  id={q.id}
                                  data-testid={q.id}
                                  value={formData[q.id]}
                                  onChange={(e) => { onChangeEvent(e); }}
                                />
                                {formError && formError[q.id] && (<div className="text-danger mt-1">{formError[q.id]}</div>)}
                              </Col>
                            )}
                            {q.type && q.type === 'numerical_box' && (
                              <Col sm="12 pl-0">
                                <Input
                                  className="ml-n3 width92"
                                  type="number"
                                  name={q.id}
                                  id={q.id}
                                  data-testid={q.id}
                                  value={formData[q.id] || ''}
                                  onChange={(e) => { onChangeEvent(e); }}
                                />
                                {formError && formError[q.id] && <div className="text-danger mt-1">{formError[q.id]}</div>}
                              </Col>
                            )}
                            <Col sm="11">
                              <hr className="m-3 ml-n5" />
                            </Col>
                          </div>
                        ))}
                        {questionarieData && questionarieData.loading && (
                          <div className="mt-3">
                            <Loader />
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Form>
                </Container>
              )}
              {screeningData.screening3.display && workspace_instruction && workspace_instruction.content_html && (
                <Container className="screening-right-container mr-0">
                  <div dangerouslySetInnerHTML={{ __html: workspace_instruction.content_html }} />
                </Container>
              )}
              {screeningData.screening3.completed && (
                <Container>
                  <h2>Thank you for your inputs.</h2>
                  <h2>Have a nice day!</h2>
                  <img src={mask2} alt="People Wearing Mask" style={{ width: '80%' }} />
                </Container>
              )}
            </Row>
          </Col>
        </Row>
        {preScreeningProcess && preScreeningProcess.data && preScreeningProcess.data.length > 0 && (
          <SuccessAndErrorFormat response={preScreeningProcess} successMessage="Your pre-screening is complete!" />
        )}
        {preScreeningProcess && preScreeningProcess.err && preScreeningProcess.err.error
          && preScreeningProcess.err.error.message && (
            <SuccessAndErrorFormat response={preScreeningProcess} />
        )}
        {screeningData.screening1.completed && difference(dataIds, checkValidityforError) && showPrescreenEmpInputValidationErrMsg && (
          <Col sm={{ size: 6, offset: 3 }} className={`text-center my-3 text-danger ${classes.root}`}>
            <Typography component="span">
              <Alert variant="filled" severity="error" align="center">
                Based on your inputs, you will not be allowed to go on site today.
              </Alert>
            </Typography>
          </Col>
        )}
        {preScreeningProcess && preScreeningProcess.data && preScreeningProcess.data.length > 0 ? '' : (
          <Col>
            <p className="my-4 text-center text-info">
              You wouldn't be able to cancel the booking once prescreening is done.
            </p>
          </Col>
        )}
      </ModalBody>
      <ModalFooter>
        {(preScreeningProcess && preScreeningProcess.data && preScreeningProcess.data.length)
          || preScreeningProcess.err
          ? (<Button  variant="contained" onClick={() => openModalWindow(false)}>OK</Button>)
          : (
            <div>
              {occupy.detect_mask && screeningData.screening1.completed && <Button  variant="contained" onClick={backView} className="mr-2">Back</Button>}
              {!occupy.detect_mask && screeningData.screening2.completed && <Button  variant="contained" onClick={backView} className="mr-2">Back</Button>}
              {screeningData && screeningData.screening3 && !screeningData.screening3.completed && !showPrescreenEmpInputValidationErrMsg
                && (
                  <Button
                     variant="contained"
                    disabled={Object.keys(formData) && screeningData.screening1.completed && (!!(difference(MandatoryQuestionnaireId, data) && difference(MandatoryQuestionnaireId, data).length > 0))}
                    type="submit"
                    onClick={nextView}
                  >
                    Next
                  </Button>
                )}
              {screeningData.screening3.completed && (
                <Button  variant="contained" onClick={finishAction}>
                  {preScreeningProcess && preScreeningProcess.loading && (<Spinner size="sm" color="light" />)}
                  <span className="ml-2" />
                  Finish
                </Button>
              )}
              {showPrescreenEmpInputValidationErrMsg && (
                <Button  variant="contained" onClick={() => openModalWindow(false)}>Ok</Button>
              )}
            </div>
          )}
      </ModalFooter>
    </Modal>
  );
};

PreScreensModalWindow.propTypes = {
  modalWindowOpen: PropTypes.bool.isRequired,
  openModalWindow: PropTypes.func.isRequired,
  bookingData: PropTypes.shape({
    id: PropTypes.number,
    access_status: PropTypes.bool,
    working_hours: PropTypes.number,
    planned_in: PropTypes.string,
    planned_out: PropTypes.string,
    planned_status: PropTypes.string,
    prescreen_status: PropTypes.bool,
    shift: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    space: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }).isRequired,
};

export default PreScreensModalWindow;
