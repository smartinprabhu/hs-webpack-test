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
  Spinner,
  Modal,
  ModalBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faCog, faPencilAlt, faCheckCircle, faTag, faPrint,
  faPaperclip,
  faPauseCircle,
  faPlayCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import locationBlack from '@images/drawerLite/locationLite.svg';
import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import envelopeIcon from '@images/icons/envelope.svg';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';

import Action from './actionItems/actions';
import customData from '../data/customData.json';
import actionCodes from '../data/actionCodes.json';
import {
  getDefaultNoValue, extractNameObject, getListOfModuleOperations, getColumnArrayByField,
} from '../../util/appUtils';
import {
  resetEscalate,
  resetActionData,
  resetUpdateParts,
} from '../../workorders/workorderService';
import {
  getStateLabel,
} from '../utils/utils';
import {
  getWorkPermitDetails,
} from '../workPermitService';
import {
  resetVisitState,
} from '../../visitorManagement/visitorManagementService';
import {
  getPrintReport, resetPrint,
} from '../../purchase/purchaseService';
import ReviewWorkorder from './actionItems/reviewWorkorder';
import Extend from './actionItems/extend';
import {
  resetUpdateProductCategory, updateProductCategory, resetCreateProductCategory, resetCreateOrder,
} from '../../pantryManagement/pantryService';

import Checklists from '../../externalWorkPermit/checklists/checklists';
import AuthService from '../../util/authService';

const appModels = require('../../util/appModels').default;

const faIcons = {
  AUTHORIZE: faCheckCircle,
  PREPARE: faTag,
  ISSUEPERMIT: faCheckCircle,
  VALIDATE: faCheckCircle,
  REVIEW: faPencilAlt,
  PRINTPDF: faPrint,
  EXTEND: faTag,
  PREPARELIST: faPaperclip,
  PERFORMLIST: faPaperclip,
  'On Hold': faPauseCircle,
  Resume: faPlayCircle,
  Cancel: faTimesCircle,
};

const WorkPermitDetailInfo = (props) => {
  const { detailData, setViewModal, viewId } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Work Permit Actions';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const [actionText, setActionText] = useState('');
  const [actionButton, setActionButton] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [actionValue, setActionValue] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [reviewModal, showReviewModal] = useState(false);
  const [printModal, showPrintModal] = useState(false);
  const [extendModal, showExtendModal] = useState(false);
  const [statusInfo, setStatusInfo] = useState({ loading: false, data: null, err: null });

  const authService = AuthService();

  const [checklistModal, setChecklistModal] = useState(false);
  const [checklistPrepareModal, setChecklistPrepareModal] = useState(false);

  const [isLoad, setIsLoad] = useState(false);

  const [taskQuestions, setTaskQuestions] = useState([]);

  const onClose = () => {
    setChecklistModal(false);
    setSelectedActions(defaultActionText); setSelectedActionImage('');
  };

  const onPreClose = () => {
    setChecklistPrepareModal(false);
    setSelectedActions(defaultActionText); setSelectedActionImage('');
  };

  const onDone = () => {
    const viewId = detailData && detailData.data ? detailData.data[0].id : '';
    const postData = {
      state: 'Prepared',
    };
    setIsLoad(true);
    dispatch(updateProductCategory(viewId, appModels.WORKPERMIT, postData));
    setTimeout(() => {
      setIsLoad(false);
      dispatch(getWorkPermitDetails(viewId, appModels.WORKPERMIT));
    }, 1500);
    setChecklistPrepareModal(false);
    setSelectedActions(defaultActionText); setSelectedActionImage('');
  };

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    printReportInfo,
  } = useSelector((state) => state.purchase);

  const { workPermitConfig, wpTaskLists } = useSelector((state) => state.workpermit);

  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;

  const isPreparedRequired = wpConfig && wpConfig.is_prepared_required ? wpConfig.is_prepared_required : false;
  const isEhsRequired = wpConfig && wpConfig.is_ehs_required ? wpConfig.is_ehs_required : false;
  const reviewRequired = wpConfig && wpConfig.review_required ? wpConfig.review_required : false;

  const onWoDone = () => {
    const viewId = detailData && detailData.data ? detailData.data[0].id : '';
    setChecklistModal(false);
    const postData = {
      state: reviewRequired ? 'Work In Progress' : 'Closed',
    };
    setIsLoad(true);
    dispatch(updateProductCategory(viewId, appModels.WORKPERMIT, postData));
    setTimeout(() => {
      setIsLoad(false);
      dispatch(getWorkPermitDetails(viewId, appModels.WORKPERMIT));
    }, 1500);
    setSelectedActions(defaultActionText); setSelectedActionImage('');
  };

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Permit', 'code');

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  useEffect(() => {
    const ViewId = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0].id : false;
    if ((printModal) && ViewId) {
      dispatch(getPrintReport(ViewId, 'mro_work_permit.work_permit_template'));
    }
  }, [printModal]);

  const taskData = wpTaskLists && wpTaskLists.data && wpTaskLists.data.length ? wpTaskLists.data[0] : false;
  const taskChecklists = taskData && taskData.check_list_ids && taskData.check_list_ids.length && taskData.check_list_ids[0].check_list_id && taskData.check_list_ids[0].check_list_id.activity_lines && taskData.check_list_ids[0].check_list_id.activity_lines.length ? taskData.check_list_ids[0].check_list_id.activity_lines : false;

  useEffect(() => {
    if (taskChecklists) {
      const newArrData = taskChecklists.map((cl) => ({
        id: cl.id,
        answer_type: cl.type,
        answer_common: false,
        mro_activity_id: {
          based_on_ids: cl.based_on_ids,
          constr_error_msg: cl.constr_error_msg,
          constr_mandatory: cl.constr_mandatory,
          has_attachment: cl.has_attachment,
          id: cl.id,
          is_enable_condition: cl.is_enable_condition,
          name: cl.name,
          parent_id: cl.parent_id,
          validation_error_msg: cl.validation_error_msg,
          validation_length_max: cl.validation_length_max,
          validation_length_min: cl.validation_length_min,
          validation_max_float_value: cl.validation_max_float_value,
          validation_min_float_value: cl.validation_min_float_value,
          validation_required: cl.validation_required,
          type: cl.type,
          sequence: cl.sequence,
          labels_ids: cl.labels_ids,
        },
        mro_quest_grp_id: cl.mro_quest_grp_id,
        value_date: false,
        value_number: 0,
        value_suggested: {},
        value_suggested_ids: [],
        value_text: false,
        type: false,
      }));
      setTaskQuestions(newArrData);
    } else {
      setTaskQuestions([]);
    }
  }, [wpTaskLists]);

  useEffect(() => {
    if (printModal && printReportInfo && printReportInfo.data) {
      const pdfBase64 = printReportInfo.data.content;
      const dlnk = document.getElementById('dwnldLnk');
      dlnk.href = `data:application/octet-stream;base64,${pdfBase64}`;
      dlnk.click();
      setSelectedActions(defaultActionText);
      setSelectedActionImage('');
      showPrintModal(false);
      dispatch(resetPrint());
    }
  }, [printReportInfo]);

  useEffect(() => {
    dispatch(resetEscalate());
    dispatch(resetActionData());
    dispatch(resetCreateOrder());
    dispatch(resetVisitState());
    dispatch(resetUpdateParts());
  }, []);

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailData && detailData.data ? detailData.data[0].state : '';

    if (actionName === 'Approve') {
      if (vrState !== 'Requested') {
        allowed = false;
      }
    }
    if (actionName === 'Prepare') {
      if (vrState !== 'Approved' || !isPreparedRequired || (viewData && viewData.order_id && viewData.order_id.preparedness_checklist_lines && viewData.order_id.preparedness_checklist_lines.length)) {
        allowed = false;
      }
    }

    if (actionName === 'Prepare Checklists') {
      if (vrState !== 'Approved' || !isPreparedRequired || !(viewData && viewData.order_id && viewData.order_id.preparedness_checklist_lines && viewData.order_id.preparedness_checklist_lines.length)) {
        allowed = false;
      }
    }

    if (actionName === 'Perform Work Checklist') {
      if (vrState !== 'Validated' || !isEhsRequired || !viewData.order_id.id) {
        allowed = false;
      }
    }

    if (actionName === 'Issue Permit') {
      if (vrState !== 'Prepared') {
        allowed = false;
      }
      if (vrState === 'Approved' && !isPreparedRequired) {
        allowed = true;
      }
    }
    if (actionName === 'Validate') {
      if (vrState !== 'Issued Permit' || !isEhsRequired) {
        allowed = false;
      }
    }
    if (actionName === 'On Hold') {
      if ((vrState !== 'Validated' && vrState !== 'Work In Progress')) {
        allowed = false;
      }
    }
    if (actionName === 'Cancel') {
      if ((vrState !== 'Validated' && vrState !== 'Work In Progress')) {
        allowed = false;
      }
    }
    if (actionName === 'Resume') {
      if (vrState !== 'On Hold') {
        allowed = false;
      }
    }
    if (actionName === 'Review') {
      if ((vrState !== 'Validated' && vrState !== 'Work In Progress') || !reviewRequired) {
        allowed = false;
      }
    }
    if (actionName === 'Extend') {
      if (vrState !== 'Closed' && vrState !== 'Work In Progress') {
        allowed = false;
      }
    }
    return allowed;
  };

  const checkActionAllowedReview = (actionName) => {
    let allowed = false;
    const oId = viewData && viewData.order_id && viewData.order_id.id ? viewData.order_id.id : false;
    const oState = viewData && viewData.order_state ? viewData.order_state : false;
    const status = viewData && viewData.state ? viewData.state : false;
    const rId = viewData && viewData.order_id && viewData.order_id.reviewed_by && viewData.order_id.reviewed_by.id ? viewData.order_id.reviewed_by.id : false;
    const reviewerId = detailData && detailData.data && detailData.data[0].reviewer_id && detailData.data[0].reviewer_id.id ? detailData.data[0].reviewer_id.id : false;
    const userEmployee = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : false;
    if (actionName === 'Review' && (status !== 'Closed') && (oState === 'done') && oId && !rId && (reviewerId === userEmployee)) {
      allowed = true;
    }
    return allowed;
  };

  const sortSections = (dataSections) => {
    const dataSectionsNew = dataSections.sort(
      (a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence,
    );
    return dataSectionsNew;
  };

  const checkDisable = (actionName) => {
    let allowed = false;
    const userEmployee = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : false;
    const ehsAuthorityMembersIds = detailData && detailData.data
      && detailData.data[0].ehs_authority_id
      && detailData.data[0].ehs_authority_id.member_ids
      && detailData.data[0].ehs_authority_id.member_ids.length > 0 ? getColumnArrayByField(detailData.data[0].ehs_authority_id.member_ids, 'employee_id', 'id') : false;
    const approveAuthorityMembersIds = detailData && detailData.data
      && detailData.data[0].approval_authority_id
      && detailData.data[0].approval_authority_id.member_ids
      && detailData.data[0].approval_authority_id.member_ids.length > 0 ? getColumnArrayByField(detailData.data[0].approval_authority_id.member_ids, 'employee_id', 'id') : false;

    if (actionName === 'Validate' && ehsAuthorityMembersIds && !ehsAuthorityMembersIds.includes(userEmployee)) {
      allowed = true;
    } else if (actionName === 'Approve' && approveAuthorityMembersIds && !approveAuthorityMembersIds.includes(userEmployee)) {
      allowed = true;
    } else if (actionName === 'Issue Permit' && approveAuthorityMembersIds && !approveAuthorityMembersIds.includes(userEmployee)) {
      allowed = true;
    } else if (actionName === 'Review' && !checkActionAllowedReview(actionName)) {
      allowed = true;
    }
    return allowed;
  };

  useEffect(() => {
    if (selectedActions === 'Review') {
      showReviewModal(true);
    }
    if (selectedActions === 'Print PDF') {
      showPrintModal(true);
    }
    if (selectedActions === 'Extend') {
      showExtendModal(true);
    }
    if (selectedActions === 'Prepare Checklists') {
      setChecklistPrepareModal(true);
    }
    if (selectedActions === 'Perform Work Checklist') {
      setChecklistModal(true);
    }
    if (customData && customData.actionTypes && customData.actionTypes[selectedActions] && selectedActions !== 'Review') {
      setActionText(customData.actionTypes[selectedActions].text);
      setActionButton(customData.actionTypes[selectedActions].button);
      setActionValue(customData.actionTypes[selectedActions].value);
      setActionMessage(customData.actionTypes[selectedActions].msg);
      showActionModal(true);
    }
    dispatch(resetCreateProductCategory());
    dispatch(resetVisitState());
    dispatch(resetActionData());
    dispatch(resetCreateOrder());
    dispatch(resetUpdateProductCategory());
  }, [enterAction]);

  const switchActionItem = (action) => {
    dispatch(resetActionData());
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const cancelStateChange = () => {
    dispatch(resetVisitState());
    dispatch(resetActionData());
    dispatch(resetCreateOrder());
    dispatch(resetUpdateProductCategory());
    const viewId = detailData && detailData.data ? detailData.data[0].id : '';
    dispatch(getWorkPermitDetails(viewId, appModels.WORKPERMIT));
  };

  const loading = detailData && detailData.loading;
  const rfqName = detailData && detailData.data ? detailData.data[0].name : '';

  return (
    <>
      <a id="dwnldLnk" aria-hidden="true" download={`Work Permit -${rfqName}.pdf`} className="d-none" />
      {!loading && viewData && (
        <>
          <Row className="mt-3 globalModal-header-cards">
            <Col sm="12" md="3" lg="3" xs="12" className="p-0">
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny">
                        REQUESTOR
                      </p>
                      <p className="mb-0 font-weight-700">
                        {getDefaultNoValue(extractNameObject(viewData.requestor_id, 'name'))}
                      </p>
                      <span className="font-weight-500 font-tiny">
                        {getDefaultNoValue(viewData.type)}
                      </span>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={envelopeIcon} alt="asset" width="30" className="mt-3" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="3" lg="3" xs="12" className="p-0">
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny">
                        {viewData.type === 'Equipment' ? 'ASSET' : 'LOCATION'}
                      </p>
                      <p className="mb-0 font-weight-700">
                        {viewData.type === 'Equipment' ? getDefaultNoValue(extractNameObject(viewData.equipment_id, 'name')) : getDefaultNoValue(extractNameObject(viewData.space_id, 'path_name'))}
                      </p>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={viewData.type === 'Equipment' ? assetDefault : locationBlack} alt="asset" width="20" className="mt-3" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="3" lg="3" xs="12" className="p-0">
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny">
                        STATUS
                      </p>
                      <p className="mb-0 font-weight-700">
                        {getDefaultNoValue(getStateLabel(viewData.state))}
                      </p>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={logsIcon} alt="asset" width="25" className="mt-3" />
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
                                {printReportInfo && printReportInfo.loading && (
                                  <Spinner size="sm" animation="border" variant="primary" className="ml-1 mr-1" />
                                )}
                                <FontAwesomeIcon size="sm" color="primary" className="float-right ml-2 mt-1" icon={faChevronDown} />
                              </span>
                            </DropdownToggle>
                            <DropdownMenu>
                              {customData && customData.actionItems.map((actions) => (
                                allowedOperations.includes(actionCodes[actions.displayname]) && (
                                  checkActionAllowed(actions.displayname) && (
                                    <DropdownItem
                                      id="switchAction"
                                      className="pl-2"
                                      key={actions.id}
                                      disabled={checkDisable(actions.displayname)}
                                      onClick={() => switchActionItem(actions)}
                                    >
                                      <FontAwesomeIcon
                                        className="mr-2"
                                        icon={faIcons[actions.name]}
                                      />
                                      {actions.displayname}
                                    </DropdownItem>
                                  ))
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
          </Row>
          {actionModal && (
            <Action
              atFinish={() => {
                showActionModal(false); cancelStateChange(); setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              atCancel={() => {
                showActionModal(false); setSelectedActions(defaultActionText); setSelectedActionImage(''); dispatch(resetVisitState());
              }}
              actionText={getCustomButtonName(actionText, wpConfig)}
              actionButton={actionButton}
              actionMessage={actionMessage}
              actionValue={actionValue}
              details={detailData}
              actionModal
            />
          )}
          {reviewModal && (
            <ReviewWorkorder
              atFinish={() => {
                showReviewModal(false); dispatch(resetEscalate()); dispatch(resetActionData()); cancelStateChange();
                setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              atCancel={() => {
                showReviewModal(false); dispatch(resetEscalate()); dispatch(resetActionData());
                setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              detailData={detailData}
              reviewModal
            />
          )}
          {extendModal && (
            <Extend
              atFinish={() => {
                showExtendModal(false); cancelStateChange(); setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              atCancel={() => {
                showExtendModal(false); setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              details={detailData}
              actionText="Extend"
              actionButton="Extend"
              setViewModal={setViewModal}
              extendModal
            />
          )}
          {checklistPrepareModal && (
            <Checklists
              orderCheckLists={viewData.order_id && viewData.order_id.preparedness_checklist_lines ? sortSections(viewData.order_id.preparedness_checklist_lines) : []}
              detailData={viewData}
              atReject={() => onPreClose()}
              atDone={() => onDone()}
              statusInfo={statusInfo}
              spareParts={viewData.order_id && viewData.order_id.parts_lines ? viewData.order_id.parts_lines : []}
              fieldValue="preparedness_checklist_lines"
              isInternal
              token={authService.getAccessToken()}
              userId={userInfo && userInfo.data ? { id: userInfo.data.id, name: userInfo.data.name } : false}
            />
          )}
          {checklistModal && (
            <Checklists
              orderCheckLists={viewData.order_id && viewData.order_id.check_list_ids && viewData.order_id.check_list_ids.length > 0 ? sortSections(viewData.order_id.check_list_ids) : taskQuestions}
              detailData={viewData}
              atReject={() => onClose()}
              atDone={() => onWoDone()}
              statusInfo={statusInfo}
              spareParts={viewData.order_id && viewData.order_id.parts_lines ? viewData.order_id.parts_lines : []}
              fieldValue="check_list_ids"
              isInternal
              token={authService.getAccessToken()}
              userId={userInfo && userInfo.data ? { id: userInfo.data.id, name: userInfo.data.name } : false}
            />
          )}
          <Modal size="lg" className="border-radius-50px modal-dialog-centered" isOpen={isLoad}>
            <ModalHeaderComponent
              imagePath={checkCircleBlack}
              title="Checklist"
            />
            <ModalBody>
              <div className="text-center mt-4 mb-4">
                <Loader />
              </div>
            </ModalBody>
          </Modal>
        </>
      )}
    </>
  );
};

WorkPermitDetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  setViewModal: PropTypes.func.isRequired,
};

export default WorkPermitDetailInfo;
