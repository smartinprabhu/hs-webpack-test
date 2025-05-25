/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardTitle,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Tooltip,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as PropTypes from 'prop-types';

import editIcon from '@images/icons/edit.svg';
import editWhiteIcon from '@images/icons/editWhite.svg';
import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ErrorContent from '@shared/errorContent';
import importMiniIcon from '@images/icons/importMini.svg';
import noDataFoundImg from '@images/noDataFound.svg';
import plusCircleWhiteIcon from '@images/icons/plusCircleWhite.svg';
import locationIcon from '@images/icons/locationBlack.svg';

import LocationDetailInfo from './locationDetailInfo';
import LocationDetailTabs from './locationDetailTabs';
import AssetBulkUpload from '../assetDetails/assetBulkUpload';
import actionCodes from '../data/assetActionCodes.json';
import AddLocation from '../locationDetails/addLocation';
import EditLocation from '../locationDetails/editLocation/editLocation';
import {
  resetCreateSpace, getFloorsList, getEquipmentFilters,
  resetUpdateLocationInfo,
} from '../equipmentService';
import { getListOfOperations, generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const LocationDetail = ({ collapse }) => {
  const dispatch = useDispatch();
  const [tooltipOpen1, setTooltipOpen1] = useState(false);
  const [addLocationModal, showAddLocationModal] = useState(false);
  const [editLocationModal, showEditLocationModal] = useState(false);
  const [bulkUploadModal, showBulkUploadModal] = useState(false);
  const [overviewLink, setOverviewLink] = useState(false);
  const [isButtonHover, setButtonHover] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    getFloorsInfo, getSpaceInfo, createSpaceInfo, updateLocationInfo,
  } = useSelector((state) => state.equipment);
  const { companyDetail } = useSelector((state) => state.setup);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getEquipmentFilters([]));
    }
  }, [userInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (createSpaceInfo && createSpaceInfo.data) && showAddLocationModal) {
      dispatch(getFloorsList(userInfo.data.company.id, appModels.SPACE));
    }
  }, [userInfo, createSpaceInfo, showAddLocationModal]);

  const onReset = () => {
    dispatch(resetCreateSpace());
  };

  const onResetLocation = () => {
    dispatch(resetUpdateLocationInfo());
  };

  const toggle1 = () => setTooltipOpen1(!tooltipOpen1);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  if (overviewLink) {
    return (<Redirect to="/site-configuration" />);
  }

  const noData = getFloorsInfo && getFloorsInfo.err ? getFloorsInfo.err.data : false;

  const isUserError = (userInfo && userInfo.err) || (getFloorsInfo && getFloorsInfo.err);
  const isUserLoading = (userInfo && userInfo.loading) || (getFloorsInfo && getFloorsInfo.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const floorsErrmsg = (getFloorsInfo && getFloorsInfo.err) ? generateErrorMessage(getFloorsInfo) : userErrorMsg;
  const errorMsg = (getSpaceInfo && getSpaceInfo.err) ? generateErrorMessage(getSpaceInfo) : floorsErrmsg;

  const pathCode = companyDetail && companyDetail.data && companyDetail.data.length ? companyDetail.data[0].code : false;

  return (
    <>
      <Card className={collapse ? 'filter-margin-right  h-100' : 'h-100'}>
        <Row>
          <Col sm="12" md="12" lg="12" xs="12">
            <Card className="bg-lightblue border-0 pr-2 pl-2">
              <CardTitle className="pt-2 mb-0">
                <span className="font-weight-800 font-medium">
                  Location Overview
                  {' '}
                  {getSpaceInfo && (getSpaceInfo.data && getSpaceInfo.data.length > 0) && (
                    <span>/</span>
                  )}
                </span>
                {getSpaceInfo && (getSpaceInfo.data && getSpaceInfo.data.length > 0) && (
                  <>
                    <span className="ml-1 font-weight-400 font-16">
                      {`${getSpaceInfo.data[0].name} - (${getSpaceInfo.data[0].sequence_asset_hierarchy})`}
                    </span>
                    <span className="float-right">
                      {allowedOperations.includes(actionCodes['Add an Asset']) && (
                      <Button
                         variant="contained"
                        disabled
                        onClick={() => { showBulkUploadModal(true); }}
                        size="sm"
                        className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                      >
                        <img src={importMiniIcon} className="mr-2 pb-2px" height="12" width="12" alt="upload" />
                        <span className="mr-2">Asset Bulk Upload</span>
                      </Button>
                      )}
                      {allowedOperations.includes(actionCodes['Edit Location']) && (
                      <Button
                         variant="contained"
                        onClick={() => { showEditLocationModal(true); }}
                        onMouseLeave={() => setButtonHover1(false)}
                        onMouseEnter={() => setButtonHover1(true)}
                        size="sm"
                        className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                      >
                        <img src={isButtonHover1 ? editWhiteIcon : editIcon} className="mr-2 pb-2px" height="12" width="12" alt="edit" />
                        <span className="mr-2">Edit</span>
                      </Button>
                      )}
                      <Button
                         variant="contained"
                        size="sm"
                        onClick={() => setOverviewLink(true)}
                        onMouseLeave={() => setButtonHover(false)}
                        onMouseEnter={() => setButtonHover(true)}
                        className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                      >
                        <img src={isButtonHover ? closeCircleWhiteIcon : closeCircleIcon} className="mr-2 pb-2px" height="12" width="12" alt="edit" />
                        <span className="mr-2">Close</span>
                      </Button>
                    </span>
                  </>
                )}
              </CardTitle>
              <hr className="mt-1 mb-1 border-color-grey" />
            </Card>
          </Col>
        </Row>
        <Row className="list m-0 bg-lightblue h-100">
          {getSpaceInfo && (getSpaceInfo.data && getSpaceInfo.data.length > 0) && (
          <>
            <Col sm="12" md="12" lg="4" xs="12" className="p-2">
              <LocationDetailInfo />
            </Col>
            <Col sm="12" md="12" lg="8" xs="12" className="p-2">
              <LocationDetailTabs />
            </Col>
          </>
          )}
          {((getSpaceInfo && getSpaceInfo.loading) || isUserLoading) && (
          <Col sm="12" md="12" lg="12" xs="12" className="p-2 text-center mt-5">
            <div className="mb-2 mt-2">
              <Loader />
            </div>
          </Col>
          )}
          {((getSpaceInfo && getSpaceInfo.err) || isUserError) && !(noData.status_code && noData.status_code === 404) && (
          <Col sm="12" md="12" lg="12" xs="12" className="p-2 text-center mt-5">
            <div className="mb-2 mt-2">
              <ErrorContent errorTxt={errorMsg} />
            </div>
          </Col>
          )}
          {noData && (noData.status_code && noData.status_code === 404) && (
          <Col sm="12" md="12" lg="12" xs="12" className="p-2 text-center mt-5">
            <img src={noDataFoundImg} width="120" height="120" alt="nodata" className="mb-2 mt-5" />
            <br />
            <h4 className="mb-3 font-weight-600">Nothing here... Yet!</h4>
            <Button
              type="button"
              id="Tooltip1"
              variant="contained"
              size="sm"
              className="pt-1 pb-1 pr-2 pl-2 btn-navyblue text-left textwrapdots w-100"
              onClick={() => { showAddLocationModal(true); }}
            >
              <img alt="add" width="16" height="16" className="mr-2 pb-2px" src={plusCircleWhiteIcon} />
              <span>
                Add New Location
              </span>
            </Button>
            <Tooltip placement="top" isOpen={tooltipOpen1} target="Tooltip1" toggle={toggle1}>
              Add New Location
            </Tooltip>
          </Col>
          )}
          <Modal size={(createSpaceInfo && createSpaceInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addLocationModal}>
            <ModalHeader className="modal-justify-header">
              <Row>
                <Col sm="12" md="12" lg="12" xs="12" className="pr-0">
                  <h4 className="font-weight-800 mb-0">
                    <img
                      className="mr-3"
                      src={locationIcon}
                      width="23"
                      height="23"
                      alt="add_location"
                    />
                    Add Location
                  </h4>
                  <hr className="mb-0" />
                </Col>
              </Row>
            </ModalHeader>
            <ModalBody className="mt-0 pt-0">
              <AddLocation
                spaceCategory={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].asset_categ_type : ''}
                afterReset={() => { showAddLocationModal(false); onReset(); }}
                spaceId={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].id : ''}
                pathName={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].path_name : pathCode}
              />
            </ModalBody>
          </Modal>
          <Modal size={(updateLocationInfo && updateLocationInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={editLocationModal}>
            <ModalHeaderComponent title="Edit Location" imagePath={locationIcon} closeModalWindow={() => { showEditLocationModal(false); onResetLocation(); }} response={updateLocationInfo} />
            <ModalBody className="mt-0 pt-0">
              <EditLocation
                afterReset={() => { showEditLocationModal(false); onResetLocation(); }}
              />
            </ModalBody>
          </Modal>
          {bulkUploadModal && (
            <AssetBulkUpload
              atFinish={() => {
                showBulkUploadModal(false);
              }}
              bulkUploadModal
            />
          )}
        </Row>
      </Card>
    </>
  );
};
LocationDetail.propTypes = {
  collapse: PropTypes.bool,
};
LocationDetail.defaultProps = {
  collapse: false,
};

export default LocationDetail;
