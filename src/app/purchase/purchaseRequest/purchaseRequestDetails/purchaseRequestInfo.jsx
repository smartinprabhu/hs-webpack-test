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
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faEdit, faClock, faEnvelope, faCheckCircle, faStoreAlt, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import envelopeIcon from '@images/icons/envelope.svg';
import ErrorContent from '@shared/errorContent';
import assetMiniBlueIcon from '@images/icons/assetMiniBlue.svg';
import Loader from '@shared/loading';
import SetToDraft from './actionItems/setToDraft';
import ConfirmOrder from './actionItems/confirmOrder';
import CancelRequest from './actionItems/cancelRequest';
import {
  getDefaultNoValue, generateErrorMessage, getListOfOperations,
} from '../../../util/appUtils';
import {
  getPurchaseRequestDetail,
  resetActivityInfo, resetPurchaseState,
} from '../../purchaseService';
import requestActions from '../data/customData.json';
import {
  resetMessage,
} from '../../../helpdesk/ticketService';
import SendMessage from '../../utils/sendMessage';
import LogNote from '../../utils/logNote';
import {
  getRequestStateLabel,
} from '../utils/utils';
import AddScheduleActivity from '../../utils/addSheduleActivity/addSheduleActivity';
import actionCodes from '../data/actionCodes.json';

const appModels = require('../../../util/appModels').default;

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

const PurchaseRequestInfo = () => {
  const dispatch = useDispatch();
  const defaultActionText = 'Purchase Request Actions';
  const resModelId = 74;
  const [seeMore, setMore] = useState(false);
  const [modal, setModal] = useState(false);
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [messageModal, showMessageModal] = useState(false);
  const [noteModal, showNoteModal] = useState(false);
  const [addActivityModal, setActivityModal] = useState(false);
  const [draftModal, showDraftModal] = useState(false);
  const [confirmModal, showConfirmModal] = useState(false);
  const [cancelModal, showCancelModal] = useState(false);

  const {
    requestDetails,
    createActivityInfo,
  } = useSelector((state) => state.purchase);
  const {
    userRoles,
  } = useSelector((state) => state.user);
  const {
    createMessageInfo,
  } = useSelector((state) => state.ticket);

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
    const prState = requestDetails && requestDetails.data ? requestDetails.data[0].state : '';

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

  const cancelMessage = () => {
    const viewId = requestDetails && requestDetails.data ? requestDetails.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getPurchaseRequestDetail(viewId, appModels.PURCHASEREQUEST));
    }
    dispatch(resetMessage());
  };

  const cancelLogNote = () => {
    const viewId = requestDetails && requestDetails.data ? requestDetails.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getPurchaseRequestDetail(viewId, appModels.PURCHASEREQUEST));
    }
    dispatch(resetMessage());
  };

  const cancelActivity = () => {
    const viewId = requestDetails && requestDetails.data ? requestDetails.data[0].id : '';
    if (createActivityInfo && createActivityInfo.data) {
      dispatch(getPurchaseRequestDetail(viewId, appModels.PURCHASEREQUEST));
    }
    dispatch(resetActivityInfo());
  };

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const cancelPurchaseState = () => {
    dispatch(resetPurchaseState());
  };

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const requestData = requestDetails && (requestDetails.data && requestDetails.data.length > 0) ? requestDetails.data[0] : '';
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  return (
    <>
      <Card className="border-0 h-100">
        {requestDetails && (requestDetails.data && requestDetails.data.length > 0) && (
          <CardBody data-testid="success-case">
            <Row>
              <Col md="12" sm="12" xs="12" lg="12">
                <h6 className="mb-2">{getDefaultNoValue(requestData.requisition_name)}</h6>
                <p className="mb-2 font-weight-400">
                  {getDefaultNoValue(requestData.pr_id)}
                </p>
                {requestData.requestor_email && (
                  <p className="m-0 mb-2 font-weight-400">
                    <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                    {getDefaultNoValue(requestData.requestor_email)}
                  </p>
                )}
                <p className="m-0">
                  {getRequestStateLabel(requestData.state)}
                </p>
              </Col>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 pl-1 font-side-heading mb-1 mt-3">ACTIONS</span>
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
                            <FontAwesomeIcon size="sm" color="primary" className="float-right mt-1" height="20" width="20" icon={faChevronDown} />
                          </span>
                        </DropdownToggle>
                        <DropdownMenu className="w-100">
                          {requestActions && requestActions.actionItems.map((actions) => (
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
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-3">PURCHASE REQUEST INFO</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Projects
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(requestData.project_id ? requestData.project_id[1] : '')}
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
                      Accounts
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(requestData.account_id ? requestData.account_id[1] : '')}
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
                      Location
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(requestData.location_id ? requestData.location_id[1] : '')}
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
                      Budget
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(requestData.budget_id ? requestData.budget_id[1] : '')}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {seeMore && (
              <>
                <Row className="pb-2">
                  <Col md="12" xs="12" sm="12" lg="12">
                    <Card className="bg-lightblue">
                      <CardBody className="p-1">
                        <p className="font-weight-400 mb-1 ml-1">
                          Sub Category
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(requestData.sub_category_id ? requestData.sub_category_id[1] : '')}
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
                          Vendor
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(requestData.partner_id ? requestData.partner_id[1] : '')}
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
                          Requestor Name
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2 text-capital">
                          {getDefaultNoValue(requestData.requestor_full_name)}
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
                          Site SPOC
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(requestData.site_spoc)}
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
                          Site Contact Details
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(requestData.site_contact_details)}
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
                          Billing Address
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(requestData.bill_to_address)}
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
                          Shipping Address
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(requestData.ship_to_address)}
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
                          Comments
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(requestData.comments)}
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
                          Requisation Code
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(requestData.HS_requisition_id)}
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </>
            )}
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <p aria-hidden="true" className="pull-right text-info cursor-pointer" onClick={() => setMore(!seeMore)}>{seeMore ? 'Less' : 'More'}</p>
              </Col>
            </Row>
            <Modal isOpen={modal} size="lg">
              <ModalHeader toggle={toggle}>{requestData.name}</ModalHeader>
              <ModalBody>
                <img
                  src={requestData.image_medium ? `data:image/png;base64,${requestData.image_medium}` : assetMiniBlueIcon}
                  alt={requestData.name}
                  width="100%"
                  height="100%"
                  aria-hidden="true"
                />
              </ModalBody>
            </Modal>
          </CardBody>
        )}
        {messageModal && (
          <SendMessage
            atFinish={() => {
              showMessageModal(false); cancelMessage();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            modalName={appModels.PURCHASEREQUEST}
            title="Send Message"
            subTitle={requestDetails && requestDetails.data ? requestDetails.data[0].name : ''}
            detail={requestDetails}
            messageModal
          />
        )}
        {noteModal && (
          <LogNote
            atFinish={() => {
              showNoteModal(false); cancelLogNote();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            modalName={appModels.PURCHASEREQUEST}
            title="Log Note"
            subTitle={requestDetails && requestDetails.data ? requestDetails.data[0].name : ''}
            detail={requestDetails}
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
              detail={requestDetails}
              modalName={appModels.PURCHASEREQUEST}
              resModelId={resModelId}
              afterReset={() => { setActivityModal(false); cancelActivity(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
            />
          </ModalBody>
        </Modal>
        {requestDetails && requestDetails.loading && (
          <CardBody className="mt-4" data-testid="loading-case">
            <Loader />
          </CardBody>
        )}
        {(requestDetails && requestDetails.err) && (
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(requestDetails)} />
          </CardBody>
        )}
        {draftModal && (
          <SetToDraft
            atFinish={() => {
              showDraftModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            requestDetails={requestDetails}
            draftModal
          />
        )}
        {confirmModal && (
        <ConfirmOrder
          atFinish={() => {
            showConfirmModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          requestDetails={requestDetails}
          confirmModal
        />
        )}
        {cancelModal && (
        <CancelRequest
          atFinish={() => {
            showCancelModal(false); cancelPurchaseState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          requestDetails={requestDetails}
          cancelModal
        />
        )}
      </Card>
    </>
  );
};

export default PurchaseRequestInfo;
