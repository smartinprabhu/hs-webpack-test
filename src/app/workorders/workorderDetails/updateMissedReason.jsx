/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Box, Dialog, Button, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import DOMPurify from 'dompurify';
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
import { ThemeProvider } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';

import workorderLogo from '@images/icons/workOrders.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getOrderDetail,
  getPauseReasons,
} from '../workorderService';
import { updateProductCategory, resetUpdateProductCategory } from '../../pantryManagement/pantryService';
import {
  getDefaultNoValue,
  getAllowedCompanies,
  generateErrorMessage,
} from '../../util/appUtils';
import theme from '../../util/materialTheme';
import { getWorkOrderStateLabel } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const UpdateMissedReason = React.memo((props) => {
  const {
    details, ppmData, ppmConfig, missedReasonModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [model, setModal] = useState(missedReasonModal);
  const [reasonId, setReasonId] = useState(ppmData && ppmData.missed_reason_id && ppmData.missed_reason_id.id ? ppmData.missed_reason_id : false);
  const [reasonKeyword, setReasonKeyword] = useState('');
  const [messageTicket, setMessageTicket] = useState(ppmData && ppmData.missed_remark ? ppmData.missed_remark : '');
  const {
    pauseReasons,
  } = useSelector((state) => state.workorder);
  const { userInfo } = useSelector((state) => state.user);
  const { updateProductCategoryInfo } = useSelector((state) => state.pantry);

  useEffect(() => {
    dispatch(resetUpdateProductCategory());
  }, []);

  const companies = getAllowedCompanies(userInfo);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const tempLevel = ppmConfig && ppmConfig.reason_access_level ? ppmConfig.reason_access_level : '';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (tempLevel && reasonKeyword) {
        domain = `${domain},["name","ilike","${reasonKeyword}"]`;
      }

      if (!tempLevel && reasonKeyword) {
        domain = `["name","ilike","${reasonKeyword}"]`;
      }
      dispatch(getPauseReasons(companies, appModels.ORDERPAUSEREASONS, reasonKeyword, 'Missed', domain));
    }
  }, [userInfo, reasonKeyword]);

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const toggle = () => {
    const viewId = details && details.data ? details.data[0].id : '';
    if (viewId && updateProductCategoryInfo && updateProductCategoryInfo.data) {
      dispatch(getOrderDetail(viewId, appModels.ORDER));
    }
    dispatch(resetUpdateProductCategory());
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
    const id = ppmData && ppmData.id ? ppmData.id : false;
    if (id) {
      const postData = {
        missed_reason_id: reasonId && reasonId.id ? reasonId.id : false,
        missed_remark: DOMPurify.sanitize(messageTicket),
      };
      dispatch(updateProductCategory(id, 'ppm.scheduler_week', postData));
    }
  };

  const loading = (updateProductCategoryInfo && updateProductCategoryInfo.loading);

  return (
    <Dialog maxWidth="md" open={model}>
      <DialogHeader title="Missed Reason" onClose={toggle} response={updateProductCategoryInfo} imagePath={workorderLogo} />
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
                <Card className="border-5 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
                  {detailData && (
                    <CardBody className="bg-lightblue p-3">
                      <Row>
                        <Col md="2" xs="2" sm="2" lg="2">
                          <img src={workorderLogo} alt="asset" className="mt-2" width="35" height="35" />
                        </Col>
                        <Col md="8" xs="8" sm="8" lg="8" className="ml-4">
                          <Row>
                            <h6 className="mb-1">{detailData.name}</h6>
                          </Row>
                          <Row>
                            <p className="mb-0 font-weight-500 font-tiny">
                              {getDefaultNoValue(detailData.sequence)}
                            </p>
                          </Row>
                          <Row>
                            <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                              <span className="font-weight-800 font-side-heading mr-1">
                                Status :
                              </span>
                              <span className="font-weight-400">
                                {getWorkOrderStateLabel(detailData.state)}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>
                  )}
                </Card>
                {(updateProductCategoryInfo && !updateProductCategoryInfo.data) && (
                  <Row className="mt-2">
                    <ThemeProvider theme={theme}>
                      <Col xs={12} sm={12} md={12} lg={12}>
                        <Label for="product_id">
                          Missed
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
                          value={reasonId && reasonId.name ? reasonId.name : ''}
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
            {(updateProductCategoryInfo && updateProductCategoryInfo.err) && (
              <SuccessAndErrorFormat response={updateProductCategoryInfo} />
            )}
            {updateProductCategoryInfo && updateProductCategoryInfo.data && !loading && (
              <SuccessAndErrorFormat response={updateProductCategoryInfo} successMessage="The Reason for Missed PPM has been updated." />
            )}
            <hr className="mb-0" />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!(updateProductCategoryInfo && updateProductCategoryInfo.data) && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            disabled={!reasonId || !messageTicket || (updateProductCategoryInfo && updateProductCategoryInfo.data) || loading}
            onClick={() => sendClose()}
          >
            Update

          </Button>
        )}
        {(updateProductCategoryInfo && updateProductCategoryInfo.data) && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
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

UpdateMissedReason.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  missedReasonModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default UpdateMissedReason;
