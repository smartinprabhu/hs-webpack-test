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
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorContent from '@shared/errorContent';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import assetMiniBlueIcon from '@images/icons/assetMiniBlue.svg';
import taggedIcon from '@images/icons/tagged.svg';
import assetIcon from '@images/icons/assetDefault.svg';
import Loader from '@shared/loading';
import { getEquipmentStateLabel, getDefinitonByLabel } from '../utils/utils';
import AssetsDetailUpdate from './assetUpdate/assetsDetailUpdate';
import {
  getDefaultNoValue, generateErrorMessage,
  extractTextObject,
} from '../../util/appUtils';
import {
  getAssetDetail, resetUpdateEquipment,
} from '../equipmentService';

const appModels = require('../../util/appModels').default;

const AssetDetailInfo = (props) => {
  const { isEdit, afterUpdate } = props;
  const dispatch = useDispatch();
  const [updateModal, showUpdateModal] = useState(isEdit);
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const {
    equipmentsDetails, stateChangeInfo, updateEquipment,
  } = useSelector((state) => state.equipment);
  const {
    checklistDeleteInfo,
  } = useSelector((state) => state.maintenance);

  const equipmentData = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0] : '';

  useEffect(() => {
    showUpdateModal(isEdit);
  }, [isEdit]);

  useEffect(() => {
    if ((stateChangeInfo && stateChangeInfo.data) && (equipmentsDetails && equipmentsDetails.data)) {
      dispatch(getAssetDetail(equipmentsDetails.data[0].id, appModels.EQUIPMENT, false));
    }
    if ((updateEquipment && updateEquipment.data) && (equipmentsDetails && equipmentsDetails.data)) {
      dispatch(getAssetDetail(equipmentsDetails.data[0].id, appModels.EQUIPMENT, false));
    }
    if ((checklistDeleteInfo && checklistDeleteInfo.data) && (equipmentsDetails && equipmentsDetails.data)) {
      dispatch(getAssetDetail(equipmentsDetails.data[0].id, appModels.EQUIPMENT, false));
    }
  }, [stateChangeInfo, updateEquipment, checklistDeleteInfo]);

  const onCloseUpdate = () => {
    showUpdateModal(false);
    dispatch(resetUpdateEquipment());
    if (afterUpdate) afterUpdate();
  };

  return (
    <>
      <Card className="border-0 h-100">
        {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
          <CardBody data-testid="success-case">
            <Row>
              <Col md="9" xs="12" sm="12" lg="9">
                <h4 className="mb-1 font-weight-800 font-medium" title={equipmentData.name}>
                  <Tooltip title={getDefinitonByLabel('name')} placement="right">
                    {equipmentData.name}
                  </Tooltip>
                  {equipmentData.tag_status && equipmentData.tag_status === 'tagged' && (
                  <Tooltip title="Physically Tagged" placement="right">
                    <span className="ml-2">
                      <img src={taggedIcon} alt="tagged" width="18" />
                    </span>
                  </Tooltip>
                  )}
                </h4>
                <p className="mb-1 font-weight-400 mt-1 font-tiny">
                  {equipmentData.equipment_seq}
                  <Tooltip title={getDefinitonByLabel('equipment_seq')} placement="right">
                    <span className="text-info">
                      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                    </span>
                  </Tooltip>
                </p>
              </Col>
              <Col md="3" xs="12" sm="12" lg="3" className="text-center">
                <Tooltip title={getDefinitonByLabel('image_small')} placement="right">
                  <img
                    aria-hidden="true"
                    src={equipmentData.image_small ? `data:image/png;base64,${equipmentData.image_small}` : assetMiniBlueIcon}
                    alt="asset"
                    className="m-0 cursor-pointer"
                    width="50"
                    height="50"
                    onClick={() => toggle()}
                  />
                </Tooltip>
              </Col>
            </Row>
            <Row>
              <Col md="12" xs="12" sm="12" lg="12">
                <p className="mb-1 font-weight-400 mt-1 font-tiny">
                  {getDefaultNoValue(extractTextObject(equipmentData.location_id))}
                  <Tooltip title={getDefinitonByLabel('location_id')} placement="right">
                    <span className="text-info">
                      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                    </span>
                  </Tooltip>
                </p>
              </Col>
            </Row>
            <Row>
              <Col md="12" xs="12" sm="12" lg="12">
                <p className="mb-1 mt-1">
                  {getEquipmentStateLabel(equipmentData.state)}
                  <Tooltip title={getDefinitonByLabel('state')} placement="right">
                    <span className="text-info">
                      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                    </span>
                  </Tooltip>
                </p>
              </Col>
            </Row>
            <hr />
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1 max-form-content hidden-scrollbar">
                    <p className="light-text mb-1 ml-1">
                      Description
                      <Tooltip title={getDefinitonByLabel('equipment_number')} placement="right">
                        <span className="text-info">
                          <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                        </span>
                      </Tooltip>
                    </p>
                    <p className="font-weight-700 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(equipmentData.equipment_number)}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Modal isOpen={modal} size="lg">
              <ModalHeader toggle={toggle}>{equipmentData.name}</ModalHeader>
              <ModalBody>
                <img
                  src={equipmentData.image_medium ? `data:image/png;base64,${equipmentData.image_medium}` : assetMiniBlueIcon}
                  alt={equipmentData.name}
                  width="100%"
                  height="auto"
                  aria-hidden="true"
                />
              </ModalBody>
            </Modal>
          </CardBody>
        )}
        {equipmentsDetails && equipmentsDetails.loading && (
          <CardBody className="mt-4" data-testid="loading-case">
            <Loader />
          </CardBody>
        )}
        {(equipmentsDetails && equipmentsDetails.err) && (
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(equipmentsDetails)} />
          </CardBody>
        )}
      </Card>
      <Modal size={(updateEquipment && updateEquipment.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={updateModal}>
        <ModalHeaderComponent title="Edit Asset" imagePath={assetIcon} closeModalWindow={onCloseUpdate} response={updateEquipment} />
        <ModalBody className="mt-0 pt-0">
          <AssetsDetailUpdate />
          <div className="float-right mr-4">
            {' '}
            {(updateEquipment && updateEquipment.data) && (
            <Button  variant="contained" size="sm" onClick={() => onCloseUpdate()}>OK</Button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

AssetDetailInfo.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  afterUpdate: PropTypes.func.isRequired,
};

export default AssetDetailInfo;
