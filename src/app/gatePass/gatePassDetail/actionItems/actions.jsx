/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import survey from '@images/icons/surveyAction.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import {
  faCheckCircle, faTag, faPencilAlt, faPrint,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue, extractNameObject,
} from '../../../util/appUtils';
import { visitStateChange } from '../../../visitorManagement/visitorManagementService';
import { updateProductCategory } from '../../../pantryManagement/pantryService';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  approved: faCheckCircle,
  prepared: faTag,
  issued: faCheckCircle,
  validated: faCheckCircle,
  reviewed: faPencilAlt,
  PRINTPDF: faPrint,
};

const Actions = (props) => {
  const {
    details, actionModal, actionText, actionValue, actionMessage, actionButton, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const {
    userInfo,
  } = useSelector((state) => state.user);
  const {
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const editId = details && (details.data && details.data.length > 0) ? details.data[0].id : false;

  useEffect(() => {
    if (updateProductCategoryInfo && updateProductCategoryInfo.data && editId) {
      dispatch(visitStateChange(editId, 'action_validated', appModels.WORKPERMIT));
    }
  }, [updateProductCategoryInfo]);

  const handleStateChange = (id, state) => {
    if (actionText === 'Validate') {
      const userId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : '';
      const payload = {
        validated_status: 'Valid',
        validated_on: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
        validated_by: userId,
      };
      dispatch(updateProductCategory(editId, appModels.WORKPERMIT, payload));
    } else {
      dispatch(visitStateChange(id, state, appModels.WORKPERMIT));
    }
  };

  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };
  const { stateChangeInfo } = useSelector((state) => state.visitorManagement);

  const permitData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const loading = (details && details.loading) || (stateChangeInfo && stateChangeInfo.loading) || (updateProductCategoryInfo && updateProductCategoryInfo.loading);

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={actionModal}>
      <ModalHeaderComponent fontAwesomeIcon={faIcons[actionMessage]} closeModalWindow={toggleCancel} title={actionText} response={stateChangeInfo} />
      <ModalBody>
        <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
          {details && (details.data && details.data.length > 0) && (
          <CardBody data-testid="success-case" className="bg-lightblue p-3">
            <Row>
              <Col md="2" xs="2" sm="2" lg="2">
                <img src={survey} alt="asset" className="mt-1" width="50" height="45" />
              </Col>
              <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                <Row>
                  <h6 className="mb-1">
                    {getDefaultNoValue(permitData.name)}
                  </h6>
                </Row>
                <Row>
                  <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                    <span className="font-weight-800 font-side-heading mr-1">
                      Reference :
                    </span>
                    <span className="font-weight-400">
                      {getDefaultNoValue((permitData.reference))}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                    <span className="font-weight-800 font-side-heading mr-1">
                      Vendor :
                    </span>
                    <span className="font-weight-400">
                      {getDefaultNoValue(extractNameObject(permitData.vendor_id, 'name'))}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
          )}
        </Card>
        <Row className="justify-content-center">
          {stateChangeInfo && stateChangeInfo.data && !loading && (
            <SuccessAndErrorFormat response={stateChangeInfo} successMessage={`This work permit has been ${actionMessage} successfully..`} />
          )}
          {stateChangeInfo && stateChangeInfo.err && (
            <SuccessAndErrorFormat response={stateChangeInfo} />
          )}
          {loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
        </Row>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {stateChangeInfo && stateChangeInfo.data
          ? ''
          : (
            <Button
              type="button"
               variant="contained"
              size="sm"
              disabled={loading}
              className="mr-1"
              onClick={() => handleStateChange(permitData.id, actionValue)}
            >
              {actionButton}
            </Button>
          )}
        {(stateChangeInfo && stateChangeInfo.data
              && (
                <Button
                  type="button"
                  size="sm"
                  disabled={loading}
                   variant="contained"
                  className="mr-1"
                  onClick={toggle}
                >
                  Ok
                </Button>
              )
            )}
      </ModalFooter>
    </Modal>
  );
};

Actions.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionValue: PropTypes.string.isRequired,
  actionMessage: PropTypes.string.isRequired,
  actionButton: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default Actions;
