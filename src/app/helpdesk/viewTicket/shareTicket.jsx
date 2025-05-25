/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useRef } from 'react';
import {
  CardBody,
  Row,
  FormGroup,
  Input,
  Label,
  FormFeedback,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import SearchIcon from '@material-ui/icons/Search';
import JoditEditor from 'jodit-react';
import { Button } from "@mui/material";
import {
  Box
} from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';

import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import envelopeIcon from '@images/icons/envelope.svg';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { CheckboxFieldGroup } from '@shared/noFormFields';

import {
  getMessageTemplate, shareTicketCall, resetMessageTemplate,
  getHelpdeskVendors,
} from '../ticketService';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  resetCreateTenant,
} from '../../adminSetup/setupService';
import { truncateHTMLTags, extractOptionsObject, generateErrorMessage } from '../../util/appUtils';
import SearchModalCustom from './searchModalCustom';

import AddVendor from '../../adminSetup/siteConfiguration/addTenant/addCustomer';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const ShareTicket = (props) => {
  const {
    shareActionModal, atFinish, tId,
  } = props;

  const dispatch = useDispatch();
  const classes = useStyles();

  const [modal, setModal] = useState(shareActionModal);
  const [message, setMessage] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [customerType, setCustomerType] = useState(['Vendor', 'Requestor']);

  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorValue, setVendorValue] = useState('');
  const [vendorKeyword, setVendorKeyword] = useState('');

  const [addVendorModal, setAddVendorModal] = useState(false);
  const [noData, setNoData] = useState(false);

  const [extraModalCustom, setExtraModalCustom] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'email', 'mobile']);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);

  const editor = useRef(null);

  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  const toggle = () => {
    dispatch(resetMessageTemplate());
    setMessage('');
    setModal(!modal);
    atFinish();
  };

  const onEmailChange = (e) => {
    setEmailValue(e.target.value);
  };

  const onMessageChange = (data) => {
    setMessage(data);
  };

  const onVendorClear = () => {
    setVendorValue('');
    setVendorOpen(false);
  };

  const {
    ticketDetail, shareTemplateInfo, shareTicketInfo, maintenanceConfigurationData,
    vendorsCustmonList,
  } = useSelector((state) => state.ticket);

  const { userInfo } = useSelector((state) => state.user);

  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';

  const showButton = (ticketDetail && !ticketDetail.loading) && (shareTicketInfo && !shareTicketInfo.loading);

  const ticketData = ticketDetail && ticketDetail.data && ticketDetail.data.length ? ticketDetail.data[0] : false;

  const showVendorModal = () => {
    dispatch(getHelpdeskVendors(userInfo.data.company.id));
    setModelValue(appModels.PARTNER);
    setFieldName('vendor_id');
    setModalName('Vendor List');
    setColumns(['id', 'name', 'email', 'mobile']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '');
    setExtraModalCustom(true);
  };

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && vendorKeyword && (vendorKeyword && vendorKeyword.length > 3)) {
      if (vendorsCustmonList && vendorsCustmonList.data && vendorsCustmonList.data.length
        && vendorsCustmonList.data.length > 0 && vendorsCustmonList.data.some((selectedValue) => selectedValue.name.toLowerCase().includes(vendorKeyword.toLowerCase())
          || selectedValue.name.toLowerCase().includes(vendorKeyword.toUpperCase()))) {
        setNoData(false);
      } else {
        setNoData(true);
        setVendorOpen(false);
      }
    }
  }, [vendorKeyword]);

  let vendorOptions = extractOptionsObject(vendorsCustmonList, vendorValue);

  useEffect(() => {
    if (((userInfo && userInfo.data) && (noData) && (vendorKeyword && vendorKeyword.length > 3))) {
      vendorOptions = [{ id: -77, name: vendorKeyword }];
      setVendorOpen(false);
      setVendorValue({ id: -77, name: vendorKeyword });
    }
  }, [userInfo, vendorKeyword, vendorsCustmonList]);

  useEffect(() => {
    if (ticketData && ticketData.vendor_id && ticketData.vendor_id.length) {
      const emailData = vendorsCustmonList && vendorsCustmonList.data ? vendorsCustmonList.data.filter((item) => item.id === ticketData.vendor_id[0]) : false;
      const emailId = emailData && emailData.length ? emailData[0].email : '';
      setVendorValue({ id: ticketData.vendor_id[0], name: ticketData.vendor_id[1], email: emailId });
    } else {
      setVendorValue('');
    }
  }, [vendorsCustmonList]);

  useEffect(() => {
    if (tId && ticketData && ticketData.company_id && ticketData.company_id.length) {
      dispatch(resetMessageTemplate());
      dispatch(getMessageTemplate(tId, ticketData.company_id[0]));
    }
  }, [tId]);

  const tempMsg = shareTemplateInfo && shareTemplateInfo.data && shareTemplateInfo.data.length && shareTemplateInfo.data[0].body_html ? shareTemplateInfo.data[0].body_html : '';

  useEffect(() => {
    if (isVendorShow) {
      if (vendorValue && vendorValue.email && vendorValue.name) {
        setEmailValue(vendorValue.email);
        let combEmails = vendorValue.email;
        if (customerType.includes('Requestor') && ticketData && ticketData.person_name && ticketData.email && isVendorShow) {
          combEmails = `${ticketData.email},${vendorValue.email}`;
        }
        setEmailValue(combEmails);
        let msg = '';
        if (customerType.includes('Vendor') && customerType.includes('Requestor') && ticketData && ticketData.person_name) {
          msg = tempMsg ? tempMsg.replace('Hi', `Hi ${vendorValue.name},${ticketData.person_name}`) : `Hi ${vendorValue.name},${ticketData.person_name}`;
        } else if (customerType.includes('Vendor') && !customerType.includes('Requestor')) {
          msg = tempMsg ? tempMsg.replace('Hi', `Hi ${vendorValue.name}`) : `Hi ${vendorValue.name},`;
        } else if (customerType.includes('Requestor') && !customerType.includes('Vendor')) {
          msg = tempMsg ? tempMsg.replace('Hi', `Hi ${ticketData.person_name}`) : `Hi ${ticketData.person_name},`;
        }
        setMessage(msg);
      } else {
        setEmailValue(customerType.includes('Requestor') && ticketData && ticketData.person_name && ticketData.email ? ticketData.email : '');
        setMessage(tempMsg ? tempMsg.replace('Hi', `Hi ${ticketData.person_name}`) : `Hi ${ticketData.person_name},`);
      }
    }
  }, [vendorValue, shareTemplateInfo]);

  useEffect(() => {
    if (isVendorShow) {
      if (customerType.includes('Requestor') && customerType.includes('Vendor') && ticketData && ticketData.person_name && ticketData.email) {
        let combEmails = ticketData.email;
        let combNames = ticketData.person_name;
        if (vendorValue && vendorValue.email && vendorValue.name) {
          combEmails = `${ticketData.email},${vendorValue.email}`;
          combNames = `${ticketData.person_name},${vendorValue.name}`;
        } else if (!vendorValue && ticketData && ticketData.vendor_id && ticketData.vendor_id.length) {
          const emailData = vendorsCustmonList && vendorsCustmonList.data ? vendorsCustmonList.data.filter((item) => item.id === ticketData.vendor_id[0]) : false;
          const emailId = emailData && emailData.length ? emailData[0].email : '';
          setVendorValue({ id: ticketData.vendor_id[0], name: ticketData.vendor_id[1], email: emailId });
          combEmails = `${ticketData.email},${emailId}`;
          combNames = `${ticketData.person_name},${ticketData.vendor_id[1]}`;
        }
        setEmailValue(combEmails);
        setMessage(shareTemplateInfo && shareTemplateInfo.data && shareTemplateInfo.data.length && shareTemplateInfo.data[0].body_html ? shareTemplateInfo.data[0].body_html.replace('Hi', `Hi ${combNames}`) : `Hi ${combNames},`);
      } else if (customerType.includes('Requestor') && !customerType.includes('Vendor') && ticketData && ticketData.person_name && ticketData.email) {
        setEmailValue(ticketData.email);
        setMessage(shareTemplateInfo && shareTemplateInfo.data && shareTemplateInfo.data.length && shareTemplateInfo.data[0].body_html ? shareTemplateInfo.data[0].body_html.replace('Hi', `Hi ${ticketData.person_name}`) : `Hi ${ticketData.person_name},`);
      } else if (customerType.includes('Vendor') && !customerType.includes('Requestor') && vendorValue && vendorValue.email && vendorValue.name) {
        setEmailValue(vendorValue.email);
        setMessage(shareTemplateInfo && shareTemplateInfo.data && shareTemplateInfo.data.length && shareTemplateInfo.data[0].body_html ? shareTemplateInfo.data[0].body_html.replace('Hi', `Hi ${vendorValue.name}`) : `Hi ${vendorValue.name},`);
      } else if (customerType.includes('Vendor') && !customerType.includes('Requestor') && !vendorValue && ticketData && ticketData.vendor_id && ticketData.vendor_id.length) {
        const emailData = vendorsCustmonList && vendorsCustmonList.data ? vendorsCustmonList.data.filter((item) => item.id === ticketData.vendor_id[0]) : false;
        const emailId = emailData && emailData.length ? emailData[0].email : '';
        setVendorValue({ id: ticketData.vendor_id[0], name: ticketData.vendor_id[1], email: emailId });
        setEmailValue(vendorValue.emailId);
        setMessage(shareTemplateInfo && shareTemplateInfo.data && shareTemplateInfo.data.length && shareTemplateInfo.data[0].body_html ? shareTemplateInfo.data[0].body_html.replace('Hi', `Hi ${ticketData.vendor_id[1]}`) : `Hi ${ticketData.vendor_id[1]},`);
      } else {
        setEmailValue('');
        setMessage(shareTemplateInfo && shareTemplateInfo.data && shareTemplateInfo.data.length && shareTemplateInfo.data[0].body_html ? shareTemplateInfo.data[0].body_html : '');
      }
    }
  }, [customerType, vendorsCustmonList, shareTemplateInfo]);

  const isAll = !!(window.localStorage.getItem('isAllCompany') && window.localStorage.getItem('isAllCompany') === 'yes');

  function getCompanyId(cId) {
    let res = '';
    if (cId) {
      if (cId.id) {
        res = cId.id;
      } else if (cId.length) {
        res = cId[0];
      }
    }
    return res;
  }

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company)) {
      dispatch(getHelpdeskVendors(isAll ? getCompanyId(ticketData.company_id) : userInfo.data.company.id));
    }
  }, [userInfo]);

  useEffect(() => {
    if ((createTenantinfo && createTenantinfo.data)) {
      dispatch(getHelpdeskVendors(isAll ? getCompanyId(ticketData.company_id) : userInfo.data.company.id));
    }
  }, [createTenantinfo]);

  useEffect(() => {
    if (!isVendorShow) {
      if (shareTemplateInfo && shareTemplateInfo.data && shareTemplateInfo.data.length && shareTemplateInfo.data[0].body_html) {
        setMessage(shareTemplateInfo.data[0].body_html);
      } else if (shareTemplateInfo && shareTemplateInfo.err) {
        setMessage('');
      }
    }
  }, [shareTemplateInfo]);

  const onShare = () => {
    if (tId && ticketData && ticketData.company_id && ticketData.company_id.length) {
      const postData = {
        id: tId,
        body_html: message,
        email_to: emailValue,
        company_id: ticketData.company_id[0],
      };
      dispatch(shareTicketCall(postData));
    }
  };

  const onVendorKeywordChange = (event) => {
    setVendorKeyword(event.target.value);
  };

  const isLoading = (shareTicketInfo && shareTicketInfo.loading) || (ticketDetail && ticketDetail.loading);

  return (
    <>
      <Dialog maxWidth="lg" open={shareActionModal}>
        <DialogHeader imagePath={checkCircleBlack} onClose={toggle} title="Share the Ticket" response={shareTicketInfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#F6F8FA",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10%",
                fontFamily: "Suisse Intl",
              }}
            >
              {shareTicketInfo && !shareTicketInfo.data && !isLoading && (
                <div>
                  {isVendorShow && ticketData && (
                    <FormGroup className="flex-container content-center mb-0">
                      <Label for="share_email_to">
                        Share Email To
                      </Label>

                      <div className="ml-3">
                        <CheckboxFieldGroup
                          name="share_email_tos"
                          value="Requestor"
                          values={customerType}
                          checkedvalue={customerType.includes('Requestor') ? 'yes' : ''}
                          setValue={setCustomerType}
                          id="Requestor"
                          label="Requestor"
                        />
                        <CheckboxFieldGroup
                          name="share_email_to"
                          value="Vendor"
                          id="Vendor"
                          values={customerType}
                          checkedvalue={customerType.includes('Vendor') ? 'yes' : ''}
                          setValue={setCustomerType}
                          label="Vendor"
                        />
                      </div>

                      {customerType.includes('Vendor') && (
                        <div>

                          <Autocomplete
                            name="vendor_id"
                            label="Vendor"
                            value={vendorValue}
                            onChange={(e, data) => setVendorValue(data)}
                            open={vendorOpen}
                            size="small"
                            onOpen={() => {
                              setVendorOpen(true);
                              setVendorKeyword('');
                            }}
                            onClose={() => {
                              setVendorOpen(false);
                              setVendorKeyword('');
                            }}
                            classes={{
                              option: classes.option,
                            }}
                            getOptionDisabled={() => vendorsCustmonList && vendorsCustmonList.loading}
                            getOptionSelected={(option, value) => option.name === value.name}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                            renderOption={(option) => (
                              <>
                                <h6>{option.name}</h6>
                                <p className="float-left">
                                  {option.email && (
                                    <>
                                      <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                                      {option.email}
                                    </>
                                  )}
                                </p>
                              </>
                            )}
                            options={vendorOptions}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                onChange={onVendorKeywordChange}
                                value={vendorKeyword}
                                className="input-small-custom without-padding custom-icons2 width-300px"
                                placeholder="Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {vendorsCustmonList && vendorsCustmonList.loading && vendorOpen ? <CircularProgress color="inherit" size={20} /> : null}
                                      <InputAdornment position="end">
                                        {(vendorValue && vendorValue.id) && (
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={onVendorClear}
                                          >
                                            <BackspaceIcon fontSize="small" />
                                          </IconButton>
                                        )}
                                        <IconButton
                                          aria-label="toggle search visibility"
                                          onClick={showVendorModal}
                                        >
                                          <SearchIcon fontSize="small" />
                                        </IconButton>
                                      </InputAdornment>
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                          {(vendorsCustmonList && vendorsCustmonList.err) && (
                            <FormFeedback className="display-block">{generateErrorMessage(vendorsCustmonList)}</FormFeedback>
                          )}
                          {(noData && (vendorKeyword && vendorKeyword.length > 3)
                            && (createTenantinfo && !createTenantinfo.err) && (createTenantinfo && !createTenantinfo.data)) && (
                              <FormHelperText>
                                <span>{`New Vendor "${vendorKeyword}" will be created. Do you want to create..? Click`}</span>
                                <span aria-hidden="true" onClick={() => setAddVendorModal(true)} className="text-info ml-2 cursor-pointer">YES</span>
                              </FormHelperText>
                            )}
                        </div>
                      )}
                    </FormGroup>
                  )}
                  <FormGroup className={isVendorShow ? 'mt-2' : ''}>
                    <Label for="email_to">
                      Recipients
                      <span className="text-danger ml-1">*</span>
                    </Label>
                    <Input type="text" id="email_to" name="email_to" value={emailValue} onChange={onEmailChange} className="" maxLength="150" />
                    <FormFeedback className="display-block"><span className="text-info mt-2 mb-1">For multiple email ID&apos;s separate it by comma (ex: abc@example.com, xyz@example.com)</span></FormFeedback>
                  </FormGroup>
                  <FormGroup className="mt-2">
                    <Label htmlFor="sendMessage">
                      Message
                      {' '}
                      <span className="text-danger">*</span>
                    </Label>
                    <JoditEditor
                      ref={editor}
                      value={message}
                      onChange={onMessageChange}
                      onBlur={onMessageChange}
                    />
                    {(!message || !truncateHTMLTags(message)) && (<span className="font-11 text-danger mt-3 ml-1">Message is required</span>)}
                  </FormGroup>
                </div>
              )}
              <Row className="justify-content-center">
                {shareTicketInfo && shareTicketInfo.data && !(ticketDetail && ticketDetail.loading) && (
                  <SuccessAndErrorFormat response={shareTicketInfo} successMessage="This Ticket has been shared successfully." />
                )}
                {shareTicketInfo && shareTicketInfo.err && (
                  <SuccessAndErrorFormat response={shareTicketInfo} />
                )}
                {((shareTicketInfo && shareTicketInfo.loading) || (ticketDetail && ticketDetail.loading)) && (
                  <CardBody className="mt-4" data-testid="loading-case">
                    <Loader />
                  </CardBody>
                )}
              </Row>
            </Box>
          </DialogContentText>
        </DialogContent>
        {showButton && (
          <DialogActions className="mr-3 ml-3">
            {shareTicketInfo && !shareTicketInfo.data && (
              <Button
                type="button"
                variant='contained'
                className="submit-btn"
                disabled={(!message || !truncateHTMLTags(message) || !emailValue)}
                onClick={() => onShare()}
              >
                Share
              </Button>
            )}
            {shareTicketInfo && shareTicketInfo.data && !shareTicketInfo.loading && (

              <Button
                type="button"
                variant='contained'
                className="submit-btn"
                onClick={toggle}
              >
                Ok
              </Button>

            )}
          </DialogActions>
        )}
      </Dialog>
      <Dialog maxWidth="xl" open={addVendorModal}>
        <DialogHeader title="Add Vendor" imagePath={false} onClose={() => { setAddVendorModal(false); }} response={createTenantinfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#F6F8FA",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10%",
                fontFamily: "Suisse Intl",
              }}
            >
              <AddVendor
                afterReset={() => { setAddVendorModal(false); dispatch(resetCreateTenant()); setNoData(false); }}
                setFieldValue={setVendorValue}
                requestorName={vendorKeyword}
                type="vendor"
                updateField="vendor_id"
                maintenanceConfigurationData={maintenanceConfigurationData}
                helpdeskCompanyId={getCompanyId(ticketData.company_id)}
                moduleName="shareTicketHelpdesk"
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="lg" fullWidth open={extraModalCustom}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModalCustom(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#F6F8FA",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10%",
                fontFamily: "Suisse Intl",
              }}
            > */}
              <SearchModalCustom
                modelName={modelValue}
                afterReset={() => { setExtraModalCustom(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                otherFieldName={otherFieldName}
                otherFieldValue={otherFieldValue}
                modalName={modalName}
                setFieldValue={setVendorValue}
                customDataInfo={fieldName === 'vendor_id' ? vendorsCustmonList : ''}
              />
            {/* </Box> */}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

ShareTicket.defaultProps = {
  tId: false,
};

ShareTicket.propTypes = {
  shareActionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  tId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
};
export default ShareTicket;
