/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faStoreAlt, faCheckCircle, faTimesCircle,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

import DetailViewFormat from '@shared/detailViewFormat';
import {
  getDefaultNoValue,
  numToFloat,
  extractTextObject, getCompanyTimezoneDate,
} from '../../../util/appUtils';
import { getStateLabel } from '../utils/utils';
import customData from '../data/customData.json';
import ActionScrap from '../actionItems/actionScrap';
import {
  getTransferFilters,
} from '../../../purchase/purchaseService';
import { setCurrentTab } from '../../inventoryService';

const faIcons = {
  START: faStoreAlt,
  STARTACTIVE: faStoreAlt,
  VALIDATE: faCheckCircle,
  VALIDATEACTIVE: faCheckCircle,
  CANCEL: faTimesCircle,
  CANCELACTIVE: faTimesCircle,
};

const ScrapDetailInfo = () => {
  const dispatch = useDispatch();
  const defaultActionText = 'Scrap Actions';
  const [seeMore, setMore] = useState(false);
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const { scrapDetail } = useSelector((state) => state.inventory);

  useEffect(() => {
    if (customData && customData.actionTypes && customData.actionTypes[selectedActions]) {
      setActionText(customData.actionTypes[selectedActions].text);
      setActionCode(customData.actionTypes[selectedActions].value);
      showActionModal(true);
    }
  }, [enterAction]);

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
   setEnterAction(Math.random());
  };

  function checkActionAllowed(actionName) {
    let allowed = true;
    const whState = scrapDetail && scrapDetail.data ? scrapDetail.data[0].state : '';
    if (whState === 'done') {
      allowed = false;
    }
    if (actionName === 'Validate' && (whState === 'draft')) {
      allowed = true;
    }
    return allowed;
  }

  const loadTransfers = (key, value) => {
    const filters = [{
      key: 'id', value: key, label: value, type: 'id',
    }];
    dispatch(getTransferFilters([], [], filters));
    dispatch(setCurrentTab('Transfers'));
  };

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const detailData = scrapDetail && (scrapDetail.data && scrapDetail.data.length > 0) ? scrapDetail.data[0] : '';

  return (
    <>
      <Card className="border-0 h-100">
        {scrapDetail && (scrapDetail.data && scrapDetail.data.length > 0) && (
          <CardBody data-testid="success-case">
            <Row>
              <Col md="12" xs="12" sm="12" lg="12">
                <h4 className="mb-1 font-weight-800 font-medium" title={detailData.name}>{detailData.name}</h4>
                <p className="mb-1 font-weight-400 mt-1 font-tiny">
                  {getDefaultNoValue(extractTextObject(detailData.location_id))}
                </p>
                {getStateLabel(detailData.state)}
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
                          {customData && customData.actionItems.map((actions) => (
                            <DropdownItem
                              id="switchAction"
                              className="pl-2"
                              key={actions.id}
                              disabled={!checkActionAllowed(actions.displayname)}
                              onClick={() => switchActionItem(actions)}
                            >
                              <FontAwesomeIcon
                                className="mr-2"
                                icon={faIcons[actions.name]}
                              />
                              {actions.displayname}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </ButtonDropdown>
                    </Col>
                  </Row>
                </CardBody>
              </Col>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-3">SCRAP INFO</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Product
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(extractTextObject(detailData.product_id))}
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
                      Quantity
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {numToFloat(detailData.scrap_qty)}
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
                      Scrap Location
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(extractTextObject(detailData.scrap_location_id))}
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
                          Expected Date
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(getCompanyTimezoneDate(detailData.date_expected, userInfo, 'datetime'))}
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
                          Picking
                        </p>
                        <span className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(extractTextObject(detailData.picking_id))}
                        </span>
                        {detailData.picking_id && (
                        <FontAwesomeIcon onClick={() => loadTransfers(detailData.picking_id[0], detailData.picking_id[1])} size="sm" color="info" className="ml-2 cursor-pointer" icon={faEye} />
                        )}
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
                          {getDefaultNoValue(detailData.origin)}
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
          </CardBody>
        )}
        {actionModal && (
        <ActionScrap
          atFinish={() => {
            showActionModal(false);
            setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={scrapDetail}
          actionModal
        />
        )}
        <DetailViewFormat detailResponse={scrapDetail} />
      </Card>
    </>
  );
};

export default ScrapDetailInfo;
