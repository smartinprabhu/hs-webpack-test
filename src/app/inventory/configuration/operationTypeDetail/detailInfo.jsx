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
import DetailViewFormat from '@shared/detailViewFormat';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import {
  getDefaultNoValue,
} from '../../../util/appUtils';

const DetailInfo = (props) => {
  const {
    detail,
  } = props;
  const defaultActionText = 'Operation';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [selectedActions, setSelectedActions] = useState(defaultActionText);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
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
                      {getDefaultNoValue(detailData.code)}
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
                        {getDefaultNoValue(extractTextObject(detailData.default_location_src_id))}
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
{ /* <Card className="border-0">
      {detailData && (
      <CardBody>
        <Row>
          <Col sm="12" md="12" xs="12" lg="8" />
          <Col sm="12" md="12" xs="12" lg="4" className="text-right">
            <span key={detailData.name} className="text-info mr-3 font-weight-800">{detailData.active ? 'Active' : 'Inactive'}</span>
          </Col>
        </Row>
        <hr />
        <Row className="ml-1 mr-1 mt-3">
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Operation Type</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.name)}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Reference Sequence</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.sequence_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Warehouse</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.warehouse_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Barcode</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.barcode)}</span>
            </Row>
            <hr className="mt-0" />
            <h5>Locations</h5>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Default Source Location</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.default_location_src_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Default Destination Location</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.default_location_dest_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <Checkbox
                name="Is a Scrap Location?"
                id="scrapLocation"
                checked={detailData.show_operations}
              />
              <Label htmlFor="Is a Scrap Location?" className="mt-2">
                <span className="font-weight-800">Show Detailed Operations</span>
              </Label>
            </Row>
            {detailData.show_operations ? ''
              : (
                <Row className="m-0">
                  <Checkbox
                    name="Is a Scrap Location?"
                    id="scrapLocation"
                    checked={detailData.show_reserved}
                  />
                  <Label htmlFor="Is a Scrap Location?" className="mt-2">
                    <span className="font-weight-800">Show Reserved</span>
                  </Label>
                </Row>
              )}
          </Col>
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Type of Operation</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{customData.operationTypeList[detailData.code] ? customData.operationTypeList[detailData.code].label : ''}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Operation Type for Returns</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.return_picking_type_id))}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
        </Row>
      </CardBody>
      )}
      <DetailViewFormat detailResponse={detail} />
    </Card>
  );
}; */ }

DetailInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DetailInfo;
