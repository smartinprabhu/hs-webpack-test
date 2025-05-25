/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import {
  faCameraAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FormHelperText,
} from '@material-ui/core';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import axios from 'axios';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import workorderLogo from '@images/icons/workOrders.svg';
import {
  getDefaultNoValue,
  extractNameObject,
  detectMob,
  getLocalTimeSeconds,
} from '../util/appUtils';
import { bytesToSizeLow } from '../util/staticFunctions';

const CaptureImage = React.memo(({
  setCaputureInfo, startWo, toggle, accid, captureInfo, companyId, detailData,
}) => {
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileDataType, setFileDataType] = useState(false);
  const [fileDataValues, setFileDataValues] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const getBase64 = (file) => new Promise((resolve) => {
    let fileInfo;
    let baseURL = '';
    // Make new FileReader
    const reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      console.log('Called', reader);
      baseURL = reader.result;
      resolve(baseURL);
    };
  });

  const handleFileInputChange = (e) => {
    const file = e.target.files && e.target.files.length ? e.target.files[0] : false;
    setimgValidation(false);
    setimgSize(false);
    if (file) {
      const { type } = file;

      if (!type.includes('image')) {
        setimgValidation(true);
      } else if (!bytesToSizeLow(file.size)) {
        setimgSize(true);
      } else {
        const remfile = `data:${file.type};base64,`;
        setFileDataType(remfile);
        getBase64(file)
          .then((result) => {
            const fileData = result.replace(remfile, '');
            setFileDataImage(fileData);
            const values = {
              datas: fileData,
              datas_fname: file.name,
              name: `${getLocalTimeSeconds(new Date())}-${detailData.name}`.replace(/\s+/g, ''),
              company_id: companyId,
              res_model: 'mro.order',
              res_id: detailData.order_id && detailData.order_id.id ? detailData.order_id.id : false,
              description: `${detailData.name} - External`,
            };
            setFileDataValues(values);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const fileUpload = () => {
    if (fileDataValues) {
      setCaputureInfo({ loading: true, data: null, err: null });

      const newArrData = [fileDataValues];

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
            setCaputureInfo({ loading: false, data: response.data.data, err: null });
          } else if (response.data && response.data.error && response.data.error.message) {
            setCaputureInfo({ loading: false, data: null, err: response.data.error.message });
          }
        })
        .catch((error) => {
          setCaputureInfo({ loading: false, data: null, err: error });
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
              {detailData && !(captureInfo && captureInfo.data) && !captureInfo.loading && (
              <Col sm="12" md="12" lg="12" xs="12">
                <Card className={`${isMobileView ? 'mb-2' : 'border-5 ml-4 mb-4 mr-4 border-secondary'} rounded-0 border-top-0 border-right-0 border-bottom-0`}>

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
                <CardBody className={isMobileView ? 'bg-lightblue p-1 text-center' : 'bg-lightblue p-3'}>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="text-center">
                      <p className="font-family-tab text-info mb-0 font-weight-700">Capture Image of the Asset to start performing the PPM</p>
                      <p className="font-family-tab text-info font-tiny">(You may contact facility team for Support)</p>
                      <div className="image-upload">
                        <label htmlFor="file-input">
                          {fileDataImage ? (
                            <img src={`${fileDataType}${fileDataImage}`} alt="imageUpload" width="80" height="80" className="cursor-pointer mt-3 mb-3" />
                          ) : (
                            <FontAwesomeIcon className="cursor-pointer fa-4x" icon={faCameraAlt} />
                          )}
                        </label>
                        <input id="file-input" type="file" accept="image/*" capture="camera" onChange={handleFileInputChange} />
                      </div>
                      {imgValidation && (<FormHelperText><span className="text-danger font-family-tab">Choose Image Only</span></FormHelperText>)}
                      {imgSize && (<FormHelperText><span className="text-danger font-family-tab">Maximum File Upload Size 5 MB</span></FormHelperText>)}
                    </Col>
                  </Row>
                </CardBody>
              </Col>
              )}
            </Row>
            {captureInfo && captureInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(captureInfo && captureInfo.err) && (
            <FormHelperText><span className="text-danger font-family-tab">Something went wrong..</span></FormHelperText>
            )}
            {captureInfo && captureInfo.data && !captureInfo.loading && (
            <SuccessAndErrorFormat response={captureInfo} successMessage="The Image has been captured and uploaded successfully." />
            )}
            <hr className="mb-0" />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!(captureInfo && captureInfo.data) && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          disabled={!fileDataValues || (captureInfo && captureInfo.data) || captureInfo.loading}
          onClick={() => fileUpload()}
        >
          Submit

        </Button>
        )}
        {(captureInfo && captureInfo.data) && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          onClick={() => { toggle(); startWo(); }}
          disabled={captureInfo.loading}
        >
          OK
        </Button>
        )}
      </DialogActions>
    </>
  );
});

export default CaptureImage;
