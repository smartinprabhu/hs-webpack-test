/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
  Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faCog, faEnvelope, faCheckCircle, faSave, faTimesCircle,
  faFile, faStopCircle, faChartArea, faInfoCircle, faSignOut, faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import JsZip from 'jszip';
import FileSaver from 'file-saver';

import handPointerBlack from '@images/drawerLite/actionLite.svg';

import {
  getDefaultNoValue, extractNameObject,
  getColumnArrayById, getListOfModuleOperations,
  getLocalTime,
} from '../../util/appUtils';
import {
  getSlaStateLabel,
} from '../utils/utils';
import customData from '../data/customData.json';
import Action from './actionItems/actions';
import { getSLALabel } from '../../helpdesk/utils/utils';
import InvestigationReport from './reports/investigationReport';
import { getMultiModelDocumentsData, getEquipmentDocument } from '../../helpdesk/ticketService';
import LessonsLearnt from './reports/lessonsLearnt';
import actionCodes from '../data/actionCodes.json';

const appModels = require('../../util/appModels').default;

const faIcons = {
  CANCEL: faTimesCircle,
  RESOLVED: faEnvelope,
  START: faCheckCircle,
  ACKNOWLEDGE: faSave,
  VALIDATED: faFile,
  PAUSE: faStopCircle,
  RESUME: faCheckCircle,
  ANALYSIS: faChartArea,
  RECOMMEND: faCheckCircle,
  SIGNOFF: faSignOut,
  INVREPORT: faFilePdf,
  INVREPORTLEARN: faFilePdf,
};

const IncidentDetailInfo = (props) => {
  const { detailData, offset } = props;
  const dispatch = useDispatch();
  const zip = JsZip();
  const defaultActionText = 'Hazards Actions';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [actionModal, showActionModal] = useState(false);
  const [actionMethod, setActionMethod] = useState(false);
  const [actionButton, setActionButton] = useState(false);
  const [actionMsg, setActionMsg] = useState(false);
  const [statusName, setStatusName] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const { multiDocumentsInfo, equipmentDocuments } = useSelector((state) => state.ticket);

  const {
    hxIncidentConfig,
  } = useSelector((state) => state.hazards);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Hazards', 'code');

  const isInvReport = allowedOperations.includes(actionCodes['Investigation Report']);

  const isLL = allowedOperations.includes(actionCodes['Lessons Learnt Report']);

  const configData = hxIncidentConfig && hxIncidentConfig.data && hxIncidentConfig.data.length ? hxIncidentConfig.data[0] : false;

  const closeAction = () => {
    showActionModal(false);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionMethod('');
    setActionButton('');
    setStatusName('');
    setActionMsg('');
  };

  function exportImages() {
    // Generate a directory within the Zip file structure
    const img = zip.folder('attachments');

    const multiDocuments = multiDocumentsInfo && multiDocumentsInfo.data && !multiDocumentsInfo.loading ? multiDocumentsInfo.data.filter((item) => item.datas) : [];
    const singelDoc = equipmentDocuments && equipmentDocuments.data && !equipmentDocuments.loading ? equipmentDocuments.data.filter((item) => item.datas) : [];

    const multipleDocuments = [...singelDoc, ...multiDocuments];
    // Add a file to the directory, in this case an image with data URI as contents
    multipleDocuments.forEach((blob, i) => {
      img.file(blob.datas_fname, blob.datas, { base64: true });
    });

    const zipName = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0].name : false;

    // Generate the zip file asynchronously
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        // Force down of the Zip file
        FileSaver.saveAs(content, `${zipName}_Investiogation_Report_on_${getLocalTime(new Date())}.zip`);
      });
  }

  function exportImages1() {
    // Generate a directory within the Zip file structure
    const img = zip.folder('attachments');

    const multiDocuments = multiDocumentsInfo && multiDocumentsInfo.data && !multiDocumentsInfo.loading ? multiDocumentsInfo.data.filter((item) => item.datas) : [];

    // Add a file to the directory, in this case an image with data URI as contents
    multiDocuments.forEach((blob, i) => {
      img.file(blob.datas_fname, blob.datas, { base64: true });
    });

    const zipName = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0].name : false;

    // Generate the zip file asynchronously
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        // Force down of the Zip file
        FileSaver.saveAs(content, `${zipName}_Lessons_Learnt_Report_on_${getLocalTime(new Date())}.zip`);
      });
  }

  const handleAnswerPrint = (htmlId, fileName) => {
    const content = document.getElementById(htmlId);
    document.title = fileName;
    const pri = document.getElementById('print_frame').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    setTimeout(() => {
      pri.focus();
      pri.print();
    }, 1000);
    closeAction();
  };

  const handleAnswerLassonPrint = (htmlId, fileName) => {
    const content = document.getElementById(htmlId);
    document.title = fileName;
    const pri = document.getElementById('print_frame_learn').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    setTimeout(() => {
      pri.focus();
      pri.print();
    }, 1000);
    closeAction();
  };

  useEffect(() => {
    if (selectedActions === 'Print Investigation Report' && multiDocumentsInfo && !multiDocumentsInfo.loading && (multiDocumentsInfo.data || multiDocumentsInfo.err) && equipmentDocuments && !equipmentDocuments.loading && (equipmentDocuments.data || equipmentDocuments.err)) {
      handleAnswerPrint('print-invest-report', 'Investigation Report');
      exportImages();
    }
  }, [multiDocumentsInfo, equipmentDocuments]);

  useEffect(() => {
    if (selectedActions === 'Print Lessons Learn Report' && multiDocumentsInfo && !multiDocumentsInfo.loading && (multiDocumentsInfo.data || multiDocumentsInfo.err)) {
      handleAnswerLassonPrint('print-invest-report-learn', 'Lessons Learnt Report');
      exportImages1();
    }
  }, [multiDocumentsInfo]);

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const switchActionItem = (action) => {
    if (action.displayname !== 'Print Investigation Report' && action.displayname !== 'Print Lessons Learn Report') {
      setSelectedActions(action.displayname);
      setActionMethod(action.method);
      setActionButton(action.buttonName);
      setActionMsg(action.message);
      setStatusName(action.statusName);
      setSelectedActionImage(action.name);
      showActionModal(true);
    } else if (action.displayname === 'Print Investigation Report' && (viewData.state === 'Resolved' || viewData.state === 'Analyzed' || viewData.state === 'Remediated' || viewData.state === 'Validated' || viewData.state === 'Signed off')) {
      setSelectedActions(action.displayname);
      setSelectedActionImage(action.name);
      const anIds = getColumnArrayById(viewData.analysis_checklist_ids, 'id');
      const valIds = getColumnArrayById(viewData.validate_checklist_ids, 'id');
      const checklistsIds = [...anIds, ...valIds];
      const totalIds = [...checklistsIds, ...[viewData.id]];
      dispatch(getMultiModelDocumentsData(checklistsIds, 'hx.ehs_hazards_validate_checklist', 'hx.ehs_hazards_analysis_checklist', appModels.DOCUMENT));
      dispatch(getEquipmentDocument(viewData.id, appModels.EHSHAZARD, appModels.DOCUMENT));
    } else if (action.displayname === 'Print Lessons Learn Report' && (viewData.state === 'Validated' || viewData.state === 'Signed off')) {
      setSelectedActions(action.displayname);
      setSelectedActionImage(action.name);
      const valIds = getColumnArrayById(viewData.validate_checklist_ids, 'id');
      dispatch(getMultiModelDocumentsData([], 'hx.ehs_hazards_validate_checklist', 'hx.ehs_hazards_analysis_checklist', appModels.DOCUMENT, 'hx.ehs_hazards_validate_checklist', valIds));
    }
  };

  function isValidateUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && configData.validator_role_id && configData.validator_role_id.id && userRoleId === configData.validator_role_id.id) {
      res = true;
    }
    return res;
  }

  function isAcknowledgeUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && configData.acknowledge_role_id && configData.acknowledge_role_id.id && userRoleId === configData.acknowledge_role_id.id) {
      res = true;
    }
    return res;
  }

  const loading = detailData && detailData.loading;

  const totalTasks = viewData && viewData.analysis_ids && viewData.analysis_ids ? viewData.analysis_ids : [];

  const pendingTasks = totalTasks && totalTasks.length ? totalTasks.filter((item) => (item.state === 'Open' || item.state === 'Inprogress')) : false;

  const isTasksNotCleared = pendingTasks && pendingTasks.length > 0;

  const totalAnalysisQtns = viewData && viewData.analysis_checklist_ids && viewData.analysis_checklist_ids ? viewData.analysis_checklist_ids : [];
  const pendingAnalysisQtns = totalAnalysisQtns && totalAnalysisQtns.length ? totalAnalysisQtns.filter((item) => !item.answer) : false;

  const isAnalysisChecklisNotCleared = pendingAnalysisQtns && pendingAnalysisQtns.length > 0;

  const totalValidQtns = viewData && viewData.validate_checklist_ids && viewData.validate_checklist_ids ? viewData.validate_checklist_ids : [];
  const pendingValidQtns = totalValidQtns && totalValidQtns.length ? totalValidQtns.filter((item) => !item.answer) : false;

  const isValidChecklisNotCleared = pendingValidQtns && pendingValidQtns.length > 0;

  /* function isValidUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && viewData.probability_id && viewData.probability_id.remediate_authority_id && viewData.probability_id.remediate_authority_id.id && userRoleId === viewData.probability_id.remediate_authority_id.id) {
      res = true;
    }
    return res;
  } */

  function isSignUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && configData.sign_off_role_role_id && configData.sign_off_role_role_id.id && userRoleId === configData.sign_off_role_role_id.id) {
      res = true;
    }
    return res;
  }

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailData && detailData.data ? detailData.data[0].state : '';

    if (actionName === 'Acknowledge') {
      if (vrState !== 'Reported' || !configData.is_acknowledge_required || !isAcknowledgeUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Complete Recommendation') {
      if (vrState !== 'Analyzed') {
        allowed = false;
      }
      if (vrState === 'Acknowledged' && !configData.is_analyzed_required) {
        allowed = true;
      }
      if (vrState === 'Reported' && !configData.is_analyzed_required && !configData.is_acknowledge_required) {
        allowed = true;
      }
    }
    if (actionName === 'Resolve') {
      if (vrState !== 'Remediated') {
        allowed = false;
      }
      if (vrState === 'Acknowledged' && !configData.is_analyzed_required) {
        allowed = true;
      }
      if (vrState === 'Analyzed' && !configData.is_analyzed_required) {
        allowed = true;
      }
      if (vrState === 'Reported' && !configData.is_acknowledge_required && !configData.is_analyzed_required) {
        allowed = true;
      }
    }
    if (actionName === 'Validate') {
      if (vrState !== 'Resolved' || !configData.is_validation_required || !isValidateUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Print Investigation Report') {
      if (!isInvReport || vrState === 'Acknowledged' || vrState === 'Reported' || vrState === 'Paused' || vrState === 'Cancelled') {
        allowed = false;
      }
    }
    if (actionName === 'Print Lessons Learn Report') {
      if (!isLL || vrState === 'Acknowledged' || vrState === 'Reported' || vrState === 'Analyzed' || vrState === 'Remediated' || vrState === 'Resolved' || vrState === 'Paused' || vrState === 'Cancelled') {
        allowed = false;
      }
    }
    if (actionName === 'Cancel Hazard') {
      if (vrState === 'Resolved' || vrState === 'Signed off' || vrState === 'Validated' || vrState === 'Paused' || vrState === 'Cancelled') {
        allowed = false;
      }
    }
    if (actionName === 'Pause Hazard') {
      if (vrState === 'Reported' || vrState === 'Signed off' || vrState === 'Acknowledged' || vrState === 'Resolved' || vrState === 'Validated' || vrState === 'Paused' || vrState === 'Cancelled') {
        allowed = false;
      }
    }
    if (actionName === 'Resume Hazard') {
      if (vrState !== 'Paused') {
        allowed = false;
      }
    }
    if (actionName === 'Complete Analysis') {
      if (vrState !== 'Acknowledged' || !configData.is_analyzed_required) {
        allowed = false;
      }
      if (vrState === 'Reported' && !configData.is_acknowledge_required && configData.is_analyzed_required) {
        allowed = true;
      }
    }
    if (actionName === 'Sign off') {
      if (vrState !== 'Validated' || !configData.is_sign_off_required || !isSignUser()) {
        allowed = false;
      }
    }
    return allowed;
  };

  function getStateName() {
    let res = '';

    if (viewData.state === 'Reported' && !configData.is_acknowledge_required && configData.is_analyzed_required) {
      res = customData.status.Acknowledged.msg;
    } else if (viewData.state === 'Reported' && configData.is_acknowledge_required && !isAcknowledgeUser()) {
      res = 'User does not have the authority to acknowledge.';
    } else if (viewData.state === 'Acknowledged' && !configData.is_analyzed_required) {
      res = customData.status.Analyzed.msg;
    } else if (viewData.state === 'Reported' && !configData.is_acknowledge_required && !configData.is_analyzed_required) {
      res = customData.status.Analyzed.msg;
    } else if (viewData.state === 'Resolved' && configData.is_validation_required && isValidateUser()) {
      res = customData.status.Resolved.msg;
    } else if (viewData.state === 'Resolved' && configData.is_validation_required && !isValidateUser()) {
      res = 'User does not have the authority to recommendation.';
    } else if (viewData.state === 'Resolved' && !configData.is_validation_required) {
      res = '';
    } else {
      res = customData.status[viewData.state].msg;
    }
    return res;
  }

  return (
    !loading && viewData && (
    <>
      <Row className="mt-3 globalModal-header-cards">
        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="9" lg="9" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    TITLE
                  </p>
                  <p className="mb-0 font-weight-700">
                    {getDefaultNoValue(viewData.name)}
                  </p>
                  <p className="mb-0 font-weight-400 font-tiny">
                    {getDefaultNoValue(viewData.reference)}
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="12" lg="12" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    ASSET / SPACE
                  </p>
                  {viewData.type_category && viewData.type_category === 'equipment' && (
                  <p className="mb-0 font-weight-700">
                    {getDefaultNoValue(extractNameObject(viewData.equipment_id, 'name'))}
                  </p>
                  )}
                  {viewData.type_category && viewData.type_category === 'asset' && (
                  <p className="mb-0 font-weight-700">
                    {getDefaultNoValue(extractNameObject(viewData.asset_id, 'path_name'))}
                  </p>
                  )}
                  {viewData.type_category && viewData.type_category === 'equipment' && (
                  <p className="mb-0 font-weight-500 font-tiny">
                    {getDefaultNoValue(viewData.equipment_id.location_id ? extractNameObject(viewData.equipment_id.location_id, 'path_name') : '')}
                  </p>
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="12" lg="12" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    STATUS
                  </p>
                  <p className="mb-0 font-weight-700">
                    {getDefaultNoValue(getSlaStateLabel(viewData.state))}
                  </p>
                  <p className="m-0 p-0 font-weight-700 text-capital">
                    {getSLALabel(viewData.sla_status)}
                  </p>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="9" lg="9" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    ACTIONS
                  </p>
                  <p className="mb-0 font-weight-700">
                    <div className="mr-2 mt-1">
                      <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="actionDropdown">
                        <DropdownToggle
                          caret
                          className={selectedActionImage !== '' ? 'bg-white text-navy-blue text-left pb-05 pt-05 font-11 rounded-pill'
                            : 'pb-05 pt-05 font-11 rounded-pill btn-navyblue text-left'}
                        >
                          {selectedActionImage !== ''
                            ? (
                              <FontAwesomeIcon
                                className="mr-2"
                                color="primary"
                                icon={faIcons[`${selectedActionImage}`]}
                              />
                            ) : ''}
                          <span className="font-weight-700">
                            {!selectedActionImage && (
                            <FontAwesomeIcon size="sm" color="primary" className="mr-2 mt-1" icon={faCog} />
                            )}
                            {selectedActions}
                            {((multiDocumentsInfo && multiDocumentsInfo.loading) || (equipmentDocuments && equipmentDocuments.loading)) && (
                            <Spinner size="sm" className="ml-1 mr-1" variant="secondary" />
                            )}
                            <FontAwesomeIcon size="sm" color="primary" className="float-right ml-2 mt-1" icon={faChevronDown} />
                          </span>
                        </DropdownToggle>
                        <DropdownMenu>
                          {customData && customData.actionItems.map((actions) => (
                            checkActionAllowed(actions.displayname) && (
                            <DropdownItem
                              id="switchAction"
                              className="pl-2"
                              key={actions.id}
                              onClick={() => switchActionItem(actions)}
                            >
                              <FontAwesomeIcon
                                className="mr-2"
                                icon={faIcons[actions.name]}
                              />
                              {actions.displayname}
                            </DropdownItem>
                            )
                          ))}
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </p>
                </Col>
                <Col sm="12" md="3" lg="3" xs="12" className="">
                  <img src={handPointerBlack} alt="asset" width="20" className="mt-3" />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        {actionModal && (
        <Action
          atFinish={() => closeAction()}
          atCancel={() => closeAction()}
          detailData={viewData}
          actionModal={actionModal}
          actionButton={actionButton}
          actionMsg={actionMsg}
          offset={offset}
          actionMethod={actionMethod}
          displayName={selectedActions}
          statusName={statusName}
          message={selectedActionImage}
          isTasksNotCleared={isTasksNotCleared}
          isAnalysisChecklisNotCleared={isAnalysisChecklisNotCleared}
          isValidChecklisNotCleared={isValidChecklisNotCleared}
        />
        )}
      </Row>
      {getStateName() && (
      <Alert color="warning" className="mt-2">
        <Tooltip title="Info">
          <span className="text-info cursor-pointer">
            <FontAwesomeIcon className="mr-2 custom-fav-icon" size="sm" icon={faInfoCircle} />
          </span>
        </Tooltip>
        {getStateName()}
      </Alert>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <InvestigationReport detailData={viewData} isAnalysis={configData.is_analyzed_required} isValidate={configData.is_validation_required} />
      </Col>
      <Col md="12" sm="12" lg="12" className="d-none">
        <LessonsLearnt detailData={viewData} isValidate={configData.is_validation_required} />
      </Col>
      {!getStateName() && (
      <div className="mt-2" />
      )}
    </>
    )
  );
};

IncidentDetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default IncidentDetailInfo;
