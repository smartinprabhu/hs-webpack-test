/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  ButtonDropdown,
  DropdownToggle,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';
import DetailViewFormat from '@shared/detailViewFormat';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import {
  getDefaultNoValue,
} from '../../../util/appUtils';

const ReOrderingRulesDetailsInfo = (props) => {
  const {
    detail,
  } = props;
  const [reOrderingRule, setReOrderingRule] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const defaultActionText = 'Reordering Rules';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [selectedActions, setSelectedActions] = useState(defaultActionText);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const {
    reOrderingRuleDetailsInfo,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (userInfo && userInfo.data && reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.data && reOrderingRuleDetailsInfo.data.length) {
      setReOrderingRule(reOrderingRuleDetailsInfo.data[0]);
    }
  }, [reOrderingRuleDetailsInfo, userInfo]);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';
  const loading = detailData && detailData.loading;

  const faIcons = {
  };
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
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
                        OPERATION TYPE
                      </p>
                      <p className="mb-0 font-weight-700">
                        <Tooltip title={getDefaultNoValue(detailData.name)} placement="right">
                          {getDefaultNoValue(detailData.name)}
                        </Tooltip>
                      </p>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={assetDefault} alt="asset" width="30" className="mt-3" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            {/*  <Col sm="12" md="3" lg="3" xs="12" className="p-0">
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny">
                        LOCATION
                      </p>
                      <p className="mb-0 font-weight-700">
                        {getDefaultNoValue(extractTextObject(detailData.warehouse_id))}
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
                        <span key={detailData.active} className="mb-0 font-weight-700">{detailData.active ? <Badge color="success" className="badge-text no-border-radius" pill>Active</Badge> : <Badge color="danger" className="badge-text no-border-radius" pill>Inactive</Badge>}</span>
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
          <DetailViewFormat detailResponse={detail} />
        </>
      )}
    </>
  );
};

// eslint-disable-next-line no-lone-blocks
{ /*   <>
      {reOrderingRule ? (
        <Card className="border-0 h-100">
          <CardBody data-testid="success-case">
            <Row>
              <Col md="8" xs="8" sm="8" lg="8">
                <h4 className="mb-1 font-weight-800 font-medium" title={reOrderingRule.name}>{reOrderingRule.name}</h4>
                <p className="mb-1 font-weight-400 mt-1 font-tiny">
                  {reOrderingRule.product_id && reOrderingRule.product_id.length ? reOrderingRule.product_id[1] : getDefaultNoValue(reOrderingRule.product_id)}
                </p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-center">
                <img
                  src={assetMiniBlueIcon}
                  alt="Product"
                  className="m-0"
                  width="35"
                  height="35"
                  aria-hidden="true"
                />
              </Col>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-3">REORDERING RULE INFO</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Product
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-1">
                      {reOrderingRule.product_id && reOrderingRule.product_id.length ? reOrderingRule.product_id[1] : getDefaultNoValue(reOrderingRule.product_id)}
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
                      Location
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-1">
                      {reOrderingRule.location_id && reOrderingRule.location_id.length ? reOrderingRule.location_id[1] : getDefaultNoValue(reOrderingRule.location_id)}
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
                      Warehouse
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-1">
                      {reOrderingRule.warehouse_id && reOrderingRule.warehouse_id.length ? reOrderingRule.warehouse_id[1] : getDefaultNoValue(reOrderingRule.warehouse_id)}
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
                    <p className="font-weight-800 font-side-heading mb-0 ml-1">
                      {reOrderingRule.company_id && reOrderingRule.company_id.length ? reOrderingRule.company_id[1] : getDefaultNoValue(reOrderingRule.company_id)}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>
      ) : ''}
    </>
  );
}; */ }

ReOrderingRulesDetailsInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default ReOrderingRulesDetailsInfo;
