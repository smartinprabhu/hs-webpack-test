/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Label,
  Col,
  Row,
} from 'reactstrap';
import {
  FormHelperText,
} from '@material-ui/core';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import axios from 'axios';
import ReactFileReader from 'react-file-reader';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import workorderLogo from '@images/icons/workOrders.svg';
import fileMiniIcon from '@images/icons/fileMini.svg';
import {
  getDefaultNoValue,
  extractNameObject,
  detectMob,
  getLocalTimeSeconds,
} from '../util/appUtils';
import { bytesToSizeLow } from '../util/staticFunctions';

const ServiceReport = React.memo(({
  ppmConfig, toggle, accid, putOnhold, companyId, detailData,
}) => {
  const [rerportFile, setReportFile] = useState(false);
  const [reportFileName, setReportFileName] = useState(false);
  const [fileValue, setFileValue] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);

  const [seviceReportInfo, setSeviceReportInfo] = useState({ loading: false, data: null, err: null });

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const handleFiles = (files) => {
    setimgValidation(false);
    const viewId = detailData.order_id && detailData.order_id.id ? detailData.order_id.id : '';
    setimgSize(false);
    setReportFile('');
    setReportFileName('');
    if (files !== undefined) {
      const { name } = files.fileList[0];
      const { size } = files.fileList[0];
      const formatsArray = ppmConfig && ppmConfig.service_report_file_formats && ppmConfig.service_report_file_formats.split(',').map((format) => format.trim());
      const regex = new RegExp(`\\.(${formatsArray.join('|')})$`, 'i');
      if (name && !name.match(regex)) {
        setimgValidation(true);
        setimgSize(false);
        setReportFile('');
        setReportFileName('');
        document.getElementById('fileUpload').value = null;
      } else if (size && !(bytesToSizeLow(size))) {
        setimgValidation(false);
        setimgSize(true);
        setReportFile('');
        setReportFileName('');
        document.getElementById('fileUpload').value = null;
      } else {
        setReportFile(files.base64);
        const remfile = `data:${files.fileList[0].type};base64,`;
        const photoname = files.fileList[0].name;
        setReportFileName(photoname);
        const fname = `${getLocalTimeSeconds(new Date())}-${detailData.name}`.replace(/\s+/g, '');
        const filedata = files.base64.replace(remfile, '');

        const values = {
          datas: filedata, datas_fname: photoname, name: fname, company_id: companyId, res_model: 'mro.order', res_id: viewId,
        };
        setFileValue(values);
      }
    }
  };

  const fileUpload = () => {
    if (fileValue) {
      setSeviceReportInfo({ loading: true, data: null, err: null });

      const newArrData = [fileValue];

      const data = {
        values: newArrData,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/Attachment`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          if (response.data.data) {
            setSeviceReportInfo({ loading: false, data: response.data.data, err: null });
          } else if (response.data && response.data.error && response.data.error.message) {
            setSeviceReportInfo({ loading: false, data: null, err: response.data.error.message });
          }
        })
        .catch((error) => {
          setSeviceReportInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const isMobileView = detectMob();

  return (
    <>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: isMobileView ? '5px' : '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Row className={isMobileView ? '' : 'ml-4 mr-4 mb-0'}>
              {detailData && !(seviceReportInfo && seviceReportInfo.data) && !seviceReportInfo.loading && (
              <Col sm="12" md="12" lg="12" xs="12">
                <Card className={`${isMobileView ? 'mb-2' : 'ml-4 mb-4 mr-4 border-secondary border-5'} rounded-0 border-top-0 border-right-0 border-bottom-0`}>

                  <CardBody className={isMobileView ? 'bg-lightblue p-1 text-center' : 'bg-lightblue p-3'}>
                    <Row className={isMobileView ? 'm-0' : ''}>
                      <Col md="2" xs="12" sm="12" lg="2">
                        <img src={workorderLogo} alt="asset" className="mt-2" width="35" height="35" />
                      </Col>
                      <Col md="9" xs="12" sm="12" lg="9" className={isMobileView ? 'mt-2' : 'ml-2'}>
                        <Row>
                          <h6 className="mb-1 font-family-tab">{detailData.name}</h6>
                        </Row>
                        <Row>
                          <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                            {!isMobileView && (
                            <span className="font-weight-800 font-side-heading mr-1 font-family-tab">
                              Asset Name :
                            </span>
                            )}
                            <span className="font-weight-400 font-tiny font-family-tab">
                              {getDefaultNoValue(detailData.category_type === 'e' ? extractNameObject(detailData.equipment_id, 'name') : extractNameObject(detailData.space_id, 'space_name'))}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                            {!isMobileView && (
                            <span className="font-weight-800 font-side-heading mr-1 font-family-tab">
                              Location :
                            </span>
                            )}
                            <span className="font-weight-400 font-tiny font-family-tab">
                              {getDefaultNoValue(detailData.category_type === 'e' && detailData.equipment_id && detailData.equipment_id.location_id ? extractNameObject(detailData.equipment_id.location_id, 'path_name') : extractNameObject(detailData.space_id, 'path_name'))}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </CardBody>

                </Card>

                <Row className="mt-2">
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <p className="text-center text-info">Please attach the service report to Complete this PPM</p>
                    {ppmConfig && ppmConfig.service_report_file_formats && (
                    <>
                      <p className="font-tiny text-center mb-0">
                        (Allowed File formats are
                        {' '}
                        {' '}
                        {ppmConfig && ppmConfig.service_report_file_formats ? ppmConfig.service_report_file_formats : ''}
                        )
                      </p>
                      <p className="font-tiny text-center mb-0">(Upload file size less than 5 MB)</p>
                    </>
                    )}
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Label for="product_id">
                      Attachment
                      <span className="text-danger ml-1">*</span>
                    </Label>
                    <Box
                      sx={{
                        padding: '20px',
                        border: '1px dashed #868686',
                        width: '100%',
                        display: 'block',
                        alignItems: 'center',
                        borderRadius: '4px',
                      }}
                    >
                      <Box>
                        {ppmConfig && ppmConfig.service_report_file_formats && (
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <ReactFileReader
                              elementId="fileUpload"
                              handleFiles={handleFiles}
                              fileTypes={ppmConfig && ppmConfig.service_report_file_formats && ppmConfig.service_report_file_formats.split(',').map((format) => `.${format.trim()}`)}
                              base64
                            >
                              {rerportFile ? (
                                <div className="text-center">
                                  <img
                                    src={fileMiniIcon}
                                    alt="file"
                                    aria-hidden="true"
                                    height="80"
                                    width="100"
                                    className="cursor-pointer"
                                  />
                                  <p className="mt-2">{reportFileName}</p>
                                </div>
                              ) : (
                                <Button
                                  variant="contained"
                                  component="label"
                                >
                                  Upload
                                </Button>
                              )}
                            </ReactFileReader>
                          </Box>
                        )}
                        <Box>
                          <Typography
                            sx={{
                              font: 'normal normal normal 14px Suisse Intl',
                              letterSpacing: '0.63px',
                              color: '#000000',
                              marginBottom: '10px',
                              marginTop: '10px',
                              marginLeft: '5px',
                              justifyContent: 'center',
                              display: 'flex',
                            }}
                          >
                            {!rerportFile && (<span className="text-danger ml-1">Service Report required</span>)}
                          </Typography>
                          {!(ppmConfig && ppmConfig.service_report_file_formats) && (
                          <Typography
                            sx={{
                              font: 'normal normal normal 14px Suisse Intl',
                              letterSpacing: '0.63px',
                              color: '#000000',
                              marginBottom: '10px',
                              marginTop: '10px',
                              marginLeft: '5px',
                              justifyContent: 'center',
                              display: 'flex',
                            }}
                          >
                            <span className="mt-2 text-info">This requires additional configuration.Please contact your support</span>
                          </Typography>
                          )}
                          {imgValidation && (
                          <Typography
                            sx={{
                              font: 'normal normal normal 14px Suisse Intl',
                              letterSpacing: '0.63px',
                              color: '#000000',
                              marginBottom: '10px',
                              marginTop: '10px',
                              marginLeft: '5px',
                              justifyContent: 'center',
                              display: 'flex',
                            }}
                          >
                            <span className="text-danger ml-1">Upload Valid file.</span>
                          </Typography>
                          )}
                          {imgSize && (
                            <Typography
                              sx={{
                                font: 'normal normal normal 14px Suisse Intl',
                                letterSpacing: '0.63px',
                                color: '#000000',
                                marginBottom: '10px',
                                marginTop: '10px',
                                marginLeft: '5px',
                                justifyContent: 'center',
                                display: 'flex',
                              }}
                            >
                              <span className="text-danger ml-1">Upload file size less than 5 MB.</span>
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>

                  </Col>
                </Row>
              </Col>
              )}
            </Row>
            {seviceReportInfo && seviceReportInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(seviceReportInfo && seviceReportInfo.err) && (
            <FormHelperText><span className="text-danger font-family-tab">Something went wrong..</span></FormHelperText>
            )}
            {seviceReportInfo && seviceReportInfo.data && !seviceReportInfo.loading && (
            <SuccessAndErrorFormat response={seviceReportInfo} successMessage="The Service Report is uploaded successfully." />
            )}
            <hr className="mb-0" />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!(seviceReportInfo && seviceReportInfo.data) && (
        <>
          <Button
            type="button"
            variant="contained"
            className="reset-btn-new"
            disabled={(seviceReportInfo && seviceReportInfo.data) || seviceReportInfo.loading}
            onClick={() => putOnhold()}
          >
            Skip & Submit

          </Button>
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            disabled={!fileValue || (seviceReportInfo && seviceReportInfo.data) || seviceReportInfo.loading}
            onClick={() => fileUpload()}
          >
            Submit

          </Button>
        </>
        )}
        {(seviceReportInfo && seviceReportInfo.data) && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          onClick={() => toggle()}
          disabled={seviceReportInfo.loading}
        >
          OK
        </Button>
        )}
      </DialogActions>
    </>
  );
});

export default ServiceReport;
