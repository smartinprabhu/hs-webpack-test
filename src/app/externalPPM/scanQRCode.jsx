/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import {
  FormHelperText,
} from '@material-ui/core';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import { Html5Qrcode } from 'html5-qrcode';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import workorderLogo from '@images/icons/workOrders.svg';
import {
  getDefaultNoValue,
  extractNameObject,
  detectMob,
} from '../util/appUtils';

const ScanQRCode = React.memo(({
  setQrscanInfo, startWo, qrscanInfo, toggle, detailData,
}) => {
  const qrCodeRegionId = 'qr-reader';
  const [qrData, setQrData] = useState(false);
  const [matchStatus, setMatchStatus] = useState(false);

  const isMobileDevice = () => /Mobi|Android/i.test(navigator.userAgent);

  const fileUpload = () => {
    if (matchStatus) {
      setQrscanInfo(true);
      setTimeout(() => {
        startWo();
        toggle();
      }, 1500);
    }
  };

  const validCodes = [detailData.asset_code];

  useEffect(() => {
    if (qrData && matchStatus) {
      fileUpload();
    }
  }, [matchStatus]);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);
    let isScanning = false; // Track scanning state manually

    const config = {
      fps: 10, // Frames per second
      qrbox: { width: 250, height: 250 }, // QR code scanning box
    };

    // Camera constraints based on device
    const cameraConfig = isMobileDevice()
      ? { facingMode: { exact: 'environment' } } // Rear camera on mobile
      : { facingMode: 'user' }; // Default/front camera on desktop

    // Start the camera and QR scanning
    html5QrCode.start(
      cameraConfig, // Start the camera
      config,
      (decodedText) => {
        // Handle success when a QR code is scanned
        setQrData(decodedText);

        // Check if the scanned data matches any predefined code
        if (validCodes.includes(decodedText)) {
          setMatchStatus('Code Matched!');
          setQrscanInfo(true);
        } else {
          setMatchStatus(false);
        }
      },
      (errorMessage) => {
        // Handle failure
        console.warn(`QR Code scan failed: ${errorMessage}`);
      },
    ).then(() => {
      isScanning = true; // Mark as scanning
    }).catch((err) => {
      console.error(`Unable to start scanning: ${err}`);
    });

    return () => {
      // Only stop the scanner if it was running
      if (isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
          isScanning = false; // Mark as stopped
        }).catch((err) => {
          console.error(`Failed to stop scanning: ${err}`);
        });
      } else {
        console.log('Scanner is not running, no need to stop.');
      }
    };
  }, [detailData]);

  const isMobileView = detectMob();

  return (
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
            {detailData && !qrscanInfo && (
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
                      <p className="font-family-tab text-info mb-0 font-weight-700">Scan the Asset to start performing the PPM.</p>
                      <p className="font-family-tab text-info font-tiny">(Camera Permission Required. Look for the Asset QR pasted on the Asset.You may contact facility team for Support)</p>
                      <div className="">
                        <div id="qr-reader" style={{ width: '100%' }} />
                      </div>
                      {qrData && !matchStatus && (<FormHelperText><span className="text-danger font-family-tab">Invalid QR Code! You may try again</span></FormHelperText>)}
                    </Col>
                  </Row>
                </CardBody>
              </Col>
            )}
          </Row>
          {qrData && matchStatus && (
            <SuccessAndErrorFormat response={false} staticSuccessMessage="Asset is verified successfully." />
          )}
          <hr className="mb-0" />
        </Box>
      </DialogContentText>
    </DialogContent>
  );
});

export default ScanQRCode;
