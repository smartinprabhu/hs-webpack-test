/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Box, Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import moment from 'moment-timezone';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Label,
  Card,
  CardBody,
  Col,
  Input,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import DOMPurify from 'dompurify';

import ticketIconBlack from '@images/icons/ticketBlack.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getTicketDetail,
  getOnHoldRequest,
  resetOnHoldRequest,
} from '../ticketService';
import {
  generateErrorMessage,
  getAllowedCompanies,
} from '../../util/appUtils';
import {
  getPauseReasons,
} from '../../workorders/workorderService';
import theme from '../../util/materialTheme';

const appModels = require('../../util/appModels').default;

const OnHoldRequest = React.memo((props) => {
  const {
    ticketDetail, ohRequestModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [model, setModal] = useState(ohRequestModal);
  const [messageTicket, setMessageTicket] = useState('');
  const [reasonId, setReasonId] = useState(false);
  const [reasonKeyword, setReasonKeyword] = useState('');
  const {
    onHoldRequestInfo,
  } = useSelector((state) => state.ticket);
  const { userInfo } = useSelector((state) => state.user);
  const {
    pauseReasons,
  } = useSelector((state) => state.workorder);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    dispatch(resetOnHoldRequest());
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getPauseReasons(companies, appModels.ORDERPAUSEREASONS, reasonKeyword));
    }
  }, [userInfo, reasonKeyword]);

  const toggle = () => {
    const viewId = ticketDetail && ticketDetail.data ? ticketDetail.data[0].id : '';
    if (viewId && onHoldRequestInfo && onHoldRequestInfo.data) {
      dispatch(getTicketDetail(viewId, appModels.HELPDESK));
    }
    dispatch(resetOnHoldRequest());
    setModal(!model);
    atFinish();
  };

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const onReasonKeyWordChange = (e) => {
    setReasonKeyword(e.target.value);
  };

  const sendClose = () => {
    const id = ticketDetail.data.length > 0 ? ticketDetail.data[0].id : '';
    if (id) {
      const postData = {
        is_on_hold_requested: 'True', pause_reason_id: reasonId && reasonId.id ? reasonId.id : false, on_hold_requested_on: moment().utc().format('YYYY-MM-DD HH:mm:ss'), on_hold_requested_command: DOMPurify.sanitize(messageTicket),
      };
      dispatch(getOnHoldRequest(id, postData));
    }
  };

  const loading = (onHoldRequestInfo && onHoldRequestInfo.loading);

  return (
    <Dialog maxWidth="md" open={model}>
      <DialogHeader title="Request On-Hold" onClose={toggle} response={onHoldRequestInfo} imagePath={ticketIconBlack} />
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
            <Row className="ml-4 mr-4 mb-0">
              <Col sm="12" md="12" lg="12" xs="12">
                <Card className="bg-thinblue border-0">
                  <CardBody className="p-3">
                    <Row>
                      <Col sm="9" md="9" lg="9" xs="12">
                        <p className="font-weight-800 font-side-heading text-grey mb-1">
                          {ticketDetail.data[0].subject}
                        </p>
                        <p className="font-weight-500 font-side-heading mb-1">
                          #
                          {ticketDetail.data[0].ticket_number}
                        </p>
                      </Col>
                      <Col sm="3" md="3" lg="3" xs="12">
                        <img src={ticketIconBlack} alt="workorder" width="25" className="mr-2 float-right" />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                {(onHoldRequestInfo && !onHoldRequestInfo.data) && (
                  <Row className="mt-2">
                    <ThemeProvider theme={theme}>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <Label for="product_id">
                          Pause
                          {' '}
                          Reason
                          <span className="text-danger ml-1">*</span>
                        </Label>
                        <Autocomplete
                          name="pause_reason_id"
                          size="small"
                          onChange={(_event, newValue) => {
                            setReasonId(newValue);
                          }}
                          getOptionSelected={(option, value) => option.name === value.name}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                          options={pauseReasons && pauseReasons.data ? pauseReasons.data : []}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onChange={onReasonKeyWordChange}
                              variant="outlined"
                              className="without-padding bg-white"
                              placeholder="Search & Select"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {pauseReasons && pauseReasons.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                        {(pauseReasons && pauseReasons.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(pauseReasons)}</span></FormHelperText>)}
                        {!reasonId && (<span className="text-danger ml-1">Reason required</span>)}
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} className="mt-2">
                        <Label for="actual_duration">
                          Remarks
                          <span className="text-danger ml-1">*</span>
                        </Label>
                        <Input type="textarea" name="body" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
                        {!messageTicket && (<span className="text-danger ml-1">Remarks required</span>)}
                      </Col>
                    </ThemeProvider>
                  </Row>
                )}
              </Col>
            </Row>
            {loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
            )}
            {(onHoldRequestInfo && onHoldRequestInfo.err) && (
              <SuccessAndErrorFormat response={onHoldRequestInfo} />
            )}
            {onHoldRequestInfo && onHoldRequestInfo.data && !loading && (
              <SuccessAndErrorFormat response={onHoldRequestInfo} successMessage="The Request for On Hold has been raised." />
            )}
            <hr className="mb-0" />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!(onHoldRequestInfo && onHoldRequestInfo.data) && (
          <Button
            size="sm"
            type="button"
            variant="contained"
            disabled={!reasonId || !messageTicket || (onHoldRequestInfo && onHoldRequestInfo.data) || loading}
            onClick={() => sendClose()}
          >
            Request

          </Button>
        )}
        {(onHoldRequestInfo && onHoldRequestInfo.data) && (
          <Button
            size="sm"
            type="button"
            variant="contained"
            onClick={() => toggle()}
            disabled={loading}
          >
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>

  );
});

OnHoldRequest.propTypes = {
  ticketDetail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  ohRequestModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default OnHoldRequest;
