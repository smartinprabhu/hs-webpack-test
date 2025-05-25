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
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faStoreAlt, faCheckCircle, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import DetailViewFormat from '@shared/detailViewFormat';
import {
  getDefaultNoValue,
  extractTextObject, getLocalTime,
} from '../../../util/appUtils';
import { getStateLabel, getInventText } from '../utils/utils';
import customData from '../data/customData.json';
import ActionAgjustment from '../actionItems/actionAdjustment';

const faIcons = {
  START: faStoreAlt,
  STARTACTIVE: faStoreAlt,
  VALIDATE: faCheckCircle,
  VALIDATEACTIVE: faCheckCircle,
  CANCEL: faTimesCircle,
  CANCELACTIVE: faTimesCircle,
};

const AdjustmentDetailInfo = () => {
  const defaultActionText = 'Adjustment Actions';
  const [seeMore, setMore] = useState(false);
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');

  const { adjustmentDetail } = useSelector((state) => state.inventory);

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
    const whState = adjustmentDetail && adjustmentDetail.data ? adjustmentDetail.data[0].state : '';
    if (whState === 'done') {
      allowed = false;
    }
    if (actionName === 'Start' && (whState === 'confirm')) {
      allowed = false;
    }
    if (actionName === 'Validate' && (whState === 'cancel' || whState === 'draft')) {
      allowed = false;
    }
    if (actionName === 'Cancel' && (whState === 'cancel' || whState === 'draft')) {
      allowed = false;
    }
    return allowed;
  }

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const detailData = adjustmentDetail && (adjustmentDetail.data && adjustmentDetail.data.length > 0) ? adjustmentDetail.data[0] : '';

  return (
    <>
      <Card className="border-0 h-100">
        {adjustmentDetail && (adjustmentDetail.data && adjustmentDetail.data.length > 0) && (
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
              <span className="font-weight-800 font-side-heading mb-1 mt-3">ADJUSTMENT INFO</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Inventory of
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(getInventText(detailData.filter))}
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
                      Inventory Date
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(getLocalTime(detailData.date))}
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
                      Company
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(extractTextObject(detailData.company_id))}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {seeMore && (
              <>
                {detailData.filter === 'product' && (
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
                )}
                {detailData.filter === 'category' && (
                <Row className="pb-2">
                  <Col md="12" xs="12" sm="12" lg="12">
                    <Card className="bg-lightblue">
                      <CardBody className="p-1">
                        <p className="font-weight-400 mb-1 ml-1">
                          Product Category
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(extractTextObject(detailData.category_id))}
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                )}
                {(detailData.filter === 'none' || detailData.filter === 'category') && (
                <Row className="pb-2">
                  <Col md="12" xs="12" sm="12" lg="12">
                    <Card className="bg-lightblue">
                      <CardBody className="p-1">
                        <p className="font-weight-400 mb-1 ml-1">
                          Include Exhausted Products
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2 text-capital">
                          {detailData.exhausted ? 'Yes' : 'No'}
                        </p>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                )}
                <Row className="pb-2">
                  <Col md="12" xs="12" sm="12" lg="12">
                    <Card className="bg-lightblue">
                      <CardBody className="p-1">
                        <p className="font-weight-400 mb-1 ml-1">
                          Accounting Date
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(getLocalTime(detailData.accounting_date))}
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
        <ActionAgjustment
          atFinish={() => {
            showActionModal(false);
            setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={adjustmentDetail}
          actionModal
        />
        )}
        <DetailViewFormat detailResponse={adjustmentDetail} />
      </Card>
    </>
  );
};

export default AdjustmentDetailInfo;
