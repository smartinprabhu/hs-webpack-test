/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from 'reactstrap';
import { Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faTimesCircle, faTag, faPrint,
  faEnvelope, faEdit, faClock, faUndoAlt, faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';

import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';
import locationBlack from '@images/drawerLite/locationLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import incomingIcon from '@images/icons/incomingStock.svg';
import outcomingIcon from '@images/icons/outgoingStock.svg';
import transferIcon from '@images/transfers.svg';

import DetailViewFormat from '@shared/detailViewFormat';

import {
  resetPurchaseState, getPrintReport, resetPrint, resetValidateState, resetScrap, resetMoveOrder,
  resetBackorder, resetUpdateReceiptInfo, resetAddReceiptInfo, getTransferDetail,
} from '../../../purchaseService';
import { resetCreateScrap } from '../../../../inventory/inventoryService';
import { getPartsData } from '../../../../preventiveMaintenance/ppmService';
import {
  getDefaultNoValue,
  getListOfModuleOperations, truncate, extractTextObject,
  getCompanyTimezoneDate,
} from '../../../../util/appUtils';
import CancelTransfer from '../actionItems/cancelTransfer';
import DeliverTransfer from '../actionItems/deliverTransfer';
import ApproveTransfer from '../actionItems/approveTransfer';
import Scrap from '../actionItems/scrap';
import Return from '../actionItems/return';
import CheckAvailability from '../actionItems/checkAvailability';
import Unreserve from '../actionItems/unreserve';
import rfqActions from '../../data/customData.json';
import { getStatusTransferDynamicLabel } from '../../utils/utils';
import actionCodes from '../../../../inventory/data/actionCodes.json';
import customDataDashboard from '../../../../inventory/overview/data/customData.json';

const appModels = require('../../../../util/appModels').default;

const faIcons = {
  APPROVE: faCheckCircle,
  APPROVEACTIVE: faCheckCircle,
  PRINT: faPrint,
  PRINTACTIVE: faPrint,
  REJECT: faTimesCircle,
  REJECTACTIVE: faTimesCircle,
  RETURN: faTag,
  RETURNACTIVE: faTag,
  SCRAP: faTimesCircle,
  SCRAPACTIVE: faTimesCircle,
  DELIVER: faEnvelope,
  DELIVERACTIVE: faEnvelope,
  LOGNOTE: faEdit,
  LOGNOTEACTIVE: faEdit,
  SCHEDULEACTIVITY: faClock,
  SCHEDULEACTIVITYACTIVE: faClock,
  MARKASTODO: faCheckCircle,
  MARKASTODOACTIVE: faCheckCircle,
  AVAILABILITY: faCheckCircle,
  AVAILABILITYACTIVE: faCheckCircle,
  UNRESERVE: faUndoAlt,
  UNRESERVEACTIVE: faUndoAlt,
};

const defaultIcon = {
  outgoing: outcomingIcon,
  incoming: incomingIcon,
  internal: transferIcon,
};

const DetailInfo = (props) => {
  const {
    detail,
  } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Actions';
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [validateModal, showValidateModal] = useState(false);
  const [printModal, showPrintModal] = useState(false);
  const [cancelModal, showCancelModal] = useState(false);
  const [todoModal, showTodoModal] = useState(false);
  const [scrapModal, showScrapModal] = useState(false);
  const [returnModal, showReturnModal] = useState(false);
  const [availModal, showAvailModal] = useState(false);
  const [unreserveModal, showUnreserveModal] = useState(false);

  const [selectedActionImage, setSelectedActionImage] = useState('');

  const [isMultiLocation, setMultiLocation] = useState(false);
  const [locationId, setLocationId] = useState(false);

  const customNames = customDataDashboard.types;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    printReportInfo,
    stockLocations,
    updateReceiptInfo,
  } = useSelector((state) => state.purchase);

  const { inventoryStatusDashboard, operationTypeDetails } = useSelector((state) => state.inventory);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const isCancelable = allowedOperations.includes(actionCodes['Cancel Transfer']);
  const isReturnable = allowedOperations.includes(actionCodes['Return Transfer']);
  const isApprovable = allowedOperations.includes(actionCodes['Approve Transfer']);
  const isDeliverable = allowedOperations.includes(actionCodes['Deliver Transfer']);

  useEffect(() => {
    const ViewId = detail && detail.data ? detail.data[0].id : '';
    const rpState = detail && detail.data ? detail.data[0].state : '';
    if (printModal && ViewId) {
      if (rpState === 'assigned') {
        dispatch(getPrintReport(ViewId, 'stock.report_picking'));
      }
      if (rpState === 'done') {
        dispatch(getPrintReport(ViewId, 'stock.report_deliveryslip'));
      }
    }
  }, [printModal]);

  useEffect(() => {
    if (stockLocations && stockLocations.data && stockLocations.data.length && stockLocations.data.length > 1) {
      setMultiLocation(true);
    } else if (stockLocations && stockLocations.data && stockLocations.data.length) {
      setMultiLocation(false);
      setLocationId(stockLocations.data[0].id);
    }
  }, [stockLocations]);

  useEffect(() => {
    if (printReportInfo && printReportInfo.data) {
      const pdfBase64 = printReportInfo.data.content;
      const dlnk = document.getElementById('dwnldLnk');
      dlnk.href = `data:application/octet-stream;base64,${pdfBase64}`;
      dlnk.click();
      setSelectedActions(defaultActionText);
      showPrintModal(false);
      dispatch(resetPrint());
    }
  }, [printReportInfo]);

  useEffect(() => {
    if (selectedActions === 'Approve') {
      dispatch(resetUpdateReceiptInfo());
      dispatch(resetAddReceiptInfo());
      dispatch(getPartsData([]));
      showValidateModal(true);
    }
    if (selectedActions === 'Deliver') {
      dispatch(resetUpdateReceiptInfo());
      dispatch(resetAddReceiptInfo());
      dispatch(getPartsData([]));
      showTodoModal(true);
    }
    if (selectedActions === 'Print') {
      showPrintModal(true);
    }
    if (selectedActions === 'Reject') {
      showCancelModal(true);
    }
    if (selectedActions === 'Scrap') {
      showScrapModal(true);
    }
    if (selectedActions === 'Return') {
      showReturnModal(true);
    }
    if (selectedActions === 'Check Availability') {
      showAvailModal(true);
    }
    if (selectedActions === 'Unreserve') {
      showUnreserveModal(true);
    }
  }, [enterAction]);

  /* const getPdfName = () => {
    let pdfName = 'Receive products';
    const rpState = detail && detail.data ? detail.data[0].state : '';
    if (rpState === 'assigned') {
      pdfName = 'Picking Operations';
    }
    if (rpState === 'done') {
      pdfName = 'Delivery Slip';
    }
    return pdfName;
  };  */

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
    dispatch(resetCreateScrap());
    dispatch(resetScrap());
    dispatch(resetMoveOrder());
  };

  /* const checkActionAllowed = (actionName) => {
    let allowed = true;
    const showValidate = detail && detail.data ? detail.data[0].show_validate : false;
    const showAvailability = detail && detail.data ? detail.data[0].show_check_availability : false;
    const isLocked = detail && detail.data ? detail.data[0].is_locked : false;
    const rpState = detail && detail.data ? detail.data[0].state : '';
    const pickingTypeCode = detail && detail.data ? detail.data[0].picking_type_code : '';
    const showMarkAsTodo = detail && detail.data ? detail.data[0].show_mark_as_todo : '';

    if (actionName === 'Validate') {
      if (!showValidate || (rpState === 'waiting' && rpState === 'confirmed')) {
        allowed = false;
      }
    }
    if (actionName === 'Check Availability') {
      if (!showAvailability || (rpState === 'draft' && rpState === 'assigned')) {
        allowed = false;
      }
    }
    if (actionName === 'Print') {
      if (!isLocked || (rpState !== 'partially_available' && rpState !== 'assigned' && rpState !== 'done')) {
        allowed = false;
      }
    }
    if (actionName === 'Unreserve') {
      if (rpState === 'cancel' || rpState === 'done' || rpState === 'draft' || rpState === 'waiting') {
        allowed = false;
      } else if (!isLocked || (pickingTypeCode !== 'incoming' && (rpState === 'partially_available'))) {
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
  }; */

  const checkActionAllowed = (actionName) => {
    let allowed = false;
    const showValidate = detail && detail.data ? detail.data[0].show_validate : false;
    const showAvailability = detail && detail.data ? detail.data[0].show_check_availability : false;
    const isLocked = detail && detail.data ? detail.data[0].is_locked : false;
    const rpState = detail && detail.data ? detail.data[0].request_state : '';
    const pickingTypeCode = detail && detail.data ? detail.data[0].picking_type_code : '';
    const showMarkAsTodo = detail && detail.data ? detail.data[0].show_mark_as_todo : '';
    const isApprovalRequired = operationTypeDetails && operationTypeDetails.data && operationTypeDetails.data.length && operationTypeDetails.data[0].is_confirmed;

    /* if (actionName === 'Validate') {
      if (showValidate && (rpState === 'assigned' || rpState === 'confirmed')) {
        allowed = true;
      }
    }
    if (actionName === 'Check Availability') {
      if (showAvailability && pickingTypeCode !== 'incoming' && rpState === 'confirmed') {
        allowed = true;
      }
    }
    if (actionName === 'Print') {
      if (isLocked && rpState === 'done') {
        allowed = true;
      }
    }
    if (actionName === 'Unreserve') {
      if (isLocked && pickingTypeCode !== 'incoming' && rpState === 'assigned') {
        allowed = true;
      }
    } */
    if (actionName === 'Approve') {
      if (isLocked && rpState === 'Requested' && isApprovalRequired && isApprovable) {
        allowed = true;
      }
    }
    if (actionName === 'Deliver') {
      if (((isLocked && rpState === 'Approved') || (rpState === 'Requested' && !isApprovalRequired)) && isDeliverable) {
        allowed = true;
      }
    }
    if (actionName === 'Reject') {
      if (isLocked && rpState !== 'Delivered' && rpState !== 'Rejected' && isCancelable) {
        allowed = true;
      }
    }
    /* if (actionName === 'Scrap') {
      if (isLocked) {
        if (pickingTypeCode === 'incoming' && rpState === 'done') {
          allowed = true;
        } else if (pickingTypeCode !== 'incoming' && (rpState === 'assigned' || rpState === 'done' || rpState === 'confirmed')) {
          allowed = true;
        }
      }
    } */
    if (actionName === 'Return' && isReturnable) {
      if (isLocked && rpState === 'Delivered' && pickingTypeCode !== 'outgoing') {
        allowed = true;
      }
    }
    /* if (actionName === 'Mark as Todo') {
      if (showMarkAsTodo) {
        allowed = true;
      }
    } */
    return allowed;
  };

  /* function checkCurrentState(cstate, vstate) {
    let result = true;
    if (cstate !== 'cancel' && vstate === 'cancel') {
      result = false;
    }
    if (cstate !== 'waiting' && vstate === 'waiting') {
      result = false;
    }
    return result;
  } */

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  const onReset = () => {
    if (detailData && detailData.id && updateReceiptInfo && updateReceiptInfo.data) {
      dispatch(getTransferDetail(detailData.id, appModels.STOCK));
    }
    dispatch(resetUpdateReceiptInfo());
    dispatch(resetAddReceiptInfo());
    // dispatch(getPartsData([]));
  };
  // const rpName = detailData ? detailData.name : '';
  // const vendorName = detailData && detailData.partner_id ? extractTextObject(detailData.partner_id) : '';
  const loading = detail && detail.loading;

  function getItemData(type) {
    let res = detailData.asset_id;
    if (type === 'Location') {
      res = detailData.space_id;
    } else if (type === 'Employee') {
      res = detailData.employee_id;
    } else if (type === 'Department') {
      res = detailData.department_id;
    }
    return res;
  }

  function getStatusFieldName(strName) {
    let res = '';
    if (strName === 'Requested') {
      res = 'requested_display';
    } else if (strName === 'Approved') {
      res = 'approved_display';
    } else if (strName === 'Delivered') {
      res = 'delivered_display';
    } else if (strName === 'Rejected') {
      res = 'rejected_display';
    }
    return res;
  }

  function getStatusDynamicStaus(label) {
    let newStr = label;
    const dName = getStatusFieldName(label);
    const pickingData = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
    const pCode = detailData && detailData.picking_type_code ? detailData.picking_type_code : '';
    const ogData = pickingData.filter((item) => (item.code === pCode));
    if (ogData && ogData.length && dName) {
      newStr = ogData[0][dName];
    }
    return newStr;
  }

  function getStatusDynamicBtnStaus(label, fieldName) {
    let newStr = label;
    const pickingData = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
    const pCode = detailData && detailData.picking_type_code ? detailData.picking_type_code : '';
    const ogData = pickingData.filter((item) => (item.code === pCode));
    if (ogData && ogData.length && fieldName && ogData[0][fieldName]) {
      newStr = ogData[0][fieldName];
    }
    return newStr;
  }

  function getStatusDynamicBtnStausLoad(label) {
    let newStr = label;
    if (label === 'Approve' || label === 'Deliver') {
      let fieldName = '';
      if (label === 'Deliver') {
        fieldName = 'bn_delivered';
      } else {
        fieldName = 'bn_approved';
      }
      const pickingData = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
      const pCode = detailData && detailData.picking_type_code ? detailData.picking_type_code : '';
      const ogData = pickingData.filter((item) => (item.code === pCode));
      if (ogData && ogData.length && fieldName && ogData[0][fieldName]) {
        newStr = ogData[0][fieldName];
      }
    }
    return newStr;
  }

  return (
    <>
      {!loading && detailData && (
        <>
          <Row className="mt-2 globalModal-header-cards">
            <Col sm="12" md="3" lg="3" xs="12" className="p-0">
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    {detailData.picking_type_code !== 'internal' && (
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny">
                        VENDOR
                      </p>
                      <p className="mb-0 font-weight-700">
                        <Tooltip title={getDefaultNoValue(extractTextObject(detailData.partner_id))} placement="right">
                          {truncate(getDefaultNoValue(extractTextObject(detailData.partner_id, 'name')), '30')}
                        </Tooltip>
                      </p>
                    </Col>
                    )}
                    {(detailData.picking_type_code === 'internal' || detailData.picking_type_code === 'Consumption') && (
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny text-uppercase">
                        {detailData.use_in}
                      </p>
                      <p className="mb-0 font-weight-700">
                        <Tooltip title={getDefaultNoValue(extractTextObject(getItemData(detailData.use_in)))} placement="right">
                          {truncate(getDefaultNoValue(extractTextObject(getItemData(detailData.use_in), 'name')), '30')}
                        </Tooltip>
                      </p>
                    </Col>
                    )}
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={assetDefault} alt="asset" width="30" className="mt-1" />
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
                        CREATED ON
                      </p>
                      <p className="mb-0 font-weight-700">
                        {detailData.date ? getDefaultNoValue(getCompanyTimezoneDate(detailData.date, userInfo, 'datetime'))
                          : getDefaultNoValue(getCompanyTimezoneDate(detailData.create_date, userInfo, 'datetime'))}
                      </p>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={locationBlack} alt="asset" width="20" className="mt-1" />
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
                        {getStatusTransferDynamicLabel(detailData.request_state, getStatusDynamicStaus(detailData.request_state))}
                      </p>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={logsIcon} alt="asset" width="25" className="mt-1" />
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
                                    icon={faIcons[`${selectedActionImage}ACTIVE`]}
                                  />
                                ) : ''}
                              <span className="font-weight-700">
                                {selectedActions}
                                <FontAwesomeIcon size="sm" color="primary" className="float-right mt-1 ml-1" icon={faChevronDown} />
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
                                  {getStatusDynamicBtnStausLoad(actions.displayname)}
                                </DropdownItem>
                                )
                              ))}
                            </DropdownMenu>
                          </ButtonDropdown>
                        </div>
                      </p>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={handPointerBlack} alt="asset" width="20" className="mt-1" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {validateModal && (
          <ApproveTransfer
            atFinish={() => {
              showValidateModal(false); setSelectedActions(defaultActionText); onReset();
            }}
            transferDetails={detail}
            title={`${getStatusDynamicBtnStaus('Approve', 'bn_approved')} ${customNames[detailData && detailData.picking_type_code ? detailData.picking_type_code : ''] ? customNames[detailData && detailData.picking_type_code ? detailData.picking_type_code : ''].text : 'Transfer'}`}
            submitText={getStatusDynamicBtnStaus('Approve', 'bn_approved')}
            actionMsg={getStatusDynamicStaus('Approved')}
            validateModal
          />
          )}
          {todoModal && (
          <DeliverTransfer
            atFinish={() => {
              showTodoModal(false); setSelectedActions(defaultActionText); onReset();
            }}
            transferDetails={detail}
            title={`${getStatusDynamicBtnStaus('Deliver', 'bn_delivered')} ${customNames[detailData && detailData.picking_type_code ? detailData.picking_type_code : ''] ? customNames[detailData && detailData.picking_type_code ? detailData.picking_type_code : ''].text : 'Transfer'}`}
            submitText={getStatusDynamicBtnStaus('Deliver', 'bn_delivered')}
            actionMsg={getStatusDynamicStaus('Delivered')}
            todoModal
          />
          )}
          {cancelModal && (
          <CancelTransfer
            atFinish={() => {
              showCancelModal(false); setSelectedActions(defaultActionText); cancelPurchaseState();
            }}
            transferDetails={detail}
            cancelModal
          />
          )}
          {scrapModal && (
          <Scrap
            atFinish={() => {
              showScrapModal(false); setSelectedActions(defaultActionText); cancelScrapState();
            }}
            transferDetails={detail}
            scrapModal
          />
          )}
          {returnModal && (
          <Return
            atFinish={() => {
              showReturnModal(false); setSelectedActions(defaultActionText); cancelScrapState();
            }}
            transferDetails={detail}
            returnModal
          />
          )}
          {availModal && (
          <CheckAvailability
            atFinish={() => {
              showAvailModal(false); setSelectedActions(defaultActionText); cancelPurchaseState();
            }}
            transferDetails={detail}
            availModal
          />
          )}
          {unreserveModal && (
          <Unreserve
            atFinish={() => {
              showUnreserveModal(false); setSelectedActions(defaultActionText); cancelPurchaseState();
            }}
            transferDetails={detail}
            unreserveModal
          />
          )}
          <DetailViewFormat detailResponse={detail} />
        </>
      )}
    </>
  );
};

// eslint-disable-next-line no-lone-blocks
{ /*  <Card className="border-0">
      <a id="dwnldLnk" aria-hidden="true" download={`${getPdfName()}-${vendorName}-${rpName}.pdf`} className="d-none" />
      {detailData && (
      <CardBody>
        <Row>
          <Col sm="12" md="12" xs="12" lg="6">
            {rfqActions && rfqActions.actionTransferItems.map((actions) => (
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
                </span>
              )
            ))}
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="text-right">
            {rfqActions && rfqActions.statusTransferTypes.map((st) => (
              checkCurrentState(detailData.state, st.value) && (
              <span key={st.value} className={detailData.state === st.value ? 'text-info mr-2 font-weight-800 font-tiny' : 'mr-2 tab_nav_link font-tiny'}>{st.label}</span>
              )
            ))}
          </Col>
        </Row>

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
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Operation Type</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.picking_type_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Source Location</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.location_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Destination Location</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.location_dest_id))}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Scheduled Date</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(getCompanyTimezoneDate(detailData.scheduled_date, userInfo, 'datetime'))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">PO/SO No</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(detailData.origin)}</span>
            </Row>
            <hr className="mt-0" />
            {detailData.backorder_id && (
              <>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-roman-silver">Back Order</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.backorder_id))}</span>
                </Row>
                <hr className="mt-0" />
              </>
            )}
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Shipping Policy</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(getSPLabel(detailData.move_type))}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
        </Row>
      </CardBody>
      )}
      {validateModal && (
        <Validate
          atFinish={() => {
            showValidateModal(false); setSelectedActions(defaultActionText); cancelState();
          }}
          transferDetails={detail}
          validateModal
        />
      )}
      {cancelModal && (
        <CancelTransfer
          atFinish={() => {
            showCancelModal(false); setSelectedActions(defaultActionText); cancelPurchaseState();
          }}
          transferDetails={detail}
          cancelModal
        />
      )}
      {todoModal && (
        <MarkTodo
          atFinish={() => {
            showTodoModal(false); setSelectedActions(defaultActionText); cancelPurchaseState();
          }}
          transferDetails={detail}
          todoModal
        />
      )}
      {scrapModal && (
        <Scrap
          atFinish={() => {
            showScrapModal(false); setSelectedActions(defaultActionText); cancelScrapState();
          }}
          transferDetails={detail}
          scrapModal
        />
      )}
      {returnModal && (
        <Return
          atFinish={() => {
            showReturnModal(false); setSelectedActions(defaultActionText); cancelScrapState();
          }}
          transferDetails={detail}
          returnModal
        />
      )}
      {availModal && (
        <CheckAvailability
          atFinish={() => {
            showAvailModal(false); setSelectedActions(defaultActionText); cancelPurchaseState();
          }}
          transferDetails={detail}
          availModal
        />
      )}
      {unreserveModal && (
        <Unreserve
          atFinish={() => {
            showUnreserveModal(false); setSelectedActions(defaultActionText); cancelPurchaseState();
          }}
          transferDetails={detail}
          unreserveModal
        />
      )}
      <DetailViewFormat detailResponse={detail} />
        </Card> */ }

DetailInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DetailInfo;
