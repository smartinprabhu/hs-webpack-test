/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, faClock, faEnvelope, faCheckCircle, faStoreAlt, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';

import ErrorContent from '@shared/errorContent';
import assetMiniBlueIcon from '@images/icons/assetMiniBlue.svg';
import Loader from '@shared/loading';
import SetToDraft from './actionItems/setToDraft';
import ConfirmOrder from './actionItems/confirmOrder';
import CancelRequest from './actionItems/cancelRequest';
import {
  getDefaultNoValue, generateErrorMessage, extractTextObject, getListOfOperations,
} from '../../../util/appUtils';
import { resetPurchaseState } from '../../purchaseService';
import requestActions from '../data/customData.json';
import actionCodes from '../data/actionCodes.json';

const faIcons = {
  SETTODRAFT: faStoreAlt,
  SETTODRAFTACTIVE: faStoreAlt,
  CONFIRMORDER: faCheckCircle,
  CONFIRMORDERACTIVE: faCheckCircle,
  CANCEL: faTimesCircle,
  CANCELACTIVE: faTimesCircle,
  SENDMESSAGE: faEnvelope,
  SENDMESSAGEACTIVE: faEnvelope,
  LOGNOTE: faEdit,
  LOGNOTEACTIVE: faEdit,
  SCHEDULEACTIVITY: faClock,
  SCHEDULEACTIVITYACTIVE: faClock,
};

const DetailInfo = (props) => {
  const {
    detail,
  } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Purchase Request Actions';
  const [modal, setModal] = useState(false);
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [draftModal, showDraftModal] = useState(false);
  const [confirmModal, showConfirmModal] = useState(false);
  const [cancelModal, showCancelModal] = useState(false);

  const {
    userRoles,
  } = useSelector((state) => state.user);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  useEffect(() => {
    if (selectedActions === 'Set to Draft') {
      showDraftModal(true);
    }
    if (selectedActions === 'Confirm Order') {
      showConfirmModal(true);
    }
    if (selectedActions === 'Cancel') {
      showCancelModal(true);
    }
  }, [enterAction]);

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const prState = detail && detail.data ? detail.data[0].state : '';

    if (actionName === 'Set to Draft' && prState !== 'cancel') {
      allowed = false;
    }
    if ((actionName === 'Confirm Order') && (prState !== 'draft')) {
      allowed = false;
    }
    if (actionName === 'Cancel' && (prState !== 'draft' && prState !== 'confirm')) {
      allowed = false;
    }
    return allowed;
  };

  const toggle = () => {
    setModal(!modal);
  };

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setEnterAction(Math.random());
  };

  const cancelPurchaseState = () => {
    dispatch(resetPurchaseState());
  };

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  return (
    <>
      <Card className="border-0">
        {detail && (detail.data && detail.data.length > 0) && (
          <CardBody data-testid="success-case">
            <Row>
              <Col sm="12" md="12" xs="12" lg="6">
                {requestActions && requestActions.actionItems.map((actions) => (
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
                  )))}
              </Col>
              <Col sm="12" md="12" xs="12" lg="6" className="text-right">
                {requestActions && requestActions.statusTypes.map((st) => (
                  <span key={st.value} className={detailData.state === st.value ? 'font-tiny text-info mr-3 font-weight-800' : 'font-tiny mr-3 tab_nav_link'}>{st.label}</span>
                ))}
              </Col>
            </Row>
            <hr />
            <h5 className="ml-3">
              {getDefaultNoValue(detailData.requisition_name)}
              {' '}
              {'( '}
              {(getDefaultNoValue(detailData.pr_id))}
              {'  )'}
            </h5>
            <Row className="ml-1 mr-1 mt-3">
              <Col sm="12" md="12" xs="12" lg="6">
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-roman-silver">Projects</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.project_id))}</span>
                </Row>
                <hr className="mt-0" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-roman-silver">Accounts</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.account_id))}</span>
                </Row>
                <hr className="mt-0" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-roman-silver">Location</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.location_id))}</span>
                </Row>
                <hr className="mt-0" />
              </Col>
              <Col sm="12" md="12" xs="12" lg="6">
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-roman-silver">Budget</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.budget_id))}</span>
                </Row>
                <hr className="mt-0" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-roman-silver">Sub Category</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.sub_category_id))}</span>
                </Row>
                <hr className="mt-0" />
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-roman-silver">Vendor</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.partner_id))}</span>
                </Row>
                <hr className="mt-0" />
              </Col>
            </Row>
            <Modal isOpen={modal} size="lg">
              <ModalHeader toggle={toggle}>{detailData.name}</ModalHeader>
              <ModalBody>
                <img
                  src={detailData.image_medium ? `data:image/png;base64,${detailData.image_medium}` : assetMiniBlueIcon}
                  alt={detailData.name}
                  width="100%"
                  height="100%"
                  aria-hidden="true"
                />
              </ModalBody>
            </Modal>
          </CardBody>
        )}
        {detail && detail.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
        )}
        {(detail && detail.err) && (
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(detail)} />
          </CardBody>
        )}
        {draftModal && (
          <SetToDraft
            atFinish={() => {
              showDraftModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText);
            }}
            detail={detail}
            draftModal
          />
        )}
        {confirmModal && (
        <ConfirmOrder
          atFinish={() => {
            showConfirmModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText);
          }}
          detail={detail}
          confirmModal
        />
        )}
        {cancelModal && (
        <CancelRequest
          atFinish={() => {
            showCancelModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText);
          }}
          detail={detail}
          cancelModal
        />
        )}
      </Card>
    </>
  );
};

DetailInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default DetailInfo;
