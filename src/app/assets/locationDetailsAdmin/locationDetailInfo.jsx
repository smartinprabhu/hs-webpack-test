/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  ButtonDropdown,
  Card,
  CardBody,
  Col,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { Image } from 'antd';

import plusCircleBlueIcon from '@images/icons/plusCircleBlue.svg';
import locationIcon from '@images/icons/locationBlack.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import workstationBlue from '@images/icons/deskBlue.svg';
import AddLocation from '../locationDetails/addLocation';
import {
  resetCreateSpace,
} from '../equipmentService';
import { getDefaultNoValue, generateErrorMessage, getListOfOperations } from '../../util/appUtils';
import actionCodes from '../data/assetActionCodes.json';
import assetActions from '../data/assetsActions.json';

const faIcons = {
  ADDLOCATION: plusCircleBlueIcon,
  ADDLOCATIONACTIVE: plusCircleBlueIcon,
};

const LocationDetailInfo = () => {
  const dispatch = useDispatch();
  const defaultActionText = 'Location Actions';
  const [addLocationModal, showAddLocationModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [seeMore, setMore] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [modalImage, setModalImage] = useState(false);

  const toggleImage = () => {
    setModalImage(!modalImage);
  };
  const toggle = () => {
    setModal(!modal);
  };

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    getFloorsInfo, getSpaceInfo, createSpaceInfo,
  } = useSelector((state) => state.equipment);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const onReset = () => {
    dispatch(resetCreateSpace());
  };

  const isUserError = (userInfo && userInfo.err) || (getFloorsInfo && getFloorsInfo.err);
  const isUserLoading = (userInfo && userInfo.loading) || (getFloorsInfo && getFloorsInfo.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const floorsErrmsg = (getFloorsInfo && getFloorsInfo.err) ? generateErrorMessage(getFloorsInfo) : userErrorMsg;
  const errorMsg = (getSpaceInfo && getSpaceInfo.err) ? generateErrorMessage(getSpaceInfo) : floorsErrmsg;

  useEffect(() => {
    if (selectedActions === 'Add Location') {
      showAddLocationModal(true);
    }
  }, [enterAction]);

  /* useEffect(() => {
    if (locationImage && locationImage.data && locationImage.data.length > 0 && locationImage.data[0].file_path !== false) {
      if (locationImage.data[0].file_path.includes('https')) {
        setFilePath(locationImage.data[0].file_path);
      } else {
        setFilePath(`${window.location.origin}${`${locationImage.data[0].file_path.replace('+xml', '')}`}`);
      }
    }
  }, [locationImage]); */

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const filePath = getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length && getSpaceInfo.data[0].image_medium ? `data:image/png;base64,${getSpaceInfo.data[0].image_medium}` : false;

  return (
    <>
      <Card className="border-0 h-100">
        {((getSpaceInfo && getSpaceInfo.loading) || isUserLoading) && (
        <div className="mb-2 mt-4">
          <Loader />
        </div>
        )}
        {getSpaceInfo && (getSpaceInfo.data && getSpaceInfo.data.length > 0) && (
          <CardBody>
            <Row>
              <Col md="8" xs="8" sm="8" lg="8">
                <h4 className="mb-1 font-weight-800 font-medium" title={getSpaceInfo.data[0].space_name}>{getSpaceInfo.data[0].space_name}</h4>
                <p className="mb-1 font-weight-400 mt-1 font-tiny">
                  {getSpaceInfo.data[0].sequence_asset_hierarchy}
                </p>
              </Col>
              {filePath && (
              <Col md="4" xs="4" sm="4" lg="4" className="text-right">
                <img src={filePath || workstationBlue} className="cursor-pointer" width="50" height="50" alt="location" onClick={() => toggleImage()} aria-hidden="true" />
              </Col>
              )}
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
                              <img alt="add" className="mr-2 pb-2px" src={faIcons[`${selectedActionImage}ACTIVE`]} height="15" width="15" />
                            ) : ''}
                          <span className="font-weight-700">
                            {selectedActions}
                            <FontAwesomeIcon size="sm" color="primary" className="float-right mt-1" icon={faChevronDown} />
                          </span>
                        </DropdownToggle>
                        <DropdownMenu className="w-100">
                          {assetActions && assetActions.locationActionItems.map((actions) => (
                            allowedOperations.includes(actionCodes[actions.displayname]) && (
                            <DropdownItem
                              id="switchAction"
                              className="pl-2"
                              key={actions.id}
                              onClick={() => switchActionItem(actions)}
                            >
                              <img alt="add" className="mr-2 pb-2px" src={faIcons[actions.name]} height="15" width="15" />
                              {actions.displayname}
                            </DropdownItem>
                            )))}
                        </DropdownMenu>
                      </ButtonDropdown>
                    </Col>
                  </Row>
                </CardBody>
              </Col>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 pl-1 font-side-heading mb-1 mt-2">LOCATION INFO</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Location
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getSpaceInfo.data[0].path_name}
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
                      Parent Space
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(getSpaceInfo.data[0].parent_id ? getSpaceInfo.data[0].parent_id[1] : '')}
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
                      Category
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(getSpaceInfo.data[0].asset_category_id ? getSpaceInfo.data[0].asset_category_id[1] : '')}
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
                      Sub Category
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(getSpaceInfo.data[0].asset_subcategory_id ? getSpaceInfo.data[0].asset_subcategory_id[1] : '')}
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
                          Alias Name
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(getSpaceInfo.data[0].alias_name_space)}
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
                          Sort Sequence
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(getSpaceInfo.data[0].sort_sequence)}
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
                          Square Feet
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getSpaceInfo.data[0].area_sqft}
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
                          Max Occupancy
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getSpaceInfo.data[0].max_occupancy}
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
                          Maintenance Team
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(getSpaceInfo.data[0].maintenance_team_id ? getSpaceInfo.data[0].maintenance_team_id[1] : '')}
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
                          {getDefaultNoValue(getSpaceInfo.data[0].company_id ? getSpaceInfo.data[0].company_id[1] : '')}
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
                          Manager
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(getSpaceInfo.data[0].manager_id ? getSpaceInfo.data[0].manager_id[1] : '')}
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
                          Vendor
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(getSpaceInfo.data[0].vendor_id ? getSpaceInfo.data[0].vendor_id[1] : '')}
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
                          External QR Code
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(getSpaceInfo.data[0].qr_code)}
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
                          Monitored By (L1)
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(getSpaceInfo.data[0].monitored_by_id ? getSpaceInfo.data[0].monitored_by_id[1] : '')}
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
                          Managed By (L2)
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(getSpaceInfo.data[0].managed_by_id ? getSpaceInfo.data[0].managed_by_id[1] : '')}
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
                          Maintained By (L3)
                        </p>
                        <p className="font-weight-800 font-side-heading mb-0 ml-2">
                          {getDefaultNoValue(getSpaceInfo.data[0].maintained_by_id ? getSpaceInfo.data[0].maintained_by_id[1] : '')}
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
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 pl-1 font-side-heading mb-1 mt-2">MAP OVERVIEW</span>
            </Row>
            <Row className="pb-2">
              <Col sm="12" md="12" lg="12" xs="12">
                <Card className="border-0">
                  <CardBody className="p-3 thin-scrollbar" id="containerImage">
                    <center id="map-overview">
                      {(getSpaceInfo.data[0].upload_images) && (
                      <Image.PreviewGroup>
                        <Image
                          width="100%"
                          height="auto"
                          src={`data:image/png;base64,${getSpaceInfo.data[0].upload_images}`}
                        />
                      </Image.PreviewGroup>
                      )}
                    </center>
                    {!(getSpaceInfo.data[0].upload_images) && (
                    <ErrorContent errorTxt="No data found." />
                    )}
                  </CardBody>
                </Card>
                <br />
              </Col>
            </Row>
            <Modal isOpen={modal} size="lg">
              <ModalHeader toggle={toggle}>Map Overview</ModalHeader>
              <ModalBody>
                <img
                  src={getSpaceInfo.data[0].upload_images ? `data:image/png;base64,${getSpaceInfo.data[0].upload_images}` : ''}
                  alt="floor"
                  width="100%"
                  height="100%"
                  aria-hidden="true"
                />
              </ModalBody>
            </Modal>
          </CardBody>
        )}
        {((getSpaceInfo && getSpaceInfo.err) || isUserError) && (
        <CardBody>
          <ErrorContent errorTxt={errorMsg} />
        </CardBody>
        )}
        <Modal size={(createSpaceInfo && createSpaceInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addLocationModal}>
          <ModalHeaderComponent
            title="Add Location"
            imagePath={locationIcon}
            closeModalWindow={() => { setSelectedActions(defaultActionText); setSelectedActionImage(''); showAddLocationModal(false); onReset(); }}
            response={createSpaceInfo}
          />
          <ModalBody className="mt-0 pt-0">
            <AddLocation
              spaceCategory={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].asset_categ_type : ''}
              afterReset={() => { setSelectedActions(defaultActionText); setSelectedActionImage(''); showAddLocationModal(false); onReset(); }}
              spaceId={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].id : ''}
              pathName={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].path_name : ''}
            />
          </ModalBody>
        </Modal>
        <Modal isOpen={modalImage} size="lg">
          <ModalHeader toggle={toggleImage}>{getSpaceInfo.data[0].space_name}</ModalHeader>
          <ModalBody>
            <img
              src={filePath || workstationBlue}
              alt="location1"
              width="100%"
              height="100%"
            />
          </ModalBody>
        </Modal>
      </Card>
    </>
  );
};
export default LocationDetailInfo;
