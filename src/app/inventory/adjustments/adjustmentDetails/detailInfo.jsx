/* eslint-disable react/jsx-no-useless-fragment */
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
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStoreAlt, faCheckCircle, faTimesCircle, faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';

import DetailViewFormat from '@shared/detailViewFormat';
import {
  getDefaultNoValue,
  getListOfModuleOperations,
} from '../../../util/appUtils';
import { getStateLabel } from '../utils/utils';
// import { getInventText } from '../utils/utils';
import customData from '../data/customData.json';
import ActionAdjustment from '../actionItems/actionAdjustment';
import ActionValidate from '../actionItems/actionValidate';
import actionCodes from '../../data/actionCodes.json';

const faIcons = {
  START: faStoreAlt,
  STARTACTIVE: faStoreAlt,
  VALIDATE: faCheckCircle,
  VALIDATEACTIVE: faCheckCircle,
  CANCEL: faTimesCircle,
  CANCELACTIVE: faTimesCircle,
};

const DetailInfo = (props) => {
  const {
    detail,
  } = props;
  const defaultActionText = 'Stock Audit Actions';
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [actionModal, showActionModal] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const { userRoles } = useSelector((state) => state.user);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isStartable = allowedOperations.includes(actionCodes['Start Adjustment']);
  const isValidatable = allowedOperations.includes(actionCodes['Validate Adjustment']);

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
    const whState = detail && detail.data ? detail.data[0].state : '';
    if (whState === 'done') {
      allowed = false;
    }
    if (actionName === 'Start' && (whState === 'cancel' || whState === 'confirm' || !isStartable)) {
      allowed = false;
    }
    if (actionName === 'Validate' && (whState === 'cancel' || whState === 'draft' || !isValidatable)) {
      allowed = false;
    }
    if (actionName === 'Set to Draft' && (whState === 'cancel' || whState === 'draft')) {
      allowed = false;
    }
    return allowed;
  }

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';
  const loading = detail && detail.loading;

  return (
    <>
      {!loading && detailData && (
        <>
          <Row className="mt-3 globalModal-header-cards">
            <Col sm="12" md="6" lg="6" xs="12" className="p-0">
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny">
                        STOCK AUDIT
                      </p>
                      <p className="mb-0 font-weight-700">
                        <Tooltip title={getDefaultNoValue(detailData.name)} placement="right">
                          {getDefaultNoValue(detailData.name)}
                        </Tooltip>
                      </p>
                      {getStateLabel(detailData.state)}
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={assetDefault} alt="asset" width="30" className="mt-3" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            {/* <Col sm="12" md="3" lg="3" xs="12" className="p-0">
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny">
                        INVENTORY LOCATION
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
                        {getStateLabel(detailData.state)}
                      </p>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={logsIcon} alt="asset" width="25" className="mt-3" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col> */}
            <Col sm="12" md="6" lg="6" xs="12" className="p-0">
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
                              {customData && customData.actionItems.map((actions) => (
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
                                )
                              ))}
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
          {actionModal && actionText !== 'Validate' && (
            <ActionAdjustment
              atFinish={() => {
                showActionModal(false);
                setSelectedActions(defaultActionText);
              }}
              actionText={actionText}
              actionCode={actionCode}
              details={detail}
              actionModal
            />
          )}
          {actionModal && actionText === 'Validate' && (
            <ActionValidate
              atFinish={() => {
                showActionModal(false);
                setSelectedActions(defaultActionText);
              }}
              actionText={actionText}
              actionCode={actionCode}
              details={detail}
              actionModal
            />
          )}
          <DetailViewFormat detailResponse={detail} />
        </>
      )}
    </>
  );
};
// eslint-disable-next-line no-lone-blocks
{ /*
    <Card className="border-0">
      {detailData && (
      <CardBody>
        <Row>
          <Col sm="12" md="12" xs="12" lg="6">
            {customData && customData.actionItems.map((actions) => (
              checkActionAllowed(actions.displayname) && (
                <span
                  aria-hidden="true"
                  id="switchAction"
                  className={actions.displayname === selectedActions ? 'text-info pl-2 cursor-pointer' : 'pl-2 cursor-pointer font-weight-400'}
                  key={actions.id}
                  onClick={() => switchActionItem(actions)}
                >
                  <FontAwesomeIcon
                    className={actions.displayname === selectedActions ? 'text-info mr-2' : 'mr-2'}
                    color="info"
                    icon={faIcons[actions.name]}
                  />
                  {actions.displayname}
                </span>
              )
            ))}
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="text-right">
            {customData && customData.stateTypes.map((st) => (
              <span key={st.value} className={detailData.state === st.value ? 'text-info mr-3 font-weight-800' : 'mr-3 tab_nav_link'}>{st.label}</span>
            ))}
          </Col>
        </Row>

        <hr />
        <h5 className="ml-3">{getDefaultNoValue(detailData.name)}</h5>
        <Row className="ml-1 mr-1 mt-3">
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Inventory Location</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.location_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Inventory of</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(getInventText(detailData.filter))}</span>
            </Row>
            <hr className="mt-0" />
            {detailData.filter === 'category' && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Product Category</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.category_id))}</span>
              </Row>
              <hr className="mt-0" />
            </>
            )}
            {(detailData.filter === 'none' || detailData.filter === 'category') && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Include Exhausted Products</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{detailData.exhausted ? 'Yes' : 'No'}</span>
              </Row>
              <hr className="mt-0" />
            </>

            )}
          </Col>
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Inventory Date</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(getCompanyTimezoneDate(detailData.date, userInfo, 'datetime'))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Company</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
            </Row>
            <hr className="mt-0" />
            {detailData.filter === 'product' && (
              <>
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-700 text-roman-silver">Product</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.product_id))}</span>
                </Row>
                <hr className="mt-0" />
              </>
            )}
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Accounting Date</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(getCompanyTimezoneDate(detailData.accounting_date, userInfo, 'datetime'))}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
        </Row>
      </CardBody>
      )}
      {actionModal && (
        <ActionAdjustment
          atFinish={() => {
            showActionModal(false);
            setSelectedActions(defaultActionText);
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={detail}
          actionModal
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
