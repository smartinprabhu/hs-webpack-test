/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import assetDefault from '@images/icons/assetDefault.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  Button,
  Box,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import Loader from '@shared/loading';
import {
  faStoreAlt,
} from '@fortawesome/free-solid-svg-icons';
import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  getDefaultNoValue, getCompanyTimezoneDate, extractNameObject,
} from '../../../util/appUtils';
import { complianceStateChange } from '../../complianceService';

const appModels = require('../../../util/appModels').default;

const SetToDraft = (props) => {
  const {
    complianceDetails, draftModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(draftModal);
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const { stateChangeInfo } = useSelector((state) => state.compliance);

  const complianceData = complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) ? complianceDetails.data[0] : '';

  const handleStateChange = (id, state) => {
    dispatch(complianceStateChange(id, state, appModels.BULIDINGCOMPLIANCE));
  };

  const loading = (complianceDetails && complianceDetails.loading) || (stateChangeInfo && stateChangeInfo.loading);

  return (
    <Dialog maxWidth="md" open={draftModal}>
      <DialogHeader title="Set to Draft" onClose={toggle} fontAwesomeIcon={faStoreAlt} response={stateChangeInfo} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) && (
              <CardBody data-testid="success-case" className="bg-lightblue p-3">
                <Row>
                  <Col md="2" xs="2" sm="2" lg="3">
                    <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                  </Col>
                  <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                    <Row>
                      <h6 className="mb-1">
                        {getDefaultNoValue(extractNameObject(complianceData.compliance_id, 'name'))}
                      </h6>
                    </Row>
                    <Row>
                      <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                        <span className="font-weight-800 font-side-heading mr-1">
                          Compliance Act :
                        </span>
                        <span className="font-weight-400">
                          {getDefaultNoValue(extractNameObject(complianceData.compliance_act, 'name'))}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                        <span className="font-weight-800 font-side-heading mr-1">
                          Next Expiry Date :
                        </span>
                        <span className="font-weight-400">
                          {getCompanyTimezoneDate(complianceData.next_expiry_date, userInfo, 'datetime')}
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
              <SuccessAndErrorFormat response={stateChangeInfo} successMessage="This Compliance has been set to draft successfully.." />
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
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {stateChangeInfo && stateChangeInfo.data
          ? ''
          : (
            <Button
              type="button"
              variant='contained'
              disabled={loading}
              className="submit-btn"
              onClick={() => handleStateChange(complianceData.id, 'action_set_to_draft')}
            >
              Move
            </Button>
          )}
        {(stateChangeInfo && stateChangeInfo.data
          && (
          <Button
            type="button"
            variant='contained'
            disabled={loading}
            className="submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  );
};

SetToDraft.propTypes = {
  complianceDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  draftModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default SetToDraft;
