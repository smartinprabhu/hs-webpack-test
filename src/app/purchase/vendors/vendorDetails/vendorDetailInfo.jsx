/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  faChevronDown, faEdit, faClock, faEnvelope, faEye,
} from '@fortawesome/free-solid-svg-icons';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import ErrorContent from '@shared/errorContent';
import assetMiniBlueIcon from '@images/icons/assetMiniBlue.svg';
import Loader from '@shared/loading';
import {
  getDefaultNoValue, generateErrorMessage,
} from '../../../util/appUtils';
import customData from '../data/customData.json';
import {
  getVendorTags, getVendorDetail,
  resetActivityInfo, getQuotationFilters, setIsRequestQuotation,
} from '../../purchaseService';
import vendorActions from '../../data/customData.json';
import {
  resetMessage,
} from '../../../helpdesk/ticketService';
import SendMessage from '../../utils/sendMessage';
import LogNote from '../../utils/logNote';
import AddScheduleActivity from '../../utils/addSheduleActivity/addSheduleActivity';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  SENDMESSAGE: faEnvelope,
  SENDMESSAGEACTIVE: faEnvelope,
  LOGNOTE: faEdit,
  LOGNOTEACTIVE: faEdit,
  SCHEDULEACTIVITY: faClock,
  SCHEDULEACTIVITYACTIVE: faClock,
};

const VendorDetailInfo = () => {
  const dispatch = useDispatch();
  const defaultActionText = 'Vendor Actions';
  const resModelId = 74;
  const [seeMore, setMore] = useState(false);
  const [modal, setModal] = useState(false);
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [messageModal, showMessageModal] = useState(false);
  const [noteModal, showNoteModal] = useState(false);
  const [addActivityModal, setActivityModal] = useState(false);
  const {
    vendorDetails,
    vendorTags,
    createActivityInfo,
  } = useSelector((state) => state.purchase);

  const {
    createMessageInfo,
  } = useSelector((state) => state.ticket);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);

  useEffect(() => {
    if ((tenantUpdateInfo && tenantUpdateInfo.data) && (vendorDetails && vendorDetails.data)) {
      dispatch(getVendorDetail(vendorDetails.data[0].id, appModels.PARTNER));
    }
  }, [tenantUpdateInfo]);

  useEffect(() => {
    if (vendorDetails && vendorDetails.data && vendorDetails.data[0].category_id) {
      dispatch(getVendorTags(vendorDetails.data[0].category_id, appModels.PARTNERCATEGORY));
    }
  }, [vendorDetails]);

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

  const toggle = () => {
    setModal(!modal);
  };

  const cancelMessage = () => {
    const viewId = vendorDetails && vendorDetails.data ? vendorDetails.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getVendorDetail(viewId, appModels.PARTNER));
    }
    dispatch(resetMessage());
  };

  const cancelLogNote = () => {
    const viewId = vendorDetails && vendorDetails.data ? vendorDetails.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getVendorDetail(viewId, appModels.PARTNER));
    }
    dispatch(resetMessage());
  };

  const cancelActivity = () => {
    const viewId = vendorDetails && vendorDetails.data ? vendorDetails.data[0].id : '';
    if (createActivityInfo && createActivityInfo.data) {
      dispatch(getVendorDetail(viewId, appModels.PARTNER));
    }
    dispatch(resetActivityInfo());
  };

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const vendorData = vendorDetails && (vendorDetails.data && vendorDetails.data.length > 0) ? vendorDetails.data[0] : '';

  const onLoadPurchaseOrders = () => {
    if (vendorDetails && vendorDetails.data && vendorDetails.data.length) {
      const filters = [{
        id: vendorDetails.data[0].id,
        label: vendorDetails.data[0].name,
      }];
      dispatch(getQuotationFilters([], [], filters, []));
      dispatch(setIsRequestQuotation(true));
    }
  };

  return (
    <>
      <Card className="border-0 h-100">
        {vendorDetails && (vendorDetails.data && vendorDetails.data.length > 0) && (
          <CardBody data-testid="success-case">
            <Row className="pb-3">
              <Col md="12" xs="12" sm="12" lg="12" className="mb-2">
                <img
                  aria-hidden="true"
                  src={vendorData.image_small ? `data:image/png;base64,${vendorData.image_small}` : assetMiniBlueIcon}
                  alt="vendor"
                  className="m-0 cursor-pointer"
                  width="50"
                  height="50"
                  onClick={() => toggle()}
                />
              </Col>
              <Col md="12" sm="12" xs="12" lg="12">
                <h6 className="mb-0">{getDefaultNoValue(vendorData.name)}</h6>
                <p className="m-0">
                  <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                  {getDefaultNoValue(vendorData.email)}
                </p>
                <p className="m-0">
                  <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                  {getDefaultNoValue(vendorData.mobile)}
                </p>
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
                          {vendorActions && vendorActions.actionItems.map((actions) => (
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
                          ))}
                        </DropdownMenu>
                      </ButtonDropdown>
                    </Col>
                  </Row>
                </CardBody>
              </Col>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-3">PURCHASE ORDERS INFO</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Total Purchase Orders
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {vendorData.purchase_order_count}
                      {vendorData.purchase_order_count ? (
                        <Link to="/purchase/requestforquotation">
                          <FontAwesomeIcon onClick={() => onLoadPurchaseOrders()} size="sm" color="info" className="ml-2 cursor-pointer" icon={faEye} />
                        </Link>
                      ) : (<span />)}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-3">VENDOR INFO</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Type
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(customData && vendorData.company_type && customData.companyTypeNames
                        && customData.companyTypeNames[vendorData.company_type] ? customData.companyTypeNames[vendorData.company_type].label : '')}
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
                      Company Name
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(vendorData.company_name ? vendorData.company_name : '')}
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
                      Phone
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(vendorData.phone)}
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
                      Website
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(vendorData.website)}
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
                          Language
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(customData && vendorData.lang && customData.langugageTypes
                        && customData.langugageTypes[vendorData.lang] ? customData.langugageTypes[vendorData.lang].label : '')}
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
                          Tags
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {(vendorTags && vendorTags.data) && vendorTags.data.map((cont) => (
                            <span className="mr-2">{cont.name}</span>
                          ))}
                          {vendorTags && vendorTags.err ? getDefaultNoValue('') : ''}
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
                          Address
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(vendorData.street)}
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
                          City
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2 text-capital">
                          {getDefaultNoValue(vendorData.city)}
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
                          State
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(vendorData.state_id ? vendorData.state_id[1] : '')}
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
                          Country
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(vendorData.country_id ? vendorData.country_id[1] : '')}
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
                          ZIP Code
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(vendorData.zip)}
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
            <Modal isOpen={modal} size="lg">
              <ModalHeader toggle={toggle}>{vendorData.name}</ModalHeader>
              <ModalBody>
                <img
                  src={vendorData.image_medium ? `data:image/png;base64,${vendorData.image_medium}` : assetMiniBlueIcon}
                  alt={vendorData.name}
                  width="100%"
                  height="100%"
                  aria-hidden="true"
                />
              </ModalBody>
            </Modal>
          </CardBody>
        )}
        {messageModal && (
          <SendMessage
            atFinish={() => {
              showMessageModal(false); cancelMessage();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            modalName={appModels.PARTNER}
            title="Send Message"
            subTitle={vendorDetails && vendorDetails.data ? vendorDetails.data[0].name : ''}
            detail={vendorDetails}
            messageModal
          />
        )}
        {noteModal && (
          <LogNote
            atFinish={() => {
              showNoteModal(false); cancelLogNote();
              setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            modalName={appModels.PARTNER}
            title="Log Note"
            subTitle={vendorDetails && vendorDetails.data ? vendorDetails.data[0].name : ''}
            detail={vendorDetails}
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
              detail={vendorDetails}
              modalName={appModels.PARTNER}
              resModelId={resModelId}
              afterReset={() => { setActivityModal(false); cancelActivity(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
            />
          </ModalBody>
        </Modal>
        {vendorDetails && vendorDetails.loading && (
          <CardBody className="mt-4" data-testid="loading-case">
            <Loader />
          </CardBody>
        )}
        {(vendorDetails && vendorDetails.err) && (
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(vendorDetails)} />
          </CardBody>
        )}
      </Card>
    </>
  );
};

export default VendorDetailInfo;
