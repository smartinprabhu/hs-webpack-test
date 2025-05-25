import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  FormGroup,
  Toast,
  ToastBody,
  ToastHeader,
} from 'reactstrap';
import ReactFileReader from 'react-file-reader';
import { Image } from 'antd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Typography, Button } from '@mui/material';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import fileMiniIcon from '@images/icons/fileMini.svg';

import { mergeArray, isMemorySizeLarge, getFileExtension } from '../../../../../../util/appUtils';
import {
  getUploadImage,
} from '../../../../../../helpdesk/ticketService';

const appModels = require('../../../../../../util/appModels').default;

const Attachment = ({ label, isDcRequire, isPoRequire }) => {
  const [dcErrorShow, setDcErrorShow] = useState(false);
  const [dcDocumentReady, setDcDocumentReady] = useState('');
  const [dcImgSize, setDcImgSize] = useState(false);
  const [dcImgValidation, setDcImgValidation] = useState(false);
  const [companyId, setCompanyId] = useState(false);
  const [dcFinish, setDcFinish] = useState(false);
  const [dcfile, setDcFile] = useState([]);

  const dcErrorToggle = () => setDcErrorShow(!dcErrorShow);

  const [poErrorShow, setPoErrorShow] = useState(false);
  const [poDocumentReady, setPoDocumentReady] = useState('');
  const [poImgSize, setPoImgSize] = useState(false);
  const [poImgValidation, setPoImgValidation] = useState(false);
  const [poFinish, setPoFinish] = useState(false);
  const [pofile, setPoFile] = useState([]);

  const [imageName, setImageName] = useState(false);
  const [viewImage, setViewImage] = useState('');
  const [modal, setModal] = useState(false);

  const { addReceiptInfo } = useSelector((state) => state.purchase);
  const poErrorToggle = () => setPoErrorShow(!dcErrorShow);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if (userInfo && userInfo.data) {
      setCompanyId(userInfo.data.company.id);
    }
  }, [userInfo]);

  useEffect(() => {
    if (dcFinish) {
      if (isMemorySizeLarge(dcfile)) {
        dispatch(getUploadImage([...dcfile, ...pofile]));
      } else {
        setDcFile([]);
        setDcImgSize(true);
        setDcErrorShow(true);
      }
    }
  }, [dcFinish, dcDocumentReady]);

  useEffect(() => {
    if (poFinish) {
      if (isMemorySizeLarge(pofile)) {
        dispatch(getUploadImage([...dcfile, ...pofile]));
      } else {
        setPoFile([]);
        setPoImgSize(true);
        setPoErrorShow(true);
      }
    }
  }, [poFinish, poDocumentReady]);

  const dcHandleFiles = (files) => {
    setDcImgValidation(false);
    setDcImgSize(false);
    if (files !== undefined) {
      if (isMemorySizeLarge(files.fileList)) {
        setDcFile(mergeArray(files.base64, files.fileList, companyId, appModels.STOCK, 'DC#'));
        setDcFinish(true);
        setDcDocumentReady(Math.random());
      }
    }
  };

  const poHandleFiles = (files) => {
    setPoImgValidation(false);
    setPoImgSize(false);
    if (files !== undefined) {
      if (isMemorySizeLarge(files.fileList)) {
        setPoFile(mergeArray(files.base64, files.fileList, companyId, appModels.STOCK, 'PO#'));
        setPoFinish(true);
        setPoDocumentReady(Math.random());
      }
    }
  };

  const onDcRemovePhoto = () => {
    dispatch(getUploadImage(pofile));
    setDcFile([]);
  };

  const onPoRemovePhoto = () => {
    dispatch(getUploadImage(dcfile));
    setPoFile([]);
  };

  useEffect(() => {
    setViewImage('');
    setImageName('');
    setDcFile([]);
    setPoFile([]);
  }, [addReceiptInfo]);

  const component = (fileArray, onRemovePhoto) => (
    <>
      {fileArray && fileArray.length && fileArray.length > 0 ? (
        <>
          {fileArray.map((fl, index) => (
            <Col sm="4" md="4" lg="4" xs="4" className="position-relative mb-3" key={fl.name}>
              {(getFileExtension(fl.datas_fname) === 'png' || getFileExtension(fl.datas_fname) === 'svg' || getFileExtension(fl.datas_fname) === 'jpeg' || getFileExtension(fl.datas_fname) === 'jpg') && (
              <>
                <Image
                  width={100}
                  height={100}
                  preview={false}
                  className="cursor-pointer"
                  onClick={() => { setImageName(fl.name); setViewImage(fl.database64); toggle(); }}
                  src={fl.database64}
                />
                <div className="position-absolute topright-img-close1">
                  <img
                    aria-hidden="true"
                    src={closeCircleIcon}
                    className="cursor-pointer"
                    onClick={() => {
                      onRemovePhoto();
                    }}
                    alt="remove"
                  />
                </div>
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
            </Col>
          ))}
        </>
      )
        : (<span />)}
    </>
  );

  const Upload = ({ handleFiles, elementId }) => (
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
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ReactFileReader
            handleFiles={handleFiles}
            elementId={elementId}
            fileTypes={['.csv', '.png', '.jpg', '.jpeg', '.svg', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pdf']}
            multipleFiles
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
        </Box>
      </Box>
    </Box>
  );
  return (
    <>
      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          gap: '35px',
        }}
      >
        <Box
          sx={{
            marginTop: '20px',
            width: '50%',
          }}
        >
          <FormGroup>
            <Typography
              sx={{
                font: 'normal normal normal 16px Suisse Intl',
                letterSpacing: '0.63px',
                color: '#000000',
                marginBottom: '10px',
              }}
            >
              DC# Attachment
            </Typography>
            {dcfile && dcfile.length === 0 ? (
              <Upload handleFiles={dcHandleFiles} elementId="dcFileUploads" />
            ) : ''}
          </FormGroup>
          <div className="text-right mt-1 text-line-height-2">
            {dcImgValidation
              ? (
                <Toast isOpen={dcErrorShow} className="mt-2">
                  <ToastHeader icon="danger" toggle={dcErrorToggle}>FAILED</ToastHeader>
                  <ToastBody className="text-left">
                    Upload image only
                  </ToastBody>
                </Toast>
              ) : ''}
            {dcImgSize
              ? (
                <Toast isOpen={dcErrorShow} className="mt-2">
                  <ToastHeader icon="danger" toggle={dcErrorToggle}>FAILED</ToastHeader>
                  <ToastBody className="text-left">
                    Upload files less than 20 MB
                  </ToastBody>
                </Toast>
              ) : ''}
            <br />
          </div>
          {dcfile && dcfile.length ? component(dcfile, onDcRemovePhoto) : ''}
        </Box>
        <Box
          sx={{
            marginTop: '20px',
            width: '50%',
          }}
        >
          <FormGroup>
            <Typography
              sx={{
                font: 'normal normal normal 16px Suisse Intl',
                letterSpacing: '0.63px',
                color: '#000000',
                marginBottom: '10px',
              }}
            >
              PO# Attachment
            </Typography>
            {pofile && pofile.length === 0 ? (
              <Upload handleFiles={poHandleFiles} elementId="poFileUploads" />
            ) : ''}
          </FormGroup>
          <div className="text-right mt-1 text-line-height-2 ">
            {poImgValidation
              ? (
                <Toast isOpen={poErrorShow} className="mt-2">
                  <ToastHeader icon="danger" toggle={poErrorToggle}>FAILED</ToastHeader>
                  <ToastBody className="text-left">
                    Upload image only
                  </ToastBody>
                </Toast>
              ) : ''}
            {poImgSize
              ? (
                <Toast isOpen={poErrorShow} className="mt-2">
                  <ToastHeader icon="danger" toggle={poErrorToggle}>FAILED</ToastHeader>
                  <ToastBody className="text-left">
                    Upload files less than 20 MB
                  </ToastBody>
                </Toast>
              ) : ''}
            <br />
          </div>
          {pofile && pofile.length ? component(pofile, onPoRemovePhoto) : ''}
        </Box>
      </Box>
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
    </>
  );
};

export default Attachment;
