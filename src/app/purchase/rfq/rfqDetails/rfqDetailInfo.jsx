/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import {
  ButtonDropdown,
  Card,
  CardBody,
  Col,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Modal,
  ModalBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faPrint, faEnvelope, faStoreAlt, faCheckCircle, faTimesCircle, faLock, faLockOpen, faArrowCircleDown, faFileInvoice,
  faEdit, faClock,
} from '@fortawesome/free-solid-svg-icons';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import assetMiniBlueIcon from '@images/icons/assetMiniBlue.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import SendEmail from './actionItems/sendEmail';
import SetToDraft from './actionItems/setToDraft';
import ConfirmOrder from './actionItems/confirmOrder';
import CancelQuotation from './actionItems/cancelQuotation';
import SendPoByEmail from './actionItems/sendPoByEmail';
import ResendByEmail from './actionItems/resendByEmail';
import Lock from './actionItems/lock';
import UnLock from './actionItems/unLocked';
import rfqActions from '../data/customData.json';
import AddRfq from '../addRfq';
import {
  getDefaultNoValue, generateErrorMessage, getCompanyTimezoneDate, getListOfOperations,
} from '../../../util/appUtils';
import {
  getRFqStateLabel,
} from '../utils/utils';
import {
  resetPurchaseState, resetUpdateRfqInfo, getTemplate, getQuotatioDetail, getPrintReport, resetPrint, resetTemplate, resetTemplateDetail, resetComposeEmail,
  resetActivityInfo, updateRfq, resetEmailState,
} from '../../purchaseService';
import {
  resetMessage,
} from '../../../helpdesk/ticketService';
import SendMessage from '../../utils/sendMessage';
import LogNote from '../../utils/logNote';
import AddScheduleActivity from '../../utils/addSheduleActivity/addSheduleActivity';
import AddPurchaseOrder from '../../purchaseOrder/addPurchaseOrder';
import actionCodes from '../data/actionCodes.json';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  SENDBYEMAIL: faEnvelope,
  SENDBYEMAILACTIVE: faEnvelope,
  PRINTRFQ: faPrint,
  PRINTRFQACTIVE: faPrint,
  SETTODRAFT: faStoreAlt,
  SETTODRAFTACTIVE: faStoreAlt,
  CONFIRMORDER: faCheckCircle,
  CONFIRMORDERACTIVE: faCheckCircle,
  CANCEL: faTimesCircle,
  CANCELACTIVE: faTimesCircle,
  SENDPOBYEMAIL: faEnvelope,
  SENDPOBYEMAILACTIVE: faEnvelope,
  RESENDBYEMAIL: faEnvelope,
  RESENDBYEMAILACTIVE: faEnvelope,
  LOCK: faLock,
  LOCKACTIVE: faLock,
  UNLOCK: faLockOpen,
  UNLOCKACTIVE: faLockOpen,
  RECEIVEPRODUCTS: faArrowCircleDown,
  RECEIVEPRODUCTSACTIVE: faArrowCircleDown,
  CREATEBILL: faFileInvoice,
  CREATEBILLACTIVE: faFileInvoice,
  SENDMESSAGE: faEnvelope,
  SENDMESSAGEACTIVE: faEnvelope,
  LOGNOTE: faEdit,
  LOGNOTEACTIVE: faEdit,
  SCHEDULEACTIVITY: faClock,
  SCHEDULEACTIVITYACTIVE: faClock,
};

const RfqDetailInfo = (props) => {
  const { isEdit, afterReset, isPurchaseOrder } = props;
  const dispatch = useDispatch();
  const resModelId = 722;
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const defaultActionText = isPurchaseOrder ? 'Purchase Order Actions' : 'RFQ Actions';
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [emailModal, showEmailModal] = useState(false);
  const [printModal, showPrintModal] = useState(false);
  const [draftModal, showDraftModal] = useState(false);
  const [confirmModal, showConfirmModal] = useState(false);
  const [cancelModal, showCancelModal] = useState(false);
  const [sendPoModal, showSendPoModal] = useState(false);
  const [resendModal, showResendModal] = useState(false);
  const [lockModal, showLockModal] = useState(false);
  const [unlockModal, showUnLockModal] = useState(false);
  const [billModal] = useState(false);
  const [updateModal, showUpdateModal] = useState(isEdit);
  const [transferLink, setTransferLink] = useState(isEdit);
  const [messageModal, showMessageModal] = useState(false);
  const [noteModal, showNoteModal] = useState(false);
  const [addActivityModal, setActivityModal] = useState(false);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const {
    quotationDetails, updateRfqInfo, printReportInfo,
    createActivityInfo, stateChangeInfo, backorderInfo,
  } = useSelector((state) => state.purchase);

  const {
    createMessageInfo,
  } = useSelector((state) => state.ticket);

  const {
    userInfo, userRoles,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if ((updateRfqInfo && updateRfqInfo.data) && (quotationDetails && quotationDetails.data)) {
      dispatch(getQuotatioDetail(quotationDetails.data[0].id, appModels.PURCHASEORDER));
    }
  }, [updateRfqInfo]);

  useEffect(() => {
    if ((stateChangeInfo && (stateChangeInfo.data || stateChangeInfo.status)) && (backorderInfo && (backorderInfo.data || backorderInfo.status)) && (quotationDetails && quotationDetails.data)) {
      dispatch(getQuotatioDetail(quotationDetails.data[0].id, appModels.PURCHASEORDER));
    }
  }, [stateChangeInfo, backorderInfo]);

  useEffect(() => {
    showUpdateModal(isEdit);
  }, [isEdit]);

  useEffect(() => {
    const ViewId = quotationDetails && quotationDetails.data ? quotationDetails.data[0].id : '';
    const state = quotationDetails && quotationDetails.data ? quotationDetails.data[0].state : '';
    if ((printModal || emailModal || resendModal) && ViewId) {
      dispatch(getPrintReport(ViewId, 'purchase.report_purchasequotation'));
      if (printModal && state !== 'sent') {
        const postData = { state: 'sent' };
        dispatch(updateRfq(ViewId, appModels.PURCHASEORDER, postData));
      }
      dispatch(getTemplate('Purchase Order: Send RFQ', appModels.MAILTEMPLATE));
    }
    if ((sendPoModal) && ViewId) {
      dispatch(getPrintReport(ViewId, 'purchase.report_purchaseorder'));
      dispatch(getTemplate('Purchase Order: Send PO', appModels.MAILTEMPLATE));
    }
  }, [printModal, emailModal, sendPoModal, resendModal]);

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
      dispatch(resetPurchaseState());
      dispatch(resetUpdateRfqInfo());
    }
  }, [printReportInfo]);

  const onCloseUpdate = () => {
    showUpdateModal(false);
    dispatch(resetUpdateRfqInfo());
    if (afterReset) afterReset();
  };

  const cancelPurchaseState = () => {
    dispatch(resetPurchaseState());
  };
  const cancelEmailState = () => {
    dispatch(resetComposeEmail());
    dispatch(resetEmailState());
    dispatch(resetUpdateRfqInfo());
    dispatch(resetPrint());
    dispatch(resetTemplate());
    dispatch(resetTemplateDetail());
  };

  const cancelMessage = () => {
    const viewId = quotationDetails && quotationDetails.data ? quotationDetails.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getQuotatioDetail(viewId, appModels.PURCHASEORDER));
    }
    dispatch(resetMessage());
  };

  const cancelLogNote = () => {
    const viewId = quotationDetails && quotationDetails.data ? quotationDetails.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getQuotatioDetail(viewId, appModels.PURCHASEORDER));
    }
    dispatch(resetMessage());
  };

  const cancelActivity = () => {
    const viewId = quotationDetails && quotationDetails.data ? quotationDetails.data[0].id : '';
    if (createActivityInfo && createActivityInfo.data) {
      dispatch(getQuotatioDetail(viewId, appModels.PURCHASEORDER));
    }
    dispatch(resetActivityInfo());
  };

  useEffect(() => {
    if (selectedActions === 'Send by Email') {
      showEmailModal(true);
    }
    if (selectedActions === 'Print RFQ') {
      showPrintModal(true);
    }
    if (selectedActions === 'Set to Draft') {
      showDraftModal(true);
    }
    if (selectedActions === 'Confirm Order') {
      showConfirmModal(true);
    }
    if (selectedActions === 'Cancel') {
      showCancelModal(true);
    }
    if (selectedActions === 'Send PO by Email') {
      showSendPoModal(true);
    }
    if (selectedActions === 'Re-send by Email') {
      showResendModal(true);
    }
    if (selectedActions === 'Lock') {
      showLockModal(true);
    }
    if (selectedActions === 'Unlock') {
      showUnLockModal(true);
    }
    if (selectedActions === 'Receive Products') {
      setTransferLink(true);
    }
    if (selectedActions === 'Send Message') {
      showMessageModal(true);
    }
    if (selectedActions === 'Log Note') {
      showNoteModal(true);
    }
    if (selectedActions === 'Schedule Activity') {
      setActivityModal(true);
    }
  }, [enterAction]);

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const rfqState = quotationDetails && quotationDetails.data ? quotationDetails.data[0].state : '';
    const rfqPickingCount = quotationDetails && quotationDetails.data ? quotationDetails.data[0].picking_count : 0;

    if (actionName === 'Set to Draft' && rfqState !== 'cancel') {
      allowed = false;
    }
    if ((actionName === 'Send by Email') && rfqState !== 'draft') {
      allowed = false;
    }
    if ((actionName === 'Print RFQ') && (rfqState !== 'draft' && rfqState !== 'sent')) {
      allowed = false;
    }
    if ((actionName === 'Confirm Order') && (rfqState !== 'draft' && rfqState !== 'sent')) {
      allowed = false;
    }
    if ((rfqState === 'done' || rfqState === 'cancel') && actionName === 'Cancel') {
      allowed = false;
    }
    if (actionName === 'Re-send by Email' && (rfqState !== 'sent')) {
      allowed = false;
    }
    if (actionName === 'Unlock' && (rfqState !== 'done')) {
      allowed = false;
    }
    if ((actionName === 'Lock' || actionName === 'Send PO by Email') && (rfqState !== 'purchase')) {
      allowed = false;
    }
    if ((actionName === 'Lock' || actionName === 'Send PO by Email') && (rfqState !== 'purchase')) {
      allowed = false;
    }
    if ((actionName === 'Receive Products') && rfqPickingCount === 0 && (rfqState !== 'purchase' || rfqState !== 'done')) {
      allowed = false;
    }
    if ((actionName === 'Create Bill') && (rfqState !== 'purchase')) {
      allowed = false;
    }
    return allowed;
  };

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const quotationData = quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0) ? quotationDetails.data[0] : '';

  const rfqId = quotationDetails && quotationDetails.data ? quotationDetails.data[0].id : '';
  const rfqName = quotationDetails && quotationDetails.data ? quotationDetails.data[0].name : '';
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  if (transferLink) {
    if (isPurchaseOrder) {
      return (
        <Redirect to={`/purchase/purchaseorder/receiveProducts/${rfqId}`} />
      );
    }
    return (
      <Redirect to={`/purchase/requestforquotation/receiveProducts/${rfqId}`} />
    );
  }

  return (
    <>
      <Card className="border-0 h-100">
        <a id="dwnldLnk" aria-hidden="true" download={`Request for Quotation -${rfqName}.pdf`} className="d-none" />
        {quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0) && (
          <CardBody data-testid="success-case">
            <Row>
              <Col md="8" xs="8" sm="8" lg="8">
                <h4 className="mb-1 font-weight-800 font-medium" title={quotationData.name}>{quotationData.name}</h4>
                <p className="mb-1 font-weight-400 mt-1 font-tiny">
                  {getDefaultNoValue(quotationDetails.data[0].partner_id ? quotationDetails.data[0].partner_id[1] : '')}
                </p>
                {getRFqStateLabel(quotationData.state)}
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-center">
                <img src={assetMiniBlueIcon} alt="asset" className="m-0" width="35" height="35" />
              </Col>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-3">ACTIONS</span>
            </Row>
            <Row>
              <Col md="12" xs="12" sm="12" lg="12">
                <CardBody className="p-1">
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12">
                      <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="mr-3 w-100  actionDropdown">
                        <DropdownToggle caret className={selectedActionImage !== '' ? 'bg-white text-navy-blue pt-1 pb-1 text-left' : 'btn-navyblue pt-1 pb-1 text-left'}>
                          {selectedActionImage !== ''
                            ? (
                              <FontAwesomeIcon
                                className="mr-2"
                                color="primary"
                                icon={faIcons[`${selectedActionImage}ACTIVE`]}
                              />
                            ) : ''}
                          <span className="font-weight-700">
                            {selectedActions}
                            <FontAwesomeIcon size="sm" color="primary" className="float-right mt-1" icon={faChevronDown} />
                          </span>
                        </DropdownToggle>
                        <DropdownMenu className="w-100">
                          {rfqActions && rfqActions.actionItems.map((actions) => (
                            allowedOperations.includes(actionCodes[actions.displayname]) && (
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
                              ))))}
                        </DropdownMenu>
                      </ButtonDropdown>
                    </Col>
                  </Row>
                </CardBody>
              </Col>
            </Row>
            {printModal && printReportInfo && printReportInfo.loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
            )}
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-3">
                {isPurchaseOrder ? 'PURCHASE ORDER INFO' : 'RFQ INFO'}
              </span>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Vendor Reference
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(quotationDetails.data[0].partner_ref)}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Order Date
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getCompanyTimezoneDate(quotationDetails.data[0].date_order, userInfo, 'datetime')}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Deliver To
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(quotationDetails.data[0].picking_type_id ? quotationDetails.data[0].picking_type_id[1] : '')}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Company
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(quotationDetails.data[0].company_id ? quotationDetails.data[0].company_id[1] : '')}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {isPurchaseOrder && (
              <>
                <Row className="pb-2">
                  <Col md="12" xs="12" sm="12" lg="12">
                    <Card className="bg-lightblue">
                      <CardBody className="p-1">
                        <p className="font-weight-400 mb-1 ml-1">
                          Purchase Agreement
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(quotationDetails.data[0].requisition_id ? quotationDetails.data[0].requisition_id[1] : '')}
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row className="pb-2">
                  <Col md="12" xs="12" sm="12" lg="12">
                    <Card className="bg-lightblue">
                      <CardBody className="p-1">
                        <p className="font-weight-400 mb-1 ml-1">
                          Purchase Request
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(quotationDetails.data[0].request_id ? quotationDetails.data[0].request_id[1] : '')}
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </CardBody>
        )}
        {quotationDetails && quotationDetails.loading && (
          <CardBody className="mt-4" data-testid="loading-case">
            <Loader />
          </CardBody>
        )}
        {(quotationDetails && quotationDetails.err) && (
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(quotationDetails)} />
          </CardBody>
        )}
      </Card>
      {emailModal && (
        <SendEmail
          atFinish={() => {
            showEmailModal(false); cancelEmailState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          quotationDetails={quotationDetails}
          emailModal
        />
      )}
      {draftModal && (
        <SetToDraft
          atFinish={() => {
            showDraftModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          quotationDetails={quotationDetails}
          draftModal
        />
      )}
      {confirmModal && (
        <ConfirmOrder
          atFinish={() => {
            showConfirmModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          quotationDetails={quotationDetails}
          confirmModal
        />
      )}
      {cancelModal && (
        <CancelQuotation
          atFinish={() => {
            showCancelModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          quotationDetails={quotationDetails}
          cancelModal
        />
      )}
      {sendPoModal && (
        <SendPoByEmail
          atFinish={() => {
            showSendPoModal(false); cancelEmailState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          quotationDetails={quotationDetails}
          sendPoModal
        />
      )}
      {resendModal && (
        <ResendByEmail
          atFinish={() => {
            showResendModal(false); cancelEmailState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          quotationDetails={quotationDetails}
          resendModal
        />
      )}
      {lockModal && (
        <Lock
          atFinish={() => {
            showLockModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          quotationDetails={quotationDetails}
          lockModal
        />
      )}
      {unlockModal && (
        <UnLock
          atFinish={() => {
            showUnLockModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          quotationDetails={quotationDetails}
          unlockModal
        />
      )}
      {billModal && (
        {/* <UnLock
          atFinish={() => {
            showBillModal(false); cancelPurchaseState();  setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          quotationDetails={quotationDetails}
          billModal
        />8 */}
      )}
      {messageModal && (
      <SendMessage
        atFinish={() => {
          showMessageModal(false); cancelMessage();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        modalName={appModels.PURCHASEORDER}
        title="Send Message"
        subTitle={quotationDetails && quotationDetails.data ? quotationDetails.data[0].name : ''}
        detail={quotationDetails}
        messageModal
      />
      )}
      {noteModal && (
      <LogNote
        atFinish={() => {
          showNoteModal(false); cancelLogNote();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        modalName={appModels.PURCHASEORDER}
        title="Log Note"
        subTitle={quotationDetails && quotationDetails.data ? quotationDetails.data[0].name : ''}
        detail={quotationDetails}
        noteModal
      />
      )}
      <Modal size={(createActivityInfo && createActivityInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addActivityModal}>
        <ModalHeaderComponent
          title="Add Schedule Activity"
          imagePath={false}
          closeModalWindow={() => { setActivityModal(false); cancelActivity(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
          response={createActivityInfo}
        />
        <ModalBody className="mt-0 pt-0">
          <AddScheduleActivity
            detail={quotationDetails}
            modalName={appModels.PURCHASEORDER}
            resModelId={resModelId}
            afterReset={() => { setActivityModal(false); cancelActivity(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
          />
        </ModalBody>
      </Modal>
      <Modal size={(updateRfqInfo && updateRfqInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={updateModal}>
        <ModalHeaderComponent title={isPurchaseOrder ? 'Edit Purchase Order' : 'Edit RFQ'} imagePath={false} closeModalWindow={onCloseUpdate} response={updateRfqInfo} />
        <ModalBody className="mt-0 pt-0">
          {isPurchaseOrder ? (
            <AddPurchaseOrder
              editId={(quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0) ? quotationDetails.data[0].id : false)}
              afterReset={() => { onCloseUpdate(); }}
            />
          ) : (
            <AddRfq
              editId={(quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0) ? quotationDetails.data[0].id : false)}
              afterReset={() => { onCloseUpdate(); }}
              purchaseAgreementId={false}
              vendorId={false}
            />
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

RfqDetailInfo.defaultProps = {
  isPurchaseOrder: false,
};

RfqDetailInfo.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  afterReset: PropTypes.func.isRequired,
  isPurchaseOrder: PropTypes.bool,
};

export default RfqDetailInfo;
