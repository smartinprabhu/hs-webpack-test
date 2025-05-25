/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faCheckCircle, faTimesCircle, faTag, faPrint,
  faEnvelope, faEdit, faClock,
} from '@fortawesome/free-solid-svg-icons';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import assetMiniBlueIcon from '@images/icons/assetMiniBlue.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import Validate from '../actionItems/validate';
import CancelTransfer from '../actionItems/cancelTransfer';
import MarkTodo from '../actionItems/markTodo';
import Scrap from '../actionItems/scrap';
import Return from '../actionItems/return';
import rfqActions from '../../data/customData.json';
import {
  getDefaultNoValue, generateErrorMessage, getCompanyTimezoneDate,
} from '../../../../util/appUtils';
import {
  getRpStateLabel,
} from '../../utils/utils';
import {
  resetPurchaseState, getTransferDetail, getPrintReport, resetPrint, resetValidateState, resetScrap, resetMoveOrder,
  resetActivityInfo, resetBackorder,
} from '../../../purchaseService';
import {
  resetMessage,
} from '../../../../helpdesk/ticketService';
import SendMessage from '../../../utils/sendMessage';
import LogNote from '../../../utils/logNote';
import AddScheduleActivity from '../../../utils/addSheduleActivity/addSheduleActivity';

const appModels = require('../../../../util/appModels').default;

const faIcons = {
  VALIDATE: faCheckCircle,
  VALIDATEACTIVE: faCheckCircle,
  PRINT: faPrint,
  PRINTACTIVE: faPrint,
  CANCEL: faTimesCircle,
  CANCELACTIVE: faTimesCircle,
  RETURN: faTag,
  RETURNACTIVE: faTag,
  SCRAP: faTimesCircle,
  SCRAPACTIVE: faTimesCircle,
  UNRESERVE: faTimesCircle,
  UNRESERVEACTIVE: faTimesCircle,
  SENDMESSAGE: faEnvelope,
  SENDMESSAGEACTIVE: faEnvelope,
  LOGNOTE: faEdit,
  LOGNOTEACTIVE: faEdit,
  SCHEDULEACTIVITY: faClock,
  SCHEDULEACTIVITYACTIVE: faClock,
  MARKASTODO: faCheckCircle,
  MARKASTODOACTIVE: faCheckCircle,
};

const ReceivedProductsInfo = () => {
  const dispatch = useDispatch();
  const resModelId = 235;
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const defaultActionText = 'Transfers Actions';
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [validateModal, showValidateModal] = useState(false);
  const [printModal, showPrintModal] = useState(false);
  const [cancelModal, showCancelModal] = useState(false);
  const [todoModal, showTodoModal] = useState(false);
  const [scrapModal, showScrapModal] = useState(false);
  const [returnModal, showReturnModal] = useState(false);
  const [messageModal, showMessageModal] = useState(false);
  const [noteModal, showNoteModal] = useState(false);
  const [addActivityModal, setActivityModal] = useState(false);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const {
    transferDetails, printReportInfo,
    createActivityInfo,
  } = useSelector((state) => state.purchase);

  const {
    createMessageInfo,
  } = useSelector((state) => state.ticket);

  const {
    userInfo,
  } = useSelector((state) => state.user);

  useEffect(() => {
    const ViewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    const rpState = transferDetails && transferDetails.data ? transferDetails.data[0].state : '';
    if (printModal && ViewId) {
      if (rpState === 'assigned') {
        dispatch(getPrintReport(ViewId, 'stock.report_picking'));
      }
      if (rpState === 'done') {
        dispatch(getPrintReport(ViewId, 'stock.report_deliveryslip'));
      }
    }
  }, [printModal]);

  const getPdfName = () => {
    let pdfName = 'Receive products';
    const rpState = transferDetails && transferDetails.data ? transferDetails.data[0].state : '';
    if (rpState === 'assigned') {
      pdfName = 'Picking Operations';
    }
    if (rpState === 'done') {
      pdfName = 'Delivery Slip';
    }
    return pdfName;
  };

  useEffect(() => {
    if (printReportInfo && printReportInfo.data) {
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

  const cancelPurchaseState = () => {
    dispatch(resetPurchaseState());
  };

  const cancelState = () => {
    dispatch(resetPurchaseState());
    dispatch(resetValidateState());
    dispatch(resetBackorder());
  };

  const cancelScrapState = () => {
    dispatch(resetPurchaseState());
    dispatch(resetScrap());
    dispatch(resetMoveOrder());
  };

  useEffect(() => {
    if (selectedActions === 'Validate') {
      showValidateModal(true);
    }
    if (selectedActions === 'Print') {
      showPrintModal(true);
    }
    if (selectedActions === 'Cancel') {
      showCancelModal(true);
    }
    if (selectedActions === 'Scrap') {
      showScrapModal(true);
    }
    if (selectedActions === 'Return') {
      showReturnModal(true);
    }
    if (selectedActions === 'Mark as Todo') {
      showTodoModal(true);
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
    const showValidate = transferDetails && transferDetails.data ? transferDetails.data[0].show_validate : false;
    const isLocked = transferDetails && transferDetails.data ? transferDetails.data[0].is_locked : false;
    const rpState = transferDetails && transferDetails.data ? transferDetails.data[0].state : '';
    const pickingTypeCode = transferDetails && transferDetails.data ? transferDetails.data[0].picking_type_code : '';
    const showMarkAsTodo = transferDetails && transferDetails.data ? transferDetails.data[0].show_mark_as_todo : '';

    if (actionName === 'Validate') {
      if (!showValidate || (rpState === 'waiting' && rpState === 'confirmed')) {
        allowed = false;
      }
    }
    if (actionName === 'Print') {
      if (!isLocked || (rpState !== 'partially_available' && rpState !== 'assigned' && rpState !== 'done')) {
        allowed = false;
      }
    }
    if (actionName === 'Cancel') {
      if (!isLocked || (rpState !== 'partially_available' && rpState !== 'draft' && rpState !== 'waiting' && rpState !== 'confirmed' && rpState !== 'assigned')) {
        allowed = false;
      }
    }
    if (actionName === 'Scrap') {
      if (!isLocked || (pickingTypeCode !== 'incoming' && (rpState === 'draft' || rpState === 'cancel' || rpState === 'waiting')) || (pickingTypeCode === 'incoming' && rpState !== 'done')) {
        allowed = false;
      }
    }
    if (actionName === 'Return') {
      if (!isLocked || (rpState !== 'done')) {
        allowed = false;
      }
    }
    if (actionName === 'Mark as Todo') {
      if (!showMarkAsTodo) {
        allowed = false;
      }
    }
    return allowed;
  };

  const cancelMessage = () => {
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    dispatch(resetMessage());
  };

  const cancelLogNote = () => {
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    dispatch(resetMessage());
  };

  const cancelActivity = () => {
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if (createActivityInfo && createActivityInfo.data) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    dispatch(resetActivityInfo());
  };

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const transfersData = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0] : '';

  const rpName = transferDetails && transferDetails.data ? transferDetails.data[0].name : '';
  const vendorName = transferDetails && transferDetails.data && transferDetails.data[0].partner_id ? transferDetails.data[0].partner_id[1] : '';

  return (
    <>
      <Card className="border-0 h-100">
        <a id="dwnldLnk" aria-hidden="true" download={`${getPdfName()}-${vendorName}-${rpName}.pdf`} className="d-none" />
        {transferDetails && (transferDetails.data && transferDetails.data.length > 0) && (
          <CardBody data-testid="success-case">
            <Row>
              <Col md="8" xs="8" sm="8" lg="8">
                <h4 className="mb-1 font-weight-800 font-medium" title={transfersData.name}>{transfersData.name}</h4>
                <p className="mb-1 font-weight-400 mt-1 font-tiny">
                  {getDefaultNoValue(transferDetails.data[0].partner_id ? transferDetails.data[0].partner_id[1] : '')}
                </p>
                {getRpStateLabel(transfersData.state)}
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
                          {rfqActions && rfqActions.actionTransferItems.map((actions) => (
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
                            )))}
                        </DropdownMenu>
                      </ButtonDropdown>
                    </Col>
                  </Row>
                </CardBody>
              </Col>
            </Row>
            {printReportInfo && printReportInfo.loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
            )}
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-3">Transfers INFO</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Partner
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(transferDetails.data[0].partner_id ? transferDetails.data[0].partner_id[1] : '')}
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
                      Operation Type
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(transferDetails.data[0].picking_type_id ? transferDetails.data[0].picking_type_id[1] : '')}
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
                      Scheduled Date
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getCompanyTimezoneDate(transferDetails.data[0].scheduled_date, userInfo, 'datetime')}
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
                      Destination Location
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(transferDetails.data[0].location_id ? transferDetails.data[0].location_id[1] : '')}
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
                      Source Location
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(transferDetails.data[0].location_dest_id ? transferDetails.data[0].location_dest_id[1] : '')}
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
                      Source Document
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(transferDetails.data[0].origin)}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>

          </CardBody>
        )}
        {transferDetails && transferDetails.loading && (
          <CardBody className="mt-4" data-testid="loading-case">
            <Loader />
          </CardBody>
        )}
        {(transferDetails && transferDetails.err) && (
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(transferDetails)} />
          </CardBody>
        )}
      </Card>
      {validateModal && (
        <Validate
          atFinish={() => {
            showValidateModal(false); setSelectedActions(defaultActionText); setSelectedActionImage(''); cancelState();
          }}
          transferDetails={transferDetails}
          validateModal
        />
      )}
      {cancelModal && (
        <CancelTransfer
          atFinish={() => {
            showCancelModal(false); setSelectedActions(defaultActionText); setSelectedActionImage(''); cancelPurchaseState();
          }}
          transferDetails={transferDetails}
          cancelModal
        />
      )}
      {todoModal && (
        <MarkTodo
          atFinish={() => {
            showTodoModal(false); setSelectedActions(defaultActionText); setSelectedActionImage(''); cancelPurchaseState();
          }}
          transferDetails={transferDetails}
          todoModal
        />
      )}
      {scrapModal && (
        <Scrap
          atFinish={() => {
            showScrapModal(false); setSelectedActions(defaultActionText); setSelectedActionImage(''); cancelScrapState();
          }}
          transferDetails={transferDetails}
          scrapModal
        />
      )}
      {returnModal && (
        <Return
          atFinish={() => {
            showReturnModal(false); setSelectedActions(defaultActionText); setSelectedActionImage(''); cancelScrapState();
          }}
          transferDetails={transferDetails}
          returnModal
        />
      )}
      {messageModal && (
      <SendMessage
        atFinish={() => {
          showMessageModal(false); cancelMessage();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        modalName={appModels.STOCK}
        title="Send Message"
        subTitle={transferDetails && transferDetails.data ? transferDetails.data[0].name : ''}
        detail={transferDetails}
        messageModal
      />
      )}
      {noteModal && (
      <LogNote
        atFinish={() => {
          showNoteModal(false); cancelLogNote();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        modalName={appModels.STOCK}
        title="Log Note"
        subTitle={transferDetails && transferDetails.data ? transferDetails.data[0].name : ''}
        detail={transferDetails}
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
            detail={transferDetails}
            modalName={appModels.STOCK}
            resModelId={resModelId}
            afterReset={() => { setActivityModal(false); cancelActivity(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default ReceivedProductsInfo;
