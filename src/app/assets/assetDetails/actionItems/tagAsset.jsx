/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Label,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  faTag,
} from '@fortawesome/free-solid-svg-icons';

import assetDefault from '@images/icons/assetDefault.svg';
import ErrorContent from '@shared/errorContent';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import { getAssetDetail, moveAssetLocation } from '../../equipmentService';
import {
  getDefaultNoValue,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const TagAsset = (props) => {
  const {
    equipmentsDetails, tagModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(tagModal);
  const [tag, setTag] = useState('');
  const [tagStatus, setTagStatus] = useState('');
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const { moveAssetInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    if ((moveAssetInfo && moveAssetInfo.data) && (equipmentsDetails && equipmentsDetails.data)) {
      dispatch(getAssetDetail(equipmentsDetails.data[0].id, appModels.EQUIPMENT, false));
    }
  }, [moveAssetInfo]);

  const equipmentData = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0] : '';

  let errorMsg = 'Something went wrong';

  if (moveAssetInfo && moveAssetInfo.err && moveAssetInfo.err.data && moveAssetInfo.err.data.error) {
    errorMsg = moveAssetInfo.err.data.error.message;
  } else if (moveAssetInfo && moveAssetInfo.err && moveAssetInfo.err.statusText) {
    errorMsg = moveAssetInfo.err.statusText;
  }

  const handleTagChange = () => {
    const postData = { tag_status: tagStatus };
    const id = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    dispatch(moveAssetLocation(id, postData, appModels.EQUIPMENT));
  };

  const handleAddChange = () => {
    setTag(true);
  };

  const tagInputChange = (e) => {
    setTagStatus(e.target.value);
  };

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={tagModal}>
      <ModalHeaderComponent fontAwesomeIcon={faTag} closeModalWindow={toggle} title="Tag Asset" response={moveAssetInfo} />
      <ModalBody>
        <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
          {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
          <CardBody data-testid="success-case" className="bg-lightblue p-3">
            <Row>
              <Col md="2" xs="2" sm="2" lg="2">
                <img src={assetDefault} alt="asset" className="mt-4" width="45" height="45" />
              </Col>
              <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                {!tag ? (
                  <Row>
                    <h5 className="mb-2">Want to tag this asset?</h5>
                  </Row>
                ) : ''}
                <Row>
                  <h5 className="mb-1">{equipmentData.name}</h5>
                </Row>
                <Row>
                  <p className="mb-0 font-weight-500 font-tiny">
                    #
                    {equipmentData.location_id
                      ? equipmentData.location_id[1]
                      : <span>Not Assigned</span>}
                  </p>
                </Row>
                {tag && !(moveAssetInfo && moveAssetInfo.data) ? (
                  <Row>
                    <div className="d-flex pt-1">
                      <Label>New Tag :</Label>
                      {' '}
                      <Input type="text" placeholder="Enter tag" onChange={tagInputChange} className="ml-2 w-60 height-24" />
                    </div>
                  </Row>
                ) : ''}
                {moveAssetInfo && moveAssetInfo.data && (
                <Row>
                  <div className="d-flex">
                    <Label>Current Tag :</Label>
                    {' '}
                    {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].tag_status : '')}
                  </div>
                </Row>
                )}
              </Col>
            </Row>
          </CardBody>
          )}
        </Card>
        <Row className="justify-content-center">
          {moveAssetInfo && moveAssetInfo.data && (
          <h4 className="mb-1">This asset has been tagged. </h4>
          )}
          {moveAssetInfo && moveAssetInfo.err && (
          <ErrorContent errorTxt={errorMsg} />
          )}
          {moveAssetInfo && moveAssetInfo.loading && (
          <div className="mb-2 mt-3 p-5" data-testid="loading-case">
            <Loader />
          </div>
          )}
        </Row>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {tag ? (
          <Button
            type="button"
             variant="contained"
            size="sm"
            className="mr-1"
            disabled={tagStatus === ''}
            onClick={() => handleTagChange()}
          >
            Tag
          </Button>
        ) : (
          <Button
            type="button"
             variant="contained"
            size="sm"
            className="mr-1"
            onClick={() => handleAddChange()}
          >
            Add
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

TagAsset.propTypes = {
  equipmentsDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  tagModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default TagAsset;
