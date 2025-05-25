/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  Row,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from 'reactstrap';
import { Tooltip } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faCheckCircle, faClock, faTimesCircle, faStoreAlt, faCaretSquareDown,
} from '@fortawesome/free-solid-svg-icons';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import locationBlack from '@images/drawerLite/locationLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';
import {
  getDefaultNoValue, getListOfOperations, truncate, extractNameObject,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import {
  getComplianceDetail, resetComplianceState, resetRenewalDetail,
} from '../complianceService';
import SetToDraft from './actionItems/setToDraft';
import Publish from './actionItems/publish';
import Unpublish from './actionItems/unpublish';
import Renewal from './actionItems/renewal/renewal';
import Archive from './actionItems/archive';
import { getComplianceStateLabel } from '../utils/utils';
import { resetActivityInfo } from '../../purchase/purchaseService';
import actionCodes from '../data/complianceActionCodes.json';

const appModels = require('../../util/appModels').default;

const faIcons = {
  PUBLISH: faCheckCircle,
  PUBLISHACTIVE: faCheckCircle,
  UNPUBLISH: faTimesCircle,
  UNPUBLISHACTIVE: faTimesCircle,
  STARTRENEWAL: faClock,
  STARTRENEWALACTIVE: faClock,
  COMPLETERENEWAL: faClock,
  COMPLETERENEWALACTIVE: faClock,
  SETASDRAFT: faStoreAlt,
  SETASDRAFTACTIVE: faStoreAlt,
  ARCHIVE: faCaretSquareDown,
  ARCHIVEACTIVE: faCaretSquareDown,
};

const complianceDetailInfo = () => {
  const dispatch = useDispatch();
  const defaultActionText = 'Compliance Actions';
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [publishModal, showPublishModal] = useState(false);
  const [unpublishModal, showUnpublishModal] = useState(false);
  const [renewalModal, showRenewalModal] = useState(false);
  const [draftModal, showDraftModal] = useState(false);
  const [archiveModal, showArchiveModal] = useState(false);
  const [renewalHeader, setRenewalHeader] = useState('');
  const {
    complianceDetails,
  } = useSelector((state) => state.compliance);
  const {
    userRoles,
  } = useSelector((state) => state.user);
  const {
    createActivityInfo,
  } = useSelector((state) => state.purchase);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);

  const viewData = complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) ? complianceDetails.data[0] : false;

  useEffect(() => {
    if ((tenantUpdateInfo && tenantUpdateInfo.data) && (complianceDetails && complianceDetails.data)) {
      dispatch(getComplianceDetail(complianceDetails.data[0].id, appModels.BULIDINGCOMPLIANCE));
    }
  }, [tenantUpdateInfo]);

  useEffect(() => {
    if (selectedActions === 'Publish') {
      showPublishModal(true);
    }
    if (selectedActions === 'Unpublish') {
      showUnpublishModal(true);
    }
    if (selectedActions === 'Start Renewal') {
      showRenewalModal(true);
      setRenewalHeader('Start Renewal');
    }
    if (selectedActions === 'Complete Renewal') {
      showRenewalModal(true);
      setRenewalHeader('Complete Renewal');
    }
    if (selectedActions === 'Set as Draft') {
      showDraftModal(true);
    }
    if (selectedActions === 'Archive') {
      showArchiveModal(true);
    }
  }, [enterAction]);

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const bcsState = complianceDetails && complianceDetails.data ? complianceDetails.data[0].state : '';
    const hasExpiry = complianceDetails && complianceDetails.data ? complianceDetails.data[0].is_has_expiry : '';
    const archiveNotVisibleState = ['Draft', 'Active', 'Due For Renewal', 'Renewal In Progress', 'Expired'];
    const startRenewalNotVisibleState = ['Active', 'Due For Renewal', 'Expired'];
    if (actionName === 'Publish' && bcsState !== 'Draft') {
      allowed = false;
    }
    if (actionName === 'Unpublish' && bcsState !== 'Active') {
      allowed = false;
    }
    if (actionName === 'Start Renewal' && (!hasExpiry || !startRenewalNotVisibleState.includes(bcsState))) {
      allowed = false;
    }
    if (actionName === 'Complete Renewal' && bcsState !== 'Renewal In Progress') {
      allowed = false;
    }
    if (actionName === 'Set as Draft' && bcsState !== 'Archived') {
      allowed = false;
    }
    if (actionName === 'Archive' && !archiveNotVisibleState.includes(bcsState)) {
      allowed = false;
    }
    return allowed;
  };

  const cancelComplianceState = () => {
    dispatch(resetComplianceState());
    dispatch(resetActivityInfo());
    const viewId = viewData && viewData.id ? viewData.id : '';
    dispatch(getComplianceDetail(viewId, appModels.BULIDINGCOMPLIANCE));
  };

  const cancelRenewal = () => {
    dispatch(resetComplianceState());
    dispatch(resetActivityInfo());
    dispatch(resetRenewalDetail());
    const viewId = viewData && viewData.id ? viewData.id : '';
    dispatch(getComplianceDetail(viewId, appModels.BULIDINGCOMPLIANCE));
  };

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const complianceData = complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) ? complianceDetails.data[0] : '';
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const loading = complianceDetails && complianceDetails.loading;

  return (
    <>
      {!loading && viewData && (
      <>
        <Row className="mt-3 globalModal-header-cards">
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="9" lg="9" xs="12" className="">
                    <p className="mb-0 font-weight-500 font-tiny">
                      COMPLIANCE
                    </p>
                    <p className="mb-0 font-weight-700">
                      <Tooltip title={getDefaultNoValue(extractNameObject(viewData.compliance_id, 'name'))} placement="right">
                        {truncate(getDefaultNoValue(extractNameObject(viewData.compliance_id, 'name')), '30')}
                      </Tooltip>
                    </p>
                    <span className="font-weight-500 font-tiny">
                      <Tooltip title={getDefaultNoValue(extractNameObject(viewData.compliance_act, 'name'))} placement="right">
                        {truncate(getDefaultNoValue(extractNameObject(viewData.compliance_act, 'name')), '30')}
                      </Tooltip>
                    </span>
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
                      SUBMITTED TO
                    </p>
                    <p className="mb-0 font-weight-700">
                      {getDefaultNoValue(extractNameObject(viewData.submitted_to, 'name'))}
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
                      {getComplianceStateLabel(complianceData.state)}
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
                                  icon={faIcons[`${selectedActionImage}ACTIVE`]}
                                />
                              ) : ''}
                            <span className="font-weight-700">
                              {selectedActions}
                              <FontAwesomeIcon size="sm" color="primary" className="float-right mt-1" icon={faChevronDown} />
                            </span>
                          </DropdownToggle>
                          <DropdownMenu className="w-100">
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
        </Row>
        {publishModal && (
        <Publish
          atFinish={() => {
            showPublishModal(false); cancelComplianceState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          complianceDetails={complianceDetails}
          publishModal
        />
        )}
        {unpublishModal && (
        <Unpublish
          atFinish={() => {
            showUnpublishModal(false); cancelComplianceState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          complianceDetails={complianceDetails}
          unpublishModal
        />
        )}
        {draftModal && (
        <SetToDraft
          atFinish={() => {
            showDraftModal(false); cancelComplianceState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          complianceDetails={complianceDetails}
          draftModal
        />
        )}
        {archiveModal && (
        <Archive
          atFinish={() => {
            showArchiveModal(false); cancelComplianceState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          complianceDetails={complianceDetails}
          archiveModal
        />
        )}
       {renewalModal &&
       ( <Modal size={createActivityInfo && createActivityInfo.data ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={renewalModal}>
          <ModalHeaderComponent
            title={renewalHeader}
            imagePath={false}
            closeModalWindow={() => { showRenewalModal(false); cancelRenewal(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
            response={createActivityInfo}
          />
          <ModalBody className="mt-0 pt-0">
            <Renewal
              detail={complianceDetails}
              buttonName={renewalHeader}
              modalName={appModels.BULIDINGCOMPLIANCE}
              afterReset={() => { showRenewalModal(false); cancelRenewal(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
            />
          </ModalBody>
        </Modal>)}
      </>
      )}
    </>
  );
};

export default complianceDetailInfo;
