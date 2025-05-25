/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faEdit, faClock, faEnvelope, faEye, faArrowsAltH,
} from '@fortawesome/free-solid-svg-icons';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ErrorContent from '@shared/errorContent';
import assetMiniBlueIcon from '@images/icons/assetMiniBlue.svg';
import Loader from '@shared/loading';
import customDataJson from './data/customData.json';

import { resetMessage } from '../../helpdesk/ticketService';
import { getProductDetails, resetActivityInfo } from '../purchaseService';
import { generateErrorMessage, getDefaultNoValue } from '../../util/appUtils';
import SendMessage from '../utils/sendMessage';
import LogNote from '../utils/logNote';
import AddScheduleActivity from '../utils/addSheduleActivity/addSheduleActivity';

const faIcons = {
  SENDMESSAGE: faEnvelope,
  SENDMESSAGEACTIVE: faEnvelope,
  LOGNOTE: faEdit,
  LOGNOTEACTIVE: faEdit,
  SCHEDULEACTIVITY: faClock,
  SCHEDULEACTIVITYACTIVE: faClock,
  PRODUCTMOVES: faArrowsAltH,
  PRODUCTMOVESACTIVE: faArrowsAltH,
};
const appModels = require('../../util/appModels').default;

const ProductDetails = () => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(false);
  const [modal, setModal] = useState(false);
  const defaultActionText = 'Product Actions';
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [messageModal, showMessageModal] = useState(false);
  const [noteModal, showNoteModal] = useState(false);
  const [addActivityModal, setActivityModal] = useState(false);
  const [openReOrdersList, setOpenResordersList] = useState(false);
  const [seeMore, setMore] = useState(false);

  useEffect(() => {
    if (selectedActions === 'Send Message') {
      showMessageModal(true);
    }
    if (selectedActions === 'Log Note') {
      showNoteModal(true);
    }
    if (selectedActions === 'Schedule Activity') {
      setActivityModal(true);
    }
  }, [enterAction]);

  const {
    productDetailsInfo, createActivityInfo,
  } = useSelector((state) => state.purchase);

  const {
    createMessageInfo,
  } = useSelector((state) => state.ticket);

  const { userInfo } = useSelector((state) => state.user);
  useEffect(() => {
    if (userInfo && userInfo.data && productDetailsInfo && (productDetailsInfo.data && productDetailsInfo.data.length > 0)) {
      setProduct(productDetailsInfo.data[0]);
    }
  }, [productDetailsInfo, userInfo]);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };
  const cancelMessage = () => {
    const viewId = productDetailsInfo && productDetailsInfo.data ? productDetailsInfo.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getProductDetails(appModels.PARTS, viewId));
    }
    dispatch(resetMessage());
  };

  const cancelLogNote = () => {
    const viewId = productDetailsInfo && productDetailsInfo.data ? productDetailsInfo.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getProductDetails(appModels.PARTS, viewId));
    }
    dispatch(resetMessage());
  };

  const cancelActivity = () => {
    const viewId = productDetailsInfo && productDetailsInfo.data ? productDetailsInfo.data[0].id : '';
    if (createActivityInfo && createActivityInfo.data) {
      dispatch(getProductDetails(appModels.PARTS, viewId));
    }
    dispatch(resetActivityInfo());
  };

  const toggle = () => {
    setModal(!modal);
  };

  const getType = (productType) => {
    const filteredType = customDataJson.productType.filter((data) => data.value === productType);
    if (filteredType && filteredType.length) {
      return filteredType[0].name;
    }
    return '-';
  };
  if (openReOrdersList) {
    return (
      <Redirect to={`/purchase/products/reordering-rules/${product.id}`} />
    );
  }
  return (
    <>
      {product && !openReOrdersList ? (
        <Card className="border-0 h-100">
          <CardBody data-testid="success-case">
            <Row>
              <Col md="8" xs="8" sm="8" lg="8">
                <h4 className="mb-1 font-weight-800 font-medium" title={product.name}>{product.name}</h4>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-center">
                <img
                  src={product.image_small ? `data:image/png;base64,${product.image_small}` : assetMiniBlueIcon}
                  alt="Product"
                  className="m-0"
                  width="50"
                  height="50"
                  aria-hidden="true"
                  onClick={() => toggle()}
                />
              </Col>
              <Modal isOpen={modal} size="lg">
                <ModalHeader toggle={toggle}>{product.name}</ModalHeader>
                <ModalBody>
                  <img
                    src={product.image_medium ? `data:image/png;base64,${product.image_medium}` : assetMiniBlueIcon}
                    alt={product.name}
                    width="100%"
                    height="100%"
                    aria-hidden="true"
                  />
                </ModalBody>
              </Modal>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-3">ACTIONS</span>
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
                          {customDataJson && customDataJson.actionItems.map((actions) => (
                            <DropdownItem
                              id="switchAction"
                              className="pl-2"
                              key={actions.id}
                              disabled={actions.name === 'PRODUCTMOVES'}
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
                {messageModal && (
                  <SendMessage
                    atFinish={() => {
                      showMessageModal(false); cancelMessage();
                      setSelectedActions(defaultActionText); setSelectedActionImage('');
                    }}
                    modalName={appModels.PARTS}
                    title="Send Message"
                    subTitle={productDetailsInfo && productDetailsInfo.data ? productDetailsInfo.data[0].name : ''}
                    detail={productDetailsInfo}
                    messageModal
                  />
                )}
                {noteModal && (
                  <LogNote
                    atFinish={() => {
                      showNoteModal(false); cancelLogNote();
                      setSelectedActions(defaultActionText); setSelectedActionImage('');
                    }}
                    modalName={appModels.PARTS}
                    title="Log Note"
                    subTitle={productDetailsInfo && productDetailsInfo.data ? productDetailsInfo.data[0].name : ''}
                    detail={productDetailsInfo}
                    noteModal
                  />
                )}
                <Modal size={(createActivityInfo && createActivityInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addActivityModal}>
                  <ModalHeaderComponent
                    title="Add Schedule Activity"
                    imagePath={false}
                    closeModalWindow={() => { setActivityModal(false); cancelActivity(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
                    response={createActivityInfo}
                  />
                  <ModalBody className="mt-0 pt-0">
                    <AddScheduleActivity
                      detail={productDetailsInfo}
                      modalName={appModels.PARTNER}
                      resModelId={193}
                      afterReset={() => { setActivityModal(false); cancelActivity(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
                    />
                  </ModalBody>
                </Modal>
                {productDetailsInfo && productDetailsInfo.loading && (
                  <CardBody className="mt-4" data-testid="loading-case">
                    <Loader />
                  </CardBody>
                )}
                {(productDetailsInfo && productDetailsInfo.err) && (
                  <CardBody>
                    <ErrorContent errorTxt={generateErrorMessage(productDetailsInfo)} />
                  </CardBody>
                )}
              </Col>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-3">PRODUCT INFO</span>
            </Row>
            {product && product.type === 'product' ? (
              <Row className="pb-2">
                <Col md="12" xs="12" sm="12" lg="12">
                  <Card className="bg-lightblue">
                    <CardBody className="p-1">
                      <p className="font-weight-400 mb-1 ml-1">
                        Total Reordering Rules
                      </p>
                      <p className="font-weight-800 font-side-heading mb-0 ml-1">
                        {product.nbr_reordering_rules}
                        {product.nbr_reordering_rules ? (
                          <FontAwesomeIcon size="sm" onClick={() => setOpenResordersList(true)} color="info" className="ml-2 cursor-pointer" icon={faEye} />
                        ) : (<span />)}
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            ) : ''}
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Purchased Product Quantity
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-1">
                      {product.purchased_product_qty}
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
                      Sold Product Quantity
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-1">
                      {product.sales_count}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {product && product.type === 'product' ? (
              <Row className="pb-2">
                <Col md="12" xs="12" sm="12" lg="12">
                  <Card className="bg-lightblue">
                    <CardBody className="p-1">
                      <p className="font-weight-400 mb-1 ml-1">
                        On Hand
                      </p>
                      <p className="font-weight-800 font-side-heading mb-0 ml-1">
                        {product.qty_available}
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            ) : ''}
            {product && product.type === 'product' ? (
              <Row className="pb-2">
                <Col md="12" xs="12" sm="12" lg="12">
                  <Card className="bg-lightblue">
                    <CardBody className="p-1">
                      <p className="font-weight-400 mb-1 ml-1">
                        Forecasted
                      </p>
                      <p className="font-weight-800 font-side-heading mb-0 ml-1">
                        {product.virtual_available}
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            ) : ''}
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Product Type
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-1">
                      {product.type ? getType(product.type) : getDefaultNoValue(product.type)}
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
                      Product Category
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-1">
                      {product.categ_id && product.categ_id.length ? product.categ_id[1] : getDefaultNoValue(product.categ_id)}
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
                      Can Be Sold
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-1">
                      {product.sale_ok ? 'Yes' : 'No'}
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
                      Can Be Purchased
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-1">
                      {product.purchase_ok ? 'Yes' : 'No'}
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
                      Can Be Maintenance
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-1">
                      {product.maintenance_ok ? 'Yes' : 'No'}
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
                          Responsible
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-1">
                          {product.responsible_id && product.responsible_id.length ? product.responsible_id[1] : getDefaultNoValue(product.responsible_id)}
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
                          Unit of Measure
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-1">
                          {product.uom_id && product.uom_id.length ? product.uom_id[1] : getDefaultNoValue(product.uom_id)}
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
                          Purchase Unit of Measure
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-1">
                          {product.uom_po_id && product.uom_po_id.length ? product.uom_po_id[1] : getDefaultNoValue(product.uom_po_id)}
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
        </Card>
      ) : ''}
    </>
  );
};
export default ProductDetails;
