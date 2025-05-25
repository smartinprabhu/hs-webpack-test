/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import locationBlack from '@images/drawerLite/locationLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import {
  faTimesCircle, faCheckCircle, faArrowCircleRight, faStoreAlt, faChevronDown, faCog,
} from '@fortawesome/free-solid-svg-icons';

import {
  getDefaultNoValue,
  extractNameObject,
  getListOfModuleOperations
} from '../../util/appUtils';

import {
  resetUpdateParts,
} from '../../workorders/workorderService';
import customData from '../data/customData.json';
import ActionPantry from './actionItems/actionPantry';
import ActionCodes from '../data/actionCodes.json';

const faIcons = {
  Draft: faStoreAlt,
  Ordered: faCheckCircle,
  Confirmed: faCheckCircle,
  Delivered: faArrowCircleRight,
  Cancelled: faTimesCircle,
};

const BasicInfo = () => {
  const dispatch = useDispatch();
  const [changeLocationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const changeLocationDropdownToggle = () => setLocationDropdownOpen(!changeLocationDropdownOpen);
  const defaultActionText = 'Pantry Actions';
  const [selectedActions, setSelectedActions] = useState(defaultActionText);

  const [actionModal, showActionModal] = useState(false);
  const [actionValue, setActionValue] = useState('');
  const [actionHead, setActionHead] = useState('');
  const [actionMethod, setActionMethod] = useState('');

  const [selectedActionImage, setSelectedActionImage] = useState('');

  const { pantryDetails } = useSelector((state) => state.pantry);
  const { userRoles } = useSelector((state) => state.user);

  const cancelStateChange = () => {
    dispatch(resetUpdateParts());
    setSelectedActions(defaultActionText)
  };

  const detailData = pantryDetails && (pantryDetails.data && pantryDetails.data.length > 0) ? pantryDetails.data[0] : '';

  const stage = pantryDetails && pantryDetails.data && pantryDetails.data.length && pantryDetails.data.length > 0 ? pantryDetails.data[0].state : '';

  const switchStatus = (statusName, head, method, st) => {
    setActionValue(statusName);
    setActionHead(head);
    setActionMethod(method);
    setSelectedActions(st.label);
    setSelectedActionImage(st.heading);
    showActionModal(true);
  };

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Pantry Management', 'code');

  const checkActionAllowed = (actionName) => {
    let allowed = false;
    const prState = detailData && detailData.state ? detailData.state : ''
    if (actionName === 'Ordered' && prState === 'Draft') {
      allowed = true;
    }
    if (actionName === 'Confirmed' && prState === 'Ordered') {
      allowed = true;
    }
    if (actionName === 'Delivered' && prState === 'Confirmed') {
      allowed = true;
    }
    if (actionName === 'Cancelled' && (prState === 'Draft' || prState === 'Ordered' || prState === 'Confirmed')) {
      allowed = true;
    }
    return allowed;
  }

  return (
    <>
      <Row className="mt-0 globalModal-header-cards">
        <Col sm="12" md="3" lg="3" xs="12" className="p-0">
          <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
            <CardBody className="p-2">
              <Row className="m-0">
                <Col sm="12" md="9" lg="9" xs="12" className="">
                  <p className="mb-0 font-weight-500 font-tiny">
                    SPACE
                  </p>
                  <p className="mb-0 font-weight-700">
                    {getDefaultNoValue(extractNameObject(detailData.space_id, 'space_name'))}
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
                    LOCATION
                  </p>
                  <p className="mb-0 font-weight-700">
                    {getDefaultNoValue(extractNameObject(detailData.space_id, 'path_name'))}
                  </p>
                </Col>
                <Col sm="12" md="3" lg="3" xs="12" className="">
                  <img src={locationBlack} alt="asset" width="20" className="mt-3" />
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
                    {detailData.state}
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
                      <ButtonDropdown size="xs" isOpen={changeLocationDropdownOpen} toggle={changeLocationDropdownToggle} className="mr-1 actionDropdown">
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
                        <DropdownMenu className="headerdropdown-list thin-scrollbar">
                          {customData && customData.pantryStates && (
                            <>
                              {customData.pantryStates.map((st) => (
                                allowedOperations.includes(ActionCodes[st.value]) && (
                                  checkActionAllowed(st.value) && (
                                    <DropdownItem
                                      id="switchLocation"
                                      key={st.id}
                                      onClick={() => switchStatus(st.label, st.heading, st.methodName, st)}
                                    >
                                      <FontAwesomeIcon
                                        className="mr-2"
                                        icon={faIcons[st.heading]}
                                      />
                                      {st.label}
                                    </DropdownItem>
                                  ))))}
                            </>
                          )}
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
            {actionModal && (
              <ActionPantry
                atFinish={() => {
                  showActionModal(false); cancelStateChange(); setSelectedActionImage('');
                }}
                actionValue={actionValue}
                actionHead={actionHead}
                actionMethod={actionMethod}
                details={pantryDetails}
                actionModal
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BasicInfo;
