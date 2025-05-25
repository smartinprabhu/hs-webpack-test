/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,

} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { faChevronDown, faCog } from '@fortawesome/free-solid-svg-icons';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';
import locationBlack from '@images/drawerLite/locationLite.svg';
import assetMiniBlueIcon from '@images/drawerLite/assetLite.svg';
import importMiniIcon from '@images/icons/importMiniBlue.svg';

import {
  getDefaultNoValue, numToFloat,
  extractTextObject,
} from '../../../util/appUtils';
import customDataJson from '../data/customData.json';
import ProductBulkUpload from '../../../inventory/productCategory/productBulkUpload';
const DetailInfo = (props) => {
  const {
    detail,
  } = props;
  const defaultActionText = 'Product Actions';
  const [product, setProduct] = useState(false);
  const [modal, setModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);

  const [bulkUploadModal, showBulkUploadModal] = useState(false);
  const [enterAction, setEnterAction] = useState(false);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const {
    productsInfo,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (userInfo && userInfo.data && detail && (detail.data && detail.data.length > 0)) {
      setProduct(detail.data[0]);
    }
  }, [detail, userInfo]);

  useEffect(() => {
    if (selectedActions === 'Product Bulk Upload') {
      showBulkUploadModal(true);
    }
  }, [enterAction]);


  const toggle = () => {
    setModal(!modal);
  };

  const getType = (productType) => {
    const filteredType = customDataJson.productType.filter((data) => data.value === productType);
    if (filteredType && filteredType.length) {
      return filteredType[0].label;
    }
    return '-';
  };

  const getQuantity = (id) => {
    const pdata = productsInfo && productsInfo.data ? productsInfo.data : [];
    const filteredType = pdata.filter((data) => data.id === id);
    console.log(filteredType);
    if (filteredType && filteredType.length) {
      return filteredType[0].qty_available;
    }
    return 0;
  };

  return (
    <Row className="mt-3 globalModal-header-cards">
      <Col sm="12" md="3" lg="3" xs="12" className="p-0">
        <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
          <CardBody className="p-2">
            <Row className="m-0">
              <Col sm="12" md="9" lg="9" xs="12" className="">
                <p className="mb-0 font-weight-500 font-tiny">
                  PRODUCT NAME
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(product.name)}
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img
                  src={product.image_medium && detail && !detail.loading ? `data:image/png;base64,${product.image_medium}` : assetMiniBlueIcon}
                  alt="Product"
                  className="mr-2 cursor-pointer"
                  width="35"
                  height="35"
                  aria-hidden="true"
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
                  PRODUCT TYPE
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(getType(product.type))}
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(extractTextObject(product.location_id))}
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={locationBlack} alt="asset" width="25" className="mt-1" />
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
                  PRODUCT CATEGORY
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(extractTextObject(product.categ_id))}
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={logsIcon} alt="asset" width="25" className="mt-1" />
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
                  QUANTITY ON HAND
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(numToFloat(product.quantity ? product.quantity : getQuantity(product.id)))}
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={handPointerBlack} alt="asset" width="20" className="mt-1" />
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
                    <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="actionDropdown pr-2">
                      <DropdownToggle
                        caret
                        // eslint-disable-next-line max-len
                        className={selectedActionImage !== '' ? 'bg-white text-navy-blue pb-05 pt-05 font-11 rounded-pill text-left' : 'btn-navyblue pb-05 pt-05 font-11 rounded-pill text-left'}
                      >
                        {selectedActionImage !== ''
                          ? (
                            <img alt="add" className="mr-2 pb-2px" src={faIcons[`${selectedActionImage}ACTIVE`]} height="15" width="15" />
                          ) : ''}
                        <span className="font-weight-700">
                          {!selectedActionImage && (
                            <FontAwesomeIcon size="sm" color="primary" className="mr-2 mt-1" icon={faCog} />
                          )}
                          {selectedActions}
                          <FontAwesomeIcon size="sm" color="primary" className="float-right ml-1 mt-1" icon={faChevronDown} />
                        </span>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem
                          id="switchAction"
                          className="pl-2 pr-0"
                          onClick={() => { showBulkUploadModal(true); }}
                        >
                          <img src={importMiniIcon} className="mr-2" height="15" width="15" alt="upload" />
                          <span className="mr-0">Bulk Upload</span>
                        </DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={handPointerBlack} alt="asset" width="20" className="mt-1" />
              </Col>
            </Row>
            {bulkUploadModal && (
              <ProductBulkUpload
                atFinish={() => {
                  showBulkUploadModal(false);
                  setSelectedActionImage('');
                  showBulkUploadModal(false);
                }}
                bulkUploadModal
              />
            )}
          </CardBody>
        </Card>
      </Col>

      <Modal isOpen={modal} size="lg">
        <ModalHeader toggle={toggle}>{product.name}</ModalHeader>
        <ModalBody>
          <img
            src={product.image ? `data:image/png;base64,${product.image}` : assetMiniBlueIcon}
            alt={product.name}
            width="100%"
            height="100%"
            aria-hidden="true"
          />
        </ModalBody>
      </Modal>
    </Row>
  );
};

DetailInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DetailInfo;
