import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import { Typography, Button } from '@mui/material';
import ReactFileReader from 'react-file-reader';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import closeCircleIcon from '@images/icons/closeCircle.svg';

import fileMiniIcon from '@images/icons/fileMini.svg';

import {
  getUploadImageForm,
} from '../helpdesk/ticketService';
import { AddThemeColor } from '../themes/theme';
import { mergeArray, isMemorySizeLarge, getFileExtension } from '../util/appUtils';

const appModels = require('../util/appModels').default;

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const UploadDocuments = ({
  model, saveData, limit, setFieldValue, uploadFileType, labelName, fileImage, imageFieldName,
}) => {
  const [errorShow, setErrorShow] = useState(false);
  const [documentReady, setDocumentReady] = useState('');
  const [imgSize, setimgSize] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [companyId, setCompanyId] = useState(false);
  const [finish, setFinish] = useState(false);
  const [imageName, setImageName] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);
  const [viewImage, setViewImage] = useState('');
  const [modal, setModal] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [savedFileImage, setSavedFileImage] = useState(fileImage || false);
  const errorToggle = () => setErrorShow(!errorShow);

  const toggle = () => {
    setModal(!modal);
  };

  const toggleAlert = () => {
    setModalAlert(!modalAlert);
    setFinish(false);
  };

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const {
    uploadPhotoForm,
  } = useSelector((state) => state.ticket);

  const filesLimit = limit;

  useEffect(() => {
    if (userInfo && userInfo.data) {
      setCompanyId(userInfo.data.company.id);
    }
  }, [userInfo]);

  useEffect(() => {
    if (finish) {
      if (isMemorySizeLarge(filesList)) {
        dispatch(getUploadImageForm(filesList));
      } else {
        setimgSize(true);
        setErrorShow(true);
      }
    }
  }, [finish, documentReady]);

  useEffect(() => {
    if (saveData?.data) {
      setViewImage('');
      setImageName('');
    }
  }, [saveData]);

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    if (files !== undefined && filesList.length < filesLimit) {
      const { type } = files.fileList[0];
      if (setFieldValue) {
        if (uploadFileType && uploadFileType === 'images') {
          if (type && type.match(/.(jpg|jpeg|svg|png)$/i)) {
            setFilesList([...filesList, ...mergeArray([files.base64], files.fileList, companyId, model)]);
            const remfile = `data:${files.fileList[0].type};base64,`;
            const fileData = files.base64.replace(remfile, '');
            if (imageFieldName) {
              setFieldValue(imageFieldName, fileData);
            } else {
              setFieldValue('image_medium', fileData);
              setFieldValue('image_small', fileData);
            }
            setFinish(true);
            setDocumentReady(Math.random());
          } else {
            setimgValidation(true);
          }
        } else if (uploadFileType && uploadFileType === 'all') {
          setFilesList([...filesList, ...mergeArray([files.base64], files.fileList, companyId, model)]);
          const remfile = `data:${files.fileList[0].type};base64,`;
          const fileData = files.base64.replace(remfile, '');
          setFieldValue('image_medium', fileData);
          setFieldValue('image_small', fileData);
          setFinish(true);
          setDocumentReady(Math.random());
        }
      } else if (uploadFileType && uploadFileType === 'images') {
        if (type && type.match(/.(jpg|jpeg|svg|png)$/i)) {
          if (isMemorySizeLarge(files.fileList)) {
            setFilesList([...filesList, ...mergeArray([files.base64], files.fileList, companyId, model)]);
            setFinish(true);
            setDocumentReady(Math.random());
          } else {
            setimgSize(true);
          }
        } else {
          setimgValidation(true);
        }
      } else if (uploadFileType && uploadFileType === 'all') {
        if (isMemorySizeLarge(files.fileList)) {
          setFilesList([...filesList, ...mergeArray([files.base64], files.fileList, companyId, model)]);
          setFinish(true);
          setDocumentReady(Math.random());
        } else {
          setimgSize(true);
          setSavedFileImage(false);
        }
      }
    }
  };

  const onRemovePhoto = (id) => {
    setFilesList(filesList.filter((item, index) => index !== id));
    dispatch(getUploadImageForm(filesList.filter((item, index) => index !== id)));
  };

  const handleSizeClose = () => setimgSize(false);
  const handleImageClose = () => setimgValidation(false);

  return (
    <>
      <Typography
        sx={{
          font: 'normal normal normal 16px Suisse Intl',
          letterSpacing: '0.63px',
          color: '#000000',
          marginBottom: '10px',
          // alignSelf: "flex-start",
        }}
      >
        {labelName || 'Attachments'}
      </Typography>
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
        {!savedFileImage && filesList.length < filesLimit && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ReactFileReader
              handleFiles={handleFiles}
              elementId="fileUpload"
              fileTypes={uploadFileType && uploadFileType === 'images' ? ['.csv', '.png', '.jpg', '.jpeg', '.svg'] : ['.csv', '.png', '.jpg', '.jpeg', '.svg', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pdf']}
              base64
            >
              <Button
                variant="contained"
                component="label"
              >
                Upload

              </Button>
            </ReactFileReader>
          </Box>
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
              (Upload files less than 20 MB)
            </Typography>
            <Typography
              sx={{
                font: 'normal normal normal 12px Suisse Intl',
                letterSpacing: '0.63px',
                color: 'grey',
                marginBottom: '10px',
                marginLeft: '5px',
                justifyContent: 'center',
                display: 'flex',
              }}
            >
              (Number of attachments maximum upload :
              {' '}
              {filesLimit}
              )
            </Typography>
          </Box>
        </Box>
        )}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {((savedFileImage)) && (
            <div className="position-relative mt-3 mr-3">
              <img
                src={`data:image/png;base64,${savedFileImage}`}
                height="100"
                width="100"
                alt="uploaded"
                aria-hidden="true"
              />
              <div className="position-absolute topright-img-close1">
                <img
                  aria-hidden="true"
                  src={closeCircleIcon}
                  className="cursor-pointer"
                  onClick={() => {
                    setSavedFileImage(false);
                  }}
                  alt="remove"
                />
              </div>
            </div>
          )}
          {uploadPhotoForm && uploadPhotoForm.length && uploadPhotoForm.length > 0 && !savedFileImage && imageFieldName ? (
            <>
              {uploadPhotoForm.map((fl, index) => (
                <div className="position-relative mt-3 mr-3">
                  {(getFileExtension(fl.datas_fname) === 'png'
                                        || getFileExtension(fl.datas_fname) === 'svg'
                                        || getFileExtension(fl.datas_fname) === 'jpeg'
                                        || getFileExtension(fl.datas_fname) === 'jpg') && (
                                        <>
                                          <img
                                            src={fl.database64}
                                            alt={fl.name}
                                            aria-hidden="true"
                                            height="100"
                                            width="100"
                                            onClick={() => { setImageName(fl.name); setViewImage(fl.database64); toggle(); }}
                                            className="cursor-pointer"
                                          />
                                          <div className="position-absolute topright-img-close1">
                                            <img
                                              aria-hidden="true"
                                              src={closeCircleIcon}
                                              className="cursor-pointer"
                                              onClick={() => {
                                                onRemovePhoto(index);
                                              }}
                                              alt="remove"
                                            />
                                          </div>
                                          <p className="m-0">{fl.datas_fname}</p>
                                        </>
                  )}
                  {(getFileExtension(fl.datas_fname) !== 'png' && getFileExtension(fl.datas_fname) !== 'svg' && getFileExtension(fl.datas_fname) !== 'jpeg' && getFileExtension(fl.datas_fname) !== 'jpg') && (
                  <>
                    <img
                      src={fileMiniIcon}
                      alt={fl.name}
                      aria-hidden="true"
                      height="80"
                      width="100"
                      className="cursor-pointer"
                    />
                    <p className="m-0">{fl.datas_fname}</p>
                    <div className="position-absolute topright-img-close1">
                      <img
                        aria-hidden="true"
                        src={closeCircleIcon}
                        className="cursor-pointer"
                        onClick={() => {
                          onRemovePhoto(index);
                        }}
                        alt="remove"
                      />
                    </div>
                  </>
                  )}
                </div>
              ))}
            </>
          )
            : (<span />)}

        </Box>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar open={imgSize} autoHideDuration={2000} onClose={handleSizeClose}>
            <Alert onClose={handleSizeClose} severity="error" sx={{ width: '100%' }}>
              Upload files less than 20 MB
            </Alert>
          </Snackbar>
        </Stack>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar open={imgValidation} autoHideDuration={2000} onClose={handleSizeClose}>
            <Alert onClose={handleImageClose} severity="error" sx={{ width: '100%' }}>
              Upload images only
            </Alert>
          </Snackbar>
        </Stack>
        <Dialog
          open={modal}
          onClose={toggle}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {imageName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <img src={viewImage} alt="view document" width="100%" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggle}>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={modalAlert}
          onClose={toggleAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Alert
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure, you want to upload this document ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" variant="contained" onClick={() => { setFinish(true); setDocumentReady(Math.random()); setModalAlert(false); }}>Ok</Button>
            {' '}
            <Button  variant="contained" onClick={() => { document.getElementById('fileUpload').value = null; setFinish(false); setModalAlert(false); }}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};
export default UploadDocuments;
