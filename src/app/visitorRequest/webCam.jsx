/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import ReactWebcam from 'react-webcam';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';

const webCam = ({ onCapture }) => {
  const webcamRef = React.useRef(null);
  const [error, setError] = React.useState(null);
  const [error1, setError1] = React.useState(null);
  const [error2, setError2] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [enableNoDevice, setNoDevice] = useState(false);

  /* useEffect(() => {
    const checkPermissions = async () => {
      try {
        const status = await navigator.mediaDevices.getUserMedia({ video: true });
        setPermissionStatus(status.state);

        status.onchange = () => {
          setPermissionStatus(status.state); // Update state when permission changes
        };

        if (status.state === 'denied') {
          setError('Camera access is denied. Please allow access to capture.');
          setLoading(false);
        } else {
          fetchDevices();
        }
      } catch (err) {
        console.error('Permission check failed:', err);
        setError('Camera access is denied. Please allow access to capture..');
        setLoading(false);
      }
    };

    const fetchDevices = async () => {
      try {
        const devicesList = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devicesList.filter((device) => device.deviceId && device.kind === 'videoinput');
        console.log(videoDevices);
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first device
        } else {
          setError('No video devices found.');
        }
      } catch (err) {
        console.error('Error fetching devices:', err);
        setError('Failed to access devices.');
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, []); */

  // Fetch available media devices
  /* useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((deviceInfos) => {
        const videoDevices = deviceInfos.filter(
          (device) => device.deviceId && device.kind === 'videoinput',
        );
        console.log(videoDevices);
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first webcam
          setLoading(false);
          setNoDevice(false);
          if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            setError2('Your browser does not support media device enumeration.');
          }
          setError2(false);
        } else {
          console.error('No devices:');
          setNoDevice(true);
          setError('Camera access is denied. Please allow access to capture..');
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching devices:', err);
        setNoDevice(false);
        setError2(false);
        setError('Camera access is denied. Please allow access to capture..');
        setLoading(false);
      });
  }, []); */

  useEffect(() => {
    const checkDevices = async () => {
      try {
        // Request access to the user's camera to unlock device enumeration
        await navigator.mediaDevices.getUserMedia({ video: true });

        // After permissions are granted, enumerate devices
        const deviceInfos = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceInfos.filter(
          (device) => device.deviceId && device.kind === 'videoinput',
        );

        console.log('Video devices:', videoDevices);
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId); // Default to the first webcam
          setLoading(false);
          setNoDevice(false);
          setError2(false);
        } else {
          console.error('No devices found');
          setNoDevice(true);
          if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            setError2('Your browser does not support media device enumeration.');
          }
          setError('No video devices found. Please connect a camera.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error accessing devices or permissions denied:', err);
        setNoDevice(false);
        setError2(false);
        setError(
          err.name === 'NotAllowedError'
            ? 'Camera access is denied. Please allow access to capture.'
            : 'Unable to access camera. Please check your device or permissions.',
        );
        setLoading(false);
      }
    };

    checkDevices();
  }, []);

  const capture = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      } else {
        console.error('Failed to capture image.');
      }
    }
  }, [webcamRef]);

  const handleUserMediaError = (err) => {
    console.error('Camera error:', err);
    setError(err.message || 'Camera access denied.');
    setError1(err.message || 'Camera access denied.');
  };

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>

      <DialogContent>

        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            {!enableNoDevice && !selectedDeviceId && loading && !error && <p>Loading camera...</p>}
            {!enableNoDevice && !selectedDeviceId && error && !loading && (
              <div>
                <p className="text-danger">
                  {error}
                  {' '}
                  <br />
                  <strong>Please refresh the page after enabling permissions.</strong>
                </p>
                <Button variant="contained" color="primary" onClick={handleRefresh}>
                  Refresh Page
                </Button>
              </div>
            )}
            {devices && devices.length > 0 && (
            <div className="p-2">
              <span className="mr-2">Select Device : </span>
              <select onChange={handleDeviceChange} value={selectedDeviceId}>
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId}`}
                  </option>
                ))}
              </select>
            </div>
            )}
            {!enableNoDevice && selectedDeviceId && (
            <>
              <ReactWebcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                width={300}
                height={300}
                videoConstraints={{
                  width: 300,
                  height: 300,
                  deviceId: selectedDeviceId,
                  facingMode: 'user',
                }}
                onUserMedia={() => setLoading(false)}
                onUserMediaError={handleUserMediaError}
              />
              {error && (<p className="text-danger">{error}</p>)}
              {!error && loading && (<p className="text-info">Loading camera...</p>)}
            </>
            )}
            {enableNoDevice && (
            <>
              <ReactWebcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                width={300}
                height={300}
                videoConstraints={{
                  width: 300,
                  height: 300,
                  facingMode: 'user',
                }}
                onUserMedia={() => setLoading(false)}
                onUserMediaError={handleUserMediaError}
              />
              {!error2 && error1 && (<p className="text-danger">{error1}</p>)}
              {!error1 && error2 && (<p className="text-danger">{error2}</p>)}
              {!error1 && loading && (<p className="text-info">Loading camera...</p>)}
            </>
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          type="button"
          variant="contained"
          disabled={(!enableNoDevice && error) || (enableNoDevice && error1) || loading}
          onClick={capture}
        >
          Capture
        </Button>
      </DialogActions>

    </>
  );
};

export default webCam;
