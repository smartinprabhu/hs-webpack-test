/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Col,
  Modal,
  Label,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import ReactFileReader from 'react-file-reader';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import fileMiniIcon from '@images/icons/fileMini.svg';

import {
  getUploadImage,
} from '../../../helpdesk/ticketService';
import { mergeArray, isMemorySizeLarge, getFileExtension } from '../../../util/appUtils';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

const appModels = require('../../../util/appModels').default;

const Images = () => {
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
    uploadPhoto, addTicketInfo,
  } = useSelector((state) => state.ticket);

  const filesLimit = 3;

  useEffect(() => {
    if (userInfo && userInfo.data) {
      setCompanyId(userInfo.data.company.id);
    }
  }, [userInfo]);

  useEffect(() => {
    if (finish) {
      if (isMemorySizeLarge(filesList)) {
        dispatch(getUploadImage(filesList));
      } else {
        // setFilesList([filesList.splice(filesList.length - 1, 1)]);
        setimgSize(true);
        setErrorShow(true);
      }
    }
  }, [finish, documentReady]);

  useEffect(() => {
    if (addTicketInfo && addTicketInfo.data) {
      setViewImage('');
      setImageName('');
    }
  }, [addTicketInfo]);

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    const appendFileList = [...filesList, ...mergeArray(files.base64, files.fileList, companyId, appModels.BREAKDOWNTRACKER)];
    if (files !== undefined && filesList.length <= filesLimit && isMemorySizeLarge(appendFileList)) {
      setFilesList(appendFileList);
      // setModalAlert(true);
      setFinish(true); setDocumentReady(Math.random());
    } else if (!isMemorySizeLarge(appendFileList)) {
      setimgSize(true);
      setErrorShow(true);
    }
  };

  const onRemovePhoto = (id) => {
    setFilesList(filesList.filter((item, index) => index !== id));
    dispatch(getUploadImage(filesList.filter((item, index) => index !== id)));
  };

  return (
    <>
      <Row className="mb-2">
        <Col md="12" lg="12">
          <Label for="upload_images" className="page-actions-header">
            Others
          </Label>
          <span className="float-right">
            {filesList.length < filesLimit && (
              <ReactFileReader
                handleFiles={handleFiles}
                multipleFiles
                elementId="fileUploads"
                fileTypes={['.csv', '.png', '.jpg', '.jpeg', '.svg', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pdf']}
                base64
              >
                <div className="cursor-pointer text-right">
                  <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                  <span className="text-lightblue font-tiny cursor-pointer">Upload</span>
                  <p className="font-weight-500 mb-0 mt-2">
                    (Upload files less than 20 MB)
                  </p>
                  <p className="font-weight-500 m-0">
                    (Number of attachments maximum upload :
                    {' '}
                    {filesLimit}
                    )
                  </p>
                </div>
              </ReactFileReader>
            )}
          </span>
          <div className="text-right mt-1 text-line-height-2">

            {imgValidation
              ? (

                <Stack spacing={2} sx={{ width: '100%' }}>
                  <Snackbar open={errorShow} autoHideDuration={5000} onClose={errorToggle}>
                    <Alert onClose={errorToggle} severity="error" sx={{ width: '100%' }}>
                      Upload image only
                    </Alert>
                  </Snackbar>
                </Stack>
              ) : ''}
            {imgSize
              ? (
                <Stack spacing={2} sx={{ width: '100%' }}>
                  <Snackbar open={errorShow} autoHideDuration={5000} onClose={errorToggle}>
                    <Alert onClose={errorToggle} severity="error" sx={{ width: '100%' }}>
                      Upload files less than 20 MB
                    </Alert>
                  </Snackbar>
                </Stack>
              ) : ''}
            <br />
          </div>
        </Col>
      </Row>
      <Row className="mb-5">
        {uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0 ? (
          <>
            {uploadPhoto.map((fl, index) => (
              <Col sm="4" md="4" lg="4" xs="4" className="position-relative mb-3" key={fl.name}>
                {(getFileExtension(fl.datas_fname) === 'png' || getFileExtension(fl.datas_fname) === 'svg' || getFileExtension(fl.datas_fname) === 'jpeg' || getFileExtension(fl.datas_fname) === 'jpg') && (
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
                    <p className="m-0" style={{ wordBreak: 'break-word' }}>{fl.datas_fname}</p>
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
      </Row>
      <Modal isOpen={modal} size="lg">
        <ModalHeader toggle={toggle}>{imageName}</ModalHeader>
        <ModalBody>
          <img src={viewImage} alt="view document" width="100%" />
        </ModalBody>
      </Modal>
      <Modal isOpen={modalAlert} toggle={toggleAlert} size="sm">
        <ModalHeader toggle={toggleAlert}>Alert</ModalHeader>
        <ModalBody>
          Are you sure, you want to upload this document ?
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="contained" onClick={() => { setFinish(true); setDocumentReady(Math.random()); setModalAlert(false); }}>Ok</Button>
          {' '}
          <Button  variant="contained" onClick={() => { document.getElementById('fileUploads').value = null; setFinish(false); setModalAlert(false); }}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Images;
