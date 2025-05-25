/* eslint-disable radix */
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
  Alert,
} from 'reactstrap';
import Button from '@mui/material/Button';
import ReactFileReader from 'react-file-reader';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import fileMiniIcon from '@images/icons/fileMini.svg';

import {
  getUploadServiceImageInfo,
} from '../../breakdownService';
import {
  mergeArray, isMemorySizeLargeNew, getFileExtension, isArrayValueExistsData,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const ServiceImages = () => {
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
    addTicketInfo,
  } = useSelector((state) => state.ticket);
  const {
    uploadPhotoService, attachmentCategoryInfo,
  } = useSelector((state) => state.breakdowntracker);

  const filesLimit = 3;

  useEffect(() => {
    if (userInfo && userInfo.data) {
      setCompanyId(userInfo.data.company.id);
    }
  }, [userInfo]);

  useEffect(() => {
    if (finish) {
      if (isMemorySizeLargeNew(filesList)) {
        dispatch(getUploadServiceImageInfo(filesList));
      } else {
        setFilesList([]);
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

  const irCategoryList = attachmentCategoryInfo && attachmentCategoryInfo.data && attachmentCategoryInfo.data.length ? attachmentCategoryInfo.data : false;

  const irCategory = irCategoryList && (isArrayValueExistsData(irCategoryList, 'name', 'Service Report'));

  const handleFilesService = (files) => {
    setimgValidation(false);
    setimgSize(false);
    const filesLength = files && files.fileList && files.fileList.length ? files.fileList.length : 0;
    const filesListLength = filesList && filesList.length ? filesList.length : 0;
    const totalLength = filesListLength + filesLength;
    if (files !== undefined && totalLength <= filesLimit) {
      setFilesList([...filesList, ...mergeArray(files.base64, files.fileList, companyId, appModels.BREAKDOWNTRACKER, false, irCategory)]);
      // setModalAlert(true);
      setFinish(true); setDocumentReady(Math.random());
    } else {
      setModalAlert(true);
    }
  };

  const onRemovePhoto = (id) => {
    setFilesList(filesList.filter((item, index) => index !== id));
    dispatch(getUploadServiceImageInfo(filesList.filter((item, index) => index !== id)));
  };

  return (
    <>
      <Row className="mb-2">
        <Col md="12" lg="12">
          <Label for="upload_images" className="page-actions-header">
            Service Report
            {' '}
            <span className="ml-1 text-danger">*</span>
          </Label>
          <span className="float-right">
            {((!uploadPhotoService.length) || (uploadPhotoService && parseInt(uploadPhotoService.length) < parseInt(filesLimit))) && (
            <ReactFileReader
              handleFiles={handleFilesService}
              multipleFiles
              elementId="fileUploadsService"
              fileTypes={['.csv', '.png', '.jpg', '.jpeg', '.svg', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pdf']}
              base64
            >
              <div className="cursor-pointer text-right">
                <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                <span className="text-lightblue font-tiny cursor-pointer">Upload</span>
                <p className="font-weight-500 mb-0 mt-2">
                  (Upload files less than 10 MB)
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
        </Col>
        <Col md="12" lg="12" xs="12">
          <div className="mt-1">

            {imgValidation
              ? (
                <Alert color="danger" isOpen={errorShow} toggle={errorToggle}>
                  Upload image only
                </Alert>
              ) : ''}
            {imgSize
              ? (
                <Alert color="danger" isOpen={errorShow} toggle={errorToggle}>
                  Upload files less than 10 MB
                </Alert>
              ) : ''}
            <br />
          </div>
        </Col>
      </Row>
      <Row className="mb-5">
        {uploadPhotoService && uploadPhotoService.length && uploadPhotoService.length > 0 ? (
          <>
            {uploadPhotoService.map((fl, index) => (
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
                    <p className="m-0 text-break">{fl.datas_fname}</p>
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
          You have crossed the image upload limit
          {' : '}
          {filesLimit}
        </ModalBody>
        <ModalFooter>
          <Button color="primary"  variant="contained" onClick={() => { setFinish(true); setDocumentReady(Math.random()); setModalAlert(false); }}>Ok</Button>
          {' '}
          {/* <Button  variant="contained" onClick={() => { document.getElementById('fileUploads').value = null; setFinish(false); setModalAlert(false); }}>Cancel</Button> */}
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ServiceImages;
