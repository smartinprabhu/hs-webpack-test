/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
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

import survey from '@images/icons/surveyAction.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import {
  faTimesCircle, faCheckCircle, faStoreAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  updatePartsOrder,
} from '../../../workorders/workorderService';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../../util/appUtils';
import { getTypeLabel } from '../../utils/utils';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  Draft: faStoreAlt,
  Published: faCheckCircle,
  Closed: faTimesCircle,
};

const ActionSurvey = (props) => {
  const {
    details, actionModal, actionId, actionValue, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const { updatePartsOrderInfo } = useSelector((state) => state.workorder);

  const surveyRequestData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const handleStateChange = (id, status) => {
    const values = { stage_id: status };
    dispatch(updatePartsOrder(id, values, appModels.SURVEY));
  };

  const loading = (details && details.loading) || (updatePartsOrderInfo && updatePartsOrderInfo.loading);

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={actionModal}>
      <ModalHeaderComponent
        fontAwesomeIcon={actionValue === 'Published' ? faIcons.Published : faIcons[actionValue]}
        closeModalWindow={toggle}
        title={actionValue}
        response={updatePartsOrderInfo}
      />
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
                      {getDefaultNoValue(surveyRequestData.title)}
                    </h6>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Type :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(getTypeLabel(surveyRequestData.category_type))}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Created On :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(getCompanyTimezoneDate(surveyRequestData.create_date, userInfo, 'datetime'))}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          )}
        </Card>
        <Row className="justify-content-center">
          {updatePartsOrderInfo && updatePartsOrderInfo.data && !loading && (
            <SuccessAndErrorFormat response={updatePartsOrderInfo} successMessage={`This survey has been ${actionValue} successfully..`} />
          )}
          {updatePartsOrderInfo && updatePartsOrderInfo.err && (
            <SuccessAndErrorFormat response={updatePartsOrderInfo} />
          )}
          {loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
        </Row>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {updatePartsOrderInfo && updatePartsOrderInfo.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              size="sm"
              disabled={loading}
              className="mr-1"
              onClick={() => handleStateChange(surveyRequestData.id, actionId)}
            >
              {actionValue}
            </Button>
          )}
        {(updatePartsOrderInfo && updatePartsOrderInfo.data
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

ActionSurvey.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionId: PropTypes.string.isRequired,
  actionValue: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default ActionSurvey;
