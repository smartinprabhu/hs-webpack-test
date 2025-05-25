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
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import assetDefault from '@images/drawerLite/assetLite.svg';
import envelopeIcon from '@images/icons/envelope.svg';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';

import DetailViewFormat from '@shared/detailViewFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faTimesCircle, faWindowClose, faCheck, faArrowCircleRight, faChevronDown, faCog,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue, getCompanyTimezoneDate, getListOfOperations,
  getLocalDateCustom,
} from '../../util/appUtils';
import {
  getVisitorStateLabel,
} from '../utils/utils';
import {
  resetVisitState,
} from '../visitorManagementService';
import customData from '../data/customData.json';
import Action from './actionItems/actionVisitRequest';
import actionCodes from '../data/actionCodes.json';

const appModels = require('../../util/appModels').default;

const faIcons = {
  APPROVED: faCheckCircle,
  APPROVEDACTIVE: faCheckCircle,
  CHECKIN: faCheck,
  CHECKINACTIVE: faCheck,
  CHECKOUT: faArrowCircleRight,
  CHECKOUTACTIVE: faArrowCircleRight,
  CANCELLED: faTimesCircle,
  CANCELLEDACTIVE: faTimesCircle,
  REJECTED: faWindowClose,
  REJECTEDACTIVE: faWindowClose,
};

const DetailInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Visitor Actions';
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [enterAction, setEnterAction] = useState(false);
  const [actionModal, showActionModal] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionButton, setActionButton] = useState('');
  const [selectedActionImage, setSelectedActionImage] = useState('');

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const plannedIn = viewData.planned_in ? getLocalDateCustom(viewData.planned_in, 'YYYY-MM-DD HH:mm:ss') : false;
  const plannedOut = viewData.planned_out ? getLocalDateCustom(viewData.planned_out, 'YYYY-MM-DD HH:mm:ss') : false;
  const extendTime = plannedIn ? new Date(plannedIn) : false;
  const extendDateTime = extendTime ? extendTime.setMinutes(extendTime.getMinutes() + 30) : false;

  const isCheckIn = viewData.planned_in && viewData.planned_out && ((new Date(plannedIn) < new Date()) && (new Date(plannedOut) > new Date()));

  const isCheckOut = viewData.planned_out && (new Date(getCompanyTimezoneDate(viewData.planned_out, userInfo, 'datetime')) >= new Date());

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailData && detailData.data ? detailData.data[0].state : '';
    const entryState = detailData && detailData.data ? detailData.data[0].entry_status : '';
    const reason = detailData && detailData.data ? detailData.data[0].reason : '';

    const cancelInvisibleState = ['To Approve', 'Approved'];
    const rejectInvisibleState = ['To Approve'];
    const checkInvisibleState = ['To Approve', 'Cancelled', 'Rejected'];

    if (actionName === 'Approve') {
      if (vrState !== 'To Approve' || entryState === 'Checkout' || entryState === 'Checkin' || entryState === 'time_elapsed') {
        allowed = false;
      }
    }
    if (actionName === 'Cancel') {
      if ((!cancelInvisibleState.includes(vrState) || entryState === 'Checkout') || (entryState === 'time_elapsed' && vrState === 'To Approve')) {
        allowed = false;
      }
    }
    if (actionName === 'Reject') {
      if ((!rejectInvisibleState.includes(vrState) || entryState === 'Checkout') || entryState === 'time_elapsed') {
        allowed = false;
      }
    }
    if (actionName === 'Check In') {
      if (entryState !== 'Invited' || (checkInvisibleState.includes(vrState)) || !isCheckIn) {
        allowed = false;
      }
    }
    if (actionName === 'Check Out') {
      if ((entryState !== 'Checkin') && (entryState !== 'time_elapsed' || vrState === 'To Approve' || reason !== 'Not Checked Out')) {
        allowed = false;
      }
    }
    return allowed;
  };

  useEffect(() => {
    if (customData && customData.actionTypes && customData.actionTypes[selectedActions]) {
      setActionText(customData.actionTypes[selectedActions].text);
      setActionCode(customData.actionTypes[selectedActions].value);
      setActionMessage(customData.actionTypes[selectedActions].msg);
      setActionButton(customData.actionTypes[selectedActions].button);
      showActionModal(true);
    }
  }, [enterAction]);

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const cancelStateChange = () => {
    dispatch(resetVisitState());
    const viewId = detailData && detailData.data ? detailData.data[0].id : '';
    // dispatch(getVisitorRequestDetail(viewId, appModels.VISITREQUEST));
  };
  const loading = detailData && detailData.loading;

  return (
    !loading && viewData && (
    <Row className="mt-3 globalModal-header-cards">
      <Col sm="12" md="3" lg="3" xs="12" className="p-0">
        <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
          <CardBody className="p-2">
            <Row className="m-0">
              <Col sm="12" md="9" lg="9" xs="12" className="">
                <p className="mb-0 font-weight-500 font-tiny">
                  NAME
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(viewData.visitor_name)}
                </p>
                <span className="font-weight-500 font-tiny">
                  {getDefaultNoValue(viewData.type_of_visitor)}
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
                  VISIT FOR
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(viewData.visit_for)}
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={assetDefault} alt="asset" width="30" className="mt-3" />
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
                  ENTRY STATUS
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(getVisitorStateLabel(viewData.entry_status))}
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
        atFinish={() => {
          showActionModal(false); cancelStateChange(); setSelectedActions(defaultActionText);
          setSelectedActionImage('');
        }}
        actionText={actionText}
        actionCode={actionCode}
        actionMessage={actionMessage}
        actionButton={actionButton}
        details={detailData}
        actionModal
      />
      )}
      <DetailViewFormat detailResponse={detailData} />
    </Row>
    ));
};

DetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DetailInfo;
