/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  ButtonDropdown,
  DropdownToggle,
} from 'reactstrap';
import { Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import {
  getDefaultNoValue,
} from '../../../util/appUtils';

const DetailInfo = (props) => {
  const {
    detail,
  } = props;
  const defaultActionText = 'Location';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [selectedActions, setSelectedActions] = useState(defaultActionText);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';
  const loading = detailData && detailData.loading;

  const faIcons = {
  };
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
                        LOCATION
                      </p>
                      <p className="mb-0 font-weight-700">
                        <Tooltip title={getDefaultNoValue(detailData.name)} placement="right">
                          {getDefaultNoValue(detailData.name)}
                        </Tooltip>
                      </p>
                      <p className="mb-0 font-weight-700">
                        {getDefaultNoValue(detailData.location_id)}
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
                        LOCATION TYPE
                      </p>
                      <p className="mb-0 font-weight-700">
                        {getDefaultNoValue(detailData.usage)}
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
          {/* <DetailViewFormat detailResponse={detail} /> */}
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
          <Col sm="12" md="12" xs="12" lg="3">
            <span key={detailData.name} className="text-info mr-3 font-weight-800">
              <img src={inventoryBlueIcon} alt="Actions" width="25" className="mr-2" />
              Current Stock
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="5">
            <span key={detailData.name} className="mr-3 font-weight-800">
              <img src={productBlackIcon} alt="Actions" width="20" className="mr-2" />
              Product
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="4" className="text-right">
            <span key={detailData.name} className="text-info mr-3 font-weight-800">{detailData.active ? 'Active' : 'Inactive'}</span>
          </Col>
        </Row>
        <hr />
        <h5 className="ml-3">{getDefaultNoValue(detailData.name)}</h5>
        <Row className="ml-1 mr-1 mt-3">
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Parent Location</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.location_id))}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Location Type</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{customData.locationTypes[detailData.usage] ? customData.locationTypes[detailData.usage].label : ''}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Owner</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.partner_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Company</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <Checkbox
                name="Is a Scrap Location?"
                id="scrapLocation"
                checked={detailData.scrap_location}
              />
              <Label htmlFor="Is a Scrap Location?" className="mt-2">
                <span className="font-weight-800">Is a Scrap Location?</span>
              </Label>
            </Row>
            <Row className="m-0">
              <Checkbox
                name="Is a Scrap Location?"
                id="scrapLocation"
                checked={detailData.return_location}
              />
              <Label htmlFor="Is a Scrap Location?" className="mt-2">
                <span className="font-weight-800">Is a Return Location?</span>
              </Label>
            </Row>
          </Col>
        </Row>
        <h5 className="ml-3">Localization</h5>
        <Row className="ml-1 mr-1 mt-3">
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Corridor (X)</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{detailData.posx}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Shelves (Y)</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{detailData.posy}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Height (Z)</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{detailData.posz}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Barcode</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{detailData.barcode}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">External Note</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.comment)}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
        </Row>
      </CardBody>
      )}
      <DetailViewFormat detailResponse={detail} />
    </Card>
*/ }

DetailInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DetailInfo;