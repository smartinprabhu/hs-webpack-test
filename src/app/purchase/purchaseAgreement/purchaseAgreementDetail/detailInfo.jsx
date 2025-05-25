/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal, ModalBody, ModalFooter, Button,
  Badge,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import '../../purchase.scss';
import DetailViewFormat from '@shared/detailViewFormat';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faFile, faTimesCircle, faWindowClose, faCheck, faStoreAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue,
  extractTextObject, getCompanyTimezoneDate, getListOfModuleOperations,
} from '../../../util/appUtils';
import { getPartsData } from '../../../preventiveMaintenance/ppmService';
import {
  resetAgreementState, getQuotationFilters, setIsRequestQuotation, resetAddRfqInfo,
} from '../../purchaseService';
import customData from '../data/customData.json';
import Action from './actionItems/actionPurchaseAgreement';
import AddRfq from '../../rfq/addRfq';
import actionCodes from '../data/actionCodes.json';

const faIcons = {
  NEWQUOTATION: faFile,
  NEWQUOTATIONACTIVE: faFile,
  VALIDATE: faCheck,
  VALIDATEACTIVE: faCheck,
  CONFIRMORDER: faCheckCircle,
  CONFIRMORDERACTIVE: faCheckCircle,
  CANCEL: faTimesCircle,
  CANCELACTIVE: faTimesCircle,
  CLOSE: faWindowClose,
  CLOSEACTIVE: faWindowClose,
  RESETTODRAFT: faStoreAlt,
  RESETTODRAFTACTIVE: faStoreAlt,
  REQUESTFORQUOTATION: faFile,
  REQUESTFORQUOTATIONACTIVE: faFile,
};

const DetailInfo = (props) => {
  const {
    detail,
  } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Purchase Agreement Actions';
  const [enterAction, setEnterAction] = useState(false);
  const [actionModal, showActionModal] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionButton, setActionButton] = useState('');
  const [transferLink, setTransferLink] = useState('');
  const [addRfqModal, showAddRfqModal] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'code');
  const { addRfqInfo } = useSelector((state) => state.purchase);

  const onReset = () => {
    dispatch(resetAddRfqInfo());
    dispatch(getPartsData([]));
  };

  const toggleAlert = () => {
    setModalAlert(false);
  };

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const agreeState = detail && detail.data ? detail.data[0].state : '';
    const cancelInvisibleState = ['draft', 'in_progress', 'ongoing'];
    const closeInvisibleState = ['open', 'ongoing'];
    const newQuotationInvisibleState = ['open', 'in_progress', 'ongoing'];

    if (actionName === 'New Quotation') {
      if (!newQuotationInvisibleState.includes(agreeState)) {
        allowed = false;
      }
    }
    if (actionName === 'Validate') {
      if (agreeState !== 'in_progress') {
        allowed = false;
      }
    }
    if (actionName === 'Confirm Order') {
      if (agreeState !== 'draft') {
        allowed = false;
      }
    }
    if (actionName === 'Cancel') {
      if (!cancelInvisibleState.includes(agreeState)) {
        allowed = false;
      }
    }
    if (actionName === 'Close') {
      if (!closeInvisibleState.includes(agreeState)) {
        allowed = false;
      }
    }
    if (actionName === 'Reset to Draft') {
      if (agreeState !== 'cancel') {
        allowed = false;
      }
    }
    if (actionName === 'Request for Quotation/ Orders') {
      if (agreeState === 'draft') {
        allowed = false;
      }
    }
    return allowed;
  };

  const checkStateAllowed = (stateName) => {
    let allowed = false;
    const agreeState = detail && detail.data ? detail.data[0].state : '';
    const draftVisibleState = ['draft', 'done', 'ongoing'];
    const openVisibleState = ['draft', 'done', 'ongoing', 'open'];
    const inProgressVisibleState = ['draft', 'done', 'ongoing', 'in_progress'];
    const cancelVisibleState = ['draft', 'done', 'cancel', 'in_progress', 'open'];

    if (agreeState === 'draft' || agreeState === 'ongoing' || agreeState === 'done') {
      if (draftVisibleState.includes(stateName)) {
        allowed = true;
      }
    } else if (agreeState === 'open') {
      if (openVisibleState.includes(stateName)) {
        allowed = true;
      }
    } else if (agreeState === 'in_progress') {
      if (inProgressVisibleState.includes(stateName)) {
        allowed = true;
      }
    } else if (agreeState === 'cancel') {
      if (cancelVisibleState.includes(stateName)) {
        allowed = true;
      }
    }
    return allowed;
  };

  const onLoadPurchaseOrders = () => {
    if (detail && detail.data && detail.data.length) {
      const filters = [{
        key: 'requisition_id',
        value: detail.data[0].id,
        label: detail.data[0].name,
        type: 'ids',
      }];

      dispatch(getQuotationFilters([], [], [], filters));
      dispatch(setIsRequestQuotation(true));
    }
  };

  useEffect(() => {
    if (customData && customData.actionTypes && customData.actionTypes[selectedActions]) {
      if (selectedActions === 'New Quotation') {
        const detailDataPurchaseAgreement = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';
        if (detailDataPurchaseAgreement.vendor_id) {
          showAddRfqModal(true);
        } else {
          setModalAlert(true);
        }
      } else if (selectedActions === 'Request for Quotation/ Orders') {
        setTransferLink(true);
        onLoadPurchaseOrders();
      } else {
        setActionText(customData.actionTypes[selectedActions].text);
        setActionCode(customData.actionTypes[selectedActions].value);
        setActionMessage(customData.actionTypes[selectedActions].msg);
        setActionButton(customData.actionTypes[selectedActions].button);
        showActionModal(true);
      }
    }
  }, [enterAction]);

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setEnterAction(Math.random());
  };

  const cancelStateChange = () => {
    dispatch(resetAgreementState());
  };

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';
  const orderCount = detail && (detail.data && detail.data.length > 0) && detail.data[0] && detail.data[0].order_count ? detail.data[0].order_count : '0';

  if (transferLink) {
    return (
      <Redirect to="/purchase/requestforquotation" />
    );
  }

  return (
    <Card className="border-0">
      {detailData && (
        <CardBody>
          <Row>
            <Col sm="12" md="12" xs="12" lg="7">
              {customData && customData.actionItems.map((actions) => (
                allowedOperations.includes(actionCodes[actions.displayname]) && (
                  checkActionAllowed(actions.displayname) && (
                  <span
                    aria-hidden="true"
                    id="switchAction"
                    className={actions.displayname === selectedActions ? 'text-info pr-2 cursor-pointer font-tiny' : 'pr-2 cursor-pointer font-weight-400 font-tiny'}
                    key={actions.id}
                    onClick={() => switchActionItem(actions)}
                  >
                    <FontAwesomeIcon
                      className={actions.displayname === selectedActions ? 'text-info mr-1 font-tiny' : 'mr-1 font-tiny'}
                      color="info"
                      icon={faIcons[actions.name]}
                    />
                      {actions.displayname}
                    {actions.displayname === 'Request for Quotation/ Orders' ? <Badge color="warning" className="ml-1 order-count">{orderCount}</Badge> : ''}
                  </span>
                  )
                )))}
            </Col>
            <Col sm="12" md="12" xs="12" lg="5" className="text-right">
              {customData && customData.agreeStates.map((st) => (
                checkStateAllowed(st.value) && (
                <span key={st.value} className={detailData.state === st.value ? 'text-info mr-3 font-weight-800 badge-text' : 'mr-3 tab_nav_link badge-text'}>{st.label}</span>
                )))}
            </Col>
          </Row>
          <Row className="ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Purchase Representative</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(extractTextObject(detailData.user_id))}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Agreement Type</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(extractTextObject(detailData.type_id))}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Vendor</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(extractTextObject(detailData.vendor_id))}
                </span>
              </Row>
              <hr className="mt-0" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Agreement Deadline</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">
                  {' '}
                  {getDefaultNoValue(getCompanyTimezoneDate(detailData.date_end, userInfo, 'datetime'))}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Ordering Date</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">
                  {' '}
                  {getDefaultNoValue(getCompanyTimezoneDate(detailData.ordering_date, userInfo, 'datetime'))}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Scheduled Date</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">
                  {' '}
                  {getDefaultNoValue(getCompanyTimezoneDate(detailData.schedule_date, userInfo, 'datetime'))}
                </span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Source Document</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(detailData.origin)}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Company</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
              </Row>
              <hr className="mt-0" />
            </Col>
          </Row>
        </CardBody>
      )}
      {actionModal && (
      <Action
        atFinish={() => {
          showActionModal(false); cancelStateChange(); setSelectedActions(defaultActionText);
        }}
        actionText={actionText}
        actionCode={actionCode}
        actionMessage={actionMessage}
        actionButton={actionButton}
        details={detail}
        actionModal
      />
      )}
      <DetailViewFormat detailResponse={detail} />
      <Modal className="border-radius-50px modal-dialog-centered purchase-modal" size={(addRfqInfo && addRfqInfo.data) ? 'sm' : 'xl'} isOpen={addRfqModal}>
        <ModalHeaderComponent title="Add RFQ" imagePath={false} closeModalWindow={() => { showAddRfqModal(false); onReset(); }} response={addRfqInfo} />
        <ModalBody className="mt-0 pt-0">
          <AddRfq
            afterReset={() => { showAddRfqModal(false); onReset(); }}
            purchaseAgreementId={[detailData.id, detailData.name]}
            vendorId={detailData.vendor_id}
          />
        </ModalBody>
      </Modal>
      <Modal isOpen={modalAlert} toggle={toggleAlert} size="sm">
        <ModalHeaderComponent size="sm" title="Alert" closeModalWindow={toggleAlert} />
        <hr className="m-0" />
        <ModalBody>
          Vendor is required to create new quotation.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => { setModalAlert(false); }}>Ok</Button>
        </ModalFooter>
      </Modal>
    </Card>

  );
};

DetailInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DetailInfo;
