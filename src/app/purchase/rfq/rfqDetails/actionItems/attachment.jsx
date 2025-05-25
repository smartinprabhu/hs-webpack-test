/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Toast,
  ToastBody,
  ToastHeader,
} from 'reactstrap';
import ReactFileReader from 'react-file-reader';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import {
  getUploadImage,
} from '../../../../helpdesk/ticketService';
import { mergeArray, isMemorySizeLarge } from '../../../../util/appUtils';

const appModels = require('../../../../util/appModels').default;

const Attachment = () => {
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
    uploadPhoto,
  } = useSelector((state) => state.ticket);

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
        setimgSize(true);
        setErrorShow(true);
      }
    }
  }, [finish, documentReady]);

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    if (files !== undefined) {
      setFilesList([...filesList, ...mergeArray(files.base64, files.fileList, companyId, appModels.PURCHASEORDER)]);
      setModalAlert(true);
    }
  };

  const onRemovePhoto = (id) => {
    setFilesList(filesList.filter((item, index) => index !== id));
    dispatch(getUploadImage(filesList.filter((item, index) => index !== id)));
  };

  return (
    <>
      <ReactFileReader handleFiles={handleFiles} multipleFiles elementId="fileUploads" base64>
        <>
          <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
          <span className="text-lightblue font-tiny cursor-pointer"> Attachment</span>
        </>
      </ReactFileReader>
      {imgValidation
        ? (
          <Toast isOpen={errorShow} className="mt-2">
            <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
            <ToastBody className="text-left">
              Upload image only
            </ToastBody>
          </Toast>
        ) : ''}
      {imgSize
        ? (
          <Toast isOpen={errorShow} className="mt-2">
            <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
            <ToastBody className="text-left">
              Upload files less than 20 MB
            </ToastBody>
          </Toast>
        ) : ''}
      <Row className="">
        {uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0 && uploadPhoto.map((fl, index) => (
          <Col sm="4" md="4" lg="4" xs="4" className="position-relative mb-3" key={fl.photoname}>
            <img
              src={fl.database64}
              alt="view document"
              aria-hidden="true"
              height="100"
              width="100"
              onClick={() => { setViewImage(fl.database64); setImageName(fl.photoname); toggle(); }}
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
          </Col>
        ))}
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
          <Button color="primary" onClick={() => { setFinish(true); setDocumentReady(Math.random()); setModalAlert(false); }}>Ok</Button>
          {' '}
          <Button  variant="contained" onClick={() => { document.getElementById('fileUploads').value = null; setFinish(false); setModalAlert(false); }}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Attachment;
