/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPrint, faEnvelope, faStoreAlt, faCheckCircle, faTimesCircle, faLock, faLockOpen, faArrowCircleDown, faFileInvoice,
} from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';
import { Drawer } from 'antd';

import DetailViewFormat from '@shared/detailViewFormat';
import Loader from '@shared/loading';
import DrawerHeader from '@shared/drawerHeader';
import PurchaseHandBlue from '@images/icons/purchaseHandBlue.svg';

import {
  resetPurchaseState, resetUpdateRfqInfo, getTemplate, getQuotatioDetail, getPrintReport, resetPrint, resetTemplate, resetTemplateDetail, resetComposeEmail,
  updateRfq, resetEmailState, getTransferFilters,
} from '../../purchaseService';
import {
  getDefaultNoValue,
  extractTextObject, getCompanyTimezoneDate, getListOfOperations,
} from '../../../util/appUtils';
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
import AddPurchaseOrder from '../../purchaseOrder/addPurchaseOrder';
import actionCodes from '../data/actionCodes.json';

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
};

const appModels = require('../../../util/appModels').default;

const DetailInfo = (props) => {
  const {
    detail, isEdit, afterReset, isPurchaseOrder,
  } = props;
  const dispatch = useDispatch();
  const defaultActionText = isPurchaseOrder ? 'Purchase Order Actions' : 'RFQ Actions';
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
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

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    updateRfqInfo, printReportInfo,
    stateChangeInfo, backorderInfo,
  } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  useEffect(() => {
    if ((updateRfqInfo && updateRfqInfo.data) && (detail && detail.data)) {
      dispatch(getQuotatioDetail(detail.data[0].id, appModels.PURCHASEORDER));
    }
  }, [updateRfqInfo]);

  useEffect(() => {
    if ((stateChangeInfo && (stateChangeInfo.data || stateChangeInfo.status)) && (backorderInfo && (backorderInfo.data || backorderInfo.status)) && (detail && detail.data)) {
      dispatch(getQuotatioDetail(detail.data[0].id, appModels.PURCHASEORDER));
    }
  }, [stateChangeInfo, backorderInfo]);

  useEffect(() => {
    showUpdateModal(isEdit);
  }, [isEdit]);

  useEffect(() => {
    const ViewId = detail && detail.data ? detail.data[0].id : '';
    const state = detail && detail.data ? detail.data[0].state : '';
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
      dispatch(getTransferFilters([], [], [], []));
      setTransferLink(true);
    }
  }, [enterAction]);

  useEffect(() => {
    if (printModal && printReportInfo && printReportInfo.data) {
      const pdfBase64 = printReportInfo.data.content;
      const dlnk = document.getElementById('dwnldLnk');
      dlnk.href = `data:application/octet-stream;base64,${pdfBase64}`;
      dlnk.click();
      setSelectedActions(defaultActionText);
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

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const rfqState = detail && detail.data ? detail.data[0].state : '';
    const rfqPickingCount = detail && detail.data ? detail.data[0].picking_count : 0;

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
    setEnterAction(Math.random());
  };

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  const rfqId = detail && detail.data ? detail.data[0].id : '';
  const rfqName = detail && detail.data ? detail.data[0].name : '';

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
    <Card className="border-0">
      <a id="dwnldLnk" aria-hidden="true" download={`Request for Quotation -${rfqName}.pdf`} className="d-none" />
      {detailData && (
      <CardBody>
        <Row>
          <Col sm="12" md="12" xs="12" lg="6">
            {rfqActions && rfqActions.actionItems.map((actions) => (
              allowedOperations.includes(actionCodes[actions.displayname]) && (
                checkActionAllowed(actions.displayname) && (
                  <span
                    aria-hidden="true"
                    id="switchAction"
                    className={actions.displayname === selectedActions ? 'text-info pl-2 cursor-pointer font-tiny' : 'font-tiny pl-2 cursor-pointer font-weight-400'}
                    key={actions.id}
                    onClick={() => switchActionItem(actions)}
                  >
                    <FontAwesomeIcon
                      className={actions.displayname === selectedActions ? 'text-info mr-2 font-tiny' : 'mr-2 font-tiny'}
                      color="info"
                      icon={faIcons[actions.name]}
                    />
                    {actions.displayname}
                  </span>
                )
              )
            ))}
          </Col>
          {!isPurchaseOrder && (
          <Col sm="12" md="12" xs="12" lg="6" className="text-right">
            {rfqActions && rfqActions.statusTypes.map((st) => (
              <span key={st.value} className={detailData.state === st.value ? 'font-tiny text-info mr-3 font-weight-800' : 'font-tiny mr-3 tab_nav_link'}>{st.label}</span>
            ))}
          </Col>
          )}
          {isPurchaseOrder && (
          <Col sm="12" md="12" xs="12" lg="6" className="text-right">
            {rfqActions && rfqActions.poStatusTypes.map((st) => (
              <span key={st.value} className={detailData.state === st.value ? 'font-tiny text-info mr-3 font-weight-800' : 'font-tiny mr-3 tab_nav_link'}>{st.label}</span>
            ))}
          </Col>
          )}
        </Row>
        {printModal && printReportInfo && printReportInfo.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
        )}
        <hr />
        <h5 className="ml-3">{getDefaultNoValue(detailData.name)}</h5>
        <Row className="ml-1 mr-1 mt-3">
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Partner</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.partner_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Vendor Reference</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.partner_ref)}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Company</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
            </Row>
            <hr className="mt-0" />
            {isPurchaseOrder && (
              <>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-roman-silver">Purchase Agreement</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.requisition_id))}</span>
                </Row>
                <hr className="mt-0" />
              </>
            )}
          </Col>
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Order Date</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(getCompanyTimezoneDate(detailData.date_order, userInfo, 'datetime'))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Deliver To</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.picking_type_id))}</span>
            </Row>
            <hr className="mt-0" />
            {isPurchaseOrder && (
              <>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-roman-silver">Purchase Request</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.request_id))}</span>
                </Row>
                <hr className="mt-0" />
              </>
            )}
          </Col>
        </Row>
      </CardBody>
      )}
      {emailModal && (
        <SendEmail
          atFinish={() => {
            showEmailModal(false); cancelEmailState(); setSelectedActions(defaultActionText);
          }}
          quotationDetails={detail}
          emailModal
        />
      )}
      {draftModal && (
        <SetToDraft
          atFinish={() => {
            showDraftModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText);
          }}
          quotationDetails={detail}
          draftModal
        />
      )}
      {confirmModal && (
        <ConfirmOrder
          atFinish={() => {
            showConfirmModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText);
          }}
          quotationDetails={detail}
          confirmModal
        />
      )}
      {cancelModal && (
        <CancelQuotation
          atFinish={() => {
            showCancelModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText);
          }}
          quotationDetails={detail}
          cancelModal
        />
      )}
      {sendPoModal && (
        <SendPoByEmail
          atFinish={() => {
            showSendPoModal(false); cancelEmailState(); setSelectedActions(defaultActionText);
          }}
          quotationDetails={detail}
          sendPoModal
        />
      )}
      {resendModal && (
        <ResendByEmail
          atFinish={() => {
            showResendModal(false); cancelEmailState(); setSelectedActions(defaultActionText);
          }}
          quotationDetails={detail}
          resendModal
        />
      )}
      {lockModal && (
        <Lock
          atFinish={() => {
            showLockModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText);
          }}
          quotationDetails={detail}
          lockModal
        />
      )}
      {unlockModal && (
        <UnLock
          atFinish={() => {
            showUnLockModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText);
          }}
          quotationDetails={detail}
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
      {/* <Modal size={(updateRfqInfo && updateRfqInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={updateModal}>
        <ModalHeaderComponent title={isPurchaseOrder ? 'Edit Purchase Order' : 'Edit RFQ'} imagePath={false} closeModalWindow={onCloseUpdate} response={updateRfqInfo} />
        <ModalBody className="mt-0 pt-0">
          {isPurchaseOrder ? (
            <AddPurchaseOrder
              editId={(detail && (detail.data && detail.data.length > 0) ? detail.data[0].id : false)}
              afterReset={() => { onCloseUpdate(); }}
            />
          ) : (
            <AddRfq
              editId={(detail && (detail.data && detail.data.length > 0) ? detail.data[0].id : false)}
              afterReset={() => { onCloseUpdate(); }}
              purchaseAgreementId={false}
              vendorId={false}
            />
          )}
        </ModalBody>
          </Modal> */}
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={1250}
        visible={updateModal}
      >

        <DrawerHeader
          title={isPurchaseOrder ? 'Edit Purchase Order' : 'Edit RFQ'}
          imagePath={PurchaseHandBlue}
          closeDrawer={() => onCloseUpdate()}
        />
        {isPurchaseOrder ? (
          <AddPurchaseOrder
            editId={(detail && (detail.data && detail.data.length > 0) ? detail.data[0].id : false)}
            afterReset={() => { onCloseUpdate(); }}
            closeEditModal={() => { showUpdateModal(false); }}
          />
        ) : (
          <AddRfq
            editId={(detail && (detail.data && detail.data.length > 0) ? detail.data[0].id : false)}
            afterReset={() => { onCloseUpdate(); }}
            closeEditModal={() => { showUpdateModal(false); }}
            purchaseAgreementId={false}
            vendorId={false}
          />
        )}
      </Drawer>
      <DetailViewFormat detailResponse={detail} />
    </Card>
  );
};

DetailInfo.defaultProps = {
  isPurchaseOrder: false,
};

DetailInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  isEdit: PropTypes.bool.isRequired,
  afterReset: PropTypes.func.isRequired,
  isPurchaseOrder: PropTypes.bool,
};
export default DetailInfo;
