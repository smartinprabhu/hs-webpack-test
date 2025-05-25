/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Spinner,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import assetDefault from '@images/icons/assetDefault.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue,
} from '../../../util/appUtils';
import { moveAssetLocation, getAssetDetail } from '../../equipmentService';

const appModels = require('../../../util/appModels').default;

const validateAsset = (props) => {
  const {
    equipmentsDetails, validateModal, atFinish,
  } = props;
  const validStatus = 'Valid';
  const dispatch = useDispatch();
  const [modal, setModal] = useState(validateModal);
  const [stateType, setStateType] = useState('');
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const { moveAssetInfo } = useSelector((state) => state.equipment);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (moveAssetInfo && moveAssetInfo.data)) {
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    }
  }, [userInfo, moveAssetInfo]);

  const equipmentData = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0] : '';

  const handleStateChange = (id, state, type) => {
    const postData = { validation_status: 'Valid', method: 'action_validate_equipment' };
    const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    dispatch(moveAssetLocation(viewId, postData, appModels.EQUIPMENT));
    setStateType(type);
  };

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={validateModal}>
      <ModalHeaderComponent fontAwesomeIcon={faCheckCircle} closeModalWindow={toggle} title="Validate Asset" response={moveAssetInfo} />
      <ModalBody>
        <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
          {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
          <CardBody data-testid="success-case" className="bg-lightblue p-3">
            <Row>
              <Col md="2" xs="2" sm="2" lg="2">
                <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
              </Col>
              <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                <Row>
                  <h6 className="mb-1">{equipmentData.name}</h6>
                </Row>
                <Row>
                  <p className="mb-0 font-weight-500 font-tiny">
                    #
                    {equipmentData.location_id
                      ? equipmentData.location_id[1]
                      : <span>Not Assigned</span>}
                  </p>
                </Row>
                <Row>
                  <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                    <span className="font-weight-800 font-side-heading mr-1">
                      Category :
                    </span>
                    <span className="font-weight-400">
                      {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].category_id[1] ? equipmentsDetails.data[0].category_id[1] : '')}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
          )}
        </Card>
        <Row className="justify-content-center">
          {moveAssetInfo && moveAssetInfo.data && (equipmentsDetails && !equipmentsDetails.loading) && (
            <SuccessAndErrorFormat response={moveAssetInfo} successMessage="This asset has been validated successfully.." />
          )}
          {(equipmentData.validation_status === validStatus) && (moveAssetInfo && !moveAssetInfo.data) && (
            <div className="text-success text-center mt-3">
              {' '}
              <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-success" icon={faCheckCircle} />
              {' '}
              This asset has already validated..
            </div>
          )}
          {moveAssetInfo && moveAssetInfo.err && (
          <SuccessAndErrorFormat response={moveAssetInfo} />
          )}
          {equipmentsDetails && equipmentsDetails.loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
        </Row>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {equipmentData.validation_status === validStatus
          ? ''
          : (
            <Button
              type="button"
               variant="contained"
              size="sm"
              className="mr-1"
              onClick={() => handleStateChange(equipmentData.id, 'action_validate_equipment', 'validate')}
            >
              {(moveAssetInfo && moveAssetInfo.loading && stateType === 'validate') ? (
                <Spinner size="sm" color="light" className="mr-2" />
              ) : ''}
              {' '}
              Confirm
            </Button>
          )}
        {equipmentData.validation_status === validStatus && (
        <Button
          type="button"
          size="sm"
           variant="contained"
          className="mr-1"
          onClick={toggle}
        >
          Ok
        </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

validateAsset.propTypes = {
  equipmentsDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  validateModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default validateAsset;
