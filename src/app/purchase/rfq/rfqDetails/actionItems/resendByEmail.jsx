/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Input,
} from 'reactstrap';
import JoditEditor from 'jodit-react';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

import {
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import PdfIcon from '@images/pdf.png';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import envelopeIcon from '@images/icons/envelope.svg';

import {
  createComposeEmail, emailStateChange, getTemplateDetail, resetPrint, getVendorDetail,
} from '../../../purchaseService';
import {
  getPartners,
} from '../../../../assets/equipmentService';
import { getAllowedCompanies } from '../../../../util/appUtils';

const appModels = require('../../../../util/appModels').default;

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

const ResendByEmail = (props) => {
  const {
    quotationDetails, resendModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const editor = useRef(null);
  const [modal, setModal] = useState(resendModal);
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState('');
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [vendorIds, setVendorIds] = useState([]);
  const [vendorValues, setVendorValues] = useState(false);
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const classes = useStyles();

  const {
    composeEmailInfo, emailChangeInfo, printReportInfo, templateInfo, templateDetails, vendorDetails,
  } = useSelector((state) => state.purchase);
  const {
    userInfo,
  } = useSelector((state) => state.user);

  const onEmailContentChange = (data) => {
    setEmailContent(data);
  };

  const onSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  useEffect(() => {
    const viewId = quotationDetails && quotationDetails.data ? quotationDetails.data[0].id : '';
    if (viewId && (templateInfo && templateInfo.data) && (printReportInfo && printReportInfo.data)) {
      const tId = templateInfo && templateInfo.data ? templateInfo.data[0].id : '';
      const md = `"${appModels.PURCHASEORDER}"`;
      const result = [tId, '"comment"', md, viewId];
      dispatch(getTemplateDetail(result, 'onchange_template_id', appModels.COMPOSEMAIL));
    }
  }, [templateInfo, printReportInfo]);

  useEffect(() => {
    if (templateDetails && templateDetails.data) {
      const bodyContent = templateDetails && templateDetails.data ? templateDetails.data.value.body : '';
      setEmailContent(bodyContent);
    }
  }, [templateDetails]);

  useEffect(() => {
    const viewId = quotationDetails && quotationDetails.data ? quotationDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (emailChangeInfo && emailChangeInfo.data)) {
      dispatch(resetPrint());
    }
  }, [userInfo, emailChangeInfo]);

  useEffect(() => {
    if (composeEmailInfo && composeEmailInfo.data) {
      const cid = composeEmailInfo.data[0];
      dispatch(emailStateChange(cid, 'action_send_mail', appModels.COMPOSEMAIL));
    }
  }, [composeEmailInfo]);

  useEffect(() => {
    if (quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0)) {
      const content = quotationDetails.data[0].name;
      setSubject(content);
    }
  }, [quotationDetails]);

  const sendEmail = () => {
    const id = quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0) ? quotationDetails.data[0].id : '';
    const tId = templateInfo && templateInfo.data ? templateInfo.data[0].id : '';
    const aId = templateDetails && templateDetails.data && templateDetails.data.value.attachment_ids[0] ? templateDetails.data.value.attachment_ids[0] : '';
    const email = templateDetails && templateDetails.data ? templateDetails.data.value.email_from : '';

    if (id) {
      const values = {
        model: appModels.PURCHASEORDER,
        res_id: id,
        body: emailContent,
        composition_mode: 'comment',
        email_from: email,
        partner_ids: [6, 0, vendorIds],
        template_id: tId,
        attachment_ids: aId,
        subject,
      };
      dispatch(createComposeEmail(values, appModels.COMPOSEMAIL));
      setSubject('');
      setEmailContent('');
    }
  };

  const downloadPdf = () => {
    if (printReportInfo && printReportInfo.data) {
      const pdfBase64 = printReportInfo.data.content;
      const dlnk = document.getElementById('dwnldLnkEmail');
      dlnk.href = `data:application/octet-stream;base64,${pdfBase64}`;
      dlnk.click();
    }
  };

  const quotationData = quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0) ? quotationDetails.data[0] : '';

  const rfqName = quotationDetails && quotationDetails.data ? quotationDetails.data[0].name : '';

  const loading = (printReportInfo && printReportInfo.loading)
  || (templateInfo && templateInfo.loading) || (templateDetails && templateDetails.loading)
  || (quotationDetails && quotationDetails.loading)
  || (composeEmailInfo && composeEmailInfo.loading) || (emailChangeInfo && emailChangeInfo.loading);

  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);

  const companies = getAllowedCompanies(userInfo);

  let customerOptions = [];
  if (partnersInfo && partnersInfo.loading) {
    customerOptions = [{ name: 'Loading..' }];
  }
  if (partnersInfo && partnersInfo.data) {
    customerOptions = partnersInfo.data;
  }
  if (partnersInfo && partnersInfo.err) {
    customerOptions = [];
  }

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };
  const onCustomerChange = (values) => {
    setVendorValues(values);
  };
  useEffect(() => {
    if (vendorValues && vendorValues.length) {
      const vendorArray = [];
      // eslint-disable-next-line array-callback-return
      vendorValues.map((data) => {
        vendorArray.push(data.id);
      });
      setVendorIds(vendorArray);
    }
  }, [vendorValues]);

  useEffect(() => {
    if (quotationData && quotationData.partner_id && quotationData.partner_id.length) {
      dispatch(getVendorDetail(quotationData.partner_id[0], appModels.PARTNER));
    }
  }, [quotationData]);

  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen && quotationData && quotationData.partner_id && quotationData.partner_id.length) {
      dispatch(getPartners(companies, appModels.PARTNER, 'supplier', customerKeyword, quotationData.partner_id[0]));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  return (
    <>
      <a id="dwnldLnkEmail" aria-hidden="true" download={`RFQ-${rfqName}.pdf`} className="d-none" />
      <Modal size={(emailChangeInfo && emailChangeInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={resendModal}>
        <ModalHeaderComponent title="Compose Email" fontAwesomeIcon={faEnvelope} closeModalWindow={toggle} size="lg" response={emailChangeInfo} />
        <ModalBody className="pt-0">
          {(loading || (composeEmailInfo && composeEmailInfo.data) || (emailChangeInfo && (emailChangeInfo.data || emailChangeInfo.status))) ? '' : (
            <>
              <Row className="ml-3 mr-5">
                <Col lg="2" md="12" sm="12" xs="12" className="pt-2">
                  Recipients
                </Col>
                <Col lg="10" md="12" sm="12" xs="12" className="p-0 mb-2">
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    name="customer"
                    open={customerOpen}
                    size="small"
                    classes={{
                      option: classes.option,
                    }}
                    onOpen={() => {
                      setCustomerOpen(true);
                      setCustomerKeyword('');
                    }}
                    onClose={() => {
                      setCustomerOpen(false);
                      setCustomerKeyword('');
                    }}
                    onChange={(e, data) => onCustomerChange(data)}
                    defaultValue={vendorDetails && vendorDetails.data && vendorDetails.data.length ? vendorDetails.data : []}
                    loading={partnersInfo && partnersInfo.loading}
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
                    options={customerOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        value={customerKeyword}
                        onChange={onCustomerKeywordChange}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Col>
              </Row>
              {(vendorValues && !vendorValues.length) && (
              <Row>
                <Col lg="2" md="12" sm="12" xs="12" />
                <Col lg="10" md="12" sm="12" xs="12" className="p-0 mb-2">
                  <div className="text-danger font-11 ml-3">
                    Recipients are required
                  </div>
                </Col>
              </Row>
              )}
              <Row className="ml-3 mr-5">
                <Col lg="2" md="12" sm="12" xs="12" className="pt-2">
                  Subject
                </Col>
                <Col lg="10" md="12" sm="12" xs="12" className="p-0">
                  <Input
                    type="text"
                    name="subject"
                    value={subject}
                    onChange={onSubjectChange}
                    className="subjectticket bw-2 mt-0"
                  />
                </Col>
              </Row>
              <Row className="mt-4 ml-2 mr-2 ">
                <Col lg="12" md="12" sm="12" xs="12">
                  <JoditEditor
                    ref={editor}
                    value={emailContent}
                    onChange={onEmailContentChange}
                    onBlur={onEmailContentChange}
                  />
                </Col>
              </Row>
              <Row className="mt-4 ml-2 mr-2 ">
                <Col lg="12" md="12" sm="12" xs="12">
                  <>
                    {printReportInfo && printReportInfo.data && Object.keys(printReportInfo.data).length > 0
                      ? (
                        <Col sm="4" md="4" lg="4" xs="4" className="position-relative mb-3">
                          <span>
                            {`PO-${rfqName}.pdf`}
                            {' '}
                          </span>
                          <br />
                          <img
                            src={PdfIcon}
                            alt="view document"
                            aria-hidden="true"
                            height="50"
                            width="50"
                            onClick={() => { downloadPdf(); }}
                            className="cursor-pointer"
                          />
                        </Col>
                      ) : ''}
                    <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                    <span className="text-lightblue font-tiny cursor-pointer"> Attachment</span>
                  </>
                </Col>
              </Row>
            </>
          )}
          {loading && (
          <div className="text-center mt-3">
            <Loader />
          </div>
          )}
          <Row className="justify-content-center">
            {emailChangeInfo && emailChangeInfo.data && (quotationDetails && !quotationDetails.loading) && (
            <SuccessAndErrorFormat response={emailChangeInfo} successMessage="Email has been send successfully.." />
            )}
            {composeEmailInfo && composeEmailInfo.err && (
            <SuccessAndErrorFormat response={composeEmailInfo} />
            )}

            {templateInfo && templateInfo.err && (
            <SuccessAndErrorFormat response={templateInfo} />
            )}
            {templateDetails && templateDetails.err && (
            <SuccessAndErrorFormat response={templateDetails} />
            )}
            {printReportInfo && printReportInfo.err && (
            <SuccessAndErrorFormat response={printReportInfo} />
            )}
          </Row>
        </ModalBody>
        <ModalFooter className="mr-3 ml-3">
          {emailChangeInfo && emailChangeInfo.data
            ? (
              <Button
                type="button"
                size="sm"
                 variant="contained"
                className="mr-1"
                onClick={toggle}
              >
                Ok
              </Button>
            )
            : (
              <Button
                type="button"
                size="sm"
                disabled={emailContent === '' || (vendorValues && !vendorValues.length)}
                 variant="contained"
                className="mr-1"
                onClick={sendEmail}
              >
                Send
              </Button>
            )}
        </ModalFooter>
      </Modal>
    </>
  );
};

ResendByEmail.propTypes = {
  quotationDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  resendModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default ResendByEmail;
