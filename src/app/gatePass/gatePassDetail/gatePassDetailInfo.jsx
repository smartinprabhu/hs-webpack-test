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
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faCog, faPencilAlt, faCheckCircle, faTag, faPrint,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import locationBlack from '@images/drawerLite/locationLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import envelopeIcon from '@images/icons/envelope.svg';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';

import {
  getDefaultNoValue, extractNameObject,
} from '../../util/appUtils';
import {
  getStateLabel,
} from '../utils/utils';

const faIcons = {
  AUTHORIZE: faCheckCircle,
  PREPARE: faTag,
  ISSUEPERMIT: faCheckCircle,
  VALIDATE: faCheckCircle,
  REVIEW: faPencilAlt,
  PRINTPDF: faPrint,
  EXTEND: faTag,
};

const GatePassDetailInfo = (props) => {
  const { detailData, setViewModal } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Gate Pass Actions';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const loading = detailData && detailData.loading;

  return (
    <>
      {!loading && viewData && (
        <Row className="mt-3 globalModal-header-cards">
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="9" lg="9" xs="12" className="">
                    <p className="mb-0 font-weight-500 font-tiny">
                      REQUESTOR
                    </p>
                    <p className="mb-0 font-weight-700">
                      {getDefaultNoValue(extractNameObject(viewData.requestor_id, 'name'))}
                    </p>
                    <span className="font-weight-500 font-tiny">
                      {getDefaultNoValue(viewData.type)}
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
                      SPACE
                    </p>
                    <p className="mb-0 font-weight-700">
                      {getDefaultNoValue(extractNameObject(viewData.space_id, 'path_name'))}
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
                      {getDefaultNoValue(getStateLabel(viewData.state))}
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
                          <DropdownMenu />
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
      )}
    </>
  );
};

GatePassDetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  setViewModal: PropTypes.func.isRequired,
};

export default GatePassDetailInfo;
