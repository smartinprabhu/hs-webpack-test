/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  DropdownToggle,
  DropdownMenu,
  ButtonDropdown,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle, faEye, faChevronDown, faCog,
  faArrowsAltH, faStoreAlt, faTag, faRandom, faCheckCircle, faCaretSquareDown, faTools, faArrowCircleRight, faArrowCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';
import * as PropTypes from 'prop-types';

import taggedIcon from '@images/icons/tagged.svg';
import locationBlack from '@images/drawerLite/locationLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';

import {
  extractTextObject,
  getDefaultNoValue,
  isOperationsExists,
  getListOfOperations,
} from '../../util/appUtils';
import { getEquipmentStateLabel } from '../utils/utils';

import {
  resetScrap, resetUpdateLocationInfo, resetAddLocationInfo,
  resetSelectedSpace, resetMoveAsset, resetCreateBreakdown, resetOperativeInfo, getAssetDetail, resetUpdateEquipment, getHistoryCard,
} from '../equipmentService';

import MoveAsset from './actionItems/moveAsset';
import StoreInWarehouse from './actionItems/storeInWarehouse';
import TagAsset from './actionItems/tagAsset';
import ReplaceAsset from './actionItems/replaceAsset';
import ValidateAsset from './actionItems/validateAsset';
import ScrapAsset from './actionItems/scrapAsset';
import OperativeAsset from './actionItems/operativeAsset';
import Breakdown from './actionItems/breakdown';
import Action from './actionItems/action';

import assetsActions from '../data/assetsActions.json';
import actionCodesITAsset from '../data/assetActionCodesITAsset.json';
import actionCodes from '../data/assetActionCodes.json';

const appModels = require('../../util/appModels').default;

const faIcons = {
  MOVEASSET: faArrowsAltH,
  MOVEASSETACTIVE: faArrowsAltH,
  STOREWAREHOUSE: faStoreAlt,
  STOREWAREHOUSEACTIVE: faStoreAlt,
  TAGASSET: faTag,
  TAGASSETACTIVE: faTag,
  REPLACEASSET: faRandom,
  REPLACEASSETACTIVE: faRandom,
  VALIDATEASSET: faCheckCircle,
  VALIDATEASSETACTIVE: faCheckCircle,
  SCRAPASSET: faTimesCircle,
  SCRAPASSETACTIVE: faTimesCircle,
  BREAKDOWN: faCaretSquareDown,
  BREAKDOWNACTIVE: faCaretSquareDown,
  OPERATIVEASSET: faTools,
  OPERATIVEASSETACTIVE: faTools,
  CHECKLISTREPORT: faEye,
  ASSIGNACTIVE: faArrowCircleRight,
  ASSIGN: faArrowCircleRight,
  RETURNACTIVE: faArrowCircleLeft,
  RETURN: faArrowCircleLeft,
};

const DetailHeader = (props) => {
  const {
    isITAsset,
    categoryType,
  } = props;
  const defaultActionText = isITAsset ? 'IT Asset Actions' : 'Asset Actions';
  const dispatch = useDispatch();
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [moveModal, showMoveModal] = useState(false);
  const [storeModal, showStoreModal] = useState(false);
  const [tagModal, showTagModal] = useState(false);
  const [replaceModal, showReplaceModal] = useState(false);
  const [validateModal, showValidateModal] = useState(false);
  const [scrapModal, showScrapModal] = useState(false);
  const [operativeModal, showOperativeModal] = useState(false);
  const [breakModal, showBreakModal] = useState(false);
  const [actionModal, showActionModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState(false);
  const [buttonText, setButtonText] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };
  const { userRoles } = useSelector((state) => state.user);

  const { equipmentsDetails } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 && isITAsset) {
      const historyIds = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0].history_card_ids : false;
      if (historyIds) {
        dispatch(getHistoryCard(historyIds, appModels.HISTORYCARD, 'date', 'DESC'));
      }
    }
  }, [equipmentsDetails]);

  useEffect(() => {
    if (selectedActions === 'Move an Asset') {
      showMoveModal(true);
    }
    if (selectedActions === 'Store in Warehouse') {
      showStoreModal(true);
    }
    if (selectedActions === 'Breakdown Asset') {
      showBreakModal(true);
    }
    if (selectedActions === 'Tag Asset') {
      showTagModal(true);
    }
    if (selectedActions === 'Replace Asset') {
      showReplaceModal(true);
    }
    if (selectedActions === 'Validate Asset') {
      showValidateModal(true);
    }
    if (selectedActions === 'Scrap an Asset') {
      showScrapModal(true);
    }
    if (selectedActions === 'Operative Asset') {
      showOperativeModal(true);
    }
    if (selectedActions === 'Assign Asset') {
      showActionModal(true);
      setTitle('Assign Asset');
      setButtonText('Assign');
    }
    if (selectedActions === 'Return Asset') {
      showActionModal(true);
      setTitle('Return Asset');
      setButtonText('Return');
    }
  }, [enterAction]);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  function checkActionAllowed(actionName) {
    let allowed = true;
    const whState = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].state : '';
    const assignStatus = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].assignment_status : '';

    if (actionName === 'Store in Warehouse' && whState === 'wh') {
      allowed = false;
    }
    if (actionName === 'Breakdown Asset' && whState === 'br') {
      allowed = false;
    }
    if (actionName === 'Scrap an Asset' && whState === 'sc') {
      allowed = false;
    }
    if (actionName === 'Operative Asset' && (whState === 'op' || whState === 'sc')) {
      allowed = false;
    }
    if (actionName === 'Assign Asset' && assignStatus === 'Assigned') {
      allowed = false;
    }
    if (actionName === 'Return Asset' && (assignStatus === 'Not Assigned' || !assignStatus)) {
      allowed = false;
    }
    return allowed;
  }

  const cancelMove = () => {
    dispatch(resetMoveAsset());
    dispatch(resetSelectedSpace());
  };

  const cancelStore = () => {
    dispatch(resetScrap());
    dispatch(resetUpdateLocationInfo());
  };

  const cancelTag = () => {
    dispatch(resetScrap());
  };

  const cancelReplace = () => {
    dispatch(resetMoveAsset());
    dispatch(resetSelectedSpace());
  };

  const cancelValidate = () => {
    dispatch(resetMoveAsset());
  };

  const cancelScrap = () => {
    dispatch(resetScrap());
    dispatch(resetUpdateLocationInfo());
  };

  const cancelOperative = () => {
    dispatch(resetAddLocationInfo());
    dispatch(resetOperativeInfo());
  };

  const cancelBreakDown = () => {
    dispatch(resetCreateBreakdown());
  };

  const cancelAssignAsset = () => {
    dispatch(resetUpdateEquipment());
    const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    if (viewId) {
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    }
  };

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const isActionsExists = isOperationsExists(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], isITAsset ? 'IT Asset Management' : 'Asset Registry');

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  let allowedList = assetsActions && assetsActions.actionItems ? assetsActions.actionItems.filter((item) => allowedOperations.includes(actionCodes[item.displayname])) : false;

  if (isITAsset) {
    allowedList = assetsActions && assetsActions.itAssetActionItems ? assetsActions.itAssetActionItems.filter((item) => allowedOperations.includes(actionCodesITAsset[item.displayname])) : false;
  }
  const isListLength = !!(allowedList && allowedList.length);

  const loading = equipmentsDetails && equipmentsDetails.loading;
  const detailData = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 ? equipmentsDetails.data[0] : false;

  return (
    <>
      {!loading && detailData && (
        <>
          <Row className="mt-3 globalModal-header-cards">
            <Col sm="12" md="3" lg="3" xs="12" className="p-0">
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500">
                        ASSET
                      </p>
                      <p className="mb-0 font-weight-700">
                        {getDefaultNoValue(detailData.name)}
                        {detailData.tag_status && detailData.tag_status === 'tagged' && (
                        <Tooltip title="Physically Tagged" placement="right">
                          <span className="ml-2">
                            <img src={taggedIcon} alt="tagged" width="18" />
                          </span>
                        </Tooltip>
                        )}
                      </p>
                      <span className="font-weight-500 font-tiny">
                        {getDefaultNoValue(detailData.equipment_seq)}
                      </span>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img
                        aria-hidden="true"
                        src={detailData.image_small ? `data:image/png;base64,${detailData.image_small}` : assetDefault}
                        alt="asset"
                        className="mt-3 cursor-pointer"
                        width="30"
                        height="30"
                        onClick={() => toggle()}
                      />
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
                        {getDefaultNoValue(extractTextObject(detailData.location_id))}
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
                        {getEquipmentStateLabel(detailData.state)}
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
                        {isListLength && isActionsExists && (
                        <div className="mt-2">
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
                                {!selectedActionImage && (
                                <FontAwesomeIcon size="sm" color="primary" className="mr-2 mt-1" icon={faCog} />
                                )}
                                {selectedActions}
                                <FontAwesomeIcon size="sm" color="primary" className="float-right ml-2 mt-1" icon={faChevronDown} />
                              </span>
                            </DropdownToggle>
                            {isITAsset
                              ? (
                                <DropdownMenu>
                                  {assetsActions && assetsActions.itAssetActionItems.map((actions) => (
                                    allowedOperations.includes(actionCodesITAsset[actions.displayname]) && (
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
                              )
                              : (
                                <DropdownMenu>
                                  {assetsActions && assetsActions.actionItems.map((actions) => (
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
                              )}
                          </ButtonDropdown>
                        </div>
                        )}
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
          <Modal isOpen={modal} size="lg">
            <ModalHeader toggle={toggle}>{detailData.name}</ModalHeader>
            <ModalBody>
              <img
                src={detailData.image_medium ? `data:image/png;base64,${detailData.image_medium}` : assetDefault}
                alt={detailData.name}
                width="100%"
                height="auto"
                aria-hidden="true"
              />
            </ModalBody>
          </Modal>
        </>
      )}
      {moveModal && (
      <MoveAsset
        atFinish={() => {
          showMoveModal(false); cancelMove();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        equipmentsDetails={equipmentsDetails}
        moveModal
      />
      )}
      {storeModal && (
      <StoreInWarehouse
        atFinish={() => {
          showStoreModal(false); cancelStore();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        equipmentsDetails={equipmentsDetails}
        storeModal
      />
      )}
      {tagModal && (
      <TagAsset
        atFinish={() => {
          showTagModal(false); cancelTag();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        equipmentsDetails={equipmentsDetails}
        tagModal
      />
      )}
      {replaceModal && (
      <ReplaceAsset
        atFinish={() => {
          showReplaceModal(false); cancelReplace();
          setSelectedActions(defaultActionText); cancelMove(); setSelectedActionImage('');
        }}
        equipmentsDetails={equipmentsDetails}
        replaceModal
        isITAsset={isITAsset}
      />
      )}
      {validateModal && (
      <ValidateAsset
        atFinish={() => {
          showValidateModal(false); cancelValidate();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        equipmentsDetails={equipmentsDetails}
        validateModal
      />
      )}
      {scrapModal && (
      <ScrapAsset
        atFinish={() => {
          showScrapModal(false); cancelScrap();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        equipmentsDetails={equipmentsDetails}
        scrapModal
      />
      )}
      {operativeModal && (
      <OperativeAsset
        atFinish={() => {
          showOperativeModal(false); cancelOperative();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        equipmentsDetails={equipmentsDetails}
        operativeModal
      />
      )}
      {breakModal && (
      <Breakdown
        atFinish={() => {
          showBreakModal(false); cancelBreakDown();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        equipmentsDetails={equipmentsDetails}
        breakModal
      />
      )}
      {actionModal && (
      <Action
        atFinish={() => {
          showActionModal(false); cancelAssignAsset();
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        atCancel={() => {
          showActionModal(false);
          dispatch(resetUpdateEquipment());
          setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        actionText={title}
        actionButton={buttonText}
        isITAsset={isITAsset}
        equipmentsDetails={equipmentsDetails}
        categoryType={categoryType}
        actionModal
      />
      )}
    </>
  );
};

DetailHeader.propTypes = {
  isITAsset: PropTypes.bool,
  categoryType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

DetailHeader.defaultProps = {
  isITAsset: false,
  categoryType: false,
};
export default DetailHeader;
